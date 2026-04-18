import type { ComponentProps } from 'react';
import { Zap, AlertTriangle, FileText, Loader2 } from 'lucide-react';
import SectionHeader from '../ui/SectionHeader';
import Badge from '../ui/Badge';
import { usePortfolioData } from '../../hooks/usePortfolioData';
import type { PMLScenario } from '../../types';

type BadgeVariant = ComponentProps<typeof Badge>['variant'];

const BADGE_VARIANTS: readonly BadgeVariant[] = [
  'critical', 'high', 'medium', 'low', 'success', 'info', 'zone0', 'zone1', 'zone2', 'zone3',
];

function toBadgeVariant(severity: string): BadgeVariant {
  return (BADGE_VARIANTS as readonly string[]).includes(severity) ? (severity as BadgeVariant) : 'critical';
}

function severityLabel(severity: PMLScenario['severity']): string {
  switch (severity) {
    case 'critical':
      return 'Catastrophique';
    case 'high':
      return 'Élevé';
    case 'medium':
      return 'Modéré';
    case 'low':
      return 'Limité';
    default:
      return 'Modéré';
  }
}

export default function PMLScenarios() {
  const { pmlScenarios, isLoading, isError } = usePortfolioData();

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
        <Loader2 className="w-12 h-12 text-[#C5D921] animate-spin" />
        <p className="text-gray-400 font-medium animate-pulse uppercase tracking-[0.2em] text-xs">
          Loading Seismic Scenarios...
        </p>
      </div>
    );
  }

  // Enhanced error check: also handles empty/malformed arrays
  if (isError || !pmlScenarios || !Array.isArray(pmlScenarios) || pmlScenarios.length === 0) {
    return (
      <div className="bg-red-950/20 border border-red-900/50 rounded-xl p-12 text-center space-y-4">
        <AlertTriangle className="w-12 h-12 text-red-500 mx-auto" />
        <h3 className="text-xl font-bold text-white">Aucun Scénario Disponible</h3>
        <p className="text-gray-400 max-w-md mx-auto">
          Impossible de charger les scénarios PML. Vérifiez le backend ou les données.
        </p>
      </div>
    );
  }

  const maxLoss = Math.max(...pmlScenarios.map((s) => Number(s.loss) || 0), 1e-9);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <SectionHeader
        icon={Zap}
        title="Probable Maximum Loss Scenarios"
        subtitle="Analyses détaillées de scénarios sismiques extrêmes — Md DZD"
        badge={<Badge variant="critical">Modélisation RPA 2024</Badge>}
      />

      <div className="grid grid-cols-1 gap-4 max-w-4xl">
        {pmlScenarios.map((scenario, idx) => {
          const safeLoss = Number(scenario.loss) || 0;
          const safePolicies = Number(scenario.affectedPolicies) || 0;
          const safeMagnitude = scenario.magnitude || '—';
          const safeName = scenario.name || scenario.returnPeriod || `Scénario ${idx + 1}`;
          const safeDescription = scenario.description?.trim() || '';
          const safeSeverity = scenario.severity;
          const badgeVariant = toBadgeVariant(safeSeverity);

          const zoneTag =
            (scenario.focusZone && scenario.focusZone.slice(0, 4)) ||
            safeName.split(' ').find((w) => /^(I{1,3}|IIa|IIb|IV|0)$/i.test(w))?.toUpperCase() ||
            '—';

          const progressWidth = Math.min((safeLoss / maxLoss) * 100, 100);

          return (
            <div
              key={scenario.id || scenario.returnPeriod || scenario.name || idx}
              className="bg-[#162018] border border-[#2a3d2e] rounded-xl p-6 transition-all duration-200 hover:border-[#C5D921]/60 hover:shadow-lg hover:shadow-[#C5D921]/10 hover:bg-[#1a2820] group cursor-pointer"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex gap-4 items-center">
                  <div className={`px-2 py-1 rounded text-[10px] font-bold ${
                    zoneTag === 'III' ? 'bg-red-500/20 text-red-400 border border-red-500/30' :
                    zoneTag === 'IIb' || zoneTag === 'II' || zoneTag === 'IIA' ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30' :
                    'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                  }`}>
                    {zoneTag}
                  </div>
                  <h3 className="text-white font-bold text-lg group-hover:text-[#C5D921] transition-colors">
                    {safeName}
                  </h3>
                </div>
                <span className="text-gray-500 font-mono text-sm">{safeMagnitude}</span>
              </div>

              <div className="mb-6">
                <p className="text-4xl font-black text-red-500 font-mono">
                  {safeLoss.toFixed(2)} Md DZD
                </p>
                <div className="flex flex-col gap-1 mt-2 text-gray-500 text-xs text-balance">
                  <div className="flex items-center gap-2 flex-wrap">
                    <FileText size={12} className="shrink-0" />
                    <span>{safePolicies.toLocaleString()} polices impactées</span>
                    {scenario.pmlPctCapital != null && Number.isFinite(scenario.pmlPctCapital) && (
                      <>
                        <span className="mx-1">•</span>
                        <span className="font-mono">{scenario.pmlPctCapital.toFixed(2)}% du capital à risque</span>
                      </>
                    )}
                  </div>
                  {scenario.capitalAtRiskBillions != null && Number.isFinite(scenario.capitalAtRiskBillions) && (
                    <span className="font-mono text-gray-600">
                      Capital à risque (scénario) : {scenario.capitalAtRiskBillions.toFixed(2)} Md DZD
                    </span>
                  )}
                  {safeDescription ? <span>{safeDescription}</span> : null}
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex-1 h-1.5 bg-[#0D1510] rounded-full overflow-hidden">
                  <div 
                    className="h-full rounded-full bg-gradient-to-r from-red-500 to-red-600"
                    style={{ width: `${progressWidth}%` }}
                  />
                </div>
                <Badge variant={badgeVariant}>
                  {severityLabel(safeSeverity)}
                </Badge>
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-[#162018] border border-red-500/20 rounded-xl p-6 flex gap-4">
        <div className="p-3 bg-red-500/10 rounded-lg h-fit">
          <AlertTriangle size={20} className="text-red-400" />
        </div>
        <div>
          <h4 className="text-white font-bold mb-1 italic">Rapport sur l'insolvabilité</h4>
          <p className="text-xs text-gray-400 leading-relaxed">
            Données issues de <span className="text-gray-300 font-mono">pml_scenarios.csv</span>. PML maximal
            parmi les scénarios affichés :{' '}
            <span className="text-red-400 font-bold px-1 font-mono">{maxLoss.toFixed(2)} Md DZD</span>.
            Adapter les lignes Excess of Loss si ce plafond dépasse les limites de rétention définies.
          </p>
        </div>
      </div>
    </div>
  );
}