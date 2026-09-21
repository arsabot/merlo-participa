'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { Complaint } from '@/lib/types';
import { NEIGHBORHOODS, COMPLAINT_CATEGORIES, COMPLAINT_STATUS_CONFIG, MERLO_MAP_CONFIG } from '@/lib/constants';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { CategoryBadge } from '@/components/ui/CategoryBadge';
import { SupportButton } from './SupportButton';
import { 
  Filter, 
  MapPin, 
  ArrowRight, 
  LocateFixed, 
  Compass,
  X,
  Layers,
  ChevronRight,
  ExternalLink
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
  const [showLegendMobile, setShowLegendMobile] = useState(false);

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
        zoomControl: false,
      });

      // Add zoom control at top right for clean mobile UI
      L.control.zoom({ position: 'topright' }).addTo(map);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      }).addTo(map);

      const markersLayer = L.layerGroup().addTo(map);
      markersLayerRef.current = markersLayer;
      mapInstanceRef.current = map;

      // Invalidate size on load
      setTimeout(() => {
        if (mapInstanceRef.current) {
          mapInstanceRef.current.invalidateSize();
        }
      }, 250);

      if (isMounted) setIsMapReady(true);
    }

    initMap();

    const handleResize = () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.invalidateSize();
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      isMounted = false;
      window.removeEventListener('resize', handleResize);
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
        const pinColor = statusConf.color;

        const customIcon = L.divIcon({
          className: 'public-map-pin',
          html: `
            <div style="
              background-color: ${pinColor};
              width: 32px;
              height: 32px;
              border-radius: 50% 50% 50% 0;
              transform: rotate(-45deg);
              display: flex;
              align-items: center;
              justify-content: center;
              border: 2.5px solid white;
              box-shadow: 0 4px 12px rgba(0,0,0,0.35);
              cursor: pointer;
            ">
              <div style="
                width: 9px;
                height: 9px;
                background: white;
                border-radius: 50%;
                transform: rotate(45deg);
              "></div>
            </div>
          `,
          iconSize: [32, 32],
          iconAnchor: [16, 32],
          popupAnchor: [0, -30],
        });

        const marker = L.marker([lat, lng], { icon: customIcon });

        marker.on('click', () => {
          setActiveComplaint(c);
          if (mapInstanceRef.current) {
            mapInstanceRef.current.panTo([lat, lng], { animate: true });
          }
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
      mapInstanceRef.current.setView(MERLO_MAP_CONFIG.center, 13, { animate: true });
      return;
    }
    const n = NEIGHBORHOODS.find((item) => item.id === nId);
    if (n) {
      mapInstanceRef.current.setView([n.latitude, n.longitude], 14, { animate: true });
    }
  };

  const handleCenterOnMerlo = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.setView(MERLO_MAP_CONFIG.center, 13, { animate: true });
    }
  };

  const handleLocateUser = () => {
    if (!navigator.geolocation || !mapInstanceRef.current) return;
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        mapInstanceRef.current.setView([latitude, longitude], 15, { animate: true });
      },
      () => {
        handleCenterOnMerlo();
      }
    );
  };

  return (
    <div className="space-y-4">
      {/* Controls / Filter Bar */}
      <div className="bg-white p-3.5 sm:p-4 rounded-2xl border border-[#E2E8F0] shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs font-bold uppercase tracking-wider text-[#0B4F8A] flex items-center gap-1.5 shrink-0">
            <Filter className="w-3.5 h-3.5" />
            <span>Filtrar:</span>
          </span>

          {/* Neighborhood filter */}
          <select
            value={selectedNeighborhood}
            onChange={(e) => handleZoomToNeighborhood(e.target.value)}
            className="text-xs font-semibold bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl px-3 py-2 text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#0284C7] flex-1 sm:flex-none"
          >
            <option value="all">📍 Todos los Barrios de Merlo</option>
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
            className="text-xs font-semibold bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl px-3 py-2 text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#0284C7] flex-1 sm:flex-none"
          >
            <option value="all">📂 Todas las Categorías</option>
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
            className="text-xs font-semibold bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl px-3 py-2 text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#0284C7] flex-1 sm:flex-none"
          >
            <option value="all">🚦 Todos los Estados</option>
            {Object.entries(COMPLAINT_STATUS_CONFIG).map(([key, val]) => (
              <option key={key} value={key}>
                {val.label}
              </option>
            ))}
          </select>
        </div>

        <div className="text-xs text-slate-500 font-medium flex items-center justify-between md:justify-end gap-2 pt-2 md:pt-0 border-t md:border-t-0 border-slate-100">
          <span>
            Mostrando <strong>{filteredComplaints.length}</strong> {filteredComplaints.length === 1 ? 'reporte' : 'reportes'}
          </span>
          <button
            type="button"
            onClick={() => setShowLegendMobile(!showLegendMobile)}
            className="sm:hidden text-[11px] font-bold text-[#0B4F8A] flex items-center gap-1 bg-sky-50 px-2 py-1 rounded-lg"
          >
            <Layers className="w-3 h-3" />
            <span>{showLegendMobile ? 'Ocultar guía' : 'Ver guía'}</span>
          </button>
        </div>
      </div>

      {/* Main Map Container & Desktop Sidebar */}
      <div className="flex flex-col lg:grid lg:grid-cols-3 gap-5 lg:h-[700px]">
        
        {/* Map Viewport - Expansive & Mobile-First */}
        <div className="lg:col-span-2 relative w-full h-[62vh] min-h-[460px] sm:min-h-[520px] lg:h-full rounded-3xl overflow-hidden border border-[#E2E8F0] shadow-sm bg-slate-100">
          <div ref={mapContainerRef} className="w-full h-full" />

          {!isMapReady && (
            <div className="absolute inset-0 flex items-center justify-center bg-slate-100/90 text-slate-500 text-sm gap-2 z-[400]">
              <span className="w-5 h-5 rounded-full border-2 border-[#0B4F8A] border-t-transparent animate-spin" />
              <span className="font-semibold">Cargando mapa interactivo de Merlo...</span>
            </div>
          )}

          {/* Quick Floating Action Buttons (Top Left) */}
          <div className="absolute top-4 left-4 z-[400] flex flex-col gap-2">
            <button
              type="button"
              onClick={handleCenterOnMerlo}
              title="Centrar en Merlo"
              className="bg-white/95 backdrop-blur-md p-2.5 rounded-xl border border-[#E2E8F0] shadow-md hover:bg-sky-50 text-[#0B4F8A] transition-all flex items-center gap-1.5 text-xs font-bold"
            >
              <Compass className="w-4 h-4 text-[#0B4F8A]" />
              <span className="hidden sm:inline">Centrar Merlo</span>
            </button>

            <button
              type="button"
              onClick={handleLocateUser}
              title="Mi ubicación"
              className="bg-white/95 backdrop-blur-md p-2.5 rounded-xl border border-[#E2E8F0] shadow-md hover:bg-sky-50 text-slate-700 transition-all flex items-center gap-1.5 text-xs font-bold"
            >
              <LocateFixed className="w-4 h-4 text-[#0B4F8A]" />
              <span className="hidden sm:inline">Mi ubicación</span>
            </button>
          </div>

          {/* Floating Map Legend (Desktop or Mobile Toggle) */}
          {(showLegendMobile || true) && (
            <div className={`absolute top-4 right-14 sm:top-auto sm:bottom-4 sm:left-4 z-[400] bg-white/95 backdrop-blur-md p-3 rounded-2xl border border-sky-200 shadow-lg text-[11px] space-y-1.5 ${showLegendMobile ? 'block' : 'hidden sm:block'} max-w-xs`}>
              <span className="font-bold text-slate-800 block text-xs mb-1">
                Referencias de estado:
              </span>
              <div className="grid grid-cols-2 gap-x-3 gap-y-1 text-slate-600 font-medium">
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#64748B]" /> Recibido
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#D97706]" /> En revisión
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#0284C7]" /> Validado
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#0B4F8A]" /> Derivado
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#0EA5E9]" /> En seguimiento
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#059669]" /> Resuelto
                </span>
              </div>
            </div>
          )}

          {/* Mobile Interactive Marker Bottom Sheet (When marker is tapped on mobile) */}
          {activeComplaint && (
            <div className="lg:hidden absolute bottom-3 left-3 right-3 z-[450] bg-white/95 backdrop-blur-md rounded-2xl p-4 border border-sky-200 shadow-2xl animate-in slide-in-from-bottom-4 duration-200">
              <div className="flex items-start justify-between gap-2 pb-2 border-b border-slate-100">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <CategoryBadge categoryId={activeComplaint.categoryId} size="sm" />
                  <StatusBadge status={activeComplaint.status} size="sm" />
                </div>
                <button
                  type="button"
                  onClick={() => setActiveComplaint(null)}
                  className="p-1 text-slate-400 hover:text-slate-700 rounded-lg"
                  aria-label="Cerrar detalle"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="mt-2 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-bold text-sky-900 bg-sky-50 px-2 py-0.5 rounded border border-sky-100">
                    {activeComplaint.trackingCode}
                  </span>
                  <span className="text-[11px] font-semibold text-slate-500">
                    {activeComplaint.neighborhood?.name || 'Merlo'}
                  </span>
                </div>
                <h3 className="text-sm font-bold text-[#0F172A] line-clamp-1">
                  {activeComplaint.title}
                </h3>
                <p className="text-xs text-[#64748B] line-clamp-2 leading-snug">
                  {activeComplaint.description}
                </p>
              </div>

              <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
                <SupportButton
                  complaintId={activeComplaint.id}
                  initialCount={activeComplaint.supportCount}
                  size="sm"
                />

                <Link
                  href={`/reclamos/${activeComplaint.id}`}
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold text-white bg-[#0B4F8A] hover:bg-[#072C4F] shadow-sm"
                >
                  <span>Ver reclamo</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Desktop Sidebar / Mobile Secondary List */}
        <div className="bg-white rounded-3xl border border-[#E2E8F0] p-5 shadow-sm flex flex-col justify-between overflow-y-auto">
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
                <span className="text-[11px] font-mono font-semibold text-sky-800 bg-sky-50 px-2 py-0.5 rounded border border-sky-200">
                  {activeComplaint.trackingCode}
                </span>
                <h3 className="text-base font-bold text-[#0F172A] mt-2">
                  {activeComplaint.title}
                </h3>
                <p className="text-xs text-[#64748B] mt-1.5 leading-relaxed line-clamp-4">
                  {activeComplaint.description}
                </p>
              </div>

              {activeComplaint.attachments && activeComplaint.attachments.length > 0 && (
                <div className="relative h-36 rounded-2xl overflow-hidden bg-slate-100 border border-slate-200">
                  <img
                    src={activeComplaint.attachments[0].fileUrl}
                    alt={activeComplaint.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              <div className="space-y-2 text-xs text-slate-600 bg-sky-50/40 p-3.5 rounded-2xl border border-sky-100">
                <div className="flex items-center gap-1.5 font-bold text-slate-800">
                  <MapPin className="w-3.5 h-3.5 text-[#0B4F8A]" />
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
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-white bg-[#0B4F8A] hover:bg-[#072C4F] transition-colors shadow-sm"
                >
                  <span>Ficha completa</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-400">
              <div className="w-14 h-14 rounded-2xl bg-[#F0F7FF] text-[#0B4F8A] flex items-center justify-center mb-3">
                <MapPin className="w-7 h-7" />
              </div>
              <h4 className="text-sm font-bold text-slate-800">Explorador de Reclamos</h4>
              <p className="text-xs text-slate-500 mt-1 max-w-xs">
                Tocá cualquier marcador en el mapa de Merlo para ver la información del problema y sumar tu adhesión.
              </p>
            </div>
          )}

          {/* Quick list of top complaints */}
          {!activeComplaint && (
            <div className="mt-4 pt-4 border-t border-slate-100 space-y-2">
              <span className="text-xs font-bold text-slate-700 block">Reportes destacados en Merlo:</span>
              <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                {filteredComplaints.slice(0, 5).map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveComplaint(item);
                      if (mapInstanceRef.current && item.latitude && item.longitude) {
                        mapInstanceRef.current.setView([item.latitude, item.longitude], 15, { animate: true });
                      }
                    }}
                    className="w-full text-left p-3 rounded-2xl border border-slate-100 hover:border-sky-200 hover:bg-sky-50/40 transition-colors block"
                  >
                    <div className="flex items-center justify-between text-[11px] mb-1">
                      <span className="font-bold text-sky-900">{item.neighborhood?.name}</span>
                      <StatusBadge status={item.status} size="sm" showIcon={false} />
                    </div>
                    <p className="text-xs font-semibold text-[#0F172A] truncate">{item.title}</p>
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
