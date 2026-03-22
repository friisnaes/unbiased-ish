import { Link } from 'react-router-dom';
import { useArticles, useClusters, useSiteConfig } from '@/hooks/useData';
import { enabledSources } from '@/data/sources';
import CaseBlock from '@/components/cases/CaseBlock';
import BiasProfile from '@/components/cases/BiasProfile';
import { timeAgo } from '@/utils/format';

export default function HomePage() {
  const { articles } = useArticles();
  const { clusters } = useClusters();
  const config = useSiteConfig();

  const sorted = [...clusters].sort((a, b) => {
    if (b.divergenceScore !== a.divergenceScore) return b.divergenceScore - a.divergenceScore;
    return b.updatedAt.localeCompare(a.updatedAt);
  });

  const featuredCase = sorted[0];
  const moreCases = sorted.slice(1, 7);
  const sources = enabledSources();

  return (
    <div>
      {/* ════════ HERO ════════ */}
      <section className="border-b border-surface-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-10">
          <div className="max-w-3xl">
            <h1 className="font-display font-extrabold text-hero text-text-primary mb-4 leading-[1.05]">
              Stop med at læse
              <br />
              <span className="text-accent">én version</span> af verden.
            </h1>
            <p className="text-lg text-text-secondary leading-relaxed mb-6 max-w-xl">
              Sammenlign hvordan forskellige medier dækker den samme begivenhed
              — og se hvad der er fakta, fortolkning og usikkerhed.
            </p>
            <div className="flex gap-3 flex-wrap">
              {featuredCase && (
                <button onClick={() => document.getElementById("case")?.scrollIntoView({ behavior: "smooth" })} className="inline-flex items-center gap-2 px-5 py-2.5 bg-accent hover:bg-accent-light text-text-primary text-sm font-medium rounded-sm transition-colors">
                  Se en aktuel case ↓
                </a>
              )}
              <Link to="/briefing" className="inline-flex items-center gap-2 px-5 py-2.5 border border-surface-600 hover:border-surface-500 text-text-secondary text-sm rounded-sm transition-colors">
                Daglig briefing
              </Link>
            </div>
          </div>
          {config && (
            <div className="mt-6 flex gap-5 text-xs font-mono text-text-tertiary">
              <span>{config.totalArticles} artikler</span>
              <span>{config.totalClusters} cases</span>
              <span>{sources.length} kilder</span>
              {config.lastIngestion && <span>Opdateret {timeAgo(config.lastIngestion)}</span>}
            </div>
          )}
        </div>
      </section>

      {/* ════════ LIVE CASE (instant value) ════════ */}
      {featuredCase && (
        <section id="case" className="border-b border-surface-700">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <div className="flex items-center gap-3 mb-6">
              <span className="w-2 h-2 bg-accent rounded-full animate-pulse" />
              <span className="text-xs font-mono text-accent uppercase tracking-[0.15em] font-medium">Aktuel case</span>
            </div>
            <CaseBlock cluster={featuredCase} articles={articles} featured />
          </div>
        </section>
      )}

      {/* ════════ SIGNAL ENGINE EXPLAINER ════════ */}
      <section className="border-b border-surface-700 bg-surface-800/15">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <p className="text-xs font-mono text-accent uppercase tracking-[0.15em] mb-2">Metode</p>
          <h2 className="font-display font-bold text-xl text-text-primary mb-6">
            Sådan læser du denne side
          </h2>

          {/* Source roles */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
            {[
              { label: 'Reuters / AP', role: 'Rå fakta', desc: 'Hvad er sket', color: '#ff8c00' },
              { label: 'BBC', role: 'Kontekst', desc: 'Hvorfor det betyder noget', color: '#bb1919' },
              { label: 'Al Jazeera / SCMP / TASS', role: 'Modperspektiv', desc: 'Hvordan det kan ses anderledes', color: '#d2a44e' },
              { label: 'Kyiv Independent', role: 'Lokal virkelighed', desc: 'Frontlinjevirkelighed', color: '#005bbb' },
            ].map((s) => (
              <div key={s.label} className="border border-surface-600 rounded-sm p-3" style={{ borderTopWidth: 3, borderTopColor: s.color }}>
                <p className="text-xs font-mono text-text-tertiary mb-0.5">{s.label}</p>
                <p className="font-display font-semibold text-sm text-text-primary">{s.role}</p>
                <p className="text-xs text-text-secondary mt-1">{s.desc}</p>
              </div>
            ))}
          </div>

          {/* Signal classification */}
          <div className="grid grid-cols-3 gap-3">
            <div className="flex items-start gap-2.5 p-3 border border-divergence-low/20 rounded-sm bg-divergence-low/5">
              <div className="w-3 h-3 rounded-sm bg-divergence-low flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-[7px] text-surface-900 font-bold">✓</span>
              </div>
              <div>
                <p className="text-xs font-mono text-divergence-low font-medium">Bekræftet</p>
                <p className="text-xs text-text-tertiary mt-0.5">Fakta med flere uafhængige kilder</p>
              </div>
            </div>
            <div className="flex items-start gap-2.5 p-3 border border-divergence-moderate/20 rounded-sm bg-divergence-moderate/5">
              <div className="w-3 h-3 rounded-sm bg-divergence-moderate flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-[7px] text-surface-900 font-bold">⇔</span>
              </div>
              <div>
                <p className="text-xs font-mono text-divergence-moderate font-medium">Fortolket</p>
                <p className="text-xs text-text-tertiary mt-0.5">Hvor kilder er uenige</p>
              </div>
            </div>
            <div className="flex items-start gap-2.5 p-3 border border-divergence-high/20 rounded-sm bg-divergence-high/5">
              <div className="w-3 h-3 rounded-sm bg-divergence-high flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-[7px] text-surface-900 font-bold">?</span>
              </div>
              <div>
                <p className="text-xs font-mono text-divergence-high font-medium">Uklart</p>
                <p className="text-xs text-text-tertiary mt-0.5">Manglende data eller modstridende info</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ════════ BIAS INTELLIGENCE SYSTEM ════════ */}
      <section className="border-b border-surface-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <p className="text-xs font-mono text-accent uppercase tracking-[0.15em] mb-2">Bias Intelligence</p>
          <h2 className="font-display font-bold text-xl text-text-primary mb-2">
            Kend dine kilder
          </h2>
          <p className="text-sm text-text-secondary mb-6 max-w-xl">
            Ingen kilde er neutral. Hver har geografisk, politisk og institutionel bias. Vi gør dem synlige.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {sources.map((s) => (
              <BiasProfile key={s.key} sourceKey={s.key} />
            ))}
          </div>
        </div>
      </section>

      {/* ════════ CASE ARCHIVE ════════ */}
      {moreCases.length > 0 && (
        <section className="border-b border-surface-700">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <div className="flex items-end justify-between mb-6">
              <div>
                <p className="text-xs font-mono text-accent uppercase tracking-[0.15em] mb-2">Arkiv</p>
                <h2 className="font-display font-bold text-xl text-text-primary">Cases</h2>
              </div>
              <Link to="/stories" className="text-xs font-mono text-text-tertiary hover:text-text-primary transition-colors">
                Alle {clusters.length} cases →
              </Link>
            </div>
            <div className="space-y-4">
              {moreCases.map((c) => (
                <CaseBlock key={c.id} cluster={c} articles={articles} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ════════ METODE ════════ */}
      <section>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="max-w-xl">
            <div className="border-l-2 border-accent/60 pl-4 mb-6">
              <p className="font-display text-lg text-text-primary">
                Vi forsøger ikke at være neutrale.
              </p>
              <p className="text-sm text-text-secondary mt-1">
                Vi er strukturerede i sammenligning, transparente i metode, og tydelige om bias.
              </p>
            </div>
            <div className="flex gap-4 text-xs font-mono">
              <Link to="/methodology" className="text-accent hover:text-accent-light transition-colors">Metode →</Link>
              <Link to="/briefing" className="text-text-tertiary hover:text-text-secondary transition-colors">Daglig briefing →</Link>
              <Link to="/about" className="text-text-tertiary hover:text-text-secondary transition-colors">Om →</Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
