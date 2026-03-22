interface Props {
  canConclude: string[];
  beCareful: string[];
}

export default function SoWhatBlock({ canConclude, beCareful }: Props) {
  if (canConclude.length === 0 && beCareful.length === 0) return null;

  return (
    <div className="border border-accent/30 rounded-sm overflow-hidden bg-accent/[0.03]">
      <div className="px-4 py-2.5 border-b border-accent/20 bg-accent/[0.06]">
        <p className="text-xs font-mono text-accent uppercase tracking-[0.15em] font-medium">
          🧭 Hvad betyder det her?
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-accent/15">
        <div className="p-4">
          <p className="text-xs font-mono text-text-primary font-medium mb-2">
            Med rimelighed kan man konkludere:
          </p>
          <ul className="space-y-1.5">
            {canConclude.map((item, i) => (
              <li key={i} className="text-sm text-text-secondary leading-relaxed flex gap-2">
                <span className="text-divergence-low flex-shrink-0">→</span>
                {item}
              </li>
            ))}
          </ul>
        </div>
        <div className="p-4">
          <p className="text-xs font-mono text-text-primary font-medium mb-2">
            Vær varsom med at konkludere:
          </p>
          <ul className="space-y-1.5">
            {beCareful.map((item, i) => (
              <li key={i} className="text-sm text-text-secondary leading-relaxed flex gap-2">
                <span className="text-divergence-moderate flex-shrink-0">⚠</span>
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
