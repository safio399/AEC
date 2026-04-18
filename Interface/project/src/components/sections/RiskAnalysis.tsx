import React, { useState } from 'react';
import { MapPin, TrendingUp, Loader2, AlertTriangle } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import SectionHeader from '../ui/SectionHeader';
import Badge from '../ui/Badge';
import SeismicMap from '../ui/SeismicMap';
import { usePortfolioData } from '../../hooks/usePortfolioData';
import type { SeismicZone } from '../../types';

const VIEW_MODES = ['grid', 'map'] as const;
type ViewMode = (typeof VIEW_MODES)[number];

const ZONE_COLORS: Record<string, string> = {
  'Zone 0': '#1B6D3A',
  'Zone I': '#2E8B57',
  'Zone II': '#F59E00',
  'Zone IIa': '#F59E00',
  'Zone IIb': '#EF4444',
  'Zone III': '#991B1B',
  '0': '#1B6D3A',
  '1': '#2E8B57',
  '2': '#F59E00',
  '3': '#991B1B',
};

const RISK_BG: Record<string, string> = {
  'Zone 0': 'bg-[#1B6D3A]/10 border-[#1B6D3A]/20',
  'Zone I': 'bg-[#2E8B57]/10 border-[#2E8B57]/20',
  'Zone II': 'bg-[#F59E00]/10 border-[#F59E00]/20',
  'Zone IIa': 'bg-[#F59E00]/10 border-[#F59E00]/20',
  'Zone IIb': 'bg-[#EF4444]/10 border-[#EF4444]/20',
  'Zone III': 'bg-[#991B1B]/10 border-[#991B1B]/30',
  '0': 'bg-[#1B6D3A]/10 border-[#1B6D3A]/20',
  '1': 'bg-[#2E8B57]/10 border-[#2E8B57]/20',
  '2': 'bg-[#F59E00]/10 border-[#F59E00]/20',
  '3': 'bg-[#991B1B]/10 border-[#991B1B]/30',
};

