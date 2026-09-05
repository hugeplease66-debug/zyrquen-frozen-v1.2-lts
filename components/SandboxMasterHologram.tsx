'use client';

import React, { useState } from 'react';
import {
  Sparkles,
  Layers,
  Zap,
  Maximize2,
  Activity,
  ShieldCheck,
  Award,
  Eye,
  Sliders,
  X,
  Compass,
  Cpu,
  Share2,
  Box,
  Terminal,
  RotateCw,
  Globe,
  Radio,
  Lock,
  Fuel,
  Radar,
  Flame,
  CheckCircle2,
  RefreshCw
} from 'lucide-react';
import QuantumCitadelWorldEngine from './QuantumCitadelWorldEngine';
import SupremeGoldMasterSeal3D from './SupremeGoldMasterSeal3D';
import SovereignSealSvg from './SovereignSealSvg';
import SpatialEntropyHeatMap from './SpatialEntropyHeatMap';

export interface SandboxHologramProps {
  coherence?: number;
  cryoTemp?: string;
  onAddNotification?: (msg: string, type?: 'success' | 'error' | 'warning') => void;
  onSelectChamber?: (id: string) => void;
}

export default function SandboxMasterHologram({
  coherence = 99.992,
  cryoTemp = "14.98 mK",
  onAddNotification,
  onSelectChamber
}: SandboxHologramProps) {
  const [activePanel, setActivePanel] = useState<'central' | 'gesture' | 'stream' | 'cathedral' | 'fuel' | 'grid' | 'feedback'>('central');
  const [gestureMode, setGestureMode] = useState<'ROTATION' | 'ZOOM' | 'WARP_DISPATCH' | 'CRYOGENIC_LOCK'>('ROTATION');
  const [streamActive, setStreamActive] = useState(true);
  const [fuelBurnRate, setFuelBurnRate] = useState(37.93);
  const [fuelLevel, setFuelLevel] = useState(88.5);

  const panels = [
    { id: 'central', name: 'Central Sovereign Deck', th: 'ดาดฟ้าบัญชาการอธิปไตยหลัก', icon: Box, color: 'text-cyan-400' },
    { id: 'gesture', name: 'Gesture Control Nexus', th: 'ศูนย์ควบคุมการสั่งการแบบโฮโลกราฟิก', icon: Sliders, color: 'text-amber-400' },
    { id: 'stream', name: 'Quantum Stream Director', th: 'ผู้กำกับการไหลของสตรีมควอนตัม', icon: Zap, color: 'text-blue-400' },
    { id: 'cathedral', name: 'Audit Cathedral Sphere', th: 'ทรงกลมมหาวิหารตรวจสอบความจริง', icon: ShieldCheck, color: 'text-emerald-400' },
    { id: 'fuel', name: 'Fuel & Radar Orb', th: 'ออร์บเชื้อเพลิงและเรดาร์อวกาศ', icon: Fuel, color: 'text-rose-400' },
    { id: 'grid', name: 'Multiverse Nav Grid', th: 'ตารางนำทางพหุจักรวาล Ω601–1000', icon: Globe, color: 'text-purple-400' },
    { id: 'feedback', name: 'Feedback Intelligence Core', th: 'แกนปัญญาประดิษฐ์ตอบสนอง', icon: Cpu, color: 'text-indigo-400' }
  ];

  return (
    <div className="space-y-6 font-mono text-xs">
      {/* TOP DECK CONTROLLER */}
      <div className="bg-gradient-to-r from-[#091122] via-[#0f1d38] to-[#091122] border border-cyan-500/40 p-5 sm:p-6 rounded-2xl backdrop-blur-xl shadow-2xl relative overflow-hidden">
        <div className="flex flex-wrap justify-between items-center gap-4 border-b border-slate-800 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/15 text-[#67E8F9] border border-cyan-500/40 text-[10px] font-bold">
                MASTER SANDBOX HOLOGRAM v4.16 PDPA FINAL
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/40 text-[10px] font-bold">
                10/10 PASSED • 100% GREEN
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white font-mono mt-1 text-cyan-gradient flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-cyan-400" />
              ZYRQUEN Ω∞ Sovereign Hologram World Engine
            </h2>
            <p className="text-slate-300 text-xs font-sans mt-0.5">
              ศูนย์รวม 7 แผงควบคุมโฮโลกราฟิก 3 มิติ และสภาวะแวดล้อมควอนตัมจำลองแบบเรียลไทม์ ไร้การกลายพันธุ์ SSoT Δ0.0%
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => {
                if (onAddNotification) onAddNotification("🌀 ปรับเทียบศูนย์กลาง 3D Quantum Citadel Lattice สำเร็จ", "success");
              }}
              className="px-3 py-1.5 bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-400/50 text-cyan-200 font-bold text-xs rounded-xl transition cursor-pointer flex items-center gap-1.5"
            >
              <RotateCw className="w-3.5 h-3.5" /> รีเซ็ตมุมมอง
            </button>
          </div>
        </div>

        {/* 7 PANELS SELECTOR */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2 pt-4">
          {panels.map((p) => {
            const isActive = activePanel === p.id;
            const Icon = p.icon;
            return (
              <button
                key={p.id}
                onClick={() => setActivePanel(p.id as any)}
                className={`p-2.5 rounded-xl border text-left transition cursor-pointer flex flex-col justify-between ${
                  isActive
                    ? 'bg-cyan-500 text-black border-cyan-300 shadow-lg shadow-cyan-500/20 font-bold'
                    : 'bg-black/50 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-900/60'
                }`}
              >
                <div className="flex justify-between items-center w-full mb-1">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-black' : p.color}`} />
                  <span className={`text-[9px] ${isActive ? 'text-black font-bold' : 'text-slate-500'}`}>0{panels.indexOf(p) + 1}</span>
                </div>
                <div>
                  <div className={`text-[11px] font-mono leading-tight ${isActive ? 'text-black' : 'text-white'}`}>{p.name}</div>
                  <div className={`text-[9px] font-sans truncate mt-0.5 ${isActive ? 'text-slate-900' : 'text-slate-400'}`}>{p.th}</div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* ACTIVE PANEL CONTENT */}
      {activePanel === 'central' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          <div className="lg:col-span-8">
            <QuantumCitadelWorldEngine
              coherence={coherence}
              cryoTemp={cryoTemp}
              onAddNotification={onAddNotification}
            />
          </div>
          <div className="lg:col-span-4 space-y-4">
            <div className="bg-[#0f172a]/95 border border-amber-500/40 p-5 rounded-2xl backdrop-blur-xl shadow-2xl text-center space-y-3">
              <h3 className="text-sm font-bold text-white font-mono text-gold-gradient">Supreme Sovereign Gold Master Seal</h3>
              <div className="py-2">
                <SupremeGoldMasterSeal3D size={240} onNotify={onAddNotification} />
              </div>
              <div className="text-[10px] text-slate-400 font-mono">
                Canonical Block #849202 • 14,902 Seals
              </div>
            </div>

            <div className="bg-[#0f172a]/95 border border-cyan-500/40 p-4 rounded-2xl backdrop-blur-xl shadow-2xl space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-300 font-bold">Fast Chamber Access</span>
                <span className="text-cyan-400 text-[10px]">Chamber 00-17</span>
              </div>
              <div className="grid grid-cols-3 gap-1.5">
                {['00', '01', '03', '07', '08', '10', '13', '14', '17'].map((cId) => (
                  <button
                    key={cId}
                    onClick={() => onSelectChamber && onSelectChamber(cId)}
                    className="p-1.5 rounded bg-slate-900 hover:bg-cyan-500/20 text-slate-300 hover:text-cyan-200 border border-slate-800 text-[10px] font-bold text-center cursor-pointer transition"
                  >
                    Chamber {cId}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {activePanel === 'gesture' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          <div className="lg:col-span-6 space-y-4">
            <div className="bg-[#0f172a]/95 border border-amber-500/40 p-5 rounded-2xl backdrop-blur-xl shadow-2xl space-y-4">
              <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                <span className="font-bold text-white text-sm flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-amber-400" />
                  Gesture Mode Matrix
                </span>
                <span className="text-[10px] text-amber-300 font-bold">HAPTIC STREAM</span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {[
                  { id: 'ROTATION', label: '3D Orbit Rotation', desc: 'หมุนสำรวจโครงข่าย Topology 360°' },
                  { id: 'ZOOM', label: 'Lattice Micro-Zoom', desc: 'ซูมเจาะลึกระดับ Enclave ไมโครชิป' },
                  { id: 'WARP_DISPATCH', label: 'Warp Corridor Fire', desc: 'ยิงสัญญาณเชื่อมต่อประตูมิติ Ω601–1000' },
                  { id: 'CRYOGENIC_LOCK', label: 'Cryogenic Pinning Lock', desc: 'ล็อกความเย็นยวดยิ่ง 14.98 mK' }
                ].map((g) => (
                  <div
                    key={g.id}
                    onClick={() => {
                      setGestureMode(g.id as any);
                      if (onAddNotification) onAddNotification(`สลับโหมด Gesture: ${g.label}`, 'success');
                    }}
                    className={`p-3 rounded-xl border cursor-pointer transition ${
                      gestureMode === g.id
                        ? 'bg-amber-500/20 border-amber-400 text-amber-300'
                        : 'bg-black/40 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <div className="font-bold text-xs text-white">{g.label}</div>
                    <div className="text-[10px] text-slate-400 font-sans mt-1">{g.desc}</div>
                  </div>
                ))}
              </div>

              <div className="p-3 bg-black/60 rounded-xl border border-slate-800 text-slate-300 text-xs font-sans">
                ✨ <strong>โหมดการควบคุมปัจจุบัน:</strong> {gestureMode} — พร้อมรับคำสั่งจากเซ็นเซอร์ท่าทางหรือเมาส์สามมิติ
              </div>
            </div>
          </div>

          <div className="lg:col-span-6">
            <SpatialEntropyHeatMap />
          </div>
        </div>
      )}

      {activePanel === 'stream' && (
        <div className="bg-[#0f172a]/95 border border-blue-500/40 p-5 rounded-2xl backdrop-blur-xl shadow-2xl space-y-4">
          <div className="flex justify-between items-center border-b border-slate-800 pb-3">
            <span className="font-bold text-white text-sm flex items-center gap-2">
              <Zap className="w-4 h-4 text-blue-400" />
              Quantum Stream Director & Beam Modulation
            </span>
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-emerald-400 font-bold">STREAM ACTIVE (851.9 THz)</span>
              <button
                onClick={() => {
                  setStreamActive(!streamActive);
                  if (onAddNotification) onAddNotification(`สถานะสตรีมควอนตัม: ${!streamActive ? 'เปิด' : 'ปิด'}`, 'warning');
                }}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                  streamActive ? 'bg-blue-500 text-black' : 'bg-slate-800 text-slate-400'
                }`}
              >
                {streamActive ? 'PAUSE STREAM' : 'RESUME STREAM'}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
            <div className="p-4 bg-black/60 rounded-xl border border-slate-800 space-y-1">
              <span className="text-slate-400 text-[10px]">FLUX FREQUENCY:</span>
              <div className="text-xl font-bold text-blue-400">851.92 THz</div>
              <div className="text-[10px] text-slate-400 font-sans">Phase Coherence: 99.992%</div>
            </div>
            <div className="p-4 bg-black/60 rounded-xl border border-slate-800 space-y-1">
              <span className="text-slate-400 text-[10px]">DECOHERENCE LOSS:</span>
              <div className="text-xl font-bold text-emerald-400">0.0008%</div>
              <div className="text-[10px] text-slate-400 font-sans">Loss Delta Zero-Threshold</div>
            </div>
            <div className="p-4 bg-black/60 rounded-xl border border-slate-800 space-y-1">
              <span className="text-slate-400 text-[10px]">LATTICE TUNNEL:</span>
              <div className="text-xl font-bold text-purple-400">ML-KEM-1024</div>
              <div className="text-[10px] text-slate-400 font-sans">Encapsulated Quantum Key</div>
            </div>
          </div>
        </div>
      )}

      {activePanel === 'cathedral' && (
        <div className="bg-[#0f172a]/95 border border-emerald-500/40 p-5 rounded-2xl backdrop-blur-xl shadow-2xl space-y-4">
          <div className="flex justify-between items-center border-b border-slate-800 pb-3">
            <span className="font-bold text-white text-sm flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              Audit Cathedral Sphere & 14,902 Seals SSoT Anchor
            </span>
            <span className="text-[10px] text-emerald-300 font-bold">IMMUTABLE (Δ=0.0%)</span>
          </div>

          <p className="text-slate-300 text-xs font-sans">
            มหาวิหารตรวจสอบสัจจะและหลักฐานดิจิทัลคานอนิคอล ทุกตราประทับ 14,902 ดวงถูกสลักบันทึกและเชื่อมโยงกับ Genesis Block #849202 พร้อมฉันทามติ 10/10 จากกุญแจฮาร์ดแวร์สภาผู้พิทักษ์
          </p>

          <div className="p-4 bg-emerald-950/20 border border-emerald-500/30 rounded-xl flex justify-between items-center">
            <div>
              <div className="text-xs font-bold text-emerald-300">GENESIS MERKLE ROOT HASH</div>
              <div className="text-[11px] text-slate-300 font-mono mt-0.5 break-all">
                909ab814479844d8a14816bed34cdbb07528e18501da86fc4691763a43fa4c68
              </div>
            </div>
            <button
              onClick={() => {
                if (onAddNotification) onAddNotification("✓ ตรวจสอบความสมบูรณ์ของ Merkle Root 100% ผ่าน", "success");
              }}
              className="px-3 py-1.5 rounded bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 font-bold text-xs shrink-0 cursor-pointer"
            >
              Verify Root Hash
            </button>
          </div>
        </div>
      )}

      {activePanel === 'fuel' && (
        <div className="bg-[#0f172a]/95 border border-rose-500/40 p-5 rounded-2xl backdrop-blur-xl shadow-2xl space-y-4">
          <div className="flex justify-between items-center border-b border-slate-800 pb-3">
            <span className="font-bold text-white text-sm flex items-center gap-2">
              <Fuel className="w-4 h-4 text-rose-400" />
              Quantum Fuel Core & Sub-Kelvin Cryo Bus
            </span>
            <span className="text-[10px] text-rose-300 font-bold">RESERVE: {fuelLevel.toFixed(1)}%</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-black/60 rounded-xl border border-slate-800 space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-slate-400 text-xs">Fuel Tank Level:</span>
                <span className="text-rose-400 font-bold">{fuelLevel.toFixed(1)}%</span>
              </div>
              <div className="w-full bg-slate-900 rounded-full h-3 overflow-hidden border border-slate-800">
                <div className="bg-gradient-to-r from-rose-500 to-amber-500 h-3" style={{ width: `${fuelLevel}%` }}></div>
              </div>
              <div className="flex justify-between items-center text-[10px] text-slate-400 pt-1">
                <span>Burn Rate: {fuelBurnRate} q-U/s</span>
                <span>Cryo Bus: {cryoTemp}</span>
              </div>
            </div>

            <div className="p-4 bg-black/60 rounded-xl border border-slate-800 flex flex-col justify-between">
              <span className="text-slate-300 text-xs font-sans">
                ⚡ ระบบควบคุมการเผาไหม้เชื้อเพลิงควอนตัมเพื่อสร้างสนามพลังรักษาสถานะ Superconducting Cryo-Bus
              </span>
              <button
                onClick={() => {
                  setFuelLevel(99.9);
                  if (onAddNotification) onAddNotification("เติมเชื้อเพลิงควอนตัมเต็มถัง (99.9%)", "success");
                }}
                className="w-full mt-2 py-2 bg-rose-500/20 hover:bg-rose-500/30 text-rose-200 border border-rose-500/40 rounded-xl font-bold text-xs transition cursor-pointer"
              >
                Refuel Quantum Core
              </button>
            </div>
          </div>
        </div>
      )}

      {activePanel === 'grid' && (
        <div className="bg-[#0f172a]/95 border border-purple-500/40 p-5 rounded-2xl backdrop-blur-xl shadow-2xl space-y-4">
          <div className="flex justify-between items-center border-b border-slate-800 pb-3">
            <span className="font-bold text-white text-sm flex items-center gap-2">
              <Globe className="w-4 h-4 text-purple-400" />
              Multiverse Nav Grid Ω601–1000 (400 Tenant Nodes)
            </span>
            <span className="text-[10px] text-purple-300 font-bold">5 BANDS ZERO-DRIFT</span>
          </div>

          <p className="text-slate-300 text-xs font-sans">
            การแบ่งย่านความถี่ 5 ย่านสำหรับ 400 โหนดผู้เช่าพหุจักรวาล แต่ละย่านมีขอบเขตความปลอดภัยและการกักกันการรั่วไหล 100%
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-5 gap-2.5">
            {[
              { band: 'Ω601–Ω620', name: 'Core Entry', count: 20, color: 'text-cyan-300 border-cyan-500/30' },
              { band: 'Ω621–Ω700', name: 'Resonance Relay', count: 80, color: 'text-blue-300 border-blue-500/30' },
              { band: 'Ω701–Ω800', name: 'PQC Encryption', count: 100, color: 'text-purple-300 border-purple-500/30' },
              { band: 'Ω801–Ω900', name: 'Telemetry Audit', count: 100, color: 'text-emerald-300 border-emerald-500/30' },
              { band: 'Ω901–Ω1000', name: 'Sovereign Kernel', count: 100, color: 'text-amber-300 border-amber-500/30' }
            ].map((b, i) => (
              <div key={i} className={`p-3 bg-black/60 rounded-xl border ${b.color} space-y-1 text-center`}>
                <div className="text-[10px] font-bold text-slate-400">{b.band}</div>
                <div className="text-xs font-bold text-white">{b.name}</div>
                <div className="text-[10px] text-slate-500">{b.count} Nodes</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activePanel === 'feedback' && (
        <div className="bg-[#0f172a]/95 border border-indigo-500/40 p-5 rounded-2xl backdrop-blur-xl shadow-2xl space-y-4">
          <div className="flex justify-between items-center border-b border-slate-800 pb-3">
            <span className="font-bold text-white text-sm flex items-center gap-2">
              <Cpu className="w-4 h-4 text-indigo-400" />
              Feedback Intelligence & Autonomous Self-Healing Core
            </span>
            <span className="text-[10px] text-indigo-300 font-bold">142ms PHOENIX SLA</span>
          </div>

          <div className="p-4 bg-indigo-950/20 border border-indigo-500/30 rounded-xl space-y-2">
            <div className="text-xs text-slate-200 font-sans">
              🧠 เครื่องยนต์ปัญญาประดิษฐ์ตรวจสอบสภาวะระบบแบบลูปปิด (Closed-Loop Telemetry & Autonomous Recovery) ตรวจสอบความถูกต้องของการทำงานทุก 2 วินาที
            </div>
            <div className="flex justify-between items-center text-[10px] text-slate-400 pt-1">
              <span>Phoenix Recovery Time: 142ms</span>
              <span>Blast Radius: 0.8% (&lt; 2.0% SLA)</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
