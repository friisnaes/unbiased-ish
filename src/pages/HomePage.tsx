import { Link } from 'react-router-dom';
import { useArticles, useClusters, useSiteConfig } from '@/hooks/useData';
import { sourceProfiles, enabledSources } from '@/data/sources';
import StoryClusterCard from '@/components/StoryClusterCard';
import CoverageMatrix from '@/components/CoverageMatrix';
import SectionHeader from '@/components/SectionHeader';
import DivergenceBadge from '@/components/DivergenceBadge';

export default function HomePage() {
  const { articles } = useArticles();
  const { clusters } = useClusters();
  const config = useSiteConfig();

  const highDiv = clusters
    .filter((c) => c.divergenceLevel === 'high')
    .slice(0, 8);
  const moderateDiv = clusters
    .filter((c) => c.divergenceLevel === 'moderate')
    .slice(0, 6);
  const recent = [...clusters]
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
    .slice(0, 12);

  return (
    <div>
      {/* ── Hero ── */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-accent/5 via-transparent to-transparent" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16 relative">
          <div className="max-w-3xl">
            <p className="text-xs font-mono text-accent uppercase tracking-[0.2em] mb-6 animate-fade-in">
              Perspektiver på geopolitik
            </p>
            <h1 className="font-display font-extrabold text-hero text-text-primary mb-6 animate-slide-up">
              Signal
              <span className="text-text-tertiary font-light"> over </span>
              Støj
            </h1>
            <p className="text-xl text-text-secondary leading-relaxed mb-8 animate-slide-up stagger-1 opacity-0">
              Denne side samler ikke sandheden. Den samler perspektiver.
            </p>
            <div className="animate-slide-up stagger-2 opacity-0">
              <p className="text-text-secondary leading-relaxed mb-4">
                Når fem nyhedskilder dækker den samme historie, fortæller de sjældent den
                samme historie. Signal over Støj gør de forskelle synlige — så du kan
                træffe bedre beslutninger om hvad du læser, og hvad du overser.
              </p>
              <div className="border-l-2 border-accent/60 pl-4 my-6">
                <p className="text-text-secondary italic">
                  Denne side prøver ikke at være neutral.
                  <br />
                  Den prøver at gøre vinkler synlige.
                </p>
              </div>
            </div>
            <div className="flex gap-4 animate-slide-up stagger-3 opacity-0">
              <Link
                to="/stories"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-accent hover:bg-accent-light text-text-primary text-sm font-medium rounded-sm transition-colors"
              >
                Se historier
                <span className="text-xs">→</span>
              </Link>
              <Link
                to="/methodology"
                className="inline-flex items-center gap-2 px-5 py-2.5 border border-surface-600 hover:border-surface-500 text-text-secondary text-sm rounded-sm transition-colors"
              >
                Sådan læser du siden
              </Link>
            </div>
          </div>

          {config && (
            <div className="mt-12 flex gap-8 text-xs font-mono text-text-tertiary animate-fade-in stagger-4 opacity-0">
              <span>{config.totalArticles} artikler indekseret</span>
              <span>{config.totalClusters} historier sporet</span>
              <span>{enabledSources().length} kilder aktive</span>
            </div>
          )}
        </div>
      </section>

      {/* ── How to read ── */}
      <section className="border-t border-surface-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <SectionHeader
            tag="Læseguide"
            title="Sådan bruger du Signal over Støj"
          />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                num: '01',
                title: 'Ét datapunkt er støj',
                body: 'En enkelt overskrift fra én kilde er ikke nok til at forstå en historie. Det er bare et udgangspunkt.',
              },
              {
                num: '02',
                title: 'Tre datapunkter er mønster',
                body: 'Når tre kilder dækker det samme forskelligt, begynder du at se mønstre — og vinkler.',
              },
              {
                num: '03',
                title: 'Fem datapunkter er beslutningsgrundlag',
                body: 'Med fem perspektiver kan du begynde at danne dig et kvalificeret billede. Ikke sandheden — men et fundament.',
              },
            ].map((item) => (
              <div
                key={item.num}
                className="border border-surface-600 rounded-sm p-6 bg-surface-800/30"
              >
                <span className="text-xs font-mono text-accent">{item.num}</span>
                <h3 className="font-display font-semibold text-text-primary mt-2 mb-3">
                  {item.title}
                </h3>
                <p className="text-sm text-text-secondary leading-relaxed">
                  {item.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Source Lenses ── */}
      <section className="border-t border-surface-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <SectionHeader
            tag="Kildelinser"
            title="Hvad hver kilde typisk bringer"
            subtitle="Disse er redaktionelle tendenser, ikke absolutte sandheder. Læs mere på de individuelle kildeprofiler."
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {enabledSources().map((s) => (
              <Link
                key={s.key}
                to={`/sources/${s.key}`}
                className="group border border-surface-600 rounded-sm p-4 hover:border-surface-500 transition-colors bg-surface-800/20"
              >
                <div
                  className="w-8 h-0.5 mb-3 rounded-full"
                  style={{ backgroundColor: s.color }}
                />
                <p className="font-mono text-xs text-text-tertiary mb-1">{s.shortName}</p>
                <p className="font-display font-semibold text-sm text-text-primary mb-2">
                  {s.lensLabel}
                </p>
                <p className="text-xs text-text-secondary leading-relaxed line-clamp-3">
                  {s.lensDescription}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── High Divergence ── */}
      {highDiv.length > 0 && (
        <section className="border-t border-surface-700">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <SectionHeader
              tag="Høj divergens"
              title="Her er kilderne mest uenige"
              subtitle="Historier hvor dækningen divergerer mest. Disse fortjener ekstra opmærksomhed."
            />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {highDiv.map((c) => (
                <StoryClusterCard key={c.id} cluster={c} articles={articles} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Moderate Divergence ── */}
      {moderateDiv.length > 0 && (
        <section className="border-t border-surface-700">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <SectionHeader
              tag="Moderat divergens"
              title="Tydelige forskelle i dækning"
              subtitle="Kilderne er enige om fakta, men vinkler og fokus varierer."
            />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {moderateDiv.map((c) => (
                <StoryClusterCard key={c.id} cluster={c} articles={articles} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Coverage Matrix ── */}
      {clusters.length > 0 && (
        <section className="border-t border-surface-700">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <SectionHeader
              tag="Dækningsmatrix"
              title="Hvem dækker hvad"
              subtitle="En hurtig oversigt over hvilke kilder der dækker de samme historier."
            />
            <div className="border border-surface-600 rounded-sm p-4 bg-surface-800/30">
              <CoverageMatrix clusters={clusters} />
            </div>
          </div>
        </section>
      )}

      {/* ── Recent Stories ── */}
      {recent.length > 0 && (
        <section className="border-t border-surface-700">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="flex items-end justify-between mb-8">
              <SectionHeader tag="Seneste" title="Nyeste historier" />
              <Link
                to="/stories"
                className="text-sm text-text-secondary hover:text-text-primary transition-colors font-mono"
              >
                Alle historier →
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recent.map((c) => (
                <StoryClusterCard key={c.id} cluster={c} articles={articles} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Methodology Teaser ── */}
      <section className="border-t border-surface-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="max-w-2xl">
            <p className="text-xs font-mono text-accent uppercase tracking-widest mb-4">
              Transparens
            </p>
            <p className="font-display text-xl text-text-primary leading-relaxed mb-4">
              Formålet er ikke at skjule bias.
              <br />
              Formålet er at gøre bias synlig.
            </p>
            <p className="text-sm text-text-secondary leading-relaxed mb-6">
              Signal over Støj er bygget på åbne feeds og offentlige API'er. Hver
              kilde er beskrevet med styrker, blinde vinkler og redaktionel position.
              Ingen kilde præsenteres som neutral — heller ikke denne side.
            </p>
            <Link
              to="/methodology"
              className="text-sm font-mono text-accent hover:text-accent-light transition-colors"
            >
              Læs metode & transparens →
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
