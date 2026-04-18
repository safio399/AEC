import React from 'react';
import type { LucideIcon } from 'lucide-react';

interface SectionHeaderProps {
  icon: LucideIcon;
  title: string;
  subtitle?: string;
  badge?: React.ReactNode;
}

export default function SectionHeader({ icon: Icon, title, subtitle, badge }: SectionHeaderProps) {
  return (
    <div className="flex items-start justify-between mb-6">
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-[#1B6D3A]/30 text-[#C5D921]">
          <Icon size={20} />
        </div>
        <div>
          <h2 className="text-lg font-bold text-white leading-tight">{title}</h2>
          {subtitle && <p className="text-sm text-gray-400 mt-0.5">{subtitle}</p>}
        </div>
      </div>
      {badge && <div>{badge}</div>}
    </div>
  );
}
