export interface ScenarioFinding {
  id: string;
  label: string;
  category: 'urban' | 'vegetation' | 'infrastructure' | 'water' | 'hazard';
  geometry: {
    type: 'polygon' | 'bbox';
    x: number; // percentage in scene 0-100
    y: number;
    width: number;
    height: number;
    points?: [number, number][];
  };
  changedAreaKm2: number;
  changePercent: number;
  modelConfidence: number; // 0-1 (neural classifier certainty)
  reliability: number;     // 0-1 (sensor agreement & coverage quality)
  opticalEvidence: number; // Sentinel-2 spectral score
  sarEvidence: number;     // Sentinel-1 backscatter agreement
  verificationStatus: 'QUALIFY' | 'WARN' | 'ABSTAIN';
  rationale: string;
  spectralIndices: {
    ndviBefore: number;
    ndviAfter: number;
    ndbiBefore: number;
    ndbiAfter: number;
    sarDbDelta: number;
  };
}

export interface SatelliteScene {
  id: string;
  sensor: 'Sentinel-2 MSI' | 'Sentinel-1 C-SAR' | 'Landsat-8 OLI' | 'Cartosat-3';
  modality: 'Optical' | 'SAR' | 'Multi-spectral';
  date: string;
  cloudCover: number; // percentage
  resolutionM: number;
  orbitPass: string;
  bands: string[];
  status: 'VALIDATED' | 'READY' | 'ARCHIVED';
}

export interface AgentTraceStep {
  id: string;
  title: string;
  description: string;
  modelOrService: string;
  latencyMs: number;
  status: 'completed' | 'in_progress' | 'pending';
  outputSnippet: string;
}

export interface InvestigationScenario {
  id: string;
  title: string;
  region: string;
  coordinates: {
    lat: number;
    lng: number;
    epsg: string;
    aoiAreaKm2: number;
  };
  query: string;
  intent: string;
  timeRange: string;
  requiredModels: string[];
  findings: ScenarioFinding[];
  scenes: SatelliteScene[];
  traceSteps: AgentTraceStep[];
  timeMachineEpochs: {
    year: number;
    date: string;
    description: string;
    urbanKm2: number;
    ndviAvg: number;
    sarDbAvg: number;
    cloudCover: number;
    resolution: string;
    badge: 'baseline' | 'signal' | 'corroboration' | 'current';
  }[];
}

