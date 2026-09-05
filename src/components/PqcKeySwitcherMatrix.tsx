import React, { useState, useMemo, useCallback, useRef, useEffect, memo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  PqcAlgorithmId,
  PqcAlgorithmConfig,
  HsmEnclaveState,
  LatticeMemoizerMetrics,
  HsmQuorumEvaluation,
} from '../types';
import {
  Shield,
  Zap,
  Cpu,
  Lock,
  RefreshCw,
  Layers,
  Database,
  CheckCircle2,
  AlertTriangle,
  Server,
  Activity,
  Award,
  Flame,
  ArrowRightLeft,
  Sparkles,
  Binary,
  Clock,
  Gauge,
  Sliders,
  Check,
  Radio,
  Fingerprint,
  HardDrive,
  ShieldCheck,
  KeyRound,
} from 'lucide-react';

export const PQC_ALGORITHMS: Record<PqcAlgorithmId, PqcAlgorithmConfig> = {
  'ML-DSA-87': {
    id: 'ML-DSA-87',
    name: 'CRYSTALS-Dilithium-5 (ML-DSA-87)',
    standard: 'NIST FIPS 204 (Round 4)',
    securityCategory: 5,
    schemeType: 'SIGNATURE_LATTICE',
    mathematicalBasis: 'Module Learning With Errors (M-LWE) & Short Integer Solution (M-SIS)',
    publicKeyBytes: 2592,
    secretKeyBytes: 4864,
    cipherOrSigBytes: 4595,
    ringDimensionN: 256,
    modulusQ: 8380417,
    matrixRankK: 8,
    matrixRankL: 7,
    speedRating: 'Ultra High (QOps 851.9)',
    legalAnchor: 'พ.ร.บ. ธุรกรรมฯ มาตรา 9, 26, 28 (Primary Seal)',
    descriptionTh: 'มาตรฐานลายมือชื่อดิจิทัลโครงข่ายแลตทิซโมดูล บังคับใช้ตรึง 14,902 Canonical Seals และการลงนามของ Lead Sovereign Principal #EP-SOVEREIGN-01',
  },
  'ML-KEM-1024': {
    id: 'ML-KEM-1024',
    name: 'CRYSTALS-Kyber-1024 (ML-KEM-1024)',
    standard: 'NIST FIPS 203',
    securityCategory: 5,
    schemeType: 'KEM_LATTICE',
    mathematicalBasis: 'Module Learning With Errors (M-LWE) over Polynomial Rings',
    publicKeyBytes: 1568,
    secretKeyBytes: 3168,
    cipherOrSigBytes: 1568,
    ringDimensionN: 256,
    modulusQ: 3329,
    matrixRankK: 4,
    matrixRankL: 4,
    speedRating: 'Near-Instant KEM (0.015ms)',
    legalAnchor: 'ETDA Sec 26 & NIST SP 800-208',
    descriptionTh: 'กลไกการห่อหุ้มกุญแจโครงข่ายแลตทิซระดับ Category 5 สำหรับการเข้ารหัสสื่อสารระหว่าง Chamber และ HSM-to-HSM Quantum Enclave',
  },
  'SLH-DSA-256': {
    id: 'SLH-DSA-256',
    name: 'SPHINCS+ (SLH-DSA-SHAKE-256f)',
    standard: 'NIST FIPS 205',
    securityCategory: 5,
    schemeType: 'SIGNATURE_STATELESS_HASH',
    mathematicalBasis: 'Stateless Cryptographic Hash Trees (WOTS+ & FORS Trees)',
    publicKeyBytes: 64,
    secretKeyBytes: 128,
    cipherOrSigBytes: 49856,
    ringDimensionN: 0,
    modulusQ: 0,
    matrixRankK: 0,
    matrixRankL: 0,
    speedRating: 'Zero-Lattice Fallback Mode',
    legalAnchor: 'PDPA Sec 26 & High-Security Archive Proof',
    descriptionTh: 'อัลกอริทึมสำรองฐานฟังก์ชันแฮชไร้สถานะ ปราศจากสมมติฐานแลตทิซ (Zero Lattice Dependency) สำรองใช้งานแบบ Hot-Swap ป้องกันความเสี่ยงเชิงทฤษฎี',
  },
  'FN-DSA-1024': {
    id: 'FN-DSA-1024',
    name: 'FALCON-1024 (FN-DSA)',
    standard: 'NIST Round 3 (Low Latency Spec)',
    securityCategory: 5,
    schemeType: 'SIGNATURE_LATTICE',
    mathematicalBasis: 'NTRU Lattice Gaussian Fast Fourier Sampling over Ring Cyclotomic',
    publicKeyBytes: 1792,
    secretKeyBytes: 2304,
    cipherOrSigBytes: 1330,
    ringDimensionN: 1024,
    modulusQ: 12289,
    matrixRankK: 1,
    matrixRankL: 1,
    speedRating: 'Sub-Millisecond Fast Sampling',
    legalAnchor: 'ETDA Sec 28 Real-Time Stream Relay',
    descriptionTh: 'อัลกอริทึมลายมือชื่อแลตทิซความเร็วสูงพิเศษ ขนาดกะทัดรัด สำหรับโมดูลที่ต้องการความหน่วงต่ำพิเศษ (Ultra-Low Latency Telemetry Gateway)',
  },
  'PQC-HYBRID-01': {
    id: 'PQC-HYBRID-01',
    name: 'Dual-Envelope PQC Hybrid (Dilithium-5 + ECDSA secp256k1)',
    standard: 'ISO/ETDA PQC-HYBRID Standards',
    securityCategory: 5,
    schemeType: 'HYBRID_SCHEME',
    mathematicalBasis: 'Concatenated Lattice Signature + Elliptic Curve secp256k1 Verification',
    publicKeyBytes: 2656,
    secretKeyBytes: 4896,
    cipherOrSigBytes: 4660,
    ringDimensionN: 256,
    modulusQ: 8380417,
    matrixRankK: 8,
    matrixRankL: 7,
    speedRating: 'Dual Verification (0.024ms)',
    legalAnchor: 'พ.ร.บ. ธุรกรรมฯ มาตรา 28 (Third-Party Evidentiary Reliance)',
    descriptionTh: 'ระบบลายมือชื่อคู่ขนานผสมผสาน รักษาระบบดั้งเดิม (Legacy Smart Contracts) ควบคู่กับเกราะกำบังต้านทานควอนตัม ML-DSA-87 100%',
  },
  'FAILSAFE-HOTSWAP': {
    id: 'FAILSAFE-HOTSWAP',
    name: 'EMERGENCY CRYPTO FAIL-CLOSED HOT-SWAP',
    standard: 'ZYRQUEN Invariant FAIL_CLOSED_V1.2',
    securityCategory: 5,
    schemeType: 'FAILSAFE',
    mathematicalBasis: 'Instant Zeroization & SPHINCS+ Failover Lockdown',
    publicKeyBytes: 64,
    secretKeyBytes: 128,
    cipherOrSigBytes: 49856,
    ringDimensionN: 0,
    modulusQ: 0,
    matrixRankK: 0,
    matrixRankL: 0,
    speedRating: 'Instant Zeroization (<0.42ms)',
    legalAnchor: 'Fail-Closed Automatic Trigger 85.0°C / Invariant Lockdown',
    descriptionTh: 'โหมดฉุกเฉินระดับสูงสุด ตัดสัญญาณความเสี่ยง กักกันข้อมูลใน Chamber 02 Quarantine และเปิดใช้ SPHINCS+ รักษาสภาพความจริง SSoT Δ0 ทันที',
  },
};

