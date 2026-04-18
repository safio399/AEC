import React from 'react';
import { Shield, Star, Clock, DollarSign, TrendingUp, CheckCircle, AlertCircle } from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell,
  RadarChart, Radar, PolarGrid, PolarAngleAxis,
} from 'recharts';
import SectionHeader from '../ui/SectionHeader';
import Badge from '../ui/Badge';
import { reinsuranceStrategies } from '../../data/mockData';

const comparisonData = [
  { metric: 'Coût Annuel (Md)', A: 2350, B: 4200 },
  { metric: 'Couverture (%)', A: 80, B: 92 },
  { metric: 'Implémentation (mois)', A: 2, B: 4 },
  { metric: 'Perte Nette (Md)', A: 103.06, B: 78.45 },
  { metric: 'ROI', A: 4.4, B: 2.5 },
];

const radarData = [
  { subject: 'Couverture', A: 80, B: 92 },
  { subject: 'ROI', A: 88, B: 50 },
  { subject: 'Rapidité', A: 100, B: 50 },
  { subject: 'Coût-Efficacité', A: 95, B: 60 },
  { subject: 'Complexité', A: 90, B: 60 },
  { subject: 'Flexibilité', A: 75, B: 85 },
];

const roadmap = [
  { month: 'Mois 1-2', label: 'Appel d\'offres réassureurs', strategy: 'A', status: 'done' },
  { month: 'Mois 2', label: 'Signature Traité 3-Layer', strategy: 'A', status: 'done' },
  { month: 'Mois 3-4', label: 'Revue de portefeuille Zone III', strategy: 'A', status: 'progress' },
  { month: 'Mois 4-6', label: 'Étude paramétrique (Stratégie B)', strategy: 'B', status: 'pending' },
  { month: 'Mois 6-8', label: 'Test pilote couverture hybride', strategy: 'B', status: 'pending' },
  { month: 'Mois 8-12', label: 'Déploiement complet A+B', strategy: 'Hybrid', status: 'pending' },
];

