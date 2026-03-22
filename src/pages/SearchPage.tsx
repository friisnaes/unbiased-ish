import { useState, useMemo } from 'react';
import { useArticles, useClusters } from '@/hooks/useData';
import ArticleCard from '@/components/ArticleCard';
import StoryClusterCard from '@/components/StoryClusterCard';

export default function SearchPage() {
  const { articles, loading: aLoading } = useArticles();
  const { clusters, loading: cLoading } = useClusters();
  const [query, setQuery] = useState('');
  const [tab, setTab] = useState<'articles' | 'stories'>('articles');

  const q = query.toLowerCase().trim();

  const matchedArticles = useMemo(() => {
    if (!q || q.length < 2) return [];
    return articles
      .filter(
        (a) =>
          a.title.toLowerCase().includes(q) ||
          (a.summaryDa || '').toLowerCase().includes(q) ||
          (a.briefDa || '').toLowerCase().includes(q) ||
          a.excerpt.toLowerCase().includes(q) ||
          a.topicTags.some((t) => t.includes(q)) ||
          a.sourceName.toLowerCase().includes(q)
      )
      .slice(0, 30);
  }, [articles, q]);

  const matchedClusters = useMemo(() => {
    if (!q || q.length < 2) return [];
    return clusters
      .filter(
        (c) =>
          c.title.toLowerCase().includes(q) ||
          c.summary.toLowerCase().includes(q) ||
          (c.clusterAnalysisDa || '').toLowerCase().includes(q) ||
          c.topicTags.some((t) => t.includes(q))
      )
      .slice(0, 20);
  }, [clusters, q]);

  const loading = aLoading || cLoading;
  const totalResults = matchedArticles.length + matchedClusters.length;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <p className="text-xs font-mono text-accent uppercase tracking-widest mb-2">
          Søg
        </p>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Søg i artikler, historier, emner..."
          autoFocus
          className="w-full bg-surface-800 border border-surface-600 text-text-primary text-lg rounded-sm px-4 py-3 font-body focus:outline-none focus:border-accent placeholder:text-text-tertiary"
        />
        {q.length >= 2 && (
          <p className="text-xs font-mono text-text-tertiary mt-2">
            {totalResults} resultater for "{query}"
          </p>
        )}
      </div>

      {q.length >= 2 && (
        <>
          {/* Tabs */}
          <div className="flex gap-1 mb-6 border-b border-surface-700">
            <button
              onClick={() => setTab('articles')}
              className={`px-4 py-2 text-sm font-mono transition-colors border-b-2 -mb-px ${
                tab === 'articles'
                  ? 'text-text-primary border-accent'
                  : 'text-text-tertiary border-transparent hover:text-text-secondary'
              }`}
            >
              Artikler ({matchedArticles.length})
            </button>
            <button
              onClick={() => setTab('stories')}
              className={`px-4 py-2 text-sm font-mono transition-colors border-b-2 -mb-px ${
                tab === 'stories'
                  ? 'text-text-primary border-accent'
                  : 'text-text-tertiary border-transparent hover:text-text-secondary'
              }`}
            >
              Historier ({matchedClusters.length})
            </button>
          </div>

          {loading ? (
            <p className="text-center py-12 text-text-tertiary font-mono text-sm">
              Indlæser...
            </p>
          ) : totalResults === 0 ? (
            <div className="text-center py-12">
              <p className="font-display text-lg text-text-primary mb-2">Ingen resultater</p>
              <p className="text-sm text-text-tertiary">
                Prøv et andet søgeord — f.eks. "ukraine", "iran", "sanctions", eller et kildenavn.
              </p>
            </div>
          ) : tab === 'articles' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {matchedArticles.map((a) => (
                <ArticleCard key={a.id} article={a} />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {matchedClusters.map((c) => (
                <StoryClusterCard key={c.id} cluster={c} articles={articles} />
              ))}
            </div>
          )}
        </>
      )}

      {q.length < 2 && (
        <div className="text-center py-12 text-text-tertiary">
          <p className="text-sm">Skriv mindst 2 tegn for at søge.</p>
          <div className="flex flex-wrap justify-center gap-2 mt-4">
            {['ukraine', 'iran', 'sanctions', 'drone', 'nuclear', 'nato', 'gaza', 'china'].map((term) => (
              <button
                key={term}
                onClick={() => setQuery(term)}
                className="text-xs font-mono text-text-tertiary bg-surface-700 px-3 py-1.5 rounded-sm hover:text-text-primary hover:bg-surface-600 transition-colors"
              >
                {term}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
