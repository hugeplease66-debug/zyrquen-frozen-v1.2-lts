import React, { useState, useEffect } from 'react';
import { 
  Cpu, 
  ShieldAlert, 
  Rocket, 
  Flame, 
  KeyRound, 
  ShieldCheck, 
  Coins, 
  RefreshCw, 
  UserCheck, 
  Snowflake, 
  Database, 
  Binary, 
  Radio, 
  Terminal, 
  Orbit, 
  Layers, 
  Archive, 
  CheckCircle2,
  Search,
  AlertTriangle,
  Lock,
  SlidersHorizontal,
  Info,
  Clock
} from 'lucide-react';
import { CHAMBERS } from '../data/canonicalData';
import { 
  CHAMBERS_REGISTRY_DATA, 
  registryData,
  ChamberHealthState, 
  ChamberRegistryEntry, 
  getChamberRegistryEntry,
  getHealthIndicatorEmoji
} from '../data/registryData';

interface ChamberNavProps {
  activeChamber: number;
  setActiveChamber: (num: number) => void;
  lang: 'th' | 'en';
}

export type SecurityHealthLevel = 'green' | 'yellow' | 'red';
export type SecurityHealthState = 'Nominal' | 'Drift Detected' | 'Lockdown';

export interface ChamberSecurityProfile {
  health: SecurityHealthLevel;
  healthState: SecurityHealthState;
  healthStateTh: string;
  healthScore: number; // 0 - 100%
  indicatorEmoji: '🟢' | '🟡' | '🔴';
  statusLabelEn: string;
  statusLabelTh: string;
  enclaveNameEn: string;
  enclaveNameTh: string;
  threatLevelEn: string;
  threatLevelTh: string;
  baseLatencyMs: number;
  securityDomain: string;
  lastChecked: string;
  auditEvidenceRef: string;
}

/**
 * Maps the imported CHAMBERS_REGISTRY_DATA into the UI ChamberSecurityProfile format
 */
function buildBaseProfileFromRegistry(entry: ChamberRegistryEntry): ChamberSecurityProfile {
  const healthLevel: SecurityHealthLevel = 
    entry.health === 'Lockdown' ? 'red' : 
    entry.health === 'Drift Detected' ? 'yellow' : 'green';

  const statusLabelEn = 
    entry.health === 'Lockdown' ? 'LOCKDOWN / 85°C' :
    entry.health === 'Drift Detected' ? 'DRIFT DETECTED' : '100% SSoT SECURE';

  const statusLabelTh = 
    entry.health === 'Lockdown' ? 'ล็อกดาวน์ / 85°C' :
    entry.health === 'Drift Detected' ? 'ตรวจพบดริฟต์แฝง' : 'ปลอดภัย 100% SSoT';

  const healthStateTh = 
    entry.health === 'Lockdown' ? 'ระบบล็อกดาวน์ (Lockdown / Fail-Closed Active)' :
    entry.health === 'Drift Detected' ? 'ตรวจพบความเบี่ยงเบนแฝง (Drift Detected)' : 'สถานะปกติ (Nominal SSoT)';

  return {
    health: healthLevel,
    healthState: entry.health,
    healthStateTh,
    healthScore: entry.healthScorePct,
    indicatorEmoji: entry.indicator,
    statusLabelEn,
    statusLabelTh,
    enclaveNameEn: entry.nameEn,
    enclaveNameTh: entry.nameTh,
    threatLevelEn: entry.health === 'Lockdown' ? 'CRITICAL ISOLATION' : entry.health === 'Drift Detected' ? 'LATENT MONITORING' : 'ZERO DRIFT (Δ0.0%)',
    threatLevelTh: entry.health === 'Lockdown' ? 'กักกันภัยขั้นวิกฤต' : entry.health === 'Drift Detected' ? 'เฝ้าระวังความเบี่ยงเบน' : 'ไร้การเบี่ยงเบน (Δ0.0%)',
    baseLatencyMs: entry.latencyMs,
    securityDomain: entry.securityDomain,
    lastChecked: entry.lastChecked,
    auditEvidenceRef: entry.auditEvidenceRef
  };
}

