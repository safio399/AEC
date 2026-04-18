import React, { useState, useEffect } from 'react';
import { Bell, RefreshCw, Sun, Moon, AlertTriangle } from 'lucide-react';

interface HeaderProps {
  dark: boolean;
  onToggleDark: () => void;
}

export default function Header({ dark, onToggleDark }: HeaderProps) {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  return (
    <header className="h-16 flex items-center justify-between px-6 border-b border-[#1a2e1d] bg-[#0D1510] sticky top-0 z-20">
      <div className="flex items-center gap-4">
        <div>
          <p className="text-white font-bold text-sm leading-none">Plateforme CATNAT Intelligence</p>
          <p className="text-gray-500 text-xs mt-0.5">Risque Sismique — Algérie</p>
        </div>
        <div className="hidden md:flex items-center gap-1.5 bg-red-500/10 border border-red-500/25 rounded-full px-3 py-1">
          <AlertTriangle size={11} className="text-red-400" />
          <span className="text-red-400 text-xs font-semibold">Zone III Critique · 6.64%</span>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="hidden sm:block text-right">
          <p className="text-white text-sm font-mono font-semibold leading-none">
            {time.toLocaleTimeString('fr-FR')}
          </p>
          <p className="text-gray-500 text-xs mt-0.5">
            {time.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' })}
          </p>
        </div>

        <div className="h-6 w-px bg-[#2a3d2e]" />

        <button className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-[#1a2e1d] transition-colors relative">
          <Bell size={16} />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-[#C5D921] rounded-full" />
        </button>

        <button className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-[#1a2e1d] transition-colors">
          <RefreshCw size={16} />
        </button>

        <button
          onClick={onToggleDark}
          className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-[#1a2e1d] transition-colors"
        >
          {dark ? <Sun size={16} /> : <Moon size={16} />}
        </button>

        <div className="flex items-center gap-2 ml-1 bg-[#1B6D3A]/20 border border-[#1B6D3A]/40 rounded-lg px-3 py-1.5">
          <div className="w-6 h-6 rounded-full bg-[#1B6D3A] flex items-center justify-center">
            <span className="text-[#C5D921] text-xs font-bold">G</span>
          </div>
          <span className="text-white text-xs font-semibold hidden sm:block">Admin</span>
        </div>
      </div>
    </header>
  );
}
