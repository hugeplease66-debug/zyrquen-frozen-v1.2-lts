/**
 * ZYRQUEN Ω∞ Chamber Registry Data
 * Mapped registry health state for all 18 Chambers (CH-01 to CH-18).
 * Health States: 'Nominal' (🟢), 'Drift Detected' (🟡), 'Lockdown' (🔴)
 */

export type ChamberHealthState = 'Nominal' | 'Drift Detected' | 'Lockdown';

export interface ChamberRegistryEntry {
  chamberNum: number;
  chamberId: string;
  nameTh: string;
  nameEn: string;
  health: ChamberHealthState;
  indicator: '🟢' | '🟡' | '🔴';
  lastChecked: string;
  healthScorePct: number;
  latencyMs: number;
  enclaveName: string;
  securityDomain: string;
  auditEvidenceRef: string;
  detailsTh: string;
  detailsEn: string;
}

export const CHAMBERS_REGISTRY_DATA: Record<number, ChamberRegistryEntry> = {
  1: {
    chamberNum: 1,
    chamberId: 'CH-01',
    nameTh: 'แกนกลางคอร์อธิปไตย (Sovereign Core Kernel)',
    nameEn: 'Sovereign Core Kernel & SSoT Root',
    health: 'Nominal',
    indicator: '🟢',
    lastChecked: '2026-09-03T22:30:00.000Z',
    healthScorePct: 100,
    latencyMs: 0.08,
    enclaveName: 'NITRO-PQC-ENCLAVE-01',
    securityDomain: 'Core SSoT Root',
    auditEvidenceRef: 'AUD-849202-KRN01',
    detailsTh: 'ระบบแกนกลางทำงานปกติ 100% SSoT Δ0.0% Zero Drift บันทึกสถานะพร้อมเพรียง',
    detailsEn: 'Core Kernel running nominal with 100% SSoT Δ0.0% zero drift.',
  },
  2: {
    chamberNum: 2,
    chamberId: 'CH-02',
    nameTh: 'บัฟเฟอร์แยกกักกันความปลอดภัย (Quarantine Escrow Buffer)',
    nameEn: 'Quarantine Escrow Buffer & Isolation Chamber',
    health: 'Lockdown',
    indicator: '🔴',
    lastChecked: '2026-09-03T22:33:45.000Z',
    healthScorePct: 74,
    latencyMs: 142.0,
    enclaveName: 'FAIL-CLOSED-ISOLATION-02',
    securityDomain: 'Forensic Isolation & Safe Escrow',
    auditEvidenceRef: 'AUD-849202-QUAR02',
    detailsTh: 'ระบบล็อกดาวน์แบบ Fail-Closed กำลังกักกัน 80 ซีลแปลกปลอมภายใต้อุณหภูมิ 85.0°C',
    detailsEn: 'Fail-closed lockdown active: 80 suspect seals quarantined at 85.0°C.',
  },
  3: {
    chamberNum: 3,
    chamberId: 'CH-03',
    nameTh: 'ระบบขับเคลื่อนวาร์ปซับสเปซ (Warp Drive Subspace)',
    nameEn: 'Subspace Warp Drive & Tensor Propulsion',
    health: 'Drift Detected',
    indicator: '🟡',
    lastChecked: '2026-09-03T22:31:12.000Z',
    healthScorePct: 92,
    latencyMs: 12.4,
    enclaveName: 'WARP-TENSOR-OMEGA-03',
    securityDomain: 'Propulsion & Subspace Mechanics',
    auditEvidenceRef: 'AUD-849202-WARP03',
    detailsTh: 'ตรวจพบความเบี่ยงเบนแฝงของแรงดันเทนเซอร์ 12% กำลังปรับสมดุลฟลักซ์อัตโนมัติ',
    detailsEn: 'Tensor pressure latent drift 12% detected; auto-balancing flux.',
  },
  4: {
    chamberNum: 4,
    chamberId: 'CH-04',
    nameTh: 'แบบจำลอง 3 มิติวิกฤติต้านทาน (3D Stress & Citadel Simulator)',
    nameEn: 'ERA Ω 3D Citadel Stress Simulator',
    health: 'Drift Detected',
    indicator: '🟡',
    lastChecked: '2026-09-03T22:29:50.000Z',
    healthScorePct: 88,
    latencyMs: 18.6,
    enclaveName: 'THREE-QUANTUM-CITADEL-04',
    securityDomain: 'Resilience Simulation & Blast Radius',
    auditEvidenceRef: 'AUD-849202-SIM04',
    detailsTh: 'อยู่ระหว่างรัน Stress Simulation ทดสอบการทนทานต่อการโจมตี Adversarial Vectors',
    detailsEn: 'Stress simulation active testing adversarial vectors resilience.',
  },
  5: {
    chamberNum: 5,
    chamberId: 'CH-05',
    nameTh: 'โครงข่ายฮาร์ดแวร์เอชเอสเอ็ม 10 ชุด (10-HSM Deca Quorum)',
    nameEn: 'Deca-Key 10/10 Hardware HSM Quorum',
    health: 'Nominal',
    indicator: '🟢',
    lastChecked: '2026-09-03T22:32:10.000Z',
    healthScorePct: 100,
    latencyMs: 0.95,
    enclaveName: 'DECA-HSM-ROSTER-TC01-10',
    securityDomain: 'Cryptographic Governance & SoD',
    auditEvidenceRef: 'AUD-849202-HSM05',
    detailsTh: 'มติเอกฉันท์ 10/10 REAL_HSM ลงนามรับรองสมบูรณ์ ปราศจากกุญแจแปลกปลอม',
    detailsEn: 'Unanimous 10/10 REAL_HSM quorum validated on active hardware tokens.',
  },
  6: {
    chamberNum: 6,
    chamberId: 'CH-06',
    nameTh: 'ศูนย์ความมั่นคงหลังยุคควอนตัม (Post-Quantum Dilithium-5 Enclave)',
    nameEn: 'Zero-Trust NIST Post-Quantum Cryptography',
    health: 'Nominal',
    indicator: '🟢',
    lastChecked: '2026-09-03T22:33:00.000Z',
    healthScorePct: 100,
    latencyMs: 0.42,
    enclaveName: 'NIST-FIPS-204-DILITHIUM5',
    securityDomain: 'Quantum-Proof Cryptography & QKD',
    auditEvidenceRef: 'AUD-849202-PQC06',
    detailsTh: 'การเข้ารหัส ML-DSA-87 (Dilithium-5) และ ML-KEM-1024 สมบูรณ์ 100%',
    detailsEn: 'ML-DSA-87 (Dilithium-5) and ML-KEM-1024 encryption fully verified.',
  },
  7: {
    chamberNum: 7,
    chamberId: 'CH-07',
    nameTh: 'คลังสินทรัพย์อธิปไตยดิจิทัล (FIOS Sovereign Treasury)',
    nameEn: 'FIOS Sovereign Treasury & Gold Bullion Reserves',
    health: 'Nominal',
    indicator: '🟢',
    lastChecked: '2026-09-03T22:30:40.000Z',
    healthScorePct: 100,
    latencyMs: 0.88,
    enclaveName: 'TREASURY-VAULT-THB-XAU-07',
    securityDomain: 'Sovereign Treasury & Fiduciary Assets',
    auditEvidenceRef: 'AUD-849202-TR07',
    detailsTh: 'ทุนสำรอง THB-SOV ฿1.49B และทองคำ LBMA 14,902 oz ยืนยันตรงตามบัญชี SSoT',
    detailsEn: 'THB-SOV ฿1.49B and 14,902 oz LBMA physical gold collateral matched.',
  },
  8: {
    chamberNum: 8,
    chamberId: 'CH-08',
    nameTh: 'ศูนย์จำลองและตรวจสอบนิติวิทยาศาสตร์ (Phoenix 142ms Forensics Replay)',
    nameEn: 'Phoenix Autonomous Forensics Replay Engine',
    health: 'Drift Detected',
    indicator: '🟡',
    lastChecked: '2026-09-03T22:34:02.000Z',
    healthScorePct: 91,
    latencyMs: 142.0,
    enclaveName: 'PHOENIX-12STAGE-TRACE-08',
    securityDomain: 'Forensic Audit & Trace Replay',
    auditEvidenceRef: 'AUD-849202-PHX08',
    detailsTh: 'รันการย้อนรอยตรวจสอบ 12 ขั้นตอน (Ingest ถึง Closure) ล่วงหน้าในแซนด์บอกซ์',
    detailsEn: 'Running 12-stage forensic trace sandbox replay within 142ms threshold.',
  },
  9: {
    chamberNum: 9,
    chamberId: 'CH-09',
    nameTh: 'พาสปอร์ตสิทธิ์อธิปไตย (#EP-SOVEREIGN-01)',
    nameEn: 'Sovereign Trust Passport Enclave',
    health: 'Nominal',
    indicator: '🟢',
    lastChecked: '2026-09-03T22:32:30.000Z',
    healthScorePct: 100,
    latencyMs: 0.12,
    enclaveName: 'PASSPORT-OMEGA1-ENCLAVE-09',
    securityDomain: 'Principal Identity & Clearance Control',
    auditEvidenceRef: 'AUD-849202-PASS09',
    detailsTh: 'สิทธิ์ OMEGA-1 SUPREME ของนายยุทธภูมิ พากเพียร ได้รับการรับรองสมบูรณ์',
    detailsEn: 'OMEGA-1 SUPREME clearance verified for Yuttaphum Phakphian.',
  },
  10: {
    chamberNum: 10,
    chamberId: 'CH-10',
    nameTh: 'ห้องนิรภัยความเย็นยิ่งยวด 14.98 mK (Sub-Kelvin Cryo Vault)',
    nameEn: 'Cryogenic Superfluid Helium-4 Subzero Vault',
    health: 'Nominal',
    indicator: '🟢',
    lastChecked: '2026-09-03T22:33:15.000Z',
    healthScorePct: 100,
    latencyMs: 0.05,
    enclaveName: 'CRYO-SUBZERO-HE4-10',
    securityDomain: 'Superfluid Cryo-Telemetry & Thermal Control',
    auditEvidenceRef: 'AUD-849202-CRYO10',
    detailsTh: 'อุณหภูมิคงที่ 14.98 mK (ช่วงเสถียร 14.90–15.02 mK) ปราศจากการสะสมความร้อน',
    detailsEn: 'Superfluid cryo telemetry locked at 14.98 mK (target: 14.90-15.02 mK).',
  },
  11: {
    chamberNum: 11,
    chamberId: 'CH-11',
    nameTh: 'สมุดบันทึกสิทธิ์ห่วงโซ่ SSoT (SSoT Hash-Chain Ledger)',
    nameEn: 'SSoT Hash-Chain Ledger & Time Anchor Block #849202',
    health: 'Nominal',
    indicator: '🟢',
    lastChecked: '2026-09-03T22:31:00.000Z',
    healthScorePct: 100,
    latencyMs: 0.22,
    enclaveName: 'SSOT-HASH-CHAIN-BLOCK-849202-11',
    securityDomain: 'Truth Plane & SSoT Ledger Immutable',
    auditEvidenceRef: 'AUD-849202-LEDG11',
    detailsTh: 'บล็อก #849202 ล็อกแน่นหนา ค่าเบี่ยงเบน Core Drift 0.00% ไม่มีการแก้ไขทับ',
    detailsEn: 'Canonical Block #849202 sealed with 0.00% core drift and 0 mutations.',
  },
  12: {
    chamberNum: 12,
    chamberId: 'CH-12',
    nameTh: 'ห้องนิรภัยตราประทับเมอร์เคิล 14,902 ดวง (14,902 Merkle Leaf Vault)',
    nameEn: 'Merkle Leaf Vault & Root Digest 909ab814...',
    health: 'Nominal',
    indicator: '🟢',
    lastChecked: '2026-09-03T22:32:00.000Z',
    healthScorePct: 100,
    latencyMs: 0.35,
    enclaveName: 'MERKLE-TREE-14902-SEALS-12',
    securityDomain: 'Cryptographic Root Verification & Merkle Trees',
    auditEvidenceRef: 'AUD-849202-MRK12',
    detailsTh: 'ตราประทับ 14,902 / 14,902 ตรวจสอบสมบูรณ์ 100% สอดคล้องกับ Merkle Root 909ab814...',
    detailsEn: '14,902 / 14,902 seals verified matching Merkle digest 909ab814...fa4c68.',
  },
  13: {
    chamberNum: 13,
    chamberId: 'CH-13',
    nameTh: 'เรดาร์แลตทิซควอนตัม 8K (8K Tactical Quantum Radar)',
    nameEn: '8K Tactical Quantum Lattice Radar',
    health: 'Drift Detected',
    indicator: '🟡',
    lastChecked: '2026-09-03T22:34:10.000Z',
    healthScorePct: 94,
    latencyMs: 3.8,
    enclaveName: 'TACTICAL-RADAR-8K-MESH-13',
    securityDomain: 'Threat Vector Mapping & Perimeter Radar',
    auditEvidenceRef: 'AUD-849202-RAD13',
    detailsTh: 'เรดาร์ 360° กวาดตรวจระยะ 12,000 กม. ตรวจพบคลื่นรบกวนภายนอก 0 Threat ผ่านการกรอง',
    detailsEn: '8K 360° radar active scanning 12,000 km perimeter; 0 active threats confirmed.',
  },
  14: {
    chamberNum: 14,
    chamberId: 'CH-14',
    nameTh: 'คอนโซลคำสั่งเคอร์เนลอธิปไตย (Sovereign CLI TTY Shell)',
    nameEn: 'Sovereign CLI Terminal & Execution Gate',
    health: 'Nominal',
    indicator: '🟢',
    lastChecked: '2026-09-03T22:33:30.000Z',
    healthScorePct: 100,
    latencyMs: 0.15,
    enclaveName: 'KERNEL-TTY-CLI-INTERLOCK-14',
    securityDomain: 'CLI Command Execution & Safe Boundary',
    auditEvidenceRef: 'AUD-849202-CLI14',
    detailsTh: 'ระบบ Terminal ป้องกันการเขียนทับ (Read-Only/Execution Safe) ควบคุมด้วย OMEGA-1',
    detailsEn: 'Interactive TTY terminal safe-mode interlocked with OMEGA-1 clearance.',
  },
  15: {
    chamberNum: 15,
    chamberId: 'CH-15',
    nameTh: 'เครือข่ายกลุ่มดาวเทียมอธิปไตย 45 ดวง (Orbital Satellite Mesh)',
    nameEn: 'Orbital Constellation Mesh & QKD Relayers',
    health: 'Nominal',
    indicator: '🟢',
    lastChecked: '2026-09-03T22:31:40.000Z',
    healthScorePct: 100,
    latencyMs: 1.8,
    enclaveName: 'SAT-CONSTELLATION-45-QKD-15',
    securityDomain: 'Space Network & Fiber Satellite Mesh',
    auditEvidenceRef: 'AUD-849202-SAT15',
    detailsTh: 'ดาวเทียมทั้ง 45/45 ดวงเชื่อมโยงช่องสื่อสารปลอดภัย QKD 256-bit สมบูรณ์',
    detailsEn: 'All 45/45 satellites active in constellation with QKD 256-bit interlinks.',
  },
  16: {
    chamberNum: 16,
    chamberId: 'CH-16',
    nameTh: 'ดิจิทัลทวินจำลองสถานการณ์ความจริง (Digital Twin Sandbox)',
    nameEn: 'Digital Twin Multiverse Sandbox Environment',
    health: 'Nominal',
    indicator: '🟢',
    lastChecked: '2026-09-03T22:32:50.000Z',
    healthScorePct: 100,
    latencyMs: 0.65,
    enclaveName: 'DIGITAL-TWIN-SANDBOX-SAND-16',
    securityDomain: 'Zero-Side-Effect Simulation & Mirror Testing',
    auditEvidenceRef: 'AUD-849202-TWIN16',
    detailsTh: 'สภาพแวดล้อมดิจิทัลทวินแยกขาดจากระบบจริง (Zero Side-Effect) มั่นคง 100%',
    detailsEn: 'Sandbox isolated with zero side-effects to the Truth Plane.',
  },
  17: {
    chamberNum: 17,
    chamberId: 'CH-17',
    nameTh: 'ห้องเก็บบันทึกถาวร WORM ไร้การลบ (WORM Immutable Preservation)',
    nameEn: 'WORM Immutable Preservation & Audit Enclave',
    health: 'Nominal',
    indicator: '🟢',
    lastChecked: '2026-09-03T22:33:55.000Z',
    healthScorePct: 100,
    latencyMs: 0.10,
    enclaveName: 'WORM-OPTICAL-PRESERVE-17',
    securityDomain: 'Legal Compliance & WORM Storage',
    auditEvidenceRef: 'AUD-849202-WORM17',
    detailsTh: 'บันทึกหลักฐานตาม พ.ร.บ.ธุรกรรมฯ พ.ศ. 2544 ม.9, 26, 28 ลบไม่ได้ 0% Data Loss',
    detailsEn: 'Thai ETA B.E. 2544 Sections 9, 26, 28 WORM audit trail non-deletable.',
  },
  18: {
    chamberNum: 18,
    chamberId: 'CH-18',
    nameTh: 'เมทริกซ์ทะเบียน 40 เฟส (40-Phase Extension Matrix)',
    nameEn: '40-Phase Master Extension Matrix & Gates',
    health: 'Nominal',
    indicator: '🟢',
    lastChecked: '2026-09-03T22:30:15.000Z',
    healthScorePct: 100,
    latencyMs: 0.30,
    enclaveName: 'PHASE-MATRIX-P01-40-GATE-18',
    securityDomain: 'Phase Execution & Sovereign Invariants',
    auditEvidenceRef: 'AUD-849202-PHS18',
    detailsTh: 'ทุกเฟส P01–P40 และเกตความปลอดภัย 22/22 ผ่านการรับรองครบ 100% PASS',
    detailsEn: 'All 40 phases (P01-P40) and 22/22 master gates verified 100% PASS.',
  },
};

