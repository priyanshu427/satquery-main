import { CheckCircle2, Clock, Cpu, ArrowRight } from 'lucide-react';
import { AgentTraceStep } from '@/lib/mockData';

interface AgentTraceProps {
  steps: AgentTraceStep[];
  isComplete: boolean;
}

export function AgentTrace({ steps, isComplete }: AgentTraceProps) {
  const totalLatency = steps.reduce((sum, s) => sum + s.latencyMs, 0);

  return (
    <div className="rounded-2xl border border-slate-800 bg-[#0B192A]/85 p-5 shadow-xl backdrop-blur-md">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
        <div className="eyebrow flex items-center gap-1.5 text-cyan-400">
          <Cpu size={13} />
          <span>AGENT TRACE</span>
        </div>
        <div className="flex items-center gap-2 font-mono text-[10px]">
          <span className="text-slate-500">Latency: {totalLatency}ms</span>
          <span className="rounded bg-green-500/15 text-green-300 px-2 py-0.5 border border-green-500/30">
            {isComplete ? 'VERIFIED' : 'RUNNING'}
          </span>
        </div>
      </div>

      {/* Sequential Agent Reasoning Chain (No Fake Percentages!) */}
      <div className="mt-4 relative space-y-0">
        {/* Connecting Vertical Line */}
        <div className="absolute left-[11px] top-3 bottom-3 w-px bg-gradient-to-b from-blue-500 via-cyan-400 to-green-400 opacity-30" />

        {steps.map((step, idx) => {
          return (
            <div key={step.id} className="relative flex items-start gap-3 pb-3.5 last:pb-0 group">
              {/* Step Status Node */}
              <div className="relative z-10 mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-cyan-400/40 bg-[#07111F] text-cyan-300 shadow-[0_0_8px_rgba(6,182,212,0.2)]">
                <CheckCircle2 size={13} className="text-green-400" />
              </div>

              {/* Step Details */}
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-baseline justify-between gap-1">
                  <span className="font-semibold text-xs text-slate-200">
                    {step.title}
                  </span>
                  <span className="font-mono text-[10px] text-slate-500">
                    {step.latencyMs}ms
                  </span>
                </div>

                <p className="mt-0.5 text-[11px] text-slate-400 leading-normal">
                  {step.description}
                </p>

                {/* Model and Output Snippet Pill */}
                <div className="mt-1.5 flex flex-wrap items-center gap-1.5 font-mono text-[9px]">
                  <span className="rounded bg-slate-800/80 px-2 py-0.5 text-cyan-300 border border-slate-700/60">
                    {step.modelOrService}
                  </span>
                  <span className="text-slate-500 truncate max-w-[200px]" title={step.outputSnippet}>
                    {step.outputSnippet}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
