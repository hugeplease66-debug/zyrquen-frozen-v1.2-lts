import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  RefreshCw, 
  Play, 
  Pause, 
  RotateCcw, 
  CheckCircle2, 
  Clock, 
  ShieldCheck, 
  Layers, 
  FileText,
  Sparkles,
  ChevronRight,
  ChevronLeft,
  KeyRound,
  ShieldAlert,
  Binary,
  Snowflake,
  Activity,
  Archive,
  Scale,
  Check,
  Terminal,
  Zap,
  Award,
  ArrowRight,
  Shield
} from 'lucide-react';
import { FORENSIC_STAGES, SYSTEM_METADATA } from '../../data/canonicalData';
import { ForensicStage } from '../../types';

interface ChamberProps {
  lang: 'th' | 'en';
}

interface ForensicEpoch {
  id: string;
  nameTh: string;
  nameEn: string;
  stageRange: string;
  stages: number[];
  color: string;
  borderColor: string;
  bgLight: string;
}

const FORENSIC_EPOCHS: ForensicEpoch[] = [
  {
    id: "EPOCH_1",
    nameTh: "การรับและปรับโครงสร้าง (Ingestion & Normalization)",
    nameEn: "Ingestion & Normalization",
    stageRange: "Stage 01-02",
    stages: [0, 1],
    color: "text-cyan-400",
    borderColor: "border-cyan-500/40",
    bgLight: "bg-cyan-950/40"
  },
  {
    id: "EPOCH_2",
    nameTh: "ความปลอดภัยควอนตัมและมติสภา (Quantum & HSM Consensus)",
    nameEn: "PQC & HSM Multi-Sig Quorum",
    stageRange: "Stage 03-04",
    stages: [2, 3],
    color: "text-purple-400",
    borderColor: "border-purple-500/40",
    bgLight: "bg-purple-950/40"
  },
  {
    id: "EPOCH_3",
    nameTh: "วิเคราะห์ความเสี่ยงและพิสูจน์ Merkle (AI Risk & State Invariants)",
    nameEn: "AI Risk & State Verification",
    stageRange: "Stage 05-09",
    stages: [4, 5, 6, 7, 8],
    color: "text-blue-400",
    borderColor: "border-blue-500/40",
    bgLight: "bg-blue-950/40"
  },
  {
    id: "EPOCH_4",
    nameTh: "การรับรองทางกฎหมายและการปิดผนึก (Preservation & Settlement)",
    nameEn: "Preservation & Legal Finality",
    stageRange: "Stage 10-12",
    stages: [9, 10, 11],
    color: "text-emerald-400",
    borderColor: "border-emerald-500/40",
    bgLight: "bg-emerald-950/40"
  }
];

