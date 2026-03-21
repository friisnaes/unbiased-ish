import { useIngestionLog } from '@/hooks/useData';
import { enabledSources } from '@/data/sources';
import { formatDate } from '@/utils/format';
import SectionHeader from '@/components/SectionHeader';

export default function MethodologyPage() {
  const log = useIngestionLog();
  const latest = log[0];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <SectionHeader
        tag="Transparens"
        title="Metode & Transparens"
        subtitle="Hvordan Signal over Støj indsamler, grupperer og præsenterer nyhedsdækning."
      />

      <div className="prose-custom space-y-12">
        {/* ── Principle ── */}
        <section>
          <div className="border-l-2 border-accent/60 pl-5 mb-8">
            <p className="font-display text-xl text-text-primary leading-relaxed italic">
              Formålet er ikke at skjule bias.
              <br />
              Formålet er at gøre bias synlig.
            </p>
          </div>
          <p className="text-text-secondary leading-relaxed">
            Signal over Støj er et sammenligningsværktøj. Vi påstår ikke at levere sandheden
            — vi forsøger at gøre det synligt, hvordan forskellige redaktioner vinkler den
            samme virkelighed. Det er op til dig at drage dine egne konklusioner.
          </p>
        </section>

        {/* ── Data Collection ── */}
        <section>
          <h2 className="font-display font-bold text-headline text-text-primary mb-4">
            Dataindsamling
          </h2>
          <p className="text-text-secondary leading-relaxed mb-4">
            Vi indsamler metadata fra offentligt tilgængelige RSS-feeds og API'er.
            Vi scraper ikke lukkede sider. For hver artikel gemmer vi:
          </p>
          <div className="bg-surface-800/50 border border-surface-600 rounded-sm p-5 font-mono text-sm text-text-secondary space-y-1">
            <p>→ Overskrift (tilhører originalkilde)</p>
            <p>→ Kilde og kildenøgle</p>
            <p>→ Original URL (valideret)</p>
            <p>→ Publiceringstidspunkt</p>
            <p>→ Kort uddrag (hvis tilgængeligt via feed)</p>
            <p>→ Emnekategorier</p>
            <p>→ Sprog og region</p>
          </div>
          <p className="text-sm text-text-tertiary mt-3">
            Vi gemmer aldrig hele artikeltekster. Overskrifter og uddrag forbliver
            de respektive udgiveres ejendom.
          </p>
        </section>

        {/* ── Clustering ── */}
        <section>
          <h2 className="font-display font-bold text-headline text-text-primary mb-4">
            Historiegruppering (Clustering)
          </h2>
          <p className="text-text-secondary leading-relaxed mb-4">
            Artikler grupperes i "historier" baseret på:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { label: 'Overskriflighed', desc: 'Normaliseret similarity mellem overskrifter' },
              { label: 'Token overlap', desc: 'Fælles nøgleord og navne' },
              { label: 'Tidsproximitet', desc: 'Artikler publiceret inden for et kort tidsvindue' },
              { label: 'Emnematch', desc: 'Overlappende emnekategorier fra feeds' },
            ].map((item) => (
              <div key={item.label} className="border border-surface-600 rounded-sm p-4 bg-surface-800/30">
                <p className="font-mono text-xs text-accent mb-1">{item.label}</p>
                <p className="text-sm text-text-secondary">{item.desc}</p>
              </div>
            ))}
          </div>
          <p className="text-sm text-text-tertiary mt-4">
            Gruppering er heuristisk — ikke AI-baseret. Algoritmen er simpel, gennemskuelig
            og vedligeholdelig. Fejl kan forekomme.
          </p>
        </section>

        {/* ── Divergence ── */}
        <section>
          <h2 className="font-display font-bold text-headline text-text-primary mb-4">
            Divergensscore
          </h2>
          <p className="text-text-secondary leading-relaxed mb-4">
            For hver grupperet historie beregner vi en divergensscore baseret på:
          </p>
          <div className="bg-surface-800/50 border border-surface-600 rounded-sm p-5 font-mono text-sm text-text-secondary space-y-1">
            <p>→ Forskel i ordvalg mellem overskrifter</p>
            <p>→ Forskel i emneemphasis</p>
            <p>→ Kildespredning (hvor mange uafhængige kilder)</p>
            <p>→ Framing-forskelle (infereret fra metadata/uddrag)</p>
          </div>
          <div className="mt-4 grid grid-cols-3 gap-3">
            <div className="border border-divergence-low/30 rounded-sm p-3 text-center">
              <span className="block text-divergence-low font-mono text-sm font-medium">Lav</span>
              <span className="text-xs text-text-tertiary">Bred enighed</span>
            </div>
            <div className="border border-divergence-moderate/30 rounded-sm p-3 text-center">
              <span className="block text-divergence-moderate font-mono text-sm font-medium">Moderat</span>
              <span className="text-xs text-text-tertiary">Tydelige forskelle</span>
            </div>
            <div className="border border-divergence-high/30 rounded-sm p-3 text-center">
              <span className="block text-divergence-high font-mono text-sm font-medium">Høj</span>
              <span className="text-xs text-text-tertiary">Markant uenighed</span>
            </div>
          </div>
        </section>

        {/* ── Update Frequency ── */}
        <section>
          <h2 className="font-display font-bold text-headline text-text-primary mb-4">
            Opdateringsfrekvens
          </h2>
          <p className="text-text-secondary leading-relaxed">
            Siden opdateres løbende via automatiserede GitHub Actions-jobs. Det er
            ikke real-time — men det er regelmæssigt. Typisk opdateres data hver
            15 minut. Mærket "løbende opdateret" betyder netop dette:
            tilbagevendende automatiseret indsamling, ikke live-streaming.
          </p>
        </section>

        {/* ── Source Lenses ── */}
        <section>
          <h2 className="font-display font-bold text-headline text-text-primary mb-4">
            Kildelinser
          </h2>
          <p className="text-text-secondary leading-relaxed mb-4">
            Hver kilde er beskrevet med en "linse" — en kort redaktionel vejledning
            om hvad kilden typisk bringer. Disse er baseret på bred medieforskning
            og redaktionel erfaring, men de er ikke objektive sandheder. Kildelinser er:
          </p>
          <div className="space-y-2 text-sm text-text-secondary">
            <p>→ Tendenser, ikke absolutte positioner</p>
            <p>→ Redaktionel vejledning, ikke anklager</p>
            <p>→ Kan ændre sig over tid</p>
            <p>→ Altid åbne for kritik og revision</p>
          </div>
        </section>

        {/* ── Active Sources ── */}
        <section>
          <h2 className="font-display font-bold text-headline text-text-primary mb-4">
            Aktive kilder
          </h2>
          <div className="space-y-2">
            {enabledSources().map((s) => (
              <div key={s.key} className="flex items-center gap-3 text-sm">
                <span
                  className="w-2 h-2 rounded-full flex-shrink-0"
                  style={{ backgroundColor: s.color }}
                />
                <span className="text-text-primary font-medium">{s.name}</span>
                <span className="text-text-tertiary">— {s.lensLabel}</span>
                <span className="text-xs font-mono text-text-tertiary ml-auto">
                  {s.enabled ? 'Aktiv' : 'Inaktiv'}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* ── Latest Ingestion ── */}
        {latest && (
          <section>
            <h2 className="font-display font-bold text-headline text-text-primary mb-4">
              Seneste indsamling
            </h2>
            <div className="bg-surface-800/50 border border-surface-600 rounded-sm p-5 font-mono text-sm text-text-secondary space-y-1">
              <p>Tidspunkt: {formatDate(latest.timestamp)}</p>
              <p>Kilder forsøgt: {latest.sourcesAttempted.join(', ')}</p>
              <p>Kilder lykkedes: {latest.sourcesSucceeded.join(', ')}</p>
              <p>Artikler indsamlet: {latest.articlesIngested}</p>
              {latest.errors.length > 0 && (
                <p className="text-divergence-moderate">
                  Fejl: {latest.errors.join('; ')}
                </p>
              )}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
