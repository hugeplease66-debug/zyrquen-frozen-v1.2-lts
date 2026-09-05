import React from 'react';
import { 
  Rocket, 
  Flame, 
  UserCheck, 
  Orbit, 
  Layers, 
  ShieldCheck, 
  Cpu, 
  Activity, 
  Lock,
  CheckCircle2
} from 'lucide-react';
import { CHAMBERS, SYSTEM_METADATA, SOVEREIGN_PRINCIPAL } from '../../data/canonicalData';
import { Chamber17Preservation } from './Chamber17Preservation';

interface GenericChamberProps {
  chamberNum: number;
  lang: 'th' | 'en';
}

export const GenericChamberView: React.FC<GenericChamberProps> = ({ chamberNum, lang }) => {
  const chamber = CHAMBERS.find(c => c.num === chamberNum) || CHAMBERS[0];

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="rounded-xl bg-gradient-to-r from-slate-900 via-slate-950 to-cyan-950/60 border border-cyan-500/30 p-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full bg-cyan-950 border border-cyan-500/40 text-cyan-300 text-xs font-mono-code font-bold">
                {chamber.badge}
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 text-xs font-mono-code">
                Status: {chamber.status}
              </span>
            </div>
            <h2 className="text-2xl font-display font-bold text-white tracking-tight">
              {chamber.titleTh}
            </h2>
            <p className="text-sm text-slate-300 mt-1 max-w-3xl">
              {lang === 'th' ? chamber.descriptionTh : chamber.descriptionEn}
            </p>
          </div>

          <div className="bg-slate-950/80 p-3 rounded-lg border border-cyan-500/30 text-right">
            <span className="text-xs text-slate-400 block font-mono-code">Sovereign Authority:</span>
            <span className="text-sm font-mono-code font-bold text-emerald-400">
              OMEGA-1 CLEARANCE
            </span>
          </div>
        </div>
      </div>

      {/* Chamber-specific detail module */}
      {chamberNum === 3 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-2">
            <Rocket className="w-5 h-5 text-cyan-400" />
            <h4 className="font-bold text-white text-sm">Warp Factor Velocity</h4>
            <div className="text-2xl font-mono-code font-bold text-cyan-300">Warp 37.93</div>
            <p className="text-xs text-slate-400">Continuous sub-space tensor field stability at 99.992% coherence.</p>
          </div>
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-2">
            <Activity className="w-5 h-5 text-emerald-400" />
            <h4 className="font-bold text-white text-sm">Space-Time Metric Tensor</h4>
            <div className="text-2xl font-mono-code font-bold text-emerald-300">g_uv = η_uv</div>
            <p className="text-xs text-slate-400">Minkowski flat-space boundary maintained without gravimetric leakage.</p>
          </div>
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-2">
            <ShieldCheck className="w-5 h-5 text-purple-400" />
            <h4 className="font-bold text-white text-sm">Alcubierre Harmonic Damper</h4>
            <div className="text-2xl font-mono-code font-bold text-purple-300">100% ONLINE</div>
            <p className="text-xs text-slate-400">Exotic matter containment field locked at 14.98 mK subzero threshold.</p>
          </div>
        </div>
      )}

      {chamberNum === 4 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-2">
            <Flame className="w-5 h-5 text-amber-400" />
            <h4 className="font-bold text-white text-sm">Antimatter Core Power</h4>
            <div className="text-2xl font-mono-code font-bold text-amber-300">37.93 MW</div>
            <p className="text-xs text-slate-400">Reacting positron-antiproton pairs at 12% baseline reactor capacity.</p>
          </div>
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-2">
            <Activity className="w-5 h-5 text-emerald-400" />
            <h4 className="font-bold text-white text-sm">Fuel Efficiency Index</h4>
            <div className="text-2xl font-mono-code font-bold text-emerald-300">99.98%</div>
            <p className="text-xs text-slate-400">Zero unburnt particles in the magnetic exhaust chamber.</p>
          </div>
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-2">
            <Lock className="w-5 h-5 text-cyan-400" />
            <h4 className="font-bold text-white text-sm">Magnetic Bottle Enclosure</h4>
            <div className="text-2xl font-mono-code font-bold text-cyan-300">12.8 Tesla</div>
            <p className="text-xs text-slate-400">Superconducting magnetic confinement with dual redundant coils.</p>
          </div>
        </div>
      )}

      {chamberNum === 9 && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4">
          <h3 className="font-display font-bold text-white text-base flex items-center gap-2">
            <UserCheck className="w-5 h-5 text-indigo-400" />
            Sovereign Identity Credentials (IAL2+ / AAL2+)
          </h3>
          <div className="bg-slate-950 p-4 rounded-lg border border-slate-800 space-y-3 text-xs">
            <div>
              <span className="text-slate-400 block font-semibold">Principal Holder:</span>
              <span className="text-white font-bold text-sm">{SOVEREIGN_PRINCIPAL.nameTh} ({SOVEREIGN_PRINCIPAL.id})</span>
            </div>
            <div>
              <span className="text-slate-400 block font-semibold">Passport Enclave Key:</span>
              <span className="text-cyan-300 font-mono-code break-all">{SOVEREIGN_PRINCIPAL.passportKey}</span>
            </div>
            <div>
              <span className="text-slate-400 block font-semibold">Assurance Levels:</span>
              <span className="text-emerald-400 font-mono-code">Identity Assurance: IAL2+ | Authentication Assurance: AAL2+</span>
            </div>
          </div>
        </div>
      )}

      {chamberNum === 15 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-2">
            <Orbit className="w-5 h-5 text-sky-400" />
            <h4 className="font-bold text-white text-sm">Active Orbital Targets</h4>
            <div className="text-2xl font-mono-code font-bold text-sky-300">45 / 45 NODES</div>
            <p className="text-xs text-slate-400">Constellation mesh providing 100% terrestrial and orbital coverage.</p>
          </div>
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-2">
            <Activity className="w-5 h-5 text-emerald-400" />
            <h4 className="font-bold text-white text-sm">Laser Inter-Satellite Link</h4>
            <div className="text-2xl font-mono-code font-bold text-emerald-300">100 Gbps</div>
            <p className="text-xs text-slate-400">Quantum key distribution (QKD) enabled laser cross-links.</p>
          </div>
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-2">
            <ShieldCheck className="w-5 h-5 text-purple-400" />
            <h4 className="font-bold text-white text-sm">Ground Teleport Ingress</h4>
            <div className="text-2xl font-mono-code font-bold text-purple-300">0.8ms Ping</div>
            <p className="text-xs text-slate-400">Direct encrypted ground telemetry downlinks in Bangkok & Singapore.</p>
          </div>
        </div>
      )}

      {chamberNum === 16 && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4">
          <h3 className="font-display font-bold text-white text-base flex items-center gap-2">
            <Layers className="w-5 h-5 text-violet-400" />
            Multiverse Matrix & Digital Twin Simulator
          </h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            {lang === 'th'
              ? 'ระบบจำลองสภาวะแวดล้อมเสมือน 3 มิติ (Sandboxed Digital Twin) สำหรับการทดลองความโกลาหลโดยไม่ส่งผลกระทบต่อแกนกลาง SSoT ที่แช่แข็งไว้'
              : 'Isolated multi-branch sandbox simulation engine for running stress tests and chaotic resilience simulations without mutating the frozen SSoT core.'}
          </p>
          <div className="bg-slate-950 p-4 rounded-lg border border-slate-800 flex items-center justify-between text-xs font-mono-code">
            <span className="text-slate-400">Active Sandbox Instances: <strong className="text-cyan-300">8 Universes</strong></span>
            <span className="text-emerald-400 font-bold">Δ0 ISOLATION GUARANTEED</span>
          </div>
        </div>
      )}

      {chamberNum === 17 && (
        <div className="pt-2">
          <Chamber17Preservation lang={lang} />
        </div>
      )}
    </div>
  );
};
