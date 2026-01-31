'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { ROIReport } from '@/lib/agents/analyst';
import { ShieldCheck } from 'lucide-react';

export default function CostComparisonChart({ report }: { report: ROIReport }) {
  return (
    <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-xl p-8 h-[450px] relative">
      <div className="flex justify-between items-start mb-8">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <span className="w-2 h-6 bg-cyan-500 rounded-full"></span>
                Cost Comparison (Traditional vs AI)
            </h3>
            <p className="text-xs text-slate-400 mt-1 ml-4">
                Based on market rates for task categories.
            </p>
          </div>
          <div className="flex items-center gap-1.5 bg-cyan-950/30 border border-cyan-900/50 rounded-full px-3 py-1">
             <ShieldCheck className="w-3 h-3 text-cyan-400" />
             <span className="text-[10px] text-cyan-200 font-medium uppercase tracking-wider">Verified by Scout Agent</span>
          </div>
      </div>

      <ResponsiveContainer width="100%" height="80%">
        <BarChart
          data={report.costComparison}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
          <XAxis
            dataKey="category"
            stroke="#94a3b8"
            fontSize={12}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            stroke="#94a3b8"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => `$${value}`}
          />
          <Tooltip
            cursor={{ fill: '#1e293b', opacity: 0.4 }}
            contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', color: '#f8fafc' }}
            formatter={(value: any) => [`$${Number(value).toLocaleString()}`, 'Cost']}
          />
          <Bar dataKey="traditionalCost" name="Traditional Cost" fill="#334155" radius={[4, 4, 0, 0]} barSize={40} />
          <Bar dataKey="aiCost" name="AI Optimized" fill="#06b6d4" radius={[4, 4, 0, 0]} barSize={40}>
             {report.costComparison.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={index % 2 === 0 ? '#06b6d4' : '#22d3ee'} />
             ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
