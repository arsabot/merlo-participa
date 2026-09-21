'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { complaintsService } from '@/lib/services/complaintsService';
import { Complaint } from '@/lib/types';
import { MerloPublicMap } from '@/components/complaints/MerloPublicMap';
import { PlusCircle, MapPin, Sparkles, Layers, Info } from 'lucide-react';

export default function MapaPage() {
  const [complaints, setComplaints] = useState<Complaint[]>([]);

  useEffect(() => {
    const list = complaintsService.getComplaints();
    setComplaints(list);
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-6">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#E8E4EF]">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#391759] flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5" />
            <span>Geolocalización Barrial</span>
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-[#17151D] tracking-tight mt-1">
            Mapa de Reclamos e Incidencias en Merlo
          </h1>
          <p className="text-xs sm:text-sm text-[#6B6875] mt-1">
            Visualizá los reportes vecinales geolocalizados en San Antonio de Padua, Merlo Centro, Libertad, Pontevedra, Mariano Acosta y demás localidades.
          </p>
        </div>

        <Link
          href="/reclamos/nuevo"
          className="inline-flex items-center gap-2 px-5 py-3 rounded-xl font-bold text-sm text-white bg-[#391759] hover:bg-[#240c3a] shadow-md shadow-[#391759]/25 transition-all self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Sumar un reporte al mapa</span>
        </Link>
      </div>

      {/* Main Interactive Map Component */}
      <MerloPublicMap complaints={complaints} />

      {/* Map Privacy Notice */}
      <div className="p-4 rounded-2xl bg-white border border-[#E8E4EF] flex items-start gap-2.5 text-xs text-slate-500 shadow-sm">
        <Info className="w-4 h-4 text-[#391759] shrink-0 mt-0.5" />
        <span>
          <strong>Protección de datos:</strong> Para salvaguardar la intimidad de los vecinos, los marcadores representan ubicaciones referenciales de las problemáticas en la vía pública y nunca exponen domicilios particulares ni datos de identidad sin consentimiento expreso.
        </span>
      </div>

    </div>
  );
}
