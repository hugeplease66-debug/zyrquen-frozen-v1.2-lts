import React, { useState } from 'react';
import { 
  X, 
  Zap, 
  ShieldAlert, 
  CheckCircle2, 
  AlertTriangle, 
  Scale, 
  Lock, 
  Play,
  RotateCcw,
  Cpu
} from 'lucide-react';
import { SimulatedTransaction, InterceptResult } from '../../types';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: 'th' | 'en';
}

const PRESETS: Array<{ label: string; tx: SimulatedTransaction }> = [
  {
    label: "Stripe Online E-Commerce (AUTH-9901)",
    tx: {
      auth_id: "AUTH-9901",
      vendor: "Stripe Online Global",
      amount: 1200.00,
      signature_scheme: "Dilithium-5",
      hsm_quorum_count: 10,
      isReplay: false
    }
  },
  {
    label: "AWS Cloud Infrastructure Billing (AUTH-9903)",
    tx: {
      auth_id: "AUTH-9903",
      vendor: "Amazon Web Services (AWS)",
      amount: 24500.00,
      signature_scheme: "Dilithium-5",
      hsm_quorum_count: 10,
      isReplay: false
    }
  },
  {
    label: "CryptoDirect High-Risk Probe (AUTH-9902)",
    tx: {
      auth_id: "AUTH-9902",
      vendor: "CryptoDirect Terminal #88",
      amount: 142000.00,
      signature_scheme: "Ed25519",
      hsm_quorum_count: 0,
      isReplay: false
    }
  },
  {
    label: "Replay Attack Infiltration Probe",
    tx: {
      auth_id: "AUTH-REPLAY-884",
      vendor: "Unknown Proxy Node",
      amount: 500000.00,
      signature_scheme: "None",
      hsm_quorum_count: 0,
      isReplay: true
    }
  }
];

