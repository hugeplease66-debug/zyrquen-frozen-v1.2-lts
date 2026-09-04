import React, { useState, useEffect, useCallback } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ViewType, HardwareSnapshot } from './types';
import { Navigation } from './components/Navigation';
import { AuditCertificateModal } from './components/AuditCertificateModal';
import { ThaiLegalSearchModal } from './components/ThaiLegalSearchModal';
import { KeyboardShortcutsModal } from './components/KeyboardShortcutsModal';
import { SystemEventsSidebar, SystemEvent } from './components/SystemEventsSidebar';
import {
  toggleSovereignSynth882Hz,
  playTone,
  playAuditChime,
  updateAtmosphericEntropyPitch,
  getAtmosphericCarrierState,
} from './components/AudioSynthesizer';
import { DashboardView } from './components/views/DashboardView';
import { QuantumView } from './components/views/QuantumView';
import { NexusView } from './components/views/NexusView';
import { VaultView } from './components/views/VaultView';
import { LedgerView } from './components/views/LedgerView';
import { PulseView } from './components/views/PulseView';
import { ForgeView } from './components/views/ForgeView';
import { MatrixView } from './components/views/MatrixView';
import { ArchiveView } from './components/views/ArchiveView';
import { ConsoleView } from './components/views/ConsoleView';
import { SecurityView, SecuritySubTab } from './components/views/SecurityView';
import { SettingsView } from './components/views/SettingsView';
import { ProductionReadinessView } from './components/views/ProductionReadinessView';
import { CouncilView } from './components/views/CouncilView';
import { LegalView } from './components/views/LegalView';
import { UnifiedMultiverseControlPanel } from './components/views/UnifiedMultiverseControlPanel';
import { GovernanceHealthHeatmap } from './components/views/GovernanceHealthHeatmap';
import { SYSTEM_METADATA } from './data/canonicalData';
import { INITIAL_HARDWARE_SNAPSHOTS, createTelemetrySnapshot } from './utils/telemetrySnapshot';
import { TelemetryAnomalyObserver } from './utils/telemetryAnomalyObserver';
import { automatedBackupService } from './services/automatedBackupService';
import { WriteFirewallEngine } from './utils/writeFirewall';
import { announceSystemEventVerbal } from './utils/textToSpeechService';
import { ErrorBoundary } from './components/ErrorBoundary';
import { VoiceCommandOverlay } from './components/VoiceCommandOverlay';
import { Sparkles, Shield, Award, Terminal, Keyboard, Activity, Heart, Zap, Bell, Waves, Volume2, VolumeX } from 'lucide-react';

interface ViewPersona {
  name: string;
  orb1: string;
  orb2: string;
  orb3: string;
  accentGlow: string;
}

const VIEW_PERSONAS: Record<ViewType, ViewPersona> = {
  dashboard: {
    name: 'Unified Executive Command',
    orb1: 'bg-cyan-600/10',
    orb2: 'bg-violet-600/8',
    orb3: 'bg-emerald-600/8',
    accentGlow: 'rgba(6,182,212,0.06)',
  },
  unified: {
    name: 'Unified Multiverse Control Panel',
    orb1: 'bg-cyan-600/16',
    orb2: 'bg-violet-600/14',
    orb3: 'bg-emerald-600/12',
    accentGlow: 'rgba(6,182,212,0.1)',
  },
  heatmap: {
    name: '14,902 Hardware Seals Governance Heatmap',
    orb1: 'bg-emerald-600/16',
    orb2: 'bg-teal-600/12',
    orb3: 'bg-cyan-600/10',
    accentGlow: 'rgba(16,185,129,0.09)',
  },
  council: {
    name: '10/10 REAL_HSM Sovereign Council',
    orb1: 'bg-amber-500/18',
    orb2: 'bg-yellow-600/12',
    orb3: 'bg-cyan-600/10',
    accentGlow: 'rgba(245,158,11,0.09)',
  },
  production: {
    name: 'Zero-Trust Production Readiness',
    orb1: 'bg-emerald-500/16',
    orb2: 'bg-cyan-600/14',
    orb3: 'bg-teal-600/12',
    accentGlow: 'rgba(16,185,129,0.08)',
  },
  quantum: {
    name: 'Sub-Kelvin Qubit Nexus',
    orb1: 'bg-cyan-500/16',
    orb2: 'bg-sky-600/14',
    orb3: 'bg-teal-500/10',
    accentGlow: 'rgba(14,165,233,0.08)',
  },
  nexus: {
    name: 'Neural Knowledge Fabric',
    orb1: 'bg-violet-600/14',
    orb2: 'bg-fuchsia-600/10',
    orb3: 'bg-purple-600/12',
    accentGlow: 'rgba(139,92,246,0.08)',
  },
  vault: {
    name: 'Sovereign Kyber-1024 Vault',
    orb1: 'bg-amber-500/14',
    orb2: 'bg-yellow-600/10',
    orb3: 'bg-orange-600/10',
    accentGlow: 'rgba(245,158,11,0.08)',
  },
  ledger: {
    name: 'Immutable Merkle Ledger',
    orb1: 'bg-emerald-500/14',
    orb2: 'bg-teal-600/10',
    orb3: 'bg-green-600/10',
    accentGlow: 'rgba(16,185,129,0.08)',
  },
  pulse: {
    name: 'Telemetry Pulse & Heartbeat',
    orb1: 'bg-rose-500/14',
    orb2: 'bg-cyan-600/12',
    orb3: 'bg-violet-600/10',
    accentGlow: 'rgba(244,63,94,0.08)',
  },
  forge: {
    name: 'Autonomous Industrial Forge',
    orb1: 'bg-amber-500/16',
    orb2: 'bg-orange-600/14',
    orb3: 'bg-red-600/10',
    accentGlow: 'rgba(245,158,11,0.09)',
  },
  matrix: {
    name: 'Multiverse Simulation Matrix',
    orb1: 'bg-violet-600/16',
    orb2: 'bg-pink-600/12',
    orb3: 'bg-indigo-600/12',
    accentGlow: 'rgba(217,70,239,0.08)',
  },
  archive: {
    name: 'Deep Cobalt 17-Module Archive',
    orb1: 'bg-blue-600/14',
    orb2: 'bg-indigo-600/10',
    orb3: 'bg-cyan-700/10',
    accentGlow: 'rgba(37,99,235,0.08)',
  },
  console: {
    name: 'Sovereign CLI Terminal',
    orb1: 'bg-emerald-500/14',
    orb2: 'bg-green-600/12',
    orb3: 'bg-teal-600/10',
    accentGlow: 'rgba(16,185,129,0.07)',
  },
  security: {
    name: 'Zero-Trust Bastion & Shield',
    orb1: 'bg-rose-600/14',
    orb2: 'bg-red-600/12',
    orb3: 'bg-violet-600/10',
    accentGlow: 'rgba(225,29,72,0.08)',
  },
  settings: {
    name: 'Thai Sovereign Custodian Registry',
    orb1: 'bg-amber-600/12',
    orb2: 'bg-slate-600/12',
    orb3: 'bg-cyan-600/10',
    accentGlow: 'rgba(217,119,6,0.07)',
  },
  legal: {
    name: 'Thai Sovereign Legal & PDPA Supreme Chamber',
    orb1: 'bg-blue-600/18',
    orb2: 'bg-cyan-600/14',
    orb3: 'bg-emerald-600/12',
    accentGlow: 'rgba(59,130,246,0.1)',
  },
};

