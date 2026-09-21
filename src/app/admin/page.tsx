'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { complaintsService } from '@/lib/services/complaintsService';
import { ComplaintStats, Complaint } from '@/lib/types';
import { ExportCsvButton } from '@/components/admin/ExportCsvButton';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { CategoryBadge } from '@/components/ui/CategoryBadge';
import { formatDate } from '@/lib/utils';
import { 
  LayoutDashboard, 
  Clock, 
  Activity, 
  Send, 
  ShieldCheck, 
  CheckCircle2, 
  MapPin, 
  ArrowRight, 
  TrendingUp,
  FileText,
  BarChart3
} from 'lucide-react';

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<ComplaintStats | null>(null);
  const [allComplaints, setAllComplaints] = useState<Complaint[]>([]);

  useEffect(() => {
    const s = complaintsService.getStats();
    const list = complaintsService.getAllForAdmin();
    setStats(s);
    setAllComplaints(list);
  }, []);

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#E2E8F0]">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#0B4F8A]">
            Panel de Control
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-[#0F172A] tracking-tight mt-0.5">
            Métricas Operativas & Gestión Territorial
          </h1>
          <p className="text-xs sm:text-sm text-[#64748B]">
            Resumen estadístico de problemáticas ciudadanas en el partido de Merlo.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <ExportCsvButton complaints={allComplaints} />
          <Link
            href="/admin/reclamos"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-[#0B4F8A] hover:bg-[#072C4F] shadow-sm transition-colors"
          >
            <span>Gestionar Reclamos</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Primary KPI Grid */}
      {stats && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          
          <div className="p-5 rounded-2xl bg-white border border-[#E2E8F0] shadow-sm space-y-2">
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-xs font-bold uppercase tracking-wider">Total Recibidos</span>
              <FileText className="w-4 h-4 text-slate-400" />
            </div>
            <div className="text-3xl font-black text-slate-900">{stats.total}</div>
            <p className="text-[11px] text-slate-500">Solicitudes en el portal</p>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-[#E2E8F0] shadow-sm space-y-2">
            <div className="flex items-center justify-between text-amber-700">
              <span className="text-xs font-bold uppercase tracking-wider">En Evaluación</span>
              <Clock className="w-4 h-4 text-amber-600" />
            </div>
            <div className="text-3xl font-black text-amber-900">
              {stats.recibidos + stats.enRevision}
            </div>
            <p className="text-[11px] text-amber-700">Pendientes de validar</p>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-[#E2E8F0] shadow-sm space-y-2">
            <div className="flex items-center justify-between text-[#0B4F8A]">
              <span className="text-xs font-bold uppercase tracking-wider">En Gestión Activa</span>
              <Send className="w-4 h-4 text-[#0B4F8A]" />
            </div>
            <div className="text-3xl font-black text-[#0B4F8A]">
              {stats.validados + stats.derivados + stats.enSeguimiento}
            </div>
            <p className="text-[11px] text-[#0B4F8A]">Con proyecto o trámite</p>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-[#E2E8F0] shadow-sm space-y-2">
            <div className="flex items-center justify-between text-emerald-700">
              <span className="text-xs font-bold uppercase tracking-wider">Resueltos</span>
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-3xl font-black text-emerald-900">{stats.resueltos}</div>
            <p className="text-[11px] text-emerald-700">Verificados en territorio</p>
          </div>

        </div>
      )}

      {/* Distribution Charts & Breakdowns */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Category Breakdown */}
        <div className="lg:col-span-6 bg-white p-6 rounded-3xl border border-[#E2E8F0] shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="text-sm font-bold text-[#0F172A] flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-[#0B4F8A]" />
              <span>Distribución por Categoría de Problema</span>
            </h3>
            <span className="text-xs text-slate-500 font-medium">Top demandas</span>
          </div>

          <div className="space-y-3">
            {stats?.byCategory.map((cat, idx) => {
              const percentage = stats.total > 0 ? Math.round((cat.count / stats.total) * 100) : 0;
              return (
                <div key={idx} className="space-y-1">
                  <div className="flex items-center justify-between text-xs font-medium text-slate-700">
                    <span>{cat.categoryName}</span>
                    <span className="font-bold">{cat.count} ({percentage}%)</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${percentage}%`,
                        backgroundColor: cat.color || '#0B4F8A',
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Neighborhood Breakdown */}
        <div className="lg:col-span-6 bg-white p-6 rounded-3xl border border-[#E2E8F0] shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="text-sm font-bold text-[#0F172A] flex items-center gap-2">
              <MapPin className="w-4 h-4 text-[#0B4F8A]" />
              <span>Concentración por Barrio de Merlo</span>
            </h3>
            <span className="text-xs text-slate-500 font-medium">Reclamos</span>
          </div>

          <div className="space-y-3">
            {stats?.byNeighborhood.map((n, idx) => {
              const percentage = stats.total > 0 ? Math.round((n.count / stats.total) * 100) : 0;
              return (
                <div key={idx} className="space-y-1">
                  <div className="flex items-center justify-between text-xs font-medium text-slate-700">
                    <span>{n.neighborhoodName}</span>
                    <span className="font-bold text-[#0B4F8A]">{n.count} reclamos</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-[#0B4F8A] to-[#0284C7] transition-all duration-500"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>

      {/* Recent Complaints Table Preview */}
      <div className="bg-white p-6 rounded-3xl border border-[#E2E8F0] shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <h3 className="text-base font-bold text-[#0F172A]">
            Últimos Reportes Ingresados al Sistema
          </h3>
          <Link
            href="/admin/reclamos"
            className="text-xs font-bold text-[#0B4F8A] hover:underline flex items-center gap-1"
          >
            <span>Ver todos los reclamos</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
                <th className="pb-3 font-bold">Código</th>
                <th className="pb-3 font-bold">Título</th>
                <th className="pb-3 font-bold">Barrio</th>
                <th className="pb-3 font-bold">Vecino Contacto</th>
                <th className="pb-3 font-bold">Estado</th>
                <th className="pb-3 font-bold">Fecha</th>
                <th className="pb-3 font-bold text-right">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {allComplaints.slice(0, 5).map((c) => (
                <tr key={c.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3.5 font-mono font-bold text-sky-900">{c.trackingCode}</td>
                  <td className="py-3.5 font-semibold text-slate-900 max-w-xs truncate">{c.title}</td>
                  <td className="py-3.5 text-slate-600">{c.neighborhood?.name}</td>
                  <td className="py-3.5 text-slate-600">
                    <span className="font-medium text-slate-800">{c.contactName}</span>
                    <span className="block text-[10px] text-slate-400">{c.contactEmail}</span>
                  </td>
                  <td className="py-3.5">
                    <StatusBadge status={c.status} size="sm" />
                  </td>
                  <td className="py-3.5 text-slate-500">{formatDate(c.createdAt)}</td>
                  <td className="py-3.5 text-right">
                    <Link
                      href={`/admin/reclamos?id=${c.id}`}
                      className="inline-flex items-center gap-1 font-bold text-[#0B4F8A] hover:text-[#072C4F]"
                    >
                      <span>Gestionar</span>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
