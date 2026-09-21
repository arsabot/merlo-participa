import React from 'react';
import { ComplaintUpdate } from '@/lib/types';
import { formatDateTime } from '@/lib/utils';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { 
  CheckCircle2, 
  Clock, 
  Send, 
  ShieldCheck, 
  UserCheck, 
  FileText,
  Lock
} from 'lucide-react';

interface TimelineProps {
  updates: ComplaintUpdate[];
  isAdminView?: boolean;
}

export const Timeline: React.FC<TimelineProps> = ({ updates, isAdminView = false }) => {
  const visibleUpdates = isAdminView
    ? updates
    : updates.filter((u) => !u.isInternalNote);

  if (!visibleUpdates || visibleUpdates.length === 0) {
    return (
      <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-center text-sm text-slate-500">
        Aún no se registran actualizaciones sobre esta solicitud.
      </div>
    );
  }

  // Sort chronological descending (newest first)
  const sorted = [...visibleUpdates].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  return (
    <div className="relative pl-6 sm:pl-8 space-y-6 before:absolute before:top-3 before:bottom-3 before:left-2.5 sm:before:left-3.5 before:w-0.5 before:bg-purple-200">
      {sorted.map((update, index) => {
        const isLatest = index === 0;

        return (
          <div key={update.id} className="relative group">
            {/* Step bullet dot */}
            <div
              className={`absolute -left-6 sm:-left-8 top-1.5 w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center border-2 ${
                isLatest
                  ? 'bg-[#391759] border-white text-white shadow-md ring-4 ring-purple-100'
                  : 'bg-white border-purple-400 text-purple-800'
              }`}
            >
              {update.newStatus === 'resuelto' ? (
                <ShieldCheck className="w-3.5 h-3.5" />
              ) : update.newStatus === 'derivado' ? (
                <Send className="w-3.5 h-3.5" />
              ) : isLatest ? (
                <CheckCircle2 className="w-3.5 h-3.5" />
              ) : (
                <Clock className="w-3 h-3" />
              )}
            </div>

            {/* Content box */}
            <div
              className={`p-4 sm:p-5 rounded-xl border ${
                update.isInternalNote
                  ? 'bg-amber-50/60 border-amber-200'
                  : isLatest
                  ? 'bg-purple-50/40 border-purple-200 shadow-sm'
                  : 'bg-white border-slate-200'
              }`}
            >
              <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <h4 className="text-sm sm:text-base font-bold text-[#17151D]">
                    {update.title}
                  </h4>
                  <StatusBadge status={update.newStatus} size="sm" />
                  {update.isInternalNote && (
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded bg-amber-200 text-amber-900">
                      <Lock className="w-3 h-3" />
                      Nota interna
                    </span>
                  )}
                </div>

                <time className="text-xs font-medium text-slate-500">
                  {formatDateTime(update.createdAt)}
                </time>
              </div>

              <p className="text-sm text-[#6B6875] leading-relaxed whitespace-pre-line">
                {update.description}
              </p>

              <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <span className="flex items-center gap-1 font-bold text-[#391759]">
                  <UserCheck className="w-3.5 h-3.5 text-[#391759]" />
                  {update.authorName}
                </span>
                {isLatest && (
                  <span className="text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    Estado actual
                  </span>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
