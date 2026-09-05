import React, { useState } from 'react';
import { 
  Coins, 
  Calculator, 
  TrendingUp, 
  Users, 
  PieChart as PieChartIcon, 
  ShieldCheck, 
  RotateCcw,
  CheckCircle2
} from 'lucide-react';
import { TREASURY_SEGMENTS } from '../../data/canonicalData';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';

interface ChamberProps {
  lang: 'th' | 'en';
}

const COLORS = ['#06b6d4', '#3b82f6', '#8b5cf6', '#f59e0b'];

export const Chamber07FIOSTreasury: React.FC<ChamberProps> = ({ lang }) => {
  const [totalPool, setTotalPool] = useState<number>(12500000);
  const totalChainValuation = 1424080000;

  // Calculate dynamic allocation based on total pool
  const calculatedSegments = TREASURY_SEGMENTS.map((seg) => {
    const dynamicAllocation = (totalPool * seg.weightPct) / 100;
    return {
      ...seg,
      dynamicAllocation
    };
  });

  const pieData = calculatedSegments.map((seg) => ({
    name: seg.name,
    value: seg.totalSegmentValueThb
  }));

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="rounded-xl bg-gradient-to-r from-amber-950/80 via-slate-900 to-slate-950 border border-amber-500/40 p-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full bg-amber-950 border border-amber-500/50 text-amber-300 text-xs font-mono-code font-bold flex items-center gap-1.5">
                <Coins className="w-3 h-3 text-amber-400" />
                FIOS TREASURY CHAIN MODEL
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 text-xs font-mono-code">
                Valuation: ฿1,424,080,000 THB
              </span>
            </div>
            <h2 className="text-2xl font-display font-bold text-white tracking-tight">
              {lang === 'th' ? 'แบบจำลองมูลค่าสายโซ่และการจัดสรรคลัง (Chamber 07)' : 'Chamber 07: FIOS Treasury & Gas Pool Calculator'}
            </h2>
            <p className="text-sm text-slate-300 mt-1 max-w-3xl">
              {lang === 'th'
                ? 'แบบจำลองคณิตศาสตร์ความสัมพันธ์มูลค่าสายโซ่ (Nc x Vc = ฿1.424B) และการกระจายเงินชดเชยค่าแก๊ส ฿12.5M สู่ 4 กลุ่มประชากรตามน้ำหนักทางเศรษฐกิจ'
                : 'FIOS chain valuation model (Nc x Vc = ฿1,424.08M) and ฿12.5M gas reimbursement pool distribution simulator across demographic cohorts.'}
            </p>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <span className="text-xs text-slate-400 font-medium block mb-1">
            {lang === 'th' ? 'มูลค่าประเมินสายโซ่รวม (Total Valuation)' : 'Total Chain Valuation'}
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-display font-bold text-amber-400 font-mono-code">
              ฿1,424,080,000
            </span>
            <span className="text-xs text-slate-400">THB</span>
          </div>
          <span className="text-[11px] text-slate-500 block mt-1 font-mono-code">
            Formula: Σ (Nc × Vc) across 4 cohorts
          </span>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <span className="text-xs text-slate-400 font-medium block mb-1">
            {lang === 'th' ? 'กองทุนเงินชดเชยค่าแก๊ส (Gas Reimbursement Pool)' : 'Gas Reimbursement Pool'}
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-display font-bold text-cyan-400 font-mono-code">
              ฿{totalPool.toLocaleString()}
            </span>
            <span className="text-xs text-slate-400">THB</span>
          </div>
          <span className="text-[11px] text-emerald-400 block mt-1 font-mono-code">
            100% Fully Backed & Audited
          </span>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <span className="text-xs text-slate-400 font-medium block mb-1">
            {lang === 'th' ? 'ฐานผู้ใช้งานรวม (Total User Base)' : 'Total User Base'}
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-display font-bold text-purple-300 font-mono-code">
              36,225,000
            </span>
            <span className="text-xs text-slate-400">Citizens</span>
          </div>
          <span className="text-[11px] text-slate-500 block mt-1 font-mono-code">
            4 Segments Active
          </span>
        </div>
      </div>

      {/* Interactive Gas Pool Slider */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <h3 className="font-display font-bold text-white text-base flex items-center gap-2">
            <Calculator className="w-4 h-4 text-cyan-400" />
            {lang === 'th' ? 'เครื่องมือจำลองการปรับขนาดกองทุนค่าแก๊ส (Interactive Pool Simulator)' : 'Interactive Pool Scaling Simulator'}
          </h3>
          <button
            onClick={() => setTotalPool(12500000)}
            className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white px-2 py-1 bg-slate-800 rounded transition-colors self-start sm:self-auto"
          >
            <RotateCcw className="w-3 h-3" />
            {lang === 'th' ? 'รีเซ็ตค่ามาตรฐาน (฿12.5M)' : 'Reset Default (฿12.5M)'}
          </button>
        </div>

        <div className="space-y-2 bg-slate-950 p-4 rounded-lg border border-slate-800">
          <div className="flex justify-between text-xs font-mono-code">
            <span className="text-slate-400">Gas Reimbursement Pool Size:</span>
            <span className="text-cyan-300 font-bold text-sm">฿{totalPool.toLocaleString()} THB</span>
          </div>
          <input
            type="range"
            min={1000000}
            max={50000000}
            step={500000}
            value={totalPool}
            onChange={(e) => setTotalPool(Number(e.target.value))}
            className="w-full accent-cyan-500 cursor-pointer"
          />
          <div className="flex justify-between text-[11px] text-slate-500 font-mono-code">
            <span>฿1.0M</span>
            <span>฿12.5M (Baseline)</span>
            <span>฿50.0M (Maximum)</span>
          </div>
        </div>
      </div>

      {/* Demographic Breakdown Table & Pie Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Table Breakdown (2 cols) */}
        <div className="lg:col-span-2 bg-slate-900/90 border border-slate-800 rounded-xl p-5 space-y-4">
          <h3 className="font-display font-bold text-white text-base flex items-center gap-2">
            <Users className="w-4 h-4 text-amber-400" />
            {lang === 'th' ? 'ตารางจำแนก 4 กลุ่มประชากรและการคำนวณส่วนแบ่ง' : '4 Demographic Cohorts & Economic Weight'}
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950 text-slate-400 font-mono-code border-b border-slate-800">
                <tr>
                  <th className="p-3">Segment Name</th>
                  <th className="p-3">Count (Nc)</th>
                  <th className="p-3">Value/User (Vc)</th>
                  <th className="p-3">Segment Value (THB)</th>
                  <th className="p-3">Weight</th>
                  <th className="p-3 text-right">Pool Allocation (THB)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {calculatedSegments.map((seg, idx) => (
                  <tr key={seg.name} className="hover:bg-slate-850 transition-colors">
                    <td className="p-3 font-semibold text-white flex items-center gap-2">
                      <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: COLORS[idx] }} />
                      {lang === 'th' ? seg.nameTh : seg.name}
                    </td>
                    <td className="p-3 font-mono-code">{seg.customersCount.toLocaleString()}</td>
                    <td className="p-3 font-mono-code">฿{seg.valuePerCustomer.toFixed(2)}</td>
                    <td className="p-3 font-mono-code text-cyan-300">฿{seg.totalSegmentValueThb.toLocaleString()}</td>
                    <td className="p-3 font-mono-code text-amber-300">{seg.weightPct.toFixed(4)}%</td>
                    <td className="p-3 font-mono-code text-emerald-400 font-bold text-right">
                      ฿{seg.dynamicAllocation.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Visualizer Chart (1 col) */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 space-y-4 flex flex-col justify-between">
          <h3 className="font-display font-bold text-white text-sm flex items-center gap-2">
            <PieChartIcon className="w-4 h-4 text-cyan-400" />
            {lang === 'th' ? 'สัดส่วนมูลค่าเศรษฐกิจ' : 'Valuation Weight Distribution'}
          </h3>

          <div className="h-48 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={45}
                  outerRadius={70}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {pieData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(val: any) => [`฿${Number(val).toLocaleString()} THB`, 'Segment Value']}
                  contentStyle={{ backgroundColor: '#020617', borderColor: '#334155', borderRadius: '8px', fontSize: '12px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-1 text-[11px] font-mono-code text-slate-400 pt-2 border-t border-slate-800">
            {calculatedSegments.map((seg, idx) => (
              <div key={seg.name} className="flex justify-between items-center">
                <span className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full" style={{ backgroundColor: COLORS[idx] }} />
                  {seg.name}:
                </span>
                <span className="text-slate-200">{seg.weightPct.toFixed(2)}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
