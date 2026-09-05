import React, { useState, useEffect, useRef } from 'react';
import { ViewType } from '../types';
import { SYSTEM_METADATA } from '../data/canonicalData';
import {
  LayoutDashboard,
  Cpu,
  Share2,
  Lock,
  FileCheck2,
  Activity,
  Workflow,
  Orbit,
  Archive,
  Terminal,
  ShieldCheck,
  Settings,
  Crown,
  Volume2,
  VolumeX,
  Award,
  Sparkles,
  Scale,
  Search,
  Keyboard,
  Bell,
  Radio,
  Snowflake,
  LayoutGrid,
  Grid3X3,
} from 'lucide-react';
import { playTone, getHarmonicCarrierSnapshot } from './AudioSynthesizer';

interface NavigationProps {
  currentView: ViewType;
  onSelectView: (view: ViewType) => void;
  onOpenCertificate: () => void;
  onOpenLegalSearch: () => void;
  onOpenShortcuts: () => void;
  onOpenEventsSidebar?: () => void;
  eventsCount?: number;
  onCaptureSnapshot?: () => void;
  isAudioActive: boolean;
  onToggleAudio: () => void;
  isSystemActivityFrozen?: boolean;
  onToggleFreezeSystemActivity?: () => void;
}

interface NavItem {
  id: ViewType;
  labelEn: string;
  labelTh: string;
  icon: React.FC<{ className?: string }>;
  dotColor: string;
  badge?: string;
  shortcut?: string;
}

export const NAVIGATION_ITEMS: NavItem[] = [
  { id: 'dashboard', labelEn: 'Dashboard', labelTh: 'ศูนย์บัญชาการ', icon: LayoutDashboard, dotColor: '#06B6D4', badge: 'HQ', shortcut: '1' },
  { id: 'unified', labelEn: 'Multiverse Panel', labelTh: 'แผงควบคุมรวมมิติ', icon: LayoutGrid, dotColor: '#38BDF8', badge: 'TRI-VIEW', shortcut: 'U' },
  { id: 'heatmap', labelEn: '14.9K Seals Heatmap', labelTh: 'แผนผังสุขภาพ 14,902 ตรา', icon: Grid3X3, dotColor: '#10B981', badge: '14.9K', shortcut: 'H' },
  { id: 'council', labelEn: 'Council 10/10', labelTh: 'สภาผู้พิทักษ์', icon: Crown, dotColor: '#F59E0B', badge: '10/10', shortcut: 'C' },
  { id: 'production', labelEn: 'Readiness', labelTh: 'ความพร้อมผลิต', icon: ShieldCheck, dotColor: '#10B981', badge: 'PH-20', shortcut: 'R' },
  { id: 'quantum', labelEn: 'Quantum', labelTh: 'ควอนตัมเน็กซัส', icon: Cpu, dotColor: '#8B5CF6', badge: '768-Q', shortcut: '2' },
  { id: 'nexus', labelEn: 'Nexus', labelTh: 'เครือข่ายข้อมูล', icon: Share2, dotColor: '#3B82F6', shortcut: '3' },
  { id: 'vault', labelEn: 'Vault', labelTh: 'คลังรหัสผ่าน', icon: Lock, dotColor: '#F59E0B', badge: 'OMEGA', shortcut: '4' },
  { id: 'ledger', labelEn: 'Ledger', labelTh: 'สมุดบัญชีหลักฐาน', icon: FileCheck2, dotColor: '#10B981', badge: '14.9K', shortcut: '5' },
  { id: 'pulse', labelEn: 'Pulse', labelTh: 'โทรมาตรเรียลไทม์', icon: Activity, dotColor: '#06B6D4', shortcut: '6' },
  { id: 'forge', labelEn: 'Forge', labelTh: 'โรงหลอมอัตโนมัติ', icon: Workflow, dotColor: '#F59E0B', shortcut: '7' },
  { id: 'matrix', labelEn: 'Matrix', labelTh: 'มัลติเวิร์สจำลอง', icon: Orbit, dotColor: '#8B5CF6', shortcut: '8' },
  { id: 'archive', labelEn: 'Archive', labelTh: 'คลังแมนิเฟสต์ 17', icon: Archive, dotColor: '#3B82F6', badge: '17 MOD', shortcut: '9' },
  { id: 'console', labelEn: 'Console', labelTh: 'เทอร์มินัล CLI', icon: Terminal, dotColor: '#10B981', badge: 'CLI', shortcut: '0' },
  { id: 'security', labelEn: 'Security', labelTh: 'โล่ซีโร่ทรัสต์', icon: ShieldCheck, dotColor: '#10B981', badge: 'ZERO', shortcut: '-' },
  { id: 'legal', labelEn: 'Legal & PDPA', labelTh: 'กฎหมายอธิปไตย', icon: Scale, dotColor: '#3B82F6', badge: 'PDPA', shortcut: 'L' },
  { id: 'settings', labelEn: 'Settings', labelTh: 'ผู้ดูแลชาวไทย', icon: Settings, dotColor: '#71717A', shortcut: '=' },
];

