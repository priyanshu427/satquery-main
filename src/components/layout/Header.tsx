import { useState, useEffect } from 'react';
import { Link, useLocation } from 'wouter';
import { Menu, X, RefreshCw, AlertTriangle } from 'lucide-react';
import { api, ApiStatus } from '@/lib/api';

const navLinks = [
  { label: 'Home', href: '/' },
  { label: 'Analyze', href: '/analyze' },
  { label: 'Compare', href: '/compare' },
  { label: 'Datasets', href: '/datasets' },
  { label: 'Reports', href: '/reports' },
];

export function Header() {
  const [location] = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [apiStatus, setApiStatus] = useState<ApiStatus>({
    isLive: false,
    backendUrl: 'http://localhost:8000/api',
    checkedAt: new Date().toISOString(),
  });
  const [checkingApi, setCheckingApi] = useState(false);

  const checkStatus = async () => {
    setCheckingApi(true);
    const status = await api.checkHealth();
    setApiStatus(status);
    setCheckingApi(false);
  };

  useEffect(() => {
    checkStatus();
  }, []);

  return (
    <header className="sticky top-0 z-50 border-b border-[#DCD7CB] bg-[#F3F1EA]/95 backdrop-blur-sm">
      <div className="mx-auto flex h-14 max-w-[1600px] items-center justify-between px-4 lg:px-8">
        {/* Left: Brand Identity */}
        <div className="flex items-center gap-8">
          <Link href="/" className="group flex items-center gap-3" data-testid="link-logo">
            <div className="flex h-7 w-7 items-center justify-center bg-[#183B2B] text-white font-mono-tech text-xs font-bold rounded-[2px]">
              SQ
            </div>
            <div>
              <span className="font-mono-tech text-sm font-bold tracking-tight text-[#17201D] block leading-none">
                SATQUERY AI
              </span>
              <span className="font-mono-tech text-[9px] uppercase tracking-wider text-[#69736D] block mt-0.5 leading-none">
                Earth Observation Intelligence
              </span>
            </div>
          </Link>

          {/* Primary Simple Navigation */}
          <nav className="hidden items-center gap-1 sm:flex" aria-label="Main Navigation">
            {navLinks.map(({ label, href }) => {
              const isActive = location === href || (href !== '/' && location.startsWith(href));
              return (
                <Link
                  key={href}
                  href={href}
                  className={`px-3 py-1.5 font-mono-tech text-xs transition-colors rounded-[2px] ${
                    isActive
                      ? 'bg-[#183B2B] text-white font-medium'
                      : 'text-[#69736D] hover:text-[#17201D] hover:bg-[#ECE9E0]'
                  }`}
                  data-testid={`link-nav-${label.toLowerCase()}`}
                >
                  {label}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Right: Demo Mode, Disaster Mode, Mobile Toggle */}
        <div className="flex items-center gap-3">
          {/* Mode Tag */}
          <button
            onClick={checkStatus}
            className={`inline-flex items-center gap-1.5 border px-2.5 py-1 font-mono-tech text-xs rounded-[2px] transition-colors ${
              apiStatus.isLive
                ? 'border-[#BBF7D0] bg-[#F0FDF4] text-[#15803D]'
                : 'border-[#DCD7CB] bg-white text-[#69736D]'
            }`}
            title="Click to check backend connection"
            data-testid="button-mode-indicator"
          >
            <span className={`h-1.5 w-1.5 rounded-full ${apiStatus.isLive ? 'bg-[#15803D]' : 'bg-[#C25E2E]'}`} />
            <span>{apiStatus.isLive ? 'Live API' : 'Demo Mode'}</span>
            {checkingApi && <RefreshCw size={9} className="animate-spin text-[#69736D]" />}
          </button>

          {/* Disaster Mode Quick Action */}
          <Link
            href="/disaster-mode"
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 font-mono-tech text-xs font-semibold rounded-[2px] border transition-colors ${
              location === '/disaster-mode'
                ? 'bg-[#B91C1C] text-white border-[#B91C1C]'
                : 'bg-[#FEF2F2] text-[#B91C1C] border-[#FECACA] hover:bg-[#FEE2E2]'
            }`}
            data-testid="link-disaster-mode"
          >
            <AlertTriangle size={12} />
            <span className="hidden md:inline">Disaster Mode</span>
          </Link>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="p-1.5 text-[#17201D] hover:bg-[#ECE9E0] sm:hidden rounded-[2px]"
            aria-label="Toggle navigation"
            data-testid="button-mobile-menu"
          >
            {mobileOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="border-t border-[#DCD7CB] bg-[#F3F1EA] px-4 py-3 sm:hidden">
          <div className="flex flex-col gap-1">
            {navLinks.map(({ label, href }) => (
              <Link
                key={href}
                href={href}
                onClick={() => setMobileOpen(false)}
                className={`px-3 py-2 font-mono-tech text-xs rounded-[2px] ${
                  location === href
                    ? 'bg-[#183B2B] text-white'
                    : 'text-[#69736D] hover:bg-[#ECE9E0] hover:text-[#17201D]'
                }`}
              >
                {label}
              </Link>
            ))}
            <Link
              href="/disaster-mode"
              onClick={() => setMobileOpen(false)}
              className="mt-2 flex items-center gap-1.5 px-3 py-2 font-mono-tech text-xs text-[#B91C1C] bg-[#FEF2F2] border border-[#FECACA] rounded-[2px]"
            >
              <AlertTriangle size={13} />
              <span>Disaster Mode</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
