import { useState } from 'react';
import { Link } from 'wouter';
import {
  AlertTriangle, Radio, ShieldCheck, Crosshair, ArrowRight,
  Database, RefreshCw, Layers, CheckCircle2, Download, CloudRain,
  MapPin, Check
} from 'lucide-react';
import { Shell, PageHeader, Panel, StatusPill } from '@/components/layout/Shell';
import { DISASTER_ZONES } from '@/lib/mockData';

export default function DisasterModePage() {
  const [selectedZoneId, setSelectedZoneId] = useState<string>('zone-1');
  const [isStaging, setIsStaging] = useState<boolean>(false);
  const [stagedResponse, setStagedResponse] = useState<string | null>(null);

  const currentZone = DISASTER_ZONES.find((z) => z.id === selectedZoneId) ?? DISASTER_ZONES[0];

  const handleStageResponse = () => {
    setIsStaging(true);
    setStagedResponse(null);
    setTimeout(() => {
      setIsStaging(false);
      setStagedResponse(
        `Disaster Response Plan Staged: Sentinel-1 C-SAR interferometric tasking locked for ${currentZone.location}. Debris & inundation vectors dispatched to National Disaster Response Force (NDRF).`
      );
    }, 750);
  };

  return (
    <Shell>
      <div className="mx-auto max-w-[1600px] px-4 py-8 lg:px-8">
        <PageHeader
          eyebrow="RAPID HAZARD TRIAGE"
          title="Disaster Operations & SAR Cloud Override"
          description="Emergency tasking console for monsoonal landslides, flash floods, and glacial hazards. When optical satellites are blinded by dense cloud decks (68%–92% obstruction), Disaster Mode automatically switches to all-weather Synthetic Aperture Radar."
          actions={
            <div className="flex items-center gap-3">
              <StatusPill tone="red">
                <AlertTriangle size={11} /> PRIORITY TRIAGE CHANNEL
              </StatusPill>
              <Link
                href="/analyze"
                className="font-mono-tech text-xs text-[#183B2B] hover:underline font-semibold"
              >
                Standard Workspace →
              </Link>
            </div>
          }
        />

        {/* 2-Column Emergency Triage Interface */}
        <div className="grid gap-8 lg:grid-cols-[380px_1fr]">
          {/* LEFT: Hazard Corridors Selector */}
          <div className="flex flex-col gap-4">
            <div className="border border-[#DCD7CB] bg-white p-5 rounded-[2px]">
              <div className="font-mono-tech text-[10px] uppercase text-[#69736D] font-bold mb-3 border-b border-[#DCD7CB] pb-2 flex justify-between items-center">
                <span>ACTIVE HAZARD ZONES / 03</span>
                <span className="text-[#B91C1C]">● LIVE FEED</span>
              </div>

              <div className="space-y-2.5">
                {DISASTER_ZONES.map((zone) => {
                  const isSelected = selectedZoneId === zone.id;
                  return (
                    <button
                      key={zone.id}
                      onClick={() => {
                        setSelectedZoneId(zone.id);
                        setStagedResponse(null);
                      }}
                      className={`w-full text-left p-3 border transition-colors rounded-[2px] ${
                        isSelected
                          ? 'border-[#B91C1C] bg-[#FEF2F2]'
                          : 'border-[#DCD7CB] bg-[#F3F1EA] hover:bg-[#ECE9E0]'
                      }`}
                      data-testid={`btn-disaster-zone-${zone.id}`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <span className="font-mono-tech text-[9px] uppercase tracking-wider text-[#B91C1C] font-bold block">
                            {zone.type}
                          </span>
                          <h4 className="font-bold text-sm text-[#17201D] mt-0.5">
                            {zone.name}
                          </h4>
                          <div className="font-mono-tech text-[10px] text-[#69736D] mt-1 flex items-center gap-1">
                            <MapPin size={10} />
                            <span>{zone.location}</span>
                          </div>
                        </div>
                        <StatusPill tone={zone.priority === 'Critical' ? 'red' : 'amber'}>
                          {zone.priority}
                        </StatusPill>
                      </div>

                      <div className="mt-2.5 pt-2 border-t border-[#DCD7CB]/60 flex justify-between font-mono-tech text-[10px] text-[#69736D]">
                        <span>AREA: {zone.affectedAreaKm2} km²</span>
                        <span className="font-bold text-[#17201D]">{zone.riskLevel}</span>
                      </div>
                    </button>
                  );
                })}
              </div>

              <button
                onClick={handleStageResponse}
                disabled={isStaging}
                className="mt-4 w-full bg-[#B91C1C] text-white py-2.5 font-mono-tech text-xs font-bold uppercase tracking-wider hover:bg-[#991B1B] transition-colors rounded-[2px] flex items-center justify-center gap-2"
                data-testid="btn-stage-response"
              >
                {isStaging ? (
                  <>
                    <RefreshCw size={13} className="animate-spin" />
                    CALCULATING RADAR COHERENCE...
                  </>
                ) : (
                  <>
                    <Crosshair size={13} />
                    STAGE RAPID RESPONSE PLAN
                  </>
                )}
              </button>
            </div>

            {/* Staged Confirmation Alert */}
            {stagedResponse && (
              <div className="border border-[#BBF7D0] bg-[#F0FDF4] p-4 font-mono-tech text-xs text-[#15803D] rounded-[2px]">
                <div className="flex items-center gap-2 font-bold mb-1">
                  <CheckCircle2 size={15} />
                  <span>TASKING DISPATCHED</span>
                </div>
                <p className="text-[11px] leading-relaxed text-[#166534]">
                  {stagedResponse}
                </p>
              </div>
            )}
          </div>

          {/* RIGHT: Hazard Assessment & Radar Override Telemetry */}
          <div className="flex flex-col gap-6">
            {/* Real Geographic Hazard Map Canvas */}
            <div className="border border-[#DCD7CB] bg-[#1E2421] relative overflow-hidden min-h-[420px] rounded-[2px] flex flex-col justify-between">
              {/* Radar Simulation Texture */}
              <div className="satellite-radar-sar absolute inset-0 opacity-80" />
              <div className="graticule-grid absolute inset-0 pointer-events-none opacity-30" />

              {/* Top Bar */}
              <div className="relative z-10 flex flex-wrap items-center justify-between gap-2 border-b border-white/20 bg-black/75 px-4 py-2 text-white font-mono-tech text-[10px] backdrop-blur-sm">
                <div>
                  <span className="font-bold text-[#FCA5A5]">{currentZone.name}</span>
                  <span> · {currentZone.location}</span>
                </div>
                <div className="text-amber-300 font-bold">
                  {currentZone.status}
                </div>
              </div>

              {/* Central Target Pulsar Crosshairs */}
              <div className="relative z-10 my-auto flex flex-col items-center justify-center p-6 text-center">
                <div className="h-44 w-72 border-2 border-dashed border-[#FCA5A5] bg-red-900/30 flex flex-col justify-between p-3 shadow-2xl backdrop-blur-xs">
                  <div className="flex justify-between font-mono-tech text-[9px] text-[#FCA5A5] bg-black/70 px-2 py-0.5">
                    <span>SECTOR TARGET</span>
                    <span>{currentZone.affectedAreaKm2} km²</span>
                  </div>
                  <div className="bg-black/75 text-white font-mono-tech text-xs font-bold py-1.5 px-3 mx-auto rounded-[2px] border border-red-500/50">
                    {currentZone.type}: {currentZone.riskLevel}
                  </div>
                  <div className="flex justify-between font-mono-tech text-[9px] text-white/80 bg-black/70 px-2 py-0.5">
                    <span>OPTICAL: {currentZone.opticalOcclusion}</span>
                    <span className="text-green-300 font-bold">SAR: 100% BYPASS</span>
                  </div>
                </div>
              </div>

              {/* Bottom Telemetry Strip */}
              <div className="relative z-10 grid grid-cols-2 sm:grid-cols-4 border-t border-white/20 bg-black/80 p-3 text-white font-mono-tech text-[10px] backdrop-blur-sm">
                <div>
                  <span className="text-slate-400 block text-[9px]">AFFECTED AREA</span>
                  <span className="font-bold text-sm">{currentZone.affectedAreaKm2} km²</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[9px]">CLOUD COVER</span>
                  <span className="font-bold text-sm text-amber-300">{currentZone.opticalOcclusion}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[9px]">SAR PENETRATION</span>
                  <span className="font-bold text-sm text-green-300">100% BYPASS</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[9px]">RISK STATUS</span>
                  <span className="font-bold text-sm text-red-400">{currentZone.riskLevel}</span>
                </div>
              </div>
            </div>

            {/* Structured Directives & Technical Overview */}
            <div className="grid gap-6 sm:grid-cols-2">
              <div className="border border-[#DCD7CB] bg-white p-5 rounded-[2px] font-mono-tech text-xs">
                <div className="font-bold text-[10px] uppercase text-[#69736D] mb-2">
                  C-BAND RADAR OVERRIDE SPECIFICATION
                </div>
                <p className="text-[#17201D] text-xs leading-relaxed font-sans">
                  Active Sentinel-1 C-SAR microwave frequency (5.405 GHz) pulses traverse dense monsoon precipitation without signal attenuation. Surface coherence differential mapping isolates mud/rock slides and flood extents even during severe rainstorms.
                </p>
              </div>

              <div className="border border-[#DCD7CB] bg-white p-5 rounded-[2px] font-mono-tech text-xs">
                <div className="font-bold text-[10px] uppercase text-[#69736D] mb-2">
                  PRIORITY RESPONSE DIRECTIVES
                </div>
                <ul className="space-y-1.5 text-xs text-[#17201D]">
                  {currentZone.priorityActions.map((act, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <span className="h-4 w-4 bg-[#F3F1EA] border border-[#DCD7CB] flex items-center justify-center font-bold text-[10px] text-[#183B2B]">
                        {i + 1}
                      </span>
                      <span>{act}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Shell>
  );
}
