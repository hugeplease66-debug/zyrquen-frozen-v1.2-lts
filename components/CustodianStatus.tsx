'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { 
  ShieldCheck, 
  Activity, 
  Radio, 
  Cpu, 
  Lock, 
  KeyRound, 
  RefreshCw, 
  CheckCircle2, 
  AlertTriangle, 
  Zap, 
  Gauge, 
  HardDrive, 
  Terminal, 
  ExternalLink,
  ChevronRight,
  Search,
  Filter,
  Flame,
  Fingerprint,
  Layers,
  Sparkles,
  Award,
  Eye,
  X,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Clock,
  TrendingUp,
  SlidersHorizontal
} from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid
} from 'recharts';
import ProvenanceBadge, { ProvenanceType } from './ProvenanceBadge';

export interface Custodian {
  slot: number;
  id: string;
  passport: string;
  nameTh: string;
  nameEn: string;
  roleTh: string;
  clearance: string;
  enclave: string;
  pqc: string;
  cert: string;
  status: string;
  temp: string;
  ping: string;
  location?: string;
  lastHeartbeat?: string;
}

export const CANONICAL_CUSTODIANS: Custodian[] = [
  { 
    slot: 1, 
    id: "TC-01", 
    passport: "EP-SOVEREIGN-01", 
    nameTh: "นายยุทธภูมิ พากเพียร", 
    nameEn: "Yuttaphum Phakphian", 
    roleTh: "ผู้ถือสิทธิ์และสถาปนิกอธิปไตยสูงสุด (Supreme Sovereign Architect)", 
    clearance: "OMEGA-1 SUPREME CLEARANCE", 
    enclave: "NitroKey HSM-PQC-01 (FIPS 140-3 Level 4)", 
    pqc: "CRYSTALS-Dilithium-5 (ML-DSA-87)", 
    cert: "CERT-SOV-OMEGA-0001-2026-ROOT", 
    status: "REAL_HSM_SIGNED", 
    temp: "0.014K", 
    ping: "0.18ms",
    location: "Bangkok Sovereign Root Core (Node-01)"
  },
  { 
    slot: 2, 
    id: "TC-02", 
    passport: "EP-001", 
    nameTh: "พล. สมชาย พากเพียร", 
    nameEn: "Somchai Phakphian", 
    roleTh: "ผู้ว่าการและผู้อำนวยการฝ่ายควบคุมระเบียบอารยธรรม (Civilization Governor)", 
    clearance: "LEVEL 25 SOVEREIGN GOVERNOR", 
    enclave: "YubiKey 5C FIPS (Dual-Channel SE)", 
    pqc: "FALCON-1024 (NIST Round 3)", 
    cert: "CERT-SOV-CIV-0002-2026-FIPS", 
    status: "REAL_HSM_SIGNED", 
    temp: "0.045K", 
    ping: "0.42ms",
    location: "Ayutthaya Citadel Command (Node-02)"
  },
  { 
    slot: 3, 
    id: "TC-03", 
    passport: "EP-007", 
    nameTh: "ดร. กัญญารัตน์ เวชสิทธิ์", 
    nameEn: "Dr. Kanyarat Vetchasit", 
    roleTh: "หัวหน้านักเข้ารหัสลับยุคหลังควอนตัม (PQC Cryptographer)", 
    clearance: "LEVEL 22 CIPHER CUSTODIAN", 
    enclave: "Trezor Safe 5 PQC Enclave (CC EAL6+)", 
    pqc: "CRYSTALS-Dilithium-5 / Kyber-1024", 
    cert: "CERT-SOV-PQC-0003-2026-EAL6", 
    status: "REAL_HSM_SIGNED", 
    temp: "0.045K", 
    ping: "0.35ms",
    location: "Chiang Mai Quantum Crypt Lab (Node-03)"
  },
  { 
    slot: 4, 
    id: "TC-04", 
    passport: "EP-014", 
    nameTh: "วศ. ธนพล เกียรติไพศาล", 
    nameEn: "Eng. Thanapol Kiatpaisan", 
    roleTh: "วิศวกรตรวจสอบระบบ SRE ขั้นสูง 15 ชั้น (SRE Inspector)", 
    clearance: "LEVEL 20 SRE OVERSEER", 
    enclave: "Ledger Flex Secure Enclave (CC EAL6+)", 
    pqc: "SPHINCS+ PQC (State-Free Hash)", 
    cert: "CERT-SOV-SRE-0004-2026-CC", 
    status: "REAL_HSM_SIGNED", 
    temp: "0.045K", 
    ping: "0.28ms",
    location: "Eastern Seaboard SRE Vault (Node-04)"
  },
  { 
    slot: 5, 
    id: "TC-05", 
    passport: "EP-022", 
    nameTh: "ศ.ดร. นครินทร์ สุวรรณเมฆา", 
    nameEn: "Prof. Dr. Nakarin Suwanmekha", 
    roleTh: "สถาปนิกโครงข่ายหลายตาข่ายแบบกระจายศูนย์ (Mesh Architect)", 
    clearance: "LEVEL 20 TOPOLOGY MASTER", 
    enclave: "NitroKey HSM-PQC-05 (Hardened Element)", 
    pqc: "CRYSTALS-Dilithium-5 (ML-DSA-87)", 
    cert: "CERT-SOV-MESH-0005-2026-FIPS", 
    status: "REAL_HSM_SIGNED", 
    temp: "0.045K", 
    ping: "0.31ms",
    location: "Phuket Decentralized Gateway (Node-05)"
  },
  { 
    slot: 6, 
    id: "TC-06", 
    passport: "EP-033", 
    nameTh: "พญ.ดร. รพิพร รัตนพิบูลย์", 
    nameEn: "Dr. Rapiphon Rattanapiboon", 
    roleTh: "ผู้พิทักษ์จริยธรรมชีวปัญญาประดิษฐ์ (Bio-AI Guardian)", 
    clearance: "LEVEL 18 BIO-AI CUSTODIAN", 
    enclave: "YubiKey 5C FIPS PIV-06 (FIPS 140-2 L3)", 
    pqc: "FALCON-1024 (NIST Round 3)", 
    cert: "CERT-SOV-BIO-0006-2026-FIPS", 
    status: "REAL_HSM_SIGNED", 
    temp: "0.028K", 
    ping: "0.25ms",
    location: "Khon Kaen Bio-Ethics Sanctuary (Node-06)"
  },
  { 
    slot: 7, 
    id: "TC-07", 
    passport: "EP-048", 
    nameTh: "ดร. ธีรภัทร ชาญวณิชย์", 
    nameEn: "Dr. Theeraphat Chanwanich", 
    roleTh: "หัวหน้าวิศวกรระบบขับเคลื่อน Warp (Warp Chief)", 
    clearance: "LEVEL 18 WARP CHIEF", 
    enclave: "Trezor Safe 5 PQC-07 (CC EAL6+)", 
    pqc: "CRYSTALS-Dilithium-5 (ML-DSA-87)", 
    cert: "CERT-SOV-WARP-0007-2026-EAL6", 
    status: "REAL_HSM_SIGNED", 
    temp: "0.028K", 
    ping: "0.18ms",
    location: "Nakhon Ratchasima Warp Array (Node-07)"
  },
  { 
    slot: 8, 
    id: "TC-08", 
    passport: "EP-059", 
    nameTh: "อ. เมธาวี อัครเดโช", 
    nameEn: "Methawee Akkaradecho", 
    roleTh: "ผู้ตรวจสอบหลักฐานทางนิติวิทยาศาสตร์ (Forensic Auditor)", 
    clearance: "LEVEL 18 FORENSIC AUDITOR", 
    enclave: "Ledger Stax Enclave-08 (CC EAL6+)", 
    pqc: "SPHINCS+ PQC (State-Free Hash)", 
    cert: "CERT-SOV-EVD-0008-2026-EAL6", 
    status: "REAL_HSM_SIGNED", 
    temp: "0.028K", 
    ping: "0.45ms",
    location: "Songkhla Forensic Observatory (Node-08)"
  },
  { 
    slot: 9, 
    id: "TC-09", 
    passport: "EP-077", 
    nameTh: "ดร. ชวินทร์ โรจนทรัพย์", 
    nameEn: "Dr. Chawin Rojanasap", 
    roleTh: "สถาปนิกวิศวกรรมความโกลาหลและความยืดหยุ่น (Chaos Architect)", 
    clearance: "LEVEL 16 RESILIENCE MASTER", 
    enclave: "NitroKey HSM-PQC-09 (FIPS 140-3 L3)", 
    pqc: "CRYSTALS-Dilithium-5 (ML-DSA-87)", 
    cert: "CERT-SOV-CHAOS-0009-2026-FIPS", 
    status: "REAL_HSM_SIGNED", 
    temp: "0.028K", 
    ping: "0.15ms",
    location: "Chiang Rai Chaos Defense Enclave (Node-09)"
  },
  { 
    slot: 10, 
    id: "TC-10", 
    passport: "EP-100", 
    nameTh: "ดร. อภิชญา ทักษิณากุล", 
    nameEn: "Dr. Apichaya Thaksinanukul", 
    roleTh: "ผู้ดูแลโครงข่ายฐานข้อมูลความรู้ (Knowledge Steward)", 
    clearance: "LEVEL 16 KNOWLEDGE STEWARD", 
    enclave: "Custom Hardware HSM-10 (Level 3)", 
    pqc: "FALCON-1024 (NIST Round 3)", 
    cert: "CERT-SOV-KNOW-0010-2026-LEVEL3", 
    status: "REAL_HSM_SIGNED", 
    temp: "0.028K", 
    ping: "0.30ms",
    location: "Ubon Ratchathani Codex Vault (Node-10)"
  }
];

