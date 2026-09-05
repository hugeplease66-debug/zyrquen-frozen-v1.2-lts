'use client';

import React, { useState } from 'react';
import { 
  Globe2, 
  Sparkles, 
  Layers, 
  Activity, 
  ShieldCheck, 
  Terminal, 
  Zap, 
  Gavel, 
  Award,
  Maximize2,
  Boxes,
  Radio,
  Sliders,
  Cpu
} from 'lucide-react';
import SupremeGoldMasterSeal3D from './SupremeGoldMasterSeal3D';
import QuantumCitadelWorldEngine from './QuantumCitadelWorldEngine';
import MultiverseComplianceD3Lattice from './MultiverseComplianceD3Lattice';
import EnforcementLogSection from './EnforcementLogSection';
import SpatialEntropyHeatMap from './SpatialEntropyHeatMap';
import KernelLogOverlay from './KernelLogOverlay';
import BatchVerificationEngine from './BatchVerificationEngine';

interface SovereignWorldEngineProps {
  coherence?: number;
  qops?: number;
  cryoTemp?: string;
  onAddNotification?: (msg: string, type?: 'success' | 'error' | 'warning') => void;
  onOpenSealModal?: () => void;
}

export default function SovereignWorldEngine({
  coherence = 99.992,
  qops = 851.9,
  cryoTemp = "14.98 mK",
  onAddNotification,
  onOpenSealModal,
}: SovereignWorldEngineProps) {
  const [activeEngineTab, setActiveEngineTab] = useState<'3d_citadel' | '3d_hologram' | 'd3_lattice' | 'enforcement' | 'entropy_map' | 'kernel_stream' | 'batch_audit'>('3d_citadel');

  return (
    <div className="w-full space-y-6">
      
      {/* SOVEREIGN WORLD ENGINE BANNER & LIVE INDICATOR BEACONS */}
      <div className="rounded-3xl border border-cyan-500/40 bg-gradient-to-r from-[#0a172e] via-[#0d213f] to-[#081224] p-6 sm:p-8 backdrop-blur-2xl shadow-2xl relative overflow-hidden quantum-cyan-glow">
        
        {/* Ambient background light flare */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-wrap justify-between items-center gap-6">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-gradient-to-r from-amber-400 to-yellow-500 text-black font-mono text-[10px] font-bold tracking-widest uppercase shadow">
                SOVEREIGN WORLD ENGINE Ω∞
              </span>
              <span className="px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-mono text-[10px] font-bold">
                CYBERNETIC GLASS ARCHITECTURE
              </span>
              <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-mono text-[10px] font-bold flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                10/10 REAL HSM DECA-QUORUM
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-mono text-cyan-gradient">
              Sovereign World Engine: Multiverse Holographic Legal Grid
            </h2>
            
            <p className="text-slate-300 text-xs sm:text-sm font-sans max-w-3xl leading-relaxed">
              ศูนย์บัญชาการอธิปไตยดิจิทัลระดับจักรวาลและพหุมิติ ผสานแบบจำลอง 3D Hologram, Dynamic D3 Lattice, Real-Time Compliance Enforcement และ Sub-Kelvin Spatial Heat Map ภายใต้ตราประทับทองคำเอกสิทธิ์สูงสุด
            </p>
          </div>

          {/* RIGHT METRIC BEACONS */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 font-mono text-xs w-full lg:w-auto">
            <div className="p-3 bg-black/60 rounded-2xl border border-cyan-500/30 text-center">
              <span className="text-slate-400 text-[9px] block">COHERENCE</span>
              <strong className="text-emerald-400 text-sm">{coherence}%</strong>
            </div>
            <div className="p-3 bg-black/60 rounded-2xl border border-amber-500/30 text-center">
              <span className="text-slate-400 text-[9px] block">CANONICAL PROOFS</span>
              <strong className="text-amber-300 text-sm">14,902 Δ0</strong>
            </div>
            <div className="p-3 bg-black/60 rounded-2xl border border-purple-500/30 text-center col-span-2 sm:col-span-1">
              <span className="text-slate-400 text-[9px] block">CRYO FLUX</span>
              <strong className="text-cyan-300 text-sm">{cryoTemp}</strong>
            </div>
          </div>
        </div>

        {/* ENGINE VIEW SELECTOR TABS (CYBERNETIC GLASS TABS) */}
        <div className="mt-6 pt-4 border-t border-cyan-500/20 flex flex-wrap items-center gap-2">
          <button
            onClick={() => setActiveEngineTab('3d_citadel')}
            className={`px-4 py-2 rounded-xl font-mono text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
              activeEngineTab === '3d_citadel'
                ? 'bg-gradient-to-r from-cyan-400 via-sky-500 to-blue-600 text-black shadow-lg quantum-cyan-glow'
                : 'bg-slate-900/80 border border-slate-800 text-slate-300 hover:text-white hover:border-cyan-500/40'
            }`}
          >
            <Boxes className="w-4 h-4" />
            <span>3D Citadel Lattice & Mesh</span>
          </button>

          <button
            onClick={() => setActiveEngineTab('3d_hologram')}
            className={`px-4 py-2 rounded-xl font-mono text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
              activeEngineTab === '3d_hologram'
                ? 'bg-gradient-to-r from-amber-400 to-yellow-500 text-black shadow-lg gold-glow'
                : 'bg-slate-900/80 border border-slate-800 text-slate-300 hover:text-white hover:border-cyan-500/40'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>3D Master Seal Hologram</span>
          </button>

          <button
            onClick={() => setActiveEngineTab('d3_lattice')}
            className={`px-4 py-2 rounded-xl font-mono text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
              activeEngineTab === 'd3_lattice'
                ? 'bg-gradient-to-r from-cyan-400 to-sky-500 text-black shadow-lg quantum-cyan-glow'
                : 'bg-slate-900/80 border border-slate-800 text-slate-300 hover:text-white hover:border-cyan-500/40'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>D3 12-Layer Lattice</span>
          </button>

          <button
            onClick={() => setActiveEngineTab('enforcement')}
            className={`px-4 py-2 rounded-xl font-mono text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
              activeEngineTab === 'enforcement'
                ? 'bg-gradient-to-r from-purple-400 to-indigo-500 text-black shadow-lg'
                : 'bg-slate-900/80 border border-slate-800 text-slate-300 hover:text-white hover:border-cyan-500/40'
            }`}
          >
            <Gavel className="w-4 h-4" />
            <span>Enforcement Log & Veto</span>
          </button>

          <button
            onClick={() => setActiveEngineTab('entropy_map')}
            className={`px-4 py-2 rounded-xl font-mono text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
              activeEngineTab === 'entropy_map'
                ? 'bg-gradient-to-r from-emerald-400 to-teal-500 text-black shadow-lg'
                : 'bg-slate-900/80 border border-slate-800 text-slate-300 hover:text-white hover:border-cyan-500/40'
            }`}
          >
            <Activity className="w-4 h-4" />
            <span>Spatial Entropy Map</span>
          </button>

          <button
            onClick={() => setActiveEngineTab('batch_audit')}
            className={`px-4 py-2 rounded-xl font-mono text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
              activeEngineTab === 'batch_audit'
                ? 'bg-gradient-to-r from-indigo-400 to-cyan-500 text-black shadow-lg'
                : 'bg-slate-900/80 border border-slate-800 text-slate-300 hover:text-white hover:border-cyan-500/40'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Batch Merkle Auditor</span>
          </button>

          <button
            onClick={() => setActiveEngineTab('kernel_stream')}
            className={`px-4 py-2 rounded-xl font-mono text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
              activeEngineTab === 'kernel_stream'
                ? 'bg-gradient-to-r from-cyan-400 to-emerald-400 text-black shadow-lg'
                : 'bg-slate-900/80 border border-slate-800 text-slate-300 hover:text-white hover:border-cyan-500/40'
            }`}
          >
            <Terminal className="w-4 h-4" />
            <span>Kernel Logstream</span>
          </button>
        </div>

      </div>

      {/* DYNAMIC ACTIVE COMPONENT CONTAINER */}
      <div className="transition-all duration-300">
        {activeEngineTab === '3d_citadel' && (
          <QuantumCitadelWorldEngine
            coherence={coherence}
            qops={qops}
            cryoTemp={cryoTemp}
            onAddNotification={onAddNotification}
          />
        )}

        {activeEngineTab === '3d_hologram' && (
          <SupremeGoldMasterSeal3D
            coherence={coherence}
            qops={qops}
            cryoTemp={cryoTemp}
            isInteractive={true}
          />
        )}

        {activeEngineTab === 'd3_lattice' && (
          <MultiverseComplianceD3Lattice />
        )}

        {activeEngineTab === 'enforcement' && (
          <EnforcementLogSection onAddNotification={onAddNotification} />
        )}

        {activeEngineTab === 'entropy_map' && (
          <SpatialEntropyHeatMap />
        )}

        {activeEngineTab === 'batch_audit' && (
          <BatchVerificationEngine onAddNotification={onAddNotification} />
        )}

        {activeEngineTab === 'kernel_stream' && (
          <KernelLogOverlay />
        )}
      </div>

    </div>
  );
}
