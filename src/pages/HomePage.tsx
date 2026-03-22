import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useArticles, useClusters, useSiteConfig } from '@/hooks/useData';
import { enabledSources } from '@/data/sources';
import { SIGNATURE_CASE, SIGNATURE_ARTICLES } from '@/data/signatureCase';
import CaseBlock from '@/components/cases/CaseBlock';
import BiasProfile from '@/components/cases/BiasProfile';
import { timeAgo } from '@/utils/format';

export default function HomePage() {
  const { articles: liveArticles } = useArticles();
  const { clusters: liveClusters } = useClusters();
  const config = useSiteConfig();
  const sources = enabledSources();

  // Merge signature articles with live data
  const articles = useMemo(() => {
    const ids = new Set(liveArticles.map((a) => a.id));
    const sigNew = SIGNATURE_ARTICLES.filter((a) => !ids.has(a.id));
    return [...sigNew, ...liveArticles];
  }, [liveArticles]);

  // Merge signature case with live clusters
  const clusters = useMemo(() => {
    const ids = new Set(liveClusters.map((c) => c.id));
    if (!ids.has(SIGNATURE_CASE.id)) {
      return [SIGNATURE_CASE, ...liveClusters];
    }
    return liveClusters;
  }, [liveClusters]);

  // Featured = signature case. Others sorted by divergence.
  const featuredCase = SIGNATURE_CASE;
  const otherCases = clusters
    .filter((c) => c.id !== SIGNATURE_CASE.id)
    .sort((a, b) => {
      if (b.divergenceScore !== a.divergenceScore) return b.divergenceScore - a.divergenceScore;
      return b.updatedAt.localeCompare(a.updatedAt);
    })
    .slice(0, 6);

  return (
    <div>
      {/* ════════ HERO ════════ */}
      <section className="border-b border-surface-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-8">
          <div className="max-w-3xl">
            <h1 className="font-display font-extrabold text-hero text-text-primary mb-3 leading-[1.05]">
              Stop med at læse
              <br />
              <span className="text-accent">én version</span> af verden.
            </h1>
            <p className="text-lg text-text-secondary leading-relaxed mb-5 max-w-xl">
              Sammenlign hvordan forskellige medier dækker den samme begivenhed
              — og se hvad der er fakta, fortolkning og usikkerhed.
            </p>
            <div className="flex gap-3 flex-wrap">
              <button
                onClick={() => document.getElementById('case')?.scrollIntoView({ behavior: 'smooth' })}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-accent hover:bg-accent-light text-text-primary text-sm font-medium rounded-sm transition-colors"
              >
                Se en aktuel case ↓
              </button>
              <Link to="/briefing" className="inline-flex items-center gap-2 px-5 py-2.5 border border-surface-600 hover:border-surface-500 text-text-secondary text-sm rounded-sm transition-colors">
                Daglig briefing
              </Link>
            </div>
          </div>
          {config && (
            <div className="mt-5 flex gap-5 text-xs font-mono text-text-tertiary">
              <span>{config.totalArticles} artikler</span>
              <span>{config.totalClusters + 1} cases</span>
              <span>{sources.length} kilder</span>
            </div>
          )}
        </div>
      </section>

      {/* ════════ SIGNATURE CASE (instant value) ════════ */}
      <section id="case" className="border-b border-surface-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center gap-3 mb-5">
            <span className="w-2 h-2 bg-accent rounded-full animate-pulse" />
            <span className="text-xs font-mono text-accent uppercase tracking-[0.15em] font-medium">Signature case</span>
          </div>
          <CaseBlock cluster={featuredCase} articles={articles} featured />
        </div>
      </section>

      {/* ════════ METODE: Sådan læser du denne side ════════ */}
      <section className="border-b border-surface-700 bg-surface-800/15">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <p className="text-xs font-mono text-accent uppercase tracking-[0.15em] mb-2">Metode</p>
          <h2 className="font-display font-bold text-xl text-text-primary mb-5">Sådan læser du denne side</h2>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 mb-6">
            {[
              { label: 'Reuters / AP', role: 'Rå fakta', desc: 'Hvad er sket', color: '#ff8c00' },
              { label: 'BBC', role: 'Kontekst', desc: 'Hvorfor det betyder noget', color: '#bb1919' },
              { label: 'Al Jazeera / SCMP / TASS', role: 'Modperspektiv', desc: 'Hvordan det kan ses anderledes', color: '#d2a44e' },
              { label: 'Kyiv Independent', role: 'Lokal virkelighed', desc: 'Frontlinjevirkelighed', color: '#005bbb' },
            ].map((s) => (
              <div key={s.label} className="border border-surface-600 rounded-sm p-3" style={{ borderTopWidth: 3, borderTopColor: s.color }}>
                <p className="text-[10px] font-mono text-text-tertiary mb-0.5">{s.label}</p>
                <p className="font-display font-semibold text-sm text-text-primary">{s.role}</p>
                <p className="text-xs text-text-secondary mt-0.5">{s.desc}</p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-3 gap-2.5">
            {[
              { icon: '✓', label: 'Bekræftet', desc: 'Multi-source fakta', color: 'divergence-low' },
              { icon: '⇔', label: 'Fortolket', desc: 'Kilder uenige', color: 'divergence-moderate' },
              { icon: '?', label: 'Uklart', desc: 'Manglende data', color: 'divergence-high' },
            ].map((s) => (
              <div key={s.label} className={`flex items-start gap-2 p-2.5 border border-${s.color}/20 rounded-sm bg-${s.color}/5`}>
                <div className={`w-3 h-3 rounded-sm bg-${s.color} flex items-center justify-center flex-shrink-0 mt-0.5`}>
                  <span className="text-[7px] text-surface-900 font-bold">{s.icon}</span>
                </div>
                <div>
                  <p className={`text-xs font-mono text-${s.color} font-medium`}>{s.label}</p>
                  <p className="text-[10px] text-text-tertiary">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════ BIAS INTELLIGENCE ════════ */}
      <section className="border-b border-surface-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <p className="text-xs font-mono text-accent uppercase tracking-[0.15em] mb-2">Bias Intelligence</p>
          <h2 className="font-display font-bold text-xl text-text-primary mb-2">Kend dine kilder</h2>
          <p className="text-sm text-text-secondary mb-5 max-w-lg">
            Ingen kilde er neutral. Vi gør bias synlig — så du kan kalibrere din læsning.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {sources.map((s) => (
              <BiasProfile key={s.key} sourceKey={s.key} />
            ))}
          </div>
        </div>
      </section>

      {/* ════════ CASE ARCHIVE ════════ */}
      {otherCases.length > 0 && (
        <section className="border-b border-surface-700">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex items-end justify-between mb-5">
              <div>
                <p className="text-xs font-mono text-accent uppercase tracking-[0.15em] mb-2">Arkiv</p>
                <h2 className="font-display font-bold text-xl text-text-primary">Flere cases</h2>
              </div>
              <Link to="/stories" className="text-xs font-mono text-text-tertiary hover:text-text-primary transition-colors">
                Alle cases →
              </Link>
            </div>
            <div className="space-y-4">
              {otherCases.map((c) => (
                <CaseBlock key={c.id} cluster={c} articles={articles} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ════════ FOOTER METODE ════════ */}
      <section>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="max-w-xl">
            <div className="border-l-2 border-accent/60 pl-4 mb-4">
              <p className="font-display text-lg text-text-primary">Vi forsøger ikke at være neutrale.</p>
              <p className="text-sm text-text-secondary mt-1">Vi er strukturerede, transparente, og tydelige om bias.</p>
            </div>
            <div className="flex gap-4 text-xs font-mono">
              <Link to="/methodology" className="text-accent hover:text-accent-light">Metode →</Link>
              <Link to="/briefing" className="text-text-tertiary hover:text-text-secondary">Daglig briefing →</Link>
              <Link to="/about" className="text-text-tertiary hover:text-text-secondary">Om →</Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
