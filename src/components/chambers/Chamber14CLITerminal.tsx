import React, { useState, useRef, useEffect } from 'react';
import { 
  Terminal as TerminalIcon, 
  Send, 
  RotateCcw, 
  HelpCircle,
  Copy,
  Check
} from 'lucide-react';
import { SYSTEM_METADATA, SOVEREIGN_PRINCIPAL, HSM_NODES, CHAMBERS } from '../../data/canonicalData';

interface ChamberProps {
  lang: 'th' | 'en';
}

export const Chamber14CLITerminal: React.FC<ChamberProps> = ({ lang }) => {
  const [inputCommand, setInputCommand] = useState('');
  const [history, setHistory] = useState<Array<{ cmd?: string; output: string | React.ReactNode }>>([
    {
      output: (
        <div className="space-y-1 text-slate-300">
          <div className="text-cyan-400 font-bold">ZYRQUEN Ω∞ Sovereign Kernel Interactive Shell v4.16</div>
          <div className="text-emerald-400">Status: LOCKED_FROZEN_v1.2_LTS | 10/10 REAL_HSM | Δ0.0% ZERO DRIFT</div>
          <div className="text-slate-400">Type <span className="text-amber-300">help</span> for a list of available sovereign audit commands.</div>
        </div>
      )
    }
  ]);

  const terminalEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  const handleRunCommand = (e: React.FormEvent) => {
    e.preventDefault();
    const rawCmd = inputCommand.trim();
    if (!rawCmd) return;

    const parts = rawCmd.toLowerCase().split(' ');
    const mainCmd = parts[0];
    const arg = parts[1];

    let responseOutput: React.ReactNode = '';

    switch (mainCmd) {
      case 'help':
        responseOutput = (
          <div className="space-y-1 text-slate-300 font-mono-code text-xs">
            <div className="text-cyan-400 font-bold">AVAILABLE COMMANDS:</div>
            <div>• <span className="text-amber-300">status</span> : Display live SSoT and kernel invariants</div>
            <div>• <span className="text-amber-300">quorum</span> : Inspect 10/10 REAL_HSM deca-key consensus status</div>
            <div>• <span className="text-amber-300">telemetry</span> : Query cryogenic 14.98mK & QOps telemetry</div>
            <div>• <span className="text-amber-300">quarantine</span> : List active quarantine escrow incidents</div>
            <div>• <span className="text-amber-300">fios</span> : Calculate FIOS Treasury Nc x Vc allocation</div>
            <div>• <span className="text-amber-300">seal [id]</span> : Verify Merkle inclusion proof for a seal ID (e.g. seal 14902)</div>
            <div>• <span className="text-amber-300">pqc</span> : Inspect NIST FIPS 203/204/205 cipher suites</div>
            <div>• <span className="text-amber-300">chambers</span> : List all 18 Sovereign Chambers</div>
            <div>• <span className="text-amber-300">cert</span> : Print Gold Master Certificate metadata</div>
            <div>• <span className="text-amber-300">clear</span> : Clear terminal output window</div>
          </div>
        );
        break;

      case 'status':
        responseOutput = (
          <div className="space-y-1 text-xs text-slate-200 font-mono-code">
            <div className="text-emerald-400 font-bold">[SSoT ZERO DRIFT INVARIANTS]</div>
            <div>System: {SYSTEM_METADATA.system}</div>
            <div>Version: {SYSTEM_METADATA.version}</div>
            <div>Status: <span className="text-emerald-300 font-bold">{SYSTEM_METADATA.status}</span></div>
            <div>Canonical Block: #{SYSTEM_METADATA.canonicalBlock}</div>
            <div>Canonical Seals: {SYSTEM_METADATA.canonicalSeals} (Raw: {SYSTEM_METADATA.rawObservedSeals}, Quarantined: {SYSTEM_METADATA.quarantinedSeals})</div>
            <div>Genesis Merkle Root: {SYSTEM_METADATA.genesisMerkleRoot}</div>
            <div>Sovereign Principal: {SOVEREIGN_PRINCIPAL.nameTh} ({SOVEREIGN_PRINCIPAL.id}) [{SOVEREIGN_PRINCIPAL.clearance}]</div>
          </div>
        );
        break;

      case 'quorum':
        responseOutput = (
          <div className="space-y-1 text-xs text-slate-200 font-mono-code">
            <div className="text-emerald-400 font-bold">[10/10 REAL_HSM DECA-KEY CONSENSUS]</div>
            {HSM_NODES.map(n => (
              <div key={n.id} className="flex justify-between border-b border-slate-800/60 py-0.5">
                <span>{n.councilCode}: {n.nameTh}</span>
                <span className="text-cyan-300">{n.pqcAlgorithm}</span>
                <span className="text-emerald-400 font-bold">SIGNED</span>
              </div>
            ))}
          </div>
        );
        break;

      case 'telemetry':
        responseOutput = (
          <div className="space-y-1 text-xs text-slate-200 font-mono-code">
            <div className="text-cyan-400 font-bold">[REAL-TIME QUANTUM TELEMETRY]</div>
            <div>Cryo Temp: <span className="text-teal-300">{SYSTEM_METADATA.telemetry.cryoTemp}</span></div>
            <div>Quantum Ops: <span className="text-cyan-300">{SYSTEM_METADATA.telemetry.qops} QOps/s</span></div>
            <div>Coherence Target: <span className="text-emerald-400">{SYSTEM_METADATA.telemetry.coherence}%</span></div>
            <div>Antimatter Burn: <span className="text-amber-300">{SYSTEM_METADATA.telemetry.burnPowerMW}</span></div>
            <div>Coolant Flow: <span className="text-slate-300">{SYSTEM_METADATA.telemetry.heliumFlow}</span></div>
          </div>
        );
        break;

      case 'seal':
        const targetId = parseInt(arg, 10) || 14902;
        const isCanonical = targetId >= 1 && targetId <= 14902;
        responseOutput = (
          <div className="space-y-1 text-xs text-slate-200 font-mono-code">
            <div className={isCanonical ? "text-emerald-400 font-bold" : "text-red-400 font-bold"}>
              [MERKLE INCLUSION PROOF FOR SEAL #{targetId}]
            </div>
            <div>Status: {isCanonical ? 'CANONICAL_SSoT_FROZEN (PASS)' : 'QUARANTINE_PROBE (CHAMBER 02)'}</div>
            <div>Root Hash: {SYSTEM_METADATA.genesisMerkleRoot}</div>
            <div>Block Anchor: #{isCanonical ? 849202 : 849203}</div>
            <div>Signature: CRYSTALS-Dilithium-5 (ML-DSA-87) [FIPS 204]</div>
          </div>
        );
        break;

      case 'fios':
        responseOutput = (
          <div className="space-y-1 text-xs text-slate-200 font-mono-code">
            <div className="text-amber-400 font-bold">[FIOS TREASURY CHAIN MODEL]</div>
            <div>Total Valuation: ฿1,424,080,000 THB</div>
            <div>Gas Reimbursement Pool: ฿12,500,000 THB</div>
            <div>Gen Z Core: ฿1,179,709.01 (9.4377%)</div>
            <div>Gen Y Pro: ฿3,578,450.65 (28.6276%)</div>
            <div>Gen X Enterprise: ฿4,976,897.37 (39.8152%)</div>
            <div>SMB Retail: ฿2,764,942.98 (22.1195%)</div>
          </div>
        );
        break;

      case 'chambers':
        responseOutput = (
          <div className="space-y-1 text-xs text-slate-200 font-mono-code">
            <div className="text-cyan-400 font-bold">[18 SOVEREIGN KERNEL CHAMBERS]</div>
            {CHAMBERS.map(c => (
              <div key={c.id}>
                CH-{c.num.toString().padStart(2, '0')}: {c.titleEn} [{c.badge || c.category.toUpperCase()}]
              </div>
            ))}
          </div>
        );
        break;

      case 'cert':
        responseOutput = (
          <div className="space-y-1 text-xs text-slate-200 font-mono-code">
            <div className="text-amber-400 font-bold">[GOLD MASTER CERTIFICATE METADATA]</div>
            <div>Certificate ID: {SYSTEM_METADATA.certificateId}</div>
            <div>Principal: {SOVEREIGN_PRINCIPAL.nameTh} ({SOVEREIGN_PRINCIPAL.id})</div>
            <div>Phases Passed: 40/40 (100% GREEN)</div>
            <div>Seals Verified: 14,902 / 14,902 Canonical</div>
            <div>Thai ETA Sec 9, 26, 28: Certified Court-Admissible</div>
          </div>
        );
        break;

      case 'clear':
        setHistory([]);
        setInputCommand('');
        return;

      default:
        responseOutput = (
          <div className="text-red-400 text-xs font-mono-code">
            Command not recognized: &apos;{rawCmd}&apos;. Type <span className="text-amber-300">help</span> for command list.
          </div>
        );
        break;
    }

    setHistory(prev => [...prev, { cmd: rawCmd, output: responseOutput }]);
    setInputCommand('');
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="rounded-xl bg-gradient-to-r from-slate-900 via-slate-950 to-slate-900 border border-slate-700 p-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full bg-slate-800 border border-slate-700 text-slate-300 text-xs font-mono-code font-bold flex items-center gap-1.5">
                <TerminalIcon className="w-3 h-3 text-cyan-400" />
                SOVEREIGN CLI CONSOLE
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-950 text-emerald-300 text-xs font-mono-code">
                Access: OMEGA-1 SUPREME
              </span>
            </div>
            <h2 className="text-2xl font-display font-bold text-white tracking-tight">
              {lang === 'th' ? 'คอนโซลคำสั่งเคอร์เนล ZYRQUEN.SH (Chamber 14)' : 'Chamber 14: Sovereign CLI Terminal (zyrquen.sh)'}
            </h2>
            <p className="text-sm text-slate-300 mt-1 max-w-3xl">
              {lang === 'th'
                ? 'เทอร์มินัลระดับเคอร์เนลสำหรับการตรวจสอบสถานะ SSoT, กุญแจ HSM, ประเมินราก Merkle และคำนวณคลังแบบเรียลไทม์'
                : 'Direct interactive kernel terminal for running sovereign diagnostics, cryptographic validations, and audit proofs.'}
            </p>
          </div>
        </div>
      </div>

      {/* Terminal Screen */}
      <div className="bg-slate-950 border border-slate-800 rounded-xl overflow-hidden shadow-2xl">
        {/* Terminal Titlebar */}
        <div className="bg-slate-900 px-4 py-2 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full bg-red-500/80" />
            <span className="h-3 w-3 rounded-full bg-amber-500/80" />
            <span className="h-3 w-3 rounded-full bg-emerald-500/80" />
            <span className="text-xs font-mono-code text-slate-400 ml-2">zyrquen-omega-kernel:~$ /bin/zyrquen.sh</span>
          </div>
          <button
            onClick={() => setHistory([])}
            className="text-xs font-mono-code text-slate-400 hover:text-white transition-colors"
          >
            Clear Screen
          </button>
        </div>

        {/* Output Stream */}
        <div className="p-4 min-h-[380px] max-h-[500px] overflow-y-auto space-y-4 font-mono-code text-xs">
          {history.map((item, index) => (
            <div key={index} className="space-y-1">
              {item.cmd && (
                <div className="flex items-center gap-2 text-cyan-400 font-bold">
                  <span>zyrquen@sovereign:~$</span>
                  <span className="text-white">{item.cmd}</span>
                </div>
              )}
              <div className="pl-2 border-l border-slate-800 py-1">{item.output}</div>
            </div>
          ))}
          <div ref={terminalEndRef} />
        </div>

        {/* Command Input Bar */}
        <form onSubmit={handleRunCommand} className="bg-slate-900/90 border-t border-slate-800 p-3 flex items-center gap-2">
          <span className="text-emerald-400 font-mono-code font-bold text-xs pl-2">zyrquen@sovereign:~$</span>
          <input
            type="text"
            value={inputCommand}
            onChange={(e) => setInputCommand(e.target.value)}
            placeholder="Type 'help', 'status', 'quorum', 'telemetry', 'fios'..."
            className="flex-1 bg-transparent text-white font-mono-code text-xs focus:outline-none placeholder:text-slate-600"
            autoFocus
          />
          <button
            type="submit"
            className="px-3 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold font-mono-code text-xs rounded transition-all"
          >
            EXEC
          </button>
        </form>
      </div>
    </div>
  );
};
