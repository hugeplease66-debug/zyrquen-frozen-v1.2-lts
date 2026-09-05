import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text, Float, Sphere, Line } from '@react-three/drei';
import * as THREE from 'three';
import { 
  Activity, 
  ShieldCheck, 
  Zap, 
  Flame, 
  Radio, 
  RefreshCw, 
  AlertTriangle, 
  Cpu, 
  CheckCircle2, 
  Sliders, 
  Sparkles, 
  Layers, 
  Play, 
  RotateCcw, 
  Volume2, 
  VolumeX,
  Lock,
  Globe
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  LineChart, 
  Line as RechartsLine 
} from 'recharts';
import { soundEngine } from '../../utils/audioSynth';
import { SYSTEM_METADATA, SOVEREIGN_PRINCIPAL } from '../../data/canonicalData';

interface ChamberProps {
  lang: 'th' | 'en';
}

type SimulationScenario = 'STABLE' | 'CRASH' | 'SPIKE' | 'DRIFT' | 'SOLAR_FLARE';

interface SwarmAgent {
  id: string;
  nameTh: string;
  nameEn: string;
  role: string;
  status: 'ACTIVE' | 'BOOSTED' | 'STANDBY';
  color: string;
}

interface LogEntry {
  id: string;
  timestamp: string;
  level: 'INFO' | 'WARN' | 'CRITICAL' | 'SUCCESS';
  messageTh: string;
  messageEn: string;
}

// 3D Particle Cloud Component with Dynamic Stability Physics
const CosmicParticleField: React.FC<{
  stabilityPct: number;
  scenario: SimulationScenario;
}> = ({ stabilityPct, scenario }) => {
  const pointsRef = useRef<THREE.Points>(null);
  const particleCount = 1200;

  const [positions, colors] = useMemo(() => {
    const pos = new Float32Array(particleCount * 3);
    const col = new Float32Array(particleCount * 3);

    const baseColor = new THREE.Color(0x06b6d4); // Cyan
    const highlightColor = new THREE.Color(0x8b5cf6); // Purple
    const goldColor = new THREE.Color(0xf59e0b); // Amber

    for (let i = 0; i < particleCount; i++) {
      // Create orbital spiral distribution
      const radius = 2 + Math.random() * 8;
      const theta = Math.random() * Math.PI * 2;
      const phi = (Math.random() - 0.5) * Math.PI * 0.7;

      pos[i * 3] = radius * Math.cos(theta) * Math.cos(phi);
      pos[i * 3 + 1] = radius * Math.sin(phi) * 0.7 + (Math.random() - 0.5) * 0.8;
      pos[i * 3 + 2] = radius * Math.sin(theta) * Math.cos(phi);

      const mixed = baseColor.clone();
      if (i % 3 === 0) mixed.lerp(highlightColor, Math.random());
      if (i % 5 === 0) mixed.lerp(goldColor, Math.random());

      col[i * 3] = mixed.r;
      col[i * 3 + 1] = mixed.g;
      col[i * 3 + 2] = mixed.b;
    }
    return [pos, col];
  }, []);

  useFrame(({ clock }) => {
    if (pointsRef.current) {
      const speedMultiplier = scenario === 'SPIKE' ? 3.5 : scenario === 'CRASH' ? 0.2 : scenario === 'SOLAR_FLARE' ? 4.0 : 1.0;
      pointsRef.current.rotation.y = clock.getElapsedTime() * 0.08 * speedMultiplier;
      pointsRef.current.rotation.x = Math.sin(clock.getElapsedTime() * 0.04) * 0.15;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
        <bufferAttribute
          attach="attributes-color"
          args={[colors, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.065}
        vertexColors
        transparent
        opacity={stabilityPct > 70 ? 0.85 : 0.45}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
};

// 3D Orbital Constellation Node (from ERA Ω PORTAL Image)
interface ConstellationNodeProps {
  position: [number, number, number];
  color: string;
  label: string;
  sublabel: string;
  stabilityPct: number;
}

const ConstellationNode: React.FC<ConstellationNodeProps> = ({
  position,
  color,
  label,
  sublabel,
  stabilityPct
}) => {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (meshRef.current) {
      const pulseSpeed = stabilityPct > 80 ? 2 : 5;
      const scale = 1 + Math.sin(clock.getElapsedTime() * pulseSpeed) * 0.08;
      meshRef.current.scale.setScalar(scale);
    }
  });

  return (
    <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.6}>
      <group position={position}>
        {/* Core Glowing Sphere */}
        <Sphere ref={meshRef} args={[0.45, 24, 24]}>
          <meshStandardMaterial
            color={color}
            emissive={color}
            emissiveIntensity={stabilityPct > 80 ? 1.2 : 2.0}
            roughness={0.2}
          />
        </Sphere>

        {/* Outer Wireframe Shield */}
        <Sphere args={[0.62, 16, 16]}>
          <meshBasicMaterial
            color={color}
            wireframe
            transparent
            opacity={0.35}
          />
        </Sphere>

        {/* Floating Text Labels */}
        <Text
          position={[0, 0.9, 0]}
          fontSize={0.28}
          color="#ffffff"
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.03}
          outlineColor="#000000"
        >
          {label}
        </Text>
        <Text
          position={[0, 0.65, 0]}
          fontSize={0.15}
          color="#94a3b8"
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.02}
          outlineColor="#000000"
        >
          {sublabel}
        </Text>
      </group>
    </Float>
  );
};