const INITIAL_SYSTEM_EVENTS: SystemEvent[] = [
  {
    id: 'evt-evidence-tnt',
    type: 'EVIDENCE_IMPORTED',
    title: 'Evidence Ingested: TNT-TH-001 (Tenant Manifest)',
    description: 'Status: PENDING | Provenance: SOURCE_FILE | Mutation: 0 | Isolation: Tenant-isolated (MAEW HOLDINGS CO., LTD.) | Canonical write: BLOCKED',
    timestamp: '05:06:01 ICT',
    metaHash: 'source:TNT-TH-001 (Digest: NOT COMPUTED)',
    statuteRef: 'Hardening v2.1 Intake Gate (Provenance: SOURCE_FILE, Mutation: 0)',
    targetView: 'dashboard',
    severity: 'info',
  },
  {
    id: 'evt-evidence-fios',
    type: 'EVIDENCE_IMPORTED',
    title: 'Evidence Ingested: DS-901-PILOT (FIOS Pilot Dataset)',
    description: 'Status: PENDING | Provenance: SOURCE_FILE | Mutation: 0 | Classification: Non-live pilot dataset | Canonical write: BLOCKED',
    timestamp: '05:06:02 ICT',
    metaHash: 'source:DS-901-PILOT (Digest: NOT COMPUTED)',
    statuteRef: 'Hardening v2.1 Intake Gate (Provenance: SOURCE_FILE, Mutation: 0)',
    targetView: 'dashboard',
    severity: 'info',
  },
  {
    id: 'evt-000',
    type: 'COMPLIANCE',
    title: 'Thai Electronic Transactions Act (Sec 9, 26, 28) Bound',
    description: 'Sovereign Seal Chain runtime anchored to ETDA Level 3+ standards and Passport #EP-SOVEREIGN-01.',
    timestamp: '05:01:22 ICT',
    statuteRef: 'มาตรา 9, 26, 28 (ETDA Level 3+)',
    targetView: 'security',
    severity: 'success',
  },
  {
    id: 'evt-001',
    type: 'CRYPTO',
    title: 'Sovereign Genesis Block #849202 Sealed',
    description: 'Merkle Root 909ab814...fa4c68 anchored with 14,902 cryptographic certificates.',
    timestamp: '05:03:08 ICT',
    metaHash: 'sha256:909ab8146747f520beec1907beab286c06a38096f9bf00f40d8aa536b3fa4c68',
    statuteRef: 'มาตรา 26: ลายมือชื่อดิจิทัลที่เชื่อถือได้',
    targetView: 'security',
    severity: 'success',
  },
  {
    id: 'evt-002',
    type: 'HARDWARE',
    title: 'Hardware Cryostat Chamber Stabilized',
    description: 'Sub-Kelvin base temperature locked at 12.4 mK with 0.9997 coherence ratio.',
    timestamp: '05:04:12 ICT',
    metaHash: 'qstate:768Q_COHERENCE_99.97PCT',
    severity: 'info',
  },
  {
    id: 'evt-003',
    type: 'COMPLIANCE',
    title: 'PDPA Thailand Compliance Pre-Flight Verified',
    description: 'Sections 19, 27, 37 validated against Thai Sovereign Custodian Passport #EP-SOVEREIGN-01.',
    timestamp: '05:05:30 ICT',
    statuteRef: 'พ.ร.บ. คุ้มครองข้อมูลส่วนบุคคล (PDPA Sec 37)',
    targetView: 'security',
    severity: 'success',
  },
];

