import { HardwareSnapshot, AuditStage } from '../types';
import { AUDIT_TRACE_TX, SYSTEM_METADATA } from '../data/canonicalData';

// Generate simulated SHA-256 hash
export function generateSha256Hash(seed: string): string {
  let hash = 0x811c9dc5;
  for (let i = 0; i < seed.length; i++) {
    hash ^= seed.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193);
  }
  const hex1 = ('00000000' + (hash >>> 0).toString(16)).slice(-8);
  const hex2 = ('00000000' + (Math.imul(hash, 31) >>> 0).toString(16)).slice(-8);
  const hex3 = ('00000000' + (Math.imul(hash, 57) >>> 0).toString(16)).slice(-8);
  const hex4 = ('00000000' + (Math.imul(hash, 93) >>> 0).toString(16)).slice(-8);
  const hex5 = ('00000000' + (Math.imul(hash, 127) >>> 0).toString(16)).slice(-8);
  const hex6 = ('00000000' + (Math.imul(hash, 199) >>> 0).toString(16)).slice(-8);
  const hex7 = ('00000000' + (Math.imul(hash, 241) >>> 0).toString(16)).slice(-8);
  const hex8 = ('00000000' + (Math.imul(hash, 311) >>> 0).toString(16)).slice(-8);
  return `0x${hex1}${hex2}${hex3}${hex4}${hex5}${hex6}${hex7}${hex8}`;
}

// Initial baseline hardware snapshots
export const INITIAL_HARDWARE_SNAPSHOTS: HardwareSnapshot[] = [
  {
    id: 'SNAP-849202-001',
    snapshotNumber: 1,
    timestampIct: '2026-08-20 05:03:08 ICT',
    timestampUtc: '2026-08-19 22:03:08 UTC',
    epoch: 1787180588000,
    cpuAverage: 41.2,
    cpuCores: [42.1, 39.8, 44.5, 38.6],
    memoryUsedMb: 5214,
    memoryTotalMb: 8192,
    cryoTempMk: 14.98,
    heliumFlowPct: 100,
    networkRxMbps: 84.2,
    networkTxMbps: 112.6,
    qopsThroughput: 851.9,
    coherencePct: 99.98,
    otelSpansSec: 2450,
    ssdWearLevelPct: 0.82,
    voltageStabilityPct: 99.98,
    SSD_Wear_Level: 0.82,
    Voltage_Stability: 99.98,
    parentHash: SYSTEM_METADATA.merkleRoot,
    sealedHash: '0x909ab814e5a973d4bb79e0a293673f8373a4b6c3d2e1f0a9b8c7d6e5f4a3b2c1',
    actor: 'SOVEREIGN-CUSTODIAN-EP001 (นายยุทธภูมิ พากเพียร)',
    status: 'SEALED',
  },
  {
    id: 'SNAP-849202-002',
    snapshotNumber: 2,
    timestampIct: '2026-08-20 05:18:42 ICT',
    timestampUtc: '2026-08-19 22:18:42 UTC',
    epoch: 1787181522000,
    cpuAverage: 39.6,
    cpuCores: [40.2, 38.4, 41.8, 38.0],
    memoryUsedMb: 5240,
    memoryTotalMb: 8192,
    cryoTempMk: 14.96,
    heliumFlowPct: 100,
    networkRxMbps: 86.5,
    networkTxMbps: 115.2,
    qopsThroughput: 853.4,
    coherencePct: 99.99,
    otelSpansSec: 2480,
    ssdWearLevelPct: 0.83,
    voltageStabilityPct: 99.99,
    SSD_Wear_Level: 0.83,
    Voltage_Stability: 99.99,
    parentHash: '0x909ab814e5a973d4bb79e0a293673f8373a4b6c3d2e1f0a9b8c7d6e5f4a3b2c1',
    sealedHash: '0x7c4f1e9a2b3d8c5e6f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e',
    actor: 'AUTONOMOUS-HEALING-CORE (Phase 31 Closeout)',
    status: 'SEALED',
  },
];

