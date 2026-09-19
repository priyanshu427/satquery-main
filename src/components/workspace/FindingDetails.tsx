import { Link } from 'wouter';
import {
  ShieldCheck, AlertTriangle, ArrowRight, Eye, Network,
  BarChart3, CheckCircle2, ChevronRight, HelpCircle
} from 'lucide-react';
import { ScenarioFinding } from '@/lib/mockData';

interface FindingDetailsProps {
  findings: ScenarioFinding[];
  selectedId: string | null;
  onSelectFinding: (id: string) => void;
}

export function FindingDetails({
  findings,
  selectedId,
  onSelectFinding,
}: FindingDetailsProps) {
  const current = findings.find((f) => f.id === selectedId) ?? findings[0];

  if (!current) return null;

  return (
    <div className="flex flex-col gap-4">
      {/* Findings Quick Selector */}
      <div className="rounded-2xl border border-slate-800 bg-[#0B192A]/85 p-4 shadow-xl backdrop-blur-md">
        <div className="flex items-center justify-between border-b border-slate-800/80 pb-2.5">
          <div className="eyebrow text-cyan-400">DETECTED GROUNDED FINDINGS</div>
          <span className="font-mono text-[10px] text-slate-500">{findings.length} CLUSTERS</span>
        </div>

        <div className="mt-3 space-y-1.5">
          {findings.map((finding) => {
            const isSelected = (selectedId ?? findings[0].id) === finding.id;
            return (
              <button
                key={finding.id}
                onClick={() => onSelectFinding(finding.id)}
                className={`flex w-full items-center justify-between rounded-xl border p-2.5 text-left transition-all ${
                  isSelected
                    ? 'border-cyan-400/50 bg-cyan-400/10 text-cyan-200 shadow-[0_0_12px_rgba(6,182,212,0.15)]'
                    : 'border-slate-800/80 bg-slate-900/40 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                }`}
                data-testid={`button-finding-select-${finding.id}`}
              >
                <div className="flex items-center gap-2.5">
                  <span
                    className={`flex h-6 w-6 items-center justify-center rounded-lg font-mono text-xs font-bold ${
                      isSelected
                        ? 'bg-cyan-300 text-[#07111F]'
                        : 'bg-slate-800 text-slate-300'
                    }`}
                  >
                    {finding.id}
                  </span>
                  <div className="flex flex-col">
                    <span className="text-xs font-medium text-slate-100">{finding.label}</span>
                    <span className="font-mono text-[10px] text-slate-500">
                      {finding.changedAreaKm2} km² ({finding.changePercent > 0 ? `+${finding.changePercent}%` : `${finding.changePercent}%`})
                    </span>
                  </div>
                </div>
                <ChevronRight size={14} className={isSelected ? 'text-cyan-300' : 'text-slate-600'} />
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Finding Inspection Card */}
      <div className="rounded-2xl border border-slate-800 bg-[#0B192A]/85 p-5 shadow-xl backdrop-blur-md">
        {/* Finding Heading & Status */}
        <div className="flex items-start justify-between gap-3 border-b border-slate-800/80 pb-3">
          <div>
            <div className="eyebrow text-slate-400">FINDING {current.id} / INSPECTION</div>
            <h2 className="mt-1 font-display text-lg font-semibold text-slate-100">
              {current.label}
            </h2>
          </div>
          <span
            className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 font-mono text-[10px] font-semibold ${
              current.verificationStatus === 'QUALIFY'
                ? 'border-green-500/40 bg-green-500/10 text-green-300 shadow-[0_0_8px_rgba(22,163,74,0.2)]'
                : 'border-amber-500/40 bg-amber-500/10 text-amber-300 shadow-[0_0_8px_rgba(217,119,6,0.2)]'
            }`}
          >
            <CheckCircle2 size={11} /> {current.verificationStatus}
          </span>
        </div>

        {/* Primary Metrics Grid */}
        <div className="mt-4 grid grid-cols-2 gap-2.5">
          <div className="rounded-xl border border-slate-800/80 bg-slate-900/40 p-3">
            <div className="font-mono text-[10px] text-slate-500">CHANGED AREA</div>
            <div className="mt-1 font-display text-xl font-bold text-slate-100">
              {current.changedAreaKm2} <span className="text-xs font-normal text-slate-400">km²</span>
            </div>
          </div>
          <div className="rounded-xl border border-slate-800/80 bg-slate-900/40 p-3">
            <div className="font-mono text-[10px] text-slate-500">CHANGE DELTA</div>
            <div
              className={`mt-1 font-display text-xl font-bold ${
                current.changePercent > 0 ? 'text-amber-400' : 'text-rose-400'
              }`}
            >
              {current.changePercent > 0 ? `+${current.changePercent}%` : `${current.changePercent}%`}
            </div>
          </div>
        </div>

        {/* Explicit Decoupling: Model Confidence vs Evidence Reliability */}
        <div className="mt-4 rounded-xl border border-slate-800 bg-[#07111F]/70 p-3.5 space-y-3">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-1.5 text-slate-400">
              <span>Model Confidence</span>
              <span title="Neural network internal prediction score" className="cursor-help text-slate-600">
                <HelpCircle size={11} />
              </span>
            </div>
            <span className="font-mono font-semibold text-blue-300">
              {(current.modelConfidence * 100).toFixed(0)}%
            </span>
          </div>
          <div className="h-1.5 w-full rounded-full bg-slate-800 overflow-hidden">
            <div
              className="h-full rounded-full bg-blue-500 transition-all duration-500"
              style={{ width: `${current.modelConfidence * 100}%` }}
            />
          </div>

          <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-800/60">
            <div className="flex items-center gap-1.5 text-slate-400">
              <span>Evidence Reliability</span>
              <span title="Ground truth sensor agreement & cloud coverage penalty" className="cursor-help text-slate-600">
                <HelpCircle size={11} />
              </span>
            </div>
            <span className="font-mono font-semibold text-green-300">
              {(current.reliability * 100).toFixed(0)}%
            </span>
          </div>
          <div className="h-1.5 w-full rounded-full bg-slate-800 overflow-hidden">
            <div
              className="h-full rounded-full bg-green-500 transition-all duration-500"
              style={{ width: `${current.reliability * 100}%` }}
            />
          </div>
          <p className="text-[10px] text-slate-500 italic">
            *Decoupled: Model certainty is checked against raw multi-sensor agreement before qualification.
          </p>
        </div>

        {/* Multi-Sensor Evidence Breakdown */}
        <div className="mt-4 space-y-2 border-t border-slate-800/80 pt-3">
          <div className="text-[10px] font-mono text-slate-500">SENSOR CORROBORATION</div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="rounded-lg border border-slate-800/80 bg-slate-900/30 p-2.5">
              <div className="text-[10px] text-cyan-400 font-mono">OPTICAL S-2</div>
              <div className="mt-1 font-mono text-sm text-slate-200">
                {current.opticalEvidence.toFixed(2)} / 1.00
              </div>
              <div className="text-[9px] text-slate-500 mt-0.5">Spectral Shift Validated</div>
            </div>
            <div className="rounded-lg border border-slate-800/80 bg-slate-900/30 p-2.5">
              <div className="text-[10px] text-blue-400 font-mono">RADAR S-1 SAR</div>
              <div className="mt-1 font-mono text-sm text-slate-200">
                {current.sarEvidence.toFixed(2)} / 1.00
              </div>
              <div className="text-[9px] text-slate-500 mt-0.5">Structural Reflection +{current.spectralIndices.sarDbDelta} dB</div>
            </div>
          </div>
        </div>

        {/* Scientific Rationale */}
        <div className="mt-3.5 rounded-xl border border-slate-800/60 bg-slate-900/20 p-3">
          <div className="font-mono text-[10px] text-slate-500">VERIFIED RATIONALE</div>
          <p className="mt-1 text-xs leading-relaxed text-slate-300">
            {current.rationale}
          </p>
        </div>

        {/* Navigation Actions */}
        <div className="mt-4 flex gap-2 pt-2">
          <Link
            href="/evidence"
            className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-lg border border-cyan-400/30 bg-cyan-400/10 py-2 text-xs font-semibold text-cyan-300 hover:bg-cyan-400/20 transition-colors"
          >
            <Network size={13} /> Evidence Graph
          </Link>
          <Link
            href="/compare"
            className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800/60 py-2 text-xs font-semibold text-slate-300 hover:bg-slate-700/60 transition-colors"
          >
            Compare View <ArrowRight size={13} />
          </Link>
        </div>
      </div>
    </div>
  );
}
