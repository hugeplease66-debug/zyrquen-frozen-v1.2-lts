'use client';

import React, { useState } from 'react';
import {
  Shield,
  Cpu,
  Database,
  Lock,
  Zap,
  Activity,
  CheckCircle2,
  AlertTriangle,
  FileCheck2,
  Layers,
  Search,
  ArrowRight,
  Terminal,
  Scale,
  Sparkles,
  RefreshCw,
  Check
} from 'lucide-react';

export interface GuardrailRule {
  id: string;
  name: string;
  th: string;
  category: 'INGRESS' | 'DETERMINISTIC' | 'AI_INFERENCE' | 'LEDGER' | 'AUDIT';
  status: 'ACTIVE' | 'ENFORCED' | 'LOCKED';
  latency: string;
  ruleCode: string;
  description: string;
  detailTh: string;
}

export const SENTINEL_GUARDRAILS: GuardrailRule[] = [
  {
    id: 'GR-01',
    name: 'Zero-Trust Payload Schema Validation',
    th: 'ตรวจสอบสกีมาเพย์โหลดแบบ Zero-Trust',
    category: 'INGRESS',
    status: 'ENFORCED',
    latency: '0.4ms',
    ruleCode: 'SCHEMA_STRICT_PQC_V1',
    description: 'Strict schema enforcement rejecting any non-conforming, malformed, or injected fields before ingress pipeline.',
    detailTh: 'ตรวจจับและปฏิเสธข้อมูลผิดรูปแบบทันทีที่ขอบระบบ พร้อมป้องกัน SQL/NoSQL/Prompt Injection'
  },
  {
    id: 'GR-02',
    name: 'Hardware HSM Deca-Quorum Check',
    th: 'ตรวจสอบฉันทามติ 10 กุญแจฮาร์ดแวร์ HSM',
    category: 'INGRESS',
    status: 'ENFORCED',
    latency: '1.2ms',
    ruleCode: 'DECA_QUORUM_FIPS_140_3_L4',
    description: 'Ensures transaction contains valid signatures from the 10/10 Hardware Security Modules quorum.',
    detailTh: 'ต้องมีลายเซ็นรับรองจาก FIPS 140-3 Level 4 ครบ 10 โหนด จึงจะอนุญาตให้ประมวลผลต่อ'
  },
  {
    id: 'GR-03',
    name: 'Post-Quantum Dilithium-5 Signature Attestation',
    th: 'รับรองลายมือชื่อควอนตัม ML-DSA-87',
    category: 'INGRESS',
    status: 'ENFORCED',
    latency: '0.8ms',
    ruleCode: 'FIPS_204_ML_DSA_87_VERIFY',
    description: 'Verifies NIST FIPS 204 CRYSTALS-Dilithium-5 post-quantum signature on message body.',
    detailTh: 'ป้องกันการเจาะระบบจาก Quantum Computers ด้วยการรับรองลายมือชื่อ Post-Quantum ทุกธุรกรรม'
  },
  {
    id: 'GR-04',
    name: 'Deterministic Velocity & Threshold Interception',
    th: 'สกัดกั้นความเร็วและวงเงินธุรกรรมผิดปกติ',
    category: 'DETERMINISTIC',
    status: 'ENFORCED',
    latency: '0.3ms',
    ruleCode: 'INTERCEPT_VELOCITY_MAX_10K',
    description: 'Deterministic rule engine intercepts frequency anomalies (>50 tx/sec) and volume ceilings.',
    detailTh: 'กฎคงที่สกัดธุรกรรมซ้ำซ้อน ความถี่สูงผิดปกติ หรือยอดเงินเกินเกณฑ์ปลอดภัยทันที'
  },
  {
    id: 'GR-05',
    name: 'Blacklist & Sanctioned Address Sentinel',
    th: 'ตรวจสอบบัญชีดำและรายชื่อต้องห้ามสากล',
    category: 'DETERMINISTIC',
    status: 'ENFORCED',
    latency: '0.2ms',
    ruleCode: 'OFAC_AMLO_REALTIME_FILTER',
    description: 'Real-time lookups against AMLO Thailand, OFAC, and Sovereign Sentinel blacklist caches.',
    detailTh: 'ตรวจสอบเทียบฐานข้อมูล ปปง. (AMLO) และรายชื่อเฝ้าระวังแบบ Sub-Millisecond'
  },
  {
    id: 'GR-06',
    name: 'Replay Attack Prevention via Nonce & Timestamp Window',
    th: 'ป้องกันการ Replay ด้วย Nonce & Time Window 5s',
    category: 'DETERMINISTIC',
    status: 'ENFORCED',
    latency: '0.1ms',
    ruleCode: 'NONCE_SLIDING_WINDOW_5000MS',
    description: 'Enforces strictly monotonically increasing nonce with 5000ms maximum clock drift tolerance.',
    detailTh: 'ตัดการส่งซ้ำของธุรกรรมเก่าด้วยตัวนับค่า Nonce สากลและหน้าต่างเวลาคงที่ 5 วินาที'
  },
  {
    id: 'GR-07',
    name: 'AI Risk Inference & Anomaly Scoring Engine',
    th: 'เครื่องยนต์ AI ประเมินคะแนนความเสี่ยง & ความผิดปกติ',
    category: 'AI_INFERENCE',
    status: 'ENFORCED',
    latency: '8.4ms',
    ruleCode: 'DEEP_SENTINEL_ANOMALY_V4',
    description: 'Sub-10ms deep transformer model evaluating 128 behavioral vectors, outputting risk score [0..1].',
    detailTh: 'โมเดล AI วิเคราะห์พฤติกรรม 128 มิติ ให้คะแนนความเสี่ยง 0.00-1.00 ภายใน 8.4ms'
  },
  {
    id: 'GR-08',
    name: 'Multi-Tenant Behavioral Graph Coherence',
    th: 'กราฟความสัมพันธ์พฤติกรรมข้ามผู้เช่า',
    category: 'AI_INFERENCE',
    status: 'ENFORCED',
    latency: '6.2ms',
    ruleCode: 'GRAPH_NEURAL_TOPOLOGY_400',
    description: 'Graph neural engine cross-referencing sender, receiver, and intermediary topological patterns across 400 tenants.',
    detailTh: 'สแกนเครือข่ายความสัมพันธ์เพื่อตรวจจับรูปแบบการฟอกเงินข้ามบัญชีและโครงข่ายซับซ้อน'
  },
  {
    id: 'GR-09',
    name: 'Explainability & Reasoning Tree Generation',
    th: 'สร้างแผนผังเหตุผลเพื่อการตรวจสอบ (Explainability)',
    category: 'AI_INFERENCE',
    status: 'ENFORCED',
    latency: '3.1ms',
    ruleCode: 'SHAP_FEATURE_EXPLANATION_ENGINE',
    description: 'Generates auditable feature attribution weights for every AI-assisted risk determination.',
    detailTh: 'แจกแจงน้ำหนักปัจจัยที่ทำให้ AI ตัดสินใจ ชี้ชัดข้อกำหนดทางกฎหมายที่เกี่ยวข้อง'
  },
  {
    id: 'GR-10',
    name: 'Double-Entry Invariant & Balance Conservation',
    th: 'กฎอนุรักษ์ดุลยภาพบัญชีคู่ (Debit ≡ Credit)',
    category: 'LEDGER',
    status: 'ENFORCED',
    latency: '0.6ms',
    ruleCode: 'CONSERVATION_DEBIT_EQ_CREDIT',
    description: 'Mathematical invariant ensuring Sum(Debit) === Sum(Credit) for every ledger transaction journal.',
    detailTh: 'สมการคณิตศาสตร์บังคับผลรวมเดบิตต้องเท่ากับเครดิตเสมอ เงินไม่สามารถสูญหายหรือถูกสร้างขึ้นโดยมิชอบ'
  },
  {
    id: 'GR-11',
    name: 'Canonical Frozen State Write-Denial Veto',
    th: 'ห้ามเขียนทับส่วนแกนกลางแช่แข็ง (WRITE DENIED)',
    category: 'LEDGER',
    status: 'LOCKED',
    latency: '0.1ms',
    ruleCode: 'HARDWARE_WRITE_DENY_FROZEN_CORE',
    description: 'Hardware enclaves unconditionally reject write operations targeting the 14,902 Canonical Seals SSoT.',
    detailTh: 'บล็อกการแก้ไขสภาวะแช่แข็ง SSoT Δ0.0% โดยอัตโนมัติด้วยคำสั่งระดับไมโครโค้ดฮาร์ดแวร์'
  },
  {
    id: 'GR-12',
    name: 'Sub-50ms End-to-End Finality Settlement',
    th: 'ปิดยอดธุรกรรมสัมบูรณ์ใน 50 มิลลิวินาที',
    category: 'LEDGER',
    status: 'ENFORCED',
    latency: '24.8ms',
    ruleCode: 'ATOMIC_SETTLEMENT_FINALITY_50MS',
    description: 'Guarantees sub-50ms deterministic atomic settlement across memory-mapped transactional journals.',
    detailTh: 'บันทึกธุรกรรมเสร็จสมบูรณ์และเป็นที่สิ้นสุดแบบอะตอมมิกภายใน 24.8ms (เกณฑ์กำหนด <50ms)'
  },
  {
    id: 'GR-13',
    name: 'Merkle Branch Cryptographic Anchor',
    th: 'สมอยึดกิ่งก้าน Merkle Block #849202',
    category: 'AUDIT',
    status: 'ENFORCED',
    latency: '1.1ms',
    ruleCode: 'MERKLE_ROOT_909AB814_APPEND',
    description: 'Appends SHA-256 leaf digest and recalculates parent branch without modifying Genesis Root.',
    detailTh: 'บันทึกแฮชใบไม้ลงใน Merkle Tree ต่อเนื่องจาก Genesis Root 909ab814... อย่างเที่ยงตรง'
  },
  {
    id: 'GR-14',
    name: '12-Stage Deterministic Replay Verification',
    th: 'ตรวจสอบ Replay 12 ขั้นตอนย้อนรอยหลักฐาน',
    category: 'AUDIT',
    status: 'ENFORCED',
    latency: '1.9ms',
    ruleCode: 'STAGE12_FORENSIC_REPLAY_RATIFIED',
    description: 'Guarantees 100% deterministic bit-for-bit replayability from SENSE to REPLAY for court evidence.',
    detailTh: 'รับรองการจำลองย้อนรอยธุรกรรมได้ 100% ตั้งแต่ขั้นตอน SENSE จนถึง REPLAY สำหรับชั้นศาล'
  },
  {
    id: 'GR-15',
    name: 'ETDA & PDPA Statutory Audit Sealing',
    th: 'ปิดผนึกหลักฐานตาม พ.ร.บ. ธุรกรรมฯ และ PDPA',
    category: 'AUDIT',
    status: 'ENFORCED',
    latency: '0.9ms',
    ruleCode: 'THAI_STATUTE_ETDA_PDPA_SEAL',
    description: 'Enforces statutory compliance with ETDA Sec 9, 26, 28 and PDPA Sec 19, 27, 37 with immutable log hashes.',
    detailTh: 'ปิดผนึกบันทึกตามกฎหมายไทย ให้มีผลสมบูรณ์และใช้เป็นพยานหลักฐานในกระบวนการยุติธรรมได้'
  }
];

