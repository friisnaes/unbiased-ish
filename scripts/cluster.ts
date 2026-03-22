#!/usr/bin/env tsx
/**
 * Story Clustering Script — Greedy Seed-Based Approach
 *
 * Instead of transitive union-find (which creates mega-clusters),
 * this uses a greedy approach:
 * 1. Pick a seed article
 * 2. Find the best match from each OTHER source
 * 3. Only add if similarity exceeds threshold
 * 4. Mark matched articles as claimed
 *
 * This produces focused, multi-source clusters about specific events.
 */

import { readFileSync, writeFileSync, existsSync } from 'fs';
import { resolve } from 'path';
import crypto from 'crypto';

// ─── Paths ──────────────────────────────────────────────────

const DATA_DIR = resolve(process.cwd(), 'public/data');
const ARTICLES_PATH = resolve(DATA_DIR, 'articles.json');
const CLUSTERS_PATH = resolve(DATA_DIR, 'clusters.json');
const TOPICS_PATH = resolve(DATA_DIR, 'topics.json');
const CONFIG_PATH = resolve(DATA_DIR, 'config.json');

// ─── Types ──────────────────────────────────────────────────

interface Article {
  id: string;
  sourceKey: string;
  sourceName: string;
  title: string;
  originalUrl: string;
  publishedAt: string;
  excerpt: string;
  topicTags: string[];
  language: string;
  region: string;
  imageUrl: string | null;
  linkStatus: string;
  ingestionTimestamp: string;
  clusterCandidateText: string;
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
  divergenceLevel: 'low' | 'moderate' | 'high';
  divergenceLabel: string;
  topicTags: string[];
  updatedAt: string;
}

interface Topic {
  slug: string;
  label: string;
  labelDa: string;
  articleCount: number;
  clusterCount: number;
}

// ─── Tokenization ───────────────────────────────────────────

function tokenize(text: string): Set<string> {
  return new Set(
    text
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, ' ')
      .split(/\s+/)
      .filter((w) => w.length > 2)
  );
}

// ─── Similarity ─────────────────────────────────────────────

function jaccardSimilarity(a: Set<string>, b: Set<string>): number {
  const intersection = new Set([...a].filter((x) => b.has(x)));
  const union = new Set([...a, ...b]);
  if (union.size === 0) return 0;
  return intersection.size / union.size;
}

function timeProximityHours(a: string, b: string): number {
  const diff = Math.abs(new Date(a).getTime() - new Date(b).getTime());
  return diff / (1000 * 60 * 60);
}

// ─── Headline Similarity (Title-Focused) ────────────────────
// Use ONLY title tokens (not excerpt) to avoid broad topic matches

function titleSimilarity(a: Article, b: Article): number {
  const tokA = tokenize(a.title.toLowerCase());
  const tokB = tokenize(b.title.toLowerCase());
  return jaccardSimilarity(tokA, tokB);
}

// ─── Full Similarity Score ──────────────────────────────────

function similarityScore(a: Article, b: Article): number {
  if (a.sourceKey === b.sourceKey) return 0;

  const hours = timeProximityHours(a.publishedAt, b.publishedAt);
  if (hours > 48) return 0;

  // Title similarity is the strongest signal
  const titleSim = titleSimilarity(a, b);

  // Full text (title + excerpt) similarity
  const fullA = tokenize(`${a.title} ${a.excerpt}`.toLowerCase());
  const fullB = tokenize(`${b.title} ${b.excerpt}`.toLowerCase());
  const fullSim = jaccardSimilarity(fullA, fullB);

  // Time bonus
  const timeFactor = Math.max(0, 1 - hours / 48);

  // Weighted: title match matters most
  return titleSim * 0.5 + fullSim * 0.35 + timeFactor * 0.15;
}

// ─── Greedy Seed-Based Clustering ───────────────────────────

