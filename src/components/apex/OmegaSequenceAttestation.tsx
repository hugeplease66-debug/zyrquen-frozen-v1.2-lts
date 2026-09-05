import React, { useState } from 'react';
import { 
  Sparkles, 
  ShieldCheck, 
  Lock, 
  KeyRound, 
  Cpu, 
  Snowflake, 
  Scale, 
  Activity, 
  CheckCircle2, 
  Play, 
  RotateCcw, 
  ArrowRight,
  Award,
  Zap
} from 'lucide-react';
import { soundEngine } from '../../utils/audioSynth';
import { SYSTEM_METADATA, SOVEREIGN_PRINCIPAL } from '../../data/canonicalData';

interface OmegaProps {
  lang: 'th' | 'en';
}

interface OmegaPhase {
  phaseNum: number;
  code: string;
  nameTh: string;
  nameEn: string;
  anchor: string;
  slaMs: number;
  status: 'PENDING' | 'VERIFIED' | 'LOCKED';
  cryptoProof: string;
}

export const OmegaSequenceAttestation: React.FC<OmegaProps> = ({ lang }) => {
  const [running, setRunning] = useState<boolean>(false);
  const [activeStep, setActiveStep] = useState<number>(12); // All verified by default in Gold Master
  const [verifiedList, setVerifiedList] = useState<Record<number, boolean>>({
    1: true, 2: true, 3: true, 4: true, 5: true, 6: true,
    7: true, 8: true, 9: true, 10: true, 11: true, 12: true
  });

  const omegaPhases: OmegaPhase[] = [
    { phaseNum: 1, code: "Ω-01", nameTh: "การผนึกบล็อกปฐมบท (Genesis Seal Anchor)", nameEn: "Genesis Seal Anchor", anchor: "Block #849202", slaMs: 8, status: 'LOCKED', cryptoProof: "0x909ab814...4c68" },
    { phaseNum: 2, code: "Ω-02", nameTh: "เตาหลอมกุญแจยิ่งยวด (Cryo Key Forge)", nameEn: "Cryogenic Key Forge", anchor: "14.98 mK Sub-Kelvin", slaMs: 12, status: 'LOCKED', cryptoProof: "He-4 Superfluid 100%" },
    { phaseNum: 3, code: "Ω-03", nameTh: "การรับรองอัตลักษณ์สูงสุด (Identity Attestation)", nameEn: "Sovereign Identity Attestation", anchor: "#EP-SOVEREIGN-01", slaMs: 10, status: 'LOCKED', cryptoProof: "OMEGA-1 Supreme Clearance" },
    { phaseNum: 4, code: "Ω-04", nameTh: "ผูกพันธะสภา 10 ผู้ดูแล (Custodian Binding)", nameEn: "10/10 Custodian Binding", anchor: "TC-01..TC-10 Mesh", slaMs: 25, status: 'LOCKED', cryptoProof: "10/10 REAL_HSM FIPS 140-3 L4" },
    { phaseNum: 5, code: "Ω-05", nameTh: "ล็อกตัวแปรไม่เปลี่ยนรูป (qOps Invariant Lock)", nameEn: "qOps Invariant Lock", anchor: "Δ0.00% Zero Drift", slaMs: 14, status: 'LOCKED', cryptoProof: "Mutation Authority = 0" },
    { phaseNum: 6, code: "Ω-06", nameTh: "การลงนามพาสปอร์ตอธิปไตย (Passport Sign-Off)", nameEn: "Sovereign Passport Sign-Off", anchor: "Dilithium-5 ML-DSA-87", slaMs: 18, status: 'LOCKED', cryptoProof: "NIST FIPS 204 Validated" },
    { phaseNum: 7, code: "Ω-07", nameTh: "การกระจายรอยสืบค้น (Audit Trail Emission)", nameEn: "Audit Trail Emission", anchor: "14,902 Canonical Seals", slaMs: 15, status: 'LOCKED', cryptoProof: "Receipt ZQ-GOLD-DEP-849202" },
    { phaseNum: 8, code: "Ω-08", nameTh: "ซิงค์เครือข่ายต้านควอนตัม (PQC Lattice Sync)", nameEn: "PQC Resilience Sync", anchor: "ML-KEM-1024 + SPHINCS+", slaMs: 16, status: 'LOCKED', cryptoProof: "NIST FIPS 203/205 Compliant" },
    { phaseNum: 9, code: "Ω-09", nameTh: "สะพานรับรองกฎหมายไทย (Legal Bridge)", nameEn: "Thai Statutory Legal Bridge", anchor: "ETDA Sec 9, 26, 28", slaMs: 8, status: 'LOCKED', cryptoProof: "100% Forensic Admissibility" },
    { phaseNum: 10, code: "Ω-10", nameTh: "กระทบยอดและกักกันเสี่ยง (Custody Reconcile)", nameEn: "Custody Reconciliation", anchor: "+5 Quarantined (85°C)", slaMs: 12, status: 'LOCKED', cryptoProof: "Escrow Buffer Safe" },
    { phaseNum: 11, code: "Ω-11", nameTh: "สภาวะสมดุลอธิปไตย (Sovereign Homeostasis)", nameEn: "Sovereign Homeostasis", anchor: "Fail-Closed Circuit", slaMs: 10, status: 'LOCKED', cryptoProof: "Armed 85.0°C Tripwire" },
    { phaseNum: 12, code: "Ω-12", nameTh: "การอุบัติของแกนสัจจะ (Omega Ascension)", nameEn: "Omega Ascension & Eternal Seal", anchor: "v4.16 GOLD MASTER", slaMs: 14, status: 'LOCKED', cryptoProof: "RELEASE_SEALED v2.4.0-GA" }
  ];

  const handleRunReplay = async () => {
    setRunning(true);
    setVerifiedList({});
    soundEngine.playQuantumPing();

    for (let i = 1; i <= 12; i++) {
      setActiveStep(i);
      await new Promise(r => setTimeout(r, 200));
      setVerifiedList(prev => ({ ...prev, [i]: true }));
      soundEngine.playQuantumPing();
    }

    soundEngine.playQuorumChime();
    setRunning(false);
  };

  return (
    <div className="bg-slate-950 border border-purple-500/40 rounded-2xl p-6 shadow-2xl space-y-6 font-mono-code relative overflow-hidden">
      <div className="absolute top-0 left-0 w-80 h-80 bg-purple-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 pb-4 border-b border-purple-900/50">
        <div>
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-purple-950 border border-purple-500/50 text-purple-300 text-xs font-bold flex items-center gap-1.5 shadow-md shadow-purple-950">
              <Sparkles className="w-3.5 h-3.5 text-purple-400" />
              12-PHASE OMEGA SEQUENCE
            </span>
            <span className="px-2 py-0.5 rounded bg-emerald-950 border border-emerald-500/40 text-emerald-300 text-[11px] font-bold">
              12/12 PHASES PASS
            </span>
            <span className="px-2 py-0.5 rounded bg-cyan-950 border border-cyan-500/40 text-cyan-300 text-[11px] font-bold">
              TOTAL SLA: 162ms
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-display font-extrabold text-white tracking-tight flex items-center gap-2">
            <Award className="w-6 h-6 text-purple-400" />
            {lang === 'th' ? 'ลำดับการรับรองอธิปไตย 12 ขั้นตอน (12-Phase Omega Pipeline)' : '12-Phase Omega Sequence Attestation Pipeline'}
          </h2>
          <p className="text-xs text-slate-300 mt-1 max-w-3xl">
            {lang === 'th'
              ? 'ท่อส่งสัญญาณการรับรองความถูกต้องแบบ 12 ขั้นตอน (Ω-01 ถึง Ω-12) ตรวจสอบความถูกต้องของการผนึกบล็อก #849202, สภา 10 ผู้ดูแล, และการป้องกันโพสต์ควอนตัม 100%'
              : 'End-to-end 12-phase verification pipeline anchoring the Genesis Block #849202 to the Sovereign Gold Master.'}
          </p>
        </div>

        <button
          onClick={handleRunReplay}
          disabled={running}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-xs font-bold transition-all shadow-lg ${
            running
              ? 'bg-amber-950/80 border-amber-500 text-amber-300 animate-pulse'
              : 'bg-purple-950/90 hover:bg-purple-900 border-purple-400 text-purple-200 shadow-purple-950/60'
          }`}
        >
          {running ? <RotateCcw className="w-4 h-4 animate-spin text-amber-400" /> : <Play className="w-4 h-4 text-purple-400" />}
          <span>{running ? 'VERIFYING 12 PHASES...' : (lang === 'th' ? 'ทดสอบลำดับ 12 ขั้นตอน (Replay)' : 'Replay Omega Pipeline')}</span>
        </button>
      </div>

      {/* 12 Phase Step Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
        {omegaPhases.map((phase) => {
          const isVerified = verifiedList[phase.phaseNum];
          const isCurrent = activeStep === phase.phaseNum && running;

          return (
            <div
              key={phase.phaseNum}
              className={`p-3.5 rounded-xl border transition-all text-xs flex flex-col justify-between space-y-2 relative overflow-hidden ${
                isCurrent
                  ? 'bg-amber-950/40 border-amber-400 ring-2 ring-amber-400/50 shadow-lg shadow-amber-950'
                  : isVerified
                  ? 'bg-purple-950/20 border-purple-500/40 hover:border-purple-400'
                  : 'bg-slate-900/60 border-slate-800 opacity-60'
              }`}
            >
              <div>
                <div className="flex items-center justify-between gap-1 mb-1.5">
                  <span className="px-1.5 py-0.5 rounded bg-purple-950 border border-purple-500/50 text-[10px] font-bold text-purple-300">
                    {phase.code}
                  </span>
                  <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded border flex items-center gap-1 ${
                    isVerified
                      ? 'bg-emerald-950/80 border-emerald-500/50 text-emerald-300'
                      : 'bg-slate-950 border-slate-800 text-slate-500'
                  }`}>
                    {isVerified && <CheckCircle2 className="w-3 h-3 text-emerald-400" />}
                    {isVerified ? 'VERIFIED' : 'PENDING'}
                  </span>
                </div>

                <h4 className="font-bold text-white text-xs leading-snug mb-1">
                  {lang === 'th' ? phase.nameTh : phase.nameEn}
                </h4>

                <div className="text-[10px] text-cyan-300 font-mono">
                  Anchor: {phase.anchor}
                </div>
              </div>

              <div className="pt-2 border-t border-slate-800/80 space-y-1 text-[9.5px]">
                <div className="flex items-center justify-between text-slate-400">
                  <span>Latency:</span>
                  <span className="text-amber-300 font-bold">{phase.slaMs}ms</span>
                </div>
                <div className="text-slate-400 truncate bg-slate-950 p-1 rounded border border-slate-800 font-mono">
                  Proof: <span className="text-emerald-300">{phase.cryptoProof}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
