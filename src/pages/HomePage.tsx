import { useState, useEffect, useRef, ChangeEvent } from 'react';
import {
  ArrowRight,
  CheckCircle2,
  Loader2,
  ShieldCheck,
  Terminal,
  Search,
  Paperclip,
  X,
  FileImage,
} from 'lucide-react';
import { Shell } from '@/components/layout/Shell';

interface ExecutionStep {
  id: number;
  model: string;
  label: string;
  duration: number; // in ms
}

// 5 steps x 4000ms = 20 seconds total duration
const EXECUTION_STEPS: ExecutionStep[] = [
  {
    id: 1,
    model: 'Qwen2.5-VLM Controller',
    label: 'Parsing natural language intent & selecting tool pipeline...',
    duration: 4000,
  },
  {
    id: 2,
    model: 'Grounding DINO',
    label: 'Extracting candidate bounding boxes for urban structures...',
    duration: 4000,
  },
  {
    id: 3,
    model: 'SAM-2 / SamGeo',
    label: 'Generating high-precision polygonal masks & area boundaries...',
    duration: 4000,
  },
  {
    id: 4,
    model: 'ChangeFormer / BiT',
    label: 'Running bitemporal cross-attention (T1 vs T2)...',
    duration: 4000,
  },
  {
    id: 5,
    model: 'Evidence Synthesis',
    label: 'Calculating verified area delta & computing confidence score...',
    duration: 4000,
  },
];

