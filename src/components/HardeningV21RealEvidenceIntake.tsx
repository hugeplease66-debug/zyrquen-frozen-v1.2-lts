import React, { useState } from 'react';
import {
  FileText,
  Shield,
  ShieldAlert,
  ShieldCheck,
  Lock,
  Database,
  Building2,
  Cpu,
  HardDrive,
  TrendingUp,
  AlertTriangle,
  Clock,
  Layers,
  Key,
  FileCode,
  CheckCircle2,
  XCircle,
  Copy,
  Check,
  Download,
  Terminal,
  Activity,
} from 'lucide-react';
import { playTone, playAuditChime } from './AudioSynthesizer';
import { copyToClipboard } from '../utils/clipboard';

export type ProvenanceBadgeType =
  | 'CANONICAL'
  | 'SOURCE_FILE'
  | 'REFERENCE'
  | 'OBSERVED'
  | 'PENDING_VERIFICATION'
  | 'VERIFIED'
  | 'MISMATCH'
  | 'BLOCKED'
  | 'SIMULATED';

export interface AuditEventEntry {
  timestamp: string;
  evidenceId: string;
  source: string;
  operation: 'EVIDENCE_IMPORTED' | 'EVIDENCE_CLASSIFIED' | 'EVIDENCE_BOUND' | 'EVIDENCE_RECONCILED' | 'EVIDENCE_QUARANTINED';
  result: string;
  provenance: ProvenanceBadgeType;
  mutation: 0;
}

export const HARDENING_V21_AUDIT_TRAIL: AuditEventEntry[] = [
  {
    timestamp: '2026-08-22T02:31:26.001Z',
    evidenceId: 'TNT-TH-001',
    source: 'tenant_audit_manifest_TNT-TH-001.json',
    operation: 'EVIDENCE_IMPORTED',
    result: 'INTAKE_REGISTERED (READ_ONLY)',
    provenance: 'SOURCE_FILE',
    mutation: 0,
  },
  {
    timestamp: '2026-08-22T02:31:26.005Z',
    evidenceId: 'TNT-TH-001',
    source: 'tenant_audit_manifest_TNT-TH-001.json',
    operation: 'EVIDENCE_CLASSIFIED',
    result: 'PROVENANCE_ASSIGNED: SOURCE_FILE / PENDING_VERIFICATION',
    provenance: 'PENDING_VERIFICATION',
    mutation: 0,
  },
  {
    timestamp: '2026-08-22T02:31:26.009Z',
    evidenceId: 'TNT-TH-001',
    source: 'tenant_audit_manifest_TNT-TH-001.json',
    operation: 'EVIDENCE_BOUND',
    result: 'BINDING_RECORD_INITIALIZED (NO_CANONICAL_WRITE)',
    provenance: 'SOURCE_FILE',
    mutation: 0,
  },
  {
    timestamp: '2026-08-22T02:31:26.012Z',
    evidenceId: 'TNT-TH-001',
    source: 'tenant_audit_manifest_TNT-TH-001.json',
    operation: 'EVIDENCE_RECONCILED',
    result: 'RECONCILIATION_EVAL: NOT_APPLICABLE (TENANT_NAMESPACE_ISOLATED)',
    provenance: 'SOURCE_FILE',
    mutation: 0,
  },
  {
    timestamp: '2026-08-22T02:31:26.020Z',
    evidenceId: 'DS-901-PILOT',
    source: 'maew_fios_pilot_dataset.json',
    operation: 'EVIDENCE_IMPORTED',
    result: 'INTAKE_REGISTERED (NON_LIVE_PILOT)',
    provenance: 'SOURCE_FILE',
    mutation: 0,
  },
  {
    timestamp: '2026-08-22T02:31:26.025Z',
    evidenceId: 'DS-901-PILOT',
    source: 'maew_fios_pilot_dataset.json',
    operation: 'EVIDENCE_CLASSIFIED',
    result: 'PROVENANCE_ASSIGNED: SOURCE_FILE / PENDING_VERIFICATION / NON_LIVE',
    provenance: 'PENDING_VERIFICATION',
    mutation: 0,
  },
  {
    timestamp: '2026-08-22T02:31:26.030Z',
    evidenceId: 'DS-901-PILOT',
    source: 'maew_fios_pilot_dataset.json',
    operation: 'EVIDENCE_BOUND',
    result: 'BINDING_RECORD_INITIALIZED (READ_ONLY_PILOT)',
    provenance: 'SOURCE_FILE',
    mutation: 0,
  },
  {
    timestamp: '2026-08-22T02:31:26.035Z',
    evidenceId: 'DS-901-PILOT',
    source: 'maew_fios_pilot_dataset.json',
    operation: 'EVIDENCE_RECONCILED',
    result: 'RECONCILIATION_EVAL: NOT_APPLICABLE (EXTERNAL_FINANCIAL_DATASET)',
    provenance: 'SOURCE_FILE',
    mutation: 0,
  },
];

