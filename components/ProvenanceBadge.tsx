'use client';

import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Activity, 
  Radio, 
  Layout, 
  Cpu, 
  Clock, 
  AlertOctagon, 
  Lock,
  Info,
  ChevronDown
} from 'lucide-react';

export type ProvenanceType = 
  | 'CANONICAL'
  | 'RUNTIME'
  | 'TELEMETRY'
  | 'PRESENTATION'
  | 'SIMULATION'
  | 'PENDING'
  | 'REJECTED'
  | 'FROZEN'
  | 'UNVERIFIED';

interface ProvenanceBadgeProps {
  type: ProvenanceType;
  authority?: string;
  source?: string;
  evidenceStatus?: string;
  isSimulated?: boolean;
  size?: 'xs' | 'sm' | 'md';
  showDetailsTooltip?: boolean;
  className?: string;
}

export const PROVENANCE_META: Record<ProvenanceType, {
  label: string;
  colorBg: string;
  colorBorder: string;
  colorText: string;
  icon: React.ComponentType<{ className?: string }>;
  defaultAuthority: string;
  defaultSource: string;
  defaultEvidence: string;
  category: 'AUTHORITATIVE' | 'OBSERVED' | 'DERIVED' | 'SIMULATED' | 'UI_STATE' | 'UNVERIFIED';
  disclosure?: string;
}> = {
  CANONICAL: {
    label: 'CANONICAL',
    colorBg: 'bg-emerald-500/15',
    colorBorder: 'border-emerald-500/50',
    colorText: 'text-emerald-300',
    icon: ShieldCheck,
    defaultAuthority: 'SSoT Architecture Authority',
    defaultSource: 'Merkle Root Block #849202',
    defaultEvidence: 'Cryptographically Verified (14,902 Seals Δ0)',
    category: 'AUTHORITATIVE'
  },
  FROZEN: {
    label: 'FROZEN',
    colorBg: 'bg-amber-500/20',
    colorBorder: 'border-amber-400/60',
    colorText: 'text-amber-300',
    icon: Lock,
    defaultAuthority: 'Immutable Baseline Contract',
    defaultSource: 'ZYRQUEN_COSMIC_v1.2_LTS',
    defaultEvidence: 'Locked Hardware Baseline (Phase 01–40 Ceiling)',
    category: 'AUTHORITATIVE'
  },
  RUNTIME: {
    label: 'RUNTIME',
    colorBg: 'bg-cyan-500/15',
    colorBorder: 'border-cyan-400/50',
    colorText: 'text-cyan-300',
    icon: Activity,
    defaultAuthority: 'Active Engine Runtime',
    defaultSource: 'In-Memory Client State & Execution Bus',
    defaultEvidence: 'Live Observed State',
    category: 'OBSERVED'
  },
  TELEMETRY: {
    label: 'TELEMETRY',
    colorBg: 'bg-purple-500/15',
    colorBorder: 'border-purple-400/50',
    colorText: 'text-purple-300',
    icon: Radio,
    defaultAuthority: 'Probing & Metric Stream',
    defaultSource: 'Sub-Kelvin & QOps Probes',
    defaultEvidence: 'Observed Telemetry Signal (Simulated Stream)',
    category: 'DERIVED',
    disclosure: 'UI / simulated telemetry — not physical hardware evidence.'
  },
  PRESENTATION: {
    label: 'PRESENTATION',
    colorBg: 'bg-indigo-500/15',
    colorBorder: 'border-indigo-400/50',
    colorText: 'text-indigo-300',
    icon: Layout,
    defaultAuthority: 'Client UI Projection',
    defaultSource: 'DOM / WebGL / Canvas / D3 Layout',
    defaultEvidence: 'Rendered View Projection',
    category: 'UI_STATE'
  },
  SIMULATION: {
    label: 'SIMULATION',
    colorBg: 'bg-amber-500/15',
    colorBorder: 'border-amber-500/50',
    colorText: 'text-amber-300',
    icon: Cpu,
    defaultAuthority: 'Mathematical Model Generator',
    defaultSource: 'Synthetic Sandbox Engine',
    defaultEvidence: 'Synthetic Model / Scenario',
    category: 'SIMULATED',
    disclosure: 'UI / simulated telemetry — not physical hardware evidence.'
  },
  PENDING: {
    label: 'PENDING',
    colorBg: 'bg-slate-500/15',
    colorBorder: 'border-slate-500/50',
    colorText: 'text-slate-300',
    icon: Clock,
    defaultAuthority: 'Awaiting Authorization',
    defaultSource: 'Uncommitted Ingest Queue',
    defaultEvidence: 'Pending Deca-Quorum Attestation',
    category: 'DERIVED'
  },
  REJECTED: {
    label: 'REJECTED',
    colorBg: 'bg-rose-500/15',
    colorBorder: 'border-rose-500/50',
    colorText: 'text-rose-300',
    icon: AlertOctagon,
    defaultAuthority: 'Fail-Closed Quarantine Shield',
    defaultSource: 'Violation Interceptor',
    defaultEvidence: 'Blocked by Fail-Closed Invariant',
    category: 'AUTHORITATIVE'
  },
  UNVERIFIED: {
    label: 'UNVERIFIED',
    colorBg: 'bg-zinc-800/80',
    colorBorder: 'border-zinc-600/70',
    colorText: 'text-zinc-300',
    icon: Info,
    defaultAuthority: 'Unattested Layer',
    defaultSource: 'No Independent Runtime Evidence',
    defaultEvidence: 'UNVERIFIED / NO RUNTIME EVIDENCE',
    category: 'UNVERIFIED',
    disclosure: 'No physical hardware or external certificate available for verification.'
  }
};

