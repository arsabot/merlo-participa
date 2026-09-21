'use client';

import React from 'react';
import Link from 'next/link';
import { ComplaintWizard } from '@/components/complaints/ComplaintWizard';
import { ArrowLeft, ShieldAlert, Sparkles } from 'lucide-react';

export default function NuevoReclamoPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Header with return button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#E8E4EF]">
        <div className="space-y-1">
          <Link
            href="/reclamos"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#391759] hover:text-[#240c3a] mb-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Volver a Reclamos</span>
          </Link>
          <h1 className="text-3xl sm:text-4xl font-black text-[#17151D] tracking-tight">
            Presentar Reclamo o Propuesta
          </h1>
          <p className="text-xs sm:text-sm text-[#6B6875]">
            Completá los pasos para sumar la voz de tu barrio a la red comunitaria de Merlo.
          </p>
        </div>

        <div className="p-3.5 rounded-2xl bg-[#F4ECF9] border border-purple-200 text-xs text-[#240c3a] max-w-sm">
          <div className="flex items-center gap-1.5 font-bold mb-0.5">
            <Sparkles className="w-3.5 h-3.5 text-[#391759]" />
            <span>Trazabilidad 100% digital</span>
          </div>
          <span>Al finalizar obtendrás un código único para monitorear cada avance.</span>
        </div>
      </div>

      {/* Main 5-Step Wizard */}
      <ComplaintWizard />

    </div>
  );
}
