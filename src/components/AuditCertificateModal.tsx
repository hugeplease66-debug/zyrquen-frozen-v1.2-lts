import React, { useState } from 'react';
import { SYSTEM_METADATA, AUDIT_TRACE_TX, SYSTEM_INVARIANTS, THAI_CUSTODIANS } from '../data/canonicalData';
import { X, CheckCircle2, ShieldAlert, Award, Copy, Check, Terminal, ExternalLink, Download, FileCheck2, Eye } from 'lucide-react';
import { playAuditChime, playTone } from './AudioSynthesizer';
import { generateMasterForensicAuditPdf, generateMasterAuditJsonLd } from '../utils/masterForensicAuditPackage';
import { copyToClipboard } from '../utils/clipboard';
import { InteractivePdfPreviewModal } from './InteractivePdfPreviewModal';

interface AuditCertificateModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuditCertificateModal: React.FC<AuditCertificateModalProps> = ({ isOpen, onClose }) => {
  const [copiedHash, setCopiedHash] = useState(false);
  const [activeTab, setActiveTab] = useState<'certificate' | 'invariants' | 'stages' | 'custodians'>('certificate');
  const [isDossierPreviewOpen, setIsDossierPreviewOpen] = useState(false);

  if (!isOpen) return null;

  const copyMerkle = () => {
    copyToClipboard(SYSTEM_METADATA.merkleRoot);
    setCopiedHash(true);
    playAuditChime();
    setTimeout(() => setCopiedHash(false), 2000);
  };

