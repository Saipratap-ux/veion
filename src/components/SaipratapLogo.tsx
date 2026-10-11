import React from 'react';

interface SaipratapLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  className?: string;
  withTagline?: boolean;
}

export const SaipratapLogo: React.FC<SaipratapLogoProps> = ({
  size = 'md',
  showText = true,
  className = '',
  withTagline = false,
}) => {
  // Dimensions mapping
  const iconSizes = {
    sm: 32,
    md: 40,
    lg: 52,
    xl: 80,
  };

  const dim = iconSizes[size];

  return (
    <div className={`flex items-center gap-2.5 select-none ${className}`}>
      {/* Glossy Emblem SVG */}
      <svg
        width={dim}
        height={dim}
        viewBox="0 0 512 512"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0 drop-shadow-md hover:scale-105 transition-transform duration-200"
      >
        <defs>
          {/* Squircle Dark Navy Background Gradient */}
          <linearGradient id="spBgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#0d1b3e" />
            <stop offset="45%" stopColor="#081026" />
            <stop offset="100%" stopColor="#040817" />
          </linearGradient>

          {/* Golden Crown Gradient */}
          <linearGradient id="spCrownGrad" x1="0%" y1="100%" x2="0%" y2="0%">
            <stop offset="0%" stopColor="#d97706" />
            <stop offset="50%" stopColor="#fbbf24" />
            <stop offset="100%" stopColor="#fef08a" />
          </linearGradient>

          {/* Upper Golden/Orange "S" Wing Gradient */}
          <linearGradient id="spUpperSGrad" x1="0%" y1="0%" x2="100%" y2="80%">
            <stop offset="0%" stopColor="#fde047" />
            <stop offset="25%" stopColor="#fbbf24" />
            <stop offset="65%" stopColor="#f59e0b" />
            <stop offset="100%" stopColor="#d97706" />
          </linearGradient>

          {/* Upper "S" Volumetric Shadow */}
          <linearGradient id="spUpperSShade" x1="10%" y1="20%" x2="90%" y2="100%">
            <stop offset="0%" stopColor="#fef08a" stopOpacity="0.8" />
            <stop offset="50%" stopColor="#b45309" stopOpacity="0.1" />
            <stop offset="100%" stopColor="#78350f" stopOpacity="0.7" />
          </linearGradient>

          {/* Lower Azure/Royal Blue "S" Wing Gradient */}
          <linearGradient id="spLowerSGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#38bdf8" />
            <stop offset="40%" stopColor="#0284c7" />
            <stop offset="75%" stopColor="#2563eb" />
            <stop offset="100%" stopColor="#1d4ed8" />
          </linearGradient>

          {/* Lower "S" Inner Glow */}
          <linearGradient id="spLowerSGlow" x1="10%" y1="10%" x2="80%" y2="80%">
            <stop offset="0%" stopColor="#7dd3fc" stopOpacity="0.9" />
            <stop offset="60%" stopColor="#0284c7" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#0f172a" stopOpacity="0.6" />
          </linearGradient>

          {/* Orbital Swoosh Ring Gradient */}
          <linearGradient id="spOrbitalGrad" x1="0%" y1="50%" x2="100%" y2="50%">
            <stop offset="0%" stopColor="#ea580c" />
            <stop offset="25%" stopColor="#f59e0b" />
            <stop offset="75%" stopColor="#fde047" />
            <stop offset="100%" stopColor="#f59e0b" />
          </linearGradient>

          {/* Ambient Glow Filter */}
          <filter id="spGlow" x="-10%" y="-10%" width="120%" height="120%">
            <feDropShadow dx="0" dy="8" stdDeviation="12" floodColor="#f59e0b" floodOpacity="0.25" />
          </filter>
        </defs>

        {/* Squircle App Icon Container */}
        <rect width="512" height="512" rx="112" fill="url(#spBgGrad)" />
        <rect
          width="508"
          height="508"
          x="2"
          y="2"
          rx="110"
          stroke="#1e2d5a"
          strokeWidth="3"
          strokeOpacity="0.7"
        />

        {/* Outer subtle rim reflection */}
        <path
          d="M60 140 C140 70 372 70 452 140"
          stroke="#ffffff"
          strokeWidth="2"
          strokeOpacity="0.08"
          fill="none"
        />

        {/* --- 1. Royal Crown atop S --- */}
        <g id="crown" filter="url(#spGlow)">
          {/* Crown Base & 3 Prongs */}
          <path
            d="M205 130 
               L215 95 
               L238 116 
               L256 70 
               L274 116 
               L297 95 
               L307 130 
               C280 137 232 137 205 130 Z"
            fill="url(#spCrownGrad)"
          />
          {/* Crown Pearl Jewels */}
          <circle cx="215" cy="93" r="6" fill="#fef08a" />
          <circle cx="256" cy="68" r="8" fill="#fef08a" />
          <circle cx="297" cy="93" r="6" fill="#fef08a" />
          {/* Crown Base Trim Highlight */}
          <path
            d="M210 128 C235 134 277 134 302 128"
            stroke="#fef08a"
            strokeWidth="3"
            strokeLinecap="round"
          />
        </g>

        {/* --- 2. Upper Golden "S" Wing --- */}
        <g id="upper-s">
          <path
            d="M345 152 
               C310 142 225 145 190 190 
               C160 228 178 280 230 290 
               L325 240 
               C325 240 310 200 255 192 
               C230 188 220 200 220 208 
               C220 216 232 224 250 226 
               L315 220 
               C340 195 348 165 345 152 Z"
            fill="url(#spUpperSGrad)"
          />
          {/* Upper "S" Volumetric 3D Form Overlay */}
          <path
            d="M190 190 
               C225 145 310 142 345 152 
               C348 165 340 195 315 220 
               L250 226 
               C232 224 220 216 220 208 
               C220 200 230 188 255 192 
               C310 200 325 240 325 240 
               L230 290 
               C178 280 160 228 190 190 Z"
            fill="url(#spUpperSShade)"
          />
          {/* Top highlight crest */}
          <path
            d="M200 180 C240 148 305 148 340 155"
            stroke="#fff"
            strokeWidth="3"
            strokeOpacity="0.6"
            strokeLinecap="round"
          />
        </g>

        {/* --- 3. Dynamic Orbital Swoosh Ring --- */}
        <g id="orbital-ring">
          <path
            d="M138 318 
               C180 292 270 248 375 208 
               C320 230 230 274 152 308 
               C145 311 140 315 138 318 Z"
            fill="url(#spOrbitalGrad)"
          />
          <path
            d="M152 308 
               C220 278 300 238 375 208 
               C330 226 250 268 180 296 
               Z"
            fill="#fde047"
            opacity="0.8"
          />
        </g>

        {/* --- 4. Lower Azure / Royal Blue "S" Wing --- */}
        <g id="lower-s">
          <path
            d="M165 342 
               C185 365 240 382 305 358 
               C350 342 365 285 310 245 
               L260 262 
               C295 288 285 325 250 332 
               C215 340 190 320 190 300 
               C190 285 205 272 230 260 
               L185 272 
               C165 292 155 320 165 342 Z"
            fill="url(#spLowerSGrad)"
          />
          {/* Lower "S" Inner Luminous Shading */}
          <path
            d="M165 342 
               C185 365 240 382 305 358 
               C350 342 365 285 310 245 
               L260 262 
               C295 288 285 325 250 332 
               C215 340 190 320 190 300 
               C190 285 205 272 230 260 
               L185 272 
               C165 292 155 320 165 342 Z"
            fill="url(#spLowerSGlow)"
          />
          {/* Bottom Rim Highlight */}
          <path
            d="M195 352 C240 372 290 365 320 345"
            stroke="#7dd3fc"
            strokeWidth="3.5"
            strokeOpacity="0.7"
            strokeLinecap="round"
          />
        </g>
      </svg>

      {/* Brand Wordmark (SAI in Gold, PRATAP in White) */}
      {showText && (
        <div className="flex flex-col leading-none">
          <div className="flex items-center tracking-tight font-extrabold text-base sm:text-lg">
            <span className="text-amber-400 drop-shadow-sm font-['Plus_Jakarta_Sans',sans-serif]">SAI</span>
            <span className="text-white drop-shadow-sm font-['Plus_Jakarta_Sans',sans-serif]">PRATAP</span>
          </div>
          {withTagline && (
            <span className="text-[10px] font-mono tracking-wider uppercase text-slate-400 mt-0.5">
              SafeVision AI · Command Center
            </span>
          )}
        </div>
      )}
    </div>
  );
};
