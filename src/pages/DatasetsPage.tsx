import { useState, useRef } from 'react';
import { Link } from 'wouter';
import {
  Upload, Search, Plus, MapPin, Calendar, CheckCircle2,
  ChevronDown, ChevronUp, Layers, Eye, Download, X, Satellite,
  FileUp, ArrowRight, RefreshCw, AlertCircle
} from 'lucide-react';
import { Shell, PageHeader, Panel, StatusPill } from '@/components/layout/Shell';

interface SatelliteScene {
  id: string;
  datasetName: string;
  location: string;
  date: string;
  sensor: string;
  resolution: string;
  status: 'Ready' | 'Validated' | 'Processing';
  thumbnailStyle: 'satellite-ortho-noida' | 'satellite-ortho-baseline' | 'satellite-radar-sar';
  bands: string;
  crs: string;
  cloudCover: number;
}

const INITIAL_DATASETS: SatelliteScene[] = [
  {
    id: 'S2A_20260218_NOIDA',
    datasetName: 'Noida Expressway Sector 137–168',
    location: 'Noida, Uttar Pradesh',
    date: '18 Feb 2026',
    sensor: 'Sentinel-2 (Optical)',
    resolution: '10 m',
    status: 'Ready',
    thumbnailStyle: 'satellite-ortho-noida',
    bands: 'B02, B03, B04, B08, B11, B12',
    crs: 'EPSG:4326',
    cloudCover: 2.1,
  },
  {
    id: 'S2B_20200312_NOIDA_BASE',
    datasetName: 'Noida Sector Baseline Scene',
    location: 'Noida, Uttar Pradesh',
    date: '12 Mar 2020',
    sensor: 'Sentinel-2 (Optical)',
    resolution: '10 m',
    status: 'Ready',
    thumbnailStyle: 'satellite-ortho-baseline',
    bands: 'B02, B03, B04, B08, B11',
    crs: 'EPSG:4326',
    cloudCover: 4.8,
  },
  {
    id: 'S1A_20260217_NOIDA_SAR',
    datasetName: 'Noida Dual-Pol Radar Pass',
    location: 'Noida, Uttar Pradesh',
    date: '17 Feb 2026',
    sensor: 'Sentinel-1 (SAR Radar)',
    resolution: '20 m',
    status: 'Validated',
    thumbnailStyle: 'satellite-radar-sar',
    bands: 'VV + VH (5.405 GHz)',
    crs: 'EPSG:4326',
    cloudCover: 0.0,
  },
  {
    id: 'S2A_20240803_WAYANAD',
    datasetName: 'Meppadi Debris Flow Corridor',
    location: 'Wayanad, Kerala',
    date: '03 Aug 2024',
    sensor: 'Sentinel-2 (Optical)',
    resolution: '10 m',
    status: 'Ready',
    thumbnailStyle: 'satellite-ortho-noida',
    bands: 'B02, B03, B04, B08',
    crs: 'EPSG:4326',
    cloudCover: 12.4,
  },
  {
    id: 'CARTOSAT3_20251104_NCR',
    datasetName: 'Delhi-NCR High-Resolution Tile',
    location: 'National Capital Region, India',
    date: '04 Nov 2025',
    sensor: 'Cartosat-3 (High-Res)',
    resolution: '0.28 m',
    status: 'Validated',
    thumbnailStyle: 'satellite-ortho-baseline',
    bands: 'PAN, B1, B2, B3, B4',
    crs: 'EPSG:4326',
    cloudCover: 0.8,
  },
  {
    id: 'LC08_20180325_NCR',
    datasetName: 'Landsat 8 Historic Acquisition',
    location: 'Noida / Greater Noida, UP',
    date: '25 Mar 2018',
    sensor: 'Landsat-8 (Archive)',
    resolution: '30 m',
    status: 'Ready',
    thumbnailStyle: 'satellite-ortho-baseline',
    bands: 'B2, B3, B4, B5, B6, B7',
    crs: 'EPSG:4326',
    cloudCover: 1.2,
  },
];

