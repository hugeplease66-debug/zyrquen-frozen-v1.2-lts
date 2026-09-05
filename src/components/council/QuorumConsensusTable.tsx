import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Vote,
  ShieldCheck,
  CheckCircle2,
  Lock,
  Copy,
  Check,
  RefreshCw,
  Sparkles,
  ExternalLink,
  Shield,
  Fingerprint,
  FileCheck,
  Sliders,
  Scale,
  Award,
  Radio,
  Clock,
} from 'lucide-react';
import { COUNCIL_MEMBERS, CouncilMember } from '../../data/councilData';
import { playAuditChime, playTone } from '../AudioSynthesizer';
import { copyToClipboard } from '../../utils/clipboard';

export interface QuorumVoteRecord {
  slotId: number;
  councilCode: string;
  passportId: string;
  nameTh: string;
  nameEn: string;
  roleTh: string;
  decision: 'YES' | 'NO' | 'RATIFIED';
  pqcAlgorithm: string;
  hardwareEnclave: string;
  proofVerificationStatus: 'VALID_PQC_SIGNATURE' | 'VERIFIED_HSM_SEAL' | 'RE_VERIFYING';
  proofStandard: string;
  signatureDigest: string;
  verifiedTimestamp: string;
  merkleLeafIndex: number;
  weight: number;
}

const INITIAL_VOTES: QuorumVoteRecord[] = COUNCIL_MEMBERS.map((m, idx) => ({
  slotId: m.slotId,
  councilCode: m.councilCode,
  passportId: m.passportId,
  nameTh: m.nameTh,
  nameEn: m.nameEn,
  roleTh: m.roleTh,
  decision: 'YES',
  pqcAlgorithm: m.pqcAlgorithm,
  hardwareEnclave: m.hardwareEnclave,
  proofVerificationStatus: 'VALID_PQC_SIGNATURE',
  proofStandard: 'NIST FIPS 204 (ML-DSA-87 / Dilithium-5)',
  signatureDigest: `0x${m.keyFingerprint.replace(/[^a-fA-F0-9]/g, '').slice(0, 32)}${idx * 1337}`,
  verifiedTimestamp: `14:2${idx}:0${idx + 2} ICT (27 ส.ค. 2026)`,
  merkleLeafIndex: idx,
  weight: m.quorumWeight,
}));

interface QuorumConsensusTableProps {
  onVoteVerified?: (slotId: number | 'ALL', decision: string) => void;
}

