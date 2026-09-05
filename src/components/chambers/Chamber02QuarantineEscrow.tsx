import React, { useState } from 'react';
import { 
  ShieldAlert, 
  AlertTriangle, 
  Lock, 
  Archive, 
  FileText, 
  CheckCircle2, 
  RotateCcw,
  Search,
  ExternalLink,
  Zap
} from 'lucide-react';
import { CHAIN_EVENTS, SYSTEM_METADATA } from '../../data/canonicalData';
import { GlobalNetworkArchitectureDeck } from '../network/GlobalNetworkArchitectureDeck';

interface ChamberProps {
  lang: 'th' | 'en';
  openSentinelModal: () => void;
  openReplayModal: () => void;
}

export const Chamber02QuarantineEscrow: React.FC<ChamberProps> = ({
  lang,
  openSentinelModal,
  openReplayModal
}) => {
  const [selectedIncident, setSelectedIncident] = useState<number>(1);

  const quarantineEvents = CHAIN_EVENTS.filter(e => e.payload.seal_id && e.payload.seal_id > 14902);

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="rounded-xl bg-gradient-to-r from-red-950/80 via-slate-900 to-slate-950 border border-red-500/40 p-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full bg-red-950 border border-red-500/50 text-red-300 text-xs font-mono-code font-bold flex items-center gap-1.5">
                <ShieldAlert className="w-3 h-3 text-red-400 animate-pulse" />
                FAIL-CLOSED QUARANTINE ESCROW
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 text-xs font-mono-code">
                Preservation: Module 17 (V24)
              </span>
            </div>
            <h2 className="text-2xl font-display font-bold text-white tracking-tight">
              {lang === 'th' ? 'ห้องกักกันโรคทางนิติวิทยาศาสตร์ (Chamber 02)' : 'Chamber 02: Cryptographic Quarantine Escrow'}
            </h2>
            <p className="text-sm text-slate-300 mt-1 max-w-3xl">
              {lang === 'th'
                ? 'พื้นที่กักกันการปล่อยสัญญาณและทรานแซกชันที่ผิดเพี้ยนออกจาก SSoT (เช่น ซีลทดสอบ #14903, #14904) โดยไม่ทำลายข้อมูลตามหลักนิติวิทยาศาสตร์ดิจิทัล'
                : 'Isolated execution escrow isolating anomalous emissions and probe vectors (Seals #14903, #14904) with strict zero-deletion evidence preservation.'}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={openSentinelModal}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-600 hover:bg-red-500 text-white font-bold text-xs shadow-lg transition-all"
            >
              <Zap className="w-4 h-4" />
              {lang === 'th' ? 'เปิดเครื่องมือดักจับ Sentinel AI' : 'Launch Sentinel Interceptor'}
            </button>
          </div>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <span className="text-xs text-slate-400 font-medium block mb-1">
            {lang === 'th' ? 'จำนวนซีลในเขตกักกัน' : 'Quarantined Seals Count'}
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-display font-bold text-red-400 font-mono-code">
              {SYSTEM_METADATA.quarantinedSeals}
            </span>
            <span className="text-xs text-slate-400">Isolated Objects</span>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <span className="text-xs text-slate-400 font-medium block mb-1">
            {lang === 'th' ? 'สถานะนโยบายการกักกัน' : 'Fail-Closed Policy'}
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-xl font-display font-bold text-emerald-400 font-mono-code">
              ARMED_FAIL_CLOSED
            </span>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <span className="text-xs text-slate-400 font-medium block mb-1">
            {lang === 'th' ? 'ความชอบด้วยกฎหมายในชั้นศาล' : 'Court Admissibility Assurance'}
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-xl font-display font-bold text-cyan-300 font-mono-code">
              100% ASSURANCE
            </span>
          </div>
        </div>
      </div>

      {/* Incident Log Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Incident List */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 space-y-4">
          <h3 className="font-display font-bold text-white text-base flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-400" />
            {lang === 'th' ? 'บันทึกเหตุการณ์กักกันทางนิติวิทยาศาสตร์' : 'Quarantine Audit Incident Stream'}
          </h3>

          <div className="space-y-3">
            {quarantineEvents.map((evt) => (
              <div
                key={evt.event_index}
                onClick={() => setSelectedIncident(evt.event_index)}
                className={`p-4 rounded-lg border cursor-pointer transition-all ${
                  selectedIncident === evt.event_index
                    ? 'bg-slate-800 border-red-500/50 shadow-md'
                    : 'bg-slate-950/70 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-red-950 text-red-300 text-xs font-mono-code font-bold">
                      SEAL #{evt.payload.seal_id}
                    </span>
                    <span className="font-mono-code text-xs text-cyan-300 font-semibold">
                      {evt.action}
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-400 font-mono-code">
                    {new Date(evt.timestamp).toLocaleTimeString()}
                  </span>
                </div>
                <p className="text-xs text-slate-300 line-clamp-2">
                  {evt.payload.incident_details}
                </p>
                <div className="mt-3 flex items-center justify-between text-[11px] text-slate-400 border-t border-slate-800/80 pt-2 font-mono-code">
                  <span>Target: {evt.payload.target_chamber}</span>
                  <span className="text-emerald-400">10/10 HSM VERIFIED</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Selected Incident Deep Forensic Inspection */}
        {(() => {
          const current = CHAIN_EVENTS.find(e => e.event_index === selectedIncident) || CHAIN_EVENTS[1];
          return (
            <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-display font-bold text-white text-base flex items-center gap-2">
                  <Archive className="w-4 h-4 text-cyan-400" />
                  {lang === 'th' ? 'การวิเคราะห์พยานวัตถุ (Forensic Deep Dive)' : 'Forensic Object Deep Dive'}
                </h3>
                <span className="text-xs font-mono-code text-red-400 font-bold">
                  SEAL #{current.payload.seal_id}
                </span>
              </div>

              <div className="bg-slate-950 p-4 rounded-lg border border-slate-800 space-y-3 text-xs">
                <div>
                  <span className="text-slate-400 block font-semibold">Incident Timestamp:</span>
                  <span className="text-white font-mono-code">{current.timestamp}</span>
                </div>

                <div>
                  <span className="text-slate-400 block font-semibold">Handler Identity & Role:</span>
                  <span className="text-cyan-300 font-mono-code">{current.handler.id} ({current.handler.role})</span>
                </div>

                <div>
                  <span className="text-slate-400 block font-semibold">Incident Diagnostics:</span>
                  <p className="text-slate-200 mt-1 bg-slate-900 p-2.5 rounded border border-slate-800/80 leading-relaxed">
                    {current.payload.incident_details}
                  </p>
                </div>

                <div>
                  <span className="text-slate-400 block font-semibold">Preservation Guarantee:</span>
                  <span className="text-amber-300 font-mono-code">{current.payload.preservation_guarantee}</span>
                </div>

                <div>
                  <span className="text-slate-400 block font-semibold">Dilithium-5 Signature:</span>
                  <span className="text-emerald-400 font-mono-code text-[11px] break-all">{current.dilithium5_signature}</span>
                </div>

                <div>
                  <span className="text-slate-400 block font-semibold">Immutable Hash:</span>
                  <span className="text-slate-300 font-mono-code text-[11px] break-all">{current.current_hash}</span>
                </div>

                <div className="pt-2 flex items-center gap-3">
                  <button
                    onClick={openReplayModal}
                    className="flex-1 flex items-center justify-center gap-2 py-2 bg-cyan-950 hover:bg-cyan-900 border border-cyan-500/40 text-cyan-200 font-semibold rounded text-xs transition-all"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    {lang === 'th' ? 'ทดสอบ Replay 12 ขั้นตอน (142ms)' : 'Replay Trace in 142ms'}
                  </button>
                </div>
              </div>
            </div>
          );
        })()}
      </div>

      {/* 5-Module Global Network Architecture & Quarantine Visualizer */}
      <div className="pt-4 border-t border-slate-800">
        <GlobalNetworkArchitectureDeck lang={lang} />
      </div>
    </div>
  );
};
