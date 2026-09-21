'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { complaintsService } from '@/lib/services/complaintsService';
import { Complaint, ComplaintStatus } from '@/lib/types';
import { NEIGHBORHOODS, COMPLAINT_CATEGORIES, COMPLAINT_STATUS_CONFIG } from '@/lib/constants';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { CategoryBadge } from '@/components/ui/CategoryBadge';
import { StatusChangeModal } from '@/components/admin/StatusChangeModal';
import { ExportCsvButton } from '@/components/admin/ExportCsvButton';
import { Timeline } from '@/components/complaints/Timeline';
import { formatDate, formatDateTime } from '@/lib/utils';
import { 
  Search, 
  Filter, 
  Edit3, 
  Eye, 
  Image as ImageIcon, 
  Lock, 
  User, 
  Phone, 
  Mail, 
  MapPin, 
  Calendar,
  X,
  CheckCircle2
} from 'lucide-react';

function AdminReclamosContent() {
  const searchParams = useSearchParams();
  const queryId = searchParams.get('id');

  const [search, setSearch] = useState('');
  const [selectedNeighborhood, setSelectedNeighborhood] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [complaints, setComplaints] = useState<Complaint[]>([]);

  // Selected item for drawer/modal
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);

  const loadComplaints = () => {
    const list = complaintsService.getAllForAdmin({
      search: search.trim(),
      neighborhoodId: selectedNeighborhood,
      categoryId: selectedCategory,
      status: selectedStatus === 'all' ? undefined : (selectedStatus as ComplaintStatus),
    });
    setComplaints(list);

    if (queryId) {
      const target = list.find((c) => c.id === queryId);
      if (target) setSelectedComplaint(target);
    }
  };

  useEffect(() => {
    loadComplaints();
  }, [search, selectedNeighborhood, selectedCategory, selectedStatus]);

  const handleUpdateSuccess = (updated: Complaint) => {
    setSelectedComplaint(updated);
    loadComplaints();
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#E2E8F0]">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#0B4F8A]">
            Operaciones Territoriales
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-[#0F172A] tracking-tight mt-0.5">
            Gestión Integral de Reclamos
          </h1>
          <p className="text-xs sm:text-sm text-[#64748B]">
            Administrá estados, redactá informes de gestión, agregá notas internas y consultá contactos vecinales.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <ExportCsvButton complaints={complaints} />
        </div>
      </div>

      {/* Filters & Search */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-[#E2E8F0] shadow-sm space-y-3">
        <div className="flex flex-col lg:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Buscar por código, título, nombre del vecino, email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-sky-400 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            <select
              value={selectedNeighborhood}
              onChange={(e) => setSelectedNeighborhood(e.target.value)}
              className="px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 bg-white focus:ring-2 focus:ring-sky-400 focus:outline-none"
            >
              <option value="all">Todos los Barrios</option>
              {NEIGHBORHOODS.map((n) => (
                <option key={n.id} value={n.id}>
                  {n.name}
                </option>
              ))}
            </select>

            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 bg-white focus:ring-2 focus:ring-sky-400 focus:outline-none"
            >
              <option value="all">Todas las Categorías</option>
              {COMPLAINT_CATEGORIES.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>

            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 bg-white focus:ring-2 focus:ring-sky-400 focus:outline-none"
            >
              <option value="all">Todos los Estados</option>
              {Object.entries(COMPLAINT_STATUS_CONFIG).map(([key, val]) => (
                <option key={key} value={key}>
                  {val.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Main Table + Detail Drawer Split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Table View */}
        <div className={`${selectedComplaint ? 'lg:col-span-7' : 'lg:col-span-12'} bg-white rounded-2xl border border-[#E2E8F0] shadow-sm overflow-hidden transition-all`}>
          <div className="p-4 border-b border-slate-100 flex items-center justify-between text-xs font-bold text-slate-600">
            <span>Listado de Reclamos ({complaints.length})</span>
            <span className="text-slate-400">Hacé clic en una fila para gestionar</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/70 text-slate-500 font-bold uppercase tracking-wider">
                  <th className="p-3.5">Código</th>
                  <th className="p-3.5">Título & Barrio</th>
                  <th className="p-3.5">Vecino</th>
                  <th className="p-3.5">Estado</th>
                  <th className="p-3.5 text-right">Acción</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {complaints.map((c) => {
                  const isSelected = selectedComplaint?.id === c.id;
                  return (
                    <tr
                      key={c.id}
                      onClick={() => setSelectedComplaint(c)}
                      className={`cursor-pointer transition-colors ${
                        isSelected ? 'bg-sky-50/80 border-l-4 border-l-[#0B4F8A]' : 'hover:bg-slate-50'
                      }`}
                    >
                      <td className="p-3.5 font-mono font-bold text-[#0F172A] whitespace-nowrap">
                        {c.trackingCode}
                      </td>
                      <td className="p-3.5 max-w-xs">
                        <span className="font-bold text-[#0F172A] block truncate">{c.title}</span>
                        <span className="text-[11px] text-slate-500">{c.neighborhood?.name}</span>
                      </td>
                      <td className="p-3.5 text-slate-700 whitespace-nowrap">
                        <span className="font-medium block">{c.contactName}</span>
                        <span className="text-[10px] text-slate-400">{c.contactEmail}</span>
                      </td>
                      <td className="p-3.5 whitespace-nowrap">
                        <StatusBadge status={c.status} size="sm" />
                      </td>
                      <td className="p-3.5 text-right whitespace-nowrap">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedComplaint(c);
                            setIsStatusModalOpen(true);
                          }}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold text-white bg-[#0B4F8A] hover:bg-[#072C4F] transition-colors"
                        >
                          <Edit3 className="w-3 h-3" />
                          <span>Actualizar</span>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Selected Complaint Detail Drawer */}
        {selectedComplaint && (
          <div className="lg:col-span-5 bg-white rounded-2xl border border-[#E2E8F0] p-5 sm:p-6 shadow-sm space-y-6 animate-fade-in max-h-[850px] overflow-y-auto">
            
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold text-sky-900 bg-sky-50 px-2.5 py-1 rounded border border-sky-200">
                  {selectedComplaint.trackingCode}
                </span>
                <StatusBadge status={selectedComplaint.status} size="sm" />
              </div>
              <button
                type="button"
                onClick={() => setSelectedComplaint(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Title & Description */}
            <div className="space-y-2">
              <h3 className="text-base font-bold text-[#0F172A]">
                {selectedComplaint.title}
              </h3>
              <p className="text-xs text-[#64748B] leading-relaxed whitespace-pre-line">
                {selectedComplaint.description}
              </p>
            </div>

            {/* Private Contact Box for Team */}
            <div className="p-4 rounded-xl bg-sky-50/60 border border-sky-200 space-y-2 text-xs">
              <span className="font-bold text-[#0B4F8A] flex items-center gap-1.5 uppercase text-[10px] tracking-wider">
                <Lock className="w-3.5 h-3.5 text-[#0B4F8A]" />
                <span>Datos de Contacto Privados (Solo Equipo)</span>
              </span>
              <div className="space-y-1 text-slate-700">
                <div className="flex items-center gap-2">
                  <User className="w-3.5 h-3.5 text-slate-400" />
                  <strong>Nombre:</strong> {selectedComplaint.contactName}
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-slate-400" />
                  <strong>Email:</strong> {selectedComplaint.contactEmail}
                </div>
                {selectedComplaint.contactPhone && (
                  <div className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-slate-400" />
                    <strong>Teléfono:</strong> {selectedComplaint.contactPhone}
                  </div>
                )}
                {selectedComplaint.address && (
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    <strong>Ubicación:</strong> {selectedComplaint.address}
                  </div>
                )}
              </div>
            </div>

            {/* Evidence photos */}
            {selectedComplaint.attachments && selectedComplaint.attachments.length > 0 && (
              <div className="space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-700 block">
                  Fotos de Evidencia ({selectedComplaint.attachments.length})
                </span>
                <div className="grid grid-cols-2 gap-2">
                  {selectedComplaint.attachments.map((att) => (
                    <button
                      key={att.id}
                      type="button"
                      onClick={() => setSelectedPhoto(att.fileUrl)}
                      className="relative h-24 rounded-xl overflow-hidden border border-slate-200 group"
                    >
                      <img src={att.fileUrl} alt={att.fileName} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Action button */}
            <div>
              <button
                type="button"
                onClick={() => setIsStatusModalOpen(true)}
                className="w-full py-3 rounded-xl font-bold text-xs text-white bg-[#0B4F8A] hover:bg-[#072C4F] shadow-md transition-colors flex items-center justify-center gap-2"
              >
                <Edit3 className="w-4 h-4" />
                <span>Actualizar Estado o Añadir Nota Interna</span>
              </button>
            </div>

            {/* Updates History with Internal Notes visible */}
            <div className="space-y-3 pt-3 border-t border-slate-100">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-700 block">
                Trazabilidad y Notas Internas
              </span>
              <Timeline updates={selectedComplaint.updates || []} isAdminView={true} />
            </div>

          </div>
        )}

      </div>

      {/* Status Change Modal */}
      {selectedComplaint && isStatusModalOpen && (
        <StatusChangeModal
          complaint={selectedComplaint}
          isOpen={isStatusModalOpen}
          onClose={() => setIsStatusModalOpen(false)}
          onSuccess={handleUpdateSuccess}
        />
      )}

      {/* Photo Lightbox */}
      {selectedPhoto && (
        <div
          onClick={() => setSelectedPhoto(null)}
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 cursor-zoom-out"
        >
          <div className="relative max-w-4xl max-h-[90vh] rounded-2xl overflow-hidden bg-black shadow-2xl">
            <img src={selectedPhoto} alt="Evidencia ampliada" className="w-full h-auto max-h-[85vh] object-contain" />
          </div>
        </div>
      )}

    </div>
  );
}

export default function AdminReclamosPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-slate-500 text-sm">Cargando panel...</div>}>
      <AdminReclamosContent />
    </Suspense>
  );
}
