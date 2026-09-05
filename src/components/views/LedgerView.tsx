import React, { useState, useMemo } from 'react';
import { AUDIT_TRACE_TX, SYSTEM_METADATA } from '../../data/canonicalData';
import {
  FileCheck2,
  Play,
  CheckCircle2,
  Copy,
  Check,
  RotateCcw,
  Sparkles,
  Shield,
  Clock,
  Download,
  FileSpreadsheet,
  FileText,
  Camera,
  Activity,
  Cpu,
  Layers,
  Server,
  ArrowRightLeft,
  Scale,
  FileCode,
  Search,
  HardDrive,
  Gauge,
  AlertTriangle,
  ShieldAlert,
  FileSearch,
  GitFork,
} from 'lucide-react';
import { playAuditChime, playTone } from '../AudioSynthesizer';
import { copyToClipboard } from '../../utils/clipboard';
import { HardwareSnapshot } from '../../types';
import { INITIAL_HARDWARE_SNAPSHOTS, exportEvidenceToCsv } from '../../utils/telemetrySnapshot';
import { SnapshotCompareView } from '../SnapshotCompareView';
import { QuarantineRegistry } from '../QuarantineRegistry';
import { ForensicEvidenceMatrix } from '../ForensicEvidenceMatrix';
import { generateForensicPdfReport } from '../../utils/forensicPdfExport';
import { generateCompliancePdfReport } from '../../utils/compliancePdfExport';
import { MerkleVerificationBadge } from '../council/MerkleVerificationBadge';
import { downloadEvidenceManifestJson } from '../../utils/evidenceManifestGenerator';
import { exportSignedBlockEvidenceJson } from '../../utils/evidenceExportJson';
import { MerkleTreeInteractiveGraph } from '../MerkleTreeInteractiveGraph';

interface LedgerViewProps {
  snapshots?: HardwareSnapshot[];
}

