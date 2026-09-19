import { useState, useRef } from 'react';
import { SlidersHorizontal, Check, RefreshCw, Layers3, Radio, ArrowLeftRight } from 'lucide-react';

export function SwipeCompare() {
  const [split, setSplit] = useState<number>(50);
  const [mode, setMode] = useState<'before-after' | 'optical-sar'>('before-after');
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging && e.buttons !== 1) return;
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(5, Math.min(95, ((e.clientX - rect.left) / rect.width) * 100));
    setSplit(x);
  };

  return (
    <div className="flex flex-col gap-5">
      {/* Mode Switcher Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex rounded-xl border border-slate-800 bg-slate-900/60 p-1">
          <button
            onClick={() => setMode('before-after')}
            className={`rounded-lg px-4 py-2 text-xs font-semibold transition-all ${
              mode === 'before-after'
                ? 'bg-blue-600/30 text-cyan-300 border border-cyan-400/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
            data-testid="button-compare-before-after"
          >
            Temporal: 2020 Baseline vs 2026 Current
          </button>
          <button
            onClick={() => setMode('optical-sar')}
            className={`rounded-lg px-4 py-2 text-xs font-semibold transition-all ${
              mode === 'optical-sar'
                ? 'bg-blue-600/30 text-cyan-300 border border-cyan-400/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
            data-testid="button-compare-optical-sar"
          >
            Multi-Sensor: Optical S-2 vs Radar S-1 SAR
          </button>
        </div>

        <div className="flex items-center gap-2 font-mono text-[11px] text-slate-400">
          <span className="flex h-2 w-2 rounded-full bg-cyan-400 animate-pulse" />
          <span>Coordinates Synced: 28.5355° N, 77.3910° E</span>
        </div>
      </div>

      {/* Interactive Split Compare Surface */}
      <div
        ref={containerRef}
        onPointerDown={() => setIsDragging(true)}
        onPointerUp={() => setIsDragging(false)}
        onPointerLeave={() => setIsDragging(false)}
        onPointerMove={handlePointerMove}
        className="relative h-[560px] w-full cursor-ew-resize overflow-hidden rounded-2xl border border-slate-700/80 bg-[#07111F] shadow-2xl select-none"
      >
        {/* RIGHT LAYER (Background underneath) */}
        <div
          className="absolute inset-0"
          style={{
            backgroundColor: mode === 'before-after' ? '#091A2A' : '#111827',
            backgroundImage:
              mode === 'before-after'
                ? `
                  radial-gradient(ellipse at 60% 48%, rgba(220, 38, 38, 0.65), transparent 35%),
                  radial-gradient(circle at 35% 62%, rgba(245, 158, 11, 0.45), transparent 25%),
                  linear-gradient(rgba(56, 189, 248, 0.1) 1px, transparent 1px),
                  linear-gradient(90deg, rgba(56, 189, 248, 0.1) 1px, transparent 1px)
                `
                : `
                  radial-gradient(circle at 55% 48%, rgba(255, 255, 255, 0.7), transparent 20%),
                  radial-gradient(circle at 45% 60%, rgba(180, 180, 180, 0.5), transparent 25%),
                  radial-gradient(circle at 30% 30%, rgba(0, 0, 0, 0.8), transparent 35%),
                  repeating-linear-gradient(45deg, rgba(255, 255, 255, 0.04) 0 2px, transparent 2px 8px)
                `,
            backgroundSize: 'auto, auto, 40px 40px, 40px 40px',
          }}
        />

        {/* LEFT LAYER (Clipped by split width) */}
        <div
          className="absolute inset-y-0 left-0 overflow-hidden border-r-2 border-cyan-300 shadow-[0_0_20px_rgba(6,182,212,0.5)]"
          style={{
            width: `${split}%`,
            backgroundColor: mode === 'before-after' ? '#0E2A1E' : '#0E243A',
            backgroundImage:
              mode === 'before-after'
                ? `
                  radial-gradient(circle at 35% 45%, rgba(34, 197, 94, 0.65), transparent 45%),
                  radial-gradient(circle at 65% 55%, rgba(234, 179, 8, 0.45), transparent 35%),
                  linear-gradient(rgba(34, 197, 94, 0.08) 1px, transparent 1px),
                  linear-gradient(90deg, rgba(34, 197, 94, 0.08) 1px, transparent 1px)
                `
                : `
                  radial-gradient(ellipse at 50% 50%, rgba(30, 80, 120, 0.5), transparent 70%),
                  radial-gradient(circle at 35% 40%, rgba(34, 197, 94, 0.3), transparent 30%),
                  linear-gradient(rgba(56, 189, 248, 0.08) 1px, transparent 1px),
                  linear-gradient(90deg, rgba(56, 189, 248, 0.08) 1px, transparent 1px)
                `,
            backgroundSize: 'auto, auto, 40px 40px, 40px 40px',
          }}
        />

        {/* Draggable Divider Handle */}
        <div
          className="absolute inset-y-0 z-30 w-1 bg-cyan-300 pointer-events-none"
          style={{ left: `${split}%` }}
        >
          <div className="absolute left-1/2 top-1/2 flex h-10 w-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-2 border-cyan-100 bg-cyan-400 text-[#07111F] shadow-[0_0_20px_#06B6D4]">
            <SlidersHorizontal size={17} />
          </div>
        </div>

        {/* Left Badge */}
        <div className="absolute left-5 top-5 z-20 rounded-xl border border-slate-700/80 bg-[#07111F]/90 p-3 backdrop-blur-md">
          <div className="font-mono text-[9px] text-cyan-400">
            {mode === 'before-after' ? 'HISTORICAL BASELINE' : 'OPTICAL MULTI-SPECTRAL'}
          </div>
          <div className="mt-1 font-display text-sm font-semibold text-slate-100">
            {mode === 'before-after' ? 'Sentinel-2 L2A (2020-03-12)' : 'Sentinel-2 MSI B4,3,2 (10m)'}
          </div>
          <div className="mt-0.5 font-mono text-[10px] text-slate-500">
            {mode === 'before-after' ? 'NDVI: 0.58 · Canopy Dense' : 'Wavelength: 490–665 nm'}
          </div>
        </div>

        {/* Right Badge */}
        <div className="absolute right-5 top-5 z-20 rounded-xl border border-slate-700/80 bg-[#07111F]/90 p-3 text-right backdrop-blur-md">
          <div className="font-mono text-[9px] text-amber-400">
            {mode === 'before-after' ? 'CURRENT OBSERVATION' : 'SYNTHETIC APERTURE RADAR'}
          </div>
          <div className="mt-1 font-display text-sm font-semibold text-slate-100">
            {mode === 'before-after' ? 'Sentinel-2 + S-1 (2026-02-18)' : 'Sentinel-1 C-SAR VV/VH (20m)'}
          </div>
          <div className="mt-0.5 font-mono text-[10px] text-slate-500">
            {mode === 'before-after' ? 'Built-up Expansion +18.4%' : 'C-Band 5.405 GHz · Penetrates Clouds'}
          </div>
        </div>

        {/* Bottom Coordinates Readout */}
        <div className="absolute bottom-4 left-5 z-20 font-mono text-[10px] text-slate-400 rounded bg-[#07111F]/80 px-2 py-1">
          AOI NOIDA · 28.5355° N, 77.3910° E · 10m RESOLUTION
        </div>
      </div>

      {/* Manual Split Slider & Readout */}
      <div className="flex items-center gap-4 rounded-xl border border-slate-800 bg-[#0B192A]/80 p-4">
        <span className="font-mono text-xs text-slate-400">Split Ratio:</span>
        <input
          type="range"
          min="5"
          max="95"
          value={split}
          onChange={(e) => setSplit(Number(e.target.value))}
          className="flex-1 max-w-md cursor-pointer"
          data-testid="input-compare-slider"
        />
        <span className="font-mono text-xs font-bold text-cyan-300">
          {split.toFixed(0)}% / {(100 - split).toFixed(0)}%
        </span>
      </div>

      {/* Quantitative Delta Summary Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <div className="rounded-xl border border-slate-800 bg-[#0B192A]/70 p-4">
          <div className="eyebrow text-cyan-400">NET ALTERED SURFACE</div>
          <div className="mt-2 font-display text-2xl font-bold text-slate-100">15.6 km²</div>
          <p className="mt-1 text-[11px] text-slate-500">Verified change polygon footprint</p>
        </div>
        <div className="rounded-xl border border-slate-800 bg-[#0B192A]/70 p-4">
          <div className="eyebrow text-amber-400">BUILT-UP EXPANSION</div>
          <div className="mt-2 font-display text-2xl font-bold text-amber-300">+18.4%</div>
          <p className="mt-1 text-[11px] text-slate-500">Impervious concrete gain</p>
        </div>
        <div className="rounded-xl border border-slate-800 bg-[#0B192A]/70 p-4">
          <div className="eyebrow text-rose-400">CANOPY LOSS</div>
          <div className="mt-2 font-display text-2xl font-bold text-rose-300">-12.1%</div>
          <p className="mt-1 text-[11px] text-slate-500">Arable and vegetation conversion</p>
        </div>
        <div className="rounded-xl border border-slate-800 bg-[#0B192A]/70 p-4">
          <div className="eyebrow text-green-400">SAR CORROBORATION</div>
          <div className="mt-2 font-display text-2xl font-bold text-green-300">0.82 / 1.00</div>
          <p className="mt-1 text-[11px] text-slate-500">Radar double-bounce confirmation</p>
        </div>
      </div>
    </div>
  );
}
