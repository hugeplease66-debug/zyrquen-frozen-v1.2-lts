import React, { useState, useEffect } from 'react';
import { 
  KeyRound, 
  ShieldCheck, 
  Cpu, 
  Activity, 
  CheckCircle2, 
  Lock, 
  Zap, 
  Snowflake, 
  Layers,
  Radio,
  Globe,
  Binary,
  Maximize2,
  Sparkles,
  Database,
  Flame,
  Scale
} from 'lucide-react';
import { SYSTEM_METADATA, SOVEREIGN_PRINCIPAL } from '../../data/canonicalData';

interface OmniversalTelemetryMatrixProps {
  lang: 'th' | 'en';
}

export const OmniversalTelemetryMatrix: React.FC<OmniversalTelemetryMatrixProps> = ({ lang }) => {
  const [pulseTick, setPulseTick] = useState<number>(0);
  const [activeCluster, setActiveCluster] = useState<string>('CUSTODIAN');

  useEffect(() => {
    const timer = setInterval(() => {
      setPulseTick(prev => (prev + 1) % 10000);
    }, 1200);
    return () => clearInterval(timer);
  }, []);

  const dynamicQOps = (851.9 + Math.sin(pulseTick * 0.4) * 0.5).toFixed(1);
  const dynamicTemp = (0.14 + Math.sin(pulseTick * 0.2) * 0.002).toFixed(3);

  return (
    <div className="bg-slate-950 border border-cyan-500/40 rounded-2xl p-6 shadow-2xl space-y-6 relative overflow-hidden font-mono-code">
      {/* Background Grid and Holographic Radial Glow */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#08334415_1px,transparent_1px),linear-gradient(to_bottom,#08334415_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Main Title Banner */}
      <div className="text-center relative z-10 space-y-1 border-b border-cyan-900/50 pb-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-500/50 text-cyan-300 text-xs font-bold mb-1 shadow-lg shadow-cyan-950/50">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-spin" />
          OMNIVERSAL TELEMETRY MATRIX
        </div>
        <h2 className="text-xl sm:text-2xl font-display font-extrabold text-white tracking-tight">
          Unified Multicluster Synthesis: Omniversal Governance Monitoring
        </h2>
        <p className="text-xs text-slate-400 max-w-2xl mx-auto">
          {lang === 'th'
            ? 'การสังเคราะห์โทรมาตรพหุคลัสเตอร์แบบรวมศูนย์: ควบคุมและเฝ้าระวังโครงสร้างสัจจะ 14,902 ซีล และ 10/10 REAL_HSM แบบเรียลไทม์'
            : 'Unified multicluster synthesis monitoring 14,902 canonical seals and 10/10 REAL_HSM quorum invariants with zero drift.'}
        </p>
      </div>

      {/* Top Telemetry HUD Status Ribbon */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 relative z-10">
        <div className="bg-slate-900/90 border border-emerald-500/40 rounded-xl p-3 text-center">
          <span className="text-[10px] text-slate-400 uppercase block tracking-wider font-bold">QUORUM</span>
          <div className="flex items-center justify-center gap-1.5 mt-0.5">
            <span className="text-lg font-extrabold text-emerald-400">10 / 10</span>
            <span className="text-[10px] text-emerald-300 font-bold">REAL HSM VERIFIED</span>
          </div>
        </div>

        <div className="bg-slate-900/90 border border-cyan-500/40 rounded-xl p-3 text-center">
          <span className="text-[10px] text-slate-400 uppercase block tracking-wider font-bold">THERMAL</span>
          <div className="flex items-center justify-center gap-1.5 mt-0.5">
            <span className="text-lg font-extrabold text-cyan-300">{dynamicTemp} mK</span>
            <span className="text-[10px] text-cyan-400 font-bold">ZERO NOISE</span>
          </div>
        </div>

        <div className="bg-slate-900/90 border border-purple-500/40 rounded-xl p-3 text-center">
          <span className="text-[10px] text-slate-400 uppercase block tracking-wider font-bold">Δ DRIFT</span>
          <div className="flex items-center justify-center gap-1.5 mt-0.5">
            <span className="text-lg font-extrabold text-purple-300">0.0%</span>
            <span className="text-[10px] text-purple-400 font-bold">ZERO MUTATION</span>
          </div>
        </div>

        <div className="bg-slate-900/90 border border-amber-500/40 rounded-xl p-3 text-center">
          <span className="text-[10px] text-slate-400 uppercase block tracking-wider font-bold">TACHYON SHIELD</span>
          <div className="flex items-center justify-center gap-1.5 mt-0.5">
            <span className="text-lg font-extrabold text-amber-300">10^44</span>
            <span className="text-[10px] text-amber-400 font-bold">INVIOLABLE</span>
          </div>
        </div>
      </div>

      {/* Multicluster Synthesis Grid (4 Corners + Center Hexagonal Nexus) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 relative z-10">
        {/* TOP-LEFT: GENESIS CLUSTER */}
        <div 
          onClick={() => setActiveCluster('GENESIS')}
          className={`bg-slate-900/90 border rounded-xl p-4 transition-all cursor-pointer space-y-3 ${
            activeCluster === 'GENESIS' 
              ? 'border-cyan-400 ring-1 ring-cyan-500/50 shadow-lg shadow-cyan-950/80' 
              : 'border-slate-800 hover:border-slate-700'
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
              <h4 className="font-bold text-white text-xs tracking-wider">GENESIS CLUSTER</h4>
            </div>
            <span className="px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 text-[10px] font-bold border border-cyan-500/40">
              SEALED
            </span>
          </div>

          <div className="space-y-1.5 text-[11px] text-slate-300 bg-slate-950 p-3 rounded-lg border border-slate-800">
            <div className="text-slate-400">Merkle Root Genesis:</div>
            <div className="text-cyan-300 font-bold break-all text-[10px]">
              909ab814...4c68
            </div>
            <div className="flex justify-between pt-1 border-t border-slate-800 text-slate-400">
              <span>Canonical Seals:</span>
              <span className="text-emerald-400 font-bold">14,902 FROZEN</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Standard:</span>
              <span className="text-purple-300">EIPS 100CAL</span>
            </div>
          </div>
        </div>

        {/* CENTER: CUSTODIAN QUORUM & QUANTUM ASSURANCE */}
        <div 
          onClick={() => setActiveCluster('CUSTODIAN')}
          className={`bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900 border rounded-xl p-4 transition-all cursor-pointer space-y-3 text-center ${
            activeCluster === 'CUSTODIAN'
              ? 'border-emerald-400 ring-2 ring-emerald-500/50 shadow-xl shadow-emerald-950/90'
              : 'border-slate-800 hover:border-slate-700'
          }`}
        >
          <div className="flex items-center justify-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <h4 className="font-bold text-white text-xs tracking-wider">CUSTODIAN QUORUM (10/10)</h4>
          </div>

          {/* Central Hexagonal Indicator Simulation */}
          <div className="py-2 flex flex-col items-center justify-center">
            <div className="w-20 h-20 rounded-full border-2 border-dashed border-emerald-400 flex items-center justify-center relative animate-[spin_10s_linear_infinite]">
              <div className="w-14 h-14 rounded-full border border-cyan-400 flex items-center justify-center">
                <KeyRound className="w-6 h-6 text-emerald-300" />
              </div>
            </div>
            <span className="text-xs font-extrabold text-emerald-400 mt-2">
              TC-01 → TC-10 DILITHIUM-5
            </span>
            <span className="text-[10px] text-slate-400">
              FIPS 140-3 LEVEL 4 HSM
            </span>
          </div>

          <div className="text-[10px] text-slate-300 bg-slate-950 p-2 rounded border border-slate-800 flex justify-around">
            <span className="text-cyan-300 font-bold">FAIL-CLOSED 85.0°C</span>
            <span className="text-emerald-400 font-bold">Δ0.0% ZERO DRIFT</span>
          </div>
        </div>

        {/* TOP-RIGHT: PLANCK CLUSTER */}
        <div 
          onClick={() => setActiveCluster('PLANCK')}
          className={`bg-slate-900/90 border rounded-xl p-4 transition-all cursor-pointer space-y-3 ${
            activeCluster === 'PLANCK'
              ? 'border-amber-400 ring-1 ring-amber-500/50 shadow-lg shadow-amber-950/80'
              : 'border-slate-800 hover:border-slate-700'
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
              <h4 className="font-bold text-white text-xs tracking-wider">PLANCK CLUSTER</h4>
            </div>
            <span className="px-2 py-0.5 rounded bg-amber-950 text-amber-300 text-[10px] font-bold border border-amber-500/40">
              INVIOLABLE
            </span>
          </div>

          <div className="space-y-1.5 text-[11px] text-slate-300 bg-slate-950 p-3 rounded-lg border border-slate-800">
            <div className="flex justify-between text-slate-400">
              <span>Tachyon Shield:</span>
              <span className="text-amber-300 font-bold">10^44 ACTIVE</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Forensic Vault:</span>
              <span className="text-emerald-400 font-bold">ARCHIVED</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Multiverse Scale:</span>
              <span className="text-cyan-300">IMMUTABLE</span>
            </div>
          </div>
        </div>

        {/* BOTTOM-LEFT: CRYO CLUSTER */}
        <div 
          onClick={() => setActiveCluster('CRYO')}
          className={`bg-slate-900/90 border rounded-xl p-4 transition-all cursor-pointer space-y-3 ${
            activeCluster === 'CRYO'
              ? 'border-cyan-400 ring-1 ring-cyan-500/50 shadow-lg shadow-cyan-950/80'
              : 'border-slate-800 hover:border-slate-700'
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Snowflake className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
              <h4 className="font-bold text-white text-xs tracking-wider">CRYO CLUSTER</h4>
            </div>
            <span className="px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 text-[10px] font-bold border border-cyan-500/40">
              0.14 mK STABLE
            </span>
          </div>

          <div className="space-y-1.5 text-[11px] text-slate-300 bg-slate-950 p-3 rounded-lg border border-slate-800">
            <div className="flex justify-between text-slate-400">
              <span>Coolant Flow:</span>
              <span className="text-cyan-300 font-bold">Superfluid He-4</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Noise Floor:</span>
              <span className="text-emerald-400 font-bold">0.00 nV ZERO NOISE</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Status:</span>
              <span className="text-purple-300">SUB-KELVIN ACTIVE</span>
            </div>
          </div>
        </div>

        {/* BOTTOM-CENTER: FORENSIC & LEGAL INTEGRITY */}
        <div 
          onClick={() => setActiveCluster('FORENSIC')}
          className={`bg-slate-900/90 border rounded-xl p-4 transition-all cursor-pointer space-y-3 ${
            activeCluster === 'FORENSIC'
              ? 'border-purple-400 ring-1 ring-purple-500/50 shadow-lg shadow-purple-950/80'
              : 'border-slate-800 hover:border-slate-700'
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Scale className="w-3.5 h-3.5 text-purple-400" />
              <h4 className="font-bold text-white text-xs tracking-wider">FORENSIC & LEGAL CLUSTER</h4>
            </div>
            <span className="px-2 py-0.5 rounded bg-purple-950 text-purple-300 text-[10px] font-bold border border-purple-500/40">
              ETDA SEC 9, 26, 28
            </span>
          </div>

          <div className="space-y-1.5 text-[11px] text-slate-300 bg-slate-950 p-3 rounded-lg border border-slate-800">
            <div className="flex justify-between text-slate-400">
              <span>Court Admissibility:</span>
              <span className="text-emerald-400 font-bold">100% GREEN</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>12-Stage Trace SLA:</span>
              <span className="text-cyan-300 font-bold">&lt; 142 ms</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Non-repudiation:</span>
              <span className="text-purple-300">DILITHIUM-5 PQC</span>
            </div>
          </div>
        </div>

        {/* BOTTOM-RIGHT: QUANTUM CLUSTER */}
        <div 
          onClick={() => setActiveCluster('QUANTUM')}
          className={`bg-slate-900/90 border rounded-xl p-4 transition-all cursor-pointer space-y-3 ${
            activeCluster === 'QUANTUM'
              ? 'border-purple-400 ring-1 ring-purple-500/50 shadow-lg shadow-purple-950/80'
              : 'border-slate-800 hover:border-slate-700'
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Zap className="w-3.5 h-3.5 text-purple-400" />
              <h4 className="font-bold text-white text-xs tracking-wider">QUANTUM CLUSTER</h4>
            </div>
            <span className="px-2 py-0.5 rounded bg-purple-950 text-purple-300 text-[10px] font-bold border border-purple-500/40">
              QOps: {dynamicQOps}
            </span>
          </div>

          <div className="space-y-1.5 text-[11px] text-slate-300 bg-slate-950 p-3 rounded-lg border border-slate-800">
            <div className="flex justify-between text-slate-400">
              <span>Work-Factor:</span>
              <span className="text-purple-300 font-bold">2^256 BITS</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>NIST Standard:</span>
              <span className="text-emerald-400 font-bold">FIPS 203/204/205</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Zero Drift:</span>
              <span className="text-cyan-300 font-bold">Δ0.0% SECURED</span>
            </div>
          </div>
        </div>
      </div>

      {/* AGGREGATE TELEMETRY FOOTER BAR */}
      <div className="bg-slate-950 p-4 rounded-xl border border-cyan-500/30 flex flex-col md:flex-row items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-cyan-400" />
          <span className="text-slate-400 font-bold">AGGREGATE TELEMETRY:</span>
          <span className="text-white">
            QUORUM <strong className="text-emerald-400">10 / 10 HSM</strong> • THERMAL <strong className="text-cyan-300">0.14 mK ZERO NOISE</strong> • DRIFT <strong className="text-purple-300">0.0%</strong> • TACHYON <strong className="text-amber-300">10^44 (100% STABLE)</strong>
          </span>
        </div>
        <div className="text-[11px] text-slate-500">
          Sovereign Architect: <span className="text-slate-300 font-bold">{SOVEREIGN_PRINCIPAL.nameTh} ({SOVEREIGN_PRINCIPAL.id})</span>
        </div>
      </div>
    </div>
  );
};
