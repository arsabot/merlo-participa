'use client';

import React, { useEffect, useState, use } from 'react';
import Link from 'next/link';
import { complaintsService } from '@/lib/services/complaintsService';
import { Complaint } from '@/lib/types';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { CategoryBadge } from '@/components/ui/CategoryBadge';
import { SupportButton } from '@/components/complaints/SupportButton';
import { Timeline } from '@/components/complaints/Timeline';
import { formatDate, formatDateTime } from '@/lib/utils';
import { 
  ArrowLeft, 
  MapPin, 
  Calendar, 
  Share2, 
  Copy, 
  Check, 
  ShieldAlert, 
  MessageSquareQuote, 
  Info,
  Clock,
  Sparkles
} from 'lucide-react';

export default function ComplaintDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const complaintId = resolvedParams.id;

  const [complaint, setComplaint] = useState<Complaint | null>(null);
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);

  useEffect(() => {
    const item = complaintsService.getComplaintById(complaintId);
    setComplaint(item);
  }, [complaintId]);

  if (!complaint) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-2xl font-bold text-slate-800">Reclamo no encontrado</h2>
        <p className="text-sm text-slate-500">
          El reporte que estás buscando no existe o fue archivado.
        </p>
        <Link
          href="/reclamos"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#0B4F8A] text-white text-xs font-bold"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Volver al directorio de reclamos</span>
        </Link>
      </div>
    );
  }

  const handleCopyCode = () => {
    navigator.clipboard.writeText(complaint.trackingCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 3000);
  };

  const handleCopyLink = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 3000);
    }
  };

  const handleShareWhatsApp = () => {
    if (typeof window === 'undefined') return;
    const text = `Mirá este reclamo vecinal en Merlo: "${complaint.title}" en Merlo Participa. Podés sumar tu apoyo acá: ${window.location.href}`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Top breadcrumb navigation */}
      <div className="flex items-center justify-between gap-4 pb-4 border-b border-[#E2E8F0]">
        <Link
          href="/reclamos"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0B4F8A] hover:text-[#072C4F] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Volver a todos los reclamos</span>
        </Link>

        {/* Share buttons */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleShareWhatsApp}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 hover:bg-emerald-100 transition-colors"
            title="Compartir en WhatsApp"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">WhatsApp</span>
          </button>

          <button
            type="button"
            onClick={handleCopyLink}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 transition-colors"
            title="Copiar enlace"
          >
            {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">{copiedLink ? 'Copiado' : 'Copiar enlace'}</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Detail + Timeline */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Complaint Core Information */}
        <div className="lg:col-span-7 space-y-6">
          
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E2E8F0] shadow-civic-soft space-y-6">
            
            {/* Badges & Tracking Code Header */}
            <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2 flex-wrap">
                <CategoryBadge categoryId={complaint.categoryId} size="md" />
                <StatusBadge status={complaint.status} size="md" />
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold text-sky-900 bg-sky-50 px-2.5 py-1 rounded-lg border border-sky-200">
                  {complaint.trackingCode}
                </span>
                <button
                  type="button"
                  onClick={handleCopyCode}
                  className="p-1.5 text-slate-400 hover:text-sky-700 hover:bg-sky-50 rounded-lg transition-colors"
                  title="Copiar código de seguimiento"
                >
                  {copiedCode ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Title & Description */}
            <div className="space-y-3">
              <h1 className="text-2xl sm:text-3xl font-black text-[#0F172A] tracking-tight leading-snug">
                {complaint.title}
              </h1>
              <p className="text-sm text-[#64748B] leading-relaxed whitespace-pre-line">
                {complaint.description}
              </p>
            </div>

            {/* Metadata Box */}
            <div className="p-4 rounded-2xl bg-[#F8FAFC] border border-sky-100 space-y-3 text-xs text-slate-700">
              <div className="flex items-center gap-2 font-medium">
                <MapPin className="w-4 h-4 text-[#0B4F8A]" />
                <span>
                  <strong>Barrio:</strong> {complaint.neighborhood?.name || 'Merlo'}
                </span>
              </div>

              {complaint.address && (
                <div className="pl-6 text-slate-600">
                  <strong>Ubicación:</strong> {complaint.address}
                  {complaint.referenceLocation && ` (${complaint.referenceLocation})`}
                </div>
              )}

              <div className="flex items-center gap-2 pl-6 text-slate-500">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                <span>Registrado el {formatDate(complaint.createdAt)}</span>
              </div>
            </div>

            {/* Evidence Photos */}
            {complaint.attachments && complaint.attachments.length > 0 && (
              <div className="space-y-3 pt-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  Fotografías de evidencia ({complaint.attachments.length})
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {complaint.attachments.map((att) => (
                    <button
                      key={att.id}
                      type="button"
                      onClick={() => setSelectedPhoto(att.fileUrl)}
                      className="relative h-32 rounded-2xl overflow-hidden border border-slate-200 group focus:outline-none focus:ring-2 focus:ring-sky-400"
                    >
                      <img
                        src={att.fileUrl}
                        alt={att.fileName}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Community Support Section */}
            <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-xs font-bold text-slate-900 block">
                  ¿Este problema también te perjudica?
                </span>
                <span className="text-[11px] text-slate-500">
                  Tu voto de apoyo fortalece la visibilidad para su gestión comunitaria.
                </span>
              </div>

              <SupportButton
                complaintId={complaint.id}
                initialCount={complaint.supportCount}
                size="lg"
                variant="solid"
              />
            </div>

          </div>

          {/* Resolution Disclaimer */}
          {complaint.status === 'resuelto' && (
            <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 space-y-1.5">
              <div className="flex items-center gap-2 font-bold text-emerald-800">
                <ShieldAlert className="w-4 h-4 text-emerald-600" />
                <span>Reclamo con Resolución Verificada</span>
              </div>
              <p className="leading-relaxed">
                {complaint.resolutionNotes || 'La resolución de esta problemática ha sido constatada en territorio por vecinos y el equipo barrial.'}
              </p>
            </div>
          )}

        </div>

        {/* Right Column: Timeline & Tracking History */}
        <div className="lg:col-span-5 space-y-6">
          
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-[#E2E8F0] shadow-civic-soft space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <MessageSquareQuote className="w-4 h-4 text-[#0B4F8A]" />
                <h3 className="text-base font-bold text-[#0F172A]">
                  Historial de Avances
                </h3>
              </div>
              <span className="text-[11px] text-slate-500 font-medium">
                {complaint.updates?.length || 0} eventos
              </span>
            </div>

            <Timeline updates={complaint.updates || []} />
          </div>

          {/* Citizen Participation Info Card */}
          <div className="p-5 rounded-2xl bg-sky-50/50 border border-sky-200 text-xs text-sky-950 space-y-2">
            <span className="font-bold block text-sm text-[#072C4F] flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-[#0B4F8A]" />
              <span>Compromiso de Gestión Vecinal</span>
            </span>
            <p className="leading-relaxed text-sky-900">
              Todas las solicitudes son clasificadas por los coordinadores barriales para organizar petitorios comunitarios, pedidos formales y seguimiento permanente de los servicios públicos en cada barrio de Merlo.
            </p>
          </div>

        </div>

      </div>

      {/* Photo Lightbox Modal */}
      {selectedPhoto && (
        <div
          onClick={() => setSelectedPhoto(null)}
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 cursor-zoom-out animate-fade-in"
        >
          <div className="relative max-w-4xl max-h-[90vh] rounded-2xl overflow-hidden bg-black shadow-2xl">
            <img src={selectedPhoto} alt="Evidencia ampliada" className="w-full h-auto max-h-[85vh] object-contain" />
          </div>
        </div>
      )}

    </div>
  );
}