export const HardeningV21RealEvidenceIntake: React.FC = () => {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [selectedAuditFilter, setSelectedAuditFilter] = useState<string>('ALL');

  const handleCopy = (text: string, id: string) => {
    copyToClipboard(text);
    setCopiedKey(id);
    playTone(700, 0.03);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleExportEvidenceLedger = () => {
    playTone(600, 0.04);
    const payload = {
      layer: 'ZYRQUEN_OMEGA_INFINITY_HARDENING_V2_1',
      contract: 'REAL_EVIDENCE_INTAKE_AND_PROVENANCE_BINDING',
      timestamp: new Date().toISOString(),
      frozenCore: {
        merkleRoot: '909ab814479844d8a14816bed34cdbb07528e18501da86fc4691763a43fa4c68',
        blockHeight: '#849202',
        canonicalSeals: 14902,
        ssotMutation: 0,
        promotionStatus: 'FAIL-CLOSED',
      },
      evidenceIntakes: [
        {
          evidenceId: 'TNT-TH-001',
          sourceFilename: 'tenant_audit_manifest_TNT-TH-001.json',
          sourceType: 'TENANT_AUDIT_MANIFEST',
          provenance: 'SOURCE_FILE',
          verification: 'PENDING_VERIFICATION',
          mutationAuthority: 'NONE',
          sourceReported: {
            organization: 'MAEW HOLDINGS CO., LTD. (Sovereign HQ)',
            isolationMode: 'Sovereign Physical Hardware Isolation',
            activeReleaseVersion: 'v2.8.0-GA-SEAL',
            encryptionKeyFingerprint: '0xTH-990A-F11E-8C2A-4F11',
            cryptographicProof: 'sha256_tenant_audit_tnt_th_001_sealed',
            timestamp: '2026-08-01T14:58:13.449Z',
            quotaStatus: {
              cpuPercent: 32,
              storageGb: 480,
              maxStorageGb: 2000,
              monthlyRequestsMillions: 142.8,
            },
          },
          binding: {
            artifactDigest: 'NOT COMPUTED',
            merkleAnchor: 'CANONICAL_P0_ANCHOR_REQUIRED',
            blockBinding: 'PENDING',
            verificationStatus: 'PENDING',
            provenanceStatus: 'SOURCE_FILE / PENDING_VERIFICATION',
          },
          tenantIsolation: {
            tenantId: 'TNT-TH-001',
            crossTenantPromotion: 'BLOCKED',
            crossTenantInheritance: 'BLOCKED',
            canonicalWrite: 'BLOCKED',
          },
        },
        {
          evidenceId: 'DS-901-PILOT',
          sourceFilename: 'maew_fios_pilot_dataset.json',
          sourceType: 'FIOS_PILOT_DATASET',
          provenance: 'SOURCE_FILE',
          verification: 'PENDING_VERIFICATION',
          mutationAuthority: 'NONE',
          sourceReported: {
            manifesto: 'MAEW Ω∞ FIOS ULTIMATE v2.1 LTS',
            datasetId: 'DS-901-PILOT',
            governingBody: 'Maew & Partners Fiduciary Control',
            assetClass: 'Sovereign Managed Securities & Equities',
            metrics: [
              { factor: 'Quality', weight: 0.35, alpha: 2.15, zScore: 2.31 },
              { factor: 'Value', weight: 0.2, alpha: 1.84, zScore: 1.45 },
              { factor: 'Momentum', weight: 0.25, alpha: 2.76, zScore: 2.85 },
              { factor: 'Volatility', weight: 0.2, alpha: -0.42, zScore: -0.92 },
            ],
            backtestPerformance: {
              trailing30DaysReturnPct: 12.42,
              annualizedSharpeRatio: 2.41,
              maxDrawdownPct: -4.18,
              uptimeSlaCompliancePct: 99.98,
            },
          },
          binding: {
            artifactDigest: 'NOT COMPUTED',
            merkleAnchor: 'CANONICAL_P0_ANCHOR_REQUIRED',
            blockBinding: 'PENDING',
            verificationStatus: 'PENDING',
            provenanceStatus: 'SOURCE_FILE / PENDING_VERIFICATION',
          },
          safetyBoundary: {
            classification: 'PILOT_DATASET / NON_LIVE / NON_CANONICAL / PENDING_VERIFICATION',
            livePerformanceClaim: 'DISALLOWED',
            investmentDecisionAuthority: 'NONE',
          },
        },
      ],
      auditTrail: HARDENING_V21_AUDIT_TRAIL,
    };

    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ZYRQUEN_HARDENING_V2_1_EVIDENCE_LEDGER_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    playAuditChime();
  };

  const filteredTrail =
    selectedAuditFilter === 'ALL'
      ? HARDENING_V21_AUDIT_TRAIL
      : HARDENING_V21_AUDIT_TRAIL.filter((e) => e.evidenceId === selectedAuditFilter);

  return (
    <div id="hardening-v21-real-evidence-intake" className="space-y-6 font-mono">
      {/* Top Banner: Hardening v2.1 Real Evidence Intake & Provenance Binding */}
      <div className="p-6 rounded-[28px] bg-gradient-to-r from-[#0b1329]/95 via-[#0c1630]/90 to-[#070b14] border-2 border-indigo-500/40 shadow-2xl backdrop-blur-2xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-indigo-500/20 pb-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 border border-indigo-400 text-indigo-300 flex items-center justify-center shrink-0 shadow-[0_0_20px_rgba(99,102,241,0.3)]">
              <FileCode className="w-6 h-6" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2.5">
                <h2 className="text-base sm:text-lg font-bold text-indigo-100 font-serif">
                  ZYRQUEN Ω∞ — HARDENING v2.1
                </h2>
                <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-400/40 font-bold">
                  REAL EVIDENCE INTAKE &amp; PROVENANCE BINDING
                </span>
                <span className="text-[10px] px-2.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold">
                  SSOT MUTATION = 0
                </span>
              </div>
              <p className="text-xs text-zinc-400 font-serif mt-1">
                Control-Plane Hardening Layer &bull; Read-Only External Evidence Gate &bull; No Canonical Mutation Authority
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 self-end lg:self-center">
            <button
              onClick={handleExportEvidenceLedger}
              className="px-4 py-2 rounded-xl bg-indigo-500/20 hover:bg-indigo-500/30 border border-indigo-400/50 text-indigo-200 text-xs font-bold flex items-center gap-2 transition-all shadow-[0_0_15px_rgba(99,102,241,0.25)]"
            >
              <Download className="w-3.5 h-3.5" />
              <span>EXPORT INTAKE LEDGER (JSON)</span>
            </button>
          </div>
        </div>

        {/* 4-State Provenance & Canonical Invariance Bar */}
        <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="p-3 rounded-xl bg-black/60 border border-emerald-500/30 space-y-1">
            <div className="text-[10px] text-zinc-400 flex items-center justify-between">
              <span>CANONICAL CORE</span>
              <Lock className="w-3 h-3 text-emerald-400" />
            </div>
            <div className="font-mono text-emerald-400 text-sm font-bold">14,902 SEALS</div>
            <div className="text-[9px] text-zinc-400">Root: 909ab814...fa4c68</div>
          </div>

          <div className="p-3 rounded-xl bg-black/60 border border-indigo-500/30 space-y-1">
            <div className="text-[10px] text-zinc-400 flex items-center justify-between">
              <span>INTAKE ARTIFACTS</span>
              <Layers className="w-3 h-3 text-indigo-400" />
            </div>
            <div className="font-mono text-indigo-300 text-sm font-bold">2 FILES REGISTERED</div>
            <div className="text-[9px] text-indigo-400">TNT-TH-001 &bull; DS-901-PILOT</div>
          </div>

          <div className="p-3 rounded-xl bg-black/60 border border-amber-500/30 space-y-1">
            <div className="text-[10px] text-zinc-400 flex items-center justify-between">
              <span>INTAKE VERIFICATION</span>
              <Clock className="w-3 h-3 text-amber-400" />
            </div>
            <div className="font-mono text-amber-400 text-sm font-bold">PENDING VERIFICATION</div>
            <div className="text-[9px] text-zinc-400">External Evidence Input Only</div>
          </div>

          <div className="p-3 rounded-xl bg-black/60 border border-rose-500/30 space-y-1">
            <div className="text-[10px] text-zinc-400 flex items-center justify-between">
              <span>CANONICAL PROMOTION</span>
              <ShieldAlert className="w-3 h-3 text-rose-400" />
            </div>
            <div className="font-mono text-rose-400 text-sm font-bold">FAIL-CLOSED</div>
            <div className="text-[9px] text-rose-400 font-bold">No Canonical Write Permitted</div>
          </div>
        </div>
      </div>

      {/* Provenance Badge Taxonomy Matrix */}
      <div className="p-4 rounded-2xl bg-[#080d1a] border border-white/10 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-zinc-300 uppercase tracking-wider flex items-center gap-2">
            <Shield className="w-3.5 h-3.5 text-indigo-400" />
            Provenance Classification System &bull; Active Taxonomy
          </span>
          <span className="text-[10px] text-zinc-500">Hardening v2.1 Boundary Enforced</span>
        </div>
        <div className="flex flex-wrap gap-2 text-[10px]">
          <span className="px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold">
            CANONICAL (SSoT Core)
          </span>
          <span className="px-2.5 py-1 rounded-lg bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 font-bold">
            REAL SOURCE FILE (Supplied Artifact)
          </span>
          <span className="px-2.5 py-1 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold">
            PENDING VERIFICATION (Awaiting Node)
          </span>
          <span className="px-2.5 py-1 rounded-lg bg-purple-500/20 text-purple-300 border border-purple-500/40 font-bold">
            REFERENCE (Standard / RFC)
          </span>
          <span className="px-2.5 py-1 rounded-lg bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-bold">
            OBSERVED (Runtime Probe)
          </span>
          <span className="px-2.5 py-1 rounded-lg bg-rose-500/20 text-rose-300 border border-rose-500/40 font-bold">
            MISMATCH (Quarantined)
          </span>
          <span className="px-2.5 py-1 rounded-lg bg-red-900/40 text-red-300 border border-red-500/40 font-bold">
            BLOCKED (Write Firewall)
          </span>
        </div>
      </div>

      {/* Dual Real Evidence Artifact Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Artifact 1: TNT-TH-001 Tenant Audit Manifest */}
        <div className="p-6 rounded-[28px] bg-[#090d18] border-2 border-indigo-500/40 space-y-4 shadow-xl flex flex-col justify-between">
          <div className="space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-indigo-500/20 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-indigo-500/20 border border-indigo-400 text-indigo-300 flex items-center justify-center">
                  <Building2 className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-indigo-100 font-serif">
                      TNT-TH-001
                    </h3>
                    <span className="text-[9px] px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-400/40 font-bold">
                      SOURCE_FILE
                    </span>
                  </div>
                  <div className="text-[10px] text-zinc-400">tenant_audit_manifest_TNT-TH-001.json</div>
                </div>
              </div>

              <span className="text-[9px] px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold">
                PENDING VERIFICATION
              </span>
            </div>

            {/* Source-Reported Evidence Fields (Explicitly labeled as source-provided) */}
            <div className="space-y-2.5 text-xs font-mono">
              <div className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">
                Source-Provided Manifest Data (Read-Only):
              </div>

              <div className="p-3 rounded-xl bg-black/70 border border-white/5 space-y-2">
                <div className="flex justify-between items-center text-[11px]">
                  <span className="text-zinc-400">Organization:</span>
                  <span className="text-zinc-100 font-bold">MAEW HOLDINGS CO., LTD. (Sovereign HQ)</span>
                </div>
                <div className="flex justify-between items-center text-[11px]">
                  <span className="text-zinc-400">Isolation Mode:</span>
                  <span className="text-cyan-300 font-bold">Sovereign Physical Hardware Isolation</span>
                </div>
                <div className="flex justify-between items-center text-[11px]">
                  <span className="text-zinc-400">Active Release:</span>
                  <span className="text-emerald-300 font-bold">v2.8.0-GA-SEAL</span>
                </div>
                <div className="flex justify-between items-center text-[11px]">
                  <span className="text-zinc-400">Timestamp:</span>
                  <span className="text-zinc-300">2026-08-01T14:58:13.449Z</span>
                </div>
              </div>

              {/* Security & Quota Metrics */}
              <div className="grid grid-cols-2 gap-2 text-[10px]">
                <div className="p-2.5 rounded-xl bg-black/60 border border-white/5 space-y-1">
                  <div className="text-zinc-500">KEY FINGERPRINT (SOURCE):</div>
                  <div className="text-indigo-300 font-mono font-bold truncate">0xTH-990A-F11E-8C2A-4F11</div>
                </div>
                <div className="p-2.5 rounded-xl bg-black/60 border border-white/5 space-y-1">
                  <div className="text-zinc-500">CRYPTOGRAPHIC PROOF (SOURCE):</div>
                  <div className="text-amber-300 font-mono font-bold truncate">sha256_tenant_audit_tnt_th_001_sealed</div>
                </div>
              </div>

              {/* Quota Telemetry (Source-Reported) */}
              <div className="p-2.5 rounded-xl bg-black/60 border border-white/5 space-y-1.5 text-[10px]">
                <div className="text-zinc-500 flex justify-between">
                  <span>REPORTED QUOTA STATUS:</span>
                  <span className="text-zinc-400">CPU 32% &bull; 480/2000 GB &bull; 142.8M Req/mo</span>
                </div>
                <div className="w-full bg-zinc-800 rounded-full h-1 overflow-hidden">
                  <div className="bg-indigo-400 h-full rounded-full" style={{ width: '24%' }} />
                </div>
              </div>

              {/* Cryptographic Binding Record */}
              <div className="p-3 rounded-xl bg-indigo-950/30 border border-indigo-500/30 space-y-1.5 text-[10px]">
                <div className="font-bold text-indigo-300 flex items-center justify-between">
                  <span>CRYPTOGRAPHIC BINDING RECORD</span>
                  <span className="text-[9px] text-amber-300">STATUS: PENDING</span>
                </div>
                <div className="grid grid-cols-2 gap-1 text-zinc-400">
                  <div>Artifact Digest: <strong className="text-zinc-300 font-mono">NOT COMPUTED</strong></div>
                  <div>Merkle Anchor: <strong className="text-zinc-300 font-mono">CANONICAL_P0_ANCHOR_REQUIRED</strong></div>
                  <div>Block Binding: <strong className="text-zinc-300 font-mono">PENDING</strong></div>
                  <div>Mutation Authority: <strong className="text-emerald-400 font-mono">NONE (0 MUTATIONS)</strong></div>
                </div>
              </div>
            </div>
          </div>

          {/* Tenant Isolation Policy Box */}
          <div className="mt-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-[10px] text-rose-200 space-y-1">
            <div className="font-bold text-rose-300 flex items-center gap-1.5">
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>TENANT ISOLATION BOUNDARY: ENFORCED</span>
            </div>
            <p className="text-zinc-400 text-[9px] leading-relaxed">
              `TNT-TH-001` is strictly isolated to its tenant evidence namespace. No cross-tenant promotion, no cross-tenant evidence inheritance, and no authority to write into the global Canonical Core.
            </p>
          </div>
        </div>

        {/* Artifact 2: DS-901-PILOT FIOS Pilot Dataset */}
        <div className="p-6 rounded-[28px] bg-[#090d18] border-2 border-cyan-500/40 space-y-4 shadow-xl flex flex-col justify-between">
          <div className="space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-cyan-500/20 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-cyan-500/20 border border-cyan-400 text-cyan-300 flex items-center justify-center">
                  <TrendingUp className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-cyan-100 font-serif">
                      DS-901-PILOT
                    </h3>
                    <span className="text-[9px] px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 font-bold">
                      SOURCE_FILE
                    </span>
                  </div>
                  <div className="text-[10px] text-zinc-400">maew_fios_pilot_dataset.json</div>
                </div>
              </div>

              <span className="text-[9px] px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold">
                PENDING VERIFICATION
              </span>
            </div>

            {/* Source-Reported Evidence Fields */}
            <div className="space-y-2.5 text-xs font-mono">
              <div className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">
                Source-Provided Dataset Metrics (Read-Only):
              </div>

              <div className="p-3 rounded-xl bg-black/70 border border-white/5 space-y-2">
                <div className="flex justify-between items-center text-[11px]">
                  <span className="text-zinc-400">Manifesto:</span>
                  <span className="text-zinc-100 font-bold">MAEW Ω∞ FIOS ULTIMATE v2.1 LTS</span>
                </div>
                <div className="flex justify-between items-center text-[11px]">
                  <span className="text-zinc-400">Governing Body:</span>
                  <span className="text-cyan-300 font-bold">Maew &amp; Partners Fiduciary Control</span>
                </div>
                <div className="flex justify-between items-center text-[11px]">
                  <span className="text-zinc-400">Asset Class:</span>
                  <span className="text-emerald-300 font-bold">Sovereign Managed Securities &amp; Equities</span>
                </div>
                <div className="flex justify-between items-center text-[11px]">
                  <span className="text-zinc-400">Timestamp:</span>
                  <span className="text-zinc-300">2026-08-03T04:31:50.500Z</span>
                </div>
              </div>

              {/* 4 Factor Quantitative Breakdown (Source Data) */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[10px]">
                <div className="p-2 rounded-lg bg-black/60 border border-white/5 text-center">
                  <div className="text-zinc-500 font-bold">QUALITY (35%)</div>
                  <div className="text-emerald-400 font-bold font-mono">+2.15 &alpha;</div>
                  <div className="text-[9px] text-purple-300">z: +2.31</div>
                </div>
                <div className="p-2 rounded-lg bg-black/60 border border-white/5 text-center">
                  <div className="text-zinc-500 font-bold">VALUE (20%)</div>
                  <div className="text-emerald-400 font-bold font-mono">+1.84 &alpha;</div>
                  <div className="text-[9px] text-purple-300">z: +1.45</div>
                </div>
                <div className="p-2 rounded-lg bg-black/60 border border-white/5 text-center">
                  <div className="text-zinc-500 font-bold">MOMENTUM (25%)</div>
                  <div className="text-emerald-400 font-bold font-mono">+2.76 &alpha;</div>
                  <div className="text-[9px] text-purple-300">z: +2.85</div>
                </div>
                <div className="p-2 rounded-lg bg-black/60 border border-white/5 text-center">
                  <div className="text-zinc-500 font-bold">VOLATILITY (20%)</div>
                  <div className="text-amber-400 font-bold font-mono">-0.42 &alpha;</div>
                  <div className="text-[9px] text-zinc-400">z: -0.92</div>
                </div>
              </div>

              {/* Backtest Performance Indicators (Explicitly non-live) */}
              <div className="p-2.5 rounded-xl bg-black/60 border border-white/5 space-y-1 text-[10px]">
                <div className="text-zinc-400 flex justify-between font-bold">
                  <span>BACKTEST REPORTED (NON-LIVE PILOT):</span>
                  <span className="text-cyan-300">30D: +12.42% &bull; Sharpe: 2.41 &bull; MaxDD: -4.18%</span>
                </div>
              </div>

              {/* Cryptographic Binding Record */}
              <div className="p-3 rounded-xl bg-cyan-950/30 border border-cyan-500/30 space-y-1.5 text-[10px]">
                <div className="font-bold text-cyan-300 flex items-center justify-between">
                  <span>CRYPTOGRAPHIC BINDING RECORD</span>
                  <span className="text-[9px] text-amber-300">STATUS: PENDING</span>
                </div>
                <div className="grid grid-cols-2 gap-1 text-zinc-400">
                  <div>Artifact Digest: <strong className="text-zinc-300 font-mono">NOT COMPUTED</strong></div>
                  <div>Merkle Anchor: <strong className="text-zinc-300 font-mono">CANONICAL_P0_ANCHOR_REQUIRED</strong></div>
                  <div>Block Binding: <strong className="text-zinc-300 font-mono">PENDING</strong></div>
                  <div>Mutation Authority: <strong className="text-emerald-400 font-mono">NONE (0 MUTATIONS)</strong></div>
                </div>
              </div>
            </div>
          </div>

          {/* Financial Safety Boundary Box */}
          <div className="mt-4 p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-[10px] text-amber-200 space-y-1">
            <div className="font-bold text-amber-300 flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>FINANCIAL DATASET SAFETY BOUNDARY: ENFORCED</span>
            </div>
            <p className="text-zinc-400 text-[9px] leading-relaxed">
              Treated strictly as a <strong>NON-LIVE PILOT DATASET</strong>. Not represented as live performance, guaranteed return, or production investment execution. Investment decision authority = <strong>NONE</strong>.
            </p>
          </div>
        </div>
      </div>

      {/* Control-Plane Append-Only Audit Trail */}
      <div className="p-6 rounded-[28px] bg-[#090d18] border border-white/10 space-y-4 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-3">
          <div className="flex items-center gap-2">
            <Terminal className="w-4 h-4 text-indigo-400" />
            <h3 className="text-sm font-bold text-zinc-100 font-serif">
              CONTROL-PLANE APPEND-ONLY EVIDENCE AUDIT TRAIL
            </h3>
          </div>

          {/* Filter tabs */}
          <div className="flex items-center gap-1.5 text-xs">
            {['ALL', 'TNT-TH-001', 'DS-901-PILOT'].map((f) => (
              <button
                key={f}
                onClick={() => {
                  setSelectedAuditFilter(f);
                  playTone(600, 0.02);
                }}
                className={`px-3 py-1 rounded-lg text-[10px] font-bold transition-all ${
                  selectedAuditFilter === f
                    ? 'bg-indigo-500/30 text-indigo-200 border border-indigo-400/50'
                    : 'bg-black/40 text-zinc-400 border border-white/5 hover:border-white/20'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* Audit Log Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-white/10 text-[10px] text-zinc-500">
                <th className="pb-2">TIMESTAMP (UTC)</th>
                <th className="pb-2">EVIDENCE ID</th>
                <th className="pb-2">OPERATION</th>
                <th className="pb-2">PROVENANCE</th>
                <th className="pb-2">RESULT &amp; STATUS</th>
                <th className="pb-2 text-right">MUTATION</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredTrail.map((ev, idx) => (
                <tr key={idx} className="hover:bg-white/[0.02] transition-colors">
                  <td className="py-2.5 text-zinc-400 text-[10px]">{ev.timestamp}</td>
                  <td className="py-2.5 font-bold text-indigo-300 text-[11px]">{ev.evidenceId}</td>
                  <td className="py-2.5 text-amber-300 text-[10px]">{ev.operation}</td>
                  <td className="py-2.5">
                    <span className="px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-[9px] font-bold">
                      {ev.provenance}
                    </span>
                  </td>
                  <td className="py-2.5 text-zinc-300 text-[10px] truncate max-w-xs">{ev.result}</td>
                  <td className="py-2.5 text-right font-bold text-emerald-400 text-[10px]">
                    {ev.mutation}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="p-3 rounded-xl bg-black/60 border border-white/5 flex items-center justify-between text-[10px] text-zinc-400">
          <span>Total Logged Events: <strong>{filteredTrail.length}</strong></span>
          <span className="text-emerald-400 font-bold">Invariant: SSOT_MUTATION_DELTA = 0 (INVIOLABLE)</span>
        </div>
      </div>
    </div>
  );
};
