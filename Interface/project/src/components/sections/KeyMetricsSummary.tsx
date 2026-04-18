import React from 'react';
import { Loader2, AlertTriangle, CheckCircle2, Gauge } from 'lucide-react';
import SectionHeader from '../ui/SectionHeader';
import Badge from '../ui/Badge';
import { usePortfolioData } from '../../hooks/usePortfolioData';

export default function KeyMetricsSummary() {
  const { summary, isLoading, isError, activePolicies, wilayasCovered, communesCovered } = usePortfolioData();

  const fmt = (n: number) => new Intl.NumberFormat('fr-DZ', { maximumFractionDigits: 1 }).format(n);
  const fmtFull = (n: number) => new Intl.NumberFormat('fr-DZ').format(Math.round(n));

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-96 gap-4">
        <Loader2 className="w-12 h-12 text-blue-500 animate-spin" />
        <p className="text-gray-400 font-medium">Loading key metrics...</p>
      </div>
    );
  }

  if (isError || !summary) {
    return (
      <div className="bg-red-950/20 border border-red-900/50 rounded-xl p-12 text-center space-y-4">
        <AlertTriangle className="w-12 h-12 text-red-500 mx-auto" />
        <h3 className="text-xl font-bold text-white">Data not available</h3>
      </div>
    );
  }

  const metrics = [
    {
      label: 'Total Policies',
      value: fmtFull(summary.totalPolicies),
      status: 'success',
      icon: '✓',
    },
    {
      label: 'Active Policies',
      value: fmtFull(activePolicies || summary.totalPolicies),
      status: 'info',
      percentage: `${Math.round(((activePolicies || 0) / summary.totalPolicies) * 100)}%`,
    },
    {
      label: 'Total Capital',
      value: `$${fmt(summary.totalCapital)}B`,
      status: 'success',
      icon: '✓',
    },
    {
      label: 'Total Premium',
      value: `$${fmt(summary.totalPremium)}M`,
      status: 'success',
      icon: '✓',
    },
    {
      label: 'Avg Capital / Policy',
      value: `$${fmt(summary.avgCapitalPerPolicy)}M`,
      status: 'success',
      icon: '✓',
    },
    {
      label: 'Zone III Capital',
      value: `$${fmt(summary.zone3CapitalPct * summary.totalCapital / 100)}B`,
      status: 'warning',
      icon: '⚠️',
    },
    {
      label: 'Zone III % of Total',
      value: `${summary.zone3CapitalPct}%`,
      status: 'warning',
      icon: '⚠️',
    },
    {
      label: 'Data Quality Score',
      value: `${summary.dataQualityScore}%`,
      status: 'success',
      badge: '✓ EXCELLENT',
    },
    {
      label: 'Wilayas Covered',
      value: fmtFull(wilayasCovered || 0),
      status: 'success',
      badge: '✓ 100%',
    },
    {
      label: 'Communes Covered',
      value: fmtFull(communesCovered || 0),
      status: 'success',
      badge: '✓ 100%',
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success':
        return 'text-emerald-400';
      case 'warning':
        return 'text-yellow-400';
      case 'critical':
        return 'text-red-400';
      default:
        return 'text-gray-400';
    }
  };

  return (
    <div className="space-y-6 pb-12">
      <SectionHeader
        icon={Gauge}
        title="Key Metrics Summary"
        subtitle="Portfolio health indicators and coverage statistics"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((metric, index) => (
          <div key={index} className="bg-[#162018] rounded-xl shadow-sm p-4 border border-[#2a3d2e] hover:border-[#3a4d3e] transition-colors">
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 truncate">{metric.label}</p>
            <div className="space-y-2">
              <p className={`text-lg font-bold tabular-nums break-words ${getStatusColor(metric.status)}`}>{metric.value}</p>
              {metric.percentage && (
                <p className="text-xs font-medium text-gray-500">{metric.percentage}</p>
              )}
              {metric.icon && (
                <div className="flex items-center gap-1.5 text-xs font-medium">
                  <span>{metric.icon}</span>
                  {metric.status === 'success' && <span className="text-emerald-400">Verified</span>}
                  {metric.status === 'warning' && <span className="text-yellow-400">High</span>}
                </div>
              )}
              {metric.badge && (
                <div className="text-xs font-bold mt-2">
                  {metric.status === 'success' ? (
                    <span className="text-emerald-400">{metric.badge}</span>
                  ) : (
                    <span className="text-gray-400">{metric.badge}</span>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