export const SCENARIOS: Record<string, InvestigationScenario> = {
  noida: {
    id: 'noida',
    title: 'Urban Expansion around Noida Expressway',
    region: 'Noida, Uttar Pradesh, India',
    coordinates: {
      lat: 28.5355,
      lng: 77.3910,
      epsg: 'EPSG:4326',
      aoiAreaKm2: 84.6,
    },
    query: 'Investigate urban expansion around Noida between 2020 and 2026.',
    intent: 'Temporal Change Detection & Spatial Grounding',
    timeRange: 'March 2020 — February 2026',
    requiredModels: ['GeoVQA / Intent Parser', 'Prithvi-100M EO', 'ChangeFormer-v2', 'SAR-Guide Structural Net'],
    findings: [
      {
        id: 'A',
        label: 'Built-up expansion detected',
        category: 'urban',
        geometry: {
          type: 'polygon',
          x: 48,
          y: 43,
          width: 22,
          height: 18,
          points: [[42, 38], [62, 36], [68, 52], [54, 58], [40, 50]],
        },
        changedAreaKm2: 15.6,
        changePercent: 18.4,
        modelConfidence: 0.91,
        reliability: 0.78,
        opticalEvidence: 0.94,
        sarEvidence: 0.82,
        verificationStatus: 'QUALIFY',
        rationale: 'High optical NDBI increase corroborated by Sentinel-1 VV backscatter rise (+4.2 dB), confirming genuine permanent multi-story construction.',
        spectralIndices: {
          ndviBefore: 0.48,
          ndviAfter: 0.21,
          ndbiBefore: -0.14,
          ndbiAfter: 0.32,
          sarDbDelta: 4.2,
        },
      },
      {
        id: 'B',
        label: 'Agricultural & canopy loss',
        category: 'vegetation',
        geometry: {
          type: 'polygon',
          x: 32,
          y: 60,
          width: 18,
          height: 14,
          points: [[28, 55], [42, 54], [45, 68], [30, 71]],
        },
        changedAreaKm2: 8.2,
        changePercent: -12.1,
        modelConfidence: 0.89,
        reliability: 0.84,
        opticalEvidence: 0.92,
        sarEvidence: 0.79,
        verificationStatus: 'QUALIFY',
        rationale: 'Pronounced NDVI decline from 0.58 to 0.19 across riparian arable parcels adjacent to Yamuna floodplain.',
        spectralIndices: {
          ndviBefore: 0.58,
          ndviAfter: 0.19,
          ndbiBefore: -0.22,
          ndbiAfter: 0.08,
          sarDbDelta: 1.8,
        },
      },
      {
        id: 'C',
        label: 'New arterial transport corridor',
        category: 'infrastructure',
        geometry: {
          type: 'polygon',
          x: 65,
          y: 35,
          width: 20,
          height: 24,
          points: [[60, 28], [78, 32], [76, 56], [58, 52]],
        },
        changedAreaKm2: 4.7,
        changePercent: 26.5,
        modelConfidence: 0.86,
        reliability: 0.72,
        opticalEvidence: 0.88,
        sarEvidence: 0.76,
        verificationStatus: 'QUALIFY',
        rationale: 'Linear concrete reflection detected along Sector 150 link road with high cross-polarized VH radar consistency.',
        spectralIndices: {
          ndviBefore: 0.42,
          ndviAfter: 0.12,
          ndbiBefore: -0.05,
          ndbiAfter: 0.41,
          sarDbDelta: 3.6,
        },
      },
    ],
    scenes: [
      {
        id: 'S2A_MSIL2A_20260218_T43RER',
        sensor: 'Sentinel-2 MSI',
        modality: 'Optical',
        date: '2026-02-18',
        cloudCover: 2.1,
        resolutionM: 10,
        orbitPass: 'R097 Descending',
        bands: ['B02 (Blue)', 'B03 (Green)', 'B04 (Red)', 'B08 (NIR)', 'B11 (SWIR)'],
        status: 'VALIDATED',
      },
      {
        id: 'S1A_IW_GRDH_20260217_028491',
        sensor: 'Sentinel-1 C-SAR',
        modality: 'SAR',
        date: '2026-02-17',
        cloudCover: 0.0,
        resolutionM: 20,
        orbitPass: 'Ascending Track 14',
        bands: ['VV (Single)', 'VH (Cross-pol)'],
        status: 'VALIDATED',
      },
      {
        id: 'S2B_MSIL2A_20200312_T43RER',
        sensor: 'Sentinel-2 MSI',
        modality: 'Optical',
        date: '2020-03-12',
        cloudCover: 4.8,
        resolutionM: 10,
        orbitPass: 'R097 Descending',
        bands: ['B02', 'B03', 'B04', 'B08', 'B11'],
        status: 'VALIDATED',
      },
      {
        id: 'LC08_L2SP_146040_20180325',
        sensor: 'Landsat-8 OLI',
        modality: 'Multi-spectral',
        date: '2018-03-25',
        cloudCover: 1.2,
        resolutionM: 30,
        orbitPass: 'Path 146 Row 40',
        bands: ['B2', 'B3', 'B4', 'B5', 'B6', 'B7'],
        status: 'ARCHIVED',
      },
    ],
    traceSteps: [
      {
        id: 'step-1',
        title: 'Query interpretation',
        description: 'Parsed natural language question into geospatial AST with temporal bounding constraints.',
        modelOrService: 'GeoVQA / Intent Parser',
        latencyMs: 184,
        status: 'completed',
        outputSnippet: 'Intent: ChangeDetection; Target: BuiltUp; Temporal: 2020-2026; AOI: Noida_NCR',
      },
      {
        id: 'step-2',
        title: 'AOI resolution',
        description: 'Resolved to administrative polygon EPSG:4326 (84.6 km² bounding box).',
        modelOrService: 'Nominatim & ISRO Bhuvan Gazeteer',
        latencyMs: 92,
        status: 'completed',
        outputSnippet: 'BBox: [28.4812, 77.3401, 28.5898, 77.4419]; Grid tiles: T43RER',
      },
      {
        id: 'step-3',
        title: 'Dataset validation',
        description: 'Verified 4 candidate scenes for low cloud contamination (<10%) and band completeness.',
        modelOrService: 'STAC Catalog Validator',
        latencyMs: 312,
        status: 'completed',
        outputSnippet: 'Validated S2A (2.1% cloud) & S1A GRD (0% cloud) bi-temporal pair',
      },
      {
        id: 'step-4',
        title: 'Change detection',
        description: 'Computed dense bi-temporal difference vector using Siamese vision transformer.',
        modelOrService: 'ChangeFormer-v2',
        latencyMs: 428,
        status: 'completed',
        outputSnippet: 'Cluster density peak: +18.4% altered area (15.6 km² verified)',
      },
      {
        id: 'step-5',
        title: 'Spectral analysis',
        description: 'Extracted NDVI, NDWI, and NDBI indices across Sentinel-2 bands B04, B08, B11.',
        modelOrService: 'SpectralNet EO',
        latencyMs: 236,
        status: 'completed',
        outputSnippet: 'NDBI +0.46 shift in Sectors 142–168; NDVI drop -0.39 in farmland',
      },
      {
        id: 'step-6',
        title: 'SAR corroboration',
        description: 'Cross-checked with Sentinel-1 C-band radar backscatter to verify structural presence.',
        modelOrService: 'SAR-Guide Structural Net',
        latencyMs: 382,
        status: 'completed',
        outputSnippet: 'VV amplitude +4.2 dB corroboration; eliminated false positive bare soil',
      },
      {
        id: 'step-7',
        title: 'Verification',
        description: 'Responsible decision gate evaluated multi-sensor agreement and cloud penalties.',
        modelOrService: 'Responsible Evidence Verifier',
        latencyMs: 112,
        status: 'completed',
        outputSnippet: 'Gate Decision: QUALIFY (Confidence: 0.91, Reliability: 0.78)',
      },
    ],
    timeMachineEpochs: [
      {
        year: 2018,
        date: '2018-03-25',
        description: 'Low-density peri-urban agricultural fringe with sparse rural roads.',
        urbanKm2: 24.1,
        ndviAvg: 0.52,
        sarDbAvg: -14.2,
        cloudCover: 1.2,
        resolution: '30m (Landsat 8)',
        badge: 'baseline',
      },
      {
        year: 2020,
        date: '2020-03-12',
        description: 'Initial ground leveling and first high-density commercial clusters.',
        urbanKm2: 29.4,
        ndviAvg: 0.46,
        sarDbAvg: -13.1,
        cloudCover: 4.8,
        resolution: '10m (Sentinel-2)',
        badge: 'baseline',
      },
      {
        year: 2022,
        date: '2022-04-08',
        description: 'Expressway grid construction, warehouse logistics hubs active.',
        urbanKm2: 36.8,
        ndviAvg: 0.38,
        sarDbAvg: -11.6,
        cloudCover: 3.2,
        resolution: '10m (Sentinel-2)',
        badge: 'signal',
      },
      {
        year: 2024,
        date: '2024-03-19',
        description: 'Residential sectors 137–150 completed, metro extension corridor.',
        urbanKm2: 41.2,
        ndviAvg: 0.31,
        sarDbAvg: -10.4,
        cloudCover: 2.9,
        resolution: '10m (Sentinel-2)',
        badge: 'signal',
      },
      {
        year: 2026,
        date: '2026-02-18',
        description: 'Dense commercial tech zones, high SAR backscatter and NDBI saturation.',
        urbanKm2: 45.0,
        ndviAvg: 0.24,
        sarDbAvg: -9.5,
        cloudCover: 2.1,
        resolution: '10m (Sentinel-2 + S1)',
        badge: 'current',
      },
    ],
  },
  wayanad: {
    id: 'wayanad',
    title: 'Wayanad Landslide Debris Flow Monitoring',
    region: 'Chooralmala / Meppadi, Kerala, India',
    coordinates: {
      lat: 11.5362,
      lng: 76.1325,
      epsg: 'EPSG:4326',
      aoiAreaKm2: 42.8,
    },
    query: 'Map landslide debris flow and severed infrastructure in Meppadi following monsoon downpours.',
    intent: 'Rapid Disaster Inundation & Slope Failure Mapping',
    timeRange: 'July 2024 — August 2024',
    requiredModels: ['GeoVQA Disaster Parser', 'SAR Flood & Debris Net', 'Prithvi-EO Landslide'],
    findings: [
      {
        id: 'A',
        label: 'Slope failure & debris scar',
        category: 'hazard',
        geometry: {
          type: 'polygon',
          x: 44,
          y: 40,
          width: 26,
          height: 32,
          points: [[45, 30], [58, 38], [54, 72], [42, 68], [38, 45]],
        },
        changedAreaKm2: 6.4,
        changePercent: 88.0,
        modelConfidence: 0.95,
        reliability: 0.86,
        opticalEvidence: 0.81,
        sarEvidence: 0.96,
        verificationStatus: 'QUALIFY',
        rationale: 'Radar coherence loss in steep terrain confirms complete topsoil stripping and boulder debris path down Iruvaipuzha river basin.',
        spectralIndices: {
          ndviBefore: 0.74,
          ndviAfter: 0.11,
          ndbiBefore: -0.35,
          ndbiAfter: 0.18,
          sarDbDelta: -6.8,
        },
      },
    ],
    scenes: [
      {
        id: 'S1A_IW_GRDH_20240731_WAYANAD',
        sensor: 'Sentinel-1 C-SAR',
        modality: 'SAR',
        date: '2024-07-31',
        cloudCover: 0.0,
        resolutionM: 20,
        orbitPass: 'Ascending Track 85',
        bands: ['VV', 'VH'],
        status: 'VALIDATED',
      },
      {
        id: 'S2A_MSIL2A_20240803_WAYANAD',
        sensor: 'Sentinel-2 MSI',
        modality: 'Optical',
        date: '2024-08-03',
        cloudCover: 34.2,
        resolutionM: 10,
        orbitPass: 'R019 Descending',
        bands: ['B02', 'B03', 'B04', 'B08'],
        status: 'VALIDATED',
      },
    ],
    traceSteps: [
      {
        id: 'step-1',
        title: 'Emergency Query Triage',
        description: 'Disaster mode activated for high slope instability.',
        modelOrService: 'GeoVQA Disaster Parser',
        latencyMs: 140,
        status: 'completed',
        outputSnippet: 'Priority: Emergency; Hazard: Landslide; AOI: Wayanad_Meppadi',
      },
      {
        id: 'step-2',
        title: 'Cloud Penetration Override',
        description: 'Optical imagery 34% occluded by monsoon cloud. Triggered SAR-primary processing.',
        modelOrService: 'Sensor Fusion Controller',
        latencyMs: 110,
        status: 'completed',
        outputSnippet: 'Activated Sentinel-1 C-band Synthetic Aperture Radar channel',
      },
      {
        id: 'step-3',
        title: 'Debris Flow Boundary Extraction',
        description: 'Coherence difference mapping isolated 6.4 km² debris track.',
        modelOrService: 'SAR Debris Segmentation Net',
        latencyMs: 410,
        status: 'completed',
        outputSnippet: 'Detected 4 bridges destroyed, 1.8 km road segment severed',
      },
    ],
    timeMachineEpochs: [
      {
        year: 2020,
        date: '2020-05-15',
        description: 'Stable tea plantations and natural Western Ghats forest cover.',
        urbanKm2: 3.1,
        ndviAvg: 0.78,
        sarDbAvg: -8.1,
        cloudCover: 8.5,
        resolution: '10m (Sentinel-2)',
        badge: 'baseline',
      },
      {
        year: 2024,
        date: '2024-08-01',
        description: 'Catastrophic debris flow scar visible across Punchirimattam and Chooralmala.',
        urbanKm2: 1.2,
        ndviAvg: 0.22,
        sarDbAvg: -14.9,
        cloudCover: 34.2,
        resolution: '20m (Sentinel-1 SAR)',
        badge: 'current',
      },
    ],
  },
};

