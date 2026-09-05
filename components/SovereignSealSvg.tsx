'use client';

import React from 'react';

export type SealVariant = 'gold' | 'cyan' | 'monochrome' | 'badge' | 'icon';

export interface SovereignSealSvgProps {
  className?: string;
  size?: number | string;
  variant?: SealVariant;
  isMonochrome?: boolean;
  showGoldReflection?: boolean;
  showVerifiedRibbon?: boolean;
  animate?: 'entry' | 'slow' | 'float' | 'none';
  transparentBg?: boolean;
  title?: string;
}

// Generate 60 precision bezel chronometer ticks with rounded numbers for 100% deterministic SSR/client hydration
const SEAL_TICKS = Array.from({ length: 60 }).map((_, i) => {
  const angle = (i * 360) / 60;
  const isMajor = i % 5 === 0;
  const isCardinal = i % 15 === 0;
  const rad = (angle * Math.PI) / 180;
  const rOuter = 232;
  const rInner = isCardinal ? 218 : isMajor ? 222 : 226;
  const x1 = Math.round((250 + Math.sin(rad) * rInner) * 1000) / 1000;
  const y1 = Math.round((250 - Math.cos(rad) * rInner) * 1000) / 1000;
  const x2 = Math.round((250 + Math.sin(rad) * rOuter) * 1000) / 1000;
  const y2 = Math.round((250 - Math.cos(rad) * rOuter) * 1000) / 1000;
  return {
    x1, y1, x2, y2,
    isCardinal,
    isMajor,
  };
});

// Generate 36 scalloped emblem rosette teeth with rounded coordinates
const SCALLOP_CIRCLES = Array.from({ length: 36 }).map((_, i) => {
  const angle = (i * 360) / 36;
  const rad = (angle * Math.PI) / 180;
  return {
    cx: Math.round((250 + Math.sin(rad) * 242) * 1000) / 1000,
    cy: Math.round((250 - Math.cos(rad) * 242) * 1000) / 1000,
  };
});

// Generate 12 radial guilloche security lattice rays
const GUILLOCHE_RAYS = Array.from({ length: 12 }).map((_, i) => {
  const angle = (i * 360) / 12;
  const rad = (angle * Math.PI) / 180;
  return {
    x1: Math.round((250 + Math.sin(rad) * 118) * 1000) / 1000,
    y1: Math.round((250 - Math.cos(rad) * 118) * 1000) / 1000,
    x2: Math.round((250 + Math.sin(rad) * 186) * 1000) / 1000,
    y2: Math.round((250 - Math.cos(rad) * 186) * 1000) / 1000,
  };
});

