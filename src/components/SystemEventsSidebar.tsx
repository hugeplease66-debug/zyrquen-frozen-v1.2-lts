import React, { useState, useEffect } from 'react';
import {
  Bell,
  X,
  Shield,
  Scale,
  Cpu,
  Binary,
  Volume2,
  Sparkles,
  Copy,
  Check,
  Trash2,
  Filter,
  Radio,
  ExternalLink,
  ChevronRight,
  Maximize2,
  AlertTriangle,
  FileCheck,
  ArrowRight,
  ShieldAlert,
  Zap,
  Clock,
  Play,
  Pause,
  RefreshCw,
  Archive,
} from 'lucide-react';
import { playTone, playAuditChime } from './AudioSynthesizer';
import { SecuritySubTab } from './views/SecurityView';
import { copyToClipboard } from '../utils/clipboard';
import { ViewType } from '../types';
import { automatedBackupService, AutomatedBackupState } from '../services/automatedBackupService';

export interface SystemEvent {
  id: string;
  type:
    | 'HARDWARE'
    | 'CRYPTO'
    | 'LEGAL_SEARCH'
    | 'COMPLIANCE'
    | 'AUDIO'
    | 'SECURITY'
    | 'EVIDENCE_IMPORTED'
    | 'INVARIANT'
    | 'FORENSIC'
    | 'BACKUP'
    | 'ANOMALY'
    | 'WARNING'
    | 'ALERT';
  title: string;
  description: string;
  timestamp: string;
  metaHash?: string;
  statuteRef?: string;
  targetView?: ViewType;
  targetTab?: SecuritySubTab;
  isComplianceDrift?: boolean;
  severity: 'info' | 'success' | 'warning' | 'critical';
}

interface SystemEventsSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  events: SystemEvent[];
  onClearEvents: () => void;
  onNavigateToView?: (view: any, tab?: SecuritySubTab) => void;
  onSimulateComplianceDrift?: () => void;
}