function buildClusters(articles: Article[]): Article[][] {
  const claimed = new Set<string>();
  const clusters: Article[][] = [];

  // Sort by recency
  const sorted = [...articles].sort((a, b) =>
    b.publishedAt.localeCompare(a.publishedAt)
  );

  const MATCH_THRESHOLD = 0.15;

  for (const seed of sorted) {
    if (claimed.has(seed.id)) continue;

    // For this seed, find best match from each other source
    const matches: Article[] = [seed];
    const usedSources = new Set([seed.sourceKey]);

    // Gather candidates: unclaimed articles from other sources
    const candidates = sorted.filter(
      (a) => !claimed.has(a.id) && a.sourceKey !== seed.sourceKey
    );

    // Score each candidate against the seed
    const scored = candidates
      .map((c) => ({ article: c, score: similarityScore(seed, c) }))
      .filter((s) => s.score > MATCH_THRESHOLD)
      .sort((a, b) => b.score - a.score);

    // Pick best match per source
    for (const { article } of scored) {
      if (usedSources.has(article.sourceKey)) continue;
      matches.push(article);
      usedSources.add(article.sourceKey);
    }

    // Only keep clusters with 2+ different sources
    if (matches.length >= 2) {
      clusters.push(matches);
      for (const m of matches) {
        claimed.add(m.id);
      }
    }
  }

  return clusters;
}

// ─── Divergence Calculation ─────────────────────────────────

function calculateDivergence(articles: Article[]): {
  score: number;
  level: 'low' | 'moderate' | 'high';
  label: string;
} {
  if (articles.length < 2) {
    return { score: 0, level: 'low', label: 'Kun én kilde — ingen sammenligning mulig.' };
  }

  const tokens = articles.map((a) => tokenize(`${a.title} ${a.excerpt}`));

  // Pairwise dissimilarity
  let totalDissim = 0;
  let pairs = 0;
  for (let i = 0; i < tokens.length; i++) {
    for (let j = i + 1; j < tokens.length; j++) {
      totalDissim += 1 - jaccardSimilarity(tokens[i], tokens[j]);
      pairs++;
    }
  }
  const avgDissim = pairs > 0 ? totalDissim / pairs : 0;

  // Source diversity
  const uniqueSources = new Set(articles.map((a) => a.sourceKey)).size;
  const sourceDiversity = Math.min(1, uniqueSources / 5);

  // Topic spread
  const allTags = articles.flatMap((a) => a.topicTags);
  const uniqueTags = new Set(allTags).size;
  const tagSpread = Math.min(1, uniqueTags / (articles.length * 2));

  const score = Math.min(1, avgDissim * 0.5 + tagSpread * 0.25 + sourceDiversity * 0.25);
  const rounded = Math.round(score * 100) / 100;

  let level: 'low' | 'moderate' | 'high';
  if (rounded < 0.35) level = 'low';
  else if (rounded < 0.6) level = 'moderate';
  else level = 'high';

  let label: string;
  if (level === 'low') {
    label = 'Kilderne er i høj grad enige om fakta og framing.';
  } else if (level === 'moderate') {
    label = `Tydelige forskelle i vinkling mellem ${uniqueSources} kilder. Overskrifterne vægter forskellige aspekter.`;
  } else {
    label = `Markant divergens: ${uniqueSources} kilder framer historien væsentligt forskelligt.`;
  }

  return { score: rounded, level, label };
}

// ─── Danish Title Generation ────────────────────────────────

const DANISH_TOPIC_NAMES: Record<string, string> = {
  'ukraine-russia': 'Ukraine-Rusland', conflict: 'Konflikt', energy: 'Energi',
  diplomacy: 'Diplomati', 'middle-east': 'Mellemøsten', china: 'Kina',
  india: 'Indien', 'north-korea': 'Nordkorea', iran: 'Iran', usa: 'USA',
  geopolitics: 'Geopolitik', eu: 'EU', sanctions: 'Sanktioner',
  russia: 'Rusland', defense: 'Forsvar', 'civilian-impact': 'Civilpåvirkning',
  climate: 'Klima', trade: 'Handel', nuclear: 'Atomvåben', africa: 'Afrika',
  'south-asia': 'Sydasien',
};

