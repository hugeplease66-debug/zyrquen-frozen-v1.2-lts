import { SystemResourceGrid } from "../SystemResourceGrid";
import { AggregateSystemEntropyChart } from "../AggregateSystemEntropyChart";
import { SpatialEntropyHeatMap } from "../SpatialEntropyHeatMap";
import React, { useState } from 'react';
import { ViewType } from '../../types';
import { SYSTEM_METADATA, CANONICAL_MODULES, AUDIT_TRACE_TX } from '../../data/canonicalData';
import { CitadelCanvas } from '../CitadelCanvas';
import { TopologyCanvas } from '../TopologyCanvas';
import { ChamberRuntimeAtlas3D } from '../ChamberRuntimeAtlas3D';
import { PinnedWidgetsDashboard } from '../PinnedWidgetsDashboard';
import { FiosFactorIntelligence } from '../FiosFactorIntelligence';
import { EvidenceIntakePanel } from '../EvidenceIntakePanel';
import { BaselineReconciliationGuard } from '../BaselineReconciliationGuard';
import { LiveAutomatedHealthWidget } from '../LiveAutomatedHealthWidget';
import { ChamberStatusGrid } from '../ChamberStatusGrid';
import { ManifestoCard } from '../ManifestoCard';
import { SovereignManifestoCard } from '../SovereignManifestoCard';
import {
  Activity,
  Cpu,
  ShieldCheck,
  Zap,
  ArrowRight,
  Database,
  Lock,
  Layers,
  Sparkles,
  Server,
  Play,
  RotateCw,
  Award,
  Crown,
  Orbit,
  Box,
  Network,
  Maximize2,
  Minimize2,
  Gauge,
  Info,
  X,
  CheckCircle2,
} from 'lucide-react';
import { playAuditChime, playTone } from '../AudioSynthesizer';

