#!/usr/bin/env tsx
/**
 * Daily Briefing Generator
 *
 * Generates two daily intelligence-style briefings:
 * 1. Ukraine/Russia conflict
 * 2. Iran/Middle East conflict
 *
 * Plus cluster-level summaries for each story.
 *
 * Uses Anthropic API with ONLY legally available feed data
 * (headlines + excerpts). Never invents facts.
 */

import { readFileSync, writeFileSync, existsSync } from 'fs';
import { resolve } from 'path';

const DATA_DIR = resolve(process.cwd(), 'public/data');
const ARTICLES_PATH = resolve(DATA_DIR, 'articles.json');
const CLUSTERS_PATH = resolve(DATA_DIR, 'clusters.json');
const BRIEFING_PATH = resolve(DATA_DIR, 'briefing.json');
const HISTORY_PATH = resolve(DATA_DIR, 'briefing-history.json');

const API_KEY = process.env.ANTHROPIC_API_KEY;

interface Article {
  id: string;
  sourceKey: string;
  sourceName: string;
  title: string;
  originalUrl: string;
  publishedAt: string;
  excerpt: string;
  topicTags: string[];
  summaryDa?: string;
  [key: string]: unknown;
}

interface StoryCluster {
  id: string;
  slug: string;
  title: string;
  summary: string;
  articleIds: string[];
  sourceKeys: string[];
  coverageCount: number;
  divergenceScore: number;
  divergenceLevel: string;
  divergenceLabel: string;
  topicTags: string[];
  updatedAt: string;
  clusterAnalysisDa?: string;
}

interface Briefing {
  date: string;
  generatedAt: string;
  ukraineRussia: {
    headline: string;
    narrative: string;
    keyDivergences: string;
    sourcesUsed: string[];
    clusterIds: string[];
  };
  iranMiddleEast: {
    headline: string;
    narrative: string;
    keyDivergences: string;
    sourcesUsed: string[];
    clusterIds: string[];
  };
  globalImpact: {
    headline: string;
    narrative: string;
    sourcesUsed: string[];
  };
  methodology: string;
}

const SOURCE_LENS: Record<string, string> = {
  reuters: 'Reuters (wire/faktabaseline)',
  ap: 'AP (wire/faktabaseline)',
  bbc: 'BBC (britisk kontekst)',
  aljazeera: 'Al Jazeera (ikke-vestligt modperspektiv)',
  kyivindependent: 'Kyiv Independent (ukrainsk frontlinje)',
  scmp: 'SCMP (Kina-perspektiv)',
  tass: 'TASS (russisk statsperspektiv)',
  wion: 'WION (indisk/Global South)',
};

async function callClaude(prompt: string, maxTokens: number = 1500): Promise<string | null> {
  if (!API_KEY) return null;

  try {
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: maxTokens,
        messages: [{ role: 'user', content: prompt }],
      }),
    });

    if (!res.ok) {
      console.error(`  API error: ${res.status}`);
      return null;
    }

    const data = await res.json();
    return data.content?.[0]?.text?.trim() || null;
  } catch (err) {
    console.error('  API call failed:', err);
    return null;
  }
}

function buildArticleSummaryBlock(articles: Article[], topic: string): string {
  const relevant = articles.filter((a) =>
    a.topicTags.some((t) => topic.split(',').some((k) => t.includes(k.trim())))
  );

  // Group by source, take most recent per source
  const bySource = new Map<string, Article[]>();
  for (const a of relevant) {
    if (!bySource.has(a.sourceKey)) bySource.set(a.sourceKey, []);
    bySource.get(a.sourceKey)!.push(a);
  }

  const lines: string[] = [];
  for (const [sourceKey, arts] of bySource) {
    const sorted = arts.sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
    const top = sorted.slice(0, 3);
    const lens = SOURCE_LENS[sourceKey] || sourceKey;
    lines.push(`\n[${lens}]`);
    for (const a of top) {
      lines.push(`- "${a.title}" (${a.publishedAt.slice(0, 10)})`);
      if (a.excerpt) lines.push(`  Uddrag: ${a.excerpt.slice(0, 200)}`);
    }
  }

  return lines.join('\n');
}

