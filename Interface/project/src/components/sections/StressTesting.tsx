import React from 'react';
import { FlaskConical, CheckCircle, Target } from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell,
  LineChart, Line, CartesianGrid, ReferenceLine,
} from 'recharts';
import SectionHeader from '../ui/SectionHeader';
import Badge from '../ui/Badge';
import { stressScenarios } from '../../data/mockData';

const CURRENT_ZONE3 = 6.64;
const TARGET_ZONE3 = 5.0;

export default function StressTesting() {
  const chartData = [
    { label: 'Actuel', reduction: 0, zone3Pct: CURRENT_ZONE3, residual: 43431.81, target: false },
    ...stressScenarios.map(s => ({
      label: `-${s.reduction}%`,
      reduction: s.reduction,
      zone3Pct: s.zone3Pct,
      residual: s.residualCapital,
      target: s.targetMet,
    })),
  ];

  const optimalScenario = stressScenarios.find(s => s.reduction === 25)!;

  return (
    <div className="space-y-8">
      <SectionHeader
        icon={FlaskConical}
        title="Stress Testing & Analyse de Scénarios"
        subtitle="Simulation de réduction du capital Zone III · 5 scénarios"
        badge={<Badge variant="success">Optimal: -25% recommandé</Badge>}
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#162018] border border-[#2a3d2e] rounded-xl p-4">
          <p className="text-xs text-gray-400 uppercase tracking-widest mb-1">Zone III Actuel</p>
          <p className="text-3xl font-black font-mono text-red-400">{CURRENT_ZONE3}%</p>
          <p className="text-xs text-gray-500 mt-1">Concentration critique</p>
        </div>
        <div className="bg-[#162018] border border-[#2a3d2e] rounded-xl p-4">
          <p className="text-xs text-gray-400 uppercase tracking-widest mb-1">Cible Zone III</p>
          <p className="text-3xl font-black font-mono text-[#C5D921]">&lt; {TARGET_ZONE3}%</p>
          <p className="text-xs text-gray-500 mt-1">Objectif stratégique</p>
        </div>
        <div className="bg-[#1B6D3A]/10 border border-[#1B6D3A]/30 rounded-xl p-4">
          <p className="text-xs text-gray-400 uppercase tracking-widest mb-1">Scénario Optimal</p>
          <p className="text-3xl font-black font-mono text-[#4ade80]">-25%</p>
          <p className="text-xs text-gray-500 mt-1">Réduction recommandée</p>
        </div>
        <div className="bg-[#162018] border border-[#2a3d2e] rounded-xl p-4">
          <p className="text-xs text-gray-400 uppercase tracking-widest mb-1">Résultat -25%</p>
          <p className="text-3xl font-black font-mono text-[#4ade80]">{optimalScenario.zone3Pct}%</p>
          <p className="text-xs text-gray-500 mt-1">Zone III après réduction</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-[#162018] border border-[#2a3d2e] rounded-xl p-5">
          <h3 className="text-white font-semibold text-sm mb-1">Zone III % par Scénario</h3>
          <p className="text-gray-500 text-xs mb-5">Ligne cible = {TARGET_ZONE3}% (objectif stratégique)</p>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={chartData} margin={{ top: 0, right: 10, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1a2e1d" vertical={false} />
              <XAxis dataKey="label" tick={{ fill: '#6B7280', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#6B7280', fontSize: 10 }} axisLine={false} tickLine={false} domain={[0, 8]} />
              <ReferenceLine y={TARGET_ZONE3} stroke="#C5D921" strokeDasharray="4 4" strokeWidth={1.5} label={{ value: `Cible ${TARGET_ZONE3}%`, position: 'right', fill: '#C5D921', fontSize: 9 }} />
              <Tooltip
                formatter={(v: number) => [`${v.toFixed(2)}%`, 'Zone III']}
                contentStyle={{ background: '#0D1510', border: '1px solid #2a3d2e', borderRadius: 8, fontSize: 12 }}
                labelStyle={{ color: '#9CA3AF' }}
                itemStyle={{ color: '#fff' }}
              />
              <Bar dataKey="zone3Pct" radius={[4, 4, 0, 0]}>
                {chartData.map((d) => (
                  <Cell key={d.label} fill={d.zone3Pct <= TARGET_ZONE3 ? '#1B6D3A' : d.zone3Pct <= 6 ? '#C5D921' : '#DC3545'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-[#162018] border border-[#2a3d2e] rounded-xl p-5">
          <h3 className="text-white font-semibold text-sm mb-1">Capital Résiduel (Md DZD)</h3>
          <p className="text-gray-500 text-xs mb-5">Évolution du portefeuille par scénario de réduction</p>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={chartData} margin={{ top: 0, right: 10, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1a2e1d" vertical={false} />
              <XAxis dataKey="label" tick={{ fill: '#6B7280', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#6B7280', fontSize: 10 }} axisLine={false} tickLine={false} />
              <Tooltip
                formatter={(v: number) => [`${v.toFixed(0)} Md DZD`, 'Capital']}
                contentStyle={{ background: '#0D1510', border: '1px solid #2a3d2e', borderRadius: 8, fontSize: 12 }}
                labelStyle={{ color: '#9CA3AF' }}
                itemStyle={{ color: '#fff' }}
              />
              <Line type="monotone" dataKey="residual" stroke="#C5D921" strokeWidth={2.5} dot={{ fill: '#C5D921', r: 4 }} activeDot={{ r: 6 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-[#162018] border border-[#2a3d2e] rounded-xl overflow-hidden">
        <div className="px-5 py-4 border-b border-[#2a3d2e] flex items-center gap-3">
          <Target size={15} className="text-[#C5D921]" />
          <h3 className="text-white font-semibold text-sm">Matrice des Scénarios de Stress</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#1a2e1d]">
                {['Scénario', 'Réduction', 'Zone III %', 'Capital Résiduel', 'Variation', 'Objectif Atteint'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-widest">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-[#1a2e1d] bg-red-500/5">
                <td className="px-4 py-3 text-xs text-white font-semibold">Situation Actuelle</td>
                <td className="px-4 py-3 text-xs font-mono text-gray-300">—</td>
                <td className="px-4 py-3 text-xs font-mono font-bold text-red-400">{CURRENT_ZONE3}%</td>
                <td className="px-4 py-3 text-xs font-mono text-white">43 431.81 Md</td>
                <td className="px-4 py-3 text-xs font-mono text-gray-500">—</td>
                <td className="px-4 py-3">
                  <Badge variant="critical">NON</Badge>
                </td>
              </tr>
              {stressScenarios.map((s, i) => (
                <tr key={s.reduction} className={`border-b border-[#1a2e1d] transition-colors hover:bg-[#1a2e1d] ${s.reduction === 25 ? 'bg-[#1B6D3A]/10' : ''}`}>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-white font-semibold">Scénario {i + 1}</span>
                      {s.reduction === 25 && <Badge variant="success">OPTIMAL</Badge>}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-xs font-mono font-bold text-[#C5D921]">-{s.reduction}%</td>
                  <td className="px-4 py-3 text-xs font-mono font-bold text-[#4ade80]">{s.zone3Pct}%</td>
                  <td className="px-4 py-3 text-xs font-mono text-white">{s.residualCapital.toFixed(0)} Md</td>
                  <td className="px-4 py-3 text-xs font-mono text-red-400">-{((43431.81 - s.residualCapital)).toFixed(0)} Md</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1.5 text-emerald-400">
                      <CheckCircle size={13} />
                      <Badge variant="success">OUI</Badge>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
