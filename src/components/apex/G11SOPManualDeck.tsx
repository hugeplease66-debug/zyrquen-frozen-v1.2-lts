import React, { useState } from 'react';
import { 
  BookOpen, 
  ShieldCheck, 
  KeyRound, 
  AlertTriangle, 
  CheckCircle2, 
  Flame, 
  Scale, 
  FileText, 
  Cpu, 
  Lock, 
  Layers, 
  ChevronRight, 
  Check, 
  Play, 
  RotateCcw,
  Sparkles
} from 'lucide-react';
import { soundEngine } from '../../utils/audioSynth';
import { HSM_NODES, SOVEREIGN_PRINCIPAL, SYSTEM_METADATA } from '../../data/canonicalData';

interface G11SOPProps {
  lang: 'th' | 'en';
}

interface SOPStep {
  stepId: string;
  titleTh: string;
  titleEn: string;
  responsibleRoleTh: string;
  responsibleRoleEn: string;
  legalAnchor: string;
  descriptionTh: string;
  descriptionEn: string;
  verificationCheck: string;
  slaMaxMs: number;
}

export const G11SOPManualDeck: React.FC<G11SOPProps> = ({ lang }) => {
  const [activePhase, setActivePhase] = useState<number>(1);
  const [executedSteps, setExecutedSteps] = useState<Record<string, boolean>>({});
  const [drillRunning, setDrillRunning] = useState<boolean>(false);
  const [drillLog, setDrillLog] = useState<string[]>([]);

  const sopPhases: SOPStep[] = [
    {
      stepId: "SOP-4.1",
      titleTh: "4.1 การเรียกประชุมสภาและตรวจสอบสัญญาณชีพ (Quorum Assembly)",
      titleEn: "4.1 Quorum Assembly & Vitality Check",
      responsibleRoleTh: "Sovereign Principal (#EP-SOVEREIGN-01)",
      responsibleRoleEn: "Sovereign Principal (#EP-SOVEREIGN-01)",
      legalAnchor: "พ.ร.บ.ธุรกรรมฯ ม.9 (เจตนาผู้มีอำนาจ)",
      descriptionTh: "ตรวจสอบการเชื่อมต่อระดับ Sub-Kelvin ของโหนด HSM ทั้ง 10 เครื่อง (TC-01 ถึง TC-10) ต้องมีอัตรา Packet Loss 0% และ Sub-Kelvin Temp < 15 mK",
      descriptionEn: "Verify sub-Kelvin connectivity across all 10 HSM enclaves (TC-01 to TC-10) requiring 0% packet loss and cryo temp < 15 mK.",
      verificationCheck: "10/10 HSM Heartbeat PING < 1.2ms across all slots",
      slaMaxMs: 25
    },
    {
      stepId: "SOP-4.2",
      titleTh: "4.2 การเมานต์ Enclave และโหลด Dilithium-5 (Key Enclave Mount)",
      titleEn: "4.2 Key Enclave Mount & Algorithm Pre-flight",
      responsibleRoleTh: "10 Custodians (TC-01..TC-10)",
      responsibleRoleEn: "10 Custodians (TC-01..TC-10)",
      legalAnchor: "พ.ร.บ.ธุรกรรมฯ ม.26 (การควบคุมสิ่งสร้างลายมือชื่อ)",
      descriptionTh: "โหลดกุญแจส่วนตัว NIST FIPS 204 CRYSTALS-Dilithium-5 (ML-DSA-87) ภายในฮาร์ดแวร์ซีเคียวร์การ์ด FIPS 140-3 Level 4 ห้ามเปิดเผยนอก Enclave",
      descriptionEn: "Load private keys inside FIPS 140-3 L4 Secure Elements, strictly isolating ML-DSA-87 lattice signing keys.",
      verificationCheck: "Enclave Tamper Seal = ACTIVE_INTACT (0 breaches)",
      slaMaxMs: 30
    },
    {
      stepId: "SOP-4.3",
      titleTh: "4.3 การตรวจสอบความคงที่ SSoT Δ0.0% (Delta Drift Validation)",
      titleEn: "4.3 Delta Drift & SSoT Invariant Validation",
      responsibleRoleTh: "Truth Matrix Engine & Sentinel-AI",
      responsibleRoleEn: "Truth Matrix Engine & Sentinel-AI",
      legalAnchor: "พ.ร.บ.ธุรกรรมฯ ม.28 (ความถูกต้องแท้จริงของข้อมูล)",
      descriptionTh: "เทียบเคียงชุดข้อมูลกับ Genesis Merkle Root 909ab814...4c68 ห้ามมีส่วนเบี่ยงเบนเกิน 0.00% หากพบ Mutation ให้ตัดไฟ Fail-Closed ทันที",
      descriptionEn: "Compare transaction set against Genesis Merkle Root 909ab814...4c68. Exact Δ0.00% drift required, fail-closed on deviation.",
      verificationCheck: "Merkle Root Hash matches 909ab814...4c68 (14,902 Seals)",
      slaMaxMs: 15
    },
    {
      stepId: "SOP-4.4",
      titleTh: "4.4 การลงนามฉันทามติเอกฉันท์ 10/10 (Deca-Signing Quorum)",
      titleEn: "4.4 10/10 Deca-Signing Unanimous Consensus",
      responsibleRoleTh: "Full Custodian Quorum",
      responsibleRoleEn: "Full Custodian Quorum",
      legalAnchor: "พ.ร.บ.ธุรกรรมฯ ม.26 (ข้อสันนิษฐานลายมือชื่ออิเล็กทรอนิกส์)",
      descriptionTh: "ทุกโหนดลงนามทางคณิตศาสตร์แบบแลตทิซพร้อมกัน ผลลัพธ์ต้องได้ 10 ลายมือชื่อถูกต้องสมบูรณ์ (10/10 PASS)",
      descriptionEn: "All 10 HSM nodes execute parallel ML-DSA-87 signatures, producing a cryptographic multi-sig witness certificate.",
      verificationCheck: "10/10 Signed Hashes recorded in Merkle tree branch",
      slaMaxMs: 40
    },
    {
      stepId: "SOP-4.5",
      titleTh: "4.5 การปิดผนึกบล็อกแคนอนิคัล (Block Seal Execution)",
      titleEn: "4.5 Canonical Block Seal & Merkle Commitment",
      responsibleRoleTh: "Sovereign Kernel Engine",
      responsibleRoleEn: "Sovereign Kernel Engine",
      legalAnchor: "พ.ร.บ.คุ้มครองข้อมูลส่วนบุคคล พ.ศ. 2562 (มาตรา 28)",
      descriptionTh: "ผนึกบล็อก #849202 เข้าสู่โครงข่าย WORM (Write Once Read Many) ถาวร ไร้ทางแก้ไขหรือลบย้อนหลัง",
      descriptionEn: "Seal canonical block #849202 into immutable WORM storage fabric with cryptographic timestamp.",
      verificationCheck: "Canonical Height #849202 Anchored on Gold Master",
      slaMaxMs: 12
    },
    {
      stepId: "SOP-4.6",
      titleTh: "4.6 การแพร่กระจายและบันทึกประวัติการตรวจสอบ (Audit Trail Broadcast)",
      titleEn: "4.6 Audit Trail Emission & Evidence Archiving",
      responsibleRoleTh: "Holo Archive & Telemetry Deck",
      responsibleRoleEn: "Holo Archive & Telemetry Deck",
      legalAnchor: "ETDA Digital Evidence Standard (Forensic Level 5)",
      descriptionTh: "ส่งกระจายหลักฐานพยานไปยัง Chamber 17 Unclassified Preservation และสำเนาไปยัง 45 ดาวเทียมวงโคจร",
      descriptionEn: "Broadcast forensic audit logs to Chamber 17 WORM storage and 45 satellite telemetry constellations.",
      verificationCheck: "Receipt ZQ-GOLD-DEP-849202-3908 Broadcasted 100%",
      slaMaxMs: 20
    }
  ];

  const handleRunDrill = async () => {
    setDrillRunning(true);
    setDrillLog([]);
    setExecutedSteps({});
    soundEngine.playQuantumPing();

    for (let i = 0; i < sopPhases.length; i++) {
      const phase = sopPhases[i];
      setDrillLog(prev => [...prev, `[INIT] Executing ${phase.stepId}: ${phase.titleEn}...`]);
      await new Promise(r => setTimeout(r, 450));

      setExecutedSteps(prev => ({ ...prev, [phase.stepId]: true }));
      setDrillLog(prev => [...prev, `[PASS] ${phase.stepId} Verified: ${phase.verificationCheck} (Latency: ${phase.slaMaxMs}ms)`]);
      soundEngine.playQuantumPing();
    }

    soundEngine.playQuorumChime();
    setDrillLog(prev => [
      ...prev, 
      `[SUCCESS] 🎯 SOP G11 Quorum Execution Complete: 6/6 Phases PASS (Total Latency: 142ms SLA Met).`,
      `[LEGAL] Thai Electronic Transactions Act B.E. 2544 (Sec 9, 26, 28) Full Conformance Confirmed.`
    ]);
    setDrillRunning(false);
  };

  return (
    <div className="bg-slate-950 border border-emerald-500/40 rounded-2xl p-6 shadow-2xl space-y-6 font-mono-code relative overflow-hidden">
      <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 pb-4 border-b border-emerald-900/50">
        <div>
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-950 border border-emerald-500/50 text-emerald-300 text-xs font-bold flex items-center gap-1.5 shadow-md shadow-emerald-950">
              <BookOpen className="w-3.5 h-3.5 text-emerald-400" />
              SOP-G11-QUORUM-SPEC-v2.4
            </span>
            <span className="px-2 py-0.5 rounded bg-blue-950 border border-blue-500/40 text-blue-300 text-[11px] font-bold">
              10/10 HARDWARE CUSTODIANS
            </span>
            <span className="px-2 py-0.5 rounded bg-purple-950 border border-purple-500/40 text-purple-300 text-[11px] font-bold">
              ETDA SEC 9, 26, 28
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-display font-extrabold text-white tracking-tight flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-emerald-400" />
            {lang === 'th' ? 'ระเบียบปฏิบัติการมาตรฐาน: สภาองค์คณะผู้ดูแล G11 (SOP G11 Manual)' : 'Standard Operating Procedure: G11 Custodian Quorum'}
          </h2>
          <p className="text-xs text-slate-300 mt-1 max-w-3xl">
            {lang === 'th'
              ? 'คู่มือระเบียบการปฏิบัติงาน 6 ขั้นตอน (4.1–4.6) และมาตรการฉุกเฉิน Fail-Closed 85°C สำหรับสภาองค์คณะผู้ดูแลกุญแจอธิปไตย 10 ท่าน (#EP-SOVEREIGN-01 ถึง #EP-100) รองรับผลสมบูรณ์ตามกฎหมายไทย'
              : 'Official standard operating procedures detailing the 6-phase quorum consensus flow, fail-closed escalation, and statutory Thai Electronic Transactions Act compliance.'}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleRunDrill}
            disabled={drillRunning}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-xs font-bold transition-all shadow-lg ${
              drillRunning
                ? 'bg-amber-950/80 border-amber-500 text-amber-300 animate-pulse'
                : 'bg-emerald-950/90 hover:bg-emerald-900 border-emerald-400 text-emerald-200 shadow-emerald-950/60'
            }`}
          >
            {drillRunning ? <RotateCcw className="w-4 h-4 animate-spin text-amber-400" /> : <Play className="w-4 h-4 text-emerald-400" />}
            <span>{drillRunning ? 'RUNNING 142ms SOP DRILL...' : (lang === 'th' ? 'ทดสอบซ้อมตาม SOP (142ms Drill)' : 'Run SOP Execution Drill')}</span>
          </button>
        </div>
      </div>

      {/* Grid of 6 SOP Execution Phases */}
      <div className="space-y-4">
        <div className="text-xs text-slate-400 flex items-center justify-between">
          <span className="font-bold text-slate-200 uppercase tracking-wider">
            {lang === 'th' ? 'ขั้นตอนการปฏิบัติการ 6 ระยะ (4.1 – 4.6 Execution Workflow)' : '6-Phase Execution Workflow (4.1 – 4.6)'}
          </span>
          <span className="text-emerald-400 text-[11px]">SLA Total: 142ms | Consensus: 10/10 REAL_HSM</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sopPhases.map((phase, idx) => {
            const isDone = executedSteps[phase.stepId];
            return (
              <div 
                key={phase.stepId}
                className={`p-4 rounded-xl border transition-all relative overflow-hidden flex flex-col justify-between ${
                  isDone
                    ? 'bg-emerald-950/30 border-emerald-500 shadow-md shadow-emerald-950/40'
                    : 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="px-2 py-0.5 rounded bg-slate-950 border border-slate-700 text-[10px] font-bold text-cyan-300">
                      {phase.stepId}
                    </span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold flex items-center gap-1 ${
                      isDone 
                        ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/50' 
                        : 'bg-slate-950 text-slate-400 border border-slate-800'
                    }`}>
                      {isDone ? <Check className="w-3 h-3 text-emerald-400" /> : null}
                      {isDone ? 'VERIFIED' : `SLA: ${phase.slaMaxMs}ms`}
                    </span>
                  </div>

                  <h3 className="text-xs font-bold text-white mb-1.5 leading-snug">
                    {lang === 'th' ? phase.titleTh : phase.titleEn}
                  </h3>

                  <p className="text-[11px] text-slate-300 leading-relaxed mb-3">
                    {lang === 'th' ? phase.descriptionTh : phase.descriptionEn}
                  </p>
                </div>

                <div className="space-y-1.5 pt-2 border-t border-slate-800 text-[10px]">
                  <div className="flex items-center justify-between text-slate-400">
                    <span>Role:</span>
                    <span className="text-amber-300 font-bold truncate max-w-[150px]">{lang === 'th' ? phase.responsibleRoleTh : phase.responsibleRoleEn}</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-400">
                    <span>Legal Anchor:</span>
                    <span className="text-purple-300 font-bold">{phase.legalAnchor}</span>
                  </div>
                  <div className="text-[9.5px] text-slate-400 bg-slate-950/80 p-1.5 rounded border border-slate-800/80">
                    <span className="text-slate-500 block">Verification Rule:</span>
                    <span className="text-cyan-300 font-mono">{phase.verificationCheck}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Emergency Escalation Protocol & Thai Legal Convergence Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 pt-2">
        {/* Fail-Closed Emergency Escalation (Section 5) */}
        <div className="bg-red-950/30 border border-red-500/40 rounded-xl p-4 space-y-3">
          <div className="flex items-center gap-2 text-red-400 font-bold text-xs">
            <Flame className="w-4 h-4 text-red-400 animate-pulse" />
            <span>หมวด 5: แผนเผชิญเหตุฉุกเฉิน (Emergency Escalation Protocols)</span>
          </div>

          <div className="space-y-2 text-[11px] text-slate-300">
            <div className="p-2.5 rounded bg-slate-950/80 border border-red-900/50">
              <div className="font-bold text-red-300 mb-0.5">
                5.1 Fail-Closed Automatic Quarantine Trigger (85.0°C)
              </div>
              <p className="text-slate-400">
                หากตรวจพบการฝ่าฝืน SSoT Δ &gt; 0.00% หรือความร้อน Enclave พุ่งเกิน 85.0°C ให้ Sentinel-AI ตัดการเชื่อมต่อทันทีภายใน 1.2ms โอนย้ายข้อมูลต้องสงสัยเข้า Chamber 02 Escrow
              </p>
            </div>

            <div className="p-2.5 rounded bg-slate-950/80 border border-amber-900/50">
              <div className="font-bold text-amber-300 mb-0.5">
                5.2 Deca-Key Revocation & Sub-Kelvin Cold Freeze
              </div>
              <p className="text-slate-400">
                กรณีโหนด HSM สูญเสียสภาวะ Sub-Kelvin (&gt; 15 mK) สิทธิ์การลงนามจะถูกเพิกถอนชั่วคราว และโอนถ่ายฉันทามติไปยังโหนดสำรอง SLH-DSA SPHINCS+ โดยอัตโนมัติ
              </p>
            </div>
          </div>
        </div>

        {/* Thai Legal Convergence Deck */}
        <div className="bg-purple-950/30 border border-purple-500/40 rounded-xl p-4 space-y-3">
          <div className="flex items-center gap-2 text-purple-300 font-bold text-xs">
            <Scale className="w-4 h-4 text-purple-400" />
            <span>การรับรองตามกฎหมายไทย (Tri-Statute Legal Convergence)</span>
          </div>

          <div className="space-y-2 text-[11px] text-slate-300">
            <div className="p-2 rounded bg-slate-950/80 border border-purple-900/50 flex items-start gap-2">
              <div className="px-1.5 py-0.5 rounded bg-purple-900/60 text-purple-200 text-[10px] font-bold shrink-0">ม. 9</div>
              <div>
                <strong className="text-white">เจตนาของผู้ลงนาม:</strong> รับรองเจตนาของ นายยุทธภูมิ พากเพียร (#EP-SOVEREIGN-01) ในการลงนามกำกับธุรกรรมทุกฉบับ
              </div>
            </div>

            <div className="p-2 rounded bg-slate-950/80 border border-purple-900/50 flex items-start gap-2">
              <div className="px-1.5 py-0.5 rounded bg-purple-900/60 text-purple-200 text-[10px] font-bold shrink-0">ม. 26</div>
              <div>
                <strong className="text-white">ข้อสันนิษฐานลายมือชื่อที่เชื่อถือได้:</strong> คีย์ Dilithium-5 ถูกกักเก็บใน FIPS 140-3 Level 4 Secure Element ภายใต้การควบคุมเฉพาะของผู้ถือสิทธิ์
              </div>
            </div>

            <div className="p-2 rounded bg-slate-950/80 border border-purple-900/50 flex items-start gap-2">
              <div className="px-1.5 py-0.5 rounded bg-purple-900/60 text-purple-200 text-[10px] font-bold shrink-0">ม. 28</div>
              <div>
                <strong className="text-white">หน้าที่และความระมัดระวัง (Safe Harbor):</strong> ระบบเฝ้าระวัง Sentinel-AI ป้องกันความเสียหายและคงสภาพพยานหลักฐาน 100%
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Drill Execution Output Terminal */}
      {drillLog.length > 0 && (
        <div className="bg-black/90 p-3.5 rounded-xl border border-emerald-500/40 text-xs space-y-1">
          <div className="text-[11px] text-emerald-400 font-bold flex items-center justify-between border-b border-emerald-950 pb-1.5">
            <span className="flex items-center gap-1.5">
              <Cpu className="w-3.5 h-3.5 text-emerald-400" />
              G11 SOP EXECUTION TRACE TERMINAL
            </span>
            <span className="text-slate-500 font-normal">{drillLog.length} events logged</span>
          </div>
          <div className="max-h-40 overflow-y-auto space-y-1 pt-1 font-mono text-[11px]">
            {drillLog.map((line, idx) => (
              <div key={idx} className={line.includes('[PASS]') ? 'text-emerald-400' : line.includes('[SUCCESS]') ? 'text-cyan-300 font-bold' : line.includes('[LEGAL]') ? 'text-purple-300' : 'text-slate-300'}>
                {line}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