export default function App() {
  const [currentView, setCurrentView] = useState<ViewType>('dashboard');
  const [isCertificateOpen, setIsCertificateOpen] = useState(false);
  const [isLegalSearchOpen, setIsLegalSearchOpen] = useState(false);
  const [isShortcutsOpen, setIsShortcutsOpen] = useState(false);
  const [isEventsSidebarOpen, setIsEventsSidebarOpen] = useState(false);
  const [isAudioActive, setIsAudioActive] = useState(false);
  const [aggregateEntropy, setAggregateEntropy] = useState<number>(48.2);
  const [carrierPitchHz, setCarrierPitchHz] = useState<number>(882);
  const [snapshots, setSnapshots] = useState<HardwareSnapshot[]>(INITIAL_HARDWARE_SNAPSHOTS);
  const [lastSnapshotTime, setLastSnapshotTime] = useState<number>(0);
  const [heartbeatTick, setHeartbeatTick] = useState<boolean>(false);
  const [systemEvents, setSystemEvents] = useState<SystemEvent[]>(INITIAL_SYSTEM_EVENTS);
  const [isSystemActivityFrozen, setIsSystemActivityFrozen] = useState<boolean>(false);
  const [isMonochromeMode, setIsMonochromeMode] = useState<boolean>(() => {
    try {
      return localStorage.getItem('zyrquen_monochrome_mode') === 'true';
    } catch {
      return false;
    }
  });

  const handleToggleMonochrome = useCallback((enabled?: boolean) => {
    setIsMonochromeMode((prev) => {
      const next = enabled !== undefined ? enabled : !prev;
      try {
        localStorage.setItem('zyrquen_monochrome_mode', String(next));
      } catch (e) {
        console.error(e);
      }
      return next;
    });
  }, []);

  // Background atmospheric ambient sound generator:
  // Dynamically modulates frequency and pitch in real time based on aggregate system entropy level
  useEffect(() => {
    if (isAudioActive) {
      const pitch = updateAtmosphericEntropyPitch(aggregateEntropy, true);
      setCarrierPitchHz(pitch);
    }
  }, [isAudioActive, aggregateEntropy]);

  // Organic real-time drift of aggregate system entropy
  useEffect(() => {
    const entropyDriftTimer = setInterval(() => {
      setAggregateEntropy((prev) => {
        const drift = (Math.random() - 0.49) * 2.8;
        const next = Math.max(26, Math.min(78, prev + drift));
        return Math.round(next * 10) / 10;
      });
    }, 1500);

    return () => clearInterval(entropyDriftTimer);
  }, []);

  // Heartbeat pulse timer in sync with telemetry
  useEffect(() => {
    const isRecent = Date.now() - lastSnapshotTime < 6000;
    const intervalTime = isRecent ? 500 : 1000; // Accelerated heartbeat when snapshot is captured!

    const interval = setInterval(() => {
      setHeartbeatTick((prev) => !prev);
    }, intervalTime);

    return () => clearInterval(interval);
  }, [lastSnapshotTime]);

  const addSystemEvent = useCallback(
    (
      type: SystemEvent['type'],
      title: string,
      description: string,
      metaHash?: string,
      severity: SystemEvent['severity'] = 'info',
      statuteRef?: string,
      targetView?: SystemEvent['targetView']
    ) => {
      const newEvt: SystemEvent = {
        id: `evt-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        type,
        title,
        description,
        timestamp: new Date().toLocaleTimeString('en-GB', { hour12: false }) + ' ICT',
        metaHash,
        statuteRef,
        targetView,
        severity,
      };

      setSystemEvents((prev) => [newEvt, ...prev]);

      // Low-Latency Verbal Feedback Loop for Critical and Anomaly Events
      try {
        announceSystemEventVerbal(type, title, severity);
      } catch (err) {
        console.warn('Verbal announcer failed:', err);
      }
    },
    []
  );

  // Register Write Firewall to dispatch directly to SystemEvents
  useEffect(() => {
    WriteFirewallEngine.registerSystemEventHandler((type, title, desc, meta, sev, statute, view) => {
      addSystemEvent(type, title, desc, meta, sev, statute, view);
    });
  }, [addSystemEvent]);

  // Trigger 'EVIDENCE_IMPORTED' audit events upon application initialization
  useEffect(() => {
    // 1. Audit event for TNT-TH-001
    addSystemEvent(
      'EVIDENCE_IMPORTED',
      'Evidence Imported: TNT-TH-001 (Tenant Manifest)',
      'Status: PENDING | Provenance: SOURCE_FILE | Mutation: 0 | Scope: Sovereign Physical Hardware Isolation (MAEW HOLDINGS CO., LTD.) | Canonical write: BLOCKED',
      'source:TNT-TH-001 (Digest: NOT COMPUTED)',
      'info',
      'Hardening v2.1 Intake Gate (Provenance: SOURCE_FILE, Mutation: 0)',
      'dashboard'
    );

    // 2. Audit event for DS-901-PILOT
    addSystemEvent(
      'EVIDENCE_IMPORTED',
      'Evidence Imported: DS-901-PILOT (FIOS Pilot Dataset)',
      'Status: PENDING | Provenance: SOURCE_FILE | Mutation: 0 | Scope: Non-Live Pilot Dataset (Zero Trading Authority) | Canonical write: BLOCKED',
      'source:DS-901-PILOT (Digest: NOT COMPUTED)',
      'info',
      'Hardening v2.1 Intake Gate (Provenance: SOURCE_FILE, Mutation: 0)',
      'dashboard'
    );
  }, [addSystemEvent]);

  // Automated background backup service subscription
  useEffect(() => {
    automatedBackupService.start();

    const unsubscribe = automatedBackupService.onSnapshot((record) => {
      if (isSystemActivityFrozen) return;

      const newSnap = createTelemetrySnapshot(
        {
          core0: 41 + Math.floor(Math.random() * 5),
          core1: 39 + Math.floor(Math.random() * 4),
          core2: 43 + Math.floor(Math.random() * 6),
          core3: 38 + Math.floor(Math.random() * 5),
        },
        snapshots.length,
        snapshots[0]?.sealedHash
      );
      setSnapshots((prev) => [newSnap, ...prev]);
      setLastSnapshotTime(Date.now());

      addSystemEvent(
        'BACKUP',
        `Automated System Backup #${record.snapshotNumber} Sealed`,
        `Merkle root: ${record.merkleRoot.slice(0, 18)}... • Scope: ${record.statesCaptured} subsystem states, ${record.logsCount} audit records • Integrity: 100% Verified`,
        record.merkleRoot,
        'success',
        'พ.ร.บ. ธุรกรรมฯ มาตรา 26/28 & NIST PQC (Dilithium-5)',
        'ledger'
      );
    });

    return () => {
      unsubscribe();
    };
  }, [addSystemEvent, snapshots, isSystemActivityFrozen]);

  const handleToggleFreezeSystemActivity = useCallback(() => {
    setIsSystemActivityFrozen((prev) => {
      const next = !prev;
      if (next) {
        automatedBackupService.stop();
        if (isAudioActive) {
          toggleSovereignSynth882Hz(false);
        }
        addSystemEvent(
          'HARDWARE',
          'SYSTEM ACTIVITY FROZEN (MAINTENANCE STATE-PRESERVED)',
          'Automated telemetry capture, scheduled backup timers, and audio carrier modulation paused. SSoT state preserved.',
          'freeze:state_preservation_armed',
          'warning',
          'ISO/IEC 27037 Digital Forensics State Preservation',
          'pulse'
        );
      } else {
        automatedBackupService.start();
        if (isAudioActive) {
          toggleSovereignSynth882Hz(true);
          updateAtmosphericEntropyPitch(aggregateEntropy, true);
        }
        addSystemEvent(
          'HARDWARE',
          'SYSTEM ACTIVITY RESUMED (LIVE TELEMETRY ACTIVE)',
          'Automated telemetry stream, background backup engine, and 882Hz harmonic clock resumed.',
          'freeze:state_preservation_disarmed',
          'success',
          'ISO/IEC 27037 Live Telemetry Ingest',
          'pulse'
        );
      }
      return next;
    });
  }, [isAudioActive, aggregateEntropy, addSystemEvent]);

  const handleToggleAudio = useCallback(() => {
    setIsAudioActive((prev) => {
      const next = !prev;
      toggleSovereignSynth882Hz(next);
      if (next) {
        updateAtmosphericEntropyPitch(aggregateEntropy, true);
      }
      return next;
    });
    const next = !isAudioActive;
    addSystemEvent(
      'AUDIO',
      next ? 'Sovereign Audio Carrier Active' : 'Sovereign Audio Muted',
      next ? 'Synthesized continuous harmonic carrier oscillator initialized with dynamic entropy pitch modulation.' : 'Audio carrier halted.',
      'audio:carrier_synth_stream',
      'info'
    );
  }, [isAudioActive, aggregateEntropy, addSystemEvent]);

  const handleAddSnapshot = (newSnap: HardwareSnapshot) => {
    setSnapshots((prev) => {
      const nextSnaps = [newSnap, ...prev];

      // Telemetry Anomaly Observer: Detect statistical outliers against baseline distribution
      const anomalyResult = TelemetryAnomalyObserver.evaluate(newSnap, prev);
      if (anomalyResult.hasAnomaly) {
        anomalyResult.anomalies.forEach((anom) => {
          addSystemEvent(
            'ANOMALY',
            `Statistical Anomaly: ${anom.metricName} Outlier (${anom.zScore >= 0 ? '+' : ''}${anom.zScore.toFixed(1)}σ)`,
            `Telemetry value ${anom.value.toFixed(1)} deviates significantly from historical baseline (μ = ${anom.mean.toFixed(1)}, σ = ${anom.stdDev.toFixed(1)}). Auto-flagged for isolation.`,
            newSnap.sealedHash,
            'critical',
            'ISO/IEC 27037 Telemetry Anomaly Protocol',
            'pulse'
          );
        });
      }

      return nextSnaps;
    });
    setLastSnapshotTime(Date.now());
    // Computational activity pulse elevates entropy momentarily
    setAggregateEntropy((prev) => Math.min(85, Math.round((prev + 6.8) * 10) / 10));
    
    // 1. Primary Hardware Event
    addSystemEvent(
      'HARDWARE',
      `Hardware Snapshot #${newSnap.snapshotNumber} Sealed`,
      `Captured ${newSnap.id}: CPU ${newSnap.cpuAverage}% • Cryo ${newSnap.cryoTempMk}mK • QOps ${newSnap.qopsThroughput}`,
      newSnap.sealedHash,
      'success'
    );

    // 2. Automatic Legal Compliance Alert (Section 26 & 28 Invariant Verification)
    setTimeout(() => {
      addSystemEvent(
        'COMPLIANCE',
        `มาตรา 26 (Sec 26) Cryptographic Invariant Sealed`,
        `Snapshot #${newSnap.snapshotNumber} certified under ETDA Level 3+ with 0.00% invariant drift and Dilithium-5 post-quantum signature.`,
        `proof:merkle_block_invariant_${newSnap.snapshotNumber}`,
        'success',
        'พ.ร.บ. ธุรกรรมฯ มาตรา 26 (ETDA Level 3+)',
        'security'
      );
    }, 200);

    // Open sidebar subtly to showcase live activity feed
    setIsEventsSidebarOpen(true);
  };

  const handleLegalSearchExecuted = (query: string, summary: string) => {
    // 1. Search Query Event
    addSystemEvent(
      'LEGAL_SEARCH',
      `Thai Legal Search: "${query.slice(0, 36)}..."`,
      summary,
      `oracle:query_${Date.now()}`,
      'info'
    );

    // 2. Automatic Legal Compliance Citation Alert
    setTimeout(() => {
      addSystemEvent(
        'COMPLIANCE',
        `Statutory Reference: Section 9, 26, 28 ↔ Sovereign Chain`,
        `Real-time Thai statutory grounding retrieved for query. Cryptographic proof mapping ready for review.`,
        `statute:etda_electronic_trans_act_2544`,
        'success',
        'Sec 9, 26, 28 & PDPA ↔ Sovereign Seal',
        'security'
      );
    }, 250);

    // Slide in sidebar to surface live grounding event
    setIsEventsSidebarOpen(true);
  };

  // Global Keyboard Shortcuts Listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      const isInput =
        target &&
        (target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.isContentEditable);

      // 1. Meta / Ctrl shortcuts (work even inside inputs for global commands)
      if (e.metaKey || e.ctrlKey) {
        const key = e.key.toLowerCase();

        if (key === 'k') {
          e.preventDefault();
          playTone(680, 0.08);
          setIsLegalSearchOpen((prev) => !prev);
          return;
        }

        if (key === 'e') {
          e.preventDefault();
          playTone(640, 0.06);
          setIsEventsSidebarOpen((prev) => !prev);
          return;
        }

        if (key === 'l') {
          e.preventDefault();
          playTone(540, 0.06);
          setCurrentView('ledger');
          return;
        }

        if (key === 'p') {
          e.preventDefault();
          playTone(540, 0.06);
          setCurrentView('pulse');
          return;
        }

        if (key === 'q') {
          e.preventDefault();
          playTone(540, 0.06);
          setCurrentView('quantum');
          return;
        }

        if (key === 'g') {
          e.preventDefault();
          playTone(720, 0.1);
          setIsCertificateOpen((prev) => !prev);
          return;
        }

        if (key === '/') {
          e.preventDefault();
          playTone(620, 0.06);
          setIsShortcutsOpen((prev) => !prev);
          return;
        }
      }

      // 2. Escape to dismiss modals and sidebars
      if (e.key === 'Escape') {
        if (isEventsSidebarOpen) {
          setIsEventsSidebarOpen(false);
          return;
        }
        if (isShortcutsOpen) {
          setIsShortcutsOpen(false);
          return;
        }
        if (isLegalSearchOpen) {
          setIsLegalSearchOpen(false);
          return;
        }
        if (isCertificateOpen) {
          setIsCertificateOpen(false);
          return;
        }
      }

      // 3. Direct single-key shortcuts when NOT focusing an input
      if (!isInput && !e.metaKey && !e.ctrlKey && !e.altKey) {
        if (e.key === '?' || (e.shiftKey && e.key === '/')) {
          e.preventDefault();
          playTone(620, 0.06);
          setIsShortcutsOpen((prev) => !prev);
          return;
        }

        if (e.key.toLowerCase() === 'e' && e.shiftKey) {
          e.preventDefault();
          playTone(640, 0.06);
          setIsEventsSidebarOpen((prev) => !prev);
          return;
        }

        if (e.key.toLowerCase() === 'm') {
          e.preventDefault();
          handleToggleAudio();
          return;
        }

        // Direct number key navigation (1-9, 0, -, =, r, c)
        const viewKeyMap: Record<string, ViewType> = {
          '1': 'dashboard',
          'c': 'council',
          'C': 'council',
          'r': 'production',
          'R': 'production',
          '2': 'quantum',
          '3': 'nexus',
          '4': 'vault',
          '5': 'ledger',
          '6': 'pulse',
          '7': 'forge',
          '8': 'matrix',
          '9': 'archive',
          '0': 'console',
          'u': 'unified',
          'U': 'unified',
          'h': 'heatmap',
          'H': 'heatmap',
          '-': 'security',
          '=': 'settings',
          'l': 'legal',
          'L': 'legal',
        };

        if (viewKeyMap[e.key]) {
          e.preventDefault();
          playTone(560, 0.06);
          setCurrentView(viewKeyMap[e.key]);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isShortcutsOpen, isLegalSearchOpen, isCertificateOpen, isEventsSidebarOpen, handleToggleAudio]);

  const persona = VIEW_PERSONAS[currentView] || VIEW_PERSONAS.dashboard;

  const renderCurrentView = () => {
    switch (currentView) {
      case 'dashboard':
        return <DashboardView onNavigate={setCurrentView} onOpenCertificate={() => setIsCertificateOpen(true)} />;
      case 'unified':
        return (
          <UnifiedMultiverseControlPanel
            onNavigate={setCurrentView}
            onOpenCertificate={() => setIsCertificateOpen(true)}
            snapshots={snapshots}
            onAddHardwareSnapshot={handleAddSnapshot}
            onAddSystemEvent={addSystemEvent}
            isAudioActive={isAudioActive}
            onToggleAudio={handleToggleAudio}
            isSystemActivityFrozen={isSystemActivityFrozen}
            onToggleFreezeSystemActivity={handleToggleFreezeSystemActivity}
          />
        );
      case 'heatmap':
        return (
          <GovernanceHealthHeatmap
            onNavigateToView={setCurrentView}
            onAddSystemEvent={addSystemEvent}
          />
        );
      case 'council':
        return <CouncilView />;
      case 'production':
        return (
          <ProductionReadinessView
            onNavigate={setCurrentView}
            onAddSystemEvent={addSystemEvent}
          />
        );
      case 'quantum':
        return <QuantumView />;
      case 'nexus':
        return <NexusView />;
      case 'vault':
        return <VaultView />;
      case 'ledger':
        return <LedgerView snapshots={snapshots} />;
      case 'pulse':
        return (
          <PulseView
            snapshots={snapshots}
            onOpenEventsSidebar={() => setIsEventsSidebarOpen(true)}
            onAddHardwareSnapshot={handleAddSnapshot}
            onAddSystemEvent={addSystemEvent}
            isSystemActivityFrozen={isSystemActivityFrozen}
          />
        );
      case 'forge':
        return <ForgeView />;
      case 'matrix':
        return <MatrixView />;
      case 'archive':
        return <ArchiveView onNavigate={setCurrentView} />;
      case 'console':
        return (
          <ConsoleView
            onCaptureSnapshot={handleAddSnapshot}
            onNavigate={setCurrentView}
            snapshots={snapshots}
            snapshotsCount={snapshots.length}
          />
        );
      case 'security':
        return <SecurityView onAddSystemEvent={addSystemEvent} />;
      case 'settings':
        return (
          <SettingsView
            isAudioActive={isAudioActive}
            onToggleAudio={handleToggleAudio}
            isMonochrome={isMonochromeMode}
            onToggleMonochrome={handleToggleMonochrome}
            onCaptureSnapshot={() => handleAddSnapshot(createTelemetrySnapshot({ core0: 42, core1: 39, core2: 44, core3: 38 }, snapshots.length, snapshots[0]?.sealedHash))}
            onOpenLegalSearch={() => setIsLegalSearchOpen(true)}
            onNotifyEvent={(title, desc, type) => addSystemEvent(type, title, desc, 'settings:profile_switch', 'info')}
            onAddSystemEvent={addSystemEvent}
          />
        );
      case 'legal':
        return (
          <LegalView
            onNavigate={setCurrentView}
            onOpenSearch={() => setIsLegalSearchOpen(true)}
            onAddSystemEvent={addSystemEvent}
          />
        );
      default:
        return <DashboardView onNavigate={setCurrentView} onOpenCertificate={() => setIsCertificateOpen(true)} />;
    }
  };

  return (
    <div className={`min-h-screen bg-[#07080F] text-zinc-100 font-sans selection:bg-cyan-500/30 selection:text-cyan-200 antialiased relative ${isMonochromeMode ? 'theme-monochrome' : ''}`}>
      {/* Background Persona Mesh Ambient Lighting with Smooth Morphing */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden transition-all duration-1000 ease-in-out">
        {/* Dynamic Top Orb */}
        <div
          className={`absolute top-[-10%] left-[20%] w-[650px] h-[650px] rounded-full blur-[150px] transition-all duration-1000 ease-in-out ${persona.orb1}`}
        />
        {/* Dynamic Mid Orb */}
        <div
          className={`absolute top-[40%] right-[10%] w-[550px] h-[550px] rounded-full blur-[150px] transition-all duration-1000 ease-in-out ${persona.orb2}`}
        />
        {/* Dynamic Bottom Orb */}
        <div
          className={`absolute bottom-[-10%] left-[30%] w-[750px] h-[750px] rounded-full blur-[170px] transition-all duration-1000 ease-in-out ${persona.orb3}`}
        />
      </div>

      {/* Top Fixed Navigation & Status Bar */}
      <Navigation
        currentView={currentView}
        onSelectView={setCurrentView}
        onOpenCertificate={() => setIsCertificateOpen(true)}
        onOpenLegalSearch={() => setIsLegalSearchOpen(true)}
        onOpenShortcuts={() => setIsShortcutsOpen(true)}
        onOpenEventsSidebar={() => setIsEventsSidebarOpen((prev) => !prev)}
        eventsCount={systemEvents.length}
        isAudioActive={isAudioActive}
        onToggleAudio={handleToggleAudio}
        isSystemActivityFrozen={isSystemActivityFrozen}
        onToggleFreezeSystemActivity={handleToggleFreezeSystemActivity}
        onCaptureSnapshot={() => handleAddSnapshot(createTelemetrySnapshot({ core0: 42, core1: 39, core2: 44, core3: 38 }, snapshots.length, snapshots[0]?.sealedHash))}
      />

      {/* Main Content Area with Sliding Curtain OS Entrance Transitions */}
      <main className="relative z-10 max-w-[1720px] mx-auto px-4 sm:px-6 py-6 pb-20 overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentView}
            className="relative"
            initial={{ opacity: 0, x: 24, filter: 'blur(5px)' }}
            animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, x: -24, filter: 'blur(5px)' }}
            transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Subtle Sliding Curtain Wipe & Shimmer Effect */}
            <motion.div
              initial={{ scaleX: 1, opacity: 0.5 }}
              animate={{ scaleX: 0, opacity: 0 }}
              exit={{ scaleX: 1, opacity: 0.5 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="absolute inset-0 z-20 pointer-events-none bg-gradient-to-r from-transparent via-cyan-400/10 to-transparent origin-left"
            />

            <ErrorBoundary
              key={currentView}
              fallbackViewName={VIEW_PERSONAS[currentView]?.name || currentView}
              onResetToHome={() => setCurrentView('dashboard')}
            >
              {renderCurrentView()}
            </ErrorBoundary>
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Footer Attestation Bar */}
      <footer className="relative z-10 border-t border-white/8 bg-[#07080F]/90 backdrop-blur-md py-4">
        <div className="max-w-[1720px] mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-mono text-zinc-500">
          <div className="flex items-center gap-2.5 flex-wrap">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span className="font-semibold text-zinc-300">ZYRQUEN Ω∞ FROZEN v1.2 LTS</span>
            <span>•</span>
            <span className="text-zinc-400">Root: 909ab814...fa4c68</span>

            {/* Subtle Hardware Telemetry Heartbeat Indicator */}
            <span>•</span>
            <div
              onClick={() => {
                playTone(680, 0.04);
                setCurrentView('pulse');
              }}
              className={`flex items-center gap-1.5 px-2 py-0.5 rounded-full border cursor-pointer transition-all ${
                Date.now() - lastSnapshotTime < 6000
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 shadow-[0_0_12px_rgba(16,185,129,0.3)] animate-pulse'
                  : 'bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-zinc-200 border-white/10'
              }`}
              title="Hardware Telemetry Heartbeat Frequency (Click to view Pulse analysis)"
            >
              <span className="relative flex h-2 w-2">
                <span
                  className={`absolute inline-flex h-full w-full rounded-full opacity-75 animate-ping ${
                    Date.now() - lastSnapshotTime < 6000 ? 'bg-emerald-400' : 'bg-cyan-400'
                  }`}
                />
                <span
                  className={`relative inline-flex rounded-full h-2 w-2 ${
                    Date.now() - lastSnapshotTime < 6000 ? 'bg-emerald-400' : 'bg-cyan-400'
                  }`}
                />
              </span>
              <Activity
                className={`w-3 h-3 transition-transform duration-200 ${
                  heartbeatTick ? 'scale-125 text-cyan-300' : 'scale-90 text-zinc-500'
                }`}
              />
              <span className="text-[10px]">
                {Date.now() - lastSnapshotTime < 6000 ? (
                  <span className="text-emerald-300 font-bold">SNAPSHOT SYNC: 2.00 Hz</span>
                ) : (
                  <span>
                    HEARTBEAT: <span className="text-cyan-300 font-bold">1.00 Hz</span>
                  </span>
                )}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4 text-[11px]">
            <span>Block #849202 (14,902 Seals)</span>
            <span>•</span>
            <button
              onClick={() => {
                playTone(640, 0.05);
                setIsEventsSidebarOpen((prev) => !prev);
              }}
              className="text-cyan-400 hover:text-cyan-300 flex items-center gap-1 font-mono"
              title="Toggle System Events Activity Feed"
            >
              <Bell className="w-3.5 h-3.5" />
              <span>Events ({systemEvents.length})</span>
            </button>
            <span>•</span>
            <button
              onClick={() => {
                playTone(620, 0.05);
                setIsShortcutsOpen(true);
              }}
              className="text-zinc-400 hover:text-zinc-200 flex items-center gap-1 font-mono"
            >
              <Keyboard className="w-3.5 h-3.5 text-zinc-400" />
              <span>Shortcuts (?)</span>
            </button>
            <span>•</span>
            <button
              onClick={() => {
                playTone(600, 0.05);
                setIsLegalSearchOpen(true);
              }}
              className="text-cyan-400 hover:text-cyan-300 underline underline-offset-2"
            >
              Thai Laws & Cryptographic Search (Ctrl+K)
            </button>
            <span>•</span>
            <button
              onClick={() => {
                playTone(600, 0.05);
                setIsCertificateOpen(true);
              }}
              className="text-amber-400 hover:text-amber-300 underline underline-offset-2"
            >
              Gold Master Certificate (Ctrl+G)
            </button>
          </div>
        </div>
      </footer>

      {/* System Events Activity Feed Sidebar */}
      <SystemEventsSidebar
        isOpen={isEventsSidebarOpen}
        onClose={() => setIsEventsSidebarOpen(false)}
        events={systemEvents}
        onClearEvents={() => setSystemEvents([])}
        onNavigateToView={(v) => {
          setCurrentView(v);
          setIsEventsSidebarOpen(false);
        }}
      />

      {/* Global Keyboard Shortcuts Modal */}
      <KeyboardShortcutsModal
        isOpen={isShortcutsOpen}
        onClose={() => setIsShortcutsOpen(false)}
        onNavigate={(v) => {
          setCurrentView(v);
          setIsShortcutsOpen(false);
        }}
        onOpenSearch={() => {
          setIsLegalSearchOpen(true);
          setIsShortcutsOpen(false);
        }}
        onOpenCert={() => {
          setIsCertificateOpen(true);
          setIsShortcutsOpen(false);
        }}
        onToggleAudio={handleToggleAudio}
        onCaptureSnapshot={() => handleAddSnapshot(createTelemetrySnapshot({ core0: 42, core1: 39, core2: 44, core3: 38 }, snapshots.length, snapshots[0]?.sealedHash))}
      />

      {/* Certificate Modal */}
      <AuditCertificateModal
        isOpen={isCertificateOpen}
        onClose={() => setIsCertificateOpen(false)}
      />

      {/* Dynamic Atmospheric Ambient Sound Generator Floating HUD */}
      <div className="fixed bottom-6 left-6 z-40 hidden sm:flex items-center gap-2">
        <button
          onClick={handleToggleAudio}
          className={`px-3.5 py-2 rounded-2xl border font-mono text-xs backdrop-blur-xl transition-all shadow-xl flex items-center gap-2.5 ${
            isAudioActive
              ? 'bg-cyan-950/80 border-cyan-500/40 text-cyan-200 shadow-[0_0_20px_rgba(6,182,212,0.25)]'
              : 'bg-black/60 border-white/10 text-zinc-400 hover:text-zinc-200 hover:border-white/20'
          }`}
          title="Dynamic Atmospheric Ambient Sound Generator (Modulates Carrier Pitch by Aggregate System Entropy)"
        >
          <span className="relative flex h-2 w-2">
            {isAudioActive && (
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
            )}
            <span
              className={`relative inline-flex rounded-full h-2 w-2 ${
                isAudioActive ? 'bg-cyan-400' : 'bg-zinc-600'
              }`}
            ></span>
          </span>
          <Waves className={`w-3.5 h-3.5 ${isAudioActive ? 'text-cyan-400 animate-pulse' : 'text-zinc-500'}`} />
          <span className="font-bold">
            {isAudioActive ? 'ATMOSPHERIC AUDIO' : 'ATMOSPHERIC AUDIO'}
          </span>
          <span className="text-[11px] text-zinc-300 border-l border-white/10 pl-2 font-mono">
            {isAudioActive ? `${carrierPitchHz} Hz` : 'MUTED'}
          </span>
          <span className="text-[10px] px-1.5 py-0.5 rounded bg-cyan-500/15 text-cyan-300 border border-cyan-500/20 font-bold font-mono">
            H: {aggregateEntropy}%
          </span>
        </button>
      </div>

      {/* Thai Legal & Cryptographic Standards Search Modal (Google Search Tool) */}
      {/* Voice-to-Command Bridge */}
      <VoiceCommandOverlay 
        onNavigate={setCurrentView} 
        onCaptureSnapshot={() => handleAddSnapshot(createTelemetrySnapshot({ core0: 42, core1: 39, core2: 44, core3: 38 }, snapshots.length, snapshots[0]?.sealedHash))} 
        onNotifyEvent={addSystemEvent} 
      />
      <ThaiLegalSearchModal
        isOpen={isLegalSearchOpen}
        onClose={() => setIsLegalSearchOpen(false)}
        onSearchExecuted={handleLegalSearchExecuted}
      />
    </div>
  );
}

