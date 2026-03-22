import { useParams, Link } from 'react-router-dom';
import { useArticles, useClusters } from '@/hooks/useData';
import { sourceProfiles } from '@/data/sources';
import { SIGNATURE_CASE, SIGNATURE_ARTICLES } from '@/data/signatureCase';
import { timeAgo, formatDate, truncate } from '@/utils/format';
import DivergenceBadge from '@/components/DivergenceBadge';
import SourceBadge from '@/components/SourceBadge';
import SignalBlock from '@/components/cases/SignalBlock';
import SoWhatBlock from '@/components/cases/SoWhatBlock';
import BiasProfile from '@/components/cases/BiasProfile';
import ConfidenceIndicator, { deriveConfidence, deriveConfidenceExplanation } from '@/components/cases/ConfidenceIndicator';
import EditorialNote from '@/components/cases/EditorialNote';
import FrictionBlock from '@/components/cases/FrictionBlock';
import DisagreementHeat from '@/components/cases/DisagreementHeat';

export default function StoryDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const { articles: liveArticles } = useArticles();
  const { clusters: liveClusters, loading } = useClusters();

  // Merge signature case
  const allArticles = [...SIGNATURE_ARTICLES, ...liveArticles];
  const cluster = slug === SIGNATURE_CASE.slug
    ? SIGNATURE_CASE
    : liveClusters.find((c) => c.slug === slug);

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

  const clusterArticles = allArticles
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
        <div className="flex items-center gap-3 mb-4 flex-wrap">
          <ConfidenceIndicator level={deriveConfidence(cluster.coverageCount, cluster.divergenceScore)} compact />
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

        {/* AI Cluster Analysis */}
        {cluster.clusterAnalysisDa && (
          <div className="mt-6 border border-surface-600 rounded-sm bg-surface-800/40 p-5">
            <p className="text-xs font-mono text-accent uppercase tracking-wider mb-3">
              AI-analyse af dækningen
            </p>
            {cluster.clusterAnalysisDa.split('\n').map((para, i) => (
              para.trim() ? (
                <p key={i} className="text-sm text-text-secondary leading-relaxed mb-2">
                  {para}
                </p>
              ) : null
            ))}
            <p className="text-xs text-text-tertiary italic mt-3">
              Denne analyse er automatisk genereret baseret på overskrifter og uddrag. Den kan indeholde fejl.
            </p>
          </div>
        )}

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

      {/* ── Signal Engine™ ── */}
      {cluster.synthesisKnown && cluster.synthesisKnown.length > 0 && (
        <section className="mb-8">
          <SignalBlock
            confirmed={cluster.synthesisKnown}
            disputed={cluster.synthesisDisputed || []}
            unknown={cluster.synthesisUnclear || []}
            sourceCount={cluster.coverageCount}
            divergenceScore={cluster.divergenceScore}
          />
        </section>
      )}

      {/* ── Confidence med forklaring ── */}
      <section className="mb-8 grid grid-cols-1 md:grid-cols-2 gap-4">
        <ConfidenceIndicator
          level={deriveConfidence(cluster.coverageCount, cluster.divergenceScore)}
          explanation={cluster.confidenceExplanation || deriveConfidenceExplanation(cluster.coverageCount, cluster.divergenceScore)}
        />
        <div className="border border-surface-600 rounded-sm p-3 bg-surface-800/30">
          <DisagreementHeat score={cluster.divergenceScore} />
        </div>
      </section>

      {/* ── So What ── */}
      {cluster.soWhatConclude && cluster.soWhatConclude.length > 0 && (
        <section className="mb-8">
          <SoWhatBlock
            canConclude={cluster.soWhatConclude}
            beCareful={cluster.soWhatCareful || []}
          />
        </section>
      )}

      {/* ── Friction ── */}
      {cluster.coverageCount >= 3 && (
        <section className="mb-8">
          <FrictionBlock sourceKeys={cluster.sourceKeys} />
        </section>
      )}

      {/* ── Bias profiles ── */}
      <section className="mb-10">
        <h2 className="text-xs font-mono text-text-secondary uppercase tracking-widest mb-4">
          Kilder i denne case — bias-profiler
        </h2>
        <div className="space-y-2 border border-surface-600 rounded-sm p-4 bg-surface-800/20">
          {cluster.sourceKeys.map((sk) => (
            <BiasProfile key={sk} sourceKey={sk} compact />
          ))}
        </div>
      </section>

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
                        {/* Danish summary */}
                        {a.summaryDa && (
                          <p className="text-sm text-text-primary leading-relaxed mb-2 border-l-2 border-accent/40 pl-3">
                            {a.summaryDa}
                          </p>
                        )}

                        {/* Original title as link */}
                        <a
                          href={a.originalUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="group/art"
                        >
                          <h3 className={`font-body transition-colors mb-2 group-hover/art:text-accent-light ${a.summaryDa ? 'text-sm text-text-secondary' : 'font-medium text-text-primary'}`}>
                            {a.summaryDa && <span className="text-text-tertiary text-xs font-mono mr-1.5">Original:</span>}
                            {a.title}
                            <span className="ml-1.5 text-text-tertiary text-xs">↗</span>
                          </h3>
                        </a>

                        {/* Full article brief — show expanded in story detail */}
                        {a.briefDa && (
                          <div className="mt-2 mb-3 space-y-2 pl-3 border-l border-surface-600">
                            {(() => {
                              const indhold = a.briefDa!.match(/INDHOLD:\s*(.+?)(?=BUDSKAB:|KILDENOTE:|$)/s)?.[1]?.trim();
                              const budskab = a.briefDa!.match(/BUDSKAB:\s*(.+?)(?=KILDENOTE:|$)/s)?.[1]?.trim();
                              const kildenote = a.briefDa!.match(/KILDENOTE:\s*(.+?)$/s)?.[1]?.trim();
                              return (
                                <>
                                  {indhold && (
                                    <div>
                                      <span className="text-xs font-mono text-text-tertiary uppercase tracking-wider">Indhold</span>
                                      <p className="text-sm text-text-secondary leading-relaxed">{indhold}</p>
                                    </div>
                                  )}
                                  {budskab && (
                                    <div>
                                      <span className="text-xs font-mono text-text-tertiary uppercase tracking-wider">Budskab</span>
                                      <p className="text-sm text-text-secondary leading-relaxed">{budskab}</p>
                                    </div>
                                  )}
                                  {kildenote && (
                                    <div>
                                      <span className="text-xs font-mono text-divergence-moderate uppercase tracking-wider">Kildenote</span>
                                      <p className="text-xs text-text-tertiary leading-relaxed italic">{kildenote}</p>
                                    </div>
                                  )}
                                </>
                              );
                            })()}
                          </div>
                        )}

                        {/* Fallback excerpt */}
                        {!a.summaryDa && !a.briefDa && a.excerpt && (
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

      <EditorialNote
        note={cluster.editorialNote}
        sources={cluster.sourceKeys}
        topics={cluster.topicTags}
        updatedAt={cluster.updatedAt}
      />
    </div>
  );
}