const ACTOR_PATTERNS: [RegExp, string][] = [
  [/\bukraine/i, 'Ukraine'], [/\brussia/i, 'Rusland'], [/\bchina/i, 'Kina'],
  [/\bindia/i, 'Indien'], [/\biran/i, 'Iran'], [/\bnorth korea/i, 'Nordkorea'],
  [/\bisrael/i, 'Israel'], [/\bpalestine|gaza/i, 'Gaza'],
  [/\bsyria/i, 'Syrien'], [/\beu\b|european union/i, 'EU'],
  [/\bnato\b/i, 'NATO'], [/\bzelensky/i, 'Zelensky'], [/\bputin/i, 'Putin'],
  [/\btrump/i, 'Trump'], [/\bbiden/i, 'Biden'], [/\bmodi/i, 'Modi'],
  [/\bhouthi/i, 'Houthi'], [/\bhezbollah/i, 'Hezbollah'], [/\bhamas/i, 'Hamas'],
  [/\bturkey|erdogan/i, 'Tyrkiet'],
];

const ACTION_PATTERNS: [RegExp, string][] = [
  [/\bwar\b/i, 'krig'], [/\battack/i, 'angreb'], [/\bdrone/i, 'droneangreb'],
  [/\bpeace\b/i, 'fredsforhandlinger'], [/\btalk/i, 'forhandlinger'],
  [/\bsanction/i, 'sanktioner'], [/\bnuclear/i, 'atomprogram'],
  [/\btrade\b/i, 'handel'], [/\btariff/i, 'told'], [/\belection/i, 'valg'],
  [/\bcrisis/i, 'krise'], [/\brefugee/i, 'flygtningekrise'],
  [/\bmissile/i, 'missilangreb'], [/\bceasefire/i, 'våbenhvile'],
  [/\bsummit/i, 'topmøde'], [/\bprotest/i, 'protester'],
  [/\bescalat/i, 'eskalering'], [/\binvasion/i, 'invasion'],
  [/\boffensive/i, 'offensiv'], [/\bstrike/i, 'angreb'],
  [/\baid\b/i, 'bistand'], [/\bweapon/i, 'våben'],
];

function generateDanishTitle(articles: Article[]): string {
  const allText = articles.map((a) => `${a.title} ${a.excerpt}`).join(' ');

  const actors: string[] = [];
  for (const [re, name] of ACTOR_PATTERNS) {
    if (re.test(allText) && !actors.includes(name)) {
      actors.push(name);
      if (actors.length >= 3) break;
    }
  }

  let action = '';
  for (const [re, da] of ACTION_PATTERNS) {
    if (re.test(allText)) { action = da; break; }
  }

  if (actors.length >= 2 && action) return `${actors[0]} og ${actors[1]}: ${action}`;
  if (actors.length >= 1 && action) return `${actors[0]}: ${action}`;
  if (actors.length >= 2) return `${actors.join(', ')}`;
  if (actors.length === 1) return actors[0];
  return articles[0]?.title || 'Ukendt historie';
}

// ─── Slugify ────────────────────────────────────────────────

function slugify(text: string): string {
  return text.toLowerCase()
    .replace(/[æ]/g, 'ae').replace(/[ø]/g, 'oe').replace(/[å]/g, 'aa')
    .replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '').slice(0, 60);
}

// ─── Topic Labels ───────────────────────────────────────────

const TOPIC_LABELS: Record<string, { en: string; da: string }> = {
  'ukraine-russia': { en: 'Ukraine-Russia', da: 'Ukraine-Rusland' },
  conflict: { en: 'Conflict', da: 'Konflikt' },
  energy: { en: 'Energy', da: 'Energi' },
  diplomacy: { en: 'Diplomacy', da: 'Diplomati' },
  'middle-east': { en: 'Middle East', da: 'Mellemøsten' },
  china: { en: 'China', da: 'Kina' },
  india: { en: 'India', da: 'Indien' },
  'north-korea': { en: 'North Korea', da: 'Nordkorea' },
  iran: { en: 'Iran', da: 'Iran' },
  usa: { en: 'USA', da: 'USA' },
  geopolitics: { en: 'Geopolitics', da: 'Geopolitik' },
  eu: { en: 'EU', da: 'EU' },
  sanctions: { en: 'Sanctions', da: 'Sanktioner' },
  russia: { en: 'Russia', da: 'Rusland' },
  defense: { en: 'Defense', da: 'Forsvar' },
  'civilian-impact': { en: 'Civilian Impact', da: 'Civilpåvirkning' },
  'global-south': { en: 'Global South', da: 'Det Globale Syd' },
  climate: { en: 'Climate', da: 'Klima' },
  trade: { en: 'Trade', da: 'Handel' },
  nuclear: { en: 'Nuclear', da: 'Atomvåben & Nonproliferation' },
  africa: { en: 'Africa', da: 'Afrika' },
  'south-asia': { en: 'South Asia', da: 'Sydasien' },
};