  const downloadJson = () => {
    const jsonLdContent = generateMasterAuditJsonLd();
    const blob = new Blob([jsonLdContent], { type: 'application/ld+json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ZYRQUEN-MASTER-AUDIT-PACKAGE-${SYSTEM_METADATA.sealedBlock}.jsonld`;
    a.click();
    URL.revokeObjectURL(url);
    playAuditChime();
  };

  const downloadMasterPdf = () => {
    playTone(650, 0.04);
    generateMasterForensicAuditPdf();
    playAuditChime();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-xl animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl max-h-[90vh] flex flex-col bg-[#0b0d18] border border-white/12 rounded-[28px] shadow-[0_0_50px_rgba(0,0,0,0.8)] overflow-hidden">
        {/* Modal Header */}
        <div className="p-6 border-b border-white/8 flex items-center justify-between bg-gradient-to-r from-amber-500/10 via-violet-500/10 to-cyan-500/10">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-amber-500/20 border border-amber-500/30 text-amber-300">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-mono font-bold text-white tracking-wide">
                  GOLD MASTER CERTIFICATE & DEPLOYMENT GATE
                </h2>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-mono">
                  100% VERIFIED
                </span>
              </div>
              <p className="text-xs text-zinc-400 font-mono mt-0.5">
                ZYRQUEN Ω∞ FROZEN v1.2 LTS • Merkle Root Attestation
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                playTone(620, 0.04);
                setIsDossierPreviewOpen(true);
              }}
              className="p-2 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-200 border border-cyan-500/30 font-mono text-xs flex items-center gap-1.5 transition-all shadow-[0_0_10px_rgba(6,182,212,0.2)]"
              title="Open Interactive Sovereign Dossier & PDF Preview"
            >
              <Eye className="w-4 h-4 text-cyan-400" />
              <span className="hidden sm:inline">Preview Dossier</span>
            </button>
            <button
              onClick={downloadMasterPdf}
              className="p-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 border border-amber-500/30 font-mono text-xs flex items-center gap-1.5 transition-all shadow-[0_0_10px_rgba(245,158,11,0.2)]"
              title="Download Master Forensic Audit PDF"
            >
              <FileCheck2 className="w-4 h-4 text-amber-400" />
              <span className="hidden sm:inline">Master PDF</span>
            </button>
            <button
              onClick={downloadJson}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-300 border border-white/10 font-mono text-xs flex items-center gap-1.5 transition-all"
              title="Download Certificate JSON-LD"
            >
              <Download className="w-4 h-4 text-cyan-400" />
              <span className="hidden sm:inline">Export JSON-LD</span>
            </button>
            <button
              onClick={() => {
                playTone(400, 0.05);
                onClose();
              }}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white border border-white/10 transition-all"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Tabs */}
        <div className="px-6 border-b border-white/8 bg-black/40 flex items-center gap-2 overflow-x-auto no-scrollbar">
          {[
            { id: 'certificate', label: 'Gold Master Seal' },
            { id: 'invariants', label: '10 System Invariants' },
            { id: 'stages', label: '12-Stage Forensics' },
            { id: 'custodians', label: 'Thai Custodian Passports' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                playTone(550, 0.04);
                setActiveTab(tab.id as any);
              }}
              className={`py-3 px-4 text-xs font-mono border-b-2 font-medium transition-all ${
                activeTab === tab.id
                  ? 'border-cyan-400 text-cyan-300 bg-white/[0.02]'
                  : 'border-transparent text-zinc-400 hover:text-zinc-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-sm font-mono text-zinc-300">
          {activeTab === 'certificate' && (
            <div className="space-y-6">
              {/* Master Merkle Hash Banner */}
              <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/8 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-zinc-400 font-mono uppercase tracking-wider">Merkle Root Hash (SHA-256)</span>
                  <button
                    onClick={copyMerkle}
                    className="flex items-center gap-1 text-xs text-cyan-400 hover:text-cyan-300 bg-cyan-500/10 px-2 py-1 rounded-lg border border-cyan-500/20"
                  >
                    {copiedHash ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedHash ? 'Copied' : 'Copy Hash'}</span>
                  </button>
                </div>
                <div className="p-3 bg-black/60 rounded-xl border border-white/5 font-mono text-xs sm:text-sm text-cyan-300 break-all select-all">
                  {SYSTEM_METADATA.merkleRoot}
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 text-xs">
                  <div className="p-3 bg-white/[0.02] rounded-xl border border-white/5">
                    <div className="text-zinc-500 text-[10px]">SEALED BLOCK</div>
                    <div className="text-zinc-100 font-bold mt-0.5">#{SYSTEM_METADATA.sealedBlock}</div>
                  </div>
                  <div className="p-3 bg-white/[0.02] rounded-xl border border-white/5">
                    <div className="text-zinc-500 text-[10px]">TOTAL SEALS</div>
                    <div className="text-emerald-400 font-bold mt-0.5">{SYSTEM_METADATA.totalVerifiedSeals.toLocaleString()}</div>
                  </div>
                  <div className="p-3 bg-white/[0.02] rounded-xl border border-white/5">
                    <div className="text-zinc-500 text-[10px]">BASELINE DRIFT</div>
                    <div className="text-zinc-100 font-bold mt-0.5">{SYSTEM_METADATA.baselineDrift}</div>
                  </div>
                  <div className="p-3 bg-white/[0.02] rounded-xl border border-white/5">
                    <div className="text-zinc-500 text-[10px]">SSOT MUTATION</div>
                    <div className="text-emerald-400 font-bold mt-0.5">{SYSTEM_METADATA.ssotMutation}</div>
                  </div>
                </div>
              </div>

              {/* 4-Layer Manifesto Envelope */}
              <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/8 space-y-3">
                <h3 className="text-sm font-bold text-zinc-100 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-violet-400" />
                  THE 4-LAYER ARCHITECTURAL MANIFESTO (V1.21 PROTOCOL)
                </h3>
                <p className="text-xs text-zinc-400 leading-relaxed font-sans">
                  "TEST COVERAGE ↑ ≠ CANONICAL TRUTH ↑" — All verification, telemetry, analytics, visualization,
                  governance, recovery, and export operations are non-authoritative with respect to the Canonical
                  Truth Plane (v1.2 LTS). Extension plane expansions occur without mutating the locked core state.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2 text-xs">
                  <div className="p-2.5 rounded-lg bg-black/40 border border-white/5 flex items-center justify-between">
                    <span className="text-zinc-400">Layer 1: Canonical SSoT Core</span>
                    <span className="text-emerald-400 font-semibold">🔒 FROZEN</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-black/40 border border-white/5 flex items-center justify-between">
                    <span className="text-zinc-400">Layer 2: Verification Engine</span>
                    <span className="text-cyan-400 font-semibold">31 PHASES</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-black/40 border border-white/5 flex items-center justify-between">
                    <span className="text-zinc-400">Layer 3: Adversarial Shield</span>
                    <span className="text-violet-400 font-semibold">5 BLOCKED (SIM)</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-black/40 border border-white/5 flex items-center justify-between">
                    <span className="text-zinc-400">Layer 4: Extension Plane</span>
                    <span className="text-amber-400 font-semibold">NON-AUTHORITATIVE</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'invariants' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs text-zinc-400 mb-2">
                <span>10 / 10 Canonical Invariants Fully Satisfied</span>
                <span className="text-emerald-400">0 Violations</span>
              </div>
              {SYSTEM_INVARIANTS.map((inv) => (
                <div
                  key={inv.id}
                  className="p-3.5 rounded-xl bg-white/[0.02] border border-white/6 hover:border-white/12 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span className="text-xs font-bold text-zinc-200">{inv.code}</span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/5 text-zinc-400 border border-white/5">
                        {inv.layer}
                      </span>
                    </div>
                    <p className="text-xs text-zinc-400 font-sans pl-6">{inv.description}</p>
                  </div>
                  <div className="pl-6 sm:pl-0 font-mono text-[11px] text-cyan-400/80 shrink-0">
                    {inv.verificationHash}
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'stages' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-xs">
                <div className="font-bold text-cyan-300">Transaction: {AUDIT_TRACE_TX.txId}</div>
                <div className="text-zinc-400 mt-0.5">
                  {AUDIT_TRACE_TX.title} • Latency: {AUDIT_TRACE_TX.totalLatencyMs}ms • Sealed Block #{AUDIT_TRACE_TX.sealedLedgerBlock}
                </div>
              </div>
              <div className="space-y-2">
                {AUDIT_TRACE_TX.stages.map((stage) => (
                  <div
                    key={stage.id}
                    className="p-3 rounded-xl bg-white/[0.02] border border-white/6 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-6 h-6 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center font-bold text-[11px] text-cyan-300">
                        {stage.stageNumber}
                      </span>
                      <div>
                        <div className="font-bold text-zinc-200">{stage.name}</div>
                        <div className="text-zinc-400 text-[11px] font-sans">{stage.shortDesc}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 text-[11px] text-zinc-400 font-mono">
                      <span>{stage.durationMs}ms</span>
                      <span className="text-cyan-400">{stage.outputHash.slice(0, 16)}...</span>
                      <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px]">
                        {stage.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'custodians' && (
            <div className="space-y-3">
              {THAI_CUSTODIANS.map((cust) => (
                <div
                  key={cust.id}
                  className="p-4 rounded-2xl bg-white/[0.02] border border-white/8 space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-base">🇹🇭</span>
                      <span className="text-sm font-bold text-zinc-100">{cust.nameTh}</span>
                      <span className="text-xs text-zinc-400 font-mono">({cust.nameEn})</span>
                    </div>
                    <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px]">
                      {cust.passportNumber}
                    </span>
                  </div>
                  <div className="text-xs text-zinc-400">{cust.roleTh}</div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2 text-[11px] text-zinc-500">
                    <div>
                      <span className="text-zinc-400">Clearance:</span> {cust.clearanceLevel}
                    </div>
                    <div className="truncate">
                      <span className="text-zinc-400">Key:</span> {cust.keyFingerprint}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Interactive Sovereign PDF Dossier Preview Modal */}
      <InteractivePdfPreviewModal
        isOpen={isDossierPreviewOpen}
        onClose={() => setIsDossierPreviewOpen(false)}
      />
    </div>
  );
};