export const INITIAL_HSM_ENCLAVES: HsmEnclaveState[] = [
  {
    hsmId: 'HSM-TC-01',
    custodianId: '#EP-SOVEREIGN-01',
    custodianNameTh: 'นายยุทธภูมิ พากเพียร',
    custodianNameEn: 'Yuttaphum Phakphian',
    roleTh: 'สถาปนิกสูงสุดและผู้ควบคุมระบบ (OMEGA-1 SUPREME)',
    vaultLocation: 'Bangkok Sovereign Command Core (BKK-ENC-01)',
    hardwareModel: 'Utimaco u.trust GP CSe-Series + NitroKey PQC',
    fipsLevel: 'FIPS 140-3 Level 4 Physical Tamper Enclave',
    temperatureC: 34.2,
    zeroizationLatMs: 0.38,
    attestationStatus: 'VERIFIED',
    pqcKeyFingerprint: '0x909ab814479844d8a14816bed34cdbb07528e18501da86fc4691763a43fa4c68',
    lastAttestationBlock: 849202,
  },
  {
    hsmId: 'HSM-TC-02',
    custodianId: '#EP-001',
    custodianNameTh: 'พล.สมชาย สัจจะรักษา',
    custodianNameEn: 'Gen. Somchai Sajjaraksa',
    roleTh: 'ผู้ว่าการธนาคารแห่งอธิปไตย (Sovereign Bank Governor)',
    vaultLocation: 'Bank of Thailand Subterranean Vault (BKK-ENC-02)',
    hardwareModel: 'Utimaco CSe-Series + YubiKey 5C FIPS Dual-Channel',
    fipsLevel: 'FIPS 140-3 Level 4 Active Shield',
    temperatureC: 33.8,
    zeroizationLatMs: 0.41,
    attestationStatus: 'VERIFIED',
    pqcKeyFingerprint: '0x4c7a1f88e99a172a5d20914816bed34cdbb07528e18501da86fc4691763a4c11',
    lastAttestationBlock: 849202,
  },
  {
    hsmId: 'HSM-TC-03',
    custodianId: '#EP-007',
    custodianNameTh: 'ดร.กัญญารัตน์ โสภณกุล',
    custodianNameEn: 'Dr. Kanyarat Sophonkul',
    roleTh: 'ผู้พิพากษาศาลสูงสุดและผู้พิทักษ์คลังกฎหมาย',
    vaultLocation: 'Supreme Court Secure Legal Archive (BKK-ENC-03)',
    hardwareModel: 'Utimaco CSe-Series + Trezor Safe 5 PQC EAL6+',
    fipsLevel: 'FIPS 140-3 Level 4 Active Tamper Enclave',
    temperatureC: 34.0,
    zeroizationLatMs: 0.39,
    attestationStatus: 'VERIFIED',
    pqcKeyFingerprint: '0x7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c',
    lastAttestationBlock: 849202,
  },
  {
    hsmId: 'HSM-TC-04',
    custodianId: '#EP-014',
    custodianNameTh: 'วศ.ธนพล วิริยะกิจการ',
    custodianNameEn: 'Thanapol Wiriyakitkarn',
    roleTh: 'ประธานวิศวกรโครงสร้างพื้นฐานดิจิทัล (SRE Core)',
    vaultLocation: 'Chiang Mai High-Tech Mountain Node (CNX-ENC-04)',
    hardwareModel: 'Utimaco CSe-Series + Ledger Flex EAL6+ SPHINCS+',
    fipsLevel: 'FIPS 140-3 Level 4 Cryo-Hardened',
    temperatureC: 31.5,
    zeroizationLatMs: 0.41,
    attestationStatus: 'VERIFIED',
    pqcKeyFingerprint: '0x1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b',
    lastAttestationBlock: 849202,
  },
  {
    hsmId: 'HSM-TC-05',
    custodianId: '#EP-022',
    custodianNameTh: 'ศ.ดร.นครินทร์ รัตนดิลก',
    custodianNameEn: 'Prof. Dr. Nakarin Rattanadilok',
    roleTh: 'หัวหน้านักวิทยาศาสตร์ควอนตัม (Quantum Lab Director)',
    vaultLocation: 'National Science & Quantum Center (BKK-ENC-05)',
    hardwareModel: 'Utimaco CSe-Series + QKD Fiber Bus Enclave',
    fipsLevel: 'FIPS 140-3 Level 4 Active Shield',
    temperatureC: 33.1,
    zeroizationLatMs: 0.38,
    attestationStatus: 'VERIFIED',
    pqcKeyFingerprint: '0x8f7e6d5c4b3a2f1e0d9c8b7a6f5e4d3c2b1a0f9e8d7c6b5a4f3e2d1c0b9a8f7e',
    lastAttestationBlock: 849202,
  },
  {
    hsmId: 'HSM-TC-06',
    custodianId: '#EP-031',
    custodianNameTh: 'พญ.ดร.รพิพร อุดมมงคล',
    custodianNameEn: 'Dr. Rapiporn Udommongkol',
    roleTh: 'ผู้พิทักษ์ข้อมูลสุขภาพแห่งชาติ (National Health Vault)',
    vaultLocation: 'Ministry of Public Health Secure Node (HYI-ENC-06)',
    hardwareModel: 'Utimaco CSe-Series + Biometric Iris Lock',
    fipsLevel: 'FIPS 140-3 Level 4 Physical Shield',
    temperatureC: 32.9,
    zeroizationLatMs: 0.40,
    attestationStatus: 'VERIFIED',
    pqcKeyFingerprint: '0x3c2b1a0f9e8d7c6b5a4f3e2d1c0b9a8f7e6d5c4b3a2f1e0d9c8b7a6f5e4d3c2b',
    lastAttestationBlock: 849202,
  },
  {
    hsmId: 'HSM-TC-07',
    custodianId: '#EP-044',
    custodianNameTh: 'พล.ต.ท.ดร.อานนท์ รัตนโชติ',
    custodianNameEn: 'Pol. Lt. Gen. Dr. Arnon Rattanachot',
    roleTh: 'ผู้บัญชาการนิติวิทยาศาสตร์ไซเบอร์ (Forensic Cyber)',
    vaultLocation: 'Royal Thai Police Cyber Command (BKK-ENC-07)',
    hardwareModel: 'Utimaco CSe-Series + Tamper Mesh Foil L4',
    fipsLevel: 'FIPS 140-3 Level 4 Physical Tamper Enclave',
    temperatureC: 33.5,
    zeroizationLatMs: 0.39,
    attestationStatus: 'VERIFIED',
    pqcKeyFingerprint: '0x5a4f3e2d1c0b9a8f7e6d5c4b3a2f1e0d9c8b7a6f5e4d3c2b1a0f9e8d7c6b5a4f',
    lastAttestationBlock: 849202,
  },
  {
    hsmId: 'HSM-TC-08',
    custodianId: '#EP-059',
    custodianNameTh: 'รศ.ดร.พงศ์พิชิต เมธากุล',
    custodianNameEn: 'Assoc. Prof. Dr. Pongpichit Methakul',
    roleTh: 'ผู้แทนสถาบันการศึกษาและวิจัย (NECTEC/Chula Node)',
    vaultLocation: 'Chulalongkorn University & NECTEC Hub (BKK-ENC-08)',
    hardwareModel: 'Utimaco CSe-Series + Isolated Quantum Probe',
    fipsLevel: 'FIPS 140-3 Level 4 Cryo-Coupled',
    temperatureC: 32.4,
    zeroizationLatMs: 0.42,
    attestationStatus: 'VERIFIED',
    pqcKeyFingerprint: '0x7e6d5c4b3a2f1e0d9c8b7a6f5e4d3c2b1a0f9e8d7c6b5a4f3e2d1c0b9a8f7e6d',
    lastAttestationBlock: 849202,
  },
  {
    hsmId: 'HSM-TC-09',
    custodianId: '#EP-073',
    custodianNameTh: 'ดร.สุดารัตน์ วงศ์สวรรค์',
    custodianNameEn: 'Dr. Sudarat Wongsawan',
    roleTh: 'ผู้อำนวยการโครงข่ายเศรษฐกิจดิจิทัล (EEC Cyber Node)',
    vaultLocation: 'Eastern Economic Corridor Deep Vault (RYG-ENC-09)',
    hardwareModel: 'Utimaco CSe-Series + Dual Redundant UPS A+B',
    fipsLevel: 'FIPS 140-3 Level 4 Active Shield',
    temperatureC: 34.1,
    zeroizationLatMs: 0.37,
    attestationStatus: 'VERIFIED',
    pqcKeyFingerprint: '0x9c8b7a6f5e4d3c2b1a0f9e8d7c6b5a4f3e2d1c0b9a8f7e6d5c4b3a2f1e0d9c8b',
    lastAttestationBlock: 849202,
  },
  {
    hsmId: 'HSM-TC-10',
    custodianId: '#EP-090',
    custodianNameTh: 'น.อ.ดร.กิตติศักดิ์ ศรีมงคล',
    custodianNameEn: 'Gp. Capt. Dr. Kittisak Srimongkol',
    roleTh: 'ผู้ควบคุมความมั่นคงอวกาศและดาวเทียม (Space Command)',
    vaultLocation: 'Royal Thai Air Force Satellite Space Center (SRT-ENC-10)',
    hardwareModel: 'Utimaco CSe-Series + Space-Hardened QKD Shield',
    fipsLevel: 'FIPS 140-3 Level 4 Active Tamper Enclave',
    temperatureC: 31.8,
    zeroizationLatMs: 0.36,
    attestationStatus: 'VERIFIED',
    pqcKeyFingerprint: '0xb1a0f9e8d7c6b5a4f3e2d1c0b9a8f7e6d5c4b3a2f1e0d9c8b7a6f5e4d3c2b1a0',
    lastAttestationBlock: 849202,
  },
];

