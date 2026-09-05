'use client';

import React, { useState, useRef } from 'react';
import { 
  Award, 
  Sparkles, 
  X, 
  Copy, 
  Download, 
  Printer, 
  Lock, 
  Layers, 
  Check, 
  Eye, 
  Star, 
  FileText,
  RotateCw,
  Sun,
  Moon
} from 'lucide-react';
import ProvenanceBadge from './ProvenanceBadge';
import SovereignSealSvg, { SealVariant } from './SovereignSealSvg';

interface QuantumGoldSealVisualProps {
  onVerifySuccess?: () => void;
  isModal?: boolean;
  onClose?: () => void;
}

export default function QuantumGoldSealVisual({ 
  onVerifySuccess, 
  isModal = false, 
  onClose 
}: QuantumGoldSealVisualProps) {
  const [copiedHash, setCopiedHash] = useState(false);
  const [copiedSvg, setCopiedSvg] = useState(false);
  const [viewMode, setViewMode] = useState<'card' | 'transparent_badge' | 'print_preview'>('card');
  const [selectedVariant, setSelectedVariant] = useState<SealVariant>('gold');
  const [showGoldReflection, setShowGoldReflection] = useState(true);
  const [showVerifiedRibbon, setShowVerifiedRibbon] = useState(true);
  const [animationMode, setAnimationMode] = useState<'entry' | 'slow' | 'float' | 'none'>('entry');
  const [rotationKey, setRotationKey] = useState(0);

  const containerRef = useRef<HTMLDivElement | null>(null);

  const isMonochrome = selectedVariant === 'monochrome' || viewMode === 'print_preview';

  const triggerReplayAnimation = () => {
    setRotationKey(prev => prev + 1);
  };

  const copyMerkle = () => {
    navigator.clipboard?.writeText("909ab814479844d8a14816bed34cdbb07528e18501da86fc4691763a43fa4c68");
    setCopiedHash(true);
    setTimeout(() => setCopiedHash(false), 2000);
  };

  const copySvgCode = () => {
    const svgEl = containerRef.current?.querySelector('svg');
    if (svgEl) {
      const svgString = new XMLSerializer().serializeToString(svgEl);
      navigator.clipboard?.writeText(svgString);
      setCopiedSvg(true);
      setTimeout(() => setCopiedSvg(false), 2200);
    }
  };

  const downloadSvg = () => {
    const svgEl = containerRef.current?.querySelector('svg');
    if (!svgEl) return;
    const svgString = new XMLSerializer().serializeToString(svgEl);
    const blob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `zyrquen-sovereign-seal-block-849202-${selectedVariant}-${viewMode}.svg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div 
      id="quantum-gold-seal-visual-container"
      ref={containerRef}
      className={`relative rounded-3xl border-2 transition-all duration-300 overflow-hidden shadow-2xl ${
        isMonochrome && viewMode === 'print_preview'
          ? 'bg-white text-slate-900 border-slate-400 p-6'
          : 'border-amber-400/70 bg-gradient-to-b from-[#081226] via-[#091733] to-[#040914] text-white p-4 sm:p-6 md:p-7 quantum-cyan-glow'
      } ${isModal ? 'max-w-xl w-full mx-auto' : 'w-full'}`}
    >
      {/* Background Starfield (Color mode only) */}
      {!isMonochrome && (
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-500/10 via-cyan-900/15 to-transparent pointer-events-none" />
      )}

      {/* Close Button if Modal */}
      {isModal && onClose && (
        <button 
          id="close-seal-modal-btn"
          onClick={onClose}
          className={`absolute top-4 right-4 p-2 rounded-full border transition cursor-pointer z-30 ${
            isMonochrome && viewMode === 'print_preview'
              ? 'bg-slate-100 border-slate-300 text-slate-700 hover:bg-slate-200'
              : 'bg-slate-900/90 border-slate-700 text-slate-300 hover:text-white hover:border-cyan-400'
          }`}
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>
      )}

      {/* HEADER & EMBLEM TITLE */}
      <div className="relative z-20 space-y-2">
        <div className="text-center space-y-1">
          <div className="font-mono text-[11px] font-bold tracking-[0.22em] uppercase flex items-center justify-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
            <span className={isMonochrome && viewMode === 'print_preview' ? 'text-slate-800' : 'text-cyan-300'}>
              SOVEREIGN DIGITAL CERTIFICATE SEAL
            </span>
            <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
          </div>
          <h2 className="text-xl sm:text-2xl font-black font-mono tracking-wider flex items-center justify-center gap-2">
            <span className={isMonochrome && viewMode === 'print_preview' ? 'text-slate-900' : 'text-cyan-gradient'}>
              BLOCK #849202
            </span>
            <span className="text-amber-400">•</span>
            <span className={isMonochrome && viewMode === 'print_preview' ? 'text-slate-800' : 'text-amber-300'}>
              ZYRQUEN Ω∞
            </span>
          </h2>
          <p className={`text-xs ${isMonochrome && viewMode === 'print_preview' ? 'text-slate-600' : 'text-slate-400'}`}>
            ตรารับรองอธิปไตยดิจิทัลผ่านการปิดผนึกสัจจะ SSoT Δ0.0% พร้อมเงาสะท้อนทองคำและริบบิ้น VERIFIED
          </p>
        </div>

        {/* PRIMARY CONTROLS: THEME & DISPLAY SELECTOR */}
        <div className={`p-2.5 rounded-2xl border font-mono text-xs space-y-2 ${
          isMonochrome && viewMode === 'print_preview'
            ? 'bg-slate-50 border-slate-300'
            : 'bg-slate-950/80 border-cyan-500/30'
        }`}>
          {/* Row 1: Seal Theme Selector */}
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className={`text-[10px] uppercase font-bold mr-1 ${
                isMonochrome && viewMode === 'print_preview' ? 'text-slate-600' : 'text-slate-400'
              }`}>
                ชุดรูปแบบตรา:
              </span>
              {[
                { id: 'gold' as SealVariant, label: '👑 Sovereign Gold (สีทอง)', icon: Star },
                { id: 'cyan' as SealVariant, label: '⚡ Cyber Cyan (สีฟ้า)', icon: Sparkles },
                { id: 'monochrome' as SealVariant, label: '📄 Monochrome (ขาว-ดำ สำหรับพิมพ์)', icon: FileText }
              ].map((theme) => {
                const isSelected = selectedVariant === theme.id;
                const Icon = theme.icon;
                return (
                  <button
                    key={theme.id}
                    onClick={() => {
                      setSelectedVariant(theme.id);
                      if (theme.id === 'monochrome') setViewMode('print_preview');
                      else if (viewMode === 'print_preview') setViewMode('card');
                    }}
                    className={`px-2.5 py-1 rounded-lg text-[10.5px] font-bold transition flex items-center gap-1.5 cursor-pointer ${
                      isSelected
                        ? 'bg-amber-500/20 border border-amber-400 text-amber-300 shadow-sm'
                        : 'bg-slate-900/60 border border-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <Icon className="w-3 h-3" />
                    <span>{theme.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Animation Replay Button */}
            <button
              onClick={triggerReplayAnimation}
              className="px-2 py-1 rounded-lg bg-slate-900 border border-slate-700 hover:border-cyan-400 text-cyan-300 text-[10px] font-bold flex items-center gap-1 transition cursor-pointer"
              title="ทดสอบหมุนเปิดตราใหม่ (Replay Entrance Spin)"
            >
              <RotateCw className="w-3 h-3" />
              <span>หมุนเปิดตราใหม่</span>
            </button>
          </div>

          {/* Row 2: View Modes & Action Buttons */}
          <div className="flex flex-wrap items-center justify-between gap-2 pt-1.5 border-t border-slate-800/80">
            {/* View Mode Chips */}
            <div className="flex items-center gap-1">
              {[
                { id: 'card' as const, label: 'โหมดใบรับรอง', icon: Award },
                { id: 'transparent_badge' as const, label: 'ตราโปร่งใส (Badge)', icon: Eye },
                { id: 'print_preview' as const, label: 'พรีวิวพิมพ์ (Print Doc)', icon: Printer }
              ].map((m) => (
                <button
                  key={m.id}
                  onClick={() => setViewMode(m.id)}
                  className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition flex items-center gap-1 cursor-pointer ${
                    viewMode === m.id
                      ? 'bg-cyan-500/25 border border-cyan-400 text-cyan-200 shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <m.icon className="w-3 h-3" />
                  <span>{m.label}</span>
                </button>
              ))}
            </div>

            {/* Actions: Download / Print / Copy */}
            <div className="flex items-center gap-1.5 flex-wrap">
              {viewMode === 'print_preview' ? (
                <button
                  onClick={handlePrint}
                  className="px-3 py-1 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-[10.5px] font-bold transition flex items-center gap-1 cursor-pointer shadow-md"
                >
                  <Printer className="w-3 h-3 text-cyan-300" />
                  <span>พิมพ์เอกสารนี้</span>
                </button>
              ) : null}

              <button
                id="copy-seal-svg-btn"
                onClick={copySvgCode}
                className="px-2.5 py-1 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 hover:text-white rounded-lg text-[10px] font-bold transition flex items-center gap-1 cursor-pointer"
                title="คัดลอก SVG Code ไปใช้งาน"
              >
                {copiedSvg ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3 text-cyan-400" />}
                <span>{copiedSvg ? 'คัดลอกแล้ว!' : 'Copy SVG'}</span>
              </button>

              <button
                id="download-seal-svg-btn"
                onClick={downloadSvg}
                className="px-3 py-1 bg-gradient-to-r from-amber-400 to-amber-500 hover:brightness-110 text-black rounded-lg text-[10.5px] font-bold transition flex items-center gap-1 cursor-pointer shadow-md"
                title="ดาวน์โหลดไฟล์ Vector SVG ความคมชัดสูงสุด"
              >
                <Download className="w-3 h-3" />
                <span>ดาวน์โหลด SVG</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* =========================================================================
          THE SOVEREIGN SEAL CANVAS DISPLAY
          - Enhanced with Golden Ambient Reflection Glow
          - Prominent VERIFIED ribbon banner
          - Subtle rotation on entry or floating breath
          - Seamless Monochrome Print layout
         ========================================================================= */}
      <div 
        key={`seal-display-${rotationKey}`}
        className={`relative flex flex-col items-center justify-center my-4 py-4 rounded-2xl transition-all duration-300 ${
          viewMode === 'transparent_badge'
            ? 'p-6 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px] bg-slate-950/60 border border-amber-500/30'
            : viewMode === 'print_preview'
            ? 'p-8 bg-white border-2 border-dashed border-slate-300 shadow-inner'
            : 'p-4'
        }`}
      >
        {/* Print Document Header Header (Print Mode Only) */}
        {viewMode === 'print_preview' && (
          <div className="w-full text-center border-b border-slate-300 pb-3 mb-4 font-mono text-slate-800">
            <div className="text-[10px] font-bold tracking-widest uppercase text-slate-500">
              OFFICIAL CANONICAL SOVEREIGN CERTIFICATE • LEGAL SEAL
            </div>
            <div className="text-sm font-black text-slate-900">
              ZYRQUEN Ω∞ POST-QUANTUM HARDWARE ATTESTATION
            </div>
            <div className="text-[9px] text-slate-500">
              Block Height: #849202 | Seals: 14,902 | SSoT Invariant: Δ0.0% | PDPA & ETDA Compliant
            </div>
          </div>
        )}

        {/* Ambient Pulsing Rings for Card Mode */}
        {viewMode === 'card' && !isMonochrome && (
          <>
            <div className="absolute w-72 h-72 sm:w-84 sm:h-84 rounded-full border border-amber-400/20 animate-quantum-ripple pointer-events-none" />
            <div className="absolute w-64 h-64 sm:w-72 sm:h-72 rounded-full border border-cyan-400/25 animate-quantum-ripple [animation-delay:1.4s] pointer-events-none" />
          </>
        )}

        {/* The Sovereign Seal Component */}
        <div className="relative flex items-center justify-center">
          <SovereignSealSvg 
            size={viewMode === 'print_preview' ? 240 : 250}
            variant={selectedVariant}
            isMonochrome={isMonochrome}
            showGoldReflection={showGoldReflection && !isMonochrome}
            showVerifiedRibbon={showVerifiedRibbon}
            animate={animationMode}
            transparentBg={viewMode === 'transparent_badge'}
            className="transition-transform duration-500 hover:scale-105"
          />
        </div>

        {/* Print Document Footer (Print Mode Only) */}
        {viewMode === 'print_preview' && (
          <div className="w-full text-center border-t border-slate-300 pt-3 mt-4 font-mono text-[9px] text-slate-600 space-y-1">
            <div className="font-semibold text-slate-800">
              Genesis Merkle Root: 909ab814479844d8a14816bed34cdbb07528e18501da86fc4691763a43fa4c68
            </div>
            <div>
              Certified by Sovereign Architect: นายยุทธภูมิ พากเพียร (#EP-SOVEREIGN-01)
            </div>
            <div className="text-[8px] text-slate-400">
              [PRINTABLE VERSION: BLACK & WHITE INK ENGINE - 100% POST-QUANTUM VERIFIED]
            </div>
          </div>
        )}
      </div>

      {/* METRIC & PROVENANCE BADGES BAR */}
      <div className={`pt-3 border-t font-mono text-xs space-y-2.5 ${
        isMonochrome && viewMode === 'print_preview' ? 'border-slate-300' : 'border-slate-800'
      }`}>
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 flex-wrap">
            <ProvenanceBadge type="CANONICAL" size="xs" authority="Sovereign SSoT Architecture" />
            <ProvenanceBadge type="FROZEN" size="xs" authority="v1.2 LTS Immutable" />
            <span className="px-2 py-0.5 rounded bg-amber-500/15 border border-amber-400/40 text-amber-300 text-[10px] font-bold flex items-center gap-1">
              <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
              14,902 SEALS
            </span>
          </div>

          <button
            onClick={copyMerkle}
            className={`text-[10px] font-bold px-2 py-1 rounded-lg border transition flex items-center gap-1 cursor-pointer ${
              copiedHash 
                ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300'
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-cyan-300 hover:border-cyan-500/50'
            }`}
          >
            {copiedHash ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
            <span>{copiedHash ? 'คัดลอก Merkle Root แล้ว' : 'Copy Merkle Root'}</span>
          </button>
        </div>

        {/* GENESIS MERKLE ROOT BOX */}
        <div className={`p-2.5 rounded-xl border text-[10px] flex items-center justify-between gap-2 ${
          isMonochrome && viewMode === 'print_preview'
            ? 'bg-slate-100 border-slate-300 text-slate-800'
            : 'bg-[#040915] border-slate-800/90 text-slate-300'
        }`}>
          <div className="flex items-center gap-2 truncate">
            <Lock className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span className="text-slate-500 uppercase font-bold shrink-0">Root Hash:</span>
            <code className="text-amber-300 font-mono text-[9.5px] truncate">
              909ab814479844d8a14816bed34cdbb07528e18501da86fc4691763a43fa4c68
            </code>
          </div>
          <span className="px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[8.5px] font-bold uppercase shrink-0">
            Δ0.0% ZERO DRIFT
          </span>
        </div>
      </div>
    </div>
  );
}
