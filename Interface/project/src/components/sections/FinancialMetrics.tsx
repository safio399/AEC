import React from 'react';
import { TrendingUp, DollarSign, Activity, Shield, PieChart as PieIcon } from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
  ComposedChart, Bar, Line,
} from 'recharts';
import SectionHeader from '../ui/SectionHeader';
import MetricCard from '../ui/MetricCard';
import { portfolioSummary, monthlyTrend } from '../../data/mockData';

const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: { name: string; value: number; color: string }[]; label?: string }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#0D1510] border border-[#2a3d2e] rounded-lg p-3 shadow-xl">
        <p className="text-gray-400 text-xs mb-2 font-medium">{label}</p>
        {payload.map((p) => (
          <p key={p.name} className="text-xs font-semibold mt-0.5" style={{ color: p.color }}>
            {p.name}: {typeof p.value === 'number' ? p.value.toFixed(1) : p.value} {p.name === 'Réserve' ? 'Md DZD' : 'Md DZD'}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

const reserveData = monthlyTrend.map(m => ({ ...m, projected: m.reserve * 1.08 }));

export default function FinancialMetrics() {
  const lossRatio = (portfolioSummary.expectedAnnualLoss / portfolioSummary.totalPremium * 100).toFixed(1);

  return (
    <div className="space-y-8">
      <SectionHeader
        icon={TrendingUp}
        title="Métriques Financières & Solvabilité"
        subtitle="Indicateurs clés du portefeuille · Projection 12 mois"
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          label="Capital Moyen / Police"
          value="1.108 Md"
          sub="DZD par contrat"
          icon={DollarSign}
          trend={0.6}
        />
        <MetricCard
          label="Prime Totale Annuelle"
          value="1 028.4 Md"
          sub="Revenus DZD 2025"
          icon={TrendingUp}
          trend={3.2}
          highlight
        />
        <MetricCard
          label="Perte Annuelle Attendue"
          value="243.6 Md"
          sub="Expected Annual Loss"
          icon={Activity}
          trend={-1.4}
        />
        <MetricCard
          label="Ratio de Solvabilité"
          value="2.37%"
          sub="Seuil réglementaire: 5%"
          icon={Shield}
          alert
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {[
          { label: 'Réserves Disponibles', value: '1 029.5 Md DZD', pct: (1029.5 / 43431.81 * 100).toFixed(2) + '%', color: '#4ade80', detail: 'du capital total' },
          { label: 'Ratio Sinistres / Primes', value: `${lossRatio}%`, pct: lossRatio + '%', color: '#FFC107', detail: 'Loss Ratio' },
          { label: 'Capital à Risque Zone III', value: '8 884.1 Md DZD', pct: '20.46%', color: '#DC3545', detail: 'du portefeuille total' },
        ].map(m => (
          <div key={m.label} className="bg-[#162018] border border-[#2a3d2e] rounded-xl p-5">
            <p className="text-xs text-gray-400 uppercase tracking-widest mb-3">{m.label}</p>
            <p className="text-2xl font-black font-mono" style={{ color: m.color }}>{m.value}</p>
            <div className="mt-3 flex items-center gap-2">
              <div className="flex-1 bg-[#0D1510] rounded-full h-1.5">
                <div className="h-full rounded-full" style={{ width: m.pct, backgroundColor: m.color, maxWidth: '100%' }} />
              </div>
              <span className="text-xs font-mono font-semibold" style={{ color: m.color }}>{m.pct}</span>
            </div>
            <p className="text-xs text-gray-600 mt-1">{m.detail}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div className="lg:col-span-3 bg-[#162018] border border-[#2a3d2e] rounded-xl p-5">
          <h3 className="text-white font-semibold text-sm mb-1">Primes vs Pertes Mensuelles</h3>
          <p className="text-gray-500 text-xs mb-5">Analyse comparative · Md DZD · 2025</p>
          <ResponsiveContainer width="100%" height={220}>
            <ComposedChart data={monthlyTrend} margin={{ top: 0, right: 4, left: -15, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1a2e1d" vertical={false} />
              <XAxis dataKey="month" tick={{ fill: '#6B7280', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#6B7280', fontSize: 10 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="premium" name="Prime" fill="#1B6D3A" radius={[2, 2, 0, 0]} opacity={0.8} />
              <Bar dataKey="loss" name="Perte" fill="#DC3545" radius={[2, 2, 0, 0]} opacity={0.8} />
              <Line type="monotone" dataKey="premium" name="Trend Prime" stroke="#C5D921" strokeWidth={1.5} dot={false} strokeDasharray="4 4" />
            </ComposedChart>
          </ResponsiveContainer>
        </div>

        <div className="lg:col-span-2 bg-[#162018] border border-[#2a3d2e] rounded-xl p-5">
          <h3 className="text-white font-semibold text-sm mb-1">Évolution Réserves</h3>
          <p className="text-gray-500 text-xs mb-5">Réel vs Projection · Md DZD</p>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={reserveData} margin={{ top: 0, right: 4, left: -15, bottom: 0 }}>
              <defs>
                <linearGradient id="resGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#1B6D3A" stopOpacity={0.5} />
                  <stop offset="95%" stopColor="#1B6D3A" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="projGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#C5D921" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#C5D921" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1a2e1d" vertical={false} />
              <XAxis dataKey="month" tick={{ fill: '#6B7280', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#6B7280', fontSize: 10 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="reserve" name="Réserve" stroke="#1B6D3A" fill="url(#resGrad)" strokeWidth={2} dot={false} />
              <Area type="monotone" dataKey="projected" name="Projection" stroke="#C5D921" fill="url(#projGrad)" strokeWidth={1.5} strokeDasharray="4 4" dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-[#162018] border border-[#2a3d2e] rounded-xl p-5">
        <h3 className="text-white font-semibold text-sm mb-4">Indicateurs de Performance Financière</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Combined Ratio', value: '123.7%', status: 'critical', sub: '> 100% = perte technique' },
            { label: 'Risk-Adj. Return', value: '4.8%', status: 'medium', sub: 'Zone 0/I optimale' },
            { label: 'Indice Herfindahl', value: '0.312', status: 'high', sub: 'Concentration modérée' },
            { label: 'Coefficient Gini', value: '0.418', status: 'medium', sub: 'Distribution inégale' },
          ].map(kpi => (
            <div key={kpi.label} className={`rounded-lg p-4 border ${
              kpi.status === 'critical' ? 'border-red-500/30 bg-red-500/5' :
              kpi.status === 'high' ? 'border-yellow-500/30 bg-yellow-500/5' :
              'border-[#2a3d2e] bg-[#0D1510]/50'
            }`}>
              <p className="text-xs text-gray-400 mb-2">{kpi.label}</p>
              <p className={`text-xl font-black font-mono ${
                kpi.status === 'critical' ? 'text-red-400' :
                kpi.status === 'high' ? 'text-yellow-400' :
                'text-[#C5D921]'
              }`}>{kpi.value}</p>
              <p className="text-[10px] text-gray-600 mt-1">{kpi.sub}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