export const MODEL_REGISTRY = [
  {
    id: 'geovqa-parser',
    name: 'GeoVQA / Geospatial Intent Parser',
    family: 'Multimodal Vision-Language',
    organization: 'SATQUERY AI & OpenEO',
    version: 'v2.4.1',
    status: 'Online',
    latencyMs: 184,
    gpuMemoryGb: 4.8,
    parameters: '7B (fine-tuned Llama-3-Vision)',
    modality: 'Natural Language + GeoJSON BBox',
    confidenceScore: 0.94,
    tone: 'blue' as const,
    description: 'Translates unstructured natural language inquiries into formal geospatial query abstract syntax trees (AST) with spatiotemporal constraints.',
  },
  {
    id: 'prithvi-100m',
    name: 'Prithvi-100M Foundation Model',
    family: 'Geospatial Foundation Model',
    organization: 'NASA / IBM Research',
    version: 'v1.5.0',
    status: 'Online',
    latencyMs: 310,
    gpuMemoryGb: 8.2,
    parameters: '100M parameters',
    modality: 'Harmonized Landsat-Sentinel (HLS)',
    confidenceScore: 0.92,
    tone: 'cyan' as const,
    description: 'Temporal Vision Transformer pre-trained on multi-spectral satellite tiles for land cover classification, burn scar, and flood mapping.',
  },
  {
    id: 'changeformer-v2',
    name: 'ChangeFormer-v2 Bi-Temporal',
    family: 'Dense Change Detection',
    organization: 'RemoteSensing Lab',
    version: 'v2.1.0',
    status: 'Online',
    latencyMs: 428,
    gpuMemoryGb: 6.4,
    parameters: '41M parameters',
    modality: 'Bi-temporal Optical Tile Pairs (T1, T2)',
    confidenceScore: 0.89,
    tone: 'cyan' as const,
    description: 'Siamese Transformer architecture calculating pixel-level and patch-level feature divergence between historical baseline and current epoch.',
  },
  {
    id: 'spectralnet-indices',
    name: 'SpectralNet Multi-Index Engine',
    family: 'Radiometric Computing',
    organization: 'SATQUERY AI Core',
    version: 'v3.2.0',
    status: 'Online',
    latencyMs: 145,
    gpuMemoryGb: 2.1,
    parameters: 'Algorithmic + GPU kernels',
    modality: 'Sentinel-2 B2, B3, B4, B8, B11, B12',
    confidenceScore: 0.96,
    tone: 'green' as const,
    description: 'High-throughput GPU raster calculation for NDVI, NDWI, NDBI, MNDWI, and Normalized Burn Ratio with cloud mask propagation.',
  },
  {
    id: 'sar-guide-radar',
    name: 'SAR-Guide Structural Corroborator',
    family: 'Radar Remote Sensing',
    organization: 'DLR / ISRO SAR Lab',
    version: 'v1.1.2',
    status: 'Online',
    latencyMs: 382,
    gpuMemoryGb: 5.5,
    parameters: '28M parameters',
    modality: 'Sentinel-1 C-Band SAR (VV, VH, Coherence)',
    confidenceScore: 0.84,
    tone: 'blue' as const,
    description: 'Interferometric radar coherence calculator validating that optical change signals correspond to physical three-dimensional structures.',
  },
  {
    id: 'responsible-verifier',
    name: 'Responsible Verification Gate',
    family: 'AI Safety & Metrology',
    organization: 'SATQUERY AI',
    version: 'v1.4.0',
    status: 'Online',
    latencyMs: 95,
    gpuMemoryGb: 1.2,
    parameters: 'Ruleset + Multi-Sensor Consistency Gate',
    modality: 'Model Outputs + Sensor Telemetry',
    confidenceScore: 0.98,
    tone: 'green' as const,
    description: 'Independent evaluation module enforcing QUALIFY, WARN, or ABSTAIN states. Prevents hallucination by requiring multi-sensor corroboration.',
  },
];