/**
 * Get the health indicator emoji for a given status
 */
export function getHealthIndicatorEmoji(health: ChamberHealthState): '🟢' | '🟡' | '🔴' {
  switch (health) {
    case 'Nominal':
      return '🟢';
    case 'Drift Detected':
      return '🟡';
    case 'Lockdown':
      return '🔴';
    default:
      return '🟢';
  }
}

/**
 * Get registry entry by chamber number (1-18)
 */
export function getChamberRegistryEntry(chamberNum: number): ChamberRegistryEntry {
  return CHAMBERS_REGISTRY_DATA[chamberNum] || {
    chamberNum,
    chamberId: `CH-${chamberNum.toString().padStart(2, '0')}`,
    nameTh: `ห้องปฏิบัติการ ${chamberNum}`,
    nameEn: `Chamber ${chamberNum}`,
    health: 'Nominal',
    indicator: '🟢',
    lastChecked: '2026-09-03T22:30:00.000Z',
    healthScorePct: 100,
    latencyMs: 0.5,
    enclaveName: `GENERIC-ENCLAVE-${chamberNum}`,
    securityDomain: 'Standard Security Protocol',
    auditEvidenceRef: `AUD-849202-CH${chamberNum}`,
    detailsTh: 'สถานะความปลอดภัยปกติ',
    detailsEn: 'Standard nominal security state.',
  };
}

export interface ChamberRegistryItem {
  id: string;
  status: ChamberHealthState;
  lastChecked: string;
}

/**
 * Array of 18 chamber registry objects with id, status, and lastChecked timestamp
 */
export const registryData: (ChamberRegistryEntry & ChamberRegistryItem)[] = Object.values(CHAMBERS_REGISTRY_DATA).map((entry) => ({
  ...entry,
  id: entry.chamberId,
  status: entry.health,
  lastChecked: entry.lastChecked,
}));

export default registryData;
