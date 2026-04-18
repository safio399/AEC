import React from 'react';
import { AlertTriangle, Loader2, AlertCircle } from 'lucide-react';
import SectionHeader from '../ui/SectionHeader';
import Badge from '../ui/Badge';
import { apiClient } from '../../services/api';

interface Hotspot {
  wilaya: string;
  commune: string;
  zone: string;
  policy_count: number;
  total_capital: number;
  pct_total_capital: number;
  concentration_flag: string;
}

export default function SurconcentrationHotspots() {
  const [hotspots, setHotspots] = React.useState<Hotspot[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isError, setIsError] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState('');

  React.useEffect(() => {
    const fetchHotspots = async () => {
      try {
        setIsLoading(true);
        setIsError(false);
        setErrorMessage('');
        const data = await apiClient.getConcentrationHotspots(20);
        if (data && data.length > 0) {
          console.log('✓ Loaded concentration hotspots:', data.length);
          setHotspots(data);
        } else {
          console.warn('⚠️ No hotspot data returned');
          setIsError(true);
          setErrorMessage('No hotspot data available');
        }
      } catch (error) {
        console.error('✗ Failed to fetch concentration hotspots:', error);
        setIsError(true);
        setErrorMessage(error instanceof Error ? error.message : 'Unknown error');
      } finally {
        setIsLoading(false);
      }
    };

    fetchHotspots();
  }, []);

  const getFlagBadge = (flag: string) => {
    if (flag.includes('CRITICAL')) {
      return <Badge variant="critical">🚩 CRITICAL</Badge>;
    }
    if (flag.includes('HIGH')) {
      return <Badge variant="high">⚠️ HIGH</Badge>;
    }
    return <Badge variant="info">{flag}</Badge>;
  };

  const fmt = (n: number) => new Intl.NumberFormat('fr-DZ', { maximumFractionDigits: 2 }).format(n);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-96 gap-4">
        <Loader2 className="w-12 h-12 text-blue-500 animate-spin" />
        <p className="text-gray-400 font-medium">Loading surconcentration hotspots...</p>
      </div>
    );
  }

  if (isError || hotspots.length === 0) {
    return (
      <div className="bg-red-950/20 border border-red-900/50 rounded-xl p-12 text-center space-y-4">
        <AlertTriangle className="w-12 h-12 text-red-500 mx-auto" />
        <h3 className="text-xl font-bold text-white">Data not available</h3>
        {errorMessage && <p className="text-gray-400 text-sm">{errorMessage}</p>}
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-12">
      <SectionHeader
        icon={AlertCircle}
        title="Surconcentration Hotspots (Top 20)"
        subtitle="Geographic concentration risks and capital exposure by commune"
      />

      <div className="bg-[#162018] rounded-xl shadow-sm border border-[#2a3d2e] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#2a3d2e] bg-[#0D1510]">
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Wilaya</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Commune</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Zone</th>
                <th className="px-6 py-4 text-right text-xs font-bold text-gray-400 uppercase tracking-wider">Policy Count</th>
                <th className="px-6 py-4 text-right text-xs font-bold text-gray-400 uppercase tracking-wider">Total Capital</th>
                <th className="px-6 py-4 text-right text-xs font-bold text-gray-400 uppercase tracking-wider">% Total Capital</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Concentration</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2a3d2e]">
              {hotspots.map((hotspot, index) => (
                <tr key={index} className="hover:bg-[#0D1510]/50 transition-colors">
                  <td className="px-6 py-4 text-sm text-white font-medium">{hotspot.wilaya}</td>
                  <td className="px-6 py-4 text-sm text-gray-300">{hotspot.commune}</td>
                  <td className="px-6 py-4 text-sm text-gray-300">{hotspot.zone}</td>
                  <td className="px-6 py-4 text-sm text-right text-gray-300">{hotspot.policy_count.toLocaleString()}</td>
                  <td className="px-6 py-4 text-sm text-right text-gray-300">{fmt(hotspot.total_capital)}</td>
                  <td className="px-6 py-4 text-sm text-right text-gray-300">{hotspot.pct_total_capital.toFixed(2)}%</td>
                  <td className="px-6 py-4 text-sm">{getFlagBadge(hotspot.concentration_flag)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
