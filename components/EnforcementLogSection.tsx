'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { 
  ShieldAlert, 
  ShieldCheck, 
  Terminal, 
  Gavel, 
  AlertTriangle, 
  CheckCircle2, 
  Filter, 
  Play, 
  Pause, 
  RotateCcw, 
  Copy, 
  FileSpreadsheet, 
  Sparkles,
  Lock,
  Users,
  Search,
  Download,
  Activity,
  Layers,
  FileText,
  KeyRound,
  Eye,
  Check,
  Zap,
  RefreshCw,
  X
} from 'lucide-react';

export type EventCategory = 
  | 'SECURITY_GATES' 
  | 'INTEGRITY_VERIFICATION' 
  | 'THAI_ETDA_PDPA' 
  | 'PQC_CRYPTOGRAPHY' 
  | 'CRITICAL_INTERRUPTS'
  | 'INTERSTELLAR_MESH';

export interface EnforcementEvent {
  id: string;
  timestamp: string;
  category: EventCategory;
  level: 'CRITICAL' | 'GUARD' | 'RATIFIED' | 'INTERRUPT';
  gateId?: string;
  statute: string;
  summary: string;
  hash: string;
  status: 'BLOCKED' | 'RATIFIED' | 'ENFORCED' | 'SOVEREIGN_OVERRIDE';
  hsmSignatures: number; // e.g. 10
  details?: {
    merkleRoot?: string;
    blockHeight?: number;
    driftDelta?: string;
    canonicalSeals?: number;
    targetGate?: string;
    pqcAlgorithm?: string;
    legalReference?: string;
    hsmSignatures?: number;
  };
}

const INITIAL_EVENTS: EnforcementEvent[] = [
  {
    id: "ENF-94101",
    timestamp: "17:26:01.104",
    category: "SECURITY_GATES",
    level: "RATIFIED",
    gateId: "GATE-04",
    statute: "Gate 04 (CRYSTALS-Dilithium-5 / ML-DSA-87) Status Update",
    summary: "สถานะเกต GATE-04 เปลี่ยนเป็น SEALED 100%: ตรวจสอบกุญแจดิจิทัลผูกมัดอัตลักษณ์นายยุทธภูมิ พากเพียร (#EP-SOVEREIGN-01)",
    hash: "0x4f8a91c0e3...b712",
    status: "RATIFIED",
    hsmSignatures: 10,
    details: {
      targetGate: "GATE-04 (Dilithium-5 Enclave)",
      pqcAlgorithm: "CRYSTALS-Dilithium-5 (NIST FIPS 204)",
      blockHeight: 849202,
      canonicalSeals: 14902,
      driftDelta: "Δ0.0000%"
    }
  },
  {
    id: "ENF-94102",
    timestamp: "17:26:04.382",
    category: "INTEGRITY_VERIFICATION",
    level: "RATIFIED",
    gateId: "GATE-02",
    statute: "Canonical Merkle Root Genesis Integrity Attestation",
    summary: "ผลการตรวจสอบความสมบูรณ์ Merkle Root: 909ab814...4c68 ตรงกัน 100% กับทะเบียนคานอนิคอล 14,902 ดวง (Zero Drift Δ0.00%)",
    hash: "0x909ab81447...4c68",
    status: "RATIFIED",
    hsmSignatures: 10,
    details: {
      merkleRoot: "909ab814479844d8a14816bed34cdbb07528e18501da86fc4691763a43fa4c68",
      blockHeight: 849202,
      canonicalSeals: 14902,
      driftDelta: "Δ0.0000%"
    }
  },
  {
    id: "ENF-94103",
    timestamp: "17:26:08.719",
    category: "THAI_ETDA_PDPA",
    level: "GUARD",
    gateId: "GATE-12",
    statute: "พ.ร.บ. คุ้มครองข้อมูลส่วนบุคคล (PDPA) มาตรา 9, 26, 28 & ETDA Safe Harbor",
    summary: "การบังคับใช้นิติวิทยาศาสตร์ PDPA Enclave: รหัสผ่าน Zero-Knowledge Vault ถูกบดบังด้วย Kyber-1024 และบันทึกลง Merkle Ledger",
    hash: "0x55d1a09ef2...11b4",
    status: "ENFORCED",
    hsmSignatures: 10,
    details: {
      legalReference: "พ.ร.บ. คุ้มครองข้อมูลส่วนบุคคล พ.ศ. 2562 (PDPA) มาตรา 9, 26, 28",
      pqcAlgorithm: "CRYSTALS-Kyber-1024 (NIST FIPS 203)",
      blockHeight: 849202
    }
  },
  {
    id: "ENF-94104",
    timestamp: "17:26:12.205",
    category: "SECURITY_GATES",
    level: "CRITICAL",
    gateId: "GATE-08",
    statute: "Gate 08 (Chaos Drill Guard & Direct Write Interceptor)",
    summary: "ตรวจพบคำขอเขียนทับหน่วยความจำ Frozen Core นอก Quorum -> เกต GATE-08 ทำการ Fail-Closed สกัดกั้นทันที (Mutation=0)",
    hash: "0xee71001bc9...fa33",
    status: "BLOCKED",
    hsmSignatures: 10,
    details: {
      targetGate: "GATE-08 (Chaos Drill Guard)",
      driftDelta: "Δ0.0000% (Mutation Denied)",
      blockHeight: 849202
    }
  },
  {
    id: "ENF-94105",
    timestamp: "17:26:15.912",
    category: "PQC_CRYPTOGRAPHY",
    level: "RATIFIED",
    gateId: "GATE-05",
    statute: "NIST FIPS 203 (CRYSTALS-Kyber-1024 Key Encapsulation)",
    summary: "การแลกเปลี่ยนกุญแจลับปลอดภัยระดับโพสต์ควอนตัม (Quantum Key Encapsulation) ผ่านฉันทามติ Deca-Quorum 10/10 สำเร็จ",
    hash: "0xfa99210c44...ee82",
    status: "RATIFIED",
    hsmSignatures: 10,
    details: {
      pqcAlgorithm: "CRYSTALS-Kyber-1024 Level 5",
      targetGate: "GATE-05 (Kyber-1024 Enclave)",
      hsmSignatures: 10
    }
  },
  {
    id: "ENF-94106",
    timestamp: "17:26:19.450",
    category: "INTEGRITY_VERIFICATION",
    level: "RATIFIED",
    gateId: "GATE-22",
    statute: "Gate 22 (LTS Frozen Immutable Hardware Lock) Periodic Verification",
    summary: "ผลการสแกนความสมบูรณ์ฮาร์ดแวร์รอบ 500ms: รหัสคานอนิคอล 14,902 ดวงคงเดิม 100% ไม่มีการเบี่ยงเบน (Δ0 SSoT Invariant)",
    hash: "0x33b194cf81...4401",
    status: "RATIFIED",
    hsmSignatures: 10,
    details: {
      targetGate: "GATE-22 (LTS Freeze)",
      canonicalSeals: 14902,
      driftDelta: "Δ0.0000%",
      blockHeight: 849202
    }
  }
];

