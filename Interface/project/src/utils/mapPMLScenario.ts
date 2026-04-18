import type { PMLScenario, RiskLevel } from '../types';

function severityFromPmlPct(pct: number): RiskLevel {
  if (pct >= 15) return 'critical';
  if (pct >= 8) return 'high';
  if (pct >= 4) return 'medium';
  return 'low';
}

function formatMagnitude(raw: unknown): string {
  if (raw == null || raw === '') return '—';
  if (typeof raw === 'number' && Number.isFinite(raw)) return `M${raw.toFixed(1)}`;
  const s = String(raw).replace(',', '.').trim();
  const n = parseFloat(s);
  if (Number.isFinite(n)) return `M${n.toFixed(1)}`;
  return String(raw);
}

function isCsvPmlRow(raw: Record<string, unknown>): boolean {
  return (
    raw.Scenario_ID != null ||
    raw.Scenario_Name != null ||
    raw.Total_PML != null ||
    raw.Affected_Policies != null
  );
}

/**
 * Normalizes `/api/pml/scenarios` payloads: pandas CSV rows (`pml_scenarios.csv`)
 * or compact camelCase objects from the API.
 */
export function mapPMLScenario(raw: Record<string, unknown>): PMLScenario {
  if (!isCsvPmlRow(raw)) {
    const loss = Number(raw.loss ?? 0);
    const sev = String(raw.severity ?? 'medium');
    const severity: RiskLevel = ['low', 'medium', 'high', 'critical'].includes(sev)
      ? (sev as RiskLevel)
      : 'medium';
    return {
      id: raw.id != null ? String(raw.id) : undefined,
      returnPeriod: String(raw.returnPeriod ?? raw.name ?? '—'),
      years: Number(raw.years) || 0,
      loss,
      affectedPolicies: Number(raw.affectedPolicies ?? 0),
      affectedWilayas: Number(raw.affectedWilayas ?? 0),
      magnitude: formatMagnitude(raw.magnitude),
      severity,
      name: String(raw.name ?? ''),
      description: String(raw.description ?? ''),
    };
  }

  const totalPml = Number(raw.Total_PML ?? 0);
  const capitalAtRisk = Number(raw.Capital_At_Risk ?? 0);
  const pmlPct = Number(raw.PML_as_Pct_Capital ?? 0);
  const focusZone = String(raw.Focus_Zone ?? '').trim();

  return {
    id: String(raw.Scenario_ID ?? ''),
    returnPeriod: String(raw.Scenario_ID ?? ''),
    years: 0,
    loss: totalPml / 1e9,
    affectedPolicies: Number(raw.Affected_Policies ?? 0),
    affectedWilayas: Number(raw.Affected_Wilayas ?? 0),
    magnitude: formatMagnitude(raw.Magnitude),
    severity: severityFromPmlPct(pmlPct),
    name: String(raw.Scenario_Name ?? ''),
    description: String(raw.Description ?? ''),
    capitalAtRiskBillions: capitalAtRisk / 1e9,
    focusZone,
    pmlPctCapital: pmlPct,
  };
}
