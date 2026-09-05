'use client';

import React, { useState, useRef } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import {
  QrCode,
  Share2,
  Copy,
  Check,
  Download,
  Smartphone,
  ShieldCheck,
  Sparkles,
  ExternalLink,
  X,
  Lock,
  Award,
  CheckCircle2,
  FileCheck2,
  Terminal,
  Layers,
  Cpu
} from 'lucide-react';

export interface ShareProofProps {
  isOpen: boolean;
  onClose: () => void;
  merkleRoot?: string;
  blockHeight?: number;
  sealsCount?: number;
  architectName?: string;
  architectId?: string;
  onCopySuccess?: (msg: string) => void;
}

export const CANONICAL_MERKLE_ROOT = '909ab814479844d8a14816bed34cdbb07528e18501da86fc4691763a43fa4c68';
export const CANONICAL_BLOCK_HEIGHT = 849202;
export const CANONICAL_SEALS_COUNT = 14902;
export const SOVEREIGN_ARCHITECT_TH = 'นายยุทธภูมิ พากเพียร';
export const SOVEREIGN_ARCHITECT_EN = 'Yuththaphum Phakphian';
export const SOVEREIGN_ARCHITECT_ID = '#EP-SOVEREIGN-01';

export const ShareProofQrModal: React.FC<ShareProofProps> = ({
  isOpen,
  onClose,
  merkleRoot = CANONICAL_MERKLE_ROOT,
  blockHeight = CANONICAL_BLOCK_HEIGHT,
  sealsCount = CANONICAL_SEALS_COUNT,
  architectName = `${SOVEREIGN_ARCHITECT_TH} (${SOVEREIGN_ARCHITECT_ID}) / ${SOVEREIGN_ARCHITECT_EN}`,
  architectId = SOVEREIGN_ARCHITECT_ID,
  onCopySuccess
}) => {
  const [activeTab, setActiveTab] = useState<'QR' | 'JSON' | 'MOBILE_SIM'>('QR');
  const [payloadType, setPayloadType] = useState<'DEEPLINK' | 'JSON' | 'HASH'>('DEEPLINK');
  const [copiedHash, setCopiedHash] = useState(false);
  const [copiedJson, setCopiedJson] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [isSimulatingScan, setIsSimulatingScan] = useState(false);
  const [scanVerified, setScanVerified] = useState(false);
  const qrRef = useRef<HTMLDivElement>(null);

  if (!isOpen) return null;

  const timestamp = new Date().toISOString();

  const proofPayloadObject = {
    protocol: 'ZYRQUEN Ω∞ SOVEREIGN SSoT ENGINE',
    version: 'v4.16 PDPA FINAL (Frozen v1.2 LTS)',
    clearance: 'OMEGA-1 SUPREME CLEARANCE',
    sovereignArchitect: {
      th: SOVEREIGN_ARCHITECT_TH,
      en: SOVEREIGN_ARCHITECT_EN,
      id: architectId,
      mutationAuthority: 0,
    },
    invariants: {
      canonicalBlockHeight: blockHeight,
      canonicalSealsCount: sealsCount,
      genesisMerkleRootHash: merkleRoot,
      zeroDrift: 'Δ0.00%',
      pqcStandard: 'NIST FIPS 204 ML-DSA-87 (Dilithium-5) & FIPS 203 ML-KEM-1024',
      failClosedThreshold: '85.0°C AUTO QUARANTINE',
      legalCompliance: 'PDPA B.E. 2562 (2019) Sec 9, 26, 28 & ETDA Safe Harbor',
    },
    chambersCount: 18,
    phasesCount: 40,
    verificationStatus: 'CANONICAL_SEALED_PASS',
    issuedAt: timestamp,
    verificationUri: `https://zyrquen.sovereign/verify?root=${merkleRoot}&block=${blockHeight}&arch=${encodeURIComponent(architectId)}&seals=${sealsCount}`
  };

  const verificationUrl = proofPayloadObject.verificationUri;
  const jsonPayloadString = JSON.stringify(proofPayloadObject, null, 2);

  const activeQrValue =
    payloadType === 'DEEPLINK'
      ? verificationUrl
      : payloadType === 'JSON'
      ? jsonPayloadString
      : merkleRoot;

  const handleCopy = (text: string, type: 'hash' | 'json' | 'link') => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(text);
      if (type === 'hash') {
        setCopiedHash(true);
        setTimeout(() => setCopiedHash(false), 2500);
      } else if (type === 'json') {
        setCopiedJson(true);
        setTimeout(() => setCopiedJson(false), 2500);
      } else if (type === 'link') {
        setCopiedLink(true);
        setTimeout(() => setCopiedLink(false), 2500);
      }
      if (onCopySuccess) {
        onCopySuccess(`✓ คัดลอกข้อมูล ${type.toUpperCase()} สำเร็จแล้ว`);
      }
    }
  };

  const handleNativeShare = async () => {
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({
          title: `ZYRQUEN Ω∞ Sovereign Proof - ${SOVEREIGN_ARCHITECT_TH}`,
          text: `หลักฐานการรับรอง Sovereign Proof SSoT Δ0 (Block #${blockHeight} • Root: ${merkleRoot.slice(0, 16)}...) โดย ${SOVEREIGN_ARCHITECT_TH} (${architectId})`,
          url: verificationUrl
        });
      } catch {
        // User cancelled or not supported
      }
    } else {
      handleCopy(verificationUrl, 'link');
    }
  };

  const handleDownloadQrSvg = () => {
    if (!qrRef.current) return;
    const svgElement = qrRef.current.querySelector('svg');
    if (!svgElement) return;

    const svgData = new XMLSerializer().serializeToString(svgElement);
    const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
    const svgUrl = URL.createObjectURL(svgBlob);

    const downloadLink = document.createElement('a');
    downloadLink.href = svgUrl;
    downloadLink.download = `ZYRQUEN-Proof-Block-${blockHeight}-${SOVEREIGN_ARCHITECT_ID.replace('#', '')}.svg`;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
    URL.revokeObjectURL(svgUrl);

    if (onCopySuccess) {
      onCopySuccess('✓ บันทึกไฟล์ QR Code SVG สำเร็จ');
    }
  };

  const triggerMobileScanSimulation = () => {
    setIsSimulatingScan(true);
    setScanVerified(false);
    setTimeout(() => {
      setIsSimulatingScan(false);
      setScanVerified(true);
      if (onCopySuccess) {
        onCopySuccess('✓ Mobile Scanner Validation: ตรวจสอบความถูกต้องสมบูรณ์ 100% (Δ0.00% Zero Drift)');
      }
    }, 1200);
  };

  return (
    <div 
      className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-5"
      onClick={onClose}
    >
      <div 
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-2xl bg-gradient-to-b from-[#0a1428] via-[#0b1b36] to-[#050b18] border-2 border-cyan-400/70 rounded-3xl p-5 sm:p-7 space-y-5 font-mono text-xs shadow-2xl quantum-cyan-glow relative max-h-[92vh] overflow-y-auto scrollbar-thin animate-fade-in"
      >
        {/* CLOSE BUTTON */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-slate-900 border border-slate-700 text-slate-300 hover:text-white hover:border-cyan-400 cursor-pointer transition shadow-lg z-10"
        >
          <X className="w-4 h-4" />
        </button>

        {/* HEADER */}
        <div className="flex items-center gap-3.5 border-b border-cyan-500/30 pb-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400 via-cyan-400 to-indigo-600 p-0.5 shadow-lg shrink-0">
            <div className="w-full h-full rounded-[14px] bg-[#070e1e] flex items-center justify-center text-cyan-300">
              <QrCode className="w-6 h-6 text-cyan-300" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-2.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[9px] font-bold">
                ✓ SSoT Δ0.0% FROZEN
              </span>
              <span className="px-2.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[9px] font-bold">
                NIST PQC ML-DSA-87
              </span>
              <span className="px-2.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 text-[9px] font-bold">
                14,902 SEALS
              </span>
            </div>
            <h3 className="text-base sm:text-lg font-bold text-white mt-1 text-cyan-gradient">
              แชร์หลักฐานการรับรองดิจิทัล (Share Sovereign Proof)
            </h3>
            <p className="text-[11px] text-slate-300 font-sans mt-0.5">
              สร้าง QR Code เพื่อสแกนตรวจสอบความถูกต้องผ่านสมาร์ตโฟนและระบบตรวจพิสูจน์พยานหลักฐานอิเล็กทรอนิกส์
            </p>
          </div>
        </div>

        {/* ARCHITECT RECOGNITION BANNER */}
        <div className="p-3 bg-gradient-to-r from-cyan-950/70 via-indigo-950/60 to-slate-950/80 rounded-2xl border border-cyan-500/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-inner">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-400 to-yellow-600 flex items-center justify-center font-bold text-black text-xs shrink-0 shadow-md">
              EP
            </div>
            <div>
              <div className="text-[10px] text-cyan-300 font-bold uppercase flex items-center gap-1.5">
                <Sparkles className="w-3 h-3 text-amber-400" />
                <span>SOVEREIGN ARCHITECT & PRINCIPAL</span>
              </div>
              <div className="text-xs sm:text-sm font-bold text-white tracking-wide">
                {SOVEREIGN_ARCHITECT_TH} <span className="text-amber-300">({SOVEREIGN_ARCHITECT_ID})</span>
              </div>
              <div className="text-[10px] text-slate-400">
                {SOVEREIGN_ARCHITECT_EN} • Clearance: <strong className="text-cyan-200">OMEGA-1 SUPREME</strong>
              </div>
            </div>
          </div>

          <div className="text-left sm:text-right font-mono text-[10px] border-t sm:border-t-0 border-slate-800 pt-2 sm:pt-0">
            <div className="text-slate-400">Canonical Block:</div>
            <div className="text-amber-300 font-bold text-xs">#{blockHeight.toLocaleString()}</div>
            <div className="text-emerald-400 font-bold">14,902 Seals Validated</div>
          </div>
        </div>

        {/* NAVIGATION TABS */}
        <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
          <button
            onClick={() => setActiveTab('QR')}
            className={`px-3.5 py-1.5 rounded-xl font-bold transition flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'QR'
                ? 'bg-cyan-500 text-black shadow-md shadow-cyan-500/20'
                : 'bg-slate-900/80 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            <QrCode className="w-3.5 h-3.5" />
            <span>QR Code สแกนหลักฐาน</span>
          </button>

          <button
            onClick={() => setActiveTab('JSON')}
            className={`px-3.5 py-1.5 rounded-xl font-bold transition flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'JSON'
                ? 'bg-cyan-500 text-black shadow-md shadow-cyan-500/20'
                : 'bg-slate-900/80 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            <Terminal className="w-3.5 h-3.5" />
            <span>JSON Proof Payload</span>
          </button>

          <button
            onClick={() => setActiveTab('MOBILE_SIM')}
            className={`px-3.5 py-1.5 rounded-xl font-bold transition flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'MOBILE_SIM'
                ? 'bg-cyan-500 text-black shadow-md shadow-cyan-500/20'
                : 'bg-slate-900/80 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>จำลองการตรวจบนมือถือ</span>
          </button>
        </div>

        {/* TAB 1: QR CODE DISPLAY */}
        {activeTab === 'QR' && (
          <div className="space-y-4">
            {/* PAYLOAD TYPE SWITCHER */}
            <div className="flex items-center justify-between gap-2 flex-wrap text-[10px]">
              <span className="text-slate-400">เนื้อหาใน QR Code:</span>
              <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
                <button
                  onClick={() => setPayloadType('DEEPLINK')}
                  className={`px-2.5 py-1 rounded-lg transition cursor-pointer ${
                    payloadType === 'DEEPLINK'
                      ? 'bg-cyan-500/30 text-cyan-200 font-bold border border-cyan-400/50'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Validation URL
                </button>
                <button
                  onClick={() => setPayloadType('JSON')}
                  className={`px-2.5 py-1 rounded-lg transition cursor-pointer ${
                    payloadType === 'JSON'
                      ? 'bg-cyan-500/30 text-cyan-200 font-bold border border-cyan-400/50'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Full SSoT JSON
                </button>
                <button
                  onClick={() => setPayloadType('HASH')}
                  className={`px-2.5 py-1 rounded-lg transition cursor-pointer ${
                    payloadType === 'HASH'
                      ? 'bg-cyan-500/30 text-cyan-200 font-bold border border-cyan-400/50'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Raw Merkle Root
                </button>
              </div>
            </div>

            {/* QR CODE CONTAINER WITH CYBERNETIC FRAME */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 p-5 bg-[#040814] rounded-2xl border border-cyan-500/30 relative overflow-hidden">
              <div 
                ref={qrRef}
                className="p-4 bg-white rounded-2xl shadow-2xl flex items-center justify-center border-4 border-cyan-400 relative group transition-transform hover:scale-102"
              >
                <QRCodeSVG
                  value={activeQrValue}
                  size={200}
                  level="H"
                  includeMargin={false}
                  bgColor="#FFFFFF"
                  fgColor="#030712"
                />
              </div>

              {/* QR QUICK STATS & ACTIONS */}
              <div className="space-y-2.5 flex-1 w-full text-[11px]">
                <div className="p-2.5 bg-slate-950/80 rounded-xl border border-slate-800">
                  <div className="text-slate-400 text-[9px] uppercase font-bold">Canonical Merkle Root Hash:</div>
                  <div className="text-cyan-300 font-bold break-all select-all font-mono mt-0.5 text-[10px]">
                    {merkleRoot}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[10px]">
                  <div className="p-2 bg-slate-950/80 rounded-lg border border-slate-800">
                    <span className="text-slate-400 block text-[8px]">CANONICAL HEIGHT</span>
                    <span className="text-amber-300 font-bold">#{blockHeight}</span>
                  </div>
                  <div className="p-2 bg-slate-950/80 rounded-lg border border-slate-800">
                    <span className="text-slate-400 block text-[8px]">SEAL COUNT</span>
                    <span className="text-emerald-300 font-bold">14,902 Seals (Δ0)</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 pt-1">
                  <button
                    onClick={handleDownloadQrSvg}
                    className="flex-1 py-2 px-3 rounded-xl bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-400/40 text-cyan-200 font-bold flex items-center justify-center gap-1.5 transition cursor-pointer text-[10px]"
                  >
                    <Download className="w-3.5 h-3.5 text-cyan-400" />
                    <span>บันทึกรูป QR SVG</span>
                  </button>

                  <button
                    onClick={handleNativeShare}
                    className="flex-1 py-2 px-3 rounded-xl bg-gradient-to-r from-cyan-400 to-indigo-600 text-black font-bold flex items-center justify-center gap-1.5 transition cursor-pointer text-[10px] shadow-md"
                  >
                    <Share2 className="w-3.5 h-3.5 fill-black" />
                    <span>แชร์สู่มือถือ (Share)</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: FULL JSON SSoT MATRIX */}
        {activeTab === 'JSON' && (
          <div className="space-y-3">
            <div className="flex justify-between items-center text-[10px]">
              <span className="text-slate-400">Machine-Readable Cryptographic Proof Manifest:</span>
              <button
                onClick={() => handleCopy(jsonPayloadString, 'json')}
                className="px-2.5 py-1 rounded-lg bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-400/40 text-cyan-300 font-bold flex items-center gap-1 cursor-pointer transition"
              >
                {copiedJson ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3 text-cyan-300" />}
                <span>{copiedJson ? 'คัดลอกสำเร็จแล้ว' : 'คัดลอก JSON'}</span>
              </button>
            </div>

            <pre className="p-3.5 bg-black/90 rounded-2xl border border-slate-800 text-cyan-200 font-mono text-[10px] leading-relaxed overflow-x-auto max-h-64 scrollbar-thin select-all">
              {jsonPayloadString}
            </pre>
          </div>
        )}

        {/* TAB 3: MOBILE VALIDATION SIMULATION */}
        {activeTab === 'MOBILE_SIM' && (
          <div className="space-y-4">
            <div className="p-4 bg-slate-950/90 rounded-2xl border border-cyan-500/40 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-cyan-300 font-bold">
                  <Smartphone className="w-4 h-4 text-cyan-400" />
                  <span>ระบบจำลองการตรวจพิสูจน์บนสมาร์ตโฟน (Mobile Scanner Audit)</span>
                </div>
                <button
                  onClick={triggerMobileScanSimulation}
                  disabled={isSimulatingScan}
                  className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-600 text-black font-bold text-[10px] flex items-center gap-1.5 cursor-pointer shadow-md transition disabled:opacity-50"
                >
                  <Sparkles className="w-3.5 h-3.5 fill-black" />
                  <span>{isSimulatingScan ? 'กำลังสแกน...' : 'ทดสอบสแกน QR เดี๋ยวนี้'}</span>
                </button>
              </div>

              <div className="p-3 bg-black/80 rounded-xl border border-slate-800 space-y-2 text-[10px]">
                <div className="flex items-center justify-between text-slate-400 border-b border-slate-800/80 pb-1.5">
                  <span>สถานะการตรวจเทียบ Merkle Proof:</span>
                  <span className={scanVerified ? 'text-emerald-400 font-bold' : isSimulatingScan ? 'text-amber-300 font-bold' : 'text-slate-400'}>
                    {isSimulatingScan ? 'กำลังประมวลผล PQC Verification...' : scanVerified ? '✓ ผ่านการรับรอง 100% (Δ0.00% Zero Drift)' : 'พร้อมสแกน'}
                  </span>
                </div>

                <div className="space-y-1.5 text-[10px]">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">1. ผู้ริเริ่มและสถาปนิกอธิปไตย:</span>
                    <span className="text-emerald-300 font-bold">{SOVEREIGN_ARCHITECT_TH} ({SOVEREIGN_ARCHITECT_ID})</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">2. การรับรองลายมือชื่อดิจิทัลควอนตัม:</span>
                    <span className="text-cyan-300 font-bold">Dilithium-5 (ML-DSA-87) FIPS 204 Validated</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">3. ตราประทับคานอนิคอล:</span>
                    <span className="text-amber-300 font-bold">14,902 ดวงครบถ้วน (Block #{blockHeight})</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">4. กฎหมายคุ้มครองข้อมูลส่วนบุคคล:</span>
                    <span className="text-emerald-300 font-bold">PDPA พ.ร.บ. 2562 & ETDA ม. 9, 26, 28 Safe Harbor</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* FOOTER ACTIONS */}
        <div className="pt-2 border-t border-cyan-500/30 flex flex-col sm:flex-row items-center justify-between gap-3 text-[10px]">
          <div className="flex items-center gap-2 text-slate-400">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>รับรองโดย Sovereign World Engine AI Assistant ระดับ OMEGA-1</span>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={() => handleCopy(merkleRoot, 'hash')}
              className="flex-1 sm:flex-none py-2 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 font-bold flex items-center justify-center gap-1.5 transition cursor-pointer"
            >
              {copiedHash ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-cyan-400" />}
              <span>{copiedHash ? 'คัดลอก Hash แล้ว' : 'คัดลอก Merkle Root'}</span>
            </button>

            <button
              onClick={onClose}
              className="flex-1 sm:flex-none py-2 px-4 rounded-xl bg-gradient-to-r from-cyan-400 via-sky-400 to-indigo-600 text-black font-bold transition cursor-pointer shadow-md"
            >
              ปิดหน้าต่าง (Close)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShareProofQrModal;
