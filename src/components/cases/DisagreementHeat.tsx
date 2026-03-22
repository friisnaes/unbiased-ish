interface Props {
  score: number; // 0–1
  compact?: boolean;
}

export default function DisagreementHeat({ score, compact }: Props) {
  let level: 'low' | 'moderate' | 'high';
  let icon: string;
  let label: string;
  let color: string;

  if (score >= 0.6) {
    level = 'high'; icon = '🔥'; label = 'Høj uenighed'; color = 'text-divergence-high';
  } else if (score >= 0.35) {
    level = 'moderate'; icon = '⚠️'; label = 'Moderat uenighed'; color = 'text-divergence-moderate';
  } else {
    level = 'low'; icon = '✅'; label = 'Lav uenighed'; color = 'text-divergence-low';
  }

  if (compact) {
    return (
      <span className={`inline-flex items-center gap-1 text-xs font-mono ${color}`}>
        <span>{icon}</span> {label}
      </span>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm">{icon}</span>
      <div className="flex-1">
        <div className="flex items-center justify-between mb-0.5">
          <span className={`text-xs font-mono ${color} font-medium`}>{label}</span>
          <span className="text-xs font-mono text-text-tertiary">{Math.round(score * 100)}%</span>
        </div>
        <div className="h-1 bg-surface-700 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all ${
              level === 'high' ? 'bg-divergence-high' :
              level === 'moderate' ? 'bg-divergence-moderate' : 'bg-divergence-low'
            }`}
            style={{ width: `${Math.round(score * 100)}%` }}
          />
        </div>
      </div>
    </div>
  );
}
