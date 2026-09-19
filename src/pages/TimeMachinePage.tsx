import { useState, useEffect } from 'react';
import { Link } from 'wouter';
import { Play, Pause, RotateCcw, ArrowRight, Calendar, Compass, Info } from 'lucide-react';
import { Shell, PageHeader, Panel, StatusPill } from '@/components/layout/Shell';
import { SCENARIOS } from '@/lib/mockData';

export default function TimeMachinePage() {
  const scenario = SCENARIOS.noida;
  const epochs = scenario.timeMachineEpochs;

  const [activeYear, setActiveYear] = useState<number>(2026);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setActiveYear((prev) => {
        const idx = epochs.findIndex((e) => e.year === prev);
        const nextIdx = (idx + 1) % epochs.length;
        return epochs[nextIdx].year;
      });
    }, 2000);
    return () => clearInterval(interval);
  }, [isPlaying, epochs]);

  const currentEpoch = epochs.find((e) => e.year === activeYear) ?? epochs[epochs.length - 1];

  return (
    <Shell>
      <div className="mx-auto max-w-[1600px] px-4 py-8 lg:px-8">
        <PageHeader
          eyebrow="HISTORICAL SATELLITE ARCHIVE"
          title="Satellite Time Machine"
          description="Step through satellite images over time to see how the landscape transformed year by year."
          actions={
            <div className="flex items-center gap-3">
              <StatusPill tone="cyan">
                {activeYear} Selected
              </StatusPill>
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="inline-flex items-center gap-2 bg-[#183B2B] text-white px-3.5 py-1.5 font-mono-tech text-xs font-semibold hover:bg-[#122C20] transition-colors rounded-[2px]"
                data-testid="btn-play-timemachine"
              >
                {isPlaying ? <Pause size={12} /> : <Play size={12} className="ml-0.5" />}
                <span>{isPlaying ? 'Pause timeline' : 'Play timeline'}</span>
              </button>
            </div>
          }
        />

        {/* =========================================================================
            HORIZONTAL SCIENTIFIC TIMELINE: 2018 ─── 2020 ─── 2022 ─── 2024 ─── 2026
            ========================================================================= */}
        <div className="border border-[#DCD7CB] bg-white p-5 rounded-[2px] mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="font-mono-tech text-xs text-[#69736D]">
              <span className="text-[#17201D] font-bold text-sm block">Timeline Scrubber</span>
              <span>Click any year to view that satellite acquisition and see what changed.</span>
            </div>

            {/* The Horizontal Line */}
            <div className="flex items-center gap-4 sm:gap-8 font-mono-tech text-xs font-bold text-[#69736D]">
              {epochs.map((ep, idx) => {
                const isCur = ep.year === activeYear;
                return (
                  <div key={ep.year} className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        setIsPlaying(false);
                        setActiveYear(ep.year);
                      }}
                      className={`px-3 py-1.5 transition-all rounded-[2px] border ${
                        isCur
                          ? 'bg-[#183B2B] text-white border-[#183B2B]'
                          : 'bg-[#F3F1EA] text-[#69736D] border-[#DCD7CB] hover:bg-[#ECE9E0] hover:text-[#17201D]'
                      }`}
                      data-testid={`btn-year-${ep.year}`}
                    >
                      {ep.year}
                    </button>
                    {idx < epochs.length - 1 && (
                      <span className="text-[#DCD7CB] select-none">─────</span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* 2-COLUMN VIEW: SATELLITE IMAGE + REAL DATA READOUT */}
        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          {/* Real Geographic Imagery Canvas */}
          <div className="border border-[#DCD7CB] bg-[#243029] relative overflow-hidden min-h-[480px] rounded-[2px] flex flex-col justify-between">
            {/* Dynamic Satellite Imagery Surface */}
            <div
              className={`absolute inset-0 transition-all duration-700 ${
                activeYear <= 2018 ? 'satellite-ortho-baseline' : 'satellite-ortho-noida'
              }`}
            />
            {/* Graticule Lines */}
            <div className="graticule-grid absolute inset-0 pointer-events-none opacity-30" />

            {/* Header Metadata Overlay */}
            <div className="relative z-10 flex flex-wrap items-center justify-between gap-2 border-b border-white/20 bg-black/75 px-4 py-2 text-white font-mono-tech text-[10px] backdrop-blur-sm">
              <div className="flex items-center gap-3">
                <span className="font-bold text-[#BAE6FD]">{currentEpoch.resolution}</span>
                <span>|</span>
                <span>ACQUIRED: {currentEpoch.date}</span>
                <span>|</span>
                <span>AOI: NOIDA SECTOR 137–168</span>
              </div>
              <div>EPSG:4326 (WGS 84)</div>
            </div>

            {/* Center Bounding Footprint Overlay */}
            <div className="relative z-10 my-auto flex flex-col items-center justify-center p-6 text-center">
              <div className="h-44 w-64 border-2 border-dashed border-[#FDE68A] bg-[#C25E2E]/15 flex flex-col justify-between p-2 shadow-2xl">
                <div className="flex justify-between font-mono-tech text-[9px] text-[#FDE68A] bg-black/60 px-2 py-0.5">
                  <span>EXPANSION CLUSTERS</span>
                  <span>{currentEpoch.urbanKm2} km²</span>
                </div>
                <div className="bg-black/60 text-white font-mono-tech text-xs font-semibold py-1 px-2 mx-auto rounded-[2px]">
                  {currentEpoch.description}
                </div>
                <div className="text-right font-mono-tech text-[9px] text-white/80 bg-black/60 px-2 py-0.5">
                  CLOUD COVER: {currentEpoch.cloudCover}%
                </div>
              </div>
            </div>

            {/* Bottom Telemetry Bar */}
            <div className="relative z-10 flex flex-wrap items-center justify-between gap-2 border-t border-white/20 bg-black/75 px-4 py-2 text-white font-mono-tech text-[10px] backdrop-blur-sm">
              <div>TARGET COORDINATES: 28.5355° N, 77.3910° E</div>
              <div className="flex items-center gap-2">
                <span>0</span>
                <div className="h-1 w-12 bg-white" />
                <span>1.5 KM</span>
              </div>
            </div>
          </div>

          {/* Right Data Telemetry (Structured Rows: NDBI, NDVI, Built-Up Area, Detected Changes) */}
          <div className="flex flex-col justify-between border border-[#DCD7CB] bg-white p-6 rounded-[2px]">
            <div>
              <div className="font-mono-tech text-[10px] uppercase tracking-widest text-[#69736D] mb-1">
                EPOCH TELEMETRY / {currentEpoch.year}
              </div>
              <h3 className="text-xl font-bold text-[#17201D]">
                {currentEpoch.description}
              </h3>

              {/* Data Table */}
              <div className="mt-5 border border-[#DCD7CB]">
                <table className="gis-table font-mono-tech">
                  <thead>
                    <tr>
                      <th>PARAMETER</th>
                      <th>VALUE</th>
                      <th className="text-right">DELTA (vs 2018)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#DCD7CB]">
                    <tr>
                      <td className="font-bold text-[#17201D]">BUILT-UP AREA</td>
                      <td className="font-bold text-[#C25E2E]">{currentEpoch.urbanKm2} km²</td>
                      <td className="text-right font-bold text-[#C25E2E]">
                        +{ (currentEpoch.urbanKm2 - 24.1).toFixed(1) } km²
                      </td>
                    </tr>
                    <tr>
                      <td className="font-bold text-[#17201D]">NDVI (VEGETATION)</td>
                      <td className="text-green-700 font-bold">{currentEpoch.ndviAvg}</td>
                      <td className="text-right text-red-600 font-bold">
                        { (currentEpoch.ndviAvg - 0.52).toFixed(2) }
                      </td>
                    </tr>
                    <tr>
                      <td className="font-bold text-[#17201D]">NDBI (CONCRETE INDEX)</td>
                      <td className="font-bold text-[#17201D]">
                        { (0.32 - (2026 - activeYear) * 0.05).toFixed(2) }
                      </td>
                      <td className="text-right font-bold text-[#183B2B]">
                        +{ ((2026 - activeYear) === 0 ? 0.46 : 0.28).toFixed(2) }
                      </td>
                    </tr>
                    <tr>
                      <td className="font-bold text-[#17201D]">SAR RADAR BACKSCATTER</td>
                      <td>{currentEpoch.sarDbAvg} dB</td>
                      <td className="text-right text-[#183B2B] font-bold">
                        +{ (currentEpoch.sarDbAvg - (-14.2)).toFixed(1) } dB
                      </td>
                    </tr>
                    <tr>
                      <td className="font-bold text-[#17201D]">CLOUD CONTAMINATION</td>
                      <td>{currentEpoch.cloudCover}%</td>
                      <td className="text-right text-[#15803D]">NOMINAL</td>
                    </tr>
                    <tr>
                      <td className="font-bold text-[#17201D]">PRIMARY PLATFORM</td>
                      <td>{currentEpoch.resolution}</td>
                      <td className="text-right">CALIBRATED</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="mt-8 border-t border-[#DCD7CB] pt-4 flex items-center justify-between font-mono-tech text-xs">
              <Link href="/compare" className="text-[#183B2B] font-bold hover:underline flex items-center gap-1">
                Open in Swipe Compare <ArrowRight size={12} />
              </Link>
              <Link href="/analyze" className="text-[#69736D] hover:text-[#17201D]">
                Open Investigation Console →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </Shell>
  );
}
