import { useState, useEffect } from 'react';
import { apiClient } from '../services/api';
import { mlService } from '../services/mlService';
import type { PortfolioSummary, Wilaya, PMLScenario } from '../types';
import { mapPMLScenario } from '../utils/mapPMLScenario';

export interface PortfolioData {
  summary: PortfolioSummary | null;
  wilayas: Wilaya[] | null;
  zoneData: any[] | null;
  communeRisks: any[] | null;
  typeData: any[] | null;
  pmlScenarios: PMLScenario[] | null;
  activePolicies: number | null;
  wilayasCovered: number | null;
  communesCovered: number | null;
  isLoading: boolean;
  isError: boolean;
  error: string | null;
}

const defaultSummary: PortfolioSummary = {
  totalPolicies: 39196,
  totalCapital: 43431.81,
  activeZones: 4,
  solvencyRatio: 2.37,
  avgCapitalPerPolicy: 1.108,
  totalPremium: 1028.4,
  expectedAnnualLoss: 243.6,
  availableReserve: 1029.5,
  dataQualityScore: 92,
  zone3CapitalPct: 18,
};

export function usePortfolioData() {
  const [data, setData] = useState<PortfolioData>({
    summary: null,
    wilayas: null,
    zoneData: null,
    communeRisks: null,
    typeData: null,
    pmlScenarios: null,
    activePolicies: null,
    wilayasCovered: null,
    communesCovered: null,
    isLoading: true,
    isError: false,
    error: null,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setData((prev) => ({ ...prev, isLoading: true, isError: false, error: null }));

        const health = await apiClient.health();
        if (!health) {
          throw new Error('Backend API is not available');
        }

        const [rawSummary, wilayas, rawZoneData, rawCommunes, rawPML, rawTypeData, activePolicies, wilayasCovered, communesCovered] = await Promise.all([
          apiClient.getPortfolioSummary(),
          apiClient.getPortfolioByWilaya(),
          apiClient.getPortfolioByZone(),
          apiClient.getCommuneRisks(10),
          apiClient.getPMLScenarios(),
          apiClient.getPortfolioByType(),
          apiClient.getActivePolicies(),
          apiClient.getWilayasCovered(),
          apiClient.getCommunesCovered(),
        ]);

        const zoneLabelMap: Record<string, string> = {
          '0': 'Zone 0',
          '1': 'Zone I',
          '2': 'Zone II',
          '3': 'Zone III',
        };

        const summary: PortfolioSummary | null = rawSummary
          ? {
              totalPolicies: (rawSummary as any).total_policies || 0,
              totalCapital: (rawSummary as any).total_capital / 10 ** 9 || 0,
              activeZones: (rawSummary as any).active_zones || 4,
              solvencyRatio: (rawSummary as any).solvency_ratio || 2.37,
              avgCapitalPerPolicy: (rawSummary as any).avg_capital_per_policy || 0,
              totalPremium: (rawSummary as any).total_premium || 0,
              expectedAnnualLoss: (rawSummary as any).expected_annual_loss || 0,
              availableReserve: (rawSummary as any).available_reserve || 0,
              dataQualityScore: (rawSummary as any).data_quality_score || 0,
              zone3CapitalPct: (rawSummary as any).zone_3_capital_pct || 0,
            }
          : defaultSummary;

        const zoneColors: Record<string, string> = {
          '0': '#10B981',
          I: '#FBBF24',
          IIa: '#F59E00',
          IIb: '#EF4444',
          III: '#991B1B',
        };

        const mappedZones = Array.isArray(rawZoneData)
          ? rawZoneData.map((z) => ({
              zone: zoneLabelMap[z.zone] || `Zone ${z.zone}`,
              capital: z.total_capital / 10 ** 9,
              policyCount: z.policy_count,
              color: zoneColors[z.zone] || '#3B82F6',
              pct: Math.round(((z.total_capital / 10 ** 9) / summary.totalCapital) * 100),
            }))
          : [];

        const mappedWilayas: Wilaya[] = Array.isArray(wilayas)
          ? wilayas.map((w) => ({
              ...w,
              zone: (zoneLabelMap[w.zone] as any) || w.zone,
              capital: w.capital / 10 ** 9,
              policies: w.policies,
              riskScore: w.riskScore || (w.zone === 'Zone III' ? 88 : 45),
            }))
          : [];

        const mappedCommunes = Array.isArray(rawCommunes)
          ? rawCommunes.map((c, i) => ({
              name: c.name,
              capital: c.capital / 10 ** 9,
              color: ['#991B1B', '#B91C1C', '#DC2626', '#EF4444', '#F87171'][i % 5],
            }))
          : [];

        const typeColors: Record<string, string> = {
          'Installation Industrielle': '#3B82F6',
          'Installation Commerciale': '#10B981',
          'Bien immobilier': '#8B5CF6',
          '1 - Installation Industrielle': '#3B82F6',
          '2 - Installation Commerciale': '#10B981',
        };

        const mappedTypes = Array.isArray(rawTypeData)
          ? rawTypeData.map((t) => ({
              type: t.type ? t.type.replace(/^\d+\s-\s/, '') : 'Unknown',
              capital: t.total_capital / 10 ** 9,
              policyCount: t.policy_count,
              premium: t.total_premium,
              color: typeColors[t.type] || '#6B7280',
              pct: Math.round(((t.total_capital / 10 ** 9) / summary.totalCapital) * 100),
            }))
          : [];

        const mappedPml: PMLScenario[] = Array.isArray(rawPML)
          ? rawPML.map((row) => mapPMLScenario(row as unknown as Record<string, unknown>))
          : [];

        setData({
          summary,
          wilayas: mappedWilayas,
          zoneData: mappedZones,
          communeRisks: mappedCommunes,
          typeData: mappedTypes,
          pmlScenarios: mappedPml,
          activePolicies: activePolicies || 0,
          wilayasCovered: wilayasCovered || 0,
          communesCovered: communesCovered || 0,
          isLoading: false,
          isError: false,
          error: null,
        });
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        console.error('Failed to fetch portfolio data:', errorMessage);

        setData({
          summary: defaultSummary,
          wilayas: [],
          zoneData: [],
          communeRisks: null,
          typeData: null,
          pmlScenarios: null,
          activePolicies: 0,
          wilayasCovered: 0,
          communesCovered: 0,
          isLoading: false,
          isError: true,
          error: errorMessage,
        });
      }
    };

    fetchData();
  }, []);

  return data;
}

export interface MLData {
  metrics: any | null;
  predictions: any[] | null;
  riskDistribution: { scores: number[]; frequencies: number[] } | null;
  isLoading: boolean;
  isError: boolean;
  error: string | null;
}

export function useMLData() {
  const [data, setData] = useState<MLData>({
    metrics: null,
    predictions: null,
    riskDistribution: null,
    isLoading: true,
    isError: false,
    error: null,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setData((prev) => ({ ...prev, isLoading: true, isError: false, error: null }));

        const [metrics, predictions, riskDist] = await Promise.all([
          mlService.getModelMetrics(),
          mlService.getPredictions(),
          mlService.getRiskDistribution(),
        ]);

        setData({
          metrics,
          predictions: predictions || [],
          riskDistribution: riskDist || { scores: [], frequencies: [] },
          isLoading: false,
          isError: false,
          error: null,
        });
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        console.error('Failed to fetch ML data:', errorMessage);

        setData({
          metrics: null,
          predictions: [],
          riskDistribution: { scores: [], frequencies: [] },
          isLoading: false,
          isError: true,
          error: errorMessage,
        });
      }
    };

    fetchData();
  }, []);

  return data;
}
