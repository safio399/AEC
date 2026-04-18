import React from 'react';
import type { LucideIcon } from 'lucide-react';

interface MetricCardProps {
  label: string;
  value: string;
  sub?: string;
  icon: LucideIcon;
  trend?: number;
  alert?: boolean;
  highlight?: boolean;
}

export default function MetricCard({ label, value, sub, icon: Icon, trend, alert, highlight }: MetricCardProps) {
  return (
    <div className={`relative rounded-xl p-5 border transition-all duration-200 hover:scale-[1.02] ${
      alert
        ? 'bg-red-950/40 border-red-500/40'
        : highlight
        ? 'bg-[#1B6D3A]/20 border-[#C5D921]/40'
        : 'bg-[#162018] border-[#2a3d2e]'
    }`}>
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <p className="text-xs font-medium uppercase tracking-widest text-gray-400 mb-1">{label}</p>
          <p className={`text-2xl font-bold font-mono leading-none ${alert ? 'text-red-400' : highlight ? 'text-[#C5D921]' : 'text-white'}`}>
            {value}
          </p>
          {sub && <p className="text-xs text-gray-500 mt-1.5">{sub}</p>}
        </div>
        <div className={`flex-shrink-0 ml-3 p-2.5 rounded-lg ${
          alert ? 'bg-red-500/15 text-red-400' : highlight ? 'bg-[#C5D921]/15 text-[#C5D921]' : 'bg-[#1B6D3A]/30 text-[#4ade80]'
        }`}>
          <Icon size={18} />
        </div>
      </div>
      {trend !== undefined && (
        <div className="mt-3 flex items-center gap-1.5">
          <span className={`text-xs font-semibold ${trend >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
            {trend >= 0 ? '+' : ''}{trend}%
          </span>
          <span className="text-xs text-gray-600">vs last month</span>
        </div>
      )}
    </div>
  );
}
