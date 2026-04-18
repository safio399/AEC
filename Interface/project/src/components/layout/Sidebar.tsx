import React from 'react';
import {
  LayoutDashboard,
  MapPin,
  Calculator,
  Zap,
  FlaskConical,
  Shield,
  TrendingUp,
  Brain,
  Lightbulb,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import type { NavSection } from '../../types';

interface NavItem {
  id: NavSection;
  label: string;
  icon: React.ElementType;
  badge?: string;
}

const navItems: NavItem[] = [
  { id: 'overview', label: 'Vue d\'ensemble', icon: LayoutDashboard },
  { id: 'risk', label: 'Analyse Sismique', icon: MapPin, badge: 'ALERTE' },
  { id: 'simulation', label: 'Moteur de Sim.', icon: Calculator, badge: 'NEW' },
  { id: 'pml', label: 'Scénarios PML', icon: Zap },
  { id: 'stress', label: 'Stress Testing', icon: FlaskConical },
  { id: 'reinsurance', label: 'Réassurance', icon: Shield },
  { id: 'financial', label: 'Métriques Fin.', icon: TrendingUp },
  { id: 'ml', label: 'Scoring ML', icon: Brain },
  { id: 'recommendations', label: 'Recommandations', icon: Lightbulb },
  { id: 'hotspots', label: 'Surconcentration', icon: AlertTriangle, badge: 'TOP 20' },
  { id: 'metrics', label: 'Métriques Clés', icon: LayoutDashboard },
];

interface SidebarProps {
  active: NavSection;
  onNavigate: (s: NavSection) => void;
  collapsed: boolean;
  onToggle: () => void;
}

export default function Sidebar({ active, onNavigate, collapsed, onToggle }: SidebarProps) {
  return (
    <aside className={`fixed left-0 top-0 h-full z-30 flex flex-col transition-all duration-300 bg-[#0D1510] border-r border-[#1a2e1d] ${
      collapsed ? 'w-16' : 'w-56'
    }`}>
      <div className={`flex items-center h-16 border-b border-[#1a2e1d] px-3 ${collapsed ? 'justify-center' : 'gap-3 px-4'}`}>
        <div className="flex-shrink-0 w-8 h-8 bg-[#1B6D3A] rounded-lg flex items-center justify-center">
          <span className="text-[#C5D921] font-black text-xs leading-none">G</span>
        </div>
        {!collapsed && (
          <div className="min-w-0">
            <p className="text-white font-bold text-sm leading-none truncate">GAM</p>
            <p className="text-[#C5D921] text-[10px] font-medium tracking-widest uppercase leading-none mt-0.5 truncate">Assurances</p>
          </div>
        )}
      </div>

      <nav className="flex-1 py-4 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = active === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`w-full flex items-center transition-all duration-150 group relative ${
                collapsed ? 'justify-center px-0 py-3' : 'gap-3 px-4 py-2.5'
              } ${
                isActive
                  ? 'bg-[#1B6D3A]/30 text-white'
                  : 'text-gray-400 hover:text-gray-200 hover:bg-[#1a2e1d]'
              }`}
            >
              {isActive && (
                <span className="absolute left-0 top-0 bottom-0 w-0.5 bg-[#C5D921] rounded-r" />
              )}
              <Icon size={18} className={isActive ? 'text-[#C5D921]' : 'group-hover:text-gray-200'} />
              {!collapsed && (
                <span className="text-sm font-medium leading-none truncate">{item.label}</span>
              )}
              {!collapsed && item.badge && (
                <span className="ml-auto text-[9px] font-bold bg-red-500/20 text-red-400 border border-red-500/30 px-1.5 py-0.5 rounded-full">
                  {item.badge}
                </span>
              )}
              {collapsed && item.badge && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
              )}
            </button>
          );
        })}
      </nav>

      <button
        onClick={onToggle}
        className="flex items-center justify-center h-10 border-t border-[#1a2e1d] text-gray-500 hover:text-gray-300 hover:bg-[#1a2e1d] transition-colors"
      >
        {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
      </button>
    </aside>
  );
}
