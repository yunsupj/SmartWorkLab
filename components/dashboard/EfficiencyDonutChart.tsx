'use client';

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { ROIReport } from '@/lib/agents/analyst';
import { ShieldCheck } from 'lucide-react';

export default function EfficiencyDonutChart({ report }: { report: ROIReport }) {
  // If no efficiency data, show empty state or handle gracefully
  const hasData = report.efficiencyBreakdown.length > 0;

  return (
    <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-xl p-8 h-[450px] relative">
      <div className="flex justify-between items-start mb-2">
         <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <span className="w-2 h-6 bg-purple-500 rounded-full"></span>
                Time Saved Distribution
            </h3>
             <p className="text-xs text-slate-400 mt-1 ml-4">
                Breakdown of hours saved by task category.
            </p>
         </div>
          <div className="flex items-center gap-1.5 bg-purple-950/30 border border-purple-900/50 rounded-full px-3 py-1">
             <ShieldCheck className="w-3 h-3 text-purple-400" />
             <span className="text-[10px] text-purple-200 font-medium uppercase tracking-wider">Verified by Analyst Agent</span>
          </div>
      </div>

      <div className="h-full w-full relative">
        <ResponsiveContainer width="100%" height="90%">
          <PieChart>
            <Pie
              data={report.efficiencyBreakdown}
              cx="50%"
              cy="50%"
              innerRadius={70}
              outerRadius={110}
              paddingAngle={5}
              dataKey="value"
            >
              {report.efficiencyBreakdown.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
              ))}
            </Pie>
            <Tooltip
               contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', color: '#f8fafc' }}
               itemStyle={{ color: '#f8fafc' }}
               formatter={(value) => [`${value}%`, 'Share']}
            />
            <Legend verticalAlign="bottom" height={36} iconType="circle" />
          </PieChart>
        </ResponsiveContainer>

        {/* Center Text Overlay */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-[60%] text-center pointer-events-none">
           <span className="block text-4xl font-bold text-white">{report.totalHoursSaved}h</span>
           <span className="text-xs text-slate-400 uppercase tracking-widest">Total Saved</span>
        </div>
      </div>
    </div>
  );
}
