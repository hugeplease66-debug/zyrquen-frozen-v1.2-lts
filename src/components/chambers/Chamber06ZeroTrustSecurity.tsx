import React from 'react';
import { 
  ShieldCheck, 
  Lock, 
  Cpu, 
  FileCheck, 
  Scale, 
  CheckCircle2, 
  KeyRound, 
  Binary,
  Layers
} from 'lucide-react';
import { SMART_CONTRACT_VULNERABILITIES } from '../../data/canonicalData';
import { PostQuantumStrengthIndicator } from '../security/PostQuantumStrengthIndicator';
import { ChamberRuntimeAtlas3D } from './ChamberRuntimeAtlas3D';

interface ChamberProps {
  lang: 'th' | 'en';
}

export const Chamber06ZeroTrustSecurity: React.FC<ChamberProps> = ({ lang }) => {
  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="rounded-xl bg-gradient-to-r from-purple-950/80 via-slate-900 to-slate-950 border border-purple-500/40 p-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full bg-purple-950 border border-purple-500/50 text-purple-300 text-xs font-mono-code font-bold flex items-center gap-1.5">
                <ShieldCheck className="w-3 h-3 text-purple-400" />
                ZERO TRUST & POST-QUANTUM CRYPTO
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 text-xs font-mono-code">
                NIST FIPS 203 / 204 / 205
              </span>
            </div>
            <h2 className="text-2xl font-display font-bold text-white tracking-tight">
              {lang === 'th' ? 'ระบบความปลอดภัยไร้ความไว้วางใจและการเข้ารหัสยุคหลังควอนตัม (Chamber 06)' : 'Chamber 06: Zero Trust Security & NIST PQC Suite'}
            </h2>
            <p className="text-sm text-slate-300 mt-1 max-w-3xl">
              {lang === 'th'
                ? 'โครงสร้างการเข้ารหัสลับต้านทานคอมพิวเตอร์ควอนตัม (Lattice-Based Cryptography) พร้อมการรับรองทางกฎหมายอิเล็กทรอนิกส์ไทย และการปรับปรุง Smart Contract V2 ครบถ้วน 100%'
                : 'Post-Quantum lattice cryptography architecture compliant with NIST standards and certified under Thai Electronic Transactions Act.'}
            </p>
          </div>
        </div>
      </div>

      {/* Dynamic Post-Quantum Hardness Indicator Bar & Session Analyzer */}
      <PostQuantumStrengthIndicator lang={lang} />

      {/* 3D Chamber Atlas Hologram Deck */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs font-mono-code text-slate-400">
          <span className="font-bold text-white flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-purple-400" />
            {lang === 'th' ? 'แบบจำลองภาพสามมิติ 3D Sovereign Atlas & Custodian Mesh' : '3D Sovereign Atlas & Custodian Mesh'}
          </span>
          <span className="text-cyan-400">
            {lang === 'th' ? 'คลิกและลากเพื่อหมุนมุมมอง' : 'Interactive Orbit 3D'}
          </span>
        </div>
        <ChamberRuntimeAtlas3D />
      </div>

      {/* 3 NIST PQC Standards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3">
          <div className="flex items-center justify-between">
            <span className="px-2 py-0.5 rounded bg-cyan-950 border border-cyan-500/30 text-cyan-300 font-mono-code text-xs font-bold">
              FIPS 204 (ML-DSA-87)
            </span>
            <span className="text-xs text-emerald-400 font-bold">PRIMARY</span>
          </div>
          <h4 className="font-display font-bold text-white text-base">CRYSTALS-Dilithium-5</h4>
          <p className="text-xs text-slate-300 leading-relaxed">
            {lang === 'th'
              ? 'ระบบลายมือชื่อดิจิทัลบนโครงข่ายแลตทิซขั้นสูงสุด (NIST Security Category 5) ใช้ในการลงนามรับรองซีลอธิปไตยทั้ง 14,902 ซีล'
              : 'Primary lattice-based digital signature scheme providing Category 5 quantum security across all 14,902 canonical seals.'}
          </p>
          <div className="text-[11px] font-mono-code text-slate-400 border-t border-slate-800 pt-2">
            Status: <span className="text-emerald-400 font-bold">ACTIVE_ENFORCED</span>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3">
          <div className="flex items-center justify-between">
            <span className="px-2 py-0.5 rounded bg-purple-950 border border-purple-500/30 text-purple-300 font-mono-code text-xs font-bold">
              FIPS 203 (ML-KEM-1024)
            </span>
            <span className="text-xs text-emerald-400 font-bold">ENCRYPT</span>
          </div>
          <h4 className="font-display font-bold text-white text-base">CRYSTALS-Kyber-1024</h4>
          <p className="text-xs text-slate-300 leading-relaxed">
            {lang === 'th'
              ? 'กลไกแลกเปลี่ยนกุญแจเข้ารหัสลับความมั่นคงสูงสุด ป้องกันการดักฟังข้อมูลข้ามช่องสัญญาณและโครงข่ายดาวเทียม'
              : 'Key encapsulation mechanism securing communications between 10/10 HSM enclaves and cross-orbital satellite links.'}
          </p>
          <div className="text-[11px] font-mono-code text-slate-400 border-t border-slate-800 pt-2">
            Status: <span className="text-emerald-400 font-bold">ACTIVE_ENFORCED</span>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3">
          <div className="flex items-center justify-between">
            <span className="px-2 py-0.5 rounded bg-amber-950 border border-amber-500/30 text-amber-300 font-mono-code text-xs font-bold">
              FIPS 205 (SLH-DSA)
            </span>
            <span className="text-xs text-amber-400 font-bold">STATELESS FALLBACK</span>
          </div>
          <h4 className="font-display font-bold text-white text-base">SPHINCS+ PQC</h4>
          <p className="text-xs text-slate-300 leading-relaxed">
            {lang === 'th'
              ? 'ลายมือชื่อดิจิทัลแบบไร้สถานะอิงฟังก์ชันแฮช สำรองกรณีเกิดข้อผิดพลาดในการประมวลผลแลตทิซ'
              : 'Stateless hash-based signature scheme acting as failsafe backup against lattice perturbations.'}
          </p>
          <div className="text-[11px] font-mono-code text-slate-400 border-t border-slate-800 pt-2">
            Status: <span className="text-emerald-400 font-bold">HOT_STANDBY</span>
          </div>
        </div>
      </div>

      {/* Smart Contract Audit & Remediation Deep Dive */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-display font-bold text-white text-base flex items-center gap-2">
            <FileCheck className="w-5 h-5 text-cyan-400" />
            {lang === 'th' ? 'รายงานการตรวจสอบและแก้ไข Smart Contract V2 (ZYR-01 ถึง ZYR-05)' : 'Smart Contract V2 Security Remediation Audit'}
          </h3>
          <span className="text-xs px-2.5 py-1 rounded bg-emerald-950 text-emerald-300 border border-emerald-500/40 font-mono-code font-bold">
            100% REMEDIATED
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950 text-slate-400 font-mono-code border-b border-slate-800">
              <tr>
                <th className="p-3">ID</th>
                <th className="p-3">Vulnerability Title</th>
                <th className="p-3">Severity</th>
                <th className="p-3">Status</th>
                <th className="p-3">Remediation Implementation</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {SMART_CONTRACT_VULNERABILITIES.map((vuln) => (
                <tr key={vuln.id} className="hover:bg-slate-850 transition-colors">
                  <td className="p-3 font-mono-code font-bold text-cyan-400">{vuln.id}</td>
                  <td className="p-3 font-medium text-white">{vuln.title}</td>
                  <td className="p-3">
                    <span className={`px-2 py-0.5 rounded font-mono-code font-bold ${
                      vuln.severity === 'CRITICAL' ? 'bg-red-950 text-red-400 border border-red-500/30' :
                      vuln.severity === 'HIGH' ? 'bg-amber-950 text-amber-400 border border-amber-500/30' :
                      vuln.severity === 'MEDIUM' ? 'bg-yellow-950 text-yellow-400 border border-yellow-500/30' :
                      'bg-blue-950 text-blue-400 border border-blue-500/30'
                    }`}>
                      {vuln.severity}
                    </span>
                  </td>
                  <td className="p-3">
                    <span className="text-emerald-400 font-bold flex items-center gap-1 font-mono-code">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      PASSED
                    </span>
                  </td>
                  <td className="p-3 font-mono-code text-[11px] text-slate-300 bg-slate-950/40">
                    {vuln.remediation || vuln.mitigation}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
