export type ViewType =
  | 'dashboard'
  | 'unified'
  | 'heatmap'
  | 'production'
  | 'council'
  | 'quantum'
  | 'nexus'
  | 'vault'
  | 'ledger'
  | 'pulse'
  | 'forge'
  | 'matrix'
  | 'archive'
  | 'console'
  | 'security'
  | 'settings'
  | 'legal';

export interface AuditStage {
  id: string;
  stageNumber: number;
  name: string;
  shortDesc: string;
  status: 'VERIFIED' | 'PASS' | 'PENDING' | 'BLOCKED';
  timestamp: string;
  durationMs: number;
  stageId: string;
  parentHash: string;
  outputHash: string;
  sourceModule: string;
  actor: string;
  metadata: Record<string, string | number | boolean>;
}

export interface AuditTransaction {
  txId: string;
  title: string;
  createdAt: string;
  overallStatus: string;
  totalLatencyMs: number;
  rootActor: string;
  sealedLedgerBlock: number;
  invariantsPassed: number;
  totalInvariants: number;
  masterHash: string;
  stages: AuditStage[];
}

export interface CanonicalSubModule {
  id: string;
  nameEn: string;
  nameTh: string;
  targetView: ViewType;
  status: 'nominal' | 'active' | 'sync' | 'standby' | 'warning';
  descriptionEn: string;
  descriptionTh: string;
}

export interface CanonicalModule {
  id: string;
  num: string;
  titleEn: string;
  titleTh: string;
  badge: string;
  targetView: ViewType;
  metrics: Array<{
    label: string;
    value: string;
    status: 'nominal' | 'active' | 'sync' | 'standby' | 'warning';
  }>;
  descriptionEn: string;
  descriptionTh: string;
  subModules: CanonicalSubModule[];
}

export interface HSMNodeVitality {
  connectivityPct: number;
  lastPingMs: number;
  subKelvinTempK: number;
  activeEntropyRateKBps: number;
  jitterMs: number;
  busBandwidthGbps: number;
  hsmCoreStatus?: string;
}

export interface ThaiCustodian {
  id: string;
  passportNumber: string;
  passportId?: string;
  nameTh: string;
  nameEn: string;
  roleTh: string;
  roleEn: string;
  clearanceLevel: string;
  signedDate: string;
  keyFingerprint: string;
  councilCode: string;
  slotNumber: number;
  slotId?: number;
  hardwareEnclave: string;
  fipsCertification?: string;
  pqcAlgorithm: string;
  cryptoSignature: string;
  certificateSerial?: string;
  verificationStatus?: string;
  status: 'ACTIVE' | 'SOVEREIGN' | 'FROZEN' | 'REAL_HSM_SIGNED';
  vitality: HSMNodeVitality;
}

export type HSMNode = ThaiCustodian;

export interface IntakeArtifact {
  evidenceId: string;
  sourceFilename: string;
  sourceType: string;
  provenance: string;
  verification: string;
  reconciliation: string;
  mutationAuthority: string;
  canonicalWrite: string;
  classification: string;
  binding: {
    artifactDigest: string;
    merkleAnchor: string;
    blockBinding: string;
  };
}

export interface IntakeLedger {
  manifesto: string;
  title: string;
  timestamp: string;
  canonicalCore: {
    merkleRoot: string;
    blockHeight: string;
    canonicalSeals: number;
    ssotMutation: number;
    promotionStatus: string;
  };
  intakeArtifacts: IntakeArtifact[];
}

export interface SystemInvariant {
  id: string;
  code: string;
  name: string;
  description: string;
  layer: string;
  status: 'PASSED' | 'BLOCKED' | 'ENFORCED';
  verificationHash: string;
}

export type EvidenceStatus =
  | 'CANONICAL'
  | 'VERIFIED'
  | 'ACCEPTED_TEST'
  | 'CANDIDATE'
  | 'SIMULATED'
  | 'REFERENCE'
  | 'NOT_IN_EVIDENCE'
  | 'MISMATCH'
  | 'BLOCKED';