export default function DatasetsPage() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [records, setRecords] = useState<SatelliteScene[]>(INITIAL_DATASETS);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sensorFilter, setSensorFilter] = useState<string>('All');
  const [inspectingRecord, setInspectingRecord] = useState<SatelliteScene | null>(null);
  const [showUploadModal, setShowUploadModal] = useState<boolean>(false);
  const [expandedTechnicalId, setExpandedTechnicalId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);

  const filteredRecords = records.filter((rec) => {
    if (sensorFilter !== 'All' && !rec.sensor.toLowerCase().includes(sensorFilter.toLowerCase())) {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        rec.location.toLowerCase().includes(q) ||
        rec.datasetName.toLowerCase().includes(q) ||
        rec.sensor.toLowerCase().includes(q) ||
        rec.date.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const newRec: SatelliteScene = {
      id: `USER_${Date.now().toString().slice(-6)}`,
      datasetName: file.name.replace(/\.[^/.]+$/, ''),
      location: 'Custom User Upload',
      date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      sensor: 'Uploaded Imagery',
      resolution: 'Native GSD',
      status: 'Ready',
      thumbnailStyle: 'satellite-ortho-noida',
      bands: 'RGB / Multispectral',
      crs: 'EPSG:4326',
      cloudCover: 0.0,
    };

    setRecords((prev) => [newRec, ...prev]);
    setShowUploadModal(false);
    setFeedback(`"${file.name}" was uploaded successfully and is ready to analyze.`);
    setTimeout(() => setFeedback(null), 5000);
    e.target.value = '';
  };

  const addSampleImage = (name: string, location: string, sensor: string, resolution: string) => {
    const sample: SatelliteScene = {
      id: `SAMPLE_${Date.now().toString().slice(-5)}`,
      datasetName: name,
      location: location,
      date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      sensor: sensor,
      resolution: resolution,
      status: 'Ready',
      thumbnailStyle: 'satellite-ortho-noida',
      bands: 'B02, B03, B04, B08',
      crs: 'EPSG:4326',
      cloudCover: 1.5,
    };
    setRecords((prev) => [sample, ...prev]);
    setShowUploadModal(false);
    setFeedback(`Sample image "${name}" added to your collection.`);
    setTimeout(() => setFeedback(null), 4000);
  };

  const handleDownloadSTAC = (rec: SatelliteScene) => {
    const stacPayload = {
      type: 'Feature',
      stac_version: '1.0.0',
      id: rec.id,
      geometry: { type: 'Polygon', coordinates: '[[[77.30, 28.45], [77.45, 28.45], [77.45, 28.60], [77.30, 28.60], [77.30, 28.45]]]' },
      properties: {
        datetime: rec.date,
        location: rec.location,
        platform: rec.sensor,
        crs: `urn:ogc:def:crs:EPSG::4326`,
        resolution: rec.resolution,
        bands: rec.bands,
        cloudCover: rec.cloudCover,
      },
    };
    const blob = new Blob([JSON.stringify(stacPayload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${rec.id}-stac.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <Shell>
      <div className="mx-auto max-w-[1600px] px-4 py-8 lg:px-8">
        {/* HEADER: Title: "Your Satellite Images", Button: "[ + Upload Image ]" */}
        <PageHeader
          eyebrow="IMAGERY REPOSITORY"
          title="Your Satellite Images"
          description="Browse and manage satellite images available for analysis. Each scene contains calibrated optical or radar observations."
          actions={
            <div className="flex items-center gap-3">
              <input
                ref={fileInputRef}
                type="file"
                accept=".tif,.tiff,.geojson,.json,.png,.jpg"
                onChange={handleFileUpload}
                className="hidden"
              />
              <button
                onClick={() => setShowUploadModal(true)}
                className="inline-flex items-center gap-2 bg-[#183B2B] text-white px-4 py-2 font-mono-tech text-xs font-semibold hover:bg-[#122C20] transition-colors rounded-[2px] shadow-sm"
                data-testid="btn-upload-image"
              >
                <Plus size={14} />
                + Upload Image
              </button>
            </div>
          }
        />

        {/* User feedback banner */}
        {feedback && (
          <div className="mb-6 border border-[#BBF7D0] bg-[#F0FDF4] p-3 text-xs text-[#15803D] font-mono-tech flex items-center justify-between rounded-[2px] shadow-sm">
            <div className="flex items-center gap-2">
              <CheckCircle2 size={15} />
              <span>{feedback}</span>
            </div>
            <button onClick={() => setFeedback(null)} className="text-[#15803D] hover:opacity-75">
              <X size={14} />
            </button>
          </div>
        )}

        {/* SEARCH & SENSOR FILTER BAR */}
        <div className="border border-[#DCD7CB] bg-white p-4 rounded-[2px] mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4 font-mono-tech text-xs shadow-sm">
          {/* Search Box */}
          <div className="relative flex-1 max-w-md">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#69736D]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by location, sensor, or date..."
              className="w-full border border-[#DCD7CB] bg-[#F3F1EA] py-1.5 pl-9 pr-3 text-xs text-[#17201D] focus:border-[#183B2B] focus:outline-none rounded-[2px]"
              data-testid="input-search-images"
            />
          </div>

          {/* Quick Sensor Filter Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[#69736D] uppercase text-[10px] mr-1 font-semibold">FILTER:</span>
            {['All', 'Sentinel-2', 'Sentinel-1', 'Cartosat', 'Landsat'].map((s) => (
              <button
                key={s}
                onClick={() => setSensorFilter(s)}
                className={`px-2.5 py-1 rounded-[2px] transition-colors border ${
                  sensorFilter === s
                    ? 'bg-[#183B2B] text-white border-[#183B2B] font-bold'
                    : 'bg-[#F3F1EA] text-[#69736D] border-[#DCD7CB] hover:text-[#17201D]'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* =========================================================================
            DATASET PRESENTATION: BEGINNER FRIENDLY
            Each dataset clearly shows: Image, Date, Location, Sensor, Resolution, Status
            ========================================================================= */}
        {filteredRecords.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredRecords.map((rec) => {
              const isTechOpen = expandedTechnicalId === rec.id;
              return (
                <div
                  key={rec.id}
                  className="border border-[#DCD7CB] bg-white rounded-[2px] overflow-hidden flex flex-col justify-between shadow-sm hover:border-[#183B2B] transition-colors"
                >
                  <div>
                    {/* 1. IMAGE: Visual Satellite Preview Thumbnail */}
                    <div className="relative h-44 w-full overflow-hidden bg-[#243029]">
                      <div className={`${rec.thumbnailStyle} absolute inset-0`} />
                      <div className="graticule-grid absolute inset-0 pointer-events-none opacity-30" />

                      {/* Top Overlay: Resolution & Sensor Pill */}
                      <div className="absolute top-3 left-3 z-10 flex items-center gap-2">
                        <span className="bg-black/75 text-white font-mono-tech text-[10px] px-2 py-0.5 rounded-[2px] border border-white/20">
                          {rec.resolution}
                        </span>
                        <span className="bg-[#183B2B]/90 text-white font-mono-tech text-[10px] px-2 py-0.5 rounded-[2px] border border-white/20">
                          {rec.sensor.split(' ')[0]}
                        </span>
                      </div>

                      {/* Top Right: Status */}
                      <div className="absolute top-3 right-3 z-10">
                        <span className="bg-white/95 text-[#183B2B] font-mono-tech text-[10px] font-bold px-2 py-0.5 rounded-[2px] shadow-sm border border-[#DCD7CB]">
                          ● {rec.status}
                        </span>
                      </div>

                      {/* Bottom Overlay: Location Bar */}
                      <div className="absolute bottom-2 left-3 right-3 z-10 bg-black/80 text-white font-mono-tech text-[11px] px-2.5 py-1 rounded-[2px] flex items-center justify-between border border-white/10">
                        <span className="flex items-center gap-1 truncate font-medium">
                          <MapPin size={11} className="text-[#E28859]" />
                          {rec.location}
                        </span>
                        <span className="text-white/70 text-[10px]">{rec.date}</span>
                      </div>
                    </div>

                    {/* DETAILS CARD BODY */}
                    <div className="p-4">
                      {/* Name & ID */}
                      <h4 className="font-sans font-bold text-sm text-[#17201D] line-clamp-1">
                        {rec.datasetName}
                      </h4>
                      <p className="font-mono-tech text-[10px] text-[#69736D] mt-0.5 truncate">
                        ID: {rec.id}
                      </p>

                      {/* Clear User-Friendly Attributes Grid */}
                      <div className="mt-3 grid grid-cols-2 gap-2 border-y border-[#ECE9E0] py-3 font-mono-tech text-xs">
                        <div>
                          <span className="text-[10px] text-[#69736D] uppercase block">Date</span>
                          <span className="font-medium text-[#17201D] mt-0.5 block flex items-center gap-1">
                            <Calendar size={11} className="text-[#183B2B]" />
                            {rec.date}
                          </span>
                        </div>
                        <div>
                          <span className="text-[10px] text-[#69736D] uppercase block">Sensor</span>
                          <span className="font-medium text-[#183B2B] mt-0.5 block truncate" title={rec.sensor}>
                            {rec.sensor}
                          </span>
                        </div>
                        <div>
                          <span className="text-[10px] text-[#69736D] uppercase block">Location</span>
                          <span className="font-medium text-[#17201D] mt-0.5 block truncate" title={rec.location}>
                            {rec.location}
                          </span>
                        </div>
                        <div>
                          <span className="text-[10px] text-[#69736D] uppercase block">Resolution</span>
                          <span className="font-medium text-[#17201D] mt-0.5 block">
                            {rec.resolution}
                          </span>
                        </div>
                      </div>

                      {/* Expandable Technical Details */}
                      {isTechOpen && (
                        <div className="mt-3 p-3 bg-[#F3F1EA] border border-[#DCD7CB] rounded-[2px] font-mono-tech text-[11px] space-y-1.5">
                          <div className="flex justify-between">
                            <span className="text-[#69736D]">CRS:</span>
                            <span className="font-bold text-[#17201D]">{rec.crs}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-[#69736D]">Cloud Cover:</span>
                            <span className="font-bold text-[#17201D]">{rec.cloudCover}%</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-[#69736D]">Bands:</span>
                            <span className="font-bold text-[#17201D] truncate max-w-[140px]" title={rec.bands}>
                              {rec.bands}
                            </span>
                          </div>
                          <div className="pt-2 border-t border-[#DCD7CB] flex justify-end">
                            <button
                              onClick={() => handleDownloadSTAC(rec)}
                              className="text-[#183B2B] hover:underline font-bold text-[10px] inline-flex items-center gap-1"
                            >
                              <Download size={10} />
                              Download STAC JSON
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* CARD ACTIONS */}
                  <div className="px-4 pb-4 pt-1 flex items-center justify-between border-t border-[#ECE9E0] mt-1 font-mono-tech text-xs">
                    <button
                      onClick={() => setExpandedTechnicalId(isTechOpen ? null : rec.id)}
                      className="text-[#69736D] hover:text-[#17201D] text-[11px] inline-flex items-center gap-1"
                    >
                      {isTechOpen ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                      Technical info
                    </button>

                    <div className="flex items-center gap-2">
                      <Link
                        href="/compare"
                        className="px-2.5 py-1 border border-[#DCD7CB] bg-[#F3F1EA] hover:bg-[#ECE9E0] text-[#17201D] rounded-[2px] font-medium"
                      >
                        Compare
                      </Link>
                      <Link
                        href="/analyze"
                        className="px-3 py-1 bg-[#183B2B] text-white hover:bg-[#122C20] rounded-[2px] font-bold inline-flex items-center gap-1"
                      >
                        Analyze
                        <ArrowRight size={12} />
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* =========================================================================
              EMPTY STATE (Section 13 Requirement)
              No satellite images yet.
              "Upload an image to start your first analysis."
              [ Upload Image ]
              ========================================================================= */
          <div className="border border-[#DCD7CB] bg-white p-12 text-center rounded-[2px] shadow-sm">
            <div className="mx-auto w-14 h-14 bg-[#F3F1EA] rounded-full flex items-center justify-center text-[#183B2B] mb-4">
              <Satellite size={26} />
            </div>
            <h3 className="font-sans font-bold text-xl text-[#17201D]">
              No satellite images yet.
            </h3>
            <p className="text-xs text-[#69736D] max-w-sm mx-auto mt-1 mb-6">
              Upload an image to start your first analysis.
            </p>
            <div className="flex items-center justify-center gap-3">
              <button
                onClick={() => setShowUploadModal(true)}
                className="bg-[#183B2B] text-white px-5 py-2 font-mono-tech text-xs font-semibold hover:bg-[#122C20] transition-colors rounded-[2px] shadow-sm inline-flex items-center gap-1.5"
                data-testid="btn-empty-upload"
              >
                <Plus size={14} />
                Upload Image
              </button>
              {(searchQuery || sensorFilter !== 'All') && (
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSensorFilter('All');
                  }}
                  className="border border-[#DCD7CB] bg-[#F3F1EA] text-[#17201D] px-4 py-2 font-mono-tech text-xs hover:bg-[#ECE9E0] rounded-[2px]"
                >
                  Clear filters
                </button>
              )}
            </div>
          </div>
        )}

        {/* =========================================================================
            UPLOAD IMAGE MODAL
            ========================================================================= */}
        {showUploadModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
            <div className="w-full max-w-lg border border-[#DCD7CB] bg-white p-6 rounded-[2px] shadow-2xl">
              <div className="flex items-start justify-between border-b border-[#DCD7CB] pb-3">
                <div>
                  <h3 className="font-sans font-bold text-base text-[#17201D]">
                    Upload Satellite Image
                  </h3>
                  <p className="font-mono-tech text-xs text-[#69736D] mt-0.5">
                    Supported formats: GeoTIFF, STAC JSON, GeoJSON, or standard imagery.
                  </p>
                </div>
                <button
                  onClick={() => setShowUploadModal(false)}
                  className="p-1 text-[#69736D] hover:text-[#17201D]"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Drag & Drop Surface */}
              <div
                onClick={() => fileInputRef.current?.click()}
                className="mt-5 border-2 border-dashed border-[#DCD7CB] bg-[#F3F1EA] hover:border-[#183B2B] hover:bg-[#E5EFE9]/40 p-8 text-center rounded-[2px] cursor-pointer transition-colors"
              >
                <FileUp size={32} className="mx-auto text-[#183B2B] mb-2" />
                <p className="font-sans font-semibold text-sm text-[#17201D]">
                  Click to select an image from your computer
                </p>
                <p className="font-mono-tech text-xs text-[#69736D] mt-1">
                  or drag and drop GeoTIFF / GeoJSON here
                </p>
              </div>

              {/* Sample Quick Load Options */}
              <div className="mt-5">
                <div className="font-mono-tech text-[10px] uppercase text-[#69736D] font-semibold mb-2">
                  OR TRY A PRESET SAMPLE SCENE:
                </div>
                <div className="space-y-2">
                  <button
                    onClick={() => addSampleImage('Bengaluru Outer Ring Road Expansion', 'Bengaluru, Karnataka', 'Sentinel-2', '10 m')}
                    className="w-full text-left border border-[#DCD7CB] bg-[#F3F1EA] hover:bg-[#ECE9E0] p-2.5 rounded-[2px] font-mono-tech text-xs flex items-center justify-between"
                  >
                    <div>
                      <span className="font-bold text-[#17201D] block">Bengaluru Tech Corridor</span>
                      <span className="text-[#69736D] text-[10px]">Sentinel-2 · 10 m GSD · 2026</span>
                    </div>
                    <span className="text-[#183B2B] font-semibold text-[11px]">+ Add</span>
                  </button>

                  <button
                    onClick={() => addSampleImage('Kaziranga Wetland Inundation', 'Assam, India', 'Sentinel-1 (SAR)', '20 m')}
                    className="w-full text-left border border-[#DCD7CB] bg-[#F3F1EA] hover:bg-[#ECE9E0] p-2.5 rounded-[2px] font-mono-tech text-xs flex items-center justify-between"
                  >
                    <div>
                      <span className="font-bold text-[#17201D] block">Kaziranga Flood Monitoring</span>
                      <span className="text-[#69736D] text-[10px]">Sentinel-1 SAR Radar · 20 m · 2024</span>
                    </div>
                    <span className="text-[#183B2B] font-semibold text-[11px]">+ Add</span>
                  </button>
                </div>
              </div>

              <div className="mt-6 flex justify-end gap-3 border-t border-[#DCD7CB] pt-3 font-mono-tech text-xs">
                <button
                  onClick={() => setShowUploadModal(false)}
                  className="border border-[#DCD7CB] px-4 py-1.5 text-[#69736D] hover:bg-[#F3F1EA] rounded-[2px]"
                >
                  Cancel
                </button>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="bg-[#183B2B] text-white px-4 py-1.5 font-semibold hover:bg-[#122C20] rounded-[2px]"
                >
                  Select File
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Shell>
  );
}