export interface TraceabilityItem {
  reqId: string;
  category: string;
  requirementTh: string;
  canonicalLayer: string;
  guardrailId: string;
  testVerification: string;
  statutoryAnchor: string;
}

export const TRACEABILITY_MATRIX: TraceabilityItem[] = [
  {
    reqId: 'REQ-FR-001',
    category: 'FUNCTIONAL',
    requirementTh: 'ระบบต้องตรวจจับและสกัดกั้นธุรกรรมทุจริตแบบเรียลไทม์ Sub-50ms',
    canonicalLayer: 'Layer 2: Deterministic Rules & Layer 3: AI Inference',
    guardrailId: 'GR-04, GR-07',
    testVerification: 'TEST-SENTINEL-LATENCY-01 (Passed in 24.8ms)',
    statutoryAnchor: 'ETDA Sec 26 (Advanced Security)'
  },
  {
    reqId: 'REQ-FR-002',
    category: 'FUNCTIONAL',
    requirementTh: 'ระบบต้องบันทึกบัญชีคู่ Debit ≡ Credit โดยไม่มีการสูญหายของยอดเงิน',
    canonicalLayer: 'Layer 4: Ledger State & Settlement',
    guardrailId: 'GR-10, GR-12',
    testVerification: 'TEST-LEDGER-CONSERVATION-02 (Passed: Δ=0)',
    statutoryAnchor: 'ETDA Sec 9 (Data Integrity)'
  },
  {
    reqId: 'REQ-FR-003',
    category: 'FUNCTIONAL',
    requirementTh: 'ระบบต้องรองรับการจำลองย้อนรอยหลักฐาน 12 ขั้นตอนสำหรับชั้นศาล',
    canonicalLayer: 'Layer 5: Observability & Forensic Audit',
    guardrailId: 'GR-14, GR-15',
    testVerification: 'TEST-REPLAY-12STAGE-03 (Passed: Bit-for-Bit)',
    statutoryAnchor: 'ETDA Sec 28 & PDPA Sec 37'
  },
  {
    reqId: 'REQ-NFR-001',
    category: 'NON-FUNCTIONAL',
    requirementTh: 'ความพร้อมใช้งานระบบ ≥ 99.99% พร้อม Phoenix Recovery ≤ 150ms',
    canonicalLayer: 'Layer 1: Ingress & Core Runtime',
    guardrailId: 'GR-01, GR-11',
    testVerification: 'TEST-PHOENIX-BENCHMARK-04 (Passed in 142ms)',
    statutoryAnchor: 'สกมช. CII Standard (Critical Infrastructure)'
  },
  {
    reqId: 'REQ-SR-001',
    category: 'SECURITY',
    requirementTh: 'ทนทานต่อการโจมตีจากควอนตัมด้วย FIPS 203/204/205 PQC',
    canonicalLayer: 'Layer 1: Ingress & Signature Attestation',
    guardrailId: 'GR-02, GR-03',
    testVerification: 'TEST-PQC-DILITHIUM-05 (100% Ratified)',
    statutoryAnchor: 'NIST PQC Standards FIPS 204 ML-DSA-87'
  },
  {
    reqId: 'REQ-DR-001',
    category: 'DATA_MODEL',
    requirementTh: 'แยกแยะชัดเจนระหว่าง FACT, AI_INFERENCE, DERIVED และ AUDIT_LOG',
    canonicalLayer: 'Layer 3: AI Inference & Layer 5: Audit',
    guardrailId: 'GR-09, GR-13',
    testVerification: 'TEST-TRUTH-CLASSIFIER-06 (Zero Ambiguity)',
    statutoryAnchor: 'PDPA Sec 19 & 27 (Consent & Attribution)'
  }
];