export type TelemetrySource =
  | 'LIVE'
  | 'SNAPSHOT'
  | 'SIMULATED'
  | 'REFERENCE'
  | 'UNVERIFIED';

export interface CryptographicBindingProof {
  id: string;
  artifactName: string;
  artifactDigest: string;
  merkleRoot: string;
  blockHeight: number;
  pqcSignature: string;
  signerPassport: string;
  signerName: string;
  status: 'BOUND_VERIFIED' | 'UNBOUND_ORPHAN' | 'MISMATCH_BLOCKED';
  verifiedAt: string;
}

export interface ImmutableAuditEvent {
  id: string;
  sequenceNumber: number;
  timestampIct: string;
  actor: string;
  action: string;
  inputHash: string;
  outputHash: string;
  result: 'SUCCESS' | 'BLOCKED' | 'FAIL_CLOSED' | 'IMMUTABLE_LOGGED';
  proofAnchor: string;
}

export interface PromotionFirewallItem {
  id: string;
  moduleName: string;
  currentStage: 'CANDIDATE' | 'EVIDENCE' | 'VERIFICATION' | 'GOVERNANCE' | 'EXPLICIT_PROMOTION' | 'CANONICAL';
  evidenceScore: number;
  fiosReportAttached: boolean;
  dilithiumVerified: boolean;
  quorumSignedCount: number; // e.g. 4/10, 10/10
  directPromotionBlocked: boolean;
  notes: string;
}

export interface IdentityCollisionProof {
  displayName: string;
  signerId: string;
  credentialId: string;
  publicKeyFingerprint: string;
  signatureVerification: 'VERIFIED' | 'FAILED' | 'PENDING';
  uniquenessVerified: boolean;
  notes?: string;
}

export interface BaselineReconciliationState {
  canonicalMerkleRoot: string;
  canonicalBlock: number;
  canonicalSeals: number;
  runtimeMerkleRoot: string;
  runtimeBlock: number;
  runtimeSeals: number;
  reconciliationStatus: 'HARMONIZED_100' | 'MISMATCH_FAIL_CLOSED';
  readOnlyEnforced: boolean;
  lastReconciliationAt: string;
}

export interface HardwareSnapshot {
  id: string;
  snapshotNumber: number;
  timestampIct: string;
  timestampUtc: string;
  epoch: number;
  cpuAverage: number;
  cpuCores: number[];
  memoryUsedMb: number;
  memoryTotalMb: number;
  cryoTempMk: number;
  heliumFlowPct: number;
  networkRxMbps: number;
  networkTxMbps: number;
  qopsThroughput: number;
  coherencePct: number;
  otelSpansSec: number;
  ssdWearLevelPct?: number;
  voltageStabilityPct?: number;
  SSD_Wear_Level?: number;
  Voltage_Stability?: number;
  cognitiveDriftPct?: number;
  reasoningScore?: number;
  atmosphericEntropy?: number;
  cpuThermalVariance?: number;
  isDeepFrozen?: boolean;
  parentHash: string;
  sealedHash: string;
  actor: string;
  status: 'SEALED' | 'VERIFIED';
}

export interface DeepFreezePartition {
  partitionId: string;
  blockRangeStart: number;
  blockRangeEnd: number;
  recordsCount: number;
  uncompressedBytes: number;
  compressedBytes: number;
  compressionRatio: number;
  merkleBranchRoot: string;
  frozenAt: string;
  pqcSignature: string;
  coldStorageVault: string;
  isReadOnly: boolean;
}

export interface DeepFreezeArchiveState {
  totalLedgerEntries: number;
  activeHotEntries: number;
  deepFrozenEntries: number;
  thresholdLimit: number;
  isDeepFreezeActive: boolean;
  lastFrozenAt: string | null;
  partitions: DeepFreezePartition[];
  totalBytesSavedMb: number;
}

export interface QuantumContinuumState {
  continuumId: string;
  baseKernel: string;
  governanceFabric: string;
  entropyControl: string;
  seal: string;
  status: 'ACTIVE' | 'SYNCHRONIZED' | 'INITIALIZING';
  synchronizedNodes: string[];
  quorum: string;
  driftTolerance: number;
  activeDimensions: string[];
  latency: string;
  commitHash: string;
  blockId: string;
}

