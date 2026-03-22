import { sourceProfiles } from '@/data/sources';
import type { Article } from '@/types';

const SOURCE_BIAS_INLINE: Record<string, { strength: string; weakness: string }> = {
  reuters: { strength: 'faktuel disciplin', weakness: 'mangler dybde' },
  ap: { strength: 'bekræftede facts', weakness: 'mangler kontekst' },
  bbc: { strength: 'stærk kontekst', weakness: 'vestlig institutionel framing' },
  aljazeera: { strength: 'modperspektiv', weakness: 'regional politisk bias' },
  kyivindependent: { strength: 'frontlinjeindsigt', weakness: 'national vinkel' },
  scmp: { strength: 'Kina-perspektiv', weakness: 'Alibaba-ejerskab, selvcensur' },
  tass: { strength: 'russisk officiel position', weakness: 'statskontrolleret propaganda' },
  wion: { strength: 'Global South-vinkel', weakness: 'indisk nationalistisk bias' },
};

interface Props {
  sourceKey: string;
  role: string;
  articles: Article[];
}

export default function SourceCard({ sourceKey, role, articles }: Props) {
  const profile = sourceProfiles[sourceKey];
  if (!profile || articles.length === 0) return null;

  const lead = articles[0];
  const bias = SOURCE_BIAS_INLINE[sourceKey];

  return (
    <div
      className="border border-surface-600 rounded-sm bg-surface-800/30 overflow-hidden flex flex-col"
      style={{ borderTopWidth: 3, borderTopColor: profile.color }}
    >
      {/* Header */}
      <div className="px-3.5 py-2.5 border-b border-surface-700/50">
        <div className="flex items-center justify-between mb-1">
          <span className="font-mono text-xs font-medium text-text-primary">{profile.shortName}</span>
          <span className="text-[10px] text-text-tertiary font-mono uppercase tracking-wider">{role}</span>
        </div>
        {/* Inline bias — always visible */}
        {bias && (
          <div className="flex gap-2 text-[10px] leading-tight">
            <span className="text-divergence-low">+ {bias.strength}</span>
            <span className="text-divergence-moderate">− {bias.weakness}</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-3.5 flex-1 flex flex-col gap-2.5">
        {/* Summary */}
        {lead.summaryDa && (
          <p className="text-sm text-text-primary leading-relaxed">{lead.summaryDa}</p>
        )}

        {/* Budskab extract */}
        {lead.briefDa && (() => {
          const match = lead.briefDa!.match(/BUDSKAB:\s*(.+?)(?=KILDENOTE:|$)/s);
          return match?.[1]?.trim() ? (
            <div className="border-l-2 border-surface-600 pl-2.5">
              <span className="text-[10px] font-mono text-text-tertiary uppercase tracking-wider">Budskab</span>
              <p className="text-xs text-text-secondary leading-relaxed mt-0.5">{match[1].trim()}</p>
            </div>
          ) : null;
        })()}

        {/* Link */}
        <a
          href={lead.originalUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-auto flex items-start gap-1.5 text-xs text-text-tertiary hover:text-accent-light transition-colors group"
        >
          <span className="group-hover:text-accent-light mt-px">↗</span>
          <span>Læs {profile.shortName} dækning</span>
        </a>
      </div>
    </div>
  );
}
