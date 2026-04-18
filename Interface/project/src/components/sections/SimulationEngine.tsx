import React, { useState, useRef, useEffect } from 'react';
import { Calculator, Zap, Target, Info } from 'lucide-react';
import SectionHeader from '../ui/SectionHeader';
import { apiClient } from '../../services/api';
import { wilayas } from '../../data/mockData';
import type { SimulationResult, PremiumPrediction } from '../../types';

function drawScatterCircle(canvas: HTMLCanvasElement, losses: number[]) {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  const dpr = window.devicePixelRatio || 1;
  const size = 300;
  canvas.width = size * dpr;
  canvas.height = size * dpr;
  canvas.style.width = size + 'px';
  canvas.style.height = size + 'px';
  ctx.scale(dpr, dpr);

  const cx = size / 2;
  const cy = size / 2;
  const radius = size / 2 - 10;
  const maxLoss = Math.max(...losses);

  ctx.clearRect(0, 0, size, size);

  const glow = ctx.createRadialGradient(cx, cy, radius - 5, cx, cy, radius + 5);
  glow.addColorStop(0, 'rgba(197, 217, 33, 0.08)');
  glow.addColorStop(1, 'transparent');
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, size, size);

  ctx.beginPath();
  ctx.arc(cx, cy, radius, 0, Math.PI * 2);
  ctx.strokeStyle = 'rgba(197, 217, 33, 0.2)';
  ctx.lineWidth = 1.5;
  ctx.stroke();

  ctx.beginPath();
  ctx.arc(cx, cy, radius - 1, 0, Math.PI * 2);
  ctx.fillStyle = 'rgba(13, 21, 16, 0.7)';
  ctx.fill();

  const n = Math.min(losses.length, 1000);
  for (let i = 0; i < n; i++) {
    let x, y;
    do {
      x = (Math.random() * 2 - 1) * (radius - 12);
      y = (Math.random() * 2 - 1) * (radius - 12);
    } while (x * x + y * y > (radius - 12) * (radius - 12));

    const loss = losses[i];
    const t = loss / maxLoss;
    const color = t > 0.7 ? '#ef4444' : t > 0.4 ? '#f59e0b' : t > 0.2 ? '#facc15' : '#4ade80';
    const dotSize = 2 + t * 4;

    ctx.beginPath();
    ctx.arc(cx + x, cy + y, dotSize, 0, Math.PI * 2);
    ctx.fillStyle = color;
    ctx.globalAlpha = 0.65;
    ctx.fill();
  }
  ctx.globalAlpha = 1;

  ctx.fillStyle = '#f0f4ff';
  ctx.font = '600 12px Inter';
  ctx.textAlign = 'center';
  ctx.fillText('MONTE CARLO', cx, cy - 8);
  ctx.font = '800 16px Inter';
  ctx.fillText(`${losses.length} sims`, cx, cy + 14);
}

