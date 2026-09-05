import React, { useState } from 'react';
import {
  History,
  ShieldCheck,
  AlertOctagon,
  Search,
  Filter,
  CheckCircle2,
  Lock,
  ArrowRight,
  Hash,
  Clock,
  User,
  Activity,
  FileCheck,
  Check,
  Copy,
} from 'lucide-react';
import { playAuditChime, playTone } from './AudioSynthesizer';
import { ImmutableAuditEvent } from '../types';
import { copyToClipboard } from '../utils/clipboard';

export const ImmutableAuditTimeline: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterResult, setFilterResult] = useState<string>('ALL');
  const [copiedHash, setCopiedHash] = useState<string | null>(null);

  // Append-Only Event Ledger
  const auditEvents: ImmutableAuditEvent[] = [
    {
      id: 'evt-001',
      sequenceNumber: 14902,
      timestampIct: '2026-08-22 01:45:00 ICT',
      actor: '#EP-SOVEREIGN-01 (สมชาย พากเพียร)',
      action: 'SOVEREIGN_MERKLE_ROOT_LOCK',
      inputHash: 'SHA256:7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069',
      outputHash: 'MERKLE:909ab8146747f520beec1907beab286c06a38096f9bf00f40d8aa536b3fa4c68',
      result: 'IMMUTABLE_LOGGED',
      proofAnchor: 'BLOCK_#849202_LEAF_0',
    },
    {
      id: 'evt-002',
      sequenceNumber: 14901,
      timestampIct: '2026-08-22 01:42:30 ICT',
      actor: '#EP-CUSTODIAN-02 (ดร. กานดา วัฒนพาณิชย์)',
      action: 'NIST_FIPS_204_LATTICE_INTEGRITY_CHECK',
      inputHash: 'SHA256:2c6ee4b9c1d2e5b871c5658b1a37c83c2e64627b0eb817c1bf86c2e3da72c9a8',
      outputHash: 'DILITHIUM5:PASS_COHERENCE_99_98_PCT',
      result: 'SUCCESS',
      proofAnchor: 'BLOCK_#849202_LEAF_1',
    },
    {
      id: 'evt-003',
      sequenceNumber: 14900,
      timestampIct: '2026-08-22 01:38:15 ICT',
      actor: '#EP-CUSTODIAN-04 (ศ.ดร. ธนพล มิ่งขวัญ)',
      action: 'BLUEFORS_CRYO_TELEMETRY_SNAP',
      inputHash: 'RTD_SENSOR_LD400:14.98_mK_TELEMETRY_STREAM',
      outputHash: 'TELEMETRY_HASH:11a4e2ef64d73cf02b9e1e5b8d9633e888fd2e58a74e502c34a2e88a09f3e4cb',
      result: 'SUCCESS',
      proofAnchor: 'BLOCK_#849202_LEAF_2',
    },
    {
      id: 'evt-004',
      sequenceNumber: 14899,
      timestampIct: '2026-08-22 01:25:00 ICT',
      actor: 'UNAUTHORIZED_SIMULATION_TRIGGER',
      action: 'UNVERIFIED_12500_QOPS_PROMOTION_ATTEMPT',
      inputHash: 'SYNTHETIC_CANDIDATE:12500_QOPS_NO_FIOS_REPORT',
      outputHash: 'FIREWALL_REJECT:NOT_IN_EVIDENCE_ISOLATED',
      result: 'FAIL_CLOSED',
      proofAnchor: 'FIREWALL_AUDIT_LOG_#994',
    },
    {
      id: 'evt-005',
      sequenceNumber: 14898,
      timestampIct: '2026-08-22 01:10:45 ICT',
      actor: '#EP-CUSTODIAN-03 (พ.ต.อ. เอกชัย รัตนประสิทธิ์)',
      action: 'SECTION28_CIRCUIT_BREAKER_HEARTBEAT',
      inputHash: 'LATENCY_PING:0.38_MS_FAIL_CLOSED_LOOP',
      outputHash: 'CIRCUIT_STATUS:ARMED_ZERO_DRIFT_PASS',
      result: 'SUCCESS',
      proofAnchor: 'BLOCK_#849201_LEAF_3',
    },
    {
      id: 'evt-006',
      sequenceNumber: 14897,
      timestampIct: '2026-08-22 00:55:00 ICT',
      actor: 'ANONYMOUS_INTRUSION_SIMULATOR',
      action: 'CANDIDATE_TO_CANONICAL_BYPASS_ATTEMPT',
      inputHash: 'UNAUTHENTICATED_MUTATION_DISPATCH_CALL',
      outputHash: 'RECONCILIATION_GATE:READ_ONLY_BLOCKED',
      result: 'BLOCKED',
      proofAnchor: 'SECURITY_AUDIT_LOG_#993',
    },
  ];

  const handleCopy = (text: string, id: string) => {
    copyToClipboard(text);
    setCopiedHash(id);
    playTone(720, 0.03);
    setTimeout(() => setCopiedHash(null), 2000);
  };

  const getResultBadge = (res: ImmutableAuditEvent['result']) => {
    switch (res) {
      case 'IMMUTABLE_LOGGED':
      case 'SUCCESS':
        return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40';
      case 'BLOCKED':
        return 'bg-amber-500/20 text-amber-300 border-amber-500/40';
      case 'FAIL_CLOSED':
        return 'bg-red-500/20 text-red-300 border-red-500/50';
    }
  };

  const filteredEvents = auditEvents.filter((evt) => {
    const matchesFilter = filterResult === 'ALL' || evt.result === filterResult;
    const matchesSearch =
      evt.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      evt.actor.toLowerCase().includes(searchTerm.toLowerCase()) ||
      evt.inputHash.toLowerCase().includes(searchTerm.toLowerCase()) ||
      evt.outputHash.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="p-6 rounded-[28px] bg-gradient-to-br from-[#090d16]/95 via-[#060910]/90 to-[#07080F] border-2 border-cyan-500/35 backdrop-blur-2xl space-y-6 shadow-2xl font-mono">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-cyan-500/20 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/15 border border-cyan-500/30 text-cyan-300 flex items-center justify-center shrink-0">
            <History className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-cyan-100 font-serif">
                Immutable Audit Timeline (ไทม์ไลน์บันทึกการตรวจสอบแบบไม่สามารถแก้ไขได้)
              </h3>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-bold">
                APPEND-ONLY LEDGER
              </span>
            </div>
            <p className="text-xs text-cyan-200/80 font-serif mt-0.5">
              Timestamp ➔ Actor ➔ Action ➔ Input Hash ➔ Output Hash ➔ Result
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="px-3 py-1 rounded-xl bg-black/60 border border-cyan-500/30 text-cyan-300 font-bold flex items-center gap-1.5">
            <Hash className="w-3.5 h-3.5" />
            <span>Root: 909ab814 (Block #849202)</span>
          </span>
        </div>
      </div>

      {/* Filter & Search Toolbar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 text-xs">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by Action, Actor, or Hash..."
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-black/60 border border-white/10 text-white placeholder-zinc-500 focus:outline-none focus:border-cyan-400 text-xs"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {['ALL', 'SUCCESS', 'IMMUTABLE_LOGGED', 'BLOCKED', 'FAIL_CLOSED'].map((f) => (
            <button
              key={f}
              onClick={() => {
                playTone(620, 0.02);
                setFilterResult(f);
              }}
              className={`px-3 py-1.5 rounded-xl border text-[11px] font-bold transition-all whitespace-nowrap ${
                filterResult === f
                  ? 'bg-cyan-500/25 border-cyan-400/60 text-cyan-100 shadow-[0_0_15px_rgba(6,182,212,0.2)]'
                  : 'bg-white/[0.02] border-white/5 text-zinc-400 hover:text-zinc-200'
              }`}
            >
              {f.replace(/_/g, ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Append-Only Event Sequence List */}
      <div className="space-y-3">
        {filteredEvents.map((evt) => (
          <div
            key={evt.id}
            className="p-4 rounded-2xl bg-black/60 border border-white/8 hover:border-cyan-500/30 transition-all space-y-3 text-xs"
          >
            {/* Top Bar: Sequence, Time, Actor, Result */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/5 pb-2">
              <div className="flex items-center gap-2">
                <span className="font-mono text-cyan-400 font-bold bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20">
                  #{evt.sequenceNumber}
                </span>
                <span className="font-bold text-white font-serif text-sm">{evt.action}</span>
              </div>
              <div className="flex items-center gap-2 text-[11px]">
                <span className="text-zinc-400 flex items-center gap-1">
                  <Clock className="w-3 h-3 text-zinc-500" />
                  <span>{evt.timestampIct}</span>
                </span>
                <span className={`px-2.5 py-0.5 rounded-full border font-bold text-[10px] ${getResultBadge(evt.result)}`}>
                  {evt.result}
                </span>
              </div>
            </div>

            {/* Middle: Actor & Proof Anchor */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
              <div className="flex items-center gap-2 text-zinc-300">
                <User className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span className="text-zinc-500">ACTOR:</span>
                <span className="font-semibold text-amber-200 truncate">{evt.actor}</span>
              </div>
              <div className="flex items-center gap-2 text-zinc-300">
                <Hash className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                <span className="text-zinc-500">PROOF ANCHOR:</span>
                <span className="font-mono text-purple-300">{evt.proofAnchor}</span>
              </div>
            </div>

            {/* Input Hash ➔ Output Hash Invariant Transformation */}
            <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 grid grid-cols-1 md:grid-cols-2 gap-3 text-[11px]">
              <div>
                <div className="text-[10px] text-zinc-500 flex items-center justify-between">
                  <span>INPUT HASH / PAYLOAD:</span>
                  <button
                    onClick={() => handleCopy(evt.inputHash, `in-${evt.id}`)}
                    className="text-zinc-500 hover:text-white"
                  >
                    {copiedHash === `in-${evt.id}` ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  </button>
                </div>
                <div className="font-mono text-blue-300 text-[10px] truncate">{evt.inputHash}</div>
              </div>

              <div>
                <div className="text-[10px] text-zinc-500 flex items-center justify-between">
                  <span>OUTPUT HASH / PROOF ATTESTATION:</span>
                  <button
                    onClick={() => handleCopy(evt.outputHash, `out-${evt.id}`)}
                    className="text-zinc-500 hover:text-white"
                  >
                    {copiedHash === `out-${evt.id}` ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  </button>
                </div>
                <div className="font-mono text-emerald-300 text-[10px] truncate">{evt.outputHash}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
