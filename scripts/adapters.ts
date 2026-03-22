/**
 * Source Adapter System
 *
 * Each source has a configurable adapter that fetches from legal feeds/APIs.
 * If a source has no confirmed feed path, the adapter returns empty results
 * with a warning — it never breaks the pipeline.
 */

import Parser from 'rss-parser';

// ─── Types ──────────────────────────────────────────────────

export type SourceKey = 'reuters' | 'ap' | 'bbc' | 'aljazeera' | 'kyivindependent' | 'scmp' | 'tass' | 'wion';

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
  feedUrls: string[];
  enabled: boolean;
  region: string;
  language: string;
  topicHints: string[];
}

const sources: SourceConfig[] = [
  {
    key: 'reuters',
    name: 'Reuters',
    feedUrls: [
      'https://news.google.com/rss/search?q=site:reuters.com+ukraine+OR+russia+OR+war&hl=en',
      'https://news.google.com/rss/search?q=site:reuters.com+iran+OR+sanctions+OR+nuclear&hl=en',
      'https://news.google.com/rss/search?q=site:reuters.com+geopolitics+OR+conflict+global&hl=en',
    ],
    enabled: true,
    region: 'global',
    language: 'en',
    topicHints: ['geopolitics', 'conflict', 'diplomacy'],
  },
  {
    key: 'ap',
    name: 'Associated Press',
    feedUrls: [
      'https://news.google.com/rss/search?q=site:apnews.com+ukraine+OR+russia&hl=en',
      'https://news.google.com/rss/search?q=site:apnews.com+iran+OR+middle+east+conflict&hl=en',
    ],
    enabled: true,
    region: 'global',
    language: 'en',
    topicHints: ['geopolitics', 'conflict'],
  },
  {
    key: 'bbc',
    name: 'BBC News',
    feedUrls: [
      'https://feeds.bbci.co.uk/news/world/europe/rss.xml',
      'https://feeds.bbci.co.uk/news/world/middle_east/rss.xml',
      'https://feeds.bbci.co.uk/news/world/rss.xml',
    ],
    enabled: true,
    region: 'europe',
    language: 'en',
    topicHints: ['geopolitics', 'conflict', 'diplomacy'],
  },
  {
    key: 'aljazeera',
    name: 'Al Jazeera',
    feedUrls: [
      'https://www.aljazeera.com/xml/rss/all.xml',
    ],
    enabled: true,
    region: 'middle-east',
    language: 'en',
    topicHints: ['geopolitics', 'conflict', 'middle-east'],
  },
  {
    key: 'kyivindependent',
    name: 'Kyiv Independent',
    feedUrls: [
      'https://news.google.com/rss/search?q=site:kyivindependent.com&hl=en',
    ],
    enabled: true,
    region: 'eastern-europe',
    language: 'en',
    topicHints: ['ukraine-russia', 'conflict'],
  },
  {
    key: 'scmp',
    name: 'South China Morning Post',
    feedUrls: [
      'https://www.scmp.com/rss/91/feed',
    ],
    enabled: true,
    region: 'east-asia',
    language: 'en',
    topicHints: ['china', 'geopolitics', 'east-asia'],
  },
  {
    key: 'tass',
    name: 'TASS',
    feedUrls: [
      'https://tass.com/rss/v2.xml',
    ],
    enabled: true,
    region: 'russia',
    language: 'en',
    topicHints: ['russia', 'geopolitics', 'conflict'],
  },
  {
    key: 'wion',
    name: 'WION',
    feedUrls: [
      // Feed returned 404 — disabled until a working URL is confirmed
    ],
    enabled: false,
    region: 'south-asia',
    language: 'en',
    topicHints: ['geopolitics', 'south-asia', 'diplomacy'],
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
  'china': ['china', 'beijing', 'xi jinping', 'chinese', 'taiwan', 'south china sea'],
  'india': ['india', 'modi', 'new delhi', 'indian', 'mumbai'],
  'north-korea': ['north korea', 'pyongyang', 'kim jong'],
  'iran': ['iran', 'tehran', 'iranian', 'ayatollah', 'khamenei'],
  'eu': ['european union', ' eu ', 'brussels', 'europe'],
  'usa': ['united states', 'washington', 'white house', 'pentagon', 'congress', 'biden', 'trump', 'american'],
  'geopolitics': ['geopolit', 'superpower', 'alliance', 'nato', 'brics', 'multipolar', 'g7', 'g20'],
  'defense': ['defense', 'defence', 'air defense', 'intercept', 'military', 'weapon', 'arms'],
  'civilian-impact': ['civilian', 'humanitarian', 'refugee', 'displacement', 'casualt'],
  'climate': ['climate', 'emission', 'carbon', 'warming', 'cop'],
  'trade': ['trade', 'tariff', 'export', 'import', 'economic', 'commerce'],
  'nuclear': ['nuclear', 'atomic', 'enrichment', 'nonproliferat', 'warhead'],
  'africa': ['africa', 'african union', 'sahel', 'niger', 'sudan', 'ethiopia', 'kenya', 'nigeria'],
  'south-asia': ['pakistan', 'bangladesh', 'sri lanka', 'afghanistan'],
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

// ─── Topic Relevance Filter ─────────────────────────────────
// Focus on Ukraine, Iran, and global impact of these conflicts

const FOCUS_KEYWORDS = [
  // Ukraine / Russia
  'ukraine', 'russia', 'kyiv', 'moscow', 'kremlin', 'zelensky', 'putin',
  'drone', 'frontline', 'donbas', 'crimea', 'kharkiv', 'odesa', 'zaporizhzhia',
  // Iran
  'iran', 'tehran', 'iranian', 'ayatollah', 'khamenei', 'irgc', 'persian gulf',
  'strait of hormuz', 'enrichment', 'nuclear deal', 'jcpoa',
  // Global impact
  'sanctions', 'energy crisis', 'oil price', 'gas price', 'food security',
  'grain', 'wheat', 'refugee', 'nato', 'arms', 'weapon', 'missile',
  'ceasefire', 'peace talk', 'negotiat', 'escalat', 'geopolit',
  'nuclear', 'proliferat', 'proxy', 'alliance', 'coalition',
  // Adjacent conflicts / actors affected
  'israel', 'gaza', 'hezbollah', 'houthi', 'red sea', 'syria',
  'china', 'india', 'turkey', 'brics', 'global south',
];

function isRelevantArticle(title: string, excerpt: string): boolean {
  const text = `${title} ${excerpt}`.toLowerCase();
  return FOCUS_KEYWORDS.some((kw) => text.includes(kw));
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
  const seenUrls = new Set<string>();

  if (!config.enabled) {
    result.warnings.push(`${config.key}: Source is disabled, skipping.`);
    return result;
  }

  if (config.feedUrls.length === 0) {
    result.warnings.push(`${config.key}: No feed URLs configured. Skipping.`);
    return result;
  }

  for (const feedUrl of config.feedUrls) {
    try {
      console.log(`  Fetching ${config.key} from ${feedUrl.slice(0, 80)}...`);
      const feed = await parser.parseURL(feedUrl);

      if (!feed.items || feed.items.length === 0) {
        result.warnings.push(`${config.key}: Feed returned 0 items from ${feedUrl.slice(0, 60)}`);
        continue;
      }

      for (const item of feed.items.slice(0, 25)) {
        const title = (item.title || '').trim();
        const link = (item.link || '').trim();

        if (!title || !link) continue;
        if (!isValidUrl(link)) continue;
        if (seenUrls.has(link)) continue;
        seenUrls.add(link);

        const pubDate = item.pubDate || item.isoDate || new Date().toISOString();
        const excerpt = (item.contentSnippet || item.content || '').slice(0, 300).trim();

        // Filter for topic relevance
        if (!isRelevantArticle(title, excerpt)) continue;

        const categories = (item.categories || []) as string[];
        const searchText = `${title} ${excerpt}`;
        const topicTags = extractTags(searchText, categories);

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
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      result.errors.push(`${config.key}: Fetch failed on ${feedUrl.slice(0, 60)} — ${msg}`);
      console.error(`  ${config.key}: ERROR — ${msg}`);
    }
  }

  console.log(`  ${config.key}: ${result.articles.length} relevant articles fetched.`);
  return result;
}

// ─── Exports ────────────────────────────────────────────────

export { sources, fetchRSS };
