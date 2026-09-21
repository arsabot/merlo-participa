'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { Complaint, ComplaintStatus } from '@/lib/types';
import { NEIGHBORHOODS, COMPLAINT_CATEGORIES, COMPLAINT_STATUS_CONFIG, MERLO_MAP_CONFIG } from '@/lib/constants';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { CategoryBadge } from '@/components/ui/CategoryBadge';
import { SupportButton } from './SupportButton';
import { 
  Filter, 
  MapPin, 
  Layers, 
  Search, 
  ArrowRight, 
  Maximize2, 
  LocateFixed, 
  Eye,
  X
} from 'lucide-react';

interface MerloPublicMapProps {
  complaints: Complaint[];
}

export const MerloPublicMap: React.FC<MerloPublicMapProps> = ({ complaints }) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersLayerRef = useRef<any>(null);

  const [selectedNeighborhood, setSelectedNeighborhood] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [activeComplaint, setActiveComplaint] = useState<Complaint | null>(null);
  const [isMapReady, setIsMapReady] = useState(false);

  // Filter complaints
  const filteredComplaints = complaints.filter((c) => {
    if (selectedNeighborhood !== 'all' && c.neighborhoodId !== selectedNeighborhood) return false;
    if (selectedCategory !== 'all' && c.categoryId !== selectedCategory) return false;
    if (selectedStatus !== 'all' && c.status !== selectedStatus) return false;
    return true;
  });

  // Initialize Map
  useEffect(() => {
    if (typeof window === 'undefined' || !mapContainerRef.current) return;

    let isMounted = true;

    async function initMap() {
      const L = (await import('leaflet')).default;
      
      if (!document.getElementById('leaflet-css')) {
        const link = document.createElement('link');
        link.id = 'leaflet-css';
        link.rel = 'stylesheet';
        link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
        document.head.appendChild(link);
      }

      if (!mapContainerRef.current || mapInstanceRef.current) return;

      const map = L.map(mapContainerRef.current, {
        center: MERLO_MAP_CONFIG.center,
        zoom: MERLO_MAP_CONFIG.defaultZoom,
        minZoom: MERLO_MAP_CONFIG.minZoom,
        maxZoom: MERLO_MAP_CONFIG.maxZoom,
      });

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      }).addTo(map);

      const markersLayer = L.layerGroup().addTo(map);
      markersLayerRef.current = markersLayer;
      mapInstanceRef.current = map;

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

  // Update Markers when complaints or filters change
  useEffect(() => {
    if (!mapInstanceRef.current || !markersLayerRef.current) return;

    async function updateMarkers() {
      const L = (await import('leaflet')).default;
      markersLayerRef.current.clearLayers();

      filteredComplaints.forEach((c) => {
        const lat = c.latitude || (c.neighborhood ? c.neighborhood.latitude : -34.6653);
        const lng = c.longitude || (c.neighborhood ? c.neighborhood.longitude : -58.7292);

        const statusConf = COMPLAINT_STATUS_CONFIG[c.status] || COMPLAINT_STATUS_CONFIG.recibido;
        const cat = COMPLAINT_CATEGORIES.find((k) => k.id === c.categoryId);
        const pinColor = statusConf.color;

        const customIcon = L.divIcon({
          className: 'public-map-pin',
          html: `
            <div style="
              background-color: ${pinColor};
              width: 30px;
              height: 30px;
              border-radius: 50% 50% 50% 0;
              transform: rotate(-45deg);
              display: flex;
              align-items: center;
              justify-content: center;
              border: 2px solid white;
              box-shadow: 0 4px 10px rgba(0,0,0,0.3);
              cursor: pointer;
            ">
              <div style="
                width: 8px;
                height: 8px;
                background: white;
                border-radius: 50%;
                transform: rotate(45deg);
              "></div>
            </div>
          `,
          iconSize: [30, 30],
          iconAnchor: [15, 30],
          popupAnchor: [0, -28],
        });

        const marker = L.marker([lat, lng], { icon: customIcon });

        marker.on('click', () => {
          setActiveComplaint(c);
        });

        markersLayerRef.current.addLayer(marker);
      });
    }

    updateMarkers();
  }, [filteredComplaints]);

  const handleZoomToNeighborhood = (nId: string) => {
    setSelectedNeighborhood(nId);
    if (!mapInstanceRef.current) return;
    if (nId === 'all') {
      mapInstanceRef.current.setView(MERLO_MAP_CONFIG.center, 13);
      return;
    }
    const n = NEIGHBORHOODS.find((item) => item.id === nId);
    if (n) {
      mapInstanceRef.current.setView([n.latitude, n.longitude], 14, { animate: true });
    }
  };

  return (
    <div className="space-y-4">
      {/* Controls Bar */}
      <div className="bg-white p-4 rounded-2xl border border-[#E8E4EF] shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs font-bold uppercase tracking-wider text-[#391759] flex items-center gap-1.5">
            <Filter className="w-4 h-4" />
            <span>Filtros:</span>
          </span>

          {/* Neighborhood filter */}
          <select
            value={selectedNeighborhood}
            onChange={(e) => handleZoomToNeighborhood(e.target.value)}
            className="text-xs font-semibold bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-700 focus:outline-none focus:ring-2 focus:ring-purple-400"
          >
            <option value="all">Todos los Barrios de Merlo</option>
            {NEIGHBORHOODS.map((n) => (
              <option key={n.id} value={n.id}>
                {n.name}
              </option>
            ))}
          </select>

          {/* Category filter */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="text-xs font-semibold bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-700 focus:outline-none focus:ring-2 focus:ring-purple-400"
          >
            <option value="all">Todas las Categorías</option>
            {COMPLAINT_CATEGORIES.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>

          {/* Status filter */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="text-xs font-semibold bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-700 focus:outline-none focus:ring-2 focus:ring-purple-400"
          >
            <option value="all">Todos los Estados</option>
            {Object.entries(COMPLAINT_STATUS_CONFIG).map(([key, val]) => (
              <option key={key} value={key}>
                {val.label}
              </option>
            ))}
          </select>
        </div>

        <div className="text-xs text-slate-500 font-medium">
          Mostrando <strong>{filteredComplaints.length}</strong> {filteredComplaints.length === 1 ? 'reporte' : 'reportes'} en el mapa
        </div>
      </div>

      {/* Map & Detail Split View */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 h-[650px]">
        {/* Map Container */}
        <div className="lg:col-span-2 relative rounded-2xl overflow-hidden border border-[#E8E4EF] shadow-lla-soft bg-slate-100">
          <div ref={mapContainerRef} className="w-full h-full" />

          {!isMapReady && (
            <div className="absolute inset-0 flex items-center justify-center bg-slate-100/90 text-slate-500 text-sm gap-2">
              <span className="w-4 h-4 rounded-full border-2 border-purple-600 border-t-transparent animate-spin" />
              <span>Cargando mapa interactivo...</span>
            </div>
          )}

          {/* Floating Map Legend */}
          <div className="absolute bottom-4 left-4 z-[400] bg-white/95 backdrop-blur-md p-3 rounded-xl border border-purple-200 shadow-md max-w-xs text-[11px] space-y-1.5 hidden sm:block">
            <span className="font-bold text-slate-800 block text-xs mb-1">Referencias de estado:</span>
            <div className="grid grid-cols-2 gap-x-2 gap-y-1 text-slate-600">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#64748B]" /> Recibido
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#D97706]" /> En revisión
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#2563EB]" /> Validado
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#4F46E5]" /> Derivado
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#7C3AED]" /> En seguimiento
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#059669]" /> Resuelto
              </span>
            </div>
          </div>
        </div>

        {/* Selected Complaint Card Drawer / List */}
        <div className="bg-white rounded-2xl border border-[#E8E4EF] p-5 shadow-lla-soft overflow-y-auto flex flex-col justify-between">
          {activeComplaint ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <CategoryBadge categoryId={activeComplaint.categoryId} size="sm" />
                  <StatusBadge status={activeComplaint.status} size="sm" />
                </div>
                <button
                  onClick={() => setActiveComplaint(null)}
                  className="p-1 text-slate-400 hover:text-slate-700 rounded-md"
                  title="Cerrar detalle"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div>
                <span className="text-[11px] font-mono font-semibold text-purple-700 bg-purple-50 px-2 py-0.5 rounded border border-purple-200">
                  {activeComplaint.trackingCode}
                </span>
                <h3 className="text-base font-bold text-[#17151D] mt-2">
                  {activeComplaint.title}
                </h3>
                <p className="text-xs text-[#6B6875] mt-1.5 leading-relaxed line-clamp-4">
                  {activeComplaint.description}
                </p>
              </div>

              {activeComplaint.attachments && activeComplaint.attachments.length > 0 && (
                <div className="relative h-32 rounded-xl overflow-hidden bg-slate-100 border border-slate-200">
                  <img
                    src={activeComplaint.attachments[0].fileUrl}
                    alt={activeComplaint.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              <div className="space-y-2 text-xs text-slate-600 bg-purple-50/40 p-3 rounded-xl border border-purple-100">
                <div className="flex items-center gap-1.5 font-medium text-slate-800">
                  <MapPin className="w-3.5 h-3.5 text-[#391759]" />
                  <span>{activeComplaint.neighborhood?.name || 'Merlo'}</span>
                </div>
                {activeComplaint.address && (
                  <p className="text-slate-500 text-[11px]">
                    {activeComplaint.address}
                  </p>
                )}
              </div>

              <div className="pt-2 flex items-center justify-between gap-3">
                <SupportButton
                  complaintId={activeComplaint.id}
                  initialCount={activeComplaint.supportCount}
                  size="sm"
                />

                <Link
                  href={`/reclamos/${activeComplaint.id}`}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-white bg-[#391759] hover:bg-[#240c3a] transition-colors"
                >
                  <span>Ficha completa</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-400">
              <MapPin className="w-12 h-12 text-purple-200 mb-3 stroke-1" />
              <h4 className="text-sm font-bold text-slate-700">Explorador de Reclamos</h4>
              <p className="text-xs text-slate-500 mt-1 max-w-xs">
                Hacé clic en cualquier marcador del mapa de Merlo para ver la información y apoyar el reclamo.
              </p>
            </div>
          )}

          {/* Quick list of top complaints */}
          {!activeComplaint && (
            <div className="mt-4 pt-4 border-t border-slate-100 space-y-2">
              <span className="text-xs font-bold text-slate-700 block">Reportes destacados en Merlo:</span>
              <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                {filteredComplaints.slice(0, 4).map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveComplaint(item);
                      if (mapInstanceRef.current && item.latitude && item.longitude) {
                        mapInstanceRef.current.setView([item.latitude, item.longitude], 15);
                      }
                    }}
                    className="w-full text-left p-2.5 rounded-xl border border-slate-100 hover:border-purple-200 hover:bg-purple-50/40 transition-colors block"
                  >
                    <div className="flex items-center justify-between text-[11px] mb-1">
                      <span className="font-semibold text-purple-800">{item.neighborhood?.name}</span>
                      <StatusBadge status={item.status} size="sm" showIcon={false} />
                    </div>
                    <p className="text-xs font-medium text-[#17151D] truncate">{item.title}</p>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
