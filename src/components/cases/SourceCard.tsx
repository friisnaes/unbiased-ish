import { sourceProfiles } from '@/data/sources';
import type { Article } from '@/types';

interface Props {
  sourceKey: string;
  role: string;
  articles: Article[];
}

export default function SourceCard({ sourceKey, role, articles }: Props) {
  const profile = sourceProfiles[sourceKey];
  if (!profile || articles.length === 0) return null;

  const lead = articles[0];

  return (
    <div
      className="border border-surface-600 rounded-sm bg-surface-800/30 overflow-hidden"
      style={{ borderTopWidth: 3, borderTopColor: profile.color }}
    >
      <div className="px-4 py-3 border-b border-surface-700/50">
        <div className="flex items-center justify-between">
          <span className="font-mono text-xs font-medium text-text-primary">
            {profile.shortName}
          </span>
          <span className="text-xs text-text-tertiary font-mono">{role}</span>
        </div>
      </div>

      <div className="p-4 space-y-3">
        {/* Summary if available */}
        {lead.summaryDa && (
          <p className="text-sm text-text-primary leading-relaxed">
            {lead.summaryDa}
          </p>
        )}

        {/* Brief sections if available */}
        {lead.briefDa && (() => {
          const budskab = lead.briefDa!.match(/BUDSKAB:\s*(.+?)(?=KILDENOTE:|$)/s)?.[1]?.trim();
          return budskab ? (
            <div className="border-l-2 border-surface-600 pl-3">
              <span className="text-xs font-mono text-text-tertiary uppercase tracking-wider">Budskab</span>
              <p className="text-xs text-text-secondary leading-relaxed mt-0.5">{budskab}</p>
            </div>
          ) : null;
        })()}

        {/* Link to original */}
        {articles.map((a) => (
          <a
            key={a.id}
            href={a.originalUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-start gap-2 text-xs text-text-secondary hover:text-accent-light transition-colors group"
          >
            <span className="text-text-tertiary group-hover:text-accent-light mt-0.5">↗</span>
            <span className="leading-snug">
              Læs {profile.shortName} dækning: <span className="text-text-tertiary italic">{a.title}</span>
            </span>
          </a>
        ))}
      </div>
    </div>
  );
}