export default function HomePage() {
  // Starts empty with placeholder
  const [queryText, setQueryText] = useState<string>('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [isComplete, setIsComplete] = useState<boolean>(false);

  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Trigger 20-second analysis lifecycle regardless of input string or file attachment
  const runAnalysis = () => {
    if (isAnalyzing) return;

    setIsAnalyzing(true);
    setIsComplete(false);
    setCurrentStep(1);

    // Step 1 (~4s)
    timeoutRef.current = setTimeout(() => {
      setCurrentStep(2);

      // Step 2 (~4s)
      timeoutRef.current = setTimeout(() => {
        setCurrentStep(3);

        // Step 3 (~4s)
        timeoutRef.current = setTimeout(() => {
          setCurrentStep(4);

          // Step 4 (~4s)
          timeoutRef.current = setTimeout(() => {
            setCurrentStep(5);

            // Step 5 (~4s -> Finish)
            timeoutRef.current = setTimeout(() => {
              setCurrentStep(6);
              setIsAnalyzing(false);
              setIsComplete(true);
            }, EXECUTION_STEPS[4].duration);
          }, EXECUTION_STEPS[3].duration);
        }, EXECUTION_STEPS[2].duration);
      }, EXECUTION_STEPS[1].duration);
    }, EXECUTION_STEPS[0].duration);
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  return (
    <Shell>
      <div className="bg-[#F3F1EA] py-6 sm:py-8">
        <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-8 space-y-6 sm:space-y-8">
          
          {/* =========================================================================
              1. TOP HEADER & INTERACTIVE QUERY INPUT BAR
              ========================================================================= */}
          <section className="border border-[#DCD7CB] bg-white p-6 sm:p-8 rounded-[2px] shadow-sm">
            <div className="max-w-4xl py-2">
              <h1 className="text-2xl sm:text-4xl font-bold tracking-tight text-[#17201D]">
                SatQuery AI — Autonomous Earth Observation Intelligence
              </h1>
            </div>

            {/* Query Input Box & Upload Controls */}
            <div className="mt-6 pt-6 border-t border-[#DCD7CB]">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  runAnalysis();
                }}
                className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5"
              >
                <div className="relative flex-1">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#69736D]">
                    <Search size={16} />
                  </div>
                  <input
                    type="text"
                    value={queryText}
                    onChange={(e) => setQueryText(e.target.value)}
                    disabled={isAnalyzing}
                    placeholder="Ask anything about your satellite imagery..."
                    className="w-full pl-10 pr-4 py-3 bg-[#F3F1EA] border border-[#DCD7CB] text-[#17201D] placeholder-[#919B95] text-xs sm:text-sm font-sans focus:outline-none focus:border-[#064e3b] focus:ring-1 focus:ring-[#064e3b] disabled:opacity-60 rounded-[2px] transition-colors"
                  />
                </div>

                {/* Upload Imagery Trigger Button */}
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                  data-testid="file-input-imagery"
                />
                
                <button
                  type="button"
                  disabled={isAnalyzing}
                  onClick={() => fileInputRef.current?.click()}
                  className="inline-flex items-center justify-center gap-1.5 border border-[#DCD7CB] bg-[#F3F1EA] text-[#17201D] px-4 py-3 font-mono-tech text-xs font-medium hover:bg-[#ECE9E0] active:bg-[#E3DFD4] disabled:opacity-50 transition-colors rounded-[2px] shrink-0"
                  data-testid="button-upload-imagery"
                >
                  <Paperclip size={15} className="text-[#064e3b]" />
                  <span>Upload Imagery</span>
                </button>

                {/* Run Analysis Button */}
                <button
                  type="submit"
                  disabled={isAnalyzing}
                  className="inline-flex items-center justify-center gap-2 bg-[#064e3b] text-white px-6 py-3 font-mono-tech text-xs font-semibold hover:bg-[#04382a] active:bg-[#02241b] disabled:opacity-50 transition-colors rounded-[2px] shrink-0"
                  data-testid="button-run-analysis"
                >
                  {isAnalyzing ? (
                    <>
                      <Loader2 size={14} className="animate-spin" />
                      <span>Analyzing...</span>
                    </>
                  ) : (
                    <>
                      <span>Run Analysis</span>
                      <ArrowRight size={14} />
                    </>
                  )}
                </button>
              </form>

              {/* Selected File Chip Indicator */}
              {selectedFile && (
                <div className="mt-3 flex items-center gap-2">
                  <div className="inline-flex items-center gap-2 bg-[#E5EFE9] border border-[#064e3b]/30 px-3 py-1 font-mono-tech text-xs text-[#064e3b] rounded-[2px]">
                    <FileImage size={14} />
                    <span className="font-medium truncate max-w-xs">{selectedFile.name}</span>
                    <button
                      type="button"
                      onClick={handleRemoveFile}
                      disabled={isAnalyzing}
                      className="text-[#064e3b] hover:text-red-700 p-0.5 rounded transition-colors"
                      title="Remove attached image"
                    >
                      <X size={13} />
                    </button>
                  </div>
                  <span className="font-mono-tech text-[10px] text-[#69736D]">
                    ({(selectedFile.size / 1024).toFixed(1)} KB image attached)
                  </span>
                </div>
              )}
            </div>
          </section>

          {/* =========================================================================
              2. MAIN CONTENT: 2-COLUMN LAYOUT
              Left (60%): Satellite Viewport | Right (40%): Live Execution Plan & Results Panel
              ========================================================================= */}
          <div className="grid gap-6 lg:grid-cols-12 items-start">

            {/* ---------------------------------------------------------------------
                LEFT (60%): SATELLITE VIEWPORT (CLEAN EXPLICIT STATES)
                --------------------------------------------------------------------- */}
            <div className="lg:col-span-7 relative border border-[#DCD7CB] bg-[#0d1412] rounded-[2px] overflow-hidden min-h-[560px] shadow-sm flex items-center justify-center p-4 sm:p-8">
              
              {/* STATE 1: INITIAL STATE (Before analysis) */}
              {!isAnalyzing && !isComplete && (
                <div className="relative z-10 text-center p-6 max-w-sm font-mono-tech">
                  <p className="text-white/40 text-xs tracking-wide">
                    Satellite Viewport Ready — Enter query and click Run Analysis
                  </p>
                </div>
              )}

              {/* STATE 2: ANALYZING STATE (During 20s animation) */}
              {isAnalyzing && (
                <div className="absolute inset-0 bg-[#0d1412] z-30 flex flex-col items-center justify-center p-6 text-center animate-in fade-in duration-300">
                  <div className="p-3.5 rounded-full bg-[#064e3b]/25 border border-[#064e3b]/50 mb-3.5 shadow-lg">
                    <Loader2 size={32} className="text-[#84cc16] animate-spin" />
                  </div>
                  <p className="font-mono-tech text-sm font-semibold text-slate-100 tracking-wide">
                    Generating output imagery...
                  </p>
                  <p className="font-mono-tech text-[10px] text-slate-400 mt-1.5 uppercase tracking-wider">
                    Step {currentStep} of 5 — Qwen2.5-VLM Pipeline Active
                  </p>
                </div>
              )}

              {/* STATE 3: FINISHED STATE (After 20s complete) */}
              {isComplete && (
                <div className="absolute inset-0 z-10 animate-in fade-in duration-700">
                  <img
                    src="/output.png"
                    alt="Analyzed Satellite Detection Output"
                    className="w-full h-full object-cover rounded-[2px]"
                  />
                </div>
              )}
            </div>

            {/* ---------------------------------------------------------------------
                RIGHT (40%): LIVE EXECUTION PLAN & RESULTS PANEL
                --------------------------------------------------------------------- */}
            <div className="lg:col-span-5 flex flex-col border border-[#DCD7CB] bg-white p-5 sm:p-6 rounded-[2px] shadow-sm space-y-6">
              
              {/* Visual Agentic Stepper */}
              <div>
                {/* Header */}
                <div className="flex items-center justify-between border-b border-[#DCD7CB] pb-3 mb-4">
                  <div className="font-mono-tech text-xs uppercase font-bold text-[#17201D] flex items-center gap-2">
                    <Terminal size={14} className="text-[#064e3b]" />
                    <span>Live Execution Plan</span>
                  </div>
                </div>

                {/* Vertical Timeline Step List with Item-Level Connector Segments */}
                <div className="space-y-3">
                  {EXECUTION_STEPS.map((step, index) => {
                    const isStepComplete = isComplete || currentStep > step.id;
                    const isStepCurrent = isAnalyzing && currentStep === step.id;
                    const isLastStep = index === EXECUTION_STEPS.length - 1;
                    const isSegmentActive = isComplete || currentStep > step.id;

                    return (
                      <div key={step.id} className="relative">
                        {/* Downward Connector Line Segment to next item - ONLY IF NOT LAST STEP */}
                        {!isLastStep && (
                          <div className="absolute left-[21px] top-[26px] bottom-[-14px] w-0.5 -translate-x-1/2 pointer-events-none z-0">
                            {/* Background Track Line */}
                            <div className="absolute inset-0 border-l-2 border-dashed border-[#DCD7CB]" />
                            {/* Active Solid Green Line Segment */}
                            <div
                              className={`absolute inset-0 bg-[#064e3b] transition-all duration-700 ease-in-out ${
                                isSegmentActive ? 'opacity-100 scale-y-100' : 'opacity-0 scale-y-0'
                              } origin-top`}
                            />
                          </div>
                        )}

                        <div
                          className={`relative z-10 p-3 border rounded-[2px] transition-all duration-300 ${
                            isStepCurrent
                              ? 'border-[#064e3b] bg-[#E5EFE9]/75 shadow-sm ring-1 ring-[#064e3b]/30'
                              : isStepComplete
                              ? 'border-[#DCD7CB] bg-[#F3F1EA]/60'
                              : 'border-[#DCD7CB]/60 bg-white opacity-60'
                          }`}
                        >
                          <div className="flex items-start gap-2.5">
                            <div className="mt-0.5 shrink-0 bg-white rounded-full p-0.5">
                              {isStepComplete ? (
                                <CheckCircle2 size={16} className="text-[#064e3b]" />
                              ) : isStepCurrent ? (
                                <Loader2 size={16} className="text-[#064e3b] animate-spin" />
                              ) : (
                                <div className="h-4 w-4 rounded-full border border-[#919B95] bg-[#F3F1EA] flex items-center justify-center text-[9px] font-mono-tech text-[#69736D]">
                                  {step.id}
                                </div>
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between gap-2">
                                <span
                                  className={`font-mono-tech text-[10px] uppercase font-bold px-1.5 py-0.5 rounded-[2px] ${
                                    isStepCurrent
                                      ? 'bg-[#064e3b] text-white'
                                      : isStepComplete
                                      ? 'bg-[#064e3b]/10 text-[#064e3b]'
                                      : 'bg-[#ECE9E0] text-[#69736D]'
                                  }`}
                                >
                                  [{step.model}]
                                </span>
                                {isStepComplete && (
                                  <span className="font-mono-tech text-[9px] text-[#064e3b] font-medium">
                                    Done
                                  </span>
                                )}
                              </div>
                              <p
                                className={`mt-1 text-xs leading-tight font-sans ${
                                  isStepCurrent
                                    ? 'font-bold text-[#17201D]'
                                    : isStepComplete
                                    ? 'text-[#17201D]'
                                    : 'text-[#69736D]'
                                }`}
                              >
                                "{step.label}"
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Hardcoded Demo Result State */}
              {isComplete && (
                <div className="pt-4 border-t border-[#DCD7CB] space-y-4 animate-in fade-in duration-500">
                  {/* Verified Intelligence Briefing Badge */}
                  <div className="inline-flex items-center gap-2 bg-[#064e3b] text-white px-3 py-1 font-mono-tech text-xs font-bold rounded-[2px]">
                    <ShieldCheck size={14} />
                    <span>Verified Intelligence Briefing</span>
                  </div>

                  {/* Green Answer Banner */}
                  <div className="p-3.5 bg-[#E5EFE9] border border-[#064e3b]/30 rounded-[2px]">
                    <p className="font-sans text-xs sm:text-sm font-bold text-[#064e3b] leading-relaxed">
                      "YES — Commercial built-up footprint expanded by +18.4% across the corridor."
                    </p>
                  </div>

                  {/* 4-Metric Grid */}
                  <div className="grid grid-cols-2 gap-2.5 font-mono-tech text-xs">
                    <div className="p-3 bg-[#F3F1EA] border border-[#DCD7CB] rounded-[2px]">
                      <div className="text-[10px] text-[#69736D] uppercase">Changed Area</div>
                      <div className="font-bold text-[#17201D] text-sm mt-0.5">15.6 km²</div>
                    </div>
                    <div className="p-3 bg-[#F3F1EA] border border-[#DCD7CB] rounded-[2px]">
                      <div className="text-[10px] text-[#69736D] uppercase">Confidence Score</div>
                      <div className="font-bold text-[#064e3b] text-sm mt-0.5">94% (Multi-sensor verified)</div>
                    </div>
                    <div className="p-3 bg-[#F3F1EA] border border-[#DCD7CB] rounded-[2px]">
                      <div className="text-[10px] text-[#69736D] uppercase">Optical Grounding</div>
                      <div className="font-bold text-[#17201D] text-xs mt-0.5">High (Sentinel-2 MSI)</div>
                    </div>
                    <div className="p-3 bg-[#F3F1EA] border border-[#DCD7CB] rounded-[2px]">
                      <div className="text-[10px] text-[#69736D] uppercase">SAR Verification</div>
                      <div className="font-bold text-[#064e3b] text-xs mt-0.5">Passed (Sentinel-1 C-SAR)</div>
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
