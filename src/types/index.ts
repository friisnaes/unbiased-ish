// ─── Core Data Models ───────────────────────────────────────

export type LinkStatus = 'valid' | 'uncertain' | 'broken' | 'unchecked';
export type DivergenceLevel = 'low' | 'moderate' | 'high';
export type SourceKey = 'reuters' | 'ap' | 'bbc' | 'aljazeera' | 'kyivindependent' | 'scmp' | 'tass' | 'wion';

export interface Article {
  id: string;
  sourceKey: SourceKey;
  sourceName: string;
  title: string;
  originalUrl: string;
  publishedAt: string; // ISO 8601
  excerpt: string;
  topicTags: string[];
  language: string;
  region: string;
  imageUrl: string | null;
  linkStatus: LinkStatus;
  ingestionTimestamp: string; // ISO 8601
  clusterCandidateText: string;
}

export interface StoryCluster {
  id: string;
  slug: string;
  title: string;
  summary: string;
  articleIds: string[];
  sourceKeys: SourceKey[];
  coverageCount: number;
  divergenceScore: number; // 0–1
  divergenceLevel: DivergenceLevel;
  divergenceLabel: string;
  topicTags: string[];
  updatedAt: string;
}

export interface SourceProfile {
  key: SourceKey;
  name: string;
  shortName: string;
  country: string;
  region: string;
  founded: string;
  type: string;
  language: string;
  lensLabel: string;
  lensDescription: string;
  strengths: string[];
  blindSpots: string[];
  vantagePoint: string;
  howWeUseIt: string;
  whatToWatch: string;
  feedUrl: string | null;
  enabled: boolean;
  color: string;
}

export interface Topic {
  slug: string;
  label: string;
  labelDa: string;
  articleCount: number;
  clusterCount: number;
}

export interface IngestionRun {
  timestamp: string;
  sourcesAttempted: SourceKey[];
  sourcesSucceeded: SourceKey[];
  articlesIngested: number;
  errors: string[];
}

export interface SiteConfig {
  siteName: string;
  tagline: string;
  language: string;
  lastIngestion: string | null;
  ingestionSchedule: string;
  totalArticles: number;
  totalClusters: number;
}

// ─── Adapter Types ──────────────────────────────────────────

export interface RawFeedItem {
  title: string;
  link: string;
  pubDate: string;
  contentSnippet?: string;
  categories?: string[];
  enclosure?: { url: string };
}

export interface AdapterResult {
  articles: Omit<Article, 'id' | 'ingestionTimestamp' | 'linkStatus' | 'clusterCandidateText'>[];
  warnings: string[];
  errors: string[];
}
