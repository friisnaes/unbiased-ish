/**
 * Source Adapter System
 *
 * Each source has a configurable adapter that fetches from legal feeds/APIs.
 * If a source has no confirmed feed path, the adapter returns empty results
 * with a warning — it never breaks the pipeline.
 */

import Parser from 'rss-parser';

// ─── Types ──────────────────────────────────────────────────

export type SourceKey = 'reuters' | 'ap' | 'bbc' | 'aljazeera' | 'kyivindependent';

export interface RawArticle {
  sourceKey: SourceKey;
  sourceName: string;
  title: string;
  originalUrl: string;
  publishedAt: string;
  excerpt: string;
  topicTags: string[];
  language: string;
  region: string;
  imageUrl: string | null;
}

export interface AdapterResult {
  articles: RawArticle[];
  warnings: string[];
  errors: string[];
}

// ─── Source Config ───────────────────────────────────────────

interface SourceConfig {
  key: SourceKey;
  name: string;
  feedUrl: string | null;
  enabled: boolean;
  region: string;
  language: string;
  topicHints: string[];
}

const sources: SourceConfig[] = [
  {
    key: 'reuters',
    name: 'Reuters',
    // NOTE: Reuters does not provide a public RSS feed.
    // Using Google News RSS as a proxy — replace with a confirmed legal endpoint.
    feedUrl: 'https://news.google.com/rss/search?q=site:reuters.com+world&hl=en',
    enabled: true,
    region: 'global',
    language: 'en',
    topicHints: ['geopolitics', 'conflict', 'diplomacy'],
  },
  {
    key: 'ap',
    name: 'Associated Press',
    // NOTE: AP does not provide a freely available public RSS.
    // Using Google News RSS as a proxy — replace with a confirmed legal endpoint.
    feedUrl: 'https://news.google.com/rss/search?q=site:apnews.com+world&hl=en',
    enabled: true,
    region: 'global',
    language: 'en',
    topicHints: ['geopolitics', 'conflict'],
  },
  {
    key: 'bbc',
    name: 'BBC News',
    feedUrl: 'https://feeds.bbci.co.uk/news/world/rss.xml',
    enabled: true,
    region: 'europe',
    language: 'en',
    topicHints: ['geopolitics', 'conflict', 'diplomacy'],
  },
  {
    key: 'aljazeera',
    name: 'Al Jazeera',
    feedUrl: 'https://www.aljazeera.com/xml/rss/all.xml',
    enabled: true,
    region: 'middle-east',
    language: 'en',
    topicHints: ['geopolitics', 'conflict', 'middle-east'],
  },
  {
    key: 'kyivindependent',
    name: 'Kyiv Independent',
    feedUrl: 'https://kyivindependent.com/feed/',
    enabled: true,
    region: 'eastern-europe',
    language: 'en',
    topicHints: ['ukraine-russia', 'conflict'],
  },
];

// ─── Tag Extraction ─────────────────────────────────────────

const TAG_KEYWORDS: Record<string, string[]> = {
  'ukraine-russia': ['ukraine', 'russia', 'kyiv', 'moscow', 'kremlin', 'zelensky', 'putin', 'drone', 'frontline'],
  'conflict': ['war', 'attack', 'military', 'conflict', 'troops', 'missile', 'strike', 'combat', 'offensive'],
  'diplomacy': ['diplomat', 'peace', 'talks', 'negotiat', 'mediat', 'summit', 'treaty', 'agreement'],
  'energy': ['energy', 'oil', 'gas', 'lng', 'pipeline', 'nuclear', 'power', 'electricity'],
  'sanctions': ['sanction', 'restrict', 'embargo', 'ban', 'penalty'],
  'middle-east': ['middle east', 'gaza', 'israel', 'palestine', 'iran', 'syria', 'lebanon', 'hamas', 'hezbollah'],
  'china': ['china', 'beijing', 'xi jinping', 'chinese'],
  'eu': ['european union', ' eu ', 'brussels', 'europe'],
  'geopolitics': ['geopolit', 'superpower', 'alliance', 'nato', 'brics'],
  'defense': ['defense', 'defence', 'air defense', 'intercept', 'military'],
  'civilian-impact': ['civilian', 'humanitarian', 'refugee', 'displacement', 'casualt'],
  'climate': ['climate', 'emission', 'carbon', 'warming', 'cop'],
};

function extractTags(text: string, feedCategories?: string[]): string[] {
  const lower = text.toLowerCase();
  const tags = new Set<string>();

  for (const [tag, keywords] of Object.entries(TAG_KEYWORDS)) {
    if (keywords.some((kw) => lower.includes(kw))) {
      tags.add(tag);
    }
  }

  if (feedCategories) {
    for (const cat of feedCategories) {
      const catLower = cat.toLowerCase();
      for (const [tag, keywords] of Object.entries(TAG_KEYWORDS)) {
        if (keywords.some((kw) => catLower.includes(kw))) {
          tags.add(tag);
        }
      }
    }
  }

  return Array.from(tags);
}

// ─── URL Validation ─────────────────────────────────────────

function isValidUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch {
    return false;
  }
}

// ─── RSS Adapter ────────────────────────────────────────────

const parser = new Parser({
  timeout: 15000,
  headers: {
    'User-Agent': 'SignalOverStoej/1.0 (news-comparison-tool; +https://github.com/signal-over-stoej)',
  },
});

async function fetchRSS(config: SourceConfig): Promise<AdapterResult> {
  const result: AdapterResult = { articles: [], warnings: [], errors: [] };

  if (!config.enabled) {
    result.warnings.push(`${config.key}: Source is disabled, skipping.`);
    return result;
  }

  if (!config.feedUrl) {
    result.warnings.push(`${config.key}: No feed URL configured. Skipping — configure a legal feed/API endpoint.`);
    return result;
  }

  try {
    console.log(`  Fetching ${config.key} from ${config.feedUrl}...`);
    const feed = await parser.parseURL(config.feedUrl);

    if (!feed.items || feed.items.length === 0) {
      result.warnings.push(`${config.key}: Feed returned 0 items.`);
      return result;
    }

    for (const item of feed.items.slice(0, 25)) {
      const title = (item.title || '').trim();
      const link = (item.link || '').trim();

      if (!title || !link) continue;
      if (!isValidUrl(link)) {
        result.warnings.push(`${config.key}: Invalid URL skipped: ${link}`);
        continue;
      }

      const pubDate = item.pubDate || item.isoDate || new Date().toISOString();
      const excerpt = (item.contentSnippet || item.content || '').slice(0, 300).trim();
      const categories = (item.categories || []) as string[];

      const searchText = `${title} ${excerpt}`;
      const topicTags = extractTags(searchText, categories);

      // Add source-level topic hints if no tags found
      if (topicTags.length === 0) {
        topicTags.push(...config.topicHints.slice(0, 2));
      }

      const imageUrl = item.enclosure?.url || null;

      result.articles.push({
        sourceKey: config.key,
        sourceName: config.name,
        title,
        originalUrl: link,
        publishedAt: new Date(pubDate).toISOString(),
        excerpt,
        topicTags,
        language: config.language,
        region: config.region,
        imageUrl: typeof imageUrl === 'string' ? imageUrl : null,
      });
    }

    console.log(`  ${config.key}: ${result.articles.length} articles fetched.`);
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    result.errors.push(`${config.key}: Fetch failed — ${msg}`);
    console.error(`  ${config.key}: ERROR — ${msg}`);
  }

  return result;
}

// ─── Exports ────────────────────────────────────────────────

export { sources, fetchRSS };
