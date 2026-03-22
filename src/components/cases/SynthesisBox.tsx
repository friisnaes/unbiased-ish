interface Props {
  known: string[];
  disputed: string[];
  unclear: string[];
}

export default function SynthesisBox({ known, disputed, unclear }: Props) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-0 border border-surface-600 rounded-sm overflow-hidden">
      {/* Known */}
      <div className="p-5 bg-divergence-low/5 border-b md:border-b-0 md:border-r border-surface-600">
        <div className="flex items-center gap-2 mb-3">
          <span className="w-2 h-2 rounded-full bg-divergence-low" />
          <h3 className="text-xs font-mono uppercase tracking-widest text-divergence-low font-medium">
            Det vi ved
          </h3>
        </div>
        <ul className="space-y-2">
          {known.map((item, i) => (
            <li key={i} className="text-sm text-text-secondary leading-relaxed">
              {item}
            </li>
          ))}
        </ul>
      </div>

      {/* Disputed */}
      <div className="p-5 bg-divergence-moderate/5 border-b md:border-b-0 md:border-r border-surface-600">
        <div className="flex items-center gap-2 mb-3">
          <span className="w-2 h-2 rounded-full bg-divergence-moderate" />
          <h3 className="text-xs font-mono uppercase tracking-widest text-divergence-moderate font-medium">
            Det der fortolkes forskelligt
          </h3>
        </div>
        <ul className="space-y-2">
          {disputed.map((item, i) => (
            <li key={i} className="text-sm text-text-secondary leading-relaxed">
              {item}
            </li>
          ))}
        </ul>
      </div>

      {/* Unclear */}
      <div className="p-5 bg-divergence-high/5">
        <div className="flex items-center gap-2 mb-3">
          <span className="w-2 h-2 rounded-full bg-divergence-high" />
          <h3 className="text-xs font-mono uppercase tracking-widest text-divergence-high font-medium">
            Det der er uklart
          </h3>
        </div>
        <ul className="space-y-2">
          {unclear.map((item, i) => (
            <li key={i} className="text-sm text-text-secondary leading-relaxed">
              {item}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
