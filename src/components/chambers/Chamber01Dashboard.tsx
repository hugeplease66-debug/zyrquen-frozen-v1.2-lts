import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Lock, 
  Cpu, 
  Snowflake, 
  Flame, 
  Activity, 
  KeyRound, 
  Database, 
  Scale, 
  CheckCircle2, 
  AlertTriangle,
  Zap,
  Layers,
  FileCheck,
  Award,
  RefreshCw,
  Globe
} from 'lucide-react';
import { SYSTEM_METADATA, SOVEREIGN_PRINCIPAL, SMART_CONTRACT_VULNERABILITIES } from '../../data/canonicalData';
import { L00HardwareTelemetry } from '../telemetry/L00HardwareTelemetry';
import { ChamberRuntimeAtlas3D } from './ChamberRuntimeAtlas3D';
import { soundEngine } from '../../utils/audioSynth';

interface ChamberProps {
  lang: 'th' | 'en';
  openSentinelModal: () => void;
  openReplayModal: () => void;
  openCertificateModal: () => void;
  setActiveChamber: (num: number) => void;
}

export const Chamber01Dashboard: React.FC<ChamberProps> = ({
  lang,
  openSentinelModal,
  openReplayModal,
  openCertificateModal,
  setActiveChamber
}) => {
  const [copiedHash, setCopiedHash] = useState<string | null>(null);
  const [show3DAtlas, setShow3DAtlas] = useState<boolean>(false);

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedHash(label);
    soundEngine.playQuantumPing();
    setTimeout(() => setCopiedHash(null), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner: Sovereign Authority & Genesis Verification */}
      <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-slate-900 via-slate-950 to-cyan-950/60 border border-cyan-500/30 p-6 shadow-xl">
        <div className="absolute right-0 top-0 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-950 border border-emerald-500/40 text-emerald-300 text-xs font-mono-code font-bold flex items-center gap-1.5">
                <Lock className="w-3 h-3" />
                {SYSTEM_METADATA.status}
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-cyan-950 border border-cyan-500/40 text-cyan-300 text-xs font-mono-code">
                {SYSTEM_METADATA.platformBoundary}
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-amber-950 border border-amber-500/40 text-amber-300 text-xs font-mono-code">
                NIST PQC: Dilithium-5 (ML-DSA-87)
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-display font-bold text-white tracking-tight">
              {lang === 'th' ? 'แกนกลางควบคุมอธิปไตยดิจิทัล ZYRQUEN Ω∞' : 'ZYRQUEN Ω∞ Sovereign Kernel & Truth Matrix'}
            </h2>
            <p className="text-sm text-slate-300 max-w-3xl leading-relaxed">
              {lang === 'th' 
                ? 'ระบบประมวลผลความจริงเอกภาพ บันทึกและยืนยันธุรกรรมดิจิทัล 14,902 ซีล บนบล็อก #849202 พร้อมฉันทามติ 10/10 REAL_HSM และสอดคล้องตาม พ.ร.บ.ธุรกรรมฯ มาตรา 9, 26, 28 โดยสมบูรณ์'
                : 'Sovereign World Engine anchoring 14,902 canonical seals at block #849202 with 10/10 REAL_HSM deca-key consensus and full Thai ETDA Section 9, 26, 28 legal admissibility.'}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
            <button
              onClick={() => setActiveChamber(0)}
              className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-gradient-to-r from-cyan-600 via-blue-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500 text-white font-bold text-xs font-display shadow-lg shadow-cyan-950 transition-all ring-1 ring-cyan-300"
            >
              <Globe className="w-4 h-4 text-cyan-200 animate-spin" />
              {lang === 'th' ? 'สมองกลางสหพันธรัฐ (MASTER CONSOLE)' : 'FEDERATION MASTER CONSOLE'}
            </button>
            <button
              onClick={openCertificateModal}
              className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-slate-950 font-bold text-xs font-display shadow-lg shadow-amber-950 transition-all"
            >
              <Award className="w-4 h-4" />
              {lang === 'th' ? 'ใบรับรองทองคำ (GOLD MASTER)' : 'GOLD MASTER CERTIFICATE'}
            </button>
            <button
              onClick={openSentinelModal}
              className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-red-950/80 hover:bg-red-900 border border-red-500/50 text-red-200 font-semibold text-xs transition-all"
            >
              <Zap className="w-4 h-4 text-red-400" />
              {lang === 'th' ? 'ทดสอบ Sentinel AI' : 'TEST SENTINEL AI'}
            </button>
          </div>
        </div>

        {/* Sovereign Architect Badge */}
        <div className="mt-6 pt-4 border-t border-slate-800/80 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs">
          <div>
            <span className="text-slate-400 block">{lang === 'th' ? 'สถาปนิกอธิปไตยสูงสุด' : 'Sovereign Principal'}:</span>
            <span className="text-white font-semibold flex items-center gap-1.5 mt-0.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              {SOVEREIGN_PRINCIPAL.nameTh} ({SOVEREIGN_PRINCIPAL.id})
            </span>
          </div>
          <div>
            <span className="text-slate-400 block">{lang === 'th' ? 'ระดับสิทธิ์การเข้าถึง' : 'Clearance Level'}:</span>
            <span className="text-emerald-400 font-mono-code font-bold mt-0.5 block">
              {SOVEREIGN_PRINCIPAL.clearance} SUPREME CLEARANCE
            </span>
          </div>
          <div>
            <span className="text-slate-400 block">{lang === 'th' ? 'อำนาจแก้ไขแกนกลาง' : 'Mutation Authority'}:</span>
            <span className="text-cyan-400 font-mono-code font-bold mt-0.5 block">
              0 (Δ0.0% INVOLATILE SSoT)
            </span>
          </div>
          <div>
            <span className="text-slate-400 block">{lang === 'th' ? 'มาตรฐานฮาร์ดแวร์ HSM' : 'Hardware HSM Standard'}:</span>
            <span className="text-purple-300 font-semibold mt-0.5 block">
              FIPS 140-3 Level 4 Tamper Foil
            </span>
          </div>
        </div>
      </div>

      {/* 4 Core Telemetry Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Canonical Seals */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 relative overflow-hidden group hover:border-cyan-500/40 transition-all">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-slate-400 font-medium">
              {lang === 'th' ? 'ซีลอธิปไตยแท้ (CANONICAL SEALS)' : 'CANONICAL SEALS'}
            </span>
            <Lock className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-display font-bold text-white tracking-tight font-mono-code">
              {SYSTEM_METADATA.canonicalSeals.toLocaleString()}
            </span>
            <span className="text-xs text-emerald-400 font-mono-code font-semibold">100% FROZEN</span>
          </div>
          <div className="mt-3 text-xs text-slate-400 flex items-center justify-between border-t border-slate-800 pt-2 font-mono-code">
            <span>Raw Observed: {SYSTEM_METADATA.rawObservedSeals}</span>
            <span className="text-red-400 font-semibold cursor-pointer hover:underline" onClick={() => setActiveChamber(2)}>
              Quarantine: {SYSTEM_METADATA.quarantinedSeals}
            </span>
          </div>
        </div>

        {/* Card 2: Quantum Telemetry & QOps */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 relative overflow-hidden group hover:border-cyan-500/40 transition-all">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-slate-400 font-medium">
              {lang === 'th' ? 'อัตราควอนตัม (QOPS & COHERENCE)' : 'QUANTUM OPS & COHERENCE'}
            </span>
            <Cpu className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-display font-bold text-cyan-300 tracking-tight font-mono-code">
              {SYSTEM_METADATA.telemetry.qops}
            </span>
            <span className="text-xs text-cyan-400 font-mono-code">QOps/s</span>
          </div>
          <div className="mt-3 text-xs text-slate-400 flex items-center justify-between border-t border-slate-800 pt-2 font-mono-code">
            <span>Coherence: <strong className="text-emerald-400">{SYSTEM_METADATA.telemetry.coherence}%</strong></span>
            <span>Latency: {SYSTEM_METADATA.telemetry.kernelLatency}</span>
          </div>
        </div>

        {/* Card 3: Cryogenic Vault Temperature */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 relative overflow-hidden group hover:border-cyan-500/40 transition-all">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-slate-400 font-medium">
              {lang === 'th' ? 'อุณหภูมิตู้นิรภัยความเย็นยิ่งยวด' : 'SUBZERO CRYO VAULT'}
            </span>
            <Snowflake className="w-4 h-4 text-teal-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-display font-bold text-teal-300 tracking-tight font-mono-code">
              14.98
            </span>
            <span className="text-xs text-teal-400 font-mono-code">mK (Superfluid)</span>
          </div>
          <div className="mt-3 text-xs text-slate-400 flex items-center justify-between border-t border-slate-800 pt-2 font-mono-code">
            <span>Coolant: {SYSTEM_METADATA.telemetry.heliumFlow}</span>
            <span className="text-emerald-400 font-semibold">Stable</span>
          </div>
        </div>

        {/* Card 4: 10/10 HSM Quorum Deca-Key */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 relative overflow-hidden group hover:border-cyan-500/40 transition-all">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-slate-400 font-medium">
              {lang === 'th' ? 'ฉันทามติสภา HSM (DECA-KEY)' : 'HSM QUORUM CONSENSUS'}
            </span>
            <KeyRound className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-display font-bold text-emerald-300 tracking-tight font-mono-code">
              10 / 10
            </span>
            <span className="text-xs text-emerald-400 font-mono-code">UNANIMOUS</span>
          </div>
          <div className="mt-3 text-xs text-slate-400 flex items-center justify-between border-t border-slate-800 pt-2 font-mono-code">
            <span>TC-01..TC-10 Active</span>
            <span className="text-cyan-400 cursor-pointer hover:underline" onClick={() => setActiveChamber(5)}>
              Inspect Mesh &rarr;
            </span>
          </div>
        </div>
      </div>

      {/* L00 Hardware Telemetry Circular Gauge Cluster */}
      <L00HardwareTelemetry lang={lang} />

      {/* 3D Holographic Chamber Atlas Card */}
      <div className="bg-slate-900/90 border border-violet-500/40 rounded-xl p-5 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full bg-violet-950 border border-violet-500/50 text-violet-300 text-xs font-mono-code font-bold flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-violet-400" />
                3D CHAMBER RUNTIME ATLAS
              </span>
              <span className="px-2 py-0.5 rounded bg-cyan-950 border border-cyan-500/40 text-cyan-300 text-[11px] font-mono-code font-bold">
                REACT-THREE-FIBER
              </span>
            </div>
            <h3 className="font-display font-bold text-white text-base">
              {lang === 'th' ? 'แบบจำลองสถาปัตยกรรมห้องปฏิบัติการ 3 มิติ (Hologram Deck)' : 'Interactive 3D Chamber Hologram Deck'}
            </h3>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setShow3DAtlas(!show3DAtlas);
                soundEngine.playQuantumPing();
              }}
              className="px-3.5 py-1.5 rounded-lg bg-violet-950/80 hover:bg-violet-900 border border-violet-400/50 text-violet-200 text-xs font-bold transition-all shadow-md flex items-center gap-1.5"
            >
              <Globe className="w-3.5 h-3.5 text-violet-300" />
              <span>{show3DAtlas ? (lang === 'th' ? 'ซ่อนแบบจำลอง 3D' : 'Hide 3D Atlas') : (lang === 'th' ? 'เปิดแบบจำลอง 3D' : 'Launch 3D Atlas')}</span>
            </button>
            <button
              onClick={() => soundEngine.playMooSound()}
              className="px-3 py-1.5 rounded-lg bg-slate-950 hover:bg-slate-800 border border-amber-500/40 text-amber-300 text-xs font-bold transition-all"
              title="Moo Audio"
            >
              Moo 🐃
            </button>
          </div>
        </div>

        {show3DAtlas && (
          <div className="pt-2">
            <ChamberRuntimeAtlas3D />
          </div>
        )}
      </div>

      {/* Main Grid: Cryptographic Roots & Legal Compliance Matrix */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Cryptographic Genesis Roots & Security Integrity */}
        <div className="lg:col-span-2 space-y-6">
          {/* Genesis Merkle Roots Box */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-display font-bold text-white text-base flex items-center gap-2">
                <Database className="w-4 h-4 text-cyan-400" />
                {lang === 'th' ? 'รากฐานการเข้ารหัสและ Merkle Roots (SSoT Invariants)' : 'Cryptographic Genesis & Merkle Roots'}
              </h3>
              <span className="text-xs px-2 py-0.5 rounded bg-emerald-950 border border-emerald-500/30 text-emerald-300 font-mono-code font-semibold">
                Δ0.0% DRIFT
              </span>
            </div>

            {/* Root 1: Genesis Root */}
            <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400 font-semibold">Genesis Merkle Root Hash:</span>
                <button
                  onClick={() => copyToClipboard(SYSTEM_METADATA.genesisMerkleRoot, 'genesis')}
                  className="text-cyan-400 hover:text-cyan-300 text-[11px] font-mono-code"
                >
                  {copiedHash === 'genesis' ? '✓ Copied!' : 'Copy Hash'}
                </button>
              </div>
              <p className="font-mono-code text-xs text-slate-200 break-all bg-slate-900/70 p-2 rounded border border-slate-800/80">
                {SYSTEM_METADATA.genesisMerkleRoot}
              </p>
            </div>

            {/* Root 2: Council Archive Root */}
            <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400 font-semibold">Council Archive Root Hash:</span>
                <button
                  onClick={() => copyToClipboard(SYSTEM_METADATA.councilMerkleRoot, 'council')}
                  className="text-cyan-400 hover:text-cyan-300 text-[11px] font-mono-code"
                >
                  {copiedHash === 'council' ? '✓ Copied!' : 'Copy Hash'}
                </button>
              </div>
              <p className="font-mono-code text-xs text-slate-200 break-all bg-slate-900/70 p-2 rounded border border-slate-800/80">
                {SYSTEM_METADATA.councilMerkleRoot}
              </p>
            </div>

            {/* Root 3: Unifying Audit Hash */}
            <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400 font-semibold">Unifying Forensic Audit Digest:</span>
                <button
                  onClick={() => copyToClipboard(SYSTEM_METADATA.unifyingAuditHash, 'audit')}
                  className="text-cyan-400 hover:text-cyan-300 text-[11px] font-mono-code"
                >
                  {copiedHash === 'audit' ? '✓ Copied!' : 'Copy Hash'}
                </button>
              </div>
              <p className="font-mono-code text-xs text-slate-200 break-all bg-slate-900/70 p-2 rounded border border-slate-800/80">
                {SYSTEM_METADATA.unifyingAuditHash}
              </p>
            </div>
          </div>

          {/* 5 Security Promotion Gates (G11 - G15) */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 space-y-4">
            <h3 className="font-display font-bold text-white text-base flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              {lang === 'th' ? 'ประตูด่านความปลอดภัย 5 ชั้น (Security Gates G11–G15)' : '5 Sovereign Security Promotion Gates'}
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              <div className="bg-slate-950 p-3 rounded-lg border border-emerald-500/20">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-mono-code text-xs font-bold text-cyan-300">GATE G11</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-400 font-bold">100% PASS</span>
                </div>
                <div className="text-xs font-medium text-white">Custodian Quorum Lock</div>
                <div className="text-[11px] text-slate-400 mt-1">10/10 REAL_HSM FIPS 140-3 L4</div>
              </div>

              <div className="bg-slate-950 p-3 rounded-lg border border-emerald-500/20">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-mono-code text-xs font-bold text-cyan-300">GATE G12</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-400 font-bold">100% PASS</span>
                </div>
                <div className="text-xs font-medium text-white">Root Provenance Verifier</div>
                <div className="text-[11px] text-slate-400 mt-1">Merkle Match 909ab814...</div>
              </div>

              <div className="bg-slate-950 p-3 rounded-lg border border-emerald-500/20">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-mono-code text-xs font-bold text-cyan-300">GATE G13</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-400 font-bold">100% PASS</span>
                </div>
                <div className="text-xs font-medium text-white">Promotion Safety Gate</div>
                <div className="text-[11px] text-slate-400 mt-1">Gold Master 14,902 Seals</div>
              </div>

              <div className="bg-slate-950 p-3 rounded-lg border border-emerald-500/20">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-mono-code text-xs font-bold text-cyan-300">GATE G14</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-400 font-bold">100% PASS</span>
                </div>
                <div className="text-xs font-medium text-white">Air-Gapped Sovereign Build</div>
                <div className="text-[11px] text-slate-400 mt-1">Dual-Signer Dilithium-5</div>
              </div>

              <div className="bg-slate-950 p-3 rounded-lg border border-emerald-500/20">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-mono-code text-xs font-bold text-cyan-300">GATE G15</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-400 font-bold">100% PASS</span>
                </div>
                <div className="text-xs font-medium text-white">Zero-State Replay Audit</div>
                <div className="text-[11px] text-slate-400 mt-1">Deterministic in 142.0ms</div>
              </div>

              <div className="bg-slate-950 p-3 rounded-lg border border-cyan-500/20 flex flex-col justify-center items-center text-center">
                <span className="text-xs font-mono-code text-cyan-300 font-bold">ALL GATES VERIFIED</span>
                <span className="text-[11px] text-slate-400">Zero Mutation Delta (Δ0)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Col: Legal Compliance & Quick Action Panels */}
        <div className="space-y-6">
          {/* Thai Law ETDA & PDPA Matrix */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-display font-bold text-white text-base flex items-center gap-2">
                <Scale className="w-4 h-4 text-amber-400" />
                {lang === 'th' ? 'การรับรองกฎหมายไทย (ETDA & PDPA)' : 'Thai Legal Compliance Matrix'}
              </h3>
              <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-500/30 font-bold">
                100% GREEN
              </span>
            </div>

            <div className="space-y-2.5 text-xs">
              <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
                <div className="flex items-center justify-between text-emerald-400 font-semibold mb-1">
                  <span>พ.ร.บ.ธุรกรรมฯ มาตรา 9</span>
                  <span>✓ PASSED</span>
                </div>
                <p className="text-slate-400 text-[11px]">
                  {lang === 'th'
                    ? 'ลายมือชื่ออิเล็กทรอนิกส์มีผลผูกพันตามกฎหมาย (Dilithium-5 / FIPS 204)'
                    : 'Electronic signature validity and legal binding enforcement.'}
                </p>
              </div>

              <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
                <div className="flex items-center justify-between text-emerald-400 font-semibold mb-1">
                  <span>พ.ร.บ.ธุรกรรมฯ มาตรา 26</span>
                  <span>✓ PASSED</span>
                </div>
                <p className="text-slate-400 text-[11px]">
                  {lang === 'th'
                    ? 'ลายมือชื่ออิเล็กทรอนิกส์ที่เชื่อถือได้ พร้อมหลักฐานควบคุมโดยผู้ลงนามฝ่ายเดียว'
                    : 'Trustworthy e-signature under sole custodian control.'}
                </p>
              </div>

              <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
                <div className="flex items-center justify-between text-emerald-400 font-semibold mb-1">
                  <span>พ.ร.บ.ธุรกรรมฯ มาตรา 28</span>
                  <span>✓ PASSED</span>
                </div>
                <p className="text-slate-400 text-[11px]">
                  {lang === 'th'
                    ? 'ใบรับรองที่ออกโดยผู้ให้บริการออกใบรับรอง (CA Safe Harbor 100%)'
                    : 'Certified Authority safe harbor verification.'}
                </p>
              </div>

              <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
                <div className="flex items-center justify-between text-emerald-400 font-semibold mb-1">
                  <span>พ.ร.บ.คุ้มครองข้อมูลส่วนบุคคล (PDPA)</span>
                  <span>✓ PASSED</span>
                </div>
                <p className="text-slate-400 text-[11px]">
                  {lang === 'th'
                    ? 'การเข้ารหัสข้อมูลระดับ Quantum, การคุ้มครองสิทธิ์ และการเก็บพยานหลักฐานโดยไม่ละเมิดสิทธิส่วนบุคคล'
                    : 'Full post-quantum privacy, consent verification, and audit trace.'}
                </p>
              </div>
            </div>
          </div>

          {/* Smart Contract V2 Remediation Audit (ZYR-01..ZYR-05) */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-display font-bold text-white text-sm flex items-center gap-2">
                <FileCheck className="w-4 h-4 text-cyan-400" />
                {lang === 'th' ? 'การแก้ไขช่องโหว่ Smart Contract V2' : 'Smart Contract V2 Audit Fixes'}
              </h3>
              <span className="text-[10px] text-cyan-400 font-mono-code font-bold">5/5 FIXED</span>
            </div>

            <div className="space-y-1.5 text-xs">
              {SMART_CONTRACT_VULNERABILITIES.map((vuln) => (
                <div key={vuln.id} className="bg-slate-950 p-2 rounded border border-slate-800/80 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono-code font-bold text-cyan-400 text-[11px]">{vuln.id}</span>
                    <span className="text-slate-300 text-[11px] truncate max-w-[180px]">{vuln.title}</span>
                  </div>
                  <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-950 text-emerald-300 font-bold shrink-0">
                    PASSED
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
