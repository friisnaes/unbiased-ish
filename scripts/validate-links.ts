#!/usr/bin/env tsx
/**
 * Link Validation Script
 *
 * Performs lightweight HEAD requests to validate article URLs.
 * Marks articles as valid, uncertain, or broken.
 * Designed to run within GitHub Actions time limits.
 */

import { readFileSync, writeFileSync, existsSync } from 'fs';
import { resolve } from 'path';

const DATA_DIR = resolve(process.cwd(), 'public/data');
const ARTICLES_PATH = resolve(DATA_DIR, 'articles.json');

interface Article {
  id: string;
  originalUrl: string;
  linkStatus: 'valid' | 'uncertain' | 'broken' | 'unchecked';
  [key: string]: unknown;
}

async function validateUrl(url: string): Promise<'valid' | 'uncertain' | 'broken'> {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);

    const res = await fetch(url, {
      method: 'HEAD',
      redirect: 'follow',
      signal: controller.signal,
      headers: {
        'User-Agent': 'SignalOverStoej/1.0 (link-validator)',
      },
    });

    clearTimeout(timeout);

    if (res.ok) return 'valid';
    if (res.status === 403 || res.status === 451) return 'uncertain'; // Paywall or geo-blocked
    if (res.status >= 400) return 'broken';
    return 'uncertain';
  } catch {
    return 'uncertain'; // Network error — don't mark as broken
  }
}

async function main() {
  console.log('═══════════════════════════════════════════');
  console.log('  Signal over Støj — Link Validation');
  console.log('═══════════════════════════════════════════');

  if (!existsSync(ARTICLES_PATH)) {
    console.error('  No articles.json found.');
    process.exit(1);
  }

  const articles: Article[] = JSON.parse(readFileSync(ARTICLES_PATH, 'utf-8'));
  const unchecked = articles.filter((a) => a.linkStatus === 'unchecked');

  console.log(`  Total articles: ${articles.length}`);
  console.log(`  Unchecked: ${unchecked.length}`);

  // Validate in batches of 10 to respect rate limits
  const BATCH_SIZE = 10;
  const MAX_CHECKS = 50; // Limit per run to stay within CI time limits
  const toCheck = unchecked.slice(0, MAX_CHECKS);

  let valid = 0;
  let uncertain = 0;
  let broken = 0;

  for (let i = 0; i < toCheck.length; i += BATCH_SIZE) {
    const batch = toCheck.slice(i, i + BATCH_SIZE);
    const results = await Promise.all(
      batch.map(async (article) => {
        const status = await validateUrl(article.originalUrl);
        return { id: article.id, status };
      })
    );

    for (const { id, status } of results) {
      const article = articles.find((a) => a.id === id);
      if (article) {
        article.linkStatus = status;
        if (status === 'valid') valid++;
        else if (status === 'uncertain') uncertain++;
        else broken++;
      }
    }

    // Brief pause between batches
    if (i + BATCH_SIZE < toCheck.length) {
      await new Promise((r) => setTimeout(r, 1000));
    }
  }

  writeFileSync(ARTICLES_PATH, JSON.stringify(articles, null, 2));

  console.log(`\n  Validated: ${toCheck.length}`);
  console.log(`    Valid: ${valid}`);
  console.log(`    Uncertain: ${uncertain}`);
  console.log(`    Broken: ${broken}`);
  console.log('');
  console.log('  Link validation complete.');
  console.log('═══════════════════════════════════════════');
}

main().catch((err) => {
  console.error('Link validation failed:', err);
  process.exit(1);
});
