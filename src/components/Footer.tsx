import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="border-t border-surface-700 mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <p className="font-display font-bold text-text-primary mb-2">
              Signal over Støj
            </p>
            <p className="text-sm text-text-tertiary leading-relaxed">
              Et sammenligningsværktøj for perspektiver.
              <br />
              Ikke en erstatning for original journalistik.
            </p>
          </div>

          <div>
            <p className="text-xs font-mono text-text-secondary uppercase tracking-wider mb-3">
              Navigation
            </p>
            <div className="flex flex-col gap-1.5">
              <Link to="/methodology" className="text-sm text-text-tertiary hover:text-text-primary transition-colors">
                Metode & Transparens
              </Link>
              <Link to="/sources" className="text-sm text-text-tertiary hover:text-text-primary transition-colors">
                Kildeprofiler
              </Link>
              <Link to="/legal" className="text-sm text-text-tertiary hover:text-text-primary transition-colors">
                Juridisk & Etik
              </Link>
              <Link to="/about" className="text-sm text-text-tertiary hover:text-text-primary transition-colors">
                Om projektet
              </Link>
            </div>
          </div>

          <div>
            <p className="text-xs font-mono text-text-secondary uppercase tracking-wider mb-3">
              Princip
            </p>
            <p className="text-sm text-text-tertiary italic leading-relaxed">
              "Ét datapunkt er støj.
              <br />
              Tre datapunkter er mønster.
              <br />
              Fem datapunkter er beslutningsgrundlag."
            </p>
          </div>
        </div>

        <div className="editorial-rule mt-8 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-text-tertiary">
            Overskrifter og uddrag tilhører de respektive udgivere. Denne side linker til original journalistik.
          </p>
          <p className="text-xs text-text-tertiary font-mono">
            Signal over Støj © {new Date().getFullYear()}
          </p>
        </div>
      </div>
    </footer>
  );
}