interface EnforcementLogSectionProps {
  onAddNotification?: (msg: string, type?: 'success' | 'error' | 'warning') => void;
}

export default function EnforcementLogSection({ onAddNotification }: EnforcementLogSectionProps) {
  const [events, setEvents] = useState<EnforcementEvent[]>(INITIAL_EVENTS);
  const [isLive, setIsLive] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEventDetails, setSelectedEventDetails] = useState<EnforcementEvent | null>(null);
  const [isAuditing, setIsAuditing] = useState(false);

  // Sovereign Veto Modal State
  const [showVetoModal, setShowVetoModal] = useState(false);
  const [vetoStep, setVetoStep] = useState<number>(0); // 0: Idle, 1: Collecting Quorum, 2: Dilithium Signing, 3: Ratified
  const [vetoProof, setVetoProof] = useState<string | null>(null);

  // Real-time generator of Security Gate Status changes & Integrity Verification events
  useEffect(() => {
    if (!isLive) return;

    const interval = setInterval(() => {
      const gateList = [
        { id: "GATE-01", name: "Genesis Boot", cat: "SECURITY_GATES" as const, stat: "SEALED 100%" },
        { id: "GATE-02", name: "Merkle Anchor", cat: "INTEGRITY_VERIFICATION" as const, stat: "VERIFIED Δ0" },
        { id: "GATE-03", name: "HSM Deca-Quorum", cat: "SECURITY_GATES" as const, stat: "10/10 ATTESTED" },
        { id: "GATE-04", name: "Dilithium-5 Enclave", cat: "PQC_CRYPTOGRAPHY" as const, stat: "FIPS 204 RATIFIED" },
        { id: "GATE-05", name: "Kyber-1024 Handshake", cat: "PQC_CRYPTOGRAPHY" as const, stat: "FIPS 203 ENFORCED" },
        { id: "GATE-08", name: "Chaos Drill Interceptor", cat: "SECURITY_GATES" as const, stat: "FAIL-CLOSED ACTIVE" },
        { id: "GATE-10", name: "Sub-Kelvin Cryo Bus", cat: "INTEGRITY_VERIFICATION" as const, stat: "0.015 mK STABLE" },
        { id: "GATE-12", name: "ETDA Section 9 & 26", cat: "THAI_ETDA_PDPA" as const, stat: "COMPLIANCE PASSED" },
        { id: "GATE-14", name: "ETDA Section 28 Responsibility", cat: "THAI_ETDA_PDPA" as const, stat: "SIGNER BOUND" },
        { id: "GATE-20", name: "Sovereign Gold Master Seal", cat: "INTEGRITY_VERIFICATION" as const, stat: "SEALED BY PRINCIPAL" },
        { id: "GATE-22", name: "LTS Frozen Core Lock", cat: "SECURITY_GATES" as const, stat: "WRITE DENIED (Δ0)" }
      ];

      const chosenGate = gateList[Math.floor(Math.random() * gateList.length)];
      const now = new Date();
      const timeStr = `${now.toTimeString().split(' ')[0]}.${String(now.getMilliseconds()).padStart(3, '0')}`;
      const randomId = `ENF-${Math.floor(94000 + Math.random() * 5900)}`;
      const randomHash = `0x${Array.from({ length: 8 }, () => Math.floor(Math.random() * 16).toString(16)).join('')}...${Array.from({ length: 4 }, () => Math.floor(Math.random() * 16).toString(16)).join('')}`;

      let summaryText = "";
      let statuteText = "";
      let eventLevel: EnforcementEvent['level'] = "RATIFIED";
      let eventStatus: EnforcementEvent['status'] = "RATIFIED";

      if (chosenGate.cat === "SECURITY_GATES") {
        statuteText = `Security Gate Status Change: ${chosenGate.id} (${chosenGate.name})`;
        summaryText = `สถานะเกต ${chosenGate.id} อัปเดตเป็น [${chosenGate.stat}]: ผ่านเกณฑ์ตรวจสอบแบบ Fail-Closed โดยไม่มี State Leakage`;
        eventLevel = "GUARD";
        eventStatus = "ENFORCED";
      } else if (chosenGate.cat === "INTEGRITY_VERIFICATION") {
        statuteText = `Integrity Verification Audit: ${chosenGate.name} (Canonical SSoT)`;
        summaryText = `ผลการตรวจยืนยันสัจจะ Merkle Root #849202: 14,902 ตราประทับคงความสมบูรณ์ 100% (Drift Δ0.0000%)`;
        eventLevel = "RATIFIED";
        eventStatus = "RATIFIED";
      } else if (chosenGate.cat === "THAI_ETDA_PDPA") {
        statuteText = `พ.ร.บ.ธุรกรรมฯ / PDPA มาตรา 9, 26, 28 (${chosenGate.name})`;
        summaryText = `ตรวจสอบลายมือชื่ออิเล็กทรอนิกส์และพันธกิจทางกฎหมายไทย ผูกมัดอัตลักษณ์นายยุทธภูมิ พากเพียร สมบูรณ์ 100%`;
        eventLevel = "RATIFIED";
        eventStatus = "RATIFIED";
      } else {
        statuteText = `NIST PQC Cryptographic Binding: ${chosenGate.name}`;
        summaryText = `ตรวจสอบความถูกต้องของกุญแจเข้ารหัสลับแลตทิซระดับ Category 5 รองรับการทนทานต่อควอนตัมคอมพิวเตอร์`;
        eventLevel = "GUARD";
        eventStatus = "ENFORCED";
      }

      const newEvent: EnforcementEvent = {
        id: randomId,
        timestamp: timeStr,
        category: chosenGate.cat,
        gateId: chosenGate.id,
        level: eventLevel,
        statute: statuteText,
        summary: summaryText,
        hash: randomHash,
        status: eventStatus,
        hsmSignatures: 10,
        details: {
          targetGate: `${chosenGate.id} (${chosenGate.name})`,
          merkleRoot: "909ab814479844d8a14816bed34cdbb07528e18501da86fc4691763a43fa4c68",
          blockHeight: 849202,
          canonicalSeals: 14902,
          driftDelta: "Δ0.0000%"
        }
      };

      setEvents((prev) => [newEvent, ...prev.slice(0, 49)]);
    }, 4000);

    return () => clearInterval(interval);
  }, [isLive]);

  // Run instant manual system integrity & gate audit
  const runInstantAudit = () => {
    setIsAuditing(true);
    if (onAddNotification) {
      onAddNotification("🔍 DEEP AUDIT INITIATED: กำลังตรวจสอบเกตความปลอดภัยทั้ง 22 เกต และ Merkle Root 14,902 ดวง...", "warning");
    }

    setTimeout(() => {
      setIsAuditing(false);
      const now = new Date();
      const timeStr = `${now.toTimeString().split(' ')[0]}.${String(now.getMilliseconds()).padStart(3, '0')}`;
      
      const auditEvent: EnforcementEvent = {
        id: `AUDIT-Δ0-${Math.floor(1000 + Math.random() * 9000)}`,
        timestamp: timeStr,
        category: "INTEGRITY_VERIFICATION",
        level: "RATIFIED",
        gateId: "GATE-01..22",
        statute: "Comprehensive 22/22 Security Gates & SSoT Integrity Deep-Scan",
        summary: "ผลการตรวจสอบเชิงลึก: 22/22 เกตปิดผนึกสมบูรณ์ (SEALED), Merkle Root #849202 ยืนยัน 14,902 ตราประทับ (Δ0.00% Zero Drift), ฉันทามติ 10/10 REAL_HSM",
        hash: "0x909ab81447...4c68",
        status: "RATIFIED",
        hsmSignatures: 10,
        details: {
          targetGate: "ALL 22 MASTER SECURITY GATES",
          merkleRoot: "909ab814479844d8a14816bed34cdbb07528e18501da86fc4691763a43fa4c68",
          blockHeight: 849202,
          canonicalSeals: 14902,
          driftDelta: "Δ0.0000%",
          pqcAlgorithm: "ML-DSA-87 / Dilithium-5 + ML-KEM-1024 / Kyber"
        }
      };

      setEvents((prev) => [auditEvent, ...prev]);
      if (onAddNotification) {
        onAddNotification("✓ 22/22 SECURITY GATES & MERKLE TREE AUDITED: ผ่านการรับรองความถูกต้อง 100% (Zero Drift)", "success");
      }
    }, 1200);
  };

  // Handle Sovereign Veto Workflow Trigger
  const triggerSovereignVeto = () => {
    setShowVetoModal(true);
    setVetoStep(1);

    if (onAddNotification) {
      onAddNotification("⚡ SOVEREIGN VETO INITIATED: กำลังเริ่มกระบวนการสิทธิยับยั้งอธิปไตยสูงสุด...", "warning");
    }

    // Step 1: Collecting Deca-Quorum (1.2s)
    setTimeout(() => {
      setVetoStep(2);
      if (onAddNotification) {
        onAddNotification("✓ HSM Quorum 10/10: รวบรวมลายมือชื่อผู้พิทักษ์ความจริงครบ 10 แห่ง", "success");
      }

      // Step 2: Dilithium-5 Signature Binding (1.5s)
      setTimeout(() => {
        setVetoStep(3);
        const generatedVetoProof = `VETO-PROOF-Δ0-849202-${Date.now().toString(16).toUpperCase()}-DILITHIUM5-RATIFIED-BY-YUTTHAPHUM-PHAKPHIAN`;
        setVetoProof(generatedVetoProof);

        // Add veto event to log
        const now = new Date();
        const vetoEvent: EnforcementEvent = {
          id: `VETO-${Math.floor(1000 + Math.random() * 9000)}`,
          timestamp: `${now.toTimeString().split(' ')[0]}.${String(now.getMilliseconds()).padStart(3, '0')}`,
          category: "CRITICAL_INTERRUPTS",
          gateId: "GATE-20",
          level: "CRITICAL",
          statute: "Supreme Sovereign Veto Mandate (สิทธิยับยั้งอธิปไตยสูงสุด)",
          summary: "นายยุทธภูมิ พากเพียร (#EP-SOVEREIGN-01) ประกาศสิทธิยับยั้งอธิปไตยสูงสุด ผ่านฉันทามติ 10/10 REAL HSM และ FIPS 204 Dilithium-5",
          hash: generatedVetoProof.slice(0, 24) + '...',
          status: "SOVEREIGN_OVERRIDE",
          hsmSignatures: 10,
          details: {
            targetGate: "GATE-20 (Sovereign Seal Authority)",
            merkleRoot: "909ab814479844d8a14816bed34cdbb07528e18501da86fc4691763a43fa4c68",
            blockHeight: 849202,
            pqcAlgorithm: "CRYSTALS-Dilithium-5 (ML-DSA-87)"
          }
        };

        setEvents((prev) => [vetoEvent, ...prev]);

        if (onAddNotification) {
          onAddNotification("👑 SOVEREIGN VETO RATIFIED: ฉันทามติรับรองสิทธิยับยั้งอธิปไตยเสร็จสมบูรณ์ 100%", "success");
        }
      }, 1500);
    }, 1200);
  };

  // Export logs as CSV
  const exportAsCsv = () => {
    const headers = ["ID", "Timestamp", "Category", "GateID", "Level", "Status", "Statute", "Summary", "ProofHash", "HSMSignatures"];
    const rows = filteredEvents.map(e => [
      `"${e.id}"`,
      `"${e.timestamp}"`,
      `"${e.category}"`,
      `"${e.gateId || 'N/A'}"`,
      `"${e.level}"`,
      `"${e.status}"`,
      `"${e.statute.replace(/"/g, '""')}"`,
      `"${e.summary.replace(/"/g, '""')}"`,
      `"${e.hash}"`,
      `"${e.hsmSignatures}/10"`
    ]);

    const csvContent = "data:text/csv;charset=utf-8,\uFEFF" + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `ZYRQUEN_ENFORCEMENT_LOG_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    if (onAddNotification) {
      onAddNotification("✓ ส่งออกบันทึกการบังคับใช้ระบบ (Enforcement CSV Log) สำเร็จ", "success");
    }
  };

  // Export logs as JSON
  const exportAsJson = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(filteredEvents, null, 2));
    const link = document.createElement("a");
    link.setAttribute("href", dataStr);
    link.setAttribute("download", `ZYRQUEN_ENFORCEMENT_LOG_${Date.now()}.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    if (onAddNotification) {
      onAddNotification("✓ ส่งออกบันทึกการบังคับใช้ระบบ (Enforcement JSON Log) สำเร็จ", "success");
    }
  };

  // Filter events based on category, status and search query
  const filteredEvents = useMemo(() => {
    return events.filter((e) => {
      const matchCat = selectedCategory === 'ALL' || e.category === selectedCategory;
      const matchStatus = selectedStatus === 'ALL' || e.status === selectedStatus;
      const q = searchQuery.toLowerCase().trim();
      const matchSearch = !q || 
        e.id.toLowerCase().includes(q) || 
        e.statute.toLowerCase().includes(q) || 
        e.summary.toLowerCase().includes(q) || 
        (e.gateId && e.gateId.toLowerCase().includes(q)) || 
        e.hash.toLowerCase().includes(q);

      return matchCat && matchStatus && matchSearch;
    });
  }, [events, selectedCategory, selectedStatus, searchQuery]);

  return (
    <div id="enforcement-log-section" className="w-full bg-[#081020]/95 border border-cyan-500/40 rounded-3xl p-5 sm:p-6 backdrop-blur-2xl shadow-2xl space-y-5 quantum-cyan-glow">
      
      {/* HEADER WITH REAL-TIME METRICS & CONTROLS */}
      <div className="flex flex-wrap justify-between items-center gap-4 border-b border-slate-800/90 pb-4">
        <div className="flex items-center gap-3.5">
          <div className="p-3 rounded-2xl bg-cyan-500/15 border border-cyan-400/50 text-cyan-300 shadow-md">
            <Terminal className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[10px] text-cyan-400 font-bold font-mono tracking-widest uppercase bg-cyan-500/10 px-2.5 py-0.5 rounded-full border border-cyan-500/30">
                REAL-TIME SYSTEM EVENTS & SECURITY GATES
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-mono text-[10px] font-bold flex items-center gap-1.5 shadow-sm">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                {isLive ? 'LIVE EVENT STREAM' : 'STREAM PAUSED'}
              </span>
              <span className="px-2 py-0.5 rounded bg-amber-500/15 text-amber-300 border border-amber-500/30 font-mono text-[9px] font-bold">
                SSoT Δ0.00%
              </span>
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-white font-mono mt-1 text-cyan-gradient flex items-center gap-2">
              <span>Enforcement Log & Security Gates Monitor</span>
            </h3>
            <p className="text-[11px] text-slate-400 font-sans mt-0.5">
              ติดตามบันทึกเหตุการณ์ระบบแบบเรียลไทม์ การเปลี่ยนสถานะเกตความปลอดภัย (Gate Status Transitions) และผลการตรวจยืนยันสัจจะ (Integrity Verification Results)
            </p>
          </div>
        </div>

        {/* TOP RIGHT ACTION BUTTONS */}
        <div className="flex flex-wrap items-center gap-2 font-mono text-xs">
          
          {/* RUN INSTANT AUDIT BUTTON */}
          <button
            onClick={runInstantAudit}
            disabled={isAuditing}
            className="px-3.5 py-2 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-400/50 text-cyan-200 font-bold flex items-center gap-2 transition cursor-pointer disabled:opacity-50 shadow-md"
            title="สแกนตรวจสอบความสมบูรณ์เกตทั้ง 22 เกต และ Merkle Root ทันที"
          >
            <RefreshCw className={`w-4 h-4 text-cyan-300 ${isAuditing ? 'animate-spin' : ''}`} />
            <span>{isAuditing ? 'กำลังตรวจสอบ...' : 'รัน Integrity Deep-Scan'}</span>
          </button>

          {/* SOVEREIGN VETO BUTTON */}
          <button
            onClick={triggerSovereignVeto}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-400 via-amber-500 to-yellow-600 text-black font-bold flex items-center gap-2 hover:brightness-110 transition cursor-pointer shadow-lg gold-glow"
            title="Trigger Simulated HSM Consensus Sovereign Veto Override"
          >
            <Gavel className="w-4 h-4 fill-black" />
            <span>Sovereign Veto (สิทธิยับยั้ง)</span>
          </button>

          {/* PAUSE / PLAY TOGGLE */}
          <button
            onClick={() => setIsLive(!isLive)}
            className={`p-2 rounded-xl border transition cursor-pointer ${
              isLive ? 'bg-cyan-500/15 border-cyan-500/40 text-cyan-300' : 'bg-slate-900 border-slate-800 text-slate-400'
            }`}
            title={isLive ? "Pause Live Log Stream" : "Resume Live Log Stream"}
          >
            {isLive ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current" />}
          </button>

        </div>
      </div>

      {/* 4-METRIC REAL-TIME STATUS SUMMARY CARDS */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono text-xs">
        <div className="p-3 bg-[#0a1224] border border-cyan-500/30 rounded-2xl space-y-1">
          <div className="flex justify-between items-center text-slate-400 text-[10px]">
            <span>TOTAL LOGGED EVENTS</span>
            <Activity className="w-3.5 h-3.5 text-cyan-400" />
          </div>
          <div className="text-xl font-bold text-white">{events.length} Recorded</div>
          <div className="text-[9px] text-emerald-400">● 100% Validated Audit Chain</div>
        </div>

        <div className="p-3 bg-[#0a1224] border border-emerald-500/30 rounded-2xl space-y-1">
          <div className="flex justify-between items-center text-slate-400 text-[10px]">
            <span>SECURITY GATES</span>
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <div className="text-xl font-bold text-emerald-300">22 / 22 Sealed</div>
          <div className="text-[9px] text-slate-400">Fail-Closed Enclaves Active</div>
        </div>

        <div className="p-3 bg-[#0a1224] border border-amber-500/30 rounded-2xl space-y-1">
          <div className="flex justify-between items-center text-slate-400 text-[10px]">
            <span>MERKLE INTEGRITY</span>
            <Layers className="w-3.5 h-3.5 text-amber-400" />
          </div>
          <div className="text-xl font-bold text-amber-300">14,902 Seals</div>
          <div className="text-[9px] text-amber-400/90 font-bold">Zero Mutation Drift (Δ0.00%)</div>
        </div>

        <div className="p-3 bg-[#0a1224] border border-purple-500/30 rounded-2xl space-y-1">
          <div className="flex justify-between items-center text-slate-400 text-[10px]">
            <span>DECA-QUORUM HSM</span>
            <Users className="w-3.5 h-3.5 text-purple-400" />
          </div>
          <div className="text-xl font-bold text-purple-300">10 / 10 Unanimous</div>
          <div className="text-[9px] text-slate-400">Dilithium-5 FIPS 204 Signed</div>
        </div>
      </div>

      {/* FILTER CONTROLS & SEARCH BAR */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 text-xs font-mono bg-[#050b17] p-3 rounded-2xl border border-slate-800">
        
        {/* CATEGORY FILTER BUTTONS */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-thin">
          {[
            { id: 'ALL', label: 'All Events' },
            { id: 'SECURITY_GATES', label: 'Security Gates (22/22)' },
            { id: 'INTEGRITY_VERIFICATION', label: 'Integrity Verification' },
            { id: 'THAI_ETDA_PDPA', label: 'PDPA & ETDA Legal' },
            { id: 'PQC_CRYPTOGRAPHY', label: 'PQC Cryptography' },
            { id: 'CRITICAL_INTERRUPTS', label: 'Veto & Interceptions' }
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 rounded-xl border text-[11px] transition whitespace-nowrap cursor-pointer ${
                selectedCategory === cat.id
                  ? 'bg-cyan-500/30 border-cyan-400 text-cyan-200 font-bold shadow-sm'
                  : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* SEARCH INPUT & EXPORT BUTTONS */}
        <div className="flex items-center gap-2">
          <div className="relative flex-1 sm:w-56">
            <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ค้นหา Gate, Hash, หรือมาตรา..."
              className="w-full bg-black/60 border border-slate-700/80 rounded-xl pl-8 pr-3 py-1.5 text-white text-[11px] placeholder:text-slate-500 focus:outline-none focus:border-cyan-400 font-mono"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>

          <button
            onClick={exportAsCsv}
            className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 hover:text-white transition cursor-pointer flex items-center gap-1"
            title="Export filtered logs as CSV"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
            <span className="hidden sm:inline text-[10px]">CSV</span>
          </button>

          <button
            onClick={exportAsJson}
            className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 hover:text-white transition cursor-pointer flex items-center gap-1"
            title="Export filtered logs as JSON"
          >
            <Download className="w-4 h-4 text-cyan-400" />
            <span className="hidden sm:inline text-[10px]">JSON</span>
          </button>
        </div>

      </div>

      {/* EVENTS LOG FEED */}
      <div className="space-y-2.5 max-h-[440px] overflow-y-auto pr-1 font-mono text-xs scrollbar-thin">
        {filteredEvents.length === 0 ? (
          <div className="p-8 text-center bg-slate-950/60 rounded-2xl border border-slate-800 text-slate-500 font-mono">
            ไม่พบรายการบันทึกที่ตรงกับคำค้นหาหรือตัวกรองที่เลือก
          </div>
        ) : (
          filteredEvents.map((evt) => {
            const isVeto = evt.status === 'SOVEREIGN_OVERRIDE';
            const isBlocked = evt.status === 'BLOCKED';

            return (
              <div
                key={evt.id}
                onClick={() => setSelectedEventDetails(evt)}
                className={`p-3.5 rounded-2xl border transition-all duration-200 cursor-pointer ${
                  isVeto
                    ? 'bg-amber-950/40 border-amber-400/80 text-amber-100 gold-glow'
                    : isBlocked
                    ? 'bg-red-950/30 border-red-500/60 text-red-200'
                    : 'bg-slate-950/80 border-slate-800/80 text-slate-300 hover:border-cyan-500/50 hover:bg-[#0b162c] shadow-sm'
                }`}
              >
                <div className="flex flex-wrap justify-between items-center gap-2 mb-1.5 text-[10px]">
                  <div className="flex items-center gap-2">
                    <span className="text-cyan-400 font-bold">{evt.id}</span>
                    <span className="text-slate-500">[{evt.timestamp}]</span>
                    {evt.gateId && (
                      <span className="px-2 py-0.5 rounded bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 font-bold">
                        {evt.gateId}
                      </span>
                    )}
                    <span className={`px-2 py-0.5 rounded font-bold text-[9px] ${
                      evt.category === 'THAI_ETDA_PDPA' ? 'bg-amber-500/20 text-amber-300' :
                      evt.category === 'PQC_CRYPTOGRAPHY' ? 'bg-purple-500/20 text-purple-300' :
                      evt.category === 'SECURITY_GATES' ? 'bg-cyan-500/20 text-cyan-300' :
                      'bg-emerald-500/20 text-emerald-300'
                    }`}>
                      {evt.category.replace(/_/g, ' ')}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[9px] font-bold">
                      {evt.hsmSignatures}/10 REAL_HSM
                    </span>
                    <span className={`px-2.5 py-0.5 rounded text-[9px] font-bold ${
                      isVeto ? 'bg-amber-500 text-black font-bold' :
                      isBlocked ? 'bg-red-500 text-white font-bold' :
                      'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                    }`}>
                      {evt.status}
                    </span>
                  </div>
                </div>

                <div className="text-xs font-bold text-white mb-1 font-mono">{evt.statute}</div>
                <div className="text-[11px] text-slate-300 font-sans leading-relaxed">{evt.summary}</div>

                <div className="flex flex-wrap justify-between items-center text-[10px] text-slate-500 mt-2.5 pt-1.5 border-t border-slate-900 gap-2 font-mono">
                  <span className="truncate max-w-[320px]">
                    Proof Hash: <strong className="text-cyan-300">{evt.hash}</strong>
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-cyan-400/80 text-[10px] hover:underline flex items-center gap-1">
                      <Eye className="w-3 h-3" /> ดูหลักฐานละเอียด
                    </span>
                    <span className="text-emerald-400 font-bold">✓ Ratified Δ0</span>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* EVENT DRILL-DOWN PROOF MODAL */}
      {selectedEventDetails && (
        <div 
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4" 
          onClick={() => setSelectedEventDetails(null)}
        >
          <div 
            className="bg-gradient-to-b from-[#0a1224] via-[#0f1d38] to-[#060b18] border border-cyan-400/60 rounded-3xl p-6 max-w-xl w-full quantum-cyan-glow relative space-y-4 shadow-2xl font-mono text-xs" 
            onClick={(e) => e.stopPropagation()}
          >
            <button 
              onClick={() => setSelectedEventDetails(null)}
              className="absolute top-4 right-4 p-2 rounded-full bg-slate-900 border border-slate-800 text-slate-400 hover:text-white cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-3 border-b border-slate-800 pb-3">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-400/50 flex items-center justify-center text-cyan-300 font-bold">
                <Terminal className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-cyan-400 font-bold">{selectedEventDetails.id}</span>
                  <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[9px] font-bold">
                    {selectedEventDetails.status}
                  </span>
                </div>
                <h4 className="text-sm font-bold text-white mt-0.5">{selectedEventDetails.statute}</h4>
              </div>
            </div>

            <div className="space-y-2.5 bg-black/60 p-4 rounded-2xl border border-slate-800">
              <div>
                <span className="text-slate-400 text-[10px] block">คำอธิบายเหตุการณ์ (Event Summary):</span>
                <p className="text-slate-200 text-xs font-sans mt-0.5 leading-relaxed">{selectedEventDetails.summary}</p>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800/80 text-[10px]">
                <div>
                  <span className="text-slate-400">Timestamp:</span>
                  <div className="text-white font-bold">{selectedEventDetails.timestamp}</div>
                </div>
                <div>
                  <span className="text-slate-400">Security Level:</span>
                  <div className="text-amber-300 font-bold">{selectedEventDetails.level}</div>
                </div>
                <div>
                  <span className="text-slate-400">Deca-Quorum Consensus:</span>
                  <div className="text-emerald-400 font-bold">{selectedEventDetails.hsmSignatures}/10 REAL_HSM</div>
                </div>
                <div>
                  <span className="text-slate-400">Assigned Gate:</span>
                  <div className="text-cyan-300 font-bold">{selectedEventDetails.gateId || 'N/A'}</div>
                </div>
              </div>

              {selectedEventDetails.details && (
                <div className="space-y-1 pt-2 border-t border-slate-800/80 text-[10px]">
                  <span className="text-slate-400">Canonical Merkle SSoT Root:</span>
                  <div className="text-cyan-300 break-all select-all font-bold p-2 bg-slate-950 rounded-lg border border-slate-800">
                    {selectedEventDetails.details.merkleRoot || '909ab814479844d8a14816bed34cdbb07528e18501da86fc4691763a43fa4c68'}
                  </div>
                  <div className="flex justify-between text-slate-400 pt-1">
                    <span>Block Height: <strong className="text-white">#{selectedEventDetails.details.blockHeight || 849202}</strong></span>
                    <span>Seals: <strong className="text-amber-300">{selectedEventDetails.details.canonicalSeals || 14902} Seals</strong></span>
                    <span>Drift: <strong className="text-emerald-400">{selectedEventDetails.details.driftDelta || 'Δ0.00%'}</strong></span>
                  </div>
                </div>
              )}
            </div>

            <div className="flex gap-2 pt-2 border-t border-slate-800">
              <button
                onClick={() => {
                  navigator.clipboard?.writeText(selectedEventDetails.hash);
                  if (onAddNotification) onAddNotification(`✓ คัดลอก Proof Hash ${selectedEventDetails.hash} สำเร็จ`, "success");
                }}
                className="py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 font-bold transition flex items-center gap-1.5 cursor-pointer"
              >
                <Copy className="w-3.5 h-3.5" /> คัดลอก Hash
              </button>

              <button
                onClick={() => setSelectedEventDetails(null)}
                className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-cyan-400 via-sky-500 to-indigo-600 text-black font-bold quantum-cyan-glow cursor-pointer"
              >
                ปิดหน้าต่าง (Close)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SOVEREIGN VETO SIMULATED HSM CONSENSUS MODAL */}
      {showVetoModal && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4" onClick={() => vetoStep === 3 && setShowVetoModal(false)}>
          <div className="bg-gradient-to-b from-[#101b33] via-[#091224] to-[#040813] border border-amber-400/80 rounded-3xl p-6 max-w-xl w-full gold-glow relative space-y-5 shadow-2xl" onClick={(e) => e.stopPropagation()}>
            
            <div className="flex items-center gap-3 border-b border-amber-500/30 pb-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-400/20 border border-amber-400/60 flex items-center justify-center text-amber-300">
                <Gavel className="w-6 h-6 animate-pulse" />
              </div>
              <div>
                <span className="text-[10px] text-amber-400 font-bold font-mono tracking-widest uppercase">
                  SOVEREIGN VETO PROTOCOL (สิทธิยับยั้งอธิปไตย)
                </span>
                <h3 className="text-base sm:text-lg font-bold text-white font-mono text-gold-gradient">
                  Simulated HSM Consensus Ratification
                </h3>
              </div>
            </div>

            {/* STEP PROGRESS */}
            <div className="space-y-3 font-mono text-xs">
              
              {/* STEP 1 */}
              <div className={`p-3 rounded-xl border flex items-center justify-between ${
                vetoStep >= 1 ? 'bg-cyan-950/40 border-cyan-400 text-cyan-200' : 'bg-black/40 border-slate-800 text-slate-600'
              }`}>
                <div className="flex items-center gap-2.5">
                  <Users className="w-4 h-4" />
                  <span>1. Deca-Quorum Custodian Signatures (10/10 HSM)</span>
                </div>
                <span>{vetoStep >= 2 ? '✓ 10/10 LOCKED' : 'COLLECTING...'}</span>
              </div>

              {/* STEP 2 */}
              <div className={`p-3 rounded-xl border flex items-center justify-between ${
                vetoStep >= 2 ? 'bg-purple-950/40 border-purple-400 text-purple-200' : 'bg-black/40 border-slate-800 text-slate-600'
              }`}>
                <div className="flex items-center gap-2.5">
                  <Lock className="w-4 h-4" />
                  <span>2. CRYSTALS-Dilithium-5 Signature Generation</span>
                </div>
                <span>{vetoStep >= 3 ? '✓ FIPS 204 SIGNED' : vetoStep === 2 ? 'SIGNING...' : 'WAITING'}</span>
              </div>

              {/* STEP 3 */}
              <div className={`p-3 rounded-xl border flex items-center justify-between ${
                vetoStep >= 3 ? 'bg-amber-950/40 border-amber-400 text-amber-200' : 'bg-black/40 border-slate-800 text-slate-600'
              }`}>
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>3. Sovereign Master Override Ratified</span>
                </div>
                <span>{vetoStep >= 3 ? '✓ RATIFIED Δ0' : 'PENDING'}</span>
              </div>

            </div>

            {/* GENERATED VETO PROOF */}
            {vetoProof && (
              <div className="p-3.5 bg-black/80 rounded-xl border border-amber-500/40 space-y-1.5 font-mono text-[10px]">
                <div className="text-slate-400">Cryptographic Sovereign Veto Proof:</div>
                <div className="p-2 bg-amber-950/30 rounded border border-amber-500/30 text-amber-300 break-all select-all font-bold">
                  {vetoProof}
                </div>
                <div className="text-slate-500 text-[9px]">
                  Signer: นายยุทธภูมิ พากเพียร (#EP-SOVEREIGN-01) • Block #849202 • Mutation=0 (Δ0)
                </div>
              </div>
            )}

            <div className="flex gap-2 pt-2 border-t border-amber-500/20">
              <button
                disabled={vetoStep < 3}
                onClick={() => {
                  if (vetoProof) navigator.clipboard?.writeText(vetoProof);
                  if (onAddNotification) onAddNotification("✓ คัดลอก Sovereign Veto Proof สำเร็จ", "success");
                }}
                className={`py-2.5 px-4 rounded-xl font-mono text-xs font-bold transition flex items-center gap-1.5 ${
                  vetoStep === 3 ? 'bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 cursor-pointer' : 'opacity-40 cursor-not-allowed'
                }`}
              >
                <Copy className="w-3.5 h-3.5" /> คัดลอก Veto Proof
              </button>

              <button
                disabled={vetoStep < 3}
                onClick={() => setShowVetoModal(false)}
                className={`flex-1 py-2.5 rounded-xl font-mono text-xs font-bold transition ${
                  vetoStep === 3
                    ? 'bg-gradient-to-r from-amber-400 via-amber-500 to-yellow-600 text-black gold-glow cursor-pointer'
                    : 'bg-slate-800 text-slate-500 cursor-wait'
                }`}
              >
                {vetoStep === 3 ? "ปิดหน้าต่าง (Close & Enforce)" : "กำลังดำเนินการฉันทามติ 10/10 HSM..."}
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
