import { useState } from 'react';
import type { Article } from '@/types';
import { timeAgo, truncate } from '@/utils/format';
import SourceBadge from './SourceBadge';

interface Props {
  article: Article;
  expanded?: boolean;
}

function BriefSection({ label, content }: { label: string; content: string }) {
  return (
    <div className="mb-2">
      <span className="text-xs font-mono text-accent uppercase tracking-wider">{label}</span>
      <p className="text-sm text-text-secondary leading-relaxed mt-0.5">{content}</p>
    </div>
  );
}

export default function ArticleCard({ article, expanded: startExpanded }: Props) {
  const [expanded, setExpanded] = useState(startExpanded || false);

  // Parse briefDa sections
  const briefSections = article.briefDa ? parseBrief(article.briefDa) : null;

  return (
    <article className="group border border-surface-600 bg-surface-800/50 rounded-sm p-4 hover:border-surface-500 transition-colors">
      <div className="flex items-start justify-between gap-3 mb-2">
        <SourceBadge sourceKey={article.sourceKey} />
        <div className="flex items-center gap-2">
          {article.linkStatus === 'broken' && (
            <span className="text-xs font-mono text-accent">Link ubekræftet</span>
          )}
          {article.linkStatus === 'uncertain' && (
            <span className="text-xs font-mono text-divergence-moderate">Link usikker</span>
          )}
        </div>
      </div>

      {/* Danish summary — primary display */}
      {article.summaryDa && (
        <p className="text-sm text-text-primary leading-relaxed mb-2 border-l-2 border-accent/40 pl-3">
          {article.summaryDa}
        </p>
      )}

      {/* Original title as link */}
      <a
        href={article.originalUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="block group/link mb-2"
      >
        <h3 className="font-body text-text-secondary text-sm leading-snug group-hover/link:text-accent-light transition-colors">
          <span className="text-text-tertiary text-xs font-mono mr-1.5">Original:</span>
          {article.title}
          <span className="ml-1.5 text-text-tertiary text-xs">↗</span>
        </h3>
      </a>

      {/* Expandable brief */}
      {briefSections && (
        <>
          <button
            onClick={() => setExpanded(!expanded)}
            className="text-xs font-mono text-accent hover:text-accent-light transition-colors mb-2"
          >
            {expanded ? '— Skjul analyse' : '+ Vis indhold & budskab'}
          </button>

          {expanded && (
            <div className="mt-2 pt-3 border-t border-surface-700/50 space-y-1">
              {briefSections.indhold && (
                <BriefSection label="Indhold" content={briefSections.indhold} />
              )}
              {briefSections.budskab && (
                <BriefSection label="Budskab" content={briefSections.budskab} />
              )}
              {briefSections.kildenote && (
                <BriefSection label="Kildenote" content={briefSections.kildenote} />
              )}
            </div>
          )}
        </>
      )}

      {/* Fallback excerpt if no brief */}
      {!article.summaryDa && !briefSections && article.excerpt && (
        <p className="text-sm text-text-secondary leading-relaxed mb-3">
          {truncate(article.excerpt, 180)}
        </p>
      )}

      <div className="flex items-center gap-3 text-xs text-text-tertiary font-mono mt-2">
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

function parseBrief(brief: string): { indhold?: string; budskab?: string; kildenote?: string } | null {
  const result: Record<string, string> = {};

  const indholdMatch = brief.match(/INDHOLD:\s*(.+?)(?=BUDSKAB:|KILDENOTE:|$)/s);
  if (indholdMatch) result.indhold = indholdMatch[1].trim();

  const budskabMatch = brief.match(/BUDSKAB:\s*(.+?)(?=KILDENOTE:|$)/s);
  if (budskabMatch) result.budskab = budskabMatch[1].trim();

  const kildeMatch = brief.match(/KILDENOTE:\s*(.+?)$/s);
  if (kildeMatch) result.kildenote = kildeMatch[1].trim();

  return Object.keys(result).length > 0 ? result : null;
}
