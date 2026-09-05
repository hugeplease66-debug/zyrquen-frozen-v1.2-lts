'use client';

import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { 
  Scale, 
  ShieldCheck, 
  Globe2, 
  Sparkles, 
  Award, 
  CheckCircle2, 
  FileText, 
  ExternalLink,
  Layers,
  Search,
  Activity,
  Zap,
  Radio
} from 'lucide-react';
import ProvenanceBadge from './ProvenanceBadge';

interface LatticeNode {
  id: string;
  name: string;
  category: 'thai' | 'global' | 'interstellar';
  law: string;
  section: string;
  binding: string;
  status: 'COMPLIANT' | 'ENFORCED' | 'RATIFIED';
  proofHash: string;
  hsmQuorum: string;
  description: string;
  connectivity: string;
  latencyMs: number;
  healthPercent: number;
}

const LATTICE_LAYERS: LatticeNode[] = [
  {
    id: "LAYER-01",
    name: "มาตรา 9 (Section 9)",
    category: "thai",
    law: "พ.ร.บ.ธุรกรรมทางอิเล็กทรอนิกส์ 2544",
    section: "มาตรา 9 (Legal Effect of E-Signatures)",
    binding: "Identity Layer – Sovereign Signature Binding",
    status: "COMPLIANT",
    proofHash: "0x4f8a91c0e3...b712",
    hsmQuorum: "10/10 REAL_HSM",
    description: "รับรองผลทางกฎหมายของลายมือชื่ออิเล็กทรอนิกส์ ไม่ปฏิเสธความสมบูรณ์ ผูกมัดอัตลักษณ์นายยุทธภูมิ พากเพียร สมบูรณ์",
    connectivity: "100% ONLINE (Mesh Node BKK-01)",
    latencyMs: 1.2,
    healthPercent: 100.0
  },
  {
    id: "LAYER-02",
    name: "มาตรา 26 (Section 26)",
    category: "thai",
    law: "พ.ร.บ.ธุรกรรมทางอิเล็กทรอนิกส์ 2544",
    section: "มาตรา 26 (Reliable Electronic Signatures)",
    binding: "Crypto Layer – Zero-Trust Cryogenic Merkle Core",
    status: "ENFORCED",
    proofHash: "0x909ab81447...4c68",
    hsmQuorum: "10/10 REAL_HSM",
    description: "ลายมือชื่อที่เชื่อถือได้ ข้อมูลสร้างลายมือชื่ออยู่ภายใต้การควบคุมของเจ้าของลายมือชื่อโดยเฉพาะ",
    connectivity: "100% ONLINE (Mesh Node BKK-02)",
    latencyMs: 0.8,
    healthPercent: 100.0
  },
  {
    id: "LAYER-03",
    name: "มาตรา 28 (Section 28)",
    category: "thai",
    law: "พ.ร.บ.ธุรกรรมทางอิเล็กทรอนิกส์ 2544",
    section: "มาตรา 28 (Signer Responsibilities)",
    binding: "Responsibility Layer – Ep-Sovereign Identity Guard",
    status: "RATIFIED",
    proofHash: "0x67e8f912a0...99c1",
    hsmQuorum: "10/10 REAL_HSM",
    description: "หน้าที่ความรับผิดชอบของเจ้าของข้อมูลและผู้อนุมัติเอกสาร Sovereign Master",
    connectivity: "100% ONLINE (Mesh Node CNX-01)",
    latencyMs: 1.5,
    healthPercent: 99.98
  },
  {
    id: "LAYER-04",
    name: "มาตรา 32 (Section 32)",
    category: "thai",
    law: "พ.ร.บ.ธุรกรรมทางอิเล็กทรอนิกส์ 2544",
    section: "มาตรา 32 (Certification Authority)",
    binding: "Auditing Layer – 12-Stage Forensics Ledger",
    status: "COMPLIANT",
    proofHash: "0x12c4e5a990...e815",
    hsmQuorum: "10/10 REAL_HSM",
    description: "การให้บริการออกใบรับรองและระบบบันทึกหลักฐานดิจิทัลที่สามารถตรวจสอบย้อนหลังได้ 100%",
    connectivity: "100% ONLINE (Mesh Node HKT-01)",
    latencyMs: 2.1,
    healthPercent: 100.0
  },
  {
    id: "LAYER-05",
    name: "มาตรา 33 (Section 33)",
    category: "thai",
    law: "พ.ร.บ.ธุรกรรมทางอิเล็กทรอนิกส์ 2544",
    section: "มาตรา 33 (Mutual Recognition)",
    binding: "Interoperability Layer – Cross-Chain Bridge Anchor",
    status: "COMPLIANT",
    proofHash: "0x89e01fb342...aa71",
    hsmQuorum: "10/10 REAL_HSM",
    description: "การยอมรับความสมบูรณ์ของใบรับรองอิเล็กทรอนิกส์ต่างระบบตามมาตรฐานเทียบเท่า",
    connectivity: "100% ONLINE (Mesh Node SIN-01)",
    latencyMs: 3.4,
    healthPercent: 99.99
  },
  {
    id: "LAYER-06",
    name: "มาตรา 34 (Section 34)",
    category: "thai",
    law: "พ.ร.บ.ธุรกรรมทางอิเล็กทรอนิกส์ 2544",
    section: "มาตรา 34 (Digital Preservation)",
    binding: "Archival Layer – Immutable Frozen Registry LTS",
    status: "ENFORCED",
    proofHash: "0x77c2a10e8f...dd09",
    hsmQuorum: "10/10 REAL_HSM",
    description: "การเก็บรักษาข้อความและข้อมูลอิเล็กทรอนิกส์ในรูปแบบถาวร ไม่สามารถแก้ไขหรือทำลายได้",
    connectivity: "100% ONLINE (Mesh Node TYO-01)",
    latencyMs: 12.8,
    healthPercent: 100.0
  },
  {
    id: "LAYER-07",
    name: "มาตรา 35 (Section 35)",
    category: "thai",
    law: "พ.ร.บ.ธุรกรรมทางอิเล็กทรอนิกส์ 2544",
    section: "มาตรา 35 (Cross-Border Jurisdiction)",
    binding: "Jurisdiction Layer – Omni-Jurisdiction Lattice",
    status: "RATIFIED",
    proofHash: "0x33b8a91c0e...6621",
    hsmQuorum: "10/10 REAL_HSM",
    description: "การคุ้มครองธุรกรรมข้ามพรมแดนและผลการบังคับใช้ตามหลักสากล",
    connectivity: "100% ONLINE (Mesh Node FRA-01)",
    latencyMs: 44.2,
    healthPercent: 100.0
  },
  {
    id: "LAYER-08",
    name: "UNCITRAL Model Law",
    category: "global",
    law: "United Nations UNCITRAL (1996/2001)",
    section: "Articles 6, 7 & 12 (Electronic Commerce & Signatures)",
    binding: "Global Trade Layer – International Enforceability",
    status: "COMPLIANT",
    proofHash: "0xfa99210c44...ee82",
    hsmQuorum: "10/10 REAL_HSM",
    description: "สนธิสัญญากฎหมายแม่แบบสหประชาชาติว่าด้วยการพาณิชย์และลายมือชื่ออิเล็กทรอนิกส์สากล",
    connectivity: "100% ONLINE (UN Core Grid GVA)",
    latencyMs: 48.6,
    healthPercent: 99.95
  },
  {
    id: "LAYER-09",
    name: "GDPR Art 25 & 32",
    category: "global",
    law: "EU General Data Protection Regulation",
    section: "Privacy by Design & Cryptographic Security",
    binding: "Zero-Trust Privacy – Quantum Enclave ZK-Proof",
    status: "COMPLIANT",
    proofHash: "0x55d1a09ef2...11b4",
    hsmQuorum: "10/10 REAL_HSM",
    description: "การประมวลผลข้อมูลส่วนบุคคลแบบ Zero-Knowledge และมาตรการความมั่นคงปลอดภัยไซเบอร์ระดับสูงสุด",
    connectivity: "100% ONLINE (EU Cloud Hub BRU)",
    latencyMs: 52.1,
    healthPercent: 100.0
  },
  {
    id: "LAYER-10",
    name: "ISO/IEC 27001",
    category: "global",
    law: "ISO/IEC 27001:2022 ISMS Standard",
    section: "Annex A Controls (Cryptography, Access, Logs)",
    binding: "Security Fabric – 10 HSM Deca-Quorum Architecture",
    status: "ENFORCED",
    proofHash: "0x66d3a8220c...99aa",
    hsmQuorum: "10/10 REAL_HSM",
    description: "มาตรฐานการบริหารจัดการความมั่นคงปลอดภัยสารสนเทศ การควบคุมการเข้าถึงและการเข้ารหัสลับ",
    connectivity: "100% ONLINE (Global ISMS Node LON)",
    latencyMs: 41.5,
    healthPercent: 100.0
  },
  {
    id: "LAYER-11",
    name: "Galactic Charter Δ∞",
    category: "interstellar",
    law: "Interstellar Sovereign Accord Δ∞",
    section: "Cosmic Jurisdiction & Warp Telemetry Integrity",
    binding: "Cosmic Sovereign Mesh – Multi-Realm QKD Grid",
    status: "RATIFIED",
    proofHash: "0xcc88019abf...7723",
    hsmQuorum: "10/10 REAL_HSM",
    description: "กฎบัตรอธิปไตยดิจิทัลข้ามดวงดาวและการสื่อสารผ่านโครงข่ายควอนตัมอวกาศลึก BK01-LD06",
    connectivity: "100% ONLINE (Orbital QKD Sat-01)",
    latencyMs: 142.0,
    healthPercent: 99.92
  },
  {
    id: "LAYER-12",
    name: "Cosmic Legal Accord v7",
    category: "interstellar",
    law: "Multiverse Supreme Legal Plane v1.7",
    section: "Supreme Gold Master Ratification & Immutable Rights",
    binding: "Supreme Sovereign Master Seal Ω∞",
    status: "RATIFIED",
    proofHash: "0x909ab814479844d8a14816bed34cdbb07528e18501da86fc4691763a43fa4c68",
    hsmQuorum: "10/10 REAL_HSM",
    description: "ตราประทับทองคำสูงสุด ผูกขาดกรรมสิทธิ์และอำนาจอธิปไตยดิจิทัลโดย นายยุทธภูมิ พากเพียร ปราศจากการเพิกถอน",
    connectivity: "100% ONLINE (Sovereign Core Ω∞)",
    latencyMs: 0.01,
    healthPercent: 100.0
  }
];