export const Chamber08PhoenixReplay: React.FC<ChamberProps> = ({ lang }) => {
  const [currentStageIndex, setCurrentStageIndex] = useState<number>(11); // default completed
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [speedMultiplier, setSpeedMultiplier] = useState<number>(1); // 1x, 2x, 4x, or real-time benchmark
  const [selectedStage, setSelectedStage] = useState<ForensicStage>(FORENSIC_STAGES[11]);
  const [activeTab, setActiveTab] = useState<'timeline' | 'payload' | 'legal'>('timeline');
  const [elapsedSimulationMs, setElapsedSimulationMs] = useState<number>(142);
  const [isLooping, setIsLooping] = useState<boolean>(false);
  
  const timelineScrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll active node into view
  useEffect(() => {
    if (timelineScrollRef.current) {
      const activeEl = timelineScrollRef.current.querySelector(`[data-stage-index="${currentStageIndex}"]`) as HTMLElement;
      if (activeEl) {
        activeEl.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      }
    }
  }, [currentStageIndex]);
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isPlaying) {
      const stepDuration = Math.max(150, Math.floor(650 / speedMultiplier));
      timer = setTimeout(() => {
        if (currentStageIndex < FORENSIC_STAGES.length - 1) {
          const nextIndex = currentStageIndex + 1;
          setCurrentStageIndex(nextIndex);
          setSelectedStage(FORENSIC_STAGES[nextIndex]);
          setElapsedSimulationMs(FORENSIC_STAGES[nextIndex].cumulativeMs);
        } else {
          if (isLooping) {
            setCurrentStageIndex(0);
            setSelectedStage(FORENSIC_STAGES[0]);
            setElapsedSimulationMs(FORENSIC_STAGES[0].cumulativeMs);
          } else {
            setIsPlaying(false);
          }
        }
      }, stepDuration);
    }
    return () => clearTimeout(timer);
  }, [isPlaying, currentStageIndex, speedMultiplier, isLooping]);

  const handleStartReplay = () => {
    setCurrentStageIndex(0);
    setSelectedStage(FORENSIC_STAGES[0]);
    setElapsedSimulationMs(FORENSIC_STAGES[0].cumulativeMs);
    setIsPlaying(true);
  };

  const handleStepForward = () => {
    setIsPlaying(false);
    if (currentStageIndex < FORENSIC_STAGES.length - 1) {
      const nextIndex = currentStageIndex + 1;
      setCurrentStageIndex(nextIndex);
      setSelectedStage(FORENSIC_STAGES[nextIndex]);
      setElapsedSimulationMs(FORENSIC_STAGES[nextIndex].cumulativeMs);
    }
  };

  const handleStepBackward = () => {
    setIsPlaying(false);
    if (currentStageIndex > 0) {
      const prevIndex = currentStageIndex - 1;
      setCurrentStageIndex(prevIndex);
      setSelectedStage(FORENSIC_STAGES[prevIndex]);
      setElapsedSimulationMs(FORENSIC_STAGES[prevIndex].cumulativeMs);
    }
  };

  const handleReset = () => {
    setIsPlaying(false);
    setCurrentStageIndex(11);
    setSelectedStage(FORENSIC_STAGES[11]);
    setElapsedSimulationMs(142);
  };

  const totalCalculatedMs = FORENSIC_STAGES[currentStageIndex].cumulativeMs;
  const currentStage = FORENSIC_STAGES[currentStageIndex];

  // Helper icon for each stage
  const getStageIcon = (stageNumber: number) => {
    switch (stageNumber) {
      case 1: return <Terminal className="w-4 h-4 text-cyan-400" />;
      case 2: return <Binary className="w-4 h-4 text-cyan-300" />;
      case 3: return <ShieldCheck className="w-4 h-4 text-purple-400" />;
      case 4: return <KeyRound className="w-4 h-4 text-emerald-400" />;
      case 5: return <Activity className="w-4 h-4 text-amber-400" />;
      case 6: return <ShieldAlert className="w-4 h-4 text-red-400" />;
      case 7: return <Binary className="w-4 h-4 text-blue-400" />;
      case 8: return <Snowflake className="w-4 h-4 text-teal-400" />;
      case 9: return <Zap className="w-4 h-4 text-yellow-400" />;
      case 10: return <Archive className="w-4 h-4 text-amber-300" />;
      case 11: return <Scale className="w-4 h-4 text-indigo-400" />;
      case 12: return <CheckCircle2 className="w-4 h-4 text-emerald-400" />;
      default: return <RefreshCw className="w-4 h-4 text-cyan-400" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="rounded-xl bg-gradient-to-r from-cyan-950/80 via-slate-900 to-slate-950 border border-cyan-500/40 p-6 shadow-xl">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full bg-cyan-950 border border-cyan-500/50 text-cyan-300 text-xs font-mono-code font-bold flex items-center gap-1.5">
                <RefreshCw className="w-3 h-3 text-cyan-400" />
                12-STAGE FORENSIC TRACE REPLAY
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-xs font-mono-code font-bold">
                142.0ms DETERMINISTIC SLA PASSED
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 text-xs font-mono-code">
                SSoT Δ0.00% Zero Drift
              </span>
            </div>
            <h2 className="text-2xl font-display font-bold text-white tracking-tight">
              {lang === 'th' ? 'เครื่องมือจำลองการกู้คืนและเล่นย้อนรอยพยาน 12 ขั้นตอน (Chamber 08)' : 'Chamber 08: 12-Stage Forensic Trace Replay Engine'}
            </h2>
            <p className="text-sm text-slate-300 mt-1 max-w-3xl">
              {lang === 'th'
                ? 'กระบวนการตรวจสอบย้อนกลับ 12 ขั้นตอนเชิงกำหนด (Deterministic 12-Stage Replay) พิสูจน์หลักฐานดิจิทัลตั้งแต่การรับข้อมูล (Ingest) จนถึงการปิดผนึกสมบูรณ์ (Closure) ในเวลา 142ms'
                : 'Step-by-step forensic progression from payload intake to legal closure with real-time animated timeline and micro-millisecond SLA telemetry.'}
            </p>
          </div>

          {/* Interactive Replay Controller Bar */}
          <div className="flex flex-wrap items-center gap-2 bg-slate-950/90 p-2 rounded-xl border border-slate-800 shadow-inner">
            {/* Step Backward */}
            <button
              onClick={handleStepBackward}
              disabled={currentStageIndex === 0}
              className="p-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 disabled:opacity-40 transition-all cursor-pointer"
              title="Step Backward"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {/* Play / Pause */}
            {!isPlaying ? (
              <button
                onClick={currentStageIndex === 11 ? handleStartReplay : () => setIsPlaying(true)}
                className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-lg shadow-cyan-950 transition-all font-display cursor-pointer"
              >
                <Play className="w-4 h-4 fill-slate-950" />
                <span>{currentStageIndex === 11 ? (lang === 'th' ? 'เริ่มเล่นย้อนรอย (142ms)' : 'START REPLAY') : (lang === 'th' ? 'เล่นต่อ' : 'RESUME')}</span>
              </button>
            ) : (
              <button
                onClick={() => setIsPlaying(false)}
                className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-lg transition-all font-display cursor-pointer"
              >
                <Pause className="w-4 h-4 fill-slate-950" />
                <span>{lang === 'th' ? 'หยุดชั่วคราว' : 'PAUSE'}</span>
              </button>
            )}

            {/* Step Forward */}
            <button
              onClick={handleStepForward}
              disabled={currentStageIndex === 11}
              className="p-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 disabled:opacity-40 transition-all cursor-pointer"
              title="Step Forward"
            >
              <ChevronRight className="w-4 h-4" />
            </button>

            {/* Reset */}
            <button
              onClick={handleReset}
              className="p-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 transition-colors cursor-pointer"
              title="Reset to Stage 12"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            {/* Speed Selector */}
            <div className="flex items-center gap-1 pl-2 border-l border-slate-800">
              {[1, 2, 4].map(s => (
                <button
                  key={s}
                  onClick={() => setSpeedMultiplier(s)}
                  className={`px-2 py-1 rounded text-[11px] font-mono-code font-bold transition-all ${
                    speedMultiplier === s
                      ? 'bg-cyan-950 text-cyan-300 border border-cyan-500/50'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {s}x
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* SLA & Time Progress Dashboard Banner with Motion Animated Progress Indicator */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 space-y-4 shadow-lg">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs font-mono-code">
          <div className="flex flex-wrap items-center gap-2">
            <Clock className="w-4 h-4 text-cyan-400" />
            <span className="text-slate-400">
              {lang === 'th' ? 'ขั้นตอนปัจจุบัน' : 'Active Stage'}:
            </span>
            <span className="px-2 py-0.5 rounded bg-cyan-950 border border-cyan-500/40 text-cyan-300 font-bold flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
              {currentStage.code} ({currentStage.stageNumber}/12)
            </span>
            <span className="text-slate-300 font-medium font-sans">
              {lang === 'th' ? currentStage.nameTh : currentStage.nameEn}
            </span>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right">
              <span className="text-slate-400 text-[11px] block">{lang === 'th' ? 'เวลาสะสม / เพดาน SLA' : 'Cumulative Latency'}:</span>
              <span className="text-white text-base font-bold font-mono-code">
                {totalCalculatedMs}.0 ms <span className="text-slate-400 text-xs font-normal">/ 142.0 ms</span>
              </span>
            </div>
            <span className={`px-2.5 py-1 rounded font-bold text-xs flex items-center gap-1 ${
              totalCalculatedMs <= 142 ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/40' : 'bg-red-950 text-red-300'
            }`}>
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>{totalCalculatedMs <= 142 ? '142.0ms DETERMINISTIC PASS' : 'SLA EXCEEDED'}</span>
            </span>
          </div>
        </div>

        {/* Dynamic Motion Progress Bar (0ms Ingest -> 142ms Closure) */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-[11px] font-mono-code text-slate-400">
            <span className="flex items-center gap-1 text-cyan-300">
              <Terminal className="w-3 h-3 text-cyan-400" />
              INGEST (0.0 ms)
            </span>
            <span className="text-slate-300">
              Progression: {((totalCalculatedMs / 142) * 100).toFixed(1)}% ({totalCalculatedMs}ms / 142ms)
            </span>
            <span className="flex items-center gap-1 text-emerald-300">
              <Award className="w-3 h-3 text-emerald-400" />
              CLOSURE (142.0 ms)
            </span>
          </div>

          <div className="relative w-full bg-slate-950 rounded-full h-4 p-0.5 border border-slate-800 overflow-hidden">
            <motion.div
              className="bg-gradient-to-r from-cyan-500 via-blue-500 to-emerald-500 h-full rounded-full relative overflow-hidden"
              initial={{ width: '0%' }}
              animate={{ width: `${(totalCalculatedMs / 142) * 100}%` }}
              transition={{ type: 'spring', stiffness: 120, damping: 18 }}
            >
              {/* Animated Light Shimmer Effect */}
              <motion.div 
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent w-full h-full"
                animate={{ x: ['-100%', '200%'] }}
                transition={{ repeat: Infinity, duration: 1.8, ease: 'linear' }}
              />
            </motion.div>
          </div>
        </div>

        {/* 4 Forensic Epochs Breakdown */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 pt-1">
          {FORENSIC_EPOCHS.map(epoch => {
            const isEpochActive = epoch.stages.includes(currentStageIndex);
            const isEpochPassed = epoch.stages.every(s => s <= currentStageIndex);
            return (
              <motion.div 
                key={epoch.id}
                animate={{ 
                  scale: isEpochActive ? 1.02 : 1,
                  borderColor: isEpochActive ? 'rgba(6, 182, 212, 0.6)' : undefined
                }}
                transition={{ duration: 0.2 }}
                className={`p-2.5 rounded-lg border text-xs transition-all ${
                  isEpochActive 
                    ? `${epoch.bgLight} ${epoch.borderColor} shadow-sm shadow-cyan-950`
                    : isEpochPassed
                    ? 'bg-slate-950/60 border-slate-800'
                    : 'bg-slate-950/30 border-slate-900 opacity-60'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className={`font-mono-code font-bold text-[11px] ${epoch.color}`}>
                    {epoch.stageRange}
                  </span>
                  <span className="text-[10px] font-mono-code text-slate-400">
                    {isEpochPassed ? '✓ PASSED' : isEpochActive ? '⚡ IN PROGRESS' : 'QUEUED'}
                  </span>
                </div>
                <div className="text-[11px] font-medium text-slate-200 line-clamp-1">
                  {lang === 'th' ? epoch.nameTh : epoch.nameEn}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* 12-Stage Visual Timeline with Motion Animated Progress Indicator */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-6 space-y-4 shadow-xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
          <div>
            <h3 className="font-display font-bold text-white text-base flex items-center gap-2">
              <Activity className="w-4 h-4 text-cyan-400" />
              {lang === 'th' ? 'ผังไทม์ไลน์ 12 ขั้นตอนเชิงกายภาพ (Animated Forensic Timeline)' : '12-Stage Visual Timeline Progression (Ingest to Closure)'}
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              {lang === 'th' 
                ? 'ติดตามร่องรอยการตรวจสอบแบบทีละขั้น (Ingest 8ms → Closure 142ms) พร้อมไฟแสดงสถานะแอนิเมชันแบบเคลื่อนไหวสด' 
                : 'Animated progress indicator with micro-latency tracking from raw ingest (8ms) through legal closure (142ms).'}
            </p>
          </div>

          <div className="flex items-center gap-3 text-xs font-mono-code">
            <span className="px-2 py-0.5 rounded bg-cyan-950 border border-cyan-500/40 text-cyan-300 font-bold flex items-center gap-1.5">
              <motion.span 
                className="h-2 w-2 rounded-full bg-cyan-400"
                animate={{ scale: [1, 1.4, 1], opacity: [0.6, 1, 0.6] }}
                transition={{ repeat: Infinity, duration: 1.2 }}
              />
              {currentStageIndex === 11 ? 'ALL 12 STAGES VERIFIED' : `STAGE ${currentStageIndex + 1} OF 12`}
            </span>
          </div>
        </div>

        {/* Horizontal Scrollable Timeline Ribbon with Motion Tracks */}
        <div 
          ref={timelineScrollRef}
          className="overflow-x-auto pb-4 pt-4 scrollbar-thin"
        >
          <div className="flex items-center gap-1.5 min-w-[1040px] relative px-4">
            {/* Connecting baseline bar */}
            <div className="absolute left-8 right-8 top-[26px] h-1.5 bg-slate-950 rounded-full border border-slate-800 z-0" />
            
            {/* Animated active progress ribbon */}
            <motion.div 
              className="absolute left-8 top-[26px] h-1.5 bg-gradient-to-r from-cyan-500 via-blue-500 to-emerald-500 rounded-full z-0"
              initial={{ width: '0%' }}
              animate={{ width: `${(currentStageIndex / 11) * 92}%` }}
              transition={{ type: 'spring', stiffness: 100, damping: 16 }}
            />

            {FORENSIC_STAGES.map((stage, idx) => {
              const isCurrent = currentStageIndex === idx;
              const isPast = currentStageIndex >= idx;
              const isSelected = selectedStage.code === stage.code;

              return (
                <button
                  key={stage.code}
                  data-stage-index={idx}
                  onClick={() => {
                    setSelectedStage(stage);
                    if (!isPlaying) {
                      setCurrentStageIndex(idx);
                      setElapsedSimulationMs(stage.cumulativeMs);
                    }
                  }}
                  className={`relative z-10 flex flex-col items-center group flex-1 transition-all cursor-pointer ${
                    isCurrent ? 'scale-105' : 'hover:scale-102'
                  }`}
                >
                  {/* Motion Stage Node Circle with Pulsing Glow Ring */}
                  <div className="relative">
                    {/* Glowing aura for active node */}
                    {isCurrent && (
                      <motion.div 
                        className="absolute -inset-1.5 rounded-full bg-cyan-400/40 blur-sm"
                        animate={{ scale: [1, 1.25, 1], opacity: [0.5, 0.9, 0.5] }}
                        transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
                      />
                    )}
                    
                    <motion.div
                      className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all relative z-10 ${
                        isCurrent
                          ? 'bg-cyan-500 border-white text-slate-950 shadow-lg shadow-cyan-400/60 ring-4 ring-cyan-500/30'
                          : isPast
                          ? 'bg-slate-900 border-emerald-400 text-emerald-300 shadow-md shadow-emerald-950'
                          : 'bg-slate-950 border-slate-700 text-slate-500 opacity-60'
                      }`}
                      animate={isCurrent ? { scale: [1, 1.08, 1] } : { scale: 1 }}
                      transition={{ repeat: isCurrent ? Infinity : 0, duration: 2 }}
                    >
                      {isPast && !isCurrent ? (
                        <Check className="w-4 h-4 text-emerald-400 stroke-[3]" />
                      ) : (
                        getStageIcon(stage.stageNumber)
                      )}
                    </motion.div>
                  </div>

                  {/* Stage Label & Timing Chips */}
                  <div className="mt-2.5 text-center flex flex-col items-center">
                    <span className={`text-[10px] font-mono-code block font-bold transition-colors ${
                      isCurrent ? 'text-cyan-300' : isSelected ? 'text-white underline' : isPast ? 'text-slate-200' : 'text-slate-400'
                    }`}>
                      {stage.code}
                    </span>
                    
                    <span className="text-[9px] font-mono-code text-slate-400 block mt-0.5">
                      +{stage.durationMs}ms
                    </span>

                    <span className={`text-[9px] font-mono-code px-1.5 py-0.5 rounded mt-1 inline-block ${
                      isCurrent 
                        ? 'bg-cyan-950 border border-cyan-400 text-cyan-300 font-bold shadow-sm' 
                        : isPast 
                        ? 'bg-slate-950 text-emerald-400 border border-slate-800' 
                        : 'text-slate-400 bg-slate-950/40 border border-slate-900'
                    }`}>
                      {stage.cumulativeMs}ms
                    </span>

                    {/* Stage milestone badge for Ingest & Closure */}
                    {idx === 0 && (
                      <span className="text-[8px] font-mono-code px-1 py-0.2 rounded bg-cyan-950/90 text-cyan-300 border border-cyan-500/40 mt-1 uppercase">
                        Ingest
                      </span>
                    )}
                    {idx === 11 && (
                      <span className="text-[8px] font-mono-code px-1 py-0.2 rounded bg-emerald-950/90 text-emerald-300 border border-emerald-500/40 mt-1 uppercase">
                        Closure
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Grid: 12 Stage Steps List & Deep Stage Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* 12 Stages Step-by-Step Grid (7 Cols) */}
        <div className="lg:col-span-7 bg-slate-900/90 border border-slate-800 rounded-xl p-5 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-display font-bold text-white text-base flex items-center gap-2">
              <Layers className="w-4 h-4 text-cyan-400" />
              {lang === 'th' ? 'รายละเอียดลำดับ 12 ขั้นตอนการตรวจสอบ' : '12-Stage Deterministic Progression'}
            </h3>
            <span className="text-xs text-slate-400 font-mono-code">
              142.0ms Hard Limit
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-[520px] overflow-y-auto pr-1 scrollbar-thin">
            {FORENSIC_STAGES.map((stage, idx) => {
              const isCurrent = currentStageIndex === idx;
              const isPast = currentStageIndex >= idx;
              const isSelected = selectedStage.code === stage.code;

              return (
                <motion.div
                  key={stage.code}
                  onClick={() => {
                    setSelectedStage(stage);
                    if (!isPlaying) {
                      setCurrentStageIndex(idx);
                      setElapsedSimulationMs(stage.cumulativeMs);
                    }
                  }}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  className={`p-3 rounded-lg border cursor-pointer transition-all ${
                    isCurrent
                      ? 'bg-cyan-950/80 border-cyan-400 shadow-md shadow-cyan-950/60 ring-1 ring-cyan-500/40'
                      : isSelected
                      ? 'bg-slate-800/90 border-slate-600'
                      : isPast
                      ? 'bg-slate-950/80 border-slate-800 hover:border-slate-700'
                      : 'bg-slate-950/40 border-slate-900 opacity-60 hover:opacity-80'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-1.5">
                      {getStageIcon(stage.stageNumber)}
                      <span className="font-mono-code font-bold text-xs text-cyan-300">
                        {stage.code}
                      </span>
                    </div>
                    <span className="text-[11px] font-mono-code text-slate-400">
                      +{stage.durationMs}ms ({stage.cumulativeMs}ms)
                    </span>
                  </div>

                  <div className="text-xs font-semibold text-white mb-1 line-clamp-1">
                    {lang === 'th' ? stage.nameTh : stage.nameEn}
                  </div>

                  <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono-code pt-1 border-t border-slate-800/80">
                    <span className="text-amber-300">{stage.targetChamber}</span>
                    <span className={`font-bold ${isPast ? 'text-emerald-400' : 'text-slate-400'}`}>
                      {isCurrent ? '⚡ RUNNING' : isPast ? '✓ VERIFIED' : 'PENDING'}
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Selected Stage Inspector & OTel Forensic Stream (5 Cols) with Motion AnimatePresence */}
        <div className="lg:col-span-5 bg-slate-900/90 border border-slate-800 rounded-xl p-5 space-y-4 shadow-xl">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-cyan-400" />
              <h3 className="font-display font-bold text-white text-base">
                {lang === 'th' ? 'การตรวจวัดระดับลึก' : 'Stage Telemetry Detail'}
              </h3>
            </div>
            <span className="px-2.5 py-0.5 rounded bg-cyan-950 border border-cyan-500/40 text-cyan-300 font-mono-code text-xs font-bold">
              {selectedStage.code}
            </span>
          </div>

          <AnimatePresence mode="wait">
            <motion.div 
              key={selectedStage.code}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3 text-xs"
            >
              <div>
                <span className="text-slate-400 block font-mono-code text-[11px]">Stage Classification:</span>
                <span className="text-white font-bold text-sm">
                  {lang === 'th' ? selectedStage.nameTh : selectedStage.nameEn}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-1 border-t border-slate-800/80">
                <div>
                  <span className="text-slate-400 block font-mono-code text-[11px]">Execution Latency:</span>
                  <span className="text-cyan-300 font-mono-code font-bold text-xs">
                    {selectedStage.durationMs} ms
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block font-mono-code text-[11px]">Cumulative Time:</span>
                  <span className="text-emerald-400 font-mono-code font-bold text-xs">
                    {selectedStage.cumulativeMs} / 142.0 ms
                  </span>
                </div>
              </div>

              <div className="pt-1 border-t border-slate-800/80">
                <span className="text-slate-400 block font-mono-code text-[11px]">Target Chamber:</span>
                <span className="text-amber-300 font-mono-code font-bold">{selectedStage.targetChamber}</span>
              </div>

              <div>
                <span className="text-slate-400 block font-mono-code text-[11px] mb-1">Deterministic Verification Rule:</span>
                <div className="text-slate-200 font-mono-code text-[11px] bg-slate-900 p-2.5 rounded-lg border border-slate-800">
                  {selectedStage.verificationRule}
                </div>
              </div>

              <div>
                <span className="text-slate-400 block font-mono-code text-[11px] mb-1">Cryptographic Evidence Tag:</span>
                <div className="text-emerald-400 font-mono-code text-[11px] bg-slate-900 p-2.5 rounded-lg border border-slate-800 flex items-center justify-between">
                  <span>{selectedStage.evidenceTag}</span>
                  <span className="text-[10px] text-emerald-500 font-bold">100% SSoT</span>
                </div>
              </div>

              <div>
                <span className="text-slate-400 block font-mono-code text-[11px] mb-1">Description:</span>
                <p className="text-slate-300 leading-relaxed text-[11px] bg-slate-900/60 p-2.5 rounded-lg border border-slate-800/80">
                  {lang === 'th' ? selectedStage.descriptionTh : selectedStage.descriptionEn}
                </p>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Quick Finality Summary Card */}
          <div className="bg-slate-950 p-4 rounded-xl border border-emerald-500/30 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Award className="w-5 h-5 text-emerald-400" />
              <div>
                <span className="text-xs font-bold text-white block">
                  {lang === 'th' ? 'การรับรองคดีในชั้นศาล (Forensic Ready)' : 'Court Admissible Finality'}
                </span>
                <span className="text-[10px] text-slate-400 font-mono-code">
                  Thai Electronic Transactions Act Sec 9, 26, 28
                </span>
              </div>
            </div>
            <span className="px-2 py-1 rounded bg-emerald-950 border border-emerald-500/40 text-emerald-300 text-xs font-mono-code font-bold">
              PASSED
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

