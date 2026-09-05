import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text, Line, Sphere, Float } from '@react-three/drei';
import * as THREE from 'three';

interface NodeProps {
  position: [number, number, number];
  color: string;
  label: string;
  pulseRate?: number;
}

const Node: React.FC<NodeProps> = ({ position, color, label, pulseRate = 1 }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame(({ clock }) => {
    if (meshRef.current) {
      meshRef.current.scale.setScalar(1 + Math.sin(clock.elapsedTime * pulseRate) * 0.1);
    }
  });

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
      <group position={position}>
        <Sphere ref={meshRef} args={[0.6, 32, 32]}>
          <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.8} />
        </Sphere>
        <Text
          position={[0, 1.2, 0]}
          fontSize={0.25}
          color="white"
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.02}
          outlineColor="#000"
        >
          {label}
        </Text>
      </group>
    </Float>
  );
};

interface BeamProps {
  start: [number, number, number];
  end: [number, number, number];
  color: string;
}

const Beam: React.FC<BeamProps> = ({ start, end, color }) => {
  return (
    <Line
      points={[start, end]}
      color={color}
      lineWidth={2}
      transparent
      opacity={0.6}
      dashed={true}
      dashScale={20}
      dashSize={1}
      dashOffset={0}
    />
  );
};

export const ChamberRuntimeAtlas3D: React.FC = () => {
  const nodes = useMemo<Array<{ id: string; pos: [number, number, number]; color: string; label: string }>>(() => [
    { id: 'gov', pos: [0, 2.5, 0], color: '#3b82f6', label: 'Governance Chamber' },
    { id: 'tel', pos: [-2.5, -1, 1.5], color: '#06b6d4', label: 'Telemetry Fabric' },
    { id: 'atl', pos: [2.5, -1, 1.5], color: '#8b5cf6', label: 'Sovereign Atlas' },
    { id: 'inv', pos: [0, -1, -2.5], color: '#10b981', label: 'Invariant Matrix' },
    { id: 'cus', pos: [0, 0, 0], color: '#d4af37', label: 'Custodian Quorum (Core)' },
  ], []);

  return (
    <div className="w-full h-[400px] rounded-xl overflow-hidden cursor-move bg-black/60 border border-violet-900/50 relative">
      <Canvas camera={{ position: [0, 4, 10], fov: 50 }}>
        <ambientLight intensity={0.4} />
        <pointLight position={[10, 10, 10]} intensity={1.5} />
        <pointLight position={[-10, -10, -10]} color="#8b5cf6" intensity={1} />
        
        <OrbitControls 
          enableZoom={true} 
          enableRotate={true} 
          autoRotate={true}
          autoRotateSpeed={0.5}
        />

        {nodes.map(node => (
          <Node key={node.id} position={node.pos} color={node.color} label={node.label} />
        ))}

        {/* Beams from central Custodian to others */}
        <Beam start={nodes[4].pos} end={nodes[0].pos} color="#3b82f6" />
        <Beam start={nodes[4].pos} end={nodes[1].pos} color="#06b6d4" />
        <Beam start={nodes[4].pos} end={nodes[2].pos} color="#8b5cf6" />
        <Beam start={nodes[4].pos} end={nodes[3].pos} color="#10b981" />
        
        {/* Beams connecting outer ring */}
        <Beam start={nodes[0].pos} end={nodes[1].pos} color="#06b6d4" />
        <Beam start={nodes[1].pos} end={nodes[3].pos} color="#10b981" />
        <Beam start={nodes[3].pos} end={nodes[2].pos} color="#8b5cf6" />
        <Beam start={nodes[2].pos} end={nodes[0].pos} color="#3b82f6" />

        {/* Cosmic Grid Floor */}
        <gridHelper args={[20, 20, '#d4af37', '#080a12']} position={[0, -3, 0]} />
      </Canvas>
      <div className="absolute top-3 left-3 flex flex-col gap-2">
        <div className="flex items-center gap-1.5 px-2 py-1 rounded bg-black/80 border border-violet-500/50 text-[10px] text-violet-400 font-mono backdrop-blur-sm pointer-events-none">
          <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse"></span>
          HOLOGRAM DECK ACTIVE
        </div>
        <div className="px-2 py-1 rounded bg-black/80 border border-cyan-500/50 text-[10px] text-cyan-400 font-mono backdrop-blur-sm pointer-events-none">
          GLOBAL CITADEL TELEMETRY: CONNECTED
        </div>
      </div>
    </div>
  );
};