// Generate base profiles directly driven by imported CHAMBERS_REGISTRY_DATA
const BASE_SECURITY_PROFILES: Record<number, ChamberSecurityProfile> = Object.values(CHAMBERS_REGISTRY_DATA).reduce(
  (acc, entry) => {
    acc[entry.chamberNum] = buildBaseProfileFromRegistry(entry);
    return acc;
  },
  {} as Record<number, ChamberSecurityProfile>
);

const getChamberIcon = (num: number) => {
  switch (num) {
    case 1: return <Cpu className="w-3.5 h-3.5 text-cyan-400" />;
    case 2: return <ShieldAlert className="w-3.5 h-3.5 text-red-400" />;
    case 3: return <Rocket className="w-3.5 h-3.5 text-blue-400" />;
    case 4: return <Flame className="w-3.5 h-3.5 text-amber-400" />;
    case 5: return <KeyRound className="w-3.5 h-3.5 text-emerald-400" />;
    case 6: return <ShieldCheck className="w-3.5 h-3.5 text-purple-400" />;
    case 7: return <Coins className="w-3.5 h-3.5 text-yellow-400" />;
    case 8: return <RefreshCw className="w-3.5 h-3.5 text-cyan-400" />;
    case 9: return <UserCheck className="w-3.5 h-3.5 text-indigo-400" />;
    case 10: return <Snowflake className="w-3.5 h-3.5 text-teal-400" />;
    case 11: return <Database className="w-3.5 h-3.5 text-emerald-400" />;
    case 12: return <Binary className="w-3.5 h-3.5 text-cyan-400" />;
    case 13: return <Radio className="w-3.5 h-3.5 text-rose-400" />;
    case 14: return <Terminal className="w-3.5 h-3.5 text-slate-400" />;
    case 15: return <Orbit className="w-3.5 h-3.5 text-sky-400" />;
    case 16: return <Layers className="w-3.5 h-3.5 text-violet-400" />;
    case 17: return <Archive className="w-3.5 h-3.5 text-amber-400" />;
    case 18: return <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />;
    default: return <Cpu className="w-3.5 h-3.5 text-cyan-400" />;
  }
};

