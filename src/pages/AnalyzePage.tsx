import { useState, useEffect } from 'react';
import { Link } from 'wouter';
import {
  Play, Pause, RotateCcw, Crosshair, Ruler, Layers,
  Check, ArrowRight, Eye, ShieldCheck, Database, Radio,
  Compass, Maximize2, Sparkles, RefreshCw, X, CheckCircle2, ChevronDown, ChevronUp,
  Plus, Minus
} from 'lucide-react';
import { Shell, StatusPill } from '@/components/layout/Shell';
import { SCENARIOS, InvestigationScenario, ScenarioFinding } from '@/lib/mockData';

const QUERY_SUGGESTIONS = [
  { label: 'Find new buildings', text: 'Find new buildings and urban construction between 2020 and 2026.' },
  { label: 'Detect vegetation loss', text: 'Detect agricultural tree canopy and farmland loss between 2020 and 2026.' },
  { label: 'Compare two dates', text: 'Compare 2020 baseline satellite scene with 2026 current imagery.' },
  { label: 'Find flood-affected areas', text: 'Map flood-affected inundation zones and slope failure scars.' },
  { label: 'Analyze water changes', text: 'Analyze surface water reservoir and riparian boundaries.' },
];

export default function AnalyzePage() {
  const [scenarioId, setScenarioId] = useState<'noida' | 'wayanad'>('noida');
  const scenario: InvestigationScenario = SCENARIOS[scenarioId] ?? SCENARIOS.noida;

  const [queryInput, setQueryInput] = useState<string>(
    'Find new buildings and urban construction between 2020 and 2026.'
  );
  const [selectedFindingId, setSelectedFindingId] = useState<string>('A');
  const [activeYear, setActiveYear] = useState<number>(2026);
  const [isPlayingTimeline, setIsPlayingTimeline] = useState<boolean>(false);

  // Analysis progress flow states
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [analysisStage, setAnalysisStage] = useState<number>(5); // 1-5, 5 = complete
  const [analysisComplete, setAnalysisComplete] = useState<boolean>(true);

  // Side Drawer for Finding Details
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);

  // Expandable technical details
  const [showTechnicalDetails, setShowTechnicalDetails] = useState<boolean>(false);

  // Map state
  const [activeLayer, setActiveLayer] = useState<'RGB' | 'NIR' | 'NDVI' | 'NDBI' | 'SAR' | 'CHANGE'>('CHANGE');
  const [opacity, setOpacity] = useState<number>(85);
  const [zoom, setZoom] = useState<number>(12);
  const [measureMode, setMeasureMode] = useState<boolean>(false);
  const [measureDistance, setMeasureDistance] = useState<string | null>(null);

  const selectedFinding: ScenarioFinding =
    scenario.findings.find((f) => f.id === selectedFindingId) ?? scenario.findings[0];

  const handleStartAnalysis = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsAnalyzing(true);
    setAnalysisComplete(false);
    setAnalysisStage(1);

    setTimeout(() => setAnalysisStage(2), 350);
    setTimeout(() => setAnalysisStage(3), 700);
    setTimeout(() => setAnalysisStage(4), 1050);
    setTimeout(() => {
      setAnalysisStage(5);
      setIsAnalyzing(false);
      setAnalysisComplete(true);
    }, 1400);
  };

  const handleSelectScenario = (id: 'noida' | 'wayanad') => {
    setScenarioId(id);
    const newScen = SCENARIOS[id] ?? SCENARIOS.noida;
    setQueryInput(newScen.query);
    setSelectedFindingId(newScen.findings[0]?.id ?? 'A');
    setActiveYear(newScen.timeMachineEpochs[newScen.timeMachineEpochs.length - 1]?.year ?? 2026);
  };

  const handleFindingClick = (id: string) => {
    setSelectedFindingId(id);
    setIsDrawerOpen(true);
  };

  const epochs = scenario.timeMachineEpochs;

  return (
    <Shell>
      <div className="w-full flex flex-col bg-[#F3F1EA] text-[#17201D]">
        
        {/* =========================================================================
            MISSION HEADER (Top Context Bar)
            ========================================================================= */}
        <div className="border-b border-[#DCD7CB] bg-white px-4 py-2.5 lg:px-8">
          <div className="mx-auto max-w-[1700px] flex flex-wrap items-center justify-between gap-4 font-mono-tech text-xs">
            {/* Left: Mission & Coordinates */}
            <div className="flex flex-wrap items-center gap-3">
              <span className="font-bold text-[#183B2B] bg-[#E5EFE9] px-2 py-0.5 border border-[#183B2B]/20 rounded-[2px]">
                {scenarioId === 'noida' ? 'NOIDA EXPANSION INVESTIGATION' : 'WAYANAD LANDSLIDE TRIAGE'}
              </span>
              <span className="text-[#69736D]">Location: {scenario.region}</span>
              <span className="text-[#69736D]">·</span>
              <span className="text-[#17201D] font-medium">
                {scenario.coordinates.lat}° N, {scenario.coordinates.lng}° E
              </span>
            </div>

            {/* Right: Presets Switcher */}
            <div className="flex items-center gap-3">
              <span className="text-[#69736D] text-[11px] uppercase">EXAMPLE SITES:</span>
              <div className="flex border border-[#DCD7CB] bg-[#F3F1EA] p-0.5 rounded-[2px]">
                <button
                  onClick={() => handleSelectScenario('noida')}
                  className={`px-2.5 py-0.5 text-xs transition-colors rounded-[2px] ${
                    scenarioId === 'noida'
                      ? 'bg-[#183B2B] text-white font-medium'
                      : 'text-[#69736D] hover:text-[#17201D]'
                  }`}
                  data-testid="preset-noida"
                >
                  Noida Urban
                </button>
                <button
                  onClick={() => handleSelectScenario('wayanad')}
                  className={`px-2.5 py-0.5 text-xs transition-colors rounded-[2px] ${
                    scenarioId === 'wayanad'
                      ? 'bg-[#C25E2E] text-white font-medium'
                      : 'text-[#69736D] hover:text-[#17201D]'
                  }`}
                  data-testid="preset-wayanad"
                >
                  Wayanad Landslide
                </button>
              </div>

              <StatusPill tone="green">
                <span className="h-1.5 w-1.5 bg-[#15803D]" />
                CALIBRATED DEMO
              </StatusPill>
            </div>
          </div>
        </div>

        {/* =========================================================================
            WORKSPACE BODY: 25% LEFT | 55% CENTER MAP | 20% RIGHT EVIDENCE
            ========================================================================= */}
        <div className="mx-auto w-full max-w-[1700px] p-4 lg:p-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch min-h-[640px]">
            
            {/* ---------------------------------------------------------------------
                LEFT 25% (lg:col-span-3): QUERY EXPERIENCE & ANALYSIS FLOW
                "What would you like to know about this imagery?" + Suggestions
                --------------------------------------------------------------------- */}
            <div className="lg:col-span-3 flex flex-col justify-between border border-[#DCD7CB] bg-white p-5 rounded-[2px]">
              <div>
                <div className="font-mono-tech text-[10px] uppercase tracking-wider text-[#69736D] mb-1">
                  QUERY
                </div>
                <h2 className="text-base font-bold text-[#17201D]">
                  What would you like to know about this imagery?
                </h2>

                {/* Query Input Box */}
                <form onSubmit={handleStartAnalysis} className="mt-3">
                  <textarea
                    value={queryInput}
                    onChange={(e) => setQueryInput(e.target.value)}
                    rows={3}
                    className="w-full resize-none border border-[#DCD7CB] bg-[#F3F1EA] p-2.5 font-sans text-xs leading-relaxed text-[#17201D] focus:border-[#183B2B] focus:outline-none rounded-[2px]"
                    placeholder="Example: Find new buildings between 2020 and 2026"
                    data-testid="input-query-box"
                  />

                  {/* Clickable Suggestions */}
                  <div className="mt-2.5">
                    <span className="font-mono-tech text-[10px] text-[#69736D] uppercase block mb-1.5">
                      SUGGESTIONS:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {QUERY_SUGGESTIONS.map((sug) => (
                        <button
                          key={sug.label}
                          type="button"
                          onClick={() => setQueryInput(sug.text)}
                          className="font-mono-tech text-[10px] bg-[#F3F1EA] hover:bg-[#ECE9E0] text-[#17201D] px-2 py-1 border border-[#DCD7CB] transition-colors rounded-[2px]"
                          data-testid={`btn-suggest-${sug.label.toLowerCase().replace(/\s+/g, '-')}`}
                        >
                          {sug.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Analyze Action Button */}
                  <button
                    type="submit"
                    disabled={isAnalyzing || !queryInput.trim()}
                    className="mt-4 w-full bg-[#183B2B] text-white py-2.5 font-mono-tech text-xs font-bold uppercase tracking-wider hover:bg-[#122C20] transition-colors flex items-center justify-center gap-2 rounded-[2px] disabled:opacity-50"
                    data-testid="btn-analyze-submit"
                  >
                    {isAnalyzing ? (
                      <>
                        <RefreshCw size={13} className="animate-spin" />
                        Analyzing Satellite Imagery...
                      </>
                    ) : (
                      'Analyze Imagery'
                    )}
                  </button>
                </form>
              </div>

              {/* ---------------------------------------------------------------------
                  ANALYSIS PROGRESS FLOW PANEL (Real Steps, No Fake Percentages!)
                  --------------------------------------------------------------------- */}
              <div className="mt-6 border-t border-[#DCD7CB] pt-4 font-mono-tech text-xs">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] text-[#69736D] uppercase font-bold">
                    ANALYSIS STATUS
                  </span>
                  {analysisComplete && !isAnalyzing && (
                    <span className="text-[#15803D] font-bold text-xs flex items-center gap-1">
                      <CheckCircle2 size={12} /> Analysis complete
                    </span>
                  )}
                </div>

                <div className="space-y-1.5 text-xs">
                  {/* Step 1 */}
                  <div className="flex items-center justify-between">
                    <span className={analysisStage >= 1 ? 'text-[#17201D] font-medium' : 'text-[#919B95]'}>
                      Understanding your question
                    </span>
                    <span>{analysisStage >= 1 ? <span className="text-[#15803D]">✓</span> : '○'}</span>
                  </div>

                  {/* Step 2 */}
                  <div className="flex items-center justify-between">
                    <span className={analysisStage >= 2 ? 'text-[#17201D] font-medium' : 'text-[#919B95]'}>
                      Checking imagery
                    </span>
                    <span>{analysisStage >= 2 ? <span className="text-[#15803D]">✓</span> : analysisStage === 1 ? '●' : '○'}</span>
                  </div>

                  {/* Step 3 */}
                  <div className="flex items-center justify-between">
                    <span className={analysisStage >= 3 ? 'text-[#17201D] font-medium' : 'text-[#919B95]'}>
                      Analyzing changes
                    </span>
                    <span>{analysisStage >= 3 ? <span className="text-[#15803D]">✓</span> : analysisStage === 2 ? '●' : '○'}</span>
                  </div>

                  {/* Step 4 */}
                  <div className="flex items-center justify-between">
                    <span className={analysisStage >= 4 ? 'text-[#17201D] font-medium' : 'text-[#919B95]'}>
                      Checking supporting evidence
                    </span>
                    <span>{analysisStage >= 4 ? <span className="text-[#15803D]">✓</span> : analysisStage === 3 ? '●' : '○'}</span>
                  </div>

                  {/* Step 5 */}
                  <div className="flex items-center justify-between">
                    <span className={analysisStage >= 5 ? 'text-[#17201D] font-medium' : 'text-[#919B95]'}>
                      Preparing result
                    </span>
                    <span>{analysisStage >= 5 ? <span className="text-[#15803D]">✓</span> : analysisStage === 4 ? '●' : '○'}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* ---------------------------------------------------------------------
                CENTER 55% (lg:col-span-6): SATELLITE MAP (MAIN VISUAL HERO)
                Simple Controls: +, -, Layers, Before / After, Fullscreen
                Top metadata: Sentinel-2 · 10 m · 18 Mar 2026 · Noida
                --------------------------------------------------------------------- */}
            <div className="lg:col-span-6 flex flex-col justify-between border border-[#DCD7CB] bg-[#1E2923] relative overflow-hidden rounded-[2px]">
              
              {/* Map Canvas Background */}
              <div
                className="absolute inset-0 transition-all duration-300"
                style={{
                  opacity: opacity / 100,
                  backgroundColor:
                    activeLayer === 'RGB' ? '#1E2923' : activeLayer === 'NIR' ? '#2B151F' : activeLayer === 'SAR' ? '#181E21' : '#2A3026',
                  backgroundImage:
                    activeLayer === 'SAR'
                      ? `
                        radial-gradient(circle at 50% 48%, rgba(255, 255, 255, 0.6), transparent 28%),
                        radial-gradient(circle at 35% 62%, rgba(2, 132, 199, 0.4), transparent 30%),
                        repeating-linear-gradient(45deg, rgba(255, 255, 255, 0.05) 0 2px, transparent 2px 7px)
                      `
                      : activeLayer === 'NIR'
                      ? `
                        radial-gradient(circle at 45% 45%, rgba(225, 29, 72, 0.6), transparent 45%),
                        radial-gradient(circle at 65% 55%, rgba(2, 132, 199, 0.35), transparent 40%),
                        linear-gradient(135deg, #1A0D14 0%, #2B151F 100%)
                      `
                      : `
                        radial-gradient(circle at 48% 44%, rgba(200, 90, 23, 0.55), transparent 40%),
                        radial-gradient(circle at 62% 58%, rgba(2, 132, 199, 0.4), transparent 35%),
                        radial-gradient(circle at 28% 70%, rgba(34, 197, 94, 0.35), transparent 30%),
                        linear-gradient(135deg, #17211C 0%, #243029 100%)
                      `,
                }}
              />

              {/* Subtle Graticule Grid */}
              <div className="graticule-grid absolute inset-0 pointer-events-none opacity-25" />

              {/* TOP SIMPLE METADATA STRIP */}
              <div className="relative z-10 flex flex-wrap items-center justify-between gap-2 border-b border-white/20 bg-black/75 px-4 py-2 text-white font-mono-tech text-xs backdrop-blur-sm">
                <div className="flex items-center gap-3">
                  <span className="font-bold text-[#BAE6FD]">Sentinel-2</span>
                  <span>·</span>
                  <span>10 m</span>
                  <span>·</span>
                  <span>18 Mar 2026</span>
                  <span>·</span>
                  <span>{scenario.region.split(',')[0]}</span>
                </div>
                <div className="text-[10px] text-slate-300">
                  EPSG:4326
                </div>
              </div>

              {/* CENTER DETECTED FOOTPRINT & CLICKABLE REGION */}
              <div className="relative z-10 my-auto flex items-center justify-center p-6">
                <div className="relative h-56 w-80 border-2 border-dashed border-[#FDE68A] bg-[#C25E2E]/15 p-3 shadow-2xl flex flex-col justify-between">
                  <div className="flex items-center justify-between font-mono-tech text-[10px] text-[#FDE68A] bg-black/60 px-2 py-1">
                    <span>DETECTED CHANGE FOOTPRINT</span>
                    <span>10 m GSD</span>
                  </div>

                  {/* Finding Marker Clusters */}
                  <div className="flex items-center justify-center gap-3 my-auto">
                    {scenario.findings.map((f) => {
                      const isSel = f.id === selectedFindingId;
                      return (
                        <button
                          key={f.id}
                          onClick={() => handleFindingClick(f.id)}
                          className={`px-3 py-1.5 font-mono-tech text-xs font-bold border transition-all rounded-[2px] ${
                            isSel
                              ? 'bg-[#FDE68A] text-black border-white shadow-lg scale-105'
                              : 'bg-black/70 text-white border-white/40 hover:bg-black'
                          }`}
                          title="Click to view finding details"
                          data-testid={`btn-finding-${f.id}`}
                        >
                          CLUSTER {f.id}
                        </button>
                      );
                    })}
                  </div>

                  {measureDistance && (
                    <div className="bg-[#C25E2E] text-white font-mono-tech text-[10px] py-0.5 px-2 mx-auto rounded-[2px]">
                      DISTANCE: {measureDistance}
                    </div>
                  )}

                  {/* Click to inspect prompt */}
                  <div className="text-center font-mono-tech text-[10px] text-white/90 bg-black/60 py-1">
                    Click any cluster above to open details drawer →
                  </div>
                </div>
              </div>

              {/* BOTTOM SIMPLE CONTROLS: +, -, Layers, Before / After, Fullscreen */}
              <div className="relative z-10 flex flex-wrap items-center justify-between gap-3 border-t border-white/20 bg-black/80 px-4 py-2 text-white font-mono-tech text-xs backdrop-blur-sm">
                {/* Simple Zoom Controls */}
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => setZoom((prev) => Math.min(18, prev + 1))}
                    className="p-1 border border-white/30 hover:bg-white/20 rounded-[2px]"
                    title="Zoom in"
                    data-testid="btn-workspace-zoom-in"
                  >
                    <Plus size={13} />
                  </button>
                  <button
                    onClick={() => setZoom((prev) => Math.max(8, prev - 1))}
                    className="p-1 border border-white/30 hover:bg-white/20 rounded-[2px]"
                    title="Zoom out"
                    data-testid="btn-workspace-zoom-out"
                  >
                    <Minus size={13} />
                  </button>
                  <span className="text-[10px] text-slate-300 ml-1">{zoom}z</span>
                </div>

                {/* Layers and Tools */}
                <div className="flex items-center gap-3">
                  {/* Layer Switcher */}
                  <div className="flex items-center gap-1">
                    <span className="text-slate-400 text-[10px]">Layers:</span>
                    {(['RGB', 'NIR', 'NDVI', 'SAR', 'CHANGE'] as const).map((ly) => (
                      <button
                        key={ly}
                        onClick={() => setActiveLayer(ly)}
                        className={`px-2 py-0.5 rounded-[2px] uppercase text-[10px] ${
                          activeLayer === ly ? 'bg-[#183B2B] text-white font-bold' : 'text-slate-300 hover:bg-white/10'
                        }`}
                      >
                        {ly}
                      </button>
                    ))}
                  </div>

                  {/* Ruler Toggle */}
                  <button
                    onClick={() => {
                      setMeasureMode(!measureMode);
                      if (measureMode) setMeasureDistance(null);
                      else setMeasureDistance('3.42 km');
                    }}
                    className={`inline-flex items-center gap-1 px-2 py-0.5 border text-[10px] rounded-[2px] ${
                      measureMode ? 'border-[#C25E2E] bg-[#C25E2E]/40 text-white' : 'border-white/30 text-white hover:bg-white/10'
                    }`}
                  >
                    <Ruler size={11} />
                    <span>Ruler</span>
                  </button>
                </div>
              </div>
            </div>

            {/* ---------------------------------------------------------------------
                RIGHT 20% (lg:col-span-3): ANALYSIS RESULT (HUMAN-READABLE)
                --------------------------------------------------------------------- */}
            <div className="lg:col-span-3 flex flex-col justify-between border border-[#DCD7CB] bg-white p-5 rounded-[2px]">
              <div>
                <div className="flex items-center justify-between border-b border-[#DCD7CB] pb-3">
                  <h3 className="font-mono-tech text-xs uppercase tracking-wider font-bold text-[#17201D]">
                    ANALYSIS RESULT
                  </h3>
                  <span className="text-[#15803D] font-mono-tech text-xs font-bold flex items-center gap-1">
                    <CheckCircle2 size={13} />
                    Analysis complete
                  </span>
                </div>

                {/* Primary Question & Answer in Plain Language */}
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

                {/* Evidence Metrics Table (Human-Readable Labels) */}
                <div className="mt-4 space-y-2.5 font-mono-tech text-xs">
                  <div className="flex items-center justify-between py-1 border-b border-[#DCD7CB]/60">
                    <span className="text-[#69736D]">Changed area</span>
                    <span className="font-bold text-[#17201D]">{selectedFinding.changedAreaKm2} km²</span>
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
                    <span className="font-bold text-[#17201D]">{selectedFinding.modelConfidence * 100}%</span>
                  </div>

                  <div className="flex items-center justify-between py-1 border-b border-[#DCD7CB]/60">
                    <span className="text-[#69736D]">Verification</span>
                    <span className="font-bold text-[#15803D]">Passed</span>
                  </div>
                </div>

                {/* Expandable Technical Evidence Section */}
                <div className="mt-4 pt-2">
                  <button
                    onClick={() => setShowTechnicalDetails(!showTechnicalDetails)}
                    className="flex items-center justify-between w-full font-mono-tech text-[11px] text-[#183B2B] font-semibold hover:underline"
                    data-testid="btn-workspace-toggle-tech"
                  >
                    <span>{showTechnicalDetails ? '▲ Hide technical details' : '▼ Technical details'}</span>
                  </button>

                  {showTechnicalDetails && (
                    <div className="mt-2.5 p-3 bg-[#F3F1EA] border border-[#DCD7CB] font-mono-tech text-[10px] space-y-1 text-[#17201D] rounded-[2px] animate-in fade-in">
                      <div className="flex justify-between">
                        <span className="text-[#69736D]">Model:</span>
                        <span className="font-bold">ChangeNet v2</span>
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
                        <span className="font-bold text-[#C25E2E]">+0.46</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[#69736D]">SAR:</span>
                        <span className="font-bold text-[#15803D]">+4.2 dB</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-6 pt-4 border-t border-[#DCD7CB] space-y-2 font-mono-tech text-xs">
                <button
                  onClick={() => setIsDrawerOpen(true)}
                  className="w-full bg-[#183B2B] text-white py-2 px-3 font-semibold hover:bg-[#122C20] transition-colors rounded-[2px] text-center block"
                >
                  View Finding Details Drawer
                </button>
                <Link
                  href="/reports"
                  className="flex items-center justify-between w-full border border-[#DCD7CB] bg-[#F3F1EA] py-1.5 px-3 hover:bg-[#ECE9E0] text-[#17201D] transition-colors rounded-[2px]"
                >
                  <span>Export Mission Report</span>
                  <ArrowRight size={12} />
                </Link>
              </div>
            </div>

          </div>

          {/* =========================================================================
              BOTTOM: TEMPORAL TIMELINE (2018 ─── 2020 ─── 2022 ─── 2024 ─── 2026)
              ========================================================================= */}
          <div className="mt-5 border border-[#DCD7CB] bg-white p-4 rounded-[2px]">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              {/* Left Play/Pause and Active Label */}
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setIsPlayingTimeline(!isPlayingTimeline)}
                  className="h-8 w-8 flex items-center justify-center bg-[#183B2B] text-white hover:bg-[#122C20] transition-colors rounded-[2px]"
                  data-testid="btn-timeline-play-pause"
                >
                  {isPlayingTimeline ? <Pause size={13} /> : <Play size={13} className="ml-0.5" />}
                </button>
                <div className="font-mono-tech text-xs">
                  <span className="font-bold text-[#183B2B] text-sm mr-2">{activeYear} ACQUISITION</span>
                  <span className="text-[#69736D]">
                    {epochs.find((e) => e.year === activeYear)?.description ?? 'Validated scene state'}
                  </span>
                </div>
              </div>

              {/* Right Horizontal Scientific Timeline Track */}
              <div className="flex items-center gap-4 sm:gap-8 font-mono-tech text-xs font-bold text-[#69736D]">
                {epochs.map((ep, i) => {
                  const isCur = ep.year === activeYear;
                  return (
                    <div key={ep.year} className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          setIsPlayingTimeline(false);
                          setActiveYear(ep.year);
                        }}
                        className={`px-2.5 py-1 transition-all rounded-[2px] border ${
                          isCur
                            ? 'bg-[#183B2B] text-white border-[#183B2B]'
                            : 'bg-[#F3F1EA] text-[#69736D] border-[#DCD7CB] hover:bg-[#ECE9E0] hover:text-[#17201D]'
                        }`}
                        data-testid={`btn-year-${ep.year}`}
                      >
                        {ep.year}
                      </button>
                      {i < epochs.length - 1 && (
                        <span className="text-[#DCD7CB] select-none">─────</span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* =========================================================================
            FINDING DETAILS SIDE DRAWER (Opens when user clicks finding)
            WHAT WE FOUND · CHANGE · AREA · WHY WE THINK SO · HOW CERTAIN ARE WE · VERIFICATION
            ========================================================================= */}
        {isDrawerOpen && (
          <div className="fixed inset-0 z-50 flex justify-end bg-black/50 backdrop-blur-xs">
            <div className="w-full max-w-md bg-white border-l border-[#DCD7CB] p-6 shadow-2xl flex flex-col justify-between font-sans animate-in slide-in-from-right duration-200">
              <div>
                {/* Header */}
                <div className="flex items-center justify-between border-b border-[#DCD7CB] pb-4">
                  <div className="font-mono-tech text-xs uppercase text-[#69736D] font-bold">
                    FINDING DETAILS · CLUSTER {selectedFinding.id}
                  </div>
                  <button
                    onClick={() => setIsDrawerOpen(false)}
                    className="p-1 text-[#69736D] hover:text-[#17201D] hover:bg-[#F3F1EA] rounded-[2px]"
                  >
                    <X size={18} />
                  </button>
                </div>

                {/* WHAT WE FOUND */}
                <div className="mt-5">
                  <span className="font-mono-tech text-[10px] uppercase text-[#69736D] font-bold block">
                    WHAT WE FOUND
                  </span>
                  <h3 className="text-xl font-bold text-[#17201D] mt-0.5">
                    {selectedFinding.label}
                  </h3>
                </div>

                {/* CHANGE & AREA HERO */}
                <div className="mt-4 grid grid-cols-2 gap-3 border-y border-[#DCD7CB] py-3 font-mono-tech">
                  <div>
                    <span className="text-[10px] text-[#69736D] uppercase block">CHANGE</span>
                    <span className="text-xl font-bold text-[#C25E2E]">
                      {selectedFinding.changePercent > 0 ? `+${selectedFinding.changePercent}%` : `${selectedFinding.changePercent}%`}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-[#69736D] uppercase block">AREA</span>
                    <span className="text-xl font-bold text-[#17201D]">
                      {selectedFinding.changedAreaKm2} km²
                    </span>
                  </div>
                </div>

                {/* WHY WE THINK SO */}
                <div className="mt-5">
                  <span className="font-mono-tech text-[10px] uppercase text-[#69736D] font-bold block mb-2">
                    WHY WE THINK SO
                  </span>
                  <ul className="space-y-2 text-xs text-[#17201D]">
                    <li className="flex items-start gap-2">
                      <span className="text-[#15803D] font-bold mt-0.5">✓</span>
                      <span>Optical imagery shows increased built-up surface</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-[#15803D] font-bold mt-0.5">✓</span>
                      <span>SAR supports structural change</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-[#15803D] font-bold mt-0.5">✓</span>
                      <span>Change detection identifies affected regions</span>
                    </li>
                  </ul>
                </div>

                {/* HOW CERTAIN ARE WE? */}
                <div className="mt-6 border-t border-[#DCD7CB] pt-4 font-mono-tech text-xs space-y-2">
                  <span className="text-[10px] uppercase text-[#69736D] font-bold block">
                    HOW CERTAIN ARE WE?
                  </span>
                  <div className="flex items-center justify-between font-medium">
                    <span>Model confidence:</span>
                    <span className="font-bold text-[#183B2B]">{selectedFinding.modelConfidence * 100}%</span>
                  </div>
                  <div className="flex items-center justify-between font-medium">
                    <span>VERIFICATION:</span>
                    <span className="font-bold text-[#15803D]">Passed (Qualify)</span>
                  </div>
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="mt-8 pt-4 border-t border-[#DCD7CB] flex items-center gap-3">
                <Link
                  href="/evidence"
                  className="flex-1 bg-[#183B2B] text-white py-2.5 font-mono-tech text-xs font-bold uppercase tracking-wider text-center hover:bg-[#122C20] rounded-[2px]"
                >
                  View Evidence →
                </Link>
                <button
                  onClick={() => setIsDrawerOpen(false)}
                  className="border border-[#DCD7CB] px-4 py-2.5 font-mono-tech text-xs hover:bg-[#F3F1EA] rounded-[2px]"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Shell>
  );
}