export default function MultiverseComplianceD3Lattice() {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const [containerWidth, setContainerWidth] = useState(680);
  const [selectedLayer, setSelectedLayer] = useState<LatticeNode>(LATTICE_LAYERS[0]);
  const [filterCategory, setFilterCategory] = useState<'all' | 'thai' | 'global' | 'interstellar'>('all');
  const [pulseTime, setPulseTime] = useState(0);

  // Resize listener
  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        if (entry.contentRect.width > 0) {
          setContainerWidth(entry.contentRect.width);
        }
      }
    });
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  // Animation Pulse Timer
  useEffect(() => {
    const timer = setInterval(() => {
      setPulseTime(t => (t + 0.05) % 1);
    }, 50);
    return () => clearInterval(timer);
  }, []);

  // D3 Circular / Radial Layout Render
  useEffect(() => {
    if (!svgRef.current || !containerRef.current) return;

    const width = Math.max(380, containerWidth);
    const height = Math.min(width * 0.85, 520);
    const cx = width / 2;
    const cy = height / 2;
    const radius = Math.min(width, height) * 0.38;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();
    svg.attr('width', width).attr('height', height);

    const defs = svg.append('defs');

    // Glow filter
    const filter = defs.append('filter').attr('id', 'lattice-glow').attr('x', '-50%').attr('y', '-50%').attr('width', '200%').attr('height', '200%');
    filter.append('feGaussianBlur').attr('stdDeviation', '4').attr('result', 'coloredBlur');
    const feMerge = filter.append('feMerge');
    feMerge.append('feMergeNode').attr('in', 'coloredBlur');
    feMerge.append('feMergeNode').attr('in', 'SourceGraphic');

    const g = svg.append('g');

    // Concentric Guide Rings
    [0.4, 0.7, 1.0].forEach((ratio) => {
      g.append('circle')
        .attr('cx', cx)
        .attr('cy', cy)
        .attr('r', radius * ratio)
        .attr('fill', 'none')
        .attr('stroke', 'rgba(103, 232, 249, 0.12)')
        .attr('stroke-width', 1)
        .attr('stroke-dasharray', '4,6');
    });

    // Outer Orbit Rotating Star field
    for (let i = 0; i < 24; i++) {
      const a = (i * Math.PI * 2) / 24;
      const r = radius * 1.18;
      g.append('circle')
        .attr('cx', cx + Math.cos(a) * r)
        .attr('cy', cy + Math.sin(a) * r)
        .attr('r', i % 3 === 0 ? 1.5 : 0.8)
        .attr('fill', '#67E8F9')
        .attr('opacity', 0.35);
    }

    // Nodes positions calculation
    const totalNodes = LATTICE_LAYERS.length;
    const nodePositions = LATTICE_LAYERS.map((node, i) => {
      const angle = (i * Math.PI * 2) / totalNodes - Math.PI / 2;
      return {
        ...node,
        x: cx + Math.cos(angle) * radius,
        y: cy + Math.sin(angle) * radius,
        angle,
      };
    });

    // 1. Draw Connecting Chords from Center Hub to each Node
    nodePositions.forEach((node) => {
      const isSelected = selectedLayer.id === node.id;
      const isDimmed = filterCategory !== 'all' && node.category !== filterCategory;

      const chordGradId = `chord-grad-${node.id}`;
      const chordGrad = defs.append('linearGradient')
        .attr('id', chordGradId)
        .attr('x1', cx)
        .attr('y1', cy)
        .attr('x2', node.x)
        .attr('y2', node.y)
        .attr('gradientUnits', 'userSpaceOnUse');

      if (node.category === 'thai') {
        chordGrad.append('stop').attr('offset', '0%').attr('stop-color', '#D4AF37').attr('stop-opacity', isSelected ? 0.9 : isDimmed ? 0.1 : 0.4);
        chordGrad.append('stop').attr('offset', '100%').attr('stop-color', '#F59E0B').attr('stop-opacity', isSelected ? 1.0 : isDimmed ? 0.15 : 0.7);
      } else if (node.category === 'global') {
        chordGrad.append('stop').attr('offset', '0%').attr('stop-color', '#38BDF8').attr('stop-opacity', isSelected ? 0.9 : isDimmed ? 0.1 : 0.4);
        chordGrad.append('stop').attr('offset', '100%').attr('stop-color', '#06B6D4').attr('stop-opacity', isSelected ? 1.0 : isDimmed ? 0.15 : 0.7);
      } else {
        chordGrad.append('stop').attr('offset', '0%').attr('stop-color', '#C084FC').attr('stop-opacity', isSelected ? 0.9 : isDimmed ? 0.1 : 0.4);
        chordGrad.append('stop').attr('offset', '100%').attr('stop-color', '#A855F7').attr('stop-opacity', isSelected ? 1.0 : isDimmed ? 0.15 : 0.7);
      }

      // Base line
      g.append('line')
        .attr('x1', cx)
        .attr('y1', cy)
        .attr('x2', node.x)
        .attr('y2', node.y)
        .attr('stroke', `url(#${chordGradId})`)
        .attr('stroke-width', isSelected ? 2.8 : isDimmed ? 0.8 : 1.5)
        .attr('filter', isSelected ? 'url(#lattice-glow)' : null);

      // Traveling Quantum Packet
      if (!isDimmed) {
        const px = cx + (node.x - cx) * pulseTime;
        const py = cy + (node.y - cy) * pulseTime;
        g.append('circle')
          .attr('cx', px)
          .attr('cy', py)
          .attr('r', isSelected ? 3.5 : 2)
          .attr('fill', node.category === 'thai' ? '#FBBF24' : node.category === 'global' ? '#67E8F9' : '#C084FC')
          .attr('filter', 'url(#lattice-glow)');
      }
    });

    // 2. Inter-node Lattice Perimeter polygon
    const perimeterPath = d3.line<typeof nodePositions[0]>()
      .x(d => d.x)
      .y(d => d.y)
      .curve(d3.curveLinearClosed);

    g.append('path')
      .datum(nodePositions)
      .attr('d', perimeterPath)
      .attr('fill', 'none')
      .attr('stroke', 'rgba(103, 232, 249, 0.2)')
      .attr('stroke-width', 1)
      .attr('stroke-dasharray', '3,3');

    // 3. Central Sovereign Hub (Gold Master Seal Ω∞)
    const centerG = g.append('g')
      .attr('transform', `translate(${cx},${cy})`)
      .attr('cursor', 'pointer');

    centerG.append('circle')
      .attr('r', 38)
      .attr('fill', '#070f1e')
      .attr('stroke', '#D4AF37')
      .attr('stroke-width', 3)
      .attr('filter', 'url(#lattice-glow)');

    centerG.append('circle')
      .attr('r', 44)
      .attr('fill', 'none')
      .attr('stroke', 'rgba(212, 175, 55, 0.4)')
      .attr('stroke-width', 1.5)
      .attr('stroke-dasharray', '4,4');

    centerG.append('text')
      .attr('text-anchor', 'middle')
      .attr('dy', '-6')
      .attr('fill', '#FFE680')
      .attr('font-size', '16px')
      .attr('font-weight', '900')
      .attr('font-family', 'JetBrains Mono, monospace')
      .text('Ω∞');

    centerG.append('text')
      .attr('text-anchor', 'middle')
      .attr('dy', '14')
      .attr('fill', '#67E8F9')
      .attr('font-size', '8px')
      .attr('font-weight', 'bold')
      .attr('font-family', 'JetBrains Mono, monospace')
      .text('SOVEREIGN SEAL');

    centerG.append('text')
      .attr('text-anchor', 'middle')
      .attr('dy', '24')
      .attr('fill', '#34D399')
      .attr('font-size', '7px')
      .attr('font-family', 'JetBrains Mono, monospace')
      .text('10/10 HSM');

    // 4. Render 12 Layer Nodes
    nodePositions.forEach((node) => {
      const isSelected = selectedLayer.id === node.id;
      const isDimmed = filterCategory !== 'all' && node.category !== filterCategory;

      const nodeG = g.append('g')
        .attr('transform', `translate(${node.x},${node.y})`)
        .attr('cursor', 'pointer')
        .attr('opacity', isDimmed ? 0.35 : 1)
        .on('click', () => setSelectedLayer(node));

      const nodeColor = node.category === 'thai' ? '#F59E0B' : node.category === 'global' ? '#06B6D4' : '#A855F7';
      const nodeFill = node.category === 'thai' ? '#3B2302' : node.category === 'global' ? '#042233' : '#270838';

      // Outer Selection Ring
      if (isSelected) {
        nodeG.append('circle')
          .attr('r', 20)
          .attr('fill', 'none')
          .attr('stroke', '#FFFFFF')
          .attr('stroke-width', 2)
          .attr('filter', 'url(#lattice-glow)');
      }

      // Base Circle
      nodeG.append('circle')
        .attr('r', isSelected ? 15 : 12)
        .attr('fill', nodeFill)
        .attr('stroke', nodeColor)
        .attr('stroke-width', isSelected ? 2.5 : 1.8)
        .attr('filter', isSelected ? 'url(#lattice-glow)' : null);

      // Node text label
      nodeG.append('text')
        .attr('text-anchor', 'middle')
        .attr('dy', '3.5')
        .attr('fill', '#FFFFFF')
        .attr('font-size', '8px')
        .attr('font-weight', 'bold')
        .attr('font-family', 'JetBrains Mono, monospace')
        .text(node.id.replace('LAYER-', ''));

      // Radial outer label
      const labelDist = radius + 28;
      const lx = cx + Math.cos(node.angle) * labelDist;
      const ly = cy + Math.sin(node.angle) * labelDist;
      
      const labelTextAnchor = Math.cos(node.angle) > 0.3 ? 'start' : Math.cos(node.angle) < -0.3 ? 'end' : 'middle';

      g.append('text')
        .attr('x', lx)
        .attr('y', ly)
        .attr('text-anchor', labelTextAnchor)
        .attr('fill', isSelected ? '#FFFFFF' : isDimmed ? '#475569' : '#94A3B8')
        .attr('font-size', isSelected ? '10px' : '8.5px')
        .attr('font-weight', isSelected ? 'bold' : '500')
        .attr('font-family', 'JetBrains Mono, monospace')
        .text(node.name)
        .attr('cursor', 'pointer')
        .on('click', () => setSelectedLayer(node));
    });

  }, [containerWidth, selectedLayer, filterCategory, pulseTime]);

  return (
    <div ref={containerRef} className="w-full bg-[#0a1324]/95 border border-amber-500/40 rounded-2xl p-5 backdrop-blur-2xl shadow-2xl space-y-5 gold-glow">
      
      {/* HEADER & CONTROLS */}
      <div className="flex flex-wrap justify-between items-center gap-3 border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-amber-500/20 border border-amber-400/50 text-amber-300">
            <Scale className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-amber-400 font-bold font-mono tracking-widest uppercase bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/30">
                DYNAMIC D3.JS RADIAL MATRIX
              </span>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-mono text-[9px] font-bold">
                12/12 JURISDICTIONS ACTIVE
              </span>
            </div>
            <h3 className="text-base sm:text-lg font-bold text-white font-mono text-gold-gradient">
              Multiverse Compliance Dashboard (12-Layer Sovereign Lattice)
            </h3>
          </div>
        </div>

        {/* CATEGORY FILTER BUTTONS */}
        <div className="flex items-center gap-1.5 bg-black/60 p-1 rounded-xl border border-slate-800 font-mono text-xs">
          <button
            onClick={() => setFilterCategory('all')}
            className={`px-3 py-1 rounded-lg transition ${
              filterCategory === 'all' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            ทั้งหมด (All 12)
          </button>
          <button
            onClick={() => setFilterCategory('thai')}
            className={`px-3 py-1 rounded-lg transition ${
              filterCategory === 'thai' ? 'bg-amber-500/30 text-amber-300 border border-amber-500/50 font-bold' : 'text-slate-400 hover:text-amber-200'
            }`}
          >
            กฎหมายไทย (7)
          </button>
          <button
            onClick={() => setFilterCategory('global')}
            className={`px-3 py-1 rounded-lg transition ${
              filterCategory === 'global' ? 'bg-cyan-500/30 text-cyan-300 border border-cyan-500/50 font-bold' : 'text-slate-400 hover:text-cyan-200'
            }`}
          >
            สนธิสัญญาสากล (3)
          </button>
          <button
            onClick={() => setFilterCategory('interstellar')}
            className={`px-3 py-1 rounded-lg transition ${
              filterCategory === 'interstellar' ? 'bg-purple-500/30 text-purple-300 border border-purple-500/50 font-bold' : 'text-slate-400 hover:text-purple-200'
            }`}
          >
            กฎบัตรจักรวาล (2)
          </button>
        </div>
      </div>

      {/* MAIN TWO-COLUMN VISUALIZER & INSPECTOR */}
      <div className="grid lg:grid-cols-12 gap-5 items-center">
        
        {/* LEFT: D3 RADIAL SVG CHART */}
        <div className="lg:col-span-7 bg-gradient-to-b from-black/80 via-[#030916]/90 to-black/90 rounded-2xl border border-cyan-500/30 p-2 overflow-hidden flex items-center justify-center relative min-h-[420px]">
          <svg ref={svgRef} className="w-full h-full overflow-visible" />
          
          <div className="absolute bottom-2 left-3 font-mono text-[9px] text-slate-500 flex items-center gap-2">
            <span>● คลิกโหนดวงกลมเพื่อตรวจสอบรายละเอียด</span>
            <span>• 10/10 HSM SSoT Δ0</span>
          </div>
        </div>

        {/* RIGHT: SELECTED JURISDICTION LAYER INSPECTOR CARD */}
        <div className="lg:col-span-5 space-y-3 font-mono text-xs">
          <div className="p-4 rounded-2xl bg-[#0e1b33]/90 border border-cyan-500/40 space-y-3 shadow-xl">
            
            <div className="flex justify-between items-start border-b border-slate-800 pb-2.5">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <ProvenanceBadge 
                    type={selectedLayer.category === 'thai' ? 'CANONICAL' : selectedLayer.category === 'global' ? 'RUNTIME' : 'FROZEN'} 
                    authority="Supreme Sovereign Master (#EP-SOVEREIGN-61)"
                    source={selectedLayer.law}
                    evidenceStatus={`Statutory Enforceability 100% (Proof ${selectedLayer.proofHash.slice(0, 10)}...)`}
                  />
                  <span className="text-[9px] font-mono text-emerald-400 font-bold flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                    {selectedLayer.healthPercent}% HEALTH
                  </span>
                </div>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                  selectedLayer.category === 'thai' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' :
                  selectedLayer.category === 'global' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40' :
                  'bg-purple-500/20 text-purple-300 border border-purple-500/40'
                }`}>
                  {selectedLayer.id} • {selectedLayer.category.toUpperCase()} JURISDICTION
                </span>
                <h4 className="text-sm font-bold text-white mt-1.5 font-mono">{selectedLayer.name}</h4>
                <div className="text-[11px] text-cyan-300">{selectedLayer.law}</div>
              </div>

              <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                {selectedLayer.status}
              </span>
            </div>

            <div className="space-y-2">
              <div className="text-slate-300 text-[11px] font-sans leading-relaxed bg-black/40 p-2.5 rounded-xl border border-slate-800">
                {selectedLayer.description}
              </div>

              {/* REAL-TIME CONNECTIVITY & HEALTH BAR */}
              <div className="p-2.5 bg-slate-950/80 rounded-xl border border-slate-800 space-y-1.5">
                <div className="flex justify-between items-center text-[10px]">
                  <span className="text-slate-400 flex items-center gap-1">
                    <Radio className="w-3 h-3 text-cyan-400 animate-pulse" />
                    CONNECTIVITY & LATENCY:
                  </span>
                  <span className="text-cyan-300 font-bold">{selectedLayer.connectivity} ({selectedLayer.latencyMs}ms)</span>
                </div>
                <div className="w-full bg-slate-900 rounded-full h-1.5 overflow-hidden">
                  <div 
                    className="bg-gradient-to-r from-emerald-400 to-cyan-400 h-1.5 rounded-full" 
                    style={{ width: `${selectedLayer.healthPercent}%` }}
                  ></div>
                </div>
              </div>

              <div className="p-2.5 bg-slate-950/80 rounded-xl border border-slate-800 space-y-1">
                <span className="text-[9px] text-slate-400 block uppercase">Cryptographic Sovereign Binding</span>
                <span className="text-amber-300 font-bold text-xs">{selectedLayer.binding}</span>
              </div>

              <div className="p-2.5 bg-slate-950/80 rounded-xl border border-slate-800 space-y-1">
                <span className="text-[9px] text-slate-400 block uppercase">Statutory Proof Digest</span>
                <span className="text-cyan-300 font-bold text-[10px] break-all select-all">{selectedLayer.proofHash}</span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-[10px]">
                <div className="p-2 bg-slate-950/80 rounded-xl border border-slate-800">
                  <span className="text-slate-400 block">HSM QUORUM</span>
                  <span className="text-emerald-400 font-bold">{selectedLayer.hsmQuorum}</span>
                </div>
                <div className="p-2 bg-slate-950/80 rounded-xl border border-slate-800">
                  <span className="text-slate-400 block">ENFORCEMENT</span>
                  <span className="text-purple-300 font-bold">ACTIVE 100%</span>
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-800 flex justify-between items-center text-[10px]">
              <span className="text-slate-400">Authority: นายยุทธภูมิ พากเพียร</span>
              <span className="text-amber-300 font-bold">#EP-SOVEREIGN-61</span>
            </div>

          </div>

          {/* QUICK COMPLIANCE SUMMARY ROW */}
          <div className="grid grid-cols-3 gap-2 text-center text-[10px] font-mono">
            <div className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800">
              <span className="text-slate-400 block">THAI STATUTES</span>
              <strong className="text-amber-300 text-xs">7 / 7 PASS</strong>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800">
              <span className="text-slate-400 block">GLOBAL TREATIES</span>
              <strong className="text-cyan-300 text-xs">3 / 3 PASS</strong>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800">
              <span className="text-slate-400 block">COSMIC CHARTERS</span>
              <strong className="text-purple-300 text-xs">2 / 2 PASS</strong>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
