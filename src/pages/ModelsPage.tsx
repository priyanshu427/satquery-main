import { useState } from 'react';
import { Link } from 'wouter';
import {
  Cpu, Bot, Zap, RefreshCw, Layers, CheckCircle2,
  SlidersHorizontal, Sparkles, Database, Radio, ArrowRight
} from 'lucide-react';
import { Shell, PageHeader, Panel, StatusPill } from '@/components/layout/Shell';
import { MODEL_REGISTRY } from '@/lib/mockData';

export default function ModelsPage() {
  const [selectedFamily, setSelectedFamily] = useState<string>('All');
  const [models, setModels] = useState(MODEL_REGISTRY);
  const [testingModelId, setTestingModelId] = useState<string>('geovqa-parser');
  const [benchmarkPrompt, setBenchmarkPrompt] = useState<string>(
    'Detect urban expansion around Noida expressway between 2020 and 2026.'
  );
  const [benchmarkResult, setBenchmarkResult] = useState<{
    latencyMs: number;
    tokensPerSec: number;
    vramUsedGb: number;
    output: string;
  } | null>(null);
  const [isRunningBenchmark, setIsRunningBenchmark] = useState<boolean>(false);

  const families = ['All', ...Array.from(new Set(models.map((m) => m.family)))];

  const filteredModels = models.filter((m) => {
    if (selectedFamily !== 'All' && m.family !== selectedFamily) return false;
    return true;
  });

  const handleRunBenchmark = (e: React.FormEvent) => {
    e.preventDefault();
    setIsRunningBenchmark(true);
    setBenchmarkResult(null);

    setTimeout(() => {
      setIsRunningBenchmark(false);
      const selected = models.find((m) => m.id === testingModelId) ?? models[0];
      setBenchmarkResult({
        latencyMs: selected.latencyMs + Math.floor(Math.random() * 16 - 8),
        tokensPerSec: Math.round(1000 / (selected.latencyMs / 18)),
        vramUsedGb: selected.gpuMemoryGb,
        output: `Validated AST for target AOI with ${selected.confidenceScore * 100}% neural confidence. Softmax peaked at class BuiltUp_Impervious. Zero tensor drift.`,
      });
    }, 700);
  };

  return (
    <Shell>
      <div className="mx-auto max-w-[1600px] px-4 py-8 lg:px-8">
        <PageHeader
          eyebrow="FOUNDATION MODEL REGISTRY & TELEMETRY"
          title="Geospatial Foundation Models"
          description="Technical registry of vision-language parsers, bi-temporal Siamese transformers, and radiometric inference kernels powering SATQUERY AI's agentic reasoning trace."
          actions={
            <div className="flex items-center gap-3">
              <StatusPill tone="green">
                <span className="h-1.5 w-1.5 bg-[#15803D]" />
                6 MODELS ONLINE
              </StatusPill>
              <button
                onClick={() => setModels([...MODEL_REGISTRY])}
                className="border border-[#DCD7CB] bg-white px-3 py-1 font-mono-tech text-xs text-[#17201D] hover:bg-[#F3F1EA] rounded-[2px]"
              >
                Refresh Latency
              </button>
            </div>
          }
        />

        {/* Family Filter Tabs */}
        <div className="flex flex-wrap items-center gap-2 mb-6 font-mono-tech text-xs">
          {families.map((fam) => (
            <button
              key={fam}
              onClick={() => setSelectedFamily(fam)}
              className={`px-3 py-1 border transition-colors rounded-[2px] ${
                selectedFamily === fam
                  ? 'bg-[#183B2B] text-white border-[#183B2B] font-bold'
                  : 'bg-white text-[#69736D] border-[#DCD7CB] hover:text-[#17201D]'
              }`}
            >
              {fam}
            </button>
          ))}
        </div>

        {/* Model Registry Data Table */}
        <div className="overflow-x-auto border border-[#DCD7CB] bg-white rounded-[2px] mb-10">
          <table className="gis-table">
            <thead>
              <tr>
                <th>MODEL IDENTIFIER</th>
                <th>FAMILY & ARCHITECTURE</th>
                <th>PARAMETERS</th>
                <th>LATENCY</th>
                <th>GPU VRAM</th>
                <th>INPUT MODALITY</th>
                <th>CONFIDENCE</th>
                <th>STATUS</th>
                <th className="text-right">BENCHMARK</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#DCD7CB] font-mono-tech text-xs">
              {filteredModels.map((m) => (
                <tr key={m.id} className="hover:bg-[#F3F1EA]/60">
                  <td>
                    <div className="font-sans font-bold text-[#17201D]">{m.name}</div>
                    <div className="text-[10px] text-[#69736D]">{m.organization} · {m.version}</div>
                  </td>
                  <td className="text-[#183B2B] font-medium">{m.family}</td>
                  <td>{m.parameters}</td>
                  <td className="font-bold text-[#17201D]">{m.latencyMs} ms</td>
                  <td>{m.gpuMemoryGb} GB</td>
                  <td className="text-[11px] text-[#69736D] max-w-[200px] truncate" title={m.modality}>
                    {m.modality}
                  </td>
                  <td className="font-bold text-[#15803D]">{m.confidenceScore * 100}%</td>
                  <td>
                    <StatusPill tone={m.status === 'Online' ? 'green' : 'amber'}>
                      {m.status}
                    </StatusPill>
                  </td>
                  <td className="text-right">
                    <button
                      onClick={() => {
                        setTestingModelId(m.id);
                        document.getElementById('benchmark-panel')?.scrollIntoView({ behavior: 'smooth' });
                      }}
                      className="text-[#183B2B] font-bold hover:underline"
                    >
                      Test →
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Interactive Benchmark Section */}
        <div id="benchmark-panel" className="border border-[#DCD7CB] bg-white p-6 rounded-[2px]">
          <div className="font-mono-tech text-[10px] uppercase text-[#69736D] font-bold mb-1">
            BENCHMARK LAB
          </div>
          <h2 className="text-xl font-bold text-[#17201D]">
            Live Inference Forward-Pass Simulator
          </h2>
          <p className="text-xs text-[#69736D] mt-1 mb-6">
            Stage a test prompt or bounding geometry through any deployed foundation model to monitor execution latency and memory usage.
          </p>

          <form onSubmit={handleRunBenchmark} className="grid gap-6 lg:grid-cols-2 font-mono-tech text-xs">
            <div className="space-y-4">
              <div>
                <label className="text-[10px] text-[#69736D] block mb-1 uppercase">TARGET MODEL:</label>
                <select
                  value={testingModelId}
                  onChange={(e) => setTestingModelId(e.target.value)}
                  className="w-full border border-[#DCD7CB] bg-[#F3F1EA] p-2.5 text-[#17201D] focus:border-[#183B2B] focus:outline-none rounded-[2px]"
                >
                  {models.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.name} ({m.parameters}) — {m.latencyMs}ms
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[10px] text-[#69736D] block mb-1 uppercase">INPUT QUERY / AST PAYLOAD:</label>
                <textarea
                  value={benchmarkPrompt}
                  onChange={(e) => setBenchmarkPrompt(e.target.value)}
                  rows={3}
                  className="w-full border border-[#DCD7CB] bg-[#F3F1EA] p-2.5 text-[#17201D] focus:border-[#183B2B] focus:outline-none rounded-[2px]"
                />
              </div>

              <button
                type="submit"
                disabled={isRunningBenchmark}
                className="w-full bg-[#183B2B] text-white py-2.5 font-bold uppercase tracking-wider hover:bg-[#122C20] transition-colors rounded-[2px]"
                data-testid="btn-run-benchmark"
              >
                {isRunningBenchmark ? 'COMPUTING TENSORS...' : 'RUN FORWARD-PASS BENCHMARK'}
              </button>
            </div>

            {/* Readout */}
            <div className="border border-[#DCD7CB] bg-[#F3F1EA] p-4 rounded-[2px] flex flex-col justify-between">
              <div>
                <div className="text-[10px] uppercase text-[#69736D] font-bold mb-3">
                  INFERENCE EXECUTION TELEMETRY
                </div>
                {benchmarkResult ? (
                  <div className="space-y-3">
                    <div className="grid grid-cols-3 gap-2">
                      <div className="bg-white p-2 border border-[#DCD7CB]">
                        <span className="text-[9px] text-[#69736D] block">LATENCY</span>
                        <span className="font-bold text-[#183B2B] text-sm">{benchmarkResult.latencyMs} ms</span>
                      </div>
                      <div className="bg-white p-2 border border-[#DCD7CB]">
                        <span className="text-[9px] text-[#69736D] block">THROUGHPUT</span>
                        <span className="font-bold text-[#15803D] text-sm">{benchmarkResult.tokensPerSec} tok/s</span>
                      </div>
                      <div className="bg-white p-2 border border-[#DCD7CB]">
                        <span className="text-[9px] text-[#69736D] block">VRAM USED</span>
                        <span className="font-bold text-[#17201D] text-sm">{benchmarkResult.vramUsedGb} GB</span>
                      </div>
                    </div>
                    <div className="bg-white p-3 border border-[#DCD7CB] text-[11px] leading-relaxed text-[#17201D]">
                      <span className="text-[#15803D] font-bold block mb-1">✓ INFERENCE COMPLETE:</span>
                      {benchmarkResult.output}
                    </div>
                  </div>
                ) : (
                  <div className="h-32 flex items-center justify-center text-[#69736D] text-xs">
                    {isRunningBenchmark ? 'Benchmarking kernels...' : 'Awaiting benchmark trigger...'}
                  </div>
                )}
              </div>

              <div className="border-t border-[#DCD7CB] pt-2 text-[10px] text-[#69736D] flex justify-between">
                <span>FP16 TensorRT Acceleration</span>
                <span>Deterministic Seed: 42</span>
              </div>
            </div>
          </form>
        </div>
      </div>
    </Shell>
  );
}
