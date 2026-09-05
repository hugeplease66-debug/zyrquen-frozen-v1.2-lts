import React, { useState, useEffect, useRef } from 'react';
import { 
  Binary, 
  Database, 
  Link as LinkIcon, 
  CheckCircle2, 
  Play, 
  Pause, 
  Plus, 
  RefreshCw, 
  Zap, 
  Layers, 
  ShieldCheck,
  ChevronRight,
  GitCommit
} from 'lucide-react';
import { SYSTEM_METADATA } from '../../data/canonicalData';

interface MerkleStreamProps {
  lang: 'th' | 'en';
}

interface IngestedTx {
  id: string;
  txHash: string;
  leafHash: string;
  parentHash: string;
  sealIndex: number;
  blockHeight: number;
  amount: number;
  timestamp: string;
  status: 'INGESTED' | 'HASHING' | 'TREE_LINKED' | 'BLOCK_ANCHORED';
  algorithm: string;
}

export const MerkleStreamVisualizer: React.FC<MerkleStreamProps> = ({ lang }) => {
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [streamSpeed, setStreamSpeed] = useState<'slow' | 'normal' | 'fast'>('normal');
  const [currentBlock, setCurrentBlock] = useState<number>(SYSTEM_METADATA.canonicalBlock);
  const [totalIngestedCount, setTotalIngestedCount] = useState<number>(14902);
  const [recentTxs, setRecentTxs] = useState<IngestedTx[]>([]);
  const [activeRootHash, setActiveRootHash] = useState<string>(SYSTEM_METADATA.genesisMerkleRoot);
  const [highlightTxId, setHighlightTxId] = useState<string | null>(null);

  // Generate deterministic pseudo-random hash
  const generateHash = (prefix: string, seed: number) => {
    const chars = '0123456789abcdef';
    let str = prefix;
    for (let i = 0; i < 48; i++) {
      const idx = (seed * 17 + i * 31 + 7) % chars.length;
      str += chars[idx];
    }
    return str;
  };

  // Seed initial live stream
  useEffect(() => {
    const initialList: IngestedTx[] = [
      {
        id: 'TX-CANONICAL-14902',
        txHash: '0x9a8f4c127e8d5b3a201f6e9c4d8b7a1e0f3c5d7b',
        leafHash: '0x3f8e12b7a9c405df6e891234abcd567890ef1234',
        parentHash: '0x7b4a19c8d2e3f40516789abcdef0123456789abc',
        sealIndex: 14902,
        blockHeight: SYSTEM_METADATA.canonicalBlock,
        amount: 142000.00,
        timestamp: '14:02:45.120',
        status: 'BLOCK_ANCHORED',
        algorithm: 'ML-DSA-87 (Dilithium-5)'
      },
      {
        id: 'TX-CANONICAL-14901',
        txHash: '0x8b7e3d016c7a4a2f190e5d8b3c7a6f0e9d2b4c6a',
        leafHash: '0x2e7d01a6b8b304ce5d7801239876543210fe4321',
        parentHash: '0x7b4a19c8d2e3f40516789abcdef0123456789abc',
        sealIndex: 14901,
        blockHeight: SYSTEM_METADATA.canonicalBlock,
        amount: 85000.00,
        timestamp: '14:02:44.890',
        status: 'BLOCK_ANCHORED',
        algorithm: 'ML-DSA-87 (Dilithium-5)'
      },
      {
        id: 'TX-CANONICAL-14900',
        txHash: '0x7a6d2c905b6e3f1e08fd4c7a2b6f5e9d8c1a3b5f',
        leafHash: '0x1d6c9095a7a203bd4c6790128765432109ed3210',
        parentHash: '0x6a3908b7c1d2e3f4056789abcdef0123456789ab',
        sealIndex: 14900,
        blockHeight: SYSTEM_METADATA.canonicalBlock,
        amount: 250000.00,
        timestamp: '14:02:43.650',
        status: 'BLOCK_ANCHORED',
        algorithm: 'ML-DSA-87 (Dilithium-5)'
      }
    ];
    setRecentTxs(initialList);
  }, []);

  // Periodic ingest simulator
  useEffect(() => {
    if (!isPlaying) return;

    const intervalTime = streamSpeed === 'slow' ? 3500 : streamSpeed === 'normal' ? 1800 : 800;

    const interval = setInterval(() => {
      const now = new Date();
      const timeStr = now.toTimeString().split(' ')[0] + '.' + now.getMilliseconds().toString().padStart(3, '0');
      const nextIndex = totalIngestedCount + 1;
      const seed = Date.now();

      const newTx: IngestedTx = {
        id: `TX-LIVE-${nextIndex}`,
        txHash: generateHash('0x', seed),
        leafHash: generateHash('0xleaf_', seed + 1),
        parentHash: generateHash('0xnode_', seed + 2),
        sealIndex: nextIndex,
        blockHeight: SYSTEM_METADATA.canonicalBlock,
        amount: Math.floor(1000 + Math.random() * 95000),
        timestamp: timeStr,
        status: 'INGESTED',
        algorithm: 'ML-DSA-87 (Dilithium-5)'
      };

      setRecentTxs((prev) => [newTx, ...prev.slice(0, 7)]);
      setTotalIngestedCount((prev) => prev + 1);
      setHighlightTxId(newTx.id);

      // Transition stages: INGESTED -> HASHING -> TREE_LINKED -> BLOCK_ANCHORED
      setTimeout(() => {
        setRecentTxs((prev) =>
          prev.map((t) => (t.id === newTx.id ? { ...t, status: 'HASHING' } : t))
        );
      }, 300);

      setTimeout(() => {
        setRecentTxs((prev) =>
          prev.map((t) => (t.id === newTx.id ? { ...t, status: 'TREE_LINKED' } : t))
        );
      }, 700);

      setTimeout(() => {
        setRecentTxs((prev) =>
          prev.map((t) => (t.id === newTx.id ? { ...t, status: 'BLOCK_ANCHORED' } : t))
        );
      }, 1200);

    }, intervalTime);

    return () => clearInterval(interval);
  }, [isPlaying, streamSpeed, totalIngestedCount]);

  const handleManualInject = () => {
    const now = new Date();
    const timeStr = now.toTimeString().split(' ')[0] + '.' + now.getMilliseconds().toString().padStart(3, '0');
    const nextIndex = totalIngestedCount + 1;
    const seed = Date.now();

    const manualTx: IngestedTx = {
      id: `TX-INJECT-${nextIndex}`,
      txHash: generateHash('0xinj_', seed),
      leafHash: generateHash('0xleaf_', seed + 5),
      parentHash: generateHash('0xnode_', seed + 8),
      sealIndex: nextIndex,
      blockHeight: SYSTEM_METADATA.canonicalBlock,
      amount: 500000.00,
      timestamp: timeStr,
      status: 'INGESTED',
      algorithm: 'ML-DSA-87 (Dilithium-5)'
    };

    setRecentTxs((prev) => [manualTx, ...prev.slice(0, 7)]);
    setTotalIngestedCount((prev) => prev + 1);
    setHighlightTxId(manualTx.id);

    setTimeout(() => {
      setRecentTxs((prev) =>
        prev.map((t) => (t.id === manualTx.id ? { ...t, status: 'HASHING' } : t))
      );
    }, 200);

    setTimeout(() => {
      setRecentTxs((prev) =>
        prev.map((t) => (t.id === manualTx.id ? { ...t, status: 'TREE_LINKED' } : t))
      );
    }, 500);

    setTimeout(() => {
      setRecentTxs((prev) =>
        prev.map((t) => (t.id === manualTx.id ? { ...t, status: 'BLOCK_ANCHORED' } : t))
      );
    }, 900);
  };

  return (
    <div 
      id="merkle-stream-visualizer-container"
      className="bg-slate-900/90 border border-slate-800 rounded-xl p-6 shadow-xl relative overflow-hidden space-y-5"
    >
      {/* Header & Stream Controller */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 rounded bg-cyan-950 border border-cyan-500/40 text-cyan-300 font-mono-code text-[11px] font-bold flex items-center gap-1">
              <Binary className="w-3 h-3 text-cyan-400" />
              LIVE MERKLE INGESTION STREAM
            </span>
            <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-500/30 font-mono-code text-[11px] font-bold">
              BLOCK #{currentBlock} ACTIVE
            </span>
          </div>
          <h3 className="font-display font-bold text-white text-lg tracking-tight">
            {lang === 'th' ? 'เครื่องมือจำลองภาพ Merkle Stream สด (Live Hash Ingestion)' : 'Real-Time Merkle Hash Ingestion & Blockchain Linker'}
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            {lang === 'th'
              ? 'จำลองการไหลเข้าของธุรกรรมสด การคำนวณแฮชระดับใบไม้ (Leaf Hash) การเชื่อมโยงกิ่งต้นไม้ Merkle และการตรึงบล็อกแบบคริปโตกราฟิก'
              : 'Live animated streaming of ingested transaction hashes, leaf derivation, intermediate node pairing, and permanent block anchoring.'}
          </p>
        </div>

        {/* Playback & Injection Controls */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="bg-slate-950 p-1 rounded-lg border border-slate-800 flex items-center gap-1">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className={`p-1.5 rounded text-xs font-mono-code flex items-center gap-1.5 transition-colors ${
                isPlaying ? 'bg-amber-950 text-amber-300 hover:bg-amber-900' : 'bg-emerald-950 text-emerald-300 hover:bg-emerald-900'
              }`}
              title={isPlaying ? 'Pause Stream' : 'Resume Stream'}
            >
              {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              <span>{isPlaying ? (lang === 'th' ? 'หยุดชั่วคราว' : 'Pause') : (lang === 'th' ? 'เล่นต่อ' : 'Resume')}</span>
            </button>

            <button
              onClick={() => setStreamSpeed('slow')}
              className={`px-2 py-1 rounded text-[10px] font-mono-code font-bold ${
                streamSpeed === 'slow' ? 'bg-cyan-900 text-cyan-200' : 'text-slate-400 hover:text-white'
              }`}
            >
              0.5x
            </button>
            <button
              onClick={() => setStreamSpeed('normal')}
              className={`px-2 py-1 rounded text-[10px] font-mono-code font-bold ${
                streamSpeed === 'normal' ? 'bg-cyan-900 text-cyan-200' : 'text-slate-400 hover:text-white'
              }`}
            >
              1.0x
            </button>
            <button
              onClick={() => setStreamSpeed('fast')}
              className={`px-2 py-1 rounded text-[10px] font-mono-code font-bold ${
                streamSpeed === 'fast' ? 'bg-cyan-900 text-cyan-200' : 'text-slate-400 hover:text-white'
              }`}
            >
              2.0x
            </button>
          </div>

          <button
            onClick={handleManualInject}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-950 border border-cyan-500/50 hover:bg-cyan-900 text-cyan-300 text-xs font-mono-code font-bold transition-all shadow-md shadow-cyan-950/50"
          >
            <Plus className="w-3.5 h-3.5 text-cyan-400" />
            {lang === 'th' ? 'ยิงธุรกรรมทดสอบ' : 'Inject Tx'}
          </button>
        </div>
      </div>

      {/* Merkle Root Banner */}
      <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-purple-950/80 border border-purple-500/40 text-purple-400">
            <GitCommit className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-white font-mono-code">GENESIS MERKLE ROOT ANCHOR</span>
              <span className="px-1.5 py-0.2 rounded bg-emerald-950 text-emerald-400 text-[10px] font-mono-code font-bold">
                MATCHED 100%
              </span>
            </div>
            <div className="font-mono-code text-xs text-slate-300 break-all select-all mt-0.5">
              {activeRootHash}
            </div>
          </div>
        </div>

        <div className="text-right shrink-0">
          <span className="text-[11px] text-slate-500 font-mono-code block">Total Processed:</span>
          <span className="text-sm font-mono-code font-bold text-cyan-400">
            {totalIngestedCount.toLocaleString()} {lang === 'th' ? 'ซีล / ธุรกรรม' : 'Seals / Txs'}
          </span>
        </div>
      </div>

      {/* Live Animated Pipeline Stream */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs font-mono-code text-slate-400">
          <span>{lang === 'th' ? 'สตรีมการรับเข้าและผูกมัดแฮชสด' : 'Live Ingest & Hashing Pipeline'}:</span>
          <span className="text-[11px] text-emerald-400 flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            {lang === 'th' ? 'กำลังสตรีมแบบเรียลไทม์' : 'Streaming Real-Time'}
          </span>
        </div>

        <div className="space-y-2.5">
          {recentTxs.map((tx, idx) => {
            const isLatest = idx === 0 && highlightTxId === tx.id;
            return (
              <div
                key={tx.id}
                className={`transition-all duration-500 rounded-lg p-3 border ${
                  isLatest
                    ? 'bg-slate-850 border-cyan-500 shadow-md shadow-cyan-950/40'
                    : 'bg-slate-950/80 border-slate-800/80 hover:border-slate-700'
                }`}
              >
                <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-3 text-xs">
                  {/* Tx identifier & Timestamp */}
                  <div className="flex items-center gap-2.5 shrink-0">
                    <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-700 text-slate-200 font-mono-code text-[11px] font-bold">
                      {tx.id}
                    </span>
                    <span className="text-slate-400 font-mono-code text-[11px]">{tx.timestamp}</span>
                    <span className="text-amber-300 font-mono-code font-semibold">
                      ฿{tx.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </span>
                  </div>

                  {/* Hash Linking Visual Pipeline */}
                  <div className="flex-1 w-full lg:w-auto flex flex-wrap items-center gap-2 font-mono-code text-[11px]">
                    {/* Tx Hash */}
                    <div className="bg-slate-900 px-2 py-1 rounded border border-slate-800 text-slate-300 flex items-center gap-1">
                      <span className="text-slate-500">Tx:</span>
                      <span className="text-cyan-300 truncate max-w-[110px]">{tx.txHash}</span>
                    </div>

                    <ChevronRight className="w-3.5 h-3.5 text-slate-600 shrink-0" />

                    {/* Leaf Hash */}
                    <div className={`px-2 py-1 rounded border flex items-center gap-1 ${
                      tx.status === 'INGESTED'
                        ? 'bg-amber-950/50 border-amber-500/40 text-amber-300 animate-pulse'
                        : 'bg-slate-900 border-slate-800 text-slate-300'
                    }`}>
                      <span className="text-slate-500">Leaf:</span>
                      <span className="text-purple-300 truncate max-w-[110px]">{tx.leafHash}</span>
                    </div>

                    <ChevronRight className="w-3.5 h-3.5 text-slate-600 shrink-0" />

                    {/* Parent Node Hash */}
                    <div className={`px-2 py-1 rounded border flex items-center gap-1 ${
                      tx.status === 'HASHING'
                        ? 'bg-purple-950/50 border-purple-500/40 text-purple-300 animate-pulse'
                        : 'bg-slate-900 border-slate-800 text-slate-300'
                    }`}>
                      <span className="text-slate-500">Node:</span>
                      <span className="text-emerald-300 truncate max-w-[110px]">{tx.parentHash}</span>
                    </div>
                  </div>

                  {/* Status Indicator */}
                  <div className="shrink-0 flex items-center gap-2">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono-code font-bold flex items-center gap-1.5 ${
                      tx.status === 'BLOCK_ANCHORED'
                        ? 'bg-emerald-950 border border-emerald-500/40 text-emerald-300'
                        : tx.status === 'TREE_LINKED'
                        ? 'bg-cyan-950 border border-cyan-500/40 text-cyan-300'
                        : tx.status === 'HASHING'
                        ? 'bg-purple-950 border border-purple-500/40 text-purple-300'
                        : 'bg-amber-950 border border-amber-500/40 text-amber-300'
                    }`}>
                      {tx.status === 'BLOCK_ANCHORED' ? (
                        <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                      ) : (
                        <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
                      )}
                      {tx.status}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
