import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { formatDate } from '@/utils/format';
import SectionHeader from '@/components/SectionHeader';

interface ConflictBriefing {
  headline: string;
  narrative: string;
  keyDivergences: string;
  sourcesUsed: string[];
  clusterIds: string[];
}

interface Briefing {
  date: string;
  generatedAt: string;
  ukraineRussia: ConflictBriefing;
  iranMiddleEast: ConflictBriefing;
  globalImpact: {
    headline: string;
    narrative: string;
    sourcesUsed: string[];
  };
  methodology: string;
}

const SOURCE_NAMES: Record<string, string> = {
  reuters: 'Reuters', ap: 'AP', bbc: 'BBC', aljazeera: 'Al Jazeera',
  kyivindependent: 'Kyiv Independent', scmp: 'SCMP', tass: 'TASS', wion: 'WION',
};

function SourcePills({ sources }: { sources: string[] }) {
  return (
    <div className="flex flex-wrap gap-1.5 mt-3">
      {sources.map((s) => (
        <Link
          key={s}
          to={`/sources/${s}`}
          className="text-xs font-mono text-text-tertiary bg-surface-700 px-2 py-0.5 rounded-sm hover:text-text-primary transition-colors"
        >
          {SOURCE_NAMES[s] || s}
        </Link>
      ))}
    </div>
  );
}

function ConflictSection({
  briefing,
  accentColor,
  icon,
}: {
  briefing: ConflictBriefing;
  accentColor: string;
  icon: string;
}) {
  return (
    <section className="border border-surface-600 rounded-sm bg-surface-800/30 overflow-hidden">
      <div
        className="px-6 py-4 border-b border-surface-600"
        style={{ borderLeftWidth: 4, borderLeftColor: accentColor }}
      >
        <div className="flex items-center gap-2 mb-1">
          <span className="text-lg">{icon}</span>
          <h2 className="font-display font-bold text-xl text-text-primary">
            {briefing.headline}
          </h2>
        </div>
        <SourcePills sources={briefing.sourcesUsed} />
      </div>

      <div className="px-6 py-5">
        <div className="prose-custom">
          {briefing.narrative.split('\n').map((para, i) => (
            para.trim() ? (
              <p key={i} className="text-text-secondary leading-relaxed mb-3 text-sm">
                {para}
              </p>
            ) : null
          ))}
        </div>
      </div>

      {briefing.keyDivergences && (
        <div className="px-6 py-4 border-t border-surface-600 bg-surface-800/50">
          <p className="text-xs font-mono text-accent uppercase tracking-wider mb-3">
            Hvor kilderne divergerer
          </p>
          {briefing.keyDivergences.split('\n').map((line, i) => (
            line.trim() ? (
              <p key={i} className="text-sm text-text-secondary leading-relaxed mb-2">
                {line}
              </p>
            ) : null
          ))}
        </div>
      )}
    </section>
  );
}

