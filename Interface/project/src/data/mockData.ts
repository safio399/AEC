import type { Wilaya, PMLScenario, StressScenario, ReinsuranceStrategy, StrategicRec, PortfolioSummary } from '../types';

export const portfolioSummary: PortfolioSummary = {
  totalPolicies: 39196,
  totalCapital: 299.5,
  activeZones: 5,
  solvencyRatio: 2.37,
  avgCapitalPerPolicy: 7.6,
  totalPremium: 1028.4,
  expectedAnnualLoss: 243.6,
  availableReserve: 1029.5,
};

export const wilayas: Wilaya[] = [
  { code: 1, name: 'Adrar', zone: 'Zone 0', policies: 421, capital: 467.2, riskScore: 12, avgPremium: 24300, predictedLoss: 0.8, lat: 27.874, lon: -0.293, radius: 10000 },
  { code: 2, name: 'Chlef', zone: 'Zone III', policies: 1842, capital: 2043.1, riskScore: 94, avgPremium: 89600, predictedLoss: 34.2, lat: 36.165, lon: 1.334, radius: 35000 },
  { code: 3, name: 'Laghouat', zone: 'Zone I', policies: 612, capital: 679.4, riskScore: 38, avgPremium: 31200, predictedLoss: 4.1, lat: 33.800, lon: 2.865, radius: 15000 },
  { code: 4, name: 'Oum El Bouaghi', zone: 'Zone I', policies: 734, capital: 814.7, riskScore: 56, avgPremium: 42100, predictedLoss: 9.8, lat: 35.875, lon: 7.113, radius: 15000 },
  { code: 5, name: 'Batna', zone: 'Zone IIa', policies: 1203, capital: 1335.3, riskScore: 61, avgPremium: 44800, predictedLoss: 16.2, lat: 35.555, lon: 6.174, radius: 25000 },
  { code: 6, name: 'Béjaïa', zone: 'Zone IIb', policies: 1456, capital: 1616.2, riskScore: 67, avgPremium: 51300, predictedLoss: 21.4, lat: 36.755, lon: 5.084, radius: 25000 },
  { code: 7, name: 'Biskra', zone: 'Zone 0', policies: 523, capital: 580.6, riskScore: 15, avgPremium: 26100, predictedLoss: 1.1, lat: 34.850, lon: 5.728, radius: 15000 },
  { code: 8, name: 'Béchar', zone: 'Zone 0', policies: 312, capital: 346.3, riskScore: 9, avgPremium: 21400, predictedLoss: 0.5, lat: 31.616, lon: -2.215, radius: 10000 },
  { code: 9, name: 'Blida', zone: 'Zone III', policies: 2891, capital: 3209.5, riskScore: 97, avgPremium: 95200, predictedLoss: 54.7, lat: 36.470, lon: 2.827, radius: 35000 },
  { code: 10, name: 'Bouira', zone: 'Zone IIa', policies: 876, capital: 972.4, riskScore: 63, avgPremium: 46200, predictedLoss: 12.3, lat: 36.374, lon: 3.902, radius: 25000 },
  { code: 11, name: 'Tamanrasset', zone: 'Zone 0', policies: 198, capital: 219.8, riskScore: 7, avgPremium: 18900, predictedLoss: 0.3, lat: 22.785, lon: 5.522, radius: 10000 },
  { code: 12, name: 'Tébessa', zone: 'Zone I', policies: 645, capital: 716.0, riskScore: 31, avgPremium: 28600, predictedLoss: 3.2, lat: 35.404, lon: 8.124, radius: 15000 },
  { code: 13, name: 'Tlemcen', zone: 'Zone II', policies: 1123, capital: 1246.5, riskScore: 58, avgPremium: 43700, predictedLoss: 14.8, lat: 34.878, lon: -1.315, radius: 15000 },
  { code: 14, name: 'Tiaret', zone: 'Zone I', policies: 789, capital: 876.0, riskScore: 35, avgPremium: 29800, predictedLoss: 3.8, lat: 35.371, lon: 1.316, radius: 15000 },
  { code: 15, name: 'Tizi Ouzou', zone: 'Zone III', policies: 2134, capital: 2368.7, riskScore: 96, avgPremium: 92400, predictedLoss: 40.3, lat: 36.711, lon: 4.045, radius: 25000 },
  { code: 16, name: 'Alger', zone: 'Zone III', policies: 4823, capital: 5354.5, riskScore: 99, avgPremium: 98700, predictedLoss: 91.2, lat: 36.753, lon: 3.058, radius: 35000 },
  { code: 17, name: 'Djelfa', zone: 'Zone I', policies: 567, capital: 629.5, riskScore: 29, avgPremium: 27400, predictedLoss: 2.9, lat: 34.672, lon: 3.263, radius: 15000 },
  { code: 18, name: 'Jijel', zone: 'Zone II', policies: 923, capital: 1024.8, riskScore: 65, avgPremium: 48100, predictedLoss: 13.4, lat: 36.820, lon: 5.766, radius: 25000 },
  { code: 19, name: 'Sétif', zone: 'Zone II', policies: 1567, capital: 1739.7, riskScore: 69, avgPremium: 53400, predictedLoss: 24.1, lat: 36.189, lon: 5.414, radius: 25000 },
  { code: 20, name: 'Saïda', zone: 'Zone I', policies: 412, capital: 457.4, riskScore: 27, avgPremium: 26100, predictedLoss: 2.4, lat: 34.825, lon: 0.151, radius: 15000 },
  { code: 21, name: 'Skikda', zone: 'Zone II', policies: 1089, capital: 1208.8, riskScore: 62, avgPremium: 45300, predictedLoss: 15.1, lat: 36.876, lon: 6.907, radius: 25000 },
  { code: 22, name: 'Sidi Bel Abbès', zone: 'Zone I', policies: 834, capital: 925.7, riskScore: 41, avgPremium: 33200, predictedLoss: 5.9, lat: 35.189, lon: -0.630, radius: 15000 },
  { code: 23, name: 'Annaba', zone: 'Zone I', policies: 1245, capital: 1382.0, riskScore: 43, avgPremium: 34800, predictedLoss: 7.4, lat: 36.900, lon: 7.766, radius: 25000 },
  { code: 24, name: 'Guelma', zone: 'Zone II', policies: 678, capital: 752.6, riskScore: 54, avgPremium: 40200, predictedLoss: 8.2, lat: 36.462, lon: 7.426, radius: 25000 },
  { code: 25, name: 'Constantine', zone: 'Zone II', policies: 2012, capital: 2233.3, riskScore: 71, avgPremium: 56900, predictedLoss: 29.7, lat: 36.365, lon: 6.614, radius: 25000 },
  { code: 26, name: 'Médéa', zone: 'Zone III', policies: 1345, capital: 1493.0, riskScore: 91, avgPremium: 87200, predictedLoss: 25.4, lat: 36.264, lon: 2.753, radius: 25000 },
  { code: 27, name: 'Mostaganem', zone: 'Zone II', policies: 876, capital: 972.4, riskScore: 59, avgPremium: 44100, predictedLoss: 11.7, lat: 35.931, lon: 0.089, radius: 25000 },
  { code: 28, name: "M'Sila", zone: 'Zone I', policies: 634, capital: 703.7, riskScore: 33, avgPremium: 29100, predictedLoss: 3.5, lat: 35.705, lon: 4.541, radius: 25000 },
  { code: 29, name: 'Mascara', zone: 'Zone I', policies: 712, capital: 790.3, riskScore: 36, avgPremium: 30400, predictedLoss: 4.3, lat: 35.398, lon: 0.140, radius: 25000 },
  { code: 30, name: 'Ouargla', zone: 'Zone 0', policies: 387, capital: 429.6, riskScore: 11, avgPremium: 22800, predictedLoss: 0.7, lat: 31.949, lon: 5.325, radius: 10000 },
  { code: 31, name: 'Oran', zone: 'Zone II', policies: 2345, capital: 2603.0, riskScore: 73, avgPremium: 58700, predictedLoss: 36.1, lat: 35.691, lon: -0.641, radius: 25000 },
  { code: 32, name: 'El Bayadh', zone: 'Zone 0', policies: 234, capital: 259.8, riskScore: 8, avgPremium: 20100, predictedLoss: 0.4, lat: 33.680, lon: 1.020, radius: 10000 },
  { code: 33, name: 'Illizi', zone: 'Zone 0', policies: 134, capital: 148.7, riskScore: 6, avgPremium: 17800, predictedLoss: 0.2, lat: 26.483, lon: 8.466, radius: 10000 },
  { code: 34, name: 'Bordj Bou Arréridj', zone: 'Zone II', policies: 812, capital: 901.3, riskScore: 55, avgPremium: 40900, predictedLoss: 9.9, lat: 36.073, lon: 4.761, radius: 25000 },
  { code: 35, name: 'Boumerdès', zone: 'Zone III', policies: 1923, capital: 2134.5, riskScore: 98, avgPremium: 96100, predictedLoss: 36.4, lat: 36.760, lon: 3.473, radius: 35000 },
  { code: 36, name: 'El Tarf', zone: 'Zone I', policies: 523, capital: 580.6, riskScore: 32, avgPremium: 28900, predictedLoss: 3.1, lat: 36.767, lon: 8.313, radius: 25000 },
  { code: 37, name: 'Tindouf', zone: 'Zone 0', policies: 98, capital: 108.8, riskScore: 5, avgPremium: 17200, predictedLoss: 0.1, lat: 27.671, lon: -8.147, radius: 10000 },
  { code: 38, name: 'Tissemsilt', zone: 'Zone I', policies: 345, capital: 383.0, riskScore: 28, avgPremium: 26800, predictedLoss: 2.1, lat: 35.607, lon: 1.810, radius: 25000 },
  { code: 39, name: 'El Oued', zone: 'Zone 0', policies: 423, capital: 469.5, riskScore: 13, avgPremium: 23600, predictedLoss: 0.9, lat: 33.368, lon: 6.853, radius: 10000 },
  { code: 40, name: 'Khenchela', zone: 'Zone I', policies: 412, capital: 457.4, riskScore: 30, avgPremium: 27900, predictedLoss: 2.6, lat: 35.435, lon: 7.143, radius: 15000 },
  { code: 41, name: 'Souk Ahras', zone: 'Zone I', policies: 489, capital: 543.0, riskScore: 34, avgPremium: 29400, predictedLoss: 3.3, lat: 36.286, lon: 7.951, radius: 15000 },
  { code: 42, name: 'Tipaza', zone: 'Zone III', policies: 1234, capital: 1369.9, riskScore: 93, avgPremium: 89900, predictedLoss: 23.3, lat: 36.589, lon: 2.443, radius: 35000 },
  { code: 43, name: 'Mila', zone: 'Zone II', policies: 634, capital: 703.7, riskScore: 52, avgPremium: 39100, predictedLoss: 7.4, lat: 36.450, lon: 6.264, radius: 25000 },
  { code: 44, name: 'Aïn Defla', zone: 'Zone III', policies: 789, capital: 876.0, riskScore: 90, avgPremium: 86300, predictedLoss: 14.9, lat: 36.265, lon: 1.939, radius: 35000 },
  { code: 45, name: 'Naâma', zone: 'Zone 0', policies: 198, capital: 219.8, riskScore: 10, avgPremium: 22100, predictedLoss: 0.4, lat: 33.267, lon: -0.316, radius: 25000 },
  { code: 46, name: 'Aïn Témouchent', zone: 'Zone II', policies: 567, capital: 629.5, riskScore: 53, avgPremium: 39600, predictedLoss: 7.6, lat: 35.297, lon: -1.140, radius: 25000 },
  { code: 47, name: 'Ghardaïa', zone: 'Zone 0', policies: 312, capital: 346.3, riskScore: 14, avgPremium: 24800, predictedLoss: 0.8, lat: 32.490, lon: 3.673, radius: 10000 },
  { code: 48, name: 'Relizane', zone: 'Zone II', policies: 723, capital: 802.7, riskScore: 57, avgPremium: 42800, predictedLoss: 9.4, lat: 35.737, lon: 0.555, radius: 25000 },
  { code: 49, name: "Timimoun", zone: 'Zone 0', policies: 145, capital: 160.9, riskScore: 7, avgPremium: 18400, predictedLoss: 0.2, lat: 29.263, lon: 0.231, radius: 10000 },
  { code: 50, name: 'Bordj Badji Mokhtar', zone: 'Zone 0', policies: 87, capital: 96.6, riskScore: 5, avgPremium: 16900, predictedLoss: 0.1, lat: 21.328, lon: 0.923, radius: 10000 },
  { code: 51, name: 'Beni Abbès', zone: 'Zone 0', policies: 112, capital: 124.4, riskScore: 6, avgPremium: 17500, predictedLoss: 0.2, lat: 30.133, lon: -2.167, radius: 10000 },
];