export const ChamberNavigation: React.FC<ChamberNavProps> = ({
  activeChamber,
  setActiveChamber,
  lang
}) => {
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [healthFilter, setHealthFilter] = useState<'all' | 'green' | 'yellow' | 'red'>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [pulseTick, setPulseTick] = useState<number>(0);
  const [simulationMode, setSimulationMode] = useState<'baseline' | 'stress' | 'tamper'>('baseline');

  // Real-time ticking heartbeat simulation for dynamic telemetry latency and live health variation
  useEffect(() => {
    const interval = setInterval(() => {
      setPulseTick(prev => (prev + 1) % 1000);
    }, 1800);
    return () => clearInterval(interval);
  }, []);

  // Compute simulated health state dynamically from registry data & selected scenario
  const getSimulatedHealthProfile = (chamberNum: number): ChamberSecurityProfile => {
    const base: ChamberSecurityProfile = BASE_SECURITY_PROFILES[chamberNum] || {
      health: 'green',
      healthState: 'Nominal',
      healthStateTh: 'สถานะปกติ (Nominal)',
      healthScore: 100,
      indicatorEmoji: '🟢',
      statusLabelEn: 'SECURE',
      statusLabelTh: 'ปลอดภัย',
      enclaveNameEn: 'Enclave',
      enclaveNameTh: 'เอนเคลฟ',
      threatLevelEn: 'OPTIMAL',
      threatLevelTh: 'ปกติ',
      baseLatencyMs: 0.8,
      securityDomain: 'General',
      lastChecked: '2026-09-03T22:30:00.000Z',
      auditEvidenceRef: `AUD-849202-CH${chamberNum}`
    };

    if (simulationMode === 'baseline') {
      return base;
    }

    if (simulationMode === 'stress') {
      // Under Stress Simulation: warp, simulation, replay, radar report latent drift
      if (chamberNum === 3 || chamberNum === 4 || chamberNum === 8 || chamberNum === 13) {
        return {
          ...base,
          health: 'yellow',
          healthState: 'Drift Detected',
          healthStateTh: 'ตรวจพบความเบี่ยงเบนแฝง (Latent Drift - High Stress)',
          healthScore: 78,
          indicatorEmoji: '🟡',
          statusLabelEn: 'STRESS 78%',
          statusLabelTh: 'โหลดสูง 78%',
          baseLatencyMs: base.baseLatencyMs * 1.8
        };
      }
      if (chamberNum === 16) {
        return {
          ...base,
          health: 'yellow',
          healthState: 'Drift Detected',
          healthStateTh: 'ตรวจพบความเบี่ยงเบนแฝง (Twin Mirror Lag)',
          healthScore: 82,
          indicatorEmoji: '🟡',
          statusLabelEn: 'MIRROR LOAD',
          statusLabelTh: 'โหลดมิลเลอร์',
          baseLatencyMs: 1.9
        };
      }
      return base;
    }

    if (simulationMode === 'tamper') {
      // Under Tamper/Fail-Closed Simulation: active breach triggers lockdown
      if (chamberNum === 2) {
        return {
          ...base,
          health: 'red',
          healthState: 'Lockdown',
          healthStateTh: 'ระบบล็อกดาวน์ (Lockdown 85.0°C Fail-Closed)',
          healthScore: 24,
          indicatorEmoji: '🔴',
          statusLabelEn: 'LOCKDOWN 85°C',
          statusLabelTh: 'ล็อกดาวน์ 85°C',
          threatLevelEn: 'CRITICAL ESCROW INTERCEPT',
          threatLevelTh: 'สกัดการโจมตีฉุกเฉิน',
          baseLatencyMs: 2.8
        };
      }
      if (chamberNum === 13) {
        return {
          ...base,
          health: 'red',
          healthState: 'Lockdown',
          healthStateTh: 'ระบบล็อกดาวน์ (Lockdown - Intrusion Alert)',
          healthScore: 50,
          indicatorEmoji: '🔴',
          statusLabelEn: 'PROBE DETECTED',
          statusLabelTh: 'ตรวจพบโพรบแปลกปลอม',
          threatLevelEn: 'ACTIVE INTRUSION SWEEP',
          threatLevelTh: 'กวาดจับภัยคุกคาม',
          baseLatencyMs: 2.2
        };
      }
      if (chamberNum === 6 || chamberNum === 8) {
        return {
          ...base,
          health: 'yellow',
          healthState: 'Drift Detected',
          healthStateTh: 'ตรวจพบความเบี่ยงเบนแฝง (Crypto Decrypt Probe)',
          healthScore: 81,
          indicatorEmoji: '🟡',
          statusLabelEn: 'DECRYPT GUARD',
          statusLabelTh: 'เฝ้าระวังแกะรหัส',
          baseLatencyMs: 1.5
        };
      }
      return base;
    }

    return base;
  };

  const categories = [
    { id: 'all', labelTh: 'ทั้งหมด 18 ห้อง', labelEn: 'All 18 Chambers' },
    { id: 'core', labelTh: 'แกนกลาง (Core)', labelEn: 'Core' },
    { id: 'crypto', labelTh: 'รหัสลับ & กักกัน (Crypto/Escrow)', labelEn: 'Crypto & Escrow' },
    { id: 'storage', labelTh: 'คลัง & เมอร์เคิล (Ledger/Storage)', labelEn: 'Ledger & Storage' },
    { id: 'network', labelTh: 'โครงข่าย & อวกาศ (Mesh/Orbital)', labelEn: 'Mesh & Orbital' },
    { id: 'defense', labelTh: 'ระบบป้องกัน (Defense)', labelEn: 'Defense' }
  ];

  // Calculate live health summary counts
  const allProfiles = CHAMBERS.map(ch => getSimulatedHealthProfile(ch.num));
  const countGreen = allProfiles.filter(p => p.health === 'green').length;
  const countYellow = allProfiles.filter(p => p.health === 'yellow').length;
  const countRed = allProfiles.filter(p => p.health === 'red').length;

  const filteredChambers = CHAMBERS.filter((ch) => {
    const profile = getSimulatedHealthProfile(ch.num);
    const matchesCategory = filterCategory === 'all' || ch.category === filterCategory;
    const matchesHealth = healthFilter === 'all' || profile.health === healthFilter;
    const matchesSearch = 
      ch.titleTh.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ch.titleEn.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ch.descriptionTh.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ch.descriptionEn.toLowerCase().includes(searchTerm.toLowerCase()) ||
      profile.enclaveNameEn.toLowerCase().includes(searchTerm.toLowerCase()) ||
      profile.enclaveNameTh.toLowerCase().includes(searchTerm.toLowerCase()) ||
      profile.healthState.toLowerCase().includes(searchTerm.toLowerCase()) ||
      `chamber ${ch.num}`.includes(searchTerm.toLowerCase()) ||
      `ch-${ch.num}`.includes(searchTerm.toLowerCase()) ||
      profile.statusLabelEn.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesHealth && matchesSearch;
  });

  return (
    <div 
      id="chamber-navigation-bar" 
      className="chamber-navigation bg-slate-900/95 border-b border-slate-800 p-4 sticky top-[77px] z-30 backdrop-blur-md shadow-lg"
    >
      <div className="max-w-7xl mx-auto space-y-3">
        {/* Top Controls: Filter Pills, Real-time Simulation Status & Search */}
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
          
          {/* Category & Master Federation Button */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full pb-1 lg:pb-0 scrollbar-none">
            <button
              id="nav-master-console-btn"
              onClick={() => setActiveChamber(0)}
              className={`px-3 py-1 text-xs font-bold rounded-full whitespace-nowrap transition-all flex items-center gap-1.5 border shrink-0 ${
                activeChamber === 0
                  ? 'bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600 text-white border-cyan-300 shadow-md shadow-cyan-500/40 ring-1 ring-cyan-300'
                  : 'bg-cyan-950/80 hover:bg-cyan-900/80 text-cyan-300 border-cyan-500/40'
              }`}
            >
              <span>🏛️</span>
              <span>{lang === 'th' ? 'ภาพรวมสหพันธรัฐ 18 ห้อง' : 'Master Matrix (All 18)'}</span>
            </button>

            {categories.map((cat) => (
              <button
                key={cat.id}
                id={`nav-filter-category-${cat.id}`}
                onClick={() => setFilterCategory(cat.id)}
                className={`px-2.5 py-1 text-xs font-medium rounded-full whitespace-nowrap transition-all shrink-0 ${
                  filterCategory === cat.id
                    ? 'bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-500/20'
                    : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700'
                }`}
              >
                {lang === 'th' ? cat.labelTh : cat.labelEn}
              </button>
            ))}
          </div>

          {/* Right Controls: Health Quick Filters & Simulation Scenario Selector */}
          <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 shrink-0">
            {/* Health Filter Chips with 🟢 🟡 🔴 color-coded badges */}
            <div className="flex items-center bg-slate-950/90 border border-slate-800 rounded-lg p-0.5 text-[11px] font-mono-code">
              <button
                id="filter-health-all"
                onClick={() => setHealthFilter('all')}
                title={lang === 'th' ? 'แสดงทุกสถานะความปลอดภัย (18 ห้อง)' : 'Show all security health states (18 chambers)'}
                className={`px-2 py-0.5 rounded transition-all font-semibold ${
                  healthFilter === 'all' 
                    ? 'bg-slate-700 text-white shadow-sm' 
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {lang === 'th' ? 'ทั้งหมด' : 'All'} (18)
              </button>

              <button
                id="filter-health-green"
                onClick={() => setHealthFilter(prev => prev === 'green' ? 'all' : 'green')}
                title={lang === 'th' ? `🟢 Nominal (ปกติ): ${countGreen} ห้อง` : `🟢 Nominal (Optimal): ${countGreen} chambers`}
                className={`px-2 py-0.5 rounded flex items-center gap-1 transition-all ${
                  healthFilter === 'green'
                    ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/50 shadow-sm'
                    : 'text-emerald-400 hover:bg-emerald-950/40'
                }`}
              >
                <span>🟢</span>
                <span className="font-bold">{countGreen}</span>
              </button>

              <button
                id="filter-health-yellow"
                onClick={() => setHealthFilter(prev => prev === 'yellow' ? 'all' : 'yellow')}
                title={lang === 'th' ? `🟡 Drift Detected (ตรวจพบความเบี่ยงเบนแฝง): ${countYellow} ห้อง` : `🟡 Drift Detected (Latent Drift): ${countYellow} chambers`}
                className={`px-2 py-0.5 rounded flex items-center gap-1 transition-all ${
                  healthFilter === 'yellow'
                    ? 'bg-amber-950 text-amber-300 border border-amber-500/50 shadow-sm'
                    : 'text-amber-400 hover:bg-amber-950/40'
                }`}
              >
                <span>🟡</span>
                <span className="font-bold">{countYellow}</span>
              </button>

              <button
                id="filter-health-red"
                onClick={() => setHealthFilter(prev => prev === 'red' ? 'all' : 'red')}
                title={lang === 'th' ? `🔴 Fail-Closed Active (ระบบตัดวงจรทำงาน): ${countRed} ห้อง` : `🔴 Fail-Closed Active (Lockdown): ${countRed} chambers`}
                className={`px-2 py-0.5 rounded flex items-center gap-1 transition-all ${
                  healthFilter === 'red'
                    ? 'bg-red-950 text-red-300 border border-red-500/50 shadow-sm animate-pulse ring-1 ring-red-500/50'
                    : 'text-red-400 hover:bg-red-950/40 animate-pulse'
                }`}
              >
                <span className="animate-pulse">🔴</span>
                <span className="font-bold">{countRed}</span>
              </button>
            </div>

            {/* Simulation Scenario Switcher */}
            <div className="flex items-center gap-1 bg-slate-950/90 border border-slate-800 rounded-lg px-2 py-1 text-[11px] font-mono-code">
              <SlidersHorizontal className="w-3 h-3 text-cyan-400 shrink-0" />
              <span className="text-slate-400 hidden sm:inline">{lang === 'th' ? 'สถานการณ์:' : 'Sim:'}</span>
              <select
                id="nav-simulation-mode-select"
                value={simulationMode}
                onChange={(e) => setSimulationMode(e.target.value as 'baseline' | 'stress' | 'tamper')}
                className="bg-transparent text-cyan-300 font-bold focus:outline-none cursor-pointer text-xs pr-1"
              >
                <option value="baseline" className="bg-slate-900 text-slate-200">
                  {lang === 'th' ? '🟢 ปกติ (Nominal SSoT Δ0)' : '🟢 Baseline (Nominal SSoT Δ0)'}
                </option>
                <option value="stress" className="bg-slate-900 text-slate-200">
                  {lang === 'th' ? '🟡 ทดสอบโหลด (Drift Detected)' : '🟡 Stress Probe (Drift Detected)'}
                </option>
                <option value="tamper" className="bg-slate-900 text-slate-200">
                  {lang === 'th' ? '🔴 จำลองภัย (Fail-Closed Active)' : '🔴 Tamper Simulation (Fail-Closed Active)'}
                </option>
              </select>
            </div>

            {/* Search Box */}
            <div className="relative w-full sm:w-48 lg:w-44">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                id="nav-chamber-search-input"
                type="text"
                placeholder={lang === 'th' ? "ค้นหาห้อง 01-18..." : "Search 18 Chambers..."}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-8 pr-3 py-1 bg-slate-950/90 border border-slate-700 rounded-lg text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-cyan-500 font-sans"
              />
            </div>
          </div>
        </div>

        {/* 18 Chambers Grid with Color-Coded Security Health Indicators (🟢, 🟡, 🔴) & Hover Tooltips */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 lg:grid-cols-9 gap-2">
          {filteredChambers.map((chamber) => {
            const isSelected = activeChamber === chamber.num;
            const healthProfile = getSimulatedHealthProfile(chamber.num);

            // Subtle dynamic latency jitter calculation for real-time telemetry animation
            const jitter = ((pulseTick + chamber.num * 7) % 5) * 0.04;
            const currentLatency = (healthProfile.baseLatencyMs + jitter).toFixed(2);

            // Styling helpers based on health indicator level
            const isGreen = healthProfile.health === 'green';
            const isYellow = healthProfile.health === 'yellow';
            const isRed = healthProfile.health === 'red';

            const pingBg = isRed ? 'bg-red-400' : isYellow ? 'bg-amber-400' : 'bg-emerald-400';
            const dotBg = isRed ? 'bg-red-500' : isYellow ? 'bg-amber-500' : 'bg-emerald-500';
            
            const cardBorder = isSelected
              ? isRed 
                ? 'border-red-400 bg-red-950/60 shadow-md shadow-red-950/60 ring-1 ring-red-400'
                : isYellow
                  ? 'border-amber-400 bg-amber-950/50 shadow-md shadow-amber-950/60 ring-1 ring-amber-400'
                  : 'border-cyan-400 bg-cyan-950/70 shadow-md shadow-cyan-950 text-white ring-1 ring-cyan-400'
              : isRed
                ? 'bg-red-950/30 border-red-900/60 hover:border-red-600/80 text-slate-200 hover:bg-red-950/50'
                : isYellow
                  ? 'bg-amber-950/20 border-amber-900/50 hover:border-amber-600/80 text-slate-200 hover:bg-amber-950/40'
                  : 'bg-slate-950/70 border-slate-800/90 hover:border-slate-700 text-slate-300 hover:bg-slate-800/60';

            const badgeBg = isRed 
              ? 'bg-red-950/90 border-red-500/60 text-red-300 shadow-sm shadow-red-900/50' 
              : isYellow 
                ? 'bg-amber-950/90 border-amber-500/60 text-amber-300 shadow-sm shadow-amber-900/40' 
                : 'bg-emerald-950/90 border-emerald-500/50 text-emerald-300';

            const emojiIcon = isRed ? '🔴' : isYellow ? '🟡' : '🟢';

            // Explicit tooltip status title: Nominal, Drift Detected, or Lockdown
            const tooltipStatusTitle: ChamberHealthState = isRed 
              ? 'Lockdown' 
              : isYellow 
                ? 'Drift Detected' 
                : 'Nominal';

            return (
              <button
                key={chamber.id}
                id={`nav-chamber-btn-${chamber.num}`}
                data-chamber-num={chamber.num}
                data-health={healthProfile.health}
                data-health-state={healthProfile.healthState}
                data-indicator={emojiIcon}
                data-last-checked={healthProfile.lastChecked}
                onClick={() => setActiveChamber(chamber.num)}
                className={`p-2 rounded-lg border text-left flex flex-col justify-between transition-all group relative overflow-visible ${cardBorder}`}
              >
                {/* Top Header: Chamber #, Icon & Color-Coded Health Status Beacon with Hover Tooltip */}
                <div className="flex items-center justify-between gap-1 w-full mb-1">
                  <div className="flex items-center gap-1.5 min-w-0">
                    {getChamberIcon(chamber.num)}
                    <span className="font-mono-code font-bold text-xs text-cyan-300 shrink-0">
                      CH-{chamber.num.toString().padStart(2, '0')}
                    </span>
                  </div>

                  {/* Real-time Color-Coded Security Health Indicator Badge with Hover-based Tooltip */}
                  <div className="relative group/indicator shrink-0">
                    <div 
                      className={`flex items-center gap-1 px-1 py-0.5 rounded cursor-help transition-all ${
                        isRed 
                          ? 'bg-red-950/80 border border-red-500/50 animate-pulse' 
                          : isYellow
                            ? 'bg-amber-950/60 border border-amber-500/40'
                            : 'bg-emerald-950/60 border border-emerald-500/30'
                      }`}
                    >
                      <span className={`text-[10px] leading-none select-none ${isRed ? 'animate-pulse' : ''}`}>
                        {emojiIcon}
                      </span>
                      <span className="relative flex h-2 w-2">
                        <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${pingBg}`} />
                        <span className={`relative inline-flex rounded-full h-2 w-2 ${dotBg} ${isRed ? 'animate-pulse' : ''}`} />
                      </span>
                    </div>

                    {/* Rich Hover-Based Floating Tooltip Displaying Specific Security Health Status */}
                    <div className="absolute right-0 bottom-full mb-2 w-52 p-2.5 bg-slate-950/95 border border-slate-700 text-slate-200 text-xs rounded-lg shadow-2xl backdrop-blur-xl opacity-0 invisible group-hover/indicator:opacity-100 group-hover/indicator:visible transition-all duration-200 pointer-events-none z-50">
                      <div className="flex items-center justify-between border-b border-slate-800 pb-1 mb-1.5">
                        <div className="flex items-center gap-1 font-mono-code font-bold text-[11px]">
                          <span className={isRed ? 'animate-pulse' : ''}>{emojiIcon}</span>
                          <span className={isRed ? 'text-red-400 font-bold' : isYellow ? 'text-amber-400 font-bold' : 'text-emerald-400 font-bold'}>
                            {tooltipStatusTitle}
                          </span>
                        </div>
                        <span className="text-[10px] font-mono-code text-slate-400 font-semibold">
                          {healthProfile.healthScore}%
                        </span>
                      </div>

                      <div className="space-y-1 text-[10px] leading-tight">
                        <div className="font-semibold text-slate-100">
                          {lang === 'th' ? healthProfile.enclaveNameTh : healthProfile.enclaveNameEn}
                        </div>
                        <div className="text-slate-400 font-sans">
                          {lang === 'th' ? healthProfile.healthStateTh : healthProfile.healthState}
                        </div>
                        <div className="pt-1 border-t border-slate-800/80 flex items-center justify-between font-mono-code text-[9px] text-slate-400">
                          <span>{healthProfile.securityDomain}</span>
                          <span className="text-cyan-400">{currentLatency}ms</span>
                        </div>
                        <div className="flex items-center justify-between font-mono-code text-[8.5px] text-slate-500 pt-0.5">
                          <span className="flex items-center gap-1">
                            <Clock className="w-2.5 h-2.5 text-slate-400" />
                            <span>{lang === 'th' ? 'ตรวจสอบล่าสุด:' : 'Last Checked:'}</span>
                          </span>
                          <span className="text-slate-400">{new Date(healthProfile.lastChecked).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</span>
                        </div>
                        {isRed && (
                          <div className="mt-1 px-1.5 py-0.5 bg-red-950/80 border border-red-600/60 rounded text-[9px] text-red-300 font-bold flex items-center gap-1 animate-pulse">
                            <AlertTriangle className="w-3 h-3 text-red-400 shrink-0" />
                            <span>{lang === 'th' ? 'แจ้งเตือน: กักกันภัยฉุกเฉิน 85°C' : 'ALERT: Quarantine Lockdown 85°C'}</span>
                          </div>
                        )}
                      </div>
                      {/* Tooltip caret */}
                      <div className="absolute top-full right-3 -mt-1 border-4 border-transparent border-t-slate-700" />
                    </div>
                  </div>
                </div>

                {/* Chamber Title with color-coded indicator */}
                <div className="text-[11px] font-medium leading-snug line-clamp-1 group-hover:text-cyan-200 mb-1.5 flex items-center gap-1">
                  <span className={`text-[10px] shrink-0 ${isRed ? 'animate-pulse' : ''}`}>{emojiIcon}</span>
                  <span className="truncate">
                    {lang === 'th' ? chamber.titleTh.replace(`CHAMBER ${chamber.num.toString().padStart(2, '0')} `, '') : chamber.titleEn}
                  </span>
                </div>

                {/* Bottom Bar: Color-coded Health Label Badge & Dynamic Enclave Latency */}
                <div className="mt-auto pt-1 border-t border-slate-800/80 flex items-center justify-between text-[9px] font-mono-code">
                  <span className={`px-1.5 py-0.5 rounded border text-[8.5px] font-bold ${badgeBg} leading-tight truncate max-w-[68px] flex items-center gap-0.5 ${isRed ? 'animate-pulse' : ''}`}>
                    <span className={isRed ? 'animate-pulse' : ''}>{emojiIcon}</span>
                    <span className="truncate">{lang === 'th' ? healthProfile.statusLabelTh : healthProfile.statusLabelEn}</span>
                  </span>
                  
                  <span className="text-[8.5px] text-slate-400 font-mono-code ml-1 shrink-0">
                    {currentLatency}ms
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Empty state when search or health filters match zero items */}
        {filteredChambers.length === 0 && (
          <div className="p-4 text-center text-xs text-slate-400 bg-slate-950/60 border border-slate-800 rounded-lg">
            <AlertTriangle className="w-4 h-4 text-amber-400 inline mr-1.5 mb-0.5" />
            {lang === 'th' 
              ? `ไม่พบห้องปฏิบัติการที่ตรงกับเงื่อนไข (ตัวกรองความปลอดภัย: ${healthFilter === 'all' ? 'ทั้งหมด' : healthFilter})` 
              : `No chambers match current filters (Health Filter: ${healthFilter})`}
            <button
              onClick={() => {
                setFilterCategory('all');
                setHealthFilter('all');
                setSearchTerm('');
              }}
              className="ml-2 underline text-cyan-400 hover:text-cyan-300 font-medium"
            >
              {lang === 'th' ? 'ล้างตัวกรอง' : 'Reset filters'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
