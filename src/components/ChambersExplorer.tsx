"use client";

import React, { useState } from 'react';
import { CHAMBERS_DATA, ChamberData, SSOT } from '../lib/ssot-data';
import {
  Search,
  Shield,
  Check,
  Share2,
  Lock,
  Cpu,
  Layers,
  Sparkles,
  ExternalLink,
  Activity,
  CheckCircle2,
  Radio,
  Archive,
} from 'lucide-react';
import { playTone, playAuditChime } from './AudioSynthesizer';
import { Chamber02View } from './views/Security/Chamber02View';
import { Chamber11QuantumRadar } from './Chamber11QuantumRadar';
import { Chamber17Preservation } from './chambers/Chamber17Preservation';

export interface ChambersExplorerProps {
  onSelectChamber?: (chamber: ChamberData) => void;
  className?: string;
}

export const ChambersExplorer: React.FC<ChambersExplorerProps> = ({
  onSelectChamber,
  className = '',
}) => {
  const [selectedChamber, setSelectedChamber] = useState<ChamberData>(CHAMBERS_DATA[0]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'SEALED' | 'ACTIVE'>('ALL');
  const [copiedLink, setCopiedLink] = useState(false);
  const [activeSubTab, setActiveSubTab] = useState<'overview' | 'submodules' | 'notes' | 'forensics' | 'radar'>('overview');

  // Local storage persisted notes
  const [notes, setNotes] = useState<Record<string, string>>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('zyrquen_chamber_notes');
        return saved ? JSON.parse(saved) : {};
      } catch {
        return {};
      }
    }
    return {};
  });

  const handleNoteChange = (text: string) => {
    const updated = { ...notes, [selectedChamber.id]: text };
    setNotes(updated);
    if (typeof window !== 'undefined') {
      localStorage.setItem('zyrquen_chamber_notes', JSON.stringify(updated));
    }
  };

  const filteredChambers = CHAMBERS_DATA.filter((chamber) => {
    const matchSearch =
      chamber.num.includes(search) ||
      chamber.titleEn.toLowerCase().includes(search.toLowerCase()) ||
      chamber.titleTh.toLowerCase().includes(search.toLowerCase()) ||
      chamber.badge.toLowerCase().includes(search.toLowerCase());

    const matchStatus = statusFilter === 'ALL' || chamber.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const handleCopyChamberLink = () => {
    if (typeof window !== 'undefined') {
      const url = `${window.location.origin}${window.location.pathname}?chamber=${selectedChamber.num}`;
      navigator.clipboard.writeText(url);
      setCopiedLink(true);
      playAuditChime();
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  const handleSelect = (chamber: ChamberData) => {
    playTone(560, 0.04);
    setSelectedChamber(chamber);
    if (onSelectChamber) onSelectChamber(chamber);
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Search & Filter Header */}
      <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between bg-zinc-950/80 border border-zinc-800/80 p-4 rounded-2xl backdrop-blur-xl">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="ค้นหา 18 ห้องปฏิบัติการ (Chambers 00–17, SSoT, Zero Trust, AI, Cryptography)..."
            className="w-full bg-zinc-900/90 border border-zinc-800 focus:border-[#D4AF37] rounded-xl pl-10 pr-4 py-2 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none transition font-sans"
          />
        </div>

        <div className="flex items-center gap-2">
          {(['ALL', 'SEALED', 'ACTIVE'] as const).map((mode) => (
            <button
              key={mode}
              onClick={() => {
                playTone(600, 0.03);
                setStatusFilter(mode);
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-semibold transition border ${
                statusFilter === mode
                  ? 'bg-[#D4AF37]/20 text-[#FACC15] border-[#D4AF37]'
                  : 'bg-zinc-900/50 text-zinc-400 border-zinc-800 hover:border-zinc-700'
              }`}
            >
              {mode === 'ALL'
                ? 'ทั้งหมด (18)'
                : mode === 'SEALED'
                ? '🔒 SEALED (2)'
                : '⚡ ACTIVE (16)'}
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid: Chambers List & Detailed Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Chambers List (Left / 5 Cols) */}
        <div className="lg:col-span-5 space-y-2.5 max-h-[720px] overflow-y-auto pr-1">
          {filteredChambers.map((chamber) => {
            const isSelected = selectedChamber.id === chamber.id;
            return (
              <div
                key={chamber.id}
                onClick={() => handleSelect(chamber)}
                className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-zinc-900/90 border-[#D4AF37] shadow-lg shadow-[#D4AF37]/10 translate-x-1'
                    : 'bg-zinc-950/60 border-zinc-800/80 hover:bg-zinc-900/40 hover:border-zinc-700'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-zinc-800 text-[#FDE68A] border border-zinc-700">
                      CH-{chamber.num}
                    </span>
                    <span className="text-xs font-mono px-2 py-0.5 rounded bg-cyan-950/40 text-cyan-400 border border-cyan-800/40">
                      {chamber.badge}
                    </span>
                  </div>
                  <span
                    className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                      chamber.status === 'SEALED'
                        ? 'bg-amber-950/40 text-[#FACC15] border border-amber-700/50'
                        : 'bg-emerald-950/40 text-emerald-400 border border-emerald-800/50'
                    }`}
                  >
                    {chamber.status === 'SEALED' ? '🔒 SSoT ROOT' : '⚡ LIVE'}
                  </span>
                </div>
                <h4 className="text-sm font-semibold text-zinc-200 line-clamp-1">
                  {chamber.titleTh}
                </h4>
                <p className="text-xs text-zinc-500 line-clamp-1 mt-0.5">
                  {chamber.descriptionEn}
                </p>
              </div>
            );
          })}
        </div>

        {/* Chamber Deep Inspector (Right / 7 Cols) */}
        <div className="lg:col-span-7 bg-zinc-950/90 border border-zinc-800 rounded-2xl p-5 space-y-5 backdrop-blur-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-zinc-800">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-[#D4AF37]/20 text-[#FACC15] border border-[#D4AF37]/40 font-bold">
                  CHAMBER {selectedChamber.num}
                </span>
                <span className="text-xs font-mono text-cyan-400 px-2 py-0.5 rounded bg-cyan-950/40 border border-cyan-800/40">
                  {selectedChamber.badge}
                </span>
              </div>
              <h3 className="text-lg font-bold text-zinc-100">
                {selectedChamber.titleTh}
              </h3>
              <p className="text-xs font-mono text-zinc-400 mt-0.5">
                {selectedChamber.titleEn}
              </p>
            </div>

            <button
              onClick={handleCopyChamberLink}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-900 text-xs font-mono text-zinc-300 border border-zinc-700 hover:border-[#D4AF37] hover:text-[#FACC15] transition self-start sm:self-auto"
            >
              {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5" />}
              <span>{copiedLink ? 'คัดลอกลิงก์แล้ว' : 'แชร์ห้อง'}</span>
            </button>
          </div>

          {/* Sub Navigation Tabs */}
          <div className="flex items-center gap-2 border-b border-zinc-800/80 pb-2">
            <button
              onClick={() => {
                playTone(650, 0.03);
                setActiveSubTab('overview');
              }}
              className={`px-3 py-1 text-xs font-mono rounded-lg transition ${
                activeSubTab === 'overview'
                  ? 'bg-zinc-800 text-[#FACC15] font-bold shadow'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              ภาพรวม & โทรมาตร
            </button>
            <button
              onClick={() => {
                playTone(650, 0.03);
                setActiveSubTab('submodules');
              }}
              className={`px-3 py-1 text-xs font-mono rounded-lg transition ${
                activeSubTab === 'submodules'
                  ? 'bg-zinc-800 text-cyan-400 font-bold shadow'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              โมดูลย่อย ({selectedChamber.subModules.length})
            </button>
            <button
              onClick={() => {
                playTone(650, 0.03);
                setActiveSubTab('notes');
              }}
              className={`px-3 py-1 text-xs font-mono rounded-lg transition ${
                activeSubTab === 'notes'
                  ? 'bg-zinc-800 text-purple-400 font-bold shadow'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              บันทึกวิศวกรรม (Local Notes)
            </button>

            {selectedChamber.num === '02' && (
              <button
                onClick={() => {
                  playTone(620, 0.03);
                  setActiveSubTab('forensics');
                }}
                className={`px-3 py-1 text-xs font-mono rounded-lg transition border flex items-center gap-1.5 ${
                  activeSubTab === 'forensics'
                    ? 'bg-rose-950/70 border-rose-500/60 text-rose-300 font-bold shadow-[0_0_15px_rgba(244,63,94,0.25)]'
                    : 'text-rose-400/80 hover:text-rose-300 border-rose-700/30 bg-rose-950/20'
                }`}
              >
                <Shield className="w-3 h-3 text-rose-400" />
                <span>ศูนย์กักกัน & นิติวิทยาศาสตร์ (Chamber 02 UI)</span>
              </button>
            )}

            {selectedChamber.num === '11' && (
              <button
                onClick={() => {
                  playTone(700, 0.03);
                  setActiveSubTab('radar');
                }}
                className={`px-3 py-1 text-xs font-mono rounded-lg transition border flex items-center gap-1.5 ${
                  activeSubTab === 'radar'
                    ? 'bg-emerald-950/70 border-emerald-500/60 text-emerald-300 font-bold shadow-[0_0_15px_rgba(0,255,65,0.25)]'
                    : 'text-emerald-400/80 hover:text-emerald-300 border-emerald-700/30 bg-emerald-950/20'
                }`}
              >
                <Radio className="w-3 h-3 text-emerald-400" />
                <span>เรดาร์ควอนตัม 8K (Chamber 11 Radar UI)</span>
              </button>
            )}

            {selectedChamber.num === '17' && (
              <button
                onClick={() => {
                  playTone(650, 0.03);
                  setActiveSubTab('forensics');
                }}
                className={`px-3 py-1 text-xs font-mono rounded-lg transition border flex items-center gap-1.5 ${
                  activeSubTab === 'forensics'
                    ? 'bg-indigo-950/70 border-indigo-500/60 text-indigo-300 font-bold shadow-[0_0_15px_rgba(99,102,241,0.25)]'
                    : 'text-indigo-400/80 hover:text-indigo-300 border-indigo-700/30 bg-indigo-950/20'
                }`}
              >
                <Archive className="w-3 h-3 text-indigo-400" />
                <span>สมุดบันทึกหลักฐานนิติวิทยาศาสตร์ 12 ขั้นตอน (Chamber 17 Forensic Ledger)</span>
              </button>
            )}
          </div>

          {/* Tab 1: Overview */}
          {activeSubTab === 'overview' && (
            <div className="space-y-4">
              <p className="text-sm text-zinc-300 leading-relaxed font-sans">
                {selectedChamber.descriptionTh}
              </p>

              {/* Telemetry Metrics Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {selectedChamber.metrics.map((m, idx) => (
                  <div key={idx} className="bg-zinc-900/60 border border-zinc-800 p-3 rounded-xl">
                    <div className="text-[11px] font-mono text-zinc-400">{m.label}</div>
                    <div className="text-base font-bold font-mono text-[#FDE68A] mt-1">{m.value}</div>
                    <div className="flex items-center gap-1 mt-1 text-[10px] font-mono text-emerald-400">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></div>
                      <span>SSoT Invariant OK</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Invariant Baseline Specs */}
              <div className="bg-zinc-900/40 border border-zinc-800/80 p-3.5 rounded-xl space-y-2">
                <div className="text-xs font-mono font-bold text-zinc-300 flex items-center gap-2">
                  <Shield className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <span>สัจธรรมอธิปไตย SSoT Δ0 ที่คุ้มกันห้องนี้</span>
                </div>
                <div className="text-xs font-mono text-zinc-400 space-y-1">
                  <div>• Canonical Seals Count: <span className="text-[#FACC15]">{SSOT.canonicalSealsCount.toLocaleString()} ตราประทับคงที่</span></div>
                  <div>• Post-Quantum Shield: <span className="text-cyan-400">{SSOT.postQuantumStandards}</span></div>
                  <div>• Legal Authority: <span className="text-purple-400">{SSOT.legalCompliance}</span></div>
                </div>
              </div>
            </div>
          )}

          {/* Tab 2: Submodules */}
          {activeSubTab === 'submodules' && (
            <div className="space-y-3">
              {selectedChamber.subModules.map((sub, idx) => (
                <div key={idx} className="p-3 bg-zinc-900/60 border border-zinc-800 rounded-xl flex items-start justify-between gap-3">
                  <div>
                    <h5 className="text-sm font-semibold text-zinc-200">{sub.name}</h5>
                    <p className="text-xs text-zinc-400 mt-1">{sub.desc}</p>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950/60 text-cyan-300 border border-cyan-700/50 whitespace-nowrap">
                    {sub.status}
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* Tab 3: Notes */}
          {activeSubTab === 'notes' && (
            <div className="space-y-3">
              <label className="text-xs font-mono text-zinc-400 block">
                บันทึกการตรวจสอบสำหรับ CH-{selectedChamber.num} ({selectedChamber.titleEn})
              </label>
              <textarea
                value={notes[selectedChamber.id] || ''}
                onChange={(e) => handleNoteChange(e.target.value)}
                placeholder="พิมพ์บันทึกวิศวกรรมเฉพาะห้องนี้ (ข้อมูลจะถูกบันทึกลง Local Storage อัตโนมัติ)..."
                rows={5}
                className="w-full bg-zinc-900 border border-zinc-800 focus:border-[#D4AF37] rounded-xl p-3 text-sm text-zinc-100 placeholder-zinc-600 focus:outline-none transition font-sans"
              />
              <div className="text-[11px] font-mono text-zinc-500 flex items-center justify-between">
                <span>บันทึกสถานะเรียบร้อย (Auto-persisted)</span>
                <span className="text-zinc-400">Clearance: {SSOT.clearanceLevel}</span>
              </div>
            </div>
          )}

          {/* Tab 4: Dedicated Chamber 02 Forensics & Quarantine UI */}
          {activeSubTab === 'forensics' && selectedChamber.num === '02' && (
            <div className="pt-2">
              <Chamber02View />
            </div>
          )}

          {/* Tab 5: Dedicated Chamber 11 8K Quantum Radar UI */}
          {activeSubTab === 'radar' && selectedChamber.num === '11' && (
            <div className="pt-2">
              <Chamber11QuantumRadar />
            </div>
          )}

          {/* Tab 6: Dedicated Chamber 17 Forensic Evidence Ledger UI */}
          {activeSubTab === 'forensics' && selectedChamber.num === '17' && (
            <div className="pt-2">
              <Chamber17Preservation lang="th" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
