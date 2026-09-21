'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { complaintsService } from '@/lib/services/complaintsService';
import { Complaint } from '@/lib/types';
import { ComplaintCard } from '@/components/complaints/ComplaintCard';
import { Lightbulb, PlusCircle, Sparkles, Users, ArrowRight } from 'lucide-react';

export default function PropuestasPage() {
  const [proposals, setProposals] = useState<Complaint[]>([]);

  useEffect(() => {
    const list = complaintsService.getComplaints({
      requestType: 'propuesta',
      sortBy: 'popular',
    });
    // If few proposals, also include suggestions
    if (list.length < 3) {
      const all = complaintsService.getComplaints();
      const combined = all.filter((c) => c.requestType === 'propuesta' || c.requestType === 'sugerencia');
      setProposals(combined);
    } else {
      setProposals(list);
    }
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#E2E8F0]">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#0B4F8A] flex items-center gap-1.5">
            <Lightbulb className="w-3.5 h-3.5" />
            <span>Participación Ciudadana</span>
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-[#0F172A] tracking-tight mt-1">
            Propuestas e Iniciativas Vecinales
          </h1>
          <p className="text-xs sm:text-sm text-[#64748B] mt-1">
            Ideas y proyectos impulsados por los vecinos para transformar los espacios públicos y la calidad de vida en Merlo.
          </p>
        </div>

        <Link
          href="/reclamos/nuevo?tipo=propuesta"
          className="inline-flex items-center gap-2 px-5 py-3 rounded-xl font-bold text-sm text-white bg-[#0B4F8A] hover:bg-[#072C4F] shadow-md shadow-sky-900/20 transition-all self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Proponer una mejora</span>
        </Link>
      </div>

      {/* Intro Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-sky-50 via-white to-sky-50 border border-sky-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#F0F7FF] text-[#0B4F8A]">
            <Sparkles className="w-3.5 h-3.5 text-[#0B4F8A]" />
            <span>Democracia Participativa</span>
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-[#0F172A]">
            Las mejores ideas nacen de quienes viven el día a día en el barrio
          </h2>
          <p className="text-xs sm:text-sm text-[#64748B] max-w-xl leading-relaxed">
            Las propuestas que acumulan mayor apoyo de la comunidad son visibilizadas públicamente e impulsadas colectivamente para transformar los barrios de Merlo.
          </p>
        </div>

        <div className="shrink-0">
          <Link
            href="/reclamos/nuevo?tipo=propuesta"
            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-[#0B4F8A] text-white font-bold text-sm shadow-md hover:bg-[#072C4F] transition-colors"
          >
            <span>Crear propuesta</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* Proposals Grid */}
      {proposals.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {proposals.map((item) => (
            <ComplaintCard key={item.id} complaint={item} />
          ))}
        </div>
      ) : (
        <div className="p-12 text-center bg-white rounded-3xl border border-[#E2E8F0] max-w-md mx-auto space-y-4">
          <Lightbulb className="w-12 h-12 text-[#0B4F8A]/40 mx-auto" />
          <h3 className="text-base font-bold text-slate-800">Sé el primero en proponer una idea</h3>
          <p className="text-xs text-slate-500">
            Compartí tu iniciativa para mejorar tu barrio en Merlo.
          </p>
          <Link
            href="/reclamos/nuevo?tipo=propuesta"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#0B4F8A] text-white text-xs font-bold"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Proponer ahora</span>
          </Link>
        </div>
      )}

    </div>
  );
}
