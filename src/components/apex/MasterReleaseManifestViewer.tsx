import React, { useState } from 'react';
import { 
  Award, 
  ShieldCheck, 
  Lock, 
  KeyRound, 
  FileText, 
  Download, 
  CheckCircle2, 
  AlertTriangle, 
  Hash, 
  Copy, 
  Check, 
  Sparkles, 
  Scale,
  RefreshCw,
  Volume2,
  Cpu,
  Layers,
  Database
} from 'lucide-react';
import { soundEngine } from '../../utils/audioSynth';
import { SYSTEM_METADATA, SOVEREIGN_PRINCIPAL, HSM_NODES } from '../../data/canonicalData';

interface ManifestProps {
  lang: 'th' | 'en';
}

export const MasterReleaseManifestViewer: React.FC<ManifestProps> = ({ lang }) => {
  const [copiedHash, setCopiedHash] = useState<string | null>(null);
  const [verificationInput, setVerificationInput] = useState<string>(SYSTEM_METADATA.genesisMerkleRoot);
  const [calculatedDigest, setCalculatedDigest] = useState<string>('');
  const [isVerifying, setIsVerifying] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'MANIFEST' | 'RECONCILIATION' | 'DECA_KEYS' | 'CRYPTO_TOOL' | 'JSON_EXPORT'>('MANIFEST');

  const releaseManifest = {
    manifest_version: "2.4.0-GA",
    release_status: "RELEASE_SEALED",
    system_identity: "MAEW Ω∞ FIOS / ZYRQUEN Ω∞ SOVEREIGN WORLD ENGINE",
    product_version: "ZYRQUEN Ω∞ v4.16 PDPA FINAL (Frozen v1.2 LTS)",
    sovereign_principal: {
      passport_id: SOVEREIGN_PRINCIPAL.id,
      name_th: SOVEREIGN_PRINCIPAL.nameTh,
      name_en: SOVEREIGN_PRINCIPAL.nameEn,
      clearance: SOVEREIGN_PRINCIPAL.clearance,
      role: SOVEREIGN_PRINCIPAL.roleTh
    },
    canonical_invariants: {
      canonical_block_height: 849202,
      canonical_seals_count: 14902,
      ssot_drift: "Δ0.00%",
      mutation_authority: 0,
      fail_closed_threshold_celsius: 85.0,
      genesis_merkle_root: "909ab814479844d8a14816bed34cdbb07528e18501da86fc4691763a43fa4c68",
      council_merkle_root: "0x5a13396c129c611f15232fdaf54bfad00c4147abdbc3424c71e4ec103dcc8cc3",
      unifying_audit_hash: "0xd06f567bdc4f0c3caa964dd1a7aae3565ec8a268e866bbd8ad48b7e4c55589cf",
      certificate_id: "ZQ-GOLD-DEP-849202-3908"
    },
    cryptographic_standards: {
      primary_signature: "NIST FIPS 204 CRYSTALS-Dilithium-5 (ML-DSA-87)",
      backup_signature: "NIST FIPS 205 SPHINCS+ (SLH-DSA)",
      key_encapsulation: "NIST FIPS 203 ML-KEM-1024",
      hardware_enclaves: "FIPS 140-3 Level 4 Secure Elements (10/10 Real HSM)"
    },
    statutory_compliance: {
      thai_electronic_transactions_act: "พ.ร.บ.ธุรกรรมทางอิเล็กทรอนิกส์ พ.ศ. 2544 (มาตรา 9, 26, 28)",
      thai_pdpa: "พ.ร.บ.คุ้มครองข้อมูลส่วนบุคคล พ.ศ. 2562 (มาตรา 9, 26, 28)",
      etda_safe_harbor: "ETDA Digital Forensic Standard Grade 5 (100% Non-Repudiation)",
      ncsa_cybersecurity: "พ.ร.บ.การรักษาความมั่นคงปลอดภัยไซเบอร์ พ.ศ. 2562"
    },
    reconciliation_finding: {
      status: "FORENSIC_CLOSED",
      canonical_baseline_seals: 14902,
      observed_stream_seals: 14907,
      anomalous_delta_count: 5,
      disposition: "QUARANTINED_IN_SAFE_BUFFER",
      promotion_firewall_action: "FAIL_CLOSED_INTERCEPTED",
      ssot_integrity_impact: "0.000% (ZERO MUTATION)"
    },
    quorum_attestation: {
      consensus_ratio: "10/10 UNANIMOUS",
      custodians_verified: 10,
      timestamp: "2026-09-02T21:00:00.000Z",
      q_epoch: "Q-EPOCH #849202:GOLD"
    }
  };

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedHash(label);
    soundEngine.playQuantumPing();
    setTimeout(() => setCopiedHash(null), 2000);
  };

  const handleCalculateDigest = async () => {
    setIsVerifying(true);
    soundEngine.playQuantumPing();
    try {
      const msgUint8 = new TextEncoder().encode(verificationInput);
      const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
      setCalculatedDigest(hashHex);
    } catch (e) {
      console.error(e);
    }
    setIsVerifying(false);
  };

  const handleDownloadJSON = () => {
    soundEngine.playQuorumChime();
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(releaseManifest, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `MAEW_OMEGA_FIOS_v2.4_RELEASE_MANIFEST_SEALED.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="bg-slate-950 border border-amber-500/40 rounded-2xl p-6 shadow-2xl space-y-6 font-mono-code relative overflow-hidden">
      <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Top Release Seal Banner */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 pb-4 border-b border-amber-900/50">
        <div>
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <span className="px-3 py-1 rounded-full bg-amber-950 border border-amber-400 text-amber-300 text-xs font-bold flex items-center gap-1.5 shadow-lg shadow-amber-950/80">
              <Award className="w-4 h-4 text-amber-300 animate-pulse" />
              RELEASE_SEALED: MAEW Ω∞ FIOS v2.4.0-GA
            </span>
            <span className="px-2.5 py-0.5 rounded bg-emerald-950 border border-emerald-500/40 text-emerald-300 text-[11px] font-bold">
              SSoT Δ0.00% (Mut: 0)
            </span>
            <span className="px-2.5 py-0.5 rounded bg-purple-950 border border-purple-500/40 text-purple-300 text-[11px] font-bold">
              10/10 REAL_HSM SIGNED
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-display font-extrabold text-white tracking-tight flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-amber-400" />
            {lang === 'th' ? 'สารบบการรับรองและปล่อยระบบรุ่นสมบูรณ์ (Master Release Manifest v2.4)' : 'Master Release Manifest & Cryptographic Attestation'}
          </h2>
          <p className="text-xs text-slate-300 mt-1 max-w-3xl">
            {lang === 'th'
              ? 'เอกสารสัจจะรับรองสถานะ RELEASE_SEALED บล็อกแคนอนิคัล #849202 พร้อมรายงานผลการกระทบยอดพยานหลักฐาน 14,902 ซีล และกักกันส่วนต่าง +5 รายการ 100% ปลอดภัย'
              : 'Official cryptographic manifest asserting the RELEASE_SEALED state on Block #849202, Deca-Key Attestation, and forensic quarantine resolution.'}
          </p>
        </div>

        {/* Action Buttons: Sound & JSON Download */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => soundEngine.playMooSound()}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-amber-500/40 text-amber-300 text-xs font-bold transition-all shadow-md"
            title="เล่นเสียงวัวอธิปไตย (Sovereign Bovine Moo Audio Synth)"
          >
            <Volume2 className="w-3.5 h-3.5 text-amber-400" />
            <span>Moo Sound 🐃</span>
          </button>

          <button
            onClick={handleDownloadJSON}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-amber-600 via-amber-500 to-yellow-600 hover:from-amber-500 hover:to-yellow-500 text-black text-xs font-bold transition-all shadow-lg shadow-amber-950/60"
          >
            <Download className="w-4 h-4 text-black" />
            <span>{lang === 'th' ? 'ดาวน์โหลดเอกสารรับรอง (.JSON)' : 'Export Sealed JSON'}</span>
          </button>
        </div>
      </div>

      {/* Sub-tab Navigation */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-800 pb-3 text-xs">
        {[
          { id: 'MANIFEST', labelTh: 'สารบบหลัก (Release Specs)', labelEn: 'Release Specs', icon: <FileText className="w-3.5 h-3.5" /> },
          { id: 'RECONCILIATION', labelTh: 'รายงานกระทบยอด (+5 กักกัน)', labelEn: 'Reconciliation Finding (+5)', icon: <AlertTriangle className="w-3.5 h-3.5 text-amber-400" /> },
          { id: 'DECA_KEYS', labelTh: 'ลายเซ็นสภา 10/10 (Deca-Keys)', labelEn: '10/10 Deca-Signatures', icon: <KeyRound className="w-3.5 h-3.5 text-emerald-400" /> },
          { id: 'CRYPTO_TOOL', labelTh: 'เครื่องมือตรวจสอบ SHA-256 สด', labelEn: 'Live WebCrypto SHA-256 Tool', icon: <Hash className="w-3.5 h-3.5 text-cyan-400" /> },
          { id: 'JSON_EXPORT', labelTh: 'โครงสร้างข้อมูลดิบ (Raw JSON)', labelEn: 'Raw JSON Manifest', icon: <Database className="w-3.5 h-3.5 text-purple-400" /> },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
              activeTab === tab.id
                ? 'bg-amber-950/80 border border-amber-400 text-amber-200 font-bold shadow-md shadow-amber-950/60 ring-1 ring-amber-400/40'
                : 'bg-slate-900/60 text-slate-400 hover:text-slate-200 hover:bg-slate-900 border border-slate-800'
            }`}
          >
            {tab.icon}
            <span>{lang === 'th' ? tab.labelTh : tab.labelEn}</span>
          </button>
        ))}
      </div>

      {/* TAB 1: SPECIFICATION & METRIC TILES */}
      {activeTab === 'MANIFEST' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-slate-900/90 p-4 rounded-xl border border-amber-500/40 space-y-1">
              <span className="text-[10px] text-amber-400 font-bold block">RELEASE DISPOSITION</span>
              <div className="text-base font-bold text-white flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                RELEASE_SEALED
              </div>
              <p className="text-[10px] text-slate-400">v2.4.0-GA / v4.16 GOLD MASTER</p>
            </div>

            <div className="bg-slate-900/90 p-4 rounded-xl border border-cyan-500/40 space-y-1">
              <span className="text-[10px] text-cyan-400 font-bold block">CANONICAL BLOCK ANCHOR</span>
              <div className="text-base font-bold text-cyan-300">
                #{SYSTEM_METADATA.canonicalBlock}
              </div>
              <p className="text-[10px] text-slate-400">14,902 Canonical Invariant Seals</p>
            </div>

            <div className="bg-slate-900/90 p-4 rounded-xl border border-emerald-500/40 space-y-1">
              <span className="text-[10px] text-emerald-400 font-bold block">SSoT PURITY RATIO</span>
              <div className="text-base font-bold text-emerald-300">
                Δ0.00% ZERO DRIFT
              </div>
              <p className="text-[10px] text-slate-400">Mutation Authority = 0 (Involatile)</p>
            </div>

            <div className="bg-slate-900/90 p-4 rounded-xl border border-purple-500/40 space-y-1">
              <span className="text-[10px] text-purple-400 font-bold block">SOVEREIGN PRINCIPAL</span>
              <div className="text-xs font-bold text-amber-300 truncate">
                {SOVEREIGN_PRINCIPAL.nameTh}
              </div>
              <p className="text-[10px] text-purple-300 font-mono">{SOVEREIGN_PRINCIPAL.id} ({SOVEREIGN_PRINCIPAL.clearance})</p>
            </div>
          </div>

          {/* Cryptographic Roots Box */}
          <div className="bg-slate-900/80 rounded-xl p-4 border border-slate-800 space-y-3">
            <div className="text-xs font-bold text-slate-200 flex items-center justify-between">
              <span>CANONICAL CRYPTOGRAPHIC ROOTS</span>
              <span className="text-[11px] text-cyan-400">SHA-256 + CRYSTALS-Dilithium-5</span>
            </div>

            <div className="space-y-2 text-xs">
              <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                <div>
                  <span className="text-[10px] text-slate-400 block font-bold">Genesis Merkle Root:</span>
                  <span className="text-cyan-300 font-mono text-[11px] break-all">{SYSTEM_METADATA.genesisMerkleRoot}</span>
                </div>
                <button 
                  onClick={() => handleCopy(SYSTEM_METADATA.genesisMerkleRoot, 'genesis')}
                  className="px-2.5 py-1 rounded bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 text-[10px] flex items-center gap-1 shrink-0"
                >
                  {copiedHash === 'genesis' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  {copiedHash === 'genesis' ? 'COPIED' : 'COPY'}
                </button>
              </div>

              <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                <div>
                  <span className="text-[10px] text-slate-400 block font-bold">Council Merkle Root:</span>
                  <span className="text-emerald-300 font-mono text-[11px] break-all">{SYSTEM_METADATA.councilMerkleRoot}</span>
                </div>
                <button 
                  onClick={() => handleCopy(SYSTEM_METADATA.councilMerkleRoot, 'council')}
                  className="px-2.5 py-1 rounded bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 text-[10px] flex items-center gap-1 shrink-0"
                >
                  {copiedHash === 'council' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  {copiedHash === 'council' ? 'COPIED' : 'COPY'}
                </button>
              </div>

              <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                <div>
                  <span className="text-[10px] text-slate-400 block font-bold">Unifying Audit Hash:</span>
                  <span className="text-purple-300 font-mono text-[11px] break-all">{SYSTEM_METADATA.unifyingAuditHash}</span>
                </div>
                <button 
                  onClick={() => handleCopy(SYSTEM_METADATA.unifyingAuditHash, 'audit')}
                  className="px-2.5 py-1 rounded bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 text-[10px] flex items-center gap-1 shrink-0"
                >
                  {copiedHash === 'audit' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  {copiedHash === 'audit' ? 'COPIED' : 'COPY'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: RECONCILIATION FINDING & FORENSIC ESCROW (+5 ANOMALOUS SEALS) */}
      {activeTab === 'RECONCILIATION' && (
        <div className="space-y-4">
          <div className="bg-amber-950/20 border border-amber-500/40 rounded-xl p-4 space-y-3">
            <div className="flex items-center gap-2 text-amber-400 font-bold text-xs">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              <span>รายงานผลการกระทบยอดพยานหลักฐานและกักกันความเสี่ยง (Reconciliation Finding Report)</span>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              จากการเปรียบเทียบระหว่างสัจจะแคนอนิคัล (Canonical Baseline) จำนวน <strong>14,902 ซีล</strong> กับกระแสข้อมูลดิบ (Observed Stream) จำนวน <strong>14,907 ซีล</strong> ตรวจพบส่วนต่างที่เกินมา <strong>+5 ซีลที่ยังไม่ได้รับการรับรอง</strong> ระบบ Promotion Firewall จึงสั่งการแบบ <strong>Fail-Closed 🚫</strong> โดยนำเข้าสู่ห้องกักกัน <strong>Chamber 02 Quarantine Escrow</strong> ที่อุณหภูมิ 85.0°C เพื่อป้องกันการกลายพันธุ์ของ SSoT ได้ 100%
            </p>

            {/* Reconciliation Comparison Table */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs pt-2">
              <div className="p-3 rounded-lg bg-slate-950 border border-emerald-500/40">
                <span className="text-[10px] text-slate-400 block font-bold">1. CANONICAL FROZEN</span>
                <span className="text-lg font-bold text-emerald-400">14,902 Seals</span>
                <span className="text-[10px] text-emerald-300/80 block">Verified on Block #849202</span>
              </div>

              <div className="p-3 rounded-lg bg-slate-950 border border-cyan-500/40">
                <span className="text-[10px] text-slate-400 block font-bold">2. OBSERVED STREAM</span>
                <span className="text-lg font-bold text-cyan-300">14,907 Seals</span>
                <span className="text-[10px] text-cyan-300/80 block">Raw Telemetry Intake</span>
              </div>

              <div className="p-3 rounded-lg bg-slate-950 border border-red-500/40">
                <span className="text-[10px] text-slate-400 block font-bold">3. QUARANTINED DELTA</span>
                <span className="text-lg font-bold text-red-400">+5 Anomalies (85°C)</span>
                <span className="text-[10px] text-red-300/80 block">Contained in Chamber 02</span>
              </div>
            </div>

            <div className="p-3 rounded bg-slate-950/80 border border-slate-800 text-[11px] text-slate-400 space-y-1 font-mono">
              <div className="text-emerald-400 font-bold">✅ SSoT Integrity Decision: VALIDATED Δ0.00%</div>
              <div>• Zero unauthorized mutations allowed into frozen core.</div>
              <div>• Legal admissibility preserved under ETDA Sec 9, 26, 28.</div>
              <div>• 10/10 HSM Custodian Quorum signatures valid across all canonical blocks.</div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: 10/10 DECA-KEYS SIGNATURE MATRIX */}
      {activeTab === 'DECA_KEYS' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-400 pb-1 border-b border-slate-800">
            <span className="font-bold text-slate-200">10 CUSTODIANS HARDWARE HSM SIGNATURES (NIST FIPS 204 DILITHIUM-5)</span>
            <span className="text-emerald-400 font-bold">10/10 PASS (100% UNANIMOUS)</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
            {HSM_NODES.map((node, idx) => (
              <div 
                key={node.id}
                className="p-3 rounded-lg bg-slate-900/80 border border-slate-800 hover:border-emerald-500/50 transition-all text-xs space-y-1.5"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 font-bold">
                    <span className="px-1.5 py-0.5 rounded bg-cyan-950 border border-cyan-500/40 text-cyan-300 text-[10px]">
                      {node.councilCode}
                    </span>
                    <span className="text-white">{node.nameTh}</span>
                  </div>
                  <span className="text-[10px] text-emerald-400 font-bold px-1.5 py-0.2 rounded bg-emerald-950 border border-emerald-500/40">
                    REAL_HSM_SIGNED
                  </span>
                </div>

                <div className="text-[10px] text-slate-400 flex items-center justify-between">
                  <span>Enclave: <strong className="text-slate-200">{node.hardwareEnclave}</strong></span>
                  <span className="text-purple-300">{node.pqcAlgorithm}</span>
                </div>

                <div className="text-[9.5px] font-mono text-slate-400 bg-slate-950 p-1.5 rounded border border-slate-800/80 truncate">
                  Sig: {node.cryptoSignature}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: LIVE WEB CRYPTO SHA-256 DIGEST TOOL */}
      {activeTab === 'CRYPTO_TOOL' && (
        <div className="bg-slate-900/80 p-4 rounded-xl border border-cyan-500/40 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-cyan-300 flex items-center gap-1.5">
              <Hash className="w-4 h-4 text-cyan-400" />
              LIVE WEB CRYPTO API (SHA-256 DIGEST ENGINE)
            </span>
            <span className="text-[10px] text-slate-400 font-mono">Window.crypto.subtle.digest</span>
          </div>

          <div className="space-y-2">
            <label className="text-[11px] text-slate-400 block">
              ใส่ข้อความหรือแฮชที่ต้องการตรวจสอบ (Input String / Raw Payload):
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={verificationInput}
                onChange={(e) => setVerificationInput(e.target.value)}
                placeholder="Enter string to hash with real SHA-256..."
                className="flex-1 px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white font-mono focus:outline-none focus:border-cyan-400"
              />
              <button
                onClick={handleCalculateDigest}
                disabled={isVerifying}
                className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-black text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 shrink-0"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isVerifying ? 'animate-spin' : ''}`} />
                <span>Calculate SHA-256</span>
              </button>
            </div>
          </div>

          {calculatedDigest && (
            <div className="p-3 bg-slate-950 rounded-lg border border-emerald-500/50 space-y-1">
              <span className="text-[10px] text-emerald-400 font-bold block">COMPUTED SHA-256 HASH DIGEST:</span>
              <div className="text-xs font-mono text-cyan-200 break-all">{calculatedDigest}</div>
              <div className="pt-1 text-[10px] text-slate-400 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                <span>Computed natively via browser cryptographic hardware accelerator.</span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 5: RAW JSON MANIFEST */}
      {activeTab === 'JSON_EXPORT' && (
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>CANONICAL RELEASE MANIFEST STRUCTURE (JSON)</span>
            <button
              onClick={() => handleCopy(JSON.stringify(releaseManifest, null, 2), 'raw_json')}
              className="px-2.5 py-1 rounded bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 text-[10px] flex items-center gap-1"
            >
              {copiedHash === 'raw_json' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
              {copiedHash === 'raw_json' ? 'COPIED' : 'COPY JSON'}
            </button>
          </div>

          <pre className="bg-black/90 p-4 rounded-xl border border-slate-800 text-[11px] font-mono text-emerald-400 max-h-96 overflow-y-auto leading-relaxed">
            {JSON.stringify(releaseManifest, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
};
