import React from 'react';
import { 
  Lightbulb, 
  Construction, 
  Trash2, 
  CloudRain, 
  Sparkles, 
  ShieldAlert, 
  Trees, 
  Car, 
  Bus, 
  HeartPulse, 
  GraduationCap, 
  Accessibility, 
  HelpCircle,
  LucideIcon 
} from 'lucide-react';
import { COMPLAINT_CATEGORIES } from '@/lib/constants';

interface CategoryBadgeProps {
  categoryId?: string;
  categoryName?: string;
  showIcon?: boolean;
  size?: 'sm' | 'md';
  className?: string;
}

const iconMap: Record<string, LucideIcon> = {
  Lightbulb,
  Construction,
  Trash2,
  CloudRain,
  Sparkles,
  ShieldAlert,
  Trees,
  Car,
  Bus,
  HeartPulse,
  GraduationCap,
  Accessibility,
  HelpCircle,
};

export const CategoryBadge: React.FC<CategoryBadgeProps> = ({
  categoryId,
  categoryName,
  showIcon = true,
  size = 'md',
  className = '',
}) => {
  const category = COMPLAINT_CATEGORIES.find(
    (c) => c.id === categoryId || c.name.toLowerCase() === categoryName?.toLowerCase()
  ) || {
    id: 'unknown',
    name: categoryName || 'Categoría',
    slug: 'categoria',
    icon: 'HelpCircle',
    color: '#0B4F8A',
    description: '',
  };

  const IconComponent = iconMap[category.icon] || HelpCircle;

  return (
    <span
      className={`inline-flex items-center font-medium rounded-md border ${
        size === 'sm' ? 'px-2 py-0.5 text-xs gap-1' : 'px-2.5 py-1 text-xs gap-1.5'
      } ${className}`}
      style={{
        backgroundColor: `${category.color}15`,
        color: category.color,
        borderColor: `${category.color}35`,
      }}
    >
      {showIcon && <IconComponent className={size === 'sm' ? 'w-3 h-3' : 'w-3.5 h-3.5'} />}
      <span>{category.name}</span>
    </span>
  );
};
