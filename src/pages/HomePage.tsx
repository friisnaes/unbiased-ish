import { Link } from 'react-router-dom';
import { useArticles, useClusters, useSiteConfig } from '@/hooks/useData';
import { enabledSources } from '@/data/sources';
import CaseBlock from '@/components/cases/CaseBlock';
import BiasProfile from '@/components/cases/BiasProfile';
import DivergenceBadge from '@/components/DivergenceBadge';
import { timeAgo } from '@/utils/format';

export default function HomePage() {
  const { articles } = useArticles();
  const { clusters } = useClusters();
  const config = useSiteConfig();

  // Sort clusters: highest divergence first, then recency
  const sorted = [...clusters].sort((a, b) => {
    if (b.divergenceScore !== a.divergenceScore) return b.divergenceScore - a.divergenceScore;
    return b.updatedAt.localeCompare(a.updatedAt);
  });

  const featuredCase = sorted[0];
  const moreCases = sorted.slice(1, 7);
  const sources = enabledSources();

  return (
    <div>
      {/* ════════════════ HERO ════════════════ */}
      <section className="border-b border-surface-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12">
          <div className="max-w-3xl">
            <h1 className="font-display font-extrabold text-hero text-text-primary mb-4">
              Én historie.
              <br />
              <span className="text-text-secondary">Flere vinkler.</span>
              <br />
              Dine egne konklusioner.
            </h1>
            <p className="text-lg text-text-secondary leading-relaxed mb-6">
              Sammenlign hvordan forskellige medier dækker den samme begivenhed
              — og se forskellen på fakta, fortolkning og bias.
            </p>
            <div className="flex gap-3 flex-wrap">
              {featuredCase && (
                <a
                  href="#live-case"
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-accent hover:bg-accent-light text-text-primary text-sm font-medium rounded-sm transition-colors"
                >
                  Se en aktuel case ↓
                </a>
              )}
              <Link
                to="/briefing"
                className="inline-flex items-center gap-2 px-5 py-2.5 border border-surface-600 hover:border-surface-500 text-text-secondary text-sm rounded-sm transition-colors"
              >
                Daglig briefing
              </Link>
            </div>
          </div>

          {config && (
            <div className="mt-8 flex gap-6 text-xs font-mono text-text-tertiary">
              <span>{config.totalArticles} artikler</span>
              <span>{config.totalClusters} cases</span>
              <span>{sources.length} kilder</span>
              {config.lastIngestion && (
                <span>Opdateret {timeAgo(config.lastIngestion)}</span>
              )}
            </div>
          )}
        </div>
      </section>

      {/* ════════════════ LIVE CASE ════════════════ */}
      {featuredCase && (
        <section id="live-case" className="border-b border-surface-700">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <p className="text-xs font-mono text-accent uppercase tracking-[0.2em] mb-6">
              Aktuel case · Højeste divergens
            </p>
            <CaseBlock cluster={featuredCase} articles={articles} featured />
          </div>
        </section>
      )}

      {/* ════════════════ SÅDAN LÆSER DU DENNE SIDE ════════════════ */}
      <section className="border-b border-surface-700 bg-surface-800/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <p className="text-xs font-mono text-accent uppercase tracking-[0.2em] mb-2">
            Metode
          </p>
          <h2 className="font-display font-bold text-headline text-text-primary mb-8">
            Sådan læser du denne side
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="border border-surface-600 rounded-sm p-4 bg-surface-800/30" style={{ borderTopWidth: 3, borderTopColor: '#ff8c00' }}>
              <p className="font-mono text-xs text-text-tertiary mb-1">Reuters / AP</p>
              <p className="font-display font-semibold text-text-primary text-sm mb-2">Rå fakta</p>
              <p className="text-xs text-text-secondary leading-relaxed">
                Hvad er sket. Wire services rapporterer hurtigt og bredt. Brug dem som faktuel baseline.
              </p>
            </div>
            <div className="border border-surface-600 rounded-sm p-4 bg-surface-800/30" style={{ borderTopWidth: 3, borderTopColor: '#bb1919' }}>
              <p className="font-mono text-xs text-text-tertiary mb-1">BBC</p>
              <p className="font-display font-semibold text-text-primary text-sm mb-2">Kontekst</p>
              <p className="text-xs text-text-secondary leading-relaxed">
                Hvorfor det betyder noget. BBC kontekstualiserer — men med et vestligt, britisk udsyn.
              </p>
            </div>
            <div className="border border-surface-600 rounded-sm p-4 bg-surface-800/30" style={{ borderTopWidth: 3, borderTopColor: '#d2a44e' }}>
              <p className="font-mono text-xs text-text-tertiary mb-1">Al Jazeera / SCMP / TASS</p>
              <p className="font-display font-semibold text-text-primary text-sm mb-2">Modperspektiv</p>
              <p className="text-xs text-text-secondary leading-relaxed">
                Hvordan det kan ses anderledes. Disse kilder udfordrer det vestlige narrativ — men har egne biases.
              </p>
            </div>
            <div className="border border-surface-600 rounded-sm p-4 bg-surface-800/30" style={{ borderTopWidth: 3, borderTopColor: '#005bbb' }}>
              <p className="font-mono text-xs text-text-tertiary mb-1">Kyiv Independent</p>
              <p className="font-display font-semibold text-text-primary text-sm mb-2">Lokal virkelighed</p>
              <p className="text-xs text-text-secondary leading-relaxed">
                Frontlinjens perspektiv. Uvurderlig indsigt — men naturligt præget af national position.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-start gap-3 p-4 border border-divergence-low/20 rounded-sm bg-divergence-low/5">
              <span className="w-2 h-2 rounded-full bg-divergence-low mt-1 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-text-primary mb-1">Hvad kilderne er enige om</p>
                <p className="text-xs text-text-secondary">Bekræftede facts — den fælles faktuelle kerne</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-4 border border-divergence-moderate/20 rounded-sm bg-divergence-moderate/5">
              <span className="w-2 h-2 rounded-full bg-divergence-moderate mt-1 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-text-primary mb-1">Hvad de er uenige om</p>
                <p className="text-xs text-text-secondary">Fortolkning, vinkling, kausalitet — her starter din analyse</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-4 border border-divergence-high/20 rounded-sm bg-divergence-high/5">
              <span className="w-2 h-2 rounded-full bg-divergence-high mt-1 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-text-primary mb-1">Hvad der stadig er uklart</p>
                <p className="text-xs text-text-secondary">Ubekræftet, modstridende eller manglende information</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════ BIAS MODEL ════════════════ */}
      <section className="border-b border-surface-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <p className="text-xs font-mono text-accent uppercase tracking-[0.2em] mb-2">
            Bias-model
          </p>
          <h2 className="font-display font-bold text-headline text-text-primary mb-3">
            Kend dine kilder
          </h2>
          <p className="text-text-secondary mb-8 max-w-2xl">
            Ingen kilde er neutral. Hver har geografisk, politisk og institutionel bias.
            Vi gør dem synlige — så du kan kalibrere din læsning.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {sources.map((s) => (
              <BiasProfile key={s.key} sourceKey={s.key} />
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════ CASE LIST ════════════════ */}
      {moreCases.length > 0 && (
        <section className="border-b border-surface-700">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="flex items-end justify-between mb-8">
              <div>
                <p className="text-xs font-mono text-accent uppercase tracking-[0.2em] mb-2">Cases</p>
                <h2 className="font-display font-bold text-headline text-text-primary">
                  Aktuelle cases
                </h2>
              </div>
              <Link
                to="/stories"
                className="text-sm font-mono text-text-secondary hover:text-text-primary transition-colors"
              >
                Alle {clusters.length} cases →
              </Link>
            </div>
            <div className="space-y-6">
              {moreCases.map((c) => (
                <CaseBlock key={c.id} cluster={c} articles={articles} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ════════════════ OM / METODE ════════════════ */}
      <section>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="max-w-2xl">
            <div className="border-l-2 border-accent/60 pl-5 mb-8">
              <p className="font-display text-xl text-text-primary leading-relaxed">
                Vi forsøger ikke at være neutrale.
              </p>
              <p className="text-text-secondary mt-2 leading-relaxed">
                Vi er strukturerede i vores sammenligning, transparente i vores metode,
                og tydelige om bias — inklusiv vores egen.
              </p>
            </div>
            <div className="flex gap-4">
              <Link to="/methodology" className="text-sm font-mono text-accent hover:text-accent-light transition-colors">
                Fuld metode →
              </Link>
              <Link to="/about" className="text-sm font-mono text-text-tertiary hover:text-text-secondary transition-colors">
                Om projektet →
              </Link>
              <Link to="/legal" className="text-sm font-mono text-text-tertiary hover:text-text-secondary transition-colors">
                Juridisk →
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
