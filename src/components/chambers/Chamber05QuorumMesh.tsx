import React, { useState, useEffect } from 'react';
import { 
  KeyRound, 
  ShieldCheck, 
  Cpu, 
  Activity, 
  Radio, 
  CheckCircle2, 
  Award,
  Search,
  Sparkles,
  Lock,
  Zap,
  Flame,
  Snowflake,
  Wifi,
  Gauge
} from 'lucide-react';
import { 
  Radar, 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis, 
  ResponsiveContainer,
  Tooltip,
  Legend
} from 'recharts';
import { HSM_NODES, SOVEREIGN_PRINCIPAL, SYSTEM_METADATA } from '../../data/canonicalData';
import { HSMNode } from '../../types';
import { HSMClusterHealthGauge } from '../telemetry/HSMClusterHealthGauge';
import { OmniversalTelemetryMatrix } from '../telemetry/OmniversalTelemetryMatrix';

interface ChamberProps {
  lang: 'th' | 'en';
}

export const Chamber05QuorumMesh: React.FC<ChamberProps> = ({ lang }) => {
  const [selectedNode, setSelectedNode] = useState<HSMNode>(HSM_NODES[0]);
  const [searchQuery, setSearchQuery] = useState('');
  const [chartMode, setChartMode] = useState<'selected' | 'compare' | 'composite'>('compare');
  const [telemetryTick, setTelemetryTick] = useState(0);

  // Subtle real-time telemetry heartbeat update
  useEffect(() => {
    const timer = setInterval(() => {
      setTelemetryTick(prev => (prev + 1) % 1000);
    }, 2000);
    return () => clearInterval(timer);
  }, []);

  const filteredNodes = HSM_NODES.filter(n => 
    n.nameTh.toLowerCase().includes(searchQuery.toLowerCase()) ||
    n.nameEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
    n.councilCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
    n.pqcAlgorithm.toLowerCase().includes(searchQuery.toLowerCase()) ||
    n.hardwareEnclave.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Calculate composite deca-mesh averages
  const avgUptime = (HSM_NODES.reduce((acc, n) => acc + n.vitality.connectivityPct, 0) / HSM_NODES.length).toFixed(2);
  const avgPing = (HSM_NODES.reduce((acc, n) => acc + n.vitality.lastPingMs, 0) / HSM_NODES.length).toFixed(2);
  const avgTempK = (HSM_NODES.reduce((acc, n) => acc + n.vitality.subKelvinTempK, 0) / HSM_NODES.length).toFixed(3);
  const totalEntropyMBps = (HSM_NODES.reduce((acc, n) => acc + n.vitality.activeEntropyRateKBps, 0) / 1024).toFixed(2);

  // Dynamic micro-jitter for selected node vitality in radar
  const nodeSlot = selectedNode.slotId ?? selectedNode.slotNumber ?? 1;
  const dynamicJitter = ((telemetryTick + nodeSlot) % 5) * 0.02;
  const nodeUptime = Math.min(100, Number((selectedNode.vitality.connectivityPct + dynamicJitter * 0.01).toFixed(2)));
  const nodeCryoHealth = Math.min(100, Number((100 - (selectedNode.vitality.subKelvinTempK * 30)).toFixed(2)));
  const nodeCoherence = 99.992;
  const nodeEntropyScore = Math.min(100, Number((80 + (selectedNode.vitality.activeEntropyRateKBps / 2048) * 20).toFixed(1)));
  const nodeSignalClarity = Math.min(100, Number((99.5 + (1 - selectedNode.vitality.jitterMs) * 0.5).toFixed(2)));
  const nodeThroughputScore = Math.min(100, Number((75 + (selectedNode.vitality.busBandwidthGbps / 800) * 25).toFixed(1)));

  // Radar Data structure for Recharts
  const radarData = [
    {
      metric: lang === 'th' ? 'ความพร้อมใช้งาน (Uptime %)' : 'Uptime (%)',
      selectedNode: nodeUptime,
      compositeAverage: 99.88,
      fullMark: 100
    },
    {
      metric: lang === 'th' ? 'เสถียรภาพความเย็น (Cryo Temp)' : 'Cryo Temp Health',
      selectedNode: nodeCryoHealth,
      compositeAverage: 98.92,
      fullMark: 100
    },
    {
      metric: lang === 'th' ? 'ความสอดคล้องรหัสลับ (Coherence)' : 'Crypto Coherence',
      selectedNode: nodeCoherence,
      compositeAverage: 99.99,
      fullMark: 100
    },
    {
      metric: lang === 'th' ? 'กำเนิดเอนโทรปี (Entropy TRNG)' : 'Entropy Generation',
      selectedNode: nodeEntropyScore,
      compositeAverage: 88.50,
      fullMark: 100
    },
    {
      metric: lang === 'th' ? 'ความชัดเจนสัญญาณ (Signal Quality)' : 'Signal Clarity',
      selectedNode: nodeSignalClarity,
      compositeAverage: 99.70,
      fullMark: 100
    },
    {
      metric: lang === 'th' ? 'แบนด์วิดท์บัส (Bus Capacity)' : 'Bus Throughput',
      selectedNode: nodeThroughputScore,
      compositeAverage: 84.00,
      fullMark: 100
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="rounded-xl bg-gradient-to-r from-emerald-950/80 via-slate-900 to-slate-950 border border-emerald-500/40 p-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-950 border border-emerald-500/50 text-emerald-300 text-xs font-mono-code font-bold flex items-center gap-1.5">
                <KeyRound className="w-3 h-3 text-emerald-400" />
                10/10 REAL_HSM DECA-KEY QUORUM
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 text-xs font-mono-code">
                Standard: FIPS 140-3 Level 4
              </span>
            </div>
            <h2 className="text-2xl font-display font-bold text-white tracking-tight">
              {lang === 'th' ? 'สภาผู้พิทักษ์กุญแจฮาร์ดแวร์ 10 โหนด (Chamber 05)' : 'Chamber 05: 10/10 HSM Quorum Consensus Mesh'}
            </h2>
            <p className="text-sm text-slate-300 mt-1 max-w-3xl">
              {lang === 'th'
                ? 'โครงข่ายฉันทามติ 10 กุญแจฮาร์ดแวร์ (TC-01 ถึง TC-10) ลงนามร่วมกัน 100% เอกฉันท์ด้วยลายเซ็น Dilithium-5 / FALCON / SPHINCS+ ปราศจากการบิดเบือน'
                : 'Deca-Key hardware enclave mesh requiring 10/10 unanimous cryptographic authorization across Post-Quantum Dilithium-5, FALCON-1024, and SPHINCS+ algorithms.'}
            </p>
          </div>

          <div className="bg-slate-950/80 p-3 rounded-lg border border-emerald-500/30 text-right">
            <span className="text-xs text-slate-400 block font-mono-code">Consensus Status:</span>
            <span className="text-lg font-mono-code font-bold text-emerald-400 flex items-center justify-end gap-1.5">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              10/10 UNANIMOUS
            </span>
          </div>
        </div>
      </div>

      {/* High-Fidelity HSM Cluster Health Gauge & Dilithium-5 Sync Monitor */}
      <HSMClusterHealthGauge 
        lang={lang} 
        onSelectNode={(node) => setSelectedNode(node)}
        selectedNodeId={selectedNode.councilCode}
      />

      {/* Omniversal Telemetry Matrix HUD Deck */}
      <OmniversalTelemetryMatrix lang={lang} />

      {/* Hardware Enclave Health Dashboard Panel with Radar Chart */}
      <div className="bg-slate-900/90 border border-emerald-500/40 rounded-xl p-6 shadow-xl space-y-6">
        {/* Panel Header & Mode Switcher */}
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Activity className="w-5 h-5 text-emerald-400" />
              <h3 className="font-display font-bold text-white text-lg">
                {lang === 'th' ? 'แผงตรวจสอบสุขภาพฮาร์ดแวร์เอนเคลฟ HSM (Hardware Enclave Health)' : 'Hardware Enclave Health Dashboard'}
              </h3>
              <span className="px-2 py-0.5 rounded bg-cyan-950 border border-cyan-500/40 text-cyan-300 text-xs font-mono-code font-bold">
                LIVE RADAR MATRIX
              </span>
            </div>
            <p className="text-xs text-slate-300">
              {lang === 'th'
                ? 'ติดตามตรวจสอบความพร้อมใช้งาน (Uptime), อุณหภูมิเยือกแข็งยิ่งยวด (Temperature) และความสอดคล้องรหัสลับ (Cryptographic Coherence) ทั้ง 10 โหนดแบบเรียลไทม์'
                : 'Real-time telemetry monitoring uptime, sub-kelvin cryogenic temperatures, and quantum coherence across all 10 HSM nodes using multi-axis radar telemetry.'}
            </p>
          </div>

          {/* Quick Node & View Selector */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs font-mono-code">
              <button
                onClick={() => setChartMode('compare')}
                className={`px-3 py-1 rounded transition-all ${
                  chartMode === 'compare'
                    ? 'bg-emerald-950 text-emerald-300 font-bold border border-emerald-500/40'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {lang === 'th' ? 'เปรียบเทียบโหนด vs เฉลี่ย' : 'Node vs Average'}
              </button>
              <button
                onClick={() => setChartMode('selected')}
                className={`px-3 py-1 rounded transition-all ${
                  chartMode === 'selected'
                    ? 'bg-emerald-950 text-emerald-300 font-bold border border-emerald-500/40'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {lang === 'th' ? `เฉพาะ ${selectedNode.councilCode}` : `Focus: ${selectedNode.councilCode}`}
              </button>
              <button
                onClick={() => setChartMode('composite')}
                className={`px-3 py-1 rounded transition-all ${
                  chartMode === 'composite'
                    ? 'bg-emerald-950 text-emerald-300 font-bold border border-emerald-500/40'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {lang === 'th' ? 'ค่าเฉลี่ย 10 โหนด' : 'Deca-Mesh Mean'}
              </button>
            </div>
          </div>
        </div>

        {/* 4 Live Vitality KPI Summary Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[11px] text-slate-400 font-mono-code">{lang === 'th' ? 'ความพร้อมใช้งานเฉลี่ย:' : 'Quorum Uptime:'}</span>
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            </div>
            <span className="text-base font-bold text-emerald-400 font-mono-code">{avgUptime}%</span>
            <span className="text-[10px] text-slate-400 block mt-0.5">10/10 Nodes Active</span>
          </div>

          <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[11px] text-slate-400 font-mono-code">{lang === 'th' ? 'อุณหภูมิเอนเคลฟ:' : 'Cryo Enclave Temp:'}</span>
              <Snowflake className="w-3.5 h-3.5 text-cyan-400" />
            </div>
            <span className="text-base font-bold text-cyan-300 font-mono-code">{SYSTEM_METADATA.telemetry.cryoTemp.split(' ')[0]} mK</span>
            <span className="text-[10px] text-slate-400 block mt-0.5">Superfluid Helium-4</span>
          </div>

          <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[11px] text-slate-400 font-mono-code">{lang === 'th' ? 'ความสอดคล้องรหัสลับ:' : 'Crypto Coherence:'}</span>
              <Sparkles className="w-3.5 h-3.5 text-purple-400" />
            </div>
            <span className="text-base font-bold text-purple-300 font-mono-code">{SYSTEM_METADATA.telemetry.coherence}%</span>
            <span className="text-[10px] text-slate-400 block mt-0.5">Zero Quantum Drift</span>
          </div>

          <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[11px] text-slate-400 font-mono-code">{lang === 'th' ? 'อัตราไหลเอนโทรปี:' : 'Entropy TRNG Flux:'}</span>
              <Zap className="w-3.5 h-3.5 text-amber-400" />
            </div>
            <span className="text-base font-bold text-amber-300 font-mono-code">{totalEntropyMBps} MB/s</span>
            <span className="text-[10px] text-slate-400 block mt-0.5">True Quantum Entropy</span>
          </div>
        </div>

        {/* Radar Chart & Dynamic Inspector Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          {/* Left 7 Cols: The Radar Chart */}
          <div className="lg:col-span-7 bg-slate-950/90 p-4 rounded-xl border border-slate-800 flex flex-col items-center">
            <div className="w-full flex items-center justify-between mb-2 px-2">
              <span className="text-xs font-mono-code text-slate-400 flex items-center gap-1.5">
                <Gauge className="w-3.5 h-3.5 text-emerald-400" />
                {lang === 'th' ? 'กราฟเรดาร์โทรมาตร 6 มิติ' : '6-Axis Enclave Health Radar'}
              </span>
              <div className="flex items-center gap-3 text-[11px] font-mono-code">
                {(chartMode === 'selected' || chartMode === 'compare') && (
                  <span className="flex items-center gap-1.5 text-emerald-400">
                    <span className="h-2 w-2 rounded-full bg-emerald-400 inline-block" />
                    {selectedNode.councilCode} ({lang === 'th' ? selectedNode.nameTh : selectedNode.nameEn})
                  </span>
                )}
                {(chartMode === 'composite' || chartMode === 'compare') && (
                  <span className="flex items-center gap-1.5 text-cyan-400">
                    <span className="h-2 w-2 rounded-full bg-cyan-400 inline-block" />
                    {lang === 'th' ? 'ค่าเฉลี่ย 10 โหนด' : 'Deca-Mesh Baseline'}
                  </span>
                )}
              </div>
            </div>

            <div className="w-full h-72 sm:h-80">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="75%" data={radarData}>
                  <PolarGrid stroke="#334155" strokeDasharray="3 3" />
                  <PolarAngleAxis 
                    dataKey="metric" 
                    tick={{ fill: '#94a3b8', fontSize: 11, fontFamily: 'monospace' }} 
                  />
                  <PolarRadiusAxis 
                    angle={30} 
                    domain={[60, 100]} 
                    tick={{ fill: '#64748b', fontSize: 9, fontFamily: 'monospace' }} 
                    stroke="#334155"
                  />
                  
                  {(chartMode === 'selected' || chartMode === 'compare') && (
                    <Radar
                      name={selectedNode.councilCode}
                      dataKey="selectedNode"
                      stroke="#10b981"
                      fill="#10b981"
                      fillOpacity={0.4}
                      strokeWidth={2}
                    />
                  )}

                  {(chartMode === 'composite' || chartMode === 'compare') && (
                    <Radar
                      name={lang === 'th' ? 'ค่าเฉลี่ย 10 โหนด' : 'Deca-Mesh Baseline'}
                      dataKey="compositeAverage"
                      stroke="#06b6d4"
                      fill="#06b6d4"
                      fillOpacity={0.25}
                      strokeWidth={2}
                      strokeDasharray="4 4"
                    />
                  )}

                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#020617', 
                      borderColor: '#334155',
                      borderRadius: '0.5rem',
                      color: '#f8fafc',
                      fontSize: '12px',
                      fontFamily: 'monospace'
                    }}
                    formatter={(value: any) => [`${value}%`, 'Score']}
                  />
                  <Legend 
                    wrapperStyle={{ fontSize: '11px', fontFamily: 'monospace', paddingTop: '8px' }} 
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Right 5 Cols: Selected Node Live Micro-Telemetry Metrics */}
          <div className="lg:col-span-5 bg-slate-950/90 p-5 rounded-xl border border-slate-800 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <span className="text-[10px] text-slate-400 font-mono-code uppercase block">Enclave Node Focus:</span>
                <span className="text-white font-bold font-display text-sm flex items-center gap-2">
                  <span className="px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-300 font-mono-code text-xs">
                    {selectedNode.councilCode}
                  </span>
                  {lang === 'th' ? selectedNode.nameTh : selectedNode.nameEn}
                </span>
              </div>
              <span className="px-2 py-0.5 rounded bg-emerald-950/80 border border-emerald-500/40 text-emerald-400 text-xs font-mono-code font-bold">
                ONLINE
              </span>
            </div>

            {/* Quick 10 Node Pill Selector to Switch Radar Target */}
            <div>
              <span className="text-[11px] text-slate-400 block font-mono-code mb-1.5">
                {lang === 'th' ? 'เลือกเปลี่ยนโหนดเพื่อเปรียบเทียบ:' : 'Select HSM Node for Radar:'}
              </span>
              <div className="grid grid-cols-5 gap-1.5">
                {HSM_NODES.map(node => (
                  <button
                    key={node.id}
                    onClick={() => setSelectedNode(node)}
                    className={`py-1 text-center rounded text-[11px] font-mono-code font-bold transition-all ${
                      selectedNode.id === node.id
                        ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-950'
                        : 'bg-slate-900 text-slate-300 hover:bg-slate-800 hover:text-white border border-slate-800'
                    }`}
                  >
                    {node.councilCode}
                  </button>
                ))}
              </div>
            </div>

            {/* Live Telemetry Progress Bars */}
            <div className="space-y-2.5 text-xs font-mono-code pt-2 border-t border-slate-800">
              <div>
                <div className="flex justify-between text-slate-300 mb-1">
                  <span>{lang === 'th' ? 'ความพร้อมใช้งาน (Uptime):' : 'Node Uptime:'}</span>
                  <span className="text-emerald-400 font-bold">{nodeUptime}%</span>
                </div>
                <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full transition-all" style={{ width: `${nodeUptime}%` }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-slate-300 mb-1">
                  <span>{lang === 'th' ? 'อุณหภูมิเยือกแข็ง (Cryo Temp):' : 'Sub-Kelvin Temp:'}</span>
                  <span className="text-cyan-300 font-bold">{selectedNode.vitality.subKelvinTempK} K</span>
                </div>
                <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden">
                  <div className="h-full bg-cyan-500 rounded-full transition-all" style={{ width: `${nodeCryoHealth}%` }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-slate-300 mb-1">
                  <span>{lang === 'th' ? 'ความหน่วงสัญญาณ (Ping):' : 'Bus Ping Latency:'}</span>
                  <span className="text-teal-300 font-bold">{(selectedNode.vitality.lastPingMs + dynamicJitter).toFixed(2)} ms</span>
                </div>
                <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden">
                  <div className="h-full bg-teal-500 rounded-full transition-all" style={{ width: `${100 - selectedNode.vitality.lastPingMs * 50}%` }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-slate-300 mb-1">
                  <span>{lang === 'th' ? 'อัตราเอนโทรปี (Entropy):' : 'Entropy Rate:'}</span>
                  <span className="text-amber-300 font-bold">{selectedNode.vitality.activeEntropyRateKBps} KB/s</span>
                </div>
                <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden">
                  <div className="h-full bg-amber-500 rounded-full transition-all" style={{ width: `${(selectedNode.vitality.activeEntropyRateKBps / 2048) * 100}%` }} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Grid: Custodian Grid List & Selected Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: 10 Custodians Table/Cards */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between gap-4">
            <h3 className="font-display font-bold text-white text-base flex items-center gap-2">
              <KeyRound className="w-4 h-4 text-emerald-400" />
              {lang === 'th' ? 'รายนามผู้พิทักษ์กุญแจทั้ง 10 โหนด' : '10 Sovereign Custodians (TC-01 to TC-10)'}
            </h3>
            <div className="relative w-48 sm:w-64">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder={lang === 'th' ? "ค้นหาผู้พิทักษ์..." : "Filter custodians..."}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1 bg-slate-900 border border-slate-700 rounded text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {filteredNodes.map((node) => {
              const isSelected = selectedNode.id === node.id;
              return (
                <div
                  key={node.id}
                  onClick={() => setSelectedNode(node)}
                  className={`p-4 rounded-xl border cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-emerald-950/40 border-emerald-400 shadow-md shadow-emerald-950/50'
                      : 'bg-slate-900/80 border-slate-800 hover:border-slate-700 hover:bg-slate-850'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded bg-emerald-950 border border-emerald-500/40 text-emerald-300 font-mono-code text-xs font-bold">
                        {node.councilCode}
                      </span>
                      <span className="text-xs font-bold text-white">
                        {lang === 'th' ? node.nameTh : node.nameEn}
                      </span>
                    </div>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-950/90 text-emerald-400 font-mono-code font-bold">
                      SIGNED
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-300 line-clamp-1 mb-2">
                    {lang === 'th' ? node.roleTh : node.clearanceLevel}
                  </p>

                  <div className="text-[10px] text-slate-400 space-y-1 border-t border-slate-800 pt-2 font-mono-code">
                    <div className="flex justify-between">
                      <span>Hardware:</span>
                      <span className="text-slate-300 truncate max-w-[150px]">{node.hardwareEnclave}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Algorithm:</span>
                      <span className="text-cyan-300">{node.pqcAlgorithm}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Col: Deep Node Inspector */}
        <div className="space-y-4">
          <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-display font-bold text-white text-base flex items-center gap-2">
                <Cpu className="w-4 h-4 text-cyan-400" />
                {lang === 'th' ? 'ตรวจสอบฮาร์ดแวร์ HSM' : 'HSM Enclave Inspector'}
              </h3>
              <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 text-xs font-mono-code font-bold">
                {selectedNode.councilCode}
              </span>
            </div>

            <div className="bg-slate-950 p-4 rounded-lg border border-slate-800 space-y-3 text-xs">
              <div>
                <span className="text-slate-400 block font-semibold">Custodian Name:</span>
                <span className="text-white font-bold text-sm">
                  {lang === 'th' ? selectedNode.nameTh : selectedNode.nameEn}
                </span>
                <span className="text-[11px] text-slate-400 block">{selectedNode.roleTh}</span>
              </div>

              <div>
                <span className="text-slate-400 block font-semibold">Clearance Level:</span>
                <span className="text-emerald-400 font-mono-code font-semibold">{selectedNode.clearanceLevel}</span>
              </div>

              <div>
                <span className="text-slate-400 block font-semibold">Hardware Enclave & FIPS:</span>
                <span className="text-cyan-300 font-mono-code">{selectedNode.hardwareEnclave}</span>
                <span className="text-[11px] text-slate-400 block mt-0.5">{selectedNode.fipsCertification}</span>
              </div>

              <div>
                <span className="text-slate-400 block font-semibold">PQC Algorithm:</span>
                <span className="text-amber-300 font-mono-code font-bold">{selectedNode.pqcAlgorithm}</span>
              </div>

              <div>
                <span className="text-slate-400 block font-semibold">Key Fingerprint:</span>
                <span className="text-slate-300 font-mono-code text-[10px] break-all bg-slate-900 p-1.5 rounded block border border-slate-800">
                  {selectedNode.keyFingerprint}
                </span>
              </div>

              <div>
                <span className="text-slate-400 block font-semibold">Cryptographic Signature:</span>
                <span className="text-emerald-400 font-mono-code text-[10px] break-all bg-slate-900 p-1.5 rounded block border border-slate-800">
                  {selectedNode.cryptoSignature}
                </span>
              </div>

              <div>
                <span className="text-slate-400 block font-semibold">Live Telemetry Vitality:</span>
                <div className="grid grid-cols-2 gap-2 mt-1 text-[11px] font-mono-code">
                  <div className="bg-slate-900 p-1.5 rounded">
                    <span className="text-slate-400 block">Ping:</span>
                    <span className="text-cyan-300">{selectedNode.vitality.lastPingMs}ms</span>
                  </div>
                  <div className="bg-slate-900 p-1.5 rounded">
                    <span className="text-slate-400 block">Bandwidth:</span>
                    <span className="text-cyan-300">{selectedNode.vitality.busBandwidthGbps} Gbps</span>
                  </div>
                  <div className="bg-slate-900 p-1.5 rounded">
                    <span className="text-slate-400 block">Entropy Rate:</span>
                    <span className="text-emerald-400">{selectedNode.vitality.activeEntropyRateKBps} KB/s</span>
                  </div>
                  <div className="bg-slate-900 p-1.5 rounded">
                    <span className="text-slate-400 block">Temp:</span>
                    <span className="text-teal-300">{selectedNode.vitality.subKelvinTempK} K</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

