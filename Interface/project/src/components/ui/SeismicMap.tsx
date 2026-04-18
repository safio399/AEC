import { useEffect, useRef } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { MapboxOverlay } from '@deck.gl/mapbox';
import { ScatterplotLayer } from '@deck.gl/layers';
import type { Wilaya } from '../../types';

interface SeismicMapProps {
  wilayas: Wilaya[];
  selectedWilaya?: string;
}

const INITIAL_VIEW = {
  center: [3.0, 32.0] as [number, number],
  zoom: 4.5,
  pitch: 45,
  bearing: 0,
};

const DARK_STYLE = {
  version: 8,
  sources: {
    'carto-dark': {
      type: 'raster',
      tiles: ['https://basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png'],
      tileSize: 256,
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
    },
  },
  layers: [
    {
      id: 'carto-dark-layer',
      type: 'raster',
      source: 'carto-dark',
      minzoom: 0,
      maxzoom: 20,
    },
  ],
};

export default function SeismicMap({ wilayas, selectedWilaya }: SeismicMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const overlayRef = useRef<MapboxOverlay | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const map = new maplibregl.Map({
      container: containerRef.current,
      style: DARK_STYLE as any,
      ...INITIAL_VIEW,
      attributionControl: false,
    });

    map.addControl(new maplibregl.NavigationControl(), 'top-left');

    const overlay = new MapboxOverlay({
      layers: [],
      interleaving: true,
    });
    map.addControl(overlay as any);

    mapRef.current = map;
    overlayRef.current = overlay;

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
      overlayRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (!overlayRef.current || wilayas.length === 0) return;

    const layer = new ScatterplotLayer({
      id: 'wilayas',
      data: wilayas,
      pickable: true,
      opacity: 1,
      stroked: true,
      filled: true,
      radiusUnits: 'meters',
      getPosition: (d: Wilaya) => [d.lon || 3.0, d.lat || 36.0],
      getRadius: (d: Wilaya) => (d.radius || 15000) * 1.5,
      getFillColor: (d: Wilaya) => {
        if (d.name === selectedWilaya) return [59, 130, 246, 120];
        const z = String(d.zone);
        if (z.includes('III') || z === '3') return [153, 27, 27, 60];
        if (z.includes('II') || z === '2') return [245, 158, 0, 60];
        if (z.includes('I') || z === '1') return [251, 191, 36, 60];
        return [16, 185, 129, 60];
      },
      getLineColor: (d: Wilaya) => {
        if (d.name === selectedWilaya) return [255, 255, 255, 255];
        const z = String(d.zone);
        if (z.includes('III') || z === '3') return [153, 27, 27, 255];
        if (z.includes('II') || z === '2') return [245, 158, 0, 255];
        if (z.includes('I') || z === '1') return [251, 191, 36, 255];
        return [16, 185, 129, 255];
      },
      getLineWidth: (d: Wilaya) => (d.name === selectedWilaya ? 4 : 2),
      lineWidthMinPixels: 2,
      updateTriggers: {
        getFillColor: [selectedWilaya],
        getLineColor: [selectedWilaya],
        getLineWidth: [selectedWilaya],
      },
    });

    overlayRef.current.setProps({ layers: [layer] });
  }, [wilayas, selectedWilaya]);

  return (
    <div className="relative w-full h-[500px] rounded-xl overflow-hidden border border-[#2a3d2e]">
      <div ref={containerRef} className="w-full h-full" />
      <div className="absolute bottom-4 right-4 bg-[#0D1510]/80 backdrop-blur-md border border-[#2a3d2e] p-3 rounded-lg flex flex-col gap-2 z-10">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full" style={{ background: '#ef4444' }} />
          <span className="text-[10px] text-gray-300">Zone III — Élevé</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full" style={{ background: '#f59e0b' }} />
          <span className="text-[10px] text-gray-300">Zone II — Moyen</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full" style={{ background: '#facc15' }} />
          <span className="text-[10px] text-gray-300">Zone I — Faible</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full" style={{ background: '#10b981' }} />
          <span className="text-[10px] text-gray-300">Zone 0 — Nul/Négligeable</span>
        </div>
      </div>
    </div>
  );
}
