import { Brain, AlertTriangle, Loader2 } from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, CartesianGrid,
} from 'recharts';
import SectionHeader from '../ui/SectionHeader';
import Badge from '../ui/Badge';
import { usePortfolioData, useMLData } from '../../hooks/usePortfolioData';

const featureImportance = [
  { feature: 'Zone Sismique', importance: 42.3 },
  { feature: 'Valeur Assurée', importance: 28.7 },
  { feature: 'Densité Polices', importance: 11.4 },
  { feature: 'Vulnérabilité Bâti', importance: 8.9 },
  { feature: 'Historique Sinistres', importance: 5.2 },
  { feature: 'Âge Structure', importance: 2.1 },
  { feature: 'Autres Facteurs', importance: 1.4 },
];

const SCORE_COLORS: Record<string, string> = {
  'Zone 0': '#1B6D3A', 'Zone I': '#2E8B57', 'Zone II': '#F59E00', 'Zone III': '#991B1B',
};

const getRiskColor = (score: number) => {
  if (score >= 85) return { color: '#DC3545', label: 'EXTRÊME' as const, badge: 'critical' as const };
  if (score >= 65) return { color: '#FFC107', label: 'ÉLEVÉ' as const, badge: 'critical' as const };
  if (score >= 40) return { color: '#C5D921', label: 'MODÉRÉ' as const, badge: 'medium' as const };
  return { color: '#4ade80', label: 'FAIBLE' as const, badge: 'low' as const };
};

