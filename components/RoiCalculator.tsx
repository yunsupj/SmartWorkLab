'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Calculator, ArrowRight, TrendingUp } from 'lucide-react';

export default function RoiCalculator({ showCta = true }: { showCta?: boolean }) {
  const [hourlyRate, setHourlyRate] = useState(50);
  const [hoursSaved, setHoursSaved] = useState(2);
  const [toolCost, setToolCost] = useState(200);
  const [annualProfit, setAnnualProfit] = useState(0);

  useEffect(() => {
    // Formula: (Hours Saved * Hourly Rate * 250 working days) - Annual Cost
    const grossSavings = hoursSaved * hourlyRate * 250;
    const netProfit = grossSavings - toolCost;
    setAnnualProfit(netProfit);
  }, [hourlyRate, hoursSaved, toolCost]);

  const maxPotential = 200000; // Visual cap for progress bar
  const progressPercentage = Math.min((annualProfit / maxPotential) * 100, 100);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-8 relative overflow-hidden group">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none group-hover:bg-cyan-500/20 transition-all duration-700"></div>

      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-8">
            <div className="bg-cyan-950/50 p-3 rounded-lg border border-cyan-500/30">
                <Calculator className="w-6 h-6 text-cyan-400" />
            </div>
            <div>
                <h3 className="text-2xl font-bold text-white">AI ROI Calculator</h3>
                <p className="text-sm text-slate-400">Calculate your potential annual profit from AI tools.</p>
            </div>
        </div>

        <div className="grid md:grid-cols-2 gap-12">
            {/* Inputs */}
            <div className="space-y-6">
                <div>
                     <div className="flex justify-between text-sm mb-2 text-slate-300">
                        <span>Hourly Rate</span>
                        <span className="text-cyan-400 font-mono font-bold">${hourlyRate}/hr</span>
                     </div>
                     <input
                        type="range" min="10" max="300" step="5"
                        value={hourlyRate}
                        onChange={(e) => setHourlyRate(parseInt(e.target.value))}
                        className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-500 hover:accent-cyan-400 transition-all"
                     />
                </div>
                <div>
                     <div className="flex justify-between text-sm mb-2 text-slate-300">
                        <span>Hours Saved Daily</span>
                        <span className="text-cyan-400 font-mono font-bold">{hoursSaved} hrs/day</span>
                     </div>
                     <input
                        type="range" min="0.5" max="8" step="0.5"
                        value={hoursSaved}
                        onChange={(e) => setHoursSaved(parseFloat(e.target.value))}
                        className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-500 hover:accent-cyan-400 transition-all"
                     />
                </div>
                <div>
                     <div className="flex justify-between text-sm mb-2 text-slate-300">
                        <span>Annual Tool Cost</span>
                        <span className="text-cyan-400 font-mono font-bold">${toolCost}/yr</span>
                     </div>
                     <input
                        type="range" min="0" max="2000" step="50"
                        value={toolCost}
                        onChange={(e) => setToolCost(parseInt(e.target.value))}
                        className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-500 hover:accent-cyan-400 transition-all"
                     />
                </div>
            </div>

            {/* Output */}
            <div className="bg-slate-950/50 rounded-xl p-6 border border-slate-800 flex flex-col justify-center items-center text-center relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-transparent"></div>

                <p className="text-slate-400 text-sm uppercase tracking-widest mb-2 relative z-10">Estimated Annual Net Profit</p>
                <div className="text-5xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-cyan-400 mb-6 relative z-10 tabular-nums">
                    ${annualProfit.toLocaleString()}
                </div>

                {/* Progress Visual */}
                <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden mb-6 relative z-10">
                    <div
                        className="h-full bg-gradient-to-r from-green-500 to-cyan-500 rounded-full transition-all duration-1000 ease-out shadow-[0_0_10px_rgba(34,211,238,0.5)]"
                        style={{ width: `${progressPercentage}%` }}
                    ></div>
                </div>

                {showCta && (
                    <Link
                        href="/reviews"
                        className="inline-flex items-center gap-2 text-sm font-bold text-white bg-slate-800 hover:bg-slate-700 px-6 py-3 rounded-full border border-slate-700 hover:border-cyan-500/50 transition-all relative z-10 group/btn"
                    >
                        <span>See which tools save you this much</span>
                        <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                    </Link>
                )}
            </div>
        </div>
      </div>
    </div>
  );
}