export default function SovereignSealSvg({ 
  className = '', 
  size = 220,
  variant = 'gold',
  isMonochrome = false,
  showGoldReflection = true,
  showVerifiedRibbon = true,
  animate = 'entry',
  transparentBg = false,
  title = "ZYRQUEN Ω∞ SOVEREIGN CANONICAL SEAL"
}: SovereignSealSvgProps) {
  const mono = isMonochrome || variant === 'monochrome';
  const isCompactIcon = variant === 'icon';

  // Animation wrapper classes
  let animClass = '';
  if (animate === 'entry') animClass = 'animate-seal-intro';
  else if (animate === 'float') animClass = 'animate-seal-float';
  else if (animate === 'slow') animClass = 'animate-spin-slow';

  // Gold shine class
  const glowClass = (!mono && showGoldReflection) ? 'animate-gold-shine' : '';

  return (
    <div className={`relative inline-flex items-center justify-center ${animClass} ${className}`}>
      
      {/* AMBIENT GOLD REFLECTION BACKDROP (Color mode only) */}
      {!mono && showGoldReflection && (
        <div 
          className="absolute inset-0 rounded-full bg-gradient-to-tr from-amber-500/25 via-yellow-400/30 to-amber-600/20 blur-xl -z-10 pointer-events-none scale-110 transform transition-all duration-700"
          aria-hidden="true"
        />
      )}

      <svg
        viewBox="0 0 500 500"
        width={size}
        height={size}
        className={`select-none overflow-visible ${glowClass} ${
          mono 
            ? 'filter drop-shadow-[0_2px_8px_rgba(0,0,0,0.15)] bg-white rounded-full' 
            : 'filter drop-shadow-[0_0_25px_rgba(245,158,11,0.45)]'
        }`}
        xmlns="http://www.w3.org/2000/svg"
        role="img"
        aria-label={title}
      >
        <defs>
          {/* ================= COLOR PALETTE & GRADIENTS ================= */}
          {/* Electric Cyan Gradients */}
          <linearGradient id="sovCyanBezel" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#E0F2FE" />
            <stop offset="25%" stopColor="#38BDF8" />
            <stop offset="70%" stopColor="#0284C7" />
            <stop offset="100%" stopColor="#0369A1" />
          </linearGradient>

          {/* Sovereign Gold Amber Gradients */}
          <radialGradient id="sovAmberShine" cx="35%" cy="30%" r="75%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="20%" stopColor="#FEF08A" />
            <stop offset="50%" stopColor="#F59E0B" />
            <stop offset="80%" stopColor="#B45309" />
            <stop offset="100%" stopColor="#78350F" />
          </radialGradient>

          <linearGradient id="sovAmberLinear" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFFBEB" />
            <stop offset="25%" stopColor="#FDE047" />
            <stop offset="60%" stopColor="#D97706" />
            <stop offset="100%" stopColor="#78350F" />
          </linearGradient>

          <linearGradient id="sovGoldRibbonGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#78350F" />
            <stop offset="20%" stopColor="#D97706" />
            <stop offset="50%" stopColor="#FEF08A" />
            <stop offset="80%" stopColor="#D97706" />
            <stop offset="100%" stopColor="#78350F" />
          </linearGradient>

          {/* High-Tech Dark Core */}
          <radialGradient id="sovCoreBg" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#0f1d3d" />
            <stop offset="60%" stopColor="#081024" />
            <stop offset="100%" stopColor="#030712" />
          </radialGradient>

          {/* Gold Ambient Reflector Radial Halo */}
          <radialGradient id="sovGoldAuraRadial" cx="50%" cy="50%" r="50%">
            <stop offset="70%" stopColor="#F59E0B" stopOpacity="0.4" />
            <stop offset="90%" stopColor="#FBBF24" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#F59E0B" stopOpacity="0" />
          </radialGradient>

          {/* Glow & Specular Filters */}
          <filter id="sovCyanGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="4.5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          <filter id="sovGoldGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          <filter id="sovVerifiedPlaqueShadow" x="-10%" y="-20%" width="120%" height="150%">
            <feDropShadow dx="0" dy="4" stdDeviation="4" floodColor="#000000" floodOpacity="0.8" />
          </filter>

          {/* ================= MONOCHROME PRINT PATTERNS ================= */}
          <pattern id="monoHatch" width="8" height="8" patternTransform="rotate(45 0 0)" patternUnits="userSpaceOnUse">
            <line x1="0" y1="0" x2="0" y2="8" stroke="#111827" strokeWidth="1" />
          </pattern>
          <pattern id="monoDotGrid" width="6" height="6" patternUnits="userSpaceOnUse">
            <circle cx="3" cy="3" r="1" fill="#374151" />
          </pattern>
        </defs>

        {/* ================= LAYER 0: OUTER GOLD REFLECTION FLUX ================= */}
        {!mono && showGoldReflection && (
          <circle
            cx="250"
            cy="250"
            r="248"
            fill="url(#sovGoldAuraRadial)"
            className="animate-pulse-slow"
          />
        )}

        {/* ================= LAYER 1: SCALLOPED EMBLEM ROSETTE TEETH (36 NODES) ================= */}
        <g opacity={mono ? "1" : "0.95"} filter={mono ? undefined : "url(#sovGoldGlow)"}>
          {SCALLOP_CIRCLES.map((sc, i) => (
            <circle
              key={`scallop-${i}`}
              cx={sc.cx}
              cy={sc.cy}
              r="9.5"
              fill={mono ? "#FFFFFF" : "url(#sovAmberLinear)"}
              stroke={mono ? "#000000" : "#FEF08A"}
              strokeWidth={mono ? 1.8 : 1.2}
            />
          ))}
        </g>

        {/* ================= LAYER 2: BEZEL CASING & RINGS ================= */}
        {/* Outer Bezel Foundation */}
        <circle
          cx="250"
          cy="250"
          r="238"
          fill={transparentBg ? 'none' : mono ? '#FFFFFF' : 'url(#sovCoreBg)'}
          stroke={mono ? '#000000' : 'url(#sovAmberLinear)'}
          strokeWidth={mono ? 4 : 5}
        />

        {/* Security Border Ring (Guilloche band in mono, Cyan energy glow in color) */}
        <circle
          cx="250"
          cy="250"
          r="230"
          fill={mono ? 'url(#monoHatch)' : 'none'}
          stroke={mono ? '#000000' : 'url(#sovCyanBezel)'}
          strokeWidth={mono ? 2 : 8}
          filter={mono ? undefined : 'url(#sovCyanGlow)'}
          opacity={mono ? 0.35 : 1}
        />

        <circle
          cx="250"
          cy="250"
          r="222"
          fill="none"
          stroke={mono ? '#000000' : '#67E8F9'}
          strokeWidth={mono ? 1.5 : 1.8}
        />
        <circle
          cx="250"
          cy="250"
          r="186"
          fill="none"
          stroke={mono ? '#000000' : '#F59E0B'}
          strokeWidth={mono ? 2.5 : 2.5}
        />

        {/* Guilloche Radial Hash Marks (Document Security) */}
        {mono && (
          <g stroke="#000000" strokeWidth="0.8" strokeDasharray="2,3" opacity="0.45">
            {GUILLOCHE_RAYS.map((r, i) => (
              <line key={`mono-ray-${i}`} x1={r.x1} y1={r.y1} x2={r.x2} y2={r.y2} />
            ))}
          </g>
        )}

        {/* ================= LAYER 3: 60-TICK PRECISION CHRONOMETER BEZEL ================= */}
        <g opacity={mono ? "0.9" : "0.85"}>
          {SEAL_TICKS.map((t, idx) => (
            <line
              key={`tick-${idx}`}
              x1={t.x1}
              y1={t.y1}
              x2={t.x2}
              y2={t.y2}
              stroke={
                mono
                  ? '#000000'
                  : t.isCardinal
                  ? '#FBBF24'
                  : t.isMajor
                  ? '#67E8F9'
                  : 'rgba(103, 232, 249, 0.45)'
              }
              strokeWidth={
                mono
                  ? t.isCardinal ? 2.2 : t.isMajor ? 1.5 : 0.8
                  : t.isCardinal ? 2.5 : t.isMajor ? 1.8 : 1
              }
              strokeLinecap="round"
            />
          ))}
        </g>

        {/* ================= LAYER 4: CIRCULAR INSCRIPTIONS & HIGH-CONTRAST VERIFIED BANNER ================= */}
        
        {/* Top Arc Path: High Authority VERIFIED */}
        <path
          id="sovSealTextArcTop"
          d="M 66 250 A 184 184 0 0 1 434 250"
          fill="none"
        />

        {/* TOP CURVED VERIFIED RIBBON BACKGROUND (Makes VERIFIED stand out) */}
        {showVerifiedRibbon && (
          <g filter={mono ? undefined : "url(#sovVerifiedPlaqueShadow)"}>
            {/* Top Curved Ribbon Path Background */}
            <path
              d="M 98 215 A 184 184 0 0 1 402 215 L 418 200 A 206 206 0 0 0 82 200 Z"
              fill={mono ? '#000000' : 'url(#sovGoldRibbonGrad)'}
              stroke={mono ? '#000000' : '#FFFBEB'}
              strokeWidth={mono ? 1.5 : 2}
            />
            {/* Decorative Ribbon Fold Ends */}
            <polygon
              points="82,200 98,215 74,212"
              fill={mono ? '#374151' : '#78350F'}
            />
            <polygon
              points="418,200 402,215 426,212"
              fill={mono ? '#374151' : '#78350F'}
            />
          </g>
        )}

        {/* PROMINENT TOP TEXT: ★ VERIFIED • AUTHENTIC • SECURE ★ */}
        <text
          fontFamily="'JetBrains Mono', -apple-system, monospace"
          fontSize="14.5"
          fontWeight="900"
          fill={showVerifiedRibbon ? (mono ? '#FFFFFF' : '#030712') : (mono ? '#000000' : '#FEF08A')}
          letterSpacing="4.5"
          filter={(!mono && !showVerifiedRibbon) ? "url(#sovGoldGlow)" : undefined}
        >
          <textPath href="#sovSealTextArcTop" startOffset="50%" textAnchor="middle">
            ★ VERIFIED • AUTHENTIC • SECURE ★
          </textPath>
        </text>

        {/* Bottom Arc Path: ZYRQUEN Ω∞ • SSoT Δ0.0% • BLOCK #849202 */}
        <path
          id="sovSealTextArcBottom"
          d="M 432 250 A 182 182 0 0 1 68 250"
          fill="none"
        />
        <text
          fontFamily="'JetBrains Mono', monospace"
          fontSize="12.5"
          fontWeight="800"
          fill={mono ? '#000000' : '#67E8F9'}
          letterSpacing="3.5"
        >
          <textPath href="#sovSealTextArcBottom" startOffset="50%" textAnchor="middle">
            ZYRQUEN Ω∞ • SSoT Δ0.0% • BLOCK #849202
          </textPath>
        </text>

        {/* Inner Sub-Ring Dash Border */}
        <circle
          cx="250"
          cy="250"
          r="156"
          fill="none"
          stroke={mono ? '#000000' : '#38BDF8'}
          strokeWidth={mono ? 1.5 : 2}
          strokeDasharray="6,4"
          opacity={mono ? 0.6 : 0.8}
        />

        {/* Inner Top Sub Arc: CRYSTALS-DILITHIUM-5 • 10/10 HSM */}
        <path
          id="sovInnerArcTop"
          d="M 110 250 A 140 140 0 0 1 390 250"
          fill="none"
        />
        <text
          fontFamily="'JetBrains Mono', monospace"
          fontSize="10"
          fontWeight="700"
          fill={mono ? '#1F2937' : '#A5F3FC'}
          letterSpacing="2.5"
        >
          <textPath href="#sovInnerArcTop" startOffset="50%" textAnchor="middle">
            CRYSTALS-DILITHIUM-5 • 10/10 HSM
          </textPath>
        </text>

        {/* Inner Bottom Sub Arc: 14,902 CANONICAL SEALS (LTS FROZEN) */}
        <path
          id="sovInnerArcBottom"
          d="M 390 250 A 140 140 0 0 1 110 250"
          fill="none"
        />
        <text
          fontFamily="'JetBrains Mono', monospace"
          fontSize="9.5"
          fontWeight="700"
          fill={mono ? '#1F2937' : '#FBBF24'}
          letterSpacing="2"
        >
          <textPath href="#sovInnerArcBottom" startOffset="50%" textAnchor="middle">
            14,902 CANONICAL SEALS (LTS FROZEN)
          </textPath>
        </text>

        {/* ================= LAYER 5: CENTRAL MEDALLION CORE FRAME ================= */}
        <circle
          cx="250"
          cy="250"
          r="118"
          fill={transparentBg ? 'none' : mono ? '#FFFFFF' : 'url(#sovCoreBg)'}
          stroke={mono ? '#000000' : 'url(#sovCyanBezel)'}
          strokeWidth={mono ? 3 : 3.5}
        />
        <circle
          cx="250"
          cy="250"
          r="108"
          fill="none"
          stroke={mono ? '#000000' : 'url(#sovAmberLinear)'}
          strokeWidth={mono ? 1.5 : 2}
        />

        {/* ================= LAYER 6: 8-POINT SOVEREIGN QUANTUM STAR ================= */}
        <g>
          {/* Cardinal Diamond Star Points (Amber Gold / Crisp White in mono) */}
          <polygon
            points="250,148 266,234 352,250 266,266 250,352 234,266 148,250 234,234"
            fill={mono ? "#F3F4F6" : "url(#sovAmberShine)"}
            stroke={mono ? "#000000" : "#FFFBEB"}
            strokeWidth={mono ? 1.5 : 1.5}
            filter={mono ? undefined : "url(#sovGoldGlow)"}
            opacity="0.95"
          />

          {/* Diagonal Diamond Star Points (Cyan Energy Facets / Etched in mono) */}
          <polygon
            points="250,165 260,240 335,250 260,260 250,335 240,260 165,250 240,240"
            transform="rotate(45, 250, 250)"
            fill={mono ? "#E5E7EB" : "url(#sovCyanBezel)"}
            stroke={mono ? "#000000" : "#67E8F9"}
            strokeWidth={mono ? 1.2 : 1.2}
            filter={mono ? undefined : "url(#sovCyanGlow)"}
            opacity={mono ? 0.8 : 0.85}
          />

          {/* Chiseled Facet Lines */}
          <g stroke={mono ? "rgba(0, 0, 0, 0.4)" : "rgba(255, 255, 255, 0.6)"} strokeWidth="1" opacity="0.75">
            <line x1="250" y1="148" x2="250" y2="352" />
            <line x1="148" y1="250" x2="352" y2="250" />
            <line x1="178" y1="178" x2="322" y2="322" />
            <line x1="178" y1="322" x2="322" y2="178" />
          </g>

          {/* Central Core Circle */}
          <circle
            cx="250"
            cy="250"
            r="48"
            fill={mono ? "#FFFFFF" : "url(#sovCoreBg)"}
            stroke={mono ? "#000000" : "url(#sovCyanBezel)"}
            strokeWidth="3"
            filter={mono ? undefined : "url(#sovCyanGlow)"}
          />
          <circle
            cx="250"
            cy="250"
            r="42"
            fill="none"
            stroke={mono ? "#000000" : "#FDE68A"}
            strokeWidth={mono ? 1 : 1.5}
          />
        </g>

        {/* ================= LAYER 7: CENTRAL EMBLEM (Ω∞) & SOVEREIGN KERNEL ================= */}
        <g transform="translate(250, 246)">
          <text
            x="0"
            y="5"
            fontFamily="'JetBrains Mono', monospace"
            fontSize="38"
            fontWeight="900"
            fill={mono ? "#000000" : "url(#sovAmberShine)"}
            textAnchor="middle"
            filter={mono ? undefined : "url(#sovGoldGlow)"}
          >
            Ω∞
          </text>
        </g>

        <text
          x="250"
          y="276"
          fontFamily="'JetBrains Mono', monospace"
          fontSize="7.5"
          fontWeight="800"
          fill={mono ? '#000000' : '#67E8F9'}
          letterSpacing="2"
          textAnchor="middle"
        >
          SOVEREIGN KERNEL
        </text>

        {/* ================= LAYER 8: FOUR CARDINAL COMPASS STARS ================= */}
        {([
          { cx: 250, cy: 38 },
          { cx: 250, cy: 462 },
          { cx: 38, cy: 250 },
          { cx: 462, cy: 250 }
        ]).map((pos, idx) => (
          <g key={`star-marker-${idx}`} transform={`translate(${pos.cx}, ${pos.cy})`}>
            <polygon
              points="0,-8 2.5,-2.5 8,0 2.5,2.5 0,8 -2.5,2.5 -8,0 -2.5,-2.5"
              fill={mono ? "#000000" : "#FBBF24"}
              stroke={mono ? "#FFFFFF" : "#FFFBEB"}
              strokeWidth="0.8"
            />
          </g>
        ))}

      </svg>
    </div>
  );
}