export const pmlScenarios: PMLScenario[] = [
  {
    returnPeriod: 'Scenario 1',
    years: 50,
    loss: 2.71,
    affectedPolicies: 3136,
    affectedWilayas: 5,
    magnitude: 'M7.0',
    severity: 'medium',
    name: 'Zone III - Magnitude 7.0 (Algiers Focus)',
    description: 'Major earthquake centered on Algiers/BLIDA',
  },
  {
    returnPeriod: 'Scenario 2',
    years: 250,
    loss: 3.61,
    affectedPolicies: 3136,
    affectedWilayas: 8,
    magnitude: 'M7.5',
    severity: 'critical',
    name: 'Zone III - Magnitude 7.5 (Kabylie Focus)',
    description: 'Catastrophic earthquake (1-in-250 years) on Tizi Ouzou/Boumerdes',
  },
  {
    returnPeriod: 'Scenario 3',
    years: 500,
    loss: 2.80,
    affectedPolicies: 9172,
    affectedWilayas: 12,
    magnitude: 'M6.5',
    severity: 'critical',
    name: 'Zone IIb - Magnitude 6.5 (Coastal)',
    description: 'Strong coastal earthquake',
  },
];

export const stressScenarios: StressScenario[] = [
  { reduction: 10, zone3Pct: 5.83, targetMet: true, residualCapital: 39088.63 },
  { reduction: 15, zone3Pct: 5.31, targetMet: true, residualCapital: 36917.04 },
  { reduction: 20, zone3Pct: 4.78, targetMet: true, residualCapital: 34745.45 },
  { reduction: 25, zone3Pct: 3.75, targetMet: true, residualCapital: 32573.86 },
  { reduction: 30, zone3Pct: 2.22, targetMet: true, residualCapital: 30402.27 },
];

