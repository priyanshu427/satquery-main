import { useState } from 'react';
import { Link } from 'wouter';
import {
  FileText, Download, Printer, ArrowDownToLine, Eye, X,
  ShieldCheck, MapPin, Calendar, HelpCircle, CheckCircle2,
  ChevronDown, ChevronUp, ArrowRight, FileCheck, Layers
} from 'lucide-react';
import { Shell, PageHeader, Panel, StatusPill } from '@/components/layout/Shell';
import { downloadGeoJSON, downloadCSV, printExecutiveReport } from '@/lib/exportUtils';
import { SCENARIOS } from '@/lib/mockData';

interface AnalysisReport {
  id: string;
  location: string;
  question: string;
  result: string;
  date: string;
  changedArea: string;
  confidence: number;
  verification: 'Passed' | 'Review';
  sensor: string;
  scenarioKey: 'noida' | 'wayanad';
  opticalEvidence: string;
  sarEvidence: string;
}

const INITIAL_REPORTS: AnalysisReport[] = [
  {
    id: 'RPT-2026-001',
    location: 'Noida, Uttar Pradesh',
    question: 'Has the built-up area increased between 2020 and 2026?',
    result: 'YES — Built-up area increased by 18.4%',
    date: '19 Feb 2026',
    changedArea: '15.6 km²',
    confidence: 94,
    verification: 'Passed',
    sensor: 'Sentinel-2 + Sentinel-1 SAR',
    scenarioKey: 'noida',
    opticalEvidence: 'Strong — Visible concrete and road surface expansion',
    sarEvidence: 'Supporting — Persistent radar double-bounce from 3D structures',
  },
  {
    id: 'RPT-2024-042',
    location: 'Wayanad, Kerala',
    question: 'Did heavy rainfall trigger debris flows or slope failure?',
    result: 'YES — Debris flow detected along 6.4 km² river corridor',
    date: '01 Aug 2024',
    changedArea: '6.4 km²',
    confidence: 96,
    verification: 'Passed',
    sensor: 'Sentinel-1 SAR Radar + Sentinel-2',
    scenarioKey: 'wayanad',
    opticalEvidence: 'Moderate — Cloud occlusion mitigated by post-event optical',
    sarEvidence: 'Strong — Severe radar coherence loss confirming mud flow',
  },
  {
    id: 'RPT-2024-089',
    location: 'Kaziranga, Assam',
    question: 'What is the extent of flood inundation in the wildlife reserve?',
    result: 'CRITICAL — Inundation affected 342.0 km² along Brahmaputra',
    date: '19 Aug 2024',
    changedArea: '342.0 km²',
    confidence: 98,
    verification: 'Passed',
    sensor: 'Sentinel-1 C-SAR Dual-Pol',
    scenarioKey: 'noida',
    opticalEvidence: 'Cloud blocked — SAR radar penetration applied',
    sarEvidence: 'Strong — Mirror-like specular water backscatter drop',
  },
  {
    id: 'RPT-2026-104',
    location: 'Chamoli, Uttarakhand',
    question: 'Is there visible glacial retreat or slope movement in Rishiganga?',
    result: 'CONFIRMED — Glacial melt & slope creep identified over 18.5 km²',
    date: '16 Feb 2026',
    changedArea: '18.5 km²',
    confidence: 89,
    verification: 'Review',
    sensor: 'Sentinel-2 MSI + Landsat-8',
    scenarioKey: 'noida',
    opticalEvidence: 'Supporting — Ice edge retreat measured across 6 years',
    sarEvidence: 'Review — High terrain shadow in deep alpine gorges',
  },
];

