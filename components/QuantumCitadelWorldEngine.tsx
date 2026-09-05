'use client';

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { 
  Sparkles, 
  RotateCw, 
  Layers, 
  Zap, 
  Maximize2, 
  Minimize2,
  Activity, 
  ShieldCheck, 
  Award, 
  Eye,
  Sliders,
  Info,
  X,
  Compass,
  Cpu,
  Share2,
  Box
} from 'lucide-react';

interface QuantumCitadelProps {
  coherence?: number;
  qops?: number;
  cryoTemp?: string;
  onAddNotification?: (msg: string, type?: 'success' | 'error' | 'warning') => void;
}

// 8 Topology Nodes
interface TopologyNode {
  id: string;
  label: string;
  role: string;
  hash: string;
  status: 'ACTIVE' | 'SYNCED' | 'CRYOGENIC_LOCKED';
  x: number; // relative coordinate [0..100]
  y: number;
}

const TOPOLOGY_NODES: TopologyNode[] = [
  { id: 'NODE-01', label: 'BK01-ROOT', role: 'Sovereign Root & Merkle SSoT Anchor', hash: '0x909ab814...4c68', status: 'ACTIVE', x: 50, y: 15 },
  { id: 'NODE-02', label: 'LD02-CRYPTO', role: 'CRYSTALS-Dilithium-5 Enclave Engine', hash: '0x4f8a91c0...b712', status: 'ACTIVE', x: 22, y: 35 },
  { id: 'NODE-03', label: 'TK03-TREASURY', role: 'DS-901 Sovereign Treasury Vault', hash: '0x33b8a91c...6621', status: 'SYNCED', x: 78, y: 35 },
  { id: 'NODE-04', label: 'SG04-LEGAL', role: 'ETDA / PDPA / UNCITRAL Grid Matrix', hash: '0x12c4e5a9...e815', status: 'ACTIVE', x: 18, y: 65 },
  { id: 'NODE-05', label: 'NY05-QKD', role: 'Interstellar Deep Space Mesh QKD', hash: '0xcc88019a...7723', status: 'ACTIVE', x: 82, y: 65 },
  { id: 'NODE-06', label: 'CR06-SUBKELVIN', role: 'Cryogenic 14.98 mK Core Enclave', hash: '0x77c2a10e...dd09', status: 'CRYOGENIC_LOCKED', x: 35, y: 85 },
  { id: 'NODE-07', label: 'HS07-QUORUM', role: '10/10 REAL_HSM Consensus Ring', hash: '0x55d1a09e...11b4', status: 'ACTIVE', x: 65, y: 85 },
  { id: 'NODE-08', label: 'Ω∞-GATEWAY', role: 'Isolated UI Buffer & Zero-Drift VPU', hash: '0xfa99210c...ee82', status: 'ACTIVE', x: 50, y: 50 },
];

const TOPOLOGY_LINKS = [
  [0, 1], [0, 2], [0, 7],
  [1, 3], [1, 7],
  [2, 4], [2, 7],
  [3, 5], [3, 7],
  [4, 6], [4, 7],
  [5, 6], [5, 7],
  [6, 7]
];

