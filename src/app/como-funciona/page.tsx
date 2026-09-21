'use client';

import React from 'react';
import Link from 'next/link';
import { 
  HelpCircle, 
  CheckCircle2, 
  ShieldAlert, 
  Send, 
  Users, 
  Sparkles, 
  PlusCircle, 
  ArrowRight,
  ShieldCheck,
  FileText
} from 'lucide-react';

export default function ComoFuncionaPage() {
  const faqs = [
    {
      q: '¿Qué es Merlo Participa?',
      a: 'Es una plataforma digital cívica y comunitaria impulsada por vecinos de Merlo para escuchar a la comunidad, relevar las problemáticas de cada barrio y articular visibilidad vecinal y seguimiento de soluciones.',
    },
    {
      q: '¿Es un portal oficial de la Municipalidad de Merlo?',
      a: 'No. No es un organismo municipal oficial. Es una herramienta comunitaria independiente creada por y para los vecinos con el objetivo de dar visibilidad, auditar el estado del municipio y coordinar esfuerzos vecinales.',
    },
    {
      q: '¿Qué ocurre en caso de una urgencia o riesgo de vida?',
      a: 'Este portal no atiende emergencias en tiempo real. Ante situaciones delictivas, incendios, accidentes o emergencias médicas, debe comunicarse inmediatamente al 911 (Policía), 107 (SAME) o 100 (Bomberos).',
    },
    {
      q: '¿Mis datos personales (nombre, teléfono, correo) son visibles para cualquiera?',
      a: 'No. La información de contacto es estrictamente confidencial y solo accesible por los gestores comunitarios para comunicarse con usted. En la vista pública solo se muestra el título, descripción barrial, categoría y ubicación aproximada.',
    },
    {
      q: '¿Cómo puedo hacer el seguimiento de mi reclamo?',
      a: 'Al finalizar la carga, el sistema le entrega un código único (ej: MP-2026-A8F2). Puede ingresar a la sección "Consultar mi reclamo" en cualquier momento para ver cada una de las actualizaciones, notas y estado de la gestión.',
    },
    {
      q: '¿Puedo apoyar los reclamos de otros vecinos?',
      a: 'Sí. En el listado público o en el mapa, puede hacer clic en "Me afecta a mí también" en cualquier reporte de su zona para sumar apoyos y aumentar la prioridad de la gestión barrial.',
    },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      
      {/* Page Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <span className="text-xs font-bold uppercase tracking-wider text-[#391759] inline-flex items-center gap-1.5">
          <HelpCircle className="w-3.5 h-3.5" />
          <span>Guía Ciudadana</span>
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-[#17151D] tracking-tight">
          ¿Cómo Funciona Merlo Participa?
        </h1>
        <p className="text-xs sm:text-sm text-[#6B6875] leading-relaxed">
          Conocé el circuito integral desde que reportás un problema hasta su seguimiento y difusión comunitaria.
        </p>
      </div>

      {/* Step by step timeline */}
      <div className="space-y-6">
        <h2 className="text-xl font-bold text-[#17151D] flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-[#391759]" />
          <span>El Ciclo de Vida del Reclamo Vecinal</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          <div className="p-6 rounded-3xl bg-white border border-[#E8E4EF] shadow-lla-soft space-y-3">
            <span className="w-9 h-9 rounded-xl bg-[#F4ECF9] text-[#240c3a] font-black text-sm flex items-center justify-center">
              01
            </span>
            <h3 className="text-base font-bold text-[#17151D]">Recepción digital y código único</h3>
            <p className="text-xs text-[#6B6875] leading-relaxed">
              El vecino carga la problemática desde su teléfono o computadora en 5 sencillos pasos, indicando barrio, fotos y descripción. Se genera inmediatamente un código de seguimiento alfanumérico no predecible.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-white border border-[#E8E4EF] shadow-lla-soft space-y-3">
            <span className="w-9 h-9 rounded-xl bg-[#F4ECF9] text-[#240c3a] font-black text-sm flex items-center justify-center">
              02
            </span>
            <h3 className="text-base font-bold text-[#17151D]">Revisión y constatación barrial</h3>
            <p className="text-xs text-[#6B6875] leading-relaxed">
              Los referentes y vecinos del barrio verifican la existencia del reclamo (baches, luminarias, zanjas, microbasurales) y clasifican el grado de urgencia en la zona.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-white border border-[#E8E4EF] shadow-lla-soft space-y-3">
            <span className="w-9 h-9 rounded-xl bg-[#F4ECF9] text-[#240c3a] font-black text-sm flex items-center justify-center">
              03
            </span>
            <h3 className="text-base font-bold text-[#17151D]">Visibilización y canalización</h3>
            <p className="text-xs text-[#6B6875] leading-relaxed">
              Las problemáticas validadas ganan difusión pública y se canalizan ante las áreas correspondientes mediante notas formales y acciones comunitarias vecinales.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-white border border-[#E8E4EF] shadow-lla-soft space-y-3">
            <span className="w-9 h-9 rounded-xl bg-[#F4ECF9] text-[#240c3a] font-black text-sm flex items-center justify-center">
              04
            </span>
            <h3 className="text-base font-bold text-[#17151D]">Resolución constatada</h3>
            <p className="text-xs text-[#6B6875] leading-relaxed">
              El estado "Resuelto" solo se declara cuando existe evidencia comprobada de que la luminaria fue reparada, la calle bacheada o el desagüe limpiado satisfactoriamente.
            </p>
          </div>

        </div>
      </div>

      {/* FAQ Accordion Section */}
      <div className="bg-white p-6 sm:p-10 rounded-3xl border border-[#E8E4EF] shadow-lla-soft space-y-6">
        <h2 className="text-xl font-bold text-[#17151D] flex items-center gap-2">
          <HelpCircle className="w-5 h-5 text-[#391759]" />
          <span>Preguntas Frecuentes</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
          {faqs.map((faq, idx) => (
            <div key={idx} className="p-4 rounded-2xl bg-[#F8F7FC] border border-purple-100 space-y-2">
              <h3 className="text-sm font-bold text-[#17151D] flex items-start gap-2">
                <span className="text-[#391759] font-extrabold">•</span>
                <span>{faq.q}</span>
              </h3>
              <p className="text-xs text-[#6B6875] pl-3 leading-relaxed">
                {faq.a}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Legal & Emergency Box */}
      <div className="p-6 rounded-3xl bg-[#391759] text-white space-y-3">
        <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
          <ShieldAlert className="w-5 h-5" />
          <span>Aclaración Comunitaria de Responsabilidad</span>
        </div>
        <p className="text-xs text-purple-100 leading-relaxed">
          Merlo Participa es un canal de articulación ciudadana independiente gestionado por vecinos y organizaciones comunitarias. Las acciones otorgan visibilidad pública y seguimiento vecinal a las demandas y problemáticas del partido de Merlo.
        </p>
      </div>

      {/* CTA */}
      <div className="text-center pt-4">
        <Link
          href="/reclamos/nuevo"
          className="inline-flex items-center gap-2 px-8 py-3.5 rounded-2xl font-bold text-sm text-white bg-[#391759] hover:bg-[#240c3a] shadow-md shadow-[#391759]/30 transition-all hover:scale-105"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Comenzar a reportar un reclamo</span>
        </Link>
      </div>

    </div>
  );
}
