import React from 'react';

interface MerloLogoProps {
  className?: string;
  withBackground?: boolean;
  width?: number | string;
  height?: number | string;
}

export const MerloLogo: React.FC<MerloLogoProps> = ({
  className = 'h-9 w-auto',
  withBackground = false,
  width,
  height,
}) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 600 180"
      className={className}
      width={width}
      height={height}
      aria-label="Merlo Participa"
      fill="none"
    >
      <defs>
        <linearGradient id="merlo-comp-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#0B4F8A" />
          <stop offset="100%" stopColor="#072C4F" />
        </linearGradient>
        <linearGradient id="merlo-accent-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#38BDF8" />
          <stop offset="100%" stopColor="#0284C7" />
        </linearGradient>
      </defs>

      {withBackground && (
        <rect width="600" height="180" rx="24" fill="#0B4F8A" />
      )}

      {/* Icon Badge */}
      <g transform="translate(15, 15)">
        <rect width="150" height="150" rx="36" fill="url(#merlo-comp-grad)" />
        <rect width="144" height="144" x="3" y="3" rx="33" stroke="#38BDF8" strokeWidth="2.5" opacity="0.4" />
        <path d="M75 32 C54 32 38 48 38 69 C38 96 75 124 75 124 C75 124 112 96 112 69 C112 48 96 32 75 32 Z" fill="white" />
        <circle cx="75" cy="65" r="14" fill="#0B4F8A" />
        <path d="M57 90 L67 60 L75 74 L83 60 L93 90" stroke="url(#merlo-accent-grad)" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" />
      </g>

      {/* Brand Text */}
      <g transform="translate(185, 38)">
        <text x="0" y="58" fontFamily="system-ui, -apple-system, sans-serif" fontWeight="900" fontSize="52" letterSpacing="-1" fill="#FFFFFF">
          Merlo<tspan fill="#38BDF8">Participa</tspan>
        </text>
        
        <g transform="translate(2, 85)">
          <rect width="270" height="24" rx="6" fill="#0B4F8A" opacity="0.9" />
          <text x="10" y="16" fontFamily="system-ui, -apple-system, sans-serif" fontWeight="800" fontSize="11.5" letterSpacing="1.5" fill="#E0F2FE">
            PORTAL VECINAL INDEPENDIENTE
          </text>
        </g>
      </g>
    </svg>
  );
};