export const DISASTER_ZONES = [
  {
    id: 'zone-1',
    name: 'Wayanad Landslide Debris Corridor',
    location: 'Chooralmala, Wayanad, Kerala',
    type: 'Debris Flow / Landslide',
    priority: 'Critical' as const,
    reportedDate: '2024-07-30',
    affectedAreaKm2: 6.4,
    sarPenetrationRate: '100% cloud bypass',
    opticalOcclusion: '68% cloud cover',
    priorityActions: ['Identify blocked river bottlenecks', 'Trace severed bridge access points', 'Priority staging in Meppadi'],
    riskLevel: 'Emergency',
    status: 'Active Review',
  },
  {
    id: 'zone-2',
    name: 'Brahmaputra Flood Inundation',
    location: 'Kaziranga Riparian Zone, Assam',
    type: 'Monsoon River Inundation',
    priority: 'High' as const,
    reportedDate: '2024-08-14',
    affectedAreaKm2: 342.0,
    sarPenetrationRate: '100% cloud bypass',
    opticalOcclusion: '92% cloud cover',
    priorityActions: ['Flood extent delta mapping', 'Highway 715 submergence check', 'Wildlife highland shelter monitoring'],
    riskLevel: 'Severe',
    status: 'Active Triage',
  },
  {
    id: 'zone-3',
    name: 'Chamoli High-Altitude Glacier Monitoring',
    location: 'Rishiganga Valley, Uttarakhand',
    type: 'Glacial Outburst / Rockfall',
    priority: 'Watch' as const,
    reportedDate: '2026-02-14',
    affectedAreaKm2: 18.5,
    sarPenetrationRate: '100% cloud bypass',
    opticalOcclusion: '14% cloud cover',
    priorityActions: ['Slope stability radar interferometry', 'Thermal melt monitoring', 'Downstream barrage alert'],
    riskLevel: 'Moderate',
    status: 'Watch Standing',
  },
];