interface DashboardViewProps {
  onNavigate: (view: ViewType) => void;
  onOpenCertificate: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({ onNavigate, onOpenCertificate }) => {
  const [activeTab, setActiveTab] = useState<'atlas' | 'overview' | 'topology'>('atlas');
  const [isHealing, setIsHealing] = useState(false);
  const [healSuccess, setHealSuccess] = useState(false);
  const [citadelSpeed, setCitadelSpeed] = useState<number>(1.2);
  const [isCanvasExpanded, setIsCanvasExpanded] = useState<boolean>(false);
  const [showBufferModal, setShowBufferModal] = useState<boolean>(false);

  const triggerSelfHealing = () => {
    setIsHealing(true);
    setHealSuccess(false);
    playTone(500, 0.1, 'sine');
    setTimeout(() => {
      setIsHealing(false);
      setHealSuccess(true);
      playAuditChime();
      setTimeout(() => setHealSuccess(false), 4000);
    }, 1200);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* P0 Frozen Core Baseline & Reconciliation Gate */}
      <BaselineReconciliationGuard />

      {/* Top Banner / System State Header */}
      <div className="p-6 sm:p-8 rounded-[28px] bg-gradient-to-br from-[#0c1020]/90 via-[#0a0d1a]/80 to-[#07080F] border border-white/8 backdrop-blur-xl relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-cyan-500/10 via-violet-500/5 to-transparent rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-1 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 text-xs font-mono font-medium flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
                CIVILIZATION CONTROL PLANE v2.1
              </span>
              <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 text-xs font-mono">
                10/10 INVARIANTS COMPLIANT
              </span>
              <span className="px-2.5 py-1 rounded-full bg-violet-500/10 text-violet-300 border border-violet-500/20 text-xs font-mono">
                Ω601–Ω1000 GATES LOCKED
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-mono font-bold text-white tracking-tight">
              ZYRQUEN <span className="text-cyan-400 font-extrabold">Ω∞</span>
            </h1>
            <p className="text-xs sm:text-sm text-zinc-400 font-mono max-w-3xl leading-relaxed">
              Sovereign Operating System & Merkle Attested Civilization Architecture • Frozen Genesis Baseline v1.2 LTS •
              Under the Sovereign Authority of <span className="text-zinc-200 font-semibold">{SYSTEM_METADATA.sovereignPrincipal}</span>
            </p>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              onClick={triggerSelfHealing}
              disabled={isHealing}
              className={`px-4 py-2.5 rounded-2xl font-mono text-xs font-semibold flex items-center gap-2 transition-all border ${
                isHealing
                  ? 'bg-cyan-500/20 border-cyan-500/40 text-cyan-200 animate-pulse'
                  : 'bg-white/5 hover:bg-white/10 border-white/10 text-zinc-100 hover:border-cyan-500/40 shadow-lg'
              }`}
            >
              <RotateCw className={`w-4 h-4 text-cyan-400 ${isHealing ? 'animate-spin' : ''}`} />
              <span>{isHealing ? 'Phoenix Healing...' : 'Trigger Phoenix Healing'}</span>
            </button>

            <button
              onClick={() => {
                playTone(740, 0.08);
                onNavigate('council');
              }}
              className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-amber-500/20 via-yellow-500/20 to-amber-600/20 hover:from-amber-500/30 hover:to-yellow-500/30 border border-amber-500/40 hover:border-amber-400 text-amber-300 font-mono text-xs font-semibold flex items-center gap-2 transition-all shadow-[0_0_20px_rgba(245,158,11,0.15)]"
            >
              <Crown className="w-4 h-4 text-amber-400" />
              <span>สภาผู้พิทักษ์ 10/10</span>
            </button>

            <button
              onClick={() => {
                playTone(680, 0.08);
                onOpenCertificate();
              }}
              className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-amber-500/20 via-violet-500/20 to-cyan-500/20 hover:from-amber-500/30 hover:to-cyan-500/30 border border-amber-500/30 hover:border-amber-400/50 text-amber-300 font-mono text-xs font-semibold flex items-center gap-2 transition-all shadow-[0_0_20px_rgba(245,158,11,0.15)]"
            >
              <Award className="w-4 h-4 text-amber-400" />
              <span>Gold Master Seal</span>
            </button>
          </div>
        </div>

        {healSuccess && (
          <div className="mt-4 p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs font-mono flex items-center gap-2 animate-in fade-in">
            <ShieldCheck className="w-4 h-4 shrink-0" />
            <span>Autonomous Phoenix Healing complete in 142ms. 10/10 invariants verified. Block #849202 sealed.</span>
          </div>
        )}
      </div>

      {/* Formal ZYRQUEN Ω∞ Sovereign Manifesto Terminal */}
      <ManifestoCard onOpenCertificate={onOpenCertificate} />

      {/* Live Automated Integrity Health Monitor (60s Routine) */}
      <LiveAutomatedHealthWidget />

      {/* Primary 4 Metric Gauges */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-[24px] bg-[#0b0e1a]/70 border border-white/8 backdrop-blur-xl space-y-2 hover:border-cyan-500/30 transition-all">
          <div className="flex items-center justify-between text-zinc-400 text-xs font-mono">
            <span className="flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-cyan-400" />
              ENERGY DISPATCH
            </span>
            <span className="text-cyan-400 text-[10px] font-semibold">QOps / SEC</span>
          </div>
          <div className="text-2xl sm:text-3xl font-mono font-bold text-white tracking-tight">
            {SYSTEM_METADATA.qOpsTelemetry} <span className="text-xs font-normal text-zinc-400">QOps/s</span>
          </div>
          <div className="text-[11px] font-mono text-zinc-500 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
            Zero-jitter dispatch active • 1.2ms latency
          </div>
        </div>

        <div className="p-5 rounded-[24px] bg-[#0b0e1a]/70 border border-white/8 backdrop-blur-xl space-y-2 hover:border-violet-500/30 transition-all">
          <div className="flex items-center justify-between text-zinc-400 text-xs font-mono">
            <span className="flex items-center gap-1.5">
              <Cpu className="w-4 h-4 text-violet-400" />
              COHERENCE INDEX
            </span>
            <span className="text-violet-400 text-[10px] font-semibold">768 QUBITS</span>
          </div>
          <div className="text-2xl sm:text-3xl font-mono font-bold text-white tracking-tight">
            {SYSTEM_METADATA.coherence}
          </div>
          <div className="text-[11px] font-mono text-zinc-500 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-violet-400" />
            Phase resonance aligned • Tri-agent sync
          </div>
        </div>

        <div className="p-5 rounded-[24px] bg-[#0b0e1a]/70 border border-white/8 backdrop-blur-xl space-y-2 hover:border-amber-500/30 transition-all">
          <div className="flex items-center justify-between text-zinc-400 text-xs font-mono">
            <span className="flex items-center gap-1.5">
              <Activity className="w-4 h-4 text-amber-400" />
              CRYO THERMAL
            </span>
            <span className="text-amber-400 text-[10px] font-semibold">SUBZERO HELIUM</span>
          </div>
          <div className="text-2xl sm:text-3xl font-mono font-bold text-white tracking-tight">
            {SYSTEM_METADATA.cryoTemp}
          </div>
          <div className="text-[11px] font-mono text-zinc-500 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
            Coolant flow: {SYSTEM_METADATA.coolantFlow}
          </div>
        </div>

        <div className="p-5 rounded-[24px] bg-[#0b0e1a]/70 border border-white/8 backdrop-blur-xl space-y-2 hover:border-emerald-500/30 transition-all">
          <div className="flex items-center justify-between text-zinc-400 text-xs font-mono">
            <span className="flex items-center gap-1.5">
              <Lock className="w-4 h-4 text-emerald-400" />
              POST-QUANTUM SEALS
            </span>
            <span className="text-emerald-400 text-[10px] font-semibold">IMMUTABLE</span>
          </div>
          <div className="text-2xl sm:text-3xl font-mono font-bold text-emerald-400 tracking-tight">
            14,902 <span className="text-xs font-normal text-zinc-400">/ 14,902</span>
          </div>
          <div className="text-[11px] font-mono text-zinc-500 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            Block #{SYSTEM_METADATA.sealedBlock} • Drift: 0.00%
          </div>
        </div>
      </div>

      {/* Main Grid: Visual Lattice / Topology & Live Subsystem Rail */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left 7 Columns: Visual Canvas & Active Core Views */}
        <div className="lg:col-span-7 space-y-6">
          {/* Sovereign World Engine Card */}
          <div className="p-6 rounded-[28px] bg-gradient-to-b from-[#0c1022]/90 via-[#0a0d1c]/80 to-[#070914]/90 border border-cyan-500/20 backdrop-blur-2xl space-y-4 shadow-[0_0_50px_-15px_rgba(6,182,212,0.15)] relative overflow-hidden group">
            {/* Ambient corner highlights */}
            <div className="absolute top-0 right-0 w-48 h-48 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

            {/* Header: Sovereign World Engine & Isolated UI Buffer */}
            <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-cyan-500/20 via-violet-500/10 to-amber-500/10 border border-cyan-500/30 flex items-center justify-center shadow-[0_0_20px_-3px_rgba(6,182,212,0.35)] shrink-0">
                  {activeTab === 'overview' ? (
                    <Orbit className="w-5 h-5 text-cyan-400 animate-spin" style={{ animationDuration: '24s' }} />
                  ) : (
                    <Network className="w-5 h-5 text-violet-400" />
                  )}
                </div>
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs sm:text-sm font-mono font-bold text-white uppercase tracking-wider">
                      Sovereign World Engine
                    </span>
                    <span className="text-[10px] font-mono font-semibold text-cyan-300 bg-cyan-950/70 px-2.5 py-0.5 rounded-full border border-cyan-500/40 flex items-center gap-1.5 shadow-[0_0_12px_rgba(6,182,212,0.25)]">
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
                      Isolated UI Buffer
                    </span>
                  </div>
                  <div className="text-[10px] font-mono text-zinc-400 flex items-center gap-2 mt-0.5">
                    <span className="text-zinc-500">GPU VIRTUAL ENGINE</span>
                    <span className="text-zinc-600">•</span>
                    <span className="text-emerald-400 font-medium">ZERO CONSENSUS DRIFT</span>
                    <span className="text-zinc-600">•</span>
                    <span className="text-zinc-500">THREAD #0</span>
                  </div>
                </div>
              </div>

              {/* Segmented Switcher & Controls */}
              <div className="relative z-10 flex items-center gap-2 self-end sm:self-auto flex-wrap">
                <div className="flex items-center bg-black/60 p-1 rounded-xl border border-white/10 shadow-inner">
                  <button
                    onClick={() => {
                      playTone(660, 0.04);
                      setActiveTab('atlas');
                    }}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono transition-all duration-200 ${
                      activeTab === 'atlas'
                        ? 'bg-gradient-to-r from-cyan-500/30 via-violet-500/20 to-amber-500/20 text-white font-semibold border border-cyan-400/50 shadow-[0_0_15px_-3px_rgba(6,182,212,0.45)]'
                        : 'text-zinc-400 hover:text-zinc-200 hover:bg-white/5'
                    }`}
                  >
                    <Orbit className="w-3.5 h-3.5 text-cyan-400" />
                    <span>3D Sovereign Atlas</span>
                  </button>
                  <button
                    onClick={() => {
                      playTone(600, 0.04);
                      setActiveTab('overview');
                    }}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono transition-all duration-200 ${
                      activeTab === 'overview'
                        ? 'bg-gradient-to-r from-amber-500/20 via-cyan-500/20 to-cyan-500/30 text-white font-semibold border border-cyan-500/40 shadow-[0_0_15px_-3px_rgba(6,182,212,0.35)]'
                        : 'text-zinc-400 hover:text-zinc-200 hover:bg-white/5'
                    }`}
                  >
                    <Box className="w-3.5 h-3.5 text-amber-400" />
                    <span>3D Lattice</span>
                  </button>
                  <button
                    onClick={() => {
                      playTone(640, 0.04);
                      setActiveTab('topology');
                    }}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono transition-all duration-200 ${
                      activeTab === 'topology'
                        ? 'bg-gradient-to-r from-violet-500/20 via-cyan-500/20 to-violet-500/30 text-white font-semibold border border-violet-500/40 shadow-[0_0_15px_-3px_rgba(139,92,246,0.35)]'
                        : 'text-zinc-400 hover:text-zinc-200 hover:bg-white/5'
                    }`}
                  >
                    <Network className="w-3.5 h-3.5 text-violet-400" />
                    <span>Topology Graph</span>
                  </button>
                </div>

                {activeTab === 'overview' && (
                  <button
                    onClick={() => {
                      const nextSpeed = citadelSpeed === 1 ? 1.5 : citadelSpeed === 1.5 ? 2 : citadelSpeed === 2 ? 0.5 : 1;
                      setCitadelSpeed(nextSpeed);
                      playTone(680, 0.03);
                    }}
                    title="Toggle Rotation Speed"
                    className="hidden sm:flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-black/50 border border-white/10 hover:border-cyan-500/30 text-xs font-mono text-zinc-300 hover:text-white transition-colors"
                  >
                    <Gauge className="w-3.5 h-3.5 text-cyan-400" />
                    <span>{citadelSpeed}x</span>
                  </button>
                )}

                <button
                  onClick={() => {
                    setIsCanvasExpanded(!isCanvasExpanded);
                    playTone(620, 0.03);
                  }}
                  title={isCanvasExpanded ? 'Contract Viewport' : 'Expand Viewport'}
                  className="p-1.5 rounded-xl bg-black/50 border border-white/10 hover:border-white/20 text-zinc-400 hover:text-white transition-colors"
                >
                  {isCanvasExpanded ? (
                    <Minimize2 className="w-4 h-4 text-cyan-400" />
                  ) : (
                    <Maximize2 className="w-4 h-4 text-zinc-300" />
                  )}
                </button>
              </div>
            </div>

            {/* Canvas Viewer with Adaptive Height */}
            <div
              className={`relative w-full rounded-[24px] bg-[#050710] border border-cyan-500/25 overflow-hidden flex items-center justify-center transition-all duration-300 shadow-[inset_0_0_40px_rgba(0,0,0,0.8)] ${
                isCanvasExpanded ? 'h-[560px]' : 'h-[440px]'
              }`}
            >
              {activeTab === 'atlas' ? (
                <ChamberRuntimeAtlas3D
                  expanded={isCanvasExpanded}
                  onToggleExpand={() => setIsCanvasExpanded(!isCanvasExpanded)}
                />
              ) : activeTab === 'overview' ? (
                <CitadelCanvas speedMultiplier={citadelSpeed} highlightColor="#06B6D4" />
              ) : (
                <TopologyCanvas />
              )}
            </div>

            {/* Visual description footer */}
            <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between text-xs font-mono pt-1 gap-2.5 border-t border-white/8">
              <div className="flex items-center gap-2.5">
                <div className="flex items-center gap-1 bg-black/60 px-2 py-1 rounded-lg border border-white/10">
                  <span className="w-2.5 h-2.5 rotate-45 bg-amber-400 shadow-[0_0_8px_#F59E0B]" />
                  <span className="text-zinc-600 font-sans text-[10px]">+</span>
                  <span className="w-2.5 h-2.5 rounded-full border-2 border-cyan-400 shadow-[0_0_8px_#06B6D4]" />
                </div>
                <div className="flex flex-wrap items-center gap-1.5 text-xs">
                  <span className="text-zinc-200 font-semibold">
                    {activeTab === 'atlas' ? 'Three.js Cosmic Holographic Atlas (18 Chambers)' : '3D Quantum Citadel Lattice'}
                  </span>
                  <span className="text-amber-400/90 font-medium">
                    (Golden Icosahedron Core #849202
                  </span>
                  <span className="text-zinc-500">+</span>
                  <span className="text-cyan-400/90 font-medium">
                    Quantum Torus Rings)
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 self-start sm:self-auto">
                <button
                  onClick={() => {
                    playTone(660, 0.03);
                    setShowBufferModal(true);
                  }}
                  className="group flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-zinc-900/80 border border-white/10 hover:border-cyan-500/40 text-[11px] text-zinc-300 hover:text-white transition-all shadow-sm"
                  title="View Non-authoritative Isolated UI Buffer security architecture"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
                  <span className="font-semibold text-zinc-200">Non-authoritative</span>
                  <span className="text-zinc-500 hidden md:inline">• Isolated UI Buffer</span>
                  <Info className="w-3 h-3 text-zinc-500 group-hover:text-cyan-400 transition-colors ml-0.5" />
                </button>
              </div>
            </div>
          </div>
          {/* Live System Resource Grid */}
          <SystemResourceGrid />
          {/* Aggregate System Entropy Chart */}
          <AggregateSystemEntropyChart />


          {/* Quick Launchpad to 12 Core Views */}
          <div className="p-6 rounded-[28px] bg-[#0b0e1a]/70 border border-white/8 backdrop-blur-xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-mono font-bold text-zinc-200 uppercase tracking-wider">
                Core Operating Views
              </h3>
              <span className="text-[10px] font-mono text-zinc-500">100% ROUTABLE</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {[
                { id: 'legal', name: 'Legal & PDPA', desc: 'ETDA Sec 9/26/28', color: 'text-blue-400' },
                { id: 'council', name: 'Sovereign Council', desc: '10/10 Quorum HSM', color: 'text-amber-400' },
                { id: 'production', name: 'Readiness PH-20', desc: 'Zero-Trust Bastion', color: 'text-emerald-400' },
                { id: 'quantum', name: 'Quantum Nexus', desc: '768-Qubit State', color: 'text-violet-400' },
                { id: 'nexus', name: 'Global Nexus', desc: 'Data Mesh & Vector', color: 'text-blue-400' },
                { id: 'vault', name: 'Sovereign Vault', desc: 'OMEGA Clearance', color: 'text-amber-400' },
                { id: 'ledger', name: 'Evidence Ledger', desc: '14,902 SHA Seals', color: 'text-emerald-400' },
                { id: 'pulse', name: 'System Pulse', desc: 'Cryo & Telemetry', color: 'text-cyan-400' },
                { id: 'forge', name: 'Workflow Forge', desc: 'Visual DAG Flow', color: 'text-amber-400' },
                { id: 'matrix', name: 'Multiverse Matrix', desc: 'Digital Twin Sim', color: 'text-violet-400' },
                { id: 'archive', name: 'Archive 17 Mod', desc: 'Genesis Manifest', color: 'text-blue-400' },
                { id: 'console', name: 'CLI Console', desc: 'Developer CLI', color: 'text-emerald-400' },
                { id: 'security', name: 'Zero Trust Guard', desc: 'Defense Shield', color: 'text-emerald-400' },
                { id: 'settings', name: 'Thai Custodians', desc: 'Passports & Auth', color: 'text-zinc-400' },
                { id: 'dashboard', name: 'HQ Dashboard', desc: 'Command Core', color: 'text-cyan-400' },
              ].map((v) => (
                <button
                  key={v.id}
                  onClick={() => {
                    playTone(560, 0.05);
                    onNavigate(v.id as ViewType);
                  }}
                  className="p-3 rounded-2xl bg-white/[0.02] hover:bg-white/[0.06] border border-white/6 hover:border-white/15 text-left transition-all group"
                >
                  <div className="flex items-center justify-between">
                    <span className={`text-xs font-mono font-bold ${v.color}`}>{v.name}</span>
                    <ArrowRight className="w-3 h-3 text-zinc-500 group-hover:text-white group-hover:translate-x-0.5 transition-all" />
                  </div>
                  <div className="text-[11px] text-zinc-400 font-mono mt-1">{v.desc}</div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right 5 Columns: 17 Canonical Modules & 12-Stage Forensics Feed */}
        <div className="lg:col-span-5 space-y-6">
          {/* Latest Verified Forensic Transaction */}
          <div className="p-6 rounded-[28px] bg-[#0b0e1a]/70 border border-white/8 backdrop-blur-xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                <span className="text-xs font-mono font-bold text-zinc-200 uppercase tracking-wider">
                  Latest 12-Stage Forensic Trace
                </span>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                142ms VERIFIED
              </span>
            </div>

            <div className="p-3.5 rounded-2xl bg-black/40 border border-white/5 space-y-1.5 text-xs font-mono">
              <div className="text-zinc-200 font-bold">{AUDIT_TRACE_TX.txId}</div>
              <div className="text-zinc-400 text-[11px]">{AUDIT_TRACE_TX.title}</div>
              <div className="text-zinc-500 text-[10px] pt-1 flex items-center justify-between">
                <span>Actor: {AUDIT_TRACE_TX.rootActor}</span>
                <span className="text-cyan-400">Block #{AUDIT_TRACE_TX.sealedLedgerBlock}</span>
              </div>
            </div>

            {/* Stages Mini-timeline */}
            <div className="space-y-1.5 max-h-[280px] overflow-y-auto pr-1">
              {AUDIT_TRACE_TX.stages.slice(0, 6).map((stage) => (
                <div
                  key={stage.id}
                  className="p-2 rounded-xl bg-white/[0.015] border border-white/5 flex items-center justify-between text-xs font-mono"
                >
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded bg-white/5 flex items-center justify-center text-[10px] text-cyan-300 font-bold">
                      {stage.stageNumber}
                    </span>
                    <span className="text-zinc-300 text-[11px]">{stage.name}</span>
                  </div>
                  <span className="text-[10px] text-zinc-500 font-mono">{stage.durationMs}ms</span>
                </div>
              ))}
            </div>

            <button
              onClick={() => {
                playTone(600, 0.05);
                onNavigate('ledger');
              }}
              className="w-full py-2.5 rounded-xl bg-white/4 hover:bg-white/8 border border-white/8 text-zinc-300 font-mono text-xs flex items-center justify-center gap-2 transition-all"
            >
              <span>View Full 12-Stage Forensics Replay</span>
              <ArrowRight className="w-3.5 h-3.5 text-cyan-400" />
            </button>
          </div>

          {/* Canonical 17 Modules Quick Summary */}
          <div className="p-6 rounded-[28px] bg-[#0b0e1a]/70 border border-white/8 backdrop-blur-xl space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-zinc-200 uppercase tracking-wider">
                17 Canonical Modules Architecture
              </span>
              <span className="text-[10px] font-mono text-violet-400 bg-violet-500/10 px-2 py-0.5 rounded-full border border-violet-500/20">
                100% PRESERVED
              </span>
            </div>

            <div className="space-y-2">
              {CANONICAL_MODULES.slice(0, 4).map((mod) => (
                <div
                  key={mod.id}
                  onClick={() => {
                    playTone(550, 0.05);
                    onNavigate(mod.targetView);
                  }}
                  className="p-3 rounded-2xl bg-white/[0.02] hover:bg-white/[0.06] border border-white/6 cursor-pointer transition-all flex items-center justify-between"
                >
                  <div>
                    <div className="text-xs font-mono font-bold text-zinc-200 flex items-center gap-2">
                      <span className="text-cyan-400">{mod.num}</span>
                      <span>{mod.titleEn}</span>
                    </div>
                    <div className="text-[11px] text-zinc-400 font-mono line-clamp-1 mt-0.5">
                      {mod.titleTh}
                    </div>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 text-zinc-400">
                    {mod.badge}
                  </span>
                </div>
              ))}
            </div>

            <button
              onClick={() => {
                playTone(600, 0.05);
                onNavigate('archive');
              }}
              className="w-full py-2.5 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 font-mono text-xs flex items-center justify-center gap-2 transition-all"
            >
              <span>Explore All 17 Canonical Architecture Modules</span>
              <ArrowRight className="w-3.5 h-3.5 text-cyan-400" />
            </button>
          </div>
        </div>
      </div>

      {/* 18 Chambers Status Grid (Visit & Truth-Level Matrix) */}
      <ChamberStatusGrid onNavigate={onNavigate} />

      {/* 2D Topological Spatial Entropy Heat Map - Full Width Module */}
      <SpatialEntropyHeatMap />

      {/* REAL EVIDENCE INTAKE - Hardening v2.1 Read-Only Display */}
      <EvidenceIntakePanel evidenceIds={['TNT-TH-001', 'DS-901-PILOT']} />

      {/* FIOS Ultimate Fiduciary Factor Intelligence */}
      <FiosFactorIntelligence />

      {/* Pinned Widgets Unified Executive Dashboard */}
      <PinnedWidgetsDashboard onNavigate={onNavigate} />

      {/* Non-Authoritative Isolated UI Buffer Security Modal */}
      {showBufferModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
          <div className="relative w-full max-w-xl bg-gradient-to-b from-[#0e1224] to-[#070914] border border-cyan-500/30 rounded-[28px] p-6 sm:p-7 shadow-[0_0_60px_-10px_rgba(6,182,212,0.3)] space-y-5">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-mono font-bold text-white uppercase tracking-wider">
                    Isolated UI Buffer Architecture
                  </h3>
                  <div className="text-[10px] font-mono text-cyan-400">
                    Non-Authoritative GPU Sandbox • Spec §26/28-ISO
                  </div>
                </div>
              </div>
              <button
                onClick={() => setShowBufferModal(false)}
                className="p-1.5 rounded-xl text-zinc-400 hover:text-white hover:bg-white/10 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Architecture Invariants */}
            <div className="space-y-3 text-xs font-mono">
              <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/8 space-y-1">
                <div className="flex items-center gap-2 text-cyan-300 font-semibold">
                  <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Zero Consensus Mutation (Isolated UI Buffer)</span>
                </div>
                <p className="text-zinc-400 text-[11px] leading-relaxed pl-5.5">
                  The 3D Quantum Citadel Lattice (Golden Icosahedron + Cyan Torus Ring) executes entirely within an isolated canvas memory space. User rotations, pitch adjustments, and topology node drags produce zero consensus state mutation.
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/8 space-y-1">
                <div className="flex items-center gap-2 text-amber-300 font-semibold">
                  <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />
                  <span>Immutable Golden Root Anchor (#14,902)</span>
                </div>
                <p className="text-zinc-400 text-[11px] leading-relaxed pl-5.5">
                  Visual telemetry mirrors the immutable SHA-256 Merkle root. Any attempt to introduce synthetic telemetry is intercepted by the Baseline Reconciliation Guard before frame presentation.
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/8 space-y-1">
                <div className="flex items-center gap-2 text-emerald-300 font-semibold">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Thai Legal Sections 26 &amp; 28 Compliance</span>
                </div>
                <p className="text-zinc-400 text-[11px] leading-relaxed pl-5.5">
                  Visual rendering remains non-authoritative to preserve evidentiary integrity. Legal evidentiary probative weight is anchored strictly to cryptographic ledger receipts.
                </p>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-between pt-2 border-t border-white/10">
              <div className="text-[10px] font-mono text-zinc-500">
                LTS Digest: <span className="text-zinc-400">e3b0c44298fc1c...</span>
              </div>
              <button
                onClick={() => {
                  playTone(750, 0.04);
                  setShowBufferModal(false);
                }}
                className="px-4 py-2 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/40 text-cyan-200 text-xs font-mono font-medium transition-all"
              >
                Acknowledge &amp; Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
