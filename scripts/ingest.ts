#!/usr/bin/env tsx
/**
 * Ingestion Pipeline
 *
 * Fetches articles from all configured source adapters,
 * normalizes them, deduplicates, and writes to /public/data.
 */

import { readFileSync, writeFileSync, existsSync } from 'fs';
import { resolve } from 'path';
import { sources, fetchRSS, type RawArticle, type SourceKey } from './adapters.js';
import crypto from 'crypto';

// ─── Paths ──────────────────────────────────────────────────

const DATA_DIR = resolve(process.cwd(), 'public/data');
const ARTICLES_PATH = resolve(DATA_DIR, 'articles.json');
const LOG_PATH = resolve(DATA_DIR, 'ingestion-log.json');
const CONFIG_PATH = resolve(DATA_DIR, 'config.json');

// ─── Types ──────────────────────────────────────────────────

interface Article {
  id: string;
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
  linkStatus: 'valid' | 'uncertain' | 'broken' | 'unchecked';
  ingestionTimestamp: string;
  clusterCandidateText: string;
}

interface IngestionRun {
  timestamp: string;
  sourcesAttempted: SourceKey[];
  sourcesSucceeded: SourceKey[];
  articlesIngested: number;
  errors: string[];
}

// ─── Helpers ────────────────────────────────────────────────

function generateId(sourceKey: string, url: string): string {
  const hash = crypto.createHash('sha256').update(url).digest('hex').slice(0, 12);
  return `${sourceKey}-${hash}`;
}

function generateClusterText(title: string, excerpt: string): string {
  const text = `${title} ${excerpt}`.toLowerCase();
  // Remove common stop words
  const stopWords = new Set([
    'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for',
    'of', 'with', 'by', 'from', 'is', 'are', 'was', 'were', 'be', 'been',
    'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could',
    'should', 'may', 'might', 'can', 'shall', 'that', 'this', 'these',
    'those', 'it', 'its', 'as', 'if', 'not', 'no', 'so', 'up', 'out',
    'about', 'into', 'over', 'after', 'before', 'between', 'under',
    'again', 'then', 'once', 'here', 'there', 'when', 'where', 'why',
    'how', 'all', 'each', 'every', 'both', 'few', 'more', 'most',
    'other', 'some', 'such', 'than', 'too', 'very', 'just', 'also',
  ]);

  return text
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter((w) => w.length > 2 && !stopWords.has(w))
    .join(' ');
}

function loadExisting(): Article[] {
  try {
    if (existsSync(ARTICLES_PATH)) {
      return JSON.parse(readFileSync(ARTICLES_PATH, 'utf-8'));
    }
  } catch {
    console.warn('  Could not load existing articles, starting fresh.');
  }
  return [];
}

function loadLog(): IngestionRun[] {
  try {
    if (existsSync(LOG_PATH)) {
      return JSON.parse(readFileSync(LOG_PATH, 'utf-8'));
    }
  } catch {}
  return [];
}

// ─── Main ───────────────────────────────────────────────────

async function main() {
  console.log('═══════════════════════════════════════════');
  console.log('  Signal over Støj — Ingestion Pipeline');
  console.log('═══════════════════════════════════════════');
  console.log(`  Time: ${new Date().toISOString()}`);
  console.log(`  Sources configured: ${sources.length}`);
  console.log('');

  const existing = loadExisting();
  const existingUrls = new Set(existing.map((a) => a.originalUrl));

  const now = new Date().toISOString();
  const allWarnings: string[] = [];
  const allErrors: string[] = [];
  const attemptedKeys: SourceKey[] = [];
  const succeededKeys: SourceKey[] = [];
  let newCount = 0;

  for (const source of sources) {
    attemptedKeys.push(source.key);
    const result = await fetchRSS(source);

    allWarnings.push(...result.warnings);
    allErrors.push(...result.errors);

    if (result.errors.length === 0 && result.articles.length > 0) {
      succeededKeys.push(source.key);
    }

    for (const raw of result.articles) {
      if (existingUrls.has(raw.originalUrl)) continue;

      const article: Article = {
        id: generateId(raw.sourceKey, raw.originalUrl),
        sourceKey: raw.sourceKey,
        sourceName: raw.sourceName,
        title: raw.title,
        originalUrl: raw.originalUrl,
        publishedAt: raw.publishedAt,
        excerpt: raw.excerpt,
        topicTags: raw.topicTags,
        language: raw.language,
        region: raw.region,
        imageUrl: raw.imageUrl,
        linkStatus: 'unchecked',
        ingestionTimestamp: now,
        clusterCandidateText: generateClusterText(raw.title, raw.excerpt),
      };

      existing.push(article);
      existingUrls.add(raw.originalUrl);
      newCount++;
    }
  }

  // Sort by publishedAt descending
  existing.sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));

  // Keep only the latest 500 articles to avoid unbounded growth
  const trimmed = existing.slice(0, 500);

  // Write articles
  writeFileSync(ARTICLES_PATH, JSON.stringify(trimmed, null, 2));
  console.log(`\n  Total articles: ${trimmed.length} (${newCount} new)`);

  // Update config
  const config = {
    siteName: 'Signal over Støj',
    tagline: 'Perspektiver på geopolitik',
    language: 'da',
    lastIngestion: now,
    ingestionSchedule: '*/15 * * * *',
    totalArticles: trimmed.length,
    totalClusters: 0, // Updated by cluster script
  };
  writeFileSync(CONFIG_PATH, JSON.stringify(config, null, 2));

  // Write ingestion log (keep last 50 runs)
  const log = loadLog();
  const run: IngestionRun = {
    timestamp: now,
    sourcesAttempted: attemptedKeys,
    sourcesSucceeded: succeededKeys,
    articlesIngested: newCount,
    errors: allErrors,
  };
  log.unshift(run);
  writeFileSync(LOG_PATH, JSON.stringify(log.slice(0, 50), null, 2));

  // Print summary
  console.log('');
  if (allWarnings.length > 0) {
    console.log('  Warnings:');
    allWarnings.forEach((w) => console.log(`    ⚠ ${w}`));
  }
  if (allErrors.length > 0) {
    console.log('  Errors:');
    allErrors.forEach((e) => console.log(`    ✗ ${e}`));
  }
  console.log('');
  console.log('  Ingestion complete.');
  console.log('═══════════════════════════════════════════');
}

main().catch((err) => {
  console.error('Ingestion pipeline failed:', err);
  process.exit(1);
});