export default function SimulationEngine() {
  const [selectedWilaya, setSelectedWilaya] = useState(wilayas[15]);
  const [commune, setCommune] = useState('ALGER');
  const [valeur, setValeur] = useState(149800000);
  const [buildingType, setBuildingType] = useState('Bien immobilier');
  const [loading, setLoading] = useState(false);
  const [mcResult, setMcResult] = useState<SimulationResult | null>(null);
  const [prediction, setPrediction] = useState<PremiumPrediction | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const calculatePremium = async () => {
    setLoading(true);
    try {
      const getZoneNumber = (zoneName: string) => {
        if (zoneName.includes('III')) return 3;
        if (zoneName.includes('IIb')) return 2;
        if (zoneName.includes('IIa')) return 2;
        if (zoneName.includes('II')) return 2;
        if (zoneName.includes('I')) return 1;
        if (zoneName.includes('0')) return 0;
        return 0;
      };
      const pred = await apiClient.predictPremium({
        type: buildingType,
        wilaya_name: selectedWilaya.name,
        commune_name: commune,
        valeur_assuree: valeur,
        seismic_zone: getZoneNumber(selectedWilaya.zone),
      });
      if (pred) setPrediction(pred);
    } finally {
      setLoading(false);
    }
  };

  const runSimulation = async () => {
    setLoading(true);
    try {
      const res = await apiClient.getMonteCarloSimulation(selectedWilaya.name, valeur);
      if (res)
        setMcResult({
          losses: res.losses,
          avgLoss: res.avg_loss,
          medianLoss: res.median_loss,
          worstCase95: res.worst_case_95,
          nSimulations: res.n_simulations ?? 1000,
        });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (mcResult && canvasRef.current) {
      drawScatterCircle(canvasRef.current, mcResult.losses);
    }
  }, [mcResult]);

  const fmt = (n: number) => new Intl.NumberFormat('fr-DZ', { maximumFractionDigits: 0 }).format(n);
  const fmtDec = (n: number) =>
    new Intl.NumberFormat('fr-DZ', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(n);

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-12">
      <SectionHeader
        icon={Calculator}
        title="Predictive Risk Engine"
        subtitle="Simulations stochastiques et calculs de tarification AI — Modèle CatBoost v2.1"
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-3">
          <div className="bg-[#162018] border border-[#2a3d2e] rounded-xl p-6 h-full space-y-8">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-[#1B6D3A] rounded-xl flex items-center justify-center text-[#C5D921] font-black text-2xl shadow-lg shadow-[#1B6D3A]/20 border border-[#C5D921]/10">
                G
              </div>
              <div>
                <p className="text-white font-extrabold text-lg leading-tight">GAM Assurances</p>
                <p className="text-[#C5D921] text-[10px] font-bold tracking-[0.2em] uppercase">CATNAT RISK ENGINE</p>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-[10px] text-gray-500 uppercase tracking-[0.15em] font-black mb-3 text-left">
                  BUILDING TYPE
                </label>
                <select
                  className="w-full bg-[#0D1510] border border-[#2a3d2e] rounded-lg px-4 py-3 text-white text-sm focus:border-[#C5D921] outline-none appearance-none font-bold"
                  value={buildingType}
                  onChange={(e) => setBuildingType(e.target.value)}
                >
                  <option>Bien immobilier</option>
                  <option>2 - Installation Commerciale</option>
                  <option>1 - Installation Industrielle</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] text-gray-500 uppercase tracking-[0.15em] font-black mb-3 text-left">WILAYA</label>
                <select
                  className="w-full bg-[#0D1510] border border-[#2a3d2e] rounded-lg px-4 py-3 text-white text-sm focus:border-[#C5D921] outline-none font-bold"
                  value={selectedWilaya.code}
                  onChange={(e) =>
                    setSelectedWilaya(wilayas.find((w) => w.code === parseInt(e.target.value, 10)) || wilayas[0])
                  }
                >
                  {[...wilayas].sort((a, b) => a.name.localeCompare(b.name)).map((w) => (
                    <option key={w.code} value={w.code}>
                      {w.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[10px] text-gray-500 uppercase tracking-[0.15em] font-black mb-3 text-left">COMMUNE</label>
                <input
                  type="text"
                  value={commune}
                  onChange={(e) => setCommune(e.target.value.toUpperCase())}
                  className="w-full bg-[#0D1510] border border-[#2a3d2e] rounded-lg px-4 py-3 text-white text-sm focus:border-[#C5D921] outline-none font-bold placeholder-gray-700 font-mono"
                />
              </div>

              <div>
                <label className="block text-[10px] text-gray-500 uppercase tracking-[0.15em] font-black mb-3 text-left">
                  CAPITAL ASSURÉ
                </label>
                <p className="text-2xl font-black text-[#C5D921] font-mono mb-4 text-center tracking-tight">{fmt(valeur)} DA</p>
                <input
                  type="range"
                  min="100000"
                  max="500000000"
                  step="100000"
                  className="w-full h-2 bg-[#0D1510] rounded-lg appearance-none cursor-pointer accent-[#C5D921]"
                  value={valeur}
                  onChange={(e) => setValeur(parseInt(e.target.value, 10))}
                />
                <div className="flex justify-between text-[10px] text-gray-600 mt-2 font-black uppercase tracking-wider">
                  <span>100K</span>
                  <span>500M</span>
                </div>
              </div>

              <div className="bg-[#1a1414] border border-red-900/40 rounded-xl p-4 flex gap-4 items-center mt-8">
                <div className="w-2.5 h-2.5 rounded-full bg-red-500 shadow-lg shadow-red-500/50 animate-pulse" />
                <div>
                  <p className="text-gray-500 text-[9px] font-black uppercase tracking-[0.1em]">RPA 99 Seismic Zone</p>
                  <p className="text-red-400 font-black text-sm leading-tight">
                    {selectedWilaya.zone} — <span className="text-red-300 opacity-70">High Risk</span>
                  </p>
                </div>
              </div>

              <button
                onClick={calculatePremium}
                disabled={loading}
                className="w-full bg-[#C5D921] hover:bg-[#d4e644] text-[#0A120C] font-black py-4 rounded-xl shadow-lg shadow-[#C5D921]/10 flex items-center justify-center gap-2 transition-all transform active:scale-95 text-xs uppercase tracking-[0.2em]"
              >
                {loading ? <Zap size={16} className="animate-spin" /> : <Calculator size={16} />}
                PREDICT PREMIUM
              </button>
            </div>
          </div>
        </div>

        <div className="lg:col-span-5">
          <div className="bg-[#162018] border border-[#2a3d2e] rounded-xl p-8 flex flex-col h-full overflow-hidden">
            <div className="flex items-center gap-3 mb-8">
              <span className="text-xl">🎲</span>
              <h3 className="text-white font-black text-sm uppercase tracking-[0.2em]">MONTE CARLO DISASTER SIMULATION</h3>
            </div>

            <div className="flex-1 flex flex-col items-center">
              <div className="relative mb-12">
                <canvas ref={canvasRef} className="z-10 relative" />
                {!mcResult && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center border border-dashed border-[#2a3d2e] rounded-full text-center p-8 bg-[#0D1510]/30">
                    <Target size={40} className="text-gray-800 mb-4" />
                    <p className="text-xs text-gray-500 max-w-[200px] leading-relaxed font-medium">
                      Prêt pour simuler 1,000 événements sismiques à <span className="text-white font-bold">{selectedWilaya.name}</span>
                    </p>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4 w-full mb-10">
                <div className="bg-[#0D1510]/80 border border-[#2a3d2e] p-5 rounded-xl text-center">
                  <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-2">AVERAGE LOSS</p>
                  <p className="text-lg font-black text-[#C5D921] font-mono">{mcResult ? fmt(mcResult.avgLoss) : '0'} DA</p>
                </div>
                <div className="bg-[#0D1510]/80 border border-[#2a3d2e] p-5 rounded-xl text-center">
                  <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-2">95TH PERCENTILE</p>
                  <p className="text-lg font-black text-red-500 font-mono">{mcResult ? fmt(mcResult.worstCase95) : '0'} DA</p>
                </div>
                <div className="bg-[#0D1510]/80 border border-[#2a3d2e] p-5 rounded-xl text-center">
                  <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-2">MEDIAN LOSS</p>
                  <p className="text-lg font-black text-[#C5D921] font-mono">{mcResult ? fmt(mcResult.medianLoss) : '0'} DA</p>
                </div>
                <div className="bg-[#0D1510]/80 border border-[#2a3d2e] p-5 rounded-xl text-center">
                  <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-2">SIMULATIONS</p>
                  <p className="text-lg font-black text-blue-400 font-mono">{mcResult?.nSimulations ?? 1000}</p>
                </div>
              </div>

              <button
                onClick={runSimulation}
                disabled={loading}
                className="w-full bg-[#1B6D3A]/10 hover:bg-[#1B6D3A] border border-[#1B6D3A]/30 hover:border-transparent text-[#4ade80] hover:text-white font-black py-4 rounded-xl transition-all duration-300 uppercase tracking-[0.2em] text-xs mt-auto"
              >
                ⚡ RUN SIMULATION
              </button>
            </div>
          </div>
        </div>

        <div className="lg:col-span-4">
          <div className="bg-[#162018] border border-[#2a3d2e] rounded-xl p-8 flex flex-col h-full bg-gradient-to-b from-[#162018] to-[#0D1510]">
            <div className="flex items-center gap-3 mb-10">
              <span className="text-xl">🤖</span>
              <h3 className="text-white font-black text-sm uppercase tracking-[0.2em]">AI PREMIUM PREDICTION</h3>
            </div>

            {prediction ? (
              <div className="space-y-12">
                <div className="bg-[#C5D921] rounded-xl p-8 shadow-2xl shadow-[#C5D921]/5 text-center relative overflow-hidden group">
                  <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                  <p className="text-[10px] text-[#0A120C] font-black uppercase tracking-[0.2em] mb-4">RECOMMENDED PREMIUM</p>
                  <div className="flex items-baseline justify-center gap-2">
                    <span className="text-3xl lg:text-4xl font-black text-[#0A120C] font-mono tracking-tighter">
                      {fmtDec(prediction.finalPremium)}
                    </span>
                    <span className="text-xs font-black text-[#0A120C]/70 uppercase tracking-widest">DA</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-3">
                  <div className="bg-[#0D1510] border border-[#2a3d2e] px-6 py-5 rounded-xl flex items-center justify-between">
                    <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Base AI:</span>
                    <span className="text-sm font-black text-white font-mono">{fmtDec(prediction.basePremium)} DA</span>
                  </div>
                  <div className="bg-[#0D1510] border border-[#2a3d2e] px-6 py-5 rounded-xl flex items-center justify-between">
                    <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Zone:</span>
                    <span className="text-sm font-black text-white font-semibold">{prediction.zoneLabel}</span>
                  </div>
                  <div className="bg-[#0D1510] border border-[#2a3d2e] px-6 py-5 rounded-xl flex items-center justify-between">
                    <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Multiplier:</span>
                    <span className="text-sm font-black text-[#C5D921]">×{prediction.multiplier}</span>
                  </div>
                </div>

                <div className="bg-[#C5D921]/5 border border-[#C5D921]/10 rounded-xl p-6 flex gap-4">
                  <Info size={20} className="text-[#C5D921] shrink-0" />
                  <div className="space-y-1">
                    <p className="text-[#C5D921] text-xs font-black uppercase tracking-wider">Modèle CatBoost v2.1</p>
                    <p className="text-[11px] text-gray-400 leading-relaxed font-medium">
                      Calcul haute précision intégrant la topographie sismique et la vulnérabilité du bâti local de {selectedWilaya.name}.
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center p-12 text-center opacity-40">
                <div className="w-32 h-32 rounded-3xl bg-[#0D1510] border border-[#2a3d2e] flex items-center justify-center mb-8 shadow-inner">
                  <Calculator size={48} className="text-gray-800" />
                </div>
                <p className="text-xs text-gray-500 uppercase tracking-widest font-black">Waiting for Inputs</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
