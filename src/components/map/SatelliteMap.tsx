import { useState, useRef } from 'react';
import {
  Maximize2, Minimize2, Plus, Minus, Ruler, Layers, Eye,
  RotateCcw, Crosshair, MapPin, Compass, ShieldCheck
} from 'lucide-react';
import { SpectralLegend, MapLayerType } from './SpectralLegend';
import { ScenarioFinding } from '@/lib/mockData';

interface SatelliteMapProps {
  findings: ScenarioFinding[];
  selectedFindingId: string | null;
  onSelectFinding: (id: string) => void;
  regionName?: string;
  coordinates?: { lat: number; lng: number };
}

export function SatelliteMap({
  findings,
  selectedFindingId,
  onSelectFinding,
  regionName = 'Noida Sector 137–168 Corridor',
  coordinates = { lat: 28.5355, lng: 77.3910 },
}: SatelliteMapProps) {
  const [activeLayer, setActiveLayer] = useState<MapLayerType>('Change');
  const [opacity, setOpacity] = useState<number>(85);
  const [zoom, setZoom] = useState<number>(12);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [measureMode, setMeasureMode] = useState<boolean>(false);
  const [measurePoints, setMeasurePoints] = useState<{ x: number; y: number }[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

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

  const handleMapClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!measureMode) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    if (measurePoints.length >= 2) {
      setMeasurePoints([{ x, y }]);
    } else {
      setMeasurePoints((prev) => [...prev, { x, y }]);
    }
  };

  // Compute simulated distance between measurement points
  const measureDistanceKm =
    measurePoints.length === 2
      ? (
          Math.sqrt(
            Math.pow(measurePoints[1].x - measurePoints[0].x, 2) +
              Math.pow(measurePoints[1].y - measurePoints[0].y, 2)
          ) * 0.12
        ).toFixed(2)
      : null;

  // Background visual generator according to active spectral layer
  const getLayerStyle = () => {
    switch (activeLayer) {
      case 'RGB':
        return {
          backgroundColor: '#0E243A',
          backgroundImage: `
            radial-gradient(ellipse at 50% 50%, rgba(30, 80, 120, 0.4), transparent 70%),
            radial-gradient(circle at 35% 40%, rgba(34, 197, 94, 0.25), transparent 30%),
            radial-gradient(circle at 65% 60%, rgba(148, 163, 184, 0.35), transparent 40%),
            linear-gradient(rgba(56, 189, 248, 0.08) 1px, transparent 1px),
            linear-gradient(90deg, rgba(56, 189, 248, 0.08) 1px, transparent 1px)
          `,
          backgroundSize: 'auto, auto, auto, 40px 40px, 40px 40px',
        };
      case 'NIR':
        return {
          backgroundColor: '#2A101C',
          backgroundImage: `
            radial-gradient(ellipse at 35% 45%, rgba(225, 29, 72, 0.55), transparent 45%),
            radial-gradient(circle at 65% 55%, rgba(14, 165, 233, 0.35), transparent 40%),
            repeating-linear-gradient(45deg, rgba(244, 63, 94, 0.08) 0 3px, transparent 3px 12px)
          `,
        };
      case 'NDVI':
        return {
          backgroundColor: '#0A2016',
          backgroundImage: `
            radial-gradient(circle at 35% 45%, rgba(34, 197, 94, 0.65), transparent 45%),
            radial-gradient(circle at 65% 55%, rgba(234, 179, 8, 0.45), transparent 35%),
            radial-gradient(circle at 50% 50%, rgba(239, 68, 68, 0.35), transparent 30%)
          `,
        };
      case 'NDWI':
        return {
          backgroundColor: '#071A2E',
          backgroundImage: `
            radial-gradient(ellipse at 50% 50%, rgba(6, 182, 212, 0.7), transparent 45%),
            radial-gradient(circle at 75% 30%, rgba(59, 130, 246, 0.5), transparent 30%),
            linear-gradient(135deg, rgba(6, 182, 212, 0.15) 25%, transparent 25%)
          `,
        };
      case 'NDBI':
        return {
          backgroundColor: '#261B0E',
          backgroundImage: `
            radial-gradient(ellipse at 60% 50%, rgba(245, 158, 11, 0.65), transparent 40%),
            radial-gradient(circle at 40% 60%, rgba(217, 119, 6, 0.55), transparent 30%),
            repeating-linear-gradient(0deg, rgba(245, 158, 11, 0.08) 0 2px, transparent 2px 10px)
          `,
        };
      case 'SAR':
        return {
          backgroundColor: '#111827',
          backgroundImage: `
            radial-gradient(circle at 55% 48%, rgba(255, 255, 255, 0.65), transparent 20%),
            radial-gradient(circle at 45% 60%, rgba(200, 200, 200, 0.45), transparent 25%),
            radial-gradient(circle at 30% 30%, rgba(0, 0, 0, 0.8), transparent 35%),
            repeating-radial-gradient(circle at 50% 50%, rgba(255, 255, 255, 0.05) 0 1px, transparent 1px 6px)
          `,
        };
      case 'Change':
        return {
          backgroundColor: '#091A2A',
          backgroundImage: `
            radial-gradient(ellipse at 58% 46%, rgba(220, 38, 38, 0.65), transparent 32%),
            radial-gradient(circle at 35% 62%, rgba(245, 158, 11, 0.45), transparent 25%),
            radial-gradient(circle at 70% 32%, rgba(6, 182, 212, 0.35), transparent 20%),
            linear-gradient(rgba(56, 189, 248, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(56, 189, 248, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: 'auto, auto, auto, 48px 48px, 48px 48px',
        };
      case 'Semantic':
        return {
          backgroundColor: '#0C1C2C',
          backgroundImage: `
            radial-gradient(ellipse at 55% 45%, rgba(245, 158, 11, 0.55), transparent 35%),
            radial-gradient(circle at 30% 60%, rgba(34, 197, 94, 0.5), transparent 28%),
            radial-gradient(circle at 75% 25%, rgba(6, 182, 212, 0.5), transparent 22%),
            radial-gradient(circle at 45% 30%, rgba(100, 116, 139, 0.45), transparent 20%)
          `,
        };
    }
  };

  return (
    <div
      ref={containerRef}
      className={`relative flex flex-col overflow-hidden rounded-2xl border border-slate-700/80 bg-[#07111F] shadow-2xl transition-all ${
        isFullscreen ? 'fixed inset-0 z-50 rounded-none' : 'w-full min-h-[560px] h-[640px]'
      }`}
    >
      {/* Top Map Action Bar */}
      <div className="z-20 flex flex-wrap items-center justify-between gap-3 border-b border-slate-800/90 bg-[#07111F]/90 px-4 py-2.5 backdrop-blur-md">
        {/* Left AOI Title */}
        <div className="flex items-center gap-2 text-xs">
          <span className="flex h-2 w-2 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_8px_#06B6D4]" />
          <span className="font-semibold text-slate-200">{regionName}</span>
          <span className="font-mono text-[10px] text-slate-500 hidden sm:inline">
            ({coordinates.lat.toFixed(4)}°N, {coordinates.lng.toFixed(4)}°E)
          </span>
        </div>

        {/* Center/Right Layer Selector */}
        <div className="flex items-center gap-1.5 overflow-x-auto py-1">
          {(['Change', 'RGB', 'NIR', 'NDVI', 'NDWI', 'NDBI', 'SAR', 'Semantic'] as MapLayerType[]).map(
            (layer) => (
              <button
                key={layer}
                onClick={() => setActiveLayer(layer)}
                className={`rounded-md px-2.5 py-1 font-mono text-[11px] font-medium transition-all ${
                  activeLayer === layer
                    ? 'border border-cyan-400/50 bg-cyan-400/15 text-cyan-200 shadow-[0_0_10px_rgba(6,182,212,0.2)]'
                    : 'border border-slate-800 bg-slate-900/60 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                }`}
                data-testid={`button-layer-${layer.toLowerCase()}`}
              >
                {layer}
              </button>
            )
          )}
        </div>
      </div>

      {/* Main Interactive Map Surface */}
      <div
        className="relative flex-1 w-full h-full cursor-crosshair overflow-hidden select-none"
        onClick={handleMapClick}
        style={getLayerStyle()}
      >
        {/* Opacity Blend Layer */}
        <div
          className="absolute inset-0 pointer-events-none transition-opacity duration-300"
          style={{ opacity: opacity / 100 }}
        />

        {/* Grid and Coordinates Overlay */}
        <div className="absolute inset-0 pointer-events-none opacity-25">
          <svg className="h-full w-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid-pattern" width="60" height="60" patternUnits="userSpaceOnUse">
                <path d="M 60 0 L 0 0 0 60" fill="none" stroke="rgba(6, 182, 212, 0.4)" strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid-pattern)" />
          </svg>
        </div>

        {/* Global AOI Bounding Box */}
        <div
          className="absolute border border-cyan-400/40 rounded-xl pointer-events-none"
          style={{
            left: '20%',
            top: '15%',
            width: '62%',
            height: '70%',
            boxShadow: 'inset 0 0 30px rgba(6, 182, 212, 0.06), 0 0 40px rgba(6, 182, 212, 0.1)',
          }}
        >
          <div className="absolute -top-3 left-4 rounded border border-cyan-400/30 bg-[#07111F]/90 px-2 py-0.5 font-mono text-[9px] text-cyan-300">
            AOI BOUNDARY · 84.6 km²
          </div>
        </div>

        {/* Interactive Finding Polygons & Markers */}
        {findings.map((f) => {
          const isSelected = selectedFindingId === f.id;
          const toneColor =
            f.category === 'urban' ? '#F59E0B' : f.category === 'vegetation' ? '#10B981' : '#38BDF8';

          return (
            <div
              key={f.id}
              onClick={(e) => {
                e.stopPropagation();
                onSelectFinding(f.id);
              }}
              style={{
                left: `${f.geometry.x}%`,
                top: `${f.geometry.y}%`,
                width: `${f.geometry.width}%`,
                height: `${f.geometry.height}%`,
              }}
              className={`absolute cursor-pointer transition-all duration-300 rounded-lg group ${
                isSelected
                  ? 'border-2 shadow-[0_0_24px_rgba(6,182,212,0.6)] bg-cyan-400/20'
                  : 'border border-dashed hover:border-solid hover:bg-cyan-500/10'
              }`}
              data-testid={`finding-polygon-${f.id}`}
            >
              {/* Dynamic polygon border outline */}
              <div
                className="absolute inset-0 rounded-lg pointer-events-none"
                style={{
                  borderColor: isSelected ? '#06B6D4' : toneColor,
                  borderWidth: isSelected ? '2px' : '1px',
                  backgroundColor: isSelected ? 'rgba(6, 182, 212, 0.18)' : 'transparent',
                }}
              />

              {/* Pin Marker */}
              <div
                className={`absolute -top-3 -left-3 flex h-7 w-7 items-center justify-center rounded-full font-mono text-[10px] font-bold shadow-lg transition-transform duration-200 group-hover:scale-110 ${
                  isSelected
                    ? 'bg-cyan-300 text-[#07111F] ring-4 ring-cyan-400/30'
                    : 'bg-slate-900 border border-slate-700 text-slate-200'
                }`}
              >
                {f.id}
              </div>

              {/* Finding Label Tooltip */}
              <div
                className={`absolute left-6 -top-2 whitespace-nowrap rounded border px-2 py-0.5 font-mono text-[9px] backdrop-blur-md transition-opacity ${
                  isSelected
                    ? 'border-cyan-400/40 bg-[#07111F]/95 text-cyan-200 opacity-100'
                    : 'border-slate-800 bg-[#07111F]/80 text-slate-300 opacity-0 group-hover:opacity-100'
                }`}
              >
                {f.label} ({f.changedAreaKm2} km²)
              </div>
            </div>
          );
        })}

        {/* Measurement Tool Visualization */}
        {measureMode && measurePoints.length > 0 && (
          <svg className="absolute inset-0 w-full h-full pointer-events-none">
            {measurePoints.map((pt, i) => (
              <circle
                key={i}
                cx={`${pt.x}%`}
                cy={`${pt.y}%`}
                r="5"
                fill="#F59E0B"
                stroke="#FFFFFF"
                strokeWidth="2"
              />
            ))}
            {measurePoints.length === 2 && (
              <line
                x1={`${measurePoints[0].x}%`}
                y1={`${measurePoints[0].y}%`}
                x2={`${measurePoints[1].x}%`}
                y2={`${measurePoints[1].y}%`}
                stroke="#F59E0B"
                strokeWidth="2"
                strokeDasharray="4 4"
              />
            )}
          </svg>
        )}

        {/* Measurement HUD */}
        {measureMode && (
          <div className="absolute top-4 left-4 rounded-xl border border-amber-500/40 bg-[#07111F]/90 p-3 font-mono text-xs text-amber-200 backdrop-blur-md">
            <div className="flex items-center gap-2">
              <Ruler size={14} className="text-amber-400" />
              <span>MEASURE TOOL ACTIVE</span>
            </div>
            <div className="mt-1.5 text-[11px] text-slate-300">
              {measurePoints.length === 0 && 'Click map to set point A'}
              {measurePoints.length === 1 && 'Click map to set point B'}
              {measurePoints.length === 2 && (
                <span className="font-bold text-amber-300">
                  Calculated Distance: {measureDistanceKm} km
                </span>
              )}
            </div>
          </div>
        )}

        {/* Bottom Floating Legend */}
        <div className="absolute bottom-4 left-4 z-10">
          <SpectralLegend layer={activeLayer} />
        </div>

        {/* Floating Map Zoom / Utility Toolbar */}
        <div className="absolute bottom-4 right-4 z-10 flex flex-col items-center gap-1 rounded-xl border border-slate-700/80 bg-[#07111F]/90 p-1 backdrop-blur-md">
          <button
            onClick={() => setZoom((z) => Math.min(18, z + 1))}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white"
            title="Zoom In"
            data-testid="button-map-zoom-in"
          >
            <Plus size={15} />
          </button>
          <div className="border-y border-slate-800 py-1 px-1 font-mono text-[10px] text-slate-400">
            {zoom}z
          </div>
          <button
            onClick={() => setZoom((z) => Math.max(5, z - 1))}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white"
            title="Zoom Out"
            data-testid="button-map-zoom-out"
          >
            <Minus size={15} />
          </button>
          <div className="h-px w-full bg-slate-800 my-0.5" />
          <button
            onClick={() => {
              setMeasureMode(!measureMode);
              setMeasurePoints([]);
            }}
            className={`flex h-8 w-8 items-center justify-center rounded-lg transition-colors ${
              measureMode ? 'bg-amber-500/20 text-amber-300' : 'text-slate-400 hover:bg-slate-800 hover:text-white'
            }`}
            title="Measure distance"
            data-testid="button-map-measure"
          >
            <Ruler size={14} />
          </button>
          <button
            onClick={toggleFullscreen}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white"
            title="Toggle Fullscreen"
            data-testid="button-map-fullscreen"
          >
            {isFullscreen ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
          </button>
        </div>
      </div>

      {/* Bottom Opacity & Telemetry Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-800/90 bg-[#07111F]/90 px-4 py-2.5 text-xs text-slate-400">
        <div className="flex items-center gap-3">
          <Eye size={14} className="text-slate-500" />
          <span className="font-mono text-[11px]">Layer Opacity:</span>
          <input
            type="range"
            min="10"
            max="100"
            value={opacity}
            onChange={(e) => setOpacity(Number(e.target.value))}
            className="w-28 cursor-pointer"
            data-testid="input-map-opacity"
          />
          <span className="font-mono text-[11px] text-cyan-300 w-8">{opacity}%</span>
        </div>

        <div className="flex items-center gap-4 font-mono text-[10px] text-slate-500">
          <span>PIXEL: 10m Ground Resolution</span>
          <span className="hidden sm:inline">PROJECTION: EPSG:4326</span>
          <span className="text-cyan-400">STATUS: CALIBRATED DEMO</span>
        </div>
      </div>
    </div>
  );
}
