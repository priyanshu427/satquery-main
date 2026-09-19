import { ScenarioFinding, InvestigationScenario } from './mockData';

export function downloadGeoJSON(scenario: InvestigationScenario) {
  const features = scenario.findings.map((finding) => {
    // Generate simulated geographic coordinates centered around the AOI
    const baseLat = scenario.coordinates.lat;
    const baseLng = scenario.coordinates.lng;
    const offsetLat = (finding.geometry.y - 50) * 0.0015;
    const offsetLng = (finding.geometry.x - 50) * 0.0015;

    const coordinates = [
      [
        [baseLng + offsetLng - 0.01, baseLat + offsetLat - 0.01],
        [baseLng + offsetLng + 0.01, baseLat + offsetLat - 0.01],
        [baseLng + offsetLng + 0.01, baseLat + offsetLat + 0.01],
        [baseLng + offsetLng - 0.01, baseLat + offsetLat + 0.01],
        [baseLng + offsetLng - 0.01, baseLat + offsetLat - 0.01],
      ],
    ];

    return {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates,
      },
      properties: {
        id: finding.id,
        label: finding.label,
        category: finding.category,
        changedAreaKm2: finding.changedAreaKm2,
        changePercent: finding.changePercent,
        modelConfidence: finding.modelConfidence,
        reliability: finding.reliability,
        opticalEvidence: finding.opticalEvidence,
        sarEvidence: finding.sarEvidence,
        verificationStatus: finding.verificationStatus,
        rationale: finding.rationale,
      },
    };
  });

  const geojson = {
    type: 'FeatureCollection',
    crs: {
      type: 'name',
      properties: { name: 'urn:ogc:def:crs:OGC:1.3:CRS84' },
    },
    metadata: {
      generatedBy: 'SATQUERY AI Earth Intelligence',
      aoi: scenario.region,
      scenarioId: scenario.id,
      timestamp: new Date().toISOString(),
    },
    features,
  };

  const blob = new Blob([JSON.stringify(geojson, null, 2)], {
    type: 'application/geo+json',
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `satquery-${scenario.id}-findings.geojson`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function downloadCSV(scenario: InvestigationScenario) {
  const headers = [
    'Finding ID',
    'Classification',
    'Category',
    'Changed Area (km2)',
    'Change Percent (%)',
    'Model Confidence',
    'Evidence Reliability',
    'Optical Evidence Score',
    'SAR Evidence Score',
    'Verification Decision',
    'NDVI Before',
    'NDVI After',
    'NDBI Before',
    'NDBI After',
    'SAR Delta (dB)',
  ];

  const rows = scenario.findings.map((f) => [
    f.id,
    `"${f.label}"`,
    f.category,
    f.changedAreaKm2,
    f.changePercent,
    f.modelConfidence,
    f.reliability,
    f.opticalEvidence,
    f.sarEvidence,
    f.verificationStatus,
    f.spectralIndices.ndviBefore,
    f.spectralIndices.ndviAfter,
    f.spectralIndices.ndbiBefore,
    f.spectralIndices.ndbiAfter,
    f.spectralIndices.sarDbDelta,
  ]);

  const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `satquery-${scenario.id}-metrics.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function printExecutiveReport() {
  window.print();
}
