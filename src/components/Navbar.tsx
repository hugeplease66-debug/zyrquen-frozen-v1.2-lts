import React from 'react';
import { 
  ShieldCheck, 
  Lock, 
  Cpu, 
  Snowflake, 
  KeyRound, 
  Activity, 
  FileText, 
  Terminal, 
  Award,
  Zap,
  Globe
} from 'lucide-react';
import { SYSTEM_METADATA, SOVEREIGN_PRINCIPAL } from '../data/canonicalData';

interface NavbarProps {
  lang: 'th' | 'en';
  setLang: (lang: 'th' | 'en') => void;
  openSentinelModal: () => void;
  openReplayModal: () => void;
  openCertificateModal: () => void;
  activeChamber: number;
  setActiveChamber: (num: number) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  lang,
  setLang,
  openSentinelModal,
  openReplayModal,
  openCertificateModal,
  activeChamber,
  setActiveChamber
}) => {
  return (
    <header className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-md border-b border-slate-800 text-slate-100">
      {/* Top micro bar for SSoT invariants */}
      <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-cyan-950 px-4 py-1 border-b border-emerald-500/20 text-xs flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-4 flex-wrap">
          <span className="flex items-center gap-1.5 text-emerald-400 font-mono-code font-semibold tracking-wide">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
            {SYSTEM_METADATA.status}
          </span>
          <span className="text-slate-400 font-mono-code hidden sm:inline">|</span>
          <span className="text-cyan-300 font-mono-code">
            {lang === 'th' ? 'บล็อกหลัก' : 'Block'}: <strong className="text-white font-bold">#{SYSTEM_METADATA.canonicalBlock}</strong>
          </span>
          <span className="text-slate-400 font-mono-code hidden sm:inline">|</span>
          <span className="text-amber-300 font-mono-code">
            {lang === 'th' ? 'ซีลอธิปไตย' : 'Canonical Seals'}: <strong className="text-white font-bold">{SYSTEM_METADATA.canonicalSeals.toLocaleString()}</strong>
          </span>
          <span className="text-slate-400 font-mono-code hidden md:inline">|</span>
          <span className="text-purple-300 font-mono-code hidden md:inline">
            SSoT Drift: <strong className="text-emerald-400">{SYSTEM_METADATA.ssoTDelta}</strong> (Mut: 0)
          </span>
        </div>

        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-1 bg-cyan-950/80 border border-cyan-500/30 text-cyan-300 px-2 py-0.5 rounded text-[11px] font-mono-code">
            <Snowflake className="w-3 h-3 text-cyan-400" />
            {SYSTEM_METADATA.telemetry.cryoTemp}
          </span>
          <span className="inline-flex items-center gap-1 bg-emerald-950/80 border border-emerald-500/30 text-emerald-300 px-2 py-0.5 rounded text-[11px] font-mono-code">
            <KeyRound className="w-3 h-3 text-emerald-400" />
            10/10 REAL_HSM (TC-01..10)
          </span>
          <button
            onClick={() => setLang(lang === 'th' ? 'en' : 'th')}
            className="flex items-center gap-1 px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs border border-slate-700 transition-colors"
            title="Toggle Language / เปลี่ยนภาษา"
          >
            <Globe className="w-3 h-3 text-cyan-400" />
            <span className="font-bold font-mono-code">{lang.toUpperCase()}</span>
          </button>
        </div>
      </div>

      {/* Main navigation header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
        {/* Brand identity */}
        <div className="flex items-center gap-3">
          <div 
            onClick={() => setActiveChamber(1)}
            className="cursor-pointer flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-600 via-blue-700 to-indigo-900 border border-cyan-400/50 shadow-lg shadow-cyan-950/50 group"
          >
            <ShieldCheck className="w-6 h-6 text-cyan-200 group-hover:scale-110 transition-transform" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 
                onClick={() => setActiveChamber(1)}
                className="cursor-pointer font-display font-bold text-lg sm:text-xl tracking-tight text-white hover:text-cyan-300 transition-colors flex items-center gap-1.5"
              >
                ZYRQUEN <span className="text-cyan-400">Ω∞</span>
                <span className="text-xs px-2 py-0.5 rounded bg-cyan-950 border border-cyan-500/40 text-cyan-300 font-mono-code">
                  v4.16 PDPA
                </span>
              </h1>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <span className="text-amber-300 font-medium">{SOVEREIGN_PRINCIPAL.nameTh}</span>
              <span className="text-slate-600">•</span>
              <span className="text-emerald-400 font-mono-code text-[11px] font-semibold">
                {SOVEREIGN_PRINCIPAL.clearance}
              </span>
            </div>
          </div>
        </div>

        {/* Quick action triggers */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setActiveChamber(0)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-bold transition-all shadow-sm ${
              activeChamber === 0
                ? 'bg-gradient-to-r from-cyan-600 via-blue-600 to-purple-600 text-white border-cyan-300 shadow-cyan-950/80 ring-2 ring-cyan-400/50'
                : 'bg-cyan-950/80 hover:bg-cyan-900/80 text-cyan-200 border-cyan-500/50 shadow-cyan-950/40'
            }`}
          >
            <Globe className="w-3.5 h-3.5 text-cyan-300 animate-spin" />
            <span>Master Console Ω∞</span>
          </button>

          <button
            onClick={openSentinelModal}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-950/60 hover:bg-red-900/60 text-red-200 border border-red-500/40 text-xs font-medium transition-all shadow-sm shadow-red-950/40"
          >
            <Zap className="w-3.5 h-3.5 text-red-400 animate-pulse" />
            <span className="hidden sm:inline">Sentinel-AI Interceptor</span>
            <span className="sm:hidden">Sentinel</span>
          </button>

          <button
            onClick={openReplayModal}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-950/60 hover:bg-cyan-900/60 text-cyan-200 border border-cyan-500/40 text-xs font-medium transition-all shadow-sm shadow-cyan-950/40"
          >
            <Activity className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden sm:inline">12-Stage Replay (142ms)</span>
            <span className="sm:hidden">142ms Replay</span>
          </button>

          <button
            onClick={openCertificateModal}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-950/60 hover:bg-amber-900/60 text-amber-200 border border-amber-500/40 text-xs font-medium transition-all shadow-sm shadow-amber-950/40"
          >
            <Award className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden md:inline">Gold Certificate</span>
            <span className="md:hidden">Cert</span>
          </button>

          <button
            onClick={() => setActiveChamber(14)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 text-xs font-mono-code transition-all"
          >
            <Terminal className="w-3.5 h-3.5 text-slate-400" />
            <span className="hidden sm:inline">zyrquen.sh</span>
            <span className="sm:hidden">CLI</span>
          </button>
        </div>
      </div>
    </header>
  );
};
