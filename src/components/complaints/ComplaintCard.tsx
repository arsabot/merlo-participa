import React from 'react';
import Link from 'next/link';
import { Complaint } from '@/lib/types';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { CategoryBadge } from '@/components/ui/CategoryBadge';
import { SupportButton } from './SupportButton';
import { formatDate } from '@/lib/utils';
import { MapPin, Calendar, ArrowRight, MessageSquareQuote } from 'lucide-react';

interface ComplaintCardProps {
  complaint: Complaint;
  priority?: boolean;
}

export const ComplaintCard: React.FC<ComplaintCardProps> = ({ complaint }) => {
  const hasImage = complaint.attachments && complaint.attachments.length > 0;
  const mainImage = hasImage ? complaint.attachments![0].fileUrl : null;

  return (
    <div className="bg-white rounded-2xl border border-[#E2E8F0] p-5 sm:p-6 shadow-civic-soft hover:shadow-civic-card transition-all duration-300 hover:border-sky-300 flex flex-col justify-between group">
      <div>
        {/* Top Badges & Tracking Code */}
        <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2 flex-wrap">
            <CategoryBadge categoryId={complaint.categoryId} size="sm" />
            <StatusBadge status={complaint.status} size="sm" />
          </div>
          <span className="text-[11px] font-mono font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200">
            {complaint.trackingCode}
          </span>
        </div>

        {/* Title */}
        <Link href={`/reclamos/${complaint.id}`} className="block">
          <h3 className="text-lg font-bold text-[#0F172A] group-hover:text-[#0B4F8A] transition-colors leading-snug line-clamp-2">
            {complaint.title}
          </h3>
        </Link>

        {/* Description snippet */}
        <p className="mt-2 text-sm text-[#64748B] line-clamp-3 leading-relaxed">
          {complaint.description}
        </p>

        {/* Optional Image Preview */}
        {mainImage && (
          <div className="mt-4 relative w-full h-44 rounded-xl overflow-hidden bg-slate-100 border border-slate-200">
            <img
              src={mainImage}
              alt={complaint.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              loading="lazy"
            />
          </div>
        )}

        {/* Metadata info: Neighborhood & Date */}
        <div className="mt-4 pt-4 border-t border-slate-100 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-[#64748B]">
          <div className="flex items-center gap-1 font-medium text-slate-700">
            <MapPin className="w-3.5 h-3.5 text-[#0B4F8A]" />
            <span>{complaint.neighborhood?.name || 'Merlo'}</span>
          </div>

          <div className="flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            <span>{formatDate(complaint.createdAt)}</span>
          </div>

          {complaint.updates && complaint.updates.length > 1 && (
            <div className="flex items-center gap-1 text-[#0B4F8A] font-medium">
              <MessageSquareQuote className="w-3.5 h-3.5" />
              <span>{complaint.updates.length} avances</span>
            </div>
          )}
        </div>
      </div>

      {/* Card Footer: Support Button & Full Detail Link */}
      <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
        <SupportButton complaintId={complaint.id} initialCount={complaint.supportCount} size="sm" />

        <Link
          href={`/reclamos/${complaint.id}`}
          className="inline-flex items-center gap-1 text-xs font-bold text-[#0B4F8A] hover:text-[#072C4F] group-hover:translate-x-0.5 transition-transform"
        >
          <span>Ver ficha completa</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
};
