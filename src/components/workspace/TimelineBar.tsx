import { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, Calendar, ChevronRight } from 'lucide-react';

interface TimelineBarProps {
  epochs: {
    year: number;
    date: string;
    description: string;
    urbanKm2: number;
    badge: string;
  }[];
  activeYear: number;
  onYearChange: (year: number) => void;
}

export function TimelineBar({ epochs, activeYear, onYearChange }: TimelineBarProps) {
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      const currentIndex = epochs.findIndex((e) => e.year === activeYear);
      const nextIndex = (currentIndex + 1) % epochs.length;
      onYearChange(epochs[nextIndex].year);
    }, 1800);
    return () => clearInterval(interval);
  }, [isPlaying, activeYear, epochs, onYearChange]);

  const currentEpoch = epochs.find((e) => e.year === activeYear) ?? epochs[epochs.length - 1];

  return (
    <div className="rounded-2xl border border-slate-800 bg-[#0B192A]/90 p-4 shadow-xl backdrop-blur-md">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        {/* Left Play/Pause Controls & Active Epoch Label */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className={`flex h-9 w-9 items-center justify-center rounded-xl font-medium transition-all ${
              isPlaying
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                : 'bg-blue-600 text-white shadow-lg shadow-blue-950/40 hover:bg-blue-500'
            }`}
            title={isPlaying ? 'Pause temporal playback' : 'Auto-play temporal evolution'}
            data-testid="button-timeline-play"
          >
            {isPlaying ? <Pause size={15} /> : <Play size={15} className="ml-0.5" />}
          </button>

          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-sm font-bold text-cyan-300">
                {currentEpoch.year}
              </span>
              <span className="font-mono text-[10px] text-slate-500">
                {currentEpoch.date}
              </span>
              <span className="rounded bg-slate-800 px-2 py-0.5 font-mono text-[9px] text-slate-400 uppercase">
                {currentEpoch.badge}
              </span>
            </div>
            <p className="text-xs text-slate-400 max-w-md truncate">
              {currentEpoch.description}
            </p>
          </div>
        </div>

        {/* Right Epoch Node Timeline */}
        <div className="relative flex items-center justify-between gap-1 flex-1 max-w-xl px-2">
          {/* Connecting Track */}
          <div className="absolute left-6 right-6 top-1/2 -translate-y-1/2 h-0.5 bg-slate-800" />
          <div
            className="absolute left-6 top-1/2 -translate-y-1/2 h-0.5 bg-gradient-to-r from-blue-500 to-cyan-400 transition-all duration-300"
            style={{
              width: `${(epochs.findIndex((e) => e.year === activeYear) / (epochs.length - 1)) * 90}%`,
            }}
          />

          {epochs.map((ep) => {
            const isSelected = ep.year === activeYear;
            return (
              <button
                key={ep.year}
                onClick={() => {
                  setIsPlaying(false);
                  onYearChange(ep.year);
                }}
                className="relative z-10 flex flex-col items-center group focus:outline-none"
                data-testid={`button-timeline-year-${ep.year}`}
              >
                <div
                  className={`h-4 w-4 rounded-full border-2 transition-all duration-200 group-hover:scale-125 ${
                    isSelected
                      ? 'border-cyan-300 bg-cyan-400 shadow-[0_0_12px_#06B6D4]'
                      : 'border-slate-700 bg-[#07111F] group-hover:border-slate-500'
                  }`}
                />
                <span
                  className={`mt-1.5 font-mono text-[10px] transition-colors ${
                    isSelected ? 'font-bold text-cyan-300' : 'text-slate-500 group-hover:text-slate-300'
                  }`}
                >
                  {ep.year}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
