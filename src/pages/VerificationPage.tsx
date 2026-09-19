import { useState } from 'react';
import { Link } from 'wouter';
import {
  ShieldCheck, AlertTriangle, CircleHelp, BadgeCheck, CheckCircle2,
  SlidersHorizontal, FileCheck, Check, Copy, CheckCheck, ArrowRight
} from 'lucide-react';
import { Shell, PageHeader, Panel, StatusPill } from '@/components/layout/Shell';

export default function VerificationPage() {
  const [modelConfidence, setModelConfidence] = useState<number>(91);
  const [opticalAgreement, setOpticalAgreement] = useState<number>(94);
  const [sarAgreement, setSarAgreement] = useState<number>(82);
  const [cloudPenalty, setCloudPenalty] = useState<number>(5);

  const calculatedReliability = Math.max(
    10,
    Math.min(
      99,
      Math.round(
        (opticalAgreement * 0.45 + sarAgreement * 0.55) - (cloudPenalty * 0.8)
      )
    )
  );

  const getDecisionState = () => {
    if (modelConfidence >= 75 && calculatedReliability >= 70) return 'QUALIFY';
    if (modelConfidence >= 65 && calculatedReliability < 70) return 'WARN';
    return 'ABSTAIN';
  };

  const decision = getDecisionState();

  const [reviewerName, setReviewerName] = useState('Senior Remote Sensing Analyst');
  const [reviewerOrg, setReviewerOrg] = useState('ISRO Disaster Management Support Division');
  const [signOffStatus, setSignOffStatus] = useState<string | null>(null);
  const [copiedToken, setCopiedToken] = useState(false);

  const handleSignOff = (e: React.FormEvent) => {
    e.preventDefault();
    const token = `SATQUERY-VERIF-${Math.random().toString(36).substring(2, 10).toUpperCase()}-2026`;
    setSignOffStatus(token);
  };

  return (
    <Shell>
      <div className="mx-auto max-w-[1400px] px-4 py-8 lg:px-8">
        <PageHeader
          eyebrow="QUALITY & RELIABILITY CHECKS"
          title="Verification & Evidence Quality"
          description="How SatQuery ensures findings are trustworthy by checking multiple satellite sensors before confirming land changes."
          actions={
            <StatusPill tone={decision === 'QUALIFY' ? 'green' : decision === 'WARN' ? 'amber' : 'red'}>
              Verification: {decision === 'QUALIFY' ? 'Passed' : decision === 'WARN' ? 'Review Needed' : 'Inconclusive'}
            </StatusPill>
          }
        />

        {/* DECISION GATE HERO SUMMARY */}
        <div className="border border-[#DCD7CB] bg-white p-6 rounded-[2px] mb-8">
          <div className="grid gap-8 lg:grid-cols-[1fr_1.3fr] items-center">
            <div>
              <div className="flex items-center gap-3">
                <span className={`inline-flex px-2 py-1 font-mono-tech text-xs font-bold uppercase rounded-[2px] ${
                  decision === 'QUALIFY' ? 'bg-[#E5EFE9] text-[#15803D] border border-[#15803D]/30' : decision === 'WARN' ? 'bg-[#FFF7ED] text-[#C25E2E] border border-[#C25E2E]/30' : 'bg-[#FEF2F2] text-[#B91C1C] border border-[#B91C1C]/30'
                }`}>
                  {decision === 'QUALIFY' ? 'GATE STATUS: PASSED (QUALIFY)' : decision === 'WARN' ? 'GATE STATUS: CAUTION (WARN)' : 'GATE STATUS: REJECTED (ABSTAIN)'}
                </span>
              </div>

              <h2 className="text-2xl font-bold text-[#17201D] mt-3">
                {decision === 'QUALIFY' && 'Safe to Qualify for Municipal Action'}
                {decision === 'WARN' && 'Proceed with Photo-Interpreter Review'}
                {decision === 'ABSTAIN' && 'Abstain: Insufficient Physical Corroboration'}
              </h2>

              <p className="mt-2 text-xs leading-relaxed text-[#69736D]">
                {decision === 'QUALIFY' &&
                  'High optical NDBI index shift corroborated by Sentinel-1 C-SAR radar backscatter rise (+4.2 dB). Low cloud contamination (2.1%). Multi-sensor corroboration satisfies all civilian spatial audit standards.'}
                {decision === 'WARN' &&
                  'Model confidence is high, but either cloud cover degrades the optical scene or SAR radar backscatter fails to confirm a vertical 3D structure. Manual photo-interpretation is mandatory.'}
                {decision === 'ABSTAIN' &&
                  'Insufficient signal-to-noise ratio or conflicting sensor telemetry. To prevent erroneous urban planning or false alerts, the system refrains from raising a claim.'}
              </p>
            </div>

            {/* Metrics Comparison Bars */}
            <div className="border border-[#DCD7CB] bg-[#F3F1EA] p-5 rounded-[2px] space-y-4 font-mono-tech text-xs">
              <div>
                <div className="flex justify-between mb-1.5">
                  <span className="text-[#17201D] font-medium">NEURAL CLASSIFIER CONFIDENCE:</span>
                  <span className="font-bold text-[#183B2B]">{modelConfidence}%</span>
                </div>
                <div className="h-2 bg-[#DCD7CB] rounded-[1px] overflow-hidden">
                  <div className="h-full bg-[#183B2B]" style={{ width: `${modelConfidence}%` }} />
                </div>
                <span className="text-[10px] text-[#69736D] mt-1 block">Softmax certainty from ChangeFormer-v2 vision transformer</span>
              </div>

              <div>
                <div className="flex justify-between mb-1.5">
                  <span className="text-[#17201D] font-medium">EVIDENCE RELIABILITY (SENSORS):</span>
                  <span className={`font-bold ${calculatedReliability >= 70 ? 'text-[#15803D]' : 'text-[#C25E2E]'}`}>
                    {calculatedReliability}%
                  </span>
                </div>
                <div className="h-2 bg-[#DCD7CB] rounded-[1px] overflow-hidden">
                  <div
                    className={`h-full ${calculatedReliability >= 70 ? 'bg-[#15803D]' : 'bg-[#C25E2E]'}`}
                    style={{ width: `${calculatedReliability}%` }}
                  />
                </div>
                <span className="text-[10px] text-[#69736D] mt-1 block">
                  Weighted fusion of Sentinel-2 spectral indices, Sentinel-1 radar backscatter, and cloud mask
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* 2-COLUMN SIMULATOR & SIGN-OFF */}
        <div className="grid gap-8 lg:grid-cols-2">
          {/* Stress Simulator */}
          <div className="border border-[#DCD7CB] bg-white p-6 rounded-[2px]">
            <div className="font-mono-tech text-[10px] uppercase text-[#69736D] font-bold mb-1">
              DECISION GATE STRESS SIMULATOR
            </div>
            <h3 className="text-base font-bold text-[#17201D]">
              Evaluate Sensor Edge Cases
            </h3>
            <p className="text-xs text-[#69736D] mt-1 mb-5">
              Adjust sliders to simulate dense monsoonal clouds or divergent radar readings.
            </p>

            <div className="space-y-4 font-mono-tech text-xs">
              <div>
                <div className="flex justify-between mb-1">
                  <span>Model Certainty:</span>
                  <span className="font-bold text-[#183B2B]">{modelConfidence}%</span>
                </div>
                <input
                  type="range"
                  min="30"
                  max="99"
                  value={modelConfidence}
                  onChange={(e) => setModelConfidence(Number(e.target.value))}
                  className="w-full h-1 accent-[#183B2B]"
                />
              </div>

              <div>
                <div className="flex justify-between mb-1">
                  <span>Optical Sentinel-2 Agreement:</span>
                  <span className="font-bold text-[#183B2B]">{opticalAgreement}%</span>
                </div>
                <input
                  type="range"
                  min="20"
                  max="100"
                  value={opticalAgreement}
                  onChange={(e) => setOpticalAgreement(Number(e.target.value))}
                  className="w-full h-1 accent-[#183B2B]"
                />
              </div>

              <div>
                <div className="flex justify-between mb-1">
                  <span>SAR Sentinel-1 Radar Agreement:</span>
                  <span className="font-bold text-[#183B2B]">{sarAgreement}%</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="100"
                  value={sarAgreement}
                  onChange={(e) => setSarAgreement(Number(e.target.value))}
                  className="w-full h-1 accent-[#183B2B]"
                />
              </div>

              <div>
                <div className="flex justify-between mb-1">
                  <span>Cloud Cover Penalty:</span>
                  <span className="font-bold text-[#C25E2E]">{cloudPenalty}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="50"
                  value={cloudPenalty}
                  onChange={(e) => setCloudPenalty(Number(e.target.value))}
                  className="w-full h-1 accent-[#C25E2E]"
                />
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-[#DCD7CB] flex justify-end">
              <button
                onClick={() => {
                  setModelConfidence(91);
                  setOpticalAgreement(94);
                  setSarAgreement(82);
                  setCloudPenalty(5);
                }}
                className="font-mono-tech text-[11px] text-[#69736D] hover:text-[#17201D]"
              >
                Reset Noida Baseline
              </button>
            </div>
          </div>

          {/* Official Sign-Off Form */}
          <div className="border border-[#DCD7CB] bg-white p-6 rounded-[2px]">
            <div className="font-mono-tech text-[10px] uppercase text-[#69736D] font-bold mb-1">
              OFFICIAL MISSION SIGN-OFF
            </div>
            <h3 className="text-base font-bold text-[#17201D]">
              Authorize Verification Certificate
            </h3>
            <p className="text-xs text-[#69736D] mt-1 mb-5">
              Record human analyst sign-off to issue a tamper-evident audit token.
            </p>

            <form onSubmit={handleSignOff} className="space-y-4 font-mono-tech text-xs">
              <div>
                <label className="text-[10px] text-[#69736D] block mb-1">ANALYST CREDENTIALS / NAME:</label>
                <input
                  type="text"
                  value={reviewerName}
                  onChange={(e) => setReviewerName(e.target.value)}
                  className="w-full border border-[#DCD7CB] bg-[#F3F1EA] p-2 text-[#17201D] focus:border-[#183B2B] focus:outline-none rounded-[2px]"
                  required
                />
              </div>

              <div>
                <label className="text-[10px] text-[#69736D] block mb-1">AUTHORIZING AGENCY / MISSION BODY:</label>
                <input
                  type="text"
                  value={reviewerOrg}
                  onChange={(e) => setReviewerOrg(e.target.value)}
                  className="w-full border border-[#DCD7CB] bg-[#F3F1EA] p-2 text-[#17201D] focus:border-[#183B2B] focus:outline-none rounded-[2px]"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full bg-[#183B2B] text-white py-2.5 font-bold uppercase tracking-wider hover:bg-[#122C20] transition-colors rounded-[2px]"
                data-testid="btn-authorize-finding"
              >
                Authorize & Issue Certificate Token
              </button>
            </form>

            {signOffStatus && (
              <div className="mt-5 border border-[#BBF7D0] bg-[#F0FDF4] p-3 rounded-[2px] font-mono-tech text-xs">
                <div className="flex items-center justify-between text-[#15803D] font-bold">
                  <span>CERTIFICATE ISSUED ✓</span>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(signOffStatus);
                      setCopiedToken(true);
                      setTimeout(() => setCopiedToken(false), 2000);
                    }}
                    className="text-[#15803D] hover:underline"
                  >
                    {copiedToken ? 'Copied' : 'Copy'}
                  </button>
                </div>
                <div className="mt-1.5 p-2 bg-white border border-[#BBF7D0] text-[10px] text-[#17201D] break-all">
                  {signOffStatus}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Shell>
  );
}
