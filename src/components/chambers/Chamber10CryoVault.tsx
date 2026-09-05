import React, { useState } from 'react';
import { 
  Snowflake, 
  Flame, 
  Activity, 
  ShieldAlert, 
  CheckCircle2, 
  Zap,
  TrendingDown,
  Info
} from 'lucide-react';
import { THERMODYNAMIC_SPIKES, SYSTEM_METADATA } from '../../data/canonicalData';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

interface ChamberProps {
  lang: 'th' | 'en';
}

export const Chamber10CryoVault: React.FC<ChamberProps> = ({ lang }) => {
  const [selectedSpikeId, setSelectedSpikeId] = useState<string>(THERMODYNAMIC_SPIKES[0].id);

  // Mock telemetry data points for sub-kelvin chart
  const cryoChartData = [
    { time: '04:54:30', temp: 14.98, stability: 99.99 },
    { time: '04:54:54', temp: 15.32, stability: 88.3 }, // Spike 01
    { time: '04:55:00', temp: 14.98, stability: 99.98 },
    { time: '04:55:07', temp: 15.34, stability: 86.5 }, // Spike 02
    { time: '04:55:11', temp: 15.26, stability: 94.2 }, // Spike 03
    { time: '04:55:20', temp: 14.98, stability: 99.99 },
    { time: '04:55:25', temp: 15.35, stability: 85.6 }, // Spike 04
    { time: '04:55:40', temp: 14.98, stability: 99.992 }
  ];

  const selectedSpike = THERMODYNAMIC_SPIKES.find(s => s.id === selectedSpikeId) || THERMODYNAMIC_SPIKES[0];

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="rounded-xl bg-gradient-to-r from-teal-950/80 via-slate-900 to-slate-950 border border-teal-500/40 p-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full bg-teal-950 border border-teal-500/50 text-teal-300 text-xs font-mono-code font-bold flex items-center gap-1.5">
                <Snowflake className="w-3 h-3 text-teal-400" />
                14.98 mK SUPERFLUID CRYO VAULT
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 text-xs font-mono-code">
                Coolant: 100% Helium-4
              </span>
            </div>
            <h2 className="text-2xl font-display font-bold text-white tracking-tight">
              {lang === 'th' ? 'ตู้นิรภัยความเย็นยิ่งยวด (Chamber 10)' : 'Chamber 10: Subzero 14.98 mK Cryogenic Vault'}
            </h2>
            <p className="text-sm text-slate-300 mt-1 max-w-3xl">
              {lang === 'th'
                ? 'ระบบหล่อเย็นสภาวะของเหลวยิ่งยวดฮีเลียม-4 รักษาอุณหภูมิที่ 14.98 mK ป้องกันการแทรกแซงทางอุณหพลศาสตร์และบันทึกประวัติการกระเพื่อมความร้อน (Spike Log)'
                : 'Cryogenic quantum vault stabilized at 14.98 mK using Helium-4 superfluid, monitoring thermal perturbations and thermodynamic spike events.'}
            </p>
          </div>

          <div className="bg-slate-950/80 p-3.5 rounded-lg border border-teal-500/30 text-right">
            <span className="text-xs text-slate-400 block font-mono-code">Current Vault Temp:</span>
            <span className="text-2xl font-mono-code font-bold text-teal-300">
              14.98 mK
            </span>
          </div>
        </div>
      </div>

      {/* Chart: Cryo Temperature Stability & Spikes */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-display font-bold text-white text-base flex items-center gap-2">
            <Activity className="w-4 h-4 text-teal-400" />
            {lang === 'th' ? 'กราฟโทรมาตรอุณหภูมิและการกระเพื่อมความร้อน' : 'Real-Time Sub-Kelvin Thermal Perturbation Profile'}
          </h3>
          <span className="text-xs text-slate-400 font-mono-code">Baseline: 14.98 mK (-196°C Core)</span>
        </div>

        <div className="h-60 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={cryoChartData}>
              <defs>
                <linearGradient id="cryoGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#14b8a6" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#14b8a6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="time" stroke="#64748b" fontSize={11} />
              <YAxis domain={[14.8, 15.6]} stroke="#64748b" fontSize={11} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#020617', borderColor: '#334155', borderRadius: '8px', fontSize: '12px' }}
                formatter={(val: any) => [`${val} mK`, 'Cryo Temp']}
              />
              <Area type="monotone" dataKey="temp" stroke="#14b8a6" strokeWidth={2} fillOpacity={1} fill="url(#cryoGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Spikes Log Table & Selected Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Spikes List (2 Cols) */}
        <div className="lg:col-span-2 bg-slate-900/90 border border-slate-800 rounded-xl p-5 space-y-3">
          <h3 className="font-display font-bold text-white text-base flex items-center gap-2">
            <Flame className="w-4 h-4 text-amber-400" />
            {lang === 'th' ? 'บันทึกการทดสอบคลื่นความร้อน (Thermodynamic Spike Logs)' : 'Thermodynamic Perturbation Audit Log'}
          </h3>

          <div className="space-y-2.5">
            {THERMODYNAMIC_SPIKES.map((spike) => (
              <div
                key={spike.id}
                onClick={() => setSelectedSpikeId(spike.id)}
                className={`p-3 rounded-lg border cursor-pointer transition-all ${
                  selectedSpikeId === spike.id
                    ? 'bg-teal-950/40 border-teal-400 shadow-md'
                    : 'bg-slate-950/70 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-amber-950 border border-amber-500/40 text-amber-300 font-mono-code text-xs font-bold">
                      {spike.id}
                    </span>
                    <span className="text-xs font-bold text-white">
                      {spike.presetName}
                    </span>
                  </div>
                  <span className="text-xs font-mono-code text-cyan-300">
                    Peak ΔS: +{spike.peakDeltaS} J/K
                  </span>
                </div>
                <p className="text-[11px] text-slate-300">
                  {spike.description}
                </p>
                <div className="mt-2 flex items-center justify-between text-[10px] text-slate-400 font-mono-code border-t border-slate-800 pt-1">
                  <span>Timestamp: {spike.timestamp}</span>
                  <span className="text-teal-400">Cryo Peak: {spike.cryo} mK ({spike.tempDelta})</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Selected Spike Inspector (1 Col) */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 space-y-4">
          <h3 className="font-display font-bold text-white text-base flex items-center gap-2">
            <Info className="w-4 h-4 text-cyan-400" />
            {lang === 'th' ? 'รายละเอียดคลื่นความร้อน' : 'Spike Analysis'}
          </h3>

          <div className="bg-slate-950 p-4 rounded-lg border border-slate-800 space-y-3 text-xs">
            <div>
              <span className="text-slate-400 block font-semibold">Spike Event ID:</span>
              <span className="text-white font-mono-code font-bold text-sm">{selectedSpike.id}</span>
            </div>

            <div>
              <span className="text-slate-400 block font-semibold">Entropy Peak (ΔS):</span>
              <span className="text-amber-300 font-mono-code font-bold">+{selectedSpike.peakDeltaS} J/K</span>
            </div>

            <div>
              <span className="text-slate-400 block font-semibold">Temperature Surge:</span>
              <span className="text-teal-300 font-mono-code font-bold">{selectedSpike.tempDelta} (to {selectedSpike.cryo} mK)</span>
            </div>

            <div>
              <span className="text-slate-400 block font-semibold">System Stability Index:</span>
              <span className="text-emerald-400 font-mono-code font-bold">{selectedSpike.stability}% (Quick Recovered)</span>
            </div>

            <div>
              <span className="text-slate-400 block font-semibold">Helium Superfluid Action:</span>
              <span className="text-slate-300 leading-relaxed block bg-slate-900 p-2 rounded border border-slate-800 text-[11px]">
                Helium-4 auto-injection throttled surge in &lt;1.8ms returning core to canonical 14.98 mK baseline.
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
