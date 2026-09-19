import { SCENARIOS, InvestigationScenario, MODEL_REGISTRY, DISASTER_ZONES } from './mockData';

export interface ApiStatus {
  isLive: boolean;
  backendUrl: string;
  checkedAt: string;
  error?: string;
}

class SatQueryApiService {
  private isLiveMode = false;
  private backendUrl = 'http://localhost:8000/api';

  async checkHealth(): Promise<ApiStatus> {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 1200);
      const res = await fetch(`${this.backendUrl}/healthz`, {
        signal: controller.signal,
      });
      clearTimeout(timeoutId);
      if (res.ok) {
        this.isLiveMode = true;
        return {
          isLive: true,
          backendUrl: this.backendUrl,
          checkedAt: new Date().toISOString(),
        };
      }
    } catch {
      // Backend not running; fallback gracefully
    }
    this.isLiveMode = false;
    return {
      isLive: false,
      backendUrl: this.backendUrl,
      checkedAt: new Date().toISOString(),
      error: 'FastAPI backend unavailable. Operating in calibrated Demo Mode.',
    };
  }

  isLive(): boolean {
    return this.isLiveMode;
  }

  setLiveMode(enabled: boolean) {
    this.isLiveMode = enabled;
  }

  async runInvestigation(scenarioId: string = 'noida'): Promise<InvestigationScenario> {
    if (this.isLiveMode) {
      try {
        const res = await fetch(`${this.backendUrl}/v1/investigate`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ scenarioId }),
        });
        if (res.ok) {
          return (await res.json()) as InvestigationScenario;
        }
      } catch (err) {
        console.warn('Live API call failed, falling back to scenario mock data:', err);
      }
    }
    // Realistic simulation latency
    await new Promise((resolve) => setTimeout(resolve, 800));
    return SCENARIOS[scenarioId] ?? SCENARIOS.noida;
  }

  async getModels() {
    return MODEL_REGISTRY;
  }

  async getDisasterZones() {
    return DISASTER_ZONES;
  }
}

export const api = new SatQueryApiService();
