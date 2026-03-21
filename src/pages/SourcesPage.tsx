import { Link } from 'react-router-dom';
import { enabledSources } from '@/data/sources';
import { useArticles } from '@/hooks/useData';
import SectionHeader from '@/components/SectionHeader';

export default function SourcesPage() {
  const { articles } = useArticles();

  const sources = enabledSources().map((s) => ({
    ...s,
    articleCount: articles.filter((a) => a.sourceKey === s.key).length,
  }));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <SectionHeader
        tag="Kildeprofiler"
        title="Vores kilder — og deres vinkler"
        subtitle="Hver kilde bringer et perspektiv. Ingen er neutral. Her beskriver vi hvad hver kilde typisk gør godt, og hvad du bør være opmærksom på."
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {sources.map((s) => (
          <Link
            key={s.key}
            to={`/sources/${s.key}`}
            className="group border border-surface-600 rounded-sm p-6 hover:border-surface-500 transition-all bg-surface-800/30"
            style={{ borderLeftWidth: 3, borderLeftColor: s.color }}
          >
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="font-display font-bold text-lg text-text-primary group-hover:text-accent-light transition-colors">
                  {s.name}
                </h3>
                <p className="text-xs font-mono text-text-tertiary mt-0.5">
                  {s.type} · {s.country} · Grundlagt {s.founded}
                </p>
              </div>
              <span className="text-xs font-mono text-text-tertiary bg-surface-700 px-2 py-1 rounded-sm">
                {s.articleCount} artikler
              </span>
            </div>

            <p className="font-display font-semibold text-sm text-accent mb-2">
              {s.lensLabel}
            </p>

            <p className="text-sm text-text-secondary leading-relaxed mb-4">
              {s.lensDescription}
            </p>

            <div className="flex gap-4 text-xs text-text-tertiary">
              <span className="text-divergence-low">+ {s.strengths[0]}</span>
              <span className="text-divergence-moderate">⚠ {s.blindSpots[0]}</span>
            </div>
          </Link>
        ))}
      </div>

      <div className="mt-12 border-t border-surface-700 pt-8">
        <p className="text-sm text-text-tertiary leading-relaxed max-w-2xl">
          Kildebeskrivelserne er redaktionel vejledning, ikke objektiv sandhed. De beskriver
          tendenser — ikke absolutte positioner. Alle kilder kan overraske, skifte kurs
          eller levere dækning der bryder med deres sædvanlige mønster.
        </p>
      </div>
    </div>
  );
}
