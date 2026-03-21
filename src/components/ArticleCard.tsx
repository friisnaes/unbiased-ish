import type { Article } from '@/types';
import { timeAgo, truncate } from '@/utils/format';
import SourceBadge from './SourceBadge';

interface Props {
  article: Article;
}

export default function ArticleCard({ article }: Props) {
  return (
    <article className="group border border-surface-600 bg-surface-800/50 rounded-sm p-4 hover:border-surface-500 transition-colors">
      <div className="flex items-start justify-between gap-3 mb-2">
        <SourceBadge sourceKey={article.sourceKey} />
        {article.linkStatus === 'broken' && (
          <span className="text-xs font-mono text-accent">Link ubekræftet</span>
        )}
        {article.linkStatus === 'uncertain' && (
          <span className="text-xs font-mono text-divergence-moderate">Link usikker</span>
        )}
      </div>

      <a
        href={article.originalUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="block group/link"
      >
        <h3 className="font-display font-semibold text-text-primary leading-snug mb-2 group-hover/link:text-accent-light transition-colors">
          {article.title}
          <span className="ml-1.5 text-text-tertiary text-sm link-arrow">↗</span>
        </h3>
      </a>

      {article.excerpt && (
        <p className="text-sm text-text-secondary leading-relaxed mb-3">
          {truncate(article.excerpt, 180)}
        </p>
      )}

      <div className="flex items-center gap-3 text-xs text-text-tertiary font-mono">
        <time>{timeAgo(article.publishedAt)}</time>
        {article.topicTags.length > 0 && (
          <>
            <span className="text-surface-600">|</span>
            <span>{article.topicTags.slice(0, 2).join(', ')}</span>
          </>
        )}
      </div>
    </article>
  );
}