export default function MLPredictions() {
  const { wilayas, summary, isLoading: isPortLoading } = usePortfolioData();
  const { metrics, isLoading: isMLLoading } = useMLData();

  if (isPortLoading || isMLLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
        <Loader2 className="w-12 h-12 text-[#C5D921] animate-spin" />
        <p className="text-gray-400 font-medium animate-pulse uppercase tracking-[0.2em] text-xs">
          Computing Model Metrics...
        </p>
      </div>
    );
  }

  // Safe data handling
  const safeWilayas = wilayas || [];
  const totalWilayas = safeWilayas.length;
  
  const top10RiskWilayas = [...safeWilayas]
    .sort((a, b) => (b.riskScore || 0) - (a.riskScore || 0))
    .slice(0, 10);

  // Safe average calculation
  const avgScore = totalWilayas > 0 
    ? Math.round(safeWilayas.reduce((sum, w) => sum + (w.riskScore || 0), 0) / totalWilayas)
    : 0;

  const scoreDistribution = [
    { range: '0-25', count: safeWilayas.filter(w => (w.riskScore || 0) < 25).length, zone: 'Zone 0' },
    { range: '25-50', count: safeWilayas.filter(w => (w.riskScore || 0) >= 25 && (w.riskScore || 0) < 50).length, zone: 'Zone I' },
    { range: '50-75', count: safeWilayas.filter(w => (w.riskScore || 0) >= 50 && (w.riskScore || 0) < 75).length, zone: 'Zone II' },
    { range: '75-100', count: safeWilayas.filter(w => (w.riskScore || 0) >= 75).length, zone: 'Zone III' },
  ];

  const stats = [
    { label: 'Wilayas Analysées', value: totalWilayas.toString(), sub: 'Couverture complète', color: 'text-white' },
    { label: 'Score Moyen', value: avgScore.toString(), sub: 'Sur 100 points', color: 'text-[#C5D921]' },
    { label: 'Points de Données', value: summary?.totalPolicies?.toLocaleString() || '39,196', sub: 'Polices traitées', color: 'text-blue-400' },
    { label: 'Précision Modèle', value: metrics ? `${(metrics.accuracy * 100).toFixed(1)}%` : '94.2%', sub: 'Validation Croisée', color: 'text-[#4ade80]' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <SectionHeader
        icon={Brain}
        title="Scoring de Risque ML — Modèle CatBoost"
        subtitle="Analyses prédictives basées sur l'historique national et le zonage RPA"
        badge={<Badge variant="info">{metrics?.model_version || 'CatBoost v2.1'}</Badge>}
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(m => (
          <div key={m.label} className="bg-[#162018] border border-[#2a3d2e] rounded-xl p-4 shadow-lg hover:shadow-xl hover:border-[#4ade80]/50 hover:bg-[#1a2820] transition-all duration-200 cursor-pointer">
            <p className="text-xs text-gray-400 uppercase tracking-widest mb-2">{m.label}</p>
            <p className={`text-2xl font-black font-mono ${m.color}`}>{m.value}</p>
            <p className="text-xs text-gray-500 mt-1">{m.sub}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Feature Importance Chart */}
        <div className="bg-[#162018] border border-[#2a3d2e] rounded-xl p-5 bg-gradient-to-t from-[#0D1510] to-[#162018]">
          <h3 className="text-white font-semibold text-sm mb-1">Importance des Caractéristiques</h3>
          <p className="text-gray-500 text-xs mb-5">Contribution relative par facteur de risque (%)</p>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart 
              data={featureImportance} 
              layout="vertical" 
              margin={{ top: 20, right: 30, left: 100, bottom: 20 }}
            >
              <XAxis 
                type="number" 
                tick={{ fill: '#6B7280', fontSize: 10 }} 
                axisLine={false} 
                tickLine={false} 
                domain={[0, 'dataMax + 10']}
              />
              <YAxis 
                type="category" 
                dataKey="feature" 
                tick={{ fill: '#9CA3AF', fontSize: 10 }} 
                axisLine={false} 
                tickLine={false} 
                width={100}
              />
              <Tooltip
                formatter={(value) => [`${Number(value ?? 0).toFixed(1)}%`, 'Importance']}
                contentStyle={{ background: '#0D1510', border: '1px solid #2a3d2e', borderRadius: 8, fontSize: 12 }}
                labelStyle={{ color: '#9CA3AF' }}
                itemStyle={{ color: '#fff' }}
              />
              <Bar dataKey="importance" radius={[0, 4, 4, 0]} barSize={20}>
                {featureImportance.map((_, i) => (
                  <Cell key={i} fill={`hsl(${140 - i * 15}, 70%, 50%)`} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Score Distribution Chart */}
        <div className="bg-[#162018] border border-[#2a3d2e] rounded-xl p-5 bg-gradient-to-t from-[#0D1510] to-[#162018]">
          <h3 className="text-white font-semibold text-sm mb-1">Distribution des Scores Actuels</h3>
          <p className="text-gray-500 text-xs mb-5">Nombre de wilayas par segment de scoring</p>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={scoreDistribution} margin={{ top: 20, right: 10, left: 10, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1a2e1d" vertical={false} />
              <XAxis dataKey="range" tick={{ fill: '#6B7280', fontSize: 9 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#6B7280', fontSize: 10 }} axisLine={false} tickLine={false} />
              <Tooltip
                formatter={(value) => [`${Number(value ?? 0)} wilaya(s)`, 'Count']}
                contentStyle={{ background: '#0D1510', border: '1px solid #2a3d2e', borderRadius: 8, fontSize: 12 }}
                labelStyle={{ color: '#9CA3AF' }}
                itemStyle={{ color: '#fff' }}
              />
              <Bar dataKey="count" radius={[4, 4, 0, 0]} barSize={40}>
                {scoreDistribution.map((d, i) => (
                  <Cell key={i} fill={SCORE_COLORS[d.zone] || '#3B82F6'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-[#162018] border border-[#2a3d2e] rounded-xl overflow-hidden shadow-2xl">
        <div className="px-5 py-4 border-b border-[#2a3d2e] flex items-center justify-between bg-gradient-to-r from-[#162018] to-[#1a2e1d]">
          <div className="flex items-center gap-3">
            <AlertTriangle size={15} className="text-red-400" />
            <h3 className="text-white font-semibold text-sm">Top 10 Wilayas — Surveillance Prioritaire (IA)</h3>
          </div>
          <Badge variant="critical">Données en Direct</Badge>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#1a2e1d] bg-[#0D1510]/50">
                {['#', 'Wilaya', 'Zone', 'Score IA', 'Polices', 'Capital (Md)', 'Ajustement'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-[10px] font-black text-gray-500 uppercase tracking-widest whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {top10RiskWilayas.map((w, i) => {
                const riskScore = w.riskScore || 0;
                const risk = getRiskColor(riskScore);
                const zoneColor = SCORE_COLORS[w.zone || 'Zone 0'] || '#3B82F6';
                return (
                  <tr key={w.name ?? i} className="border-b border-[#1a2e1d] hover:bg-[#1a2e1d] hover:border-l-4 hover:border-l-[#C5D921] hover:shadow-lg transition-all duration-200 cursor-pointer">
                    <td className="px-4 py-3 text-xs font-mono text-gray-500">{i + 1}</td>
                    <td className="px-4 py-3 text-sm font-semibold text-white whitespace-nowrap hover:text-[#C5D921] transition-colors">{w.name}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: zoneColor }} />
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">{w.zone}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-12 bg-[#0D1510] rounded-full h-1">
                          <div 
                            className="h-full rounded-full" 
                            style={{ width: `${Math.min(riskScore, 100)}%`, backgroundColor: risk.color }} 
                          />
                        </div>
                        <span className="text-xs font-mono font-bold" style={{ color: risk.color }}>
                          {Math.round(riskScore)}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-xs font-mono text-gray-400">
                      {(w.policies || 0).toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-xs font-mono text-white font-semibold">
                      {(w.capital || 0).toFixed(1)}
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant={risk.badge}>
                        {riskScore >= 80 ? 'AUGMENTER 1.5x' : 'NORMAL'}
                      </Badge>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}