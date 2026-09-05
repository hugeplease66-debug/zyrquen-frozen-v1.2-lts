'use client';

import React, { useState, useEffect } from 'react';
import { 
  Flame, 
  Activity, 
  Boxes, 
  Gauge, 
  Sparkles, 
  Zap, 
  Radio, 
  ShieldCheck 
} from 'lucide-react';

interface QuantumHeatNode {
  id: string;
  name: string;
  location: string;
  zone: string;
  temp: number; // in mK (e.g. 14.8 to 15.6)
  entropy: number; // 0.001 to 0.009
  coherence: number; // 99.98 to 99.999
  qops: number; // 820 to 890
  qkdRate: string;
  status: 'OPTIMAL' | 'COOLED' | 'FLUX_BALANCED';
}

const HEAT_NODES: QuantumHeatNode[] = [
  { id: "NODE-BK01", name: "Bangkok Primary Gateway", location: "Bangkok (กทม.)", zone: "Zone 1 (Core)", temp: 14.92, entropy: 0.0018, coherence: 99.994, qops: 864.2, qkdRate: "128.4 kbps", status: "OPTIMAL" },
  { id: "NODE-LD06", name: "London Sub-Kelvin Hub", location: "London (UK)", zone: "Zone 1 (Core)", temp: 15.08, entropy: 0.0024, coherence: 99.991, qops: 849.5, qkdRate: "119.2 kbps", status: "COOLED" },
  { id: "NODE-TK03", name: "Tokyo Superconducting Ring", location: "Tokyo (Japan)", zone: "Zone 2 (Pacific)", temp: 14.88, entropy: 0.0015, coherence: 99.996, qops: 878.1, qkdRate: "134.8 kbps", status: "OPTIMAL" },
  { id: "NODE-GV02", name: "Geneva Cryogenic Enclave", location: "Geneva (Switzerland)", zone: "Zone 2 (Alpine)", temp: 15.02, entropy: 0.0021, coherence: 99.993, qops: 855.0, qkdRate: "122.5 kbps", status: "COOLED" },
  { id: "NODE-SG04", name: "Singapore Equator Relay", location: "Singapore", zone: "Zone 3 (ASEAN)", temp: 14.95, entropy: 0.0019, coherence: 99.995, qops: 869.4, qkdRate: "130.1 kbps", status: "OPTIMAL" },
  { id: "NODE-NY05", name: "New York Atlantic Bridge", location: "New York (USA)", zone: "Zone 3 (Atlantic)", temp: 15.14, entropy: 0.0028, coherence: 99.989, qops: 841.8, qkdRate: "115.6 kbps", status: "FLUX_BALANCED" },
  { id: "NODE-Ω601", name: "Alpha Deep-Space Relay", location: "Lagrange Point L2", zone: "Zone 4 (Orbit)", temp: 14.78, entropy: 0.0011, coherence: 99.998, qops: 885.6, qkdRate: "142.0 kbps", status: "OPTIMAL" },
  { id: "NODE-Ω840", name: "Cosmic Warp Anchor IX", location: "Lunar Orbit Relay", zone: "Zone 5 (Cosmic)", temp: 14.82, entropy: 0.0013, coherence: 99.997, qops: 880.2, qkdRate: "138.5 kbps", status: "OPTIMAL" }
];

