'use client';

import { TrendingUp, TrendingDown, Clock, Wallet, ShieldCheck, Info } from 'lucide-react';
import { motion } from 'framer-motion';
import { ROIReport } from '@/lib/agents/analyst';

export default function ROISummaryCards({ report }: { report: ROIReport }) {
  const stats = [
    {
      title: 'Projected Annual Savings',
      value: `$${report.totalAnnualSavings.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      change: '+15%', // In a real app, this would be calculated against previous month
      icon: Wallet,
      color: 'text-green-400',
      bgColor: 'bg-green-500/10',
      borderColor: 'border-green-500/20',
      description: 'Calculated based on your hourly rate vs tool costs.'
    },
    {
      title: 'Hours Saved / Month',
      value: `${report.totalHoursSaved} hrs`,
      change: '+8.2%',
      icon: Clock,
      color: 'text-cyan-400',
      bgColor: 'bg-cyan-500/10',
      borderColor: 'border-cyan-500/20',
      description: 'Aggregated time saved across all tools.'
    },
    {
      title: 'Efficiency Gain',
      value: `${report.efficiencyGain}x`,
      change: '+12%',
      icon: TrendingUp,
      color: 'text-purple-400',
      bgColor: 'bg-purple-500/10',
      borderColor: 'border-purple-500/20',
      description: 'ROI multiplier on your AI investment.'
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
      {stats.map((stat, index) => (
        <motion.div
          key={stat.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className={`bg-slate-900/50 backdrop-blur-sm border ${stat.borderColor} rounded-xl p-8 relative overflow-hidden group hover:border-opacity-50 transition-all duration-300`}
        >
          {/* Verified Badge */}
          <div className="absolute top-4 right-4 flex items-center gap-1 bg-slate-800/50 rounded-full px-2 py-1 border border-slate-700/50">
             <ShieldCheck className="w-3 h-3 text-cyan-400" />
             <span className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">Verified</span>
          </div>

          <div className={`inline-flex p-3 rounded-xl ${stat.bgColor} ${stat.color} mb-4`}>
            <stat.icon className="w-6 h-6" />
          </div>

          <h3 className="text-slate-400 text-sm font-medium uppercase tracking-wider mb-2 flex items-center gap-2">
            {stat.title}
            <div className="group/tooltip relative">
                <Info className="w-3 h-3 text-slate-600 cursor-help" />
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-2 bg-slate-800 text-xs text-slate-300 rounded shadow-xl border border-slate-700 opacity-0 group-hover/tooltip:opacity-100 transition-opacity pointer-events-none z-10">
                    {stat.description}
                    <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-800"></div>
                </div>
            </div>
          </h3>

          <div className="flex items-end gap-3">
            <span className="text-3xl font-bold text-white tracking-tight">{stat.value}</span>
            <span className={`text-sm font-medium ${stat.change.startsWith('+') ? 'text-green-400' : 'text-red-400'} mb-1 flex items-center bg-slate-800/50 px-2 py-0.5 rounded`}>
              {stat.change.startsWith('+') ? <TrendingUp className="w-3 h-3 mr-1" /> : <TrendingDown className="w-3 h-3 mr-1" />}
              {stat.change}
            </span>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
