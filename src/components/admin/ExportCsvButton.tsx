'use client';

import React from 'react';
import { Complaint } from '@/lib/types';
import { Download } from 'lucide-react';

interface ExportCsvButtonProps {
  complaints: Complaint[];
  className?: string;
}

export const ExportCsvButton: React.FC<ExportCsvButtonProps> = ({ complaints, className = '' }) => {
  const handleExport = () => {
    if (!complaints || complaints.length === 0) {
      alert('No hay datos para exportar con los filtros actuales.');
      return;
    }

    const headers = [
      'Código de Seguimiento',
      'Tipo de Solicitud',
      'Título',
      'Categoría',
      'Barrio',
      'Dirección',
      'Referencia',
      'Estado',
      'Apoyos Vecinales',
      'Nombre Contacto',
      'Email Contacto',
      'Teléfono Contacto',
      'Público',
      'Aprobado',
      'Fecha Creación',
      'Fecha Actualización',
    ];

    const rows = complaints.map((c) => [
      `"${c.trackingCode}"`,
      `"${c.requestType}"`,
      `"${c.title.replace(/"/g, '""')}"`,
      `"${c.category?.name || c.categoryId}"`,
      `"${c.neighborhood?.name || c.neighborhoodId}"`,
      `"${(c.address || '').replace(/"/g, '""')}"`,
      `"${(c.referenceLocation || '').replace(/"/g, '""')}"`,
      `"${c.status}"`,
      c.supportCount,
      `"${c.contactName.replace(/"/g, '""')}"`,
      `"${c.contactEmail}"`,
      `"${c.contactPhone || ''}"`,
      c.isPublic ? 'SÍ' : 'NO',
      c.isApproved ? 'SÍ' : 'NO',
      `"${c.createdAt}"`,
      `"${c.updatedAt}"`,
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `merlo_participa_reclamos_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <button
      onClick={handleExport}
      type="button"
      className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 hover:border-sky-300 shadow-sm transition-colors ${className}`}
      title="Exportar listado a archivo CSV / Excel"
    >
      <Download className="w-3.5 h-3.5 text-[#0B4F8A]" />
      <span>Exportar CSV</span>
    </button>
  );
};
