import { useState } from 'react';
import { Link, useLocation } from 'wouter';
import {
  ArrowRight, Play, CheckCircle2, ChevronRight, ChevronDown,
  Plus, Minus, Maximize2, Layers, Compass, Eye, Info
} from 'lucide-react';
import { Shell, StatusPill } from '@/components/layout/Shell';

export default function HomePage() {
  const [, setLocation] = useLocation();
  const [activeLayer, setActiveLayer] = useState<'rgb' | 'nir' | 'ndvi' | 'sar'>('rgb');
  const [showTechnicalDetails, setShowTechnicalDetails] = useState<boolean>(false);
  const [zoomLevel, setZoomLevel] = useState<number>(12);
  const [showBeforeAfter, setShowBeforeAfter] = useState<boolean>(false);
  const [selectedRegionTooltip, setSelectedRegionTooltip] = useState<boolean>(true);

  const handleUseExample = () => {
    setLocation('/analyze');
  };

  return (
    <Shell>
      {/* =========================================================================
          HERO BANNER: CLEAN, FRIENDLY & EDITORIAL
          "ASK A QUESTION. SEE WHAT CHANGED."
          ========================================================================= */}
      <section className="border-b border-[#DCD7CB] bg-[#F3F1EA] py-8 lg:py-10">
        <div className="mx-auto max-w-[1600px] px-4 lg:px-8">
          <div className="max-w-3xl mb-8">
            <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-[#17201D] leading-[1.08]">
              ASK A QUESTION.<br />
              <span className="text-[#183B2B]">SEE WHAT CHANGED.</span>
            </h1>
            <p className="mt-3 text-sm sm:text-base leading-relaxed text-[#69736D] max-w-2xl">
              Upload satellite imagery, ask a question in plain language, and get visual evidence with measurable results.
            </p>
            <div className="mt-5 flex flex-wrap items-center gap-3">
              <Link
                href="/analyze"
                className="inline-flex items-center gap-2 bg-[#183B2B] text-white px-5 py-2.5 font-mono-tech text-xs font-semibold hover:bg-[#122C20] transition-colors rounded-[2px]"
                data-testid="button-start-analysis"
              >
                <span>Start Analysis</span>
                <ArrowRight size={14} />
              </Link>
              <Link
                href="/compare"
                className="inline-flex items-center gap-2 border border-[#DCD7CB] bg-white text-[#17201D] px-5 py-2.5 font-mono-tech text-xs font-medium hover:bg-[#ECE9E0] transition-colors rounded-[2px]"
                data-testid="button-try-demo"
              >
                <span>Try Demo</span>
                <Play size={12} className="text-[#183B2B]" />
              </Link>
            </div>
          </div>

          {/* =========================================================================
              THREE-COLUMN WORKSPACE SHOWCASE:
              LEFT (Explanation) | CENTER (Satellite Map) | RIGHT (Result)
              ========================================================================= */}
          <div className="grid gap-6 lg:grid-cols-[330px_1fr_340px] items-stretch">
            
            {/* ---------------------------------------------------------------------
                LEFT: What can you investigate? & Example Question
                --------------------------------------------------------------------- */}
            <div className="flex flex-col justify-between border border-[#DCD7CB] bg-white p-5 rounded-[2px]">
              <div>
                <div className="font-mono-tech text-[10px] uppercase tracking-wider text-[#69736D] mb-1">
                  GUIDE
                </div>
                <h2 className="text-base font-bold text-[#17201D]">
                  What can you investigate?
                </h2>

                {/* Friendly list of use cases */}
                <ul className="mt-3 space-y-1.5 text-xs text-[#17201D] font-sans">
                  <li className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 bg-[#183B2B] rounded-full" />
                    <span>New construction</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 bg-[#183B2B] rounded-full" />
                    <span>Urban expansion</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 bg-[#183B2B] rounded-full" />
                    <span>Flood impact</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 bg-[#183B2B] rounded-full" />
                    <span>Vegetation loss</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 bg-[#183B2B] rounded-full" />
                    <span>Water changes</span>
                  </li>
                </ul>

                {/* Example Question Callout */}
                <div className="mt-5 border-t border-[#DCD7CB] pt-4">
                  <span className="font-mono-tech text-[10px] text-[#69736D] uppercase block">
                    EXAMPLE QUESTION:
                  </span>
                  <p className="mt-1.5 font-sans font-medium text-xs text-[#17201D] bg-[#F3F1EA] p-2.5 border border-[#DCD7CB] rounded-[2px] leading-relaxed">
                    "Has the built-up area increased between 2020 and 2026?"
                  </p>
                  <button
                    onClick={handleUseExample}
                    className="mt-2.5 w-full inline-flex items-center justify-center gap-1.5 bg-[#F3F1EA] border border-[#DCD7CB] py-2 text-xs font-mono-tech font-semibold text-[#183B2B] hover:bg-[#ECE9E0] transition-colors rounded-[2px]"
                    data-testid="button-use-example"
                  >
                    <span>Use this example</span>
                    <ArrowRight size={12} />
                  </button>
                </div>
              </div>

              {/* Mission Details Section */}
              <div className="mt-6 border-t border-[#DCD7CB] pt-4 font-mono-tech text-xs">
                <div className="text-[10px] text-[#69736D] uppercase mb-2 font-bold">
                  MISSION DETAILS
                </div>
                <div className="space-y-1.5 text-xs text-[#17201D]">
                  <div className="flex justify-between">
                    <span className="text-[#69736D]">Location:</span>
                    <span className="font-medium">Noida, Uttar Pradesh</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#69736D]">Images:</span>
                    <span className="font-medium">2020 → 2026</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#69736D]">Resolution:</span>
                    <span className="font-bold text-[#183B2B]">10 m</span>
                  </div>
                </div>
              </div>
            </div>

            {/* ---------------------------------------------------------------------
                CENTER: SATELLITE MAP (MAIN VISUAL HERO)
                Controls: +, -, Layers, Before/After, Fullscreen
                Top metadata: Sentinel-2 · 10 m · 18 Mar 2026 · Noida
                --------------------------------------------------------------------- */}
            <div className="relative min-h-[480px] border border-[#DCD7CB] bg-[#243029] overflow-hidden flex flex-col justify-between rounded-[2px]">
              {/* Satellite Background Simulation */}
              <div
                className={`absolute inset-0 transition-opacity duration-500 ${
                  showBeforeAfter
                    ? 'satellite-ortho-baseline opacity-90'
                    : activeLayer === 'rgb'
                    ? 'satellite-ortho-noida opacity-90'
                    : activeLayer === 'nir'
                    ? 'bg-[#331822] opacity-90'
                    : activeLayer === 'ndvi'
                    ? 'satellite-ortho-baseline opacity-90'
                    : 'satellite-radar-sar opacity-90'
                }`}
                style={
                  !showBeforeAfter && activeLayer === 'nir'
                    ? {
                        backgroundImage: `
                          radial-gradient(circle at 45% 45%, rgba(225, 29, 72, 0.65), transparent 45%),
                          radial-gradient(circle at 65% 55%, rgba(2, 132, 199, 0.35), transparent 40%),
                          linear-gradient(135deg, #1C0F16 0%, #331822 50%, #29131C 100%)
                        `,
                      }
                    : undefined
                }
              />

              {/* Subtle Coordinate Graticules */}
              <div className="graticule-grid absolute inset-0 pointer-events-none opacity-25" />

              {/* Top Clean Metadata Strip */}
              <div className="relative z-10 flex flex-wrap items-center justify-between gap-2 border-b border-white/20 bg-black/75 px-4 py-2 text-white font-mono-tech text-xs backdrop-blur-sm">
                <div className="flex items-center gap-3">
                  <span className="font-bold text-[#BAE6FD]">Sentinel-2</span>
                  <span>·</span>
                  <span>10 m</span>
                  <span>·</span>
                  <span>18 Mar 2026</span>
                  <span>·</span>
                  <span>Noida</span>
                </div>
                {showBeforeAfter && (
                  <span className="text-[#FDE68A] text-[10px] font-bold uppercase">
                    SHOWING 2020 BASELINE
                  </span>
                )}
              </div>

              {/* Center Detected Region & Clean Tooltip */}
              <div className="relative z-10 my-auto flex flex-col items-center justify-center p-6 text-center">
                {/* Bounding Polygon */}
                <div
                  onClick={() => setSelectedRegionTooltip(!selectedRegionTooltip)}
                  className="relative h-44 w-64 border-2 border-dashed border-[#FDE68A] bg-[#C25E2E]/15 cursor-pointer flex flex-col justify-between p-3 transition-all hover:bg-[#C25E2E]/25 shadow-2xl"
                >
                  <div className="flex justify-between font-mono-tech text-[10px] text-[#FDE68A] bg-black/60 px-2 py-0.5">
                    <span>SECTOR 137–168</span>
                    <span>DETECTED CHANGE</span>
                  </div>

                  {/* Clean Tooltip inside map */}
                  {selectedRegionTooltip && (
                    <div className="bg-white text-[#17201D] font-sans p-3 border border-[#DCD7CB] shadow-xl text-left rounded-[2px] max-w-[200px] mx-auto animate-in fade-in">
                      <div className="font-mono-tech text-[10px] uppercase text-[#69736D]">
                        DETECTED REGION
                      </div>
                      <div className="font-bold text-sm text-[#17201D] mt-0.5">
                        Built-up area
                      </div>
                      <div className="flex items-baseline justify-between mt-1 text-xs font-mono-tech">
                        <span className="font-bold text-[#C25E2E]">+18.4%</span>
                        <span className="text-[#69736D]">15.6 km²</span>
                      </div>
                      <Link
                        href="/analyze"
                        className="mt-2.5 block text-center bg-[#183B2B] text-white py-1 font-mono-tech text-[10px] font-semibold hover:bg-[#122C20] rounded-[2px]"
                      >
                        View details →
                      </Link>
                    </div>
                  )}

                  <div className="text-right font-mono-tech text-[9px] text-white/80 bg-black/60 px-2 py-0.5">
                    Click region to inspect
                  </div>
                </div>
              </div>

              {/* Bottom Simple Controls: +, -, Layers, Before / After, Fullscreen */}
              <div className="relative z-10 flex flex-wrap items-center justify-between gap-3 border-t border-white/20 bg-black/80 px-4 py-2 text-white font-mono-tech text-xs backdrop-blur-sm">
                {/* Simple Zoom & Navigation */}
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => setZoomLevel((prev) => Math.min(18, prev + 1))}
                    className="p-1 border border-white/30 hover:bg-white/20 rounded-[2px]"
                    title="Zoom in"
                    data-testid="btn-zoom-in"
                  >
                    <Plus size={13} />
                  </button>
                  <button
                    onClick={() => setZoomLevel((prev) => Math.max(8, prev - 1))}
                    className="p-1 border border-white/30 hover:bg-white/20 rounded-[2px]"
                    title="Zoom out"
                    data-testid="btn-zoom-out"
                  >
                    <Minus size={13} />
                  </button>
                  <span className="text-[10px] text-slate-300 ml-1">{zoomLevel}z</span>
                </div>

                {/* Layer Toggle & Before/After */}
                <div className="flex items-center gap-2">
                  {/* Layers Menu */}
                  <div className="flex items-center gap-1">
                    <span className="text-slate-400 text-[10px]">Layers:</span>
                    {(['rgb', 'nir', 'ndvi', 'sar'] as const).map((l) => (
                      <button
                        key={l}
                        onClick={() => {
                          setActiveLayer(l);
                          setShowBeforeAfter(false);
                        }}
                        className={`px-2 py-0.5 uppercase text-[10px] rounded-[2px] ${
                          !showBeforeAfter && activeLayer === l
                            ? 'bg-[#183B2B] text-white font-bold'
                            : 'text-slate-300 hover:bg-white/10'
                        }`}
                      >
                        {l}
                      </button>
                    ))}
                  </div>

                  {/* Before / After toggle */}
                  <button
                    onClick={() => setShowBeforeAfter(!showBeforeAfter)}
                    className={`px-2 py-0.5 text-[10px] border rounded-[2px] transition-colors ${
                      showBeforeAfter
                        ? 'border-[#FDE68A] bg-[#FDE68A] text-black font-bold'
                        : 'border-white/30 text-white hover:bg-white/10'
                    }`}
                    data-testid="btn-before-after"
                  >
                    {showBeforeAfter ? 'Showing 2020' : 'Before / After'}
                  </button>
                </div>
              </div>
            </div>

            {/* ---------------------------------------------------------------------
                RIGHT: ANALYSIS RESULT (Clean Human-Readable Evidence)
                --------------------------------------------------------------------- */}
            <div className="flex flex-col justify-between border border-[#DCD7CB] bg-white p-5 rounded-[2px]">
              <div>
                <div className="flex items-center justify-between border-b border-[#DCD7CB] pb-3">
                  <h2 className="font-mono-tech text-xs uppercase tracking-wider font-bold text-[#17201D]">
                    ANALYSIS RESULT
                  </h2>
                  <span className="text-[#15803D] font-mono-tech text-xs font-bold flex items-center gap-1">
                    <CheckCircle2 size={13} />
                    Analysis complete
                  </span>
                </div>

                {/* Question and Plain Language Answer */}
                <div className="mt-4 pb-3 border-b border-[#DCD7CB]">
                  <span className="font-mono-tech text-[10px] text-[#69736D] uppercase block">
                    QUESTION
                  </span>
                  <p className="font-serif-editorial text-sm italic text-[#17201D] mt-0.5">
                    "Has urban expansion increased?"
                  </p>
                  
                  <div className="mt-3 p-3 bg-[#E5EFE9] border border-[#183B2B]/20 rounded-[2px]">
                    <span className="font-mono-tech text-[10px] text-[#183B2B] uppercase font-bold block">
                      ANSWER
                    </span>
                    <p className="font-sans text-xs font-bold text-[#183B2B] mt-0.5">
                      YES — Built-up area increased by 18.4%.
                    </p>
                  </div>
                </div>

                {/* Measurable Human Evidence Rows */}
                <div className="mt-4 space-y-2.5 font-mono-tech text-xs">
                  <div className="flex items-center justify-between py-1 border-b border-[#DCD7CB]/60">
                    <span className="text-[#69736D]">Changed area</span>
                    <span className="font-bold text-[#17201D]">15.6 km²</span>
                  </div>

                  <div className="flex items-center justify-between py-1 border-b border-[#DCD7CB]/60">
                    <span className="text-[#69736D]">Optical evidence</span>
                    <span className="font-bold text-[#15803D]">Strong</span>
                  </div>

                  <div className="flex items-center justify-between py-1 border-b border-[#DCD7CB]/60">
                    <span className="text-[#69736D]">SAR evidence</span>
                    <span className="font-bold text-[#15803D]">Supporting</span>
                  </div>

                  <div className="flex items-center justify-between py-1 border-b border-[#DCD7CB]/60">
                    <span className="text-[#69736D]">Confidence</span>
                    <span className="font-bold text-[#17201D]">94%</span>
                  </div>

                  <div className="flex items-center justify-between py-1 border-b border-[#DCD7CB]/60">
                    <span className="text-[#69736D]">Verification</span>
                    <span className="font-bold text-[#15803D]">Passed</span>
                  </div>
                </div>

                {/* Expandable Technical Details Section */}
                <div className="mt-4 pt-2">
                  <button
                    onClick={() => setShowTechnicalDetails(!showTechnicalDetails)}
                    className="flex items-center justify-between w-full font-mono-tech text-[11px] text-[#183B2B] font-semibold hover:underline"
                    data-testid="btn-toggle-tech-details"
                  >
                    <span>{showTechnicalDetails ? '▲ Hide technical evidence' : '▼ View technical evidence'}</span>
                  </button>

                  {showTechnicalDetails && (
                    <div className="mt-2.5 p-3 bg-[#F3F1EA] border border-[#DCD7CB] font-mono-tech text-[10px] space-y-1 text-[#17201D] rounded-[2px] animate-in fade-in">
                      <div className="flex justify-between">
                        <span className="text-[#69736D]">Model:</span>
                        <span className="font-bold">ChangeNet v2 (Siamese ViT)</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[#69736D]">Sensor:</span>
                        <span className="font-medium">Sentinel-2 + SAR</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[#69736D]">CRS:</span>
                        <span>EPSG:4326</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[#69736D]">NDBI:</span>
                        <span className="font-bold text-[#C25E2E]">+0.46 (Concrete index)</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[#69736D]">SAR:</span>
                        <span className="font-bold text-[#15803D]">+4.2 dB (Double bounce)</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Direct Workspace Link */}
              <div className="mt-6 pt-4 border-t border-[#DCD7CB]">
                <Link
                  href="/analyze"
                  className="flex items-center justify-between w-full bg-[#183B2B] text-white py-2 px-3 font-mono-tech text-xs font-semibold hover:bg-[#122C20] transition-colors rounded-[2px]"
                >
                  <span>Open Interactive Workspace</span>
                  <ArrowRight size={13} />
                </Link>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* =========================================================================
          HOW IT WORKS: 5-STEP SIMPLE WORKFLOW (Plain English)
          Upload Image → Ask Question → Analyze → See What Changed → Check Evidence
          ========================================================================= */}
      <section className="py-14 bg-white border-b border-[#DCD7CB]">
        <div className="mx-auto max-w-[1600px] px-4 lg:px-8">
          <div className="max-w-xl mb-8">
            <div className="font-mono-tech text-[10px] uppercase tracking-wider text-[#69736D]">
              HOW IT WORKS
            </div>
            <h2 className="text-2xl font-bold tracking-tight text-[#17201D] mt-1">
              From satellite imagery to clear answers
            </h2>
            <p className="mt-2 text-xs text-[#69736D]">
              No GIS experience needed. SatQuery handles satellite ingestion, multi-spectral band math, and change detection automatically.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5 font-mono-tech text-xs">
            <div className="border border-[#DCD7CB] bg-[#F3F1EA] p-4 rounded-[2px]">
              <div className="font-bold text-xs text-[#183B2B] mb-1">01</div>
              <div className="font-bold text-[#17201D] mb-1">UPLOAD IMAGE</div>
              <p className="text-[11px] text-[#69736D] leading-normal font-sans">
                Select your area or choose from our satellite catalog.
              </p>
            </div>

            <div className="border border-[#DCD7CB] bg-[#F3F1EA] p-4 rounded-[2px]">
              <div className="font-bold text-xs text-[#183B2B] mb-1">02</div>
              <div className="font-bold text-[#17201D] mb-1">ASK QUESTION</div>
              <p className="text-[11px] text-[#69736D] leading-normal font-sans">
                Type in plain language what you want to verify.
              </p>
            </div>

            <div className="border border-[#DCD7CB] bg-[#F3F1EA] p-4 rounded-[2px]">
              <div className="font-bold text-xs text-[#183B2B] mb-1">03</div>
              <div className="font-bold text-[#17201D] mb-1">ANALYZE</div>
              <p className="text-[11px] text-[#69736D] leading-normal font-sans">
                ChangeNet compares dates and multi-spectral sensors.
              </p>
            </div>

            <div className="border border-[#DCD7CB] bg-[#F3F1EA] p-4 rounded-[2px]">
              <div className="font-bold text-xs text-[#183B2B] mb-1">04</div>
              <div className="font-bold text-[#17201D] mb-1">SEE WHAT CHANGED</div>
              <p className="text-[11px] text-[#69736D] leading-normal font-sans">
                Inspect the highlighted area and exact percentage changes.
              </p>
            </div>

            <div className="border border-[#DCD7CB] bg-[#F3F1EA] p-4 rounded-[2px]">
              <div className="font-bold text-xs text-[#183B2B] mb-1">05</div>
              <div className="font-bold text-[#17201D] mb-1">EXPORT REPORT</div>
              <p className="text-[11px] text-[#69736D] leading-normal font-sans">
                Download printable PDF dossiers or GIS GeoJSON files.
              </p>
            </div>
          </div>
        </div>
      </section>
    </Shell>
  );
}
