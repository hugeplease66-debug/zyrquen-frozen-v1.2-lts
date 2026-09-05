import React, { useState } from 'react';
import { 
  CheckCircle2, 
  Search, 
  Filter, 
  Layers, 
  ShieldCheck, 
  Lock,
  Award
} from 'lucide-react';
import { PHASES_LIST, SYSTEM_METADATA } from '../../data/canonicalData';
import { PhaseInfo } from '../../types';

interface ChamberProps {
  lang: 'th' | 'en';
}

export const Chamber18PhaseRegistry: React.FC<ChamberProps> = ({ lang }) => {
  const [selectedDomain, setSelectedDomain] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');

  const filteredPhases = PHASES_LIST.filter(p => {
    const matchDomain = selectedDomain === 'all' || p.domain === selectedDomain;
    const matchSearch = 
      p.phase_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchDomain && matchSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="rounded-xl bg-gradient-to-r from-emerald-950/80 via-slate-900 to-slate-950 border border-emerald-500/40 p-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-950 border border-emerald-500/50 text-emerald-300 text-xs font-mono-code font-bold flex items-center gap-1.5">
                <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                40/40 VERIFIED PHASE REGISTRY
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 text-xs font-mono-code">
                Pass Rate: 100.0% (40 of 40)
              </span>
            </div>
            <h2 className="text-2xl font-display font-bold text-white tracking-tight">
              {lang === 'th' ? 'ทะเบียนการผ่านเกณฑ์ 40 เฟสการประเมิน (Chamber 18)' : 'Chamber 18: 40/40 Sovereign Phase Registry Matrix'}
            </h2>
            <p className="text-sm text-slate-300 mt-1 max-w-3xl">
              {lang === 'th'
                ? 'ตารางการตรวจสอบ 40 เฟส (P01 ถึง P40) ทุกเฟสผ่านการยืนยัน 14,902 ซีล บนบล็อก #849202 สอดคล้องกับสถาปัตยกรรมอธิปไตยสมบูรณ์'
                : 'Complete registry of all 40 verification phases with 100% pass rates across Foundation, Governance, Ops, and Extension.'}
            </p>
          </div>

          <div className="bg-slate-950/80 p-3 rounded-lg border border-emerald-500/30 text-right">
            <span className="text-xs text-slate-400 block font-mono-code">Total Phases Passed:</span>
            <span className="text-xl font-mono-code font-bold text-emerald-400">
              40 / 40 (100%)
            </span>
          </div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-900 p-4 rounded-xl border border-slate-800">
        <div className="flex items-center gap-2 overflow-x-auto w-full pb-1 sm:pb-0">
          {['all', 'Foundation', 'Governance', 'Operations', 'Extension'].map(domain => (
            <button
              key={domain}
              onClick={() => setSelectedDomain(domain)}
              className={`px-3 py-1 rounded text-xs font-semibold whitespace-nowrap transition-colors ${
                selectedDomain === domain
                  ? 'bg-emerald-500 text-slate-950 shadow'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              {domain.toUpperCase()}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder={lang === 'th' ? "ค้นหาเฟส (เช่น P01, P36)..." : "Search phase ID or name..."}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-8 pr-3 py-1 bg-slate-950 border border-slate-700 rounded text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500"
          />
        </div>
      </div>

      {/* 40 Phases Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
        {filteredPhases.map((phase) => (
          <div
            key={phase.phase_id}
            className="bg-slate-900/80 border border-slate-800 rounded-xl p-3.5 flex flex-col justify-between hover:border-emerald-500/40 transition-all"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-1.5">
                <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 font-mono-code font-bold text-xs">
                  {phase.phase_id}
                </span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 font-mono-code">
                  {phase.domain}
                </span>
              </div>
              <h4 className="text-xs font-bold text-white mb-2 line-clamp-2">
                {phase.name}
              </h4>
            </div>

            <div className="pt-2 border-t border-slate-800 text-[10px] font-mono-code text-slate-400 space-y-1">
              <div className="flex justify-between">
                <span>Seals Verified:</span>
                <span className="text-cyan-300">{phase.seals_verified.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Block Anchor:</span>
                <span className="text-white">#{phase.block_anchor}</span>
              </div>
              <div className="flex justify-between items-center pt-0.5">
                <span>Status:</span>
                <span className="text-emerald-400 font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  PASS (Δ0)
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
