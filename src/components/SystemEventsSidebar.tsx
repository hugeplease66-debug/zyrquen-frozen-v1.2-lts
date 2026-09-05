import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ViewType } from '../types';
import {
  AlertTriangle,
  Info,
  CheckCircle2,
  XCircle,
  Search,
  X,
  Copy,
  Check,
  Shield,
  Clock,
  Radio,
  Download,
  PlusCircle,
  ExternalLink,
  ChevronRight,
  Filter,
} from 'lucide-react';

export interface SystemEvent {
  id: string;
  type?: string;
  title: string;
  description?: string;
  title_th?: string;
  timestamp: string;
  metaHash?: string;
  hash?: string;
  statuteRef?: string;
  statute?: string;
  targetView?: ViewType;
  chamber?: string;
  details?: string;
  severity: 'critical' | 'warning' | 'info' | 'success' | 'error';
  isNew?: boolean;
}

export interface SystemEventsSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  events: SystemEvent[];
  onClearEvents?: () => void;
  onNavigateToView?: (view: ViewType) => void;
}

// Animation variants for the event cards: slide-in from right/top and fade-in smoothly
const eventCardVariants = {
  hidden: {
    opacity: 0,
    x: 24,
    y: -8,
    scale: 0.96,
  },
  visible: {
    opacity: 1,
    x: 0,
    y: 0,
    scale: 1,
    transition: {
      type: 'spring' as const,
      stiffness: 350,
      damping: 25,
      mass: 0.8,
    },
  },
  exit: {
    opacity: 0,
    x: -20,
    scale: 0.95,
    transition: {
      duration: 0.2,
      ease: 'easeOut' as const,
    },
  },
};

