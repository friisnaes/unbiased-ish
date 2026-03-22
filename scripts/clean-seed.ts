#!/usr/bin/env tsx
/**
 * Remove seed/demo articles from data files.
 * Seed articles have IDs like reuters-001, ap-001, etc.
 */

import { readFileSync, writeFileSync, existsSync } from 'fs';
import { resolve } from 'path';

const DATA_DIR = resolve(process.cwd(), 'public/data');
const ARTICLES_PATH = resolve(DATA_DIR, 'articles.json');
const CLUSTERS_PATH = resolve(DATA_DIR, 'clusters.json');
const CONFIG_PATH = resolve(DATA_DIR, 'config.json');

const SEED_PATTERN = /^(reuters|ap|bbc|aljazeera|kyiv)-\d{3}$/;

function main() {
  console.log('Removing seed data...');

  if (!existsSync(ARTICLES_PATH)) {
    console.log('No articles.json found.');
    return;
  }

  const articles = JSON.parse(readFileSync(ARTICLES_PATH, 'utf-8'));
  const before = articles.length;
  const cleaned = articles.filter((a: { id: string }) => !SEED_PATTERN.test(a.id));
  writeFileSync(ARTICLES_PATH, JSON.stringify(cleaned, null, 2));
  console.log(`  Articles: ${before} → ${cleaned.length} (removed ${before - cleaned.length} seed articles)`);

  // Clean clusters that reference seed articles
  if (existsSync(CLUSTERS_PATH)) {
    const clusters = JSON.parse(readFileSync(CLUSTERS_PATH, 'utf-8'));
    const seedIds = new Set(articles.filter((a: { id: string }) => SEED_PATTERN.test(a.id)).map((a: { id: string }) => a.id));

    const cleanedClusters = clusters
      .map((c: any) => ({
        ...c,
        articleIds: c.articleIds.filter((id: string) => !seedIds.has(id)),
      }))
      .filter((c: any) => c.articleIds.length >= 2);

    writeFileSync(CLUSTERS_PATH, JSON.stringify(cleanedClusters, null, 2));
    console.log(`  Clusters: ${clusters.length} → ${cleanedClusters.length}`);
  }

  // Update config
  if (existsSync(CONFIG_PATH)) {
    const config = JSON.parse(readFileSync(CONFIG_PATH, 'utf-8'));
    config.totalArticles = cleaned.length;
    writeFileSync(CONFIG_PATH, JSON.stringify(config, null, 2));
  }

  console.log('Done.');
}

main();
