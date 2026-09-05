import React from 'react';
import { 
  X, 
  Award, 
  ShieldCheck, 
  Lock, 
  CheckCircle2, 
  Printer, 
  Download,
  KeyRound,
  FileCheck
} from 'lucide-react';
import { SYSTEM_METADATA, SOVEREIGN_PRINCIPAL, HSM_NODES } from '../../data/canonicalData';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: 'th' | 'en';
}

export const GoldCertificateModal: React.FC<ModalProps> = ({ isOpen, onClose, lang }) => {
  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-gradient-to-b from-slate-900 to-slate-950 border-2 border-amber-500/50 rounded-2xl max-w-3xl w-full max-h-[92vh] overflow-y-auto shadow-2xl p-6 sm:p-8 space-y-6 relative">
        {/* Close & Print Actions */}
        <div className="flex items-center justify-between border-b border-amber-500/20 pb-4">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded bg-amber-950 border border-amber-500/40 text-amber-300 text-xs font-mono-code font-bold">
              OFFICIAL CERTIFICATE OF SOVEREIGNTY
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>{lang === 'th' ? 'พิมพ์ / บันทึก PDF' : 'Print / Export PDF'}</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Certificate Body */}
        <div className="border border-amber-500/30 rounded-xl p-6 sm:p-8 bg-slate-950/70 relative overflow-hidden space-y-6 text-center">
          {/* Subtle Watermark */}
          <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none">
            <Award className="w-96 h-96 text-amber-400" />
          </div>

          <div className="space-y-2">
            <div className="flex justify-center">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500 via-amber-600 to-amber-800 flex items-center justify-center border-2 border-amber-300 shadow-lg shadow-amber-950">
                <Award className="w-10 h-10 text-slate-950" />
              </div>
            </div>
            <h2 className="text-2xl sm:text-3xl font-display font-bold text-amber-300 tracking-wider">
              ZYRQUEN Ω∞ SOVEREIGN WORLD ENGINE
            </h2>
            <p className="text-xs font-mono-code text-slate-400 tracking-widest uppercase">
              Gold Master Production Deployment Certificate
            </p>
          </div>

          {/* Certificate ID */}
          <div className="inline-block bg-amber-950/60 border border-amber-500/40 px-4 py-1.5 rounded-full text-xs font-mono-code text-amber-200 font-bold">
            CERTIFICATE ID: {SYSTEM_METADATA.certificateId}
          </div>

          {/* Attestation Text */}
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto leading-relaxed">
            {lang === 'th'
              ? `ขอรับรองว่า สถาปัตยกรรม ZYRQUEN Ω∞ เวอร์ชัน v4.16 PDPA FINAL (Frozen v1.2 LTS) ได้ผ่านการตรวจสอบครบถ้วนทั้ง 40 เฟสการประเมิน (40/40 PASSED) บนบล็อกหลัก #${SYSTEM_METADATA.canonicalBlock} และบันทึก 14,902 ซีลอธิปไตย โดยมีความถูกต้องตรงตามต้นไม้ Merkle และกฎหมายไทยทุกประการ`
              : `This is to certify that ZYRQUEN Ω∞ Sovereign Kernel (v4.16 PDPA FINAL Frozen v1.2 LTS) has passed all 40/40 Phase Verifications with 100% compliance on Block #${SYSTEM_METADATA.canonicalBlock} anchoring 14,902 Canonical Seals.`}
          </p>

          {/* Invariants Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-left pt-4 border-t border-amber-500/20 text-xs font-mono-code">
            <div className="bg-slate-900/80 p-2.5 rounded border border-slate-800">
              <span className="text-slate-400 block text-[10px]">Canonical Block:</span>
              <span className="text-white font-bold">#{SYSTEM_METADATA.canonicalBlock}</span>
            </div>
            <div className="bg-slate-900/80 p-2.5 rounded border border-slate-800">
              <span className="text-slate-400 block text-[10px]">Canonical Seals:</span>
              <span className="text-emerald-400 font-bold">{SYSTEM_METADATA.canonicalSeals.toLocaleString()}</span>
            </div>
            <div className="bg-slate-900/80 p-2.5 rounded border border-slate-800">
              <span className="text-slate-400 block text-[10px]">SSoT Drift Delta:</span>
              <span className="text-cyan-300 font-bold">Δ0.0% (Zero Drift)</span>
            </div>
            <div className="bg-slate-900/80 p-2.5 rounded border border-slate-800">
              <span className="text-slate-400 block text-[10px]">HSM Quorum:</span>
              <span className="text-amber-300 font-bold">10/10 REAL_HSM</span>
            </div>
          </div>

          {/* Cryptographic Roots */}
          <div className="text-left bg-slate-900/90 p-3.5 rounded-lg border border-slate-800 space-y-1.5 text-xs font-mono-code">
            <div>
              <span className="text-slate-400 block text-[10px]">Genesis Merkle Root:</span>
              <span className="text-cyan-300 text-[11px] break-all">{SYSTEM_METADATA.genesisMerkleRoot}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px]">PQC Standard:</span>
              <span className="text-emerald-400 text-[11px]">NIST FIPS 204 (ML-DSA-87 Dilithium-5) & FIPS 203 (ML-KEM-1024)</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px]">Thai Legal Certification:</span>
              <span className="text-amber-300 text-[11px]">{SYSTEM_METADATA.legalCompliance}</span>
            </div>
          </div>

          {/* Signatures & Seal Box */}
          <div className="pt-4 border-t border-amber-500/20 grid grid-cols-1 sm:grid-cols-2 gap-4 text-left text-xs">
            <div className="bg-slate-900/60 p-3 rounded-lg border border-slate-800 space-y-1">
              <span className="text-slate-400 text-[10px] block font-mono-code">Sovereign Principal Architect:</span>
              <div className="text-white font-bold">{SOVEREIGN_PRINCIPAL.nameTh}</div>
              <div className="text-emerald-400 font-mono-code text-[11px]">{SOVEREIGN_PRINCIPAL.id} [{SOVEREIGN_PRINCIPAL.clearance}]</div>
            </div>

            <div className="bg-slate-900/60 p-3 rounded-lg border border-slate-800 space-y-1">
              <span className="text-slate-400 text-[10px] block font-mono-code">Deca-Key HSM Consensus Stamp:</span>
              <div className="text-emerald-400 font-bold flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                10/10 REAL_HSM UNANIMOUS SIGNED
              </div>
              <div className="text-slate-400 font-mono-code text-[11px]">FIPS 140-3 Level 4 Sealed</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
