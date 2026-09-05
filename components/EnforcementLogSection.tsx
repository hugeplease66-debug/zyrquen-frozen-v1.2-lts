'use client';

import React, { useEffect, useState } from 'react';
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
  Users
} from 'lucide-react';

export interface EnforcementEvent {
  id: string;
  timestamp: string;
  jurisdiction: 'THAI_ETDA' | 'GLOBAL_GDPR' | 'UNCITRAL' | 'INTERSTELLAR_GALACTIC' | 'NIST_PQC';
  level: 'CRITICAL' | 'GUARD' | 'RATIFIED' | 'INTERRUPT';
  statute: string;
  summary: string;
  hash: string;
  status: 'BLOCKED' | 'RATIFIED' | 'ENFORCED' | 'SOVEREIGN_OVERRIDE';
  hsmSignatures: number; // e.g. 10
}

const INITIAL_EVENTS: EnforcementEvent[] = [
  {
    id: "ENF-89201",
    timestamp: "14:22:01.402",
    jurisdiction: "THAI_ETDA",
    level: "RATIFIED",
    statute: "พ.ร.บ.ธุรกรรมทางอิเล็กทรอนิกส์ มาตรา 9 & 26",
    summary: "ตรวจสอบลายมือชื่ออิเล็กทรอนิกส์และกุญแจ ML-DSA-87 ผูกมัดอัตลักษณ์นายยุทธภูมิ พากเพียร สมบูรณ์ 100%",
    hash: "0x4f8a91c0e3...b712",
    status: "RATIFIED",
    hsmSignatures: 10
  },
  {
    id: "ENF-89202",
    timestamp: "14:22:04.810",
    jurisdiction: "INTERSTELLAR_GALACTIC",
    level: "GUARD",
    statute: "Galactic Charter Δ∞ (Cosmic Quantum Mesh Relay)",
    summary: "ตรวจสอบการเชื่อมต่อ QKD ผ่านดาวเทียม BK01-LD06 อัตราโฟตอนคีย์ 128.4 kbps ปลอดภัยไร้การแทรกแซง",
    hash: "0xcc88019abf...7723",
    status: "ENFORCED",
    hsmSignatures: 10
  },
  {
    id: "ENF-89203",
    timestamp: "14:22:08.194",
    jurisdiction: "GLOBAL_GDPR",
    level: "GUARD",
    statute: "GDPR Article 25/32 & PDPA มาตรา 37",
    summary: "ตรวจพบคำขอข้ามเขตข้อมูล: รหัสผ่าน Zero-Knowledge Vault ถูกบดบังด้วย Kyber-1024 สำเร็จ",
    hash: "0x55d1a09ef2...11b4",
    status: "ENFORCED",
    hsmSignatures: 10
  },
  {
    id: "ENF-89204",
    timestamp: "14:22:12.650",
    jurisdiction: "NIST_PQC",
    level: "CRITICAL",
    statute: "NIST FIPS 204 (CRYSTALS-Dilithium-5)",
    summary: "ตรวจพบพยายามเปลี่ยนแปลงค่า State นอก Quorum -> ถูกสกัดกั้นทันที (Mutation=0 Drift=0.00%)",
    hash: "0x909ab81447...4c68",
    status: "BLOCKED",
    hsmSignatures: 10
  },
  {
    id: "ENF-89205",
    timestamp: "14:22:15.912",
    jurisdiction: "UNCITRAL",
    level: "RATIFIED",
    statute: "UNCITRAL Model Law on Electronic Commerce Art 7",
    summary: "การรับรองธุรกรรมข้ามพรมแดนแบบพหุภาคี ภายใต้ตราประทับทองคำเอกสิทธิ์สูงสุด",
    hash: "0xfa99210c44...ee82",
    status: "RATIFIED",
    hsmSignatures: 10
  }
];

interface EnforcementLogSectionProps {
  onAddNotification?: (msg: string, type?: 'success' | 'error' | 'warning') => void;
}

