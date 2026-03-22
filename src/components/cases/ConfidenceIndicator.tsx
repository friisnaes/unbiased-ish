interface Props {
  level: 'high' | 'medium' | 'low';
  compact?: boolean;
}

const CONFIG = {
  high: { color: 'bg-divergence-low', text: 'text-divergence-low', label: 'Høj sikkerhed', icon: '🟢', pct: 'w-full' },
  medium: { color: 'bg-divergence-moderate', text: 'text-divergence-moderate', label: 'Medium sikkerhed', icon: '🟡', pct: 'w-2/3' },
  low: { color: 'bg-divergence-high', text: 'text-divergence-high', label: 'Lav sikkerhed', icon: '🔴', pct: 'w-1/3' },
};

export default function ConfidenceIndicator({ level, compact }: Props) {
  const c = CONFIG[level];

  if (compact) {
    return (
      <span className={`inline-flex items-center gap-1.5 text-xs font-mono ${c.text}`}>
        <span className={`w-2 h-2 rounded-full ${c.color}`} />
        {c.label}
      </span>
    );
  }

  return (
    <div className="flex items-center gap-3">
      <div className="flex-1">
        <div className="flex items-center justify-between mb-1">
          <span className={`text-xs font-mono ${c.text} font-medium`}>{c.label}</span>
        </div>
        <div className="h-1.5 bg-surface-700 rounded-full overflow-hidden">
          <div className={`h-full rounded-full ${c.color} ${c.pct} transition-all`} />
        </div>
      </div>
    </div>
  );
}

export function deriveConfidence(sourceCount: number, divergenceScore: number): 'high' | 'medium' | 'low' {
  if (sourceCount >= 4 && divergenceScore < 0.4) return 'high';
  if (sourceCount >= 3 && divergenceScore < 0.6) return 'medium';
  return 'low';
}