export default function RiskAnalysis() {
  const { wilayas, isLoading, isError } = usePortfolioData();
  const [selectedZone, setSelectedZone] = useState<SeismicZone | 'all'>('all');
  const [viewMode, setViewMode] = useState<ViewMode>('map');
  const [hoveredWilaya, setHoveredWilaya] = useState<number | null>(null);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
        <Loader2 className="w-12 h-12 text-[#C5D921] animate-spin" />
        <p className="text-gray-400 font-medium animate-pulse uppercase tracking-[0.2em] text-xs">Loading Geospatial Data...</p>
      </div>
    );
  }

  if (isError || !wilayas) {
    return (
      <div className="bg-red-950/20 border border-red-900/50 rounded-xl p-12 text-center space-y-4">
        <AlertTriangle className="w-12 h-12 text-red-500 mx-auto" />
        <h3 className="text-xl font-bold text-white">Geospatial Service Offline</h3>
        <p className="text-gray-400 max-w-md mx-auto">Impossible de charger la carte des risques. Vérifiez que le serveur backend est en ligne.</p>
      </div>
    );
  }

  const filtered = selectedZone === 'all' ? wilayas : wilayas.filter((w) => w.zone === selectedZone);
  const topWilayas = [...wilayas].sort((a, b) => b.capital - a.capital).slice(0, 15);
  const zones: (SeismicZone | 'all')[] = ['all', 'Zone 0', 'Zone I', 'Zone II', 'Zone IIa', 'Zone IIb', 'Zone III'];

  const getRiskColor = (score: number) => {
    if (score >= 85) return '#DC3545';
    if (score >= 65) return '#FFC107';
    if (score >= 40) return '#C5D921';
    if (score >= 20) return '#4ade80';
    return '#1B6D3A';
  };

  return (
    <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
      <SectionHeader
        icon={MapPin}
        title="Analyse du Risque Sismique"
        subtitle="Distribution en temps réel des 51 wilayas selon le zonage RPA 99"
        badge={<Badge variant="critical">{wilayas.filter((w) => w.riskScore >= 85).length} Hotspots Critiques</Badge>}
      />

      <div className="flex gap-2 flex-wrap">
        {zones.map((z) => (
          <button
            key={z}
            onClick={() => setSelectedZone(z)}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all duration-150 ${
              selectedZone === z
                ? z === 'all'
                  ? 'bg-white/10 border-white/30 text-white shadow-lg'
                  : `border-transparent text-[#0D1510] shadow-lg shadow-${z}/20`
                : 'bg-transparent border-[#2a3d2e] text-gray-400 hover:border-[#C5D921]/50 hover:text-white hover:shadow-md'
            }`}
            style={selectedZone === z && z !== 'all' ? { backgroundColor: ZONE_COLORS[z as SeismicZone] } : {}}
          >
            {z === 'all' ? 'Toutes les zones' : z}
          </button>
        ))}
        <span className="ml-auto text-xs text-gray-500 flex items-center font-mono">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse mr-2" />
          {filtered.length} wilayas connectées
        </span>
      </div>

      <div className="flex bg-[#162018] border border-[#2a3d2e] rounded-lg p-1 w-fit">
        <button
          onClick={() => setViewMode('map')}
          className={`px-4 py-1.5 rounded-md text-xs font-medium transition-all ${
            viewMode === 'map' ? 'bg-[#1B6D3A] text-white shadow-lg shadow-black/20' : 'text-gray-500 hover:text-gray-300'
          }`}
        >
          Vue Carte 3D
        </button>
        <button
          onClick={() => setViewMode('grid')}
          className={`px-4 py-1.5 rounded-md text-xs font-medium transition-all ${
            viewMode === 'grid' ? 'bg-[#1B6D3A] text-white shadow-lg shadow-black/20' : 'text-gray-500 hover:text-gray-300'
          }`}
        >
          Vue Grille
        </button>
      </div>

      {viewMode === 'map' ? (
        <SeismicMap wilayas={filtered} />
      ) : (
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-7 xl:grid-cols-9 gap-2">
          {filtered.map((w) => {
            const isHovered = hoveredWilaya === w.code;
            const zoneColor = ZONE_COLORS[w.zone] || '#3B82F6';
            const isHighRisk = (w.riskScore || 0) >= 85;

            return (
              <div
                key={w.code}
                onMouseEnter={() => setHoveredWilaya(w.code)}
                onMouseLeave={() => setHoveredWilaya(null)}
                className={`relative rounded-lg border cursor-pointer transition-all duration-150 p-2 text-center group ${RISK_BG[w.zone] || 'bg-gray-800/10 border-gray-800/20'} ${
                  isHovered ? 'scale-110 z-10 shadow-xl shadow-black/50 border-white/20' : 'hover:scale-105'
                }`}
              >
                <div
                  className="w-2 h-2 rounded-full mx-auto mb-1"
                  style={{
                    backgroundColor: zoneColor,
                    boxShadow: isHighRisk ? `0 0 6px ${zoneColor}` : 'none',
                  }}
                />
                <p className="text-[9px] font-semibold text-white leading-tight truncate">
                  {w.name?.length > 10 ? `${w.name.slice(0, 8)}..` : w.name}
                </p>
                <p className="text-[8px] text-gray-500 mt-0.5 font-mono">{w.code?.toString().padStart(2, '0')}</p>

                {isHighRisk && (
                  <span className="absolute -top-1 -right-1 text-[8px] bg-red-500 text-white rounded-full w-3.5 h-3.5 flex items-center justify-center font-bold">
                    !
                  </span>
                )}

                {isHovered && (
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-[#0D1510] border border-[#2a3d2e] rounded-lg p-3 shadow-2xl z-50 w-48 text-left pointer-events-none animate-in fade-in zoom-in duration-200">
                    <p className="text-white font-bold text-xs mb-2 border-b border-[#2a3d2e] pb-1.5">
                      {w.name || 'Wilaya Inconnue'}
                    </p>
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="text-gray-400">Zone</span>
                        <span className="font-semibold" style={{ color: zoneColor }}>
                          {w.zone || 'N/A'}
                        </span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-gray-400">Polices</span>
                        <span className="text-white font-mono">{(w.policies || 0).toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-gray-400">Capital</span>
                        <span className="text-white font-mono">{(w.capital || 0).toFixed(1)} Md</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-gray-400">Score Risque</span>
                        <span className="font-semibold font-mono" style={{ color: getRiskColor(w.riskScore || 0) }}>
                          {Math.round(w.riskScore || 0)}/100
                        </span>
                      </div>
                      <div className="mt-2 h-1.5 bg-[#1a2e1d] rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full"
                          style={{
                            width: `${Math.min(100, Math.max(0, w.riskScore || 0))}%`,
                            backgroundColor: getRiskColor(w.riskScore || 0),
                          }}
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      <div className="bg-[#162018] border border-[#2a3d2e] rounded-xl p-5 bg-gradient-to-t from-[#0D1510] to-[#162018]">
        <div className="flex items-center gap-3 mb-5">
          <TrendingUp size={16} className="text-[#C5D921]" />
          <h3 className="text-white font-semibold text-sm uppercase tracking-wider">Top 15 Wilayas — Capital Exposé (Md DZD)</h3>
        </div>
        <ResponsiveContainer width="100%" height={240}>
          <BarChart data={topWilayas} layout="vertical" margin={{ top: 0, right: 20, left: 80, bottom: 0 }}>
            <XAxis type="number" tick={{ fill: '#6B7280', fontSize: 10 }} axisLine={false} tickLine={false} />
            <YAxis type="category" dataKey="name" tick={{ fill: '#9CA3AF', fontSize: 10 }} axisLine={false} tickLine={false} width={80} />
            <Tooltip
              formatter={(value) => [`${Number(value ?? 0).toFixed(1)} Md DZD`, 'Capital']}
              contentStyle={{
                background: '#0D1510',
                border: '1px solid #2a3d2e',
                borderRadius: 8,
                fontSize: 12,
                boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.5)',
              }}
              labelStyle={{ color: '#9CA3AF' }}
              itemStyle={{ color: '#fff' }}
            />
            <Bar dataKey="capital" radius={[0, 4, 4, 0]}>
              {topWilayas.map((w, i) => (
                <Cell key={`cell-${i}`} fill={ZONE_COLORS[w.zone as SeismicZone] || '#3B82F6'} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}