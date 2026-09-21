'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import confetti from 'canvas-confetti';
import { complaintsService } from '@/lib/services/complaintsService';
import { CreateComplaintInput, RequestType, Complaint } from '@/lib/types';
import { NEIGHBORHOODS, COMPLAINT_CATEGORIES, REQUEST_TYPES, MERLO_MAP_CONFIG } from '@/lib/constants';
import { MerloMapSelector } from './MerloMapSelector';
import { 
  Check, 
  ChevronRight, 
  ChevronLeft, 
  Upload, 
  X, 
  MapPin, 
  Sparkles, 
  Copy, 
  AlertCircle, 
  ShieldAlert, 
  HelpCircle,
  Eye,
  EyeOff,
  CheckCircle2
} from 'lucide-react';

interface ComplaintWizardProps {
  initialType?: string;
  initialNeighborhoodId?: string;
  initialCategoryId?: string;
}

export const ComplaintWizard: React.FC<ComplaintWizardProps> = ({
  initialType,
  initialNeighborhoodId,
  initialCategoryId,
}) => {
  const router = useRouter();

  const [currentStep, setCurrentStep] = useState<number>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createdComplaint, setCreatedComplaint] = useState<Complaint | null>(null);
  const [copiedCode, setCopiedCode] = useState(false);

  // Form State
  const [formData, setFormData] = useState<CreateComplaintInput>({
    requestType: (initialType as RequestType) || 'reclamo',
    title: '',
    description: '',
    categoryId: initialCategoryId || 'cat-1',
    neighborhoodId: initialNeighborhoodId || 'n-1',
    address: '',
    referenceLocation: '',
    latitude: MERLO_MAP_CONFIG.center[0],
    longitude: MERLO_MAP_CONFIG.center[1],
    incidentDate: new Date().toISOString().split('T')[0],
    isPublic: true,
    contactName: '',
    contactEmail: '',
    contactPhone: '',
    privacyAccepted: true,
    attachments: [],
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Image Upload handler simulation
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    if (file.size > 5 * 1024 * 1024) {
      alert('La imagen no debe superar los 5MB.');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result as string;
      const newAttachment = {
        fileName: file.name,
        fileUrl: base64,
        fileSizeBytes: file.size,
        mimeType: file.type,
      };

      setFormData((prev: CreateComplaintInput) => ({
        ...prev,
        attachments: [...(prev.attachments || []), newAttachment].slice(0, 3), // Max 3 images
      }));
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = (index: number) => {
    setFormData((prev: CreateComplaintInput) => ({
      ...prev,
      attachments: prev.attachments?.filter((_: unknown, i: number) => i !== index),
    }));
  };

  // Step Validation
  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};

    if (step === 1) {
      if (!formData.requestType) newErrors.requestType = 'Seleccioná un tipo de solicitud.';
    }

    if (step === 2) {
      if (!formData.title.trim()) newErrors.title = 'El título es obligatorio.';
      else if (formData.title.trim().length < 5) newErrors.title = 'El título debe tener al menos 5 caracteres.';

      if (!formData.description.trim()) newErrors.description = 'La descripción es obligatoria.';
      else if (formData.description.trim().length < 15) newErrors.description = 'Por favor brindá más detalles (mínimo 15 caracteres).';

      if (!formData.categoryId) newErrors.categoryId = 'Seleccioná una categoría.';
      if (!formData.neighborhoodId) newErrors.neighborhoodId = 'Seleccioná un barrio de Merlo.';
    }

    if (step === 3) {
      if (!formData.latitude || !formData.longitude) {
        newErrors.location = 'Por favor confirmá la ubicación en el mapa.';
      }
    }

    if (step === 4) {
      if (!formData.contactName.trim()) newErrors.contactName = 'El nombre es obligatorio.';
      if (!formData.contactEmail.trim()) {
        newErrors.contactEmail = 'El correo electrónico es obligatorio.';
      } else if (!formData.contactEmail.includes('@') || !formData.contactEmail.includes('.')) {
        newErrors.contactEmail = 'Ingresá un correo electrónico válido.';
      }

      if (!formData.privacyAccepted) {
        newErrors.privacyAccepted = 'Debes aceptar los términos de uso y privacidad.';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, 5));
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep(4)) {
      setCurrentStep(4);
      return;
    }

    setIsSubmitting(true);

    try {
      // Simulate network request
      await new Promise((r) => setTimeout(r, 600));

      const created = complaintsService.createComplaint(formData);
      setCreatedComplaint(created);

      // Trigger Confetti celebration
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#0B4F8A', '#0284C7', '#10B981', '#F59E0B'],
        });
      } catch (e) {
        // Safe fallback
      }

      setCurrentStep(6); // Success Step
    } catch (e) {
      alert('Ocurrió un error al registrar el reclamo. Por favor intentá nuevamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const copyTrackingCode = () => {
    if (createdComplaint) {
      navigator.clipboard.writeText(createdComplaint.trackingCode);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 3000);
    }
  };

  const stepTitles = [
    'Tipo de solicitud',
    'Información del problema',
    'Ubicación en Merlo',
    'Contacto y Privacidad',
    'Confirmación',
  ];

  return (
    <div className="max-w-4xl mx-auto">
      
      {/* Step Indicator Header (Steps 1 to 5) */}
      {currentStep <= 5 && (
        <div className="mb-8">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-[#0B4F8A]">
              Paso {currentStep} de 5: {stepTitles[currentStep - 1]}
            </span>
            <span className="text-xs text-slate-500 font-medium">
              {Math.round((currentStep / 5) * 100)}% completado
            </span>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
            <div
              className="bg-gradient-to-r from-[#0B4F8A] to-[#0284C7] h-full transition-all duration-300 ease-out"
              style={{ width: `${(currentStep / 5) * 100}%` }}
            />
          </div>

          {/* Step Pill Navigation */}
          <div className="hidden sm:grid grid-cols-5 gap-2 mt-4">
            {stepTitles.map((title, idx) => {
              const stepNumber = idx + 1;
              const isPast = stepNumber < currentStep;
              const isCurrent = stepNumber === currentStep;

              return (
                <button
                  key={stepNumber}
                  type="button"
                  disabled={stepNumber > currentStep}
                  onClick={() => {
                    if (stepNumber < currentStep) setCurrentStep(stepNumber);
                  }}
                  className={`text-left p-2.5 rounded-xl border text-xs font-medium transition-colors ${
                    isCurrent
                      ? 'bg-sky-50 border-[#0B4F8A] text-[#0B4F8A] font-bold shadow-sm'
                      : isPast
                      ? 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50 cursor-pointer'
                      : 'bg-slate-50 border-transparent text-slate-400 cursor-not-allowed'
                  }`}
                >
                  <div className="flex items-center gap-1.5 mb-1">
                    <span
                      className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold ${
                        isCurrent
                          ? 'bg-[#0B4F8A] text-white'
                          : isPast
                          ? 'bg-emerald-500 text-white'
                          : 'bg-slate-300 text-slate-600'
                      }`}
                    >
                      {isPast ? '✓' : stepNumber}
                    </span>
                    <span className="truncate">{title}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Main Form Container */}
      <div className="bg-white rounded-3xl border border-[#E2E8F0] p-6 sm:p-10 shadow-civic-soft">
        
        {/* STEP 1: Tipo de Solicitud */}
        {currentStep === 1 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-black text-[#0F172A] tracking-tight">
                ¿Qué tipo de situación deseás presentar?
              </h2>
              <p className="text-sm text-[#64748B] mt-1">
                Elegí la opción que mejor se adapte a tu inquietud vecinal para una correcta gestión.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
              {REQUEST_TYPES.map((type) => {
                const isSelected = formData.requestType === type.type;
                return (
                  <button
                    key={type.type}
                    type="button"
                    onClick={() => {
                      setFormData({ ...formData, requestType: type.type });
                      setErrors({});
                    }}
                    className={`text-left p-5 rounded-2xl border-2 transition-all duration-200 flex flex-col justify-between gap-3 ${
                      isSelected
                        ? 'border-[#0B4F8A] bg-sky-50/50 shadow-md ring-4 ring-sky-100'
                        : 'border-slate-200 hover:border-sky-300 hover:bg-slate-50/60'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-base text-[#0F172A]">
                        {type.label}
                      </span>
                      <div
                        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                          isSelected
                            ? 'border-[#0B4F8A] bg-[#0B4F8A] text-white'
                            : 'border-slate-300'
                        }`}
                      >
                        {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                      </div>
                    </div>
                    <p className="text-xs text-[#64748B] leading-relaxed">
                      {type.description}
                    </p>
                  </button>
                );
              })}
            </div>
            {errors.requestType && (
              <p className="text-xs text-rose-600 font-semibold">{errors.requestType}</p>
            )}
          </div>
        )}

        {/* STEP 2: Información del Problema */}
        {currentStep === 2 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-black text-[#0F172A] tracking-tight">
                Detalles del reclamo o propuesta
              </h2>
              <p className="text-sm text-[#64748B] mt-1">
                Cuanto más específica sea la información, más rápido podremos verificarla en el barrio.
              </p>
            </div>

            {/* Title */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Título breve y claro *
              </label>
              <input
                type="text"
                placeholder="Ej: Luminaria rota y calle a oscuras en Noguera y Real"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className={`w-full px-4 py-3 rounded-xl border text-sm focus:outline-none focus:ring-2 ${
                  errors.title
                    ? 'border-rose-300 focus:ring-rose-400 bg-rose-50/20'
                    : 'border-slate-200 focus:ring-sky-400 focus:border-[#0B4F8A]'
                }`}
              />
              {errors.title && <p className="text-xs text-rose-600 font-semibold">{errors.title}</p>}
            </div>

            {/* Category & Neighborhood selectors */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  Categoría del problema *
                </label>
                <select
                  value={formData.categoryId}
                  onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400 bg-white"
                >
                  {COMPLAINT_CATEGORIES.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  Barrio o localidad de Merlo *
                </label>
                <select
                  value={formData.neighborhoodId}
                  onChange={(e) => setFormData({ ...formData, neighborhoodId: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400 bg-white"
                >
                  {NEIGHBORHOODS.map((n) => (
                    <option key={n.id} value={n.id}>
                      {n.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Detailed Description */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Descripción detallada *
              </label>
              <textarea
                rows={4}
                placeholder="Explicá cómo afecta a la cuadra, desde cuándo ocurre y qué consecuencias ocasiona..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className={`w-full px-4 py-3 rounded-xl border text-sm focus:outline-none focus:ring-2 ${
                  errors.description
                    ? 'border-rose-300 focus:ring-rose-400 bg-rose-50/20'
                    : 'border-slate-200 focus:ring-sky-400 focus:border-[#0B4F8A]'
                }`}
              />
              {errors.description && (
                <p className="text-xs text-rose-600 font-semibold">{errors.description}</p>
              )}
            </div>

            {/* Incident Date */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Fecha aproximada en que comenzó el problema
              </label>
              <input
                type="date"
                value={formData.incidentDate}
                onChange={(e) => setFormData({ ...formData, incidentDate: e.target.value })}
                className="w-full sm:w-64 px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400"
              />
            </div>

            {/* Image Upload / Attachment section */}
            <div className="space-y-2 pt-2 border-t border-slate-100">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block">
                Fotos de evidencia (opcional, máx 3 imágenes)
              </label>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {formData.attachments?.map((att: { fileUrl: string; fileName: string }, idx: number) => (
                  <div
                    key={idx}
                    className="relative rounded-xl overflow-hidden border border-sky-200 h-24 bg-slate-50 group"
                  >
                    <img
                      src={att.fileUrl}
                      alt={att.fileName}
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(idx)}
                      className="absolute top-1 right-1 p-1 rounded-full bg-slate-900/70 text-white hover:bg-rose-600 transition-colors"
                      title="Quitar foto"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}

                {(formData.attachments?.length || 0) < 3 && (
                  <label className="flex flex-col items-center justify-center h-24 rounded-xl border-2 border-dashed border-sky-300 hover:border-[#0B4F8A] bg-sky-50/40 hover:bg-sky-50/80 cursor-pointer transition-colors p-2 text-center">
                    <Upload className="w-5 h-5 text-[#0B4F8A] mb-1" />
                    <span className="text-[11px] font-semibold text-[#072C4F]">Subir foto</span>
                    <span className="text-[9px] text-slate-400">JPG, PNG (máx 5MB)</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </label>
                )}
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: Ubicación y Mapa */}
        {currentStep === 3 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-black text-[#0F172A] tracking-tight">
                Ubicación geográfica en Merlo
              </h2>
              <p className="text-sm text-[#64748B] mt-1">
                Marcá el punto en el mapa interactivo o ingresá la dirección y referencias.
              </p>
            </div>

            {/* Address inputs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  Calle y altura aproximada
                </label>
                <input
                  type="text"
                  placeholder="Ej: Av. del Libertador 450"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  Referencia o entrecalles
                </label>
                <input
                  type="text"
                  placeholder="Ej: Esquina Jujuy, frente a la plaza"
                  value={formData.referenceLocation}
                  onChange={(e) => setFormData({ ...formData, referenceLocation: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400"
                />
              </div>
            </div>

            {/* Interactive Leaflet Map for Merlo */}
            <MerloMapSelector
              selectedNeighborhoodId={formData.neighborhoodId}
              latitude={formData.latitude}
              longitude={formData.longitude}
              onLocationChange={(lat: number, lng: number, nId: string) => {
                setFormData((prev: CreateComplaintInput) => ({
                  ...prev,
                  latitude: lat,
                  longitude: lng,
                  neighborhoodId: nId,
                }));
              }}
            />
          </div>
        )}

        {/* STEP 4: Contacto y Privacidad */}
        {currentStep === 4 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-black text-[#0F172A] tracking-tight">
                Datos de contacto y preferencias
              </h2>
              <p className="text-sm text-[#64748B] mt-1">
                Tus datos de contacto son <strong>estrictamente privados</strong> y solo se utilizan para notificarte los avances del reclamo.
              </p>
            </div>

            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  Nombre y Apellido *
                </label>
                <input
                  type="text"
                  placeholder="Tu nombre completo"
                  value={formData.contactName}
                  onChange={(e) => setFormData({ ...formData, contactName: e.target.value })}
                  className={`w-full px-4 py-3 rounded-xl border text-sm focus:outline-none focus:ring-2 ${
                    errors.contactName
                      ? 'border-rose-300 focus:ring-rose-400 bg-rose-50/20'
                      : 'border-slate-200 focus:ring-sky-400'
                  }`}
                />
                {errors.contactName && (
                  <p className="text-xs text-rose-600 font-semibold">{errors.contactName}</p>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                    Correo electrónico *
                  </label>
                  <input
                    type="email"
                    placeholder="tunombre@ejemplo.com"
                    value={formData.contactEmail}
                    onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                    className={`w-full px-4 py-3 rounded-xl border text-sm focus:outline-none focus:ring-2 ${
                      errors.contactEmail
                        ? 'border-rose-300 focus:ring-rose-400 bg-rose-50/20'
                        : 'border-slate-200 focus:ring-sky-400'
                    }`}
                  />
                  {errors.contactEmail && (
                    <p className="text-xs text-rose-600 font-semibold">{errors.contactEmail}</p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                    Teléfono / WhatsApp (opcional)
                  </label>
                  <input
                    type="tel"
                    placeholder="11-XXXX-XXXX"
                    value={formData.contactPhone}
                    onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400"
                  />
                </div>
              </div>
            </div>

            {/* Public Visibility Toggle */}
            <div className="p-4 rounded-2xl bg-sky-50/50 border border-sky-200 space-y-3">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.isPublic}
                  onChange={(e) => setFormData({ ...formData, isPublic: e.target.checked })}
                  className="mt-1 w-4 h-4 text-[#0B4F8A] rounded focus:ring-sky-400"
                />
                <div>
                  <span className="text-sm font-bold text-[#0F172A] flex items-center gap-1.5">
                    {formData.isPublic ? <Eye className="w-4 h-4 text-[#0B4F8A]" /> : <EyeOff className="w-4 h-4 text-slate-400" />}
                    Publicar reclamo en el listado y mapa vecinal
                  </span>
                  <p className="text-xs text-[#64748B] mt-0.5">
                    Permite que otros vecinos de Merlo vean la problemática y puedan sumarle apoyos ("Me afecta a mí también"). Tus datos personales permanecen ocultos.
                  </p>
                </div>
              </label>
            </div>

            {/* Privacy Acceptance */}
            <div className="pt-2">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.privacyAccepted}
                  onChange={(e) => setFormData({ ...formData, privacyAccepted: e.target.checked })}
                  className="mt-1 w-4 h-4 text-[#0B4F8A] rounded focus:ring-sky-400"
                />
                <span className="text-xs text-slate-600 leading-relaxed">
                  Acepto la <Link href="/privacidad" target="_blank" className="text-[#0B4F8A] font-semibold underline">política de privacidad</Link> y autorizo a los coordinadores comunitarios de Merlo Participa a gestionar y dar seguimiento a la presente solicitud vecinal.
                </span>
              </label>
              {errors.privacyAccepted && (
                <p className="text-xs text-rose-600 font-semibold mt-1">{errors.privacyAccepted}</p>
              )}
            </div>
          </div>
        )}

        {/* STEP 5: Resumen y Confirmación */}
        {currentStep === 5 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-black text-[#0F172A] tracking-tight">
                Resumen de la solicitud
              </h2>
              <p className="text-sm text-[#64748B] mt-1">
                Revisá los datos antes de enviar. Al confirmar, se generará tu código único de seguimiento.
              </p>
            </div>

            <div className="space-y-4 bg-sky-50/30 p-5 sm:p-6 rounded-2xl border border-sky-200">
              <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-sky-200/60">
                <div>
                  <span className="text-xs font-semibold text-sky-700 uppercase tracking-wider">
                    {REQUEST_TYPES.find((t) => t.type === formData.requestType)?.label}
                  </span>
                  <h3 className="text-lg font-bold text-[#0F172A] mt-0.5">
                    {formData.title}
                  </h3>
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#0B4F8A] text-white">
                  {COMPLAINT_CATEGORIES.find((c) => c.id === formData.categoryId)?.name}
                </span>
              </div>

              <p className="text-sm text-slate-700 whitespace-pre-line leading-relaxed">
                {formData.description}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 border-t border-sky-200/60 text-xs text-slate-600">
                <div>
                  <strong className="text-slate-900">Barrio:</strong>{' '}
                  {NEIGHBORHOODS.find((n) => n.id === formData.neighborhoodId)?.name}
                </div>
                {formData.address && (
                  <div>
                    <strong className="text-slate-900">Dirección:</strong> {formData.address}
                  </div>
                )}
                <div>
                  <strong className="text-slate-900">Contacto:</strong> {formData.contactName} ({formData.contactEmail})
                </div>
                <div>
                  <strong className="text-slate-900">Visibilidad:</strong> {formData.isPublic ? 'Pública con apoyos' : 'Privada'}
                </div>
              </div>

              {formData.attachments && formData.attachments.length > 0 && (
                <div className="pt-3 border-t border-sky-200/60">
                  <span className="text-xs font-semibold text-slate-700 block mb-2">
                    Fotos adjuntas ({formData.attachments.length}):
                  </span>
                  <div className="flex gap-2">
                    {formData.attachments.map((att: { fileUrl: string; fileName: string }, idx: number) => (
                      <div key={idx} className="w-16 h-16 rounded-lg overflow-hidden border border-slate-300">
                        <img src={att.fileUrl} alt={att.fileName} className="w-full h-full object-cover" />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Non-official reminder disclaimer */}
            <div className="p-4 rounded-xl bg-slate-100 border border-slate-200 flex items-start gap-2.5 text-xs text-slate-600 leading-relaxed">
              <ShieldAlert className="w-4 h-4 text-[#0B4F8A] shrink-0 mt-0.5" />
              <span>
                Al enviar este reporte, la comunidad vecinal de Merlo Participa lo revisará para coordinar visibilidad y difusión. Recordá que este portal es una herramienta ciudadana y no reemplaza los servicios oficiales de emergencias (911).
              </span>
            </div>
          </div>
        )}

        {/* STEP 6: Success Screen with Unique Tracking Code */}
        {currentStep === 6 && createdComplaint && (
          <div className="py-6 text-center space-y-6 animate-fade-in">
            <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div className="space-y-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-sky-50 text-[#072C4F]">
                <Sparkles className="w-3.5 h-3.5 text-[#0B4F8A]" />
                ¡Reclamo Registrado con Éxito!
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-[#0F172A] tracking-tight">
                Gracias por participar, {createdComplaint.contactName}
              </h2>
              <p className="text-sm text-[#64748B] max-w-md mx-auto">
                Tu solicitud ya ingresó al sistema de Merlo Participa y será revisada por nuestro equipo barrial.
              </p>
            </div>

            {/* Tracking Code Highlight Box */}
            <div className="max-w-md mx-auto p-6 rounded-2xl bg-gradient-to-br from-sky-50 to-white border-2 border-sky-200 shadow-md space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-[#0B4F8A]">
                Código Único de Seguimiento
              </span>
              
              <div className="flex items-center justify-center gap-3">
                <span className="text-2xl sm:text-3xl font-black font-mono tracking-widest text-[#072C4F]">
                  {createdComplaint.trackingCode}
                </span>
                <button
                  type="button"
                  onClick={copyTrackingCode}
                  className="p-2.5 rounded-xl bg-white border border-sky-200 hover:bg-sky-50 text-[#0B4F8A] shadow-sm transition-colors"
                  title="Copiar código de seguimiento"
                >
                  {copiedCode ? <Check className="w-5 h-5 text-emerald-600" /> : <Copy className="w-5 h-5" />}
                </button>
              </div>

              <p className="text-xs text-slate-500">
                Guardá este código para consultar el estado y avance de tu trámite en cualquier momento desde la sección <strong>Consultar mi reclamo</strong>.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
              <Link
                href={`/reclamos/${createdComplaint.id}`}
                className="w-full sm:w-auto px-6 py-3 rounded-xl font-bold text-sm text-white bg-[#0B4F8A] hover:bg-[#072C4F] shadow-md shadow-sky-900/20 transition-all"
              >
                Ver Ficha del Reclamo
              </Link>
              
              <Link
                href="/reclamos"
                className="w-full sm:w-auto px-6 py-3 rounded-xl font-bold text-sm text-[#072C4F] bg-sky-50 border border-sky-200 hover:bg-sky-100 transition-colors"
              >
                Explorar Reclamos de Merlo
              </Link>

              <button
                type="button"
                onClick={() => {
                  setCreatedComplaint(null);
                  setCurrentStep(1);
                  setFormData({
                    requestType: 'reclamo',
                    title: '',
                    description: '',
                    categoryId: 'cat-1',
                    neighborhoodId: 'n-1',
                    address: '',
                    referenceLocation: '',
                    latitude: MERLO_MAP_CONFIG.center[0],
                    longitude: MERLO_MAP_CONFIG.center[1],
                    incidentDate: new Date().toISOString().split('T')[0],
                    isPublic: true,
                    contactName: '',
                    contactEmail: '',
                    contactPhone: '',
                    privacyAccepted: true,
                    attachments: [],
                  });
                }}
                className="w-full sm:w-auto px-4 py-3 rounded-xl text-xs font-semibold text-slate-500 hover:text-slate-800"
              >
                Cargar otro reclamo
              </button>
            </div>
          </div>
        )}

        {/* Wizard Footer Navigation (Back / Next / Submit Buttons) */}
        {currentStep <= 5 && (
          <div className="mt-8 pt-6 border-t border-slate-100 flex items-center justify-between">
            {currentStep > 1 ? (
              <button
                type="button"
                onClick={handleBack}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-100 transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Anterior</span>
              </button>
            ) : (
              <div />
            )}

            {currentStep < 5 ? (
              <button
                type="button"
                onClick={handleNext}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold text-white bg-[#0B4F8A] hover:bg-[#072C4F] shadow-md shadow-sky-900/20 transition-all hover:scale-[1.02]"
              >
                <span>Siguiente</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="inline-flex items-center gap-2 px-8 py-3 rounded-xl text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow-md shadow-emerald-600/20 transition-all hover:scale-[1.02] disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <span className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                    <span>Registrando solicitud...</span>
                  </>
                ) : (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Confirmar y Enviar Reclamo</span>
                  </>
                )}
              </button>
            )}
          </div>
        )}

      </div>
    </div>
  );
};
