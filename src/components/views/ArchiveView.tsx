import React, { useState } from 'react';
import { Archive, Search, Download, Layers, CheckCircle2, ChevronRight, ExternalLink } from 'lucide-react';
import { CANONICAL_MODULES, SYSTEM_METADATA } from '../../data/canonicalData';
import { ViewType, CanonicalModule } from '../../types';
import { playAuditChime, playTone } from '../AudioSynthesizer';
import { DeepFreezeColdStoragePanel } from '../DeepFreezeColdStoragePanel';
import { MultiverseNavigationGridPanel } from '../MultiverseNavigationGridPanel';

interface ArchiveViewProps {
  onNavigate: (view: ViewType) => void;
}

export const ArchiveView: React.FC<ArchiveViewProps> = ({ onNavigate }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedModule, setSelectedModule] = useState<CanonicalModule>(CANONICAL_MODULES[0]);

  const filteredModules = CANONICAL_MODULES.filter((m) =>
    m.titleEn.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.titleTh.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.num.includes(searchTerm) ||
    m.badge.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.subModules.some((s) => s.nameEn.toLowerCase().includes(searchTerm.toLowerCase()) || s.nameTh.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const exportManifest = () => {
    const data = {
      system: SYSTEM_METADATA,
      canonicalModules: CANONICAL_MODULES,
      exportTimestamp: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ZYRQUEN-OMEGA-17-MODULES-MANIFEST-FROZEN-v1.2.json`;
    a.click();
    URL.revokeObjectURL(url);
    playAuditChime();
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Banner */}
      <div className="p-6 rounded-[28px] bg-gradient-to-br from-[#0c1628]/90 via-[#0b0e1a]/80 to-[#07080F] border border-white/8 backdrop-blur-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-blue-500/10 text-blue-300 border border-blue-500/20 text-xs font-mono">
              17 CANONICAL MODULES ARCHIVE
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 text-xs font-mono">
              DELETE NOTHING GUARANTEE
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-mono font-bold text-white mt-1">
            Historical Snapshots & Extension Vault
          </h2>
          <p className="text-xs text-zinc-400 font-mono mt-0.5">
            Full 17 Architecture Modules (Core, AI, Data, Workflow, Governance, Security, Observability, etc.)
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search 17 modules or sub-systems..."
              className="pl-9 pr-4 py-2 rounded-2xl bg-black/40 border border-white/10 text-xs font-mono text-white placeholder-zinc-500 focus:outline-none focus:border-cyan-500/50 w-64"
            />
          </div>

          <button
            onClick={exportManifest}
            className="px-3.5 py-2 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-zinc-300 font-mono text-xs flex items-center gap-1.5 transition-all"
          >
            <Download className="w-4 h-4 text-cyan-400" />
            <span className="hidden sm:inline">Export Manifest</span>
          </button>
        </div>
      </div>

      {/* 17 Modules Split Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 5 Columns: Modules List */}
        <div className="lg:col-span-5 space-y-2 max-h-[640px] overflow-y-auto pr-1">
          {filteredModules.map((mod) => {
            const isSelected = selectedModule.id === mod.id;
            return (
              <div
                key={mod.id}
                onClick={() => {
                  playTone(520, 0.04);
                  setSelectedModule(mod);
                }}
                className={`p-4 rounded-2xl border transition-all cursor-pointer space-y-2 ${
                  isSelected
                    ? 'bg-blue-950/20 border-blue-500/40 shadow-[0_0_20px_rgba(59,130,246,0.15)]'
                    : 'bg-[#0b0e1a]/70 border-white/6 hover:border-white/15'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-cyan-400">{mod.num}</span>
                    <span className="text-xs font-mono font-bold text-zinc-100">{mod.titleEn}</span>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 text-zinc-400">
                    {mod.badge}
                  </span>
                </div>
                <div className="text-[11px] text-zinc-400 font-mono line-clamp-1">{mod.titleTh}</div>
                <div className="flex items-center gap-3 text-[10px] font-mono text-zinc-500 pt-1">
                  <span>{mod.subModules.length} Sub-modules</span>
                  <span>•</span>
                  <span className="text-emerald-400">{mod.metrics[0]?.value}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right 7 Columns: Selected Module Detail & Sub-components */}
        <div className="lg:col-span-7 space-y-4">
          <div className="p-6 rounded-[28px] bg-[#0b0e1a]/70 border border-white/8 backdrop-blur-xl space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-mono font-bold text-cyan-400">MODULE {selectedModule.num}</span>
                <h3 className="text-lg font-mono font-bold text-white mt-0.5">{selectedModule.titleEn}</h3>
                <p className="text-xs font-mono text-zinc-400">{selectedModule.titleTh}</p>
              </div>

              <button
                onClick={() => {
                  playTone(600, 0.05);
                  onNavigate(selectedModule.targetView);
                }}
                className="px-3 py-1.5 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 font-mono text-xs flex items-center gap-1.5 transition-all"
              >
                <span>Open View</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
            </div>

            <p className="text-xs text-zinc-300 font-sans leading-relaxed">
              {selectedModule.descriptionEn}
            </p>

            {/* Metrics */}
            <div className="grid grid-cols-3 gap-2 text-xs font-mono">
              {selectedModule.metrics.map((m, idx) => (
                <div key={idx} className="p-3 bg-black/40 rounded-xl border border-white/5 space-y-0.5">
                  <span className="text-zinc-500 text-[10px] block">{m.label}</span>
                  <span className="text-zinc-200 font-bold block">{m.value}</span>
                </div>
              ))}
            </div>

            {/* Sub-modules list */}
            <div className="space-y-2">
              <div className="text-xs font-mono text-zinc-400 uppercase tracking-wider">
                Canonical Sub-Components ({selectedModule.subModules.length})
              </div>

              <div className="space-y-2">
                {selectedModule.subModules.map((sub) => (
                  <div
                    key={sub.id}
                    className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                  >
                    <div>
                      <div className="text-xs font-mono font-bold text-zinc-200">{sub.nameEn}</div>
                      <div className="text-[11px] text-zinc-400 font-mono">{sub.nameTh}</div>
                      <p className="text-[11px] text-zinc-500 font-sans mt-0.5">{sub.descriptionEn}</p>
                    </div>

                    <button
                      onClick={() => {
                        playTone(550, 0.04);
                        onNavigate(sub.targetView);
                      }}
                      className="text-xs font-mono text-cyan-400 hover:text-cyan-300 flex items-center gap-1 shrink-0"
                    >
                      <span>Jump</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Deep Freeze Cold Storage Background Service Panel */}
      <DeepFreezeColdStoragePanel />

      {/* Multiverse Navigation Grid v15 & Quantum Continuum v14 Panel */}
      <MultiverseNavigationGridPanel />
    </div>
  );
};
