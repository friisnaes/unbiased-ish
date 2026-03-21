import SectionHeader from '@/components/SectionHeader';

export default function LegalPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <SectionHeader
        tag="Juridisk"
        title="Juridisk & Etisk information"
      />

      <div className="space-y-10">
        <section>
          <h2 className="font-display font-bold text-headline text-text-primary mb-4">
            Immaterielle rettigheder
          </h2>
          <p className="text-text-secondary leading-relaxed mb-4">
            Alle overskrifter, uddrag og andet indhold fra nyhedskilder tilhører de
            respektive udgivere. Signal over Støj reproducerer ikke fuld artikeltekst.
            Vi linker til original journalistik og præsenterer kun metadata hentet fra
            offentligt tilgængelige feeds og API'er.
          </p>
          <p className="text-text-secondary leading-relaxed">
            Hvis du er udgiver og ønsker dit indhold fjernet fra denne tjeneste,
            bedes du kontakte os direkte.
          </p>
        </section>

        <section>
          <h2 className="font-display font-bold text-headline text-text-primary mb-4">
            Dataindsamling
          </h2>
          <div className="space-y-3 text-text-secondary leading-relaxed">
            <p>
              Vi indsamler udelukkende metadata fra offentligt tilgængelige RSS-feeds
              og API'er. Vi udfører ikke web scraping af beskyttet indhold.
            </p>
            <p>
              Data vi gemmer for hver artikel: overskrift, kilde, original URL,
              publiceringstidspunkt, kort uddrag (hvis tilgængeligt via feed),
              emnekategorier og kildemetadata.
            </p>
            <p>
              Kildetilgængelighed afhænger af offentlige feeds og API'er og kan
              ændre sig. Hvis en kilde fjerner sin feed eller ændrer adgangsvilkår,
              vil vi stoppe indsamling fra den kilde.
            </p>
          </div>
        </section>

        <section>
          <h2 className="font-display font-bold text-headline text-text-primary mb-4">
            Kildelinsebeskrivelser
          </h2>
          <p className="text-text-secondary leading-relaxed">
            Vores beskrivelser af hvad hver kilde typisk gør godt og hvad deres
            blinde vinkler er, er redaktionel vejledning. De er baseret på bred
            medieforskning og erfaring, men de er ikke objektive sandheder.
            De beskriver tendenser — ikke absolutte positioner. De bør ikke
            læses som anklager mod nogen kilde.
          </p>
        </section>

        <section>
          <h2 className="font-display font-bold text-headline text-text-primary mb-4">
            Divergensscore
          </h2>
          <p className="text-text-secondary leading-relaxed">
            Divergensscoren er et heuristisk værktøj baseret på metadatasammenligning.
            Den er ikke en objektivitetsmåling og bør ikke tolkes som en "sandhedsscore".
            Den indikerer, hvor forskelligt de valgte kilder tilsyneladende dækker en
            given historie — ikke hvem der har ret.
          </p>
        </section>

        <section>
          <h2 className="font-display font-bold text-headline text-text-primary mb-4">
            Hvad denne side er og ikke er
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="border border-divergence-low/30 rounded-sm p-5 bg-surface-800/30">
              <h3 className="font-mono text-xs text-divergence-low uppercase tracking-wider mb-3">
                Denne side er
              </h3>
              <ul className="space-y-2 text-sm text-text-secondary">
                <li>→ Et sammenligningsværktøj for nyhedsdækning</li>
                <li>→ Et redskab til at gøre perspektiver synlige</li>
                <li>→ En linktjeneste til original journalistik</li>
                <li>→ Et åbent projekt med dokumenteret metode</li>
              </ul>
            </div>
            <div className="border border-divergence-high/30 rounded-sm p-5 bg-surface-800/30">
              <h3 className="font-mono text-xs text-divergence-high uppercase tracking-wider mb-3">
                Denne side er ikke
              </h3>
              <ul className="space-y-2 text-sm text-text-secondary">
                <li>→ En nyhedskilde eller erstatning for original journalistik</li>
                <li>→ En sandhedsdomstol</li>
                <li>→ Et neutralt projekt (vi er gennemsigtige om vores valg)</li>
                <li>→ Et værktøj til at diskreditere nogen kilde</li>
              </ul>
            </div>
          </div>
        </section>

        <section>
          <h2 className="font-display font-bold text-headline text-text-primary mb-4">
            Ansvarsbegrænsning
          </h2>
          <p className="text-text-secondary leading-relaxed">
            Signal over Støj leveres "as is". Vi garanterer ikke for nøjagtigheden
            af automatiseret clustering, divergensscoring eller linkvalidering.
            Brug altid original journalistik som primær kilde. Denne tjeneste er
            et supplement — ikke en erstatning.
          </p>
        </section>
      </div>
    </div>
  );
}
