'use client';

import { TrendingUp, DollarSign, Zap } from 'lucide-react';

interface RoiImpactCardProps {
  price: string;
  smartScore: {
    roi: number;
  };
}

export default function RoiImpactCard({ price, smartScore }: RoiImpactCardProps) {
  // Parsing price logic
  let monthlyCost = 0;
  const numericPrice = parseFloat(price.replace(/[^0-9.]/g, ''));

  if (!isNaN(numericPrice)) {
    monthlyCost = numericPrice;
  } else if (price.toLowerCase().includes('free')) {
    monthlyCost = 0;
  } else {
    // Fallback for estimated/enterprise
    monthlyCost = 20;
  }

  // ROI Logic Simulation
  // Assumption: An AI tool saves ~5-10 hours/month. Avg wage $50/hr.
  // Savings = (10 hours * $50) - Cost
  // This is a heuristic based on the Smart Score ROI.

  const hourlyRate = 50;
  const hoursSaved = (smartScore.roi || 5) * 1.5; // score 8 = 12 hours saved
  const monthlyValue = hoursSaved * hourlyRate;
  const monthlySavings = monthlyValue - monthlyCost;
  const annualSavings = monthlySavings * 12;

  const roiPercentage = monthlyCost > 0
    ? Math.round(((monthlyValue - monthlyCost) / monthlyCost) * 100)
    : '∞'; // Infinite ROI for free tools

  return (
    <div className="bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 rounded-xl p-6 relative overflow-hidden group hover:border-cyan-500/30 transition-colors">
      <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/5 rounded-full blur-2xl -mr-16 -mt-16 pointer-events-none"></div>

      <div className="flex items-center gap-3 mb-6">
        <div className="bg-green-500/10 p-2 rounded-lg border border-green-500/20">
          <TrendingUp className="w-5 h-5 text-green-400" />
        </div>
        <h3 className="text-lg font-bold text-white">Financial Impact</h3>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
           <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Proj. ROI</p>
           <div className="flex items-baseline gap-1">
             <span className="text-3xl font-bold text-green-400">{roiPercentage}%</span>
           </div>
        </div>

        <div>
           <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Annual Savings</p>
           <div className="flex items-baseline gap-1">
             <span className="text-3xl font-bold text-white">${annualSavings.toLocaleString()}</span>
           </div>
           <p className="text-[10px] text-slate-500 mt-1">Based on avg. efficiency gains</p>
        </div>
      </div>

      {smartScore.roi > 8 && (
        <div className="mt-4 bg-green-950/20 border border-green-900/30 rounded p-2 flex items-center gap-2">
           <Zap className="w-3 h-3 text-yellow-400" />
           <span className="text-xs text-green-300">High-Yield Investment Identified</span>
        </div>
      )}
    </div>
  );
}
