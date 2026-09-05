import React, { useState, useEffect } from 'react';
import { 
  Globe, 
  Activity, 
  ShieldCheck, 
  Layers, 
  Server, 
  ArrowRight, 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  Zap, 
  Trash2, 
  Filter, 
  Radio, 
  Cpu, 
  Lock, 
  Play, 
  Pause,
  RotateCcw,
  Sparkles,
  TrendingUp,
  MapPin,
  Check,
  X
} from 'lucide-react';

interface GlobalNetworkArchitectureProps {
  lang: 'th' | 'en';
}

interface QueueItem {
  id: number;
  label: string;
  status: 'QUEUED' | 'PROCESSING' | 'COMPLETED';
  timestamp: string;
}

export const GlobalNetworkArchitectureDeck: React.FC<GlobalNetworkArchitectureProps> = ({ lang }) => {
  // Section 1: Radial Topology State
  const [selectedRadialNode, setSelectedRadialNode] = useState<number | null>(1);
  const [radialPulse, setRadialPulse] = useState(0);

  // Section 2: Traffic Curve State
  const [trafficHoverTime, setTrafficHoverTime] = useState<string | null>('12:00');
  const [liveThroughput, setLiveThroughput] = useState<number>(68);

  // Section 3: Global Route State
  const [activeRoute, setActiveRoute] = useState<'PRIMARY' | 'BACKUP'>('PRIMARY');

  // Section 4: Queue & Flow State
  const [queueItems, setQueueItems] = useState<QueueItem[]>([
    { id: 1, label: 'Tx #01 - Auth Token', status: 'COMPLETED', timestamp: '11:10:02' },
    { id: 2, label: 'Tx #02 - Dilithium Seal', status: 'PROCESSING', timestamp: '11:10:05' },
    { id: 3, label: 'Tx #03 - Merkle Ingest', status: 'QUEUED', timestamp: '11:10:08' },
    { id: 4, label: 'Tx #04 - Cryo Sync', status: 'QUEUED', timestamp: '11:10:11' },
    { id: 5, label: 'Tx #05 - Quantum Beacon', status: 'QUEUED', timestamp: '11:10:14' },
  ]);
  const [isQueueRunning, setIsQueueRunning] = useState<boolean>(true);

  // Section 5: Quarantine Pipeline Simulator State
  const [packetType, setPacketType] = useState<'SAFE' | 'MALICIOUS'>('SAFE');
  const [pipelineStep, setPipelineStep] = useState<number>(0);
  const [isInspecting, setIsInspecting] = useState<boolean>(false);

  // Periodic tickers
  useEffect(() => {
    const timer = setInterval(() => {
      setRadialPulse(prev => (prev + 1) % 100);
      setLiveThroughput(Math.floor(45 + Math.sin(Date.now() * 0.002) * 35 + Math.random() * 8));
    }, 1200);
    return () => clearInterval(timer);
  }, []);

  // Queue automated processor
  useEffect(() => {
    if (!isQueueRunning) return;
    const interval = setInterval(() => {
      setQueueItems(prev => {
        const next = [...prev];
        const processingIdx = next.findIndex(i => i.status === 'PROCESSING');
        if (processingIdx !== -1) {
          next[processingIdx].status = 'COMPLETED';
          const nextQueuedIdx = next.findIndex(i => i.status === 'QUEUED');
          if (nextQueuedIdx !== -1) {
            next[nextQueuedIdx].status = 'PROCESSING';
          } else {
            // Re-seed a new packet
            const newId = (next[next.length - 1]?.id || 0) + 1;
            next.push({
              id: newId,
              label: `Tx #${newId.toString().padStart(2, '0')} - Epoch Sync`,
              status: 'QUEUED',
              timestamp: new Date().toLocaleTimeString()
            });
          }
        } else {
          const nextQueuedIdx = next.findIndex(i => i.status === 'QUEUED');
          if (nextQueuedIdx !== -1) {
            next[nextQueuedIdx].status = 'PROCESSING';
          }
        }
        return next.slice(-6);
      });
    }, 2000);
    return () => clearInterval(interval);
  }, [isQueueRunning]);

  const handleTestPacket = (type: 'SAFE' | 'MALICIOUS') => {
    setPacketType(type);
    setIsInspecting(true);
    setPipelineStep(1); // Source
    setTimeout(() => setPipelineStep(2), 700); // Firewall
    setTimeout(() => setPipelineStep(3), 1500); // Chamber Quarantine
    setTimeout(() => {
      setPipelineStep(type === 'SAFE' ? 4 : 5); // Destination or Discard
      setIsInspecting(false);
    }, 2400);
  };

  const radialNodes = [
    { id: 1, label: 'N1', angle: 90, color: '#38bdf8' },
    { id: 2, label: 'N2', angle: 57, color: '#fb923c' },
    { id: 3, label: 'N3', angle: 24, color: '#f472b6' },
    { id: 4, label: 'N4', angle: 351, color: '#c084fc' },
    { id: 5, label: 'N5', angle: 318, color: '#4ade80' },
    { id: 6, label: 'N6', angle: 285, color: '#38bdf8' },
    { id: 7, label: 'N7', angle: 252, color: '#60a5fa' },
    { id: 8, label: 'N8', angle: 219, color: '#38bdf8' },
    { id: 9, label: 'N9', angle: 186, color: '#f87171' },
    { id: 10, label: 'N10', angle: 153, color: '#c084fc' },
    { id: 11, label: 'N11', angle: 120, color: '#2dd4bf' },
  ];

  return (
    <div className="space-y-6 font-mono-code">
      {/* SECTION 1: แบบจำลองการกระจายและการเชื่อมต่อในเครือข่าย (Radial Topology Model) */}
      <div className="bg-slate-900/95 border border-cyan-500/40 rounded-2xl p-5 shadow-2xl relative overflow-hidden">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <span className="w-7 h-7 rounded-full bg-cyan-950 border border-cyan-400 text-cyan-300 font-extrabold flex items-center justify-center text-sm shadow-md">
              1
            </span>
            <h3 className="text-lg font-bold text-white tracking-tight">
              {lang === 'th' ? 'แบบจำลองการกระจายและการเชื่อมต่อในเครือข่าย (Network Distribution & Radial Topology)' : 'Network Distribution & Radial Topology Model'}
            </h3>
          </div>
          <span className="text-xs px-2.5 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-500/40 font-bold">
            11 SATELLITE NODES
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-4 items-center">
          {/* Left Diagram: 11 Nodes Radial Topology SVG */}
          <div className="lg:col-span-6 relative flex flex-col items-center justify-center p-4 bg-slate-950/80 rounded-xl border border-slate-800 h-80">
            <div className="absolute top-2 left-3 text-[11px] text-slate-400">
              <span className="text-cyan-400 font-bold">โหนด (n)</span>: 11 โหนดสัจจะ
            </div>

            {/* Radial SVG Stage */}
            <div className="relative w-64 h-64 flex items-center justify-center">
              <svg className="w-full h-full">
                {/* Background Concentric Rings */}
                <circle cx="128" cy="128" r="100" stroke="#1e293b" strokeWidth="1.5" strokeDasharray="3 3" fill="none" />
                <circle cx="128" cy="128" r="60" stroke="#0e7490" strokeWidth="1" strokeOpacity="0.4" fill="none" />

                {/* Connecting Spoke Lines */}
                {radialNodes.map((node) => {
                  const rad = (node.angle * Math.PI) / 180;
                  const x = 128 + 100 * Math.cos(rad);
                  const y = 128 - 100 * Math.sin(rad);
                  const isSelected = selectedRadialNode === node.id;
                  return (
                    <line
                      key={`line-${node.id}`}
                      x1="128"
                      y1="128"
                      x2={x}
                      y2={y}
                      stroke={isSelected ? node.color : '#0369a1'}
                      strokeWidth={isSelected ? '2.5' : '1'}
                      strokeOpacity={isSelected ? 1 : 0.6}
                    />
                  );
                })}
              </svg>

              {/* Center Hub Node */}
              <div className="absolute w-16 h-16 rounded-full bg-gradient-to-tr from-amber-600 via-amber-400 to-yellow-300 shadow-xl shadow-amber-500/40 flex flex-col items-center justify-center text-slate-950 font-extrabold text-[10px] z-10 border-2 border-white animate-pulse">
                <span>CENTRAL</span>
                <span className="text-[8px]">CORE</span>
              </div>

              {/* 11 Outer Satellite Nodes */}
              {radialNodes.map((node) => {
                const rad = (node.angle * Math.PI) / 180;
                const leftPercent = 50 + 40 * Math.cos(rad);
                const topPercent = 50 - 40 * Math.sin(rad);
                const isSelected = selectedRadialNode === node.id;

                return (
                  <button
                    key={node.id}
                    onClick={() => setSelectedRadialNode(node.id)}
                    className={`absolute -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full border-2 flex items-center justify-center font-bold text-xs transition-all shadow-md ${
                      isSelected
                        ? 'scale-125 ring-2 ring-white z-20'
                        : 'hover:scale-110 opacity-90'
                    }`}
                    style={{
                      left: `${leftPercent}%`,
                      top: `${topPercent}%`,
                      borderColor: node.color,
                      backgroundColor: isSelected ? node.color : '#0f172a',
                      color: isSelected ? '#020617' : '#f8fafc'
                    }}
                  >
                    {node.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right Info Boxes: แนวคิดหลัก + ข้อดีของโครงสร้าง */}
          <div className="lg:col-span-6 space-y-4 text-xs">
            <div className="bg-slate-950/90 border border-cyan-500/30 rounded-xl p-4 space-y-2">
              <div className="flex items-center gap-2 text-cyan-400 font-bold text-sm">
                <Sparkles className="w-4 h-4" />
                <span>{lang === 'th' ? 'แนวคิดหลัก (Radial Topology)' : 'Core Concept (Radial Topology)'}</span>
              </div>
              <p className="text-slate-300 leading-relaxed text-[11px]">
                {lang === 'th'
                  ? 'โหนดทุกจุดเชื่อมต่อกับศูนย์กลางเดี่ยว (Central Node) ทำให้การสื่อสารมีประสิทธิภาพ ควบคุมและจัดการง่าย เหมาะกับระบบที่มีความเสถียรและความน่าเชื่อถือระดับ Sovereign Invariant'
                  : 'Every node connects to a single Central Hub, ensuring high-efficiency communication, centralized coordination, and maximum systemic stability.'}
              </p>
            </div>

            <div className="bg-slate-950/90 border border-slate-800 rounded-xl p-4 space-y-2.5">
              <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
                <ShieldCheck className="w-4 h-4" />
                <span>{lang === 'th' ? 'ข้อดีของโครงสร้าง (Structural Advantages)' : 'Structural Advantages'}</span>
              </div>
              <ul className="space-y-1.5 text-[11px] text-slate-300">
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>{lang === 'th' ? 'ลดความซับซ้อนในการสื่อสาร (Reduced routing complexity)' : 'Reduced communication complexity'}</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>{lang === 'th' ? 'ศูนย์กลางควบคุมและกระจายข้อมูลได้รวดเร็ว (Fast centralized distribution)' : 'Fast centralized broadcast & governance'}</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>{lang === 'th' ? 'ง่ายต่อการบำรุงรักษาและตรวจสอบ (Effortless maintenance & audit)' : 'High auditability & zero-drift verification'}</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>{lang === 'th' ? 'รองรับการขยายระบบได้อย่างมีประสิทธิภาพ (High scalability & resilience)' : 'Scalable expansion with zero mutation'}</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 2: กราฟแสดงการรับ-ส่งข้อมูลตามช่วงเวลา (Traffic & Throughput Graph) */}
      <div className="bg-slate-900/95 border border-blue-500/40 rounded-2xl p-5 shadow-2xl relative overflow-hidden">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <span className="w-7 h-7 rounded-full bg-blue-950 border border-blue-400 text-blue-300 font-extrabold flex items-center justify-center text-sm shadow-md">
              2
            </span>
            <h3 className="text-lg font-bold text-white tracking-tight">
              {lang === 'th' ? 'กราฟแสดงการรับ-ส่งข้อมูลตามช่วงเวลา (Traffic & Throughput Time-Series)' : 'Traffic & Throughput Time-Series Analysis'}
            </h3>
          </div>
          <span className="text-xs px-2.5 py-0.5 rounded bg-blue-950 text-blue-300 border border-blue-500/40 font-bold">
            24-HOUR TELEMETRY
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-4">
          {/* Left Chart Area */}
          <div className="lg:col-span-8 bg-slate-950 p-4 rounded-xl border border-slate-800 flex flex-col justify-between">
            <div className="flex justify-between items-center text-xs text-slate-400 mb-2">
              <span className="font-bold text-slate-300">{lang === 'th' ? 'ปริมาณการรับ-ส่งข้อมูล (Mbps)' : 'Throughput (Mbps)'}</span>
              <span className="text-cyan-400 font-bold">Live Stream: {liveThroughput} Mbps</span>
            </div>

            {/* SVG 24h Area Graph */}
            <div className="relative h-44 w-full">
              <svg className="w-full h-full overflow-visible" viewBox="0 0 500 160" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="blueGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#0284c7" stopOpacity="0.5" />
                    <stop offset="100%" stopColor="#0284c7" stopOpacity="0.0" />
                  </linearGradient>
                </defs>

                {/* Horizontal Grid lines (0, 25, 50, 76, 100) */}
                <line x1="0" y1="10" x2="500" y2="10" stroke="#1e293b" strokeWidth="1" strokeDasharray="2 2" />
                <line x1="0" y1="48" x2="500" y2="48" stroke="#1e293b" strokeWidth="1" strokeDasharray="2 2" />
                <line x1="0" y1="85" x2="500" y2="85" stroke="#1e293b" strokeWidth="1" strokeDasharray="2 2" />
                <line x1="0" y1="122" x2="500" y2="122" stroke="#1e293b" strokeWidth="1" strokeDasharray="2 2" />
                <line x1="0" y1="160" x2="500" y2="160" stroke="#334155" strokeWidth="1" />

                {/* 24-Hour Area Curve */}
                <path
                  d="M 0 145 C 50 140, 80 130, 120 110 C 160 80, 200 25, 250 20 C 300 15, 340 50, 380 90 C 420 130, 460 145, 500 150 L 500 160 L 0 160 Z"
                  fill="url(#blueGradient)"
                />
                <path
                  d="M 0 145 C 50 140, 80 130, 120 110 C 160 80, 200 25, 250 20 C 300 15, 340 50, 380 90 C 420 130, 460 145, 500 150"
                  fill="none"
                  stroke="#38bdf8"
                  strokeWidth="3"
                />

                {/* Key Points */}
                <circle cx="250" cy="20" r="5" fill="#38bdf8" className="animate-ping" />
                <circle cx="250" cy="20" r="4" fill="#ffffff" />
              </svg>

              {/* Y-Axis Labels */}
              <div className="absolute top-0 -left-1 text-[9px] text-slate-500 flex flex-col justify-between h-full pointer-events-none">
                <span>100</span>
                <span>76</span>
                <span>50</span>
                <span>25</span>
                <span>0</span>
              </div>
            </div>

            {/* X-Axis Timeline Labels */}
            <div className="flex justify-between text-[10px] text-slate-400 mt-3 pt-2 border-t border-slate-800">
              <span>00:00</span>
              <span>04:00</span>
              <span>08:00</span>
              <span className="text-cyan-300 font-bold">12:00 (Peak)</span>
              <span>16:00</span>
              <span>20:00</span>
              <span>24:00</span>
            </div>
          </div>

          {/* Right Statistics Summary Cards (สรุปสถิติ) */}
          <div className="lg:col-span-4 bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
            <div className="flex items-center gap-2 text-white font-bold text-xs pb-2 border-b border-slate-800">
              <TrendingUp className="w-4 h-4 text-blue-400" />
              <span>{lang === 'th' ? 'สรุปสถิติ (Throughput Summary)' : 'Throughput Summary'}</span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="bg-slate-900/80 p-2.5 rounded-lg border border-slate-800">
                <span className="text-[10px] text-slate-400 block">{lang === 'th' ? 'แบนด์วิดท์สูงสุด' : 'Peak Bandwidth'}</span>
                <span className="text-base font-bold text-cyan-300">100 Mbps</span>
              </div>

              <div className="bg-slate-900/80 p-2.5 rounded-lg border border-slate-800">
                <span className="text-[10px] text-slate-400 block">{lang === 'th' ? 'แบนด์วิดท์เฉลี่ย' : 'Avg Bandwidth'}</span>
                <span className="text-base font-bold text-blue-300">50 Mbps</span>
              </div>

              <div className="bg-slate-900/80 p-2.5 rounded-lg border border-slate-800">
                <span className="text-[10px] text-slate-400 block">{lang === 'th' ? 'ช่วงเวลาใช้งานสูงสุด' : 'Peak Hours'}</span>
                <span className="text-xs font-bold text-amber-300">08:00 - 16:00</span>
              </div>

              <div className="bg-slate-900/80 p-2.5 rounded-lg border border-slate-800">
                <span className="text-[10px] text-slate-400 block">{lang === 'th' ? 'เสถียรภาพระบบ' : 'Stability'}</span>
                <span className="text-xs font-bold text-emerald-400">สูงมาก (99.99%)</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 3: เครือข่ายการเชื่อมต่อโกลบอล (Global Nodes: USA -> Bangkok -> Tokyo) */}
      <div className="bg-slate-900/95 border border-purple-500/40 rounded-2xl p-5 shadow-2xl relative overflow-hidden">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <span className="w-7 h-7 rounded-full bg-purple-950 border border-purple-400 text-purple-300 font-extrabold flex items-center justify-center text-sm shadow-md">
              3
            </span>
            <h3 className="text-lg font-bold text-white tracking-tight">
              {lang === 'th' ? 'เครือข่ายการเชื่อมต่อโกลบอล (Global Nodes Connection)' : 'Global Nodes Connection & Routing'}
            </h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveRoute('PRIMARY')}
              className={`px-2.5 py-1 rounded text-xs font-bold transition-all ${
                activeRoute === 'PRIMARY'
                  ? 'bg-cyan-950 text-cyan-300 border border-cyan-400'
                  : 'bg-slate-950 text-slate-400 hover:text-slate-200'
              }`}
            >
              Primary Route
            </button>
            <button
              onClick={() => setActiveRoute('BACKUP')}
              className={`px-2.5 py-1 rounded text-xs font-bold transition-all ${
                activeRoute === 'BACKUP'
                  ? 'bg-purple-950 text-purple-300 border border-purple-400'
                  : 'bg-slate-950 text-slate-400 hover:text-slate-200'
              }`}
            >
              Backup Route
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-4 items-center">
          {/* Map Representation with 3 Global Hubs */}
          <div className="lg:col-span-7 bg-slate-950 rounded-xl p-5 border border-slate-800 relative h-64 flex items-center justify-between overflow-hidden">
            {/* World grid lines background */}
            <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:12px_12px] opacity-60" />

            {/* Connecting Vector Line */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none">
              <path
                d="M 80 120 Q 250 40 420 120"
                fill="none"
                stroke={activeRoute === 'PRIMARY' ? '#06b6d4' : '#a855f7'}
                strokeWidth={activeRoute === 'PRIMARY' ? '3' : '2'}
                strokeDasharray={activeRoute === 'BACKUP' ? '6 6' : undefined}
                className="animate-pulse"
              />
            </svg>

            {/* Node 1: USA - New York */}
            <div className="relative z-10 flex flex-col items-center text-center space-y-1">
              <div className="w-12 h-12 rounded-full bg-blue-950 border-2 border-blue-400 flex items-center justify-center text-blue-300 shadow-lg shadow-blue-950">
                <MapPin className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold text-white">USA - New York</span>
              <span className="text-[10px] text-slate-400">Gateway Node</span>
            </div>

            {/* Node 2: Thailand - Bangkok (Core Hub) */}
            <div className="relative z-10 flex flex-col items-center text-center space-y-1">
              <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-amber-600 to-yellow-400 border-2 border-white flex items-center justify-center text-slate-950 shadow-xl shadow-amber-500/30 animate-pulse">
                <Server className="w-7 h-7" />
              </div>
              <span className="text-xs font-extrabold text-amber-300">Thailand - Bangkok</span>
              <span className="text-[10px] text-amber-200/80 font-bold">Core Data Center</span>
            </div>

            {/* Node 3: Japan - Tokyo */}
            <div className="relative z-10 flex flex-col items-center text-center space-y-1">
              <div className="w-12 h-12 rounded-full bg-cyan-950 border-2 border-cyan-400 flex items-center justify-center text-cyan-300 shadow-lg shadow-cyan-950">
                <MapPin className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold text-white">Japan - Tokyo</span>
              <span className="text-[10px] text-slate-400">Gateway Node</span>
            </div>
          </div>

          {/* Right Details Panel: รายละเอียดเส้นทาง */}
          <div className="lg:col-span-5 bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3 text-xs">
            <h4 className="font-bold text-white flex items-center gap-2 pb-2 border-b border-slate-800">
              <Globe className="w-4 h-4 text-purple-400" />
              <span>{lang === 'th' ? 'รายละเอียดเส้นทาง (Routing Architecture)' : 'Route Specifications'}</span>
            </h4>

            <div className="space-y-2.5 text-[11px]">
              <div className="p-2.5 rounded-lg bg-slate-900/90 border border-cyan-500/30">
                <div className="text-cyan-300 font-bold flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-cyan-400" />
                  <span>เส้นทางหลัก (Primary Route)</span>
                </div>
                <p className="text-slate-300 mt-1">
                  New York → Bangkok → Tokyo (ความหน่วงต่ำ Low Latency, เหมาะกับการใช้งานหลัก)
                </p>
              </div>

              <div className="p-2.5 rounded-lg bg-slate-900/90 border border-purple-500/30">
                <div className="text-purple-300 font-bold flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-purple-400" />
                  <span>เส้นทางสำรอง (Backup Route)</span>
                </div>
                <p className="text-slate-300 mt-1">
                  New York → Bangkok → Tokyo (เสถียรภาพสูง High Availability, สำรองเมื่อเส้นทางหลักมีปัญหา)
                </p>
              </div>

              <div className="flex items-center gap-2 text-emerald-400 font-bold text-[10px] pt-1">
                <Lock className="w-3.5 h-3.5" />
                <span>การเชื่อมต่อปลอดภัยด้วย Encryption และ Redundancy</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 4: การลำดับคิวการเข้าถึงบริการ : Queue & Flow */}
      <div className="bg-slate-900/95 border border-amber-500/40 rounded-2xl p-5 shadow-2xl relative overflow-hidden">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <span className="w-7 h-7 rounded-full bg-amber-950 border border-amber-400 text-amber-300 font-extrabold flex items-center justify-center text-sm shadow-md">
              4
            </span>
            <h3 className="text-lg font-bold text-white tracking-tight">
              {lang === 'th' ? 'การลำดับคิวการเข้าถึงบริการ : Queue & Flow' : 'Service Queue & Flow Pipeline'}
            </h3>
          </div>
          <button
            onClick={() => setIsQueueRunning(!isQueueRunning)}
            className="flex items-center gap-1 px-2.5 py-1 rounded bg-slate-950 border border-slate-800 text-xs font-bold text-slate-300 hover:text-white"
          >
            {isQueueRunning ? <Pause className="w-3 h-3 text-amber-400" /> : <Play className="w-3 h-3 text-emerald-400" />}
            <span>{isQueueRunning ? 'PAUSE QUEUE' : 'RESUME QUEUE'}</span>
          </button>
        </div>

        {/* Queue Pipeline Visualizer */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-4 items-center">
          <div className="lg:col-span-8 bg-slate-950 p-4 rounded-xl border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-3">
            {/* Client (ผู้ใช้งาน) */}
            <div className="flex flex-col items-center text-center space-y-1 shrink-0">
              <div className="w-12 h-12 rounded-xl bg-blue-950 border border-blue-500/40 flex items-center justify-center text-blue-300 shadow-md">
                <Radio className="w-6 h-6" />
              </div>
              <span className="text-[11px] font-bold text-white">{lang === 'th' ? 'ผู้ใช้งาน' : 'Client'}</span>
              <span className="text-[9px] text-slate-500">(Client)</span>
            </div>

            <ArrowRight className="w-4 h-4 text-slate-600 shrink-0 hidden md:block" />

            {/* FIFO Queue Array [5, 4, 3, 2, 1] */}
            <div className="flex flex-col items-center space-y-1.5 w-full max-w-xs">
              <span className="text-[10px] text-amber-400 font-bold">{lang === 'th' ? 'คิวรอ (Queue)' : 'FIFO Queue Buffer'}</span>
              <div className="flex items-center justify-center gap-1.5 p-2 bg-slate-900 rounded-lg border border-slate-800 w-full">
                {[5, 4, 3, 2, 1].map((pos) => {
                  const item = queueItems[pos - 1];
                  const isProcessing = item?.status === 'PROCESSING';
                  return (
                    <div
                      key={`queue-pos-${pos}`}
                      className={`w-9 h-9 rounded-md flex flex-col items-center justify-center font-bold text-xs transition-all ${
                        isProcessing
                          ? 'bg-amber-500 text-slate-950 ring-2 ring-amber-300 animate-pulse'
                          : 'bg-slate-800 text-slate-300 border border-slate-700'
                      }`}
                    >
                      <span>{pos}</span>
                    </div>
                  );
                })}
              </div>
              <span className="text-[9px] text-slate-500">{lang === 'th' ? 'ลำดับก่อน-หลัง (FIFO)' : 'First In First Out'}</span>
            </div>

            <ArrowRight className="w-4 h-4 text-slate-600 shrink-0 hidden md:block" />

            {/* Processing Server (ประมวลผล) */}
            <div className="flex flex-col items-center text-center space-y-1 shrink-0">
              <div className="w-12 h-12 rounded-xl bg-purple-950 border border-purple-500/40 flex items-center justify-center text-purple-300 shadow-md animate-pulse">
                <Cpu className="w-6 h-6" />
              </div>
              <span className="text-[11px] font-bold text-white">{lang === 'th' ? 'ประมวลผล' : 'Processing'}</span>
              <span className="text-[9px] text-slate-500">(Server)</span>
            </div>

            <ArrowRight className="w-4 h-4 text-slate-600 shrink-0 hidden md:block" />

            {/* Response (ดำเนินการเสร็จสิ้น) */}
            <div className="flex flex-col items-center text-center space-y-1 shrink-0">
              <div className="w-12 h-12 rounded-xl bg-emerald-950 border border-emerald-500/40 flex items-center justify-center text-emerald-300 shadow-md">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <span className="text-[11px] font-bold text-emerald-400">{lang === 'th' ? 'ดำเนินการเสร็จสิ้น' : 'Done'}</span>
              <span className="text-[9px] text-slate-500">(Response)</span>
            </div>
          </div>

          {/* Right Policies (นโยบายการจัดคิว) */}
          <div className="lg:col-span-4 bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2 text-xs">
            <h4 className="font-bold text-white pb-2 border-b border-slate-800">
              {lang === 'th' ? 'นโยบายการจัดคิว (Queue Policy)' : 'Queue Governance Policy'}
            </h4>
            <div className="space-y-2 text-[11px]">
              <div className="flex items-start gap-2 text-slate-300">
                <Clock className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white block">ลำดับก่อน-หลัง (FIFO):</strong>
                  <span>ให้บริการตามลำดับการร้องขออย่างเคร่งครัด</span>
                </div>
              </div>
              <div className="flex items-start gap-2 text-slate-300">
                <ShieldCheck className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white block">ความยุติธรรม (Fairness):</strong>
                  <span>กระจายทรัพยากรอย่างเท่าเทียมทุกคำขอ</span>
                </div>
              </div>
              <div className="flex items-start gap-2 text-slate-300">
                <Zap className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white block">ประสิทธิภาพ (Efficiency):</strong>
                  <span>ลดเวลารอ เพิ่มอัตราการตอบสนองสูงสุด</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 5: กลไกการกักกันข้อมูลตามนโยบาย : Chamber 82 / Chamber 02 Quarantine */}
      <div className="bg-slate-900/95 border border-red-500/40 rounded-2xl p-5 shadow-2xl relative overflow-hidden">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <span className="w-7 h-7 rounded-full bg-red-950 border border-red-400 text-red-300 font-extrabold flex items-center justify-center text-sm shadow-md">
              5
            </span>
            <h3 className="text-lg font-bold text-white tracking-tight">
              {lang === 'th' ? 'กลไกการกักกันข้อมูลตามนโยบาย : Chamber Quarantine Escrow' : 'Policy-Enforced Quarantine Escrow Mechanism'}
            </h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleTestPacket('SAFE')}
              disabled={isInspecting}
              className="px-2.5 py-1 rounded bg-emerald-950 text-emerald-300 border border-emerald-500/40 text-xs font-bold hover:bg-emerald-900 disabled:opacity-50"
            >
              ทดสอบแพ็กเกจปลอดภัย
            </button>
            <button
              onClick={() => handleTestPacket('MALICIOUS')}
              disabled={isInspecting}
              className="px-2.5 py-1 rounded bg-red-950 text-red-300 border border-red-500/40 text-xs font-bold hover:bg-red-900 disabled:opacity-50"
            >
              ทดสอบความเสี่ยง (Quarantine)
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-4 items-center">
          {/* Inspection Pipeline Visual Flow */}
          <div className="lg:col-span-8 bg-slate-950 p-4 rounded-xl border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-3">
            {/* Step 1: แหล่งข้อมูล (Source) */}
            <div className={`flex flex-col items-center text-center space-y-1 p-2 rounded-lg transition-all ${pipelineStep === 1 ? 'bg-cyan-950/80 ring-2 ring-cyan-400' : ''}`}>
              <div className="w-11 h-11 rounded-lg bg-blue-950 border border-blue-500 flex items-center justify-center text-blue-300">
                <Radio className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-bold text-white">{lang === 'th' ? 'แหล่งข้อมูล' : 'Source'}</span>
              <span className="text-[9px] text-slate-500">(Source)</span>
            </div>

            <ArrowRight className="w-3.5 h-3.5 text-slate-600 shrink-0 hidden md:block" />

            {/* Step 2: Firewall (ตรวจสอบและกรอง) */}
            <div className={`flex flex-col items-center text-center space-y-1 p-2 rounded-lg transition-all ${pipelineStep === 2 ? 'bg-blue-950/80 ring-2 ring-blue-400' : ''}`}>
              <div className="w-11 h-11 rounded-lg bg-slate-900 border border-cyan-500/50 flex items-center justify-center text-cyan-300">
                <Filter className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-bold text-white">Firewall</span>
              <span className="text-[9px] text-slate-500">{lang === 'th' ? 'ตรวจสอบและกรอง' : 'Filter'}</span>
            </div>

            <ArrowRight className="w-3.5 h-3.5 text-slate-600 shrink-0 hidden md:block" />

            {/* Step 3: Chamber 82/02 Quarantine Zone */}
            <div className={`flex flex-col items-center text-center space-y-1 p-2 rounded-lg transition-all ${pipelineStep === 3 ? 'bg-amber-950/80 ring-2 ring-amber-400 animate-pulse' : ''}`}>
              <div className="w-11 h-11 rounded-lg bg-amber-950 border border-amber-500 flex items-center justify-center text-amber-300">
                <Lock className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-bold text-amber-300">Chamber Quarantine</span>
              <span className="text-[9px] text-amber-400/80">{lang === 'th' ? 'กักกัน / ตรวจสอบ' : 'Isolation & Inspection'}</span>
            </div>

            <ArrowRight className="w-3.5 h-3.5 text-slate-600 shrink-0 hidden md:block" />

            {/* Step 4 & 5: Allow vs Discard Output Branch */}
            <div className="flex flex-col gap-2">
              <div className={`flex items-center gap-2 p-1.5 rounded bg-slate-900 border ${pipelineStep === 4 ? 'border-emerald-400 bg-emerald-950 text-emerald-300' : 'border-slate-800 text-slate-400'}`}>
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span className="text-[10px] font-bold">{lang === 'th' ? 'ปลายทางที่ปลอดภัย' : 'Secure Destination'}</span>
              </div>
              <div className={`flex items-center gap-2 p-1.5 rounded bg-slate-900 border ${pipelineStep === 5 ? 'border-red-400 bg-red-950 text-red-300' : 'border-slate-800 text-slate-400'}`}>
                <Trash2 className="w-4 h-4 text-red-400" />
                <span className="text-[10px] font-bold">{lang === 'th' ? 'ลบถังขยะหากไม่ผ่าน' : 'Discard if Violation'}</span>
              </div>
            </div>
          </div>

          {/* Right Rules (หลักการทำงาน) */}
          <div className="lg:col-span-4 bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2.5 text-xs">
            <h4 className="font-bold text-white pb-2 border-b border-slate-800">
              {lang === 'th' ? 'หลักการทำงาน (Operational Principles)' : 'Quarantine Principles'}
            </h4>
            <div className="space-y-1.5 text-[11px]">
              <div className="flex items-start gap-1.5 text-slate-300">
                <span className="text-cyan-400 font-bold">🔍 ตรวจสอบ (Inspect):</span>
                <span>ตรวจจับไวรัส มัลแวร์ และความเสี่ยง</span>
              </div>
              <div className="flex items-start gap-1.5 text-slate-300">
                <span className="text-amber-400 font-bold">🔒 กักกัน (Isolate):</span>
                <span>แยกข้อมูลไว้ในพื้นที่ปลอดภัย</span>
              </div>
              <div className="flex items-start gap-1.5 text-slate-300">
                <span className="text-purple-400 font-bold">🛡️ ประเมินนโยบาย:</span>
                <span>ตรวจสอบตามกฎความปลอดภัยที่กำหนด</span>
              </div>
              <div className="flex items-start gap-1.5 text-slate-300">
                <span className="text-emerald-400 font-bold">✅ อนุญาต/กำจัด:</span>
                <span>อนุญาตให้ใช้งาน หรือลบหากไม่ผ่าน</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* BOTTOM FOOTER PILLARS (ความปลอดภัย | ประสิทธิภาพ | ความน่าเชื่อถือ) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
        <div className="bg-slate-900/90 border border-cyan-500/40 p-3.5 rounded-xl text-center space-y-1">
          <div className="flex items-center justify-center gap-1.5 text-cyan-300 font-bold text-xs">
            <ShieldCheck className="w-4 h-4 text-cyan-400" />
            <span>ความปลอดภัย (Security)</span>
          </div>
          <p className="text-[11px] text-slate-400">ออกแบบเพื่ออนาคต (Post-Quantum Ready)</p>
        </div>

        <div className="bg-slate-900/90 border border-emerald-500/40 p-3.5 rounded-xl text-center space-y-1">
          <div className="flex items-center justify-center gap-1.5 text-emerald-300 font-bold text-xs">
            <Zap className="w-4 h-4 text-emerald-400" />
            <span>ประสิทธิภาพ (Performance)</span>
          </div>
          <p className="text-[11px] text-slate-400">เชื่อมต่อไร้ขีดจำกัด (Zero Latency Routing)</p>
        </div>

        <div className="bg-slate-900/90 border border-purple-500/40 p-3.5 rounded-xl text-center space-y-1">
          <div className="flex items-center justify-center gap-1.5 text-purple-300 font-bold text-xs">
            <Clock className="w-4 h-4 text-purple-400" />
            <span>ความน่าเชื่อถือ (Reliability)</span>
          </div>
          <p className="text-[11px] text-slate-400">พร้อมใช้งาน 24/7 (High Availability)</p>
        </div>
      </div>
    </div>
  );
};
