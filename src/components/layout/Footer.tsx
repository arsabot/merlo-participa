import React from 'react';
import Link from 'next/link';
import { 
  ShieldAlert, 
  MapPin, 
  HeartHandshake, 
  FileText, 
  HelpCircle,
  ExternalLink
} from 'lucide-react';
import { NEIGHBORHOODS } from '@/lib/constants';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#17151D] text-slate-300 pt-16 pb-12 mt-auto border-t border-purple-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-800">
          
          {/* Brand & Mission */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3.5">
              <div className="h-12 w-12 rounded-2xl bg-[#391759] border border-purple-800/60 flex items-center justify-center shadow-md p-1.5">
                <img
                  src="/icon.svg"
                  alt="Merlo Participa"
                  className="h-9 w-9 object-contain"
                />
              </div>
              <div>
                <span className="text-white font-black text-xl tracking-tight leading-none block">
                  Merlo<span className="text-[#8B5CF6]">Participa</span>
                </span>
                <p className="text-[11px] text-purple-300 font-bold uppercase tracking-wider mt-1">
                  Portal Vecinal Comunitario
                </p>
              </div>
            </div>
            
            <p className="text-sm text-slate-400 leading-relaxed max-w-md">
              Herramienta digital de participación ciudadana y escucha vecinal. Conectamos los reclamos, propuestas y necesidades de cada barrio con soluciones concretas y seguimiento transparente.
            </p>

            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-purple-950/60 border border-purple-800/40 text-purple-300 text-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Plataforma activa y abierta a todos los vecinos de Merlo</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-white font-semibold text-sm tracking-wider uppercase flex items-center gap-1.5">
              <HeartHandshake className="w-4 h-4 text-[#8B5CF6]" />
              <span>Participación</span>
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/reclamos/nuevo" className="hover:text-white transition-colors">
                  Reportar un problema
                </Link>
              </li>
              <li>
                <Link href="/reclamos" className="hover:text-white transition-colors">
                  Reclamos de vecinos
                </Link>
              </li>
              <li>
                <Link href="/propuestas" className="hover:text-white transition-colors">
                  Propuestas comunitarias
                </Link>
              </li>
              <li>
                <Link href="/mapa" className="hover:text-white transition-colors">
                  Mapa de incidencias
                </Link>
              </li>
              <li>
                <Link href="/seguimiento" className="hover:text-white transition-colors">
                  Consultar estado de reclamo
                </Link>
              </li>
            </ul>
          </div>

          {/* Information & Legal */}
          <div className="space-y-3">
            <h4 className="text-white font-semibold text-sm tracking-wider uppercase flex items-center gap-1.5">
              <FileText className="w-4 h-4 text-[#8B5CF6]" />
              <span>Transparencia</span>
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/como-funciona" className="hover:text-white transition-colors">
                  ¿Cómo funciona el portal?
                </Link>
              </li>
              <li>
                <Link href="/privacidad" className="hover:text-white transition-colors">
                  Política de privacidad
                </Link>
              </li>
              <li>
                <Link href="/login" className="hover:text-white transition-colors text-slate-400">
                  Acceso administradores
                </Link>
              </li>
            </ul>
          </div>

          {/* Neighborhoods list */}
          <div className="space-y-3">
            <h4 className="text-white font-semibold text-sm tracking-wider uppercase flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-[#8B5CF6]" />
              <span>Barrios de Merlo</span>
            </h4>
            <div className="flex flex-wrap gap-1.5 text-xs text-slate-400">
              {NEIGHBORHOODS.slice(0, 8).map((n) => (
                <Link
                  key={n.id}
                  href={`/reclamos?barrio=${n.id}`}
                  className="px-2 py-1 rounded bg-slate-900/80 hover:bg-purple-950 hover:text-purple-200 border border-slate-800 transition-colors"
                >
                  {n.name}
                </Link>
              ))}
            </div>
          </div>

        </div>

        {/* Mandatory Legal & Emergency Disclaimer */}
        <div className="mt-8 p-5 rounded-2xl bg-purple-950/30 border border-purple-900/50 space-y-2 text-xs text-slate-400 leading-relaxed">
          <div className="flex items-center gap-2 text-amber-400 font-semibold">
            <ShieldAlert className="w-4 h-4" />
            <span>Aviso Legal y de Emergencias Importante</span>
          </div>
          <p>
            <strong>Merlo Participa</strong> es una plataforma ciudadana independiente de participación vecinal y articulación comunitaria impulsada por vecinos de Merlo. No constituye una dependencia oficial de la Municipalidad de Merlo. Los reclamos recepcionados son visibilizados y canalizados comunitariamente para promover mejoras en los barrios.
          </p>
          <p className="text-slate-500 font-medium">
            <strong>EMERGENCIAS:</strong> En caso de emergencias médicas, incendios, riesgo de vida o situaciones delictivas en curso, comuníquese de inmediato a las líneas telefónicas oficiales de emergencia: <strong>911 (Policía)</strong>, <strong>107 (SAME)</strong> o <strong>100 (Bomberos)</strong>.
          </p>
        </div>

        {/* Bottom copyright */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>&copy; {new Date().getFullYear()} Merlo Participa &bull; Portal Vecinal Comunitario. Todos los derechos reservados.</p>
          <p className="text-slate-400">
            Tu voz, tu barrio, tu comunidad.
          </p>
        </div>

      </div>
    </footer>
  );
};
