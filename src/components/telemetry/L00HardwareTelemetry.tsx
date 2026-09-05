import React, { useState, useEffect } from 'react';
import { 
  Cpu, 
  Snowflake, 
  Activity, 
  Zap, 
  Flame, 
  ShieldCheck, 
  RefreshCw, 
  Server, 
  Thermometer,
  Gauge
} from 'lucide-react';

interface L00HardwareTelemetryProps {
  lang: 'th' | 'en';
}

interface CircularGaugeProps {
  id: string;
  value: number;
  min: number;
  max: number;
  unit: string;
  label: string;
  sublabel: string;
  color: 'cyan' | 'emerald' | 'amber' | 'blue' | 'purple';
  status: string;
  icon: React.ReactNode;
}

const CircularGauge: React.FC<CircularGaugeProps> = ({
  id,
  value,
  min,
  max,
  unit,
  label,
  sublabel,
  color,
  status,
  icon
}) => {
  const radius = 42;
  const circumference = 2 * Math.PI * radius;
  const normalizedValue = Math.min(Math.max((value - min) / (max - min), 0), 1);
  const strokeDashoffset = circumference - normalizedValue * circumference;

  const colorMap = {
    cyan: {
      stroke: 'stroke-cyan-400',
      glow: 'shadow-cyan-500/30',
      text: 'text-cyan-400',
      bg: 'bg-cyan-950/40',
      border: 'border-cyan-500/30'
    },
    emerald: {
      stroke: 'stroke-emerald-400',
      glow: 'shadow-emerald-500/30',
      text: 'text-emerald-400',
      bg: 'bg-emerald-950/40',
      border: 'border-emerald-500/30'
    },
    amber: {
      stroke: 'stroke-amber-400',
      glow: 'shadow-amber-500/30',
      text: 'text-amber-400',
      bg: 'bg-amber-950/40',
      border: 'border-amber-500/30'
    },
    blue: {
      stroke: 'stroke-blue-400',
      glow: 'shadow-blue-500/30',
      text: 'text-blue-400',
      bg: 'bg-blue-950/40',
      border: 'border-blue-500/30'
    },
    purple: {
      stroke: 'stroke-purple-400',
      glow: 'shadow-purple-500/30',
      text: 'text-purple-400',
      bg: 'bg-purple-950/40',
      border: 'border-purple-500/30'
    }
  };

  const scheme = colorMap[color];

  return (
    <div 
      id={id}
      className={`relative bg-slate-950/80 border ${scheme.border} rounded-xl p-4 flex flex-col items-center justify-between transition-all duration-300 hover:border-opacity-60 shadow-lg`}
    >
      <div className="w-full flex items-center justify-between text-xs mb-2">
        <div className="flex items-center gap-1.5 text-slate-300 font-medium">
          {icon}
          <span>{label}</span>
        </div>
        <span className={`px-2 py-0.5 rounded text-[10px] font-mono-code font-bold ${scheme.bg} ${scheme.text} border ${scheme.border}`}>
          {status}
        </span>
      </div>

      {/* SVG Circular Gauge */}
      <div className="relative w-28 h-28 flex items-center justify-center my-1">
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
          {/* Background track */}
          <circle
            cx="50"
            cy="50"
            r={radius}
            className="stroke-slate-800"
            strokeWidth="8"
            fill="transparent"
          />
          {/* Active progress arc */}
          <circle
            cx="50"
            cy="50"
            r={radius}
            className={`${scheme.stroke} transition-all duration-700 ease-out`}
            strokeWidth="8"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="transparent"
          />
        </svg>

        {/* Center reading */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className="text-lg font-mono-code font-extrabold text-white tracking-tight">
            {typeof value === 'number' ? (value % 1 === 0 ? value : value.toFixed(2)) : value}
          </span>
          <span className="text-[10px] font-mono-code text-slate-400 font-semibold">{unit}</span>
        </div>
      </div>

      <div className="w-full text-center mt-2 pt-2 border-t border-slate-800/80">
        <span className="text-[11px] text-slate-400 font-mono-code block truncate">
          {sublabel}
        </span>
      </div>
    </div>
  );
};

export const L00HardwareTelemetry: React.FC<L00HardwareTelemetryProps> = ({ lang }) => {
  // Real-time jittering telemetry state
  const [cpuTemp, setCpuTemp] = useState<number>(38.4);
  const [gpuTemp, setGpuTemp] = useState<number>(42.1);
  const [cryoCoolantLevel, setCryoCoolantLevel] = useState<number>(99.98); // %
  const [cryoTempMk, setCryoTempMk] = useState<number>(14.98); // mK
  const [heartbeatFreq, setHeartbeatFreq] = useState<number>(100.0); // Hz
  const [jitterCount, setJitterCount] = useState<number>(0);
  const [powerDrawWatts, setPowerDrawWatts] = useState<number>(245.8);

  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate real-time sensor fluctuation around canonical equilibrium
      setCpuTemp(38.0 + Math.random() * 0.9);
      setGpuTemp(41.8 + Math.random() * 0.8);
      setCryoTempMk(14.96 + Math.random() * 0.04);
      setCryoCoolantLevel(99.95 + Math.random() * 0.05);
      setHeartbeatFreq(99.98 + (Math.random() - 0.5) * 0.08);
      setPowerDrawWatts(244.5 + Math.random() * 3.2);
      setJitterCount((prev) => prev + 1);
    }, 1200);

    return () => clearInterval(interval);
  }, []);

  return (
    <div 
      id="l00-hardware-telemetry-deck"
      className="bg-slate-900/90 border border-slate-800 rounded-xl p-6 shadow-xl relative overflow-hidden space-y-6"
    >
      {/* Background ambient lighting */}
      <div className="absolute top-0 right-1/4 w-80 h-32 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-80 h-32 bg-purple-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 rounded bg-blue-950 border border-blue-500/40 text-blue-300 font-mono-code text-[11px] font-bold flex items-center gap-1">
              <Server className="w-3 h-3 text-blue-400" />
              L00 FOUNDATION ARCHITECTURE
            </span>
            <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-500/30 font-mono-code text-[11px] font-bold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
              REAL-TIME HARDWARE SENSOR CLUSTER
            </span>
          </div>
          <h3 className="font-display font-bold text-white text-lg tracking-tight">
            {lang === 'th' ? 'แผงควบคุมและโทรมาตรฮาร์ดแวร์ระดับ L00 (Circular Gauge Cluster)' : 'L00 Real-Time Hardware Telemetry & Thermal Deck'}
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            {lang === 'th'
              ? 'การอ่านค่าโทรมาตรสดจากเซนเซอร์ฟิสิกส์ 10/10 HSM Enclaves, อุณหภูมิคอร์ CPU/GPU, ระบบหล่อเย็นฮีเลียมเหลว และความถี่ฮาร์ตบีทเคอร์เนล'
              : 'Direct physical sensor telemetry from 10/10 HSM enclaves, core thermal monitoring, liquid cryo-cooling, and kernel heartbeat loop.'}
          </p>
        </div>

        <div className="flex items-center gap-3 self-start sm:self-auto">
          <div className="bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800 text-right">
            <span className="text-[10px] text-slate-500 block font-mono-code">Total Power:</span>
            <span className="text-xs font-mono-code font-bold text-amber-400">
              {powerDrawWatts.toFixed(1)} W
            </span>
          </div>
          <div className="bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800 text-right">
            <span className="text-[10px] text-slate-500 block font-mono-code">Telemetry Poll:</span>
            <span className="text-xs font-mono-code font-bold text-cyan-400">
              #{jitterCount} (1.2s Sync)
            </span>
          </div>
        </div>
      </div>

      {/* Circular Gauge Cluster */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Gauge 1: CPU Temperature */}
        <CircularGauge
          id="gauge-cpu-temp"
          value={cpuTemp}
          min={20}
          max={90}
          unit="°C"
          label={lang === 'th' ? 'อุณหภูมิ CPU แกนกลาง' : 'Core CPU Temp'}
          sublabel="Fail-Safe Ceiling: 85.0°C"
          color={cpuTemp > 60 ? 'amber' : 'emerald'}
          status={cpuTemp < 50 ? 'OPTIMAL' : 'WARM'}
          icon={<Cpu className="w-4 h-4 text-emerald-400" />}
        />

        {/* Gauge 2: GPU Temperature */}
        <CircularGauge
          id="gauge-gpu-temp"
          value={gpuTemp}
          min={20}
          max={95}
          unit="°C"
          label={lang === 'th' ? 'อุณหภูมิ GPU แอคเซเลอเรเตอร์' : 'GPU Vector Engine'}
          sublabel="Tensor PQC Accelerator"
          color="cyan"
          status="COOL"
          icon={<Thermometer className="w-4 h-4 text-cyan-400" />}
        />

        {/* Gauge 3: Cryogenic Coolant Status */}
        <CircularGauge
          id="gauge-cryo-coolant"
          value={cryoTempMk}
          min={0}
          max={50}
          unit="mK"
          label={lang === 'th' ? 'สถานะสารหล่อเย็นยวดยิ่ง' : 'Cryo Coolant Core'}
          sublabel={`Liquid He Level: ${cryoCoolantLevel.toFixed(1)}%`}
          color="blue"
          status="SUPERCONDUCTING"
          icon={<Snowflake className="w-4 h-4 text-blue-400" />}
        />

        {/* Gauge 4: Kernel Heartbeat Frequency */}
        <CircularGauge
          id="gauge-kernel-heartbeat"
          value={heartbeatFreq}
          min={80}
          max={120}
          unit="Hz"
          label={lang === 'th' ? 'ความถี่ฮาร์ตบีทเคอร์เนล' : 'Kernel Heartbeat'}
          sublabel="Zero Phase Jitter (Δ0.0%)"
          color="purple"
          status="SYNCHRONIZED"
          icon={<Activity className="w-4 h-4 text-purple-400" />}
        />
      </div>

      {/* Auxiliary Telemetry Metrics Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs bg-slate-950 p-4 rounded-xl border border-slate-800/80">
        <div className="space-y-1">
          <span className="text-slate-500 font-mono-code text-[11px] block">
            {lang === 'th' ? 'ระบบป้องกันความร้อนเกิน' : 'Thermal Trip Point'}:
          </span>
          <span className="text-white font-mono-code font-bold text-sm">
            85.0°C <span className="text-[10px] text-red-400 font-normal">(Auto Lock)</span>
          </span>
        </div>

        <div className="space-y-1">
          <span className="text-slate-500 font-mono-code text-[11px] block">
            {lang === 'th' ? 'ความสอดคล้องสถานะควอนตัม' : 'Quantum Coherence'}:
          </span>
          <span className="text-emerald-400 font-mono-code font-bold text-sm">
            99.992% <span className="text-[10px] text-emerald-400 font-normal">STABLE</span>
          </span>
        </div>

        <div className="space-y-1">
          <span className="text-slate-500 font-mono-code text-[11px] block">
            {lang === 'th' ? 'สถานะตู้ฮาร์ดแวร์นิรภัย' : 'HSM Tamper Foils'}:
          </span>
          <span className="text-cyan-400 font-mono-code font-bold text-sm">
            10/10 INTACT <span className="text-[10px] text-slate-400 font-normal">(FIPS 140-3 L4)</span>
          </span>
        </div>

        <div className="space-y-1">
          <span className="text-slate-500 font-mono-code text-[11px] block">
            {lang === 'th' ? 'การกำจัดค่าเบี่ยงเบนสะสม' : 'Clock Phase Drift'}:
          </span>
          <span className="text-purple-400 font-mono-code font-bold text-sm">
            0.0000 ns <span className="text-[10px] text-purple-300 font-normal">(Atomic Locked)</span>
          </span>
        </div>
      </div>
    </div>
  );
};