// Create a new snapshot from current hardware telemetry
export function createTelemetrySnapshot(
  telemetry: {
    core0?: number;
    core1?: number;
    core2?: number;
    core3?: number;
    memUsedMb?: number;
    cryoTempMk?: number;
    qopsThroughput?: number;
    coherencePct?: number;
    networkRxMbps?: number;
    networkTxMbps?: number;
    otelSpansSec?: number;
    ssdWearLevelPct?: number;
    voltageStabilityPct?: number;
  },
  currentSnapshotsCount: number,
  lastSealedHash?: string
): HardwareSnapshot {
  const now = new Date();
  const c0 = +(telemetry.core0 || 41.5).toFixed(1);
  const c1 = +(telemetry.core1 || 39.2).toFixed(1);
  const c2 = +(telemetry.core2 || 43.8).toFixed(1);
  const c3 = +(telemetry.core3 || 38.4).toFixed(1);
  const cpuAvg = +((c0 + c1 + c2 + c3) / 4).toFixed(1);
  const memUsed = Math.round(telemetry.memUsedMb || 5220);
  const cryo = +(telemetry.cryoTempMk || 14.98).toFixed(2);
  const qops = +(telemetry.qopsThroughput || 851.9).toFixed(1);
  const coherence = +(telemetry.coherencePct || 99.98).toFixed(2);
  const rx = +(telemetry.networkRxMbps || 85.0).toFixed(1);
  const tx = +(telemetry.networkTxMbps || 114.0).toFixed(1);
  const spans = Math.round(telemetry.otelSpansSec || 2460);
  const ssdWear = +(telemetry.ssdWearLevelPct || 0.83).toFixed(2);
  const voltage = +(telemetry.voltageStabilityPct || 99.99).toFixed(2);

  const snapshotNum = currentSnapshotsCount + 1;
  const snapId = `SNAP-849202-${String(snapshotNum).padStart(3, '0')}`;
  const parent = lastSealedHash || SYSTEM_METADATA.merkleRoot;
  const hashSeed = `${snapId}-${now.toISOString()}-${cpuAvg}-${memUsed}-${cryo}-${qops}-${parent}`;
  const sealed = generateSha256Hash(hashSeed);

  return {
    id: snapId,
    snapshotNumber: snapshotNum,
    timestampIct: now.toLocaleTimeString('th-TH', { timeZone: 'Asia/Bangkok', hour12: false }) + ' ICT (' + now.toISOString().slice(0, 10) + ')',
    timestampUtc: now.toUTCString().slice(17, 25) + ' UTC',
    epoch: now.getTime(),
    cpuAverage: cpuAvg,
    cpuCores: [c0, c1, c2, c3],
    memoryUsedMb: memUsed,
    memoryTotalMb: 8192,
    cryoTempMk: cryo,
    heliumFlowPct: 100,
    networkRxMbps: rx,
    networkTxMbps: tx,
    qopsThroughput: qops,
    coherencePct: coherence,
    otelSpansSec: spans,
    ssdWearLevelPct: ssdWear,
    voltageStabilityPct: voltage,
    SSD_Wear_Level: ssdWear,
    Voltage_Stability: voltage,
    parentHash: parent,
    sealedHash: sealed,
    actor: 'SOVEREIGN-CUSTODIAN-EP001 (นายยุทธภูมิ พากเพียร)',
    status: 'SEALED',
  };
}

// Export All Evidence Logs as CSV File with configurable timestamp format
export function exportEvidenceToCsv(
  stages: AuditStage[],
  snapshots: HardwareSnapshot[],
  timestampMode: 'human' | 'block-height' = 'human'
): void {
  const headers = [
    'Record_Type',
    'Index',
    'Record_ID',
    'Name_Or_Title',
    'Status',
    timestampMode === 'block-height' ? 'Block_Height_Reference' : 'Timestamp',
    'Duration_Ms',
    'Actor',
    'Source_Module',
    'Parent_Hash_Input',
    'Output_Hash_Sealed',
    'Key_Metadata_And_Telemetry',
  ];

  const escapeCsv = (val: string | number | boolean | undefined | null) => {
    if (val === undefined || val === null) return '""';
    const str = String(val).replace(/"/g, '""');
    return `"${str}"`;
  };

  const rows: string[] = [];
  rows.push(headers.join(','));

  // 1. Forensics Stages
  stages.forEach((st) => {
    const metaStr = Object.entries(st.metadata || {})
      .map(([k, v]) => `${k}:${v}`)
      .join('; ');

    const timeCol =
      timestampMode === 'block-height'
        ? `BLOCK #849202 [STAGE ${String(st.stageNumber).padStart(2, '0')}/12]`
        : st.timestamp || '2026-08-20 05:03:08 ICT';

    rows.push(
      [
        escapeCsv('AUDIT_STAGE'),
        escapeCsv(st.stageNumber),
        escapeCsv(st.stageId || st.id),
        escapeCsv(st.name),
        escapeCsv(st.status),
        escapeCsv(timeCol),
        escapeCsv(st.durationMs),
        escapeCsv(st.actor),
        escapeCsv(st.sourceModule),
        escapeCsv(st.parentHash),
        escapeCsv(st.outputHash),
        escapeCsv(`${st.shortDesc} | Metadata: [${metaStr}]`),
      ].join(',')
    );
  });

  // 2. Hardware Telemetry Snapshots
  snapshots.forEach((snap) => {
    const teleStr = `CPU Avg: ${snap.cpuAverage}% (Cores: ${snap.cpuCores.join('/')}%) | RAM: ${snap.memoryUsedMb}/${snap.memoryTotalMb}MB | Cryo: ${snap.cryoTempMk}mK | QOps: ${snap.qopsThroughput} QOps/s | Coherence: ${snap.coherencePct}% | Spans: ${snap.otelSpansSec}/s`;

    const timeCol =
      timestampMode === 'block-height'
        ? `BLOCK #849202-SNAP${String(snap.snapshotNumber).padStart(3, '0')} [H:849202]`
        : `${snap.timestampIct} | ${snap.timestampUtc}`;

    rows.push(
      [
        escapeCsv('HARDWARE_TELEMETRY_SNAPSHOT'),
        escapeCsv(snap.snapshotNumber),
        escapeCsv(snap.id),
        escapeCsv('Hardware Telemetry & Cryo State Capture'),
        escapeCsv(snap.status),
        escapeCsv(timeCol),
        escapeCsv(0),
        escapeCsv(snap.actor),
        escapeCsv('HARDWARE_CRYO_OTLP_V1.28'),
        escapeCsv(snap.parentHash),
        escapeCsv(snap.sealedHash),
        escapeCsv(teleStr),
      ].join(',')
    );
  });

  const csvContent = '\uFEFF' + rows.join('\r\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  const dateStr = new Date().toISOString().replace(/[:.]/g, '-');
  const modeSuffix = timestampMode === 'block-height' ? 'BLOCK-HEIGHT' : 'HUMAN-TIME';
  a.download = `ZYRQUEN-EVIDENCE-LOGS-${modeSuffix}-${dateStr}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
