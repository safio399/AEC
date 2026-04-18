import React from 'react';
import {
  XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar, Cell, PieChart, Pie
} from 'recharts';
import { usePortfolioData } from '../../hooks/usePortfolioData';
import Badge from '../ui/Badge';
import { Shield, Zap, AlertTriangle, CheckCircle2, Loader2 } from 'lucide-react';

export default function Overview() {
  const { summary, zoneData, communeRisks, isLoading, isError } = usePortfolioData();

  const fmt = (n: number) => new Intl.NumberFormat('fr-DZ', { maximumFractionDigits: 1 }).format(n);
  const fmtFull = (n: number) => new Intl.NumberFormat('fr-DZ').format(Math.round(n));

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
        <Loader2 className="w-12 h-12 text-blue-500 animate-spin" />
        <p className="text-gray-400 font-medium animate-pulse uppercase tracking-[0.2em] text-xs">Loading Live Portfolio Data...</p>
      </div>
    );
  }

  if (isError || !summary) {
    return (
      <div className="bg-red-950/20 border border-red-900/50 rounded-xl p-12 text-center space-y-4">
        <AlertTriangle className="w-12 h-12 text-red-500 mx-auto" />
        <h3 className="text-xl font-bold text-white">Data Connection Error</h3>
        <p className="text-gray-400 max-w-md mx-auto">Impossible de se connecter au serveur backend. Les données affichées peuvent être obsolètes.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-12">
      {/* Portfolio Summary Header */}
      <div className="bg-[#162018] border border-[#2a3d2e] rounded-xl p-8 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4">
           <Badge variant="success">
             <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse mr-2" />
             LIVE DATA ACTIVE
           </Badge>
        </div>

        <div className="flex items-center gap-4 mb-10">
          <div className="bg-blue-600 w-10 h-10 flex items-center justify-center rounded-lg text-white font-bold text-2xl shadow-lg shadow-blue-600/20">1</div>
          <div>
            <h2 className="text-3xl font-bold text-white tracking-tight">Portfolio Summary</h2>
            <p className="text-gray-500 text-sm font-medium">Real-time exposure and capital indicators</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="space-y-1">
            <p className="text-gray-500 text-[10px] font-black uppercase tracking-wider">Total Policies</p>
            <p className="text-4xl font-bold text-white tabular-nums">{fmtFull(summary.totalPolicies)}</p>
            <div className="flex items-center gap-1.5 text-emerald-400 text-sm font-medium pt-1">
              <CheckCircle2 size={14} /> Verified
            </div>
          </div>
          <div className="space-y-1">
            <p className="text-gray-500 text-[10px] font-black uppercase tracking-wider">Total Capital</p>
            <p className="text-4xl font-bold text-white tabular-nums">{fmt(summary.totalCapital)}B</p>
            <div className="flex items-center gap-1.5 text-blue-400 text-sm font-medium pt-1">
              <Shield size={14} /> CATNAT Covered
            </div>
          </div>
          <div className="space-y-1">
            <p className="text-gray-500 text-[10px] font-black uppercase tracking-wider">Zone III Exposure</p>
            <p className="text-4xl font-bold text-white tabular-nums">{summary.zone3CapitalPct}%</p>
            <div className="flex items-center gap-1.5 text-red-500 text-sm font-medium pt-1">
               <AlertTriangle size={14} /> High Risk
            </div>
          </div>
          <div className="space-y-1">
            <p className="text-gray-500 text-[10px] font-black uppercase tracking-wider">Data Quality</p>
            <p className="text-4xl font-bold text-[#C5D921] tabular-nums">{summary.dataQualityScore}%</p>
            <div className="flex items-center gap-1.5 text-[#C5D921] text-sm font-medium pt-1">
              <Zap size={14} /> Excellent
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Capital by Seismic Zone */}
        <div className="bg-[#162018] rounded-xl shadow-sm p-8 border border-[#2a3d2e] bg-gradient-to-t from-[#0D1510] to-[#162018]">
          <h3 className="text-xl font-bold text-white mb-8 border-l-4 border-red-800 pl-4">Capital by Seismic Zone (DZD)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={zoneData || []} margin={{ top: 20, right: 30, left: 10, bottom: 0 }}>
              <XAxis dataKey="zone" tick={{ fill: '#9CA3AF', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#9CA3AF', fontSize: 11 }} axisLine={false} tickLine={false} unit="B" />
              <Tooltip 
                cursor={{ fill: '#C5D921', opacity: 0.1 }} 
                contentStyle={{ borderRadius: '12px', border: '1px solid #2a3d2e', background: '#0D1510', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.5)' }} 
                labelStyle={{ color: '#9CA3AF' }} 
                itemStyle={{ color: '#fff' }} 
              />
              <Bar dataKey="capital" radius={[6, 6, 0, 0]} barSize={50}>
                {(zoneData || []).map((entry: any, index: number) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* % Capital Distribution */}
        <div className="bg-[#162018] rounded-xl shadow-sm p-8 border border-[#2a3d2e] bg-gradient-to-t from-[#0D1510] to-[#162018]">
          <h3 className="text-xl font-bold text-white mb-8 border-l-4 border-emerald-500 pl-4">% Capital Exposure Allocation</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 items-center">
            <ResponsiveContainer width="100%" height={320}>
              <PieChart>
                <Pie
                  data={zoneData || []}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={2}
                  dataKey="pct"
                  nameKey="zone"
                  label={({ name, value }) => `${value}%`}
                >
                  {(zoneData || []).map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={entry.color} stroke="#0D1510" strokeWidth={2} />
                  ))}
                </Pie>
                <Tooltip 
                   contentStyle={{ borderRadius: '12px', border: '1px solid #2a3d2e', background: '#0D1510', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.5)' }}
                   labelStyle={{ color: '#9CA3AF' }}
                   itemStyle={{ color: '#fff' }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-4 px-8">
              {(zoneData || []).map((entry: any, index: number) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.color }} />
                    <span className="text-sm font-medium text-gray-400">{entry.zone}</span>
                  </div>
                  <span className="text-sm font-bold text-white">{entry.pct}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Top 10 Zone III Communes by Capital */}
        <div className="lg:col-span-2 bg-[#162018] rounded-xl shadow-sm p-8 border border-[#2a3d2e] bg-gradient-to-t from-[#0D1510] to-[#162018]">
          <h3 className="text-xl font-bold text-white mb-8 border-l-4 border-red-600 pl-4 uppercase tracking-wider text-sm flex items-center justify-between">
            Top 10 Zone III Communes by Capital (Md DZD)
            {(!communeRisks || communeRisks.length === 0) && <span className="text-[10px] text-gray-500 font-normal">No data available</span>}
          </h3>
          <ResponsiveContainer width="100%" height={400}>
            {communeRisks && communeRisks.length > 0 ? (
              <BarChart data={communeRisks} margin={{ top: 20, right: 30, left: 10, bottom: 100 }}>
                <XAxis 
                  dataKey="name" 
                  angle={-40} 
                  textAnchor="end" 
                  interval={0} 
                  tick={{ fill: '#9CA3AF', fontSize: 10, fontWeight: 500 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis tick={{ fill: '#9CA3AF', fontSize: 11 }} axisLine={false} tickLine={false} unit=" Md" />
                <Tooltip 
                  cursor={{ fill: '#C5D921', opacity: 0.1 }} 
                  contentStyle={{ borderRadius: '12px', border: '1px solid #2a3d2e', background: '#0D1510', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.5)' }} 
                  labelStyle={{ color: '#9CA3AF' }} 
                  itemStyle={{ color: '#fff' }}
                  formatter={(value: any) => [`${Number(value).toFixed(2)} Md`, 'Capital']}
                />
                <Bar dataKey="capital" radius={[4, 4, 0, 0]}>
                  {communeRisks.map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={entry.color || '#991B1B'} />
                  ))}
                </Bar>
              </BarChart>
            ) : (
              <div className="h-full flex items-center justify-center text-gray-500 italic pb-20">
                Patientez pendant que nous calculons l'exposition par commune...
              </div>
            )}
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
