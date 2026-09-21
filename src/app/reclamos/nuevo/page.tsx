'use client';

import React from 'react';
import Link from 'next/link';
import { ComplaintWizard } from '@/components/complaints/ComplaintWizard';
import { ArrowLeft, ShieldAlert, Sparkles } from 'lucide-react';

export default function NuevoReclamoPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Header with return button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#E2E8F0]">
        <div className="space-y-1">
          <Link
            href="/reclamos"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0B4F8A] hover:text-[#072C4F] mb-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Volver a Reclamos</span>
          </Link>
          <h1 className="text-3xl sm:text-4xl font-black text-[#0F172A] tracking-tight">
            Presentar Reclamo o Propuesta
          </h1>
          <p className="text-xs sm:text-sm text-[#64748B]">
            Completá los pasos para sumar la voz de tu barrio a la red comunitaria de Merlo.
          </p>
        </div>

        <div className="p-3.5 rounded-2xl bg-[#F0F7FF] border border-sky-200 text-xs text-[#0B4F8A] max-w-sm">
          <div className="flex items-center gap-1.5 font-bold mb-0.5">
            <Sparkles className="w-3.5 h-3.5 text-[#0B4F8A]" />
            <span>Trazabilidad 100% digital</span>
          </div>
          <span className="text-slate-600">Al finalizar obtendrás un código único para monitorear cada avance.</span>
        </div>
      </div>

      {/* Main 5-Step Wizard */}
      <ComplaintWizard />

    </div>
  );
}