export default function Reinsurance() {
  return (
    <div className="space-y-8">
      <SectionHeader
        icon={Shield}
        title="Stratégie de Réassurance"
        subtitle="Comparaison Stratégie A vs B · Analyse Coût-Bénéfice"
        badge={<Badge variant="success">Recommandé: Stratégie A</Badge>}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {reinsuranceStrategies.map((s) => (
          <div
            key={s.id}
            className={`rounded-xl border p-6 relative overflow-hidden transition-all duration-200 hover:scale-[1.01] ${
              s.recommended
                ? 'border-[#C5D921]/40 bg-[#1B6D3A]/10'
                : 'border-[#2a3d2e] bg-[#162018]'
            }`}
          >
            {s.recommended && (
              <div className="absolute top-4 right-4 flex items-center gap-1.5 bg-[#C5D921]/20 border border-[#C5D921]/40 rounded-full px-3 py-1">
                <Star size={11} className="text-[#C5D921] fill-[#C5D921]" />
                <span className="text-[#C5D921] text-xs font-bold">RECOMMANDÉ</span>
              </div>
            )}
            {!s.recommended && (
              <div className="absolute top-4 right-4">
                <Badge variant="info">Futur</Badge>
              </div>
            )}

            <div className="mb-5">
              <div className="flex items-center gap-2 mb-1">
                <span className={`text-2xl font-black ${s.recommended ? 'text-[#C5D921]' : 'text-gray-400'}`}>Stratégie {s.id}</span>
                <span className="text-xs text-gray-500 font-mono">·</span>
                <span className="text-sm text-gray-400">{s.layers} Layers</span>
              </div>
              <p className="text-white font-bold text-base">{s.name}</p>
              <p className="text-gray-400 text-xs mt-0.5">{s.subtitle}</p>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-5">
              {[
                { icon: DollarSign, label: 'Coût Annuel', value: `${s.annualCost.toLocaleString()} Md`, color: 'text-white' },
                { icon: Shield, label: 'Couverture', value: `${s.coverage}%`, color: 'text-[#4ade80]' },
                { icon: Clock, label: 'Implémentation', value: `${s.implementationMonths} mois`, color: 'text-white' },
                { icon: TrendingUp, label: 'ROI', value: `${s.roi}:1`, color: s.recommended ? 'text-[#C5D921]' : 'text-gray-300' },
              ].map(({ icon: Icon, label, value, color }) => (
                <div key={label} className="bg-[#0D1510]/60 rounded-lg p-3 border border-[#2a3d2e]">
                  <div className="flex items-center gap-1.5 mb-1">
                    <Icon size={11} className="text-gray-500" />
                    <span className="text-xs text-gray-500">{label}</span>
                  </div>
                  <p className={`font-bold font-mono text-lg leading-none ${color}`}>{value}</p>
                </div>
              ))}
            </div>

            <div className="space-y-2 border-t border-[#2a3d2e] pt-4">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Perte Nette (1-in-250)</span>
                <span className="text-white font-mono font-bold">{s.netLoss} Md DZD</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Réduction Perte PML</span>
                <span className="text-[#4ade80] font-mono font-bold">
                  -{((523.02 - s.netLoss) / 523.02 * 100).toFixed(0)}%
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-[#162018] border border-[#2a3d2e] rounded-xl p-5">
          <h3 className="text-white font-semibold text-sm mb-1">Analyse Comparative</h3>
          <p className="text-gray-500 text-xs mb-5">Métriques clés — Stratégie A vs B</p>
          <ResponsiveContainer width="100%" height={220}>
            <RadarChart data={radarData}>
              <PolarGrid stroke="#2a3d2e" />
              <PolarAngleAxis dataKey="subject" tick={{ fill: '#6B7280', fontSize: 9 }} />
              <Radar name="Stratégie A" dataKey="A" stroke="#C5D921" fill="#C5D921" fillOpacity={0.15} strokeWidth={2} />
              <Radar name="Stratégie B" dataKey="B" stroke="#4ade80" fill="#4ade80" fillOpacity={0.1} strokeWidth={1.5} />
              <Tooltip
                contentStyle={{ background: '#0D1510', border: '1px solid #2a3d2e', borderRadius: 8, fontSize: 11 }}
                labelStyle={{ color: '#9CA3AF' }}
                itemStyle={{ color: '#fff' }}
              />
            </RadarChart>
          </ResponsiveContainer>
          <div className="flex gap-6 justify-center mt-2">
            {[['#C5D921', 'Stratégie A'], ['#4ade80', 'Stratégie B']].map(([c, l]) => (
              <div key={l} className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: c }} />
                <span className="text-xs text-gray-400">{l}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-[#162018] border border-[#2a3d2e] rounded-xl p-5">
          <h3 className="text-white font-semibold text-sm mb-5">Roadmap d'Implémentation 12 Mois</h3>
          <div className="space-y-3">
            {roadmap.map((step, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className="flex flex-col items-center">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 text-xs ${
                    step.status === 'done' ? 'bg-[#1B6D3A] text-white' :
                    step.status === 'progress' ? 'bg-[#C5D921]/20 border border-[#C5D921]/50 text-[#C5D921]' :
                    'bg-[#1a2e1d] text-gray-500'
                  }`}>
                    {step.status === 'done' ? <CheckCircle size={12} /> : i + 1}
                  </div>
                  {i < roadmap.length - 1 && <div className="w-px h-4 bg-[#2a3d2e] mt-1" />}
                </div>
                <div className="pb-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono text-gray-500">{step.month}</span>
                    <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                      step.strategy === 'A' ? 'bg-[#C5D921]/15 text-[#C5D921]' :
                      step.strategy === 'B' ? 'bg-[#4ade80]/15 text-[#4ade80]' :
                      'bg-blue-500/15 text-blue-400'
                    }`}>
                      {step.strategy}
                    </span>
                  </div>
                  <p className={`text-xs mt-0.5 ${step.status === 'done' ? 'text-gray-300' : step.status === 'progress' ? 'text-white font-semibold' : 'text-gray-500'}`}>
                    {step.label}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