export const SystemEventsSidebar: React.FC<SystemEventsSidebarProps> = ({
  isOpen,
  onClose,
  events,
  onClearEvents,
  onNavigateToView,
  onSimulateComplianceDrift,
}) => {
  const [filter, setFilter] = useState<'ALL' | 'COMPLIANCE' | 'CRYPTO' | 'HARDWARE' | 'LEGAL_SEARCH'>('ALL');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [backupState, setBackupState] = useState<AutomatedBackupState>(() => automatedBackupService.getState());
  const [isDemoMode, setIsDemoMode] = useState<boolean>(false);

  useEffect(() => {
    const unsub = automatedBackupService.subscribe((state) => {
      setBackupState(state);
    });
    return unsub;
  }, []);

  if (!isOpen) return null;

  const handleToggleCadence = () => {
    const nextDemo = !isDemoMode;
    setIsDemoMode(nextDemo);
    automatedBackupService.setCycleDuration(nextDemo ? 60 : 3600);
    playTone(nextDemo ? 720 : 540, 0.04);
  };

  const handleTriggerManualSnapshot = () => {
    playAuditChime();
    automatedBackupService.triggerManualSnapshot();
  };

  const handleTogglePause = () => {
    const isNowRunning = automatedBackupService.togglePause();
    playTone(isNowRunning ? 640 : 420, 0.04);
  };

  const minutesRemaining = Math.floor(backupState.timeRemainingSeconds / 60);
  const secondsRemaining = backupState.timeRemainingSeconds % 60;
  const timeFormatted = `${String(minutesRemaining).padStart(2, '0')}:${String(secondsRemaining).padStart(2, '0')}`;

  const filteredEvents = events.filter((ev) => {
    if (filter === 'ALL') return true;
    if (filter === 'COMPLIANCE') return ev.type === 'COMPLIANCE' || ev.type === 'LEGAL_SEARCH' || ev.isComplianceDrift;
    return ev.type === filter;
  });

  const handleCopy = (id: string, text: string) => {
    copyToClipboard(text);
    setCopiedId(id);
    playTone(700, 0.04);
    setTimeout(() => setCopiedId(null), 1800);
  };

  const getEventBadge = (type: SystemEvent['type'], isComplianceDrift?: boolean, severity?: SystemEvent['severity']) => {
    if (isComplianceDrift || severity === 'warning' || severity === 'critical') {
      return {
        label: severity === 'critical' ? 'CRITICAL COMPLIANCE DRIFT' : 'COMPLIANCE DRIFT ALERT',
        icon: <ShieldAlert className="w-3 h-3 text-rose-400 animate-pulse" />,
        color: severity === 'critical' 
          ? 'bg-rose-500/20 text-rose-300 border-rose-500/40' 
          : 'bg-amber-500/20 text-amber-300 border-amber-500/40',
      };
    }

    switch (type) {
      case 'COMPLIANCE':
        return {
          label: 'LEGAL COMPLIANCE ALERT',
          icon: <Scale className="w-3 h-3 text-cyan-400" />,
          color: 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30',
        };
      case 'LEGAL_SEARCH':
        return {
          label: 'THAI LEGAL ORACLE',
          icon: <Scale className="w-3 h-3 text-emerald-400" />,
          color: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
        };
      case 'HARDWARE':
        return {
          label: 'HARDWARE & CRYO',
          icon: <Cpu className="w-3 h-3 text-cyan-400" />,
          color: 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30',
        };
      case 'CRYPTO':
        return {
          label: 'CRYPTOGRAPHY & SEALS',
          icon: <Binary className="w-3 h-3 text-violet-400" />,
          color: 'bg-violet-500/15 text-violet-300 border-violet-500/30',
        };
      case 'AUDIO':
        return {
          label: 'SOVEREIGN AUDIO',
          icon: <Volume2 className="w-3 h-3 text-amber-400" />,
          color: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
        };
      case 'EVIDENCE_IMPORTED':
        return {
          label: 'EVIDENCE INTAKE (PROVENANCE)',
          icon: <FileCheck className="w-3 h-3 text-indigo-400" />,
          color: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40',
        };
      case 'BACKUP':
        return {
          label: 'HOURLY SYSTEM SNAPSHOT',
          icon: <Archive className="w-3 h-3 text-emerald-400" />,
          color: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
        };
      case 'ANOMALY':
        return {
          label: 'TELEMETRY ANOMALY (OUTLIER)',
          icon: <AlertTriangle className="w-3 h-3 text-amber-400" />,
          color: 'bg-amber-500/20 text-amber-200 border-amber-500/40',
        };
      case 'SECURITY':
      default:
        return {
          label: 'SECURITY AUDIT',
          icon: <Shield className="w-3 h-3 text-rose-400" />,
          color: 'bg-rose-500/15 text-rose-300 border-rose-500/30',
        };
    }
  };

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full max-w-md bg-[#07080F]/95 backdrop-blur-2xl border-l border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.8)] flex flex-col font-mono animate-in slide-in-from-right duration-300">
      {/* Sidebar Header */}
      <div className="p-4 sm:p-5 border-b border-white/8 bg-gradient-to-b from-[#0e1222] to-transparent flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-2xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-300">
            <Bell className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold text-white uppercase tracking-wider">System Events Activity Feed</h2>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 font-bold">
                {events.length}
              </span>
            </div>
            <p className="text-[11px] text-zinc-400 font-sans mt-0.5">Real-time hardware triggers & legal compliance telemetry</p>
          </div>
        </div>

        <div className="flex items-center gap-1">
          {events.length > 0 && (
            <button
              onClick={() => {
                playTone(480, 0.05);
                onClearEvents();
              }}
              className="p-2 rounded-xl text-zinc-400 hover:text-rose-400 hover:bg-white/5 transition-all"
              title="Clear event logs"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={() => {
              playTone(450, 0.04);
              onClose();
            }}
            className="p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-white/5 transition-all"
            title="Close sidebar (Esc)"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Automated Background Snapshot & State Backup Service Progress Card */}
      <div className="p-4 border-b border-white/8 bg-gradient-to-br from-[#0c1328]/95 via-[#080b18]/90 to-[#0c1328]/95 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span
                className={`animate-ping absolute inline-flex h-full w-full rounded-full ${
                  backupState.isRunning ? 'bg-cyan-400 opacity-75' : 'bg-zinc-600'
                }`}
              />
              <span
                className={`relative inline-flex rounded-full h-2 w-2 ${
                  backupState.isRunning ? 'bg-cyan-400' : 'bg-zinc-500'
                }`}
              />
            </span>
            <span className="text-xs font-bold text-white tracking-wide uppercase flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-cyan-400" />
              <span>Automated Hourly State Backup</span>
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={handleToggleCadence}
              className={`px-2 py-0.5 rounded-lg text-[10px] font-bold border transition-all ${
                isDemoMode
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                  : 'bg-white/5 text-zinc-400 border-white/10 hover:text-zinc-200'
              }`}
              title="Toggle between 1-Hour standard cadence and 60-Second rapid simulation"
            >
              {isDemoMode ? '⚡ FAST (60s)' : '1 HOUR CYCLE'}
            </button>

            <button
              onClick={handleTogglePause}
              className="p-1 rounded-lg bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white transition-all"
              title={backupState.isRunning ? 'Pause backup cycle' : 'Resume backup cycle'}
            >
              {backupState.isRunning ? (
                <Pause className="w-3 h-3 text-cyan-300" />
              ) : (
                <Play className="w-3 h-3 text-emerald-400" />
              )}
            </button>
          </div>
        </div>

        {/* Live Progress Bar with Smooth Transitions */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-[11px]">
            <span className="text-zinc-400 flex items-center gap-1 font-mono">
              <span>Next Snapshot in:</span>
              <strong className="text-cyan-300 font-bold">{timeFormatted}</strong>
            </span>
            <span className="text-cyan-400 font-bold font-mono">
              {backupState.progressPct}%
            </span>
          </div>

          <div className="w-full h-2 bg-black/60 rounded-full overflow-hidden border border-white/8 p-0.5">
            <div
              className="h-full bg-gradient-to-r from-cyan-500 via-sky-400 to-emerald-400 rounded-full transition-all duration-300 shadow-[0_0_10px_rgba(6,182,212,0.5)]"
              style={{ width: `${backupState.progressPct}%` }}
            />
          </div>
        </div>

        {/* Snapshot Stats and Instant Trigger Button */}
        <div className="flex items-center justify-between pt-1 text-[10px] text-zinc-400">
          <div className="space-y-0.5">
            <div>
              Total Archived: <strong className="text-white">#{backupState.totalBackupsCount}</strong>
            </div>
            <div className="text-zinc-500">
              Last Sealed: {backupState.lastBackupTime || 'Initial Genesis'}
            </div>
          </div>

          <button
            onClick={handleTriggerManualSnapshot}
            className="px-3 py-1.5 rounded-xl bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-500/35 hover:border-cyan-400 text-cyan-200 hover:text-white font-bold transition-all flex items-center gap-1.5 shadow-[0_0_10px_rgba(6,182,212,0.15)]"
            title="Execute instantaneous full system snapshot & Merkle state verification"
          >
            <Zap className="w-3 h-3 text-cyan-300" />
            <span>Capture Now</span>
          </button>
        </div>
      </div>

      {/* Proactive Compliance Drift Trigger Toolbar */}
      {onSimulateComplianceDrift && (
        <div className="px-4 py-2 border-b border-white/5 bg-amber-500/[0.04] flex items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-1.5 text-amber-300 text-[11px]">
            <Zap className="w-3.5 h-3.5" />
            <span>Invariant Watchdog Service</span>
          </div>
          <button
            onClick={() => {
              playTone(580, 0.04);
              onSimulateComplianceDrift();
            }}
            className="px-2.5 py-1 rounded-lg bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/30 text-amber-200 text-[10px] font-bold transition-all flex items-center gap-1"
            title="Probe Sovereign Kernel for invariant deviations & trigger compliance drift alert"
          >
            <span>Probe Compliance Drift</span>
          </button>
        </div>
      )}

      {/* Filter Tabs */}
      <div className="px-4 py-2.5 border-b border-white/5 flex items-center gap-1.5 overflow-x-auto text-[11px]">
        {(['ALL', 'COMPLIANCE', 'CRYPTO', 'HARDWARE', 'LEGAL_SEARCH'] as const).map((f) => (
          <button
            key={f}
            onClick={() => {
              playTone(550, 0.03);
              setFilter(f);
            }}
            className={`px-3 py-1 rounded-xl transition-all whitespace-nowrap ${
              filter === f
                ? 'bg-white/15 text-white font-bold border border-white/20'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            {f === 'ALL'
              ? 'All Events'
              : f === 'COMPLIANCE'
              ? '⚖️ Legal Alerts'
              : f === 'CRYPTO'
              ? 'Crypto Seals'
              : f === 'HARDWARE'
              ? 'Hardware'
              : 'Oracle Search'}
          </button>
        ))}
      </div>

      {/* Events Stream List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-thin scrollbar-thumb-white/10">
        {filteredEvents.length === 0 ? (
          <div className="h-64 flex flex-col items-center justify-center text-center p-6 text-zinc-500 space-y-2">
            <Radio className="w-8 h-8 text-zinc-600 animate-pulse" />
            <p className="text-xs">No active telemetry events in buffer.</p>
            <p className="text-[10px] text-zinc-600 font-sans">
              Events stream automatically upon snapshot capture, legal search, or cryptographic block sealing.
            </p>
          </div>
        ) : (
          filteredEvents.map((ev) => {
            const badge = getEventBadge(ev.type, ev.isComplianceDrift, ev.severity);
            const isCompliance = ev.type === 'COMPLIANCE' || !!ev.statuteRef || !!ev.isComplianceDrift;
            const isCriticalOrDrift = ev.isComplianceDrift || ev.severity === 'critical' || ev.severity === 'warning';

            return (
              <div
                key={ev.id}
                className={`p-3.5 rounded-2xl border transition-all space-y-2 text-xs shadow-lg group ${
                  isCriticalOrDrift
                    ? 'bg-gradient-to-br from-rose-950/40 via-[#0e0f1e] to-[#070914] border-rose-500/40 hover:border-rose-500/60 shadow-[0_0_20px_rgba(244,63,94,0.15)]'
                    : isCompliance
                    ? 'bg-gradient-to-br from-[#0c1424]/90 to-[#070914] border-cyan-500/25 hover:border-cyan-500/40'
                    : 'bg-[#0b0e1a]/85 border-white/8 hover:border-white/20'
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className={`px-2 py-0.5 rounded-lg text-[10px] font-bold border flex items-center gap-1 ${badge.color}`}>
                    {badge.icon}
                    <span>{badge.label}</span>
                  </span>

                  <div className="flex items-center gap-2 text-[10px] text-zinc-500">
                    <span>{ev.timestamp}</span>
                    <button
                      onClick={() => handleCopy(ev.id, `${ev.title} | ${ev.description} | ${ev.metaHash || ''}`)}
                      className="text-zinc-500 hover:text-zinc-200 transition-colors"
                      title="Copy Event Details"
                    >
                      {copiedId === ev.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                <div>
                  <h4 className="text-zinc-100 font-bold text-xs">{ev.title}</h4>
                  <p className="text-[11px] text-zinc-400 font-sans mt-0.5 leading-relaxed">{ev.description}</p>
                </div>

                {/* Direct Navigation Button for Compliance & Drift Alerts */}
                {(ev.statuteRef || ev.targetView || ev.isComplianceDrift) && (
                  <div className={`p-2.5 rounded-xl border text-[11px] flex items-center justify-between gap-2 ${
                    isCriticalOrDrift
                      ? 'bg-rose-500/15 border-rose-500/30 text-rose-200'
                      : 'bg-blue-500/10 border-blue-500/20 text-cyan-300'
                  }`}>
                    <span className="font-semibold truncate max-w-[190px]">{ev.statuteRef || 'Thai Sovereign Invariant Lock'}</span>
                    <button
                      onClick={() => {
                        playTone(600, 0.05);
                        onNavigateToView?.(ev.targetView || 'security', ev.targetTab || 'legal-dashboard');
                        onClose();
                      }}
                      className={`text-[10px] font-bold flex items-center gap-1 underline transition-colors shrink-0 ${
                        isCriticalOrDrift ? 'text-rose-300 hover:text-white' : 'text-cyan-400 hover:text-white'
                      }`}
                    >
                      <span>{ev.isComplianceDrift ? 'Inspect & Lock Invariant' : 'View in Security'}</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                )}

                {ev.metaHash && !ev.statuteRef && !ev.isComplianceDrift && (
                  <div className="p-2 rounded-xl bg-black/50 border border-white/5 text-[10px] text-cyan-300/80 truncate select-all flex items-center justify-between">
                    <span className="truncate">{ev.metaHash}</span>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Footer Info */}
      <div className="p-4 border-t border-white/8 bg-[#07080F]/90 text-[11px] text-zinc-500 flex items-center justify-between">
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>OTLP Telemetry & Legal Oracle Active</span>
        </span>
        <span className="text-zinc-400">Port 3000 • Sovereign Kernel</span>
      </div>
    </div>
  );
};
