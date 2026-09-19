import { useState, useRef } from 'react';
import { Link } from 'wouter';
import {
  ArrowLeftRight, ZoomIn, ZoomOut, Maximize2, Layers,
  ChevronDown, ChevronUp, Calendar, MapPin, CheckCircle2, TrendingUp, TrendingDown,
  Info
} from 'lucide-react';
import { Shell, PageHeader, Panel, StatusPill } from '@/components/layout/Shell';
import { SCENARIOS } from '@/lib/mockData';

export default function ComparePage() {
  const [split, setSplit] = useState<number>(50);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [viewMode, setViewMode] = useState<'swipe' | 'before' | 'after'>('swipe');
  const [activeChannel, setActiveChannel] = useState<'NDVI' | 'NDBI' | 'SAR' | 'CHANGE'>('CHANGE');
  const [showTechnicalDetails, setShowTechnicalDetails] = useState<boolean>(false);
  const [selectedYearA, setSelectedYearA] = useState<number>(2020);
  const [selectedYearB, setSelectedYearB] = useState<number>(2026);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const containerRef = useRef<HTMLDivElement>(null);

  const scenario = SCENARIOS.noida;

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (viewMode !== 'swipe') return;
    if (!isDragging && e.buttons !== 1) return;
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(5, Math.min(95, ((e.clientX - rect.left) / rect.width) * 100));
    setSplit(x);
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  return (
    <Shell>
      <div className="mx-auto max-w-[1600px] px-4 py-8 lg:px-8">
        {/* HEADER */}
        <PageHeader
          eyebrow="IMAGE COMPARISON"
          title="Compare satellite images"
          description="Drag the slider or switch views to see how the landscape transformed between two points in time."
          actions={
            <div className="flex flex-wrap items-center gap-3">
              {/* [ 2020 ]  <-->  [ 2026 ] */}
              <div className="flex items-center gap-2 border border-[#DCD7CB] bg-white px-3 py-1.5 rounded-[2px] font-mono-tech text-xs shadow-sm">
                <Calendar size={13} className="text-[#69736D]" />
                <button
                  onClick={() => {
                    setSelectedYearA(2020);
                    setViewMode('before');
                  }}
                  className={`px-2.5 py-0.5 rounded-[2px] transition-colors font-bold ${
                    viewMode === 'before'
                      ? 'bg-[#183B2B] text-white'
                      : 'bg-[#F3F1EA] text-[#17201D] hover:bg-[#ECE9E0]'
                  }`}
                  data-testid="btn-year-2020"
                >
                  {selectedYearA}
                </button>
                <span className="text-[#69736D] font-bold px-1">←→</span>
                <button
                  onClick={() => {
                    setSelectedYearB(2026);
                    setViewMode('after');
                  }}
                  className={`px-2.5 py-0.5 rounded-[2px] transition-colors font-bold ${
                    viewMode === 'after'
                      ? 'bg-[#183B2B] text-white'
                      : 'bg-[#F3F1EA] text-[#17201D] hover:bg-[#ECE9E0]'
                  }`}
                  data-testid="btn-year-2026"
                >
                  {selectedYearB}
                </button>
              </div>

              <div className="flex items-center gap-1.5 font-mono-tech text-xs text-[#69736D] bg-[#F3F1EA] px-3 py-1.5 border border-[#DCD7CB] rounded-[2px]">
                <MapPin size={13} className="text-[#183B2B]" />
                <span>Noida, Uttar Pradesh</span>
              </div>
            </div>
          }
        />

        {/* COMPARISON MAIN CONTAINER */}
        <div className="border border-[#DCD7CB] bg-white rounded-[2px] overflow-hidden shadow-sm">
          {/* TOP BAR: Controls (Before, After, Swipe) & Zoom */}
          <div className="flex flex-wrap items-center justify-between border-b border-[#DCD7CB] bg-[#ECE9E0] px-4 py-2.5 gap-3">
            {/* View Mode Controls: Before | After | Swipe */}
            <div className="flex items-center gap-1 bg-white border border-[#DCD7CB] p-1 rounded-[2px] font-mono-tech text-xs">
              <button
                onClick={() => setViewMode('before')}
                className={`px-3 py-1 rounded-[2px] transition-colors font-medium ${
                  viewMode === 'before'
                    ? 'bg-[#183B2B] text-white font-bold'
                    : 'text-[#69736D] hover:text-[#17201D]'
                }`}
                data-testid="btn-mode-before"
              >
                Before (2020)
              </button>
              <button
                onClick={() => setViewMode('after')}
                className={`px-3 py-1 rounded-[2px] transition-colors font-medium ${
                  viewMode === 'after'
                    ? 'bg-[#183B2B] text-white font-bold'
                    : 'text-[#69736D] hover:text-[#17201D]'
                }`}
                data-testid="btn-mode-after"
              >
                After (2026)
              </button>
              <button
                onClick={() => setViewMode('swipe')}
                className={`px-3 py-1 rounded-[2px] transition-colors font-medium inline-flex items-center gap-1.5 ${
                  viewMode === 'swipe'
                    ? 'bg-[#183B2B] text-white font-bold'
                    : 'text-[#69736D] hover:text-[#17201D]'
                }`}
                data-testid="btn-mode-swipe"
              >
                <ArrowLeftRight size={12} />
                Swipe
              </button>
            </div>

            {/* Quick Metadata & Zoom Controls */}
            <div className="flex items-center gap-3 font-mono-tech text-xs text-[#69736D]">
              <span className="hidden sm:inline">Sentinel-2 · 10 m · 18 Mar 2026</span>
              <div className="flex items-center border border-[#DCD7CB] bg-white rounded-[2px]">
                <button
                  onClick={() => setZoomLevel((z) => Math.max(0.8, z - 0.2))}
                  className="px-2 py-1 hover:bg-[#F3F1EA] text-[#17201D] border-r border-[#DCD7CB]"
                  title="Zoom Out"
                >
                  <ZoomOut size={13} />
                </button>
                <span className="px-2 text-[11px] font-bold text-[#17201D]">
                  {Math.round(zoomLevel * 100)}%
                </span>
                <button
                  onClick={() => setZoomLevel((z) => Math.min(2, z + 0.2))}
                  className="px-2 py-1 hover:bg-[#F3F1EA] text-[#17201D] border-r border-[#DCD7CB]"
                  title="Zoom In"
                >
                  <ZoomIn size={13} />
                </button>
                <button
                  onClick={toggleFullscreen}
                  className="px-2 py-1 hover:bg-[#F3F1EA] text-[#17201D]"
                  title="Fullscreen"
                >
                  <Maximize2 size={13} />
                </button>
              </div>
            </div>
          </div>

          {/* LARGE SATELLITE IMAGE COMPARISON SURFACE */}
          <div
            ref={containerRef}
            onPointerDown={() => setIsDragging(true)}
            onPointerUp={() => setIsDragging(false)}
            onPointerLeave={() => setIsDragging(false)}
            onPointerMove={handlePointerMove}
            className={`relative h-[580px] w-full overflow-hidden bg-[#243029] select-none ${
              viewMode === 'swipe' ? 'cursor-ew-resize' : 'cursor-default'
            }`}
            style={{ touchAction: 'none' }}
          >
            {/* UNDERLYING LAYER: 2026 (AFTER) */}
            <div
              className="satellite-ortho-noida absolute inset-0 transition-transform duration-200"
              style={{ transform: `scale(${zoomLevel})`, transformOrigin: 'center center' }}
            />

            {/* Subtle Graticule Grid */}
            <div className="graticule-grid absolute inset-0 pointer-events-none opacity-25" />

            {/* OVERLYING LAYER: 2020 (BEFORE) */}
            {viewMode !== 'after' && (
              <div
                className="absolute inset-y-0 left-0 overflow-hidden border-r-2 border-white shadow-2xl transition-[width] duration-75"
                style={{ width: viewMode === 'before' ? '100%' : `${split}%` }}
              >
                <div
                  className="satellite-ortho-baseline absolute inset-y-0 left-0 w-[1600px] h-[580px] transition-transform duration-200"
                  style={{ transform: `scale(${zoomLevel})`, transformOrigin: 'center center' }}
                />
                <div className="graticule-grid absolute inset-0 pointer-events-none opacity-25" />

                {/* Baseline Label */}
                <div className="absolute top-4 left-4 z-10 bg-[#17201D]/90 text-white font-mono-tech text-xs px-3 py-1.5 border border-white/20 rounded-[2px] shadow">
                  <span className="font-bold text-[#A8D5BA]">BEFORE:</span> 2020-03-12 (Sentinel-2)
                </div>
              </div>
            )}

            {/* Target Label (When Swipe or After) */}
            {viewMode !== 'before' && (
              <div className="absolute top-4 right-4 z-10 bg-[#17201D]/90 text-white font-mono-tech text-xs px-3 py-1.5 border border-white/20 rounded-[2px] shadow">
                <span className="font-bold text-[#E28859]">AFTER:</span> 2026-02-18 (Sentinel-2)
              </div>
            )}

            {/* CENTRAL DRAGGABLE HANDLE (Only in Swipe mode) */}
            {viewMode === 'swipe' && (
              <div
                className="absolute inset-y-0 z-20 w-0.5 bg-white pointer-events-none shadow-[0_0_10px_rgba(0,0,0,0.5)]"
                style={{ left: `${split}%` }}
              >
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-10 w-10 bg-[#183B2B] text-white flex items-center justify-center border-2 border-white shadow-xl rounded-full">
                  <ArrowLeftRight size={16} />
                </div>
              </div>
            )}

            {/* BOTTOM SCALE BAR */}
            <div className="absolute bottom-4 left-4 z-10 bg-black/80 text-white font-mono-tech text-[10px] px-3 py-1.5 border border-white/20 flex items-center gap-2 rounded-[2px] shadow">
              <span>0</span>
              <div className="h-1 w-12 bg-white" />
              <span>1.5 km</span>
              <span className="text-white/60">· EPSG:4326</span>
            </div>

            {/* SPLIT PERCENTAGE READOUT (In Swipe Mode) */}
            {viewMode === 'swipe' && (
              <div className="absolute bottom-4 right-4 z-10 bg-black/80 text-white font-mono-tech text-[10px] px-3 py-1.5 border border-white/20 rounded-[2px] shadow">
                SWIPE: {Math.round(split)}% / {100 - Math.round(split)}%
              </div>
            )}
          </div>

          {/* =========================================================================
              WHAT CHANGED? (Section 10 Requirement)
              ========================================================================= */}
          <div className="border-t border-[#DCD7CB] bg-[#F3F1EA] p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
              <div>
                <h3 className="font-sans font-bold text-lg text-[#17201D]">
                  What changed?
                </h3>
                <p className="text-xs text-[#69736D]">
                  Measured land cover changes in Noida between 2020 and 2026.
                </p>
              </div>

              <Link
                href="/analyze"
                className="inline-flex items-center gap-1 text-xs font-mono-tech font-semibold text-[#183B2B] hover:underline"
              >
                Investigate in detail →
              </Link>
            </div>

            {/* 3 Clear Stat Cards */}
            <div className="grid gap-4 sm:grid-cols-3">
              {/* Built-up area */}
              <div className="border border-[#DCD7CB] bg-white p-4 rounded-[2px] shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-[#69736D] uppercase font-mono-tech">
                    Built-up area
                  </span>
                  <span className="inline-flex items-center gap-1 text-xs font-mono-tech font-bold text-[#C25E2E] bg-[#FEF3EB] px-2 py-0.5 rounded-[2px] border border-[#FAD8C2]">
                    <TrendingUp size={12} />
                    +18.4%
                  </span>
                </div>
                <div className="mt-2 text-2xl font-bold text-[#17201D]">
                  15.6 km²
                </div>
                <p className="mt-1 text-xs text-[#69736D]">
                  New commercial towers, residential sectors, and road infrastructure.
                </p>
              </div>

              {/* Vegetation */}
              <div className="border border-[#DCD7CB] bg-white p-4 rounded-[2px] shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-[#69736D] uppercase font-mono-tech">
                    Vegetation
                  </span>
                  <span className="inline-flex items-center gap-1 text-xs font-mono-tech font-bold text-[#183B2B] bg-[#E5EFE9] px-2 py-0.5 rounded-[2px] border border-[#C5DED0]">
                    <TrendingDown size={12} />
                    -4.2%
                  </span>
                </div>
                <div className="mt-2 text-2xl font-bold text-[#17201D]">
                  3.8 km²
                </div>
                <p className="mt-1 text-xs text-[#69736D]">
                  Tree canopy and agricultural fields cleared for urban development.
                </p>
              </div>

              {/* Water */}
              <div className="border border-[#DCD7CB] bg-white p-4 rounded-[2px] shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-[#69736D] uppercase font-mono-tech">
                    Water
                  </span>
                  <span className="inline-flex items-center gap-1 text-xs font-mono-tech font-bold text-[#0284C7] bg-[#E0F2FE] px-2 py-0.5 rounded-[2px] border border-[#BAE6FD]">
                    <TrendingUp size={12} />
                    +1.8%
                  </span>
                </div>
                <div className="mt-2 text-2xl font-bold text-[#17201D]">
                  1.5 km²
                </div>
                <p className="mt-1 text-xs text-[#69736D]">
                  New retention ponds, drainage basins, and canal expansion.
                </p>
              </div>
            </div>

            {/* =========================================================================
                EXPANDABLE TECHNICAL DETAILS (Section 8 Requirement)
                ========================================================================= */}
            <div className="mt-5 pt-4 border-t border-[#DCD7CB]">
              <button
                onClick={() => setShowTechnicalDetails(!showTechnicalDetails)}
                className="inline-flex items-center gap-2 font-mono-tech text-xs font-semibold text-[#183B2B] hover:text-[#122C20] py-1"
                data-testid="toggle-technical-details"
              >
                {showTechnicalDetails ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                <span>Technical details & spectral channels</span>
              </button>

              {showTechnicalDetails && (
                <div className="mt-3 border border-[#DCD7CB] bg-white p-4 rounded-[2px] shadow-inner space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#DCD7CB] pb-3 font-mono-tech text-xs">
                    <div className="flex items-center gap-2">
                      <span className="text-[#69736D] uppercase font-semibold">SPECTRAL CHANNEL:</span>
                      {(['NDVI', 'NDBI', 'SAR', 'CHANGE'] as const).map((ch) => (
                        <button
                          key={ch}
                          onClick={() => setActiveChannel(ch)}
                          className={`px-3 py-1 transition-all rounded-[2px] border ${
                            activeChannel === ch
                              ? 'bg-[#183B2B] text-white border-[#183B2B] font-bold'
                              : 'bg-white text-[#69736D] border-[#DCD7CB] hover:text-[#17201D]'
                          }`}
                        >
                          {ch}
                        </button>
                      ))}
                    </div>
                    <span className="text-[#69736D] text-[11px]">
                      Radiometric and bi-temporal delta analysis
                    </span>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-4 font-mono-tech text-xs">
                    <div className="border border-[#DCD7CB] bg-[#F3F1EA]/50 p-3 rounded-[2px]">
                      <span className="text-[10px] text-[#69736D] uppercase block font-semibold">FORMULA / METRIC</span>
                      <span className="font-bold text-[#17201D] mt-1 block">
                        {activeChannel === 'NDVI' && '(B08 - B04) / (B08 + B04)'}
                        {activeChannel === 'NDBI' && '(B11 - B08) / (B11 + B08)'}
                        {activeChannel === 'SAR' && '10 * log10(σ° VV Amplitude)'}
                        {activeChannel === 'CHANGE' && 'Siamese Transformer Divergence'}
                      </span>
                    </div>

                    <div className="border border-[#DCD7CB] bg-[#F3F1EA]/50 p-3 rounded-[2px]">
                      <span className="text-[10px] text-[#69736D] uppercase block font-semibold">BASELINE (2020)</span>
                      <span className="font-bold text-[#17201D] mt-1 block">
                        {activeChannel === 'NDVI' && '0.48 (Healthy Canopy)'}
                        {activeChannel === 'NDBI' && '-0.14 (Low Impervious)'}
                        {activeChannel === 'SAR' && '-13.1 dB (Diffuse)'}
                        {activeChannel === 'CHANGE' && '0.00 (Reference Zero)'}
                      </span>
                    </div>

                    <div className="border border-[#DCD7CB] bg-[#F3F1EA]/50 p-3 rounded-[2px]">
                      <span className="text-[10px] text-[#69736D] uppercase block font-semibold">TARGET (2026)</span>
                      <span className="font-bold text-[#183B2B] mt-1 block">
                        {activeChannel === 'NDVI' && '0.21 (Sparse / Cleared)'}
                        {activeChannel === 'NDBI' && '+0.32 (High Concrete)'}
                        {activeChannel === 'SAR' && '-8.9 dB (+4.2 dB Delta)'}
                        {activeChannel === 'CHANGE' && '+18.4% Altered Net Area'}
                      </span>
                    </div>

                    <div className="border border-[#DCD7CB] bg-[#F3F1EA]/50 p-3 rounded-[2px]">
                      <span className="text-[10px] text-[#69736D] uppercase block font-semibold">PHYSICAL INTERPRETATION</span>
                      <span className="font-bold text-[#C25E2E] mt-1 block">
                        {activeChannel === 'NDVI' && 'Vegetation loss: -56.2%'}
                        {activeChannel === 'NDBI' && 'Dense Impervious Urban Gain'}
                        {activeChannel === 'SAR' && 'Permanent 3D Structure Verified'}
                        {activeChannel === 'CHANGE' && '15.6 km² Altered Ground Surface'}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Shell>
  );
}