export const reinsuranceStrategies: ReinsuranceStrategy[] = [
  {
    id: 'A',
    name: 'Stratégie Simplifiée',
    subtitle: '3-Layer XL Treaty',
    layers: 3,
    annualCost: 2350,
    coverage: 80,
    implementationMonths: 2,
    netLoss: 103.06,
    roi: 4.4,
    recommended: true,
  },
  {
    id: 'B',
    name: 'Stratégie Avancée',
    subtitle: '4-Layer + Parametric',
    layers: 4,
    annualCost: 4200,
    coverage: 92,
    implementationMonths: 4,
    netLoss: 78.45,
    roi: 2.5,
    recommended: false,
  },
];

export const strategicRecs: StrategicRec[] = [
  {
    id: 'REC_001',
    priority: 'CRITICAL',
    title: 'Zone III Concentration Mitigation',
    description: 'Implement underwriting restrictions on new Zone III policies to reduce concentration from 6.64% to target 5%. Enforce capital limits per wilaya.',
    impact: 'Reduces Zone III exposure by 25%, improving solvency ratio to 3.1%',
    timeline: 'Q2 2026 – Q3 2026',
    owner: 'Risk Committee',
  },
  {
    id: 'REC_002',
    priority: 'HIGH',
    title: 'Zone 0/I Expansion Opportunity',
    description: 'Grow portfolio in southern wilayas (Zone 0/I) to balance seismic exposure. Target 15% portfolio growth in safe zones within 12 months.',
    impact: 'Increases diversification index by 18%, reduces portfolio CVaR by 12%',
    timeline: 'Q3 2026 – Q1 2027',
    owner: 'Commercial Division',
  },
  {
    id: 'REC_003',
    priority: 'CRITICAL',
    title: 'Underwriting Policy Framework',
    description: 'Establish mandatory seismic vulnerability assessment for Zone II/III renewals. Implement risk-adjusted premium pricing model with CatBoost scores.',
    impact: 'Improves risk-adjusted premium adequacy by 31%, reduces adverse selection',
    timeline: 'Q2 2026 – Q4 2026',
    owner: 'Underwriting Department',
  },
  {
    id: 'REC_004',
    priority: 'HIGH',
    title: 'Reinsurance Strategy Optimization',
    description: 'Deploy Strategy A (Simplifié 3-Layer) immediately. Transition to hybrid Strategy A+B parametric cover after 12-month performance review.',
    impact: 'Reduces net PML 1-in-250 from 523 Md DZD to 103 Md DZD (80% reduction)',
    timeline: 'Q2 2026 – Q2 2027',
    owner: 'Finance & Reinsurance',
  },
];

