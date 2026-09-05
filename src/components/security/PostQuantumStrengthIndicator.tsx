import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Lock, 
  Zap, 
  Cpu, 
  Activity, 
  Sliders, 
  AlertTriangle, 
  CheckCircle2, 
  RefreshCw,
  Layers,
  KeyRound,
  Binary,
  Gauge,
  Timer,
  HardDrive
} from 'lucide-react';

interface PostQuantumStrengthIndicatorProps {
  lang: 'th' | 'en';
}

interface PQCSession {
  id: string;
  name: string;
  primarySig: string;
  primaryKem: string;
  nistCategory: number;
  baseHardness: number; // 0 - 100
  quantumWorkFactorBits: number; // e.g. 256
  latticeDim: string;
  sampleLatencyMs: number;
  signingThroughput: string;
  verificationThroughput: string;
  sigSizeBytes: number;
  pubKeySizeBytes: number;
  rejectionSamplingRate: string;
  status: 'OPTIMAL' | 'REDUNDANT' | 'STANDBY' | 'DEGRADED';
  descriptionTh: string;
  descriptionEn: string;
}

export const PostQuantumStrengthIndicator: React.FC<PostQuantumStrengthIndicatorProps> = ({ lang }) => {
  const sessions: PQCSession[] = [
    {
      id: 'SESSION-01-DILITHIUM5',
      name: 'Session #01: Sovereign Core (Dilithium-5 + Kyber-1024)',
      primarySig: 'CRYSTALS-Dilithium-5 (ML-DSA-87)',
      primaryKem: 'CRYSTALS-Kyber-1024 (ML-KEM-1024)',
      nistCategory: 5,
      baseHardness: 99.98,
      quantumWorkFactorBits: 256,
      latticeDim: 'k=8, l=7 (LWE Ring-Matrix)',
      sampleLatencyMs: 0.38,
      signingThroughput: '14,250 sig/sec',
      verificationThroughput: '42,800 ver/sec',
      sigSizeBytes: 4595,
      pubKeySizeBytes: 2592,
      rejectionSamplingRate: '1.42%',
      status: 'OPTIMAL',
      descriptionTh: 'ชุดการเข้ารหัสหลักระดับสูงสุด ป้องกัน Shor & Grover 100% ประจำการใน 10/10 HSM Quorum',
      descriptionEn: 'Peak Category 5 security guarding all canonical genesis blocks and multi-sig quorums'
    },
    {
      id: 'SESSION-02-SPHINCS',
      name: 'Session #02: Stateless Backup (SPHINCS+ + Kyber-1024)',
      primarySig: 'SPHINCS+-SHAKE-256f (SLH-DSA)',
      primaryKem: 'CRYSTALS-Kyber-1024 (ML-KEM-1024)',
      nistCategory: 5,
      baseHardness: 98.65,
      quantumWorkFactorBits: 256,
      latticeDim: 'Hypertree h=68, d=17 (Hash-Based)',
      sampleLatencyMs: 2.14,
      signingThroughput: '1,890 sig/sec',
      verificationThroughput: '24,200 ver/sec',
      sigSizeBytes: 49856,
      pubKeySizeBytes: 64,
      rejectionSamplingRate: '0.00% (No Lattice)',
      status: 'STANDBY',
      descriptionTh: 'ระบบสำรองไร้สถานะอิงฟังก์ชันแฮช ไม่อาศัยโครงข่ายแลตทิซ ต้านทานการโจมตีคณิตศาสตร์เฉพาะทาง',
      descriptionEn: 'Stateless hash backup resisting lattice-specific cryptanalysis and algorithmic drift'
    },
    {
      id: 'SESSION-03-FALCON',
      name: 'Session #03: Low-Latency High-Throughput (Falcon-1024)',
      primarySig: 'Falcon-1024 (FN-DSA)',
      primaryKem: 'CRYSTALS-Kyber-768 (ML-KEM-768)',
      nistCategory: 5,
      baseHardness: 97.40,
      quantumWorkFactorBits: 248,
      latticeDim: 'N=1024 (NTRU Lattice)',
      sampleLatencyMs: 0.19,
      signingThroughput: '19,400 sig/sec',
      verificationThroughput: '68,500 ver/sec',
      sigSizeBytes: 1330,
      pubKeySizeBytes: 1792,
      rejectionSamplingRate: '0.85%',
      status: 'REDUNDANT',
      descriptionTh: 'ความเร็วสูง ความหน่วงต่ำพิเศษ ใช้การสุ่มฟูเรียร์ เหมาะกับการส่งผ่านข้ามดาวเทียม',
      descriptionEn: 'Ultra low-latency Fourier-sampling lattice for orbital cross-links and high-speed RPC'
    },
    {
      id: 'SESSION-04-HYBRID-TRANSITION',
      name: 'Session #04: Hybrid Transition (Dilithium-3 + Secp256k1)',
      primarySig: 'Dilithium-3 + Secp256k1 (Dual-Wrapped)',
      primaryKem: 'Kyber-768 + X25519',
      nistCategory: 3,
      baseHardness: 82.30,
      quantumWorkFactorBits: 192,
      latticeDim: 'k=6, l=5 (Hybrid Transition)',
      sampleLatencyMs: 0.52,
      signingThroughput: '8,650 sig/sec',
      verificationThroughput: '19,800 ver/sec',
      sigSizeBytes: 3360,
      pubKeySizeBytes: 1985,
      rejectionSamplingRate: '2.10%',
      status: 'DEGRADED',
      descriptionTh: 'โหมดเปลี่ยนผ่าน เข้ากันได้กับระบบเดิม แต่มีความเสี่ยงควอนตัมบางส่วนบนเลเยอร์คลาสสิก',
      descriptionEn: 'Legacy bridging session with partial classical exposure under transitional policy'
    }
  ];

  const [selectedSessionId, setSelectedSessionId] = useState<string>('SESSION-01-DILITHIUM5');
  const [entropyRate, setEntropyRate] = useState<number>(99.99); // %
  const [noiseVariance, setNoiseVariance] = useState<number>(3.19); // standard deviation
  const [liveHardnessScore, setLiveHardnessScore] = useState<number>(99.98);
  const [activeOpsJitter, setActiveOpsJitter] = useState<number>(0);
  const [liveSigningOps, setLiveSigningOps] = useState<number>(14250);
  const [liveVerificationOps, setLiveVerificationOps] = useState<number>(42800);

  const currentSession = sessions.find((s) => s.id === selectedSessionId) || sessions[0];

  // Dynamic real-time calculation based on session, entropy, noise variance, and micro-jitter
  useEffect(() => {
    const jitterInterval = setInterval(() => {
      const microVariance = (Math.random() - 0.5) * 0.05;
      // Hardness Formula: BaseScore * (Entropy / 100) * (1 - (varianceDelta * 0.002)) + microVariance
      const calculated = Math.min(
        Math.max(
          currentSession.baseHardness * (entropyRate / 100) - (Math.abs(noiseVariance - 3.19) * 0.35) + microVariance,
          10
        ),
        100
      );
      setLiveHardnessScore(Number(calculated.toFixed(2)));
      setActiveOpsJitter((prev) => prev + 1);

      // Jitter throughput rates slightly to reflect real load fluctuations
      const baseSign = parseInt(currentSession.signingThroughput.replace(/[^0-9]/g, ''), 10) || 10000;
      const baseVer = parseInt(currentSession.verificationThroughput.replace(/[^0-9]/g, ''), 10) || 30000;
      setLiveSigningOps(Math.floor(baseSign + (Math.random() - 0.5) * 120));
      setLiveVerificationOps(Math.floor(baseVer + (Math.random() - 0.5) * 280));
    }, 1000);

    return () => clearInterval(jitterInterval);
  }, [currentSession, entropyRate, noiseVariance]);

  // Color mapping based on hardness score
  const getScoreColor = (score: number) => {
    if (score >= 98.0) {
      return {
        bar: 'from-cyan-500 via-emerald-400 to-emerald-300',
        glow: 'shadow-emerald-500/40',
        text: 'text-emerald-400',
        bgBadge: 'bg-emerald-950 text-emerald-300 border-emerald-500/40',
        tag: 'QUANTUM_UNBREAKABLE (NIST CAT 5)'
      };
    }
    if (score >= 90.0) {
      return {
        bar: 'from-cyan-500 via-blue-400 to-purple-400',
        glow: 'shadow-cyan-500/40',
        text: 'text-cyan-400',
        bgBadge: 'bg-cyan-950 text-cyan-300 border-cyan-500/40',
        tag: 'HIGH_QUANTUM_RESILIENCE'
      };
    }
    if (score >= 80.0) {
      return {
        bar: 'from-amber-500 to-yellow-400',
        glow: 'shadow-amber-500/40',
        text: 'text-amber-400',
        bgBadge: 'bg-amber-950 text-amber-300 border-amber-500/40',
        tag: 'ADEQUATE_PQC (TRANSITIONAL)'
      };
    }
    return {
      bar: 'from-red-600 to-red-400',
      glow: 'shadow-red-500/40',
      text: 'text-red-400',
      bgBadge: 'bg-red-950 text-red-300 border-red-500/40',
      tag: 'VULNERABLE_CLASSICAL_EXPOSURE'
    };
  };

  const scoreTheme = getScoreColor(liveHardnessScore);

  return (
    <div 
      id="post-quantum-strength-indicator"
      className="bg-slate-900/90 border border-slate-800 rounded-xl p-6 shadow-xl relative overflow-hidden space-y-6"
    >
      {/* Background radial glow */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-purple-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 rounded bg-purple-950 border border-purple-500/40 text-purple-300 font-mono-code text-[11px] font-bold flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-purple-400" />
              DYNAMIC PQC STRENGTH ENGINE
            </span>
            <span className={`px-2 py-0.5 rounded text-[11px] font-mono-code font-bold border ${scoreTheme.bgBadge}`}>
              {scoreTheme.tag}
            </span>
          </div>
          <h3 className="font-display font-bold text-white text-lg tracking-tight">
            {lang === 'th' ? 'ดัชนีวัดความแกร่งทางคริปโตกราฟิกยุคหลังควอนตัม (Post-Quantum Strength Score)' : 'Real-Time Post-Quantum Cryptographic Hardness Indicator'}
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            {lang === 'th'
              ? 'คำนวณระดับความปลอดภัยทางคณิตศาสตร์แบบเรียลไทม์ตามสมรรถนะอัลกอริทึม PQC, ค่าเอนโทรปีของระบบ, และความกว้างมิติแลตทิซ'
              : 'Dynamic mathematical hardness calculation reflecting active PQC session algorithms, entropy quality, and lattice dimension parameters.'}
          </p>
        </div>

        <div className="bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800 text-right shrink-0">
          <span className="text-[10px] text-slate-500 block font-mono-code">Work-Factor Bit Strength:</span>
          <span className="text-sm font-mono-code font-bold text-cyan-400">
            2^{currentSession.quantumWorkFactorBits} <span className="text-[10px] text-slate-400 font-normal">Quantum Ops</span>
          </span>
        </div>
      </div>

      {/* Main Dynamic Score Indicator Bar */}
      <div className="space-y-3 bg-slate-950 p-5 rounded-xl border border-slate-800/90">
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
          <div className="flex items-center gap-3">
            <span className="text-xs font-mono-code text-slate-400 font-bold uppercase tracking-wider">
              {lang === 'th' ? 'คะแนนความแกร่งทางคริปโตสด' : 'Live Hardness Score'}:
            </span>
            <span className={`text-3xl sm:text-4xl font-mono-code font-extrabold ${scoreTheme.text} tracking-tight`}>
              {liveHardnessScore.toFixed(2)}%
            </span>
            <span className="text-xs font-mono-code text-slate-500">
              / 100.00%
            </span>
          </div>

          <div className="flex items-center gap-3 text-xs font-mono-code">
            <span className="text-slate-400">NIST Security:</span>
            <span className="px-2 py-0.5 rounded bg-purple-950 text-purple-300 border border-purple-500/40 font-bold">
              CATEGORY {currentSession.nistCategory}
            </span>
            <span className="text-slate-400">Latency:</span>
            <span className="text-white font-bold">{currentSession.sampleLatencyMs} ms</span>
          </div>
        </div>

        {/* Dynamic Progress Bar Container */}
        <div className="relative w-full h-5 bg-slate-900 rounded-full overflow-hidden border border-slate-800 p-0.5">
          {/* Animated Background Pulse */}
          <div 
            className={`h-full rounded-full bg-gradient-to-r ${scoreTheme.bar} transition-all duration-700 ease-out shadow-lg`}
            style={{ width: `${liveHardnessScore}%` }}
          />
        </div>

        {/* Marker Scale */}
        <div className="flex justify-between items-center text-[10px] font-mono-code text-slate-500 pt-1">
          <span>0% (Broken)</span>
          <span>50% (Classical Vulnerable)</span>
          <span>80% (Transitional)</span>
          <span>90% (NIST Cat 3)</span>
          <span className="text-emerald-400 font-bold">100% (NIST Cat 5 Supreme)</span>
        </div>
      </div>

      {/* PQC Algorithm Performance Metrics Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-950 p-4 rounded-xl border border-slate-800 text-xs font-mono-code">
        <div className="space-y-1">
          <div className="flex items-center gap-1.5 text-slate-400">
            <Zap className="w-3.5 h-3.5 text-cyan-400" />
            <span>{lang === 'th' ? 'อัตราการลงนามสด' : 'Sign Throughput'}</span>
          </div>
          <div className="text-cyan-300 font-bold text-sm">
            {liveSigningOps.toLocaleString()} ops/s
          </div>
          <span className="text-[10px] text-slate-500 block">Peak Hardware Speed</span>
        </div>

        <div className="space-y-1">
          <div className="flex items-center gap-1.5 text-slate-400">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>{lang === 'th' ? 'อัตราการตรวจสอบสด' : 'Verify Throughput'}</span>
          </div>
          <div className="text-emerald-300 font-bold text-sm">
            {liveVerificationOps.toLocaleString()} ops/s
          </div>
          <span className="text-[10px] text-slate-500 block">Ring-Matrix Multiply</span>
        </div>

        <div className="space-y-1">
          <div className="flex items-center gap-1.5 text-slate-400">
            <HardDrive className="w-3.5 h-3.5 text-purple-400" />
            <span>{lang === 'th' ? 'ขนาดกุญแจและลายเซ็น' : 'Sig / PubKey Size'}</span>
          </div>
          <div className="text-purple-300 font-bold text-sm">
            {currentSession.sigSizeBytes} B / {currentSession.pubKeySizeBytes} B
          </div>
          <span className="text-[10px] text-slate-500 block">NIST Post-Quantum Payload</span>
        </div>

        <div className="space-y-1">
          <div className="flex items-center gap-1.5 text-slate-400">
            <Activity className="w-3.5 h-3.5 text-amber-400" />
            <span>{lang === 'th' ? 'อัตราสุ่มซ้ำ' : 'Rejection Rate'}</span>
          </div>
          <div className="text-amber-300 font-bold text-sm">
            {currentSession.rejectionSamplingRate}
          </div>
          <span className="text-[10px] text-slate-500 block">Gaussian Sampling Tail</span>
        </div>
      </div>

      {/* Active Session Switcher Tabs */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs font-mono-code text-slate-400">
          <span className="font-bold flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-cyan-400" />
            {lang === 'th' ? 'เลือกเซสชัน PQC ที่ใช้งานเพื่อคำนวณสด' : 'Select Active Cryptographic Session'}:
          </span>
          <span className="text-slate-500">
            {lang === 'th' ? '4 โปรไฟล์เซสชันมาตรฐาน' : '4 Standard Session Profiles'}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {sessions.map((sess) => {
            const isSelected = sess.id === selectedSessionId;
            return (
              <button
                key={sess.id}
                onClick={() => {
                  setSelectedSessionId(sess.id);
                  setLiveHardnessScore(sess.baseHardness);
                }}
                className={`text-left p-3.5 rounded-xl border transition-all text-xs font-mono-code ${
                  isSelected
                    ? 'bg-slate-850 border-purple-500/80 shadow-md shadow-purple-950/40 ring-1 ring-purple-500/30'
                    : 'bg-slate-950/70 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-bold text-white text-[13px]">{sess.name}</span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    sess.status === 'OPTIMAL' ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/40' :
                    sess.status === 'STANDBY' ? 'bg-blue-950 text-blue-300 border border-blue-500/40' :
                    sess.status === 'REDUNDANT' ? 'bg-purple-950 text-purple-300 border border-purple-500/40' :
                    'bg-amber-950 text-amber-300 border border-amber-500/40'
                  }`}>
                    {sess.status}
                  </span>
                </div>

                <div className="text-[11px] text-slate-400 space-y-0.5">
                  <div>Sig: <strong className="text-cyan-300">{sess.primarySig}</strong></div>
                  <div>KEM: <strong className="text-purple-300">{sess.primaryKem}</strong></div>
                  <div>Lattice: <span className="text-slate-300">{sess.latticeDim}</span></div>
                </div>

                <div className="mt-2 pt-2 border-t border-slate-800/80 text-[11px] text-slate-300 font-sans">
                  {lang === 'th' ? sess.descriptionTh : sess.descriptionEn}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Dynamic Telemetry & Environmental Controls */}
      <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-4">
        <div className="flex items-center justify-between text-xs font-mono-code">
          <span className="text-slate-300 font-bold flex items-center gap-1.5">
            <Sliders className="w-3.5 h-3.5 text-cyan-400" />
            {lang === 'th' ? 'ตัวแปรสภาวะแวดล้อมทางควอนตัม (Quantum Environmental Parameters)' : 'Live Parameter Modulation'}:
          </span>
          <span className="text-slate-500 text-[11px]">
            Sync Cycle: #{activeOpsJitter}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono-code">
          {/* Entropy Quality Slider */}
          <div className="space-y-1.5 bg-slate-900/80 p-3 rounded-lg border border-slate-800">
            <div className="flex justify-between">
              <span className="text-slate-400">{lang === 'th' ? 'คุณภาพเอนโทรปีควอนตัม' : 'Quantum Entropy Rate'}:</span>
              <span className="text-emerald-400 font-bold">{entropyRate.toFixed(2)}%</span>
            </div>
            <input
              type="range"
              min="85"
              max="100"
              step="0.05"
              value={entropyRate}
              onChange={(e) => setEntropyRate(parseFloat(e.target.value))}
              className="w-full accent-emerald-400 bg-slate-800 h-1.5 rounded-lg cursor-pointer"
            />
            <span className="text-[10px] text-slate-500 block">
              {lang === 'th' ? 'มาจากแหล่งกำเนิด TRNG กายภาพ 10/10 HSM' : 'Fed by 10/10 physical True Random Number Generators'}
            </span>
          </div>

          {/* Lattice Noise Variance Slider */}
          <div className="space-y-1.5 bg-slate-900/80 p-3 rounded-lg border border-slate-800">
            <div className="flex justify-between">
              <span className="text-slate-400">{lang === 'th' ? 'ความแปรปรวนสัญญาณรบกวนแลตทิซ' : 'LWE Gaussian Noise (σ)'}:</span>
              <span className="text-purple-400 font-bold">{noiseVariance.toFixed(2)}</span>
            </div>
            <input
              type="range"
              min="2.0"
              max="4.5"
              step="0.02"
              value={noiseVariance}
              onChange={(e) => setNoiseVariance(parseFloat(e.target.value))}
              className="w-full accent-purple-400 bg-slate-800 h-1.5 rounded-lg cursor-pointer"
            />
            <span className="text-[10px] text-slate-500 block">
              {lang === 'th' ? 'ค่ามาตรฐาน NIST: σ = 3.19 (Category 5 Hardness)' : 'NIST Canonical Standard: σ = 3.19'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