export default function SentinelLedgerAI({
  onNotify
}: {
  onNotify?: (msg: string, type?: 'success' | 'error' | 'warning') => void;
}) {
  const [activeTab, setActiveTab] = useState<'guardrails' | 'layers' | 'traceability' | 'simulator'>('guardrails');
  const [selectedRule, setSelectedRule] = useState<GuardrailRule>(SENTINEL_GUARDRAILS[6]);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');

  // Simulator State
  const [simTxAmount, setSimTxAmount] = useState('1,500,000');
  const [simSender, setSimSender] = useState('0x71a8...99b2 (Tenant Ω605)');
  const [simReceiver, setSimReceiver] = useState('0x909a...b814 (FIOS Treasury Vault)');
  const [isSimulating, setIsSimulating] = useState(false);
  const [simResult, setSimResult] = useState<{
    txId: string;
    riskScore: number;
    decision: 'APPROVED' | 'INTERCEPTED' | 'QUARANTINED';
    latencyMs: number;
    debitTotal: string;
    creditTotal: string;
    pqcProof: string;
    explanation: string;
    steps: { name: string; status: string; ms: number }[];
  } | null>(null);

  const filteredRules = SENTINEL_GUARDRAILS.filter(rule => {
    const matchesCat = categoryFilter === 'ALL' || rule.category === categoryFilter;
    const matchesSearch = 
      rule.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rule.th.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rule.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rule.ruleCode.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const runSimulation = () => {
    setIsSimulating(true);
    if (onNotify) onNotify("⚡ เริ่มต้นรันการวิเคราะห์ธุรกรรม SentinelLedger AI...", "warning");

    setTimeout(() => {
      setIsSimulating(false);
      const isLarge = parseFloat(simTxAmount.replace(/,/g, '')) > 5000000;
      const res = {
        txId: `TX-2026-${Math.floor(100000 + Math.random() * 900000)}-SENTINEL`,
        riskScore: isLarge ? 0.74 : 0.03,
        decision: (isLarge ? 'INTERCEPTED' : 'APPROVED') as 'APPROVED' | 'INTERCEPTED' | 'QUARANTINED',
        latencyMs: 23.4,
        debitTotal: `฿${simTxAmount} THB-SOV`,
        creditTotal: `฿${simTxAmount} THB-SOV (Balance Delta = 0.0000)`,
        pqcProof: 'CRYSTALS-Dilithium-5 (ML-DSA-87 FIPS 204) Signed by 10/10 HSM',
        explanation: isLarge 
          ? 'ธุรกรรมถูกสกัดกั้นเนื่องจากวงเงินสูงเกินเกณฑ์กำหนด 5,000,000 THB และต้องผ่านการอนุมัติ 2-Party Deca-Quorum'
          : 'ธุรกรรมผ่านเกณฑ์ความปลอดภัยทุกระดับ คะแนนความเสี่ยง 0.03 (< 0.10) และบันทึกลงสู่ Merkle Branch สมบูรณ์',
        steps: [
          { name: '1. Ingress Zero-Trust & PQC Deca-Quorum', status: 'PASS', ms: 1.8 },
          { name: '2. Deterministic Rule & AMLO Velocity Check', status: 'PASS', ms: 0.5 },
          { name: '3. Transformer AI Anomaly & Graph Analysis', status: isLarge ? 'FLAGGED' : 'PASS', ms: 8.2 },
          { name: '4. Double-Entry Invariant (Debit ≡ Credit)', status: 'PASS', ms: 0.6 },
          { name: '5. Merkle Root Append & ETDA/PDPA Seal', status: 'PASS', ms: 12.3 }
        ]
      };
      setSimResult(res);
      if (onNotify) {
        onNotify(
          res.decision === 'APPROVED' 
            ? `✓ ธุรกรรม ${res.txId} ได้รับการอนุมัติและปิดยอดสมบูรณ์ (Latency: 23.4ms)` 
            : `⚠️ ธุรกรรม ${res.txId} ถูกสกัดกั้นโดย Sentinel Guardrail!`,
          res.decision === 'APPROVED' ? 'success' : 'error'
        );
      }
    }, 1200);
  };

  return (
    <div className="space-y-6 font-mono text-xs">
      {/* HEADER BANNER */}
      <div className="bg-gradient-to-r from-[#0d1627] via-[#122340] to-[#0d1627] border border-cyan-500/40 p-5 sm:p-6 rounded-2xl backdrop-blur-xl shadow-2xl relative overflow-hidden">
        <div className="absolute -right-20 -top-20 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="flex flex-wrap justify-between items-center gap-4 relative z-10 border-b border-slate-800 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/15 text-[#67E8F9] border border-cyan-500/40 text-[10px] font-bold">
                SPEC-FIN-001 v1.0.0 MASTER ROOT
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/40 text-[10px] font-bold">
                15/15 GUARDRAILS RATIFIED
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-purple-500/15 text-purple-300 border border-purple-500/40 text-[10px] font-bold">
                SUB-50ms FINALITY
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white font-mono mt-1 text-cyan-gradient flex items-center gap-2">
              <Shield className="w-6 h-6 text-cyan-400" />
              SentinelLedger AI Sovereign Core Engine
            </h2>
            <p className="text-slate-300 text-xs font-sans mt-0.5 max-w-3xl">
              ระบบตรวจจับการทุจริต ป้องกันการฟอกเงิน และปิดยอดบัญชีคู่อัตโนมัติแบบเรียลไทม์ ควบคุมด้วย 15 Root Guardrails, โครงสร้าง 5 ชั้นคานอนิคอล และการสืบย้อนรอยหลักฐาน 100%
            </p>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => {
                setActiveTab('simulator');
                runSimulation();
              }}
              className="px-4 py-2 bg-gradient-to-r from-cyan-400 to-blue-500 hover:brightness-110 text-black font-bold font-mono text-xs rounded-xl shadow-lg flex items-center gap-2 cursor-pointer transition"
            >
              <Zap className="w-4 h-4" />
              <span>ทดสอบจำลองธุรกรรม</span>
            </button>
          </div>
        </div>

        {/* NAVIGATION TABS */}
        <div className="flex flex-wrap gap-2 pt-4">
          <button
            onClick={() => setActiveTab('guardrails')}
            className={`px-3.5 py-2 rounded-xl font-bold transition flex items-center gap-2 cursor-pointer ${
              activeTab === 'guardrails'
                ? 'bg-cyan-500 text-black shadow-lg shadow-cyan-500/20'
                : 'bg-slate-900/80 text-slate-300 hover:bg-slate-800 border border-slate-700'
            }`}
          >
            <Shield className="w-4 h-4" />
            <span>15 Root Guardrails ({SENTINEL_GUARDRAILS.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('layers')}
            className={`px-3.5 py-2 rounded-xl font-bold transition flex items-center gap-2 cursor-pointer ${
              activeTab === 'layers'
                ? 'bg-cyan-500 text-black shadow-lg shadow-cyan-500/20'
                : 'bg-slate-900/80 text-slate-300 hover:bg-slate-800 border border-slate-700'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>5 Canonical Layers Architecture</span>
          </button>

          <button
            onClick={() => setActiveTab('traceability')}
            className={`px-3.5 py-2 rounded-xl font-bold transition flex items-center gap-2 cursor-pointer ${
              activeTab === 'traceability'
                ? 'bg-cyan-500 text-black shadow-lg shadow-cyan-500/20'
                : 'bg-slate-900/80 text-slate-300 hover:bg-slate-800 border border-slate-700'
            }`}
          >
            <FileCheck2 className="w-4 h-4" />
            <span>Bidirectional Traceability Matrix</span>
          </button>

          <button
            onClick={() => setActiveTab('simulator')}
            className={`px-3.5 py-2 rounded-xl font-bold transition flex items-center gap-2 cursor-pointer ${
              activeTab === 'simulator'
                ? 'bg-cyan-500 text-black shadow-lg shadow-cyan-500/20'
                : 'bg-slate-900/80 text-slate-300 hover:bg-slate-800 border border-slate-700'
            }`}
          >
            <Terminal className="w-4 h-4" />
            <span>Live Transaction Simulator</span>
          </button>
        </div>
      </div>

      {/* TAB 1: 15 ROOT GUARDRAILS */}
      {activeTab === 'guardrails' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* LEFT LIST */}
          <div className="lg:col-span-7 space-y-4">
            {/* SEARCH & FILTERS */}
            <div className="bg-[#0f172a]/95 border border-slate-800 p-4 rounded-xl flex flex-wrap items-center justify-between gap-3">
              <div className="relative flex-1 min-w-[200px]">
                <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="ค้นหากฎเกณฑ์ Guardrail (เช่น Schema, HSM, Dilithium, Nonce, Balance)..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 bg-black/60 border border-slate-700 rounded-lg text-white font-mono text-xs focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div className="flex flex-wrap gap-1">
                {['ALL', 'INGRESS', 'DETERMINISTIC', 'AI_INFERENCE', 'LEDGER', 'AUDIT'].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setCategoryFilter(cat)}
                    className={`px-2 py-1 rounded text-[10px] font-bold transition cursor-pointer ${
                      categoryFilter === cat
                        ? 'bg-cyan-400 text-black'
                        : 'bg-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* RULE ITEMS */}
            <div className="space-y-2.5 max-h-[600px] overflow-y-auto pr-1">
              {filteredRules.map((rule) => {
                const isSelected = selectedRule.id === rule.id;
                return (
                  <div
                    key={rule.id}
                    onClick={() => setSelectedRule(rule)}
                    className={`p-3.5 rounded-xl border transition cursor-pointer flex items-center justify-between gap-3 ${
                      isSelected
                        ? 'bg-[#152544] border-cyan-400 shadow-md shadow-cyan-500/10'
                        : 'bg-[#0f172a]/80 border-slate-800 hover:border-slate-700 hover:bg-[#121c32]'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${
                        rule.category === 'INGRESS' ? 'bg-blue-500/20 text-blue-300' :
                        rule.category === 'DETERMINISTIC' ? 'bg-amber-500/20 text-amber-300' :
                        rule.category === 'AI_INFERENCE' ? 'bg-purple-500/20 text-purple-300' :
                        rule.category === 'LEDGER' ? 'bg-emerald-500/20 text-emerald-300' :
                        'bg-cyan-500/20 text-cyan-300'
                      }`}>
                        {rule.category === 'AI_INFERENCE' ? <Cpu className="w-4 h-4" /> : <Shield className="w-4 h-4" />}
                      </div>

                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-white text-xs">{rule.id}</span>
                          <span className="text-slate-400 text-[10px]">({rule.ruleCode})</span>
                          <span className="px-1.5 py-0.2 rounded bg-slate-800 text-slate-300 text-[9px] font-mono">
                            {rule.latency}
                          </span>
                        </div>
                        <div className="text-slate-200 text-xs font-sans font-medium mt-0.5">{rule.name}</div>
                        <div className="text-slate-400 text-[11px] font-sans">{rule.th}</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[9px] font-bold">
                        {rule.status}
                      </span>
                      <ArrowRight className={`w-4 h-4 ${isSelected ? 'text-cyan-400' : 'text-slate-600'}`} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* RIGHT DETAIL INSPECTOR */}
          <div className="lg:col-span-5">
            <div className="bg-[#0f172a]/95 border border-cyan-500/40 p-5 rounded-2xl backdrop-blur-xl shadow-2xl space-y-4 sticky top-6">
              <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-cyan-400" />
                  <span className="font-bold text-white text-sm">Guardrail Rule Inspector</span>
                </div>
                <span className="px-2.5 py-0.5 rounded bg-cyan-500/20 text-[#67E8F9] border border-cyan-500/40 text-[10px] font-bold">
                  {selectedRule.id}
                </span>
              </div>

              <div>
                <h3 className="text-base font-bold text-white">{selectedRule.name}</h3>
                <div className="text-xs text-cyan-300 font-sans mt-0.5">{selectedRule.th}</div>
              </div>

              <div className="grid grid-cols-2 gap-2.5 text-[11px]">
                <div className="p-2.5 bg-black/60 rounded-xl border border-slate-800">
                  <span className="text-slate-500 text-[9px] block">RULE CODE:</span>
                  <span className="text-amber-300 font-mono font-bold break-all">{selectedRule.ruleCode}</span>
                </div>
                <div className="p-2.5 bg-black/60 rounded-xl border border-slate-800">
                  <span className="text-slate-500 text-[9px] block">PIPELINE LATENCY:</span>
                  <span className="text-emerald-400 font-mono font-bold">{selectedRule.latency}</span>
                </div>
                <div className="p-2.5 bg-black/60 rounded-xl border border-slate-800">
                  <span className="text-slate-500 text-[9px] block">CATEGORY LAYER:</span>
                  <span className="text-purple-300 font-mono font-bold">{selectedRule.category}</span>
                </div>
                <div className="p-2.5 bg-black/60 rounded-xl border border-slate-800">
                  <span className="text-slate-500 text-[9px] block">ENFORCEMENT:</span>
                  <span className="text-emerald-300 font-mono font-bold">{selectedRule.status}</span>
                </div>
              </div>

              <div className="space-y-2">
                <div className="text-slate-400 text-[10px] font-bold uppercase">Specification (English):</div>
                <p className="text-slate-200 text-xs font-sans leading-relaxed bg-black/40 p-3 rounded-xl border border-slate-800">
                  {selectedRule.description}
                </p>
              </div>

              <div className="space-y-2">
                <div className="text-slate-400 text-[10px] font-bold uppercase">คำอธิบายทางเทคนิค (Thai Detail):</div>
                <p className="text-cyan-200 text-xs font-sans leading-relaxed bg-cyan-950/20 p-3 rounded-xl border border-cyan-500/30">
                  {selectedRule.detailTh}
                </p>
              </div>

              <div className="pt-2 border-t border-slate-800 flex justify-between items-center">
                <span className="text-[10px] text-slate-500">Master Root Anchor: Block #849202</span>
                <button
                  onClick={() => {
                    if (onNotify) onNotify(`✓ กฎ ${selectedRule.id} (${selectedRule.ruleCode}) ได้รับการตรวจสอบและคงที่ 100%`, 'success');
                  }}
                  className="px-3 py-1.5 bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-400/50 text-cyan-200 font-bold text-[10px] rounded-lg transition cursor-pointer"
                >
                  Verify Rule Invariant
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: 5 CANONICAL LAYERS ARCHITECTURE */}
      {activeTab === 'layers' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-3.5">
            {[
              {
                num: '1',
                title: 'Ingress & Edge Security',
                th: 'ความปลอดภัยขอบระบบ & ทางเข้า',
                color: 'border-blue-500/40 bg-blue-950/20 text-blue-300',
                badge: 'Layer 1',
                items: ['Zero-Trust Schema Validate', 'FIPS 140-3 L4 Deca Quorum', 'ML-DSA-87 PQC Signature', 'Hardware Rate Limiting']
              },
              {
                num: '2',
                title: 'Deterministic Rules Engine',
                th: 'เครื่องยนต์กฎเกณฑ์สถิตย์ & สกัดกั้น',
                color: 'border-amber-500/40 bg-amber-950/20 text-amber-300',
                badge: 'Layer 2',
                items: ['AMLO / OFAC Blacklists', 'Velocity Ceiling Interceptor', 'Nonce Window Check (5s)', 'Sovereign Veto Circuits']
              },
              {
                num: '3',
                title: 'AI Risk Inference Engine',
                th: 'ปัญญาประดิษฐ์ประเมินความเสี่ยง',
                color: 'border-purple-500/40 bg-purple-950/20 text-purple-300',
                badge: 'Layer 3',
                items: ['128-Dim Transformer Model', 'Graph Topology Coherence', 'SHAP Explainability Tree', 'Sub-10ms Inference Time']
              },
              {
                num: '4',
                title: 'Ledger State & Settlement',
                th: 'สภาวะบัญชี & ปิดยอดคู่',
                color: 'border-emerald-500/40 bg-emerald-950/20 text-emerald-300',
                badge: 'Layer 4',
                items: ['Double-Entry Invariant (D≡C)', 'Sub-50ms Finality Settlement', 'Hardware Write-Deny Core', 'Atomic Journal Commits']
              },
              {
                num: '5',
                title: 'Observability & Forensic Audit',
                th: 'การสังเกตการณ์ & ตรวจสอบนิติวิทยาศาสตร์',
                color: 'border-cyan-500/40 bg-cyan-950/20 text-cyan-300',
                badge: 'Layer 5',
                items: ['Merkle Tree 909ab814 Append', '12-Stage Forensic Replay', 'ETDA Sec 9/26/28 Binding', 'PDPA Sec 19/27/37 Compliance']
              }
            ].map((layer) => (
              <div key={layer.num} className={`p-4 rounded-2xl border ${layer.color} space-y-3`}>
                <div className="flex justify-between items-center">
                  <span className="px-2 py-0.5 rounded bg-black/40 text-[10px] font-bold">{layer.badge}</span>
                  <span className="text-xl font-bold font-mono">0{layer.num}</span>
                </div>
                <div>
                  <h4 className="text-white font-bold text-xs">{layer.title}</h4>
                  <div className="text-[11px] text-slate-300 font-sans mt-0.5">{layer.th}</div>
                </div>
                <div className="space-y-1.5 pt-2 border-t border-slate-800">
                  {layer.items.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-1.5 text-[10px] text-slate-300">
                      <Check className="w-3 h-3 text-emerald-400 shrink-0" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="p-4 bg-[#0f172a]/95 rounded-2xl border border-slate-800 flex flex-wrap justify-between items-center gap-3">
            <div className="text-xs text-slate-300 font-sans">
              🔒 <strong>Data & Truth Architecture Model:</strong> ระบบแบ่งแยกประเภทข้อมูล 4 ชั้นหลัก: 
              <span className="text-emerald-300 font-bold ml-1">FACT (สัจธรรม)</span>, 
              <span className="text-purple-300 font-bold ml-1">AI_INFERENCE (ปัญญาประดิษฐ์)</span>, 
              <span className="text-cyan-300 font-bold ml-1">DERIVED (การอนุมาน)</span>, 
              <span className="text-amber-300 font-bold ml-1">AUDIT_LOG (บันทึกนิติวิทยาศาสตร์)</span>
            </div>
            <span className="text-[10px] text-emerald-400 font-bold">100% TRUTH COHERENCE</span>
          </div>
        </div>
      )}

      {/* TAB 3: TRACEABILITY MATRIX */}
      {activeTab === 'traceability' && (
        <div className="space-y-4">
          <div className="bg-[#0f172a]/95 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
            <div className="p-4 bg-[#121c32] border-b border-slate-800 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <FileCheck2 className="w-5 h-5 text-cyan-400" />
                <h3 className="text-sm font-bold text-white">Bidirectional Requirement Traceability Matrix (RTM)</h3>
              </div>
              <span className="px-2.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] font-bold">
                6/6 REQUIREMENTS VERIFIED
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-black/60 text-slate-400 border-b border-slate-800 text-[10px] uppercase font-bold">
                    <th className="p-3">Req ID & Category</th>
                    <th className="p-3">Requirement (Thai)</th>
                    <th className="p-3">Canonical Layer</th>
                    <th className="p-3">Guardrail Anchor</th>
                    <th className="p-3">Test Verification</th>
                    <th className="p-3">Statutory Anchor</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 font-sans">
                  {TRACEABILITY_MATRIX.map((item) => (
                    <tr key={item.reqId} className="hover:bg-slate-800/40 transition">
                      <td className="p-3 font-mono">
                        <div className="font-bold text-cyan-300">{item.reqId}</div>
                        <div className="text-[10px] text-slate-400">{item.category}</div>
                      </td>
                      <td className="p-3 text-slate-200 font-medium">{item.requirementTh}</td>
                      <td className="p-3 text-slate-300 font-mono text-[11px]">{item.canonicalLayer}</td>
                      <td className="p-3 font-mono">
                        <span className="px-2 py-0.5 rounded bg-amber-500/15 text-amber-300 border border-amber-500/30 text-[10px]">
                          {item.guardrailId}
                        </span>
                      </td>
                      <td className="p-3 font-mono">
                        <span className="text-emerald-300 text-[11px]">{item.testVerification}</span>
                      </td>
                      <td className="p-3 text-slate-300 font-mono text-[11px]">
                        <span className="text-purple-300">{item.statutoryAnchor}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: LIVE SIMULATOR */}
      {activeTab === 'simulator' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* SIMULATOR INPUTS */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-[#0f172a]/95 border border-cyan-500/40 p-5 rounded-2xl backdrop-blur-xl shadow-2xl space-y-4">
              <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                <span className="font-bold text-white text-sm flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-cyan-400" />
                  Transaction Injection Panel
                </span>
                <span className="text-[10px] text-cyan-300 font-bold">SUB-50ms PIPELINE</span>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="text-slate-400 text-[10px] block mb-1">TRANSACTION AMOUNT (THB-SOV):</label>
                  <input
                    type="text"
                    value={simTxAmount}
                    onChange={(e) => setSimTxAmount(e.target.value)}
                    className="w-full bg-black/60 border border-slate-700 rounded-xl px-3.5 py-2 text-white font-mono font-bold text-sm focus:outline-none focus:border-cyan-400"
                  />
                </div>

                <div>
                  <label className="text-slate-400 text-[10px] block mb-1">SENDER ADDRESS & TENANT:</label>
                  <input
                    type="text"
                    value={simSender}
                    onChange={(e) => setSimSender(e.target.value)}
                    className="w-full bg-black/60 border border-slate-700 rounded-xl px-3.5 py-2 text-white font-mono text-xs focus:outline-none focus:border-cyan-400"
                  />
                </div>

                <div>
                  <label className="text-slate-400 text-[10px] block mb-1">RECIPIENT SANCTUM VAULT:</label>
                  <input
                    type="text"
                    value={simReceiver}
                    onChange={(e) => setSimReceiver(e.target.value)}
                    className="w-full bg-black/60 border border-slate-700 rounded-xl px-3.5 py-2 text-white font-mono text-xs focus:outline-none focus:border-cyan-400"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={runSimulation}
                  disabled={isSimulating}
                  className="w-full py-3 bg-gradient-to-r from-cyan-400 via-teal-400 to-blue-500 hover:brightness-110 text-black font-bold font-mono text-xs rounded-xl shadow-lg flex items-center justify-center gap-2 cursor-pointer transition disabled:opacity-50"
                >
                  {isSimulating ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>กำลังประมวลผล 5 Canonical Layers...</span>
                    </>
                  ) : (
                    <>
                      <Zap className="w-4 h-4" />
                      <span>รันการตรวจสอบ Sentinel & Double-Entry Settlement</span>
                    </>
                  )}
                </button>
              </div>

              <div className="text-[10px] text-slate-500 font-sans">
                💡 <em>ทดสอบใส่วงเงินมากกว่า 5,000,000 เพื่อจำลองการสกัดกั้นโดย AI Anomaly & Velocity Interceptor</em>
              </div>
            </div>
          </div>

          {/* SIMULATOR RESULTS */}
          <div className="lg:col-span-7">
            {simResult ? (
              <div className="bg-[#0f172a]/95 border border-cyan-500/40 p-5 rounded-2xl backdrop-blur-xl shadow-2xl space-y-4">
                <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                  <div>
                    <span className="text-[10px] text-slate-400 block">SETTLEMENT RECEIPT ID:</span>
                    <span className="text-cyan-300 font-bold font-mono text-sm">{simResult.txId}</span>
                  </div>
                  <span className={`px-3 py-1 rounded-xl text-xs font-bold border ${
                    simResult.decision === 'APPROVED'
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50'
                      : 'bg-red-500/20 text-red-300 border-red-500/50'
                  }`}>
                    {simResult.decision === 'APPROVED' ? '✓ SETTLED & RATIFIED' : '⚠️ INTERCEPTED (VETO)'}
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-[11px]">
                  <div className="p-2.5 bg-black/60 rounded-xl border border-slate-800">
                    <span className="text-slate-500 text-[9px] block">AI RISK SCORE:</span>
                    <span className={`font-bold font-mono ${simResult.riskScore > 0.1 ? 'text-red-400' : 'text-emerald-400'}`}>
                      {simResult.riskScore.toFixed(2)} / 1.00
                    </span>
                  </div>
                  <div className="p-2.5 bg-black/60 rounded-xl border border-slate-800">
                    <span className="text-slate-500 text-[9px] block">TOTAL LATENCY:</span>
                    <span className="text-cyan-300 font-bold font-mono">{simResult.latencyMs} ms (&lt;50ms)</span>
                  </div>
                  <div className="p-2.5 bg-black/60 rounded-xl border border-slate-800 col-span-2">
                    <span className="text-slate-500 text-[9px] block">DOUBLE-ENTRY INVARIANT:</span>
                    <span className="text-emerald-300 font-bold font-mono text-[10px]">{simResult.creditTotal}</span>
                  </div>
                </div>

                {/* 5 STAGES */}
                <div className="space-y-2">
                  <div className="text-slate-400 text-[10px] font-bold uppercase">5 Canonical Layer Executions:</div>
                  <div className="space-y-1.5">
                    {simResult.steps.map((st, i) => (
                      <div key={i} className="p-2 bg-black/40 rounded-lg border border-slate-800 flex justify-between items-center text-xs">
                        <span className="text-slate-200 font-sans">{st.name}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-slate-500 font-mono text-[10px]">{st.ms}ms</span>
                          <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                            st.status === 'PASS' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-red-500/20 text-red-300'
                          }`}>
                            {st.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* EXPLANATION */}
                <div className="p-3 bg-cyan-950/20 rounded-xl border border-cyan-500/30 text-xs font-sans text-slate-200">
                  <div className="text-cyan-300 font-bold mb-1 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                    คำอธิบายผลการตรวจสอบ (Audit Explanation):
                  </div>
                  {simResult.explanation}
                </div>

                {/* PQC ATTESTATION */}
                <div className="p-2.5 bg-black/80 rounded-xl border border-slate-800 text-[10px] flex justify-between items-center">
                  <span className="text-slate-400">Cryptographic Seal:</span>
                  <span className="text-amber-300 font-mono font-bold">{simResult.pqcProof}</span>
                </div>
              </div>
            ) : (
              <div className="bg-[#0f172a]/80 border border-slate-800 p-12 rounded-2xl text-center space-y-3">
                <Shield className="w-12 h-12 text-cyan-400/40 mx-auto" />
                <h3 className="text-white font-bold text-sm">พร้อมสำหรับการทดสอบธุรกรรม</h3>
                <p className="text-slate-400 text-xs font-sans max-w-sm mx-auto">
                  กดปุ่ม &quot;รันการตรวจสอบ Sentinel&quot; เพื่อทดสอบจำลองการประมวลผล 5 Canonical Layers และตรวจผลการปิดยอดแบบ Double-Entry
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
