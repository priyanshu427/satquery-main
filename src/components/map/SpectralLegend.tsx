export type MapLayerType = 'RGB' | 'NIR' | 'NDVI' | 'NDWI' | 'NDBI' | 'SAR' | 'Change' | 'Semantic';

export function SpectralLegend({ layer }: { layer: MapLayerType }) {
  if (layer === 'RGB') {
    return (
      <div className="flex items-center gap-2 rounded-lg border border-slate-800 bg-[#07111F]/90 px-3 py-1.5 font-mono text-[10px] text-slate-300 backdrop-blur-md">
        <span className="font-semibold text-cyan-300">RGB</span>
        <span>Natural Color · Bands 4, 3, 2 (10m)</span>
      </div>
    );
  }

  if (layer === 'NIR') {
    return (
      <div className="flex items-center gap-3 rounded-lg border border-slate-800 bg-[#07111F]/90 px-3 py-1.5 font-mono text-[10px] text-slate-300 backdrop-blur-md">
        <span className="font-semibold text-rose-400">NIR FALSE COLOR</span>
        <span className="flex items-center gap-1"><span className="h-2.5 w-2.5 rounded bg-rose-600" /> Dense Canopy</span>
        <span className="flex items-center gap-1"><span className="h-2.5 w-2.5 rounded bg-cyan-600" /> Impervious Concrete</span>
      </div>
    );
  }

  if (layer === 'NDVI') {
    return (
      <div className="flex items-center gap-3 rounded-lg border border-slate-800 bg-[#07111F]/90 px-3 py-1.5 font-mono text-[10px] text-slate-300 backdrop-blur-md">
        <span className="font-semibold text-green-400">NDVI</span>
        <span className="text-slate-400">-0.2</span>
        <div className="h-2.5 w-28 rounded-full bg-gradient-to-r from-red-600 via-amber-400 to-green-500" />
        <span className="text-slate-400">+0.8</span>
        <span className="text-slate-500">Vegetation Density</span>
      </div>
    );
  }

  if (layer === 'NDWI') {
    return (
      <div className="flex items-center gap-3 rounded-lg border border-slate-800 bg-[#07111F]/90 px-3 py-1.5 font-mono text-[10px] text-slate-300 backdrop-blur-md">
        <span className="font-semibold text-cyan-400">NDWI</span>
        <span className="text-slate-400">-0.5</span>
        <div className="h-2.5 w-28 rounded-full bg-gradient-to-r from-slate-700 via-blue-700 to-cyan-400" />
        <span className="text-slate-400">+0.6</span>
        <span className="text-slate-500">Water Body Mask</span>
      </div>
    );
  }

  if (layer === 'NDBI') {
    return (
      <div className="flex items-center gap-3 rounded-lg border border-slate-800 bg-[#07111F]/90 px-3 py-1.5 font-mono text-[10px] text-slate-300 backdrop-blur-md">
        <span className="font-semibold text-amber-400">NDBI</span>
        <span className="text-slate-400">-0.4</span>
        <div className="h-2.5 w-28 rounded-full bg-gradient-to-r from-slate-800 via-amber-600 to-amber-300" />
        <span className="text-slate-400">+0.5</span>
        <span className="text-slate-500">Built-Up Index</span>
      </div>
    );
  }

  if (layer === 'SAR') {
    return (
      <div className="flex items-center gap-3 rounded-lg border border-slate-800 bg-[#07111F]/90 px-3 py-1.5 font-mono text-[10px] text-slate-300 backdrop-blur-md">
        <span className="font-semibold text-blue-400">SENTINEL-1 C-SAR</span>
        <span className="text-slate-400">-24 dB</span>
        <div className="h-2.5 w-24 rounded-full bg-gradient-to-r from-black via-slate-500 to-white" />
        <span className="text-slate-400">+4 dB</span>
        <span className="text-slate-500">Structural Double-Bounce</span>
      </div>
    );
  }

  if (layer === 'Change') {
    return (
      <div className="flex items-center gap-3 rounded-lg border border-slate-800 bg-[#07111F]/90 px-3 py-1.5 font-mono text-[10px] text-slate-300 backdrop-blur-md">
        <span className="font-semibold text-rose-400">CHANGE DELTA</span>
        <span className="flex items-center gap-1"><span className="h-2.5 w-2.5 rounded bg-rose-500 animate-pulse" /> Built-Up Gain (+18.4%)</span>
        <span className="flex items-center gap-1"><span className="h-2.5 w-2.5 rounded bg-amber-500" /> Vegetation Loss</span>
      </div>
    );
  }

  if (layer === 'Semantic') {
    return (
      <div className="flex flex-wrap items-center gap-2.5 rounded-lg border border-slate-800 bg-[#07111F]/90 px-3 py-1.5 font-mono text-[10px] text-slate-300 backdrop-blur-md">
        <span className="font-semibold text-cyan-300">LULC CLASSES:</span>
        <span className="flex items-center gap-1"><span className="h-2 w-2 rounded bg-amber-500" /> Built-up</span>
        <span className="flex items-center gap-1"><span className="h-2 w-2 rounded bg-green-500" /> Agriculture</span>
        <span className="flex items-center gap-1"><span className="h-2 w-2 rounded bg-cyan-500" /> Water</span>
        <span className="flex items-center gap-1"><span className="h-2 w-2 rounded bg-slate-500" /> Bare Soil</span>
      </div>
    );
  }

  return null;
}
