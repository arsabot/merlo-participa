'use client';

import React, { useEffect, useRef, useState } from 'react';
import { NEIGHBORHOODS, MERLO_MAP_CONFIG } from '@/lib/constants';
import { MapPin, LocateFixed, Info } from 'lucide-react';

interface MerloMapSelectorProps {
  selectedNeighborhoodId: string;
  latitude?: number;
  longitude?: number;
  onLocationChange: (lat: number, lng: number, neighborhoodId: string) => void;
}

export const MerloMapSelector: React.FC<MerloMapSelectorProps> = ({
  selectedNeighborhoodId,
  latitude,
  longitude,
  onLocationChange,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markerRef = useRef<any>(null);
  const [isMapReady, setIsMapReady] = useState(false);

  // Initialize Leaflet Map
  useEffect(() => {
    if (typeof window === 'undefined' || !mapContainerRef.current) return;

    let isMounted = true;

    async function initMap() {
      const L = (await import('leaflet')).default;
      // Load leaflet css dynamically if not loaded
      if (!document.getElementById('leaflet-css')) {
        const link = document.createElement('link');
        link.id = 'leaflet-css';
        link.rel = 'stylesheet';
        link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
        document.head.appendChild(link);
      }

      if (!mapContainerRef.current || mapInstanceRef.current) return;

      const initialLat = latitude || MERLO_MAP_CONFIG.center[0];
      const initialLng = longitude || MERLO_MAP_CONFIG.center[1];

      const map = L.map(mapContainerRef.current, {
        center: [initialLat, initialLng],
        zoom: MERLO_MAP_CONFIG.defaultZoom,
        minZoom: MERLO_MAP_CONFIG.minZoom,
        maxZoom: MERLO_MAP_CONFIG.maxZoom,
      });

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(map);

      // Custom Pin Icon in Civic Blue
      const customIcon = L.divIcon({
        className: 'custom-map-pin',
        html: `<div style="background-color: #0B4F8A; width: 32px; height: 32px; border-radius: 50% 50% 50% 0; transform: rotate(-45deg); display: flex; align-items: center; justify-content: center; border: 3px solid white; box-shadow: 0 4px 10px rgba(0,0,0,0.3);"><div style="width: 10px; height: 10px; background: white; border-radius: 50%; transform: rotate(45deg);"></div></div>`,
        iconSize: [32, 32],
        iconAnchor: [16, 32],
      });

      const marker = L.marker([initialLat, initialLng], {
        icon: customIcon,
        draggable: true,
      }).addTo(map);

      marker.on('dragend', (event: any) => {
        const position = event.target.getLatLng();
        findNearestNeighborhoodAndNotify(position.lat, position.lng);
      });

      map.on('click', (e: any) => {
        marker.setLatLng(e.latlng);
        findNearestNeighborhoodAndNotify(e.latlng.lat, e.latlng.lng);
      });

      mapInstanceRef.current = map;
      markerRef.current = marker;

      setTimeout(() => {
        if (mapInstanceRef.current) {
          mapInstanceRef.current.invalidateSize();
        }
      }, 250);

      if (isMounted) setIsMapReady(true);
    }

    initMap();

    return () => {
      isMounted = false;
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  const findNearestNeighborhoodAndNotify = (lat: number, lng: number) => {
    // Find closest neighborhood from predefined coordinates
    let closestId = selectedNeighborhoodId || 'n-1';
    let minDistance = Infinity;

    NEIGHBORHOODS.forEach((n) => {
      const dist = Math.hypot(n.latitude - lat, n.longitude - lng);
      if (dist < minDistance) {
        minDistance = dist;
        closestId = n.id;
      }
    });

    onLocationChange(lat, lng, closestId);
  };

  // Center map when selected neighborhood changes from dropdown
  useEffect(() => {
    if (!mapInstanceRef.current || !selectedNeighborhoodId) return;
    const targetNeighborhood = NEIGHBORHOODS.find((n) => n.id === selectedNeighborhoodId);
    if (targetNeighborhood) {
      mapInstanceRef.current.setView([targetNeighborhood.latitude, targetNeighborhood.longitude], 14, {
        animate: true,
      });
      if (markerRef.current) {
        markerRef.current.setLatLng([targetNeighborhood.latitude, targetNeighborhood.longitude]);
      }
    }
  }, [selectedNeighborhoodId]);

  const handleCenterOnMerlo = () => {
    if (mapInstanceRef.current && markerRef.current) {
      mapInstanceRef.current.setView(MERLO_MAP_CONFIG.center, 13);
      markerRef.current.setLatLng(MERLO_MAP_CONFIG.center);
      onLocationChange(MERLO_MAP_CONFIG.center[0], MERLO_MAP_CONFIG.center[1], 'n-1');
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
          <MapPin className="w-3.5 h-3.5 text-[#0B4F8A]" />
          <span>Ubicación en el mapa de Merlo (hacé clic o arrastrá el marcador)</span>
        </label>

        <button
          type="button"
          onClick={handleCenterOnMerlo}
          className="text-xs text-[#0B4F8A] hover:underline flex items-center gap-1 font-bold"
        >
          <LocateFixed className="w-3 h-3" />
          <span>Centrar en Merlo</span>
        </button>
      </div>

      <div className="relative w-full h-80 sm:h-96 min-h-[320px] rounded-2xl overflow-hidden border border-sky-200 shadow-inner bg-slate-100">
        <div ref={mapContainerRef} className="w-full h-full" />
        
        {!isMapReady && (
          <div className="absolute inset-0 flex items-center justify-center bg-slate-100/90 text-slate-500 text-xs gap-2">
            <span className="w-3 h-3 rounded-full border-2 border-[#0B4F8A] border-t-transparent animate-spin" />
            <span>Cargando mapa de Merlo...</span>
          </div>
        )}
      </div>

      <div className="flex items-start gap-1.5 text-[11px] text-[#64748B] bg-sky-50/60 p-2.5 rounded-lg border border-sky-100">
        <Info className="w-3.5 h-3.5 text-[#0B4F8A] shrink-0 mt-0.5" />
        <span>
          Por seguridad y privacidad, la ubicación exacta nunca se expone con numeración domiciliaria en la vista pública; se muestra la referencia barrial aproximada.
        </span>
      </div>
    </div>
  );
};
