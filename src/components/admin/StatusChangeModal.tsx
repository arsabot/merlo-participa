'use client';

import React, { useState } from 'react';
import { Complaint, ComplaintStatus } from '@/lib/types';
import { COMPLAINT_STATUS_CONFIG } from '@/lib/constants';
import { complaintsService } from '@/lib/services/complaintsService';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { X, Check, Lock, Send, ShieldAlert } from 'lucide-react';

interface StatusChangeModalProps {
  complaint: Complaint;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (updated: Complaint) => void;
}

export const StatusChangeModal: React.FC<StatusChangeModalProps> = ({
  complaint,
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [newStatus, setNewStatus] = useState<ComplaintStatus>(complaint.status);
  const [updateTitle, setUpdateTitle] = useState('');
  const [updateDescription, setUpdateDescription] = useState('');
  const [isInternalNote, setIsInternalNote] = useState(false);
  const [authorName, setAuthorName] = useState('Equipo LLA Merlo');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!updateTitle.trim()) {
      setError('Por favor ingresá un título para la actualización.');
      return;
    }
    if (!updateDescription.trim()) {
      setError('Por favor detallá el informe o motivo del cambio de estado.');
      return;
    }

    setIsSubmitting(true);
    try {
      const updated = complaintsService.updateComplaintStatus(
        complaint.id,
        newStatus,
        updateTitle.trim(),
        updateDescription.trim(),
        isInternalNote,
        authorName.trim()
      );

      if (updated) {
        onSuccess(updated);
        onClose();
      } else {
        setError('Error al actualizar el reclamo.');
      }
    } catch (err) {
      setError('Ocurrió un fallo en la operación.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl max-w-lg w-full border border-[#E8E4EF] shadow-2xl overflow-hidden animate-scale-up">
        
        {/* Header */}
        <div className="p-6 bg-purple-50/50 border-b border-purple-100 flex items-center justify-between">
          <div>
            <span className="text-[11px] font-mono font-bold text-purple-700 bg-purple-100 px-2 py-0.5 rounded">
              {complaint.trackingCode}
            </span>
            <h3 className="text-lg font-black text-[#17151D] mt-1">
              Actualizar Estado y Gestión
            </h3>
          </div>
          <button
            onClick={onClose}
            type="button"
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium">
              {error}
            </div>
          )}

          {/* Current Status vs New Status */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Nuevo Estado de Gestión *
            </label>
            <select
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value as ComplaintStatus)}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm font-semibold text-slate-800 bg-white focus:ring-2 focus:ring-purple-400 focus:outline-none"
            >
              {Object.entries(COMPLAINT_STATUS_CONFIG).map(([key, val]) => (
                <option key={key} value={key}>
                  {val.label} - {val.description.slice(0, 45)}...
                </option>
              ))}
            </select>
          </div>

          {/* Warning for Resuelto */}
          {newStatus === 'resuelto' && (
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 leading-relaxed flex items-start gap-2">
              <ShieldAlert className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>
                <strong>Atención:</strong> El estado "Resuelto" solo debe indicarse si existe constatación documentada o verificación vecinal efectiva de la resolución.
              </span>
            </div>
          )}

          {/* Update Title */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Título de la actualización *
            </label>
            <input
              type="text"
              placeholder="Ej: Elevación formal al área correspondiente / Inspección"
              value={updateTitle}
              onChange={(e) => setUpdateTitle(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-purple-400 focus:outline-none"
            />
          </div>

          {/* Update Description */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Descripción / Motivo / Informe de avance *
            </label>
            <textarea
              rows={3}
              placeholder="Detallá la acción llevada a cabo, número de expediente o resultado..."
              value={updateDescription}
              onChange={(e) => setUpdateDescription(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-purple-400 focus:outline-none"
            />
          </div>

          {/* Author Name */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Responsable / Área ejecutora
            </label>
            <input
              type="text"
              value={authorName}
              onChange={(e) => setAuthorName(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-purple-400 focus:outline-none"
            />
          </div>

          {/* Internal note checkbox */}
          <div className="p-3 rounded-xl bg-amber-50/70 border border-amber-200">
            <label className="flex items-center gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={isInternalNote}
                onChange={(e) => setIsInternalNote(e.target.checked)}
                className="w-4 h-4 text-amber-600 rounded focus:ring-amber-400"
              />
              <span className="text-xs font-bold text-amber-900 flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5" />
                Marcar como nota interna privada (no visible para el vecino)
              </span>
            </label>
          </div>

          {/* Actions */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-[#391759] hover:bg-[#240c3a] shadow-md transition-all"
            >
              <Check className="w-4 h-4" />
              <span>Guardar Actualización</span>
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
