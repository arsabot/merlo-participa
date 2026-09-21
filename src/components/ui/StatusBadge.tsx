import React from 'react';
import { ComplaintStatus } from '@/lib/types';
import { COMPLAINT_STATUS_CONFIG } from '@/lib/constants';
import { 
  Clock, 
  Search, 
  CheckCircle2, 
  Send, 
  Activity, 
  ShieldCheck, 
  Archive 
} from 'lucide-react';

interface StatusBadgeProps {
  status: ComplaintStatus;
  showIcon?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  showIcon = true,
  size = 'md',
  className = '',
}) => {
  const config = COMPLAINT_STATUS_CONFIG[status] || COMPLAINT_STATUS_CONFIG.recibido;

  const getIcon = () => {
    const iconProps = { className: size === 'sm' ? 'w-3 h-3' : 'w-4 h-4' };
    switch (status) {
      case 'recibido':
        return <Clock {...iconProps} />;
      case 'en_revision':
        return <Search {...iconProps} />;
      case 'validado':
        return <CheckCircle2 {...iconProps} />;
      case 'derivado':
        return <Send {...iconProps} />;
      case 'en_seguimiento':
        return <Activity {...iconProps} />;
      case 'resuelto':
        return <ShieldCheck {...iconProps} />;
      case 'cerrado':
        return <Archive {...iconProps} />;
      default:
        return <Clock {...iconProps} />;
    }
  };

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs font-medium gap-1',
    md: 'px-2.5 py-1 text-xs font-semibold gap-1.5',
    lg: 'px-3 py-1.5 text-sm font-semibold gap-2',
  };

  return (
    <span
      className={`inline-flex items-center rounded-full border ${config.badgeClass} ${sizeClasses[size]} ${className}`}
      style={{
        backgroundColor: config.bg,
        color: config.text,
        borderColor: config.border,
      }}
    >
      {showIcon && getIcon()}
      <span>{config.label}</span>
    </span>
  );
};
