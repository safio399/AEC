import React, { useState } from 'react';
import { Lightbulb, ChevronDown, ChevronUp, Clock, User, Target, Zap } from 'lucide-react';
import SectionHeader from '../ui/SectionHeader';
import Badge from '../ui/Badge';
import { strategicRecs } from '../../data/mockData';
import type { StrategicRec } from '../../types';

const PRIORITY_STYLES = {
  CRITICAL: {
    border: 'border-red-500/30',
    bg: 'bg-red-500/5',
    badge: 'critical' as const,
    icon: 'bg-red-500/20 text-red-400',
    dot: 'bg-red-500',
  },
  HIGH: {
    border: 'border-yellow-500/25',
    bg: 'bg-yellow-500/5',
    badge: 'high' as const,
    icon: 'bg-yellow-500/20 text-yellow-400',
    dot: 'bg-yellow-400',
  },
  MEDIUM: {
    border: 'border-blue-500/25',
    bg: 'bg-blue-500/5',
    badge: 'info' as const,
    icon: 'bg-blue-500/20 text-blue-400',
    dot: 'bg-blue-400',
  },
};

const REC_ICONS = [Zap, Target, Lightbulb, Lightbulb];

interface RecCardProps {
  rec: StrategicRec;
  index: number;
}

function RecCard({ rec, index }: RecCardProps) {
  const [expanded, setExpanded] = useState(index < 2);
  const s = PRIORITY_STYLES[rec.priority];
  const Icon = REC_ICONS[index] || Lightbulb;

  return (
    <div className={`rounded-xl border transition-all duration-200 hover:shadow-lg cursor-pointer ${s.border} ${s.bg} hover:border-opacity-60`}>
      <button
        className="w-full flex items-center justify-between p-5 text-left"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center gap-4">
          <div className={`p-2.5 rounded-lg flex-shrink-0 ${s.icon}`}>
            <Icon size={18} />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-mono font-bold text-gray-500">{rec.id}</span>
              <Badge variant={s.badge}>{rec.priority}</Badge>
            </div>
            <h3 className="text-white font-bold text-sm leading-tight">{rec.title}</h3>
          </div>
        </div>
        <div className="flex-shrink-0 ml-4 text-gray-500">
          {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </div>
      </button>

      {expanded && (
        <div className="px-5 pb-5 border-t border-[#2a3d2e]/50 pt-4">
          <p className="text-gray-300 text-sm leading-relaxed mb-4">{rec.description}</p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="bg-[#0D1510]/60 rounded-lg p-3 border border-[#2a3d2e]">
              <div className="flex items-center gap-1.5 mb-2">
                <Target size={12} className="text-[#C5D921]" />
                <span className="text-xs font-semibold text-gray-400 uppercase tracking-widest">Impact Attendu</span>
              </div>
              <p className="text-xs text-white leading-relaxed">{rec.impact}</p>
            </div>
            <div className="bg-[#0D1510]/60 rounded-lg p-3 border border-[#2a3d2e]">
              <div className="flex items-center gap-1.5 mb-2">
                <Clock size={12} className="text-[#C5D921]" />
                <span className="text-xs font-semibold text-gray-400 uppercase tracking-widest">Timeline</span>
              </div>
              <p className="text-xs text-white font-mono">{rec.timeline}</p>
            </div>
            <div className="bg-[#0D1510]/60 rounded-lg p-3 border border-[#2a3d2e]">
              <div className="flex items-center gap-1.5 mb-2">
                <User size={12} className="text-[#C5D921]" />
                <span className="text-xs font-semibold text-gray-400 uppercase tracking-widest">Responsable</span>
              </div>
              <p className="text-xs text-white font-semibold">{rec.owner}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function Recommendations() {
  const criticalCount = strategicRecs.filter(r => r.priority === 'CRITICAL').length;
  const highCount = strategicRecs.filter(r => r.priority === 'HIGH').length;

  return (
    <div className="space-y-8">
      <SectionHeader
        icon={Lightbulb}
        title="Recommandations Stratégiques"
        subtitle="4 recommandations prioritaires · Actions immédiates requises"
        badge={<Badge variant="critical">{criticalCount} CRITIQUES</Badge>}
      />

      <div className="grid grid-cols-3 gap-4">
        <div className="bg-red-500/10 border border-red-500/25 rounded-xl p-4 text-center hover:bg-red-500/15 hover:border-red-500/40 hover:shadow-lg transition-all duration-200 cursor-pointer">
          <p className="text-4xl font-black text-red-400 font-mono">{criticalCount}</p>
          <p className="text-xs text-gray-400 mt-1 uppercase tracking-widest">Priorité Critique</p>
          <p className="text-xs text-red-400/70 mt-1">Action immédiate</p>
        </div>
        <div className="bg-yellow-500/10 border border-yellow-500/25 rounded-xl p-4 text-center hover:bg-yellow-500/15 hover:border-yellow-500/40 hover:shadow-lg transition-all duration-200 cursor-pointer">
          <p className="text-4xl font-black text-yellow-400 font-mono">{highCount}</p>
          <p className="text-xs text-gray-400 mt-1 uppercase tracking-widest">Priorité Haute</p>
          <p className="text-xs text-yellow-400/70 mt-1">Dans 3 mois</p>
        </div>
        <div className="bg-[#162018] border border-[#2a3d2e] rounded-xl p-4 text-center hover:bg-[#1a2820] hover:border-[#C5D921]/40 hover:shadow-lg transition-all duration-200 cursor-pointer">
          <p className="text-4xl font-black text-[#C5D921] font-mono">12</p>
          <p className="text-xs text-gray-400 mt-1 uppercase tracking-widest">Mois Horizon</p>
          <p className="text-xs text-gray-600 mt-1">Plan stratégique</p>
        </div>
      </div>

      <div className="space-y-4">
        {strategicRecs.map((rec, i) => (
          <RecCard key={rec.id} rec={rec} index={i} />
        ))}
      </div>

      <div className="bg-[#1B6D3A]/10 border border-[#1B6D3A]/30 rounded-xl p-6">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-[#C5D921]/15 rounded-xl">
            <Lightbulb size={20} className="text-[#C5D921]" />
          </div>
          <div>
            <h3 className="text-white font-bold text-sm mb-2">Synthèse Exécutive</h3>
            <p className="text-gray-300 text-sm leading-relaxed">
              L'analyse du portefeuille CATNAT de GAM Assurances révèle une{' '}
              <span className="text-[#C5D921] font-semibold">concentration critique en Zone III (6.64%)</span>{' '}
              et un ratio de solvabilité insuffisant de 2.37%. Les actions prioritaires sont :{' '}
              <span className="text-white font-semibold">(1)</span> l'implémentation immédiate de la Stratégie A de réassurance,{' '}
              <span className="text-white font-semibold">(2)</span> la restriction des souscriptions en Zone III,{' '}
              <span className="text-white font-semibold">(3)</span> le développement du portefeuille en Zone 0/I.{' '}
              Ces actions combinées permettront de réduire le PML 1-in-250 de{' '}
              <span className="text-red-400 font-semibold">523 Md DZD</span> à{' '}
              <span className="text-[#4ade80] font-semibold">103 Md DZD</span> (réduction de 80%).
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