export default function SpatialEntropyHeatMap() {
  const [nodes, setNodes] = useState<QuantumHeatNode[]>(HEAT_NODES);
  const [selectedNode, setSelectedNode] = useState<QuantumHeatNode>(HEAT_NODES[0]);
  const [ticker, setTicker] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setTicker(t => t + 1);
      setNodes(prev => prev.map(n => {
        const deltaTemp = (Math.sin(n.temp * 10 + Date.now() * 0.001) * 0.04);
        const deltaEntropy = (Math.cos(n.entropy * 100 + Date.now() * 0.002) * 0.0002);
        return {
          ...n,
          temp: parseFloat((14.9 + Math.abs(deltaTemp)).toFixed(2)),
          entropy: parseFloat((0.002 + Math.abs(deltaEntropy)).toFixed(4)),
        };
      }));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full bg-[#081122]/95 border border-cyan-500/40 rounded-2xl p-5 backdrop-blur-2xl shadow-2xl space-y-4 quantum-cyan-glow">
      
      {/* HEADER */}
      <div className="flex flex-wrap justify-between items-center gap-3 border-b border-slate-800 pb-3">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-cyan-500/15 border border-cyan-400/50 text-cyan-300">
            <Flame className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-cyan-400 font-bold font-mono tracking-widest uppercase bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/30">
                2D TOPOLOGICAL ENTROPY MAP
              </span>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-mono text-[9px] font-bold">
                SUB-KELVIN PRECISION
              </span>
            </div>
            <h3 className="text-base sm:text-lg font-bold text-white font-mono text-cyan-gradient">
              Spatial Entropy & Hardware Node Heat Map
            </h3>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono">
          <span className="px-3 py-1 bg-slate-900 border border-slate-800 rounded-xl text-slate-400">
            Aggregate Entropy: <strong className="text-emerald-300 font-bold">0.0019 ΔS</strong>
          </span>
        </div>
      </div>

      {/* 2D HEAT GRID TILES */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono text-xs">
        {nodes.map((node) => {
          const isSelected = selectedNode.id === node.id;
          // Calculate heat color gradient (lower temp = deeper cyan/blue, slightly higher temp = warmer cyan/purple)
          const heatRatio = Math.min(1, Math.max(0, (node.temp - 14.7) / 0.6));

          return (
            <div
              key={node.id}
              onClick={() => setSelectedNode(node)}
              className={`p-3.5 rounded-xl border cursor-pointer transition-all duration-200 relative overflow-hidden ${
                isSelected
                  ? 'bg-gradient-to-br from-[#0c2242] via-[#091b35] to-[#040d1a] border-cyan-400 text-white quantum-cyan-glow scale-[1.02]'
                  : 'bg-black/60 border-slate-800/80 text-slate-300 hover:border-cyan-500/40 hover:bg-[#071325]'
              }`}
            >
              {/* Thermal Heat Bar at Top */}
              <div 
                className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#67E8F9] via-[#38BDF8] to-[#C084FC]"
                style={{ opacity: 0.4 + heatRatio * 0.6 }}
              />

              <div className="flex justify-between items-center text-[10px] mb-1">
                <span className="text-cyan-400 font-bold">{node.id}</span>
                <span className="text-emerald-400 font-bold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                  {node.status}
                </span>
              </div>

              <div className="font-bold text-white text-xs truncate">{node.location}</div>
              <div className="text-[10px] text-slate-400 font-sans mt-0.5 truncate">{node.zone}</div>

              <div className="mt-2.5 pt-2 border-t border-slate-800/80 flex justify-between items-center text-[10px]">
                <span className="text-slate-400">Cryo Temp:</span>
                <span className="text-cyan-300 font-bold">{node.temp} mK</span>
              </div>

              <div className="flex justify-between items-center text-[10px]">
                <span className="text-slate-400">Entropy ΔS:</span>
                <span className="text-amber-300 font-bold">{node.entropy}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* SELECTED NODE TELEMETRY INSPECTOR */}
      <div className="p-4 rounded-xl bg-gradient-to-r from-slate-950 via-[#071426] to-slate-950 border border-cyan-500/30 flex flex-wrap items-center justify-between gap-4 font-mono text-xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-400/50 flex items-center justify-center font-bold text-cyan-300">
            <Boxes className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-white font-bold">{selectedNode.name}</span>
              <span className="px-2 py-0.2 rounded bg-cyan-500/20 text-cyan-300 text-[10px] font-bold">
                {selectedNode.location}
              </span>
            </div>
            <div className="text-[11px] text-slate-400 font-sans">
              QKD Laser Photon Key Rate: <strong className="text-cyan-300">{selectedNode.qkdRate}</strong> • Coherence: <strong className="text-emerald-400">{selectedNode.coherence}%</strong>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 text-[11px]">
          <div className="p-2 rounded-lg bg-black/60 border border-slate-800">
            <span className="text-slate-400 block text-[9px]">QOPS THROUGHPUT</span>
            <span className="text-cyan-300 font-bold">{selectedNode.qops} q/s</span>
          </div>
          <div className="p-2 rounded-lg bg-black/60 border border-slate-800">
            <span className="text-slate-400 block text-[9px]">CRYO DISSIPATION</span>
            <span className="text-emerald-400 font-bold">{selectedNode.temp} mK</span>
          </div>
        </div>
      </div>

    </div>
  );
}
