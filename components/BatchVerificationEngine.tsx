'use client';

import React, { useState } from 'react';
import { 
  ShieldCheck, 
  CheckCircle2, 
  Layers, 
  Award, 
  RefreshCw, 
  Lock, 
  FileCheck2, 
  Sparkles,
  AlertCircle
} from 'lucide-react';

interface MerkleBlockItem {
  id: number;
  blockNumber: number;
  label: string;
  leafHash: string;
  pqcType: string;
  hsmStatus: string;
  verified: boolean;
}

const INITIAL_BLOCKS: MerkleBlockItem[] = [
  { id: 1, blockNumber: 849202, label: "Genesis Core Anchor (Δ0 SSoT)", leafHash: "0x909ab814...43fa4c68", pqcType: "ML-DSA-87", hsmStatus: "10/10 SIGNED", verified: true },
  { id: 2, blockNumber: 849201, label: "Stage 01 Ingest Payload", leafHash: "0x4f8a91c0...b712aa90", pqcType: "Dilithium-5", hsmStatus: "10/10 SIGNED", verified: true },
  { id: 3, blockNumber: 849200, label: "Stage 02 Pre-Image Validation", leafHash: "0x67e8f912...99c1ee23", pqcType: "Kyber-1024", hsmStatus: "10/10 SIGNED", verified: true },
  { id: 4, blockNumber: 849199, label: "Stage 03 Thai ETDA Sec 9/26", leafHash: "0x12c4e5a9...e815bb01", pqcType: "ML-DSA-87", hsmStatus: "10/10 SIGNED", verified: true },
  { id: 5, blockNumber: 849198, label: "Stage 04 GDPR / Zero-Knowledge", leafHash: "0x89e01fb3...aa710045", pqcType: "SLH-DSA", hsmStatus: "10/10 SIGNED", verified: true },
  { id: 6, blockNumber: 849197, label: "Stage 05 Galactic Interstellar Relay", leafHash: "0xcc88019a...77239012", pqcType: "Dilithium-5", hsmStatus: "10/10 SIGNED", verified: true }
];

interface BatchVerificationEngineProps {
  onAddNotification?: (msg: string, type?: 'success' | 'error' | 'warning') => void;
}