export interface MultiverseNavigationState {
  gridId: string;
  continuumRuntime: string;
  omegaCore: string;
  holographicMode: boolean;
  currentSector: string;
  targetGateway: string;
  destination: string;
  warpEngaged: boolean;
  warpLatency: string;
  heartbeat: string;
  qOps: number;
  commitHash: string;
  blockId: string;
  status: 'ONLINE' | 'ENGAGED' | 'STANDBY';
}

export interface ForensicStage {
  stageNumber: number;
  code: string;
  nameTh: string;
  nameEn: string;
  descriptionTh: string;
  descriptionEn: string;
  durationMs: number;
  cumulativeMs: number;
  targetChamber: string;
  evidenceTag: string;
  verificationRule: string;
}

export interface PhaseInfo {
  phase_id: string;
  name: string;
  domain: 'Foundation' | 'Governance' | 'Operations' | 'Extension';
  seals_verified: number;
  block_anchor: number;
  status: string;
}

export interface SimulatedTransaction {
  auth_id: string;
  vendor: string;
  amount: number;
  signature_scheme: string;
  hsm_quorum_count: number;
  isReplay: boolean;
}

export interface InterceptResult {
  computed_risk_score: number;
  evaluation_timestamp: string;
  status: 'SETTLED_COMMITTED' | 'ESCROW_PENDING' | 'BLOCKED_FRAUD';
  mitigation_action: string;
  chamber: string;
  thai_legal_compliance: {
    section_09_enforceable: boolean;
    section_26_trustworthy: boolean;
    section_28_ca_backed: boolean;
    court_admissible: 'FORENSIC_READY_MAXIMUM_ASSURANCE' | 'ADMISSIBLE_GENERAL_TRANSACTION' | 'NOT_ADMISSIBLE_FRAUD_SUSPECTED';
  };
  details: string[];
}

export type PqcAlgorithmId =
  | 'ML-DSA-87'
  | 'ML-KEM-1024'
  | 'SLH-DSA-256'
  | 'FN-DSA-1024'
  | 'PQC-HYBRID-01'
  | 'FAILSAFE-HOTSWAP';

export interface PqcAlgorithmConfig {
  id: PqcAlgorithmId;
  name: string;
  standard: string;
  securityCategory: number;
  schemeType: string;
  mathematicalBasis: string;
  publicKeyBytes: number;
  secretKeyBytes: number;
  cipherOrSigBytes: number;
  ringDimensionN: number;
  modulusQ: number;
  matrixRankK: number;
  matrixRankL: number;
  speedRating: string;
  legalAnchor: string;
  descriptionTh: string;
}

export interface HsmEnclaveState {
  hsmId: string;
  custodianId: string;
  custodianNameTh: string;
  custodianNameEn: string;
  roleTh: string;
  vaultLocation: string;
  hardwareModel: string;
  fipsLevel: string;
  temperatureC: number;
  zeroizationLatMs: number;
  attestationStatus: string;
  pqcKeyFingerprint: string;
  lastAttestationBlock: number;
}

export interface LatticeMemoizerMetrics {
  cacheHitCount: number;
  cacheMissCount: number;
  totalSwitches: number;
  hitRatePct: number;
  lastComputeLatencyMs: number;
  averageMemoizedLatencyMs: number;
  activeLatticeDimension: string;
  polynomialNTTOpsPerSec: number;
  memoryFootprintKb: number;
}

export interface HsmQuorumEvaluation {
  totalEnclaves: number;
  verifiedCount: number;
  computingCount: number;
  lockedCount: number;
  isQuorumValid: boolean;
  quorumPercentage: number;
  leadPrincipalStatus: string;
  leadPrincipalName: string;
  leadPrincipalId: string;
  averageTemperatureC: number;
  maxZeroizationLatencyMs: number;
  canonicalBlock: number;
  canonicalSealsCount: number;
  combinedFingerprintDigest: string;
  fipsLevel: string;
  statusLabelTh: string;
}