async function generateConflictBriefing(
  articles: Article[],
  clusters: StoryCluster[],
  conflictName: string,
  topicFilter: string,
  detailPrompt: string
): Promise<{ headline: string; narrative: string; keyDivergences: string; sourcesUsed: string[]; clusterIds: string[] } | null> {

  const relevantClusters = clusters.filter((c) =>
    c.topicTags.some((t) => topicFilter.split(',').some((k) => t.includes(k.trim())))
  );
  const relevantArticles = articles.filter((a) =>
    a.topicTags.some((t) => topicFilter.split(',').some((k) => t.includes(k.trim())))
  );

  if (relevantArticles.length < 3) {
    return null;
  }

  const dataBlock = buildArticleSummaryBlock(articles, topicFilter);
  const sourcesUsed = [...new Set(relevantArticles.map((a) => a.sourceKey))];

  const prompt = `Du er en seriøs dansk sikkerhedspolitisk analytiker. Skriv en daglig briefing om ${conflictName} baseret UDELUKKENDE på nedenstående overskrifter og uddrag fra internationale nyhedskilder.

KRAV:
- Skriv på dansk i en professionel, analytisk tone — som et intelligence brief
- Strukturér narrativet kronologisk med tydelig faktuel kerne
- Markér TYDELIGT hvor kilderne er enige (konsensus) og hvor de divergerer (uenighed)
- Brug formuleringer som "Ifølge Reuters...", "BBC rapporterer at...", "TASS hævder derimod at..."
- Nævn aldrig information der ikke fremgår af overskrifter/uddrag
- Afslut med 1-2 sætninger om hvad der er vigtigst at holde øje med
- ${detailPrompt}

KILDEDATA:
${dataBlock}

FORMAT:
Besvar med tre sektioner adskilt af ---:
1. OVERSKRIFT (én linje, max 80 tegn, dansk)
2. NARRATIV (300-500 ord, sammenhængende dansk tekst med kildehenvisninger)
3. DIVERGENSER (2-4 punkter om hvor kilderne er mest uenige)

Skriv KUN de tre sektioner, ingen anden tekst.`;

  const result = await callClaude(prompt, 2000);
  if (!result) return null;

  const parts = result.split('---').map((s) => s.trim());
  const headline = parts[0] || conflictName;
  const narrative = parts[1] || '';
  const keyDivergences = parts[2] || '';

  return {
    headline,
    narrative,
    keyDivergences,
    sourcesUsed,
    clusterIds: relevantClusters.map((c) => c.id),
  };
}

async function generateClusterAnalyses(articles: Article[], clusters: StoryCluster[]): Promise<number> {
  const articleMap = new Map(articles.map((a) => [a.id, a]));
  let generated = 0;
  const MAX_CLUSTER_ANALYSES = 20;

  const toAnalyze = clusters
    .filter((c) => !c.clusterAnalysisDa && c.coverageCount >= 2)
    .sort((a, b) => b.coverageCount - a.coverageCount)
    .slice(0, MAX_CLUSTER_ANALYSES);

  for (const cluster of toAnalyze) {
    const members = cluster.articleIds
      .map((id) => articleMap.get(id))
      .filter((a): a is Article => !!a);

    if (members.length < 2) continue;

    const sourceLines = members.map((a) => {
      const lens = SOURCE_LENS[a.sourceKey] || a.sourceKey;
      return `[${lens}] "${a.title}"\n  Uddrag: ${(a.excerpt || '').slice(0, 200)}`;
    }).join('\n\n');

    const prompt = `Du er en dansk medieanalytiker. Baseret udelukkende på nedenstående overskrifter og uddrag, skriv en kort analyse (3-5 sætninger) på dansk der:
- Beskriver hvad historien handler om
- Forklarer hvordan de forskellige kilder vinkler den forskelligt
- Fremhæver den vigtigste divergens

Artikler i dette cluster:
${sourceLines}

Svar KUN med analysen, ingen forklaring.`;

    const analysis = await callClaude(prompt, 500);
    if (analysis) {
      cluster.clusterAnalysisDa = analysis;
      generated++;
      console.log(`  ✓ Cluster: ${cluster.title.slice(0, 50)}...`);
    }

    await new Promise((r) => setTimeout(r, 500));
  }

  return generated;
}

