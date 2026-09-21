'use client';

import React, { useState, useEffect } from 'react';
import { complaintsService } from '@/lib/services/complaintsService';
import { Complaint } from '@/lib/types';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { CategoryBadge } from '@/components/ui/CategoryBadge';
import { formatDate } from '@/lib/utils';
import { 
  ShieldCheck, 
  ShieldAlert, 
  Check, 
  X, 
  Eye, 
  EyeOff, 
  AlertTriangle, 
  Sparkles,
  Search
} from 'lucide-react';

export default function ModeracionPage() {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [filter, setFilter] = useState<'all' | 'approved' | 'pending'>('all');
  const [search, setSearch] = useState('');

  const loadData = () => {
    const all = complaintsService.getAllForAdmin();
    setComplaints(all);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleToggleApproval = (complaintId: string, currentApproved: boolean) => {
    complaintsService.setModerationStatus(complaintId, !currentApproved);
    loadData();
  };

  const handleToggleVisibility = (complaintId: string, currentPublic: boolean) => {
    complaintsService.setModerationStatus(complaintId, true, !currentPublic);
    loadData();
  };

  const filtered = complaints.filter((c) => {
    if (filter === 'approved' && !c.isApproved) return false;
    if (filter === 'pending' && c.isApproved) return false;
    if (search) {
      const q = search.toLowerCase();
      return (
        c.title.toLowerCase().includes(q) ||
        c.description.toLowerCase().includes(q) ||
        c.trackingCode.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#E8E4EF]">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#391759]">
            Control de Calidad & Privacidad
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-[#17151D] tracking-tight mt-0.5">
            Panel de Moderación de Contenidos
          </h1>
          <p className="text-xs sm:text-sm text-[#6B6875]">
            Revisá reportes para evitar acusaciones personales indebidas, filtración de datos sensibles o contenido no verificado.
          </p>
        </div>

        <div className="p-3 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0" />
          <span>No publicar domicilios particulares ni datos de personas físicas.</span>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="bg-white p-4 rounded-2xl border border-[#E8E4EF] shadow-lla-soft flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
              filter === 'all'
                ? 'bg-[#391759] text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Todos ({complaints.length})
          </button>
          <button
            onClick={() => setFilter('approved')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
              filter === 'approved'
                ? 'bg-[#391759] text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Aprobados ({complaints.filter((c) => c.isApproved).length})
          </button>
          <button
            onClick={() => setFilter('pending')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
              filter === 'pending'
                ? 'bg-[#391759] text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Pendientes / Ocultos ({complaints.filter((c) => !c.isApproved || !c.isPublic).length})
          </button>
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Buscar reporte..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-purple-400 focus:outline-none"
          />
        </div>
      </div>

      {/* Moderation List */}
      <div className="space-y-4">
        {filtered.map((c) => (
          <div
            key={c.id}
            className={`p-5 rounded-2xl bg-white border transition-all ${
              c.isApproved && c.isPublic
                ? 'border-[#E8E4EF] shadow-lla-soft'
                : 'border-amber-300 bg-amber-50/20 shadow-sm'
            }`}
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              
              {/* Content info */}
              <div className="space-y-2 max-w-3xl">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs font-mono font-bold text-purple-900 bg-purple-50 px-2.5 py-0.5 rounded border border-purple-200">
                    {c.trackingCode}
                  </span>
                  <CategoryBadge categoryId={c.categoryId} size="sm" />
                  <StatusBadge status={c.status} size="sm" />
                  
                  {c.isApproved ? (
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      <Check className="w-3 h-3" /> Aprobado
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded border border-amber-300">
                      <AlertTriangle className="w-3 h-3" /> No aprobado
                    </span>
                  )}

                  {c.isPublic ? (
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-purple-700 bg-purple-50 px-2 py-0.5 rounded">
                      <Eye className="w-3 h-3" /> Público
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                      <EyeOff className="w-3 h-3" /> Privado
                    </span>
                  )}
                </div>

                <h3 className="text-base font-bold text-[#17151D]">{c.title}</h3>
                <p className="text-xs text-[#6B6875] leading-relaxed line-clamp-2">
                  {c.description}
                </p>

                <div className="text-[11px] text-slate-500 flex flex-wrap gap-4">
                  <span><strong>Barrio:</strong> {c.neighborhood?.name}</span>
                  <span><strong>Vecino:</strong> {c.contactName} ({c.contactEmail})</span>
                  <span><strong>Fecha:</strong> {formatDate(c.createdAt)}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex sm:flex-col gap-2 shrink-0 justify-end">
                <button
                  type="button"
                  onClick={() => handleToggleApproval(c.id, c.isApproved)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1.5 ${
                    c.isApproved
                      ? 'bg-amber-100 text-amber-900 hover:bg-amber-200'
                      : 'bg-emerald-600 text-white hover:bg-emerald-700'
                  }`}
                >
                  {c.isApproved ? <X className="w-3.5 h-3.5" /> : <Check className="w-3.5 h-3.5" />}
                  <span>{c.isApproved ? 'Desaprobar' : 'Aprobar para publicación'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleToggleVisibility(c.id, c.isPublic)}
                  className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors flex items-center justify-center gap-1.5"
                >
                  {c.isPublic ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  <span>{c.isPublic ? 'Ocultar del mapa' : 'Mostrar en el mapa'}</span>
                </button>
              </div>

            </div>
          </div>
        ))}
      </div>

    </div>
  );
}
