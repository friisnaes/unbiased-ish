import { Link, useLocation } from 'react-router-dom';

const navItems = [
  { to: '/', label: 'Overblik' },
  { to: '/briefing', label: 'Daglig Briefing' },
  { to: '/stories', label: 'Historier' },
  { to: '/sources', label: 'Kilder' },
  { to: '/methodology', label: 'Metode' },
  { to: '/about', label: 'Om' },
];

export default function Header() {
  const { pathname } = useLocation();

  return (
    <header className="sticky top-0 z-50 bg-surface-900/95 backdrop-blur-md border-b border-surface-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-2 h-8 bg-accent rounded-sm group-hover:bg-accent-light transition-colors" />
            <div>
              <span className="font-display font-bold text-lg text-text-primary tracking-tight">
                Signal <span className="text-text-secondary font-normal">over</span> Støj
              </span>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const active = item.to === '/'
                ? pathname === '/'
                : pathname.startsWith(item.to);
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`px-3 py-1.5 text-sm font-body transition-colors rounded-sm ${
                    active
                      ? 'text-text-primary bg-surface-700'
                      : 'text-text-secondary hover:text-text-primary hover:bg-surface-800'
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-3">
            <span className="hidden lg:inline-flex items-center gap-1.5 text-xs font-mono text-text-tertiary">
              <span className="w-1.5 h-1.5 bg-divergence-low rounded-full animate-pulse" />
              Løbende opdateret
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
