import ConfidenceIndicator, { deriveConfidence } from './ConfidenceIndicator';

interface Props {
  confirmed: string[];
  disputed: string[];
  unknown: string[];
  sourceCount: number;
  divergenceScore: number;
}

export default function SignalBlock({ confirmed, disputed, unknown, sourceCount, divergenceScore }: Props) {
  const confidence = deriveConfidence(sourceCount, divergenceScore);
  const total = confirmed.length + disputed.length + unknown.length;
  if (total === 0) return null;

  const confPct = total > 0 ? Math.round((confirmed.length / total) * 100) : 0;
  const dispPct = total > 0 ? Math.round((disputed.length / total) * 100) : 0;
  const unkPct = total > 0 ? Math.round((unknown.length / total) * 100) : 0;

  return (
    <div className="border border-surface-600 rounded-sm overflow-hidden">
      {/* Signal Header with confidence bar */}
      <div className="px-5 py-3 bg-surface-800/60 border-b border-surface-600 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="text-xs font-mono text-accent uppercase tracking-[0.15em] font-medium">Signal Engine</span>
          <span className="text-xs font-mono text-text-tertiary">{sourceCount} kilder</span>
        </div>
        <div className="w-40">
          <ConfidenceIndicator level={confidence} />
        </div>
      </div>

      {/* Visual distribution bar */}
      <div className="flex h-2">
        {confPct > 0 && <div className="bg-divergence-low transition-all" style={{ width: `${confPct}%` }} />}
        {dispPct > 0 && <div className="bg-divergence-moderate transition-all" style={{ width: `${dispPct}%` }} />}
        {unkPct > 0 && <div className="bg-divergence-high transition-all" style={{ width: `${unkPct}%` }} />}
      </div>

      {/* Three columns */}
      <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-surface-600">
        {/* Confirmed */}
        <div className="p-4">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-3 h-3 rounded-sm bg-divergence-low flex items-center justify-center">
              <span className="text-[8px] text-surface-900 font-bold">{confirmed.length}</span>
            </div>
            <h3 className="text-xs font-mono uppercase tracking-wider text-divergence-low font-medium">
              Bekræftet
            </h3>
          </div>
          <ul className="space-y-2">
            {confirmed.map((item, i) => (
              <li key={i} className="text-sm text-text-secondary leading-relaxed flex gap-2">
                <span className="text-divergence-low mt-0.5 flex-shrink-0">✓</span>
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* Disputed */}
        <div className="p-4">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-3 h-3 rounded-sm bg-divergence-moderate flex items-center justify-center">
              <span className="text-[8px] text-surface-900 font-bold">{disputed.length}</span>
            </div>
            <h3 className="text-xs font-mono uppercase tracking-wider text-divergence-moderate font-medium">
              Fortolket forskelligt
            </h3>
          </div>
          <ul className="space-y-2">
            {disputed.map((item, i) => (
              <li key={i} className="text-sm text-text-secondary leading-relaxed flex gap-2">
                <span className="text-divergence-moderate mt-0.5 flex-shrink-0">⇔</span>
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* Unknown */}
        <div className="p-4">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-3 h-3 rounded-sm bg-divergence-high flex items-center justify-center">
              <span className="text-[8px] text-surface-900 font-bold">{unknown.length}</span>
            </div>
            <h3 className="text-xs font-mono uppercase tracking-wider text-divergence-high font-medium">
              Uklart
            </h3>
          </div>
          <ul className="space-y-2">
            {unknown.map((item, i) => (
              <li key={i} className="text-sm text-text-secondary leading-relaxed flex gap-2">
                <span className="text-divergence-high mt-0.5 flex-shrink-0">?</span>
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
