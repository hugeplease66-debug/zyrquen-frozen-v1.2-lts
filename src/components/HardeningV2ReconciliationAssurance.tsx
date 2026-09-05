import React, { useState } from 'react';
import {
  ShieldCheck,
  AlertOctagon,
  Lock,
  RefreshCw,
  Layers,
  CheckCircle2,
  XCircle,
  FileCode,
  Radio,
  FileCheck,
  Download,
  Activity,
  KeyRound,
  AlertTriangle,
  Flame,
  Binary,
  Check,
  Copy,
} from 'lucide-react';
import { playAuditChime, playTone } from './AudioSynthesizer';
import { copyToClipboard } from '../utils/clipboard';

export const HardeningV2ReconciliationAssurance: React.FC = () => {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [isExportingAudit, setIsExportingAudit] = useState(false);

  const handleCopy = (text: string, id: string) => {
    copyToClipboard(text);
    setCopiedKey(id);
    playTone(720, 0.03);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleExportReconciliationEvent = () => {
    setIsExportingAudit(true);
    playTone(620, 0.04);
    setTimeout(() => {
      const auditEvent = {
        event: 'RECONCILIATION_FINDING',
        contract: 'HARDENING_V2_RECONCILIATION_ASSURANCE',
        timestampIct: '2026-08-22 02:25:00 ICT',
        frozenBaseline: {
          merkleRoot: '909ab814479844d8a14816bed34cdbb07528e18501da86fc4691763a43fa4c68',
          blockHeight: '#849202',
          canonicalSeals: 14902,
          ssotMutation: 0,
          status: 'IMMUTABLE_READ_ONLY',
        },
        reconciliationEvaluation: {
          merkleMatch: true,
          blockMatch: true,
          canonicalSeals: 14902,
          observedSeals: 14907,
          delta: '+5',
          sealMatch: false,
          result: 'FAIL_CLOSED',
          quarantineState: 'ACTIVE',
          autoReconcile: 'BLOCKED',
          autoReseal: 'BLOCKED',
        },
        chainOfCustody: {
          sourceIdentity: 'EPHEMERAL_OBSERVED_STREAM',
          timestamp: '2026-08-22 02:25:00 ICT',
          artifactDigest: 'SHA256:7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069',
          merkleAnchor: '909ab814...43fa4c68',
          blockBinding: '#849202',
          evidenceDigest: 'UNBOUND_ORPHAN_EMISSIONS',
          provenance: 'QUARANTINED',
          status: 'BLOCKED',
        },
        deterministicReplay: {
          inputEvidence: 'SET_CANONICAL_P0_849202',
          replayEngine: 'DETERMINISTIC_EVM_WASM_P0',
          outputDigest: 'MATCH_CANONICAL',
          observedOutputDigest: 'MISMATCH_OBSERVED_STREAM',
          status: 'FAIL_CLOSED',
        },
        promotionFirewall: {
          canonicalReconciliation: 'FAIL (DRIFT +5)',
          artifactIntegrityLocal: 'VERIFIED',
          artifactIntegrityDeployed: 'PENDING',
          independentRuntimeEvidence: 'NOT_EXECUTED',
          requiredCustodianSignatures: '4/10 (HELD)',
          governanceApproval: '10/10_INVARIANTS_PASSED',
          canonicalPromotion: 'BLOCKED',
        },
      };

      const blob = new Blob([JSON.stringify(auditEvent, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `RECONCILIATION_FINDING_V2_${Date.now()}.json`;
      a.click();
      URL.revokeObjectURL(url);
      setIsExportingAudit(false);
      playAuditChime();
    }, 400);
  };

  return (
    <div id="hardening-v2-reconciliation-assurance" className="space-y-6 font-mono">
      {/* Top Banner: Hardening v2 Status */}
      <div className="p-6 rounded-[28px] bg-gradient-to-r from-[#140808]/95 via-[#0d0a15]/90 to-[#070b12] border-2 border-red-500/50 shadow-2xl backdrop-blur-2xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-red-500/20 pb-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-red-500/20 border border-red-400 text-red-300 flex items-center justify-center shrink-0 shadow-[0_0_20px_rgba(239,68,68,0.3)]">
              <Lock className="w-6 h-6" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2.5">
                <h2 className="text-base sm:text-lg font-bold text-red-100 font-serif">
                  ZYRQUEN Ω∞ &mdash; HARDENING v2: RECONCILIATION &amp; EVIDENCE ASSURANCE
                </h2>
                <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-red-500/30 text-red-200 border border-red-500/60 font-bold">
                  PROMOTION: FAIL-CLOSED
                </span>
                <span className="text-[10px] px-2.5 py-0.5 rounded bg-zinc-900 text-emerald-300 border border-emerald-500/40 font-bold">
                  SSOT MUTATION = 0
                </span>
              </div>
              <p className="text-xs text-zinc-400 font-serif mt-1">
                14,902 = Canonical SSoT &bull; 14,907 = Observed Mismatch &bull; +5 Finding = Quarantined &bull; Auto-Reseal = Blocked
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 self-end lg:self-center">
            <button
              onClick={handleExportReconciliationEvent}
              disabled={isExportingAudit}
              className="px-4 py-2 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-400/50 text-cyan-200 text-xs font-bold flex items-center gap-2 transition-all shadow-[0_0_15px_rgba(6,182,212,0.25)]"
            >
              <FileCheck className="w-3.5 h-3.5" />
              <span>{isExportingAudit ? 'EXPORTING AUDIT...' : 'EXPORT AUDIT EVENT v2'}</span>
            </button>
          </div>
        </div>

        {/* Core SSoT vs Observed Header Tuple */}
        <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="p-3 rounded-xl bg-black/60 border border-white/5 space-y-1">
            <div className="text-[10px] text-zinc-500 font-bold">CANONICAL MERKLE ROOT</div>
            <div className="font-mono text-cyan-300 text-[11px] truncate">909ab814...43fa4c68</div>
            <div className="text-[9px] text-emerald-400 font-bold">MATCH (FROZEN)</div>
          </div>
          <div className="p-3 rounded-xl bg-black/60 border border-white/5 space-y-1">
            <div className="text-[10px] text-zinc-500 font-bold">FROZEN BLOCK HEIGHT</div>
            <div className="font-mono text-purple-300 text-sm font-bold">#849,202</div>
            <div className="text-[9px] text-emerald-400 font-bold">MATCH (LOCKED)</div>
          </div>
          <div className="p-3 rounded-xl bg-black/60 border border-white/5 space-y-1">
            <div className="text-[10px] text-zinc-500 font-bold">CANONICAL SEALS (SSoT)</div>
            <div className="font-mono text-amber-300 text-sm font-bold">14,902 SEALS</div>
            <div className="text-[9px] text-emerald-400 font-bold">IMMUTABLE / SSoT</div>
          </div>
          <div className="p-3 rounded-xl bg-black/60 border border-red-500/40 space-y-1 bg-red-950/20">
            <div className="text-[10px] text-zinc-400 font-bold">OBSERVED FINDING</div>
            <div className="font-mono text-red-400 text-sm font-bold">14,907 (+5 DELTA)</div>
            <div className="text-[9px] text-red-300 font-bold">QUARANTINED / MISMATCH</div>
          </div>
        </div>
      </div>

      {/* 8. Control-Plane Status Panel (Table representation) */}
      <div className="p-6 rounded-[28px] bg-[#080b14] border border-cyan-500/40 space-y-4 shadow-xl">
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <div className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-cyan-400" />
            <h3 className="text-sm sm:text-base font-bold text-cyan-100 font-serif">
              8. CONTROL-PLANE STATUS PANEL (HARDENING v2 CONTRACT)
            </h3>
          </div>
          <span className="text-[10px] px-2.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/40">
            SSOT MUTATION: 0
          </span>
        </div>

        {/* 13-Point Formal Control Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-white/10 text-zinc-400 text-[11px]">
                <th className="py-2.5 px-3">Control Gate</th>
                <th className="py-2.5 px-3">Target Value</th>
                <th className="py-2.5 px-3">Observed State</th>
                <th className="py-2.5 px-3">Provenance / Assurance Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-zinc-300">
              <tr>
                <td className="py-2.5 px-3 font-bold text-zinc-200">FROZEN CORE</td>
                <td className="py-2.5 px-3 text-cyan-300">v1.2 LTS (P0)</td>
                <td className="py-2.5 px-3 text-zinc-400">Byte-for-Byte Unchanged</td>
                <td className="py-2.5 px-3 text-emerald-400 font-bold">🔒 IMMUTABLE</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 font-bold text-zinc-200">MERKLE ROOT</td>
                <td className="py-2.5 px-3 text-cyan-300 font-mono text-[11px]">909ab814...43fa4c68</td>
                <td className="py-2.5 px-3 text-cyan-300 font-mono text-[11px]">909ab814...43fa4c68</td>
                <td className="py-2.5 px-3 text-emerald-400 font-bold">🟢 MATCH</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 font-bold text-zinc-200">BLOCK HEIGHT</td>
                <td className="py-2.5 px-3 text-purple-300">#849,202</td>
                <td className="py-2.5 px-3 text-purple-300">#849,202</td>
                <td className="py-2.5 px-3 text-emerald-400 font-bold">🟢 MATCH</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 font-bold text-zinc-200">CANONICAL SEALS</td>
                <td className="py-2.5 px-3 text-amber-300">14,902</td>
                <td className="py-2.5 px-3 text-amber-300">14,902 SSoT</td>
                <td className="py-2.5 px-3 text-emerald-400 font-bold">🔒 14,902 (CANONICAL)</td>
              </tr>
              <tr className="bg-red-950/20">
                <td className="py-2.5 px-3 font-bold text-red-200">OBSERVED SEALS</td>
                <td className="py-2.5 px-3 text-zinc-400">14,902 Target</td>
                <td className="py-2.5 px-3 text-red-400 font-bold">14,907 Stream</td>
                <td className="py-2.5 px-3 text-red-400 font-bold">🔴 +5 MISMATCH</td>
              </tr>
              <tr className="bg-red-950/15">
                <td className="py-2.5 px-3 font-bold text-red-200">RECONCILIATION RESULT</td>
                <td className="py-2.5 px-3 text-zinc-400">Root + Block + Seal Match</td>
                <td className="py-2.5 px-3 text-red-300">Seal Count Mismatch</td>
                <td className="py-2.5 px-3 text-red-400 font-bold">🚫 FAIL-CLOSED</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 font-bold text-zinc-200">EVIDENCE QUARANTINE</td>
                <td className="py-2.5 px-3 text-zinc-400">Isolate +5 Anomalies</td>
                <td className="py-2.5 px-3 text-amber-300">#14903 &mdash; #14907 Isolated</td>
                <td className="py-2.5 px-3 text-amber-300 font-bold">🟡 QUARANTINED</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 font-bold text-zinc-200">AUTO-RECONCILE</td>
                <td className="py-2.5 px-3 text-zinc-400">No Silent Merge</td>
                <td className="py-2.5 px-3 text-zinc-300">Bypasses Blocked</td>
                <td className="py-2.5 px-3 text-emerald-400 font-bold">🔒 BLOCKED</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 font-bold text-zinc-200">AUTO-RESEAL</td>
                <td className="py-2.5 px-3 text-zinc-400">No Auto-Resigning</td>
                <td className="py-2.5 px-3 text-zinc-300">Cryptographic Lock Active</td>
                <td className="py-2.5 px-3 text-emerald-400 font-bold">🔒 BLOCKED</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 font-bold text-zinc-200">INDEPENDENT RUNTIME</td>
                <td className="py-2.5 px-3 text-zinc-400">Physical Hardware Logs</td>
                <td className="py-2.5 px-3 text-blue-300">Awaiting Hardware Node</td>
                <td className="py-2.5 px-3 text-blue-300 font-bold">⚪ NOT EXECUTED</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 font-bold text-zinc-200">DEPLOYED INTEGRITY</td>
                <td className="py-2.5 px-3 text-zinc-400">Deployed SHA-256 Probe</td>
                <td className="py-2.5 px-3 text-amber-300">External Endpoint Audit</td>
                <td className="py-2.5 px-3 text-amber-300 font-bold">⚪ PENDING</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 font-bold text-zinc-200">SSOT MUTATION</td>
                <td className="py-2.5 px-3 text-emerald-400">0 (Zero Tolerance)</td>
                <td className="py-2.5 px-3 text-emerald-400">0 Mutations Logged</td>
                <td className="py-2.5 px-3 text-emerald-400 font-bold">🔒 0 (INVIOLABLE)</td>
              </tr>
              <tr className="bg-red-950/30">
                <td className="py-2.5 px-3 font-bold text-red-100">CANONICAL PROMOTION</td>
                <td className="py-2.5 px-3 text-zinc-400">Requires 100% Unanimous Match</td>
                <td className="py-2.5 px-3 text-red-300">Held by +5 Drift Finding</td>
                <td className="py-2.5 px-3 text-red-400 font-extrabold">🚫 FAIL-CLOSED</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Grid: 2, 4, 5, 6 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 2. Observed Evidence Quarantine */}
        <div className="p-5 rounded-[24px] bg-[#090c15] border border-amber-500/30 space-y-4 shadow-xl">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              <h3 className="text-sm font-bold text-amber-100 font-serif">
                2. OBSERVED EVIDENCE QUARANTINE
              </h3>
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold">
              5 SEALS ISOLATED
            </span>
          </div>

          <div className="p-3.5 rounded-xl bg-black/60 border border-white/5 text-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-zinc-400">CANONICAL SSoT:</span>
              <span className="text-cyan-300 font-bold">14,902 / 14,902 (LOCKED)</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-zinc-400">OBSERVED STREAM:</span>
              <span className="text-red-400 font-bold">14,907 (STREAMED)</span>
            </div>
            <div className="flex items-center justify-between pt-1 border-t border-white/5">
              <span className="text-zinc-400">RECONCILIATION FINDING:</span>
              <span className="text-red-400 font-bold bg-red-500/20 px-2 py-0.5 rounded">
                +5 DRIFT DETECTED
              </span>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-[10px] text-amber-200 leading-relaxed space-y-1">
            <div className="font-bold text-amber-300">Quarantine Rules Enforced:</div>
            <div>&bull; 14,902 is preserved byte-for-byte in Canonical Ledger</div>
            <div>&bull; Observations #14,903 &mdash; #14,907 are quarantined in isolation</div>
            <div>&bull; No automatic synthesis, auto-reseal, or auto-normalization</div>
          </div>
        </div>

        {/* 4. Chain-of-Custody Assurance */}
        <div className="p-5 rounded-[24px] bg-[#090c15] border border-cyan-500/30 space-y-4 shadow-xl">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-cyan-400" />
              <h3 className="text-sm font-bold text-cyan-100 font-serif">
                4. CHAIN-OF-CUSTODY GATE
              </h3>
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded bg-red-500/20 text-red-300 border border-red-500/40 font-bold">
              CHAIN: BROKEN
            </span>
          </div>

          <div className="p-3 rounded-xl bg-black/60 border border-white/5 space-y-2 text-[10px] font-mono">
            <div className="text-zinc-400">Sequential Chain Verification:</div>
            <div className="flex flex-wrap items-center gap-1.5 text-zinc-300">
              <span className="px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300">Source ID</span>
              <span>&rarr;</span>
              <span className="px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300">Timestamp</span>
              <span>&rarr;</span>
              <span className="px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300">Artifact Digest</span>
              <span>&rarr;</span>
              <span className="px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300">Merkle Anchor</span>
              <span>&rarr;</span>
              <span className="px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300">Block Binding</span>
              <span>&rarr;</span>
              <span className="px-1.5 py-0.5 rounded bg-red-500/30 text-red-300 font-bold">Evidence Digest ✗</span>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-[10px] text-red-300 leading-relaxed">
            Missing genesis-level binding on +5 anomalous emissions breaks the chain $\rightarrow$ <strong>BLOCKED</strong>.
          </div>
        </div>

        {/* 5. Deterministic Replay Assurance */}
        <div className="p-5 rounded-[24px] bg-[#090c15] border border-cyan-500/30 space-y-4 shadow-xl">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <div className="flex items-center gap-2">
              <Binary className="w-4 h-4 text-purple-400" />
              <h3 className="text-sm font-bold text-purple-100 font-serif">
                5. DETERMINISTIC REPLAY ASSURANCE
              </h3>
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/40 font-bold">
              REPLAY ENGINE: READ-ONLY
            </span>
          </div>

          <div className="p-3 rounded-xl bg-black/60 border border-white/5 space-y-2 text-[10px] font-mono">
            <div className="flex justify-between">
              <span className="text-zinc-400">Canonical Input Replay:</span>
              <span className="text-emerald-400 font-bold">MATCH (14,902 SEALS)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-400">Observed Stream Replay:</span>
              <span className="text-red-400 font-bold">MISMATCH (Output Drift +5)</span>
            </div>
            <div className="flex justify-between pt-1 border-t border-white/5">
              <span className="text-zinc-400">Replay Output Hash:</span>
              <span className="text-red-300 font-bold">FAIL-CLOSED (Quarantined)</span>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-purple-500/10 border border-purple-500/20 text-[10px] text-purple-200 leading-relaxed">
            Replay verification strictly forbids labeling non-executed or mismatched hashes as VERIFIED.
          </div>
        </div>

        {/* 6. Canonical Write Firewall */}
        <div className="p-5 rounded-[24px] bg-[#090c15] border border-cyan-500/30 space-y-4 shadow-xl">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <h3 className="text-sm font-bold text-emerald-100 font-serif">
                6. CANONICAL WRITE FIREWALL
              </h3>
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold">
              WRITE ATTEMPTS: REJECTED
            </span>
          </div>

          <div className="p-3 rounded-xl bg-black/60 border border-white/5 space-y-1.5 text-[10px] font-mono">
            <div className="text-zinc-400">Protected Core Targets:</div>
            <div className="grid grid-cols-2 gap-1 text-emerald-300">
              <div>&bull; Merkle Root (0x909a...)</div>
              <div>&bull; Seal Count (14,902)</div>
              <div>&bull; Block Height (#849202)</div>
              <div>&bull; SSOT Canonical Manifest</div>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-[10px] text-emerald-200 leading-relaxed">
            <code>WRITE ATTEMPT &rarr; P0 CHECK &rarr; REJECT &rarr; IMMUTABLE_LOGGED</code>. Auto-reseal is <strong>LOCKED</strong>.
          </div>
        </div>
      </div>

      {/* 7 & 10. Promotion Firewall & Final Acceptance State */}
      <div className="p-6 rounded-[28px] bg-gradient-to-br from-[#0c0f1d]/95 via-[#080b14]/90 to-[#07080F] border-2 border-red-500/40 space-y-5 shadow-2xl">
        <div className="flex items-center justify-between border-b border-red-500/20 pb-3">
          <div className="flex items-center gap-2">
            <Flame className="w-5 h-5 text-red-400" />
            <h3 className="text-base font-bold text-red-100 font-serif">
              7 &amp; 10. PROMOTION FIREWALL &amp; HARDENING v2 ACCEPTANCE STATE
            </h3>
          </div>
          <span className="text-[10px] px-3 py-1 rounded-full bg-red-500/20 text-red-300 border border-red-500/40 font-bold">
            PROMOTION = BLOCKED 🔒
          </span>
        </div>

        {/* 5-Key Requirements Checklist */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 text-xs font-mono">
          <div className="p-3 rounded-xl bg-black/60 border border-red-500/30 space-y-1">
            <div className="text-[10px] text-zinc-500">1. CANONICAL MATCH:</div>
            <div className="text-red-400 font-bold flex items-center gap-1">
              <XCircle className="w-3.5 h-3.5" /> FAIL (+5)
            </div>
          </div>
          <div className="p-3 rounded-xl bg-black/60 border border-amber-500/30 space-y-1">
            <div className="text-[10px] text-zinc-500">2. DEPLOYED INTEGRITY:</div>
            <div className="text-amber-300 font-bold flex items-center gap-1">
              <AlertTriangle className="w-3.5 h-3.5" /> PENDING
            </div>
          </div>
          <div className="p-3 rounded-xl bg-black/60 border border-blue-500/30 space-y-1">
            <div className="text-[10px] text-zinc-500">3. RUNTIME EVIDENCE:</div>
            <div className="text-blue-300 font-bold">NOT EXECUTED</div>
          </div>
          <div className="p-3 rounded-xl bg-black/60 border border-amber-500/30 space-y-1">
            <div className="text-[10px] text-zinc-500">4. CUSTODIAN QUORUM:</div>
            <div className="text-amber-300 font-bold">4 / 10 (HELD)</div>
          </div>
          <div className="p-3 rounded-xl bg-black/60 border border-emerald-500/30 space-y-1">
            <div className="text-[10px] text-zinc-500">5. GOVERNANCE:</div>
            <div className="text-emerald-400 font-bold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> PASS (10/10)
            </div>
          </div>
        </div>

        {/* Required Final State Box */}
        <div className="p-4 rounded-2xl bg-black/90 border border-cyan-500/40 text-xs font-mono space-y-2">
          <div className="text-cyan-300 font-bold flex items-center justify-between">
            <span>ZYRQUEN &Omega;&infin; &mdash; HARDENING v2 FINAL STATE</span>
            <span className="text-[10px] text-zinc-400">2026-08-22 02:25:00 ICT</span>
          </div>
          <pre className="text-[10px] text-zinc-300 leading-relaxed overflow-x-auto">
{`ZYRQUEN Ω∞
│
├── FROZEN CORE
│   ├── Merkle Root  = 909ab814...fa4c68
│   ├── Block        = #849202
│   ├── Seals        = 14,902
│   └── Mutation     = 0
│
├── HARDENING v2
│   ├── Reconciliation = ACTIVE
│   ├── Evidence       = ASSURED
│   ├── +5 Finding     = QUARANTINED
│   ├── Auto-Reseal    = BLOCKED
│   └── Write Firewall = ENFORCED
│
└── PROMOTION
    └── FAIL-CLOSED`}
          </pre>
        </div>
      </div>
    </div>
  );
};
