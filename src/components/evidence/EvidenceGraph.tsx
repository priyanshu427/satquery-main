import { useState } from 'react';
import { Network, Database, ShieldCheck, Target, Sparkles, ChevronRight, Activity } from 'lucide-react';
import { EVIDENCE_GRAPH_NODES, EVIDENCE_GRAPH_EDGES } from '@/lib/mockData';

export function EvidenceGraph() {
  const [selectedNodeId, setSelectedNodeId] = useState<string>('node-verifier');

  const selectedNode =
    EVIDENCE_GRAPH_NODES.find((n) => n.id === selectedNodeId) ?? EVIDENCE_GRAPH_NODES[0];

  return (
    <div className="grid gap-6 xl:grid-cols-[1fr_360px]">
      {/* Visual DAG Graph Canvas */}
      <div className="relative min-h-[580px] overflow-hidden rounded-2xl border border-slate-800 bg-[#07111F] p-6 shadow-2xl">
        {/* Background Grid */}
        <div className="orbit-grid pointer-events-none absolute inset-0 opacity-40" />

        {/* SVG Edges */}
        <svg className="absolute inset-0 h-full w-full pointer-events-none">
          <defs>
            <linearGradient id="edge-grad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#2563EB" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#06B6D4" stopOpacity="0.8" />
            </linearGradient>
          </defs>
          {EVIDENCE_GRAPH_EDGES.map((edge, i) => {
            const fromNode = EVIDENCE_GRAPH_NODES.find((n) => n.id === edge.from);
            const toNode = EVIDENCE_GRAPH_NODES.find((n) => n.id === edge.to);
            if (!fromNode || !toNode) return null;

            return (
              <g key={i}>
                <line
                  x1={`${fromNode.x}%`}
                  y1={`${fromNode.y}%`}
                  x2={`${toNode.x}%`}
                  y2={`${toNode.y}%`}
                  stroke="url(#edge-grad)"
                  strokeWidth="2"
                  strokeDasharray="4 4"
                  className="animate-pulse"
                />
                <circle
                  cx={`${(fromNode.x + toNode.x) / 2}%`}
                  cy={`${(fromNode.y + toNode.y) / 2}%`}
                  r="3"
                  fill="#06B6D4"
                />
              </g>
            );
          })}
        </svg>

        {/* Graph Nodes */}
        {EVIDENCE_GRAPH_NODES.map((node) => {
          const isSelected = selectedNodeId === node.id;
          return (
            <button
              key={node.id}
              onClick={() => setSelectedNodeId(node.id)}
              style={{ left: `${node.x}%`, top: `${node.y}%` }}
              className={`absolute z-10 -translate-x-1/2 -translate-y-1/2 rounded-xl border p-3 text-left transition-all duration-300 backdrop-blur-md group ${
                isSelected
                  ? 'border-cyan-400 bg-[#0F2642] shadow-[0_0_24px_rgba(6,182,212,0.4)] ring-2 ring-cyan-400/40'
                  : 'border-slate-800 bg-[#0B192A]/90 hover:border-slate-700 hover:bg-[#0D2035]'
              }`}
              data-testid={`evidence-node-${node.id}`}
            >
              <div className="flex items-center gap-2">
                <span
                  className="flex h-7 w-7 items-center justify-center rounded-lg text-white"
                  style={{ backgroundColor: `${node.color}25`, color: node.color }}
                >
                  {node.kind === 'query' && <Sparkles size={14} />}
                  {node.kind === 'model' && <Activity size={14} />}
                  {node.kind === 'sensor' && <Database size={14} />}
                  {node.kind === 'feature' && <Network size={14} />}
                  {node.kind === 'decision' && <ShieldCheck size={14} />}
                  {node.kind === 'finding' && <Target size={14} />}
                </span>
                <div>
                  <div className="font-semibold text-xs text-slate-100 whitespace-nowrap">
                    {node.label}
                  </div>
                  <div className="font-mono text-[9px] text-slate-400">
                    {node.subtitle}
                  </div>
                </div>
              </div>
            </button>
          );
        })}

        {/* Graph Legend & Status */}
        <div className="absolute bottom-4 left-4 flex flex-wrap gap-4 font-mono text-[10px] text-slate-400">
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-[#38BDF8]" /> Input Query
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-[#06B6D4]" /> Sensor Scenes
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-[#16A34A]" /> Spectral / SAR Features
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-[#10B981]" /> Verification Gate
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-[#F59E0B]" /> Grounded Finding
          </span>
        </div>
      </div>

      {/* Node Details Inspection Drawer */}
      <div className="rounded-2xl border border-slate-800 bg-[#0B192A]/85 p-6 shadow-xl backdrop-blur-md">
        <div className="eyebrow text-cyan-400">PROVENANCE NODE INSPECTOR</div>
        <div className="mt-4 flex items-center gap-3 border-b border-slate-800/80 pb-4">
          <span
            className="flex h-12 w-12 items-center justify-center rounded-xl"
            style={{ backgroundColor: `${selectedNode.color}25`, color: selectedNode.color }}
          >
            <Network size={22} />
          </span>
          <div>
            <h3 className="font-display text-lg font-bold text-slate-100">
              {selectedNode.label}
            </h3>
            <span className="font-mono text-[10px] uppercase text-cyan-300">
              Type: {selectedNode.kind}
            </span>
          </div>
        </div>

        {/* Node Attribute Key-Value Table */}
        <div className="mt-5 space-y-3 text-xs">
          <div className="font-mono text-[10px] text-slate-500">NODE ATTRIBUTES</div>
          {Object.entries(selectedNode.details).map(([key, val]) => (
            <div
              key={key}
              className="flex flex-col gap-0.5 rounded-lg border border-slate-800/80 bg-slate-900/30 p-2.5"
            >
              <span className="font-mono text-[10px] text-slate-400 uppercase tracking-wider">
                {key.replace(/([A-Z])/g, ' $1')}
              </span>
              <span className="font-mono text-slate-200 break-words">
                {String(val)}
              </span>
            </div>
          ))}
        </div>

        {/* Corroboration Context */}
        <div className="mt-6 rounded-xl border border-cyan-400/30 bg-cyan-400/5 p-3.5">
          <div className="flex items-center gap-2 text-xs font-semibold text-cyan-300">
            <ShieldCheck size={14} /> Provenance Verified
          </div>
          <p className="mt-1 text-[11px] text-slate-400 leading-relaxed">
            Every step in this graph represents a cryptographically verifiable transformation from raw L2A pixel values to the final grounded claim.
          </p>
        </div>
      </div>
    </div>
  );
}