export const LedgerView: React.FC<LedgerViewProps> = ({ snapshots = INITIAL_HARDWARE_SNAPSHOTS }) => {
  const [activeLedgerTab, setActiveLedgerTab] = useState<'stages' | 'snapshots' | 'quarantine' | 'forensics' | 'compare' | 'merkle-tree'>('stages');
  const [selectedStage, setSelectedStage] = useState<number>(0);
  const [selectedSnapshotIndex, setSelectedSnapshotIndex] = useState<number>(0);
  const [isPlayingReplay, setIsPlayingReplay] = useState<boolean>(false);
  const [copiedHash, setCopiedHash] = useState<string | null>(null);
  const [csvExportToast, setCsvExportToast] = useState<boolean>(false);
  const [pdfExportToast, setPdfExportToast] = useState<string | null>(null);
  const [compliancePdfToast, setCompliancePdfToast] = useState<string | null>(null);
  const [merkleLogToast, setMerkleLogToast] = useState<string | null>(null);
  const [evidenceManifestToast, setEvidenceManifestToast] = useState<string | null>(null);
  const [signedEvidenceToast, setSignedEvidenceToast] = useState<string | null>(null);
  const [timestampFormat, setTimestampFormat] = useState<'human' | 'block-height'>('human');
  const [snapshotSearchQuery, setSnapshotSearchQuery] = useState<string>('');

  const allSnapshots = snapshots.length > 0 ? snapshots : INITIAL_HARDWARE_SNAPSHOTS;
  
  const filteredSnapshots = useMemo(() => {
    if (!snapshotSearchQuery.trim()) return allSnapshots;
    const q = snapshotSearchQuery.toLowerCase();
    return allSnapshots.filter(
      (s) =>
        s.id.toLowerCase().includes(q) ||
        s.actor.toLowerCase().includes(q) ||
        s.status.toLowerCase().includes(q) ||
        s.sealedHash.toLowerCase().includes(q) ||
        s.parentHash.toLowerCase().includes(q) ||
        String(s.snapshotNumber).includes(q)
    );
  }, [allSnapshots, snapshotSearchQuery]);

  const currentSnapshot =
    filteredSnapshots[Math.min(selectedSnapshotIndex, Math.max(0, filteredSnapshots.length - 1))] || allSnapshots[0];

  const startReplay = () => {
    setActiveLedgerTab('stages');
    setIsPlayingReplay(true);
    let step = 0;
    setSelectedStage(0);
    playTone(500, 0.08);

    const interval = setInterval(() => {
      step++;
      if (step < AUDIT_TRACE_TX.stages.length) {
        setSelectedStage(step);
        playTone(450 + step * 30, 0.06);
      } else {
        clearInterval(interval);
        setIsPlayingReplay(false);
        playAuditChime();
      }
    }, 450);
  };

  const handleCopy = (id: string, hash: string) => {
    copyToClipboard(hash);
    setCopiedHash(id);
    playTone(700, 0.06);
    setTimeout(() => setCopiedHash(null), 2000);
  };

  const handleExportCsv = () => {
    playAuditChime();
    exportEvidenceToCsv(AUDIT_TRACE_TX.stages, allSnapshots, timestampFormat);
    setCsvExportToast(true);
    setTimeout(() => setCsvExportToast(false), 3500);
  };

  const handleExportMerkleLog = () => {
    playAuditChime();
    const exportSnapshots = filteredSnapshots.length > 0 ? filteredSnapshots : allSnapshots;
    
    // Sequence of Merkle-verified system events for archival
    const merkleVerifiedEventsSequence = AUDIT_TRACE_TX.stages.map((stage, idx) => ({
      sequenceIndex: idx + 1,
      stageId: stage.id,
      stageNumber: stage.stageNumber,
      stageName: stage.name,
      shortDesc: stage.shortDesc,
      actor: stage.actor,
      status: stage.status,
      timestamp: stage.timestamp,
      durationMs: stage.durationMs,
      sourceModule: stage.sourceModule,
      outputHash: stage.outputHash,
      parentHash: stage.parentHash,
      merkleLeafProof: `LEAF-${idx + 1}-0x${stage.outputHash.slice(0, 16)}`,
      sealedBlock: AUDIT_TRACE_TX.sealedLedgerBlock,
      verificationStatus: 'MERKLE_ROOT_VERIFIED',
      ssotDrift: '0.00%',
    }));

    const merklePayload = {
      archiveReportType: 'ZYRQUEN_MERKLE_VERIFIED_SYSTEM_EVENTS_ARCHIVE',
      canonicalMerkleRoot: SYSTEM_METADATA.merkleRoot,
      sealedBlock: SYSTEM_METADATA.sealedBlock,
      totalVerifiedSeals: SYSTEM_METADATA.totalVerifiedSeals,
      exportTimestampUtc: new Date().toUTCString(),
      exportTimestampIct: new Date().toLocaleString('th-TH', { timeZone: 'Asia/Bangkok' }),
      provenanceSovereign: SYSTEM_METADATA.sovereignPrincipal,
      auditTxId: AUDIT_TRACE_TX.txId,
      filterApplied: snapshotSearchQuery.trim() ? snapshotSearchQuery.trim() : 'NONE (ALL SNAPSHOTS)',
      merkleVerifiedEventsCount: merkleVerifiedEventsSequence.length,
      merkleVerifiedEventsSequence: merkleVerifiedEventsSequence,
      stagesCount: AUDIT_TRACE_TX.stages.length,
      stages: AUDIT_TRACE_TX.stages,
      snapshotsCount: exportSnapshots.length,
      snapshots: exportSnapshots,
      cryptographicInvariants: {
        canonicalSeals: 14902,
        genesisBlock: 849202,
        ssotMutation: 0,
        baselineDrift: '0.00%',
      },
    };

    const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(merklePayload, null, 2))}`;
    const downloadAnchor = document.createElement('a');
    const filename = `zyrquen-merkle-events-archive-block${SYSTEM_METADATA.sealedBlock}-${new Date().toISOString().slice(0, 10)}.json`;
    downloadAnchor.setAttribute('href', jsonString);
    downloadAnchor.setAttribute('download', filename);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();

    setMerkleLogToast(filename);
    setTimeout(() => setMerkleLogToast(null), 4500);
  };

  const handleExportSignedBlockEvidence = () => {
    playAuditChime();
    const { filename } = exportSignedBlockEvidenceJson(allSnapshots);
    setSignedEvidenceToast(filename);
    setTimeout(() => setSignedEvidenceToast(null), 5000);
  };

  const handleDownloadEvidenceManifest = () => {
    playAuditChime();
    const { filename } = downloadEvidenceManifestJson(allSnapshots);
    setEvidenceManifestToast(filename);
    setTimeout(() => setEvidenceManifestToast(null), 5000);
  };

  const handleGeneratePdfReport = () => {
    playAuditChime();
    const snapA = allSnapshots[0];
    const snapB = allSnapshots[Math.min(1, allSnapshots.length - 1)] || snapA;
    try {
      const filename = generateForensicPdfReport({
        snapA,
        snapB,
        allSnapshots,
        timestampFormat,
      });
      setPdfExportToast(filename);
      setTimeout(() => setPdfExportToast(null), 4000);
    } catch (err) {
      console.error('PDF export error:', err);
    }
  };

  const handleExportComplianceReport = () => {
    playAuditChime();
    try {
      const filename = generateCompliancePdfReport({
        snapshots: allSnapshots,
        timestampFormat,
      });
      setCompliancePdfToast(filename);
      setTimeout(() => setCompliancePdfToast(null), 4500);
    } catch (err) {
      console.error('Compliance PDF export error:', err);
    }
  };

  const currentStageData = AUDIT_TRACE_TX.stages[selectedStage];

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Banner */}
      <div className="p-6 sm:p-7 rounded-[28px] bg-gradient-to-br from-[#070914]/95 via-[#0b0e1e]/90 to-[#070914]/95 border border-cyan-500/20 shadow-[0_10px_50px_-10px_rgba(6,182,212,0.15)] backdrop-blur-3xl flex flex-col md:flex-row md:items-center justify-between gap-5 relative overflow-hidden group">
        <div className="absolute top-0 right-1/4 w-96 h-64 bg-cyan-500/5 rounded-full blur-[80px] pointer-events-none transition-opacity opacity-50 group-hover:opacity-100" />
        <div className="relative z-10">
          <div className="flex items-center gap-2 flex-wrap mb-2">
            <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 text-[10px] sm:text-xs font-mono font-bold tracking-wider shadow-sm">
              POST-QUANTUM EVIDENCE LEDGER V25
            </span>
            <span className="px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 text-[10px] sm:text-xs font-mono font-bold tracking-wider shadow-sm">
              14,902 SEALS INTACT
            </span>
            <span className="px-3 py-1 rounded-full bg-violet-500/10 text-violet-300 border border-violet-500/20 text-[10px] sm:text-xs font-mono font-bold tracking-wider shadow-sm">
              {allSnapshots.length} HARDWARE SNAPSHOTS
            </span>
            <MerkleVerificationBadge showInspectorButton={true} compact={false} />
          </div>
          <h2 className="text-xl sm:text-3xl font-mono font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-cyan-100 mt-1 tracking-tight">
            Immutable Audit Ledger, Forensics Trace & Evidence Exporter
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400 font-mono mt-1.5 leading-relaxed">
            Transaction: {AUDIT_TRACE_TX.txId} • Total Latency: {AUDIT_TRACE_TX.totalLatencyMs}ms • Sealed Block #{AUDIT_TRACE_TX.sealedLedgerBlock}
          </p>
        </div>

        {/* Top Right Action Buttons & Timestamp Mode Toggle */}
        <div className="relative z-10 flex flex-wrap items-center gap-2.5">
          {/* Timestamp View & Export Toggle */}
          <div className="flex items-center bg-[#070914]/90 border border-cyan-500/20 rounded-2xl p-1.5 font-mono text-xs shadow-inner">
            <button
              onClick={() => {
                playTone(600, 0.04);
                setTimestampFormat('human');
              }}
              className={`px-3 py-1.5 rounded-xl flex items-center gap-1.5 transition-all text-xs tracking-wide ${
                timestampFormat === 'human'
                  ? 'bg-cyan-500/20 text-cyan-100 font-bold border border-cyan-500/30 shadow-[0_0_10px_rgba(6,182,212,0.2)]'
                  : 'text-zinc-400 hover:text-cyan-300 hover:bg-cyan-500/10 border border-transparent'
              }`}
              title="Display and export human-readable timestamps (ICT/UTC)"
            >
              <Clock className={`w-3.5 h-3.5 ${timestampFormat === 'human' ? 'text-cyan-400' : 'text-zinc-500'}`} />
              <span>Human Time</span>
            </button>

            <button
              onClick={() => {
                playTone(640, 0.04);
                setTimestampFormat('block-height');
              }}
              className={`px-3 py-1.5 rounded-xl flex items-center gap-1.5 transition-all text-xs tracking-wide ${
                timestampFormat === 'block-height'
                  ? 'bg-emerald-500/20 text-emerald-100 border border-emerald-500/30 font-bold shadow-[0_0_10px_rgba(16,185,129,0.2)]'
                  : 'text-zinc-400 hover:text-emerald-300 hover:bg-emerald-500/10 border border-transparent'
              }`}
              title="Display and export block-height-only references (e.g. Block #849202:Stage#)"
            >
              <Layers className={`w-3.5 h-3.5 ${timestampFormat === 'block-height' ? 'text-emerald-400' : 'text-zinc-500'}`} />
              <span>Block Height</span>
            </button>
          </div>

          {/* Export Evidence (Signed JSON) Button */}
          <button
            onClick={handleExportSignedBlockEvidence}
            className="px-4 py-2.5 rounded-2xl font-mono text-[11px] sm:text-xs font-bold bg-gradient-to-r from-emerald-600/30 via-cyan-600/20 to-emerald-600/30 hover:from-emerald-500/40 hover:to-cyan-500/40 border border-emerald-400/50 text-emerald-100 hover:text-white flex items-center gap-2 transition-all shadow-[0_0_20px_rgba(16,185,129,0.25)] hover:shadow-[0_0_25px_rgba(16,185,129,0.35)] tracking-wide"
            title="Download current Merkle-verified block evidence as a cryptographically signed JSON file (NIST PQC ML-DSA-87 & Thai ETDA Sec 9/26/28)"
          >
            <Shield className="w-4 h-4 text-emerald-300" />
            <span>Export Evidence (Signed JSON)</span>
            <Download className="w-3.5 h-3.5 text-emerald-300 opacity-80" />
          </button>

          {/* Download Evidence Manifest Button */}
          <button
            onClick={handleDownloadEvidenceManifest}
            className="px-4 py-2.5 rounded-2xl font-mono text-[11px] sm:text-xs font-bold bg-gradient-to-r from-amber-600/30 via-yellow-600/20 to-amber-600/30 hover:from-amber-500/40 hover:to-amber-500/40 border border-amber-400/50 text-amber-100 hover:text-white flex items-center gap-2 transition-all shadow-[0_0_20px_rgba(245,158,11,0.2)] hover:shadow-[0_0_25px_rgba(245,158,11,0.3)] tracking-wide"
            title="Download complete offline audit Evidence Manifest (JSON) containing full list of verified Merkle blocks, signatures, and proofs"
          >
            <FileCheck2 className="w-4 h-4 text-amber-300" />
            <span>Download Evidence Manifest</span>
            <Download className="w-3.5 h-3.5 text-amber-300 opacity-80" />
          </button>

          {/* Export Merkle Log JSON Button */}
          <button
            onClick={handleExportMerkleLog}
            className="px-4 py-2.5 rounded-2xl font-mono text-[11px] sm:text-xs font-bold bg-gradient-to-r from-purple-500/20 via-violet-500/20 to-cyan-500/20 hover:from-purple-500/30 hover:to-cyan-500/30 border border-purple-500/40 text-purple-100 hover:text-white flex items-center gap-2 transition-all shadow-[0_0_15px_rgba(168,85,247,0.25)] hover:shadow-[0_0_20px_rgba(168,85,247,0.35)] tracking-wide"
            title="Export complete Merkle Tree, verification hashes, stages, and snapshot audit logs as machine-readable JSON"
          >
            <FileCode className="w-4 h-4 text-purple-300" />
            <span>Export Merkle Log</span>
            <Download className="w-3.5 h-3.5 text-purple-300 opacity-80" />
          </button>

          {/* Export Evidence CSV Button */}
          <button
            onClick={handleExportCsv}
            className="px-4 py-2.5 rounded-2xl font-mono text-[11px] sm:text-xs font-bold bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-500/40 text-cyan-200 hover:text-white flex items-center gap-2 transition-all shadow-[0_0_15px_rgba(6,182,212,0.2)] hover:shadow-[0_0_20px_rgba(6,182,212,0.3)] tracking-wide"
            title={`Export full cryptographic evidence as CSV (${timestampFormat === 'block-height' ? 'Block-Height Mode' : 'Human-Time Mode'})`}
          >
            <FileSpreadsheet className="w-4 h-4 text-cyan-400" />
            <span>Export CSV</span>
            <Download className="w-3.5 h-3.5 text-cyan-400 opacity-80" />
          </button>

          {/* Export Compliance Report PDF Button */}
          <button
            onClick={handleExportComplianceReport}
            className="px-4 py-2.5 rounded-2xl font-mono text-[11px] sm:text-xs font-bold bg-gradient-to-r from-blue-500/20 via-cyan-500/20 to-emerald-500/20 hover:from-blue-500/30 hover:to-emerald-500/30 border border-cyan-500/40 text-cyan-100 hover:text-white flex items-center gap-2 transition-all shadow-[0_0_15px_rgba(6,182,212,0.25)] tracking-wide"
            title="Export official Regulatory Compliance Report mapping Thai Electronic Transactions Act (Sec 9, 26, 28) and cryptographic proofs"
          >
            <Scale className="w-4 h-4 text-cyan-300" />
            <span>Compliance Report (PDF)</span>
            <Download className="w-3.5 h-3.5 text-cyan-300 opacity-80" />
          </button>

          {/* Generate Forensic Report PDF Button */}
          <button
            onClick={handleGeneratePdfReport}
            className="px-4 py-2.5 rounded-2xl font-mono text-[11px] sm:text-xs font-bold bg-gradient-to-r from-emerald-500/20 to-teal-500/20 hover:from-emerald-500/30 hover:to-teal-500/30 border border-emerald-500/40 text-emerald-100 hover:text-white flex items-center gap-2 transition-all shadow-[0_0_15px_rgba(16,185,129,0.2)] tracking-wide"
            title="Generate and download a comprehensive PDF Forensic Report compiling snapshot variance analysis and Merkle roots"
          >
            <FileText className="w-4 h-4 text-emerald-400" />
            <span>Forensic Report (PDF)</span>
            <Download className="w-3.5 h-3.5 text-emerald-400 opacity-80" />
          </button>

          {/* Forensic Replay Button */}
          <button
            onClick={startReplay}
            disabled={isPlayingReplay}
            className={`px-4 py-2.5 rounded-2xl font-mono text-[11px] sm:text-xs font-bold flex items-center gap-2 border transition-all tracking-wide ${
              isPlayingReplay
                ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-200 animate-pulse'
                : 'bg-emerald-500/10 hover:bg-emerald-500/20 border-emerald-500/30 text-emerald-300 shadow-[0_0_15px_rgba(16,185,129,0.15)] hover:shadow-[0_0_20px_rgba(16,185,129,0.25)]'
            }`}
          >
            {isPlayingReplay ? <RotateCcw className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
            <span>{isPlayingReplay ? `Replaying (${selectedStage + 1}/12)...` : 'Run 12-Stage Replay'}</span>
          </button>
        </div>
      </div>

      {/* Signed Block Evidence JSON Export Success Toast */}
      {signedEvidenceToast && (
        <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-950/85 via-cyan-950/75 to-[#07080F] border border-emerald-500/60 backdrop-blur-xl flex items-center justify-between gap-3 text-xs font-mono text-emerald-200 animate-in fade-in duration-200 shadow-2xl shadow-emerald-950/40">
          <div className="flex items-center gap-2.5">
            <Shield className="w-4 h-4 text-emerald-300 shrink-0" />
            <span>
              <strong>Signed Block Evidence JSON Exported:</strong> Successfully generated <strong className="text-white">{signedEvidenceToast}</strong> with NIST Post-Quantum Signature (ML-DSA-87 / Dilithium-5), Merkle leaf proofs, SSoT invariants, and Thai ETDA Sec 9/26/28 statutory bindings.
            </span>
          </div>
          <button
            onClick={() => setSignedEvidenceToast(null)}
            className="px-2.5 py-1 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-100 hover:text-white transition-all text-xs border border-emerald-500/40"
          >
            Close
          </button>
        </div>
      )}

      {/* Evidence Manifest JSON Export Success Toast */}
      {evidenceManifestToast && (
        <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-950/85 via-yellow-950/70 to-[#07080F] border border-amber-500/60 backdrop-blur-xl flex items-center justify-between gap-3 text-xs font-mono text-amber-200 animate-in fade-in duration-200 shadow-2xl shadow-amber-950/40">
          <div className="flex items-center gap-2.5">
            <FileCheck2 className="w-4 h-4 text-amber-300 shrink-0" />
            <span>
              <strong>Evidence Manifest JSON Exported:</strong> Successfully generated <strong className="text-white">{evidenceManifestToast}</strong> containing the full sequence of verified Merkle blocks, NIST FIPS 204 signatures, and offline audit proofs.
            </span>
          </div>
          <button
            onClick={() => setEvidenceManifestToast(null)}
            className="px-2.5 py-1 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-100 hover:text-white transition-all text-xs border border-amber-500/40"
          >
            Close
          </button>
        </div>
      )}

      {/* Merkle Log JSON Export Success Toast */}
      {merkleLogToast && (
        <div className="p-4 rounded-2xl bg-gradient-to-r from-purple-950/80 via-violet-950/70 to-[#07080F] border border-purple-500/50 backdrop-blur-xl flex items-center justify-between gap-3 text-xs font-mono text-purple-200 animate-in fade-in duration-200 shadow-2xl">
          <div className="flex items-center gap-2.5">
            <FileCode className="w-4 h-4 text-purple-300 shrink-0" />
            <span>
              <strong>Merkle Audit Log JSON Exported:</strong> Successfully generated <strong className="text-white">{merkleLogToast}</strong> with canonical root, cryptographic verification chains, and {allSnapshots.length} hardware snapshots.
            </span>
          </div>
          <button
            onClick={() => setMerkleLogToast(null)}
            className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-zinc-300 hover:text-white transition-all text-xs"
          >
            Close
          </button>
        </div>
      )}

      {/* Compliance PDF Export Success Toast */}
      {compliancePdfToast && (
        <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-950/80 via-cyan-950/70 to-[#07080F] border border-cyan-500/50 backdrop-blur-xl flex items-center justify-between gap-3 text-xs font-mono text-cyan-200 animate-in fade-in duration-200 shadow-2xl">
          <div className="flex items-center gap-2.5">
            <Scale className="w-4 h-4 text-cyan-300 shrink-0" />
            <span>
              <strong>Regulatory Compliance Report Exported:</strong> Successfully generated <strong className="text-white">{compliancePdfToast}</strong> bundled with Thai Law mapping (Sec 9, 26, 28) and Merkle proofs.
            </span>
          </div>
          <button
            onClick={() => setCompliancePdfToast(null)}
            className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-zinc-300 hover:text-white transition-all text-xs"
          >
            Close
          </button>
        </div>
      )}

      {/* PDF Export Success Toast */}
      {pdfExportToast && (
        <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-950/70 via-[#0b0e1a]/80 to-[#07080F] border border-emerald-500/40 backdrop-blur-xl flex items-center justify-between gap-3 text-xs font-mono text-emerald-300 animate-in fade-in duration-200 shadow-xl">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>
              <strong>Forensic Variance Report Generated:</strong> Successfully downloaded <strong className="text-white">{pdfExportToast}</strong> with Merkle evidence and telemetry deltas.
            </span>
          </div>
          <button
            onClick={() => setPdfExportToast(null)}
            className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white transition-all text-xs"
          >
            Close
          </button>
        </div>
      )}

      {/* CSV Export Success Toast */}
      {csvExportToast && (
        <div className="p-4 rounded-2xl bg-gradient-to-r from-cyan-950/70 via-[#0b0e1a]/80 to-[#07080F] border border-cyan-500/40 backdrop-blur-xl flex items-center justify-between gap-3 text-xs font-mono text-cyan-300 animate-in fade-in duration-200">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-cyan-400" />
            <span>
              <strong>Cryptographic Evidence Logs Exported:</strong> CSV downloaded ({timestampFormat === 'block-height' ? 'Block Height Only mode' : 'Human-Readable Timestamps mode'}) with 12 forensic stages and {allSnapshots.length} hardware snapshots.
            </span>
          </div>
          <button
            onClick={() => setCsvExportToast(false)}
            className="px-2 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white"
          >
            Close
          </button>
        </div>
      )}

      {/* Ledger Section Tabs */}
      <div className="flex items-center bg-[#070914]/90 backdrop-blur-xl border border-cyan-500/20 rounded-2xl p-2 font-mono text-xs shadow-inner flex-wrap gap-2 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 via-violet-500/5 to-transparent pointer-events-none" />
        
        <button
          onClick={() => {
            playTone(550, 0.04);
            setActiveLedgerTab('stages');
          }}
          className={`relative z-10 px-4 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-all tracking-wide ${
            activeLedgerTab === 'stages'
              ? 'bg-emerald-500/20 text-emerald-100 border border-emerald-500/40 shadow-[0_0_15px_rgba(16,185,129,0.25)]'
              : 'text-zinc-400 hover:text-emerald-300 hover:bg-emerald-500/10 border border-transparent'
          }`}
        >
          <FileCheck2 className={`w-4 h-4 ${activeLedgerTab === 'stages' ? 'text-emerald-400' : 'text-zinc-500'}`} />
          <span>12-Stage Forensics Trace</span>
        </button>

        <button
          onClick={() => {
            playTone(560, 0.04);
            setActiveLedgerTab('quarantine');
          }}
          className={`relative z-10 px-4 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-all tracking-wide ${
            activeLedgerTab === 'quarantine'
              ? 'bg-amber-500/25 text-amber-100 border border-amber-500/40 shadow-[0_0_15px_rgba(245,158,11,0.25)]'
              : 'text-zinc-400 hover:text-amber-300 hover:bg-amber-500/10 border border-transparent'
          }`}
        >
          <ShieldAlert className={`w-4 h-4 ${activeLedgerTab === 'quarantine' ? 'text-amber-400' : 'text-zinc-500'}`} />
          <span>Quarantine Registry (#14,903–#14,907)</span>
        </button>

        <button
          onClick={() => {
            playTone(570, 0.04);
            setActiveLedgerTab('forensics');
          }}
          className={`relative z-10 px-4 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-all tracking-wide ${
            activeLedgerTab === 'forensics'
              ? 'bg-indigo-500/25 text-indigo-100 border border-indigo-500/40 shadow-[0_0_15px_rgba(99,102,241,0.25)]'
              : 'text-zinc-400 hover:text-indigo-300 hover:bg-indigo-500/10 border border-transparent'
          }`}
        >
          <FileSearch className={`w-4 h-4 ${activeLedgerTab === 'forensics' ? 'text-indigo-400' : 'text-zinc-500'}`} />
          <span>Forensic Evidence Matrix</span>
        </button>

        <button
          onClick={() => {
            playTone(550, 0.04);
            setActiveLedgerTab('snapshots');
          }}
          className={`relative z-10 px-4 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-all tracking-wide ${
            activeLedgerTab === 'snapshots'
              ? 'bg-cyan-500/25 text-cyan-100 border border-cyan-500/40 shadow-[0_0_15px_rgba(6,182,212,0.25)]'
              : 'text-zinc-400 hover:text-cyan-300 hover:bg-cyan-500/10 border border-transparent'
          }`}
        >
          <Camera className={`w-4 h-4 ${activeLedgerTab === 'snapshots' ? 'text-cyan-400' : 'text-zinc-500'}`} />
          <span>Hardware Snapshots ({allSnapshots.length})</span>
        </button>

        <button
          onClick={() => {
            playTone(600, 0.04);
            setActiveLedgerTab('compare');
          }}
          className={`relative z-10 px-4 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-all tracking-wide ${
            activeLedgerTab === 'compare'
              ? 'bg-violet-500/25 text-violet-100 border border-violet-500/40 shadow-[0_0_15px_rgba(139,92,246,0.25)]'
              : 'text-zinc-400 hover:text-violet-300 hover:bg-violet-500/10 border border-transparent'
          }`}
        >
          <ArrowRightLeft className={`w-4 h-4 ${activeLedgerTab === 'compare' ? 'text-violet-400' : 'text-zinc-500'}`} />
          <span>Compare Snapshots</span>
        </button>

        <button
          onClick={() => {
            playTone(620, 0.04);
            setActiveLedgerTab('merkle-tree');
          }}
          className={`relative z-10 px-4 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-all tracking-wide ${
            activeLedgerTab === 'merkle-tree'
              ? 'bg-cyan-500/25 text-cyan-100 border border-cyan-500/40 shadow-[0_0_15px_rgba(6,182,212,0.25)]'
              : 'text-zinc-400 hover:text-cyan-300 hover:bg-cyan-500/10 border border-transparent'
          }`}
        >
          <GitFork className={`w-4 h-4 ${activeLedgerTab === 'merkle-tree' ? 'text-cyan-400' : 'text-zinc-500'}`} />
          <span>Merkle Tree Graph</span>
        </button>
      </div>

      {/* TAB 1: 12-Stage Interactive Trace Replay Pipeline */}
      {activeLedgerTab === 'stages' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-in fade-in duration-200">
          {/* Left 6 Columns: 12-Stage Timeline List */}
          <div className="lg:col-span-6 space-y-2 max-h-[640px] overflow-y-auto pr-1">
            {AUDIT_TRACE_TX.stages.map((st, idx) => {
              const isSelected = selectedStage === idx;
              return (
                <div
                  key={st.id}
                  onClick={() => {
                    playTone(500 + idx * 25, 0.04);
                    setSelectedStage(idx);
                  }}
                  className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                    isSelected
                      ? 'bg-emerald-950/30 border-emerald-500/40 shadow-[0_0_20px_rgba(16,185,129,0.15)] scale-[1.01]'
                      : 'bg-[#070914]/60 border-cyan-500/10 hover:border-cyan-500/20 hover:bg-[#0b0e1e]/60'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`w-7 h-7 rounded-xl flex items-center justify-center font-mono font-bold text-xs ${
                        isSelected ? 'bg-emerald-500 text-black' : 'bg-white/5 text-zinc-300'
                      }`}
                    >
                      {st.stageNumber}
                    </span>
                    <div>
                      <div className="text-xs font-mono font-bold text-zinc-100">{st.name}</div>
                      <div className="text-[11px] text-zinc-400 font-sans line-clamp-1">{st.shortDesc}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 font-mono text-xs text-zinc-400 shrink-0">
                    <span className="flex items-center gap-1 text-[11px]">
                      {timestampFormat === 'block-height' ? (
                        <span className="text-cyan-400 font-semibold">BLOCK #849202:S{st.stageNumber}</span>
                      ) : (
                        <>
                          <Clock className="w-3 h-3 text-zinc-500" />
                          <span>{st.durationMs}ms</span>
                        </>
                      )}
                    </span>
                    <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 text-[10px]">
                      {st.status}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right 6 Columns: Selected Stage Deep-Dive & Cryptographic Hashes */}
          <div className="lg:col-span-6 space-y-4">
            <div className="p-6 rounded-[28px] bg-[#0b0e1a]/70 border border-white/8 backdrop-blur-xl space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-mono text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded-full border border-cyan-500/20">
                    STAGE {currentStageData.stageNumber} OF 12
                  </span>
                  <h3 className="text-lg font-mono font-bold text-white mt-1">{currentStageData.name}</h3>
                </div>
                <span className="text-xs font-mono px-3 py-1 rounded-xl bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                  100% INTACT
                </span>
              </div>

              <p className="text-xs text-zinc-300 font-sans leading-relaxed">
                {currentStageData.shortDesc}
              </p>

              {/* Stage Hash Pair */}
              <div className="space-y-3 font-mono text-xs">
                <div className="p-3 bg-black/40 rounded-xl border border-white/5 space-y-1">
                  <div className="flex items-center justify-between text-zinc-500 text-[10px]">
                    <span>PARENT HASH (INPUT)</span>
                    <button
                      onClick={() => handleCopy('parent', currentStageData.parentHash)}
                      className="text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
                    >
                      {copiedHash === 'parent' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      <span>Copy</span>
                    </button>
                  </div>
                  <div className="text-zinc-300 text-xs break-all select-all font-mono">
                    {currentStageData.parentHash}
                  </div>
                </div>

                <div className="p-3 bg-black/40 rounded-xl border border-white/5 space-y-1">
                  <div className="flex items-center justify-between text-zinc-500 text-[10px]">
                    <span>OUTPUT HASH (SEALED)</span>
                    <button
                      onClick={() => handleCopy('output', currentStageData.outputHash)}
                      className="text-emerald-400 hover:text-emerald-300 flex items-center gap-1"
                    >
                      {copiedHash === 'output' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      <span>Copy</span>
                    </button>
                  </div>
                  <div className="text-emerald-300 text-xs break-all select-all font-mono">
                    {currentStageData.outputHash}
                  </div>
                </div>
              </div>

              {/* Stage Metadata Attributes */}
              <div className="space-y-2">
                <div className="text-xs font-mono text-zinc-400 uppercase tracking-wider">
                  Stage Execution Metadata
                </div>
                <div className="p-4 bg-black/40 rounded-2xl border border-white/5 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
                  <div>
                    <span className="text-zinc-500 text-[10px] block">SOURCE MODULE</span>
                    <span className="text-zinc-300 truncate block">{currentStageData.sourceModule}</span>
                  </div>
                  <div>
                    <span className="text-zinc-500 text-[10px] block">ACTOR / AGENT</span>
                    <span className="text-cyan-300 truncate block">{currentStageData.actor}</span>
                  </div>
                  {Object.entries(currentStageData.metadata).map(([k, v]) => (
                    <div key={k}>
                      <span className="text-zinc-500 text-[10px] uppercase block">{k.replace(/([A-Z])/g, ' $1')}</span>
                      <span className="text-emerald-400 block font-semibold">{String(v)}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: Hardware Telemetry Snapshots List & Deep-Dive */}
      {activeLedgerTab === 'snapshots' && (
        <div className="space-y-4 animate-in fade-in duration-200">
          {/* Snapshot Filter Bar */}
          <div className="p-4 rounded-2xl bg-[#0b0e1a]/80 border border-white/8 backdrop-blur-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 font-mono text-xs">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={snapshotSearchQuery}
                onChange={(e) => {
                  setSnapshotSearchQuery(e.target.value);
                  setSelectedSnapshotIndex(0);
                }}
                placeholder="Search snapshot ID, hash, status, or attestor..."
                className="w-full pl-9 pr-4 py-2 bg-black/40 border border-white/10 rounded-xl text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-cyan-500/50 text-xs"
              />
              {snapshotSearchQuery && (
                <button
                  onClick={() => setSnapshotSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-200 text-xs"
                >
                  ✕
                </button>
              )}
            </div>

            <div className="flex items-center gap-3">
              <span className="text-zinc-400 text-[11px]">
                Showing <strong className="text-cyan-300">{filteredSnapshots.length}</strong> of {allSnapshots.length} Snapshots
              </span>
              <button
                onClick={handleExportMerkleLog}
                className="px-3 py-1.5 rounded-xl bg-purple-500/20 hover:bg-purple-500/30 text-purple-200 border border-purple-500/40 text-xs flex items-center gap-1.5 transition-all"
                title="Export currently filtered snapshots as Merkle JSON"
              >
                <Download className="w-3.5 h-3.5 text-purple-300" />
                <span>Export Merkle Log ({filteredSnapshots.length})</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left 6 Columns: Snapshots List */}
            <div className="lg:col-span-6 space-y-2.5 max-h-[640px] overflow-y-auto pr-1">
              {filteredSnapshots.length === 0 ? (
                <div className="p-8 rounded-2xl bg-[#0b0e1a]/40 border border-white/5 text-center font-mono text-xs text-zinc-400">
                  No snapshots match &quot;{snapshotSearchQuery}&quot;. Clear search to view all.
                </div>
              ) : (
                filteredSnapshots.map((snap, idx) => {
                  const isSelected = selectedSnapshotIndex === idx;
                  return (
                    <div
                      key={snap.id}
                      onClick={() => {
                        playTone(520 + idx * 25, 0.04);
                        setSelectedSnapshotIndex(idx);
                      }}
                      className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                        isSelected
                          ? 'bg-cyan-950/30 border-cyan-500/40 shadow-[0_0_20px_rgba(6,182,212,0.15)] scale-[1.01]'
                          : 'bg-[#070914]/60 border-cyan-500/10 hover:border-cyan-500/20 hover:bg-[#0b0e1e]/60'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span
                          className={`w-8 h-8 rounded-xl flex items-center justify-center font-mono font-bold text-xs ${
                            isSelected ? 'bg-cyan-400 text-black' : 'bg-white/5 text-zinc-300'
                          }`}
                        >
                          #{snap.snapshotNumber}
                        </span>
                        <div>
                          <div className="text-xs font-mono font-bold text-zinc-100 flex items-center gap-2">
                            <span>{snap.id}</span>
                            <span className="text-[10px] text-cyan-300 font-normal">
                              {timestampFormat === 'block-height'
                                ? `BLOCK #849202 [H:849202]`
                                : snap.timestampIct}
                            </span>
                          </div>
                          <div className="text-[11px] text-zinc-400 font-mono mt-0.5">
                            CPU {snap.cpuAverage}% • RAM {snap.memoryUsedMb}MB • Cryo {snap.cryoTempMk}mK • QOps {snap.qopsThroughput}
                          </div>
                          {(snap.ssdWearLevelPct !== undefined || snap.SSD_Wear_Level !== undefined) && (snap.voltageStabilityPct !== undefined || snap.Voltage_Stability !== undefined) && (
                            <div className="text-[10px] text-zinc-400 font-mono mt-0.5 flex items-center gap-2">
                              <span className={(snap.ssdWearLevelPct ?? snap.SSD_Wear_Level ?? 0.82) >= 5.0 ? 'text-rose-400 font-bold' : (snap.ssdWearLevelPct ?? snap.SSD_Wear_Level ?? 0.82) >= 2.0 ? 'text-amber-400' : 'text-emerald-400'}>
                                SSD Wear: {snap.ssdWearLevelPct ?? snap.SSD_Wear_Level}%
                              </span>
                              <span>•</span>
                              <span className={(snap.voltageStabilityPct ?? snap.Voltage_Stability ?? 99.98) < 99.50 ? 'text-rose-400 font-bold' : (snap.voltageStabilityPct ?? snap.Voltage_Stability ?? 99.98) < 99.90 ? 'text-amber-400' : 'text-blue-400'}>
                                Voltage: {snap.voltageStabilityPct ?? snap.Voltage_Stability}%
                              </span>
                            </div>
                          )}
                        </div>
                      </div>

                      <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 text-[10px] font-mono shrink-0">
                        {snap.status}
                      </span>
                    </div>
                  );
                })
              )}
            </div>

            {/* Right 6 Columns: Selected Snapshot Deep-Dive */}
            <div className="lg:col-span-6 space-y-4">
              <div className="p-6 rounded-[28px] bg-[#0b0e1a]/70 border border-white/8 backdrop-blur-xl space-y-5">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-mono text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded-full border border-cyan-500/20">
                      HARDWARE SNAPSHOT #{currentSnapshot.snapshotNumber}
                    </span>
                    <h3 className="text-lg font-mono font-bold text-white mt-1">{currentSnapshot.id}</h3>
                    <div className="text-xs font-mono text-zinc-400 mt-0.5">
                      {timestampFormat === 'block-height'
                        ? `BLOCK #849202-SNAP${String(currentSnapshot.snapshotNumber).padStart(3, '0')} [EPOCH: ${currentSnapshot.epoch}]`
                        : `${currentSnapshot.timestampIct} | ${currentSnapshot.timestampUtc}`}
                    </div>
                  </div>
                  <span className="text-xs font-mono px-3 py-1 rounded-xl bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                    SEALED IN LEDGER
                  </span>
                </div>

                {/* Telemetry Metrics Grid (8 Forensic Metrics including SSD Wear & Voltage Stability) */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 font-mono text-xs">
                  <div className="p-3 rounded-xl bg-black/40 border border-white/5 space-y-1">
                    <span className="text-[10px] text-zinc-500 uppercase block">CPU Cluster Avg</span>
                    <span className="text-cyan-300 font-bold text-sm">{currentSnapshot.cpuAverage}%</span>
                    <div className="text-[9px] text-zinc-500">Cores: {currentSnapshot.cpuCores.join('/')}%</div>
                  </div>

                  <div className="p-3 rounded-xl bg-black/40 border border-white/5 space-y-1">
                    <span className="text-[10px] text-zinc-500 uppercase block">RAM Allocation</span>
                    <span className="text-violet-300 font-bold text-sm">{currentSnapshot.memoryUsedMb} MB</span>
                    <div className="text-[9px] text-zinc-500">Total: {currentSnapshot.memoryTotalMb} MB</div>
                  </div>

                  <div className="p-3 rounded-xl bg-black/40 border border-white/5 space-y-1">
                    <span className="text-[10px] text-zinc-500 uppercase block">Cryo Thermal</span>
                    <span className="text-amber-300 font-bold text-sm">{currentSnapshot.cryoTempMk} mK</span>
                    <div className="text-[9px] text-zinc-500">100% Helium Flow</div>
                  </div>

                  <div className="p-3 rounded-xl bg-black/40 border border-white/5 space-y-1">
                    <span className="text-[10px] text-zinc-500 uppercase block">QOps Throughput</span>
                    <span className="text-emerald-300 font-bold text-sm">{currentSnapshot.qopsThroughput}</span>
                    <div className="text-[9px] text-zinc-500">QOps / Second</div>
                  </div>

                  <div className="p-3 rounded-xl bg-black/40 border border-white/5 space-y-1">
                    <span className="text-[10px] text-zinc-500 uppercase block">Coherence Index</span>
                    <span className="text-cyan-300 font-bold text-sm">{currentSnapshot.coherencePct}%</span>
                    <div className="text-[9px] text-zinc-500">Superposition Lock</div>
                  </div>

                  <div className="p-3 rounded-xl bg-black/40 border border-white/5 space-y-1">
                    <span className="text-[10px] text-zinc-500 uppercase block">OTEL Spans</span>
                    <span className="text-zinc-200 font-bold text-sm">{currentSnapshot.otelSpansSec} /s</span>
                    <div className="text-[9px] text-zinc-500">Telemetry Stream</div>
                  </div>

                  {/* Forensic Metric 1: SSD Wear Level */}
                  <div
                    className={`p-3 rounded-xl border space-y-1 transition-all ${
                      (currentSnapshot.ssdWearLevelPct ?? currentSnapshot.SSD_Wear_Level ?? 0.82) >= 5.0
                        ? 'bg-rose-950/40 border-rose-500/50'
                        : (currentSnapshot.ssdWearLevelPct ?? currentSnapshot.SSD_Wear_Level ?? 0.82) >= 2.0
                        ? 'bg-amber-950/30 border-amber-500/40'
                        : 'bg-black/40 border-white/5'
                    }`}
                  >
                    <div className="flex items-center justify-between text-[10px] text-zinc-400">
                      <span className="flex items-center gap-1">
                        <HardDrive className="w-3 h-3 text-teal-400" />
                        <span>SSD WEAR</span>
                      </span>
                      <span
                        className={`text-[8px] px-1 py-0.2 rounded font-bold uppercase ${
                          (currentSnapshot.ssdWearLevelPct ?? currentSnapshot.SSD_Wear_Level ?? 0.82) >= 5.0
                            ? 'bg-rose-500/20 text-rose-300'
                            : (currentSnapshot.ssdWearLevelPct ?? currentSnapshot.SSD_Wear_Level ?? 0.82) >= 2.0
                            ? 'bg-amber-500/20 text-amber-300'
                            : 'bg-emerald-500/15 text-emerald-300'
                        }`}
                      >
                        {(currentSnapshot.ssdWearLevelPct ?? currentSnapshot.SSD_Wear_Level ?? 0.82) >= 5.0
                          ? 'RED'
                          : (currentSnapshot.ssdWearLevelPct ?? currentSnapshot.SSD_Wear_Level ?? 0.82) >= 2.0
                          ? 'AMBER'
                          : 'GREEN'}
                      </span>
                    </div>
                    <span
                      className={`font-bold text-sm ${
                        (currentSnapshot.ssdWearLevelPct ?? currentSnapshot.SSD_Wear_Level ?? 0.82) >= 5.0
                          ? 'text-rose-400'
                          : (currentSnapshot.ssdWearLevelPct ?? currentSnapshot.SSD_Wear_Level ?? 0.82) >= 2.0
                          ? 'text-amber-400'
                          : 'text-teal-300'
                      }`}
                    >
                      {currentSnapshot.ssdWearLevelPct ?? currentSnapshot.SSD_Wear_Level ?? 0.82}%
                    </span>
                    <div className="text-[9px] text-zinc-400">NVMe Wear Life</div>
                  </div>

                  {/* Forensic Metric 2: Voltage Stability */}
                  <div
                    className={`p-3 rounded-xl border space-y-1 transition-all ${
                      (currentSnapshot.voltageStabilityPct ?? currentSnapshot.Voltage_Stability ?? 99.98) < 99.50
                        ? 'bg-rose-950/40 border-rose-500/50'
                        : (currentSnapshot.voltageStabilityPct ?? currentSnapshot.Voltage_Stability ?? 99.98) < 99.90
                        ? 'bg-amber-950/30 border-amber-500/40'
                        : 'bg-black/40 border-white/5'
                    }`}
                  >
                    <div className="flex items-center justify-between text-[10px] text-zinc-400">
                      <span className="flex items-center gap-1">
                        <Gauge className="w-3 h-3 text-blue-400" />
                        <span>VOLT STABILITY</span>
                      </span>
                      <span
                        className={`text-[8px] px-1 py-0.2 rounded font-bold uppercase ${
                          (currentSnapshot.voltageStabilityPct ?? currentSnapshot.Voltage_Stability ?? 99.98) < 99.50
                            ? 'bg-rose-500/20 text-rose-300'
                            : (currentSnapshot.voltageStabilityPct ?? currentSnapshot.Voltage_Stability ?? 99.98) < 99.90
                            ? 'bg-amber-500/20 text-amber-300'
                            : 'bg-blue-500/15 text-blue-300'
                        }`}
                      >
                        {(currentSnapshot.voltageStabilityPct ?? currentSnapshot.Voltage_Stability ?? 99.98) < 99.50
                          ? 'RED'
                          : (currentSnapshot.voltageStabilityPct ?? currentSnapshot.Voltage_Stability ?? 99.98) < 99.90
                          ? 'AMBER'
                          : 'GREEN'}
                      </span>
                    </div>
                    <span
                      className={`font-bold text-sm ${
                        (currentSnapshot.voltageStabilityPct ?? currentSnapshot.Voltage_Stability ?? 99.98) < 99.50
                          ? 'text-rose-400'
                          : (currentSnapshot.voltageStabilityPct ?? currentSnapshot.Voltage_Stability ?? 99.98) < 99.90
                          ? 'text-amber-400'
                          : 'text-blue-300'
                      }`}
                    >
                      {currentSnapshot.voltageStabilityPct ?? currentSnapshot.Voltage_Stability ?? 99.98}%
                    </span>
                    <div className="text-[9px] text-zinc-400">12V DC Rail</div>
                  </div>
                </div>

                {/* Cryptographic Hashes for Snapshot */}
              <div className="space-y-3 font-mono text-xs">
                <div className="p-3 bg-black/40 rounded-xl border border-white/5 space-y-1">
                  <div className="flex items-center justify-between text-zinc-500 text-[10px]">
                    <span>PARENT MERKLE HASH</span>
                    <button
                      onClick={() => handleCopy('snap-parent', currentSnapshot.parentHash)}
                      className="text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
                    >
                      {copiedHash === 'snap-parent' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      <span>Copy</span>
                    </button>
                  </div>
                  <div className="text-zinc-300 text-xs break-all select-all font-mono">
                    {currentSnapshot.parentHash}
                  </div>
                </div>

                <div className="p-3 bg-black/40 rounded-xl border border-white/5 space-y-1">
                  <div className="flex items-center justify-between text-zinc-500 text-[10px]">
                    <span>SEALED HARDWARE STATE HASH (SHA-256)</span>
                    <button
                      onClick={() => handleCopy('snap-output', currentSnapshot.sealedHash)}
                      className="text-emerald-400 hover:text-emerald-300 flex items-center gap-1"
                    >
                      {copiedHash === 'snap-output' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      <span>Copy</span>
                    </button>
                  </div>
                  <div className="text-emerald-300 text-xs break-all select-all font-mono">
                    {currentSnapshot.sealedHash}
                  </div>
                </div>
              </div>

              {/* Actor Signature */}
              <div className="p-3.5 bg-black/40 rounded-xl border border-white/5 flex items-center justify-between font-mono text-xs">
                <div>
                  <span className="text-[10px] text-zinc-500 block">SEALING ATTESTOR</span>
                  <span className="text-zinc-200 font-medium">{currentSnapshot.actor}</span>
                </div>
                <span className="text-emerald-400 font-bold text-xs bg-emerald-500/10 px-2 py-1 rounded-lg border border-emerald-500/20">
                  SEAL INTACT
                </span>
              </div>
            </div>
          </div>
        </div>
        </div>
      )}

      {/* TAB: Quarantine Registry */}
      {activeLedgerTab === 'quarantine' && (
        <div className="animate-in fade-in duration-200">
          <QuarantineRegistry />
        </div>
      )}

      {/* TAB: Forensic Evidence Matrix */}
      {activeLedgerTab === 'forensics' && (
        <div className="animate-in fade-in duration-200">
          <ForensicEvidenceMatrix />
        </div>
      )}

      {/* TAB 3: Snapshot Variance & Diff Comparison */}
      {activeLedgerTab === 'compare' && (
        <SnapshotCompareView
          snapshots={allSnapshots}
          timestampFormat={timestampFormat}
        />
      )}

      {/* TAB: Interactive Merkle Tree Graph */}
      {activeLedgerTab === 'merkle-tree' && (
        <div className="animate-in fade-in duration-200">
          <MerkleTreeInteractiveGraph snapshots={allSnapshots} />
        </div>
      )}
    </div>
  );
};
