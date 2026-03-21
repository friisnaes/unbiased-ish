import { useParams, Link } from 'react-router-dom';
import { sourceProfiles } from '@/data/sources';
import { useArticles } from '@/hooks/useData';
import ArticleCard from '@/components/ArticleCard';

export default function SourceDetailPage() {
  const { sourceKey } = useParams<{ sourceKey: string }>();
  const { articles } = useArticles();

  const profile = sourceKey ? sourceProfiles[sourceKey] : undefined;

  if (!profile) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-20 text-center">
        <p className="font-display text-xl text-text-primary mb-4">Kilde ikke fundet</p>
        <Link to="/sources" className="text-sm text-accent hover:text-accent-light font-mono">
          ← Tilbage til kilder
        </Link>
      </div>
    );
  }

  const sourceArticles = articles
    .filter((a) => a.sourceKey === profile.key)
    .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Link
        to="/sources"
        className="text-sm text-text-tertiary hover:text-text-primary font-mono transition-colors mb-6 inline-block"
      >
        ← Alle kilder
      </Link>

      <header className="mb-10" style={{ borderLeftWidth: 4, borderLeftColor: profile.color, paddingLeft: '1.5rem' }}>
        <p className="text-xs font-mono text-accent uppercase tracking-widest mb-2">
          Kildeprofil
        </p>
        <h1 className="font-display font-bold text-3xl text-text-primary mb-2">
          {profile.name}
        </h1>
        <p className="text-text-secondary">
          {profile.type} · {profile.country} · Grundlagt {profile.founded} · {profile.language.toUpperCase()}
        </p>
        <p className="font-display font-semibold text-accent mt-3">
          Linse: {profile.lensLabel}
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        <section>
          <h2 className="text-xs font-mono text-text-secondary uppercase tracking-wider mb-4">
            Udgangspunkt
          </h2>
          <p className="text-sm text-text-secondary leading-relaxed">
            {profile.vantagePoint}
          </p>
        </section>

        <section>
          <h2 className="text-xs font-mono text-text-secondary uppercase tracking-wider mb-4">
            Sådan bruger vi denne kilde
          </h2>
          <p className="text-sm text-text-secondary leading-relaxed">
            {profile.howWeUseIt}
          </p>
        </section>

        <section>
          <h2 className="text-xs font-mono text-divergence-low uppercase tracking-wider mb-4">
            Styrker
          </h2>
          <ul className="space-y-2">
            {profile.strengths.map((s, i) => (
              <li key={i} className="text-sm text-text-secondary flex gap-2">
                <span className="text-divergence-low mt-0.5">+</span>
                {s}
              </li>
            ))}
          </ul>
        </section>

        <section>
          <h2 className="text-xs font-mono text-divergence-moderate uppercase tracking-wider mb-4">
            Blinde vinkler
          </h2>
          <ul className="space-y-2">
            {profile.blindSpots.map((s, i) => (
              <li key={i} className="text-sm text-text-secondary flex gap-2">
                <span className="text-divergence-moderate mt-0.5">⚠</span>
                {s}
              </li>
            ))}
          </ul>
        </section>
      </div>

      <div className="border border-surface-600 rounded-sm p-5 bg-surface-800/30 mb-12">
        <h2 className="text-xs font-mono text-accent uppercase tracking-wider mb-3">
          Hvad du bør være opmærksom på
        </h2>
        <p className="text-sm text-text-secondary leading-relaxed">
          {profile.whatToWatch}
        </p>
      </div>

      {/* Articles from this source */}
      <section>
        <h2 className="text-xs font-mono text-text-secondary uppercase tracking-wider mb-6">
          Seneste artikler fra {profile.shortName} ({sourceArticles.length})
        </h2>

        {sourceArticles.length === 0 ? (
          <p className="text-sm text-text-tertiary italic">
            Ingen artikler indekseret endnu fra denne kilde.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {sourceArticles.slice(0, 10).map((a) => (
              <ArticleCard key={a.id} article={a} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
