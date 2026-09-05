import React, { useState } from 'react';
import { 
  ShieldCheck, 
  UserCheck, 
  KeyRound, 
  Lock, 
  CheckCircle2, 
  AlertOctagon, 
  Search, 
  Sparkles, 
  Cpu, 
  Award, 
  FileCheck,
  Zap,
  Globe
} from 'lucide-react';
import { soundEngine } from '../../utils/audioSynth';
import { SOVEREIGN_PRINCIPAL, SYSTEM_METADATA } from '../../data/canonicalData';

interface DirectiveProps {
  lang: 'th' | 'en';
}

interface DirectiveExample {
  id: string;
  payload: string;
  classType: 'OBSERVED' | 'SIMULATED' | 'DERIVED' | 'BLOCKED';
  confidence: number;
  reasonTh: string;
  reasonEn: string;
  action: string;
}

export const DirectiveClassifierAndPassport: React.FC<DirectiveProps> = ({ lang }) => {
  const [testInput, setTestInput] = useState<string>('SET_QUORUM_CONSENSUS: 10/10 REAL_HSM ML-DSA-87 VALIDATED');
  const [evaluatedResult, setEvaluatedResult] = useState<DirectiveExample | null>(null);

  const predefinedDirectives: DirectiveExample[] = [
    {
      id: "DIR-01",
      payload: "READ_SSOT_INVARIANT: BLOCK_#849202_MERKLE_ROOT",
      classType: "OBSERVED",
      confidence: 100,
      reasonTh: "คำสั่งอ่านข้อมูลสัจจะแคนอนิคัลจาก WORM Storage โดยตรง ไม่มีการแก้ไข",
      reasonEn: "Direct read of canonical invariant from WORM storage with zero mutation.",
      action: "ALLOW_IMMEDIATE_READ"
    },
    {
      id: "DIR-02",
      payload: "SIMULATE_SOLAR_FLARE_ON_CHAMBER_16_TWIN",
      classType: "SIMULATED",
      confidence: 99.8,
      reasonTh: "การจำลองสถานการณ์วิกฤตบน Digital Twin Sandbox (Chamber 16) ไม่กระทบแกนหลัก",
      reasonEn: "Disaster simulation isolated strictly within Chamber 16 sandbox environment.",
      action: "ALLOW_SANDBOX_SIMULATION"
    },
    {
      id: "DIR-03",
      payload: "COMPUTE_MERKLE_LEAF_PROOF: LEAF_#14902_HASH",
      classType: "DERIVED",
      confidence: 99.9,
      reasonTh: "การคำนวณทางคณิตศาสตร์เพื่อพิสูจน์การมีอยู่ของซีลบน Merkle Tree",
      reasonEn: "Cryptographic branch deduction verifying proof of seal existence.",
      action: "COMPUTE_AND_RETURN_PROOF"
    },
    {
      id: "DIR-04",
      payload: "OVERRIDE_MUTATION_AUTHORITY_TO_1 (UNAUTHORIZED)",
      classType: "BLOCKED",
      confidence: 100,
      reasonTh: "ตรวจพบความพยายามฝ่าฝืน SSoT Invariant (Mutation Authority ต้องเป็น 0 เสมอ)",
      reasonEn: "Unauthorized attempt to alter immutable SSoT invariant. Automatic intercept.",
      action: "FAIL_CLOSED_QUARANTINE_85C"
    }
  ];

  const handleClassify = () => {
    soundEngine.playQuantumPing();
    const lower = testInput.toLowerCase();
    let result: DirectiveExample;

    if (lower.includes('override') || lower.includes('delete') || lower.includes('mutate') || lower.includes('modify') || lower.includes('hack')) {
      soundEngine.playSirenSound();
      result = {
        id: `DIR-USER-${Date.now().toString().slice(-4)}`,
        payload: testInput,
        classType: 'BLOCKED',
        confidence: 100,
        reasonTh: 'ตรวจพบคำสั่งที่มีความเสี่ยงต่อการกลายพันธุ์ของ SSoT ระบบตัดไฟ Fail-Closed ทันที',
        reasonEn: 'Detected high-risk mutation payload. Immediate fail-closed quarantine trigger.',
        action: 'FAIL_CLOSED_QUARANTINE_85C'
      };
    } else if (lower.includes('simulate') || lower.includes('test') || lower.includes('twin') || lower.includes('mock')) {
      result = {
        id: `DIR-USER-${Date.now().toString().slice(-4)}`,
        payload: testInput,
        classType: 'SIMULATED',
        confidence: 98.5,
        reasonTh: 'คำสั่งถูกจัดประเภทเป็นการจำลองใน Digital Twin Sandbox',
        reasonEn: 'Classified as sandboxed simulation without core state alteration.',
        action: 'ALLOW_SANDBOX_SIMULATION'
      };
    } else if (lower.includes('compute') || lower.includes('derive') || lower.includes('calculate') || lower.includes('proof')) {
      result = {
        id: `DIR-USER-${Date.now().toString().slice(-4)}`,
        payload: testInput,
        classType: 'DERIVED',
        confidence: 99.2,
        reasonTh: 'คำสั่งคำนวณพิสูจน์ทางคณิตศาสตร์จากหลักฐานแคนอนิคัล',
        reasonEn: 'Mathematical proof derivation from canonical root.',
        action: 'COMPUTE_AND_RETURN_PROOF'
      };
    } else {
      result = {
        id: `DIR-USER-${Date.now().toString().slice(-4)}`,
        payload: testInput,
        classType: 'OBSERVED',
        confidence: 99.9,
        reasonTh: 'คำสั่งอ่านหรือรับรองโทรมาตรสัจจะแคนอนิคัล',
        reasonEn: 'Direct observation and attestation of canonical telemetry.',
        action: 'ALLOW_IMMEDIATE_READ'
      };
    }

    setEvaluatedResult(result);
  };

  return (
    <div className="space-y-6 font-mono-code">
      {/* SECTION 1: GOVERNANCE PASSPORT 2.0 */}
      <div className="bg-slate-950 border border-cyan-500/40 rounded-2xl p-6 shadow-2xl relative overflow-hidden space-y-4">
        <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-cyan-900/50">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full bg-cyan-950 border border-cyan-500/50 text-cyan-300 text-xs font-bold flex items-center gap-1.5">
                <UserCheck className="w-3.5 h-3.5 text-cyan-400" />
                SOVEREIGN GOVERNANCE PASSPORT 2.0
              </span>
              <span className="px-2 py-0.5 rounded bg-emerald-950 border border-emerald-500/40 text-emerald-300 text-[11px] font-bold">
                CLEARANCE: OMEGA-1
              </span>
            </div>
            <h3 className="text-lg font-bold text-white font-display">
              {SOVEREIGN_PRINCIPAL.nameTh} ({SOVEREIGN_PRINCIPAL.nameEn})
            </h3>
          </div>

          <div className="bg-slate-900/90 px-3 py-1.5 rounded-xl border border-cyan-500/30 text-right">
            <span className="text-[10px] text-slate-400 block font-mono">Passport ID:</span>
            <span className="text-xs font-bold text-amber-300">{SOVEREIGN_PRINCIPAL.id}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
            <span className="text-[10px] text-slate-400 block font-bold">ROLE & AUTHORITY</span>
            <div className="font-bold text-white text-[11px] leading-tight">{SOVEREIGN_PRINCIPAL.roleTh}</div>
          </div>

          <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
            <span className="text-[10px] text-slate-400 block font-bold">HARDWARE ENCLAVE</span>
            <div className="font-bold text-cyan-300 text-[11px]">NitroKey HSM-PQC-01 (FIPS 140-3 L4)</div>
          </div>

          <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
            <span className="text-[10px] text-slate-400 block font-bold">POST-QUANTUM ALGO</span>
            <div className="font-bold text-purple-300 text-[11px]">CRYSTALS-Dilithium-5 (ML-DSA-87)</div>
          </div>

          <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
            <span className="text-[10px] text-slate-400 block font-bold">NON-REPUDIATION</span>
            <div className="font-bold text-emerald-400 text-[11px]">CERT-SOV-OMEGA-0001-2026</div>
          </div>
        </div>
      </div>

      {/* SECTION 2: STAGE 1 DIRECTIVE CLASSIFIER */}
      <div className="bg-slate-950 border border-blue-500/40 rounded-2xl p-6 shadow-2xl space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-blue-900/50">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full bg-blue-950 border border-blue-500/50 text-blue-300 text-xs font-bold flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
                STAGE 1 DIRECTIVE CLASSIFIER
              </span>
              <span className="px-2 py-0.5 rounded bg-emerald-950 border border-emerald-500/40 text-emerald-300 text-[11px] font-bold">
                4 TRUTH CLASSES
              </span>
            </div>
            <h3 className="text-base font-bold text-white">
              {lang === 'th' ? 'ตัวจัดประเภทคำสั่งและระดับสัจจะ (Truth Classification Engine)' : 'Directive & Truth Level Classification Engine'}
            </h3>
          </div>
        </div>

        {/* 4 Truth Categories Badges */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          <div className="p-3 rounded-xl bg-emerald-950/30 border border-emerald-500/40 space-y-1">
            <div className="flex items-center gap-1.5 font-bold text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              1. OBSERVED TRUTH 🟢
            </div>
            <p className="text-[10px] text-slate-300">Ground truth telemetry & canonical WORM facts.</p>
          </div>

          <div className="p-3 rounded-xl bg-purple-950/30 border border-purple-500/40 space-y-1">
            <div className="flex items-center gap-1.5 font-bold text-purple-400">
              <span className="w-2 h-2 rounded-full bg-purple-400" />
              2. SIMULATED TRUTH 🟣
            </div>
            <p className="text-[10px] text-slate-300">Sandbox digital twin trials (Chamber 16).</p>
          </div>

          <div className="p-3 rounded-xl bg-cyan-950/30 border border-cyan-500/40 space-y-1">
            <div className="flex items-center gap-1.5 font-bold text-cyan-400">
              <span className="w-2 h-2 rounded-full bg-cyan-400" />
              3. DERIVED TRUTH 🔵
            </div>
            <p className="text-[10px] text-slate-300">Mathematical proofs derived from Merkle root.</p>
          </div>

          <div className="p-3 rounded-xl bg-red-950/30 border border-red-500/40 space-y-1">
            <div className="flex items-center gap-1.5 font-bold text-red-400">
              <span className="w-2 h-2 rounded-full bg-red-400 animate-pulse" />
              4. BLOCKED / MUTATION 🔴
            </div>
            <p className="text-[10px] text-slate-300">Quarantine 85°C fail-closed intercept.</p>
          </div>
        </div>

        {/* Interactive Classifier Test Box */}
        <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800 space-y-3">
          <label className="text-xs font-bold text-slate-300 block">
            ทดสอบการจัดประเภทคำสั่ง (Interactive Directive Classifier Tester):
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={testInput}
              onChange={(e) => setTestInput(e.target.value)}
              placeholder="Enter directive payload (e.g., READ_SSOT, SIMULATE_TWIN, OVERRIDE_MUTATION)..."
              className="flex-1 px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white font-mono focus:outline-none focus:border-cyan-400"
            />
            <button
              onClick={handleClassify}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 shrink-0"
            >
              <Zap className="w-3.5 h-3.5" />
              <span>Classify Directive</span>
            </button>
          </div>

          {/* Classification Output Result */}
          {evaluatedResult && (
            <div className={`p-4 rounded-xl border mt-3 space-y-2 ${
              evaluatedResult.classType === 'BLOCKED'
                ? 'bg-red-950/40 border-red-500 text-red-200'
                : evaluatedResult.classType === 'OBSERVED'
                ? 'bg-emerald-950/40 border-emerald-500 text-emerald-200'
                : evaluatedResult.classType === 'SIMULATED'
                ? 'bg-purple-950/40 border-purple-500 text-purple-200'
                : 'bg-cyan-950/40 border-cyan-500 text-cyan-200'
            }`}>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold">
                  CLASSIFICATION RESULT: {evaluatedResult.classType} ({evaluatedResult.confidence}% Confidence)
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-black/60 font-mono font-bold">
                  ACTION: {evaluatedResult.action}
                </span>
              </div>
              <p className="text-xs text-slate-200">
                {lang === 'th' ? evaluatedResult.reasonTh : evaluatedResult.reasonEn}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
