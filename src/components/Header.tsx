import { useState } from 'react';
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
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-surface-900/95 backdrop-blur-md border-b border-surface-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-3 group" onClick={() => setMobileOpen(false)}>
            <div className="w-2 h-8 bg-accent rounded-sm group-hover:bg-accent-light transition-colors" />
            <div>
              <span className="font-display font-bold text-lg text-text-primary tracking-tight">
                Signal <span className="text-text-secondary font-normal">over</span> Støj
              </span>
            </div>
          </Link>

          {/* Desktop nav */}
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
            <Link
              to="/search"
              className="p-2 text-text-tertiary hover:text-text-primary transition-colors"
              aria-label="Søg"
            >
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <circle cx="7.5" cy="7.5" r="5.5" />
                <path d="M11.5 11.5L16 16" />
              </svg>
            </Link>
            <span className="hidden lg:inline-flex items-center gap-1.5 text-xs font-mono text-text-tertiary">
              <span className="w-1.5 h-1.5 bg-divergence-low rounded-full animate-pulse" />
              Løbende opdateret
            </span>

            {/* Mobile hamburger */}
            <button
              className="md:hidden p-2 text-text-secondary hover:text-text-primary transition-colors"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
            >
              {mobileOpen ? (
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M4 4l12 12M16 4L4 16" />
                </svg>
              ) : (
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M3 5h14M3 10h14M3 15h14" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <nav className="md:hidden border-t border-surface-700 bg-surface-900/98 backdrop-blur-md">
          <div className="max-w-7xl mx-auto px-4 py-3 space-y-1">
            {navItems.map((item) => {
              const active = item.to === '/'
                ? pathname === '/'
                : pathname.startsWith(item.to);
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={() => setMobileOpen(false)}
                  className={`block px-3 py-2.5 text-sm font-body rounded-sm transition-colors ${
                    active
                      ? 'text-text-primary bg-surface-700'
                      : 'text-text-secondary hover:text-text-primary hover:bg-surface-800'
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>
        </nav>
      )}
    </header>
  );
}