export default function ProvenanceBadge({
  type,
  authority,
  source,
  evidenceStatus,
  isSimulated = false,
  size = 'xs',
  showDetailsTooltip = true,
  className = ''
}: ProvenanceBadgeProps) {
  const [showTooltip, setShowTooltip] = useState(false);
  const meta = PROVENANCE_META[type] || PROVENANCE_META.CANONICAL;
  const Icon = meta.icon;

  const authText = authority || meta.defaultAuthority;
  const srcText = source || meta.defaultSource;
  const evText = evidenceStatus || meta.defaultEvidence;

  const sizeClasses = {
    xs: 'text-[9px] px-1.5 py-0.5 gap-1',
    sm: 'text-[10px] px-2 py-0.5 gap-1.5',
    md: 'text-xs px-2.5 py-1 gap-2'
  }[size];

  return (
    <div className={`relative inline-flex items-center font-mono select-none ${className}`}>
      <div 
        onClick={() => showDetailsTooltip && setShowTooltip(!showTooltip)}
        onMouseEnter={() => showDetailsTooltip && setShowTooltip(true)}
        onMouseLeave={() => showDetailsTooltip && setShowTooltip(false)}
        className={`inline-flex items-center rounded-md border font-bold uppercase tracking-wider transition-all duration-150 cursor-pointer ${meta.colorBg} ${meta.colorBorder} ${meta.colorText} ${sizeClasses}`}
        title={`Click to view provenance details for ${meta.label}`}
      >
        <Icon className={size === 'xs' ? 'w-2.5 h-2.5' : size === 'sm' ? 'w-3 h-3' : 'w-3.5 h-3.5'} />
        <span>{meta.label}</span>
        {isSimulated && type !== 'SIMULATION' && (
          <span className="opacity-80 text-[8px] bg-amber-500/20 px-1 rounded text-amber-200">SIM</span>
        )}
      </div>

      {/* Expandable Provenance Detail Tooltip */}
      {showTooltip && (
        <div 
          className="absolute bottom-full left-0 mb-1.5 z-50 w-64 p-2.5 bg-[#070e1c] border border-cyan-500/50 rounded-xl shadow-2xl backdrop-blur-xl text-left space-y-1.5 text-[10px] font-mono pointer-events-auto"
          onMouseEnter={() => setShowTooltip(true)}
          onMouseLeave={() => setShowTooltip(false)}
        >
          <div className="flex items-center justify-between border-b border-slate-800 pb-1">
            <span className={`font-bold flex items-center gap-1 ${meta.colorText}`}>
              <Icon className="w-3 h-3" />
              {meta.label} PROVENANCE
            </span>
            <span className="text-[8px] px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-400">
              {meta.category}
            </span>
          </div>

          <div className="space-y-1 text-slate-300">
            <div>
              <span className="text-slate-500 block text-[8px] uppercase">Authority Level:</span>
              <span className="text-cyan-200 font-semibold">{authText}</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[8px] uppercase">Data Source:</span>
              <span className="text-slate-200">{srcText}</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[8px] uppercase">Evidence Status:</span>
              <span className="text-emerald-300">{evText}</span>
            </div>
            {meta.disclosure && (
              <div className="p-1 rounded bg-amber-950/40 border border-amber-500/30 text-amber-300 text-[8.5px] leading-tight">
                ⚠️ {meta.disclosure}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