export const QuorumConsensusTable: React.FC<QuorumConsensusTableProps> = ({
  onVoteVerified,
}) => {
  const [votes, setVotes] = useState<QuorumVoteRecord[]>(INITIAL_VOTES);
  const [filterDecision, setFilterDecision] = useState<'ALL' | 'YES' | 'RATIFIED'>('ALL');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [isVerifyingAll, setIsVerifyingAll] = useState(false);
  const [activeInspectedSlot, setActiveInspectedSlot] = useState<number | null>(null);

  const handleCopy = (text: string, id: string) => {
    copyToClipboard(text);
    setCopiedKey(id);
    playAuditChime();
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleVerifySingle = (slotId: number) => {
    playTone(600 + slotId * 25, 0.08, 'sine');
    setVotes((prev) =>
      prev.map((v) =>
        v.slotId === slotId
          ? { ...v, proofVerificationStatus: 'RE_VERIFYING' }
          : v
      )
    );

    setTimeout(() => {
      setVotes((prev) =>
        prev.map((v) =>
          v.slotId === slotId
            ? {
                ...v,
                proofVerificationStatus: 'VERIFIED_HSM_SEAL',
                verifiedTimestamp: new Date().toLocaleTimeString('th-TH', { hour12: false }) + ' ICT',
              }
            : v
        )
      );
      playAuditChime();
      if (onVoteVerified) {
        onVoteVerified(slotId, 'VERIFIED_PQC_SIGNATURE');
      }
    }, 600);
  };

  const handleVerifyAll = () => {
    setIsVerifyingAll(true);
    playAuditChime();

    setVotes((prev) =>
      prev.map((v) => ({ ...v, proofVerificationStatus: 'RE_VERIFYING' }))
    );

    setTimeout(() => {
      const nowStr = new Date().toLocaleTimeString('th-TH', { hour12: false }) + ' ICT';
      setVotes((prev) =>
        prev.map((v) => ({
          ...v,
          decision: 'YES',
          proofVerificationStatus: 'VERIFIED_HSM_SEAL',
          verifiedTimestamp: nowStr,
        }))
      );
      setIsVerifyingAll(false);
      playTone(920, 0.2, 'sine');
      if (onVoteVerified) {
        onVoteVerified('ALL', '10/10_QUORUM_VERIFIED');
      }
    }, 1100);
  };

  const filteredVotes = votes.filter((v) => {
    if (filterDecision === 'ALL') return true;
    if (filterDecision === 'YES') return v.decision === 'YES';
    if (filterDecision === 'RATIFIED') return v.decision === 'RATIFIED' || v.decision === 'YES';
    return true;
  });

  const verifiedCount = votes.filter((v) => v.proofVerificationStatus !== 'RE_VERIFYING').length;
  const yesCount = votes.filter((v) => v.decision === 'YES' || v.decision === 'RATIFIED').length;

  return (
    <div className="rounded-3xl border border-emerald-500/30 bg-gradient-to-b from-zinc-950 via-black to-zinc-950 p-6 md:p-8 backdrop-blur-xl shadow-2xl space-y-6 relative overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none -ml-20 -mb-20" />

      {/* Header & Meta */}
      <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
              <Vote className="w-3.5 h-3.5 text-emerald-400" />
              10/10 QUORUM CONSENSUS TABLE
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-mono bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
              <ShieldCheck className="w-3 h-3 text-cyan-400" />
              PQC DILITHIUM-5 SIGNATURE ATTESTATION
            </span>
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-white flex items-center gap-3">
            <span>ตารางผลการลงคะแนนและการรับรองหลักฐานฉันทามติ (Quorum Consensus)</span>
          </h2>
          <p className="text-xs sm:text-sm text-zinc-300 max-w-3xl leading-relaxed">
            แสดงประวัติการลงมติล่าสุดของโหนด HSM ทั้ง 10 โหนด พร้อมรหัสยืนยันการรับรองเชิงรหัสลับ (Cryptographic Proof Verification Status), มาตรฐานความปลอดภัย NIST Level 5 และตราประทับเวลา
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="flex items-center gap-2 text-xs font-mono p-2 rounded-2xl bg-black/60 border border-white/10">
            <div className="px-3 py-1 text-center space-y-0.5">
              <span className="text-zinc-500 block text-[10px]">มติเห็นชอบ</span>
              <span className="text-emerald-400 font-bold text-sm">{yesCount} / 10 โหนด</span>
            </div>
            <div className="h-6 w-px bg-white/10" />
            <div className="px-3 py-1 text-center space-y-0.5">
              <span className="text-zinc-500 block text-[10px]">สถานะหลักฐาน</span>
              <span className="text-cyan-400 font-bold text-sm">100% Valid</span>
            </div>
          </div>

          <button
            onClick={handleVerifyAll}
            disabled={isVerifyingAll}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 text-white font-semibold text-xs shadow-lg shadow-emerald-500/20 transition-all active:scale-95 border border-emerald-400/40"
            title="ตรวจสอบและรับรองความถูกต้องของลายเซ็น PQC ทั้ง 10 โหนดพร้อมกัน"
          >
            <Sparkles className={`w-3.5 h-3.5 text-emerald-200 ${isVerifyingAll ? 'animate-spin' : ''}`} />
            <span>{isVerifyingAll ? 'กำลังตรวจสอบ 10/10...' : 'ตรวจสอบหลักฐาน 10/10 โหนด'}</span>
          </button>
        </div>
      </div>

      {/* Table Container */}
      <div className="rounded-2xl border border-white/10 bg-black/80 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-white/10 bg-zinc-950 text-zinc-400 uppercase tracking-wider text-[11px]">
                <th className="py-3.5 px-4 font-bold">โหนด (Node ID)</th>
                <th className="py-3.5 px-4 font-bold">ผู้พิทักษ์ & ตำแหน่ง</th>
                <th className="py-3.5 px-4 font-bold text-center">มติ (Decision)</th>
                <th className="py-3.5 px-4 font-bold">สถานะหลักฐานรหัสลับ (Cryptographic Proof Status)</th>
                <th className="py-3.5 px-4 font-bold">ลายเซ็น PQC Digest</th>
                <th className="py-3.5 px-4 font-bold">เวลาที่ยืนยัน</th>
                <th className="py-3.5 px-4 font-bold text-right">การตรวจสอบ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredVotes.map((row) => {
                const isReverifying = row.proofVerificationStatus === 'RE_VERIFYING';
                const isVerified = row.proofVerificationStatus === 'VALID_PQC_SIGNATURE' || row.proofVerificationStatus === 'VERIFIED_HSM_SEAL';

                return (
                  <tr
                    key={row.slotId}
                    className="hover:bg-white/5 transition-colors group"
                  >
                    {/* Node ID */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2">
                        <span className="w-7 h-7 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 font-bold text-xs flex items-center justify-center">
                          #{row.slotId}
                        </span>
                        <div>
                          <span className="font-bold text-amber-400 block">{row.councilCode}</span>
                          <span className="text-[10px] text-zinc-500">#{row.passportId}</span>
                        </div>
                      </div>
                    </td>

                    {/* Member Name & Role */}
                    <td className="py-3.5 px-4 max-w-[200px]">
                      <div className="font-bold text-white group-hover:text-amber-300 transition-colors">
                        {row.nameTh}
                      </div>
                      <div className="text-[11px] text-zinc-400 truncate">{row.roleTh}</div>
                    </td>

                    {/* Decision */}
                    <td className="py-3.5 px-4 text-center">
                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        {row.decision} (+{row.weight})
                      </span>
                    </td>

                    {/* Proof Verification Status */}
                    <td className="py-3.5 px-4">
                      {isReverifying ? (
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-[11px] font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 animate-pulse">
                          <RefreshCw className="w-3 h-3 animate-spin" />
                          <span>Verifying Lattice...</span>
                        </div>
                      ) : (
                        <div className="space-y-0.5">
                          <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg text-[11px] font-bold bg-emerald-500/10 text-emerald-300 border border-emerald-500/30">
                            <ShieldCheck className="w-3 h-3 text-emerald-400" />
                            <span>VALID_PQC_SIGNATURE</span>
                          </div>
                          <span className="text-[10px] text-zinc-500 block">
                            {row.proofStandard}
                          </span>
                        </div>
                      )}
                    </td>

                    {/* PQC Digest */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-1.5">
                        <span className="text-cyan-300 font-mono text-[11px] bg-black/60 px-2 py-1 rounded-lg border border-white/5">
                          {row.signatureDigest.slice(0, 14)}...
                        </span>
                        <button
                          onClick={() => handleCopy(row.signatureDigest, `proof-${row.slotId}`)}
                          className="p-1 rounded text-zinc-400 hover:text-white hover:bg-white/10 transition-colors"
                          title="คัดลอก Signature Proof Digest"
                        >
                          {copiedKey === `proof-${row.slotId}` ? (
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>
                    </td>

                    {/* Timestamp */}
                    <td className="py-3.5 px-4 text-[11px] text-zinc-400">
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-zinc-500" />
                        <span>{row.verifiedTimestamp}</span>
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => handleVerifySingle(row.slotId)}
                        disabled={isReverifying}
                        className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-zinc-300 hover:text-white border border-white/10 text-[11px] font-semibold transition-all inline-flex items-center gap-1"
                        title="สั่งตรวจสอบความถูกต้องของลายเซ็นโหนดนี้ซ้ำ"
                      >
                        <FileCheck className="w-3 h-3 text-emerald-400" />
                        <span>ตรวจสอบ</span>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
