'use client';

import React from 'react';
import { 
  ShieldCheck, 
  Activity, 
  Radio, 
  Layout, 
  Cpu, 
  Lock, 
  AlertTriangle,
  Info,
  Filter
} from 'lucide-react';
import { ProvenanceType, PROVENANCE_META } from './ProvenanceBadge';

interface TruthBoundaryPanelProps {
  currentFilter: ProvenanceType | 'ALL';
  onFilterChange: (filter: ProvenanceType | 'ALL') => void;
  showBoundaryMode: boolean;
  onToggleBoundaryMode: () => void;
}

export default function TruthBoundaryPanel({
  currentFilter,
  onFilterChange,
  showBoundaryMode,
  onToggleBoundaryMode
}: TruthBoundaryPanelProps) {
  const filterOptions: { id: ProvenanceType | 'ALL'; label: string; color: string }[] = [
    { id: 'ALL', label: 'ทั้งหมด (ALL)', color: 'text-slate-300' },
    { id: 'CANONICAL', label: 'CANONICAL', color: 'text-emerald-400' },
    { id: 'FROZEN', label: 'FROZEN', color: 'text-amber-400' },
    { id: 'RUNTIME', label: 'RUNTIME', color: 'text-cyan-400' },
    { id: 'TELEMETRY', label: 'TELEMETRY', color: 'text-purple-400' },
    { id: 'PRESENTATION', label: 'PRESENTATION', color: 'text-indigo-400' },
    { id: 'SIMULATION', label: 'SIMULATION', color: 'text-amber-400' },
    { id: 'PENDING', label: 'PENDING', color: 'text-slate-400' },
    { id: 'REJECTED', label: 'REJECTED', color: 'text-rose-400' },
    { id: 'UNVERIFIED', label: 'UNVERIFIED', color: 'text-zinc-400' }
  ];

  return (
    <div className="rounded-2xl border border-cyan-500/40 bg-[#060c1d]/95 p-3.5 sm:p-4 backdrop-blur-2xl shadow-2xl space-y-3 font-mono">
      {/* HEADER WITH TRUTH BOUNDARY ENFORCEMENT SUMMARY */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800/80 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-lg bg-cyan-500/20 border border-cyan-400/50 text-cyan-300">
            <Filter className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-cyan-300 tracking-wider">
                GLOBAL TRUTH & PROVENANCE CLASSIFICATION SYSTEM
              </span>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[9px] font-bold">
                ENFORCED Δ0
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-sans mt-0.5">
              ระบบจำแนกแหล่งที่มาของข้อมูล: <strong className="text-emerald-300">CANONICAL</strong> ≠ <strong className="text-cyan-300">RUNTIME</strong> ≠ <strong className="text-purple-300">TELEMETRY</strong> ≠ <strong className="text-indigo-300">PRESENTATION</strong> ≠ <strong className="text-amber-300">SIMULATION</strong>
            </p>
          </div>
        </div>

        {/* SHOW TRUTH BOUNDARY TOGGLE */}
        <div className="flex items-center gap-2">
          <button
            onClick={onToggleBoundaryMode}
            className={`px-3 py-1.5 rounded-xl font-mono text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-md ${
              showBoundaryMode
                ? 'bg-gradient-to-r from-amber-400 via-amber-500 to-yellow-600 text-black gold-glow scale-105'
                : 'bg-slate-900 border border-slate-700 text-slate-300 hover:text-white hover:border-amber-400/60'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>{showBoundaryMode ? '✓ SHOWING TRUTH BOUNDARY' : 'SHOW TRUTH BOUNDARY'}</span>
          </button>
        </div>
      </div>

      {/* FILTER BUTTONS ROW */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-thin text-xs">
        <span className="text-[10px] text-slate-500 uppercase tracking-wider shrink-0 mr-1">Filter:</span>
        {filterOptions.map((opt) => {
          const isActive = currentFilter === opt.id;
          return (
            <button
              key={opt.id}
              onClick={() => onFilterChange(opt.id)}
              className={`px-3 py-1 rounded-lg transition whitespace-nowrap cursor-pointer shrink-0 font-mono text-xs ${
                isActive
                  ? 'bg-cyan-500/25 border border-cyan-400 text-cyan-200 font-bold shadow'
                  : 'bg-slate-900/80 border border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              <span className={opt.color}>{opt.label}</span>
            </button>
          );
        })}
      </div>

      {/* EXPANDABLE TRUTH BOUNDARY ARCHITECTURE DISCLOSURE PANEL */}
      {showBoundaryMode && (
        <div className="p-3.5 bg-black/80 rounded-xl border border-amber-500/50 space-y-3 animate-fade-in text-xs">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <span className="text-amber-300 font-bold flex items-center gap-1.5">
              <Lock className="w-4 h-4 text-amber-400" />
              ARCHITECTURAL TRUTH BOUNDARY BREAKDOWN
            </span>
            <span className="text-[10px] text-slate-400">Strict Hierarchy Enforced</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-2.5 text-[10px]">
            {/* AUTHORITATIVE DATA */}
            <div className="p-2.5 bg-emerald-950/30 border border-emerald-500/40 rounded-xl space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-emerald-400 font-bold">1. AUTHORITATIVE DATA</span>
                <span className="px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[8px]">SSoT</span>
              </div>
              <p className="text-slate-300 text-[9.5px] font-sans">
                14,902 Canonical Seals • Merkle Tree Block #849202 • Phase Registry 01–40. ห้ามกลายพันธุ์เด็ดขาด
              </p>
            </div>

            {/* OBSERVED DATA */}
            <div className="p-2.5 bg-cyan-950/30 border border-cyan-500/40 rounded-xl space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-cyan-400 font-bold">2. OBSERVED DATA</span>
                <span className="px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300 text-[8px]">RUNTIME</span>
              </div>
              <p className="text-slate-300 text-[9.5px] font-sans">
                สถานะการทำงานของ 17 โมดูล, ห้องมิติ 00-17, สัญญาณเตือน Sentinel และสถานะคีย์
              </p>
            </div>

            {/* DERIVED DATA */}
            <div className="p-2.5 bg-purple-950/30 border border-purple-500/40 rounded-xl space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-purple-400 font-bold">3. DERIVED DATA</span>
                <span className="px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-300 text-[8px]">PROBE</span>
              </div>
              <p className="text-slate-300 text-[9.5px] font-sans">
                เมตริกคำนวณ Coherence 99.992%, Warp Burn 37.93 q-U/s, Sharpe 2.41 จากตัวชี้วัดภายใน
              </p>
            </div>

            {/* SIMULATED DATA */}
            <div className="p-2.5 bg-amber-950/30 border border-amber-500/40 rounded-xl space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-amber-400 font-bold">4. SIMULATED DATA</span>
                <span className="px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 text-[8px]">MODEL</span>
              </div>
              <p className="text-slate-300 text-[9.5px] font-sans">
                Cryo 14.82 mK, Chaos drill, Warp path latency, จำลองกระบวนการ QOps (UI / simulated telemetry)
              </p>
            </div>

            {/* UI STATE */}
            <div className="p-2.5 bg-indigo-950/30 border border-indigo-500/40 rounded-xl space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-indigo-400 font-bold">5. UI STATE</span>
                <span className="px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300 text-[8px]">VIEW</span>
              </div>
              <p className="text-slate-300 text-[9.5px] font-sans">
                การเลือกแท็บห้องมิติ, Three.js 3D Viewport, D3.js Radial Graph, เสียงสังเคราะห์สังเคราะห์ Web Audio
              </p>
            </div>
          </div>

          <div className="p-2 bg-slate-950 rounded-lg border border-slate-800 text-[10px] text-slate-400 flex items-center justify-between">
            <span className="flex items-center gap-1 text-amber-300">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
              <span>SAFETY DISCLOSURE: Telemetry & Quantum Values are modeled UI simulations for demonstration — not physical hardware readings.</span>
            </span>
            <span className="text-emerald-400 font-bold">FAIL-CLOSED PROTOCOL ACTIVE</span>
          </div>
        </div>
      )}
    </div>
  );
}
