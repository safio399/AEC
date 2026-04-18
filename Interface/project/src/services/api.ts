import axios, { AxiosInstance, AxiosError } from 'axios';
import type { PortfolioSummary, Wilaya, PMLScenario, PremiumPrediction } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
const API_TIMEOUT = parseInt(import.meta.env.VITE_API_TIMEOUT || '30000');

class APIClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      timeout: API_TIMEOUT,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Add response interceptor for error handling
    this.client.interceptors.response.use(
      (response) => response,
      (error: AxiosError) => {
        console.error('API Error:', error.message);
        if (error.response?.status === 503) {
          console.error('Service unavailable - backend may not be running');
        }
        return Promise.reject(error);
      }
    );
  }

  // ============================================================================
  // HEALTH & META
  // ============================================================================

  async health() {
    try {
      const response = await this.client.get('/health');
      return response.data;
    } catch (error) {
      console.error('Health check failed:', error);
      return null;
    }
  }

  // ============================================================================
  // PORTFOLIO ENDPOINTS
  // ============================================================================

  async getPortfolioSummary(): Promise<PortfolioSummary | null> {
    try {
      const response = await this.client.get('/api/portfolio/summary');
      return response.data as PortfolioSummary;
    } catch (error) {
      console.error('Failed to fetch portfolio summary:', error);
      return null;
    }
  }

  async getPortfolioByZone(): Promise<Record<string, any> | null> {
    try {
      const response = await this.client.get('/api/portfolio/by-zone');
      return response.data;
    } catch (error) {
      console.error('Failed to fetch portfolio by zone:', error);
      return null;
    }
  }

  async getPortfolioByWilaya(): Promise<Wilaya[] | null> {
    try {
      const response = await this.client.get('/api/portfolio/by-wilaya');
      return response.data as Wilaya[];
    } catch (error) {
      console.error('Failed to fetch portfolio by wilaya:', error);
      return null;
    }
  }

  async getPortfolioByRiskZone(): Promise<Record<string, any> | null> {
    try {
      const response = await this.client.get('/api/portfolio/by-risk-zone');
      return response.data;
    } catch (error) {
      console.error('Failed to fetch portfolio by risk zone:', error);
      return null;
    }
  }

  async getPortfolioByType(): Promise<Record<string, any> | null> {
    try {
      const response = await this.client.get('/api/portfolio/by-type');
      return response.data;
    } catch (error) {
      console.error('Failed to fetch portfolio by type:', error);
      return null;
    }
  }

  async getHotspots(): Promise<Record<string, any> | null> {
    try {
      const response = await this.client.get('/api/portfolio/hotspots');
      return response.data;
    } catch (error) {
      console.error('Failed to fetch hotspots:', error);
      return null;
    }
  }

  async getConcentrationHotspots(limit: number = 20): Promise<any[] | null> {
    try {
      const response = await this.client.get('/api/concentration/hotspots', {
        params: { limit },
      });
      return response.data as any[];
    } catch (error) {
      console.error('Failed to fetch concentration hotspots:', error);
      return null;
    }
  }

  async getActivePolicies(): Promise<number | null> {
    try {
      const response = await this.client.get('/api/portfolio/metrics/active-policies');
      return response.data.active_policies;
    } catch (error) {
      console.error('Failed to fetch active policies:', error);
      return null;
    }
  }

  async getWilayasCovered(): Promise<number | null> {
    try {
      const response = await this.client.get('/api/portfolio/metrics/wilayas-covered');
      return response.data.wilayas_covered;
    } catch (error) {
      console.error('Failed to fetch wilayas covered:', error);
      return null;
    }
  }

  async getCommunesCovered(): Promise<number | null> {
    try {
      const response = await this.client.get('/api/portfolio/metrics/communes-covered');
      return response.data.communes_covered;
    } catch (error) {
      console.error('Failed to fetch communes covered:', error);
      return null;
    }
  }

  async getStressTestResults(zone3Reduction: number): Promise<Record<string, any> | null> {
    try {
      const response = await this.client.get('/api/stress-test', {
        params: { zone3_reduction: zone3Reduction },
      });
      return response.data;
    } catch (error) {
      console.error('Failed to fetch stress test results:', error);
      return null;
    }
  }

  // ============================================================================
  // ML PREDICTION ENDPOINTS
  // ============================================================================

  async getPredictions(wilayaCode?: number): Promise<Record<string, any> | null> {
    try {
      const response = await this.client.get('/api/ml/predict', {
        params: { wilaya_code: wilayaCode },
      });
      return response.data;
    } catch (error) {
      console.error('Failed to fetch predictions:', error);
      return null;
    }
  }

  async predictPremium(features: {
    type: string;
    wilaya_name: string;
    commune_name: string;
    valeur_assuree: number;
    seismic_zone: number;
  }): Promise<PremiumPrediction | null> {
    try {
      const response = await this.client.post('/api/predict', {
        type: features.type,
        wilaya: features.wilaya_name.toUpperCase(),
        commune: features.commune_name.toUpperCase(),
        capital_assure: features.valeur_assuree,
      });
      const data = response.data;
      
      if (!data) throw new Error('Empty response from backend');

      return {
        basePremium: data.base_prediction || 0,
        finalPremium: data.final_premium || 0,
        multiplier: data.multiplier || 1.0,
        zone: data.zone?.toString() || 'I',
        zoneLabel: data.zone_label || 'Zone I',
        hotspotWarning: data.hotspot_warning,
      };
    } catch (error) {
      console.error('Failed to predict premium:', error);
      if (axios.isAxiosError(error)) {
        console.error('Data:', error.response?.data);
        console.error('Status:', error.response?.status);
      }
      return null;
    }
  }

  async getModelMetrics(): Promise<Record<string, any> | null> {
    try {
      const response = await this.client.get('/api/ml/metrics');
      return response.data;
    } catch (error) {
      console.error('Failed to fetch model metrics:', error);
      return null;
    }
  }

  // ============================================================================
  // PML & LOSS PROJECTION ENDPOINTS
  // ============================================================================

  async getPMLScenarios(): Promise<PMLScenario[] | null> {
    try {
      const response = await this.client.get('/api/pml/scenarios');
      return response.data as PMLScenario[];
    } catch (error) {
      console.error('Failed to fetch PML scenarios:', error);
      return null;
    }
  }

  async getExpectedAnnualLoss(): Promise<number | null> {
    try {
      const response = await this.client.get('/api/pml/annual-loss');
      return response.data.expected_annual_loss;
    } catch (error) {
      console.error('Failed to fetch annual loss:', error);
      return null;
    }
  }

  // ============================================================================
  // REINSURANCE ENDPOINTS
  // ============================================================================

  async getReinsuranceStrategies(): Promise<Record<string, any>[] | null> {
    try {
      const response = await this.client.get('/api/reinsurance/strategies');
      return response.data;
    } catch (error) {
      console.error('Failed to fetch reinsurance strategies:', error);
      return null;
    }
  }

  async evaluateReinsuranceStrategy(strategyId: string): Promise<Record<string, any> | null> {
    try {
      const response = await this.client.post(`/api/reinsurance/evaluate`, {
        strategy_id: strategyId,
      });
      return response.data;
    } catch (error) {
      console.error('Failed to evaluate reinsurance strategy:', error);
      return null;
    }
  }

  // ============================================================================
  // PORTFOLIO ENRICHMENT ENDPOINTS
  // ============================================================================

  async getStrategicRecommendations(): Promise<Record<string, any>[] | null> {
    try {
      const response = await this.client.get('/api/recommendations');
      return response.data;
    } catch (error) {
      console.error('Failed to fetch strategic recommendations:', error);
      return null;
    }
  }

  async getSolvencyStatus(): Promise<Record<string, any> | null> {
    try {
      const response = await this.client.get('/api/solvency-status');
      return response.data;
    } catch (error) {
      console.error('Failed to fetch solvency status:', error);
      return null;
    }
  }

  async getCommuneRisks(limit: number = 10): Promise<any[] | null> {
    try {
      const response = await this.client.get('/api/portfolio/commune-risks', {
        params: { limit },
      });
      return response.data;
    } catch (error) {
      console.error('Failed to fetch commune risks:', error);
      return null;
    }
  }

  async getMonteCarloSimulation(wilaya: string, valeur: number): Promise<any | null> {
    try {
      const response = await this.client.post('/api/monte-carlo', {
        wilaya,
        capital_assure: valeur,
        n_simulations: 1000,
      });
      return response.data;
    } catch (error) {
      console.error('Failed to fetch Monte Carlo simulation:', error);
      return null;
    }
  }

}

// Export singleton instance
export const apiClient = new APIClient();

// Export type for use in components
export type { APIClient };
