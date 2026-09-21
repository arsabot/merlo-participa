'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { complaintsService } from '@/lib/services/complaintsService';
import { Complaint, ComplaintStats } from '@/lib/types';
import { ComplaintCard } from '@/components/complaints/ComplaintCard';
import { 
  PlusCircle, 
  Search, 
  MapPin, 
  Lightbulb, 
  ShieldCheck, 
  Activity, 
  Send, 
  Clock, 
  ArrowRight, 
  Users, 
  CheckCircle2, 
  HelpCircle,
  TrendingUp,
  Sparkles
} from 'lucide-react';

export default function HomePage() {
  const [stats, setStats] = useState<ComplaintStats | null>(null);
  const [recentComplaints, setRecentComplaints] = useState<Complaint[]>([]);
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<string>('all');

  useEffect(() => {
    const currentStats = complaintsService.getStats();
    const complaints = complaintsService.getComplaints();
    setStats(currentStats);
    setRecentComplaints(complaints);
  }, []);

  const filteredReports = activeCategoryFilter === 'all'
    ? recentComplaints.slice(0, 6)
    : recentComplaints.filter((c) => c.categoryId === activeCategoryFilter).slice(0, 6);

  return (
    <div className="space-y-16 sm:space-y-24 pb-20">
      
      {/* 1. HERO PRINCIPAL */}
      <section className="relative overflow-hidden bg-gradient-to-b from-purple-100/40 via-[#F8F5FA] to-[#F8F5FA] pt-12 sm:pt-20 pb-16 border-b border-purple-100/60">
        
        {/* Background glow accents */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-r from-purple-900/10 via-[#391759]/15 to-purple-800/10 blur-3xl -z-10 pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-100/80 text-[#391759] text-xs font-bold border border-purple-200 shadow-sm animate-fade-in">
                <Sparkles className="w-3.5 h-3.5 text-[#391759]" />
                <span>Participación Vecinal &bull; La Libertad Avanza Merlo</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-[#17151D] tracking-tight leading-[1.1]">
                Tu barrio tiene voz. <br />
                <span className="bg-gradient-to-r from-[#391759] via-[#622899] to-[#391759] bg-clip-text text-transparent">
                  Hagámosla escuchar.
                </span>
              </h1>

              <p className="text-base sm:text-lg text-[#6B6875] max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                Un espacio digital para que los vecinos del partido de Merlo puedan compartir reclamos de infraestructura, sugerencias y propuestas concretas para transformar sus comunidades.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5 pt-2">
                <Link
                  href="/reclamos/nuevo"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-bold text-base text-white bg-[#391759] hover:bg-[#240c3a] shadow-lg shadow-purple-950/25 hover:scale-[1.02] active:scale-[0.98] transition-all"
                >
                  <PlusCircle className="w-5 h-5" />
                  <span>Presentar un reclamo</span>
                </Link>

                <Link
                  href="/reclamos"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-bold text-base text-[#391759] bg-white border-2 border-purple-200 hover:border-[#391759] hover:bg-purple-50/50 shadow-sm transition-all"
                >
                  <Search className="w-5 h-5 text-[#391759]" />
                  <span>Explorar reportes vecinales</span>
                </Link>
              </div>

              {/* Trust metrics pill */}
              <div className="pt-4 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs text-[#6B6875]">
                <div className="flex items-center gap-1.5 font-medium">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Seguimiento con código único</span>
                </div>
                <div className="flex items-center gap-1.5 font-medium">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Geolocalización en Merlo</span>
                </div>
                <div className="flex items-center gap-1.5 font-medium">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Apoyo vecinal comunitario</span>
                </div>
              </div>

            </div>

            {/* Right Interactive Civic Hero Graphic */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md bg-white/95 backdrop-blur-xl rounded-3xl p-6 sm:p-7 border border-[#E8E2EE] shadow-lla-card space-y-5">
                
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2.5">
                    <div className="w-3 h-3 rounded-full bg-emerald-500 animate-ping" />
                    <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                      Actividad en Tiempo Real
                    </span>
                  </div>
                  <span className="text-[11px] font-bold text-[#391759] bg-purple-50 px-2 py-0.5 rounded">
                    Merlo, Bs. As.
                  </span>
                </div>

                {/* Mini Preview Cards */}
                <div className="space-y-3">
                  <div className="p-3.5 rounded-2xl bg-purple-50/70 border border-purple-100">
                    <div className="flex items-center justify-between text-[11px] text-[#391759] font-bold mb-1">
                      <span>San Antonio de Padua</span>
                      <span className="bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded">En seguimiento</span>
                    </div>
                    <p className="text-xs font-bold text-slate-900">Bacheo en Noguera y Zarate</p>
                    <p className="text-[11px] text-slate-500 mt-0.5">29 vecinos sumaron su apoyo a esta gestión</p>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                    <div className="flex items-center justify-between text-[11px] text-slate-700 font-semibold mb-1">
                      <span>Merlo Centro</span>
                      <span className="bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded">Validado</span>
                    </div>
                    <p className="text-xs font-bold text-slate-900">Luminarias quemadas en Calle Real</p>
                    <p className="text-[11px] text-slate-500 mt-0.5">Relevado por equipo territorial LLA</p>
                  </div>
                </div>

                {/* Quick Tracker search widget inside hero */}
                <div className="pt-2 border-t border-slate-100">
                  <span className="text-[11px] font-bold text-slate-700 block mb-1.5">
                    ¿Ya tenés un reclamo registrado?
                  </span>
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      const input = (e.currentTarget.elements.namedItem('code') as HTMLInputElement).value;
                      if (input) window.location.href = `/seguimiento?codigo=${encodeURIComponent(input)}`;
                    }}
                    className="flex gap-2"
                  >
                    <input
                      name="code"
                      type="text"
                      placeholder="Ej: MP-2026-A8F2"
                      className="flex-1 px-3 py-2 rounded-xl border border-slate-200 text-xs uppercase font-mono focus:outline-none focus:ring-2 focus:ring-purple-400"
                    />
                    <button
                      type="submit"
                      className="px-3.5 py-2 rounded-xl bg-[#391759] hover:bg-[#240c3a] text-white text-xs font-bold transition-colors"
                    >
                      Consultar
                    </button>
                  </form>
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 2. ACCESOS RÁPIDOS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          
          {/* Card 1 */}
          <Link
            href="/reclamos/nuevo?tipo=reclamo"
            className="group p-6 rounded-2xl bg-white border border-[#E8E2EE] hover:border-purple-300 shadow-lla-soft hover:shadow-lla-card transition-all duration-200 flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-xl bg-purple-50 text-[#391759] flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-[#391759] group-hover:text-white transition-all">
                <PlusCircle className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-[#17151D] group-hover:text-[#391759] transition-colors">
                Reportar un problema
              </h3>
              <p className="text-xs text-[#6B6875] mt-1.5 leading-relaxed">
                Informá sobre luminarias, baches, basurales o cloacas en tu cuadra.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-1 text-xs font-bold text-[#391759]">
              <span>Iniciar reporte</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          {/* Card 2 */}
          <Link
            href="/reclamos/nuevo?tipo=sugerencia"
            className="group p-6 rounded-2xl bg-white border border-[#E8E2EE] hover:border-purple-300 shadow-lla-soft hover:shadow-lla-card transition-all duration-200 flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-amber-600 group-hover:text-white transition-all">
                <Lightbulb className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-[#17151D] group-hover:text-[#391759] transition-colors">
                Compartir una sugerencia
              </h3>
              <p className="text-xs text-[#6B6875] mt-1.5 leading-relaxed">
                Aportá ideas constructivas para optimizar los servicios y trámites en Merlo.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-1 text-xs font-bold text-amber-700">
              <span>Enviar sugerencia</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          {/* Card 3 */}
          <Link
            href="/propuestas"
            className="group p-6 rounded-2xl bg-white border border-[#E8E2EE] hover:border-purple-300 shadow-lla-soft hover:shadow-lla-card transition-all duration-200 flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-emerald-600 group-hover:text-white transition-all">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-[#17151D] group-hover:text-[#391759] transition-colors">
                Proponer una mejora
              </h3>
              <p className="text-xs text-[#6B6875] mt-1.5 leading-relaxed">
                Presentá proyectos barriales y sumá el apoyo de otros vecinos de la zona.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-1 text-xs font-bold text-emerald-700">
              <span>Ver propuestas</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          {/* Card 4 */}
          <Link
            href="/seguimiento"
            className="group p-6 rounded-2xl bg-white border border-[#E8E2EE] hover:border-purple-300 shadow-lla-soft hover:shadow-lla-card transition-all duration-200 flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white transition-all">
                <Search className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-[#17151D] group-hover:text-[#391759] transition-colors">
                Consultar mi reclamo
              </h3>
              <p className="text-xs text-[#6B6875] mt-1.5 leading-relaxed">
                Ingresá con tu código para conocer el avance, informes y novedades.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-1 text-xs font-bold text-blue-700">
              <span>Rastrear código</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

        </div>
      </section>

      {/* 3. PANEL DE ACTIVIDAD VECINAL (ESTADÍSTICAS REALES) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-[#E8E2EE] shadow-lla-soft space-y-8">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#391759]">
                Transparencia & Trazabilidad
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-[#17151D] tracking-tight mt-1">
                Panel de Actividad Barrial
              </h2>
              <p className="text-xs sm:text-sm text-[#6B6875] mt-1">
                Métricas reales del estado de las solicitudes gestionadas en el partido de Merlo.
              </p>
            </div>

            <Link
              href="/mapa"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-purple-50 hover:bg-purple-100 text-[#391759] border border-purple-200 text-xs font-bold transition-colors self-start sm:self-auto"
            >
              <MapPin className="w-4 h-4 text-[#391759]" />
              <span>Ver en el mapa de Merlo</span>
            </Link>
          </div>

          {/* Stats Grid */}
          {stats && stats.total > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
              
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-600">Recibidos</span>
                  <Clock className="w-4 h-4 text-slate-500" />
                </div>
                <div className="text-3xl font-black text-slate-900">
                  {stats.recibidos}
                </div>
                <p className="text-[11px] text-slate-500">Ingresados a la plataforma</p>
              </div>

              <div className="p-5 rounded-2xl bg-amber-50/60 border border-amber-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-amber-800">En revisión</span>
                  <Activity className="w-4 h-4 text-amber-600" />
                </div>
                <div className="text-3xl font-black text-amber-900">
                  {stats.enRevision + stats.validados}
                </div>
                <p className="text-[11px] text-amber-700">En evaluación técnica</p>
              </div>

              <div className="p-5 rounded-2xl bg-purple-50/60 border border-purple-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-[#391759]">Derivados</span>
                  <Send className="w-4 h-4 text-[#391759]" />
                </div>
                <div className="text-3xl font-black text-[#391759]">
                  {stats.derivados + stats.enSeguimiento}
                </div>
                <p className="text-[11px] text-purple-800">Canalizados con proyectos</p>
              </div>

              <div className="p-5 rounded-2xl bg-emerald-50/70 border border-emerald-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-emerald-800">Resueltos</span>
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                </div>
                <div className="text-3xl font-black text-emerald-900">
                  {stats.resueltos}
                </div>
                <p className="text-[11px] text-emerald-700">Constatados en territorio</p>
              </div>

            </div>
          ) : (
            <div className="p-8 rounded-2xl bg-purple-50/40 border border-purple-100 text-center space-y-3">
              <Sparkles className="w-8 h-8 text-[#391759] mx-auto" />
              <h3 className="text-base font-bold text-slate-800">Aún no hay reportes registrados</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Sé el primer vecino en reportar una problemática o propuesta para mejorar tu barrio en Merlo.
              </p>
              <Link
                href="/reclamos/nuevo"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#391759] text-white text-xs font-bold"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Presentar primer reclamo</span>
              </Link>
            </div>
          )}

        </div>
      </section>

      {/* 4. ÚLTIMOS REPORTES VECINALES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#391759]">
              Comunidad Activa
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-[#17151D] tracking-tight mt-1">
              Últimos Reportes Vecinales
            </h2>
            <p className="text-xs sm:text-sm text-[#6B6875] mt-1">
              Reclamos presentados por los vecinos de Merlo. Podés sumar tu apoyo para darles visibilidad.
            </p>
          </div>

          <Link
            href="/reclamos"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#391759] hover:text-[#240c3a] group"
          >
            <span>Ver todos los reclamos</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Complaints Grid */}
        {filteredReports.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredReports.map((complaint) => (
              <ComplaintCard key={complaint.id} complaint={complaint} />
            ))}
          </div>
        ) : (
          <div className="p-12 text-center bg-white rounded-2xl border border-slate-200">
            <p className="text-sm text-slate-500">No hay reportes aprobados con los filtros actuales.</p>
          </div>
        )}

        <div className="text-center pt-6">
          <Link
            href="/reclamos"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm text-[#391759] bg-white border border-purple-200 hover:bg-purple-50 shadow-sm transition-colors"
          >
            <span>Explorar los {recentComplaints.length} reportes en el directorio</span>
            <ArrowRight className="w-4 h-4 text-[#391759]" />
          </Link>
        </div>

      </section>

      {/* 5. CÓMO FUNCIONA (RESUMEN EN 4 PASOS) */}
      <section className="bg-white border-y border-[#E8E2EE] py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#391759]">
              Proceso Transparente
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-[#17151D] tracking-tight">
              ¿Cómo funciona Merlo Participa?
            </h2>
            <p className="text-xs sm:text-sm text-[#6B6875]">
              Una herramienta digital para transformar las quejas aisladas en reclamos articulados con seguimiento.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            
            <div className="p-6 rounded-2xl bg-[#F8F5FA] border border-[#E8E2EE] space-y-3 relative">
              <span className="w-8 h-8 rounded-full bg-[#391759] text-white font-bold text-sm flex items-center justify-center">
                1
              </span>
              <h3 className="text-base font-bold text-[#17151D]">Carga del reclamo</h3>
              <p className="text-xs text-[#6B6875] leading-relaxed">
                El vecino completa el formulario con fotos, ubicación y descripción en menos de 2 minutos.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#F8F5FA] border border-[#E8E2EE] space-y-3 relative">
              <span className="w-8 h-8 rounded-full bg-[#391759] text-white font-bold text-sm flex items-center justify-center">
                2
              </span>
              <h3 className="text-base font-bold text-[#17151D]">Validación territorial</h3>
              <p className="text-xs text-[#6B6875] leading-relaxed">
                El equipo barrial de LLA Merlo constata la problemática y categoriza el impacto en el barrio.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#F8F5FA] border border-[#E8E2EE] space-y-3 relative">
              <span className="w-8 h-8 rounded-full bg-[#391759] text-white font-bold text-sm flex items-center justify-center">
                3
              </span>
              <h3 className="text-base font-bold text-[#17151D]">Gestión y derivación</h3>
              <p className="text-xs text-[#6B6875] leading-relaxed">
                Se impulsan pedidos de informe, proyectos en el Concejo Deliberante y articulaciones directas.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#F8F5FA] border border-[#E8E2EE] space-y-3 relative">
              <span className="w-8 h-8 rounded-full bg-[#391759] text-white font-bold text-sm flex items-center justify-center">
                4
              </span>
              <h3 className="text-base font-bold text-[#17151D]">Trazabilidad pública</h3>
              <p className="text-xs text-[#6B6875] leading-relaxed">
                Cada avance queda registrado en la línea de tiempo accesible mediante tu código de seguimiento.
              </p>
            </div>

          </div>

          <div className="text-center pt-2">
            <Link
              href="/como-funciona"
              className="inline-flex items-center gap-1 text-xs font-bold text-[#391759] hover:underline"
            >
              <span>Conocé más sobre el funcionamiento y normativas</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

        </div>
      </section>

      {/* 6. FINAL BANNER CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#240c3a] via-[#391759] to-[#240c3a] text-white p-8 sm:p-12 shadow-xl">
          <div className="max-w-2xl space-y-4">
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
              ¿Hay un problema en tu cuadra que requiere atención?
            </h2>
            <p className="text-xs sm:text-sm text-purple-100 leading-relaxed">
              No dejes que tu reclamo quede en el olvido. Registralo ahora en Merlo Participa y sumá el apoyo de tu comunidad.
            </p>
            <div className="pt-2 flex flex-wrap gap-3">
              <Link
                href="/reclamos/nuevo"
                className="px-6 py-3 rounded-xl bg-white text-[#391759] font-bold text-sm hover:bg-purple-50 shadow-md transition-all hover:scale-105"
              >
                Reportar ahora
              </Link>
              <Link
                href="/mapa"
                className="px-6 py-3 rounded-xl bg-[#240c3a] border border-purple-400/40 text-white font-bold text-sm hover:bg-purple-950 transition-colors"
              >
                Explorar mapa barrial
              </Link>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
