import React from 'react';

type Variant = 'critical' | 'high' | 'medium' | 'low' | 'success' | 'info' | 'zone0' | 'zone1' | 'zone2' | 'zone3';

const variants: Record<Variant, string> = {
  critical: 'bg-red-500/15 text-red-400 border border-red-500/30',
  high: 'bg-orange-500/15 text-orange-400 border border-orange-500/30',
  medium: 'bg-yellow-500/15 text-yellow-400 border border-yellow-500/30',
  low: 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30',
  success: 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30',
  info: 'bg-blue-500/15 text-blue-400 border border-blue-500/30',
  zone0: 'bg-[#1B6D3A]/20 text-[#4ade80] border border-[#1B6D3A]/40',
  zone1: 'bg-[#2E8B57]/20 text-[#6ee7a0] border border-[#2E8B57]/40',
  zone2: 'bg-[#8BC34A]/20 text-[#a8d060] border border-[#8BC34A]/40',
  zone3: 'bg-[#C5D921]/20 text-[#C5D921] border border-[#C5D921]/40',
};

interface BadgeProps {
  variant: Variant;
  children: React.ReactNode;
  size?: 'sm' | 'md';
}

export default function Badge({ variant, children, size = 'sm' }: BadgeProps) {
  return (
    <span className={`inline-flex items-center font-semibold rounded-full ${
      size === 'sm' ? 'text-xs px-2 py-0.5' : 'text-sm px-3 py-1'
    } ${variants[variant]}`}>
      {children}
    </span>
  );
}