export default function ReportsPage() {
  const [reports, setReports] = useState<AnalysisReport[]>(INITIAL_REPORTS);
  const [activeReportModal, setActiveReportModal] = useState<AnalysisReport | null>(null);
  const [downloadStatus, setDownloadStatus] = useState<string | null>(null);
  const [showTechnicalInModal, setShowTechnicalInModal] = useState<boolean>(false);

  const handleExport = (type: 'geojson' | 'csv' | 'print', report: AnalysisReport) => {
    setDownloadStatus(type);
    const scenario = SCENARIOS[report.scenarioKey] ?? SCENARIOS.noida;
    if (type === 'geojson') downloadGeoJSON(scenario);
    if (type === 'csv') downloadCSV(scenario);
    if (type === 'print') printExecutiveReport();
    setTimeout(() => setDownloadStatus(null), 2500);
  };

  return (
    <Shell>
      <div className="mx-auto max-w-[1600px] px-4 py-8 lg:px-8">
        {/* HEADER: Title "Analysis Reports" */}
        <PageHeader
          eyebrow="INTELLIGENCE ARCHIVE"
          title="Analysis Reports"
          description="Clear summaries of your satellite analyses, ready to review, share, or download as official executive briefs."
          actions={
            <Link
              href="/analyze"
              className="inline-flex items-center gap-2 bg-[#183B2B] text-white px-4 py-2 font-mono-tech text-xs font-semibold hover:bg-[#122C20] transition-colors rounded-[2px] shadow-sm"
            >
              + New Analysis
            </Link>
          }
        />

        {/* =========================================================================
            REPORTS LIST: USER-FRIENDLY CARDS / ROWS
            Each report clearly shows: Location, Question, Result, Date
            Buttons: View Report, Download PDF
            ========================================================================= */}
        {reports.length > 0 ? (
          <div className="space-y-4">
            {reports.map((rpt) => (
              <div
                key={rpt.id}
                className="border border-[#DCD7CB] bg-white p-5 rounded-[2px] shadow-sm hover:border-[#183B2B] transition-colors flex flex-col md:flex-row md:items-center justify-between gap-5"
              >
                {/* Left details */}
                <div className="flex-1 min-w-0">
                  {/* Top row: Location & Date */}
                  <div className="flex flex-wrap items-center gap-3 font-mono-tech text-xs text-[#69736D] mb-1.5">
                    <span className="flex items-center gap-1 font-semibold text-[#17201D]">
                      <MapPin size={13} className="text-[#183B2B]" />
                      {rpt.location}
                    </span>
                    <span>·</span>
                    <span className="flex items-center gap-1">
                      <Calendar size={12} />
                      {rpt.date}
                    </span>
                    <span>·</span>
                    <span className="text-[11px] bg-[#F3F1EA] px-2 py-0.5 rounded-[2px] border border-[#DCD7CB]">
                      {rpt.id}
                    </span>
                  </div>

                  {/* Question */}
                  <div className="text-sm font-semibold text-[#17201D] flex items-start gap-2">
                    <HelpCircle size={15} className="text-[#69736D] shrink-0 mt-0.5" />
                    <span>"{rpt.question}"</span>
                  </div>

                  {/* Result */}
                  <div className="mt-2.5 flex flex-wrap items-center gap-3">
                    <span className="font-mono-tech text-xs font-bold text-[#183B2B] bg-[#E5EFE9] px-2.5 py-1 rounded-[2px] border border-[#C5DED0]">
                      {rpt.result}
                    </span>
                    <span className="font-mono-tech text-xs text-[#69736D]">
                      Area: <strong className="text-[#17201D]">{rpt.changedArea}</strong>
                    </span>
                    <span className="font-mono-tech text-xs text-[#69736D]">
                      Confidence: <strong className="text-[#17201D]">{rpt.confidence}%</strong>
                    </span>
                    <span className={`font-mono-tech text-[11px] px-2 py-0.5 rounded-[2px] ${
                      rpt.verification === 'Passed'
                        ? 'bg-[#F0FDF4] text-[#15803D] border border-[#BBF7D0]'
                        : 'bg-[#FEFCE8] text-[#A16207] border-[#FEF08A]'
                    }`}>
                      ✓ {rpt.verification}
                    </span>
                  </div>
                </div>

                {/* Right buttons: [ View Report ] [ Download PDF ] */}
                <div className="flex flex-wrap items-center gap-2 font-mono-tech text-xs shrink-0 pt-3 md:pt-0 border-t md:border-t-0 border-[#ECE9E0]">
                  <button
                    onClick={() => {
                      setActiveReportModal(rpt);
                      setShowTechnicalInModal(false);
                    }}
                    className="border border-[#DCD7CB] bg-[#F3F1EA] hover:bg-[#ECE9E0] text-[#17201D] px-3.5 py-2 rounded-[2px] font-semibold inline-flex items-center gap-1.5 transition-colors"
                    data-testid={`btn-view-${rpt.id}`}
                  >
                    <Eye size={13} />
                    View Report
                  </button>

                  <button
                    onClick={() => handleExport('print', rpt)}
                    className="bg-[#183B2B] text-white hover:bg-[#122C20] px-3.5 py-2 rounded-[2px] font-semibold inline-flex items-center gap-1.5 transition-colors shadow-sm"
                    data-testid={`btn-download-${rpt.id}`}
                  >
                    <Printer size={13} />
                    Download PDF
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* =========================================================================
              EMPTY STATE (Section 13 Requirement)
              "Ask a question about your satellite image."
              [ Start Analysis ]
              ========================================================================= */
          <div className="border border-[#DCD7CB] bg-white p-12 text-center rounded-[2px] shadow-sm">
            <div className="mx-auto w-14 h-14 bg-[#F3F1EA] rounded-full flex items-center justify-center text-[#183B2B] mb-4">
              <FileText size={26} />
            </div>
            <h3 className="font-sans font-bold text-xl text-[#17201D]">
              No reports yet.
            </h3>
            <p className="text-xs text-[#69736D] max-w-sm mx-auto mt-1 mb-6">
              Ask a question about your satellite image to generate your first analysis report.
            </p>
            <Link
              href="/analyze"
              className="bg-[#183B2B] text-white px-5 py-2.5 font-mono-tech text-xs font-semibold hover:bg-[#122C20] transition-colors rounded-[2px] shadow-sm inline-flex items-center gap-2"
              data-testid="btn-empty-start-analysis"
            >
              Start Analysis
              <ArrowRight size={13} />
            </Link>
          </div>
        )}

        {/* =========================================================================
            VIEW REPORT MODAL / DRAWER
            ========================================================================= */}
        {activeReportModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
            <div className="w-full max-w-2xl border border-[#DCD7CB] bg-white p-6 rounded-[2px] shadow-2xl max-h-[90vh] overflow-y-auto">
              {/* Modal Header */}
              <div className="flex items-start justify-between border-b border-[#DCD7CB] pb-4">
                <div>
                  <div className="font-mono-tech text-[10px] uppercase text-[#69736D] flex items-center gap-2">
                    <span>EXECUTIVE ANALYSIS DOSSIER</span>
                    <span>·</span>
                    <span className="font-bold text-[#183B2B]">{activeReportModal.id}</span>
                  </div>
                  <h3 className="font-sans font-bold text-xl text-[#17201D] mt-1">
                    {activeReportModal.location}
                  </h3>
                  <div className="font-mono-tech text-xs text-[#69736D] mt-0.5">
                    Analyzed on {activeReportModal.date} · Sensor: {activeReportModal.sensor}
                  </div>
                </div>
                <button
                  onClick={() => setActiveReportModal(null)}
                  className="p-1 text-[#69736D] hover:text-[#17201D]"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Core Findings */}
              <div className="mt-5 space-y-4">
                {/* Question & Answer Box */}
                <div className="border border-[#DCD7CB] bg-[#F3F1EA] p-4 rounded-[2px]">
                  <span className="font-mono-tech text-[10px] uppercase text-[#69736D] block font-semibold">
                    QUESTION ASKED
                  </span>
                  <p className="font-sans font-semibold text-sm text-[#17201D] mt-1">
                    "{activeReportModal.question}"
                  </p>

                  <div className="mt-3 pt-3 border-t border-[#DCD7CB]">
                    <span className="font-mono-tech text-[10px] uppercase text-[#69736D] block font-semibold">
                      VERIFIED RESULT
                    </span>
                    <p className="font-sans font-bold text-base text-[#183B2B] mt-0.5">
                      {activeReportModal.result}
                    </p>
                  </div>
                </div>

                {/* Evidence Metrics Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono-tech text-xs">
                  <div className="border border-[#DCD7CB] p-3 rounded-[2px] bg-white">
                    <span className="text-[10px] text-[#69736D] uppercase block">CHANGED AREA</span>
                    <span className="font-bold text-base text-[#17201D] mt-1 block">
                      {activeReportModal.changedArea}
                    </span>
                  </div>
                  <div className="border border-[#DCD7CB] p-3 rounded-[2px] bg-white">
                    <span className="text-[10px] text-[#69736D] uppercase block">CONFIDENCE</span>
                    <span className="font-bold text-base text-[#183B2B] mt-1 block">
                      {activeReportModal.confidence}%
                    </span>
                  </div>
                  <div className="border border-[#DCD7CB] p-3 rounded-[2px] bg-white">
                    <span className="text-[10px] text-[#69736D] uppercase block">VERIFICATION</span>
                    <span className="font-bold text-base text-[#15803D] mt-1 block">
                      ✓ {activeReportModal.verification}
                    </span>
                  </div>
                  <div className="border border-[#DCD7CB] p-3 rounded-[2px] bg-white">
                    <span className="text-[10px] text-[#69736D] uppercase block">RADAR COHERENCE</span>
                    <span className="font-bold text-base text-[#C25E2E] mt-1 block">
                      +4.2 dB
                    </span>
                  </div>
                </div>

                {/* Evidence Checklist */}
                <div className="border border-[#DCD7CB] p-4 rounded-[2px] bg-white font-mono-tech text-xs">
                  <span className="text-[10px] uppercase text-[#69736D] font-bold block mb-2">
                    SUPPORTING EVIDENCE
                  </span>
                  <div className="space-y-2">
                    <div className="flex items-start gap-2 text-[#17201D]">
                      <CheckCircle2 size={14} className="text-[#15803D] shrink-0 mt-0.5" />
                      <div>
                        <strong>Optical Imagery:</strong> {activeReportModal.opticalEvidence}
                      </div>
                    </div>
                    <div className="flex items-start gap-2 text-[#17201D]">
                      <CheckCircle2 size={14} className="text-[#15803D] shrink-0 mt-0.5" />
                      <div>
                        <strong>SAR Radar:</strong> {activeReportModal.sarEvidence}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Expandable Technical Details */}
                <div className="border border-[#DCD7CB] rounded-[2px] p-3 bg-[#F3F1EA]">
                  <button
                    onClick={() => setShowTechnicalInModal(!showTechnicalInModal)}
                    className="w-full flex items-center justify-between font-mono-tech text-xs font-semibold text-[#183B2B]"
                  >
                    <span>▼ Technical details & spectral indices</span>
                    {showTechnicalInModal ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                  </button>

                  {showTechnicalInModal && (
                    <div className="mt-3 pt-3 border-t border-[#DCD7CB] font-mono-tech text-xs space-y-1.5 text-[#17201D]">
                      <div className="flex justify-between">
                        <span className="text-[#69736D]">Model Pipeline:</span>
                        <span className="font-bold">ChangeNet v2 (Siamese Transformer)</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[#69736D]">Coordinate System (CRS):</span>
                        <span className="font-bold">EPSG:4326 (WGS 84)</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[#69736D]">NDBI Index Shift:</span>
                        <span className="font-bold text-[#C25E2E]">+0.46 (Built-Up Shift)</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[#69736D]">SAR Amplitude Delta:</span>
                        <span className="font-bold text-[#183B2B]">+4.2 dB VV</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[#69736D]">Ground Validation Status:</span>
                        <span className="font-bold text-[#15803D]">Zero false-positive flags</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Modal Actions */}
              <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-[#DCD7CB] pt-4 font-mono-tech text-xs">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleExport('geojson', activeReportModal)}
                    className="border border-[#DCD7CB] bg-[#F3F1EA] hover:bg-[#ECE9E0] px-3 py-1.5 rounded-[2px] text-[#17201D]"
                  >
                    Export GeoJSON
                  </button>
                  <button
                    onClick={() => handleExport('csv', activeReportModal)}
                    className="border border-[#DCD7CB] bg-[#F3F1EA] hover:bg-[#ECE9E0] px-3 py-1.5 rounded-[2px] text-[#17201D]"
                  >
                    Export CSV
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleExport('print', activeReportModal)}
                    className="bg-[#183B2B] text-white hover:bg-[#122C20] px-4 py-1.5 font-semibold rounded-[2px] inline-flex items-center gap-1.5 shadow-sm"
                  >
                    <Printer size={13} />
                    Download PDF
                  </button>
                  <button
                    onClick={() => setActiveReportModal(null)}
                    className="border border-[#DCD7CB] px-3.5 py-1.5 text-[#69736D] hover:bg-[#F3F1EA] rounded-[2px]"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </Shell>
  );
}