async function main() {
  console.log('═══════════════════════════════════════════');
  console.log('  Signal over Støj — Daily Briefing Generator');
  console.log('═══════════════════════════════════════════');

  if (!API_KEY) {
    console.log('  ⚠ ANTHROPIC_API_KEY not set. Skipping.');
    return;
  }

  const articles: Article[] = JSON.parse(readFileSync(ARTICLES_PATH, 'utf-8'));
  const clusters: StoryCluster[] = JSON.parse(readFileSync(CLUSTERS_PATH, 'utf-8'));

  console.log(`  Articles: ${articles.length}, Clusters: ${clusters.length}`);
  console.log('');

  // 1. Generate cluster-level analyses
  console.log('  ── Generating cluster analyses ──');
  const clusterCount = await generateClusterAnalyses(articles, clusters);
  console.log(`  Cluster analyses generated: ${clusterCount}`);
  writeFileSync(CLUSTERS_PATH, JSON.stringify(clusters, null, 2));

  // 2. Generate Ukraine/Russia briefing
  console.log('');
  console.log('  ── Generating Ukraine/Russia briefing ──');
  const ukraineBriefing = await generateConflictBriefing(
    articles, clusters,
    'krigen i Ukraine',
    'ukraine-russia,conflict,defense,russia',
    'Fokusér på frontlinjesituation, vestlig støtte, diplomatiske initiativer og russisk narrativ.'
  );
  if (ukraineBriefing) {
    console.log(`  ✓ Ukraine briefing: ${ukraineBriefing.headline.slice(0, 60)}...`);
  }

  // 3. Generate Iran/Middle East briefing
  console.log('');
  console.log('  ── Generating Iran/Middle East briefing ──');
  const iranBriefing = await generateConflictBriefing(
    articles, clusters,
    'konflikten omkring Iran og Mellemøsten',
    'iran,middle-east,nuclear,israel',
    'Fokusér på Irans atomprogram, regionale spændinger, Israel-Iran dynamik og global påvirkning.'
  );
  if (iranBriefing) {
    console.log(`  ✓ Iran briefing: ${iranBriefing.headline.slice(0, 60)}...`);
  }

  // 4. Generate global impact section
  console.log('');
  console.log('  ── Generating global impact briefing ──');
  const globalDataBlock = buildArticleSummaryBlock(articles, 'sanctions,energy,trade,geopolitics');
  const globalResult = await callClaude(`Du er en dansk geopolitisk analytiker. Skriv en kort sektion (150-250 ord) på dansk om den globale påvirkning af konflikterne i Ukraine og Mellemøsten, baseret udelukkende på disse kildedata:

${globalDataBlock}

Fokusér på: energimarkeder, sanktioner, handelsruter, alliancer, og hvordan konflikterne påvirker resten af verden. Brug kildehenvisninger. Skriv KUN analysen.`, 1000);

  // 5. Build briefing object
  const today = new Date().toISOString().slice(0, 10);

  const briefing: Briefing = {
    date: today,
    generatedAt: new Date().toISOString(),
    ukraineRussia: ukraineBriefing || {
      headline: 'Ukraine-Rusland: Ingen tilstrækkelig data',
      narrative: 'Ikke nok kildedata til at generere briefing.',
      keyDivergences: '',
      sourcesUsed: [],
      clusterIds: [],
    },
    iranMiddleEast: iranBriefing || {
      headline: 'Iran/Mellemøsten: Ingen tilstrækkelig data',
      narrative: 'Ikke nok kildedata til at generere briefing.',
      keyDivergences: '',
      sourcesUsed: [],
      clusterIds: [],
    },
    globalImpact: {
      headline: 'Global påvirkning',
      narrative: globalResult || 'Ikke nok data til analyse.',
      sourcesUsed: [...new Set(articles.filter((a) =>
        a.topicTags.some((t) => ['sanctions', 'energy', 'trade', 'geopolitics'].includes(t))
      ).map((a) => a.sourceKey))],
    },
    methodology: 'Denne briefing er automatisk genereret baseret udelukkende på overskrifter og uddrag fra offentlige RSS-feeds. Ingen fuld artikeltekst er brugt. Kildehenvisninger er indsat for transparens. AI-analysen kan indeholde fejl — brug altid original journalistik som primær kilde.',
  };

  writeFileSync(BRIEFING_PATH, JSON.stringify(briefing, null, 2));

  // Save to history (keep last 30 days)
  let history: Briefing[] = [];
  try {
    if (existsSync(HISTORY_PATH)) {
      history = JSON.parse(readFileSync(HISTORY_PATH, 'utf-8'));
    }
  } catch {}

  // Replace today's entry if exists, otherwise prepend
  const existingIdx = history.findIndex((b) => b.date === briefing.date);
  if (existingIdx >= 0) {
    history[existingIdx] = briefing;
  } else {
    history.unshift(briefing);
  }
  history = history.slice(0, 30);
  writeFileSync(HISTORY_PATH, JSON.stringify(history, null, 2));

  console.log('');
  console.log('  Daily briefing generated.');
  console.log('═══════════════════════════════════════════');
}

main().catch((err) => {
  console.error('Briefing generation failed:', err);
  process.exit(1);
});