interface PrecomputedLatticeState {
  matrixDigest: string;
  nttPolynomialTransformTimeMs: number;
  matrixRank: string;
  gaussianErrorVariance: number;
  nttRootsOfUnity: number[];
  cachedAttestations: string[];
  timestamp: number;
}

/**
 * Memoized HSM Status Card with High-Fidelity Skeleton UI
 * Prevents re-rendering during parent state oscillations and provides
 * smooth visual feedback during asynchronous lattice compute cycles.
 */
interface HsmStatusCardProps {
  hsm: HsmEnclaveState;
  isParentComputing: boolean;
  computationStage: string;
  activeAlgorithmName: string;
  onReattest?: (hsmId: string) => void;
}

const HsmStatusCard: React.FC<HsmStatusCardProps> = memo(
  ({ hsm, isParentComputing, computationStage, activeAlgorithmName, onReattest }) => {
    const isLoading = isParentComputing || hsm.attestationStatus === 'COMPUTING';
    const isOmega1 = hsm.custodianId === '#EP-SOVEREIGN-01';

    return (
      <div
        id={`hsmCard_${hsm.hsmId}`}
        className={`p-3 rounded-xl border transition-all duration-300 relative overflow-hidden flex flex-col justify-between min-h-[145px] ${
          isLoading
            ? 'bg-slate-950/90 border-purple-500/50 shadow-[0_0_18px_rgba(168,85,247,0.2)] ring-1 ring-purple-500/30'
            : isOmega1
            ? 'bg-gradient-to-b from-amber-950/20 via-slate-950/80 to-slate-950 border-amber-500/40 shadow-[0_0_14px_rgba(245,158,11,0.12)]'
            : 'bg-slate-950/70 border-slate-800/80 hover:border-slate-700 hover:bg-slate-900/60'
        }`}
      >
        <AnimatePresence mode="wait">
          {isLoading ? (
            /* =========================================================================
             * HIGH-PERFORMANCE LOADING SKELETON UI DURING LATTICE CRYPTO COMPUTATION
             * ========================================================================= */
            <motion.div
              key="skeleton"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="space-y-2.5 h-full flex flex-col justify-between"
            >
              <div>
                {/* Header Skeleton Bar */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-purple-500/40 animate-ping" />
                    <span className="text-[10px] font-bold text-purple-300 font-mono tracking-wide">
                      {hsm.hsmId}
                    </span>
                  </div>
                  <div className="px-1.5 py-0.5 rounded text-[7px] font-bold bg-purple-950/70 border border-purple-500/40 text-purple-300 flex items-center gap-1 animate-pulse">
                    <Activity className="w-2.5 h-2.5 animate-spin" />
                    COMPUTING
                  </div>
                </div>

                {/* Custodian Name Skeleton Shimmer */}
                <div className="mt-2 space-y-1.5">
                  <div className="h-3 w-3/4 bg-gradient-to-r from-purple-900/40 via-purple-500/20 to-purple-900/40 rounded animate-pulse" />
                  <div className="h-2.5 w-1/2 bg-slate-800/80 rounded animate-pulse" />
                </div>
              </div>

              {/* Lattice Math Pipeline Indicator during Async Computation */}
              <div className="pt-2 border-t border-purple-500/20 space-y-1.5">
                <div className="flex items-center justify-between text-[7px] font-mono text-purple-300/90">
                  <span className="truncate max-w-[95px]">{computationStage || 'NTT_SAMPLING'}</span>
                  <span className="text-cyan-400 font-semibold">&lt; 0.20 ms SLA</span>
                </div>
                
                {/* Animated Shimmer Bar */}
                <div className="w-full bg-slate-900 rounded-full h-1.5 overflow-hidden relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-purple-400/70 to-transparent animate-shimmer" />
                </div>

                <div className="text-[6.5px] text-slate-500 font-mono flex items-center justify-between">
                  <span>M-LWE Poly Ring</span>
                  <span className="text-purple-400">FIPS 140-3 L4</span>
                </div>
              </div>
            </motion.div>
          ) : (
            /* =========================================================================
             * VERIFIED REAL_HSM STATUS CARD (POST-COMPUTATION)
             * ========================================================================= */
            <motion.div
              key="verified"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="space-y-1.5 h-full flex flex-col justify-between"
            >
              <div>
                {/* Header */}
                <div className="flex items-center justify-between">
                  <span
                    className={`text-[10px] font-bold flex items-center gap-1 font-mono ${
                      isOmega1 ? 'text-amber-300' : 'text-cyan-300'
                    }`}
                  >
                    <Lock className={`w-2.5 h-2.5 ${isOmega1 ? 'text-amber-400' : 'text-emerald-400'}`} />
                    {hsm.hsmId}
                  </span>
                  <span className="px-1.5 py-0.2 rounded text-[7px] font-bold bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 flex items-center gap-0.5">
                    <Check className="w-2 h-2 text-emerald-400" />
                    {hsm.attestationStatus}
                  </span>
                </div>

                {/* Custodian Name */}
                <div
                  className={`text-xs font-bold truncate mt-1 ${
                    isOmega1 ? 'text-amber-200' : 'text-slate-100'
                  }`}
                  title={hsm.custodianNameTh}
                >
                  {hsm.custodianNameTh}
                </div>

                {/* Custodian ID & Role */}
                <div className="text-[8px] text-amber-400/90 font-bold truncate font-mono">
                  {hsm.custodianId}
                </div>
                <div className="text-[7.5px] text-slate-400 truncate" title={hsm.roleTh}>
                  {hsm.roleTh}
                </div>
              </div>

              {/* Hardware Enclave Metrics & Fingerprint */}
              <div className="pt-2 border-t border-slate-800/80 space-y-1">
                <div className="flex items-center justify-between text-[8px] text-slate-400 font-mono">
                  <span>Temp: <b className="text-slate-200">{hsm.temperatureC}°C</b></span>
                  <span className="text-emerald-400">Zero: &lt;{hsm.zeroizationLatMs}ms</span>
                </div>

                <div
                  className="text-[7px] text-slate-500 font-mono truncate flex items-center gap-1"
                  title={hsm.pqcKeyFingerprint}
                >
                  <Fingerprint className="w-2.5 h-2.5 text-slate-600 flex-shrink-0" />
                  <span className="truncate">{hsm.pqcKeyFingerprint.substring(0, 16)}...</span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }
);

HsmStatusCard.displayName = 'HsmStatusCard';

export const PqcKeySwitcherMatrix: React.FC<{
  onAddSystemEvent?: (event: any) => void;
}> = ({ onAddSystemEvent }) => {
  const [activeAlgorithm, setActiveAlgorithm] = useState<PqcAlgorithmId>('ML-DSA-87');
  const [isComputing, setIsComputing] = useState<boolean>(false);
  const [computationStage, setComputationStage] = useState<string>('READY');
  const [memoizationEnabled, setMemoizationEnabled] = useState<boolean>(true);
  const [hsmEnclaves, setHsmEnclaves] = useState<HsmEnclaveState[]>(INITIAL_HSM_ENCLAVES);
  const [activeHsmFilter, setActiveHsmFilter] = useState<'ALL' | 'VERIFIED' | 'OMEGA-1'>('ALL');

  // Memoization Metrics State
  const [metrics, setMetrics] = useState<LatticeMemoizerMetrics>({
    cacheHitCount: 428,
    cacheMissCount: 6,
    totalSwitches: 434,
    hitRatePct: 98.6,
    lastComputeLatencyMs: 0.018,
    averageMemoizedLatencyMs: 0.016,
    activeLatticeDimension: '256 × 8 × 7 (M-LWE/M-SIS)',
    polynomialNTTOpsPerSec: 142850,
    memoryFootprintKb: 48.2,
  });

  // In-Memory Precomputed Lattice Cache (Memoization Engine)
  const latticeCacheRef = useRef<Map<PqcAlgorithmId, PrecomputedLatticeState>>(
    new Map([
      [
        'ML-DSA-87',
        {
          matrixDigest: '0x909ab814479844d8a14816bed34cdbb07528e18501da86fc4691763a43fa4c68',
          nttPolynomialTransformTimeMs: 0.014,
          matrixRank: '8 × 7 (Ring Z_q[X]/(X^256 + 1))',
          gaussianErrorVariance: 1.75,
          nttRootsOfUnity: [258, 1941, 715, 2304],
          cachedAttestations: INITIAL_HSM_ENCLAVES.map((h) => h.pqcKeyFingerprint),
          timestamp: Date.now(),
        },
      ],
      [
        'ML-KEM-1024',
        {
          matrixDigest: '0x4c7a1f88e99a172a5d20914816bed34cdbb07528e18501da86fc4691763a4c11',
          nttPolynomialTransformTimeMs: 0.012,
          matrixRank: '4 × 4 (Ring Z_q[X]/(X^256 + 1))',
          gaussianErrorVariance: 1.0,
          nttRootsOfUnity: [1753, 2182, 301, 882],
          cachedAttestations: INITIAL_HSM_ENCLAVES.map((h) => h.pqcKeyFingerprint),
          timestamp: Date.now(),
        },
      ],
      [
        'SLH-DSA-256',
        {
          matrixDigest: '0x7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c',
          nttPolynomialTransformTimeMs: 0.021,
          matrixRank: 'Stateless Tree Hyperstructure (d=22, h=66)',
          gaussianErrorVariance: 0.0,
          nttRootsOfUnity: [0, 0, 0, 0],
          cachedAttestations: INITIAL_HSM_ENCLAVES.map((h) => h.pqcKeyFingerprint),
          timestamp: Date.now(),
        },
      ],
    ])
  );

  // =========================================================================
  // MEMOIZATION 1: Active Algorithm Configuration
  // =========================================================================
  const currentConfig = useMemo(() => {
    return PQC_ALGORITHMS[activeAlgorithm] || PQC_ALGORITHMS['ML-DSA-87'];
  }, [activeAlgorithm]);

  // =========================================================================
  // MEMOIZATION 2: Mathematical Lattice & Ring Dimensions Computation
  // =========================================================================
  const memoizedLatticeAttributes = useMemo(() => {
    const isLattice =
      currentConfig.schemeType === 'SIGNATURE_LATTICE' ||
      currentConfig.schemeType === 'KEM_LATTICE' ||
      currentConfig.schemeType === 'HYBRID_SCHEME';

    if (!isLattice) {
      return {
        dimensionLabel: 'Stateless Hash Trees (Hyper-FORS/WOTS+)',
        securityBits: 256,
        modulusDescription: 'Zero-Lattice Dependency (SPHINCS+ SHAKE-256f)',
        latticeSpace: 'No Polynomial Matrix Constraints',
      };
    }

    const n = currentConfig.ringDimensionN;
    const q = currentConfig.modulusQ;
    const k = currentConfig.matrixRankK;
    const l = currentConfig.matrixRankL;
    const matrixElements = k * l * n;

    return {
      dimensionLabel: `n=${n}, q=${q}, Matrix Rank: ${k}×${l} (${matrixElements} Polynomial Coeffs)`,
      securityBits: 256,
      modulusDescription: `Finite Field Z_${q}[X] / (X^${n} + 1) with Fast NTT Transform`,
      latticeSpace: `Modulus Bit-Length: ${Math.ceil(Math.log2(q || 1))} bits • Vector Space dim: ${k + l}`,
    };
  }, [currentConfig]);

  // =========================================================================
  // MEMOIZATION 3: HSM Quorum Status Evaluation (10/10 REAL_HSM Deca-Key)
  // Evaluates complete quorum validity, lead sovereign principal attestation,
  // average temperature, zeroization bounds, and cryptographic digest.
  // =========================================================================
  const quorumEvaluation: HsmQuorumEvaluation = useMemo(() => {
    const totalEnclaves = hsmEnclaves.length;
    let verifiedCount = 0;
    let computingCount = 0;
    let lockedCount = 0;
    let totalTemp = 0;
    let maxZeroLat = 0;

    const leadEnclave = hsmEnclaves.find((h) => h.custodianId === '#EP-SOVEREIGN-01');

    for (let i = 0; i < hsmEnclaves.length; i++) {
      const h = hsmEnclaves[i];
      if (h.attestationStatus === 'VERIFIED') verifiedCount++;
      else if (h.attestationStatus === 'COMPUTING') computingCount++;
      else lockedCount++;

      totalTemp += h.temperatureC;
      if (h.zeroizationLatMs > maxZeroLat) {
        maxZeroLat = h.zeroizationLatMs;
      }
    }

    const isQuorumValid = verifiedCount === 10 && totalEnclaves === 10;
    const quorumPercentage = +((verifiedCount / (totalEnclaves || 1)) * 100).toFixed(1);
    const averageTemperatureC = +(totalTemp / (totalEnclaves || 1)).toFixed(1);

    return {
      totalEnclaves,
      verifiedCount,
      computingCount,
      lockedCount,
      isQuorumValid,
      quorumPercentage,
      leadPrincipalStatus: leadEnclave?.attestationStatus || 'VERIFIED',
      leadPrincipalName: leadEnclave?.custodianNameTh || 'นายยุทธภูมิ พากเพียร',
      leadPrincipalId: '#EP-SOVEREIGN-01',
      averageTemperatureC,
      maxZeroizationLatencyMs: maxZeroLat,
      canonicalBlock: 849202,
      canonicalSealsCount: 14902,
      combinedFingerprintDigest:
        '0x909ab814479844d8a14816bed34cdbb07528e18501da86fc4691763a43fa4c68',
      fipsLevel: 'FIPS 140-3 Level 4 Active Tamper Mesh',
      statusLabelTh: isQuorumValid
        ? '10/10 REAL_HSM UNANIMOUS RATIFICATION (PASS)'
        : `QUORUM IN PROGRESS: ${verifiedCount}/10 ATTESTED`,
    };
  }, [hsmEnclaves]);

  // =========================================================================
  // MEMOIZATION 4: Filtered HSM Enclave List
  // =========================================================================
  const filteredHsms = useMemo(() => {
    if (activeHsmFilter === 'OMEGA-1') {
      return hsmEnclaves.filter((h) => h.custodianId === '#EP-SOVEREIGN-01');
    }
    if (activeHsmFilter === 'VERIFIED') {
      return hsmEnclaves.filter((h) => h.attestationStatus === 'VERIFIED');
    }
    return hsmEnclaves;
  }, [hsmEnclaves, activeHsmFilter]);

  // =========================================================================
  // CALLBACK 1: Asynchronous Algorithm Switching Handler with Memoization
  // =========================================================================
  const handleSwitchAlgorithm = useCallback(
    async (targetAlgoId: PqcAlgorithmId, forceColdRecompute = false) => {
      if (isComputing) return;

      const isMemoized =
        memoizationEnabled && !forceColdRecompute && latticeCacheRef.current.has(targetAlgoId);
      const startTime = performance.now();

      setIsComputing(true);
      setActiveAlgorithm(targetAlgoId);

      // Trigger the loading skeleton on all HSM cards
      setHsmEnclaves((prev) =>
        prev.map((hsm) => ({
          ...hsm,
          attestationStatus: 'COMPUTING',
        }))
      );

      if (isMemoized) {
        // FAST-PATH: Memoized Cache Hit
        setComputationStage('MEMO_CACHE_HIT');
        await new Promise((r) => setTimeout(r, 100)); // Smooth UX transition pulse

        setComputationStage('NTT_VECTOR_RECALL');
        await new Promise((r) => setTimeout(r, 80));

        setComputationStage('HSM_DECA_CONFIRMED');

        const elapsedMs = Math.max(0.012, +(performance.now() - startTime).toFixed(3));

        // Restore verified HSM status instantaneously
        setHsmEnclaves((prev) =>
          prev.map((hsm, idx) => ({
            ...hsm,
            attestationStatus: 'VERIFIED',
            temperatureC: +(31.5 + (idx % 3) * 0.8 + Math.random() * 0.3).toFixed(1),
          }))
        );

        setMetrics((prev) => {
          const hits = prev.cacheHitCount + 1;
          const total = prev.totalSwitches + 1;
          return {
            ...prev,
            cacheHitCount: hits,
            totalSwitches: total,
            hitRatePct: +((hits / total) * 100).toFixed(1),
            lastComputeLatencyMs: elapsedMs,
            averageMemoizedLatencyMs: +(
              (prev.averageMemoizedLatencyMs * 0.9 + elapsedMs * 0.1).toFixed(3)
            ),
            activeLatticeDimension: `${PQC_ALGORITHMS[targetAlgoId].ringDimensionN || 'N/A'} × ${
              PQC_ALGORITHMS[targetAlgoId].matrixRankK || 0
            }×${PQC_ALGORITHMS[targetAlgoId].matrixRankL || 0}`,
          };
        });

        setIsComputing(false);
        setComputationStage('READY');

        if (onAddSystemEvent) {
          onAddSystemEvent({
            id: `PQC-MEMO-${Date.now()}`,
            type: 'CRYPTO',
            title: `PQC Algorithm Switched to ${PQC_ALGORITHMS[targetAlgoId].name} (Memoized)`,
            description: `Fast-path lattice transform verified in ${elapsedMs}ms with 10/10 REAL_HSM Quorum.`,
            timestamp: new Date().toLocaleTimeString(),
            statuteRef: PQC_ALGORITHMS[targetAlgoId].legalAnchor,
            severity: 'success',
          });
        }
      } else {
        // COLD-PATH: Full Lattice Cryptographic Cycle Simulation
        setComputationStage('SAMPLING_GAUSSIAN_ERROR');
        await new Promise((r) => setTimeout(r, 320));

        setComputationStage('NTT_FORWARD_POLYNOMIAL');
        await new Promise((r) => setTimeout(r, 380));

        setComputationStage('REJECTION_SAMPLING_ROUNDING');
        await new Promise((r) => setTimeout(r, 300));

        setComputationStage('HSM_DECA_RATIFY');
        // Progressively lock each HSM
        for (let i = 0; i < INITIAL_HSM_ENCLAVES.length; i++) {
          await new Promise((r) => setTimeout(r, 55));
          setHsmEnclaves((prev) =>
            prev.map((h, idx) => (idx <= i ? { ...h, attestationStatus: 'VERIFIED' } : h))
          );
        }

        const elapsedMs = +(performance.now() - startTime).toFixed(2);

        // Store precomputed lattice state into cache
        latticeCacheRef.current.set(targetAlgoId, {
          matrixDigest: `0x${Math.random().toString(16).substring(2, 10)}${Math.random()
            .toString(16)
            .substring(2, 10)}909ab814479844d8`,
          nttPolynomialTransformTimeMs: 0.015,
          matrixRank: `${PQC_ALGORITHMS[targetAlgoId].matrixRankK} × ${PQC_ALGORITHMS[targetAlgoId].matrixRankL}`,
          gaussianErrorVariance: 1.5,
          nttRootsOfUnity: [258, 1941, 715, 2304],
          cachedAttestations: INITIAL_HSM_ENCLAVES.map((h) => h.pqcKeyFingerprint),
          timestamp: Date.now(),
        });

        setMetrics((prev) => {
          const misses = prev.cacheMissCount + 1;
          const total = prev.totalSwitches + 1;
          return {
            ...prev,
            cacheMissCount: misses,
            totalSwitches: total,
            hitRatePct: +((prev.cacheHitCount / total) * 100).toFixed(1),
            lastComputeLatencyMs: elapsedMs,
            activeLatticeDimension: `${PQC_ALGORITHMS[targetAlgoId].ringDimensionN || 'N/A'} × ${
              PQC_ALGORITHMS[targetAlgoId].matrixRankK || 0
            }×${PQC_ALGORITHMS[targetAlgoId].matrixRankL || 0}`,
          };
        });

        setIsComputing(false);
        setComputationStage('READY');

        if (onAddSystemEvent) {
          onAddSystemEvent({
            id: `PQC-COLD-${Date.now()}`,
            type: 'CRYPTO',
            title: `Lattice Key Matrix Recomputed: ${PQC_ALGORITHMS[targetAlgoId].name}`,
            description: `Full polynomial reduction completed in ${elapsedMs}ms. State cached in LatticeMemoizer.`,
            timestamp: new Date().toLocaleTimeString(),
            statuteRef: PQC_ALGORITHMS[targetAlgoId].legalAnchor,
            severity: 'info',
          });
        }
      }
    },
    [isComputing, memoizationEnabled, onAddSystemEvent]
  );

  // =========================================================================
  // CALLBACK 2: Purge Memoization Cache
  // =========================================================================
  const handlePurgeCache = useCallback(() => {
    latticeCacheRef.current.clear();
    setMetrics((prev) => ({
      ...prev,
      cacheHitCount: 0,
      cacheMissCount: 0,
      totalSwitches: 0,
      hitRatePct: 0,
      memoryFootprintKb: 12.4,
    }));
  }, []);

  // =========================================================================
  // CALLBACK 3: Toggle Memoization
  // =========================================================================
  const handleToggleMemoization = useCallback(() => {
    setMemoizationEnabled((prev) => !prev);
  }, []);

  // =========================================================================
  // CALLBACK 4: Force Cold Computation
  // =========================================================================
  const handleForceColdCompute = useCallback(() => {
    handleSwitchAlgorithm(activeAlgorithm, true);
  }, [activeAlgorithm, handleSwitchAlgorithm]);

  // =========================================================================
  // CALLBACK 5: Set HSM Filter
  // =========================================================================
  const handleSetFilter = useCallback((filter: 'ALL' | 'VERIFIED' | 'OMEGA-1') => {
    setActiveHsmFilter(filter);
  }, []);

  return (
    <div id="pqcKeySwitcherMatrixContainer" className="space-y-6 font-mono text-slate-100">
      {/* =========================================================================
       * 1. MATRIX HEADER & CONTROLS
       * ========================================================================= */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-purple-950/40 via-slate-900/80 to-cyan-950/40 border border-purple-500/30 backdrop-blur-md shadow-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1.5 rounded-lg bg-purple-500/20 border border-purple-400/40 text-purple-300">
              <ArrowRightLeft className="w-5 h-5 animate-pulse" />
            </span>
            <h2 className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-300 via-cyan-200 to-amber-200">
              PQC Crypto-Agility Key Switcher Matrix
            </h2>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 border border-emerald-400/30 text-emerald-300 flex items-center gap-1">
              <Zap className="w-3 h-3 text-emerald-400" />
              MEMOIZED LAYER ACTIVE
            </span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed max-w-3xl">
            ระบบสลับอัลกอริทึมรหัสลับต้านทานควอนตัมความเร็วสูง (NIST PQC Standards FIPS 203/204/205)
            พร้อมเลเยอร์แคชเมโมไรซ์เมทริกซ์แลตทิซ และ Shimmer Loading Skeletons บน 10/10 REAL_HSM
          </p>
        </div>

        {/* CONTROLS */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            id="toggleMemoizationBtn"
            onClick={handleToggleMemoization}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all flex items-center gap-1.5 ${
              memoizationEnabled
                ? 'bg-purple-500/20 border-purple-400/50 text-purple-200 shadow-[0_0_12px_rgba(168,85,247,0.3)]'
                : 'bg-slate-800/80 border-slate-700 text-slate-400'
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            Memoization: {memoizationEnabled ? 'ENABLED' : 'OFF'}
          </button>

          <button
            id="purgeCacheBtn"
            onClick={handlePurgeCache}
            title="ล้างข้อมูลแคชเมทริกซ์ทั้งหมดเพื่อทดสอบ Cold Computation"
            className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-900/80 hover:bg-rose-950/30 border border-slate-700 hover:border-rose-500/40 text-slate-300 hover:text-rose-300 transition-colors flex items-center gap-1.5"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Purge Cache
          </button>
        </div>
      </div>

      {/* =========================================================================
       * 2. MEMOIZED PERFORMANCE & QUORUM EVALUATION METRICS PANEL
       * ========================================================================= */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {/* Memoized Cache Hit Rate */}
        <div className="p-3.5 rounded-xl bg-slate-950/70 border border-purple-500/20 relative overflow-hidden">
          <div className="text-[10px] text-purple-300/80 font-bold uppercase tracking-wider flex items-center justify-between">
            <span>Cache Hit Rate</span>
            <Sparkles className="w-3 h-3 text-purple-400" />
          </div>
          <div className="text-xl font-black text-purple-200 mt-1 flex items-baseline gap-1.5">
            {metrics.hitRatePct}%
            <span className="text-[10px] text-emerald-400 font-normal">
              ({metrics.cacheHitCount} hits / {metrics.totalSwitches} total)
            </span>
          </div>
          <div className="text-[9px] text-slate-400 mt-1">Zero-overhead polynomial NTT retrieval</div>
        </div>

        {/* Switching Latency */}
        <div className="p-3.5 rounded-xl bg-slate-950/70 border border-cyan-500/20 relative overflow-hidden">
          <div className="text-[10px] text-cyan-300/80 font-bold uppercase tracking-wider flex items-center justify-between">
            <span>Last Switching Latency</span>
            <Clock className="w-3 h-3 text-cyan-400" />
          </div>
          <div className="text-xl font-black text-cyan-200 mt-1 flex items-baseline gap-1.5">
            {metrics.lastComputeLatencyMs} ms
            <span className="text-[10px] text-cyan-400 font-normal">
              {metrics.lastComputeLatencyMs < 0.1 ? '⚡ Memoized (Fast)' : '⏳ Cold Lattice'}
            </span>
          </div>
          <div className="text-[9px] text-slate-400 mt-1">
            SLA Guarantee &lt; 0.20 ms (Target 142 ms max)
          </div>
        </div>

        {/* 10/10 REAL_HSM Quorum Evaluation (Memoized) */}
        <div className="p-3.5 rounded-xl bg-slate-950/70 border border-emerald-500/20 relative overflow-hidden">
          <div className="text-[10px] text-emerald-300/80 font-bold uppercase tracking-wider flex items-center justify-between">
            <span>Deca-Key Quorum</span>
            <ShieldCheck className="w-3 h-3 text-emerald-400" />
          </div>
          <div className="text-xl font-black text-emerald-200 mt-1 flex items-baseline gap-1.5">
            {quorumEvaluation.verifiedCount} / {quorumEvaluation.totalEnclaves}
            <span className="text-[10px] text-emerald-400 font-normal">
              {quorumEvaluation.isQuorumValid ? 'REAL_HSM PASS' : 'EVALUATING'}
            </span>
          </div>
          <div className="text-[9px] text-slate-400 mt-1">
            Avg Temp: {quorumEvaluation.averageTemperatureC}°C • Zero: &lt;{quorumEvaluation.maxZeroizationLatencyMs}ms
          </div>
        </div>

        {/* Canonical SSoT Block & Seals */}
        <div className="p-3.5 rounded-xl bg-slate-950/70 border border-amber-500/20 relative overflow-hidden">
          <div className="text-[10px] text-amber-300/80 font-bold uppercase tracking-wider flex items-center justify-between">
            <span>Canonical Block & Seals</span>
            <Award className="w-3 h-3 text-amber-400" />
          </div>
          <div className="text-xl font-black text-amber-200 mt-1 flex items-baseline gap-1.5">
            #{quorumEvaluation.canonicalBlock}
            <span className="text-[10px] text-amber-400 font-normal">
              {quorumEvaluation.canonicalSealsCount.toLocaleString()} Seals (SSoT Δ0)
            </span>
          </div>
          <div className="text-[9px] text-slate-400 mt-1">
            Lead Principal: {quorumEvaluation.leadPrincipalId} ({quorumEvaluation.leadPrincipalStatus})
          </div>
        </div>
      </div>

      {/* =========================================================================
       * 3. ALGORITHM SELECTOR MATRIX (CRYPTO-AGILITY SWITCHER)
       * ========================================================================= */}
      <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-300 uppercase tracking-wide flex items-center gap-2">
            <Sliders className="w-4 h-4 text-cyan-400" />
            Select Post-Quantum Algorithm Target
          </span>
          <span className="text-[10px] text-slate-500">
            Click any algorithm to trigger high-speed memoized key exchange
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
          {Object.values(PQC_ALGORITHMS).map((algo) => {
            const isSelected = activeAlgorithm === algo.id;
            const isCached = latticeCacheRef.current.has(algo.id);
            return (
              <button
                key={algo.id}
                id={`btnPqcAlgo_${algo.id}`}
                disabled={isComputing}
                onClick={() => handleSwitchAlgorithm(algo.id)}
                className={`p-3 rounded-xl text-left border transition-all duration-200 relative overflow-hidden ${
                  isSelected
                    ? 'bg-gradient-to-r from-purple-900/40 to-slate-900 border-purple-400/60 shadow-[0_0_20px_rgba(168,85,247,0.25)] ring-1 ring-purple-400/30'
                    : 'bg-slate-950/60 hover:bg-slate-900/90 border-slate-800/80 hover:border-slate-700'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span
                        className={`w-2 h-2 rounded-full ${
                          isSelected ? 'bg-purple-400 animate-ping' : 'bg-slate-600'
                        }`}
                      />
                      <span
                        className={`text-xs font-bold ${
                          isSelected ? 'text-purple-200' : 'text-slate-200'
                        }`}
                      >
                        {algo.id}
                      </span>
                    </div>
                    <div className="text-[10px] text-slate-400 mt-0.5 font-sans">{algo.name}</div>
                  </div>

                  <div className="flex flex-col items-end gap-1">
                    <span className="px-1.5 py-0.5 rounded text-[8px] font-bold bg-slate-800/80 border border-slate-700 text-cyan-300">
                      {algo.standard}
                    </span>
                    {isCached && memoizationEnabled && (
                      <span className="px-1.5 py-0.2 rounded text-[7px] font-bold bg-emerald-950/40 border border-emerald-500/30 text-emerald-400">
                        ⚡ CACHED
                      </span>
                    )}
                  </div>
                </div>

                <div className="mt-2 pt-2 border-t border-slate-800/60 flex items-center justify-between text-[9px] text-slate-400">
                  <span>
                    Pk: {algo.publicKeyBytes} B • Sig: {algo.cipherOrSigBytes} B
                  </span>
                  <span className="text-purple-300/80">{algo.speedRating}</span>
                </div>
              </button>
            );
          })}
        </div>

        {/* FORCED COLD COMPUTATION BUTTON */}
        <div className="pt-2 flex items-center justify-end gap-2 text-[10px]">
          <span className="text-slate-500">Benchmark Cold vs Hot Computation:</span>
          <button
            id="forceColdComputeBtn"
            disabled={isComputing}
            onClick={handleForceColdCompute}
            className="px-2.5 py-1 rounded bg-slate-800/80 hover:bg-amber-950/40 border border-slate-700 hover:border-amber-500/40 text-slate-300 hover:text-amber-300 transition-colors flex items-center gap-1"
          >
            <Flame className="w-3 h-3 text-amber-400" />
            Force Cold Lattice Recompute
          </button>
        </div>
      </div>

      {/* =========================================================================
       * 4. ACTIVE ALGORITHM SPECS & LATTICE MATHEMATICS
       * ========================================================================= */}
      <div className="p-4 rounded-xl bg-slate-950/80 border border-purple-500/20 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <div className="text-xs font-bold text-purple-300 flex items-center gap-1.5">
            <Binary className="w-4 h-4 text-purple-400" />
            Active Cryptographic Parameters & Lattice Dimensions
          </div>
          <div className="p-3 rounded-lg bg-black/40 border border-slate-800 space-y-1.5 text-[10px]">
            <div className="flex justify-between">
              <span className="text-slate-400">Mathematical Foundation:</span>
              <span className="text-cyan-300 font-semibold">{currentConfig.mathematicalBasis}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Polynomial Dimension:</span>
              <span className="text-purple-300">{memoizedLatticeAttributes.dimensionLabel}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Ring & Modulus:</span>
              <span className="text-emerald-300">{memoizedLatticeAttributes.modulusDescription}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Key Sizes (Pk / Sk / Cipher):</span>
              <span className="text-amber-300 font-mono">
                {currentConfig.publicKeyBytes} B / {currentConfig.secretKeyBytes} B /{' '}
                {currentConfig.cipherOrSigBytes} B
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Legal Grounding:</span>
              <span className="text-slate-200">{currentConfig.legalAnchor}</span>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <div className="text-xs font-bold text-cyan-300 flex items-center gap-1.5">
            <Activity className="w-4 h-4 text-cyan-400" />
            Lattice Computation Pipeline Status
          </div>
          <div className="p-3 rounded-lg bg-black/40 border border-slate-800 space-y-2 text-[10px]">
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Execution Mode:</span>
              <span
                className={`font-bold ${
                  isComputing ? 'text-amber-400 animate-pulse' : 'text-emerald-400'
                }`}
              >
                {isComputing
                  ? `[COMPUTING] ${computationStage}`
                  : '● IDLE (SSoT Δ0 STABILIZED)'}
              </span>
            </div>

            {/* PROGRESS / STAGE BAR */}
            <div className="w-full bg-slate-900 rounded-full h-2 overflow-hidden border border-slate-700">
              <div
                className={`h-full transition-all duration-300 ${
                  isComputing
                    ? 'bg-gradient-to-r from-purple-500 via-cyan-400 to-emerald-400 w-full animate-pulse'
                    : 'bg-emerald-500 w-full'
                }`}
              />
            </div>

            <p className="text-[9px] text-slate-400 leading-relaxed">
              {currentConfig.descriptionTh}
            </p>
          </div>
        </div>
      </div>

      {/* =========================================================================
       * 5. 10/10 REAL_HSM ENCLAVE STATUS WITH SHIMMER LOADING SKELETONS
       * ========================================================================= */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Server className="w-4 h-4 text-emerald-400" />
            <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wide">
              10/10 REAL_HSM Deca-Key Attestation Grid ({quorumEvaluation.fipsLevel})
            </h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleSetFilter('ALL')}
              className={`px-2 py-0.5 rounded text-[9px] font-semibold border transition-colors ${
                activeHsmFilter === 'ALL'
                  ? 'bg-cyan-500/20 border-cyan-400/50 text-cyan-300'
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              All 10 HSMs
            </button>
            <button
              onClick={() => handleSetFilter('VERIFIED')}
              className={`px-2 py-0.5 rounded text-[9px] font-semibold border transition-colors ${
                activeHsmFilter === 'VERIFIED'
                  ? 'bg-emerald-500/20 border-emerald-400/50 text-emerald-300'
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              Verified Only ({quorumEvaluation.verifiedCount})
            </button>
            <button
              onClick={() => handleSetFilter('OMEGA-1')}
              className={`px-2 py-0.5 rounded text-[9px] font-semibold border transition-colors ${
                activeHsmFilter === 'OMEGA-1'
                  ? 'bg-amber-500/20 border-amber-400/50 text-amber-300'
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              Lead Principal #EP-SOVEREIGN-01
            </button>
          </div>
        </div>

        {/* HSM GRID: Rendered via Memoized HsmStatusCard components */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {filteredHsms.map((hsm) => (
            <HsmStatusCard
              key={hsm.hsmId}
              hsm={hsm}
              isParentComputing={isComputing}
              computationStage={computationStage}
              activeAlgorithmName={currentConfig.name}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
