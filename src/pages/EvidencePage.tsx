import { useState } from 'react';
import { Link } from 'wouter';
import {
  ChevronDown, ChevronUp, Download, CheckCircle2,
  ArrowRight, ShieldCheck, Database, Radio, Sparkles, Layers
} from 'lucide-react';
import { Shell, PageHeader, Panel, StatusPill } from '@/components/layout/Shell';

interface EvidenceStep {
  stage: string;
  stepNumber: string;
  title: string;
  summary: string;
  technicalDetails: { [key: string]: string | number };
  status: 'PASSED' | 'VERIFIED' | 'COMPLETED';
}

const EVIDENCE_CHAIN: EvidenceStep[] = [
  {
    stage: 'CLAIM',
    stepNumber: '01',
    title: 'Natural Language Inquiry & Parsed Claim',
    summary: 'User stated: "Investigate urban expansion around Noida between 2020 and 2026." The system asserts a net built-up land cover growth across Sector 137–168.',
    technicalDetails: {
      'Raw Query String': 'Investigate urban expansion around Noida between 2020 and 2026.',
      'Extracted Intent': 'TemporalChangeDetection',
      'Target Semantic Class': 'BuiltUp_Impervious_Concrete',
      'Target AOI Name': 'Noida_Sector_137_168',
      'Parsing AST Model': 'GeoVQA / Intent Parser v2.4.1 (Llama-3-Vision fine-tune)',
    },
    status: 'COMPLETED',
  },
  {
    stage: 'SOURCE IMAGE',
    stepNumber: '02',
    title: 'Raw Multi-Spectral Satellite Tile Ingestion',
    summary: 'Queried Copernicus STAC catalog and retrieved Level-2A bottom-of-atmosphere reflectance scenes with <5% cloud contamination.',
    technicalDetails: {
      'Target Scene ID': 'S2A_MSIL2A_20260218_T43RER',
      'Baseline Scene ID': 'S2B_MSIL2A_20200312_T43RER',
      'Constellation': 'ESA Copernicus Sentinel-2A / Sentinel-2B',
      'Acquisition Timestamps': '2020-03-12T05:38:21Z → 2026-02-18T05:40:11Z',
      'Spatial Resolution': '10m GSD (Bands 2, 3, 4, 8) · 20m GSD (Bands 11, 12)',
      'Cloud Cover %': '2.1% across target scene (Passed threshold <10%)',
    },
    status: 'VERIFIED',
  },
  {
    stage: 'MODEL OUTPUT',
    stepNumber: '03',
    title: 'Dense Bi-Temporal Change Detection Inference',
    summary: 'Siamese Vision Transformer calculated patch-level cross-attention divergence vectors to isolate genuine altered pixels from seasonal agricultural variance.',
    technicalDetails: {
      'Neural Architecture': 'ChangeFormer-v2 (Siamese Hierarchical ViT)',
      'Parameter Scale': '41M parameters (FP16 TensorRT)',
      'Softmax Confidence': '0.91 (High certainty of genuine surface transition)',
      'Cross-Attention Entropy': '0.14 nats (Sharply peaked decision boundary)',
      'Inference Execution Latency': '428 ms on NVIDIA L4 Tensor Core GPU',
    },
    status: 'COMPLETED',
  },
  {
    stage: 'SPECTRAL MEASUREMENT',
    stepNumber: '04',
    title: 'Multi-Spectral Index Radiometric Verification',
    summary: 'Extracted mathematical indices across Sentinel-2 bands: NDBI (built-up) rose sharply by +0.46 while NDVI (canopy) dropped from 0.48 to 0.21.',
    technicalDetails: {
      'NDVI Formula': '(Band 8 NIR - Band 4 Red) / (Band 8 NIR + Band 4 Red)',
      'NDVI Shift': '0.48 (Healthy Vegetation) → 0.21 (Sparse / Cleared Soil)',
      'NDBI Formula': '(Band 11 SWIR - Band 8 NIR) / (Band 11 SWIR + Band 8 NIR)',
      'NDBI Shift': '-0.14 (Non-built-up baseline) → +0.32 (Dense Concrete / Asphalt)',
      'Net Spectral Index Score': '0.94 / 1.00 (Extremely strong optical signal)',
    },
    status: 'VERIFIED',
  },
  {
    stage: 'SAR CORROBORATION',
    stepNumber: '05',
    title: 'Synthetic Aperture Radar (SAR) Microwave Cross-Check',
    summary: 'Ingested Sentinel-1 C-SAR radar backscatter to verify that the spectral shift corresponds to permanent vertical three-dimensional buildings rather than bare soil.',
    technicalDetails: {
      'Radar Acquisition ID': 'S1A_IW_GRDH_20260217_028491 (Interferometric Wide Swath)',
      'Frequency Band': 'C-Band (5.405 GHz microwave)',
      'Polarization Channels': 'VV (Single co-polarized) + VH (Cross-polarized)',
      'Backscatter Amplitude Delta': '+4.2 dB VV increase (Double-bounce dielectric corner reflection)',
      'False Positive Risk': '< 4% (Eliminated optical dry soil misclassification)',
      'Cloud Immunity': '100% Penetration through monsoonal / haze layers',
    },
    status: 'PASSED',
  },
  {
    stage: 'GEOSPATIAL VALIDATION',
    stepNumber: '06',
    title: 'Topological Footprint & Vector Bounding',
    summary: 'Rasters vectorized into EPSG:4326 polygon clusters. Bounded by administrative cadastre in Noida expressway corridor without polygon overlap.',
    technicalDetails: {
      'Coordinate Reference System': 'EPSG:4326 (WGS 84 Ellipsoid)',
      'Total Bounding Footprint': '84.6 km² Area of Interest',
      'Net Altered Cluster Area': '15.6 km² (Cluster A: 15.6 km², Cluster B: 8.2 km², Cluster C: 4.7 km²)',
      'Percentage Growth': '+18.4% Built-Up expansion inside target sector',
      'Cadastral Ground Truth': 'Consistent with Noida Master Plan 2031 commercial zoning',
    },
    status: 'VERIFIED',
  },
  {
    stage: 'VERIFICATION',
    stepNumber: '07',
    title: 'Responsible AI Decision Gate Evaluation',
    summary: 'Evaluated model confidence (0.91) against physical sensor reliability (0.78). Multi-sensor agreement satisfies the threshold for official qualification.',
    technicalDetails: {
      'Neural Softmax Certainty': '0.91 (High confidence)',
      'Physical Evidence Reliability': '0.78 (Cross-sensor agreement, minimal cloud penalty)',
      'Gate Ruleset Decision': 'QUALIFY (Safe for civil & municipal action)',
      'Hallucination Risk Check': 'PASSED (Zero unsupported claims)',
      'Operator Review Protocol': 'Authorized for official briefing dispatch',
    },
    status: 'PASSED',
  },
  {
    stage: 'CONCLUSION',
    stepNumber: '08',
    title: 'Grounded Actionable Intelligence Statement',
    summary: 'Finding A is qualified with 91% model certainty and 78% physical multi-sensor corroboration: 15.6 km² of permanent built-up urban expansion verified between 2020 and 2026.',
    technicalDetails: {
      'Final Classification': 'Built-Up Expansion Confirmed (Multi-Story Structures)',
      'Confidence Seal': 'SATQUERY-VERIF-AUDIT-2026-0017',
      'Exportable Formats': 'RFC 7946 GeoJSON, CSV Metrics Table, Executive PDF Brief',
    },
    status: 'PASSED',
  },
];

