#!/usr/bin/env tsx
/**
 * Story Clustering Script
 *
 * Groups articles into story clusters based on:
 * - Normalized headline similarity (token overlap)
 * - Time proximity
 * - Topic tag overlap
 *
 * No AI magic — straightforward, understandable heuristics.
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

function topicOverlap(a: string[], b: string[]): number {
  const setA = new Set(a);
  const setB = new Set(b);
  const intersection = [...setA].filter((x) => setB.has(x));
  const union = new Set([...a, ...b]);
  if (union.size === 0) return 0;
  return intersection.length / union.size;
}

function timeProximityHours(a: string, b: string): number {
  const diff = Math.abs(new Date(a).getTime() - new Date(b).getTime());
  return diff / (1000 * 60 * 60);
}

// ─── Cluster Scoring ────────────────────────────────────────

function shouldCluster(a: Article, b: Article): boolean {
  // Same source = never cluster (we want cross-source clusters)
  if (a.sourceKey === b.sourceKey) return false;

  const textSim = jaccardSimilarity(
    tokenize(a.clusterCandidateText),
    tokenize(b.clusterCandidateText)
  );
  const topicSim = topicOverlap(a.topicTags, b.topicTags);
  const hoursDiff = timeProximityHours(a.publishedAt, b.publishedAt);

  // Time gate: articles more than 48 hours apart are unlikely same story
  if (hoursDiff > 48) return false;

  // Combined score
  const timeFactor = Math.max(0, 1 - hoursDiff / 48);
  const score = textSim * 0.5 + topicSim * 0.3 + timeFactor * 0.2;

  return score > 0.25;
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

  const tokens = articles.map((a) => tokenize(a.clusterCandidateText));

  // 1. Average pairwise headline dissimilarity
  let totalDissim = 0;
  let pairs = 0;
  for (let i = 0; i < tokens.length; i++) {
    for (let j = i + 1; j < tokens.length; j++) {
      totalDissim += 1 - jaccardSimilarity(tokens[i], tokens[j]);
      pairs++;
    }
  }
  const avgDissim = pairs > 0 ? totalDissim / pairs : 0;

  // 2. Topic emphasis spread
  const allTags = articles.flatMap((a) => a.topicTags);
  const tagCounts = new Map<string, number>();
  for (const t of allTags) {
    tagCounts.set(t, (tagCounts.get(t) || 0) + 1);
  }
  const uniqueTags = tagCounts.size;
  const tagSpread = Math.min(1, uniqueTags / (articles.length * 2));

  // 3. Source diversity
  const uniqueSources = new Set(articles.map((a) => a.sourceKey)).size;
  const sourceDiversity = Math.min(1, uniqueSources / 5);

  // Combined score
  const score = Math.min(1, avgDissim * 0.5 + tagSpread * 0.25 + sourceDiversity * 0.25);

  let level: 'low' | 'moderate' | 'high';
  if (score < 0.35) level = 'low';
  else if (score < 0.6) level = 'moderate';
  else level = 'high';

  // Generate label
  let label: string;
  if (level === 'low') {
    label = 'Kilderne er i høj grad enige om fakta og framing.';
  } else if (level === 'moderate') {
    label = `Tydelige forskelle i vinkling mellem ${uniqueSources} kilder. Overskrifterne vægter forskellige aspekter.`;
  } else {
    label = `Markant divergens: ${uniqueSources} kilder framer historien væsentligt forskelligt. Ordvalg, fokus og kontekst varierer.`;
  }

  return { score: Math.round(score * 100) / 100, level, label };
}

// ─── Slugify ────────────────────────────────────────────────

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[æ]/g, 'ae')
    .replace(/[ø]/g, 'oe')
    .replace(/[å]/g, 'aa')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
    .slice(0, 60);
}

// ─── Topic Label Map ────────────────────────────────────────

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

// ─── Danish Title Generation ────────────────────────────────

const DANISH_TOPIC_NAMES: Record<string, string> = {
  'ukraine-russia': 'Ukraine-Rusland',
  conflict: 'Konflikt',
  energy: 'Energi',
  diplomacy: 'Diplomati',
  'middle-east': 'Mellemøsten',
  china: 'Kina',
  india: 'Indien',
  'north-korea': 'Nordkorea',
  iran: 'Iran',
  usa: 'USA',
  geopolitics: 'Geopolitik',
  eu: 'EU',
  sanctions: 'Sanktioner',
  russia: 'Rusland',
  defense: 'Forsvar',
  'civilian-impact': 'Civilpåvirkning',
  climate: 'Klima',
  trade: 'Handel',
  nuclear: 'Atomvåben',
  africa: 'Afrika',
  'south-asia': 'Sydasien',
};

const KEYWORD_DANISH: [RegExp, string][] = [
  [/\bwar\b/i, 'krig'],
  [/\battack/i, 'angreb'],
  [/\bdrone/i, 'drone'],
  [/\bpeace\b/i, 'fred'],
  [/\btalk/i, 'forhandling'],
  [/\bsanction/i, 'sanktion'],
  [/\bnuclear/i, 'atom'],
  [/\btrade\b/i, 'handel'],
  [/\btariff/i, 'told'],
  [/\belection/i, 'valg'],
  [/\bcrisis/i, 'krise'],
  [/\bclimate/i, 'klima'],
  [/\brefugee/i, 'flygtninge'],
  [/\bmissile/i, 'missil'],
  [/\bceasefire/i, 'våbenhvile'],
  [/\bsummit/i, 'topmøde'],
  [/\bprotest/i, 'protest'],
  [/\bcoup\b/i, 'kup'],
  [/\binvasion/i, 'invasion'],
  [/\boffensive/i, 'offensiv'],
];

function generateDanishTitle(articles: Article[], topicTags: string[]): string {
  // Extract common key entities from titles
  const allTitles = articles.map((a) => a.title).join(' ').toLowerCase();

  // Find key actors/locations mentioned
  const actors: string[] = [];
  const patterns: [RegExp, string][] = [
    [/\bukraine/i, 'Ukraine'],
    [/\brussia/i, 'Rusland'],
    [/\bchina/i, 'Kina'],
    [/\bindia/i, 'Indien'],
    [/\biran/i, 'Iran'],
    [/\bnorth korea/i, 'Nordkorea'],
    [/\bisrael/i, 'Israel'],
    [/\bpalestine|gaza/i, 'Palæstina'],
    [/\bsyria/i, 'Syrien'],
    [/\beu\b|european union/i, 'EU'],
    [/\bnato\b/i, 'NATO'],
    [/\bun\b|united nations/i, 'FN'],
    [/\bzelensky/i, 'Zelensky'],
    [/\bputin/i, 'Putin'],
    [/\bxi jinping/i, 'Xi Jinping'],
    [/\btrump/i, 'Trump'],
    [/\bbiden/i, 'Biden'],
    [/\bmodi/i, 'Modi'],
    [/\bkim jong/i, 'Kim Jong-un'],
  ];

  for (const [re, name] of patterns) {
    if (re.test(allTitles) && !actors.includes(name)) {
      actors.push(name);
    }
  }

  // Find key action
  let action = '';
  for (const [re, da] of KEYWORD_DANISH) {
    if (re.test(allTitles)) {
      action = da;
      break;
    }
  }

  // Build Danish title
  const primaryTopic = topicTags[0] ? (DANISH_TOPIC_NAMES[topicTags[0]] || topicTags[0]) : '';

  if (actors.length >= 2 && action) {
    return `${actors.slice(0, 2).join(' og ')}: ${action}`;
  }
  if (actors.length >= 1 && action) {
    return `${actors[0]}: ${action}`;
  }
  if (actors.length >= 2) {
    return `${actors.slice(0, 3).join(', ')} — ${primaryTopic}`;
  }
  if (actors.length === 1 && primaryTopic) {
    return `${actors[0]}: ${primaryTopic}`;
  }
  if (primaryTopic) {
    return primaryTopic;
  }

  // Fallback: use lead article title
  return articles[0]?.title || 'Ukendt historie';
}

function generateDanishSummary(articles: Article[], sourceKeys: Set<string>, divergenceLabel: string): string {
  const sourceNames = [...sourceKeys].map((k) => {
    const names: Record<string, string> = {
      reuters: 'Reuters', ap: 'AP', bbc: 'BBC', aljazeera: 'Al Jazeera',
      kyivindependent: 'Kyiv Independent', scmp: 'SCMP', tass: 'TASS', wion: 'WION',
    };
    return names[k] || k;
  });

  const count = sourceKeys.size;
  const sourceList = sourceNames.join(', ');

  return `${count} kilder dækker denne historie: ${sourceList}. ${divergenceLabel}`;
}

// ─── Union-Find for Clustering ──────────────────────────────

class UnionFind {
  private parent: Map<string, string> = new Map();
  private rank: Map<string, number> = new Map();

  find(x: string): string {
    if (!this.parent.has(x)) {
      this.parent.set(x, x);
      this.rank.set(x, 0);
    }
    if (this.parent.get(x) !== x) {
      this.parent.set(x, this.find(this.parent.get(x)!));
    }
    return this.parent.get(x)!;
  }

  union(x: string, y: string): void {
    const rx = this.find(x);
    const ry = this.find(y);
    if (rx === ry) return;

    const rankX = this.rank.get(rx) || 0;
    const rankY = this.rank.get(ry) || 0;

    if (rankX < rankY) {
      this.parent.set(rx, ry);
    } else if (rankX > rankY) {
      this.parent.set(ry, rx);
    } else {
      this.parent.set(ry, rx);
      this.rank.set(rx, rankX + 1);
    }
  }

  groups(): Map<string, string[]> {
    const groups = new Map<string, string[]>();
    for (const key of this.parent.keys()) {
      const root = this.find(key);
      if (!groups.has(root)) groups.set(root, []);
      groups.get(root)!.push(key);
    }
    return groups;
  }
}

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

  // Build clusters using union-find
  const uf = new UnionFind();

  // Initialize all articles
  for (const a of articles) {
    uf.find(a.id);
  }

  // Compare articles pairwise (within recent window)
  const recent = articles.slice(0, 200); // Only cluster most recent
  for (let i = 0; i < recent.length; i++) {
    for (let j = i + 1; j < recent.length; j++) {
      if (shouldCluster(recent[i], recent[j])) {
        uf.union(recent[i].id, recent[j].id);
      }
    }
  }

  // Build cluster objects
  const groups = uf.groups();
  const articleMap = new Map(articles.map((a) => [a.id, a]));

  const clusters: StoryCluster[] = [];

  for (const [, memberIds] of groups) {
    // Only keep multi-source clusters (2+ different sources)
    const members = memberIds
      .map((id) => articleMap.get(id))
      .filter((a): a is Article => !!a);

    const uniqueSources = new Set(members.map((a) => a.sourceKey));
    if (uniqueSources.size < 2) continue;

    // Use the most recent article's title as cluster title
    const sorted = [...members].sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
    const lead = sorted[0];

    // Collect all topic tags
    const allTags = [...new Set(members.flatMap((a) => a.topicTags))];

    // Calculate divergence
    const divergence = calculateDivergence(members);

    const id = crypto.createHash('sha256')
      .update(memberIds.sort().join('|'))
      .digest('hex')
      .slice(0, 16);

    const cluster: StoryCluster = {
      id: `cluster-${id}`,
      slug: slugify(lead.title),
      title: generateDanishTitle(members, allTags),
      summary: generateDanishSummary(members, uniqueSources, divergence.label),
      articleIds: memberIds,
      sourceKeys: [...uniqueSources],
      coverageCount: uniqueSources.size,
      divergenceScore: divergence.score,
      divergenceLevel: divergence.level,
      divergenceLabel: divergence.label,
      topicTags: allTags.slice(0, 6),
      updatedAt: lead.publishedAt,
    };

    clusters.push(cluster);
  }

  // Sort by updatedAt descending
  clusters.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));

  // Write clusters
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