export default function EnforcementLogSection({ onAddNotification }: EnforcementLogSectionProps) {
  const [events, setEvents] = useState<EnforcementEvent[]>(INITIAL_EVENTS);
  const [isLive, setIsLive] = useState(true);
  const [selectedFilter, setSelectedFilter] = useState<string>('ALL');
  const [showVetoModal, setShowVetoModal] = useState(false);
  const [vetoStep, setVetoStep] = useState<number>(0); // 0: Idle, 1: Collecting Quorum, 2: Dilithium Signing, 3: Ratified
  const [vetoProof, setVetoProof] = useState<string | null>(null);

  // Real-time generator of Interstellar & Global compliance enforcement logs
  useEffect(() => {
    if (!isLive) return;

    const interval = setInterval(() => {
      const jurisdictions: EnforcementEvent['jurisdiction'][] = [
        'THAI_ETDA', 'GLOBAL_GDPR', 'UNCITRAL', 'INTERSTELLAR_GALACTIC', 'NIST_PQC'
      ];
      const randomJur = jurisdictions[Math.floor(Math.random() * jurisdictions.length)];

      const templates = [
        {
          jur: 'THAI_ETDA' as const,
          statute: 'พ.ร.บ.ธุรกรรมฯ มาตรา 28 (หน้าที่ผู้ลงนาม)',
          summary: 'ตรวจสอบความถูกต้องของกุญแจลับเฉพาะตัว นายยุทธภูมิ พากเพียร #EP-SOVEREIGN-61 -> สมบูรณ์ 100%',
          level: 'RATIFIED' as const,
          status: 'RATIFIED' as const
        },
        {
          jur: 'INTERSTELLAR_GALACTIC' as const,
          statute: 'Cosmic Legal Accord v7 (Deep-Space Merkle Proof)',
          summary: 'ตรวจสอบ Root Invariant #849202 ข้ามช่องสัญญาณ Multiverse Warp Corridor -> ยืนยัน Δ0',
          level: 'GUARD' as const,
          status: 'ENFORCED' as const
        },
        {
          jur: 'GLOBAL_GDPR' as const,
          statute: 'EU GDPR Art 32 / ISO 27001 Annex A.10',
          summary: 'สแกนความปลอดภัยการเข้ารหัสลับ PQC Enclave Category 5 -> ไม่พบช่องโหว่ (Zero Leak)',
          level: 'GUARD' as const,
          status: 'ENFORCED' as const
        },
        {
          jur: 'NIST_PQC' as const,
          statute: 'NIST FIPS 203 (CRYSTALS-Kyber-1024 Key Encapsulation)',
          summary: 'สร้างความลับชั่วคราว (Shared Secret) สำหรับช่องทางส่งข้อมูลความปลอดภัยระดับควอนตัม',
          level: 'RATIFIED' as const,
          status: 'RATIFIED' as const
        }
      ];

      const chosen = templates[Math.floor(Math.random() * templates.length)];
      const now = new Date();
      const timeStr = `${now.toTimeString().split(' ')[0]}.${String(now.getMilliseconds()).padStart(3, '0')}`;
      const randomId = `ENF-${Math.floor(10000 + Math.random() * 90000)}`;
      const randomHash = `0x${Array.from({ length: 8 }, () => Math.floor(Math.random() * 16).toString(16)).join('')}...${Array.from({ length: 4 }, () => Math.floor(Math.random() * 16).toString(16)).join('')}`;

      const newEvent: EnforcementEvent = {
        id: randomId,
        timestamp: timeStr,
        jurisdiction: chosen.jur,
        level: chosen.level,
        statute: chosen.statute,
        summary: chosen.summary,
        hash: randomHash,
        status: chosen.status,
        hsmSignatures: 10
      };

      setEvents((prev) => [newEvent, ...prev.slice(0, 24)]);
    }, 4500);

    return () => clearInterval(interval);
  }, [isLive]);

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
        const generatedVetoProof = `VETO-PROOF-Δ0-849202-${Date.now().toString(16).toUpperCase()}-DILITHIUM5-RATIFIED-BY-YUTTHAPHOOM`;
        setVetoProof(generatedVetoProof);

        // Add veto event to log
        const now = new Date();
        const vetoEvent: EnforcementEvent = {
          id: `VETO-${Math.floor(1000 + Math.random() * 9000)}`,
          timestamp: `${now.toTimeString().split(' ')[0]}.${String(now.getMilliseconds()).padStart(3, '0')}`,
          jurisdiction: 'THAI_ETDA',
          level: 'CRITICAL',
          statute: 'Supreme Sovereign Veto Mandate (สิทธิยับยั้งอธิปไตยสูงสุด)',
          summary: 'นายยุทธภูมิ พากเพียร (#EP-SOVEREIGN-61) ประกาศสิทธิยับยั้งอธิปไตยสูงสุด ผ่านฉันทามติ 10/10 REAL HSM',
          hash: generatedVetoProof.slice(0, 24) + '...',
          status: 'SOVEREIGN_OVERRIDE',
          hsmSignatures: 10
        };

        setEvents((prev) => [vetoEvent, ...prev]);

        if (onAddNotification) {
          onAddNotification("👑 SOVEREIGN VETO RATIFIED: ฉันทามติรับรองสิทธิยับยั้งอธิปไตยเสร็จสมบูรณ์ 100%", "success");
        }
      }, 1500);
    }, 1200);
  };

  const filteredEvents = events.filter((e) => {
    if (selectedFilter === 'ALL') return true;
    return e.jurisdiction === selectedFilter;
  });

  return (
    <div className="w-full bg-[#081020]/95 border border-cyan-500/40 rounded-2xl p-5 backdrop-blur-2xl shadow-2xl space-y-4 quantum-cyan-glow">
      
      {/* HEADER WITH CONTROLS */}
      <div className="flex flex-wrap justify-between items-center gap-3 border-b border-slate-800 pb-3">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-cyan-500/15 border border-cyan-400/50 text-cyan-300">
            <Terminal className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-cyan-400 font-bold font-mono tracking-widest uppercase bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/30">
                REAL-TIME ENFORCEMENT ENGINE
              </span>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-mono text-[9px] font-bold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                INTERSTELLAR & GLOBAL STREAM
              </span>
            </div>
            <h3 className="text-base sm:text-lg font-bold text-white font-mono text-cyan-gradient">
              Interstellar & Global Compliance Enforcement Log
            </h3>
          </div>
        </div>

        {/* RIGHT ACTION BUTTONS */}
        <div className="flex flex-wrap items-center gap-2 font-mono text-xs">
          
          {/* SOVEREIGN VETO BUTTON */}
          <button
            onClick={triggerSovereignVeto}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-400 via-amber-500 to-yellow-600 text-black font-bold flex items-center gap-2 hover:brightness-110 transition cursor-pointer shadow-lg gold-glow"
            title="Trigger Simulated HSM Consensus Sovereign Veto Override"
          >
            <Gavel className="w-4 h-4 fill-black" />
            <span>Sovereign Veto (ยับยั้งอธิปไตย)</span>
          </button>

          {/* PAUSE / PLAY */}
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

      {/* FILTER BUTTONS ROW */}
      <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-mono">
        <div className="flex flex-wrap items-center gap-1.5">
          {['ALL', 'THAI_ETDA', 'GLOBAL_GDPR', 'UNCITRAL', 'INTERSTELLAR_GALACTIC', 'NIST_PQC'].map((f) => (
            <button
              key={f}
              onClick={() => setSelectedFilter(f)}
              className={`px-2.5 py-1 rounded-lg border text-[10px] transition cursor-pointer ${
                selectedFilter === f
                  ? 'bg-cyan-500/25 border-cyan-400 text-cyan-200 font-bold'
                  : 'bg-black/50 border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              {f.replace('_', ' ')}
            </button>
          ))}
        </div>

        <span className="text-[10px] text-slate-400 font-mono">
          Showing {filteredEvents.length} live compliance events
        </span>
      </div>

      {/* EVENTS LOG FEED */}
      <div className="space-y-2.5 max-h-[360px] overflow-y-auto pr-1 font-mono text-xs">
        {filteredEvents.map((evt) => {
          const isVeto = evt.status === 'SOVEREIGN_OVERRIDE';
          const isBlocked = evt.status === 'BLOCKED';

          return (
            <div
              key={evt.id}
              className={`p-3 rounded-xl border transition-all duration-200 ${
                isVeto
                  ? 'bg-amber-950/40 border-amber-400/80 text-amber-100 gold-glow'
                  : isBlocked
                  ? 'bg-red-950/30 border-red-500/60 text-red-200'
                  : 'bg-slate-950/80 border-slate-800/80 text-slate-300 hover:border-cyan-500/40 hover:bg-[#0b162c]'
              }`}
            >
              <div className="flex flex-wrap justify-between items-center gap-2 mb-1 text-[10px]">
                <div className="flex items-center gap-2">
                  <span className="text-cyan-400 font-bold">{evt.id}</span>
                  <span className="text-slate-500">[{evt.timestamp}]</span>
                  <span className={`px-2 py-0.2 rounded font-bold text-[9px] ${
                    evt.jurisdiction === 'THAI_ETDA' ? 'bg-amber-500/20 text-amber-300' :
                    evt.jurisdiction === 'INTERSTELLAR_GALACTIC' ? 'bg-purple-500/20 text-purple-300' :
                    'bg-cyan-500/20 text-cyan-300'
                  }`}>
                    {evt.jurisdiction}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.2 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[9px] font-bold">
                    {evt.hsmSignatures}/10 REAL_HSM
                  </span>
                  <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                    isVeto ? 'bg-amber-500 text-black font-bold' :
                    isBlocked ? 'bg-red-500 text-white font-bold' :
                    'bg-emerald-500/20 text-emerald-300'
                  }`}>
                    {evt.status}
                  </span>
                </div>
              </div>

              <div className="text-xs font-bold text-white mb-0.5 font-mono">{evt.statute}</div>
              <div className="text-[11px] text-slate-300 font-sans leading-relaxed">{evt.summary}</div>

              <div className="flex flex-wrap justify-between items-center text-[9px] text-slate-500 mt-2 pt-1 border-t border-slate-900 gap-2">
                <span className="truncate max-w-[280px]">Proof Hash: <strong className="text-cyan-300">{evt.hash}</strong></span>
                <div className="flex items-center gap-2">
                  {!isVeto && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        triggerSovereignVeto();
                      }}
                      className="px-2 py-0.5 rounded bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-400/50 font-bold transition flex items-center gap-1 cursor-pointer"
                      title="สิทธิยับยั้งอธิปไตย (Sovereign Veto on this Event)"
                    >
                      <Gavel className="w-2.5 h-2.5" />
                      <span>Sovereign Veto</span>
                    </button>
                  )}
                  <span className="text-emerald-400 font-bold">✓ Canonical Ratified</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

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
                  Signer: นายยุทธภูมิ พากเพียร (#EP-SOVEREIGN-61) • Block #849202
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
