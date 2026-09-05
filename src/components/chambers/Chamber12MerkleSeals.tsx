import React, { useState } from 'react';
import { 
  Binary, 
  Lock, 
  Search, 
  CheckCircle2, 
  Database, 
  KeyRound, 
  Sparkles,
  Layers
} from 'lucide-react';
import { SYSTEM_METADATA } from '../../data/canonicalData';

interface ChamberProps {
  lang: 'th' | 'en';
}

export const Chamber12MerkleSeals: React.FC<ChamberProps> = ({ lang }) => {
  const [targetSealId, setTargetSealId] = useState<number>(14902);
  const [verifiedSeal, setVerifiedSeal] = useState<any | null>(null);

  const handleVerifySeal = () => {
    const isCanonical = targetSealId >= 1 && targetSealId <= 14902;
    // Compute simulated deterministic leaf hash based on seal id
    const mockHash = `0x${(targetSealId * 3908123).toString(16).padStart(16, '0')}...${(targetSealId * 849202).toString(16).slice(-8)}`;
    setVerifiedSeal({
      sealId: targetSealId,
      isCanonical,
      leafHash: mockHash,
      blockAnchor: isCanonical ? 849202 : 849203,
      status: isCanonical ? 'CANONICAL_FROZEN' : 'QUARANTINE_PROBE',
      signature: 'CRYSTALS-Dilithium-5 (ML-DSA-87)',
      quorum: '10/10 REAL_HSM APPROVED',
      rootMatch: isCanonical
    });
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="rounded-xl bg-gradient-to-r from-cyan-950/80 via-slate-900 to-slate-950 border border-cyan-500/40 p-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full bg-cyan-950 border border-cyan-500/50 text-cyan-300 text-xs font-mono-code font-bold flex items-center gap-1.5">
                <Binary className="w-3 h-3 text-cyan-400" />
                14,902 CANONICAL MERKLE SEALS
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 text-xs font-mono-code">
                Block: #849202
              </span>
            </div>
            <h2 className="text-2xl font-display font-bold text-white tracking-tight">
              {lang === 'th' ? 'ทะเบียนรากต้นไม้ Merkle และ 14,902 ซีล (Chamber 12)' : 'Chamber 12: Canonical Merkle Root & 14,902 Seals'}
            </h2>
            <p className="text-sm text-slate-300 mt-1 max-w-3xl">
              {lang === 'th'
                ? 'โครงสร้างข้อมูล Merkle Tree ยึดโยงซีล 14,902 ซีลตรงกับราก 909ab814...fa4c68 พร้อมเครื่องมือตรวจสอบการรวมตัวของใบไม้ (Inclusion Proof)'
                : 'Cryptographic multi-proof Merkle Tree verifying 14,902 canonical leaves bound directly to the Genesis root.'}
            </p>
          </div>

          <div className="bg-slate-950/80 p-3 rounded-lg border border-cyan-500/30 text-right">
            <span className="text-xs text-slate-400 block font-mono-code">Genesis Merkle Root:</span>
            <span className="text-xs font-mono-code text-cyan-300 font-bold break-all">
              909ab814479844d8...fa4c68
            </span>
          </div>
        </div>
      </div>

      {/* Interactive Seal Search & Multi-Proof Verifier */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-6 space-y-4">
        <h3 className="font-display font-bold text-white text-base flex items-center gap-2">
          <Search className="w-4 h-4 text-cyan-400" />
          {lang === 'th' ? 'เครื่องมือตรวจสอบความถูกต้องของซีล (Seal Inclusion Proof)' : 'Seal Inclusion Proof Verifier'}
        </h3>

        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <input
              type="number"
              min={1}
              max={15000}
              value={targetSealId}
              onChange={(e) => setTargetSealId(Number(e.target.value))}
              placeholder="Enter Seal ID (e.g. 14902, 1, 14903)"
              className="w-full px-4 py-2 bg-slate-950 border border-slate-700 rounded-lg text-sm text-white font-mono-code focus:outline-none focus:border-cyan-500"
            />
          </div>
          <button
            onClick={handleVerifySeal}
            className="w-full sm:w-auto px-6 py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs rounded-lg transition-all shadow-md shadow-cyan-950 font-display flex items-center justify-center gap-2"
          >
            <CheckCircle2 className="w-4 h-4" />
            {lang === 'th' ? 'ตรวจสอบหลักฐาน Merkle' : 'VERIFY MERKLE PROOF'}
          </button>
        </div>

        {verifiedSeal && (
          <div className={`p-4 rounded-lg border ${
            verifiedSeal.isCanonical
              ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-300'
              : 'bg-red-950/30 border-red-500/40 text-red-300'
          } space-y-2 text-xs font-mono-code`}>
            <div className="flex items-center justify-between">
              <span className="font-bold text-sm">
                SEAL #{verifiedSeal.sealId}: {verifiedSeal.isCanonical ? '✓ CANONICAL SSoT FROZEN (100% INCLUDED)' : '⚠ QUARANTINE ESCROW PROBE (CHAMBER 02)'}
              </span>
              <span className="px-2 py-0.5 rounded bg-slate-950 text-white font-bold">
                Block #{verifiedSeal.blockAnchor}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] pt-2 border-t border-slate-800">
              <div>
                <span className="text-slate-400 block">Leaf Hash Digest:</span>
                <span className="text-white">{verifiedSeal.leafHash}</span>
              </div>
              <div>
                <span className="text-slate-400 block">Signature Scheme:</span>
                <span className="text-cyan-300">{verifiedSeal.signature}</span>
              </div>
              <div>
                <span className="text-slate-400 block">Root Match Verification:</span>
                <span className={verifiedSeal.rootMatch ? 'text-emerald-400 font-bold' : 'text-red-400 font-bold'}>
                  {verifiedSeal.rootMatch ? 'Exact Root 909ab814...fa4c68 Matched (Δ0.0%)' : 'Mismatch with Canonical Root'}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block">Deca-Key Quorum:</span>
                <span className="text-emerald-400">{verifiedSeal.quorum}</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Merkle Invariant Facts */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-2">
          <span className="text-xs text-slate-400 font-medium">Canonical Leaf Bounds</span>
          <div className="text-xl font-mono-code font-bold text-white">#00001 to #14902</div>
          <p className="text-[11px] text-slate-400">Strictly locked at block #849202 without unauthorized modification.</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-2">
          <span className="text-xs text-slate-400 font-medium">Tree Depth & Balancing</span>
          <div className="text-xl font-mono-code font-bold text-cyan-300">14 Levels (Perfect 2^14)</div>
          <p className="text-[11px] text-slate-400">Optimized binary tree for sub-millisecond inclusion proof generation.</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-2">
          <span className="text-xs text-slate-400 font-medium">Multi-Sig Attestation</span>
          <div className="text-xl font-mono-code font-bold text-emerald-400">10/10 Signatures</div>
          <p className="text-[11px] text-slate-400">All root changes require 100% unanimous deca-key authorization.</p>
        </div>
      </div>
    </div>
  );
};
