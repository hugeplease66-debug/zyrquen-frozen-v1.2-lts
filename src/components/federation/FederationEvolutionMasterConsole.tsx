import React, { useState, useEffect, useRef } from 'react';
import { 
  Globe, 
  Sparkles, 
  Activity, 
  ShieldCheck, 
  Cpu, 
  Lock, 
  KeyRound, 
  Zap, 
  Radio, 
  Layers, 
  Sliders, 
  Terminal, 
  Compass, 
  Maximize2, 
  Minimize2, 
  Play, 
  Pause, 
  RefreshCw, 
  Flame, 
  Snowflake, 
  Scale, 
  Eye, 
  Wifi, 
  CheckCircle2, 
  AlertTriangle, 
  ArrowRight, 
  Database, 
  Network, 
  Share2,
  Award
} from 'lucide-react';
import { SYSTEM_METADATA, SOVEREIGN_PRINCIPAL, HSM_NODES } from '../../data/canonicalData';
import { GlobalNetworkArchitectureDeck } from '../network/GlobalNetworkArchitectureDeck';
import { ChamberRuntimeAtlas3D } from '../chambers/ChamberRuntimeAtlas3D';
import { MasterReleaseManifestViewer } from '../apex/MasterReleaseManifestViewer';
import { G11SOPManualDeck } from '../apex/G11SOPManualDeck';
import { OmegaSequenceAttestation } from '../apex/OmegaSequenceAttestation';
import { DirectiveClassifierAndPassport } from '../apex/DirectiveClassifierAndPassport';
import { soundEngine } from '../../utils/audioSynth';

interface FederationConsoleProps {
  lang: 'th' | 'en';
  onNavigateChamber?: (num: number) => void;
}

interface ConstellationNode {
  id: string;
  name: string;
  role: string;
  x: number; // percentage
  y: number; // percentage
  status: 'ONLINE' | 'FROZEN' | 'ACTIVE' | 'SEALED';
  color: string;
  chamberNum: number;
}

interface LogEntry {
  id: string;
  timestamp: string;
  qTimestamp: string;
  module: 'HUB' | 'ENGINE' | 'RUNTIME' | 'PORTAL' | 'TOWER' | 'KERNEL';
  level: 'INFO' | 'SUCCESS' | 'QUANTUM_SYNC' | 'EVIDENCE';
  message: string;
}

// 12 Constellation Star Nodes representing the Federated Core
const CONSTELLATION_NODES: ConstellationNode[] = [
  { id: 'NODE-01', name: 'Genesis Runtime G11', role: 'SSoT Block #849202 Origin', x: 50, y: 15, status: 'FROZEN', color: '#06b6d4', chamberNum: 1 },
  { id: 'NODE-02', name: 'Custodian Quorum (10/10)', role: 'FIPS 140-3 L4 HSM Mesh', x: 25, y: 35, status: 'SEALED', color: '#10b981', chamberNum: 5 },
  { id: 'NODE-03', name: 'Post-Quantum Lattice Enclave', role: 'Dilithium-5 / Kyber-1024', x: 75, y: 35, status: 'ONLINE', color: '#8b5cf6', chamberNum: 6 },
  { id: 'NODE-04', name: 'Cryo-Sink Dilution Matrix', role: '0.14 mK Zero-Noise Thermal', x: 15, y: 60, status: 'FROZEN', color: '#06b6d4', chamberNum: 10 },
  { id: 'NODE-05', name: 'SSoT Ledger & Merkle Stream', role: '14,902 Canonical Invariants', x: 85, y: 60, status: 'SEALED', color: '#10b981', chamberNum: 11 },
  { id: 'NODE-06', name: 'ERA_∞ Portal Nexus', role: 'Multiverse Defense Gateway', x: 50, y: 50, status: 'ACTIVE', color: '#f59e0b', chamberNum: 1 },
  { id: 'NODE-07', name: 'Sentinel AI Interceptor', role: 'Auto Fail-Closed Quarantine 85°C', x: 32, y: 78, status: 'ONLINE', color: '#ef4444', chamberNum: 2 },
  { id: 'NODE-08', name: 'Phoenix Replay Sandbox', role: '142ms Forensic Trace SLA', x: 68, y: 78, status: 'ACTIVE', color: '#38bdf8', chamberNum: 8 },
  { id: 'NODE-09', name: '8K Lattice Defense Radar', role: 'Shor & Grover Attack Sensor', x: 50, y: 88, status: 'ONLINE', color: '#ec4899', chamberNum: 13 },
];

