export type SeismicZone = 'Zone 0' | 'Zone I' | 'Zone II' | 'Zone IIa' | 'Zone IIb' | 'Zone III';
export type RiskLevel = 'low' | 'medium' | 'high' | 'critical';
export type NavSection =
  | 'overview'
  | 'risk'
  | 'pml'
  | 'stress'
  | 'reinsurance'
  | 'financial'
  | 'ml'
  | 'simulation'
  | 'recommendations';

export interface Wilaya {
  code: number;
  name: string;
  zone: SeismicZone;
  policies: number;
  capital: number;
  riskScore: number;
  avgPremium: number;
  predictedLoss: number;
  lat?: number;
  lon?: number;
  radius?: number;
}

export interface PMLScenario {
  /** Stable id when provided (e.g. `Scenario_ID` from CSV). */
  id?: string;
  returnPeriod: string;
  years: number;
  /** PML total in Md DZD (milliards), aligned with `Total_PML` / 1e9 from data. */
  loss: number;
  affectedPolicies: number;
  affectedWilayas: number;
  magnitude: string;
  severity: RiskLevel;
  name?: string;
  description?: string;
  /** From `Focus_Zone` in project CSV. */
  focusZone?: string;
  /** `Capital_At_Risk` / 1e9 when sourced from CSV. */
  capitalAtRiskBillions?: number;
  /** `PML_as_Pct_Capital` when sourced from CSV. */
  pmlPctCapital?: number;
}

export interface StressScenario {
  reduction: number;
  zone3Pct: number;
  targetMet: boolean;
  residualCapital: number;
}

export interface ReinsuranceStrategy {
  id: 'A' | 'B';
  name: string;
  subtitle: string;
  layers: number;
  annualCost: number;
  coverage: number;
  implementationMonths: number;
  netLoss: number;
  roi: number;
  recommended: boolean;
}

export interface StrategicRec {
  id: string;
  priority: 'CRITICAL' | 'HIGH' | 'MEDIUM';
  title: string;
  description: string;
  impact: string;
  timeline: string;
  owner: string;
}

export interface PortfolioSummary {
  totalPolicies: number;
  totalCapital: number;
  activeZones: number;
  solvencyRatio: number;
  avgCapitalPerPolicy: number;
  totalPremium: number;
  expectedAnnualLoss: number;
  availableReserve: number;
  dataQualityScore?: number;
  zone3CapitalPct?: number;
}
export interface SimulationResult {
  losses: number[];
  avgLoss: number;
  medianLoss: number;
  worstCase95: number;
  nSimulations: number;
}

export interface PremiumPrediction {
  basePremium: number;
  finalPremium: number;
  multiplier: number;
  zone: string;
  zoneLabel: string;
  hotspotWarning?: {
    level: 'HIGH' | 'CRITICAL';
    message: string;
  };
}
