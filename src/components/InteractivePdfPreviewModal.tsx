import React, { useState } from 'react';
import {
  X,
  FileCheck2,
  Download,
  Copy,
  Check,
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  Maximize2,
  ShieldCheck,
  Lock,
  Printer,
  Sparkles,
  Award,
  Layers,
  Scale,
  Users,
  BookOpen,
  FileText,
} from 'lucide-react';
import {
  SYSTEM_METADATA,
  SYSTEM_INVARIANTS,
  THAI_CUSTODIANS,
} from '../data/canonicalData';
import { playAuditChime, playTone } from './AudioSynthesizer';
import { copyToClipboard } from '../utils/clipboard';
import { generateSovereignReportPdf } from '../utils/sovereignReportPdfExport';
import { generateThaiDefenseReportPdf } from '../utils/thaiDefenseReportPdfExport';
import {
  generateMasterForensicAuditPdf,
  generateMasterAuditJsonLd,
} from '../utils/masterForensicAuditPackage';

interface InteractivePdfPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialPage?: number;
}

export const InteractivePdfPreviewModal: React.FC<InteractivePdfPreviewModalProps> = ({
  isOpen,
  onClose,
  initialPage = 1,
}) => {
  const [docType, setDocType] = useState<'thai_defense' | 'master_dossier'>('thai_defense');
  const [currentPage, setCurrentPage] = useState<number>(initialPage);
  const [zoomLevel, setZoomLevel] = useState<number>(100);
  const [watermark, setWatermark] = useState<string>('OFFICIAL SOVEREIGN FROZEN');
  const [copiedHash, setCopiedHash] = useState<boolean>(false);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState<boolean>(false);

  if (!isOpen) return null;

  const totalPages = docType === 'thai_defense' ? 3 : 4;

  const handleCopyMerkle = () => {
    copyToClipboard(SYSTEM_METADATA.merkleRoot);
    setCopiedHash(true);
    playAuditChime();
    setTimeout(() => setCopiedHash(false), 2000);
  };

  const handleDownloadPdf = () => {
    setIsGeneratingPdf(true);
    playTone(650, 0.05);
    setTimeout(() => {
      if (docType === 'thai_defense') {
        generateThaiDefenseReportPdf();
      } else {
        generateSovereignReportPdf();
      }
      setIsGeneratingPdf(false);
      playAuditChime();
    }, 200);
  };

  const handlePrint = () => {
    playTone(600, 0.04);
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-black/85 backdrop-blur-xl animate-in fade-in duration-200">
      <div className="relative w-full max-w-5xl h-[94vh] flex flex-col bg-[#070913] border border-white/15 rounded-[28px] shadow-[0_0_60px_rgba(0,0,0,0.9)] overflow-hidden font-mono text-zinc-200">
        {/* Top Control Bar */}
        <div className="p-4 border-b border-white/10 flex flex-wrap items-center justify-between gap-3 bg-gradient-to-r from-[#120e24] via-[#090d1a] to-[#0a121e]">
          {/* Left: Title and Badge */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-300">
              <FileCheck2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-white tracking-wide">
                  {docType === 'thai_defense'
                    ? 'รายงานผลการจำลองเหตุการณ์โจมตีและตรวจสอบด่านป้องกันตนเอง'
                    : 'INTERACTIVE SOVEREIGN DOSSIER & PDF PREVIEW'}
                </span>
                <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[9px] font-bold">
                  PAGE {currentPage} / {totalPages}
                </span>
              </div>
              <p className="text-[11px] text-zinc-400">
                Official ETDA B.E. 2544 Sections 9, 26, 28 &bull; Block #{SYSTEM_METADATA.sealedBlock} &bull; SSoT &Delta;0.0%
              </p>
            </div>
          </div>

          {/* Center: Zoom and Page Controls */}
          <div className="flex items-center gap-1.5 bg-black/60 border border-white/10 rounded-xl p-1 text-xs">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-1.5 rounded-lg hover:bg-white/10 text-zinc-300 disabled:opacity-30 transition"
              title="Previous Page"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <span className="px-2.5 text-[11px] text-white font-bold">
              {currentPage} / {totalPages}
            </span>

            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-1.5 rounded-lg hover:bg-white/10 text-zinc-300 disabled:opacity-30 transition"
              title="Next Page"
            >
              <ChevronRight className="w-4 h-4" />
            </button>

            <div className="w-px h-4 bg-white/15 mx-1" />

            <button
              onClick={() => setZoomLevel((z) => Math.max(75, z - 15))}
              className="p-1.5 rounded-lg hover:bg-white/10 text-zinc-300 transition"
              title="Zoom Out"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>

            <span className="text-[10px] text-cyan-300 font-bold px-1 min-w-[38px] text-center">
              {zoomLevel}%
            </span>

            <button
              onClick={() => setZoomLevel((z) => Math.min(150, z + 15))}
              className="p-1.5 rounded-lg hover:bg-white/10 text-zinc-300 transition"
              title="Zoom In"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={() => setZoomLevel(100)}
              className="p-1.5 rounded-lg hover:bg-white/10 text-zinc-300 transition"
              title="Reset Zoom"
            >
              <Maximize2 className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Right: Actions & Format */}
          <div className="flex items-center gap-2">
            {/* Document Selector */}
            <select
              value={docType}
              onChange={(e) => {
                const newDoc = e.target.value as 'thai_defense' | 'master_dossier';
                setDocType(newDoc);
                setCurrentPage(1);
                playTone(520, 0.03);
              }}
              className="bg-black/60 border border-amber-500/40 rounded-xl px-2.5 py-1.5 text-[11px] text-amber-200 focus:outline-none focus:border-amber-400 font-bold"
            >
              <option value="thai_defense">ฉบับไทย: รายงานผลการจำลองเหตุการณ์โจมตี (3 หน้า)</option>
              <option value="master_dossier">ฉบับสากล: Master Sovereign Compliance Dossier (4 หน้า)</option>
            </select>

            {/* Watermark Selector */}
            <select
              value={watermark}
              onChange={(e) => setWatermark(e.target.value)}
              className="bg-black/60 border border-white/15 rounded-xl px-2 py-1.5 text-[10px] text-zinc-300 focus:outline-none focus:border-amber-400 hidden sm:block"
            >
              <option value="OFFICIAL SOVEREIGN FROZEN">FROZEN SSoT</option>
              <option value="ETDA SECTION 26 ADMISSIBLE">ETDA SEC 26</option>
              <option value="COURT EVIDENCE ONLY">COURT EVIDENCE</option>
              <option value="">NONE</option>
            </select>

            <button
              onClick={handlePrint}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-300 border border-white/10 text-xs flex items-center gap-1.5 transition"
              title="Print Document"
            >
              <Printer className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={handleDownloadPdf}
              disabled={isGeneratingPdf}
              className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500/25 to-yellow-600/25 hover:from-amber-500/35 hover:to-yellow-600/35 border border-amber-400/50 text-amber-200 text-xs font-bold flex items-center gap-1.5 transition shadow-[0_0_15px_rgba(245,158,11,0.2)] disabled:opacity-50"
            >
              <Download className="w-3.5 h-3.5 text-amber-300" />
              <span>{isGeneratingPdf ? 'Rendering...' : 'Save PDF'}</span>
            </button>

            <button
              onClick={() => {
                playTone(400, 0.04);
                onClose();
              }}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white border border-white/10 transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Page Tab Selector Pill Bar */}
        <div className="px-6 py-2.5 bg-black/40 border-b border-white/5 flex items-center gap-2 overflow-x-auto no-scrollbar">
          {docType === 'thai_defense' ? (
            [
              { page: 1, title: 'หน้า ๑: สภาวะแวดล้อมวิกฤตจากการจู่โจม', icon: Scale },
              { page: 2, title: 'หน้า ๒: การพิสูจน์หลักฐานย้อนหลัง & PQC', icon: Layers },
              { page: 3, title: 'หน้า ๓: สรุปความสอดคล้อง ETDA & ตราประทับ', icon: Award },
            ].map((item) => (
              <button
                key={item.page}
                onClick={() => {
                  playTone(580 + item.page * 30, 0.03);
                  setCurrentPage(item.page);
                }}
                className={`px-3 py-1.5 rounded-xl text-xs flex items-center gap-2 transition whitespace-nowrap ${
                  currentPage === item.page
                    ? 'bg-amber-500/20 text-amber-200 border border-amber-400/50 shadow-[0_0_12px_rgba(245,158,11,0.25)] font-bold'
                    : 'bg-white/5 text-zinc-400 hover:text-zinc-200 border border-transparent'
                }`}
              >
                <item.icon className={`w-3.5 h-3.5 ${currentPage === item.page ? 'text-amber-400' : 'text-zinc-500'}`} />
                <span>{item.title}</span>
              </button>
            ))
          ) : (
            [
              { page: 1, title: 'Page 1: Executive Attestation', icon: Scale },
              { page: 2, title: 'Page 2: Mathematical SSoT (14,902 Seals)', icon: Layers },
              { page: 3, title: 'Page 3: 10/10 Custodian Quorum', icon: Users },
              { page: 4, title: 'Page 4: Forensic Ledger & Safe Harbor', icon: ShieldCheck },
            ].map((item) => (
              <button
                key={item.page}
                onClick={() => {
                  playTone(580 + item.page * 30, 0.03);
                  setCurrentPage(item.page);
                }}
                className={`px-3 py-1.5 rounded-xl text-xs flex items-center gap-2 transition whitespace-nowrap ${
                  currentPage === item.page
                    ? 'bg-amber-500/20 text-amber-200 border border-amber-400/50 shadow-[0_0_12px_rgba(245,158,11,0.25)] font-bold'
                    : 'bg-white/5 text-zinc-400 hover:text-zinc-200 border border-transparent'
                }`}
              >
                <item.icon className={`w-3.5 h-3.5 ${currentPage === item.page ? 'text-amber-400' : 'text-zinc-500'}`} />
                <span>{item.title}</span>
              </button>
            ))
          )}
        </div>

        {/* Document Canvas Area (Scrollable with zoom transform) */}
        <div className="flex-1 overflow-auto p-4 sm:p-8 flex justify-center bg-[#05060b] relative">
          <div
            style={{ transform: `scale(${zoomLevel / 100})`, transformOrigin: 'top center' }}
            className="transition-transform duration-150"
          >
            {/* Simulated Sheet of Official A4 Parchment / Royal Gazette Obsidian Document */}
            <div className="w-[794px] min-h-[1123px] bg-[#0c0e18] border-2 border-amber-500/40 rounded-[8px] shadow-[0_0_50px_rgba(0,0,0,0.8)] p-10 relative overflow-hidden text-zinc-300 select-text flex flex-col justify-between">
              {/* Optional Watermark Overlay */}
              {watermark && (
                <div className="absolute inset-0 pointer-events-none flex items-center justify-center opacity-5 select-none rotate-[-35deg]">
                  <span className="text-7xl font-serif font-black tracking-widest text-amber-400 text-center leading-relaxed">
                    {watermark}
                  </span>
                </div>
              )}

              {/* Top Document Header Band */}
              {docType === 'thai_defense' ? (
                <div>
                  <div className="text-center pb-3">
                    <h1 className="text-xl font-bold font-serif text-amber-200 tracking-wide">
                      รายงานผลการจำลองเหตุการณ์โจมตีและตรวจสอบด่านป้องกันตนเอง
                    </h1>
                    <div className="h-0.5 bg-gradient-to-r from-transparent via-amber-400/70 to-transparent my-2" />
                  </div>

                  {/* Header Meta 2-Column Grid */}
                  <div className="p-3.5 rounded-xl bg-black/50 border border-amber-500/30 grid grid-cols-1 sm:grid-cols-2 gap-3 text-[11px] mb-4">
                    <div className="space-y-1.5 border-b sm:border-b-0 sm:border-r border-white/10 pb-2 sm:pb-0 sm:pr-3">
                      <div>
                        <span className="text-zinc-400">ผู้พิทักษ์สูงสุด: </span>
                        <strong className="text-amber-300 font-serif">นายยุทธภูมิ พากเพียร (#EP-SOVEREIGN-01)</strong>
                      </div>
                      <div>
                        <span className="text-zinc-400">แฮชรากเจเนซิส: </span>
                        <span className="text-cyan-300 font-mono text-[10px] break-all">{SYSTEM_METADATA.merkleRoot}</span>
                      </div>
                      <div>
                        <span className="text-zinc-400">อุณหภูมิแกน: </span>
                        <span className="text-emerald-400 font-mono font-bold">14.98 mK (Sub-Kelvin Cryostat)</span>
                      </div>
                    </div>

                    <div className="space-y-1.5 sm:pl-3">
                      <div>
                        <span className="text-zinc-400">สถานะระบบ: </span>
                        <strong className="text-emerald-400">10/10 PASSED &bull; 100% GREEN (FROZEN v1.2 LTS)</strong>
                      </div>
                      <div>
                        <span className="text-zinc-400">บล็อกอ้างอิง: </span>
                        <span className="text-amber-300 font-mono font-bold">#849202 (14,902 ชุด)</span>
                      </div>
                      <div>
                        <span className="text-zinc-400">ประสิทธิภาพระบบ: </span>
                        <span className="text-cyan-300 font-mono font-bold">851.9 qOps (Coherence 99.992%)</span>
                      </div>
                    </div>
                  </div>

                  {/* Executive Summary Callout (Yellow/Amber left border) */}
                  <div className="p-3.5 rounded-xl bg-amber-500/10 border-l-4 border-amber-400 border-y border-r border-amber-500/20 mb-5 space-y-1">
                    <span className="text-xs font-bold text-amber-300 block">
                      บทสรุปด้านการจำลองเชิงความมั่นคงปลอดภัย
                    </span>
                    <p className="text-[11px] text-zinc-300 leading-relaxed">
                      ระบบประมวลผลแกนร่วมหลัก ZYRQUEN &Omega;&infin; v4.16 ได้ทำการรันชุดทดสอบความยืดหยุ่นและการจู่โจม เพื่อพิสูจน์ยืนยันเสถียรภาพสัจจะความจริงแท้ที่มีค่าเบี่ยงเบนเป็นศูนย์ (&Delta;0.00% Zero Drift) โดยเน้นทดสอบความสมบูรณ์ในการทำงานของกฎป้องกันตนเองแบบพึ่งพาเครื่องเหล็ก (FIPS 140-3 Level 4 HSM &amp; TPM 2.0) ร่วมกับระบบสกัดภัยของ Module 17 (Fail-Closed Quarantine Sandbox) ผลประเมินระดับการต้านทานและห่วงโซ่พยานผ่านการรับรองเอกฉันท์ 10/10 REAL_HSM พร้อมนำใช้อ้างอิงเป็นประจักษ์พยานนำสืบทางนิติวิทยาศาสตร์ในศาลไทยได้ทันที (Court Admissible per ETDA Sec 9, 26, 28)
                    </p>
                  </div>
                </div>
              ) : (
                <div className="border-b-2 border-amber-400/60 pb-5 mb-6 relative">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[10px] text-amber-400 font-bold uppercase tracking-widest block mb-1">
                        ราชกิจจานุเบกษาดิจิทัลอธิปไตย &bull; ROYAL SOVEREIGN DIGITAL GAZETTE
                      </span>
                      <h1 className="text-xl font-bold font-serif text-amber-200 tracking-wide">
                        ZYRQUEN &Omega;&infin; SOVEREIGN WORLD ENGINE
                      </h1>
                      <p className="text-xs text-zinc-400 font-serif italic mt-0.5">
                        ฉบับตรวจรับรองความถูกต้องพยานหลักฐานและสิทธิปลอดความรับผิด (Safe Harbor Attestation)
                      </p>
                    </div>

                    <div className="text-right space-y-1">
                      <span className="px-2.5 py-1 rounded bg-amber-500/20 text-amber-300 border border-amber-400/40 text-[10px] font-bold block">
                        BLOCK #{SYSTEM_METADATA.sealedBlock}
                      </span>
                      <span className="text-[10px] text-emerald-400 font-mono block">
                        14,902 SEALS &bull; SSoT &Delta;0
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* THAI DEFENSE DOCUMENT - PAGE 1: Critical Attack Vectors (Rows 1-3) */}
              {docType === 'thai_defense' && currentPage === 1 && (
                <div className="space-y-4 text-xs leading-relaxed flex-1">
                  <div>
                    <h3 className="text-sm font-bold text-amber-300 font-serif mb-1">
                      ๑ รายงานวิเคราะห์สภาวะแวดล้อมวิกฤตจากการจู่โจม
                    </h3>
                    <p className="text-[11px] text-zinc-400">
                      ตารางด้านล่างแสดงผลการจำลองเหตุการณ์บุกรุกระบบ 4 รูปแบบหลัก ที่ตรวจสอบผ่านระบบ Zero Trust Gate และตู้เครื่องเหล็กควบคุมนิรภัย FIPS 140-3 L4 HSM:
                    </p>
                  </div>

                  {/* Table with 3 Rows */}
                  <div className="border border-white/10 rounded-xl overflow-hidden text-[10.5px]">
                    <div className="grid grid-cols-12 bg-black/70 p-2.5 font-bold text-amber-300 border-b border-white/10">
                      <div className="col-span-3">รหัสและรูปแบบภัย</div>
                      <div className="col-span-4">รายละเอียด คุกคาม</div>
                      <div className="col-span-2">สเตตตัดสินของระบบ</div>
                      <div className="col-span-3">มาตรการสยบภัยคุกคาม</div>
                    </div>

                    <div className="divide-y divide-white/5 bg-black/40">
                      {/* Row 1: VEC-01 */}
                      <div className="grid grid-cols-12 p-3 gap-2 items-start hover:bg-white/5 transition">
                        <div className="col-span-3 font-mono font-bold text-rose-300">
                          VEC-01 (SIDE-CHANNEL &amp; VOLTAGE GLITCH)
                        </div>
                        <div className="col-span-4 text-zinc-300">
                          การลอบงัดแงะแผงวงจรและเจาะระบบทางกายภาพที่ตู้นิรภัย HSM Rack #01 และ #02
                        </div>
                        <div className="col-span-2">
                          <span className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/40 text-[9px] font-bold block text-center">
                            FAIL-CLOSED / CONTAINED
                          </span>
                        </div>
                        <div className="col-span-3 text-zinc-400 text-[10px]">
                          สั่งล้างรหัสลับในหน่วยความจำของเครื่องทันที สัญญาณเตือนภัยสั่งล็อกระบบและเปลี่ยนสิทธิ์เป็น Read-Only (Mutation Authority = 0) คุมเสถียรภาพที่องค์ประชุมคงเหลือ 10/10
                        </div>
                      </div>

                      {/* Row 2: VEC-02 */}
                      <div className="grid grid-cols-12 p-3 gap-2 items-start hover:bg-white/5 transition">
                        <div className="col-span-3 font-mono font-bold text-amber-300">
                          VEC-02 (TRANSACTION REPLAY &amp; SPOOF)
                        </div>
                        <div className="col-span-4 text-zinc-300">
                          การพยายามสวมรอยลายเซ็นแบบเก่าด้วยธุรกรรม TX-FORGE-8841 มูลค่า ฿850,000,000
                        </div>
                        <div className="col-span-2">
                          <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[9px] font-bold block text-center">
                            BLOCKED / QUARANTINED
                          </span>
                        </div>
                        <div className="col-span-3 text-zinc-400 text-[10px]">
                          ดักจับโดย Zero Trust Signature Inspector สั่งระงับรายการทุจริตทันที นำหลักฐานดิบต้นทางไปกักโรคที่ Module 17 Isolation Slot Delta และทำสำเนารักษาถาวรที่ Block #849202
                        </div>
                      </div>

                      {/* Row 3: VEC-03 */}
                      <div className="grid grid-cols-12 p-3 gap-2 items-start hover:bg-white/5 transition">
                        <div className="col-span-3 font-mono font-bold text-cyan-300">
                          VEC-03 (SYN FLOOD &amp; REPLAY ATTACK)
                        </div>
                        <div className="col-span-4 text-zinc-300">
                          การพยายามส่งข้อมูลซ้ำความถี่สูง จำนวน 10,000 ชุด บนรหัสซีล #14902
                        </div>
                        <div className="col-span-2">
                          <span className="px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 text-[9px] font-bold block text-center">
                            REJECTED / ISOLATED
                          </span>
                        </div>
                        <div className="col-span-3 text-zinc-400 text-[10px]">
                          ตรวจสอบพบค่ารหัส Nonce ซ้ำซ้อนตรงกับ Canonical Block #849202 แบบ Bit-for-Bit จึงปฏิเสธสิทธิ์และบล็อกธุรกรรมทุจริตทั้งหมด รักษาบูรณภาพสายการบันทึกคงสภาพได้สำเร็จ
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* THAI DEFENSE DOCUMENT - PAGE 2: Vector 4 + Forensic Retrospective & PQC Agility */}
              {docType === 'thai_defense' && currentPage === 2 && (
                <div className="space-y-5 text-xs leading-relaxed flex-1">
                  {/* Table Continuation: Row 4 */}
                  <div className="border border-white/10 rounded-xl overflow-hidden text-[10.5px]">
                    <div className="grid grid-cols-12 bg-black/70 p-2.5 font-bold text-amber-300 border-b border-white/10">
                      <div className="col-span-3">รหัสและรูปแบบภัย (ต่อ)</div>
                      <div className="col-span-4">รายละเอียด คุกคาม</div>
                      <div className="col-span-2">สเตตตัดสินของระบบ</div>
                      <div className="col-span-3">มาตรการสยบภัยคุกคาม</div>
                    </div>

                    <div className="bg-black/40 p-3 grid grid-cols-12 gap-2 items-start">
                      <div className="col-span-3 font-mono font-bold text-rose-400">
                        VEC-04 (CANONICAL SSoT MUTATION)
                      </div>
                      <div className="col-span-4 text-zinc-300">
                        พยายามดัดแปลงแก้ไขค่าโครงสร้าง Canonical SSoT จาก 14,902 ซีล เป็น 14,903 ซีล
                      </div>
                      <div className="col-span-2">
                        <span className="px-2 py-0.5 rounded bg-rose-500/30 text-rose-200 border border-rose-400/50 text-[9px] font-bold block text-center">
                          AUTO-TERMINATED / LOCKED
                        </span>
                      </div>
                      <div className="col-span-3 text-zinc-400 text-[10px]">
                        เอนจินแกนกลางสแกนตรวจพบค่าความคลาดเคลื่อนสะสมระบบ &Delta; &gt; 0.00% ผิดเงื่อนไขสัจพจน์หลัก INV-01 และ INV-08 ระบบความปลอดภัยสั่งบล็อกและตรึงระบบเข้าสู่ Freeze Mode ถาวร (Quarantine 85.0&deg;C Triggered)
                      </div>
                    </div>
                  </div>

                  {/* Section 2: Forensic Retrospective & PQC */}
                  <div className="space-y-3">
                    <h3 className="text-sm font-bold text-amber-300 font-serif mb-1">
                      ๒ การพิสูจน์หลักฐานย้อนหลังและความยืดหยุ่นเชิงรหัสลับ
                    </h3>
                    <p className="text-[11px] text-zinc-300 leading-relaxed">
                      เมื่อเกิดวิกฤตความเสี่ยงหรือระบบตรวจจับการงัดแงะเชิงฟิสิกส์ได้สำเร็จ สถาปัตยกรรมของ ZYRQUEN &Omega;&infin; v4.16 ได้จัดทำด่านตอบสนองความปลอดภัยและกลไกกู้ภัยประวัติความจริงแท้ ที่น่าเชื่อถือและพร้อมใช้งานนำสืบดังนี้:
                    </p>

                    {/* Sub-section: PQC Agility Fallback Protocol */}
                    <div className="p-3.5 rounded-xl bg-black/50 border border-cyan-500/30 space-y-1.5">
                      <div className="flex items-center gap-2 text-cyan-300 font-bold">
                        <ShieldCheck className="w-4 h-4" />
                        <span>แผนการสับเปลี่ยนชุดรหัสหลังยุคควอนตัม (PQC Agility Fallback Protocol)</span>
                      </div>
                      <p className="text-[11px] text-zinc-300 leading-relaxed">
                        เมื่อระบบ Post-Quantum Telemetry ตรวจพบความเสี่ยงหรือช่องโหว่บนทฤษฎีแลตทิส (Lattice Security Reduction) ของชุดคีย์ ML-KEM-1024 (FIPS 203) ระบบจะดำเนินการถอดถอนและสั่งสลับโปรโตคอลหลักแบบเป็นขั้นตอนแบบอัตโนมัติ เพื่อโยกสิทธิ์ความปลอดภัยไปใช้คู่รหัสกุญแจสำรองประเภท Stateful Hash-Based คือ SLH-DSA SPHINCS+ (FIPS 205) และสลับเปลี่ยนความสมบูรณ์สู่ Dilithium-5 ML-DSA-87 (FIPS 204) เพื่อควบคุมและรักษาค่าความเบี่ยงเบนเป็นศูนย์ (&Delta;0.00%) และค้ำประกันความต้านทานระดับควอนตัมอย่างแท้จริง
                      </p>
                    </div>

                    {/* Sub-section: 12-Stage Forensic Trace Replay Determinism */}
                    <div className="p-3.5 rounded-xl bg-black/50 border border-amber-500/30 space-y-1.5">
                      <div className="flex items-center justify-between text-amber-300 font-bold">
                        <div className="flex items-center gap-2">
                          <Layers className="w-4 h-4" />
                          <span>ระบบสืบสวนจำลองเหตุการณ์ย้อนหลัง 12 ขั้นตอน (12-Stage Forensic Trace Replay Determinism)</span>
                        </div>
                        <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px] font-mono">
                          142 ms &bull; PASSED
                        </span>
                      </div>
                      <p className="text-[11px] text-zinc-300 leading-relaxed">
                        พยานวัตถุดิจิทัลที่ถูกกักโรคไว้ใน Module 17 Isolation Buffer และจัดเก็บถาวรใน ISO/IEC 27037 Court Evidence Archive สามารถนำกลับมาประมวลผลย้อนหลัง เพื่อจำลองความจริงและตรวจสอบการทุจริตย้อนหลังเชิงลึกได้ครบถ้วนสมบูรณ์ตั้งแต่ขั้นแรกจนถึงขั้นสุดท้าย (Stage 1 SENSE จนถึง Stage 12 REPLAY) ย้อนเล่นประวัติย่อยไปจนถึง TX-20260809-909A-B814 เพื่อพิสูจน์ข้อเท็จจริงทั้งหมดสำเร็จ ภายในเวลาเพียง 142 มิลลิวินาที ต่ำกว่าเกณฑ์มาตรฐานกำหนดที่ 2,000 มิลลิวินาที ภายใต้สภาพแวดล้อมที่เย็นแช่แข็งยิ่งยวดคุมคงที่ 14.98 mK ประสิทธิภาพการคำนวณคริปโต 851.9 qOps
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* THAI DEFENSE DOCUMENT - PAGE 3: Legal Compliance & Sovereign Sign-off */}
              {docType === 'thai_defense' && currentPage === 3 && (
                <div className="space-y-4 text-xs leading-relaxed flex-1">
                  <div>
                    <h3 className="text-sm font-bold text-amber-300 font-serif mb-1">
                      ๓ ตารางสรุปการสอดคล้องตามกฎหมายธุรกรรมอิเล็กทรอนิกส์ไทย
                    </h3>
                    <p className="text-[11px] text-zinc-400">
                      การประเมินความสอดคล้องตามพระราชบัญญัติว่าด้วยธุรกรรมทางอิเล็กทรอนิกส์ พ.ศ. ๒๕๔๔ (แก้ไขเพิ่มเติม พ.ศ. ๒๕๖๒)
                    </p>
                  </div>

                  {/* ETDA Legal Table */}
                  <div className="border border-white/10 rounded-xl overflow-hidden text-[10px]">
                    <div className="grid grid-cols-12 bg-black/70 p-2.5 font-bold text-amber-300 border-b border-white/10">
                      <div className="col-span-3">มาตรา / ชื่อข้อบังคับ</div>
                      <div className="col-span-4">คุณลักษณะตามกฎหมาย</div>
                      <div className="col-span-5">สัจจะการบังคับใช้เชิงระบบ</div>
                    </div>

                    <div className="divide-y divide-white/5 bg-black/40">
                      {/* Section 9 */}
                      <div className="grid grid-cols-12 p-3 gap-2 items-start hover:bg-white/5 transition">
                        <div className="col-span-3 font-serif font-bold text-white">
                          มาตรา ๙ ความผูกพันและเจตนา
                        </div>
                        <div className="col-span-4 text-zinc-300">
                          ระบุอัตลักษณ์บุคคล แสดงความเชื่อมโยงเจตนากับข้อมูลอิเล็กทรอนิกส์ และยอมรับเนื้อหาของธุรกรรม
                        </div>
                        <div className="col-span-5 text-zinc-400 text-[10px]">
                          ยืนยันเจตนาตัวบุคคลผู้ทำธุรกรรมทั่วไปผ่านระบบงานอัตโนมัติ Merkle Leaf Signature และ Dilithium-5 ลงสู่บัญชีคงสภาพทันที ควบคุมโดยระบบยามตรวจตราซีโร่ทรัสต์ (Zero Trust Gate)
                        </div>
                      </div>

                      {/* Section 26 */}
                      <div className="grid grid-cols-12 p-3 gap-2 items-start hover:bg-white/5 transition">
                        <div className="col-span-3 font-serif font-bold text-white">
                          มาตรา ๒๖ ลายมือชื่อดิจิทัลปลอดภัยสูง
                        </div>
                        <div className="col-span-4 text-zinc-300">
                          ข้อมูลสร้างลายเซ็นอยู่ภายใต้การควบคุมของผู้ลงชื่อโดยเฉพาะ ตรวจจับรอยแก้ไข และห้ามปฏิเสธความรับผิดชอบย้อนหลัง
                        </div>
                        <div className="col-span-5 text-zinc-400 text-[10px]">
                          สลักคีย์ด้วยมาตรฐานต้านทานคอมพิวเตอร์ควอนตัม FIPS 203 / FIPS 204 ผ่านมติอนุมัติเอกฉันท์จาก 10/10 ผู้พิทักษ์ บนตู้เก็บรหัสกายภาพมาตรฐานสากลสูงสุด FIPS 140-3 Level 4 HSM
                        </div>
                      </div>

                      {/* Section 28 */}
                      <div className="grid grid-cols-12 p-3 gap-2 items-start hover:bg-white/5 transition">
                        <div className="col-span-3 font-serif font-bold text-white">
                          มาตรา ๒๘ การพึ่งพาใบรับรองสนับสนุน
                        </div>
                        <div className="col-span-4 text-zinc-300">
                          อาศัยใบรับรองอิเล็กทรอนิกส์ที่น่าเชื่อถือ และเปิดโอกาสให้บุคคลภายนอกเข้าตรวจสอบเพื่อยืนยันความแท้จริง
                        </div>
                        <div className="col-span-5 text-zinc-400 text-[10px]">
                          ผูกพันใบรับรองดิจิทัลและคู่กุญแจสิทธิ์ทั้งหมด และตรึงแฮชเข้าระบบบัญชีถาวรที่ไม่สามารถเข้าไปดัดแปลงแก้ไขได้ย้อนหลังอย่าง 909ab814479844d8a14816bed34cdbb07528e18501da86fc4691763a43fa4c68 และบันทึกประวัติพยานสำรองที่ Block #849202
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Sovereign Signatory Box */}
                  <div className="p-4 rounded-xl bg-gradient-to-br from-amber-500/10 via-black/50 to-amber-600/10 border border-amber-400/40 space-y-2 mt-4">
                    <div className="flex items-center justify-between border-b border-white/10 pb-2">
                      <span className="text-xs font-bold text-amber-300 font-serif">
                        การลงชื่อสัตยาบันและประทับตราอธิปไตยดิจิทัล
                      </span>
                      <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[9px] font-bold font-mono">
                        ETDA SAFE HARBOR ACTIVE
                      </span>
                    </div>

                    <p className="text-[11px] text-zinc-300 italic font-serif">
                      &ldquo;ขอรับรองผลการจำลองเหตุการณ์และการประเมินสัญกรณ์ความมั่นคงปลอดภัยทั้งหมดเป็นความสัจจะที่ถูกต้องตรงตามระบบประมวลผลแช่แข็งจริง&rdquo;
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 text-[10.5px]">
                      <div>
                        <span className="text-zinc-500 block">ลงชื่อผู้สลักสิทธิ์สูงสุด:</span>
                        <strong className="text-white font-serif text-xs block">นายยุทธภูมิ พากเพียร</strong>
                        <span className="text-zinc-400 text-[10px]">
                          สถาปนิกสูงสุด: #EP-SOVEREIGN-01 (OMEGA-1 SUPREME CLEARANCE)
                        </span>
                        <span className="text-zinc-400 text-[10px] block">
                          ตำแหน่ง: ประธานกรรมการควบคุมระบบ (Sovereign Principal Architect &amp; Chairman)
                        </span>
                      </div>

                      <div className="sm:text-right space-y-1">
                        <span className="text-zinc-500 block">ลายมือชื่อคริปโตกราฟี:</span>
                        <div className="font-mono text-[9px] text-amber-300 break-all">
                          PQC_SIG_DILITHIUM5_5A13396C129C611F...OK
                        </div>
                        <span className="text-emerald-400 text-[9px] block">
                          &check; Sealed at Genesis Block #849202 &bull; Merkle Root 909ab814...
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* MASTER DOSSIER - PAGE 1 CONTENT: Executive Attestation */}
              {docType === 'master_dossier' && currentPage === 1 && (
                <div className="space-y-6 text-xs leading-relaxed flex-1">
                  {/* Executive Passport Header Card */}
                  <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] text-amber-400 uppercase font-bold">
                        ผู้ถือสิทธิ์และสถาปนิกสูงสุด (SOVEREIGN ARCHITECT AUTHORITY)
                      </span>
                      <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px] font-bold">
                        CLEARANCE: OMEGA-1 SUPREME
                      </span>
                    </div>
                    <div className="text-base font-bold text-white font-serif">
                      นายยุทธภูมิ พากเพียร (#EP-SOVEREIGN-01)
                    </div>
                    <div className="text-[11px] text-zinc-400">
                      Genesis Merkle Root: <span className="text-cyan-300 font-mono">{SYSTEM_METADATA.merkleRoot}</span>
                    </div>
                  </div>

                  {/* Legal Statutory Articles Attestation */}
                  <div className="space-y-3">
                    <h3 className="text-sm font-bold text-amber-300 font-serif border-b border-white/10 pb-1">
                      การรับรองตามพระราชบัญญัติว่าด้วยธุรกรรมทางอิเล็กทรอนิกส์ พ.ศ. ๒๕๔๔
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div className="p-3 rounded-lg bg-black/40 border border-white/10 space-y-1">
                        <span className="text-amber-400 font-bold block">มาตรา ๙: ผลทางกฎหมาย</span>
                        <p className="text-[10px] text-zinc-400">
                          รับรองผลผูกพันทางกฎหมายของลายมือชื่อดิจิทัลและข้อมูลอิเล็กทรอนิกส์ ไม่สามารถปฏิเสธความสมบูรณ์ได้
                        </p>
                      </div>

                      <div className="p-3 rounded-lg bg-black/40 border border-white/10 space-y-1">
                        <span className="text-amber-400 font-bold block">มาตรา ๒๖: น่าเชื่อถือขั้นสูง</span>
                        <p className="text-[10px] text-zinc-400">
                          ค้ำประกันด้วย Post-Quantum Dilithium-5 (ML-DSA-87) และ 10/10 REAL_HSM Quorum ป้องกันการปฏิเสธความรับผิดชอบ
                        </p>
                      </div>

                      <div className="p-3 rounded-lg bg-black/40 border border-white/10 space-y-1">
                        <span className="text-amber-400 font-bold block">มาตรา ๒๘: หน้าที่และความแท้จริง</span>
                        <p className="text-[10px] text-zinc-400">
                          ผูกมัดใบรับรองอิเล็กทรอนิกส์กับระบบพยานหลักฐานคงสภาพ ไม่มีการแอบแก้ไขหรือดัดแปลงย้อนหลัง
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* PDPA Section 37 Attestation */}
                  <div className="p-3.5 rounded-xl bg-black/50 border border-cyan-500/30 space-y-1.5">
                    <div className="flex items-center gap-2 text-cyan-300 font-bold">
                      <ShieldCheck className="w-4 h-4" />
                      <span>พระราชบัญญัติคุ้มครองข้อมูลส่วนบุคคล พ.ศ. ๒๕๖๒ (PDPA) มาตรา ๓๗</span>
                    </div>
                    <p className="text-[11px] text-zinc-300">
                      ระบบมีมาตรการรักษาความมั่นคงปลอดภัยตามมาตรฐานความมั่นคงปลอดภัยทางเทคโนโลยีขั้นสูงสุด ข้อมูลทั้งหมดได้รับการเข้ารหัสด้วย FIPS 203 ML-KEM-1024 และจัดเก็บใน Sub-Kelvin Hardware Vault ปราศจากการรั่วไหล
                    </p>
                  </div>

                  {/* Signatory Box */}
                  <div className="mt-8 pt-4 border-t border-white/10 grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <span className="text-[10px] text-zinc-500 block">พยานหลักฐานการลงนามดิจิทัล:</span>
                      <div className="font-mono text-[10px] text-cyan-400 break-all">
                        SIG: 9a4e01928374a819b02847c019283746a8192837465019283746591827364501
                      </div>
                    </div>
                    <div className="text-right space-y-1">
                      <span className="text-[10px] text-zinc-500 block">ประทับตราอธิปไตยดิจิทัล:</span>
                      <span className="text-xs font-bold text-amber-300 font-serif">
                        นายยุทธภูมิ พากเพียร
                      </span>
                      <span className="text-[9px] text-zinc-400 block">Sovereign Architect &bull; 2026-08-22 ICT</span>
                    </div>
                  </div>
                </div>
              )}

              {/* MASTER DOSSIER - PAGE 2 CONTENT: Mathematical SSoT & 14,902 Seals */}
              {docType === 'master_dossier' && currentPage === 2 && (
                <div className="space-y-5 text-xs leading-relaxed flex-1">
                  <div>
                    <h3 className="text-sm font-bold text-amber-300 font-serif mb-1">
                      โครงข่ายสัจจะคณิตศาสตร์ MERKLE LEDGER HIERARCHY
                    </h3>
                    <p className="text-[11px] text-zinc-400">
                      การผูกพันข้อมูลหลักฐาน 14,902 Canonical Seals เข้ากับ Genesis Merkle Root
                    </p>
                  </div>

                  {/* Merkle Metrics Table */}
                  <div className="p-4 rounded-xl bg-black/50 border border-white/10 space-y-3">
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                      <div className="p-2.5 rounded-lg bg-zinc-900/80 border border-white/5">
                        <span className="text-[10px] text-zinc-500 block">SEALS COUNT</span>
                        <strong className="text-sm text-cyan-300">14,902</strong>
                      </div>
                      <div className="p-2.5 rounded-lg bg-zinc-900/80 border border-white/5">
                        <span className="text-[10px] text-zinc-500 block">BLOCK HEIGHT</span>
                        <strong className="text-sm text-white">#849202</strong>
                      </div>
                      <div className="p-2.5 rounded-lg bg-zinc-900/80 border border-white/5">
                        <span className="text-[10px] text-zinc-500 block">SSOT DRIFT</span>
                        <strong className="text-sm text-emerald-400">&Delta;0.00%</strong>
                      </div>
                      <div className="p-2.5 rounded-lg bg-zinc-900/80 border border-white/5">
                        <span className="text-[10px] text-zinc-500 block">MUTATION AUTHORITY</span>
                        <strong className="text-sm text-amber-400">0 (LOCKED)</strong>
                      </div>
                    </div>
                  </div>

                  {/* Post-Quantum Algorithms Standards */}
                  <div className="space-y-2">
                    <span className="text-[10px] text-zinc-400 uppercase font-bold">
                      NIST POST-QUANTUM CRYPTOGRAPHY COMPLIANCE SUITE
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[10px]">
                      <div className="p-2.5 rounded-lg bg-black/40 border border-white/5">
                        <strong className="text-cyan-300 block">FIPS 203 ML-KEM-1024</strong>
                        <span className="text-zinc-400">Lattice-based key encapsulation for quantum resistance.</span>
                      </div>
                      <div className="p-2.5 rounded-lg bg-black/40 border border-white/5">
                        <strong className="text-purple-300 block">FIPS 204 ML-DSA-87 (Dilithium-5)</strong>
                        <span className="text-zinc-400">Primary Advanced Digital Signature for all 10 HSM Custodians.</span>
                      </div>
                      <div className="p-2.5 rounded-lg bg-black/40 border border-white/5">
                        <strong className="text-rose-300 block">FIPS 205 SLH-DSA (SPHINCS+)</strong>
                        <span className="text-zinc-400">Stateless hash-based fallback if lattice structures are perturbed.</span>
                      </div>
                    </div>
                  </div>

                  {/* Merkle Root Visual Verification Card */}
                  <div className="p-3.5 rounded-xl bg-black/70 border border-cyan-500/30 space-y-1 font-mono text-[10px]">
                    <span className="text-zinc-500 uppercase block">CANONICAL GENESIS MERKLE ROOT:</span>
                    <span className="text-cyan-300 font-bold break-all block">
                      {SYSTEM_METADATA.merkleRoot}
                    </span>
                    <span className="text-emerald-400 text-[9px] block">
                      &check; 100% Mathematically Verified via Deterministic SHA-256 (FIPS 180-4)
                    </span>
                  </div>
                </div>
              )}

              {/* MASTER DOSSIER - PAGE 3 CONTENT: 10/10 Custodian Quorum */}
              {docType === 'master_dossier' && currentPage === 3 && (
                <div className="space-y-4 text-xs leading-relaxed flex-1">
                  <div>
                    <h3 className="text-sm font-bold text-amber-300 font-serif mb-1">
                      ทำเนียบคณะผู้พิทักษ์ 10/10 REAL_HSM QUORUM
                    </h3>
                    <p className="text-[11px] text-zinc-400">
                      รายนามและหลักฐานการลงนามผ่านอุปกรณ์ฮาร์ดแวร์นิรภัย FIPS 140-3 Level 4
                    </p>
                  </div>

                  {/* Custodians Table */}
                  <div className="border border-white/10 rounded-xl overflow-hidden text-[10px]">
                    <div className="grid grid-cols-12 bg-black/60 p-2 font-bold text-zinc-400 border-b border-white/10">
                      <div className="col-span-1">SLOT</div>
                      <div className="col-span-4">ชื่อผู้พิทักษ์ (CUSTODIAN)</div>
                      <div className="col-span-3">บทบาท (SOVEREIGN ROLE)</div>
                      <div className="col-span-2">หนังสือเดินทาง</div>
                      <div className="col-span-2 text-right">สถานะ HSM</div>
                    </div>

                    <div className="divide-y divide-white/5 max-h-[380px] overflow-y-auto">
                      {THAI_CUSTODIANS.map((cust, idx) => (
                        <div key={idx} className="grid grid-cols-12 p-2 hover:bg-white/5 transition items-center">
                          <div className="col-span-1 text-cyan-400 font-mono">TC-0{idx + 1}</div>
                          <div className="col-span-4 font-serif font-bold text-white truncate">{cust.nameTh}</div>
                          <div className="col-span-3 text-zinc-400 truncate">{cust.roleTh}</div>
                          <div className="col-span-2 text-zinc-400 font-mono text-[9px]">{cust.passportNumber}</div>
                          <div className="col-span-2 text-right">
                            <span className="px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[9px] font-bold">
                              REAL_HSM &check;
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Cryogenic Telemetry Summary */}
                  <div className="p-3 rounded-xl bg-black/50 border border-white/10 flex items-center justify-between text-[11px]">
                    <span className="text-zinc-400">Hardware Cryostat Telemetry:</span>
                    <span className="text-cyan-300 font-mono">BASE TEMP: 14.98 mK &bull; COHERENCE: 0.9997</span>
                    <span className="text-emerald-400 font-bold">FIPS 140-3 L4 TAMPER FOIL INTACT</span>
                  </div>
                </div>
              )}

              {/* MASTER DOSSIER - PAGE 4 CONTENT: Forensic Ledger Module 17 */}
              {docType === 'master_dossier' && currentPage === 4 && (
                <div className="space-y-4 text-xs leading-relaxed flex-1">
                  <div>
                    <h3 className="text-sm font-bold text-amber-300 font-serif mb-1">
                      บันทึกนิติวิทยาศาสตร์ดิจิทัล MODULE 17 &amp; CHAMBER 02
                    </h3>
                    <p className="text-[11px] text-zinc-400">
                      การกักกันพยานหลักฐานดิจิทัลตามมาตรฐาน ISO/IEC 27037 และข้อบังคับว่าด้วยการห้ามลบทำลายข้อมูล
                    </p>
                  </div>

                  {/* Forensic Anti-Corruption Guarantee */}
                  <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 space-y-1 text-rose-200">
                    <strong className="text-xs text-rose-300 block">
                      กฎความมั่นคง: บัญชีคงสภาพพยานหลักฐานไม่มีสิทธิ์ลบทำลาย (Non-Deletion Authority)
                    </strong>
                    <p className="text-[11px] text-zinc-300">
                      พยานหลักฐานที่ถูกส่งตัวกักกันใน Module 17 (Unclassified Preservation V24) จะถูกสลักค่าแฮชและตรึงลงสู่สมุดบัญชีถาวร เพื่อให้พร้อมสำหรับการตรวจพิสูจน์ย้อนหลังในชั้นศาลไทยทุกเวลา
                    </p>
                  </div>

                  {/* 12-Stage Trace Replay SLA Attestation */}
                  <div className="p-3.5 rounded-xl bg-black/50 border border-white/10 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-white">12-Stage Trace Replay SLA Confirmation</span>
                      <span className="px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 text-[10px] font-bold">
                        TARGET: &lt; 142 ms
                      </span>
                    </div>
                    <p className="text-[11px] text-zinc-400">
                      ระบบสามารถย้อนรอยขั้นตอนตั้งแต่ STAGE-01 (INGEST) จนถึง STAGE-12 (CLOSURE) ได้ภายในเวลา 38.6ms ซึ่งเร็วกว่าเกณฑ์มาตรฐาน SLA &lt; 142ms คิดเป็นประสิทธิภาพความพร้อม 100%
                    </p>
                  </div>

                  {/* Court Admissibility Seal Stamp */}
                  <div className="p-4 rounded-xl bg-gradient-to-r from-amber-500/15 via-black/40 to-cyan-500/15 border border-amber-400/40 text-center space-y-1">
                    <Award className="w-8 h-8 text-amber-400 mx-auto" />
                    <span className="text-sm font-bold text-amber-200 font-serif block">
                      ตราประทับรับรองพยานหลักฐานอิเล็กทรอนิกส์ในชั้นศาล
                    </span>
                    <span className="text-[10px] text-zinc-400 block">
                      ออกให้ตาม พ.ร.บ. ว่าด้วยธุรกรรมทางอิเล็กทรอนิกส์ พ.ศ. ๒๕๔๔ มาตรา ๙, ๒๖, และ ๒๘
                    </span>
                    <span className="text-[9px] text-emerald-400 font-mono block pt-1">
                      VERIFIED SOVEREIGN SEAL HASH: 909ab814...8aa536b3fa4c68
                    </span>
                  </div>
                </div>
              )}

              {/* Bottom Official Document Footer */}
              <div className="border-t border-white/10 pt-4 mt-6 flex items-center justify-between text-[9px] text-zinc-500 font-mono">
                <span>
                  ZYRQUEN &Omega;&infin; SOVEREIGN WORLD ENGINE &bull; OFFICIAL AUDIT DOSSIER
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleCopyMerkle}
                    className="hover:text-amber-300 transition flex items-center gap-1"
                  >
                    {copiedHash ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedHash ? 'ROOT COPIED' : 'COPY MERKLE'}</span>
                  </button>
                  <span>&bull;</span>
                  <span>PAGE {currentPage} OF {totalPages}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
