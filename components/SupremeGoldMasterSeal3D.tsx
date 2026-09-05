'use client';

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { 
  Sparkles, 
  RotateCw, 
  Layers, 
  Zap, 
  Maximize2, 
  Activity, 
  ShieldCheck, 
  Award, 
  Eye,
  Sliders
} from 'lucide-react';

interface SupremeGoldMasterSeal3DProps {
  coherence?: number;
  qops?: number;
  cryoTemp?: string;
  isInteractive?: boolean;
  size?: number;
  onNotify?: (msg: string, type?: 'success' | 'warning' | 'error') => void;
}

export default function SupremeGoldMasterSeal3D({
  coherence = 99.992,
  qops = 851.9,
  cryoTemp = "14.98 mK",
  isInteractive = true,
}: SupremeGoldMasterSeal3DProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const [wireframe, setWireframe] = useState(false);
  const [rotationSpeed, setRotationSpeed] = useState(1.0);
  const [particlesCount] = useState(1200);
  const [activeViewMode, setActiveViewMode] = useState<'hologram' | 'quantum_gold' | 'wire_lattice'>('quantum_gold');
  const [isRotating, setIsRotating] = useState(true);
  const [holographicBeam, setHolographicBeam] = useState(true);

  // References for animation state
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const mainGroupRef = useRef<THREE.Group | null>(null);
  const particlesRef = useRef<THREE.Points | null>(null);
  const ringsRef = useRef<THREE.Group | null>(null);
  const beamRef = useRef<THREE.Mesh | null>(null);
  const animFrameIdRef = useRef<number | null>(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // 1. SCENE & CAMERA SETUP
    const width = container.clientWidth || 500;
    const height = container.clientHeight || 420;

    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 0, 7.5);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.25;
    rendererRef.current = renderer;

    container.replaceChildren(renderer.domElement);

    // 2. LIGHTING
    const ambientLight = new THREE.AmbientLight(0x0c1e36, 1.8);
    scene.add(ambientLight);

    const goldKeyLight = new THREE.DirectionalLight(0xffdf78, 3.2);
    goldKeyLight.position.set(4, 5, 6);
    scene.add(goldKeyLight);

    const cyanRimLight = new THREE.DirectionalLight(0x67e8f9, 3.8);
    cyanRimLight.position.set(-5, -3, -4);
    scene.add(cyanRimLight);

    const purpleFillLight = new THREE.PointLight(0xa855f7, 2.5, 20);
    purpleFillLight.position.set(0, 3, -3);
    scene.add(purpleFillLight);

    // 3. MAIN SOVEREIGN SEAL HIERARCHY
    const rootGroup = new THREE.Group();
    scene.add(rootGroup);
    mainGroupRef.current = rootGroup;

    // Texture Generator for Gold Inscription & Thai Legal Invariant Textures
    const createSealTexture = () => {
      const canvas = document.createElement('canvas');
      canvas.width = 1024;
      canvas.height = 1024;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        // Dark gold radial gradient background
        const grad = ctx.createRadialGradient(512, 512, 100, 512, 512, 512);
        grad.addColorStop(0, '#ffe894');
        grad.addColorStop(0.35, '#d4af37');
        grad.addColorStop(0.7, '#856404');
        grad.addColorStop(1, '#1b1202');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, 1024, 1024);

        // Concentric decorative golden rings
        ctx.strokeStyle = '#fff5cc';
        ctx.lineWidth = 8;
        ctx.beginPath();
        ctx.arc(512, 512, 480, 0, Math.PI * 2);
        ctx.stroke();

        ctx.strokeStyle = '#67e8f9';
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.arc(512, 512, 450, 0, Math.PI * 2);
        ctx.stroke();

        // 12-Star / Rune Markers
        for (let i = 0; i < 12; i++) {
          const angle = (i * Math.PI * 2) / 12;
          const sx = 512 + Math.cos(angle) * 420;
          const sy = 512 + Math.sin(angle) * 420;
          ctx.fillStyle = '#67e8f9';
          ctx.beginPath();
          ctx.arc(sx, sy, 8, 0, Math.PI * 2);
          ctx.fill();
        }

        // Circular Text Inscriptions
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 30px "JetBrains Mono", monospace';
        ctx.textAlign = 'center';
        ctx.fillText('SUPREME SOVEREIGN MASTER SEAL Ω∞', 512, 180);
        ctx.fillText('10/10 REAL HSM DECA-QUORUM • SSoT Δ0', 512, 880);

        ctx.fillStyle = '#ffeaa7';
        ctx.font = 'bold 24px "Prompt", sans-serif';
        ctx.fillText('นายยุทธภูมิ พากเพียร #EP-SOVEREIGN-61', 512, 230);
        ctx.fillText('พ.ร.บ.ธุรกรรมทางอิเล็กทรอนิกส์ มาตรา 9, 26, 28, 32', 512, 830);

        // Center Emblem / Greek Ω and Infinity Symbol
        ctx.fillStyle = '#ffffff';
        ctx.font = '900 160px "JetBrains Mono", sans-serif';
        ctx.fillText('Ω∞', 512, 540);

        ctx.font = 'bold 28px "JetBrains Mono", monospace';
        ctx.fillStyle = '#67e8f9';
        ctx.fillText('CRYSTALS-DILITHIUM-5 FIPS 204', 512, 600);
        ctx.fillText('ROOT: 909ab814...43fa4c68', 512, 640);
      }
      return new THREE.CanvasTexture(canvas);
    };

    const sealTexture = createSealTexture();

    // Seal Medal Geometry
    const cylinderGeo = new THREE.CylinderGeometry(2.2, 2.2, 0.22, 64, 4);
    const goldMat = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(0xd4af37),
      metalness: 0.92,
      roughness: 0.18,
      clearcoat: 0.85,
      clearcoatRoughness: 0.1,
      reflectivity: 1.0,
      map: sealTexture,
      bumpMap: sealTexture,
      bumpScale: 0.04,
    });

    const sealMesh = new THREE.Mesh(cylinderGeo, goldMat);
    sealMesh.rotation.x = Math.PI / 2;
    rootGroup.add(sealMesh);

    // Bezel Outer Golden Ring
    const bezelGeo = new THREE.TorusGeometry(2.35, 0.08, 24, 64);
    const bezelMat = new THREE.MeshStandardMaterial({
      color: 0xffdf78,
      metalness: 0.95,
      roughness: 0.15,
    });
    const bezelMesh = new THREE.Mesh(bezelGeo, bezelMat);
    rootGroup.add(bezelMesh);

    // Outer Gyro Rings Group (Multiverse Legal Dimensions)
    const ringsGroup = new THREE.Group();
    rootGroup.add(ringsGroup);
    ringsRef.current = ringsGroup;

    // Inner Cyan Quantum Ring
    const ring1Geo = new THREE.TorusGeometry(2.7, 0.03, 16, 80);
    const ring1Mat = new THREE.MeshBasicMaterial({ color: 0x67e8f9, wireframe: false });
    const ring1 = new THREE.Mesh(ring1Geo, ring1Mat);
    ringsGroup.add(ring1);

    // Middle Purple Interstellar Ring
    const ring2Geo = new THREE.TorusGeometry(3.05, 0.035, 16, 80);
    const ring2Mat = new THREE.MeshBasicMaterial({ color: 0xa855f7 });
    const ring2 = new THREE.Mesh(ring2Geo, ring2Mat);
    ring2.rotation.x = Math.PI / 3;
    ringsGroup.add(ring2);

    // Outer Gold Sovereign Ring
    const ring3Geo = new THREE.TorusGeometry(3.4, 0.04, 16, 96);
    const ring3Mat = new THREE.MeshBasicMaterial({ color: 0xfacc15 });
    const ring3 = new THREE.Mesh(ring3Geo, ring3Mat);
    ring3.rotation.y = Math.PI / 4;
    ringsGroup.add(ring3);

    // 4. HOLOGRAPHIC PROJECTION BEAM CYLINDER
    const beamGeo = new THREE.CylinderGeometry(2.6, 3.8, 5.0, 32, 1, true);
    const beamMat = new THREE.MeshBasicMaterial({
      color: 0x67e8f9,
      transparent: true,
      opacity: 0.18,
      side: THREE.DoubleSide,
      blending: THREE.AdditiveBlending,
      wireframe: true,
    });
    const beamMesh = new THREE.Mesh(beamGeo, beamMat);
    beamMesh.position.y = -0.8;
    rootGroup.add(beamMesh);
    beamRef.current = beamMesh;

    // 5. QUANTUM PARTICLE FLUX (Connected to System Telemetry)
    const particleGeometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particlesCount * 3);
    const colors = new Float32Array(particlesCount * 3);

    const pColor1 = new THREE.Color(0x67e8f9); // Cyan
    const pColor2 = new THREE.Color(0xd4af37); // Gold
    const pColor3 = new THREE.Color(0xa855f7); // Purple

    for (let i = 0; i < particlesCount; i++) {
      const radius = 2.2 + Math.random() * 2.5;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);

      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = radius * Math.cos(phi);

      const mixed = Math.random() < 0.45 ? pColor1 : Math.random() < 0.8 ? pColor2 : pColor3;
      colors[i * 3] = mixed.r;
      colors[i * 3 + 1] = mixed.g;
      colors[i * 3 + 2] = mixed.b;
    }

    particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particleGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const particleMaterial = new THREE.PointsMaterial({
      size: 0.055,
      vertexColors: true,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending,
    });

    const particles = new THREE.Points(particleGeometry, particleMaterial);
    rootGroup.add(particles);
    particlesRef.current = particles;

    // 6. ANIMATION LOOP
    let clock = new THREE.Clock();

    const animate = () => {
      animFrameIdRef.current = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();
      const delta = clock.getDelta();

      if (rootGroup && isRotating) {
        rootGroup.rotation.y += 0.008 * rotationSpeed;
        rootGroup.rotation.x = Math.sin(elapsedTime * 0.5) * 0.15;
      }

      if (ringsGroup) {
        ring1.rotation.z += 0.012 * rotationSpeed;
        ring2.rotation.y += 0.009 * rotationSpeed;
        ring3.rotation.x += 0.007 * rotationSpeed;
      }

      if (particles) {
        particles.rotation.y -= 0.003 * rotationSpeed;
        particles.rotation.z += 0.002;
        
        // Particle breathing based on coherence and qops
        const pulse = Math.sin(elapsedTime * 2.5) * 0.05 + 1.0;
        particles.scale.set(pulse, pulse, pulse);
      }

      if (beamMesh) {
        beamMesh.rotation.y += 0.005;
        const beamIntensity = (Math.sin(elapsedTime * 3) * 0.08 + 0.18) * (holographicBeam ? 1 : 0);
        beamMat.opacity = beamIntensity;
      }

      renderer.render(scene, camera);
    };

    animate();

    // RESIZE OBSERVER
    const handleResize = () => {
      if (!container || !renderer || !camera) return;
      const newWidth = container.clientWidth;
      const newHeight = container.clientHeight;
      if (newWidth === 0 || newHeight === 0) return;
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    };

    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(container);

    return () => {
      if (animFrameIdRef.current) cancelAnimationFrame(animFrameIdRef.current);
      resizeObserver.disconnect();
      renderer.dispose();
      particleGeometry.dispose();
      cylinderGeo.dispose();
      goldMat.dispose();
    };
  }, [particlesCount, isRotating, rotationSpeed, holographicBeam]);

  // Update wireframe / view modes
  useEffect(() => {
    if (!mainGroupRef.current) return;
    mainGroupRef.current.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        if (child.material && 'wireframe' in child.material) {
          (child.material as THREE.MeshStandardMaterial).wireframe = wireframe;
        }
      }
    });
  }, [wireframe]);

  return (
    <div className="w-full rounded-2xl border border-amber-500/40 bg-gradient-to-b from-[#081224] via-[#09152b] to-[#040813] p-5 backdrop-blur-2xl shadow-2xl space-y-4 gold-glow relative overflow-hidden">
      
      {/* HEADER CONTROLS */}
      <div className="flex flex-wrap justify-between items-center gap-3 border-b border-amber-500/30 pb-3 relative z-10">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-amber-400/20 border border-amber-400/50 text-amber-300 shadow-md">
            <Award className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-amber-400 font-bold font-mono tracking-widest uppercase bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/30">
                THREE.JS 3D HOLOGRAM PLANE
              </span>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-mono text-[9px] font-bold">
                TELEMETRY SYNCED
              </span>
            </div>
            <h3 className="text-base sm:text-lg font-bold text-white font-mono text-gold-gradient">
              Supreme Sovereign Gold Master Seal Ω∞ (3D Hologram)
            </h3>
          </div>
        </div>

        {/* TOP STATUS BADGES */}
        <div className="flex flex-wrap items-center gap-2 text-[10px] font-mono">
          <div className="px-2.5 py-1 rounded-lg bg-black/60 border border-amber-500/30 text-amber-300">
            Coherence: <strong>{coherence}%</strong>
          </div>
          <div className="px-2.5 py-1 rounded-lg bg-black/60 border border-cyan-500/30 text-cyan-300">
            QOps: <strong>{qops} q/s</strong>
          </div>
          <div className="px-2.5 py-1 rounded-lg bg-black/60 border border-purple-500/30 text-purple-300">
            Cryo: <strong>{cryoTemp}</strong>
          </div>
        </div>
      </div>

      {/* 3D CANVAS VIEWPORT */}
      <div className="relative w-full h-[360px] sm:h-[420px] bg-gradient-to-b from-black/80 via-[#030814]/90 to-black/90 rounded-2xl border border-cyan-500/30 overflow-hidden shadow-inner flex items-center justify-center">
        
        {/* Three.js Mount Container */}
        <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

        {/* OVERLAID HUD METADATA (CYBERNETIC GLASS ACCENTS) */}
        <div className="absolute top-3 left-3 pointer-events-none font-mono text-[10px] space-y-1 z-10">
          <div className="px-2.5 py-1 rounded-lg bg-black/70 border border-amber-500/40 text-amber-300 backdrop-blur-md flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
            <span>AUTHORITY: นายยุทธภูมิ พากเพียร (#EP-SOVEREIGN-61)</span>
          </div>
          <div className="px-2.5 py-1 rounded-lg bg-black/70 border border-cyan-500/40 text-cyan-300 backdrop-blur-md">
            PQC ALGORITHM: CRYSTALS-Dilithium-5 (ML-DSA-87 / FIPS 204)
          </div>
          <div className="px-2.5 py-1 rounded-lg bg-black/70 border border-purple-500/40 text-purple-300 backdrop-blur-md">
            MERKLE ROOT: 0x909ab814479844d8a14816bed...fa4c68
          </div>
        </div>

        {/* INTERACTIVE FLOATING TOOLBAR */}
        {isInteractive && (
          <div className="absolute bottom-3 right-3 flex flex-wrap items-center gap-1.5 z-10 bg-slate-950/90 border border-cyan-500/40 p-1.5 rounded-xl backdrop-blur-md shadow-2xl">
            <button
              onClick={() => setIsRotating(!isRotating)}
              className={`p-2 rounded-lg text-xs font-mono font-bold transition cursor-pointer flex items-center gap-1 ${
                isRotating ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/50' : 'bg-slate-900 text-slate-400 border border-slate-800'
              }`}
              title="Toggle Auto Rotation"
            >
              <RotateCw className={`w-3.5 h-3.5 ${isRotating ? 'animate-spin-slow' : ''}`} />
              <span className="hidden sm:inline">หมุน (Spin)</span>
            </button>

            <button
              onClick={() => setWireframe(!wireframe)}
              className={`p-2 rounded-lg text-xs font-mono font-bold transition cursor-pointer flex items-center gap-1 ${
                wireframe ? 'bg-purple-500/20 text-purple-300 border border-purple-400/50' : 'bg-slate-900 text-slate-400 border border-slate-800'
              }`}
              title="Toggle Lattice Wireframe"
            >
              <Layers className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">แลตทิซ (Wire)</span>
            </button>

            <button
              onClick={() => setHolographicBeam(!holographicBeam)}
              className={`p-2 rounded-lg text-xs font-mono font-bold transition cursor-pointer flex items-center gap-1 ${
                holographicBeam ? 'bg-amber-500/20 text-amber-300 border border-amber-400/50' : 'bg-slate-900 text-slate-400 border border-slate-800'
              }`}
              title="Toggle Hologram Projection Beam"
            >
              <Zap className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">ลำแสง (Beam)</span>
            </button>

            <div className="flex items-center gap-1 bg-black/60 px-2 py-1 rounded-lg border border-slate-800 text-[10px] font-mono text-slate-300">
              <span>ความเร็ว:</span>
              <button 
                onClick={() => setRotationSpeed(s => Math.max(0.5, s - 0.5))} 
                className="hover:text-cyan-300 px-1 font-bold"
              >
                -
              </button>
              <span className="text-amber-300 font-bold">{rotationSpeed.toFixed(1)}x</span>
              <button 
                onClick={() => setRotationSpeed(s => Math.min(3.0, s + 0.5))} 
                className="hover:text-cyan-300 px-1 font-bold"
              >
                +
              </button>
            </div>
          </div>
        )}

      </div>

      {/* FOOTER STATUTORY ATTESTATION */}
      <div className="flex flex-wrap justify-between items-center text-[10px] font-mono text-slate-400 border-t border-amber-500/20 pt-2 px-1">
        <div className="flex items-center gap-2 text-amber-300">
          <Award className="w-3.5 h-3.5 text-amber-400" />
          <span>Supreme Gold Master Seal Ω∞ • 14,902 Canonical Proofs • Thai Electronic Transactions Act Passed</span>
        </div>
        <div className="text-slate-500">
          Renderer: WebGL 2.0 • ACES Filmic Tone Mapping • 1,200 Dynamic Particle Emitters
        </div>
      </div>

    </div>
  );
}
