import React, { useState } from 'react';
import Sidebar from './components/layout/Sidebar';
import Header from './components/layout/Header';
import Overview from './components/sections/Overview';
import RiskAnalysis from './components/sections/RiskAnalysis';
import PMLScenarios from './components/sections/PMLScenarios';
import StressTesting from './components/sections/StressTesting';
import Reinsurance from './components/sections/Reinsurance';
import FinancialMetrics from './components/sections/FinancialMetrics';
import MLPredictions from './components/sections/MLPredictions';
import SimulationEngine from './components/sections/SimulationEngine';
import Recommendations from './components/sections/Recommendations';
import { usePortfolioData } from './hooks/usePortfolioData';
import type { NavSection } from './types';

const SECTION_COMPONENTS: Record<NavSection, React.ComponentType<{}>> = {
  overview: Overview,
  risk: RiskAnalysis,
  simulation: SimulationEngine,
  pml: PMLScenarios,
  stress: StressTesting,
  reinsurance: Reinsurance,
  financial: FinancialMetrics,
  ml: MLPredictions,
  recommendations: Recommendations,
};

export default function App() {
  const [activeSection, setActiveSection] = useState<NavSection>('overview');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [darkMode, setDarkMode] = useState(true);

  const { summary } = usePortfolioData();
  const ActiveSection = SECTION_COMPONENTS[activeSection];

  return (
    <div className="min-h-screen bg-[#0A120C] text-white font-sans">
      <Sidebar
        active={activeSection}
        onNavigate={setActiveSection}
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed((p) => !p)}
      />

      <div
        className="transition-all duration-300 flex flex-col min-h-screen"
        style={{ marginLeft: sidebarCollapsed ? '4rem' : '14rem' }}
      >
        <Header dark={darkMode} onToggleDark={() => setDarkMode((p) => !p)} />

        <main className="flex-1 p-6 overflow-auto">
          <div className="max-w-7xl mx-auto">
            <ActiveSection />
          </div>
        </main>

        <footer className="px-6 py-3 border-t border-[#1a2e1d] flex items-center justify-between">
          <p className="text-xs text-gray-600">
            GAM Assurances · Plateforme CATNAT Intelligence © 2026
          </p>
          <div className="flex items-center gap-4">
            <span className="text-xs text-gray-600 font-mono">
              {summary ? `${summary.totalPolicies.toLocaleString()} polices` : 'Chargement...'} · 51 wilayas
            </span>
            <div className="flex items-center gap-1.5">
              <div className={`w-1.5 h-1.5 rounded-full ${summary ? 'bg-[#4ade80]' : 'bg-gray-600'} animate-pulse`} />
              <span className="text-xs text-gray-600">
                {summary ? 'Données en direct' : 'Reconnexion...'}
              </span>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
