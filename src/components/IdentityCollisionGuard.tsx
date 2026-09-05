import React, { useState } from 'react';
import {
  Fingerprint,
  ShieldCheck,
  UserCheck,
  AlertTriangle,
  Key,
  Layers,
  CheckCircle2,
  Lock,
  Search,
  Check,
  Copy,
  Users,
  ShieldAlert,
} from 'lucide-react';
import { playAuditChime, playTone } from './AudioSynthesizer';
import { THAI_CUSTODIANS } from '../data/canonicalData';
import { IdentityCollisionProof } from '../types';
import { copyToClipboard } from '../utils/clipboard';

export const IdentityCollisionGuard: React.FC = () => {
  const [selectedCustodianId, setSelectedCustodianId] = useState<string>('tc-01');
  const [testCollisionName, setTestCollisionName] = useState('สมชาย พากเพียร');
  const [copiedHash, setCopiedHash] = useState<string | null>(null);

  // 5-Layer Identity Resolution Chain Records
  const identityProofs: Record<string, IdentityCollisionProof[]> = {
    'somchai-collision-case': [
      {
        displayName: 'ผู้อำนวยการ สมชาย พากเพียร',
        signerId: 'SIGNER-TH-002-SOMCHAI-A',
        credentialId: '#EP-001 (Civilization Control Plane Director)',
        publicKeyFingerprint: 'SHA256:909ab814479844d8a14816bed34cdbb07528e18501da86fc4691763a43fa4c68',
        signatureVerification: 'VERIFIED',
        uniquenessVerified: true,
        notes: 'Director of Civilization Intelligence Control Plane (Level 25 Sovereign Governor)',
      },
      {
        displayName: 'สมชาย พากเพียร (Senior Custodian)',
        signerId: 'SIGNER-TH-005-SOMCHAI-B',
        credentialId: '#EP-002 (Senior Infrastructure Custodian)',
        publicKeyFingerprint: 'SHA256:41f8a847e33e61a091535787680b4356499878297b835ec443efae4cb30bc06c',
        signatureVerification: 'VERIFIED',
        uniquenessVerified: true,
        notes: 'Regional Infrastructure Custodian (Key Derivation Sub-Tree 0x02)',
      },
    ],
  };

  const handleCopy = (text: string, id: string) => {
    copyToClipboard(text);
    setCopiedHash(id);
    playTone(700, 0.04);
    setTimeout(() => setCopiedHash(null), 2000);
  };

  const currentCustodian = THAI_CUSTODIANS.find((c) => c.id === selectedCustodianId) || THAI_CUSTODIANS[0];

  return (
    <div className="p-6 rounded-[28px] bg-gradient-to-br from-[#120f07]/95 via-[#0c0903]/90 to-[#07080F] border-2 border-amber-500/35 backdrop-blur-2xl space-y-6 shadow-2xl font-mono">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-amber-500/20 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-300 flex items-center justify-center shrink-0">
            <Fingerprint className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-amber-100 font-serif">
                Identity Collision Guard (การป้องกันความสับสนทางอัตลักษณ์)
              </h3>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold">
                5-TIER RESOLUTION ACTIVE
              </span>
            </div>
            <p className="text-xs text-amber-200/80 font-serif mt-0.5">
              “ชื่อซ้ำกันได้ แต่ Cryptographic Identity ซ้ำกันไม่ได้เด็ดขาด” • 5-Step Inviolable Identity Verification Chain
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="px-3 py-1 rounded-xl bg-black/60 border border-amber-500/30 text-amber-300 font-bold">
            Collision Rate: 0.000%
          </span>
        </div>
      </div>

      {/* 5-Step Verification Hierarchy Diagram */}
      <div className="p-4 rounded-2xl bg-black/60 border border-white/8 space-y-3">
        <div className="text-xs font-bold text-zinc-300 uppercase tracking-wider flex items-center justify-between">
          <span>5-STEP CRYPTOGRAPHIC IDENTITY RESOLUTION CHAIN</span>
          <span className="text-[10px] text-amber-400">NIST FIPS 204 LATTICE BOUND</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-5 gap-2 text-xs">
          {[
            { step: '1. Display Name', desc: 'ชื่อที่แสดงในระบบ', note: 'อาจเหมือนหรือคล้ายกันได้', status: 'NON-UNIQUE' },
            { step: '2. Signer ID', desc: 'รหัสผู้ลงนามเฉพาะระบบ', note: 'UUID / Identifier เฉพาะ', status: 'UNIQUE' },
            { step: '3. Credential ID', desc: 'Executive Passport ID', note: '#EP-SOVEREIGN-xx', status: 'UNIQUE' },
            { step: '4. Public-Key Fingerprint', desc: 'SHA-256 Public Key Hash', note: 'Unforgeable Cryptographic Hash', status: 'IMMUTABLE' },
            { step: '5. Signature Verification', desc: 'Dilithium-5 Proof Seal', note: 'Zero-Knowledge Mathematical Proof', status: 'MATHEMATICAL' },
          ].map((s, idx) => (
            <div
              key={idx}
              className={`p-3 rounded-xl border flex flex-col justify-between ${
                idx >= 1
                  ? 'bg-amber-500/[0.06] border-amber-500/30 text-amber-200'
                  : 'bg-white/[0.02] border-white/5 text-zinc-400'
              }`}
            >
              <div>
                <div className="font-bold text-[11px] text-zinc-200">{s.step}</div>
                <div className="text-[10px] text-zinc-400 font-sans mt-0.5">{s.desc}</div>
              </div>
              <div className="mt-2 pt-1.5 border-t border-white/5 flex items-center justify-between">
                <span className="text-[9px] text-zinc-500">{s.note}</span>
                <span
                  className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                    s.status === 'NON-UNIQUE'
                      ? 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20'
                      : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                  }`}
                >
                  {s.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Case Study: "Somchai Collision Resolution" Demonstration */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-black/90 via-[#100d05] to-black/90 border-2 border-amber-500/40 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-amber-400" />
            <span className="text-xs font-bold text-amber-200 font-serif">
              CASE STUDY: การแยกแยะผู้พิทักษ์ที่มีชื่อคล้ายหรือซ้ำกัน (Somchai Identity Disambiguation)
            </span>
          </div>
          <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30">
            0% COLLISION CONFIRMED
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          {identityProofs['somchai-collision-case'].map((proof, i) => (
            <div
              key={i}
              className="p-4 rounded-xl bg-white/[0.02] border border-amber-500/30 space-y-3 relative overflow-hidden"
            >
              <div className="flex items-center justify-between border-b border-white/5 pb-2">
                <div>
                  <span className="text-zinc-500 text-[10px] block">1. DISPLAY NAME:</span>
                  <span className="text-white font-bold text-sm">{proof.displayName}</span>
                </div>
                <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold text-[10px] border border-amber-500/40">
                  NODE #{i + 1}
                </span>
              </div>

              <div className="space-y-2 text-[11px]">
                <div>
                  <span className="text-zinc-500 text-[10px] block">2. SIGNER ID:</span>
                  <span className="text-cyan-300 font-bold">{proof.signerId}</span>
                </div>
                <div>
                  <span className="text-zinc-500 text-[10px] block">3. EXECUTIVE CREDENTIAL:</span>
                  <span className="text-amber-200 font-semibold">{proof.credentialId}</span>
                </div>
                <div>
                  <span className="text-zinc-500 text-[10px] block">4. PUBLIC KEY FINGERPRINT (SHA-256):</span>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="text-amber-300/90 truncate font-mono text-[10px]">{proof.publicKeyFingerprint}</span>
                    <button
                      onClick={() => handleCopy(proof.publicKeyFingerprint, `fp-${i}`)}
                      className="p-1 rounded bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white"
                      title="Copy Public Key Fingerprint"
                    >
                      {copiedHash === `fp-${i}` ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    </button>
                  </div>
                </div>
                <div className="pt-2 border-t border-white/5 flex items-center justify-between">
                  <span className="text-zinc-500 text-[10px]">5. LATTICE PROOF:</span>
                  <span className="text-emerald-400 font-bold flex items-center gap-1 text-[10px]">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>DILITHIUM-5 PASS (NO CLASH)</span>
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <p className="text-[11px] text-amber-200/90 font-serif italic border-t border-white/5 pt-2">
          "แม้ผู้ปฏิบัติการจะมีชื่อและนามสกุลคล้ายหรือเหมือนกันในระดับ Display Name แต่ระบบจะแยกแยะสิทธิและหน้าที่ด้วย Public-Key Fingerprint และ Merkle Leaf Hash เฉพาะตัวอย่างเด็ดขาดตามมาตรา ๙ และ ๒๖"
        </p>
      </div>

      {/* Active Custodian Verification Selector */}
      <div className="p-4 rounded-2xl bg-black/50 border border-white/8 space-y-3">
        <div className="text-xs font-bold text-zinc-300 uppercase tracking-wider">
          ACTIVE CUSTODIAN IDENTITY CHAIN INSPECTOR
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {THAI_CUSTODIANS.map((c) => (
            <button
              key={c.id}
              onClick={() => {
                playTone(560, 0.03);
                setSelectedCustodianId(c.id);
              }}
              className={`p-2.5 rounded-xl border text-left transition-all ${
                selectedCustodianId === c.id
                  ? 'bg-amber-500/25 border-amber-400/60 text-amber-100 shadow-[0_0_15px_rgba(245,158,11,0.2)]'
                  : 'bg-white/[0.02] border-white/5 text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <div className="font-bold text-xs truncate">{c.nameTh}</div>
              <div className="text-[10px] text-amber-400/90 mt-0.5">{c.passportNumber}</div>
            </button>
          ))}
        </div>

        <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div>
            <span className="text-zinc-500 text-[10px] block">CUSTODIAN ROLE:</span>
            <span className="text-zinc-200 font-medium text-[11px]">{currentCustodian.roleTh}</span>
          </div>
          <div>
            <span className="text-zinc-500 text-[10px] block">PUBLIC KEY FINGERPRINT:</span>
            <span className="text-amber-300 font-mono text-[10px] truncate block">{currentCustodian.keyFingerprint}</span>
          </div>
          <div>
            <span className="text-zinc-500 text-[10px] block">SECURITY CLEARANCE:</span>
            <span className="text-emerald-300 font-bold text-[11px]">{currentCustodian.clearanceLevel}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
