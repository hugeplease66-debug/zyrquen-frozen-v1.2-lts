'use client';

import React, { useState, useEffect } from 'react';
import { 
  Terminal, 
  Cpu, 
  Layers, 
  Zap, 
  ShieldAlert, 
  ShieldCheck, 
  Play, 
  Pause, 
  RotateCcw,
  Download,
  AlertTriangle,
  Lock,
  Radio,
  CheckCircle2
} from 'lucide-react';

export type LogSeverity = 'INFO' | 'WARN' | 'FAIL-CLOSED';

export interface KernelInterrupt {
  id: number;
  irq: string;
  time: string;
  severity: LogSeverity;
  subsystem: 'CRYO_BUS' | 'PQC_ENCLAVE' | 'COMPLIANCE_GATE' | 'MERKLE_SYNC' | 'HSM_QUORUM' | 'WARP_FLUX';
  description: string;
  code: string;
  gateState?: string;
}

const INITIAL_INTERRUPTS: KernelInterrupt[] = [
  { id: 101, irq: "IRQ#0x14", time: "01:56:40.012", severity: "INFO", subsystem: "CRYO_BUS", description: "Helium-4 Dilution Sub-Kelvin Bus Thermistor locked @ 14.92 mK", code: "0x00_CRYO_OK", gateState: "GATE_OPEN_THERMAL_SAFE" },
  { id: 102, irq: "IRQ#0x28", time: "01:56:40.245", severity: "INFO", subsystem: "PQC_ENCLAVE", description: "ML-DSA-87 (FIPS 204) Signature Vector Verification Succeeded", code: "0x00_DSA_VERIFIED", gateState: "GATE_PQC_LOCKED" },
  { id: 103, irq: "IRQ#0x3F", time: "01:56:40.590", severity: "INFO", subsystem: "MERKLE_SYNC", description: "Merkle Leaf #14902 Invariant check -> Root 909ab814... Delta=0", code: "0x00_MERKLE_PASS", gateState: "SSOT_CANONICAL_DELTA0" },
  { id: 104, irq: "IRQ#0x52", time: "01:56:40.812", severity: "WARN", subsystem: "COMPLIANCE_GATE", description: "Transient parity check on ETDA Sec.26 Cross-Border stream — Enforcing Cryo-Isolation", code: "0x1A_DRIFT_GUARDED", gateState: "FAIL_CLOSED_TRIGGER_READY" },
  { id: 105, irq: "IRQ#0x6B", time: "01:56:41.104", severity: "FAIL-CLOSED", subsystem: "COMPLIANCE_GATE", description: "Zero-Trust Invariant Enforced: Non-authoritative UI buffer isolated from SSoT core", code: "0xFC_FAIL_CLOSED_ACTIVE", gateState: "GATE_FAIL_CLOSED_HARDENED" },
  { id: 106, irq: "IRQ#0x72", time: "01:56:41.450", severity: "INFO", subsystem: "HSM_QUORUM", description: "10/10 REAL HSM Deca-Quorum Heartbeat Consensus Synchronized", code: "0x00_QUORUM_LOCKED", gateState: "QUORUM_UNANIMOUS_10_10" },
  { id: 107, irq: "IRQ#0x88", time: "01:56:41.790", severity: "INFO", subsystem: "WARP_FLUX", description: "Laser Photon Corridor 851.9 THz frequency locked across interstellar relays", code: "0x00_FLUX_ALIGNED", gateState: "CORRIDOR_ENTANGLED" }
];

