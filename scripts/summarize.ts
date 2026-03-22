#!/usr/bin/env tsx
/**
 * Danish Summary Generator — Enhanced
 *
 * Generates substantive Danish briefs for each article:
 * - What the article covers (indhold)
 * - Key message/angle (budskab)
 * - Source perspective note (kildevinkel)
 *
 * Based ONLY on headline + feed excerpt (legally available data).
 * Requires ANTHROPIC_API_KEY environment variable.
 */

import { readFileSync, writeFileSync, existsSync } from 'fs';
import { resolve } from 'path';

const DATA_DIR = resolve(process.cwd(), 'public/data');
const ARTICLES_PATH = resolve(DATA_DIR, 'articles.json');

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
  briefDa?: string;
  [key: string]: unknown;
}

const API_KEY = process.env.ANTHROPIC_API_KEY;

const SOURCE_LENS: Record<string, string> = {
  reuters: 'Wire service / faktabaseline — prioriterer hurtighed og bredde',
  ap: 'Wire service / faktabaseline — stærk på bekræftede facts',
  bbc: 'Britisk public service — typisk god til kontekstualisering, men med vestligt udsyn',
  aljazeera: 'Qatar-baseret — tilbyder ikke-vestligt modperspektiv, særligt stærk på Mellemøsten',
  kyivindependent: 'Ukrainsk frontlinjemedie — unik indsigt, men naturligt præget af national position',
  scmp: 'Hongkong-baseret, ejet af Alibaba — bedste engelsksprogede vindue ind i kinesisk perspektiv',
  tass: 'Russisk statsligt nyhedsbureau — viser Kremls officielle framing, ikke uafhængig journalistik',
  wion: 'Indisk international kanal — repræsenterer Global South / BRICS-perspektiv',
};

async function generateBrief(article: Article): Promise<{ summary: string; brief: string } | null> {
  if (!API_KEY) return null;

  const lens = SOURCE_LENS[article.sourceKey] || 'international nyhedskilde';

  const prompt = `Du er en erfaren dansk sikkerhedspolitisk analytiker. Baseret UDELUKKENDE på nedenstående overskrift og uddrag, skriv et kort artikelbrev på dansk.

KILDE: ${article.sourceName}
KILDEVINKEL: ${lens}
OVERSKRIFT: ${article.title}
UDDRAG: ${article.excerpt || '(intet uddrag tilgængeligt)'}

Skriv præcist dette format (brug disse overskrifter):

OPSUMMERING: Én sætning der beskriver hvad artiklen handler om, på dansk.

INDHOLD: 2-3 sætninger der opsummerer det faktuelle indhold — hvad rapporteres, hvem er involveret, hvad er sket. Baseret kun på overskrift og uddrag.

BUDSKAB: 1-2 sætninger om artiklens primære budskab og vinkel — hvad er den implicitte eller eksplicitte pointe? Hvordan framer denne kilde historien?

KILDENOTE: Én kort sætning om hvad man bør huske om denne kildes perspektiv.

REGLER:
- Skriv KUN baseret på overskrift og uddrag — opfind ALDRIG information
- Brug analytisk, professionel dansk
- Hvis uddraget er tomt/kort, skriv kun det du kan udlede fra overskriften
- Hold det kort og præcist

Svar KUN med de fire sektioner.`;

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
        max_tokens: 500,
        messages: [{ role: 'user', content: prompt }],
      }),
    });

    if (!res.ok) {
      console.error(`  API error ${res.status} for ${article.id}`);
      return null;
    }

    const data = await res.json();
    const text = data.content?.[0]?.text?.trim();
    if (!text) return null;

    // Extract summary line
    const summaryMatch = text.match(/OPSUMMERING:\s*(.+?)(?=\n|INDHOLD:)/s);
    const summary = summaryMatch?.[1]?.trim() || text.split('\n')[0];

    return { summary, brief: text };
  } catch (err) {
    console.error(`  API call failed for ${article.id}:`, err);
    return null;
  }
}

async function main() {
  console.log('═══════════════════════════════════════════');
  console.log('  Signal over Støj — Article Brief Generator');
  console.log('═══════════════════════════════════════════');

  if (!API_KEY) {
    console.log('  ⚠ ANTHROPIC_API_KEY not set. Skipping.');
    return;
  }

  if (!existsSync(ARTICLES_PATH)) {
    console.error('  No articles.json found. Run ingestion first.');
    process.exit(1);
  }

  const articles: Article[] = JSON.parse(readFileSync(ARTICLES_PATH, 'utf-8'));

  // Process articles without briefDa (the new enhanced format)
  const needBrief = articles.filter((a) => !a.briefDa);

  console.log(`  Total articles: ${articles.length}`);
  console.log(`  Need brief: ${needBrief.length}`);

  const MAX_PER_RUN = 30;
  const batch = needBrief.slice(0, MAX_PER_RUN);
  let generated = 0;

  for (const article of batch) {
    const result = await generateBrief(article);
    if (result) {
      article.summaryDa = result.summary;
      article.briefDa = result.brief;
      generated++;
      console.log(`  ✓ ${article.sourceKey}: ${result.summary.slice(0, 60)}...`);
    } else {
      console.log(`  ✗ ${article.id}: No brief generated`);
    }

    await new Promise((r) => setTimeout(r, 500));
  }

  writeFileSync(ARTICLES_PATH, JSON.stringify(articles, null, 2));

  console.log(`\n  Briefs generated: ${generated}/${batch.length}`);
  console.log('  Brief generation complete.');
  console.log('═══════════════════════════════════════════');
}

main().catch((err) => {
  console.error('Brief generation failed:', err);
  process.exit(1);
});