export default function EvidencePage() {
  const [expandedSteps, setExpandedSteps] = useState<Record<string, boolean>>({
    CLAIM: true,
    'SPECTRAL MEASUREMENT': true,
    'SAR CORROBORATION': true,
    VERIFICATION: true,
    CONCLUSION: true,
  });

  const toggleStep = (stage: string) => {
    setExpandedSteps((prev) => ({ ...prev, [stage]: !prev[stage] }));
  };

  const expandAll = () => {
    const all: Record<string, boolean> = {};
    EVIDENCE_CHAIN.forEach((s) => (all[s.stage] = true));
    setExpandedSteps(all);
  };

  const collapseAll = () => {
    setExpandedSteps({});
  };

  return (
    <Shell>
      <div className="mx-auto max-w-[1200px] px-4 py-8 lg:px-8">
        <PageHeader
          eyebrow="HOW SATQUERY WORKS"
          title="Analysis Evidence & Steps"
          description="A transparent step-by-step record from your question to the verified findings. Click any step to inspect supporting optical, radar, and ground data."
          actions={
            <div className="flex items-center gap-3">
              <button
                onClick={expandAll}
                className="font-mono-tech text-xs text-[#183B2B] font-semibold hover:underline"
              >
                Expand All
              </button>
              <span className="text-[#DCD7CB]">·</span>
              <button
                onClick={collapseAll}
                className="font-mono-tech text-xs text-[#69736D] hover:underline"
              >
                Collapse All
              </button>
              <Link
                href="/verification"
                className="inline-flex items-center gap-1.5 bg-[#183B2B] text-white px-3 py-1.5 font-mono-tech text-xs font-semibold hover:bg-[#122C20] rounded-[2px]"
              >
                Inspect Safety Gate <ArrowRight size={12} />
              </Link>
            </div>
          }
        />

        {/* =========================================================================
            VERTICAL EVIDENCE CHAIN:
            CLAIM ↓ SOURCE IMAGE ↓ MODEL OUTPUT ↓ SPECTRAL MEASUREMENT ↓
            SAR CORROBORATION ↓ GEOSPATIAL VALIDATION ↓ VERIFICATION ↓ CONCLUSION
            ========================================================================= */}
        <div className="relative border-l-2 border-[#183B2B] ml-4 sm:ml-8 pl-6 sm:pl-8 space-y-8 my-8">
          {EVIDENCE_CHAIN.map((step, idx) => {
            const isExpanded = !!expandedSteps[step.stage];
            return (
              <div key={step.stage} className="relative group">
                {/* Connecting Node on the Left Line */}
                <div className="absolute -left-[31px] sm:-left-[39px] top-1 flex h-6 w-6 items-center justify-center bg-[#183B2B] text-white font-mono-tech text-[10px] font-bold rounded-[2px] shadow-sm">
                  {step.stepNumber}
                </div>

                {/* Main Card Container */}
                <div className="border border-[#DCD7CB] bg-white rounded-[2px] p-5">
                  {/* Step Header */}
                  <div
                    onClick={() => toggleStep(step.stage)}
                    className="flex cursor-pointer items-start justify-between gap-4 select-none"
                  >
                    <div>
                      <div className="flex items-center gap-2 font-mono-tech text-[10px] uppercase text-[#69736D]">
                        <span className="font-bold text-[#183B2B]">{step.stage}</span>
                        <span>·</span>
                        <span>STAGE {step.stepNumber} / 08</span>
                      </div>
                      <h3 className="text-base font-bold text-[#17201D] mt-1">
                        {step.title}
                      </h3>
                      <p className="mt-1 text-xs text-[#69736D] leading-relaxed max-w-3xl">
                        {step.summary}
                      </p>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <StatusPill tone="green">
                        <CheckCircle2 size={11} /> {step.status}
                      </StatusPill>
                      <button className="text-[#69736D] hover:text-[#17201D]">
                        {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                      </button>
                    </div>
                  </div>

                  {/* Expandable Technical Specification Table */}
                  {isExpanded && (
                    <div className="mt-4 border-t border-[#DCD7CB] pt-4 font-mono-tech text-xs">
                      <div className="text-[10px] uppercase text-[#69736D] mb-2 font-bold">
                        AUDIT SPECIFICATIONS & MATHEMATICAL PROOF
                      </div>
                      <div className="overflow-x-auto border border-[#DCD7CB]">
                        <table className="gis-table">
                          <tbody>
                            {Object.entries(step.technicalDetails).map(([key, val]) => (
                              <tr key={key}>
                                <td className="w-1/3 font-semibold text-[#17201D] bg-[#F3F1EA]/60">
                                  {key}
                                </td>
                                <td className="text-[#17201D]">
                                  {val}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </div>

                {/* Connecting Down Arrow between stages */}
                {idx < EVIDENCE_CHAIN.length - 1 && (
                  <div className="flex justify-center -my-3 font-mono-tech text-sm text-[#183B2B] font-bold select-none">
                    ↓
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Audit Sign-Off Box */}
        <div className="border border-[#DCD7CB] bg-[#ECE9E0] p-5 rounded-[2px] mt-12 flex flex-col sm:flex-row sm:items-center justify-between gap-4 font-mono-tech text-xs">
          <div>
            <span className="font-bold text-[#17201D] block">CRYPTOGRAPHIC INTEGRITY: PASSED</span>
            <span className="text-[#69736D]">All 8 stages validated against Copernicus ESA and ISRO benchmark guidelines.</span>
          </div>
          <Link
            href="/reports"
            className="inline-flex items-center gap-2 bg-[#183B2B] text-white px-4 py-2 font-bold hover:bg-[#122C20] rounded-[2px]"
          >
            Export Signed Mission Dossier <ArrowRight size={13} />
          </Link>
        </div>
      </div>
    </Shell>
  );
}
