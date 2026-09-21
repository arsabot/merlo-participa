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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#E8E4EF]">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#391759] flex items-center gap-1.5">
            <Lightbulb className="w-3.5 h-3.5" />
            <span>Participación Ciudadana</span>
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-[#17151D] tracking-tight mt-1">
            Propuestas e Iniciativas Vecinales
          </h1>
          <p className="text-xs sm:text-sm text-[#6B6875] mt-1">
            Ideas y proyectos impulsados por los vecinos para transformar los espacios públicos y la calidad de vida en Merlo.
          </p>
        </div>

        <Link
          href="/reclamos/nuevo?tipo=propuesta"
          className="inline-flex items-center gap-2 px-5 py-3 rounded-xl font-bold text-sm text-white bg-[#391759] hover:bg-[#240c3a] shadow-md shadow-[#391759]/25 transition-all self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Proponer una mejora</span>
        </Link>
      </div>

      {/* Intro Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-purple-50 via-white to-purple-50 border border-purple-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#F4ECF9] text-[#240c3a]">
            <Sparkles className="w-3.5 h-3.5 text-[#391759]" />
            <span>Democracia Participativa</span>
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-[#17151D]">
            Las mejores ideas nacen de quienes viven el día a día en el barrio
          </h2>
          <p className="text-xs sm:text-sm text-[#6B6875] max-w-xl leading-relaxed">
            Las propuestas que acumulan mayor apoyo de los vecinos son analizadas prioritariamente por los equipos técnicos y el bloque legislativo de La Libertad Avanza Merlo para convertirlas en proyectos de ordenanza.
          </p>
        </div>

        <div className="shrink-0">
          <Link
            href="/reclamos/nuevo?tipo=propuesta"
            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-[#391759] text-white font-bold text-sm shadow-md hover:bg-[#240c3a] transition-colors"
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
        <div className="p-12 text-center bg-white rounded-3xl border border-[#E8E4EF] max-w-md mx-auto space-y-4">
          <Lightbulb className="w-12 h-12 text-[#391759]/40 mx-auto" />
          <h3 className="text-base font-bold text-slate-800">Sé el primero en proponer una idea</h3>
          <p className="text-xs text-slate-500">
            Compartí tu iniciativa para mejorar tu barrio en Merlo.
          </p>
          <Link
            href="/reclamos/nuevo?tipo=propuesta"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#391759] text-white text-xs font-bold"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Proponer ahora</span>
          </Link>
        </div>
      )}

    </div>
  );
}
