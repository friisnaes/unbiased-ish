#!/usr/bin/env tsx
/**
 * Case Synthesis Generator
 *
 * For each cluster, generates structured synthesis:
 * - What is known (confirmed facts)
 * - What is disputed (different interpretations)
 * - What is unclear (missing/contradictory info)
 *
 * Uses Anthropic API with only feed-available data.
 */

import { readFileSync, writeFileSync, existsSync } from 'fs';
import { resolve } from 'path';

const DATA_DIR = resolve(process.cwd(), 'public/data');
const ARTICLES_PATH = resolve(DATA_DIR, 'articles.json');
const CLUSTERS_PATH = resolve(DATA_DIR, 'clusters.json');

const API_KEY = process.env.ANTHROPIC_API_KEY;

interface Article {
  id: string;
  sourceKey: string;
  sourceName: string;
  title: string;
  excerpt: string;
  summaryDa?: string;
  briefDa?: string;
  [key: string]: unknown;
}

interface StoryCluster {
  id: string;
  title: string;
  articleIds: string[];
  sourceKeys: string[];
  coverageCount: number;
  synthesisKnown?: string[];
  synthesisDisputed?: string[];
  synthesisUnclear?: string[];
  editorialNote?: string;
  [key: string]: unknown;
}

const SOURCE_LENS: Record<string, string> = {
  reuters: 'Reuters (wire)', ap: 'AP (wire)', bbc: 'BBC (kontekst)',
  aljazeera: 'Al Jazeera (modperspektiv)', kyivindependent: 'Kyiv Ind. (frontlinje)',
  scmp: 'SCMP (Kina)', tass: 'TASS (russisk stat)', wion: 'WION (Indien)',
};

async function callClaude(prompt: string): Promise<string | null> {
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
        max_tokens: 800,
        messages: [{ role: 'user', content: prompt }],
      }),
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data.content?.[0]?.text?.trim() || null;
  } catch { return null; }
}

async function main() {
  console.log('═══════════════════════════════════════════');
  console.log('  Signal over Støj — Case Synthesis Generator');
  console.log('═══════════════════════════════════════════');

  if (!API_KEY) { console.log('  ⚠ ANTHROPIC_API_KEY not set.'); return; }

  const articles: Article[] = JSON.parse(readFileSync(ARTICLES_PATH, 'utf-8'));
  const clusters: StoryCluster[] = JSON.parse(readFileSync(CLUSTERS_PATH, 'utf-8'));
  const articleMap = new Map(articles.map((a) => [a.id, a]));

  const needSynthesis = clusters
    .filter((c) => !c.synthesisKnown && c.coverageCount >= 2)
    .sort((a, b) => (b.coverageCount as number) - (a.coverageCount as number))
    .slice(0, 15);

  console.log(`  Clusters needing synthesis: ${needSynthesis.length}`);
  let generated = 0;

  for (const cluster of needSynthesis) {
    const members = cluster.articleIds
      .map((id) => articleMap.get(id))
      .filter((a): a is Article => !!a);

    const sourceBlock = members.map((a) => {
      const lens = SOURCE_LENS[a.sourceKey] || a.sourceKey;
      return `[${lens}] "${a.title}"\n${a.summaryDa || a.excerpt || '(intet uddrag)'}`;
    }).join('\n\n');

    const prompt = `Du er en dansk sikkerhedspolitisk analytiker. Baseret UDELUKKENDE på disse overskrifter og uddrag, generer en struktureret syntese.

ARTIKLER:
${sourceBlock}

Svar i PRÆCIST dette JSON-format (på dansk). Hver array skal have 2-4 korte punkter:

{
  "known": ["punkt 1", "punkt 2"],
  "disputed": ["punkt 1", "punkt 2"],
  "unclear": ["punkt 1", "punkt 2"],
  "editorial": "Kort note om hvorfor denne case er valgt og hvilke kilder der er inkluderet/fravalgt."
}

known = bekræftede fakta alle kilder er enige om
disputed = fortolkninger og vinkler der varierer mellem kilderne
unclear = uafklarede spørgsmål, manglende information, modstridende oplysninger

Svar KUN med JSON, ingen anden tekst.`;

    const result = await callClaude(prompt);
    if (result) {
      try {
        const clean = result.replace(/```json\s*|```\s*/g, '').trim();
        const parsed = JSON.parse(clean);
        cluster.synthesisKnown = parsed.known || [];
        cluster.synthesisDisputed = parsed.disputed || [];
        cluster.synthesisUnclear = parsed.unclear || [];
        cluster.editorialNote = parsed.editorial || '';
        generated++;
        console.log(`  ✓ ${cluster.title.slice(0, 50)}...`);
      } catch {
        console.log(`  ✗ JSON parse failed for ${cluster.id}`);
      }
    }
    await new Promise((r) => setTimeout(r, 600));
  }

  writeFileSync(CLUSTERS_PATH, JSON.stringify(clusters, null, 2));
  console.log(`\n  Syntheses generated: ${generated}`);
  console.log('═══════════════════════════════════════════');
}

main().catch(console.error);
