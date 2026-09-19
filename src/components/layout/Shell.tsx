import { type ReactNode } from 'react';
import { Header } from './Header';
import { Footer } from './Footer';

export function cx(...classes: Array<string | false | undefined | null>) {
  return classes.filter(Boolean).join(' ');
}

export function Shell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-[#F3F1EA] text-[#17201D] flex flex-col font-sans selection:bg-[#183B2B] selection:text-white">
      <Header />
      <main className="flex-1 w-full">{children}</main>
      <Footer />
    </div>
  );
}

export function PageHeader({
  eyebrow,
  title,
  description,
  actions,
}: {
  eyebrow: string;
  title: string;
  description: string;
  actions?: ReactNode;
}) {
  return (
    <div className="mb-6 border-b border-[#DCD7CB] pb-5 flex flex-col justify-between gap-4 md:flex-row md:items-end">
      <div>
        <div className="font-mono-tech text-[11px] uppercase tracking-wider text-[#69736D] mb-1.5 flex items-center gap-2">
          <span className="h-1.5 w-1.5 bg-[#183B2B]" />
          <span>{eyebrow}</span>
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-[#17201D] sm:text-3xl">
          {title}
        </h1>
        <p className="mt-1.5 max-w-3xl text-xs sm:text-sm leading-relaxed text-[#69736D]">
          {description}
        </p>
      </div>
      {actions && <div className="flex shrink-0 items-center gap-2">{actions}</div>}
    </div>
  );
}

export function Panel({
  children,
  className = '',
  ...props
}: {
  children: ReactNode;
  className?: string;
  [key: string]: unknown;
}) {
  return (
    <section
      className={cx(
        'bg-white border border-[#DCD7CB] transition-colors',
        className
      )}
      {...props}
    >
      {children}
    </section>
  );
}

export function StatusPill({
  children,
  tone = 'default',
}: {
  children: ReactNode;
  tone?: 'default' | 'cyan' | 'green' | 'amber' | 'red' | 'blue';
}) {
  const tones = {
    default: 'border-[#DCD7CB] bg-[#ECE9E0] text-[#17201D]',
    cyan: 'border-[#BAE6FD] bg-[#F0F9FF] text-[#0369A1]',
    green: 'border-[#BBF7D0] bg-[#F0FDF4] text-[#15803D]',
    amber: 'border-[#FED7AA] bg-[#FFF7ED] text-[#C25E2E]',
    red: 'border-[#FECACA] bg-[#FEF2F2] text-[#B91C1C]',
    blue: 'border-[#BFDBFE] bg-[#EFF6FF] text-[#1D4ED8]',
  };

  return (
    <span
      className={cx(
        'inline-flex items-center gap-1.5 px-2 py-0.5 font-mono-tech text-[10px] uppercase font-medium border tracking-wide rounded-[2px]',
        tones[tone]
      )}
    >
      {children}
    </span>
  );
}