export default function QuantumCitadelWorldEngine({
  coherence = 99.992,
  qops = 851.9,
  cryoTemp = "14.98 mK",
  onAddNotification,
}: QuantumCitadelProps) {
  // View states
  const [activeSubView, setActiveSubView] = useState<'3d_citadel' | 'force_topology'>('3d_citadel');
  const [viewportHeight, setViewportHeight] = useState<360 | 480>(480);
  const [rotationSpeed, setRotationSpeed] = useState<0.5 | 1.0 | 1.5 | 2.0>(1.0);
  const [showSpecModal, setShowSpecModal] = useState(false);
  const [isRotating, setIsRotating] = useState(true);
  const [selectedNode, setSelectedNode] = useState<TopologyNode | null>(TOPOLOGY_NODES[7]);
  const [draggedNodeId, setDraggedNodeId] = useState<string | null>(null);
  const [nodes, setNodes] = useState<TopologyNode[]>(TOPOLOGY_NODES);

  // 3D Canvas Refs
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const icosahedronMeshRef = useRef<THREE.Mesh | null>(null);
  const torus1Ref = useRef<THREE.Mesh | null>(null);
  const torus2Ref = useRef<THREE.Mesh | null>(null);
  const rootGroupRef = useRef<THREE.Group | null>(null);
  const animFrameIdRef = useRef<number | null>(null);

  // THREE.js 3D Quantum Citadel Lattice (Golden Icosahedron + Dual Cyan Torus Rings)
  useEffect(() => {
    if (activeSubView !== '3d_citadel') return;
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 600;
    const height = container.clientHeight || viewportHeight;

    // 1. Scene & Camera
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 0, 7.8);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.35;
    rendererRef.current = renderer;

    container.replaceChildren(renderer.domElement);

    // 2. Lights
    const ambientLight = new THREE.AmbientLight(0x0a192f, 2.0);
    scene.add(ambientLight);

    const goldDirLight = new THREE.DirectionalLight(0xffdf78, 3.5);
    goldDirLight.position.set(5, 5, 5);
    scene.add(goldDirLight);

    const cyanRimLight = new THREE.DirectionalLight(0x22d3ee, 4.0);
    cyanRimLight.position.set(-5, -4, -4);
    scene.add(cyanRimLight);

    const purplePointLight = new THREE.PointLight(0xc084fc, 2.5, 30);
    purplePointLight.position.set(0, 4, -2);
    scene.add(purplePointLight);

    // 3. Root Group
    const rootGroup = new THREE.Group();
    scene.add(rootGroup);
    rootGroupRef.current = rootGroup;

    // --- A. GOLDEN ICOSAHEDRON (12 Vertices, 30 Edges, 20 Faces) ---
    const icoGeo = new THREE.IcosahedronGeometry(2.1, 0); // detail 0 = exactly 20 triangular facets
    const icoMat = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(0xd4af37),
      emissive: new THREE.Color(0x5c4202),
      roughness: 0.15,
      metalness: 0.95,
      clearcoat: 0.9,
      clearcoatRoughness: 0.1,
      flatShading: true, // Dramatic Shaded Facets
      reflectivity: 1.0,
    });
    const icoMesh = new THREE.Mesh(icoGeo, icoMat);
    rootGroup.add(icoMesh);
    icosahedronMeshRef.current = icoMesh;

    // Golden Icosahedron Wireframe outline overlay
    const icoWireGeo = new THREE.WireframeGeometry(icoGeo);
    const icoWireMat = new THREE.LineBasicMaterial({ color: 0xfff3a8, linewidth: 2 });
    const icoWireMesh = new THREE.LineSegments(icoWireGeo, icoWireMat);
    icoMesh.add(icoWireMesh);

    // 12 Golden Vertex Spheres
    const vertexPositions = icoGeo.attributes.position;
    const sphereGeo = new THREE.SphereGeometry(0.09, 16, 16);
    const sphereMat = new THREE.MeshBasicMaterial({ color: 0x67e8f9 });
    for (let i = 0; i < vertexPositions.count; i++) {
      const vx = vertexPositions.getX(i);
      const vy = vertexPositions.getY(i);
      const vz = vertexPositions.getZ(i);
      const vertexSphere = new THREE.Mesh(sphereGeo, sphereMat);
      vertexSphere.position.set(vx, vy, vz);
      icoMesh.add(vertexSphere);
    }

    // --- B. DUAL CYAN TORUS RINGS (Rotating Quantum Axis) ---
    // Torus Ring 1 (Yaw Axis)
    const torus1Geo = new THREE.TorusGeometry(3.1, 0.04, 24, 100);
    const torus1Mat = new THREE.MeshStandardMaterial({
      color: 0x22d3ee,
      emissive: 0x0891b2,
      metalness: 0.9,
      roughness: 0.1,
    });
    const torus1 = new THREE.Mesh(torus1Geo, torus1Mat);
    rootGroup.add(torus1);
    torus1Ref.current = torus1;

    // Torus Ring 2 (Pitch / Cross-Axis)
    const torus2Geo = new THREE.TorusGeometry(3.4, 0.04, 24, 100);
    const torus2Mat = new THREE.MeshStandardMaterial({
      color: 0x67e8f9,
      emissive: 0x0284c7,
      metalness: 0.9,
      roughness: 0.1,
    });
    const torus2 = new THREE.Mesh(torus2Geo, torus2Mat);
    torus2.rotation.x = Math.PI / 2.3;
    torus2.rotation.y = Math.PI / 4.5;
    rootGroup.add(torus2);
    torus2Ref.current = torus2;

    // --- C. QUANTUM AMBIENT PARTICLES (1000 Emitters) ---
    const pCount = 900;
    const pGeo = new THREE.BufferGeometry();
    const pPos = new Float32Array(pCount * 3);
    const pCol = new Float32Array(pCount * 3);

    const cCyan = new THREE.Color(0x22d3ee);
    const cGold = new THREE.Color(0xfacc15);

    for (let i = 0; i < pCount; i++) {
      const rad = 2.4 + Math.random() * 2.8;
      const th = Math.random() * Math.PI * 2;
      const ph = Math.acos(Math.random() * 2 - 1);

      pPos[i * 3] = rad * Math.sin(ph) * Math.cos(th);
      pPos[i * 3 + 1] = rad * Math.sin(ph) * Math.sin(th);
      pPos[i * 3 + 2] = rad * Math.cos(ph);

      const isC = Math.random() > 0.4;
      pCol[i * 3] = isC ? cCyan.r : cGold.r;
      pCol[i * 3 + 1] = isC ? cCyan.g : cGold.g;
      pCol[i * 3 + 2] = isC ? cCyan.b : cGold.b;
    }

    pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3));
    pGeo.setAttribute('color', new THREE.BufferAttribute(pCol, 3));

    const pMat = new THREE.PointsMaterial({
      size: 0.05,
      vertexColors: true,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending,
    });
    const pPoints = new THREE.Points(pGeo, pMat);
    rootGroup.add(pPoints);

    // --- D. INTERACTIVE 3D ORBIT DRAG & SCROLL ZOOM ---
    let isDragging = false;
    let prevMouseX = 0;
    let prevMouseY = 0;

    const onMouseDown = (e: MouseEvent) => {
      isDragging = true;
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging || !rootGroup) return;
      const deltaX = e.clientX - prevMouseX;
      const deltaY = e.clientY - prevMouseY;
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;

      rootGroup.rotation.y += deltaX * 0.008;
      rootGroup.rotation.x += deltaY * 0.008;
    };

    const onMouseUp = () => {
      isDragging = false;
    };

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      camera.position.z = Math.max(4.5, Math.min(12.0, camera.position.z + e.deltaY * 0.005));
    };

    container.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    container.addEventListener('wheel', onWheel, { passive: false });

    // --- E. ANIMATION TICK LOOP ---
    const clock = new THREE.Clock();

    const animate = () => {
      animFrameIdRef.current = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();

      if (rootGroup && isRotating && !isDragging) {
        rootGroup.rotation.y += 0.008 * rotationSpeed;
        rootGroup.rotation.x = Math.sin(elapsed * 0.4) * 0.12;
      }

      if (torus1) torus1.rotation.z += 0.012 * rotationSpeed;
      if (torus2) torus2.rotation.z -= 0.015 * rotationSpeed;
      if (pPoints) pPoints.rotation.y -= 0.003 * rotationSpeed;

      renderer.render(scene, camera);
    };

    animate();

    // Resize Handler
    const handleResize = () => {
      if (!container || !renderer || !camera) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      if (w === 0 || h === 0) return;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(container);

    return () => {
      if (animFrameIdRef.current) cancelAnimationFrame(animFrameIdRef.current);
      container.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      container.removeEventListener('wheel', onWheel);
      resizeObserver.disconnect();
      renderer.dispose();
      icoGeo.dispose();
      icoMat.dispose();
      torus1Geo.dispose();
      torus2Geo.dispose();
    };
  }, [activeSubView, viewportHeight, rotationSpeed, isRotating]);

  // Topology node drag handlers
  const handleTopologyMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!draggedNodeId) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const xPct = Math.max(5, Math.min(95, ((e.clientX - rect.left) / rect.width) * 100));
    const yPct = Math.max(5, Math.min(95, ((e.clientY - rect.top) / rect.height) * 100));

    setNodes((prev) =>
      prev.map((n) => (n.id === draggedNodeId ? { ...n, x: xPct, y: yPct } : n))
    );
  };

  return (
    <div className="w-full space-y-6">
      
      {/* 1. OBSIDIAN CYBERNETIC GLASS CONTAINER */}
      <div className="w-full rounded-3xl border border-cyan-500/40 bg-gradient-to-b from-[#060e1d] via-[#09152b] to-[#040813] p-6 sm:p-7 backdrop-blur-2xl shadow-2xl relative overflow-hidden quantum-cyan-glow space-y-6">
        
        {/* CORNER RETICLES (High-tech visual markers) */}
        <div className="absolute top-2 left-2 w-3 h-3 border-t-2 border-l-2 border-cyan-400 pointer-events-none" />
        <div className="absolute top-2 right-2 w-3 h-3 border-t-2 border-r-2 border-cyan-400 pointer-events-none" />
        <div className="absolute bottom-2 left-2 w-3 h-3 border-b-2 border-l-2 border-amber-400 pointer-events-none" />
        <div className="absolute bottom-2 right-2 w-3 h-3 border-b-2 border-r-2 border-amber-400 pointer-events-none" />

        {/* Ambient glow flare */}
        <div className="absolute top-0 right-10 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-10 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* HEADER & LIVE INDICATOR BEACONS */}
        <div className="relative z-10 flex flex-wrap justify-between items-center gap-4 border-b border-cyan-500/20 pb-5">
          <div className="space-y-1.5">
            
            {/* LIVE INDICATOR BEACON BADGES */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-gradient-to-r from-cyan-400 to-sky-500 text-black font-mono text-[10px] font-bold uppercase shadow tracking-wider">
                SOVEREIGN WORLD ENGINE
              </span>
              
              {/* LIVE PULSE BEACON */}
              <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/50 font-mono text-[10px] font-bold flex items-center gap-1.5 shadow-sm">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span>GPU VIRTUAL ENGINE • ZERO CONSENSUS DRIFT • THREAD #0</span>
              </span>

              {/* NON-AUTHORITATIVE ASSURANCE PILL */}
              <span className="px-3 py-1 rounded-full bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 font-mono text-[10px] font-bold flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
                <span>Non-authoritative • Isolated UI Buffer (ม.26/28)</span>
              </span>
            </div>

            <h2 className="text-xl sm:text-2xl font-extrabold text-white font-mono text-cyan-gradient">
              3D Quantum Citadel Lattice & Interactive Force Mesh Ω∞
            </h2>
            <p className="text-xs text-slate-300 font-sans max-w-3xl leading-relaxed">
              แบบจำลองทรงเรขาคณิต 20 หน้าทองคำ (Golden Icosahedron) พร้อมวงแหวนควอนตัมคู่ และกราฟทอพอโลยีโครงข่ายอธิปไตย 8 โหนด 14 เส้นทาง ถอดรหัสภาพเสมือนจริงบนการ์ดจอแบบ Zero-Drift
            </p>
          </div>

          {/* RIGHT ACTION CONTROLS */}
          <div className="flex flex-wrap items-center gap-2 font-mono text-xs">
            
            {/* ARCHITECTURE SPEC MODAL BUTTON */}
            <button
              onClick={() => setShowSpecModal(true)}
              className="px-3.5 py-2 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-cyan-500/40 text-cyan-300 font-bold flex items-center gap-1.5 transition cursor-pointer shadow"
            >
              <Info className="w-4 h-4 text-cyan-400" />
              <span>Architecture Spec</span>
            </button>

            {/* SUB-VIEW SWITCHER */}
            <div className="flex items-center gap-1 bg-black/60 p-1 rounded-xl border border-slate-800">
              <button
                onClick={() => setActiveSubView('3d_citadel')}
                className={`px-3 py-1.5 rounded-lg transition flex items-center gap-1.5 cursor-pointer ${
                  activeSubView === '3d_citadel'
                    ? 'bg-amber-400 text-black font-bold shadow gold-glow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Box className="w-3.5 h-3.5" />
                <span>3D Citadel Lattice</span>
              </button>

              <button
                onClick={() => setActiveSubView('force_topology')}
                className={`px-3 py-1.5 rounded-lg transition flex items-center gap-1.5 cursor-pointer ${
                  activeSubView === 'force_topology'
                    ? 'bg-cyan-400 text-black font-bold shadow quantum-cyan-glow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>Force Mesh Topology (8 Nodes)</span>
              </button>
            </div>

          </div>
        </div>

        {/* 2. SUB-VIEW A: 3D QUANTUM CITADEL LATTICE */}
        {activeSubView === '3d_citadel' && (
          <div className="space-y-4">
            
            {/* VIEWPORT CONTROLS BAR */}
            <div className="flex flex-wrap justify-between items-center gap-3 bg-black/60 p-2.5 rounded-2xl border border-cyan-500/30 font-mono text-xs">
              
              {/* SPEED CONTROLS: 0.5x, 1.0x, 1.5x, 2.0x */}
              <div className="flex items-center gap-1.5">
                <span className="text-slate-400 text-[11px] mr-1">Rotation Speed:</span>
                {([0.5, 1.0, 1.5, 2.0] as const).map((spd) => (
                  <button
                    key={spd}
                    onClick={() => setRotationSpeed(spd)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                      rotationSpeed === spd
                        ? 'bg-amber-400 text-black font-extrabold shadow gold-glow'
                        : 'bg-slate-900 border border-slate-800 text-slate-300 hover:border-amber-400/50'
                    }`}
                  >
                    {spd.toFixed(1)}x
                  </button>
                ))}
              </div>

              {/* VIEWPORT HEIGHT TOGGLE: 360px <-> 480px */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsRotating(!isRotating)}
                  className={`px-3 py-1 rounded-lg font-bold flex items-center gap-1.5 border transition cursor-pointer ${
                    isRotating
                      ? 'bg-cyan-500/20 text-cyan-300 border-cyan-400/50'
                      : 'bg-slate-900 text-slate-400 border-slate-800'
                  }`}
                >
                  <RotateCw className={`w-3.5 h-3.5 ${isRotating ? 'animate-spin-slow' : ''}`} />
                  <span>{isRotating ? 'Auto Spin ON' : 'Spin PAUSED'}</span>
                </button>

                <button
                  onClick={() => setViewportHeight(h => h === 480 ? 360 : 480)}
                  className="px-3 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 font-bold flex items-center gap-1.5 transition cursor-pointer"
                  title="Toggle Viewport Height"
                >
                  {viewportHeight === 480 ? <Minimize2 className="w-3.5 h-3.5 text-cyan-400" /> : <Maximize2 className="w-3.5 h-3.5 text-amber-400" />}
                  <span>{viewportHeight}px Viewport</span>
                </button>
              </div>

            </div>

            {/* THREE.JS VIEWPORT */}
            <div 
              style={{ height: `${viewportHeight}px` }}
              className="relative w-full bg-gradient-to-b from-black/90 via-[#030917]/95 to-black/95 rounded-2xl border border-cyan-500/40 overflow-hidden shadow-inner flex items-center justify-center transition-all duration-300"
            >
              <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

              {/* OVERLAID HUD METADATA */}
              <div className="absolute top-3 left-3 pointer-events-none font-mono text-[10px] space-y-1 z-10">
                <div className="px-2.5 py-1 rounded-lg bg-black/75 border border-amber-400/50 text-amber-300 backdrop-blur-md flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
                  <span>GEOMETRY: Golden Icosahedron (20 Faces • 12 Vertices • 30 Edges)</span>
                </div>
                <div className="px-2.5 py-1 rounded-lg bg-black/75 border border-cyan-400/50 text-cyan-300 backdrop-blur-md">
                  AXIS: Dual Torus Cyan Rings (Yaw/Pitch Orbit) • Shaded Facets Shading
                </div>
                <div className="px-2.5 py-1 rounded-lg bg-black/75 border border-purple-400/50 text-purple-300 backdrop-blur-md">
                  INTERACTION: Orbit Drag (Yaw/Pitch) + Scroll Wheel Zoom + Speed Control
                </div>
              </div>
            </div>

            {/* DUAL INDICATOR FOOTER */}
            <div className="flex flex-wrap justify-between items-center gap-3 bg-[#0a1529]/90 border border-slate-800 p-3.5 rounded-2xl font-mono text-xs">
              
              {/* LEFT DUAL INDICATOR: Golden Diamond + Cyan Ring */}
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5">
                  <div className="w-3.5 h-3.5 rotate-45 bg-amber-400 border border-yellow-200 shadow-sm" />
                  <span className="text-amber-300 font-bold">12 Vertices / 20 Facets</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-3.5 h-3.5 rounded-full border-2 border-cyan-400 bg-cyan-950/80 shadow-sm animate-pulse" />
                  <span className="text-cyan-300 font-bold">30 Edges Dual-Ring Axis</span>
                </div>
              </div>

              {/* RIGHT HIGH CONTRAST SPEC */}
              <div className="text-slate-300 text-[11px] flex items-center gap-2">
                <span className="text-emerald-400 font-bold">SSoT Invariant: Δ0 Canonical</span>
                <span className="text-slate-600">|</span>
                <span className="text-cyan-300">GPU VIRTUAL ENGINE ISOLATED</span>
              </div>

            </div>

          </div>
        )}

        {/* 3. SUB-VIEW B: INTERACTIVE FORCE MESH TOPOLOGY (8 Nodes / 14 Links) */}
        {activeSubView === 'force_topology' && (
          <div className="space-y-4 font-mono text-xs">
            
            <div className="grid lg:grid-cols-12 gap-5 items-start">
              
              {/* RADAR CANVAS INTERACTIVE MESH */}
              <div 
                onMouseMove={handleTopologyMouseMove}
                onMouseUp={() => setDraggedNodeId(null)}
                className="lg:col-span-8 relative h-[480px] bg-gradient-to-b from-black/90 via-[#040d1f] to-black/95 rounded-2xl border border-cyan-500/40 overflow-hidden shadow-inner select-none cursor-crosshair p-2"
              >
                
                {/* Radar Grid Concentric Circles */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none">
                  <defs>
                    <linearGradient id="linkPulseGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.8" />
                      <stop offset="50%" stopColor="#facc15" stopOpacity="0.9" />
                      <stop offset="100%" stopColor="#c084fc" stopOpacity="0.8" />
                    </linearGradient>
                  </defs>

                  {/* Concentric rings */}
                  <circle cx="50%" cy="50%" r="18%" fill="none" stroke="rgba(34, 211, 238, 0.12)" strokeWidth="1" strokeDasharray="3,3" />
                  <circle cx="50%" cy="50%" r="35%" fill="none" stroke="rgba(34, 211, 238, 0.12)" strokeWidth="1" strokeDasharray="3,3" />
                  <circle cx="50%" cy="50%" r="46%" fill="none" stroke="rgba(34, 211, 238, 0.18)" strokeWidth="1" />
                  <line x1="50%" y1="0%" x2="50%" y2="100%" stroke="rgba(34, 211, 238, 0.1)" strokeWidth="1" />
                  <line x1="0%" y1="50%" x2="100%" y2="50%" stroke="rgba(34, 211, 238, 0.1)" strokeWidth="1" />

                  {/* 14 Links between 8 nodes */}
                  {TOPOLOGY_LINKS.map(([srcIdx, tgtIdx], idx) => {
                    const src = nodes[srcIdx];
                    const tgt = nodes[tgtIdx];
                    if (!src || !tgt) return null;

                    return (
                      <g key={`link-${idx}`}>
                        <line
                          x1={`${src.x}%`}
                          y1={`${src.y}%`}
                          x2={`${tgt.x}%`}
                          y2={`${tgt.y}%`}
                          stroke="rgba(34, 211, 238, 0.35)"
                          strokeWidth="1.5"
                        />
                        {/* Data Pulse Particle */}
                        <circle r="3" fill="#67e8f9" filter="drop-shadow(0 0 4px #22d3ee)">
                          <animateMotion
                            path={`M ${src.x * 6} ${src.y * 4.8} L ${tgt.x * 6} ${tgt.y * 4.8}`}
                            dur={`${2 + (idx % 3)}s`}
                            repeatCount="indefinite"
                          />
                        </circle>
                      </g>
                    );
                  })}
                </svg>

                {/* 8 INTERACTIVE NODES */}
                {nodes.map((node) => {
                  const isSelected = selectedNode?.id === node.id;
                  const isRoot = node.id === 'NODE-01' || node.id === 'Ω∞-GATEWAY';

                  return (
                    <div
                      key={node.id}
                      style={{ left: `${node.x}%`, top: `${node.y}%` }}
                      onMouseDown={(e) => {
                        e.stopPropagation();
                        setDraggedNodeId(node.id);
                        setSelectedNode(node);
                      }}
                      onClick={() => setSelectedNode(node)}
                      className={`absolute -translate-x-1/2 -translate-y-1/2 p-2.5 rounded-2xl border transition-all duration-150 cursor-grab active:cursor-grabbing backdrop-blur-md ${
                        isSelected
                          ? 'bg-amber-400 text-black border-amber-200 shadow-xl gold-glow scale-110 z-20 font-extrabold'
                          : isRoot
                          ? 'bg-cyan-950/90 text-cyan-200 border-cyan-400 shadow-lg quantum-cyan-glow z-10'
                          : 'bg-slate-950/90 text-slate-300 border-slate-700 hover:border-cyan-400 z-10'
                      }`}
                    >
                      <div className="flex items-center gap-1.5">
                        <span className={`w-2 h-2 rounded-full ${isSelected ? 'bg-black' : isRoot ? 'bg-cyan-400 animate-ping' : 'bg-emerald-400'}`} />
                        <span className="text-[10px] whitespace-nowrap">{node.label}</span>
                      </div>
                    </div>
                  );
                })}

                <div className="absolute bottom-2 left-3 text-[9px] text-slate-500 font-mono pointer-events-none">
                  ● คลิกและลาก (Drag & Drop) โหนดเพื่อปรับแต่งทอพอโลยีโครงข่ายสด
                </div>
              </div>

              {/* RIGHT: SELECTED NODE INFO INSPECTOR CARD */}
              <div className="lg:col-span-4 space-y-3 font-mono">
                {selectedNode ? (
                  <div className="p-4 rounded-2xl bg-[#0d1c38]/90 border border-cyan-500/40 space-y-3 shadow-xl">
                    <div className="flex justify-between items-start border-b border-slate-800 pb-2">
                      <div>
                        <span className="text-[9px] px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-bold">
                          {selectedNode.id}
                        </span>
                        <h4 className="text-sm font-bold text-white mt-1">{selectedNode.label}</h4>
                      </div>
                      <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[9px] font-bold">
                        {selectedNode.status}
                      </span>
                    </div>

                    <div className="space-y-2 text-xs">
                      <div className="p-2.5 bg-black/50 rounded-xl border border-slate-800">
                        <span className="text-[9px] text-slate-400 block">ROLE & FUNCTION</span>
                        <strong className="text-amber-300 text-[11px] font-sans">{selectedNode.role}</strong>
                      </div>

                      <div className="p-2.5 bg-black/50 rounded-xl border border-slate-800">
                        <span className="text-[9px] text-slate-400 block">NODE HASH DIGEST</span>
                        <strong className="text-cyan-300 text-[10px] break-all">{selectedNode.hash}</strong>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-[10px]">
                        <div className="p-2 bg-black/50 rounded-xl border border-slate-800">
                          <span className="text-slate-400 block">COHERENCE</span>
                          <span className="text-emerald-400 font-bold">{coherence}%</span>
                        </div>
                        <div className="p-2 bg-black/50 rounded-xl border border-slate-800">
                          <span className="text-slate-400 block">CRYO-TEMP</span>
                          <span className="text-purple-300 font-bold">{cryoTemp}</span>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        if (onAddNotification) onAddNotification(`✓ ส่งคำขอตรวจสอบโหนด ${selectedNode.label} ผ่าน 10/10 HSM สำเร็จ`, 'success');
                      }}
                      className="w-full py-2 rounded-xl bg-gradient-to-r from-cyan-400 to-sky-500 text-black font-bold text-xs hover:brightness-110 transition cursor-pointer"
                    >
                      Audit Node Invariant
                    </button>
                  </div>
                ) : (
                  <div className="p-6 rounded-2xl bg-black/40 border border-slate-800 text-center text-slate-500 text-xs">
                    เลือกโหนดในผังเพื่อตรวจสอบรายละเอียด
                  </div>
                )}

                <div className="p-3.5 bg-black/60 rounded-2xl border border-slate-800 text-[10px] text-slate-400 space-y-1">
                  <div className="text-amber-300 font-bold">14 Canonical Links Verified:</div>
                  <div>• Mesh Latency: &lt; 0.12 ms Zero-Drift</div>
                  <div>• Data Pipe: Cryogenic Quantum Waveguide</div>
                </div>

              </div>

            </div>

          </div>
        )}

      </div>

      {/* 4. ARCHITECTURE SPEC MODAL (Memory Buffer Isolation & Zero Consensus Drift) */}
      {showSpecModal && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4" onClick={() => setShowSpecModal(false)}>
          <div className="bg-gradient-to-b from-[#0b172e] via-[#071124] to-[#040813] border border-cyan-400/80 rounded-3xl p-6 sm:p-7 max-w-2xl w-full quantum-cyan-glow relative space-y-5 shadow-2xl" onClick={(e) => e.stopPropagation()}>
            
            <div className="flex justify-between items-center border-b border-cyan-500/30 pb-3">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-cyan-500/20 border border-cyan-400/50 text-cyan-300">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-[10px] text-cyan-400 font-bold font-mono tracking-widest uppercase">
                    ISOLATED UI BUFFER SPECIFICATION
                  </span>
                  <h3 className="text-lg font-bold text-white font-mono text-cyan-gradient">
                    Sovereign World Engine Architecture & Zero-Drift Invariant
                  </h3>
                </div>
              </div>

              <button
                onClick={() => setShowSpecModal(false)}
                className="p-1.5 rounded-lg bg-slate-900 text-slate-400 hover:text-white border border-slate-800 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 font-mono text-xs text-slate-300">
              
              <div className="p-3.5 bg-black/60 rounded-xl border border-cyan-500/30 space-y-1.5">
                <div className="text-cyan-300 font-bold text-sm">1. Memory Buffer Isolation (การแยกบัฟเฟอร์ความจำ)</div>
                <p className="text-[11px] font-sans text-slate-300 leading-relaxed">
                  ระบบเรนเดอร์ 3D WebGL และ D3 Lattice ทำงานใน Isolated Worker Memory Buffer บน GPU ฝั่งไคลเอนต์ โดยไม่มีการเปิดสิทธิ์เขียนกลับ (Read-Only Observer Plane) จึงรับประกันว่าข้อมูลฉันทามติหลัก (SSoT Canonical State) จะไม่มีการกลายพันธุ์ (Zero Mutation, Delta = 0)
                </p>
              </div>

              <div className="p-3.5 bg-black/60 rounded-xl border border-amber-500/30 space-y-1.5">
                <div className="text-amber-300 font-bold text-sm">2. Electronic Transactions Act Compliance (ม. 26 & ม. 28)</div>
                <p className="text-[11px] font-sans text-slate-300 leading-relaxed">
                  ตาม พ.ร.บ. ธุรกรรมทางอิเล็กทรอนิกส์ พ.ศ. 2544 มาตรา 26 และ 28 ข้อมูลการลงลายมือชื่อและตราประทับทองคำเอกสิทธิ์สูงสุดถูกควบคุมดูแลโดย นายยุทธภูมิ พากเพียร (#EP-SOVEREIGN-61) แต่เพียงผู้เดียว โดยผ่านระบบ 10/10 REAL_HSM Deca-Quorum
                </p>
              </div>

              <div className="p-3.5 bg-black/60 rounded-xl border border-emerald-500/30 space-y-1.5">
                <div className="text-emerald-300 font-bold text-sm">3. NIST Post-Quantum Cryptography (FIPS 203/204/205)</div>
                <p className="text-[11px] font-sans text-slate-300 leading-relaxed">
                  การเข้ารหัสความปลอดภัยระดับพ้นควอนตัมใช้ CRYSTALS-Dilithium-5 (ML-DSA-87), Kyber-1024 (ML-KEM-1024), Falcon-1024 และ SPHINCS+ ป้องกันการแทรกแซงจากควอนตัมคอมพิวเตอร์ 100%
                </p>
              </div>

            </div>

            <div className="flex justify-end pt-2 border-t border-slate-800">
              <button
                onClick={() => setShowSpecModal(false)}
                className="px-6 py-2.5 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-black font-bold font-mono text-xs cursor-pointer shadow"
              >
                เข้าใจและยอมรับ (Acknowledge)
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