export const monthlyTrend = [
  { month: 'Jan', premium: 84.2, loss: 18.4, reserve: 920.1 },
  { month: 'Feb', premium: 87.6, loss: 21.2, reserve: 986.5 },
  { month: 'Mar', premium: 91.3, loss: 19.8, reserve: 1057.9 },
  { month: 'Apr', premium: 85.1, loss: 23.4, reserve: 1119.6 },
  { month: 'May', premium: 88.9, loss: 20.1, reserve: 1188.4 },
  { month: 'Jun', premium: 93.4, loss: 17.9, reserve: 1264.0 },
  { month: 'Jul', premium: 89.7, loss: 22.6, reserve: 1331.1 },
  { month: 'Aug', premium: 86.3, loss: 19.3, reserve: 1398.1 },
  { month: 'Sep', premium: 92.1, loss: 24.7, reserve: 1465.5 },
  { month: 'Oct', premium: 94.8, loss: 21.5, reserve: 1538.8 },
  { month: 'Nov', premium: 88.4, loss: 18.8, reserve: 1608.4 },
  { month: 'Dec', premium: 96.2, loss: 25.9, reserve: 1678.7 },
];

export const zoneDistribution = [
  { zone: 'Zone IIa', capital: 172.1, policies: 15421, pct: 57.5, color: '#800000' },
  { zone: 'Zone IIb', capital: 56.4, policies: 8421, pct: 18.8, color: '#fca5a5' },
  { zone: 'Zone I', capital: 28.0, policies: 4521, pct: 9.34, color: '#ff4444' },
  { zone: 'Zone 0', capital: 23.2, policies: 3683, pct: 7.75, color: '#ffb3b3' },
  { zone: 'Zone III', capital: 19.8, policies: 7150, pct: 6.64, color: '#991B1B' },
];