export const SentinelSimulatorModal: React.FC<ModalProps> = ({ isOpen, onClose, lang }) => {
  const [currentTx, setCurrentTx] = useState<SimulatedTransaction>(PRESETS[0].tx);
  const [evaluation, setEvaluation] = useState<InterceptResult | null>(null);
  const [isEvaluating, setIsEvaluating] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleEvaluate = () => {
    setIsEvaluating(true);
    setTimeout(() => {
      let riskScore = 0.02;
      const details: string[] = [];

      if (currentTx.isReplay) {
        riskScore = 0.99;
        details.push("CRITICAL: Duplicate digest found in Sentinel-Ledger hash cache (Replay attack).");
      }

      if (currentTx.signature_scheme !== 'Dilithium-5') {
        riskScore = Math.max(riskScore, 0.85);
        details.push(`WARNING: Signature scheme '${currentTx.signature_scheme}' lacks Post-Quantum Dilithium-5 (FIPS 204) assurance.`);
      }

      if (currentTx.hsm_quorum_count < 10) {
        riskScore = Math.max(riskScore, 0.92);
        details.push(`ALERT: Quorum consensus incomplete (${currentTx.hsm_quorum_count}/10 HSM keys). Requires 10/10 unanimous approval.`);
      }

      if (currentTx.amount > 100000 && riskScore > 0.5) {
        riskScore = Math.min(1.0, riskScore + 0.06);
        details.push(`SURGE: High-value transaction threshold exceeded (฿${currentTx.amount.toLocaleString()} THB) with unverified signer.`);
      }

      let status: 'SETTLED_COMMITTED' | 'ESCROW_PENDING' | 'BLOCKED_FRAUD' = 'SETTLED_COMMITTED';
      let chamber = "Chamber 01 (Canonical Settlement)";
      let mitigation = "Approved for immutable Merkle inclusion on Block #849202.";

      if (riskScore >= 0.80) {
        status = 'BLOCKED_FRAUD';
        chamber = "Chamber 02 (Quarantine Escrow) & Chamber 17 (Preservation)";
        mitigation = "Fail-Closed Quarantine triggered. Evidence archived to Module 17 with zero-deletion guarantee.";
      } else if (riskScore > 0.20) {
        status = 'ESCROW_PENDING';
        chamber = "Chamber 02 (Temporary Holding)";
        mitigation = "Escrow hold pending second-factor sovereign key review.";
      }

      const sec9 = currentTx.signature_scheme === 'Dilithium-5';
      const sec26 = currentTx.hsm_quorum_count === 10 && !currentTx.isReplay;
      const sec28 = sec9 && sec26;

      let courtAdmissible: 'FORENSIC_READY_MAXIMUM_ASSURANCE' | 'ADMISSIBLE_GENERAL_TRANSACTION' | 'NOT_ADMISSIBLE_FRAUD_SUSPECTED' = 'FORENSIC_READY_MAXIMUM_ASSURANCE';
      if (status === 'BLOCKED_FRAUD') {
        courtAdmissible = 'NOT_ADMISSIBLE_FRAUD_SUSPECTED';
      } else if (!sec28) {
        courtAdmissible = 'ADMISSIBLE_GENERAL_TRANSACTION';
      }

      setEvaluation({
        computed_risk_score: parseFloat(riskScore.toFixed(3)),
        evaluation_timestamp: new Date().toISOString(),
        status,
        mitigation_action: mitigation,
        chamber,
        thai_legal_compliance: {
          section_09_enforceable: sec9,
          section_26_trustworthy: sec26,
          section_28_ca_backed: sec28,
          court_admissible: courtAdmissible
        },
        details: details.length > 0 ? details : ["All quantum and legal parameters verified under SSoT baseline."]
      });
      setIsEvaluating(false);
    }, 300);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-red-500/40 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl p-6 space-y-6">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-950 border border-red-500/50 flex items-center justify-center">
              <Zap className="w-5 h-5 text-red-400 animate-pulse" />
            </div>
            <div>
              <h3 className="font-display font-bold text-lg text-white">
                Sentinel-Ledger AI Threat Interceptor Simulator
              </h3>
              <p className="text-xs text-slate-400">
                {lang === 'th'
                  ? 'ระบบประเมินความเสี่ยงธุรกรรมเรียลไทม์ และจำลองการกักกันเข้าสู่ Chamber 02'
                  : 'Real-time transaction risk scoring & Fail-Closed mitigation routing simulator.'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Presets Bar */}
        <div className="space-y-2">
          <label className="text-xs text-slate-400 font-semibold block">
            {lang === 'th' ? 'เลือกตัวอย่างธุรกรรมทดสอบ:' : 'Select Test Transaction Preset:'}
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {PRESETS.map((p, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setCurrentTx(p.tx);
                  setEvaluation(null);
                }}
                className={`p-2.5 rounded-lg border text-left text-xs font-mono-code transition-all ${
                  currentTx.auth_id === p.tx.auth_id
                    ? 'bg-red-950/40 border-red-500/50 text-white'
                    : 'bg-slate-950 border-slate-800 hover:border-slate-700 text-slate-300'
                }`}
              >
                <div className="font-bold text-cyan-300">{p.label}</div>
                <div className="text-[11px] text-slate-400 mt-0.5">
                  Amount: ฿{p.tx.amount.toLocaleString()} • Scheme: {p.tx.signature_scheme}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Transaction Parameter Customizer */}
        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-4">
          <h4 className="font-display font-bold text-white text-sm flex items-center gap-2">
            <Cpu className="w-4 h-4 text-cyan-400" />
            {lang === 'th' ? 'พารามิเตอร์ธุรกรรมที่กำลังทดสอบ' : 'Transaction Parameters'}
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
            <div>
              <span className="text-slate-400 block mb-1">Auth ID:</span>
              <input
                type="text"
                value={currentTx.auth_id}
                onChange={(e) => setCurrentTx({ ...currentTx, auth_id: e.target.value })}
                className="w-full bg-slate-900 border border-slate-700 rounded px-2.5 py-1.5 text-white font-mono-code"
              />
            </div>

            <div>
              <span className="text-slate-400 block mb-1">Vendor:</span>
              <input
                type="text"
                value={currentTx.vendor}
                onChange={(e) => setCurrentTx({ ...currentTx, vendor: e.target.value })}
                className="w-full bg-slate-900 border border-slate-700 rounded px-2.5 py-1.5 text-white"
              />
            </div>

            <div>
              <span className="text-slate-400 block mb-1">Amount (THB):</span>
              <input
                type="number"
                value={currentTx.amount}
                onChange={(e) => setCurrentTx({ ...currentTx, amount: Number(e.target.value) })}
                className="w-full bg-slate-900 border border-slate-700 rounded px-2.5 py-1.5 text-white font-mono-code"
              />
            </div>

            <div>
              <span className="text-slate-400 block mb-1">Signature Scheme:</span>
              <select
                value={currentTx.signature_scheme}
                onChange={(e) => setCurrentTx({ ...currentTx, signature_scheme: e.target.value as any })}
                className="w-full bg-slate-900 border border-slate-700 rounded px-2.5 py-1.5 text-white font-mono-code"
              >
                <option value="Dilithium-5">CRYSTALS-Dilithium-5 (PQC FIPS 204)</option>
                <option value="Ed25519">Ed25519 (Classical - Quantum Vulnerable)</option>
                <option value="RSA-2048">RSA-2048 (Classical)</option>
                <option value="None">None (Unsigned / Tampered)</option>
              </select>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-slate-800">
            <div className="flex items-center gap-4 text-xs">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={currentTx.isReplay}
                  onChange={(e) => setCurrentTx({ ...currentTx, isReplay: e.target.checked })}
                  className="rounded accent-red-500"
                />
                <span className="text-slate-300">Simulate Replay Attack</span>
              </label>

              <div className="flex items-center gap-2">
                <span className="text-slate-400">HSM Signers:</span>
                <select
                  value={currentTx.hsm_quorum_count}
                  onChange={(e) => setCurrentTx({ ...currentTx, hsm_quorum_count: Number(e.target.value) })}
                  className="bg-slate-900 border border-slate-700 rounded px-2 py-0.5 text-white font-mono-code text-xs"
                >
                  <option value={10}>10 / 10 Keys (Unanimous)</option>
                  <option value={7}>7 / 10 Keys (Partial Quorum)</option>
                  <option value={0}>0 / 10 Keys (No HSM Approval)</option>
                </select>
              </div>
            </div>

            <button
              onClick={handleEvaluate}
              disabled={isEvaluating}
              className="px-5 py-2 rounded-lg bg-red-600 hover:bg-red-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg transition-all font-display"
            >
              <Play className="w-3.5 h-3.5 fill-white" />
              {isEvaluating ? 'Evaluating...' : 'RUN SENTINEL AUDIT'}
            </button>
          </div>
        </div>

        {/* Evaluation Output */}
        {evaluation && (
          <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
              <div className="flex items-center gap-3">
                <span className={`text-xl font-mono-code font-bold ${
                  evaluation.status === 'SETTLED_COMMITTED' ? 'text-emerald-400' :
                  evaluation.status === 'ESCROW_PENDING' ? 'text-amber-400' : 'text-red-400'
                }`}>
                  {evaluation.status}
                </span>
                <span className="text-xs px-2 py-0.5 rounded bg-slate-900 border border-slate-700 font-mono-code text-slate-300">
                  Risk Score: <strong className={evaluation.computed_risk_score >= 0.8 ? 'text-red-400' : 'text-emerald-400'}>{evaluation.computed_risk_score}</strong>
                </span>
              </div>
              <span className="text-[11px] text-slate-400 font-mono-code">
                {evaluation.evaluation_timestamp}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="space-y-2">
                <div>
                  <span className="text-slate-400 block font-semibold">Routing Action:</span>
                  <span className="text-white font-mono-code">{evaluation.chamber}</span>
                </div>
                <div>
                  <span className="text-slate-400 block font-semibold">Mitigation Strategy:</span>
                  <p className="text-slate-300 bg-slate-900 p-2.5 rounded border border-slate-800 leading-relaxed text-[11px]">
                    {evaluation.mitigation_action}
                  </p>
                </div>
              </div>

              <div className="space-y-2 bg-slate-900 p-3 rounded-lg border border-slate-800">
                <span className="text-slate-400 block font-semibold">Thai Electronic Transactions Act Compliance:</span>
                <div className="space-y-1 text-[11px] font-mono-code">
                  <div className="flex justify-between">
                    <span>มาตรา 9 (Legal Binding):</span>
                    <span className={evaluation.thai_legal_compliance.section_09_enforceable ? 'text-emerald-400' : 'text-red-400'}>
                      {evaluation.thai_legal_compliance.section_09_enforceable ? '✓ ENFORCEABLE' : '✗ NON-COMPLIANT'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>มาตรา 26 (Trustworthy Signature):</span>
                    <span className={evaluation.thai_legal_compliance.section_26_trustworthy ? 'text-emerald-400' : 'text-red-400'}>
                      {evaluation.thai_legal_compliance.section_26_trustworthy ? '✓ TRUSTED' : '✗ FAILED'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>มาตรา 28 (CA Safe Harbor):</span>
                    <span className={evaluation.thai_legal_compliance.section_28_ca_backed ? 'text-emerald-400' : 'text-red-400'}>
                      {evaluation.thai_legal_compliance.section_28_ca_backed ? '✓ CERTIFIED' : '✗ UNBACKED'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-1 text-xs">
              <span className="text-slate-400 block font-semibold">Diagnostic Findings:</span>
              <div className="space-y-1">
                {evaluation.details.map((d, i) => (
                  <div key={i} className="text-[11px] text-slate-300 font-mono-code flex items-start gap-1.5">
                    <span>•</span>
                    <span>{d}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