export const EVIDENCE_GRAPH_NODES = [
  {
    id: 'node-query',
    label: 'User Query',
    subtitle: '"Investigate urban expansion..."',
    kind: 'query',
    x: 10,
    y: 50,
    color: '#38BDF8',
    details: {
      source: 'User natural-language input',
      parsedAt: '2026-09-16T18:00:00Z',
      tokenCount: 9,
    },
  },
  {
    id: 'node-intent',
    label: 'Intent Parser',
    subtitle: 'GeoVQA AST',
    kind: 'model',
    x: 26,
    y: 50,
    color: '#2563EB',
    details: {
      model: 'GeoVQA / Intent Parser v2.4.1',
      confidence: 0.94,
      intent: 'TemporalChangeDetection',
      aoi: 'Noida_Sector_137_168',
    },
  },
  {
    id: 'node-opt-scene',
    label: 'Sentinel-2 L2A',
    subtitle: 'Optical 10m Multi-spectral',
    kind: 'sensor',
    x: 44,
    y: 25,
    color: '#06B6D4',
    details: {
      sceneId: 'S2A_MSIL2A_20260218_T43RER',
      bands: 'B2, B3, B4, B8, B11',
      cloudCover: '2.1%',
      sunAzimuth: '142.4°',
    },
  },
  {
    id: 'node-sar-scene',
    label: 'Sentinel-1 C-SAR',
    subtitle: 'Radar 20m VV/VH Backscatter',
    kind: 'sensor',
    x: 44,
    y: 75,
    color: '#3B82F6',
    details: {
      sceneId: 'S1A_IW_GRDH_20260217_028491',
      polarization: 'VV + VH dual-pol',
      orbit: 'Descending Track 14',
      cloudIndependent: true,
    },
  },
  {
    id: 'node-ndvi',
    label: 'NDVI & NDBI Delta',
    subtitle: 'Spectral Index Shift',
    kind: 'feature',
    x: 62,
    y: 25,
    color: '#16A34A',
    details: {
      formulaNDVI: '(B08 - B04) / (B08 + B04)',
      formulaNDBI: '(B11 - B08) / (B11 + B08)',
      ndbiShift: '+0.46 (Urban growth)',
      ndviShift: '-0.39 (Canopy decrease)',
    },
  },
  {
    id: 'node-sar-struct',
    label: 'SAR Coherence',
    subtitle: 'Structural Corner Reflection',
    kind: 'feature',
    x: 62,
    y: 75,
    color: '#6366F1',
    details: {
      metric: 'VV Amplitude Delta',
      deltaDb: '+4.2 dB',
      interpretation: 'Vertical concrete/steel structures present',
      falsePositiveRisk: '< 4%',
    },
  },
  {
    id: 'node-verifier',
    label: 'Verification Gate',
    subtitle: 'QUALIFY / WARN / ABSTAIN',
    kind: 'decision',
    x: 78,
    y: 50,
    color: '#10B981',
    details: {
      decision: 'QUALIFY',
      opticalAgreement: 0.94,
      sarAgreement: 0.82,
      modelConfidence: 0.91,
      reliabilityScore: 0.78,
      hallucinationCheck: 'PASSED',
    },
  },
  {
    id: 'node-finding',
    label: 'Grounded Finding A',
    subtitle: '+18.4% Built-up (15.6 km²)',
    kind: 'finding',
    x: 93,
    y: 50,
    color: '#F59E0B',
    details: {
      finding: 'Built-up expansion detected',
      polygonFootprint: '84.6 km² AOI',
      netAreaKm2: 15.6,
      signOff: 'Ready for official municipal report',
    },
  },
];

export const EVIDENCE_GRAPH_EDGES = [
  { from: 'node-query', to: 'node-intent', weight: 1.0 },
  { from: 'node-intent', to: 'node-opt-scene', weight: 0.95 },
  { from: 'node-intent', to: 'node-sar-scene', weight: 0.92 },
  { from: 'node-opt-scene', to: 'node-ndvi', weight: 0.94 },
  { from: 'node-sar-scene', to: 'node-sar-struct', weight: 0.88 },
  { from: 'node-ndvi', to: 'node-verifier', weight: 0.92 },
  { from: 'node-sar-struct', to: 'node-verifier', weight: 0.86 },
  { from: 'node-verifier', to: 'node-finding', weight: 0.96 },
];