export const SystemEventsSidebar: React.FC<SystemEventsSidebarProps> = ({
  isOpen,
  onClose,
  events,
  onClearEvents,
  onNavigateToView,
}) => {
  const [severityFilter, setSeverityFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Calculate counts for each severity tier
  const severityCounts = useMemo(() => {
    return {
      all: events.length,
      critical: events.filter((e) => e.severity === 'critical' || e.severity === 'error').length,
      warning: events.filter((e) => e.severity === 'warning').length,
      info: events.filter((e) => e.severity === 'info' || e.severity === 'success').length,
    };
  }, [events]);

  // Filter events by severity and text search query
  const filteredEvents = useMemo(() => {
    return events.filter((evt) => {
      const isCritical = evt.severity === 'critical' || evt.severity === 'error';
      const isWarning = evt.severity === 'warning';
      const isInfo = evt.severity === 'info' || evt.severity === 'success';

      if (severityFilter === 'critical' && !isCritical) return false;
      if (severityFilter === 'warning' && !isWarning) return false;
      if (severityFilter === 'info' && !isInfo) return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = evt.title?.toLowerCase().includes(q);
        const matchesTitleTh = evt.title_th?.toLowerCase().includes(q);
        const matchesDesc = evt.description?.toLowerCase().includes(q);
        const matchesDetails = evt.details?.toLowerCase().includes(q);
        const matchesStatute = (evt.statute || evt.statuteRef)?.toLowerCase().includes(q);
        const matchesChamber = evt.chamber?.toLowerCase().includes(q);
        const matchesHash = (evt.hash || evt.metaHash)?.toLowerCase().includes(q);
        const matchesId = evt.id?.toLowerCase().includes(q);

        return (
          matchesTitle ||
          matchesTitleTh ||
          matchesDesc ||
          matchesDetails ||
          matchesStatute ||
          matchesChamber ||
          matchesHash ||
          matchesId
        );
      }

      return true;
    });
  }, [events, severityFilter, searchQuery]);

  const handleCopyHash = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => {
      setCopiedId(null);
    }, 1500);
  };

  const handleExportJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(events, null, 2));
    const dlAnchor = document.createElement('a');
    dlAnchor.setAttribute('href', dataStr);
    dlAnchor.setAttribute('download', `zyrquen-system-events-${new Date().toISOString().substring(0, 10)}.json`);
    document.body.appendChild(dlAnchor);
    dlAnchor.click();
    dlAnchor.remove();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop with fade transition */}
          <motion.div
            id="systemEventsReactBackdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 transition-opacity"
          />

          {/* Drawer with slide-in transition from right */}
          <motion.aside
            id="systemEventsReactDrawer"
            aria-label="System Events React Sidebar"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 320, damping: 30 }}
            className="fixed top-0 right-0 bottom-0 w-full max-w-md bg-[#070b19] border-l border-cyan-500/20 z-50 flex flex-col shadow-2xl text-slate-200"
          >
            {/* Header */}
            <div className="p-4 border-b border-cyan-500/20 flex items-center justify-between bg-[#0a0f20]/90">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 block animate-ping absolute inset-0 opacity-75" />
                  <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 block relative" />
                </div>
                <div>
                  <h2 className="text-xs font-bold tracking-wider text-cyan-400 uppercase flex items-center gap-1.5">
                    <Radio className="w-3.5 h-3.5" />
                    System Events Stream
                  </h2>
                  <p className="text-[10px] text-slate-400">
                    SSoT Live Incident & Audit Trail • 14,902 Seals
                  </p>
                </div>
              </div>
              <button
                id="closeSystemEventsReactSidebarBtn"
                onClick={onClose}
                className="text-slate-400 hover:text-white p-1 rounded-md hover:bg-slate-800/60 transition-colors"
                title="Close Sidebar (Esc)"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Filter by Severity & Search Controls */}
            <div className="p-3 border-b border-slate-800 bg-[#050813]">
              <div className="flex items-center justify-between text-[10px] text-slate-400 uppercase tracking-wider mb-2 font-mono">
                <span className="flex items-center gap-1">
                  <Filter className="w-3 h-3 text-cyan-400" />
                  Filter by Severity
                </span>
                <span className="text-cyan-400 font-semibold">
                  {filteredEvents.length} of {events.length} Shown
                </span>
              </div>

              {/* Severity Pill Buttons */}
              <div className="flex gap-1.5 flex-wrap">
                <button
                  id="reactFilterAll"
                  onClick={() => setSeverityFilter('all')}
                  className={`px-2.5 py-1 rounded-md text-[11px] font-medium flex items-center gap-1.5 transition-all cursor-pointer ${
                    severityFilter === 'all'
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/50 shadow-[0_0_10px_rgba(6,182,212,0.25)]'
                      : 'bg-slate-900/60 text-slate-400 border border-slate-800 hover:border-slate-700 hover:text-slate-200'
                  }`}
                >
                  <span>All</span>
                  <span className="text-[9px] opacity-75 font-mono">({severityCounts.all})</span>
                </button>

                <button
                  id="reactFilterCritical"
                  onClick={() => setSeverityFilter('critical')}
                  className={`px-2.5 py-1 rounded-md text-[11px] font-medium flex items-center gap-1.5 transition-all cursor-pointer ${
                    severityFilter === 'critical'
                      ? 'bg-red-500/20 text-red-300 border border-red-500/50 shadow-[0_0_10px_rgba(239,68,68,0.25)]'
                      : 'bg-slate-900/60 text-slate-400 border border-slate-800 hover:border-slate-700 hover:text-red-400'
                  }`}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                  <span>Critical</span>
                  <span className="text-[9px] opacity-75 font-mono">({severityCounts.critical})</span>
                </button>

                <button
                  id="reactFilterWarning"
                  onClick={() => setSeverityFilter('warning')}
                  className={`px-2.5 py-1 rounded-md text-[11px] font-medium flex items-center gap-1.5 transition-all cursor-pointer ${
                    severityFilter === 'warning'
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/50 shadow-[0_0_10px_rgba(245,158,11,0.25)]'
                      : 'bg-slate-900/60 text-slate-400 border border-slate-800 hover:border-slate-700 hover:text-amber-400'
                  }`}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                  <span>Warning</span>
                  <span className="text-[9px] opacity-75 font-mono">({severityCounts.warning})</span>
                </button>

                <button
                  id="reactFilterInfo"
                  onClick={() => setSeverityFilter('info')}
                  className={`px-2.5 py-1 rounded-md text-[11px] font-medium flex items-center gap-1.5 transition-all cursor-pointer ${
                    severityFilter === 'info'
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/50 shadow-[0_0_10px_rgba(16,185,129,0.25)]'
                      : 'bg-slate-900/60 text-slate-400 border border-slate-800 hover:border-slate-700 hover:text-emerald-400'
                  }`}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  <span>Info</span>
                  <span className="text-[9px] opacity-75 font-mono">({severityCounts.info})</span>
                </button>
              </div>

              {/* Search Bar */}
              <div className="mt-2.5 relative">
                <Search className="w-3 h-3 text-slate-500 absolute left-2.5 top-1/2 -translate-y-1/2" />
                <input
                  id="reactEventSearchInput"
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search events, hashes, statutes, chambers..."
                  className="w-full bg-[#090d1e] border border-slate-800 focus:border-cyan-500/50 rounded-md pl-7 pr-7 py-1.5 text-[11px] text-slate-200 placeholder-slate-500 outline-none transition-colors"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                  >
                    <X className="w-3 h-3" />
                  </button>
                )}
              </div>
            </div>

            {/* Event List with AnimatePresence and motion.div */}
            <div id="reactEventsListContainer" className="flex-1 overflow-y-auto p-3 space-y-2.5">
              <AnimatePresence mode="popLayout">
                {filteredEvents.length === 0 ? (
                  <motion.div
                    key="empty-state"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="text-center py-12 px-4 text-slate-500 text-xs"
                  >
                    <div className="w-10 h-10 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center mx-auto mb-2 text-slate-400">
                      <Search className="w-4 h-4" />
                    </div>
                    <p className="font-medium text-slate-400">No matching events found</p>
                    <p className="text-[10px] text-slate-600 mt-0.5">
                      Try adjusting the severity filter [{severityFilter.toUpperCase()}] or query
                    </p>
                    <button
                      onClick={() => {
                        setSeverityFilter('all');
                        setSearchQuery('');
                      }}
                      className="mt-3 text-[10px] px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/20 transition-colors"
                    >
                      Reset Filters
                    </button>
                  </motion.div>
                ) : (
                  filteredEvents.map((evt, idx) => {
                    const isCritical = evt.severity === 'critical' || evt.severity === 'error';
                    const isWarning = evt.severity === 'warning';
                    const isInfo = evt.severity === 'info' || evt.severity === 'success';

                    const borderAccent = isCritical
                      ? 'border-l-red-500 border-l-[3px] bg-gradient-to-r from-red-500/10 to-slate-900/40'
                      : isWarning
                      ? 'border-l-amber-400 border-l-[3px] bg-gradient-to-r from-amber-500/10 to-slate-900/40'
                      : 'border-l-emerald-400 border-l-[3px] bg-gradient-to-r from-emerald-500/10 to-slate-900/40';

                    const badgeStyle = isCritical
                      ? 'bg-red-500/15 border-red-500/30 text-red-400'
                      : isWarning
                      ? 'bg-amber-500/15 border-amber-500/30 text-amber-300'
                      : 'bg-emerald-500/15 border-emerald-500/30 text-emerald-300';

                    const hashValue = evt.hash || evt.metaHash || '';
                    const statuteValue = evt.statute || evt.statuteRef || '';

                    return (
                      <motion.div
                        key={evt.id}
                        id={`react-event-${evt.id}`}
                        layout
                        variants={eventCardVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        transition={{ delay: Math.min(idx * 0.03, 0.25) }}
                        className={`p-3 rounded-lg border border-slate-800/80 hover:border-cyan-500/30 transition-all ${borderAccent} group relative`}
                      >
                        {/* Card Header: Severity & Timestamp */}
                        <div className="flex items-center justify-between mb-1.5">
                          <span
                            className={`text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded border flex items-center gap-1 ${badgeStyle}`}
                          >
                            {isCritical ? (
                              <AlertTriangle className="w-2.5 h-2.5" />
                            ) : isWarning ? (
                              <AlertTriangle className="w-2.5 h-2.5" />
                            ) : (
                              <CheckCircle2 className="w-2.5 h-2.5" />
                            )}
                            {evt.severity}
                          </span>
                          <span className="text-[9px] text-slate-400 font-mono flex items-center gap-1">
                            <Clock className="w-2.5 h-2.5 text-slate-500" />
                            {evt.timestamp}
                          </span>
                        </div>

                        {/* Title & Thai Subtitle */}
                        <h3 className="text-xs font-semibold text-slate-100 group-hover:text-cyan-300 transition-colors">
                          {evt.title}
                        </h3>
                        {evt.title_th && (
                          <p className="text-[10px] text-slate-400 leading-snug mt-0.5">
                            {evt.title_th}
                          </p>
                        )}

                        {/* Description / Forensic Details */}
                        {(evt.details || evt.description) && (
                          <div className="mt-2 p-2 rounded bg-black/40 border border-slate-800/60 text-[10px] text-slate-300 leading-relaxed font-mono">
                            {evt.details || evt.description}
                          </div>
                        )}

                        {/* Legal & Chamber Badges */}
                        {(statuteValue || evt.chamber) && (
                          <div className="mt-2 flex items-center gap-2 flex-wrap text-[9px]">
                            {statuteValue && (
                              <span className="px-1.5 py-0.5 rounded bg-cyan-950/60 border border-cyan-500/20 text-cyan-300 flex items-center gap-1">
                                <Shield className="w-2.5 h-2.5" />
                                {statuteValue}
                              </span>
                            )}
                            {evt.chamber && (
                              <span className="px-1.5 py-0.5 rounded bg-amber-950/60 border border-amber-500/20 text-amber-300 font-mono">
                                📍 {evt.chamber}
                              </span>
                            )}
                          </div>
                        )}

                        {/* Footer: Hash and Action */}
                        <div className="mt-2.5 pt-2 border-t border-slate-800/60 flex items-center justify-between text-[9px]">
                          {hashValue ? (
                            <div className="flex items-center gap-1.5">
                              <span
                                className="text-slate-400 font-mono truncate max-w-[170px]"
                                title={hashValue}
                              >
                                {hashValue.length > 20 ? `${hashValue.substring(0, 18)}...` : hashValue}
                              </span>
                              <button
                                onClick={() => handleCopyHash(evt.id, hashValue)}
                                className="px-1.5 py-0.5 rounded bg-slate-800/60 hover:bg-slate-700/60 border border-slate-700/50 text-slate-300 text-[8px] flex items-center gap-1 transition-colors cursor-pointer"
                                title="Copy cryptographic hash"
                              >
                                {copiedId === evt.id ? (
                                  <>
                                    <Check className="w-2.5 h-2.5 text-emerald-400" />
                                    <span className="text-emerald-400">Copied</span>
                                  </>
                                ) : (
                                  <>
                                    <Copy className="w-2.5 h-2.5" />
                                    <span>Copy</span>
                                  </>
                                )}
                              </button>
                            </div>
                          ) : (
                            <span className="text-slate-600 font-mono text-[8px]">ID: {evt.id}</span>
                          )}

                          {evt.targetView && onNavigateToView && (
                            <button
                              onClick={() => onNavigateToView(evt.targetView!)}
                              className="text-cyan-400 hover:text-cyan-300 text-[9px] font-medium flex items-center gap-0.5 transition-colors"
                            >
                              <span>View</span>
                              <ChevronRight className="w-2.5 h-2.5" />
                            </button>
                          )}
                        </div>
                      </motion.div>
                    );
                  })
                )}
              </AnimatePresence>
            </div>

            {/* Footer Status & Export */}
            <div className="p-3 border-t border-slate-800 bg-[#050813] flex items-center justify-between text-[10px]">
              <div className="flex items-center gap-1.5 text-slate-400 font-mono text-[9px]">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>Auto-Sync: Δ0.00%</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleExportJSON}
                  className="px-2 py-1 rounded bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-300 text-[9px] flex items-center gap-1 transition-colors cursor-pointer"
                  title="Export full event ledger as JSON"
                >
                  <Download className="w-3 h-3" />
                  <span>Export Audit</span>
                </button>
                {onClearEvents && (
                  <button
                    onClick={onClearEvents}
                    className="px-2 py-1 rounded bg-slate-800/60 hover:bg-slate-700/60 text-slate-400 hover:text-slate-200 text-[9px] transition-colors"
                  >
                    Clear
                  </button>
                )}
              </div>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
};
