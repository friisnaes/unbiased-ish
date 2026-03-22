import { Link } from 'react-router-dom';
import type { StoryCluster, Article } from '@/types';
import { timeAgo } from '@/utils/format';
import DivergenceBadge from '@/components/DivergenceBadge';
import SourceCard from './SourceCard';
import SynthesisBox from './SynthesisBox';

const SOURCE_ROLES: Record<string, string> = {
  reuters: 'Rå fakta',
  ap: 'Rå fakta',
  bbc: 'Kontekst',
  aljazeera: 'Modperspektiv',
  kyivindependent: 'Frontlinje',
  scmp: 'Kina-vinkel',
  tass: 'Russisk stat',
  wion: 'Global South',
};

interface Props {
  cluster: StoryCluster;
  articles: Article[];
  featured?: boolean;
}

export default function CaseBlock({ cluster, articles, featured }: Props) {
  const clusterArticles = articles.filter((a) =>
    cluster.articleIds.includes(a.id)
  );

  // Group by source
  const bySource = new Map<string, Article[]>();
  for (const a of clusterArticles) {
    if (!bySource.has(a.sourceKey)) bySource.set(a.sourceKey, []);
    bySource.get(a.sourceKey)!.push(a);
  }

  // Use proper synthesis data if available
  const hasSynthesis = cluster.synthesisKnown && cluster.synthesisKnown.length > 0;

  return (
    <div className={`${featured ? '' : 'border border-surface-600 rounded-sm bg-surface-800/20 p-5 md:p-6'}`}>
      {/* Case Header */}
      <div className="mb-5">
        <div className="flex items-center gap-3 mb-3">
          <DivergenceBadge level={cluster.divergenceLevel} score={cluster.divergenceScore} />
          <span className="text-xs font-mono text-text-tertiary">
            {cluster.coverageCount} kilder · {timeAgo(cluster.updatedAt)}
          </span>
        </div>

        <Link to={`/stories/${cluster.slug}`}>
          <h2 className={`font-display font-bold text-text-primary leading-tight mb-2 hover:text-accent-light transition-colors ${featured ? 'text-2xl md:text-3xl' : 'text-lg'}`}>
            {cluster.title}
          </h2>
        </Link>
      </div>

      {/* Source Cards */}
      <div className={`grid grid-cols-1 sm:grid-cols-2 ${featured ? 'lg:grid-cols-4' : 'lg:grid-cols-3'} gap-3 mb-5`}>
        {cluster.sourceKeys.map((sk) => (
          <SourceCard
            key={sk}
            sourceKey={sk}
            role={SOURCE_ROLES[sk] || 'Kilde'}
            articles={bySource.get(sk)?.slice(0, 1) || []}
          />
        ))}
      </div>

      {/* Synthesis Box */}
      {hasSynthesis && (
        <div className="mb-5">
          <SynthesisBox
            known={cluster.synthesisKnown!}
            disputed={cluster.synthesisDisputed || []}
            unclear={cluster.synthesisUnclear || []}
          />
        </div>
      )}

      {/* Cluster analysis fallback */}
      {!hasSynthesis && cluster.clusterAnalysisDa && (
        <div className="border border-surface-600 rounded-sm p-4 bg-surface-800/30 mb-5">
          <p className="text-xs font-mono text-text-tertiary uppercase tracking-wider mb-2">Analyse</p>
          <p className="text-sm text-text-secondary leading-relaxed">{cluster.clusterAnalysisDa}</p>
        </div>
      )}

      {/* Editorial Note */}
      <div className="pt-3 border-t border-surface-700/50">
        {cluster.editorialNote && (
          <p className="text-xs text-text-tertiary italic mb-2">
            Redaktionel note: {cluster.editorialNote}
          </p>
        )}
        <div className="flex items-center justify-between text-xs text-text-tertiary font-mono">
          <span>
            Kilder: {cluster.sourceKeys.join(', ')} · Emner: {cluster.topicTags.slice(0, 3).join(', ')}
          </span>
          <Link to={`/stories/${cluster.slug}`} className="text-accent hover:text-accent-light transition-colors">
            Fuld case →
          </Link>
        </div>
      </div>
    </div>
  );
}
