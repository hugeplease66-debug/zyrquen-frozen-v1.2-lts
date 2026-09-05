import React, { useState } from 'react';
import { 
  Database, 
  Lock, 
  Link as LinkIcon, 
  CheckCircle2, 
  FileText, 
  Scale, 
  ShieldCheck,
  Copy
} from 'lucide-react';
import { CHAIN_EVENTS, SYSTEM_METADATA } from '../../data/canonicalData';
import { MerkleStreamVisualizer } from '../ledger/MerkleStreamVisualizer';

interface ChamberProps {
  lang: 'th' | 'en';
}

export const Chamber11SSoTLedger: React.FC<ChamberProps> = ({ lang }) => {
  const [copiedHash, setCopiedHash] = useState<string | null>(null);

  const copyText = (txt: string, label: string) => {
    navigator.clipboard.writeText(txt);
    setCopiedHash(label);
    setTimeout(() => setCopiedHash(null), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="rounded-xl bg-gradient-to-r from-emerald-950/80 via-slate-900 to-slate-950 border border-emerald-500/40 p-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-950 border border-emerald-500/50 text-emerald-300 text-xs font-mono-code font-bold flex items-center gap-1.5">
                <Database className="w-3 h-3 text-emerald-400" />
                SSoT CHAIN OF CUSTODY (Δ0.0%)
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 text-xs font-mono-code">
                4 Hash Events Bound
              </span>
            </div>
            <h2 className="text-2xl font-display font-bold text-white tracking-tight">
              {lang === 'th' ? 'ห่วงโซ่หลักฐานความต่อเนื่องแฮช SSoT (Chamber 11)' : 'Chamber 11: SSoT Hash Chain & Audit Ledger'}
            </h2>
            <p className="text-sm text-slate-300 mt-1 max-w-3xl">
              {lang === 'th'
                ? 'หลักฐานความต่อเนื่องของแฮช (SHA-256 Hash Continuity Proof) ผูกมัดตั้งแต่ Genesis จนถึงเหตุการณ์ความมั่นคงล่าสุด พร้อมลายเซ็น Dilithium-5 ทุกจุด'
                : 'Cryptographically linked Chain of Custody ledger with uninterrupted SHA-256 hash continuity and Dilithium-5 multi-sig attestation.'}
            </p>
          </div>

          <div className="bg-slate-950/80 p-3 rounded-lg border border-emerald-500/30 text-right">
            <span className="text-xs text-slate-400 block font-mono-code">Ledger Drift:</span>
            <span className="text-lg font-mono-code font-bold text-emerald-400">
              Δ0.0% ZERO DRIFT
            </span>
          </div>
        </div>
      </div>

      {/* Real-Time Merkle Ingestion Stream Visualizer */}
      <MerkleStreamVisualizer lang={lang} />

      {/* Hash Continuity Chain Stream */}
      <div className="space-y-4">
        <h3 className="font-display font-bold text-white text-base flex items-center gap-2">
          <LinkIcon className="w-4 h-4 text-cyan-400" />
          {lang === 'th' ? 'ลำดับห่วงโซ่เหตุการณ์ 4 ลำดับ (Hash Continuity Sequence)' : '4-Event Immutable Hash Chain Stream'}
        </h3>

        <div className="space-y-4">
          {CHAIN_EVENTS.map((evt, idx) => (
            <div
              key={evt.event_index}
              className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 space-y-3 relative overflow-hidden"
            >
              {/* Event Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded bg-cyan-950 border border-cyan-500/40 text-cyan-300 font-mono-code font-bold text-xs">
                    EVENT #{evt.event_index}
                  </span>
                  <span className="text-sm font-bold text-white font-mono-code">
                    {evt.action}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-xs font-mono-code text-slate-400">
                  <span>Block: <strong className="text-white">#{evt.block_id || 849200 + evt.event_index}</strong></span>
                  <span>•</span>
                  <span>{evt.timestamp}</span>
                </div>
              </div>

              {/* Handler & Payload Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="space-y-1.5 bg-slate-950 p-3 rounded-lg border border-slate-800/80">
                  <span className="text-slate-400 block font-semibold">Handler Identity:</span>
                  <div className="text-white font-mono-code font-bold flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                    {evt.handler.id} {evt.handler.name ? `(${evt.handler.name})` : ''}
                  </div>
                  <span className="text-slate-400 text-[11px] block">{evt.handler.role}</span>
                  <span className="text-emerald-400 text-[11px] font-mono-code block mt-1">
                    HSM Quorum: {evt.hsm_quorum_status}
                  </span>
                </div>

                <div className="space-y-1.5 bg-slate-950 p-3 rounded-lg border border-slate-800/80">
                  <span className="text-slate-400 block font-semibold">Payload & Legal Compliance:</span>
                  {evt.payload.incident_details && (
                    <p className="text-slate-300 text-[11px] leading-relaxed">
                      {evt.payload.incident_details}
                    </p>
                  )}
                  {evt.payload.system_status && (
                    <div className="text-cyan-300 font-mono-code text-[11px]">
                      Status: {evt.payload.system_status} | Seals: {evt.payload.total_canonical_seals}
                    </div>
                  )}
                  {evt.thai_law_compliance && (
                    <div className="text-emerald-400 font-mono-code text-[11px] flex gap-2 mt-1">
                      <span>Sec 9: {evt.thai_law_compliance.section_9}</span>
                      <span>Sec 26: {evt.thai_law_compliance.section_26}</span>
                      <span>Sec 28: {evt.thai_law_compliance.section_28}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Cryptographic Hashes Box */}
              <div className="bg-slate-950 p-3 rounded-lg border border-slate-800/80 space-y-2 text-xs font-mono-code">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                  <span className="text-slate-500">Prev Hash:</span>
                  <span className="text-slate-400 text-[11px] break-all">{evt.previous_hash}</span>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                  <span className="text-emerald-400 font-bold">Curr Hash:</span>
                  <span className="text-emerald-300 text-[11px] break-all">{evt.current_hash}</span>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                  <span className="text-amber-400">PQC Sig:</span>
                  <span className="text-amber-300 text-[11px] break-all">{evt.dilithium5_signature}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
