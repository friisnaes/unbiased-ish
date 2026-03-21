import { useParams, Link } from 'react-router-dom';
import { useArticles, useClusters } from '@/hooks/useData';
import { sourceProfiles } from '@/data/sources';
import { timeAgo, formatDate, truncate } from '@/utils/format';
import DivergenceBadge from '@/components/DivergenceBadge';
import SourceBadge from '@/components/SourceBadge';

export default function StoryDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const { articles } = useArticles();
  const { clusters, loading } = useClusters();

  const cluster = clusters.find((c) => c.slug === slug);

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-20 text-center text-text-tertiary font-mono text-sm">
        Indlæser...
      </div>
    );
  }

  if (!cluster) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-20 text-center">
        <p className="font-display text-xl text-text-primary mb-4">Historie ikke fundet</p>
        <Link to="/stories" className="text-sm text-accent hover:text-accent-light font-mono">
          ← Tilbage til historier
        </Link>
      </div>
    );
  }

  const clusterArticles = articles
    .filter((a) => cluster.articleIds.includes(a.id))
    .sort((a, b) => a.publishedAt.localeCompare(b.publishedAt));

  const grouped = cluster.sourceKeys.map((sk) => ({
    source: sourceProfiles[sk],
    articles: clusterArticles.filter((a) => a.sourceKey === sk),
  }));

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Link
        to="/stories"
        className="text-sm text-text-tertiary hover:text-text-primary font-mono transition-colors mb-6 inline-block"
      >
        ← Alle historier
      </Link>

      <header className="mb-10">
        <div className="flex items-center gap-3 mb-4">
          <DivergenceBadge
            level={cluster.divergenceLevel}
            score={cluster.divergenceScore}
          />
          <span className="text-xs font-mono text-text-tertiary">
            {cluster.coverageCount} kilder · Opdateret {timeAgo(cluster.updatedAt)}
          </span>
        </div>

        <h1 className="font-display font-bold text-3xl md:text-4xl text-text-primary leading-tight mb-4">
          {cluster.title}
        </h1>

        <p className="text-text-secondary leading-relaxed max-w-3xl">
          {cluster.summary}
        </p>

        {cluster.divergenceLabel && (
          <div className="mt-4 border-l-2 border-accent/40 pl-4">
            <p className="text-sm text-text-tertiary italic">
              Divergensnotat: {cluster.divergenceLabel}
            </p>
          </div>
        )}

        <div className="flex gap-2 mt-4 flex-wrap">
          {cluster.topicTags.map((t) => (
            <Link
              key={t}
              to={`/topics/${t}`}
              className="text-xs font-mono text-text-tertiary bg-surface-700 px-2 py-0.5 rounded-sm hover:text-text-primary transition-colors"
            >
              {t}
            </Link>
          ))}
        </div>
      </header>

      {/* ── Side-by-side comparison ── */}
      <section>
        <h2 className="text-xs font-mono text-accent uppercase tracking-widest mb-6">
          Dækning kilde for kilde
        </h2>

        <div className="space-y-8">
          {grouped.map(({ source, articles: sourceArticles }) => {
            if (!source) return null;
            return (
              <div
                key={source.key}
                className="border border-surface-600 rounded-sm bg-surface-800/30 overflow-hidden"
              >
                <div
                  className="px-5 py-3 border-b border-surface-600 flex items-center justify-between"
                  style={{ borderLeftWidth: 3, borderLeftColor: source.color }}
                >
                  <div className="flex items-center gap-3">
                    <span className="font-display font-semibold text-text-primary">
                      {source.name}
                    </span>
                    <span className="text-xs font-mono text-text-tertiary bg-surface-700 px-2 py-0.5 rounded-sm">
                      {source.lensLabel}
                    </span>
                  </div>
                  <Link
                    to={`/sources/${source.key}`}
                    className="text-xs text-text-tertiary hover:text-text-secondary font-mono transition-colors"
                  >
                    Kildeprofil →
                  </Link>
                </div>

                {sourceArticles.length === 0 ? (
                  <div className="px-5 py-4 text-sm text-text-tertiary italic">
                    Ingen artikler fra denne kilde i dette cluster.
                  </div>
                ) : (
                  <div className="divide-y divide-surface-700/50">
                    {sourceArticles.map((a) => (
                      <div key={a.id} className="px-5 py-4">
                        <a
                          href={a.originalUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="group/art"
                        >
                          <h3 className="font-body font-medium text-text-primary group-hover/art:text-accent-light transition-colors mb-1">
                            {a.title}
                            <span className="ml-1.5 text-text-tertiary text-xs">↗</span>
                          </h3>
                        </a>
                        {a.excerpt && (
                          <p className="text-sm text-text-secondary leading-relaxed mb-2">
                            {truncate(a.excerpt, 240)}
                          </p>
                        )}
                        <div className="flex items-center gap-3 text-xs text-text-tertiary font-mono">
                          <time>{formatDate(a.publishedAt)}</time>
                          {a.linkStatus !== 'valid' && (
                            <span className="text-divergence-moderate">
                              Link: {a.linkStatus}
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      <div className="mt-12 text-xs text-text-tertiary font-mono border-t border-surface-700 pt-6">
        <p>
          Cluster ID: {cluster.id} · Sidst opdateret: {formatDate(cluster.updatedAt)}
        </p>
        <p className="mt-1">
          Alle overskrifter og uddrag tilhører de respektive udgivere. Denne side linker til original journalistik.
        </p>
      </div>
    </div>
  );
}