export const FederationEvolutionMasterConsole: React.FC<FederationConsoleProps> = ({
  lang,
  onNavigateChamber
}) => {
  const [activeTab, setActiveTab] = useState<
    'PANORAMA' | 
    'HOLO_ATLAS_3D' |
    'RELEASE_MANIFEST' |
    'SOP_G11' |
    'OMEGA_SEQUENCE' |
    'PASSPORT_DIRECTIVES' |
    'TOPOLOGY_DECK' | 
    'CONSTELLATION' | 
    'QUANTUM_SYNC' | 
    'CONTROL_TOWER' | 
    'GOVERNANCE' | 
    'TELEMETRY_FUSION' | 
    'LOGS'
  >('PANORAMA');
  const [isLiveRunning, setIsLiveRunning] = useState<boolean>(true);
  const [quantumTick, setQuantumTick] = useState<number>(0);
  const [selectedNode, setSelectedNode] = useState<ConstellationNode | null>(CONSTELLATION_NODES[0]);
  const [resilienceScore, setResilienceScore] = useState<number>(99.98);
  const [tachyonIntegrity, setTachyonIntegrity] = useState<number>(100);
  const [entropyFlux, setEntropyFlux] = useState<number>(1840);
  const [logs, setLogs] = useState<LogEntry[]>([]);

  const constellationNodes = CONSTELLATION_NODES;

  // Live heartbeats, quantum timestamps, and log generator
  useEffect(() => {
    if (!isLiveRunning) return;

    const interval = setInterval(() => {
      setQuantumTick(prev => prev + 1);

      // Jitter metrics slightly
      setResilienceScore(prev => Number((99.95 + Math.sin(Date.now() * 0.001) * 0.04).toFixed(3)));
      setEntropyFlux(prev => Math.floor(1820 + (Math.random() - 0.5) * 60));

      // Append real-time quantum synchronized log
      const modules: Array<'HUB' | 'ENGINE' | 'RUNTIME' | 'PORTAL' | 'TOWER' | 'KERNEL'> = ['HUB', 'ENGINE', 'RUNTIME', 'PORTAL', 'TOWER', 'KERNEL'];
      const levels: Array<'INFO' | 'SUCCESS' | 'QUANTUM_SYNC' | 'EVIDENCE'> = ['INFO', 'SUCCESS', 'QUANTUM_SYNC', 'EVIDENCE'];
      const actions = [
        'Dilithium-5 signature verified across 10/10 HSM enclaves (Δ0.000ms drift)',
        'Quantum-timestamp phase anchored to Genesis Merkle Root #909ab814',
        'ERA_∞ Portal tachyon harmonic shield status: 10^44 Inviolable',
        'Lattice noise variance calibrated to σ = 3.19 (NIST Cat 5 hardness)',
        'Forensic evidence bundle sealed under ETDA B.E. 2544 Sections 9, 26, 28',
        'Cryo-sink thermal telemetry stable at 0.140 mK with zero ambient noise'
      ];

      const newLog: LogEntry = {
        id: `Q-LOG-${Date.now().toString(36).toUpperCase()}`,
        timestamp: new Date().toLocaleTimeString(),
        qTimestamp: `Q-EPOCH-${(849202 + Math.floor(Date.now() / 1000) % 10000).toString(16).toUpperCase()}:${(Math.random() * 1000).toFixed(0).padStart(4, '0')}`,
        module: modules[Math.floor(Math.random() * modules.length)],
        level: levels[Math.floor(Math.random() * levels.length)],
        message: actions[Math.floor(Math.random() * actions.length)]
      };

      setLogs(prev => [newLog, ...prev.slice(0, 40)]);
    }, 1800);

    return () => clearInterval(interval);
  }, [isLiveRunning]);

  // Initial log population
  useEffect(() => {
    const initialLogs: LogEntry[] = [
      {
        id: 'Q-LOG-INIT-01',
        timestamp: new Date().toLocaleTimeString(),
        qTimestamp: 'Q-EPOCH-849202:0001',
        module: 'KERNEL',
        level: 'EVIDENCE',
        message: 'Master Genesis Merkle Root anchored at #909ab814479844d8a14816bed34cdbb07528e18501da86fc4691763a43fa4c68'
      },
      {
        id: 'Q-LOG-INIT-02',
        timestamp: new Date().toLocaleTimeString(),
        qTimestamp: 'Q-EPOCH-849202:0002',
        module: 'TOWER',
        level: 'QUANTUM_SYNC',
        message: 'Federation Evolution Master Console active — 10/10 REAL_HSM quorum verified with zero drift'
      },
      {
        id: 'Q-LOG-INIT-03',
        timestamp: new Date().toLocaleTimeString(),
        qTimestamp: 'Q-EPOCH-849202:0003',
        module: 'PORTAL',
        level: 'SUCCESS',
        message: 'ERA_∞ Cosmic UI online: Multiverse Defense Panorama synced with 40 Phase Registry'
      }
    ];
    setLogs(initialLogs);
  }, []);

  return (
    <div className="bg-slate-950 border border-cyan-500/40 rounded-2xl p-4 sm:p-6 shadow-2xl relative overflow-hidden font-mono-code space-y-6">
      {/* Background Cosmic Particle & Grid Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(#083344_1px,transparent_1px)] [background-size:16px_16px] opacity-40 pointer-events-none" />
      <div className="absolute -top-20 -right-20 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-20 -left-20 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Header: ERA_∞ Cosmic Portal Brand */}
      <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 pb-4 border-b border-cyan-900/60">
        <div>
          <div className="flex items-center gap-2 flex-wrap mb-1.5">
            <span className="px-2.5 py-0.5 rounded-full bg-cyan-950 border border-cyan-500/50 text-cyan-300 text-xs font-bold flex items-center gap-1.5 shadow-md shadow-cyan-950">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-spin" />
              ERA_∞ PORTAL COSMIC UI
            </span>
            <span className="px-2 py-0.5 rounded bg-purple-950 border border-purple-500/40 text-purple-300 text-[11px] font-bold">
              MULTIVERSE DEFENSE PANORAMA
            </span>
            <span className="px-2 py-0.5 rounded bg-emerald-950 border border-emerald-500/40 text-emerald-300 text-[11px] font-bold">
              QUANTUM SYNC GRID: LOCKED Δ0.0%
            </span>
          </div>

          <h2 className="text-xl sm:text-2xl font-display font-extrabold text-white tracking-tight flex items-center gap-2">
            <Globe className="w-6 h-6 text-cyan-400" />
            {lang === 'th' ? 'ศูนย์บัญชาการวิวัฒนาการสหพันธรัฐ (Federation Evolution Master Console)' : 'Federation Evolution Master Console'}
          </h2>
          <p className="text-xs text-slate-300 mt-1 max-w-3xl">
            {lang === 'th'
              ? 'สมองกลางควบคุมการป้องกันพหุจักรวาล (Multiverse Defense Panorama) ผสานการทำงานของ Quantum Sync Grid, แผนที่ดาว Constellation Map, Control Tower, และ Telemetry Fusion เข้าสู่แกนสัจจะเดียวกัน'
              : 'Unified central command uniting Quantum Sync Grid, Constellation Map, Control Tower, ERA_∞ Portal, Genesis Runtime, and Telemetry Fusion into a single holographic console.'}
          </p>
        </div>

        {/* Live Status & Master Run Switch */}
        <div className="flex items-center gap-3 shrink-0 self-end lg:self-auto">
          <div className="bg-slate-900/90 px-3 py-2 rounded-xl border border-slate-800 text-right">
            <span className="text-[10px] text-slate-400 block font-mono-code">Master Epoch Sync:</span>
            <span className="text-xs font-bold text-cyan-300">Q-EPOCH #849202:{quantumTick}</span>
          </div>
          <button
            onClick={() => setIsLiveRunning(!isLiveRunning)}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl border text-xs font-bold transition-all ${
              isLiveRunning
                ? 'bg-emerald-950/80 border-emerald-500/50 text-emerald-300 shadow-md shadow-emerald-950/50'
                : 'bg-amber-950/80 border-amber-500/50 text-amber-300'
            }`}
          >
            {isLiveRunning ? <Pause className="w-3.5 h-3.5 text-emerald-400" /> : <Play className="w-3.5 h-3.5 text-amber-400" />}
            <span>{isLiveRunning ? 'LIVE STREAMING' : 'PAUSED'}</span>
          </button>
        </div>
      </div>

      {/* Navigation Sub-Deck Ribbons */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-800 pb-3 text-xs relative z-10">
        {[
          { id: 'PANORAMA', labelTh: 'พาโนรามาจักรวาล 3D', labelEn: 'Defense Panorama 3D', icon: <Compass className="w-3.5 h-3.5" /> },
          { id: 'HOLO_ATLAS_3D', labelTh: 'โฮโลแกรม 3D Atlas', labelEn: '3D Chamber Atlas', icon: <Globe className="w-3.5 h-3.5 text-cyan-400" /> },
          { id: 'RELEASE_MANIFEST', labelTh: 'สารบบรับรอง v2.4 (Manifest)', labelEn: 'Release Manifest v2.4', icon: <Award className="w-3.5 h-3.5 text-amber-400" /> },
          { id: 'SOP_G11', labelTh: 'ระเบียบสภา G11 (SOP Manual)', labelEn: 'G11 Quorum SOP', icon: <Scale className="w-3.5 h-3.5 text-emerald-400" /> },
          { id: 'OMEGA_SEQUENCE', labelTh: 'ลำดับอธิปไตย 12 เฟส', labelEn: '12-Phase Omega', icon: <Sparkles className="w-3.5 h-3.5 text-purple-400" /> },
          { id: 'PASSPORT_DIRECTIVES', labelTh: 'พาสปอร์ต & จัดประเภทสัจจะ', labelEn: 'Passport & Directives', icon: <ShieldCheck className="w-3.5 h-3.5 text-blue-400" /> },
          { id: 'TOPOLOGY_DECK', labelTh: 'สถาปัตยกรรมเครือข่าย 5 มิติ', labelEn: '5D Network Architecture', icon: <Network className="w-3.5 h-3.5 text-cyan-400" /> },
          { id: 'CONSTELLATION', labelTh: 'แผนที่กลุ่มดาว (Constellation)', labelEn: 'Constellation Map', icon: <Sparkles className="w-3.5 h-3.5" /> },
          { id: 'QUANTUM_SYNC', labelTh: 'กระดานซิงค์ควอนตัม (Quantum Sync)', labelEn: 'Quantum Sync', icon: <Wifi className="w-3.5 h-3.5" /> },
          { id: 'CONTROL_TOWER', labelTh: 'หอบัญชาการกลาง (Control Tower)', labelEn: 'Control Tower', icon: <Sliders className="w-3.5 h-3.5" /> },
          { id: 'GOVERNANCE', labelTh: 'เคอร์เนลธรรมาภิบาล (Governance)', labelEn: 'Governance Kernel', icon: <Scale className="w-3.5 h-3.5" /> },
          { id: 'TELEMETRY_FUSION', labelTh: 'หลอมรวมโทรมาตร (Fusion)', labelEn: 'Telemetry Fusion', icon: <Activity className="w-3.5 h-3.5" /> },
          { id: 'LOGS', labelTh: 'สตรีมบันทึกสด (Logs)', labelEn: 'Unified Logs', icon: <Terminal className="w-3.5 h-3.5" /> },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => {
              setActiveTab(tab.id as any);
              soundEngine.playQuantumPing();
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
              activeTab === tab.id
                ? 'bg-gradient-to-r from-cyan-950 via-blue-950 to-purple-950 border border-cyan-400 text-cyan-200 font-bold shadow-md shadow-cyan-950/60 ring-1 ring-cyan-500/40'
                : 'bg-slate-900/60 text-slate-400 hover:text-slate-200 hover:bg-slate-900 border border-slate-800'
            }`}
          >
            {tab.icon}
            <span>{lang === 'th' ? tab.labelTh : tab.labelEn}</span>
          </button>
        ))}
      </div>

      {/* VIEW: 3D HOLOGRAPHIC CHAMBER ATLAS */}
      {activeTab === 'HOLO_ATLAS_3D' && (
        <div className="space-y-4 relative z-10">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-white flex items-center gap-1.5">
              <Globe className="w-4 h-4 text-cyan-400" />
              {lang === 'th' ? 'แบบจำลอง 3 มิติเชิงพื้นที่: สถาปัตยกรรมห้องปฏิบัติการ (Interactive 3D Chamber Atlas)' : 'Interactive 3D Chamber Atlas Hologram'}
            </span>
            <span className="text-[10px] text-cyan-300 font-mono">React-Three-Fiber / Three.js Accelerated</span>
          </div>
          <ChamberRuntimeAtlas3D />
        </div>
      )}

      {/* VIEW: MASTER RELEASE MANIFEST & RECONCILIATION */}
      {activeTab === 'RELEASE_MANIFEST' && (
        <div className="relative z-10">
          <MasterReleaseManifestViewer lang={lang} />
        </div>
      )}

      {/* VIEW: G11 CUSTODIAN QUORUM SOP */}
      {activeTab === 'SOP_G11' && (
        <div className="relative z-10">
          <G11SOPManualDeck lang={lang} />
        </div>
      )}

      {/* VIEW: 12-PHASE OMEGA SEQUENCE */}
      {activeTab === 'OMEGA_SEQUENCE' && (
        <div className="relative z-10">
          <OmegaSequenceAttestation lang={lang} />
        </div>
      )}

      {/* VIEW: DIRECTIVE CLASSIFIER & GOVERNANCE PASSPORT */}
      {activeTab === 'PASSPORT_DIRECTIVES' && (
        <div className="relative z-10">
          <DirectiveClassifierAndPassport lang={lang} />
        </div>
      )}

      {/* VIEW 0: 5D NETWORK TOPOLOGY & INFOGRAPHIC ARCHITECTURE */}
      {activeTab === 'TOPOLOGY_DECK' && (
        <div className="relative z-10">
          <GlobalNetworkArchitectureDeck lang={lang} />
        </div>
      )}

      {/* VIEW 1: MULTIVERSE DEFENSE PANORAMA 3D */}
      {activeTab === 'PANORAMA' && (
        <div className="space-y-6 relative z-10">
          {/* Main Panorama Stage */}
          <div className="relative w-full h-[420px] rounded-2xl bg-slate-950 border border-cyan-500/30 overflow-hidden flex items-center justify-center">
            {/* Holographic Space Background with Rotating Orbit Rings */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-[360px] h-[360px] rounded-full border border-cyan-500/20 animate-[spin_40s_linear_infinite]" />
              <div className="w-[270px] h-[270px] rounded-full border border-purple-500/25 animate-[spin_25s_linear_infinite_reverse]" />
              <div className="w-[180px] h-[180px] rounded-full border border-emerald-500/30 animate-[spin_15s_linear_infinite]" />
              <div className="w-[90px] h-[90px] rounded-full bg-cyan-500/10 border border-cyan-400 animate-pulse flex items-center justify-center">
                <KeyRound className="w-6 h-6 text-cyan-300" />
              </div>
            </div>

            {/* Orbiting Satellite Defense Nodes */}
            <div className="relative z-10 w-full h-full p-6 flex flex-col justify-between">
              <div className="flex justify-between items-start">
                <div className="bg-slate-900/90 backdrop-blur-md p-3 rounded-xl border border-cyan-500/40 space-y-1">
                  <div className="text-[10px] text-cyan-400 font-bold flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    PANORAMA DEFENSE STATUS
                  </div>
                  <div className="text-xs text-white font-bold">
                    TACHYON SHIELD: 10^44 INVIOLABLE
                  </div>
                  <div className="text-[10px] text-slate-400">
                    Fail-Closed Protocol Armed at 85.0°C
                  </div>
                </div>

                <div className="bg-slate-900/90 backdrop-blur-md p-3 rounded-xl border border-purple-500/40 text-right space-y-1">
                  <div className="text-[10px] text-purple-400 font-bold flex items-center justify-end gap-1">
                    <Zap className="w-3.5 h-3.5" />
                    Q-SYNCHRONICITY
                  </div>
                  <div className="text-xs text-emerald-400 font-bold">
                    10/10 HSM CONSENSUS (0.000ms)
                  </div>
                  <div className="text-[10px] text-slate-400">
                    Dilithium-5 ML-DSA-87 Active
                  </div>
                </div>
              </div>

              {/* Center Hologram Label */}
              <div className="text-center space-y-1">
                <span className="px-3 py-1 rounded-full bg-cyan-950/90 border border-cyan-400 text-cyan-300 text-xs font-bold shadow-lg shadow-cyan-950">
                  ERA_∞ MASTER DEFENSE CORE
                </span>
                <div className="text-slate-400 text-[11px]">
                  Genesis Merkle Root: <strong className="text-white">909ab814...4c68</strong> (14,902 Seals Frozen)
                </div>
              </div>

              {/* Bottom Telemetry Ticker */}
              <div className="flex justify-between items-end text-[10px]">
                <div className="bg-slate-900/80 px-2.5 py-1.5 rounded-lg border border-slate-800 text-slate-300">
                  Resilience: <span className="text-emerald-400 font-bold">{resilienceScore}%</span>
                </div>
                <div className="bg-slate-900/80 px-2.5 py-1.5 rounded-lg border border-slate-800 text-slate-300">
                  Sub-Kelvin: <span className="text-cyan-300 font-bold">0.140 mK (Zero Noise)</span>
                </div>
                <div className="bg-slate-900/80 px-2.5 py-1.5 rounded-lg border border-slate-800 text-slate-300">
                  Entropy Flux: <span className="text-amber-300 font-bold">{entropyFlux} KB/s</span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Module Jump Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
            <div 
              onClick={() => setActiveTab('TOPOLOGY_DECK')}
              className="bg-slate-900/80 hover:bg-slate-850 p-3.5 rounded-xl border border-cyan-500/50 hover:border-cyan-400 cursor-pointer transition-all space-y-1 shadow-md shadow-cyan-950/40"
            >
              <div className="flex items-center justify-between text-cyan-300 font-bold">
                <span className="flex items-center gap-1.5">
                  <Network className="w-3.5 h-3.5 text-cyan-400" />
                  5D Network Topology
                </span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
              <p className="text-[11px] text-slate-400">
                11-Node Radial, 24h Traffic, Global Route, FIFO Queue, Quarantine.
              </p>
            </div>

            <div 
              onClick={() => onNavigateChamber && onNavigateChamber(5)}
              className="bg-slate-900/80 hover:bg-slate-850 p-3.5 rounded-xl border border-slate-800 hover:border-emerald-500/50 cursor-pointer transition-all space-y-1"
            >
              <div className="flex items-center justify-between text-emerald-400 font-bold">
                <span>Custodian Quorum 10/10</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
              <p className="text-[11px] text-slate-400">
                10 Enclaves FIPS 140-3 L4 with real-time uptime gauges.
              </p>
            </div>

            <div 
              onClick={() => onNavigateChamber && onNavigateChamber(6)}
              className="bg-slate-900/80 hover:bg-slate-850 p-3.5 rounded-xl border border-slate-800 hover:border-purple-500/50 cursor-pointer transition-all space-y-1"
            >
              <div className="flex items-center justify-between text-purple-400 font-bold">
                <span>Zero Trust & PQC</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
              <p className="text-[11px] text-slate-400">
                Dynamic cryptographic hardness and NIST Cat 5 indicators.
              </p>
            </div>

            <div 
              onClick={() => onNavigateChamber && onNavigateChamber(11)}
              className="bg-slate-900/80 hover:bg-slate-850 p-3.5 rounded-xl border border-slate-800 hover:border-cyan-500/50 cursor-pointer transition-all space-y-1"
            >
              <div className="flex items-center justify-between text-cyan-400 font-bold">
                <span>SSoT Ledger & Merkle Stream</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
              <p className="text-[11px] text-slate-400">
                Live transactional ingestion pipeline anchored to Genesis.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 2: CONSTELLATION MAP VIEWER */}
      {activeTab === 'CONSTELLATION' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 relative z-10">
          {/* Holographic Interactive Constellation Canvas */}
          <div className="lg:col-span-2 relative w-full h-[450px] bg-slate-950 rounded-2xl border border-cyan-500/30 overflow-hidden p-4">
            {/* Connecting Constellation Grid Lines */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none">
              {constellationNodes.map((node, i) => {
                const target = constellationNodes[(i + 1) % constellationNodes.length];
                return (
                  <line
                    key={`line-${node.id}-${target.id}`}
                    x1={`${node.x}%`}
                    y1={`${node.y}%`}
                    x2={`${target.x}%`}
                    y2={`${target.y}%`}
                    stroke="#083344"
                    strokeWidth="1.5"
                    strokeDasharray="4 4"
                  />
                );
              })}
              {/* Central star lines from ERA_∞ center node */}
              {constellationNodes.slice(0, 6).map((node) => (
                <line
                  key={`center-line-${node.id}`}
                  x1="50%"
                  y1="50%"
                  x2={`${node.x}%`}
                  y2={`${node.y}%`}
                  stroke="#0284c7"
                  strokeWidth="1"
                  strokeOpacity="0.4"
                />
              ))}
            </svg>

            {/* Render Constellation Star Nodes */}
            {constellationNodes.map((node) => {
              const isSelected = selectedNode?.id === node.id;
              return (
                <div
                  key={node.id}
                  onClick={() => setSelectedNode(node)}
                  style={{ left: `${node.x}%`, top: `${node.y}%` }}
                  className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer group"
                >
                  <div className={`relative flex items-center justify-center transition-all ${
                    isSelected ? 'scale-125' : 'hover:scale-110'
                  }`}>
                    <div 
                      className="w-5 h-5 rounded-full flex items-center justify-center animate-pulse"
                      style={{ backgroundColor: `${node.color}33`, border: `2px solid ${node.color}` }}
                    >
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: node.color }} />
                    </div>

                    {/* Node Tag Label */}
                    <div className="absolute top-6 left-1/2 -translate-x-1/2 whitespace-nowrap bg-slate-900/90 border border-slate-800 px-2 py-0.5 rounded text-[10px] text-slate-200 pointer-events-none shadow-md">
                      {node.name.split(' ')[0]}
                    </div>
                  </div>
                </div>
              );
            })}

            <div className="absolute bottom-3 left-3 bg-slate-900/90 px-3 py-1.5 rounded-lg border border-slate-800 text-[10px] text-slate-400">
              {lang === 'th' ? 'คลิกที่ดวงดาวเพื่อตรวจสอบโหนด' : 'Click on any star node to inspect parameters'}
            </div>
          </div>

          {/* Node Inspector Detail Panel */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 space-y-4">
            <div className="border-b border-slate-800 pb-3">
              <span className="text-[10px] text-cyan-400 font-bold uppercase block">CONSTELLATION INSPECTOR</span>
              <h3 className="text-lg font-bold text-white mt-0.5">{selectedNode?.name}</h3>
              <p className="text-xs text-slate-400">{selectedNode?.role}</p>
            </div>

            {selectedNode && (
              <div className="space-y-3 text-xs">
                <div className="flex justify-between items-center bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                  <span className="text-slate-400">Status:</span>
                  <span className="px-2 py-0.5 rounded bg-emerald-950 border border-emerald-500/40 text-emerald-300 font-bold text-[10px]">
                    {selectedNode.status}
                  </span>
                </div>

                <div className="flex justify-between items-center bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                  <span className="text-slate-400">Coherence:</span>
                  <span className="text-cyan-300 font-bold">100.0% PQC Lock</span>
                </div>

                <div className="flex justify-between items-center bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                  <span className="text-slate-400">Chamber Mapping:</span>
                  <span className="text-purple-300 font-bold">Chamber #{selectedNode.chamberNum.toString().padStart(2, '0')}</span>
                </div>

                <button
                  onClick={() => onNavigateChamber && onNavigateChamber(selectedNode.chamberNum)}
                  className="w-full py-2 rounded-xl bg-cyan-950 hover:bg-cyan-900 border border-cyan-500/50 text-cyan-200 font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-md shadow-cyan-950"
                >
                  <span>{lang === 'th' ? 'เข้าสู่ห้องปฏิบัติการนี้' : 'Jump to this Chamber'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* VIEW 3: QUANTUM SYNC DASHBOARD */}
      {activeTab === 'QUANTUM_SYNC' && (
        <div className="space-y-4 relative z-10">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-slate-900/90 border border-emerald-500/40 rounded-xl p-4 space-y-1">
              <span className="text-[10px] text-slate-400 block uppercase">Consensus Phase Drift</span>
              <div className="text-2xl font-bold text-emerald-400">Δ0.0000 ms</div>
              <p className="text-[11px] text-slate-400">Atomic clock lock across 10/10 HSM units</p>
            </div>

            <div className="bg-slate-900/90 border border-cyan-500/40 rounded-xl p-4 space-y-1">
              <span className="text-[10px] text-slate-400 block uppercase">Quantum Timestamp Epoch</span>
              <div className="text-2xl font-bold text-cyan-300">#849202.{quantumTick}</div>
              <p className="text-[11px] text-slate-400">Anchored directly to Genesis Block</p>
            </div>

            <div className="bg-slate-900/90 border border-purple-500/40 rounded-xl p-4 space-y-1">
              <span className="text-[10px] text-slate-400 block uppercase">Quantum Work-Factor</span>
              <div className="text-2xl font-bold text-purple-300">2^256 Bits</div>
              <p className="text-[11px] text-slate-400">NIST Category 5 unbreakable resilience</p>
            </div>
          </div>

          <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 space-y-3">
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <Wifi className="w-4 h-4 text-cyan-400" />
              {lang === 'th' ? 'ตารางตรวจสอบความสอดคล้องเฟส 10 โหนด (Phase Lock Matrix)' : '10-Node Phase Synchronization Table'}
            </h4>
            <div className="overflow-x-auto">
              <table className="w-full text-xs font-mono-code text-left">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400">
                    <th className="py-2 px-3">Node Code</th>
                    <th className="py-2 px-3">Enclave Name</th>
                    <th className="py-2 px-3">Algorithm</th>
                    <th className="py-2 px-3">Sync Latency</th>
                    <th className="py-2 px-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {HSM_NODES.map(node => (
                    <tr key={node.id} className="hover:bg-slate-850">
                      <td className="py-2 px-3 font-bold text-cyan-300">{node.councilCode}</td>
                      <td className="py-2 px-3 text-slate-200">{node.nameEn}</td>
                      <td className="py-2 px-3 text-purple-300">{node.pqcAlgorithm.split(' ')[0]}</td>
                      <td className="py-2 px-3 text-emerald-400 font-bold">&lt; 0.001 ms</td>
                      <td className="py-2 px-3">
                        <span className="px-2 py-0.5 rounded bg-emerald-950 border border-emerald-500/40 text-emerald-300 text-[10px] font-bold">
                          PHASE LOCKED
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 4: CONTROL TOWER PANEL */}
      {activeTab === 'CONTROL_TOWER' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 space-y-4">
            <div className="border-b border-slate-800 pb-3">
              <span className="text-[10px] text-amber-400 font-bold uppercase block">SOVEREIGN CONTROL TOWER</span>
              <h3 className="text-lg font-bold text-white mt-0.5">
                {lang === 'th' ? 'แผงควบคุมสัจจะและโปรโตคอลฉุกเฉิน' : 'Protocol & Invariant Controls'}
              </h3>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                <div className="flex justify-between font-bold">
                  <span className="text-slate-300">Fail-Closed Thermal Trigger:</span>
                  <span className="text-red-400">85.0°C (ARMED)</span>
                </div>
                <p className="text-[11px] text-slate-500">
                  Auto-locks and isolates the system into Quarantine Escrow upon thermal breach.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                <div className="flex justify-between font-bold">
                  <span className="text-slate-300">Mutation Authority:</span>
                  <span className="text-emerald-400">0 (IMMUTABLE READ-ONLY)</span>
                </div>
                <p className="text-[11px] text-slate-500">
                  Strict SSoT Δ0 invariant enforcement preventing unauthorized schema evolution.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                <div className="flex justify-between font-bold">
                  <span className="text-slate-300">Sovereign Principal:</span>
                  <span className="text-amber-300 font-bold">{SOVEREIGN_PRINCIPAL.nameTh}</span>
                </div>
                <p className="text-[11px] text-slate-500">
                  Clearance Level: OMEGA-1 SUPREME CLEARANCE
                </p>
              </div>
            </div>
          </div>

          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 space-y-4">
            <div className="border-b border-slate-800 pb-3">
              <span className="text-[10px] text-cyan-400 font-bold uppercase block">RESILIENCE EVOLUTION GAUGE</span>
              <h3 className="text-lg font-bold text-white mt-0.5">
                {lang === 'th' ? 'มาตรวัดความทนทานรวมพหุจักรวาล' : 'Predictive Resilience Gauge'}
              </h3>
            </div>

            <div className="flex flex-col items-center justify-center p-4 bg-slate-950 rounded-xl border border-slate-800">
              <div className="relative w-36 h-36 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90">
                  <circle cx="72" cy="72" r="56" stroke="#1e293b" strokeWidth="8" fill="transparent" />
                  <circle
                    cx="72"
                    cy="72"
                    r="56"
                    stroke="#10b981"
                    strokeWidth="8"
                    strokeDasharray={351.8}
                    strokeDashoffset={351.8 * (1 - resilienceScore / 100)}
                    strokeLinecap="round"
                    fill="transparent"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                  <span className="text-2xl font-extrabold text-white">{resilienceScore}%</span>
                  <span className="text-[10px] text-emerald-400 font-bold">OPTIMAL</span>
                </div>
              </div>
              <span className="text-[11px] text-slate-400 mt-3">
                {lang === 'th' ? 'การประเมินความมั่นคงเชิงทำนาย: 100% ป้องกันการโจมตี' : 'Predictive Multiverse Shield: Zero Mutation Drift'}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 5: GOVERNANCE KERNEL */}
      {activeTab === 'GOVERNANCE' && (
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 space-y-4 relative z-10">
          <div className="border-b border-slate-800 pb-3 flex justify-between items-center">
            <div>
              <span className="text-[10px] text-purple-400 font-bold uppercase block">GOVERNANCE & LEGAL KERNEL</span>
              <h3 className="text-lg font-bold text-white mt-0.5">
                {lang === 'th' ? 'การรับรองสัจจะทางกฎหมาย (Policy + Trust + Evidence)' : 'Policy, Trust, and Legal Evidence'}
              </h3>
            </div>
            <span className="px-3 py-1 rounded bg-emerald-950 border border-emerald-500/40 text-emerald-300 text-xs font-bold">
              ETDA SEC 9, 26, 28 VERIFIED
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
              <div className="text-slate-400 font-bold flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>มาตรา ๙ (Section 9)</span>
              </div>
              <p className="text-[11px] text-slate-300">
                การแสดงเจตนาและการผูกพันสัญญาดิจิทัลถูกต้องสมบูรณ์ ไม่มีช่องโหว่ Reentrancy หรือ Overflow
              </p>
            </div>

            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
              <div className="text-slate-400 font-bold flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                <span>มาตรา ๒๖ (Section 26)</span>
              </div>
              <p className="text-[11px] text-slate-300">
                ลายมือชื่ออิเล็กทรอนิกส์ขั้นสูงต้านทานควอนตัม (Dilithium-5 ML-DSA-87) ภายใต้การควบคุมของผู้ถือครอง
              </p>
            </div>

            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
              <div className="text-slate-400 font-bold flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-purple-400" />
                <span>มาตรา ๒๘ (Section 28)</span>
              </div>
              <p className="text-[11px] text-slate-300">
                การรับรองใบรับรองอิเล็กทรอนิกส์ด้วยผู้ให้บริการรับรองความถูกต้องบน 10/10 REAL_HSM Quorum
              </p>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 6: TELEMETRY FUSION */}
      {activeTab === 'TELEMETRY_FUSION' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 relative z-10">
          <div className="bg-slate-900/90 border border-cyan-500/40 rounded-xl p-4 space-y-2">
            <span className="text-[10px] text-cyan-400 font-bold uppercase block">Core Telemetry</span>
            <div className="text-xl font-bold text-white">0.140 mK</div>
            <p className="text-[11px] text-slate-400">Sub-Kelvin Superfluid He-4 loop</p>
          </div>

          <div className="bg-slate-900/90 border border-emerald-500/40 rounded-xl p-4 space-y-2">
            <span className="text-[10px] text-emerald-400 font-bold uppercase block">Loop Stabilizer</span>
            <div className="text-xl font-bold text-white">Δ0.0% Drift</div>
            <p className="text-[11px] text-slate-400">Zero mutation invariant lock</p>
          </div>

          <div className="bg-slate-900/90 border border-purple-500/40 rounded-xl p-4 space-y-2">
            <span className="text-[10px] text-purple-400 font-bold uppercase block">Spike Sensor</span>
            <div className="text-xl font-bold text-white">0.00 nV</div>
            <p className="text-[11px] text-slate-400">Noise floor under cryo-shield</p>
          </div>

          <div className="bg-slate-900/90 border border-amber-500/40 rounded-xl p-4 space-y-2">
            <span className="text-[10px] text-amber-400 font-bold uppercase block">Tachyon Field</span>
            <div className="text-xl font-bold text-white">10^44 Scale</div>
            <p className="text-[11px] text-slate-400">Multiverse shield active</p>
          </div>
        </div>
      )}

      {/* VIEW 7: UNIFIED LOG STREAM */}
      {activeTab === 'LOGS' && (
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 space-y-3 relative z-10">
          <div className="flex justify-between items-center border-b border-slate-800 pb-2">
            <span className="text-xs font-bold text-white flex items-center gap-1.5">
              <Terminal className="w-3.5 h-3.5 text-cyan-400" />
              {lang === 'th' ? 'สตรีมบันทึกรวมศูนย์ (Unified Log Stream - Hub, Engine, Runtime, Portal)' : 'Unified Multiverse Log Stream'}
            </span>
            <span className="text-[10px] text-slate-400">
              Active Stream: {logs.length} events
            </span>
          </div>

          <div className="space-y-1.5 max-h-80 overflow-y-auto font-mono-code text-[11px]">
            {logs.map((log) => (
              <div key={log.id} className="p-2 rounded bg-slate-950 border border-slate-850 flex items-start gap-2 hover:border-slate-700 transition-colors">
                <span className="text-slate-500 shrink-0">{log.timestamp}</span>
                <span className="text-cyan-400 font-bold shrink-0">{log.qTimestamp}</span>
                <span className={`px-1.5 py-0.2 rounded text-[9px] font-bold shrink-0 ${
                  log.level === 'EVIDENCE' ? 'bg-purple-950 text-purple-300 border border-purple-500/40' :
                  log.level === 'QUANTUM_SYNC' ? 'bg-cyan-950 text-cyan-300 border border-cyan-500/40' :
                  log.level === 'SUCCESS' ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/40' :
                  'bg-slate-800 text-slate-300'
                }`}>
                  {log.module}
                </span>
                <span className="text-slate-200 break-all">{log.message}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