// 3D Beam Line
const QuantumBeam: React.FC<{
  start: [number, number, number];
  end: [number, number, number];
  color: string;
  opacity?: number;
}> = ({ start, end, color, opacity = 0.6 }) => {
  return (
    <Line
      points={[start, end]}
      color={color}
      lineWidth={2.5}
      transparent
      opacity={opacity}
    />
  );
};

export const Chamber04Simulator: React.FC<ChamberProps> = ({ lang }) => {
  // State for Simulator Dynamics
  const [scenario, setScenario] = useState<SimulationScenario>('STABLE');
  const [resiliencePct, setResiliencePct] = useState<number>(97.0);
  const [coreIntegrityPct, setCoreIntegrityPct] = useState<number>(99.8);
  const [fuelBurnMW, setFuelBurnMW] = useState<number>(37.93);
  const [quantumTimestamp, setQuantumTimestamp] = useState<string>('27304892.12');
  const [isMuted, setIsMuted] = useState<boolean>(false);

  // Swarm Agents
  const [swarmAgents, setSwarmAgents] = useState<SwarmAgent[]>([
    { id: 'guardian', nameTh: 'ผู้พิทักษ์ (Guardian)', nameEn: 'Guardian L4', role: 'FIPS 140-3 Boundary', status: 'ACTIVE', color: 'border-cyan-500 text-cyan-300' },
    { id: 'guardliner', nameTh: 'ตัวกรองควอนตัม (Guardliner)', nameEn: 'Guardliner PQC', role: 'Dilithium-5 Filter', status: 'ACTIVE', color: 'border-purple-500 text-purple-300' },
    { id: 'balancer', nameTh: 'ตัวถ่วงดุล (Balancer I)', nameEn: 'Balancer I', role: '12% Nominal Load', status: 'ACTIVE', color: 'border-emerald-500 text-emerald-300' },
    { id: 'balancer2', nameTh: 'ตัวถ่วงดุลความร้อน (Balancer II)', nameEn: 'Balancer II', role: '14.98 mK Superfluid', status: 'ACTIVE', color: 'border-teal-500 text-teal-300' },
    { id: 'recovery', nameTh: 'กู้คืนฉุกเฉิน (Recovery)', nameEn: 'Phoenix Recovery', role: '142ms SLA Enforcement', status: 'ACTIVE', color: 'border-blue-500 text-blue-300' },
    { id: 'coordinator', nameTh: 'ผู้ประสานงาน (Coordinator)', nameEn: 'Coordinator Hub', role: '10/10 Deca-Key Mesh', status: 'BOOSTED', color: 'border-amber-500 text-amber-300' },
  ]);

  // Telemetry graph stream
  const [telemetryStream, setTelemetryStream] = useState<Array<{ time: string; freq: number; burn: number; temp: number }>>([
    { time: 'T-10', freq: 99.8, burn: 37.9, temp: 14.98 },
    { time: 'T-8', freq: 99.9, burn: 37.93, temp: 14.98 },
    { time: 'T-6', freq: 99.7, burn: 37.92, temp: 14.97 },
    { time: 'T-4', freq: 99.8, burn: 37.94, temp: 14.98 },
    { time: 'T-2', freq: 99.9, burn: 37.93, temp: 14.98 },
    { time: 'NOW', freq: 99.8, burn: 37.93, temp: 14.98 },
  ]);

  // Unified Terminal Logs
  const [logs, setLogs] = useState<LogEntry[]>([
    { id: 'l1', timestamp: '27304892.12', level: 'SUCCESS', messageTh: 'การซิงโครไนซ์สถานะควอนตัมเสถียร (Zero Drift Δ0.0%)', messageEn: 'Synchronization Stable (Zero Drift Δ0.0%)' },
    { id: 'l2', timestamp: '27304890.78', level: 'INFO', messageTh: 'สตรีมโทรมาตรแบบเรียลไทม์เชื่อมโยงกับ Chamber 04 สมบูรณ์', messageEn: 'Telemetry Stream Active and linked to Chamber 04' },
    { id: 'l3', timestamp: '27304889.65', level: 'INFO', messageTh: 'อัปเดตเมทริกซ์ความน่าเชื่อถือ 99.8% (14,902 ซีล)', messageEn: 'Trust Matrix Update 99.8% (14,902 Seals Canonical)' },
    { id: 'l4', timestamp: '27304887.22', level: 'SUCCESS', messageTh: 'อัตราการเผาไหม้ปฏิสสารคงที่ 37.93 MW (12% Load Nominal)', messageEn: 'Antimatter core burn stabilized at 37.93 MW (12% Load)' },
  ]);

  // Periodic Ticker for live telemetry simulation
  useEffect(() => {
    const interval = setInterval(() => {
      const nowQT = (27304890 + Math.random() * 10).toFixed(2);
      setQuantumTimestamp(nowQT);

      // Random gentle perturbation when STABLE
      if (scenario === 'STABLE') {
        const jitterBurn = +(37.93 + (Math.random() - 0.5) * 0.05).toFixed(2);
        const jitterResilience = +(97.0 + (Math.random() - 0.5) * 0.4).toFixed(1);
        const jitterIntegrity = +(99.8 + (Math.random() - 0.5) * 0.1).toFixed(1);

        setFuelBurnMW(jitterBurn);
        setResiliencePct(jitterResilience);
        setCoreIntegrityPct(jitterIntegrity);

        setTelemetryStream(prev => {
          const next = [...prev.slice(1), {
            time: new Date().toLocaleTimeString().slice(3, 8),
            freq: jitterIntegrity,
            burn: jitterBurn,
            temp: 14.98
          }];
          return next;
        });
      }
    }, 2500);

    return () => clearInterval(interval);
  }, [scenario]);

  // Handle Scenario Switch
  const triggerScenario = (newScenario: SimulationScenario) => {
    setScenario(newScenario);
    const qt = (27304890 + Math.random() * 10).toFixed(2);

    if (newScenario === 'STABLE') {
      soundEngine.playQuantumPing();
      setResiliencePct(97.0);
      setCoreIntegrityPct(99.8);
      setFuelBurnMW(37.93);
      setLogs(prev => [
        {
          id: Date.now().toString(),
          timestamp: qt,
          level: 'SUCCESS',
          messageTh: 'ฟื้นฟูระนาบความเสถียรแคนอนิคัล Δ0.00% สมบูรณ์แบบ 100%',
          messageEn: 'Restored canonical stability plane Δ0.00% completely.'
        },
        ...prev.slice(0, 8)
      ]);
    } else if (newScenario === 'CRASH') {
      soundEngine.playSirenSound();
      setResiliencePct(64.2);
      setCoreIntegrityPct(88.5);
      setFuelBurnMW(18.4);
      setLogs(prev => [
        {
          id: Date.now().toString(),
          timestamp: qt,
          level: 'CRITICAL',
          messageTh: 'ตรวจพบการจำลอง CRASH SCENARIO: ระบบเปิดม่านกักกัน Fail-Closed 85°C อัตโนมัติ',
          messageEn: 'CRASH SCENARIO Simulated: Triggered Fail-Closed 85°C Quarantine Shield.'
        },
        ...prev.slice(0, 8)
      ]);
    } else if (newScenario === 'SPIKE') {
      soundEngine.playQuantumPing();
      setResiliencePct(89.5);
      setCoreIntegrityPct(96.2);
      setFuelBurnMW(113.79);
      setLogs(prev => [
        {
          id: Date.now().toString(),
          timestamp: qt,
          level: 'WARN',
          messageTh: 'ตรวจพบ SPIKE EVENT: โหลดปฏิสสารพุ่งสู่ 113.79 MW ตัวถ่วงดุล Balancer II ทำงานชดเชย',
          messageEn: 'SPIKE EVENT: Load surged to 113.79 MW. Balancer II absorbing energy peak.'
        },
        ...prev.slice(0, 8)
      ]);
    } else if (newScenario === 'DRIFT') {
      soundEngine.playSirenSound();
      setResiliencePct(78.0);
      setCoreIntegrityPct(91.4);
      setFuelBurnMW(44.2);
      setLogs(prev => [
        {
          id: Date.now().toString(),
          timestamp: qt,
          level: 'WARN',
          messageTh: 'ตรวจพบ DRIFT ANALYSIS: จำลองส่วนต่างแฮช SSoT ถูกบล็อกโดย Merkle Root 909ab814...',
          messageEn: 'DRIFT ANALYSIS: Non-canonical hash drift intercepted by Merkle Invariant.'
        },
        ...prev.slice(0, 8)
      ]);
    } else if (newScenario === 'SOLAR_FLARE') {
      soundEngine.playSirenSound();
      setResiliencePct(82.4);
      setCoreIntegrityPct(94.0);
      setFuelBurnMW(55.6);
      setLogs(prev => [
        {
          id: Date.now().toString(),
          timestamp: qt,
          level: 'CRITICAL',
          messageTh: 'จำลองพายุสุริยะ (Solar Flare): สลับสัญญาณ Cryo Faraday Shield ป้องกันควอนตัม 0.14 mK',
          messageEn: 'Solar Flare Simulated: Faraday Cryo Shield isolated quantum registers at 0.14 mK.'
        },
        ...prev.slice(0, 8)
      ]);
    }
  };

  // Toggle Swarm Agent State
  const toggleSwarmAgent = (id: string) => {
    soundEngine.playQuantumPing();
    setSwarmAgents(prev => prev.map(ag => {
      if (ag.id === id) {
        const nextStatus = ag.status === 'ACTIVE' ? 'BOOSTED' : ag.status === 'BOOSTED' ? 'STANDBY' : 'ACTIVE';
        return { ...ag, status: nextStatus };
      }
      return ag;
    }));
  };

  // 5 Constellation Nodes coordinates (Pentagon + Center from Image 1)
  const nodePositions = useMemo<{
    eriq: [number, number, number];
    hub: [number, number, number];
    runtime: [number, number, number];
    portal: [number, number, number];
    engine: [number, number, number];
  }>(() => ({
    eriq: [0, 2.8, 0], // Apex Zenith
    hub: [-3.4, 0.8, 1.2], // Left Upper
    runtime: [3.4, 0.8, 1.2], // Right Upper
    portal: [-2.2, -1.8, 1.5], // Left Lower
    engine: [0, -0.6, 0.8], // Central Core
  }), []);

  return (
    <div className="space-y-6 font-mono-code">
      {/* 1. TOP HEADER: ERA Ω PORTAL - UNIFIED MULTIVERSE INTELLIGENCE */}
      <div className="bg-slate-950 border border-cyan-500/40 rounded-2xl p-6 shadow-2xl relative overflow-hidden space-y-4">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-cyan-900/60 pb-4 relative z-10">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-cyan-950 border border-cyan-500/50 text-cyan-300 text-xs font-bold flex items-center gap-1.5">
                <Flame className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
                CHAMBER 04 SIMULATOR
              </span>
              <span className="px-2.5 py-0.5 rounded bg-purple-950 border border-purple-500/40 text-purple-300 text-[11px] font-bold">
                ERA Ω PORTAL
              </span>
              <span className="px-2 py-0.5 rounded bg-emerald-950 border border-emerald-500/40 text-emerald-300 text-[11px] font-bold">
                FROZEN v1.2 LTS
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-wide font-display">
              ERA Ω PORTAL : UNIFIED MULTIVERSE INTELLIGENCE
            </h1>
            <p className="text-xs text-slate-400">
              {lang === 'th'
                ? 'ระบบจำลองเสถียรภาพสนามอนุภาค 3 มิติ และควบคุมอัตราเผาไหม้ปฏิสสาร 37.93 MW (Real-Time System Stability Particle Matrix)'
                : '3D Particle Field Stability Simulator & 37.93 MW Antimatter Core Matrix Engine'}
            </p>
          </div>

          {/* Top Telemetry Badges */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="bg-slate-900/90 px-3.5 py-2 rounded-xl border border-cyan-500/30 text-right">
              <span className="text-[10px] text-slate-400 block font-mono">Quantum Timestamp</span>
              <span className="text-xs font-bold text-cyan-300 flex items-center justify-end gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
                QT: {quantumTimestamp}
              </span>
            </div>

            <div className="bg-slate-900/90 px-3.5 py-2 rounded-xl border border-emerald-500/30 text-right">
              <span className="text-[10px] text-slate-400 block font-mono">RESILIENCE</span>
              <span className={`text-sm font-bold ${resiliencePct > 85 ? 'text-emerald-400' : 'text-amber-400'}`}>
                {resiliencePct}%
              </span>
            </div>

            <div className="bg-slate-900/90 px-3.5 py-2 rounded-xl border border-purple-500/30 text-right">
              <span className="text-[10px] text-slate-400 block font-mono">CORE INTEGRITY</span>
              <span className={`text-sm font-bold ${coreIntegrityPct > 95 ? 'text-purple-300' : 'text-red-400'}`}>
                {coreIntegrityPct}%
              </span>
            </div>

            <button
              onClick={() => soundEngine.playMooSound()}
              className="px-3 py-2 rounded-xl bg-slate-900 border border-amber-500/40 text-amber-300 text-xs font-bold hover:bg-slate-800 transition-all shadow-md"
              title="Sovereign Moo"
            >
              Moo 🐃
            </button>
          </div>
        </div>

        {/* 2. MAIN 3D COSMIC PARTICLE & CONSTELLATION STAGE */}
        <div className="w-full h-[460px] rounded-2xl overflow-hidden cursor-move bg-slate-950 border border-cyan-500/30 relative shadow-inner">
          <Canvas camera={{ position: [0, 2, 9], fov: 48 }}>
            <ambientLight intensity={0.5} />
            <pointLight position={[10, 15, 10]} intensity={1.8} />
            <pointLight position={[-10, -10, -10]} color="#8b5cf6" intensity={1.2} />
            <pointLight position={[0, 0, 5]} color="#06b6d4" intensity={1.0} />

            <OrbitControls
              enableZoom={true}
              enableRotate={true}
              autoRotate={true}
              autoRotateSpeed={scenario === 'STABLE' ? 0.6 : 2.5}
              maxDistance={15}
              minDistance={4}
            />

            {/* Dynamic 3D Particle Cloud */}
            <CosmicParticleField stabilityPct={coreIntegrityPct} scenario={scenario} />

            {/* 5 Constellation Sacred Nodes */}
            <ConstellationNode
              position={nodePositions.eriq}
              color="#06b6d4"
              label="ERIQ"
              sublabel="SSoT Zenith"
              stabilityPct={coreIntegrityPct}
            />
            <ConstellationNode
              position={nodePositions.hub}
              color="#38bdf8"
              label="HUB"
              sublabel="10/10 HSM Quorum"
              stabilityPct={coreIntegrityPct}
            />
            <ConstellationNode
              position={nodePositions.runtime}
              color="#f59e0b"
              label="RUNTIME"
              sublabel="37.93 MW Burn"
              stabilityPct={coreIntegrityPct}
            />
            <ConstellationNode
              position={nodePositions.portal}
              color="#3b82f6"
              label="PORTAL"
              sublabel="Quantum Sync"
              stabilityPct={coreIntegrityPct}
            />
            <ConstellationNode
              position={nodePositions.engine}
              color="#a855f7"
              label="ENGINE"
              sublabel="Sovereign Core"
              stabilityPct={coreIntegrityPct}
            />

            {/* Beams from Central Engine to Outer Nodes */}
            <QuantumBeam start={nodePositions.engine} end={nodePositions.eriq} color="#06b6d4" />
            <QuantumBeam start={nodePositions.engine} end={nodePositions.hub} color="#38bdf8" />
            <QuantumBeam start={nodePositions.engine} end={nodePositions.runtime} color="#f59e0b" />
            <QuantumBeam start={nodePositions.engine} end={nodePositions.portal} color="#3b82f6" />

            {/* Outer Ring Pentagonal Beams */}
            <QuantumBeam start={nodePositions.eriq} end={nodePositions.hub} color="#06b6d4" opacity={0.4} />
            <QuantumBeam start={nodePositions.hub} end={nodePositions.portal} color="#38bdf8" opacity={0.4} />
            <QuantumBeam start={nodePositions.portal} end={nodePositions.engine} color="#3b82f6" opacity={0.4} />
            <QuantumBeam start={nodePositions.eriq} end={nodePositions.runtime} color="#f59e0b" opacity={0.4} />
            <QuantumBeam start={nodePositions.runtime} end={nodePositions.engine} color="#f59e0b" opacity={0.4} />

            {/* Cosmic Polar Floor Grid */}
            <gridHelper args={[24, 24, '#06b6d4', '#1e1b4b']} position={[0, -3.2, 0]} />
          </Canvas>

          {/* Floating HUD Badges on Canvas */}
          <div className="absolute top-4 left-4 flex flex-col gap-2 pointer-events-none">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-950/80 border border-cyan-500/50 text-xs text-cyan-300 backdrop-blur-md">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
              <span>3D PARTICLE STABILITY FIELD: {scenario}</span>
            </div>
            <div className="px-3 py-1 rounded bg-slate-950/80 border border-purple-500/40 text-[10px] text-purple-300 font-mono backdrop-blur-md">
              CAMERA: ORBIT CONTROLS ACTIVE (DRAG TO ROTATE / SCROLL TO ZOOM)
            </div>
          </div>

          <div className="absolute top-4 right-4 pointer-events-none">
            <div className="px-3 py-1.5 rounded-lg bg-slate-950/80 border border-amber-500/50 text-xs font-bold text-amber-300 backdrop-blur-md flex items-center gap-1.5">
              <Flame className="w-3.5 h-3.5 text-amber-400" />
              <span>ANTIMATTER BURN: {fuelBurnMW} MW (12% NOMINAL)</span>
            </div>
          </div>

          {/* Central Bottom Quantum Sync Channel Overlay */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-slate-950/90 border border-cyan-500/60 px-6 py-2.5 rounded-2xl backdrop-blur-md shadow-2xl flex items-center gap-6">
            <div className="flex items-center gap-3">
              <div className="relative flex items-center justify-center">
                <div className="w-10 h-10 rounded-full border-2 border-cyan-400/80 border-t-transparent animate-spin" />
                <span className="absolute text-[11px] font-bold text-white">{Math.round(resiliencePct)}%</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block font-bold">QUANTUM SYNC CHANNEL</span>
                <span className="text-xs font-bold text-cyan-300">HUB ➔ ENGINE ➔ RUNTIME ➔ PORTAL SYNCED</span>
              </div>
            </div>

            <div className="hidden sm:flex items-center gap-3 border-l border-slate-700 pl-4 text-[10px]">
              <div className="flex items-center gap-1 text-emerald-400 font-bold">
                <CheckCircle2 className="w-3 h-3" />
                <span>Telemetry Linked</span>
              </div>
              <div className="flex items-center gap-1 text-purple-400 font-bold">
                <CheckCircle2 className="w-3 h-3" />
                <span>Evidence Unified</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. LOWER SPLIT: LEFT (GOVERNANCE & TELEMETRY STREAM) / RIGHT (SWARM & SIMULATION CONTROLS) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT 5 COLS: GOVERNANCE PROTOCOLS & REAL-TIME TELEMETRY CHARTS */}
        <div className="lg:col-span-5 space-y-6">
          {/* Governance Protocols Panel */}
          <div className="bg-slate-950 border border-cyan-900/60 rounded-2xl p-5 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-cyan-400" />
                <h3 className="font-bold text-white text-sm">
                  {lang === 'th' ? 'โพรโทคอลธรรมาภิบาล (Governance Protocols)' : 'Governance Protocols & Compliance'}
                </h3>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-950 border border-cyan-500/40 text-cyan-300 font-bold">
                SAFE HARBOR
              </span>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <div className="flex justify-between text-slate-300 mb-1">
                  <span>Trust Index (ดัชนีความน่าเชื่อถือ):</span>
                  <span className="font-bold text-cyan-400">99.8%</span>
                </div>
                <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                  <div className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 w-[99.8%]" />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-slate-300 mb-1">
                  <span>Evidence Matrix (หลักฐานแคนอนิคัล):</span>
                  <span className="font-bold text-emerald-400">14,902 / 14,902 SEALS</span>
                </div>
                <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                  <div className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 w-[100%]" />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-slate-300 mb-1">
                  <span>Policy Set (มาตรฐานกฎหมาย):</span>
                  <span className="font-bold text-purple-300">ETDA Sec 9/26/28 + PDPA</span>
                </div>
                <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                  <div className="h-full bg-gradient-to-r from-purple-500 to-indigo-500 w-[100%]" />
                </div>
              </div>
            </div>
          </div>

          {/* Telemetry Waveform Stream Chart */}
          <div className="bg-slate-950 border border-blue-900/60 rounded-2xl p-5 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-blue-400" />
                <h3 className="font-bold text-white text-sm">
                  {lang === 'th' ? 'สตรีมโทรมาตรความเสถียร (Telemetry Stream)' : 'Real-Time Telemetry Stability Stream'}
                </h3>
              </div>
              <span className="text-[10px] text-slate-400 font-mono">100Hz Stream</span>
            </div>

            <div className="h-44 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={telemetryStream}>
                  <defs>
                    <linearGradient id="burnGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.6}/>
                      <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="time" stroke="#475569" fontSize={10} />
                  <YAxis domain={['auto', 'auto']} stroke="#475569" fontSize={10} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#020617', borderColor: '#1e293b', borderRadius: '8px', fontSize: '11px' }}
                  />
                  <Area type="monotone" dataKey="freq" stroke="#38bdf8" fillOpacity={1} fill="url(#burnGrad)" name="Core Stability %" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* RIGHT 7 COLS: ADAPTIVE SWARM CONTROLS, STRESS SCENARIOS & UNIFIED LOG FEED */}
        <div className="lg:col-span-7 space-y-6">
          {/* Adaptive Swarm Controls Panel */}
          <div className="bg-slate-950 border border-purple-900/60 rounded-2xl p-5 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-purple-400" />
                <h3 className="font-bold text-white text-sm">
                  {lang === 'th' ? 'การควบคุมสวอร์มปรับตัวอัตโนมัติ (Adaptive Swarm Controls)' : 'Adaptive Swarm Agents & Self-Healing Controls'}
                </h3>
              </div>
              <span className="text-[10px] text-purple-400 font-mono">6 Agents Active</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {swarmAgents.map(agent => (
                <button
                  key={agent.id}
                  onClick={() => toggleSwarmAgent(agent.id)}
                  className={`p-3 rounded-xl border bg-slate-900/80 hover:bg-slate-900 transition-all text-left space-y-1 ${
                    agent.status === 'BOOSTED'
                      ? 'border-amber-400 ring-1 ring-amber-400/50 shadow-md shadow-amber-950/40'
                      : agent.status === 'ACTIVE'
                      ? 'border-cyan-500/40'
                      : 'border-slate-800 opacity-60'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white leading-tight">
                      {lang === 'th' ? agent.nameTh.split(' ')[0] : agent.nameEn}
                    </span>
                    <span className={`text-[9px] px-1.5 py-0.5 rounded font-bold font-mono ${
                      agent.status === 'BOOSTED' ? 'bg-amber-950 text-amber-300' : 'bg-cyan-950 text-cyan-300'
                    }`}>
                      {agent.status}
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-400 truncate">{agent.role}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Simulation Stress Testing Scenarios Buttons */}
          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Sliders className="w-4 h-4 text-amber-400" />
                <h3 className="font-bold text-white text-sm">
                  {lang === 'th' ? 'สถานะและการจำลองสถานการณ์วิกฤต (Simulation Status Controls)' : 'Simulation Status & Stress Scenarios'}
                </h3>
              </div>
              <span className="text-[10px] text-amber-400 font-bold font-mono">REAL-TIME TESTBED</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              <button
                onClick={() => triggerScenario('STABLE')}
                className={`px-3 py-2.5 rounded-xl border text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                  scenario === 'STABLE'
                    ? 'bg-emerald-950 border-emerald-400 text-emerald-200 ring-1 ring-emerald-400'
                    : 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-850'
                }`}
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>CANONICAL STABLE</span>
              </button>

              <button
                onClick={() => triggerScenario('CRASH')}
                className={`px-3 py-2.5 rounded-xl border text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                  scenario === 'CRASH'
                    ? 'bg-red-950 border-red-500 text-red-200 ring-1 ring-red-400 animate-pulse'
                    : 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-850'
                }`}
              >
                <AlertTriangle className="w-3.5 h-3.5 text-red-400" />
                <span>CRASH SCENARIO</span>
              </button>

              <button
                onClick={() => triggerScenario('SPIKE')}
                className={`px-3 py-2.5 rounded-xl border text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                  scenario === 'SPIKE'
                    ? 'bg-amber-950 border-amber-400 text-amber-200 ring-1 ring-amber-400'
                    : 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-850'
                }`}
              >
                <Zap className="w-3.5 h-3.5 text-amber-400" />
                <span>SPIKE EVENT</span>
              </button>

              <button
                onClick={() => triggerScenario('DRIFT')}
                className={`px-3 py-2.5 rounded-xl border text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                  scenario === 'DRIFT'
                    ? 'bg-purple-950 border-purple-400 text-purple-200 ring-1 ring-purple-400'
                    : 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-850'
                }`}
              >
                <RefreshCw className="w-3.5 h-3.5 text-purple-400" />
                <span>DRIFT ANALYSIS</span>
              </button>
            </div>
          </div>

          {/* Unified Log Feed (from Image 1) */}
          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <h4 className="font-bold text-white text-xs">
                  {lang === 'th' ? 'ฟีดบันทึกรวมศูนย์ (Unified Log Feed)' : 'Unified Real-Time Log Feed'}
                </h4>
              </div>
              <span className="text-[10px] text-slate-500 font-mono">STREAMING LIVE</span>
            </div>

            <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1 text-[11px] font-mono">
              {logs.map(log => (
                <div key={log.id} className="p-2 rounded-lg bg-slate-900/70 border border-slate-850 flex items-start gap-2">
                  <span className="text-cyan-400 shrink-0 font-bold">[QT: {log.timestamp}]</span>
                  <span className={`shrink-0 text-[10px] px-1 rounded font-bold ${
                    log.level === 'SUCCESS' ? 'text-emerald-400 bg-emerald-950' :
                    log.level === 'CRITICAL' ? 'text-red-400 bg-red-950' :
                    log.level === 'WARN' ? 'text-amber-400 bg-amber-950' :
                    'text-cyan-400 bg-cyan-950'
                  }`}>
                    {log.level}
                  </span>
                  <span className="text-slate-300 leading-snug">
                    {lang === 'th' ? log.messageTh : log.messageEn}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
