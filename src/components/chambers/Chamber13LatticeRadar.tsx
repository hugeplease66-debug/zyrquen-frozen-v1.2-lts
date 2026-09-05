import React from 'react';
import { 
  Radio, 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle2, 
  Activity, 
  Layers
} from 'lucide-react';

interface ChamberProps {
  lang: 'th' | 'en';
}

const THREAT_VECTORS = [
  { id: "VC-001", name: "Post-Epoch Emission Probe Mismatch", severity: "HIGH", status: "CONTAINED", target: "Block #849,203 Probe", chamber: "Chamber 02" },
  { id: "VC-002", name: "High-Frequency Lattice Perturbation", severity: "MEDIUM", status: "CONTAINED", target: "Cryo Sensor Array", chamber: "Chamber 10" },
  { id: "VC-003", name: "Replay Digest Cache Injection", severity: "HIGH", status: "CONTAINED", target: "AUTH-9902 CryptoDirect", chamber: "Sentinel AI" },
  { id: "VC-004", name: "Unauthorized Mutation Authority Call", severity: "CRITICAL", status: "CONTAINED", target: "Root SSoT Anchor", chamber: "Core Shield" }
];

export const Chamber13LatticeRadar: React.FC<ChamberProps> = ({ lang }) => {
  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="rounded-xl bg-gradient-to-r from-rose-950/80 via-slate-900 to-slate-950 border border-rose-500/40 p-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full bg-rose-950 border border-rose-500/50 text-rose-300 text-xs font-mono-code font-bold flex items-center gap-1.5">
                <Radio className="w-3 h-3 text-rose-400 animate-pulse" />
                8K QUANTUM LATTICE RADAR
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 text-xs font-mono-code">
                Boundary: G11 Custodian Perimeter
              </span>
            </div>
            <h2 className="text-2xl font-display font-bold text-white tracking-tight">
              {lang === 'th' ? 'เรดาร์ตรวจจับคลื่นแทรกแซงควอนตัม 8K (Chamber 13)' : 'Chamber 13: 8K Quantum Lattice Threat Radar'}
            </h2>
            <p className="text-sm text-slate-300 mt-1 max-w-3xl">
              {lang === 'th'
                ? 'ระบบสแกนความถี่ควอนตัมรอบปริมณฑล G11 ตรวจจับภัยคุกคามทางไซเบอร์และคลื่นรบกวน 8K ทุกเวกเตอร์ (VC-001 ถึง VC-004) อยู่ในสถานะระงับยับยั้ง 100%'
                : 'Real-time 8K resolution quantum lattice scanner monitoring external probe vectors and enforcing strict boundary containment.'}
            </p>
          </div>

          <div className="bg-slate-950/80 p-3 rounded-lg border border-rose-500/30 text-right">
            <span className="text-xs text-slate-400 block font-mono-code">Perimeter Status:</span>
            <span className="text-lg font-mono-code font-bold text-emerald-400 flex items-center justify-end gap-1.5">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              100% CONTAINED
            </span>
          </div>
        </div>
      </div>

      {/* Threat Radar Display & Threat Matrix */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Visual Radar Scope (1 Col) */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-6 flex flex-col items-center justify-center relative overflow-hidden">
          <div className="relative w-56 h-56 rounded-full border-2 border-cyan-500/30 flex items-center justify-center">
            {/* Concentric rings */}
            <div className="absolute w-44 h-44 rounded-full border border-cyan-500/20" />
            <div className="absolute w-32 h-32 rounded-full border border-cyan-500/20" />
            <div className="absolute w-16 h-16 rounded-full border border-cyan-500/40 bg-cyan-950/30" />
            {/* Crosshairs */}
            <div className="absolute w-full h-[1px] bg-cyan-500/30" />
            <div className="absolute h-full w-[1px] bg-cyan-500/30" />
            {/* Sweep radar beam */}
            <div className="absolute w-1/2 h-1/2 right-0 top-0 origin-bottom-left bg-gradient-to-tr from-transparent via-cyan-500/20 to-cyan-400/40 animate-spin" style={{ animationDuration: '4s' }} />
            
            {/* Contained threat blips */}
            <div className="absolute top-10 right-14 h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
            <div className="absolute bottom-12 left-10 h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
            <div className="absolute top-24 left-8 h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
          </div>

          <div className="mt-4 text-center font-mono-code text-xs text-slate-400">
            Scanning 8,192 Lattice Nodes • 0 Breaches
          </div>
        </div>

        {/* Threat Vectors Matrix (2 Cols) */}
        <div className="lg:col-span-2 bg-slate-900/90 border border-slate-800 rounded-xl p-5 space-y-4">
          <h3 className="font-display font-bold text-white text-base flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-400" />
            {lang === 'th' ? 'รายการเวกเตอร์ภัยคุกคามที่ถูกระงับยับยั้ง' : 'Active Contained Threat Vectors (VC-001..VC-004)'}
          </h3>

          <div className="space-y-3">
            {THREAT_VECTORS.map((v) => (
              <div key={v.id} className="bg-slate-950 p-3.5 rounded-lg border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono-code font-bold text-cyan-400">{v.id}</span>
                    <span className="font-bold text-white">{v.name}</span>
                  </div>
                  <div className="text-[11px] text-slate-400">
                    Target: <span className="text-slate-300 font-mono-code">{v.target}</span> • Routed: <span className="text-amber-300 font-mono-code">{v.chamber}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span className="px-2 py-0.5 rounded bg-red-950/80 text-red-300 font-mono-code font-bold text-[10px]">
                    {v.severity}
                  </span>
                  <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-500/30 font-mono-code font-bold text-[10px] flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    CONTAINED
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
