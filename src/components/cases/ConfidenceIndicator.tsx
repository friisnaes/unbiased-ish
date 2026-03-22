interface Props {
  level: 'high' | 'medium' | 'low';
  explanation?: string;
  compact?: boolean;
}

const CONFIG = {
  high: {
    color: 'bg-divergence-low', text: 'text-divergence-low',
    label: 'Høj sikkerhed',
    defaultExplanation: 'Flere uafhængige kilder bekræfter hændelsen. Uenighed er primært fortolkning.',
  },
  medium: {
    color: 'bg-divergence-moderate', text: 'text-divergence-moderate',
    label: 'Medium sikkerhed',
    defaultExplanation: 'Fakta delvist bekræftet. Klar uenighed om betydning eller motiv.',
  },
  low: {
    color: 'bg-divergence-high', text: 'text-divergence-high',
    label: 'Lav sikkerhed',
    defaultExplanation: 'Modstridende narrativer. Manglende uafhængig verificering.',
  },
};

export default function ConfidenceIndicator({ level, explanation, compact }: Props) {
  const c = CONFIG[level];

  if (compact) {
    return (
      <span className={`inline-flex items-center gap-1.5 text-xs font-mono ${c.text}`}>
        <span className={`w-2 h-2 rounded-full ${c.color}`} />
        {c.label}
      </span>
    );
  }

  const exp = explanation || c.defaultExplanation;

  return (
    <div className="border border-surface-600 rounded-sm p-3 bg-surface-800/30">
      <div className="flex items-center gap-2 mb-1.5">
        <span className={`w-2.5 h-2.5 rounded-full ${c.color}`} />
        <span className={`text-xs font-mono ${c.text} font-medium uppercase tracking-wider`}>{c.label}</span>
      </div>
      <p className="text-xs text-text-secondary leading-relaxed pl-[18px]">{exp}</p>
    </div>
  );
}

export function deriveConfidence(sourceCount: number, divergenceScore: number): 'high' | 'medium' | 'low' {
  if (sourceCount >= 4 && divergenceScore < 0.4) return 'high';
  if (sourceCount >= 3 && divergenceScore < 0.6) return 'medium';
  return 'low';
}

export function deriveConfidenceExplanation(sourceCount: number, divergenceScore: number): string {
  const level = deriveConfidence(sourceCount, divergenceScore);
  if (level === 'high') {
    return `${sourceCount} uafhængige kilder bekræfter kernen. Lav uenighed om fakta — uenighed handler om fortolkning.`;
  }
  if (level === 'medium') {
    return `${sourceCount} kilder dækker historien. Fakta delvist bekræftet, men tydelig uenighed om motiv og konsekvens.`;
  }
  return `${sourceCount} kilder med modstridende narrativer. Manglende uafhængig verificering på centrale påstande.`;
}