export default function BriefingPage() {
  const [briefing, setBriefing] = useState<Briefing | null>(null);
  const [history, setHistory] = useState<Briefing[]>([]);
  const [loading, setLoading] = useState(true);

  const base = import.meta.env.BASE_URL || '/';

  useEffect(() => {
    Promise.all([
      fetch(`${base}data/briefing.json`).then((r) => r.json()).catch(() => null),
      fetch(`${base}data/briefing-history.json`).then((r) => r.json()).catch(() => []),
    ]).then(([current, hist]) => {
      setBriefing(current);
      setHistory(Array.isArray(hist) ? hist : []);
      setLoading(false);
    });
  }, []);

  function selectDate(date: string) {
    const found = history.find((b) => b.date === date);
    if (found) setBriefing(found);
  }

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center text-text-tertiary font-mono text-sm">
        Indlæser briefing...
      </div>
    );
  }

  if (!briefing) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <p className="font-display text-xl text-text-primary mb-4">
          Ingen briefing tilgængelig endnu
        </p>
        <p className="text-text-secondary mb-6">
          Daglig briefing genereres automatisk baseret på indsamlede artikler.
        </p>
        <Link to="/" className="text-sm text-accent hover:text-accent-light font-mono">
          ← Tilbage til overblik
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <SectionHeader
        tag={`Daglig briefing · ${briefing.date}`}
        title="Daglig situationsbriefing"
        subtitle="AI-genereret analyse baseret udelukkende på overskrifter og uddrag fra 7 internationale nyhedskilder. Ikke en erstatning for original journalistik."
      />

      <div className="mb-6 flex items-center gap-4 text-xs font-mono text-text-tertiary flex-wrap">
        <span>Genereret: {formatDate(briefing.generatedAt)}</span>
        <span className="text-surface-600">|</span>
        <span>
          {briefing.ukraineRussia.sourcesUsed.length + briefing.iranMiddleEast.sourcesUsed.length} kilder brugt
        </span>
      </div>

      {/* Date selector for history */}
      {history.length > 1 && (
        <div className="mb-8 flex items-center gap-2 flex-wrap">
          <span className="text-xs font-mono text-text-tertiary mr-1">Tidligere:</span>
          {history.map((h) => (
            <button
              key={h.date}
              onClick={() => selectDate(h.date)}
              className={`text-xs font-mono px-2.5 py-1 rounded-sm transition-colors ${
                h.date === briefing.date
                  ? 'bg-accent text-text-primary'
                  : 'bg-surface-700 text-text-tertiary hover:text-text-primary'
              }`}
            >
              {h.date}
            </button>
          ))}
        </div>
      )}

      {/* ── Intro quote ── */}
      <div className="border-l-2 border-accent/60 pl-5 mb-10">
        <p className="font-display text-lg text-text-primary leading-relaxed italic">
          Denne briefing prøver ikke at være neutral.
          <br />
          Den prøver at gøre det synligt, hvad hver kilde vægter — og hvad de udelader.
        </p>
      </div>

      <div className="space-y-8">
        {/* ── Ukraine/Russia ── */}
        <ConflictSection
          briefing={briefing.ukraineRussia}
          accentColor="#005bbb"
          icon="🇺🇦"
        />

        {/* ── Iran/Middle East ── */}
        <ConflictSection
          briefing={briefing.iranMiddleEast}
          accentColor="#c4a23b"
          icon="🌍"
        />

        {/* ── Global Impact ── */}
        <section className="border border-surface-600 rounded-sm bg-surface-800/30 overflow-hidden">
          <div
            className="px-6 py-4 border-b border-surface-600"
            style={{ borderLeftWidth: 4, borderLeftColor: '#a52525' }}
          >
            <h2 className="font-display font-bold text-xl text-text-primary">
              {briefing.globalImpact.headline}
            </h2>
            <SourcePills sources={briefing.globalImpact.sourcesUsed} />
          </div>
          <div className="px-6 py-5">
            {briefing.globalImpact.narrative.split('\n').map((para, i) => (
              para.trim() ? (
                <p key={i} className="text-text-secondary leading-relaxed mb-3 text-sm">
                  {para}
                </p>
              ) : null
            ))}
          </div>
        </section>
      </div>

      {/* ── Methodology ── */}
      <div className="mt-10 border-t border-surface-700 pt-6">
        <p className="text-xs font-mono text-accent uppercase tracking-wider mb-3">
          Metode & Ansvarsfraskrivelse
        </p>
        <p className="text-sm text-text-tertiary leading-relaxed">
          {briefing.methodology}
        </p>
        <div className="flex gap-4 mt-4">
          <Link
            to="/methodology"
            className="text-xs font-mono text-text-tertiary hover:text-text-secondary transition-colors"
          >
            Fuld metode →
          </Link>
          <Link
            to="/stories"
            className="text-xs font-mono text-text-tertiary hover:text-text-secondary transition-colors"
          >
            Se alle historier →
          </Link>
        </div>
      </div>
    </div>
  );
}
