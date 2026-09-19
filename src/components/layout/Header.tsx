import { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { Menu, X } from 'lucide-react';

const navLinks = [
  { label: 'Home', href: '/' },
];

export function Header() {
  const [location] = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-[#DCD7CB] bg-[#F3F1EA]/95 backdrop-blur-sm">
      <div className="mx-auto flex h-14 max-w-[1600px] items-center justify-between px-4 lg:px-8">
        {/* Left: Brand Identity & Primary Navigation */}
        <div className="flex items-center gap-8">
          <Link href="/" className="group flex items-center" data-testid="link-logo">
            <span className="font-mono-tech text-base font-bold tracking-tight text-[#17201D]">
              SATQUERY AI
            </span>
          </Link>

          {/* Primary Navigation Links */}
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

        {/* Right: Mobile Menu Toggle */}
        <div className="flex items-center">
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
                    ? 'bg-[#183B2B] text-white font-medium'
                    : 'text-[#69736D] hover:bg-[#ECE9E0] hover:text-[#17201D]'
                }`}
              >
                {label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