export const coverageDistribution = [
  { type: '1: Installation Industrielle', capital: 99.2, color: '#7ebadd' },
  { type: '2: Installation Commerciale', capital: 89.8, color: '#f7fbff' },
  { type: 'Bien immobilier', capital: 110.5, color: '#08306b' },
];

export const topCommunesZone3 = [
  { name: '356 - MOUZAIA', capital: 5.4, color: '#800000' },
  { name: '1315 - TAMANRASSET', capital: 3.8, color: '#d32f2f' },
  { name: '1344 - TEBESSA', capital: 3.5, color: '#f44336' },
  { name: '342 - BLIDA', capital: 2.1, color: '#ff8a65' },
  { name: '360 - OULED YAICH BLIDA', capital: 0.7, color: '#ffccbc' },
  { name: '410 - BOUIRA', capital: 0.6, color: '#ffccbc' },
  { name: '344 - BOUFARIK', capital: 0.5, color: '#ffccbc' },
  { name: '362 - SOUMAA BLIDA', capital: 0.4, color: '#ffccbc' },
  { name: '1335 - EL OUENZA', capital: 0.35, color: '#ffccbc' },
  { name: '352 - GUERROUAOU', capital: 0.2, color: '#ffccbc' },
];

export const topWilayas = wilayas
  .sort((a, b) => b.capital - a.capital)
  .slice(0, 15);

export const top10RiskWilayas = wilayas
  .sort((a, b) => b.riskScore - a.riskScore)
  .slice(0, 10);