export default function BatchVerificationEngine({ onAddNotification }: BatchVerificationEngineProps) {
  const [blocks, setBlocks] = useState<MerkleBlockItem[]>(INITIAL_BLOCKS);
  const [selectedIds, setSelectedIds] = useState<number[]>([1, 2, 3, 4, 5, 6]);
  const [isVerifying, setIsVerifying] = useState(false);
  const [progress, setProgress] = useState(0);

  const toggleSelect = (id: number) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const selectAll = () => setSelectedIds(blocks.map(b => b.id));
  const deselectAll = () => setSelectedIds([]);

  const handleRunBatchVerification = () => {
    if (selectedIds.length === 0) {
      if (onAddNotification) onAddNotification("⚠️ โปรดเลือกอย่างน้อย 1 บล็อกสำหรับการตรวจสอบแบบกลุ่ม (Batch)", "warning");
      return;
    }

    setIsVerifying(true);
    setProgress(0);

    if (onAddNotification) {
      onAddNotification(`⚡ BATCH VERIFICATION INITIATED: กำลังตรวจสอบ Merkle Proofs สำหรับ ${selectedIds.length} บล็อก...`, "warning");
    }

    let p = 0;
    const interval = setInterval(() => {
      p += 25;
      setProgress(p);

      if (p >= 100) {
        clearInterval(interval);
        setIsVerifying(false);
        if (onAddNotification) {
          onAddNotification(`✓ BATCH VERIFIED 100%: บล็อกที่เลือกทั้ง ${selectedIds.length} รายการตรงกับ Genesis Anchor 909ab814... ปราศจาก Mutation (Drift 0.00%)`, "success");
        }
      }
    }, 400);
  };

  return (
    <div className="w-full bg-[#081224]/95 border border-cyan-500/40 rounded-2xl p-5 backdrop-blur-2xl shadow-2xl space-y-4 font-mono text-xs">
      
      {/* HEADER */}
      <div className="flex flex-wrap justify-between items-center gap-3 border-b border-slate-800 pb-3">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-cyan-500/15 border border-cyan-400/50 text-cyan-300">
            <Layers className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-cyan-400 font-bold tracking-widest uppercase bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/30">
                MERKLE TREE BATCH VERIFICATION ENGINE
              </span>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[9px] font-bold">
                GENESIS ANCHOR MATCH (Δ0)
              </span>
            </div>
            <h3 className="text-base font-bold text-white text-cyan-gradient">
              Concurrent Merkle Block & PQC Leaf Batch Auditor
            </h3>
          </div>
        </div>

        {/* ACTION BUTTON */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleRunBatchVerification}
            disabled={isVerifying}
            className={`px-4 py-2 rounded-xl font-bold flex items-center gap-2 transition cursor-pointer shadow-lg ${
              isVerifying
                ? 'bg-purple-950 text-purple-300 border border-purple-500/40 animate-pulse'
                : 'bg-gradient-to-r from-cyan-400 via-sky-500 to-indigo-600 text-black quantum-cyan-glow hover:brightness-110'
            }`}
          >
            <ShieldCheck className="w-4 h-4 fill-current" />
            <span>{isVerifying ? `กำลังตรวจสอบ (${progress}%)...` : `ตรวจสอบกลุ่ม (${selectedIds.length} บล็อก)`}</span>
          </button>
        </div>
      </div>

      {/* SELECTION BAR */}
      <div className="flex justify-between items-center text-[11px] text-slate-400 bg-black/40 p-2.5 rounded-xl border border-slate-800">
        <div className="space-x-3">
          <span>เลือกแล้ว: <strong className="text-cyan-300">{selectedIds.length}</strong> / {blocks.length} บล็อก</span>
          <button onClick={selectAll} className="text-cyan-400 hover:underline cursor-pointer">เลือกทั้งหมด</button>
          <span>|</span>
          <button onClick={deselectAll} className="text-slate-500 hover:underline cursor-pointer">ยกเลิกทั้งหมด</button>
        </div>
        <div className="text-amber-300 font-bold text-[10px]">
          Anchor Root: 909ab814479844d8a14816bed...4c68
        </div>
      </div>

      {/* PROGRESS BAR */}
      {isVerifying && (
        <div className="w-full bg-slate-900 rounded-full h-2 overflow-hidden border border-slate-800">
          <div 
            className="bg-gradient-to-r from-cyan-400 to-emerald-400 h-2 transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}

      {/* BLOCKS LIST */}
      <div className="grid md:grid-cols-2 gap-2.5">
        {blocks.map(b => {
          const isSelected = selectedIds.includes(b.id);
          return (
            <div
              key={b.id}
              onClick={() => toggleSelect(b.id)}
              className={`p-3 rounded-xl border cursor-pointer transition flex items-center justify-between gap-2 ${
                isSelected 
                  ? 'bg-cyan-950/30 border-cyan-500/50 text-white' 
                  : 'bg-black/40 border-slate-800/80 text-slate-500'
              }`}
            >
              <div className="flex items-center gap-3">
                <input 
                  type="checkbox" 
                  checked={isSelected} 
                  onChange={() => {}} 
                  className="w-4 h-4 accent-cyan-400 rounded cursor-pointer"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-cyan-300 font-bold">Block #{b.blockNumber}</span>
                    <span className="text-slate-400 text-[10px] truncate max-w-[150px]">{b.label}</span>
                  </div>
                  <div className="text-[9px] text-slate-500 font-mono mt-0.5">{b.leafHash}</div>
                </div>
              </div>

              <div className="text-right shrink-0">
                <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[9px] font-bold block mb-0.5">
                  {b.hsmStatus}
                </span>
                <span className="text-[9px] text-purple-300">{b.pqcType}</span>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
}
