import { sourceProfiles } from '@/data/sources';
import type { Article } from '@/types';

const BIAS_PRECISE: Record<string, { strength: string; bias: string }> = {
  reuters: { strength: 'faktuel disciplin', bias: 'begrænset fortolkning' },
  ap: { strength: 'verificerede facts', bias: 'mangler kontekst og dybde' },
  bbc: { strength: 'stærk kontekst', bias: 'institutionel stabilitetsbias' },
  aljazeera: { strength: 'modperspektiv', bias: 'regional interesseframing' },
  kyivindependent: { strength: 'frontlinjeindsigt', bias: 'national overlevelsesbias' },
  scmp: { strength: 'Kina-perspektiv', bias: 'kommerciel selvcensur' },
  tass: { strength: 'russisk officiel position', bias: 'statskontrolleret narrativ' },
  wion: { strength: 'Global South-vinkel', bias: 'nationalistisk framing' },
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
  const bias = BIAS_PRECISE[sourceKey];

  return (
    <div
      className="border border-surface-600 rounded-sm bg-surface-800/30 overflow-hidden flex flex-col"
      style={{ borderTopWidth: 3, borderTopColor: profile.color }}
    >
      <div className="px-3.5 py-2 border-b border-surface-700/50">
        <div className="flex items-center justify-between mb-0.5">
          <span className="font-mono text-xs font-medium text-text-primary">{profile.shortName}</span>
          <span className="text-[10px] text-text-tertiary font-mono uppercase tracking-wider">{role}</span>
        </div>
        {bias && (
          <p className="text-[10px] leading-tight">
            <span className="text-divergence-low">+ {bias.strength}</span>
            <span className="text-text-tertiary mx-1">–</span>
            <span className="text-divergence-moderate">{bias.bias}</span>
          </p>
        )}
      </div>

      <div className="p-3.5 flex-1 flex flex-col gap-2">
        {lead.summaryDa && (
          <p className="text-sm text-text-primary leading-relaxed">{lead.summaryDa}</p>
        )}

        {lead.briefDa && (() => {
          const match = lead.briefDa!.match(/BUDSKAB:\s*(.+?)(?=KILDENOTE:|$)/s);
          return match?.[1]?.trim() ? (
            <div className="border-l-2 border-surface-600 pl-2.5">
              <span className="text-[10px] font-mono text-text-tertiary uppercase tracking-wider">Budskab</span>
              <p className="text-xs text-text-secondary leading-relaxed mt-0.5">{match[1].trim()}</p>
            </div>
          ) : null;
        })()}

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
