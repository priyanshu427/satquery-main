import { useState } from 'react';
import { Sparkles, Zap, RotateCcw, Database, Layers, CheckCircle2, Loader2, ArrowRight } from 'lucide-react';
import { SCENARIOS } from '@/lib/mockData';

interface QueryPanelProps {
  currentScenarioId: string;
  onSelectScenario: (id: string) => void;
  onExecuteQuery: (queryText: string) => void;
  isExecuting: boolean;
}

export function QueryPanel({
  currentScenarioId,
  onSelectScenario,
  onExecuteQuery,
  isExecuting,
}: QueryPanelProps) {
  const scenario = SCENARIOS[currentScenarioId] ?? SCENARIOS.noida;
  const [queryInput, setQueryInput] = useState(scenario.query);

  const handleScenarioChange = (id: string) => {
    onSelectScenario(id);
    setQueryInput(SCENARIOS[id]?.query ?? '');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!queryInput.trim() || isExecuting) return;
    onExecuteQuery(queryInput);
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Investigation Input Card */}
      <div className="rounded-2xl border border-slate-800 bg-[#0B192A]/85 p-5 shadow-xl backdrop-blur-md">
        <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
          <div className="eyebrow flex items-center gap-1.5 text-cyan-400">
            <Sparkles size={13} />
            <span>NATURAL LANGUAGE QUERY</span>
          </div>
          <span className="font-mono text-[9px] text-slate-500">LLM + GEOSPATIAL PARSER</span>
        </div>

        {/* Quick Scenario Chips */}
        <div className="mt-3.5 flex flex-wrap gap-1.5">
          <span className="text-[10px] text-slate-500 font-mono self-center mr-1">Presets:</span>
          <button
            type="button"
            onClick={() => handleScenarioChange('noida')}
            className={`rounded-lg px-2.5 py-1 text-[11px] font-mono transition-colors ${
              currentScenarioId === 'noida'
                ? 'bg-blue-600/30 text-cyan-300 border border-cyan-400/40'
                : 'bg-slate-800/60 text-slate-400 hover:text-slate-200'
            }`}
            data-testid="button-preset-noida"
          >
            Noida Urban 2020–2026
          </button>
          <button
            type="button"
            onClick={() => handleScenarioChange('wayanad')}
            className={`rounded-lg px-2.5 py-1 text-[11px] font-mono transition-colors ${
              currentScenarioId === 'wayanad'
                ? 'bg-red-600/30 text-red-300 border border-red-400/40'
                : 'bg-slate-800/60 text-slate-400 hover:text-slate-200'
            }`}
            data-testid="button-preset-wayanad"
          >
            Wayanad Landslide 2024
          </button>
        </div>

        {/* Query Input Box */}
        <form onSubmit={handleSubmit} className="mt-3">
          <textarea
            value={queryInput}
            onChange={(e) => setQueryInput(e.target.value)}
            disabled={isExecuting}
            placeholder="Ask a question about an Earth region, change event, or temporal span..."
            rows={3}
            className="w-full resize-none rounded-xl border border-slate-700/80 bg-[#07111F] p-3 text-xs leading-relaxed text-slate-100 placeholder:text-slate-600 focus:border-cyan-400/80 focus:outline-none focus:ring-1 focus:ring-cyan-400/40"
            data-testid="input-investigation-query"
          />

          <button
            type="submit"
            disabled={isExecuting || !queryInput.trim()}
            className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 px-4 py-2.5 font-display text-xs font-semibold text-white shadow-lg shadow-blue-950/50 transition-all hover:from-blue-500 hover:to-cyan-500 disabled:opacity-50"
            data-testid="button-execute-query"
          >
            {isExecuting ? (
              <>
                <Loader2 size={14} className="animate-spin text-cyan-200" />
                <span>Executing Agent Reasoning Chain...</span>
              </>
            ) : (
              <>
                <Zap size={14} className="text-cyan-300" />
                <span>Execute Investigation</span>
                <ArrowRight size={13} className="ml-auto" />
              </>
            )}
          </button>
        </form>

        {/* Pre-Execution Plan Breakdown */}
        <div className="mt-5 border-t border-slate-800/80 pt-4">
          <div className="mb-2.5 flex items-center justify-between">
            <span className="eyebrow text-slate-400">PRE-EXECUTION PLAN</span>
            <span className="flex items-center gap-1 font-mono text-[9px] text-green-400">
              <CheckCircle2 size={11} /> STAGED & VERIFIED
            </span>
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex items-start justify-between gap-2 border-b border-slate-800/50 pb-1.5">
              <span className="font-mono text-[10px] text-slate-500">Intent:</span>
              <span className="font-medium text-slate-200 text-right">{scenario.intent}</span>
            </div>
            <div className="flex items-start justify-between gap-2 border-b border-slate-800/50 pb-1.5">
              <span className="font-mono text-[10px] text-slate-500">AOI:</span>
              <span className="font-medium text-slate-200 text-right">
                {scenario.region} ({scenario.coordinates.aoiAreaKm2} km²)
              </span>
            </div>
            <div className="flex items-start justify-between gap-2 border-b border-slate-800/50 pb-1.5">
              <span className="font-mono text-[10px] text-slate-500">Time Range:</span>
              <span className="font-mono text-cyan-300 text-right">{scenario.timeRange}</span>
            </div>
            <div className="flex items-start justify-between gap-2 border-b border-slate-800/50 pb-1.5">
              <span className="font-mono text-[10px] text-slate-500">Required Models:</span>
              <span className="text-[11px] text-slate-300 text-right">
                {scenario.requiredModels.join(' · ')}
              </span>
            </div>
            <div className="flex items-start justify-between gap-2">
              <span className="font-mono text-[10px] text-slate-500">Evidence Required:</span>
              <span className="text-[11px] text-slate-300 text-right">
                Optical S2 + Radar S1 Pair + Provenance DAG
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
