'use client';

import { useState } from 'react';
import { Link } from '@/i18n/routing';
import { useTranslations } from 'next-intl';

interface Alternative {
  name: string;
  monthlyCost: number;
  savings: number;
  promoLink: string;
  reasonKey: string;
}

export default function SavingsCalculator() {
  const t = useTranslations('SavingsCalculator');
  const [currentSpend, setCurrentSpend] = useState<number>(20);
  const [toolName, setToolName] = useState(t('currentTool'));
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setIsSubmitting(true);

    const { supabase } = await import('@/lib/supabase');

    if (supabase) {
        // Generate Report Data
        const annualSavings = bestAlternative.savings * 12;
        const reportData = {
            current_tool: toolName,
            monthly_spend: currentSpend,
            recommended_tool: bestAlternative.name,
            annual_savings: annualSavings,
            currency: 'USD',
            optimization_tips: [
                `Switching to ${bestAlternative.name} saves $${annualSavings}/year.`,
                `Use the API directly to avoid per-seat licensing costs.`,
                `Consolidate team accounts to leverage bulk discounts.`
            ],
            generated_at: new Date().toISOString()
        };

        const { error } = await supabase.from('leads').insert([{
            email,
            source: 'savings_calculator',
            report_data: reportData
        }]);

        if (!error) {
            setIsSubmitted(true);
            setEmail('');
        }
    }
    setIsSubmitting(false);
  };

  // Mock Data - In real app, fetch from Supabase based on category
  const alternatives: Alternative[] = [
    { name: 'Claude 3 Haiku (API)', monthlyCost: 5, savings: Math.max(0, currentSpend - 5), promoLink: '/reviews/cursor-ai', reasonKey: 'Claude' },
    { name: 'Gemini 1.5 Flash (API)', monthlyCost: 2, savings: Math.max(0, currentSpend - 2), promoLink: '/reviews/cursor-ai', reasonKey: 'Gemini' },
    { name: 'DeepSeek Coder (API)', monthlyCost: 0, savings: Math.max(0, currentSpend - 0), promoLink: '/reviews/cursor-ai', reasonKey: 'DeepSeek' },
  ];

  const bestAlternative = alternatives.sort((a, b) => b.savings - a.savings)[0];

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-8 mb-12 shadow-2xl relative overflow-hidden group">
      <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>

      <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
        {t('title')}
      </h3>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="space-y-4">
          <div>
            <label className="block text-xs uppercase tracking-wider text-slate-500 mb-1">{t('currentTool')}</label>
            <input
              type="text"
              value={toolName}
              onChange={(e) => setToolName(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded p-3 text-white focus:border-cyan-500 outline-none transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider text-slate-500 mb-1">{t('monthlySpend')}</label>
            <input
              type="number"
              value={currentSpend.toString()}
              onChange={(e) => {
                const val = parseInt(e.target.value, 10);
                setCurrentSpend(isNaN(val) ? 0 : val);
              }}
              min="0"
              className="w-full bg-slate-950 border border-slate-700 rounded p-3 text-white focus:border-cyan-500 outline-none transition-colors"
            />
          </div>

          <div>
             <label className="block text-xs uppercase tracking-wider text-slate-500 mb-1">Email (For Full Report)</label>
             <form onSubmit={handleEmailSubmit} className="relative">
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={isSubmitted ? "Thanks! Report sent." : t('enterEmail')}
                    disabled={isSubmitted || isSubmitting}
                    className="w-full bg-slate-950 border border-slate-700 rounded p-3 text-white focus:border-cyan-500 outline-none transition-colors placeholder:text-slate-600 disabled:opacity-50"
                />
                {!isSubmitted && (
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="absolute right-2 top-2 bottom-2 bg-cyan-600/20 hover:bg-cyan-600/40 text-cyan-400 px-3 rounded text-xs font-bold transition-all"
                    >
                        {isSubmitting ? '...' : 'GET'}
                    </button>
                )}
             </form>
          </div>
        </div>

        <div className="bg-slate-950/50 rounded-lg p-6 flex flex-col justify-center items-center text-center border border-slate-800/50">
          <p className="text-slate-400 text-sm mb-2">{t('switchTo')} <span className="text-cyan-400 font-bold">{bestAlternative.name}</span>{t('save')}</p>
          <div className="text-5xl font-bold text-green-400 mb-1 animate-pulse">
            ${(bestAlternative.savings * 12).toLocaleString()}
          </div>
          <p className="text-xs text-slate-500 uppercase tracking-widest mb-4">{t('perYear')}</p>

          {/* Recommendation Reasoning Trigger */}
          <div className="text-xs text-slate-300 italic mb-6 bg-slate-900/50 p-3 rounded border border-slate-800">
             "{t('reasons.' + bestAlternative.reasonKey)}"
          </div>

          <Link
            href={bestAlternative.promoLink}
            onClick={async () => {
                const { trackClick } = await import('@/lib/analytics');
                trackClick('savings_calc_cta_' + bestAlternative.name);
            }}
            className="bg-green-600 hover:bg-green-500 text-white font-bold py-2 px-6 rounded-full text-sm transition-all hover:scale-105 shadow-lg shadow-green-900/20"
          >
            {t('cta')}
          </Link>
        </div>
      </div>
    </div>
  );
}
