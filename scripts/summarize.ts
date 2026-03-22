#!/usr/bin/env tsx
/**
 * Danish Summary Generator
 *
 * Uses the Anthropic API to generate short Danish summaries
 * based ONLY on the article headline + feed excerpt (legally available data).
 *
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
  [key: string]: unknown;
}

const API_KEY = process.env.ANTHROPIC_API_KEY;

const SOURCE_LENS: Record<string, string> = {
  reuters: 'wire service / faktabaseline',
  ap: 'wire service / faktabaseline',
  bbc: 'britisk public service / kontekstualisering',
  aljazeera: 'Qatar-baseret / ikke-vestligt modperspektiv',
  kyivindependent: 'ukrainsk frontlinjemedie',
  scmp: 'Hongkong-baseret / Kina-perspektiv',
  tass: 'russisk statsligt nyhedsbureau',
  wion: 'indisk / Global South-perspektiv',
};

async function generateSummary(article: Article): Promise<string | null> {
  if (!API_KEY) return null;

  const lens = SOURCE_LENS[article.sourceKey] || 'international nyhedskilde';

  const prompt = `Du er en dansk medieanalytiker. Baseret udelukkende på nedenstående overskrift og uddrag fra en nyhedsartikel, skriv en kort dansk opsummering (1-2 sætninger, max 150 tegn).

Opsummeringen skal:
- Beskrive artiklens budskab og vinkel kort på dansk
- Nævne kildens typiske perspektiv i parentes: (${lens})
- Være faktuel og analytisk, ikke vurderende
- ALDRIG opfinde information ud over hvad overskrift og uddrag indeholder

Kilde: ${article.sourceName}
Overskrift: ${article.title}
Uddrag: ${article.excerpt || '(intet uddrag tilgængeligt)'}

Svar KUN med opsummeringen, ingen forklaring.`;

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
        max_tokens: 200,
        messages: [{ role: 'user', content: prompt }],
      }),
    });

    if (!res.ok) {
      console.error(`  API error ${res.status} for ${article.id}`);
      return null;
    }

    const data = await res.json();
    const text = data.content?.[0]?.text?.trim();
    return text || null;
  } catch (err) {
    console.error(`  API call failed for ${article.id}:`, err);
    return null;
  }
}

async function main() {
  console.log('═══════════════════════════════════════════');
  console.log('  Signal over Støj — Danish Summary Generator');
  console.log('═══════════════════════════════════════════');

  if (!API_KEY) {
    console.log('  ⚠ ANTHROPIC_API_KEY not set. Skipping summary generation.');
    console.log('  Set it with: export ANTHROPIC_API_KEY=your-key');
    console.log('  Or add it as a GitHub Actions secret.');
    return;
  }

  if (!existsSync(ARTICLES_PATH)) {
    console.error('  No articles.json found. Run ingestion first.');
    process.exit(1);
  }

  const articles: Article[] = JSON.parse(readFileSync(ARTICLES_PATH, 'utf-8'));
  const needSummary = articles.filter((a) => !a.summaryDa);

  console.log(`  Total articles: ${articles.length}`);
  console.log(`  Need summary: ${needSummary.length}`);

  // Limit per run to manage API costs
  const MAX_PER_RUN = 30;
  const batch = needSummary.slice(0, MAX_PER_RUN);

  let generated = 0;

  for (const article of batch) {
    const summary = await generateSummary(article);
    if (summary) {
      article.summaryDa = summary;
      generated++;
      console.log(`  ✓ ${article.sourceKey}: ${summary.slice(0, 60)}...`);
    } else {
      console.log(`  ✗ ${article.id}: No summary generated`);
    }

    // Brief pause to respect rate limits
    await new Promise((r) => setTimeout(r, 500));
  }

  writeFileSync(ARTICLES_PATH, JSON.stringify(articles, null, 2));

  console.log(`\n  Summaries generated: ${generated}/${batch.length}`);
  console.log('  Summary generation complete.');
  console.log('═══════════════════════════════════════════');
}

main().catch((err) => {
  console.error('Summary generation failed:', err);
  process.exit(1);
});