// ─── Main ───────────────────────────────────────────────────

function main() {
  console.log('═══════════════════════════════════════════');
  console.log('  Signal over Støj — Clustering Pipeline');
  console.log('═══════════════════════════════════════════');

  if (!existsSync(ARTICLES_PATH)) {
    console.error('  No articles.json found. Run ingestion first.');
    process.exit(1);
  }

  const articles: Article[] = JSON.parse(readFileSync(ARTICLES_PATH, 'utf-8'));
  console.log(`  Articles loaded: ${articles.length}`);

  // Only cluster recent articles
  const recent = articles.slice(0, 400);
  const rawClusters = buildClusters(recent);

  console.log(`  Raw clusters found: ${rawClusters.length}`);

  // Build StoryCluster objects
  const clusters: StoryCluster[] = rawClusters.map((members) => {
    const sorted = [...members].sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
    const allTags = [...new Set(members.flatMap((a) => a.topicTags))];
    const uniqueSources = [...new Set(members.map((a) => a.sourceKey))];
    const divergence = calculateDivergence(members);

    const id = crypto.createHash('sha256')
      .update(members.map((m) => m.id).sort().join('|'))
      .digest('hex').slice(0, 16);

    const sourceNames: Record<string, string> = {
      reuters: 'Reuters', ap: 'AP', bbc: 'BBC', aljazeera: 'Al Jazeera',
      kyivindependent: 'Kyiv Independent', scmp: 'SCMP', tass: 'TASS', wion: 'WION',
    };
    const sourceList = uniqueSources.map((k) => sourceNames[k] || k).join(', ');

    return {
      id: `cluster-${id}`,
      slug: slugify(sorted[0].title),
      title: generateDanishTitle(members),
      summary: `${uniqueSources.length} kilder dækker denne historie: ${sourceList}. ${divergence.label}`,
      articleIds: members.map((m) => m.id),
      sourceKeys: uniqueSources,
      coverageCount: uniqueSources.length,
      divergenceScore: divergence.score,
      divergenceLevel: divergence.level,
      divergenceLabel: divergence.label,
      topicTags: allTags.slice(0, 6),
      updatedAt: sorted[0].publishedAt,
    };
  });

  // Sort by updatedAt
  clusters.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));

  writeFileSync(CLUSTERS_PATH, JSON.stringify(clusters, null, 2));
  console.log(`  Clusters created: ${clusters.length}`);

  // Build topic index
  const topicArticleCounts = new Map<string, number>();
  const topicClusterCounts = new Map<string, number>();

  for (const a of articles) {
    for (const t of a.topicTags) {
      topicArticleCounts.set(t, (topicArticleCounts.get(t) || 0) + 1);
    }
  }
  for (const c of clusters) {
    for (const t of c.topicTags) {
      topicClusterCounts.set(t, (topicClusterCounts.get(t) || 0) + 1);
    }
  }

  const topics: Topic[] = [...topicArticleCounts.entries()]
    .map(([slug, articleCount]) => ({
      slug,
      label: TOPIC_LABELS[slug]?.en || slug,
      labelDa: TOPIC_LABELS[slug]?.da || slug,
      articleCount,
      clusterCount: topicClusterCounts.get(slug) || 0,
    }))
    .sort((a, b) => b.articleCount - a.articleCount);

  writeFileSync(TOPICS_PATH, JSON.stringify(topics, null, 2));
  console.log(`  Topics indexed: ${topics.length}`);

  // Update config
  if (existsSync(CONFIG_PATH)) {
    const config = JSON.parse(readFileSync(CONFIG_PATH, 'utf-8'));
    config.totalClusters = clusters.length;
    config.totalArticles = articles.length;
    writeFileSync(CONFIG_PATH, JSON.stringify(config, null, 2));
  }

  console.log('');
  console.log('  Clustering complete.');
  console.log('═══════════════════════════════════════════');
}

main();