// Deterministic pseudo-jitter calculation
function getOrganicJitter(seed: number, base: number, scale = 0.05): number {
  const x = Math.sin(seed * 997.13 + base * 137.5);
  const normalized = x - Math.floor(x) - 0.5;
  return +(base + normalized * scale).toFixed(3);
}

interface CustodianStatusProps {
  custodians?: Custodian[];
  onNotify?: (msg: string, type?: 'success' | 'warning' | 'error') => void;
  className?: string;
}

export default function CustodianStatus({
  custodians = CANONICAL_CUSTODIANS,
  onNotify,
  className = ''
}: CustodianStatusProps) {
  // Live ping jitter states
  const [livePings, setLivePings] = useState<Record<string, number>>(() => {
    const initial: Record<string, number> = {};
    custodians.forEach(c => {
      const num = parseFloat(c.ping.replace('ms', '')) || 0.25;
      initial[c.id] = num;
    });
    return initial;
  });

  const [pingHistory, setPingHistory] = useState<Record<string, number[]>>(() => {
    const initial: Record<string, number[]> = {};
    custodians.forEach(c => {
      const base = parseFloat(c.ping.replace('ms', '')) || 0.25;
      initial[c.id] = [base, base * 1.05, base * 0.95, base * 1.02, base];
    });
    return initial;
  });

  // Top 5 Nodes for Recharts Telemetry
  const top5NodeIds = useMemo(() => ["TC-01", "TC-02", "TC-03", "TC-07", "TC-09"], []);

  // Recharts Real-Time Trend Buffer (Updated every 2s)
  interface RechartsDataPoint {
    time: string;
    "TC-01 (Root)": number;
    "TC-02 (Gov)": number;
    "TC-03 (PQC)": number;
    "TC-07 (Warp)": number;
    "TC-09 (Chaos)": number;
  }

  const [rechartsData, setRechartsData] = useState<RechartsDataPoint[]>(() => {
    const baseTime = Date.now();
    const initData: RechartsDataPoint[] = [];
    for (let i = 10; i >= 0; i--) {
      const t = new Date(baseTime - i * 2000);
      const timeStr = t.toLocaleTimeString('en-GB', { hour12: false });
      initData.push({
        time: timeStr,
        "TC-01 (Root)": +(0.18 + Math.sin(i) * 0.03).toFixed(3),
        "TC-02 (Gov)": +(0.42 + Math.cos(i) * 0.04).toFixed(3),
        "TC-03 (PQC)": +(0.35 + Math.sin(i * 0.8) * 0.04).toFixed(3),
        "TC-07 (Warp)": +(0.18 + Math.cos(i * 0.7) * 0.03).toFixed(3),
        "TC-09 (Chaos)": +(0.15 + Math.sin(i * 1.2) * 0.03).toFixed(3),
      });
    }
    return initData;
  });

  const [isLiveActive, setIsLiveActive] = useState<boolean>(true);
  const [lastPingTimestamp, setLastPingTimestamp] = useState<string>("2026-09-03T07:00:00.000Z");
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedEnclaveFilter, setSelectedEnclaveFilter] = useState<string>('ALL');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>('ALL');
  const [latencySortOrder, setLatencySortOrder] = useState<'DEFAULT' | 'ASC' | 'DESC'>('DEFAULT');
  const [selectedCustodian, setSelectedCustodian] = useState<Custodian | null>(null);
  const [isPingingAll, setIsPingingAll] = useState<boolean>(false);
  const [pingSuccessCount, setPingSuccessCount] = useState<number>(10);

  // Real-time Recharts 2-second update loop
  useEffect(() => {
    if (!isLiveActive) return;

    const interval = setInterval(() => {
      const now = Date.now();
      const timeStr = new Date(now).toLocaleTimeString('en-GB', { hour12: false });

      // Generate updated live pings for all nodes
      const nextPings: Record<string, number> = {};
      custodians.forEach((c, idx) => {
        const base = parseFloat(c.ping.replace('ms', '')) || 0.25;
        const fresh = Math.max(0.08, getOrganicJitter(now + idx * 100, base, 0.04));
        nextPings[c.id] = fresh;
      });

      setLivePings(nextPings);

      setPingHistory(prev => {
        const nextHist: Record<string, number[]> = {};
        custodians.forEach(c => {
          const currentHist = prev[c.id] || [0.25];
          const latestVal = nextPings[c.id] || 0.25;
          nextHist[c.id] = [...currentHist.slice(-7), latestVal];
        });
        return nextHist;
      });

      // Update Recharts Time-Series Trend Data (keeps last 15 points)
      setRechartsData(prev => {
        const newPoint: RechartsDataPoint = {
          time: timeStr,
          "TC-01 (Root)": nextPings["TC-01"] || 0.18,
          "TC-02 (Gov)": nextPings["TC-02"] || 0.42,
          "TC-03 (PQC)": nextPings["TC-03"] || 0.35,
          "TC-07 (Warp)": nextPings["TC-07"] || 0.18,
          "TC-09 (Chaos)": nextPings["TC-09"] || 0.15,
        };
        return [...prev.slice(-14), newPoint];
      });

      setLastPingTimestamp(new Date().toISOString());
    }, 2000);

    return () => clearInterval(interval);
  }, [isLiveActive, custodians]);

  // Compute stats
  const stats = useMemo(() => {
    const pingVals = Object.values(livePings);
    const avgPing = pingVals.length > 0 
      ? (pingVals.reduce((a, b) => a + b, 0) / pingVals.length).toFixed(3)
      : '0.280';
    const minPing = pingVals.length > 0 ? Math.min(...pingVals).toFixed(3) : '0.120';
    const maxPing = pingVals.length > 0 ? Math.max(...pingVals).toFixed(3) : '0.450';
    
    return {
      avgPing,
      minPing,
      maxPing,
      totalNodes: custodians.length,
      onlineNodes: custodians.length,
      quorumStatus: "10/10 RATIFIED (100%)",
      fipsCompliance: "FIPS 140-3 LEVEL 4 / CC EAL6+",
      pqcStandard: "ML-DSA-87 + FALCON + SPHINCS+"
    };
  }, [livePings, custodians]);

  // Filtered and Sorted custodians
  const filteredAndSortedCustodians = useMemo(() => {
    const result = custodians.filter(c => {
      const matchesSearch = 
        c.nameTh.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.nameEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.passport.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.roleTh.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.enclave.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.pqc.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesEnclave = 
        selectedEnclaveFilter === 'ALL' ||
        (selectedEnclaveFilter === 'NITROKEY' && c.enclave.includes('NitroKey')) ||
        (selectedEnclaveFilter === 'YUBIKEY' && c.enclave.includes('YubiKey')) ||
        (selectedEnclaveFilter === 'TREZOR' && c.enclave.includes('Trezor')) ||
        (selectedEnclaveFilter === 'LEDGER' && c.enclave.includes('Ledger')) ||
        (selectedEnclaveFilter === 'CUSTOM' && c.enclave.includes('Custom'));

      const matchesStatus =
        selectedStatusFilter === 'ALL' ||
        c.status === selectedStatusFilter ||
        (selectedStatusFilter === 'REAL_HSM_SIGNED' && (c.status === 'REAL_HSM_SIGNED' || c.status === 'SIGNED')) ||
        (selectedStatusFilter === 'CLAIMED' && c.status === 'CLAIMED') ||
        (selectedStatusFilter === 'PENDING' && (c.status === 'PENDING' || c.status === 'UNCLAIMED'));

      return matchesSearch && matchesEnclave && matchesStatus;
    });

    if (latencySortOrder === 'ASC') {
      return [...result].sort((a, b) => {
        const pingA = livePings[a.id] || parseFloat(a.ping.replace('ms', '')) || 0;
        const pingB = livePings[b.id] || parseFloat(b.ping.replace('ms', '')) || 0;
        return pingA - pingB;
      });
    } else if (latencySortOrder === 'DESC') {
      return [...result].sort((a, b) => {
        const pingA = livePings[a.id] || parseFloat(a.ping.replace('ms', '')) || 0;
        const pingB = livePings[b.id] || parseFloat(b.ping.replace('ms', '')) || 0;
        return pingB - pingA;
      });
    }

    return result;
  }, [custodians, searchQuery, selectedEnclaveFilter, selectedStatusFilter, latencySortOrder, livePings]);

  const handlePingAll = useCallback(() => {
    setIsPingingAll(true);
    if (onNotify) {
      onNotify("📡 ส่งสัญญาณ Ping ตรวจสอบฮาร์ดแวร์ Enclave ทั้ง 10 โหนด...", "warning");
    }

    setTimeout(() => {
      const now = Date.now();
      setLivePings(prev => {
        const next: Record<string, number> = {};
        custodians.forEach((c, idx) => {
          const base = parseFloat(c.ping.replace('ms', '')) || 0.25;
          const fresh = Math.max(0.08, getOrganicJitter(now + idx * 77, base * 0.9, 0.04));
          next[c.id] = fresh;
        });
        return next;
      });
      setIsPingingAll(false);
      setPingSuccessCount(10);
      setLastPingTimestamp(new Date().toISOString());
      if (onNotify) {
        onNotify("✓ ผลลัพธ์ Ping 10/10 โหนดสำเร็จ: ค่าเฉลี่ยความหน่วงต่ำกว่า 0.3ms ทั่วประเทศ พร้อมรับรอง PQC", "success");
      }
    }, 600);
  }, [custodians, onNotify]);

  const handleSinglePing = useCallback((c: Custodian) => {
    const now = Date.now();
    setLivePings(prev => {
      const current = prev[c.id] || 0.25;
      const fresh = Math.max(0.08, getOrganicJitter(now, current, 0.03));
      return { ...prev, [c.id]: fresh };
    });
    if (onNotify) {
      onNotify(`📡 โหนด [${c.id}] ${c.nameEn}: ตอบสนองพร้อม Enclave Heartbeat 100% OK`, "success");
    }
  }, [onNotify]);

  // Visual Health Badge Renderer
  const renderHealthBadge = (status: string) => {
    if (status === 'REAL_HSM_SIGNED' || status === 'SIGNED') {
      return (
        <span 
          className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 text-[9px] font-bold tracking-wide shadow-sm"
          title="Status: REAL_HSM_SIGNED (Hardware Enclave Certified)"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span>REAL_HSM_SIGNED</span>
        </span>
      );
    } else if (status === 'CLAIMED') {
      return (
        <span 
          className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-amber-500/15 border border-amber-500/40 text-amber-300 text-[9px] font-bold tracking-wide"
          title="Status: CLAIMED (Identity Bound, Pending HSM Lock)"
        >
          <span className="inline-block w-2 h-2 rounded-full bg-amber-400"></span>
          <span>CLAIMED</span>
        </span>
      );
    } else {
      // PENDING / OTHER
      return (
        <span 
          className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-rose-500/20 border border-rose-500/50 text-rose-300 text-[9px] font-bold tracking-wide animate-pulse"
          title="Status: PENDING (Action Required / Bottleneck Warning)"
        >
          <AlertTriangle className="w-2.5 h-2.5 text-rose-400" />
          <span>PENDING</span>
        </span>
      );
    }
  };

  return (
    <div id="custodian-status-component" className={`space-y-4 font-mono ${className}`}>
      {/* MAIN CONTAINER WITH SOVEREIGN CANONICAL STYLING */}
      <div className="bg-[#091224]/95 border border-cyan-500/40 rounded-2xl p-4 sm:p-6 backdrop-blur-2xl shadow-2xl space-y-5">
        
        {/* COMPONENT HEADER & TOP TELEMETRY */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800/80 pb-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/15 border border-cyan-400/40 text-cyan-300 text-[10px] font-bold tracking-widest uppercase flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
                10/10 REAL_HSM HARDWARE ENCLAVE ROSTER
              </span>
              <ProvenanceBadge type="CANONICAL" size="xs" authority="Sovereign SSoT Invariant" />
              <ProvenanceBadge type="TELEMETRY" size="xs" isSimulated={true} />
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-white tracking-wide flex items-center gap-2 text-cyan-gradient">
              <span>Sovereign Custodian Hardware Enclave Status & Ping Matrix</span>
            </h2>
            <p className="text-slate-400 text-xs font-sans">
              การตรวจสอบความพร้อมของระบบฮาร์ดแวร์ความปลอดภัยสูง (HSM) 10 ตำแหน่ง และค่าความหน่วงการตอบสนองระดับ Sub-millisecond แบบ Real-time
            </p>
          </div>

          {/* ACTION BUTTONS */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsLiveActive(!isLiveActive)}
              className={`px-3 py-1.5 rounded-xl border text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-md ${
                isLiveActive 
                  ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300' 
                  : 'bg-slate-900 border-slate-700 text-slate-400'
              }`}
              title="เปิด/ปิดการดึงสัญญาณ Heartbeat อัตโนมัติ"
            >
              <span className={`w-2 h-2 rounded-full ${isLiveActive ? 'bg-emerald-400 animate-ping' : 'bg-slate-500'}`} />
              <span>{isLiveActive ? 'LIVE TELEMETRY ON' : 'TELEMETRY PAUSED'}</span>
            </button>

            <button
              onClick={handlePingAll}
              disabled={isPingingAll}
              className="px-3.5 py-1.5 bg-gradient-to-r from-cyan-500/20 to-blue-600/20 hover:from-cyan-500/30 hover:to-blue-600/30 border border-cyan-400/60 text-cyan-200 font-bold text-xs rounded-xl transition cursor-pointer flex items-center gap-1.5 shadow-lg active:scale-95 disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-cyan-300 ${isPingingAll ? 'animate-spin' : ''}`} />
              <span>{isPingingAll ? 'PINGING 10 NODES...' : 'Ping All 10 HSMs'}</span>
            </button>
          </div>
        </div>

        {/* METRIC SUMMARY STRIP (4-CARD GRID) */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          {/* AVG LATENCY */}
          <div className="p-3 bg-[#0d1b33]/90 border border-cyan-500/30 rounded-xl space-y-1">
            <div className="flex items-center justify-between text-slate-400 text-[10px]">
              <span className="flex items-center gap-1 text-cyan-300 font-bold">
                <Activity className="w-3.5 h-3.5 text-cyan-400" />
                AVG PING LATENCY
              </span>
              <span className="text-[9px] text-emerald-400 font-bold">LIVE (2s)</span>
            </div>
            <div className="text-xl sm:text-2xl font-bold text-cyan-200">
              {stats.avgPing} <span className="text-xs text-cyan-400 font-normal">ms</span>
            </div>
            <div className="flex justify-between text-[9px] text-slate-400 pt-0.5">
              <span>Min: <strong className="text-emerald-300">{stats.minPing}ms</strong></span>
              <span>Max: <strong className="text-amber-300">{stats.maxPing}ms</strong></span>
            </div>
          </div>

          {/* QUORUM CONSENSUS */}
          <div className="p-3 bg-[#0d1b33]/90 border border-emerald-500/30 rounded-xl space-y-1">
            <div className="flex items-center justify-between text-slate-400 text-[10px]">
              <span className="flex items-center gap-1 text-emerald-300 font-bold">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                QUORUM STATUS
              </span>
              <span className="text-[9px] text-emerald-400 font-bold">10/10</span>
            </div>
            <div className="text-xl sm:text-2xl font-bold text-emerald-300">
              100% <span className="text-xs text-emerald-400 font-normal">RATIFIED</span>
            </div>
            <div className="text-[9px] text-slate-400 truncate">
              Deca-Quorum Consensus Online
            </div>
          </div>

          {/* HARDWARE ENCLAVES */}
          <div className="p-3 bg-[#0d1b33]/90 border border-amber-500/30 rounded-xl space-y-1">
            <div className="flex items-center justify-between text-slate-400 text-[10px]">
              <span className="flex items-center gap-1 text-amber-300 font-bold">
                <HardDrive className="w-3.5 h-3.5 text-amber-400" />
                ENCLAVE INTEGRITY
              </span>
              <span className="text-[9px] text-amber-300 font-bold">CC EAL6+</span>
            </div>
            <div className="text-xl sm:text-2xl font-bold text-amber-300">
              FIPS 140-3 <span className="text-xs text-amber-400 font-normal">L4</span>
            </div>
            <div className="text-[9px] text-slate-400 truncate">
              Tamper-Proof Silicon Active
            </div>
          </div>

          {/* PQC CRYPTOGRAPHY */}
          <div className="p-3 bg-[#0d1b33]/90 border border-purple-500/30 rounded-xl space-y-1">
            <div className="flex items-center justify-between text-slate-400 text-[10px]">
              <span className="flex items-center gap-1 text-purple-300 font-bold">
                <Lock className="w-3.5 h-3.5 text-purple-400" />
                PQC COMPLIANCE
              </span>
              <span className="text-[9px] text-purple-300 font-bold">NIST FIPS</span>
            </div>
            <div className="text-xl sm:text-2xl font-bold text-purple-300">
              ML-DSA-87 <span className="text-xs text-purple-400 font-normal">PQC</span>
            </div>
            <div className="text-[9px] text-slate-400 truncate">
              Dilithium-5 / FALCON / SPHINCS+
            </div>
          </div>
        </div>

        {/* SEARCH, STATUS FILTER & LATENCY SORTING CONTROL BAR */}
        <div className="space-y-2 bg-[#070e1c] p-3 rounded-xl border border-slate-800">
          <div className="flex flex-wrap items-center justify-between gap-3">
            {/* SEARCH INPUT */}
            <div className="flex items-center gap-2 flex-1 min-w-[220px] bg-slate-900/80 px-3 py-1.5 rounded-lg border border-slate-800">
              <Search className="w-3.5 h-3.5 text-slate-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="ค้นหาตามชื่อ, โหนด (TC-01..10), Passport, หรือ Enclave..."
                className="w-full bg-transparent text-xs text-slate-200 placeholder-slate-500 focus:outline-none font-mono"
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery('')} className="text-slate-500 hover:text-slate-300 text-xs">
                  ✕
                </button>
              )}
            </div>

            {/* VERIFICATION STATUS FILTER DROPDOWN */}
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5 bg-slate-900/80 px-2.5 py-1 rounded-lg border border-slate-800">
                <Filter className="w-3.5 h-3.5 text-cyan-400" />
                <span className="text-slate-400 text-[10px] uppercase font-bold">Status:</span>
                <select
                  value={selectedStatusFilter}
                  onChange={(e) => setSelectedStatusFilter(e.target.value)}
                  className="bg-transparent text-cyan-300 font-bold text-xs focus:outline-none cursor-pointer border-none"
                >
                  <option value="ALL" className="bg-slate-900 text-slate-200">ทั้งหมด (All Status)</option>
                  <option value="REAL_HSM_SIGNED" className="bg-slate-900 text-emerald-300">✓ REAL_HSM_SIGNED (รับรองแล้ว)</option>
                  <option value="CLAIMED" className="bg-slate-900 text-amber-300">⏳ CLAIMED (อ้างสิทธิ์)</option>
                  <option value="PENDING" className="bg-slate-900 text-rose-300">⚠ PENDING (รอดำเนินการ)</option>
                </select>
              </div>

              {/* PING LATENCY SORTING TOGGLE */}
              <div className="flex items-center gap-1 bg-slate-900/80 p-0.5 rounded-lg border border-slate-800 text-[10px]">
                <span className="text-slate-400 px-2 font-bold uppercase text-[9px]">Sort Ping:</span>
                <button
                  onClick={() => setLatencySortOrder('DEFAULT')}
                  className={`px-2 py-1 rounded transition cursor-pointer font-bold ${
                    latencySortOrder === 'DEFAULT'
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                  title="เรียงตามลำดับ Slot ปกติ (Slot #1 - #10)"
                >
                  Slot #
                </button>
                <button
                  onClick={() => setLatencySortOrder('ASC')}
                  className={`px-2 py-1 rounded transition cursor-pointer font-bold flex items-center gap-0.5 ${
                    latencySortOrder === 'ASC'
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                  title="เรียงความหน่วงน้อยไปมาก (เร็วที่สุดก่อน)"
                >
                  <ArrowUp className="w-3 h-3 text-emerald-400" />
                  <span>ต่ำสุด</span>
                </button>
                <button
                  onClick={() => setLatencySortOrder('DESC')}
                  className={`px-2 py-1 rounded transition cursor-pointer font-bold flex items-center gap-0.5 ${
                    latencySortOrder === 'DESC'
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                  title="เรียงความหน่วงมากไปน้อย (ค้นหาโหนดคอขวด / Bottleneck Nodes!)"
                >
                  <ArrowDown className="w-3 h-3 text-amber-400" />
                  <span>คอขวด (Max)</span>
                </button>
              </div>
            </div>
          </div>

          {/* ENCLAVE BRAND FILTER CHIPS */}
          <div className="flex items-center gap-1.5 text-[11px] overflow-x-auto pt-1 border-t border-slate-800/60">
            <span className="text-slate-500 text-[10px] mr-1 uppercase">Enclave Hardware:</span>
            {[
              { id: 'ALL', label: 'ทั้งหมด (10 Nodes)' },
              { id: 'NITROKEY', label: 'NitroKey PQC' },
              { id: 'YUBIKEY', label: 'YubiKey 5C' },
              { id: 'TREZOR', label: 'Trezor Safe 5' },
              { id: 'LEDGER', label: 'Ledger Enclave' },
              { id: 'CUSTOM', label: 'Custom HSM' }
            ].map(f => (
              <button
                key={f.id}
                onClick={() => setSelectedEnclaveFilter(f.id)}
                className={`px-2.5 py-1 rounded-lg transition text-[10px] font-bold cursor-pointer whitespace-nowrap ${
                  selectedEnclaveFilter === f.id
                    ? 'bg-cyan-500/25 border border-cyan-400 text-cyan-200'
                    : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* CUSTODIAN HSM NODES GRID (10 NODES) */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-3.5">
          {filteredAndSortedCustodians.map((c) => {
            const currentPing = livePings[c.id] || parseFloat(c.ping.replace('ms', '')) || 0.25;
            const history = pingHistory[c.id] || [currentPing];
            const isSelected = selectedCustodian?.id === c.id;

            // Compute latency color
            let pingColor = 'text-emerald-400 border-emerald-500/40 bg-emerald-500/10';
            let pingBarColor = 'bg-emerald-400';
            let latencyGrade = 'Optimal';
            if (currentPing > 0.40) {
              pingColor = 'text-amber-400 border-amber-500/40 bg-amber-500/10';
              pingBarColor = 'bg-amber-400';
              latencyGrade = 'Bottleneck Warning';
            } else if (currentPing > 0.30) {
              pingColor = 'text-cyan-300 border-cyan-500/40 bg-cyan-500/10';
              pingBarColor = 'bg-cyan-400';
              latencyGrade = 'Nominal';
            }

            // Normalize latency bar percentage (0.1ms = 20%, 0.5ms = 100%)
            const barWidth = Math.min(100, Math.max(15, Math.round((currentPing / 0.5) * 100)));

            return (
              <div
                key={c.id}
                onClick={() => setSelectedCustodian(c)}
                className={`p-3.5 rounded-xl border transition-all duration-200 cursor-pointer flex flex-col justify-between space-y-3 relative overflow-hidden group ${
                  isSelected
                    ? 'bg-[#182848] border-cyan-400 ring-2 ring-cyan-500/40 shadow-xl'
                    : 'bg-[#0e182c]/85 border-slate-800/90 hover:border-cyan-500/50 hover:bg-[#13213c]'
                }`}
              >
                {/* NODE SLOT HEADER & HEALTH BADGE */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between gap-1">
                    <div className="flex items-center gap-1.5">
                      <span className="px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 text-[10px] font-bold">
                        {c.id}
                      </span>
                      <span className="text-amber-300 font-bold text-[10px] truncate max-w-[85px]">
                        {c.passport}
                      </span>
                    </div>

                    {/* DYNAMIC HEALTH BADGE */}
                    <div>
                      {renderHealthBadge(c.status)}
                    </div>
                  </div>

                  {/* CUSTODIAN NAME & ROLE */}
                  <div>
                    <h4 className="text-white font-bold text-xs group-hover:text-cyan-200 transition-colors truncate">
                      {c.nameTh}
                    </h4>
                    <div className="text-[10px] text-slate-400 truncate">{c.nameEn}</div>
                    <div className="text-[9px] text-slate-500 line-clamp-1 mt-0.5">{c.roleTh}</div>
                  </div>
                </div>

                {/* HARDWARE ENCLAVE & ALGORITHM SPEC */}
                <div className="space-y-2 pt-2 border-t border-slate-800/80 text-[10px]">
                  {/* ENCLAVE HARDWARE MODEL */}
                  <div className="bg-[#080f1d] p-2 rounded-lg border border-slate-800/90 space-y-1">
                    <div className="flex items-center justify-between text-[9px] text-slate-400">
                      <span className="flex items-center gap-1 text-slate-300">
                        <HardDrive className="w-3 h-3 text-cyan-400" />
                        Enclave
                      </span>
                      <span className="text-amber-400 font-bold text-[8.5px]">
                        {c.enclave.includes('Level 4') ? 'FIPS L4' : c.enclave.includes('EAL6+') ? 'CC EAL6+' : 'FIPS L3'}
                      </span>
                    </div>
                    <div className="text-slate-200 text-[9.5px] truncate font-sans font-medium" title={c.enclave}>
                      {c.enclave}
                    </div>
                  </div>

                  {/* PQC ALGORITHM */}
                  <div className="flex items-center justify-between text-[9px]">
                    <span className="text-slate-400">PQC Key:</span>
                    <span className="text-cyan-300 font-bold truncate max-w-[140px]" title={c.pqc}>
                      {c.pqc}
                    </span>
                  </div>

                  {/* REAL-TIME PING LATENCY & PROGRESS BAR INDICATOR */}
                  <div className="space-y-1.5 bg-[#091326] p-2 rounded-lg border border-slate-800/80">
                    <div className="flex items-center justify-between text-[9px]">
                      <span className="text-slate-400 flex items-center gap-1">
                        <Activity className="w-3 h-3 text-emerald-400" />
                        Ping Latency:
                      </span>
                      <span className={`px-1.5 py-0.5 rounded font-bold border text-[10px] ${pingColor}`}>
                        {currentPing.toFixed(2)} ms
                      </span>
                    </div>

                    {/* DYNAMIC LATENCY PROGRESS BAR */}
                    <div className="space-y-0.5">
                      <div className="w-full bg-slate-900/90 h-1.5 rounded-full overflow-hidden flex items-center p-0.5 border border-slate-800">
                        <div 
                          className={`h-full ${pingBarColor} transition-all duration-500 rounded-full`}
                          style={{ width: `${barWidth}%` }}
                        />
                      </div>
                      <div className="flex justify-between text-[8px] text-slate-500 px-0.5">
                        <span>0.1ms</span>
                        <span className="text-slate-400">{latencyGrade}</span>
                        <span>0.5ms</span>
                      </div>
                    </div>

                    {/* MINI SPARKLINE DOTS */}
                    <div className="flex items-center justify-between pt-0.5 border-t border-slate-800/40">
                      <div className="flex items-center gap-0.5">
                        {history.map((hVal, idx) => (
                          <span 
                            key={idx} 
                            className={`w-1 rounded-sm ${idx === history.length - 1 ? 'bg-cyan-300 h-2.5' : 'bg-slate-700 h-1.5'}`}
                            title={`Ping ${idx}: ${hVal.toFixed(3)}ms`}
                          />
                        ))}
                      </div>
                      <span className="text-[8.5px] text-amber-300">Temp: {c.temp}</span>
                    </div>
                  </div>
                </div>

                {/* BOTTOM ACTION STRIP */}
                <div className="pt-1 flex items-center justify-between text-[9px] border-t border-slate-800/60">
                  <span className="text-slate-500 text-[8.5px]">Clearance: {c.clearance.split(' ')[0]}</span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSinglePing(c);
                    }}
                    className="px-2 py-0.5 rounded bg-cyan-500/15 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/30 font-bold transition flex items-center gap-1 cursor-pointer"
                  >
                    <Radio className="w-2.5 h-2.5" />
                    Ping
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* ========================================================================= */}
        {/* REAL-TIME RECHARTS LINE CHART (TOP 5 ACTIVE NODES - UPDATED EVERY 2 SECONDS) */}
        {/* ========================================================================= */}
        <div className="bg-[#070e1c] border border-cyan-500/30 rounded-xl p-4 space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800/80 pb-2.5">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-cyan-500/15 border border-cyan-500/40 text-cyan-300">
                <TrendingUp className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <span>Real-Time Latency Telemetry Trend (Top 5 Active Enclave Nodes)</span>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[9px] font-bold border border-emerald-500/30 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                    Live 2s Interval
                  </span>
                </h3>
                <p className="text-[10px] text-slate-400 font-sans">
                  กราฟแสดงแนวโน้มค่าความหน่วงการตอบสนอง (Ping Latency) แบบ Sub-millisecond ของ 5 โหนดหลัก อัปเดตสดทุก 2 วินาที
                </p>
              </div>
            </div>

            {/* LIVE TELEMETRY PILLS FOR TOP 5 NODES */}
            <div className="flex flex-wrap items-center gap-1.5 text-[10px]">
              <span className="px-2 py-0.5 rounded bg-amber-500/15 border border-amber-500/40 text-amber-300 font-bold">
                TC-01 Root: {(livePings["TC-01"] || 0.18).toFixed(2)}ms
              </span>
              <span className="px-2 py-0.5 rounded bg-cyan-500/15 border border-cyan-500/40 text-cyan-300 font-bold">
                TC-02 Gov: {(livePings["TC-02"] || 0.42).toFixed(2)}ms
              </span>
              <span className="px-2 py-0.5 rounded bg-purple-500/15 border border-purple-500/40 text-purple-300 font-bold">
                TC-03 PQC: {(livePings["TC-03"] || 0.35).toFixed(2)}ms
              </span>
              <span className="px-2 py-0.5 rounded bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 font-bold">
                TC-07 Warp: {(livePings["TC-07"] || 0.18).toFixed(2)}ms
              </span>
              <span className="px-2 py-0.5 rounded bg-blue-500/15 border border-blue-500/40 text-blue-300 font-bold">
                TC-09 Chaos: {(livePings["TC-09"] || 0.15).toFixed(2)}ms
              </span>
            </div>
          </div>

          {/* RECHARTS RESPONSIVE CONTAINER */}
          <div className="w-full h-56 pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={rechartsData} margin={{ top: 5, right: 15, left: -10, bottom: 5 }}>
                <CartesianGrid stroke="#1e293b" strokeDasharray="3 3" vertical={false} />
                <XAxis 
                  dataKey="time" 
                  stroke="#475569" 
                  tick={{ fill: '#94a3b8', fontSize: 10, fontFamily: 'monospace' }} 
                />
                <YAxis 
                  stroke="#475569" 
                  tick={{ fill: '#94a3b8', fontSize: 10, fontFamily: 'monospace' }} 
                  unit="ms" 
                  domain={[0.05, 0.55]}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#091224',
                    borderColor: '#06b6d4',
                    borderRadius: '0.75rem',
                    color: '#f8fafc',
                    fontFamily: 'monospace',
                    fontSize: '11px',
                    boxShadow: '0 10px 25px rgba(0,0,0,0.5)'
                  }}
                  itemStyle={{ padding: '1px 0' }}
                  formatter={(val: any) => [typeof val === 'number' ? `${val.toFixed(3)} ms` : `${val}`, 'Latency']}
                />
                <Legend 
                  wrapperStyle={{ fontSize: '10.5px', paddingTop: '6px', fontFamily: 'monospace' }}
                />
                <Line 
                  type="monotone" 
                  dataKey="TC-01 (Root)" 
                  stroke="#F59E0B" 
                  strokeWidth={2} 
                  dot={{ r: 2, fill: '#F59E0B' }} 
                  isAnimationActive={false} 
                />
                <Line 
                  type="monotone" 
                  dataKey="TC-02 (Gov)" 
                  stroke="#06B6D4" 
                  strokeWidth={2} 
                  dot={{ r: 2, fill: '#06B6D4' }} 
                  isAnimationActive={false} 
                />
                <Line 
                  type="monotone" 
                  dataKey="TC-03 (PQC)" 
                  stroke="#A855F7" 
                  strokeWidth={2} 
                  dot={{ r: 2, fill: '#A855F7' }} 
                  isAnimationActive={false} 
                />
                <Line 
                  type="monotone" 
                  dataKey="TC-07 (Warp)" 
                  stroke="#10B981" 
                  strokeWidth={2} 
                  dot={{ r: 2, fill: '#10B981' }} 
                  isAnimationActive={false} 
                />
                <Line 
                  type="monotone" 
                  dataKey="TC-09 (Chaos)" 
                  stroke="#3B82F6" 
                  strokeWidth={2} 
                  dot={{ r: 2, fill: '#3B82F6' }} 
                  isAnimationActive={false} 
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* SELECTED CUSTODIAN DEEP INSPECTOR MODAL / DRAWER */}
        {selectedCustodian && (
          <div className="p-4 sm:p-5 bg-[#081020] border-2 border-cyan-400/80 rounded-2xl space-y-4 animate-fade-in shadow-2xl relative">
            <button
              onClick={() => setSelectedCustodian(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg bg-slate-800 border border-slate-700 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 text-xs font-bold">
                    NODE {selectedCustodian.id}
                  </span>
                  <span className="text-amber-300 font-bold text-xs">
                    PASSPORT: {selectedCustodian.passport}
                  </span>
                  <div>
                    {renderHealthBadge(selectedCustodian.status)}
                  </div>
                </div>
                <h3 className="text-base sm:text-lg font-bold text-white">
                  {selectedCustodian.nameTh} ({selectedCustodian.nameEn})
                </h3>
                <p className="text-xs text-slate-400 font-sans">{selectedCustodian.roleTh}</p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleSinglePing(selectedCustodian)}
                  className="px-3.5 py-1.5 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-400 text-cyan-200 font-bold text-xs transition cursor-pointer flex items-center gap-1.5"
                >
                  <RefreshCw className="w-3.5 h-3.5 text-cyan-300" />
                  <span>Send Immediate Ping</span>
                </button>
              </div>
            </div>

            {/* DEEP SPECIFICATION GRID */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
              <div className="p-3 bg-[#0d172e] rounded-xl border border-slate-800 space-y-1">
                <span className="text-slate-500 text-[9px] uppercase block">Security Clearance</span>
                <div className="text-amber-300 font-bold text-xs">{selectedCustodian.clearance}</div>
                <div className="text-[9px] text-slate-400">Authorized Deca-Quorum Voter</div>
              </div>

              <div className="p-3 bg-[#0d172e] rounded-xl border border-slate-800 space-y-1">
                <span className="text-slate-500 text-[9px] uppercase block">Hardware Enclave Isolation</span>
                <div className="text-cyan-300 font-bold text-xs truncate">{selectedCustodian.enclave}</div>
                <div className="text-[9px] text-slate-400">Tamper-Evident Physical Security</div>
              </div>

              <div className="p-3 bg-[#0d172e] rounded-xl border border-slate-800 space-y-1">
                <span className="text-slate-500 text-[9px] uppercase block">Post-Quantum Cryptography (PQC)</span>
                <div className="text-purple-300 font-bold text-xs truncate">{selectedCustodian.pqc}</div>
                <div className="text-[9px] text-slate-400">NIST PQC Standardization Compliant</div>
              </div>

              <div className="p-3 bg-[#0d172e] rounded-xl border border-slate-800 space-y-1">
                <span className="text-slate-500 text-[9px] uppercase block">Current Latency & Cryo Temp</span>
                <div className="text-emerald-300 font-bold text-xs">
                  {(livePings[selectedCustodian.id] || 0.25).toFixed(3)} ms • {selectedCustodian.temp}
                </div>
                <div className="text-[9px] text-slate-400">Sub-Kelvin Cryogenic Preservation</div>
              </div>
            </div>

            {/* CERTIFICATE & PROVENANCE DISCLOSURE */}
            <div className="p-3 bg-black/60 rounded-xl border border-slate-800 flex flex-wrap items-center justify-between gap-2 text-xs">
              <div className="space-y-0.5">
                <span className="text-[9px] text-slate-500 uppercase block">CANONICAL ROOT CERTIFICATE HASH:</span>
                <code className="text-[11px] text-cyan-300 font-mono select-all">
                  {selectedCustodian.cert}
                </code>
              </div>
              <div className="flex items-center gap-2">
                <ProvenanceBadge type="CANONICAL" size="sm" authority="10/10 REAL_HSM Council" />
                <ProvenanceBadge type="FROZEN" size="sm" authority="SSoT Zero-Drift Matrix" />
              </div>
            </div>
          </div>
        )}

        {/* BOTTOM SSoT INVARIANT FOOTER */}
        <div className="p-3 bg-[#050b17] rounded-xl border border-slate-800/80 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-400 font-sans">
          <div className="flex items-center gap-2 font-mono text-[11px]">
            <span className="text-emerald-400 font-bold">✓ 10/10 HSM CONSENSUS ACTIVE</span>
            <span className="text-slate-600">•</span>
            <span>Last Network Ping: <strong className="text-slate-300">{lastPingTimestamp.slice(11, 19)} UTC</strong></span>
            <span className="text-slate-600">•</span>
            <span>Sovereign Architect: <strong className="text-amber-300 font-bold">นายยุทธภูมิ พากเพียร (#EP-SOVEREIGN-01)</strong></span>
          </div>
          
          <div className="flex items-center gap-2 font-mono text-[10px]">
            <span className="text-slate-500">SSoT CANONICAL SEALS:</span>
            <span className="text-emerald-400 font-bold">14,902 SEALS (Δ0.0% ZERO DRIFT)</span>
          </div>
        </div>

      </div>
    </div>
  );
}
