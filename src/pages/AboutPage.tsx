import { Link } from 'react-router-dom';
import SectionHeader from '@/components/SectionHeader';

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <SectionHeader
        tag="Om projektet"
        title="Om Signal over Støj"
      />

      <div className="space-y-10">
        <section>
          <div className="border-l-2 border-accent/60 pl-5 mb-8">
            <p className="font-display text-xl text-text-primary leading-relaxed italic">
              Denne side prøver ikke at være neutral.
              <br />
              Den prøver at gøre vinkler synlige.
            </p>
          </div>
        </section>

        <section>
          <h2 className="font-display font-bold text-headline text-text-primary mb-4">
            Hvad er dette?
          </h2>
          <p className="text-text-secondary leading-relaxed mb-4">
            Signal over Støj er et sammenligningsværktøj for nyhedsdækning. Vi tager de
            samme geopolitiske historier og viser, hvordan de dækkes af forskellige
            internationale medier — fra wire services til frontlinjemedier.
          </p>
          <p className="text-text-secondary leading-relaxed">
            Formålet er ikke at fortælle dig, hvad der er sandt. Formålet er at gøre
            perspektiverne synlige, så du kan danne dit eget kvalificerede billede.
          </p>
        </section>

        <section>
          <h2 className="font-display font-bold text-headline text-text-primary mb-4">
            Hvad dette ikke er
          </h2>
          <div className="space-y-3 text-text-secondary">
            <p>→ Det er ikke en nyhedskilde. Vi producerer ikke original journalistik.</p>
            <p>→ Det er ikke en sandhedsdomstol. Vi bedømmer ikke, hvem der har ret.</p>
            <p>→ Det er ikke neutralt. Valget af kilder, grupperingslogik og divergensscore er redaktionelle beslutninger.</p>
            <p>→ Det er ikke en erstatning for at læse original journalistik.</p>
          </div>
        </section>

        <section>
          <h2 className="font-display font-bold text-headline text-text-primary mb-4">
            Kerneprincipper
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              {
                title: 'Synlighed over neutralitet',
                body: 'Vi prøver ikke at fjerne bias. Vi prøver at gøre bias synlig — inklusiv vores egen.',
              },
              {
                title: 'Original attribution',
                body: 'Vi linker altid til original journalistik. Overskrifter og uddrag tilhører de respektive udgivere.',
              },
              {
                title: 'Gennemsigtighed',
                body: 'Vores metode, kildebeskrivelser og algoritmer er dokumenteret og åbne for kritik.',
              },
              {
                title: 'Ydmyghed',
                body: 'Vores clustering og divergensscore er heuristiske værktøjer — ikke orakler. Fejl forekommer.',
              },
            ].map((p) => (
              <div key={p.title} className="border border-surface-600 rounded-sm p-5 bg-surface-800/30">
                <h3 className="font-display font-semibold text-text-primary mb-2">{p.title}</h3>
                <p className="text-sm text-text-secondary leading-relaxed">{p.body}</p>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="font-display font-bold text-headline text-text-primary mb-4">
            Teknologi
          </h2>
          <p className="text-text-secondary leading-relaxed mb-4">
            Signal over Støj er en statisk site bygget med React, TypeScript og Tailwind CSS.
            Data indsamles automatisk via GitHub Actions og offentlige RSS-feeds. Der er
            ingen server-side processing — alt er statisk og deployeret til GitHub Pages.
          </p>
          <p className="text-text-secondary leading-relaxed">
            Kildekoden er åben. Historiegruppering og divergensberegning er heuristiske
            scripts — ingen AI-modeller, ingen black boxes.
          </p>
        </section>

        <div className="editorial-rule pt-8 flex gap-4">
          <Link
            to="/methodology"
            className="text-sm font-mono text-accent hover:text-accent-light transition-colors"
          >
            Læs fuld metode →
          </Link>
          <Link
            to="/legal"
            className="text-sm font-mono text-text-tertiary hover:text-text-secondary transition-colors"
          >
            Juridisk & Etik →
          </Link>
        </div>
      </div>
    </div>
  );
}
