import { Link } from 'react-router-dom';
import type { StoryCluster, Article } from '@/types';
import { timeAgo } from '@/utils/format';
import { sourceProfiles } from '@/data/sources';
import DivergenceBadge from './DivergenceBadge';
import SourceBadge from './SourceBadge';

interface Props {
  cluster: StoryCluster;
  articles: Article[];
}

export default function StoryClusterCard({ cluster, articles }: Props) {
  const clusterArticles = articles.filter((a) =>
    cluster.articleIds.includes(a.id)
  );

  return (
    <Link
      to={`/stories/${cluster.slug}`}
      className="group block border border-surface-600 bg-surface-800/40 rounded-sm p-5 hover:border-surface-500 hover:bg-surface-800/70 transition-all"
    >
      <div className="flex items-start justify-between gap-4 mb-3">
        <DivergenceBadge
          level={cluster.divergenceLevel}
          score={cluster.divergenceScore}
        />
        <span className="text-xs font-mono text-text-tertiary">
          {cluster.coverageCount} kilder
        </span>
      </div>

      <h3 className="font-display font-bold text-lg text-text-primary leading-snug mb-2 group-hover:text-accent-light transition-colors">
        {cluster.title}
      </h3>

      <p className="text-sm text-text-secondary leading-relaxed mb-4">
        {cluster.summary}
      </p>

      <div className="flex items-center gap-2 mb-3 flex-wrap">
        {cluster.sourceKeys.map((sk) => (
          <SourceBadge key={sk} sourceKey={sk} linked={false} />
        ))}
      </div>

      {cluster.divergenceLabel && (
        <p className="text-xs text-text-tertiary italic mb-3">
          {cluster.divergenceLabel}
        </p>
      )}

      <div className="editorial-rule pt-3 flex items-center justify-between">
        <div className="flex gap-2 flex-wrap">
          {cluster.topicTags.slice(0, 3).map((t) => (
            <span
              key={t}
              className="text-xs font-mono text-text-tertiary bg-surface-700 px-2 py-0.5 rounded-sm"
            >
              {t}
            </span>
          ))}
        </div>
        <time className="text-xs font-mono text-text-tertiary">
          {timeAgo(cluster.updatedAt)}
        </time>
      </div>

      {clusterArticles.length > 0 && (
        <div className="mt-4 space-y-2">
          {clusterArticles.slice(0, 3).map((a) => (
            <div
              key={a.id}
              className="flex items-start gap-2 text-xs text-text-tertiary"
            >
              <span
                className="w-1 h-1 rounded-full mt-1.5 flex-shrink-0"
                style={{ backgroundColor: sourceProfiles[a.sourceKey]?.color || '#666' }}
              />
              <span className="line-clamp-1">{a.title}</span>
            </div>
          ))}
        </div>
      )}
    </Link>
  );
}
