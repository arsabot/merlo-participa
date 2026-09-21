'use client';

import React, { useState, useEffect } from 'react';
import { ThumbsUp, Check } from 'lucide-react';
import { complaintsService } from '@/lib/services/complaintsService';
import { getClientFingerprint } from '@/lib/utils';

interface SupportButtonProps {
  complaintId: string;
  initialCount: number;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'outline' | 'solid';
  className?: string;
  showText?: boolean;
}

export const SupportButton: React.FC<SupportButtonProps> = ({
  complaintId,
  initialCount,
  size = 'md',
  variant = 'outline',
  className = '',
  showText = true,
}) => {
  const [count, setCount] = useState(initialCount);
  const [hasSupported, setHasSupported] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  useEffect(() => {
    const fp = getClientFingerprint();
    setHasSupported(complaintsService.hasUserSupported(complaintId, fp));
  }, [complaintId]);

  const handleSupport = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (hasSupported || isLoading) return;

    setIsLoading(true);
    const fp = getClientFingerprint();
    const res = complaintsService.supportComplaint(complaintId, fp);

    if (res.success) {
      setCount(res.newCount);
      setHasSupported(true);
      setFeedback('¡Apoyo sumado!');
      setTimeout(() => setFeedback(null), 3000);
    } else {
      setFeedback(res.message);
      setTimeout(() => setFeedback(null), 3000);
    }
    setIsLoading(false);
  };

  const sizeStyles = {
    sm: 'px-2.5 py-1 text-xs gap-1.5',
    md: 'px-3.5 py-2 text-sm gap-2',
    lg: 'px-4 py-2.5 text-base gap-2.5',
  };

  return (
    <div className="relative inline-flex flex-col items-start">
      <button
        onClick={handleSupport}
        disabled={hasSupported || isLoading}
        type="button"
        className={`inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-200 ${sizeStyles[size]} ${
          hasSupported
            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 cursor-default'
            : variant === 'solid'
            ? 'bg-[#391759] text-white hover:bg-[#240c3a] shadow-sm active:scale-95'
            : 'bg-white text-[#391759] border border-purple-200 hover:border-[#391759] hover:bg-purple-50 active:scale-95'
        } ${className}`}
        title={hasSupported ? 'Ya has apoyado este reporte' : 'Apoyar este reclamo barrial'}
      >
        {hasSupported ? (
          <Check className={size === 'sm' ? 'w-3.5 h-3.5' : 'w-4 h-4'} />
        ) : (
          <ThumbsUp className={`${size === 'sm' ? 'w-3.5 h-3.5' : 'w-4 h-4'} ${isLoading ? 'animate-bounce' : ''}`} />
        )}
        
        <span>{count}</span>
        
        {showText && (
          <span className="font-normal text-xs opacity-90 hidden sm:inline">
            {hasSupported ? 'Apoyado' : 'Me afecta'}
          </span>
        )}
      </button>

      {feedback && (
        <span className="absolute -top-7 left-0 bg-slate-900 text-white text-[11px] font-medium px-2 py-0.5 rounded shadow-lg whitespace-nowrap animate-fade-in z-20">
          {feedback}
        </span>
      )}
    </div>
  );
};