export const Navigation: React.FC<NavigationProps> = ({
  currentView,
  onSelectView,
  onOpenCertificate,
  onOpenLegalSearch,
  onOpenShortcuts,
  onOpenEventsSidebar,
  eventsCount = 0,
  isAudioActive,
  onToggleAudio,
  onCaptureSnapshot,
  isSystemActivityFrozen = false,
  onToggleFreezeSystemActivity,
}) => {
  const [carrierData, setCarrierData] = useState<{ volume: number; wavePath: string; frequency: number }>({
    volume: 0,
    wavePath: 'M 0 10 Q 25 10, 50 10 T 100 10',
    frequency: 882,
  });

  // Frequency-reactive visualizer animation loop
  useEffect(() => {
    let animId: number;
    let phase = 0;

    const updateWave = () => {
      phase += 0.15;
      const snapshot = getHarmonicCarrierSnapshot();
      const isActive = isAudioActive && snapshot.isActive;
      const vol = isActive ? Math.max(0.04, snapshot.volume * 4) : 0;
      const freq = snapshot.frequency || 882;

      // Generate dynamic SVG cubic bezier wave path matching real-time harmonic volume
      const points: string[] = [];
      const width = 80;
      const height = 20;
      const midY = height / 2;
      const amplitude = isActive ? Math.min(8.5, 2.5 + vol * 30) : 1;

      points.push(`M 0 ${midY}`);
      const segments = 6;
      for (let i = 1; i <= segments; i++) {
        const x = (i / segments) * width;
        const sineOffset = Math.sin(phase + i * 1.2) * amplitude;
        const prevX = ((i - 1) / segments) * width;
        const cp1X = prevX + (x - prevX) / 2;
        const cp1Y = midY + (i % 2 === 0 ? sineOffset : -sineOffset);
        points.push(`Q ${cp1X} ${cp1Y}, ${x} ${midY}`);
      }

      setCarrierData({
        volume: vol,
        wavePath: points.join(' '),
        frequency: freq,
      });

      animId = requestAnimationFrame(updateWave);
    };

    animId = requestAnimationFrame(updateWave);
    return () => cancelAnimationFrame(animId);
  }, [isAudioActive]);
  return (
    <header className="sticky top-0 z-40 bg-gradient-to-r from-[#070914]/95 via-[#0b0e1e]/90 to-[#070914]/95 backdrop-blur-3xl border-b border-cyan-500/20 transition-all shadow-[0_8px_30px_-10px_rgba(6,182,212,0.15)] relative overflow-hidden">
      {/* Ambient Top Glow */}
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-cyan-400/40 to-transparent" />
      <div className="absolute top-0 left-1/4 w-1/2 h-16 bg-cyan-500/5 rounded-b-full blur-3xl pointer-events-none" />

      {/* Top Header Bar */}
      <div className="relative z-10 max-w-[1720px] mx-auto px-4 sm:px-6 py-2.5 flex items-center justify-between gap-4">
        {/* Left Brand Identity */}
        <div className="flex items-center gap-3">
          <div className="relative flex items-center justify-center w-11 h-11 rounded-2xl bg-gradient-to-br from-cyan-500/20 via-[#070914] to-violet-500/20 border border-cyan-500/30 shadow-[0_0_20px_rgba(6,182,212,0.25)] group cursor-default">
            <div className="absolute inset-0 rounded-2xl bg-cyan-400/10 opacity-0 group-hover:opacity-100 transition-opacity" />
            <Sparkles className="w-5 h-5 text-cyan-400 animate-pulse relative z-10" />
            <span className="absolute -bottom-1 -right-1 w-3 h-3 rounded-full bg-emerald-500 border-2 border-[#070914] shadow-[0_0_8px_#10B981]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono font-bold text-sm sm:text-base tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-white to-zinc-300 uppercase">
                ZYRQUEN <span className="text-cyan-400">Ω∞</span>
              </span>
              <span className="hidden md:inline-flex px-2 py-0.5 text-[10px] font-mono rounded-full bg-cyan-950/60 text-cyan-300 border border-cyan-500/40 shadow-sm">
                FROZEN v1.2 LTS
              </span>
              <span className="hidden xl:inline-flex px-2 py-0.5 text-[10px] font-mono rounded-full bg-emerald-950/60 text-emerald-300 border border-emerald-500/40 shadow-sm flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                SSoT MUTATION = 0
              </span>
            </div>
            <div className="flex items-center gap-2 text-[11px] text-zinc-400 font-mono mt-0.5">
              <span className="text-cyan-100/70 font-medium">🇹🇭 นายยุทธภูมิ พากเพียร (#EP-SOVEREIGN-01)</span>
              <span className="text-zinc-600">•</span>
              <span className="hidden sm:inline text-zinc-500 tracking-wider">ROOT: <span className="text-zinc-400">909ab814...fa4c68</span></span>
            </div>
          </div>
        </div>

        {/* Center Live Telemetry Gauges */}
        <div className="hidden lg:flex items-center gap-4 bg-black/40 border border-cyan-500/20 px-5 py-2 rounded-2xl shadow-inner backdrop-blur-md">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
            <span className="text-[11px] font-mono text-zinc-500">QOps:</span>
            <span className="text-[11px] font-mono text-cyan-300 font-bold tracking-wide">{SYSTEM_METADATA.qOpsTelemetry} QOps/s</span>
          </div>
          <div className="w-[1px] h-3.5 bg-white/10" />
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono text-zinc-500">Coherence:</span>
            <span className="text-[11px] font-mono text-violet-300 font-bold tracking-wide">{SYSTEM_METADATA.coherence}</span>
          </div>
          <div className="w-[1px] h-3.5 bg-white/10" />
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono text-zinc-500">Cryo:</span>
            <span className="text-[11px] font-mono text-amber-300 font-bold tracking-wide">{SYSTEM_METADATA.cryoTemp}</span>
          </div>
          <div className="w-[1px] h-3.5 bg-white/10" />
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono text-zinc-500">Seals:</span>
            <span className="text-[11px] font-mono text-emerald-300 font-bold tracking-wide">14,902 / 14,902</span>
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2">
          {/* Keyboard Shortcuts Trigger Button */}
          <button
            onClick={() => {
              playTone(620, 0.06);
              onOpenShortcuts();
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-black/30 hover:bg-white/10 border border-white/10 hover:border-white/20 text-zinc-400 hover:text-white font-mono text-xs transition-colors shadow-sm"
            title="Global Keyboard Shortcuts & Fast Navigator (? or Ctrl+/)"
          >
            <Keyboard className="w-4 h-4 text-zinc-400" />
            <span className="hidden lg:inline text-[11px] font-medium">Shortcuts</span>
            <kbd className="hidden sm:inline px-1.5 py-0.5 text-[10px] rounded bg-white/10 text-zinc-300 font-mono border border-white/10">?</kbd>
          </button>

          {/* Thai Laws & Cryptographic Search (Google Search Grounding) */}
          <button
            onClick={() => {
              playTone(680, 0.08);
              onOpenLegalSearch();
            }}
            className="group flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-cyan-950/40 hover:bg-cyan-500/20 border border-cyan-500/30 hover:border-cyan-400/50 text-cyan-300 hover:text-cyan-100 font-mono text-xs transition-all shadow-[0_0_15px_rgba(6,182,212,0.15)] hover:shadow-[0_0_20px_rgba(6,182,212,0.25)]"
            title="Search Thai Custodian Registry Laws & Cryptographic Standards via Google Search (Ctrl+K)"
          >
            <Scale className="w-4 h-4 text-cyan-400 group-hover:scale-110 transition-transform" />
            <span className="hidden sm:inline font-bold tracking-wide">Thai Laws & PQC Search</span>
            <span className="sm:hidden font-bold">Legal Search</span>
            <kbd className="hidden md:inline px-1.5 py-0.5 text-[10px] rounded bg-cyan-500/20 text-cyan-300 font-mono border border-cyan-500/30">⌘K</kbd>
          </button>

          {/* System Events Sidebar Trigger */}
          {onOpenEventsSidebar && (
            <button
              onClick={() => {
                playTone(640, 0.05);
                onOpenEventsSidebar();
              }}
              className="relative p-2 rounded-xl bg-black/30 hover:bg-white/10 border border-white/10 hover:border-white/20 text-zinc-300 hover:text-white font-mono text-xs transition-colors flex items-center gap-1.5 shadow-sm"
              title="Toggle System Events Activity Feed (Shift+E)"
            >
              <Bell className="w-4 h-4 text-cyan-400" />
              {eventsCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 px-1.5 py-0.5 rounded-full bg-cyan-500 text-black border-2 border-[#070914] text-[9px] font-bold shadow-[0_0_10px_rgba(6,182,212,0.5)]">
                  {eventsCount}
                </span>
              )}
            </button>
          )}

          {/* Global Freeze System Activity Toggle (State-Preservation Maintenance Mode) */}
          {onToggleFreezeSystemActivity && (
            <button
              onClick={() => {
                playTone(isSystemActivityFrozen ? 580 : 340, 0.08);
                onToggleFreezeSystemActivity();
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border font-mono text-xs transition-all shadow-sm ${
                isSystemActivityFrozen
                  ? 'bg-amber-500/20 text-amber-200 border-amber-500/50 shadow-[0_0_16px_rgba(245,158,11,0.35)] animate-pulse font-bold'
                  : 'bg-black/30 hover:bg-cyan-500/10 border-white/10 hover:border-cyan-500/30 text-zinc-400 hover:text-cyan-200'
              }`}
              title={
                isSystemActivityFrozen
                  ? 'System Activity Frozen: Telemetry capture & audio clock paused (Click to Resume)'
                  : 'Freeze System Activity: Arms state-preservation maintenance mode'
              }
            >
              <Snowflake
                className={`w-3.5 h-3.5 ${
                  isSystemActivityFrozen ? 'text-amber-400 animate-spin' : 'text-zinc-400'
                }`}
                style={{ animationDuration: isSystemActivityFrozen ? '8s' : '0s' }}
              />
              <span className="hidden sm:inline">
                {isSystemActivityFrozen ? 'ACTIVITY FROZEN' : 'Freeze Activity'}
              </span>
              {isSystemActivityFrozen && (
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
              )}
            </button>
          )}

          {/* Frequency-Reactive 882Hz Harmonic Carrier Visualizer */}
          <div
            onClick={() => {
              playTone(600, 0.08);
              onToggleAudio();
            }}
            className={`cursor-pointer px-3 py-1.5 rounded-xl border transition-all text-xs font-mono flex items-center gap-2 ${
              isAudioActive
                ? 'bg-cyan-950/50 border-cyan-500/40 text-cyan-300 shadow-[0_0_15px_rgba(6,182,212,0.25)]'
                : 'bg-black/30 border-white/10 hover:border-white/20 text-zinc-400 hover:text-zinc-200 shadow-sm'
            }`}
            title={isAudioActive ? '882 Hz Harmonic Carrier Active (Click to toggle/mute)' : 'Click to start 882 Hz Post-Quantum Clock Pulse Carrier'}
          >
            <div className="flex items-center gap-1.5">
              {isAudioActive ? (
                <Volume2 className="w-4 h-4 text-cyan-400 animate-pulse" />
              ) : (
                <VolumeX className="w-4 h-4 text-zinc-500" />
              )}
              <span className="hidden md:inline text-[11px] font-bold tracking-wide">
                {isAudioActive ? '882 Hz' : 'SYNTH'}
              </span>
            </div>

            {/* Reactive SVG Wave Animation */}
            <div className="w-16 h-5 flex items-center justify-center overflow-hidden">
              <svg viewBox="0 0 80 20" className="w-full h-full">
                <defs>
                  <linearGradient id="carrierWaveGlow" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.4" />
                    <stop offset="50%" stopColor="#38bdf8" stopOpacity="1" />
                    <stop offset="100%" stopColor="#10b981" stopOpacity="0.4" />
                  </linearGradient>
                  <filter id="waveGlowBlur">
                    <feGaussianBlur stdDeviation="1.5" result="coloredBlur"/>
                    <feMerge>
                      <feMergeNode in="coloredBlur"/>
                      <feMergeNode in="SourceGraphic"/>
                    </feMerge>
                  </filter>
                </defs>
                <path
                  d={carrierData.wavePath}
                  fill="none"
                  stroke={isAudioActive ? 'url(#carrierWaveGlow)' : 'rgba(255,255,255,0.15)'}
                  strokeWidth={isAudioActive ? '2' : '1.2'}
                  strokeLinecap="round"
                  filter={isAudioActive ? 'url(#waveGlowBlur)' : 'none'}
                />
              </svg>
            </div>

            {isAudioActive && (
              <span className="hidden xl:inline text-[10px] text-cyan-300 font-mono font-semibold">
                {Math.round(carrierData.volume * 100)}%
              </span>
            )}
          </div>

          <button
            onClick={() => {
              playTone(720, 0.1);
              onOpenCertificate();
            }}
            className="group flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-500/20 via-violet-500/15 to-cyan-500/20 border border-amber-500/40 text-amber-300 hover:text-amber-100 font-mono text-xs hover:border-amber-400/60 transition-all shadow-[0_0_15px_rgba(245,158,11,0.15)] hover:shadow-[0_0_20px_rgba(245,158,11,0.25)] ml-1"
          >
            <Award className="w-4 h-4 text-amber-400 group-hover:scale-110 transition-transform" />
            <span className="font-bold tracking-wide">Gold Master</span>
          </button>
        </div>
      </div>

      {/* 12-View Navigation Tabs */}
      <div className="relative z-10 max-w-[1720px] mx-auto px-2 sm:px-6 overflow-x-auto custom-scrollbar border-t border-cyan-500/10 py-1.5 flex items-center gap-1.5 sm:gap-2">
        {NAVIGATION_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => {
                playTone(isActive ? 880 : 540, 0.06);
                onSelectView(item.id);
              }}
              className={`relative px-3.5 py-2.5 rounded-xl font-mono text-xs flex items-center gap-2.5 whitespace-nowrap transition-all duration-300 select-none group overflow-hidden ${
                isActive
                  ? 'bg-gradient-to-r from-cyan-500/10 to-violet-500/10 text-white border border-cyan-500/30 shadow-[0_0_20px_rgba(6,182,212,0.15)]'
                  : 'text-zinc-400 hover:text-zinc-100 hover:bg-white/[0.05] border border-transparent'
              }`}
            >
              {isActive && (
                <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent" />
              )}
              <span
                className={`w-1.5 h-1.5 rounded-full transition-transform ${isActive ? 'scale-150 shadow-[0_0_8px_currentColor]' : 'opacity-60'}`}
                style={{ backgroundColor: item.dotColor, color: item.dotColor }}
              />
              <Icon className={`w-4 h-4 transition-colors ${isActive ? 'text-white' : 'text-zinc-500 group-hover:text-zinc-300'}`} />
              <span className={`font-semibold tracking-wide ${isActive ? 'text-white' : ''}`}>{item.labelEn}</span>
              <span className={`hidden xl:inline text-[10px] ${isActive ? 'text-cyan-200/70' : 'text-zinc-600 group-hover:text-zinc-400'}`}>({item.labelTh})</span>
              {item.badge && (
                <span
                  className={`text-[9px] px-1.5 py-0.5 rounded font-mono font-bold tracking-wider ${
                    isActive ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30' : 'bg-black/40 text-zinc-500 border border-white/10 group-hover:text-zinc-400'
                  }`}
                >
                  {item.badge}
                </span>
              )}
              {item.shortcut && (
                <span className="hidden group-hover:inline-block text-[8px] font-mono text-zinc-500 bg-black/50 px-1.5 py-0.5 rounded border border-white/10 ml-1">
                  {item.shortcut}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </header>
  );
};
