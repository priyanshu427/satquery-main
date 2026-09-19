import { Globe2, Database, ShieldCheck } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t border-[#DCD7CB] bg-[#ECE9E0] py-6 px-4 lg:px-8 text-xs text-[#69736D] font-mono-tech">
      <div className="mx-auto flex max-w-[1600px] flex-col justify-between gap-4 lg:flex-row lg:items-center">
        {/* Left Specification */}
        <div className="flex flex-wrap items-center gap-3">
          <span className="font-bold text-[#17201D]">SATQUERY AI</span>
          <span>/</span>
          <span>EARTH OBSERVATION ANALYSIS ENGINE</span>
          <span>/</span>
          <span>CALIBRATED SCIENTIFIC SCENARIO</span>
        </div>

        {/* Center Geodetic Metadata */}
        <div className="flex flex-wrap items-center gap-4 text-[11px]">
          <span>CRS: EPSG:4326 (WGS 84)</span>
          <span>·</span>
          <span>SENSORS: SENTINEL-2 MSI · SENTINEL-1 C-SAR</span>
          <span>·</span>
          <span>GSD: 10m OPTICAL · 20m RADAR</span>
        </div>

        {/* Right Attribution */}
        <div className="text-right text-[11px] text-[#69736D]">
          <span>RESEARCH & CIVILIAN REMOTE SENSING TOOL</span>
        </div>
      </div>
    </footer>
  );
}
