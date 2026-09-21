'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { complaintsService } from '@/lib/services/complaintsService';
import { Complaint } from '@/lib/types';
import { COMPLAINT_STATUS_CONFIG } from '@/lib/constants';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { CategoryBadge } from '@/components/ui/CategoryBadge';
import { Timeline } from '@/components/complaints/Timeline';
import { formatDate } from '@/lib/utils';
import { 
  Search, 
  CheckCircle2, 
  Clock, 
  MapPin, 
  ArrowRight, 
  Sparkles, 
  AlertCircle,
  HelpCircle,
  FileText
} from 'lucide-react';

function SeguimientoContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const queryCode = searchParams.get('codigo') || '';

  const [inputCode, setInputCode] = useState(queryCode);
  const [complaint, setComplaint] = useState<Complaint | null>(null);
  const [searched, setSearched] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    if (queryCode) {
      setInputCode(queryCode);
      handleSearchCode(queryCode);
    }
  }, [queryCode]);

  const handleSearchCode = (code: string) => {
    if (!code.trim()) return;
    setIsSearching(true);
    setSearched(true);
    const found = complaintsService.getComplaintByTrackingCode(code.trim());
    setComplaint(found);
    setIsSearching(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputCode.trim()) return;
    router.push(`/seguimiento?codigo=${encodeURIComponent(inputCode.trim().toUpperCase())}`);
    handleSearchCode(inputCode.trim());
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Page Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <span className="text-xs font-bold uppercase tracking-wider text-[#391759] inline-flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Consulta de Trámites y Reclamos</span>
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-[#17151D] tracking-tight">
          Seguimiento en Tiempo Real
        </h1>
        <p className="text-xs sm:text-sm text-[#6B6875] leading-relaxed">
          Ingresá tu código único de reclamo (ej: <strong>MP-2026-A8F2</strong>) para conocer el estado actual, las notas de gestión y el avance de tu reporte.
        </p>
      </div>

      {/* Search Bar Card */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#E8E4EF] shadow-lla-soft">
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Ingresá tu código MP-XXXX-XXXX"
              value={inputCode}
              onChange={(e) => setInputCode(e.target.value.toUpperCase())}
              className="w-full pl-12 pr-4 py-3.5 rounded-2xl border border-slate-200 text-sm font-mono uppercase tracking-wider focus:outline-none focus:ring-2 focus:ring-[#622899] focus:border-[#391759] bg-slate-50/60"
            />
          </div>

          <button
            type="submit"
            disabled={isSearching}
            className="px-8 py-3.5 rounded-2xl font-bold text-sm text-white bg-[#391759] hover:bg-[#240c3a] shadow-md shadow-[#391759]/25 transition-all flex items-center justify-center gap-2 hover:scale-[1.02]"
          >
            {isSearching ? (
              <span className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
            ) : (
              <Search className="w-4 h-4" />
            )}
            <span>Buscar Reclamo</span>
          </button>
        </form>

        {/* Quick Sample Links */}
        <div className="mt-4 pt-4 border-t border-slate-100 flex flex-wrap items-center gap-2 text-xs text-slate-500">
          <span>Códigos de ejemplo:</span>
          {['MP-2026-A8F2', 'MP-2026-B3K7', 'MP-2026-R5T9'].map((sample) => (
            <button
              key={sample}
              type="button"
              onClick={() => {
                setInputCode(sample);
                router.push(`/seguimiento?codigo=${sample}`);
                handleSearchCode(sample);
              }}
              className="font-mono text-[#391759] bg-[#F4ECF9] hover:bg-purple-100 px-2 py-0.5 rounded border border-purple-200 transition-colors font-bold"
            >
              {sample}
            </button>
          ))}
        </div>
      </div>

      {/* Result Card */}
      {searched && complaint && (
        <div className="bg-white rounded-3xl border border-[#E8E4EF] p-6 sm:p-8 shadow-lla-soft space-y-6 animate-fade-in">
          
          {/* Header */}
          <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <span className="text-base font-black font-mono text-[#240c3a] bg-[#F4ECF9] px-3 py-1 rounded-xl border border-purple-200">
                {complaint.trackingCode}
              </span>
              <StatusBadge status={complaint.status} size="md" />
            </div>

            <Link
              href={`/reclamos/${complaint.id}`}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#391759] hover:underline"
            >
              <span>Ver ficha pública</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Stepper Progress Visualizer */}
          <div className="py-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-700 block mb-3">
              Progreso del Trámite
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-6 gap-2 text-center text-xs">
              {[
                { key: 'recibido', label: '1. Recibido' },
                { key: 'en_revision', label: '2. En revisión' },
                { key: 'validado', label: '3. Validado' },
                { key: 'derivado', label: '4. Derivado' },
                { key: 'en_seguimiento', label: '5. Seguimiento' },
                { key: 'resuelto', label: '6. Resuelto' },
              ].map((step, idx) => {
                const currentConfig = COMPLAINT_STATUS_CONFIG[complaint.status];
                const isPassed = (idx + 1) <= currentConfig.stepIndex;
                const isCurrent = (idx + 1) === currentConfig.stepIndex;

                return (
                  <div
                    key={step.key}
                    className={`p-2.5 rounded-xl border transition-all ${
                      isCurrent
                        ? 'bg-[#F4ECF9] border-[#391759] text-[#240c3a] font-bold ring-2 ring-purple-200'
                        : isPassed
                        ? 'bg-emerald-50 border-emerald-200 text-emerald-800 font-semibold'
                        : 'bg-slate-50 border-slate-200 text-slate-400'
                    }`}
                  >
                    <div className="text-[10px] mb-0.5">
                      {isPassed && !isCurrent ? '✓' : idx + 1}
                    </div>
                    <span className="truncate block">{step.label.replace(/^\d+\.\s*/, '')}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Complaint Summary */}
          <div className="p-5 rounded-2xl bg-[#F8F7FC] border border-purple-100 space-y-2">
            <div className="flex items-center gap-2">
              <CategoryBadge categoryId={complaint.categoryId} size="sm" />
              <span className="text-xs font-semibold text-slate-600">
                {complaint.neighborhood?.name || 'Merlo'} &bull; Registrado el {formatDate(complaint.createdAt)}
              </span>
            </div>
            <h3 className="text-lg font-bold text-[#17151D]">{complaint.title}</h3>
            <p className="text-xs text-[#6B6875] leading-relaxed line-clamp-3">
              {complaint.description}
            </p>
          </div>

          {/* Timeline of Updates */}
          <div className="space-y-4 pt-2">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#391759]" />
              <span>Historial de Actualizaciones ({complaint.updates?.length || 0})</span>
            </h3>
            <Timeline updates={complaint.updates || []} />
          </div>

        </div>
      )}

      {/* Not Found Screen */}
      {searched && !complaint && !isSearching && (
        <div className="bg-white rounded-3xl border border-rose-200 p-8 text-center space-y-4 shadow-sm animate-fade-in max-w-lg mx-auto">
          <div className="w-14 h-14 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mx-auto">
            <AlertCircle className="w-7 h-7" />
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-slate-900">
              No se encontró ningún reclamo con el código "{inputCode}"
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Verificá que el código ingresado coincida con el formato <strong>MP-YYYY-XXXX</strong> o contactate con la mesa de atención.
            </p>
          </div>
          <Link
            href="/reclamos/nuevo"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#391759] text-white text-xs font-bold"
          >
            <span>Presentar un nuevo reclamo</span>
          </Link>
        </div>
      )}

      {/* Help FAQ Box */}
      <div className="p-6 rounded-3xl bg-white border border-[#E8E4EF] shadow-sm space-y-3">
        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
          <HelpCircle className="w-4 h-4 text-[#391759]" />
          <span>¿Cómo se gestiona tu reclamo?</span>
        </h3>
        <p className="text-xs text-slate-600 leading-relaxed">
          Cada reclamo recibido en Merlo Participa es analizado por el equipo técnico territorial de La Libertad Avanza Merlo. Los reclamos validados se canalizan a través de presentaciones de proyectos legislativos, pedidos de informe formal a las dependencias municipales y seguimiento directo junto a los vecinos de cada barrio.
        </p>
      </div>

    </div>
  );
}

export default function SeguimientoPage() {
  return (
    <Suspense fallback={
      <div className="max-w-4xl mx-auto px-4 py-20 text-center text-slate-500 text-sm">
        Cargando seguimiento...
      </div>
    }>
      <SeguimientoContent />
    </Suspense>
  );
}
