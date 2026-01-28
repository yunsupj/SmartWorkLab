'use client';

import { useState } from 'react';
import { Link } from '@/i18n/routing';

interface Alternative {
  name: string;
  monthlyCost: number;
  savings: number;
  promoLink: string;
}

export default function SavingsCalculator() {
  const [currentSpend, setCurrentSpend] = useState<number>(20);
  const [toolName, setToolName] = useState('ChatGPT Plus');

  // Mock Data - In real app, fetch from Supabase based on category
  const alternatives: Alternative[] = [
    { name: 'Claude 3 Haiku (API)', monthlyCost: 5, savings: Math.max(0, currentSpend - 5), promoLink: '/reviews/claude-3' },
    { name: 'Gemini 1.5 Flash (API)', monthlyCost: 2, savings: Math.max(0, currentSpend - 2), promoLink: '/reviews/gemini-flash' },
    { name: 'DeepSeek Coder (API)', monthlyCost: 0, savings: Math.max(0, currentSpend - 0), promoLink: '/reviews/deepseek' },
  ];

  const bestAlternative = alternatives.sort((a, b) => b.savings - a.savings)[0];

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-8 mb-12 shadow-2xl relative overflow-hidden group">
      <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>

      <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
        💰 AI Savings Calculator
      </h3>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="space-y-4">
          <div>
            <label className="block text-xs uppercase tracking-wider text-slate-500 mb-1">Current Tool</label>
            <input
              type="text"
              value={toolName}
              onChange={(e) => setToolName(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded p-3 text-white focus:border-cyan-500 outline-none transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider text-slate-500 mb-1">Monthly Spend ($)</label>
            <input
              type="number"
              value={currentSpend}
              onChange={(e) => setCurrentSpend(Number(e.target.value))}
              className="w-full bg-slate-950 border border-slate-700 rounded p-3 text-white focus:border-cyan-500 outline-none transition-colors"
            />
          </div>
        </div>

        <div className="bg-slate-950/50 rounded-lg p-6 flex flex-col justify-center items-center text-center border border-slate-800/50">
          <p className="text-slate-400 text-sm mb-2">Switch to <span className="text-cyan-400 font-bold">{bestAlternative.name}</span> & Save:</p>
          <div className="text-5xl font-bold text-green-400 mb-1 animate-pulse">
            ${(bestAlternative.savings * 12).toLocaleString()}
          </div>
          <p className="text-xs text-slate-500 uppercase tracking-widest mb-4">Per Year</p>

          <Link
            href={bestAlternative.promoLink}
            className="bg-green-600 hover:bg-green-500 text-white font-bold py-2 px-6 rounded-full text-sm transition-all hover:scale-105 shadow-lg shadow-green-900/20"
          >
            Switch & Save Now →
          </Link>
        </div>
      </div>
    </div>
  );
}