export default function KernelLogOverlay() {
  const [interrupts, setInterrupts] = useState<KernelInterrupt[]>(INITIAL_INTERRUPTS);
  const [isStreaming, setIsStreaming] = useState(true);
  const [severityFilter, setSeverityFilter] = useState<'ALL' | LogSeverity>('ALL');
  const [subsystemFilter, setSubsystemFilter] = useState<string>('ALL');

  useEffect(() => {
    if (!isStreaming) return;

    const interval = setInterval(() => {
      const subsystems: KernelInterrupt['subsystem'][] = [
        'CRYO_BUS', 'PQC_ENCLAVE', 'COMPLIANCE_GATE', 'MERKLE_SYNC', 'HSM_QUORUM', 'WARP_FLUX'
      ];
      const sub = subsystems[Math.floor(Math.random() * subsystems.length)];

      const severities: LogSeverity[] = ['INFO', 'INFO', 'INFO', 'WARN', 'FAIL-CLOSED'];
      const sev = severities[Math.floor(Math.random() * severities.length)];

      const eventsBySubsystem: Record<KernelInterrupt['subsystem'], { desc: string; code: string; gate: string }[]> = {
        CRYO_BUS: [
          { desc: "Sub-Kelvin cryo loop pulse calibrated @ 14.98 mK (0.0018 ΔS entropy)", code: "0x00_CRYO_OPTIMAL", gate: "THERMAL_LOCKED" },
          { desc: "Cryogenic dilution manifold valve A-12 status verified", code: "0x00_VALVE_PASS", gate: "MANIFOLD_SECURE" }
        ],
        PQC_ENCLAVE: [
          { desc: "Kyber-1024 (FIPS 203) Key Encapsulation payload ingested & ratified", code: "0x00_KEM_INGESTED", gate: "PQC_FIPS203_PASS" },
          { desc: "Falcon-1024 Post-Quantum lattice polynomial root checked against Genesis", code: "0x00_FALCON_VERIFIED", gate: "LATTICE_INTEGRITY_OK" }
        ],
        COMPLIANCE_GATE: [
          { desc: "ETDA Act B.E. 2544 Sec. 26/28 Sovereign custody invariant affirmed for EP-SOVEREIGN-01", code: "0x00_ETDA_CUSTODY_VALID", gate: "GATE_SOVEREIGN_LOCKED" },
          { desc: "PDPA B.E. 2562 Sec. 19/27 Zero-Knowledge Consent Registry attestation confirmed", code: "0x00_PDPA_ZK_CONSENT", gate: "GATE_PRIVACY_ENFORCED" },
          { desc: "Compliance Transition: State moved to FAIL-CLOSED on unverified external telemetry", code: "0xFC_FAIL_CLOSED_ASSERT", gate: "GATE_FAIL_CLOSED_HARDENED" }
        ],
        MERKLE_SYNC: [
          { desc: "OTLP Telemetry Merkle proof tree branch verified against Block #849202", code: "0x00_MERKLE_BRANCH_OK", gate: "SSOT_ROOT_UNMODIFIED" },
          { desc: "Genesis Anchor Root 909ab814...4c68 zero mutation invariant check Delta=0", code: "0x00_DELTA0_AFFIRMED", gate: "CANONICAL_CONSENSUS_STABLE" }
        ],
        HSM_QUORUM: [
          { desc: "Custodian #07 signed state ratification block via Dilithium-5 hardware key", code: "0x00_CUSTODIAN_SIGN", gate: "DECA_QUORUM_10_10" },
          { desc: "10/10 REAL_HSM Unanimous consensus loop affirmed without exception", code: "0x00_QUORUM_HEARTBEAT", gate: "QUORUM_LOCK_ACTIVE" }
        ],
        WARP_FLUX: [
          { desc: "Quantum coherence gauge adjusted: 99.993% (Sub-Kelvin superconducting line)", code: "0x00_COHERENCE_PULSE", gate: "WAVEGUIDE_TUNED" },
          { desc: "Laser Photon Corridor frequency harmonic aligned @ 851.9 THz", code: "0x00_PHOTON_LOCKED", gate: "RELAY_ENTANGLED" }
        ]
      };

      const now = new Date();
      const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}.${String(now.getMilliseconds()).padStart(3, '0')}`;
      const randomIrq = `IRQ#0x${Math.floor(16 + Math.random() * 240).toString(16).toUpperCase()}`;
      const eventList = eventsBySubsystem[sub];
      const chosenEvent = eventList[Math.floor(Math.random() * eventList.length)];

      const newInt: KernelInterrupt = {
        id: Date.now(),
        irq: randomIrq,
        time: timeStr,
        severity: sev,
        subsystem: sub,
        description: chosenEvent.desc,
        code: chosenEvent.code,
        gateState: chosenEvent.gate
      };

      setInterrupts(prev => [newInt, ...prev.slice(0, 39)]);
    }, 2400);

    return () => clearInterval(interval);
  }, [isStreaming]);

  const filtered = interrupts.filter(i => {
    const matchesSev = severityFilter === 'ALL' || i.severity === severityFilter;
    const matchesSub = subsystemFilter === 'ALL' || i.subsystem === subsystemFilter;
    return matchesSev && matchesSub;
  });

  return (
    <div className="ConsoleView w-full bg-[#050b16]/95 border border-cyan-500/50 rounded-2xl p-5 sm:p-6 backdrop-blur-2xl shadow-2xl space-y-4 font-mono text-xs">
      
      {/* HEADER BAR */}
      <div className="flex flex-wrap justify-between items-center gap-3 border-b border-cyan-500/20 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-cyan-500/15 border border-cyan-400/50 text-cyan-300">
            <Cpu className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[10px] text-cyan-400 font-bold tracking-widest uppercase bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/30">
                SYSTEM KERNEL LOGSTREAM
              </span>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[9px] font-bold flex items-center gap-1">
                <Radio className="w-3 h-3 animate-ping" />
                HARDWARE INTERRUPTS & COMPLIANCE GATES
              </span>
            </div>
            <h3 className="text-base sm:text-lg font-bold text-white text-cyan-gradient mt-0.5 font-mono">
              Hardware Interrupt Stream & Fail-Closed Gate Transitions
            </h3>
          </div>
        </div>

        {/* CONTROLS */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsStreaming(!isStreaming)}
            className={`px-3 py-1.5 rounded-xl border font-bold flex items-center gap-1.5 transition cursor-pointer ${
              isStreaming 
                ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 shadow quantum-cyan-glow' 
                : 'bg-slate-900 border-slate-800 text-slate-400'
            }`}
            title={isStreaming ? "Pause Interrupt Stream" : "Resume Interrupt Stream"}
          >
            {isStreaming ? (
              <>
                <Pause className="w-3.5 h-3.5" />
                <span>STREAM LIVE</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>PAUSED</span>
              </>
            )}
          </button>

          <button
            onClick={() => setInterrupts(INITIAL_INTERRUPTS)}
            className="p-2 rounded-xl bg-slate-900/90 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700 transition cursor-pointer"
            title="Reset Interrupt Log Stream"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* FILTER BUTTONS BAR */}
      <div className="flex flex-wrap justify-between items-center gap-3 bg-black/60 p-2.5 rounded-xl border border-slate-800">
        
        {/* SEVERITY FILTERS */}
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-[10px] text-slate-400 mr-1 font-bold">Severity:</span>
          {(['ALL', 'INFO', 'WARN', 'FAIL-CLOSED'] as const).map(sev => (
            <button
              key={sev}
              onClick={() => setSeverityFilter(sev)}
              className={`px-2.5 py-1 rounded-lg text-[10px] font-bold border transition cursor-pointer ${
                severityFilter === sev
                  ? sev === 'FAIL-CLOSED'
                    ? 'bg-rose-500/30 border-rose-400 text-rose-300 shadow'
                    : sev === 'WARN'
                    ? 'bg-amber-500/30 border-amber-400 text-amber-300 shadow'
                    : sev === 'INFO'
                    ? 'bg-cyan-500/30 border-cyan-400 text-cyan-300 shadow'
                    : 'bg-white/20 border-white text-white shadow'
                  : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              {sev}
            </button>
          ))}
        </div>

        {/* SUBSYSTEM FILTERS */}
        <div className="flex flex-wrap items-center gap-1 text-[10px]">
          {['ALL', 'CRYO_BUS', 'PQC_ENCLAVE', 'COMPLIANCE_GATE', 'MERKLE_SYNC', 'HSM_QUORUM', 'WARP_FLUX'].map(sub => (
            <button
              key={sub}
              onClick={() => setSubsystemFilter(sub)}
              className={`px-2 py-0.5 rounded border transition cursor-pointer ${
                subsystemFilter === sub
                  ? 'bg-cyan-500/25 border-cyan-400 text-cyan-200 font-bold'
                  : 'bg-black/40 border-slate-800/80 text-slate-500 hover:text-slate-300'
              }`}
            >
              {sub}
            </button>
          ))}
        </div>

      </div>

      {/* INTERRUPTS LOGS STREAM TABLE */}
      <div className="space-y-2 max-h-[340px] overflow-y-auto pr-1">
        {filtered.map(item => {
          const isFailClosed = item.severity === 'FAIL-CLOSED';
          const isWarn = item.severity === 'WARN';

          return (
            <div 
              key={item.id} 
              className={`p-2.5 rounded-xl border transition flex flex-wrap items-center justify-between gap-2 text-[11px] ${
                isFailClosed 
                  ? 'bg-rose-950/40 border-rose-500/50 hover:border-rose-400 text-rose-200' 
                  : isWarn 
                  ? 'bg-amber-950/30 border-amber-500/40 hover:border-amber-400 text-amber-200' 
                  : 'bg-black/60 border-slate-800/90 hover:border-cyan-500/40 text-slate-200'
              }`}
            >
              <div className="flex flex-wrap items-center gap-2">
                {/* SEVERITY BADGE */}
                <span className={`px-1.5 py-0.5 rounded font-bold text-[9px] uppercase border flex items-center gap-1 ${
                  isFailClosed 
                    ? 'bg-rose-500/20 text-rose-300 border-rose-500/60 font-mono' 
                    : isWarn 
                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/60 font-mono' 
                    : 'bg-cyan-500/20 text-cyan-300 border-cyan-500/50 font-mono'
                }`}>
                  {isFailClosed ? <Lock className="w-2.5 h-2.5" /> : isWarn ? <AlertTriangle className="w-2.5 h-2.5" /> : <CheckCircle2 className="w-2.5 h-2.5" />}
                  {item.severity}
                </span>

                {/* IRQ & TIMESTAMP */}
                <span className="text-amber-400 font-bold">{item.irq}</span>
                <span className="text-slate-400">[{item.time}]</span>

                {/* SUBSYSTEM */}
                <span className="px-1.5 py-0.5 rounded bg-cyan-950/80 text-cyan-300 text-[9px] font-bold border border-cyan-500/30">
                  {item.subsystem}
                </span>

                {/* DESCRIPTION */}
                <span className="text-slate-200 font-mono">{item.description}</span>
              </div>

              {/* RIGHT STATUS CODE & GATE STATE */}
              <div className="flex items-center gap-2">
                {item.gateState && (
                  <span className="text-[9px] text-slate-400 hidden sm:inline">
                    Gate: <strong className={isFailClosed ? 'text-rose-300' : isWarn ? 'text-amber-300' : 'text-emerald-300'}>{item.gateState}</strong>
                  </span>
                )}
                <span className={`font-bold text-[10px] ${isFailClosed ? 'text-rose-400' : isWarn ? 'text-amber-400' : 'text-emerald-400'}`}>
                  {item.code}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* FOOTER METRICS */}
      <div className="flex flex-wrap justify-between items-center text-[10px] text-slate-400 pt-2 border-t border-slate-800/80">
        <div className="flex items-center gap-3">
          <span>Active Events: <strong className="text-cyan-300">{filtered.length}</strong></span>
          <span>Buffer: <strong className="text-emerald-400">Ring-40 Zero-Drop</strong></span>
          <span>Sample Rate: <strong className="text-amber-300">2.4s Quantum Tick</strong></span>
        </div>
        <div className="text-slate-400">
          Enclave Protocol: <strong className="text-cyan-300 font-mono">FAIL-CLOSED-INVARIANT-v4.16</strong>
        </div>
      </div>

    </div>
  );
}

