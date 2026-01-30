'use client';

import { useState, useEffect, useMemo } from 'react';
import { useTranslations } from 'next-intl';
import { Check, Info, TrendingDown, ArrowRight, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Slider } from '@/components/ui/Slider';
import { Combobox, Option } from '@/components/ui/Combobox';
import TrackedLink from '@/components/TrackedLink';
import { supabase } from '@/lib/supabase';

interface Alternative {
  name: string;
  monthlyCost: number;
  slug: string; // fallback
  reasonKey: string;
}

// Mock targets (we will try to resolve IDs)
const TARGET_ALTERNATIVES: Alternative[] = [
  { name: 'Claude 3 Haiku', monthlyCost: 5, slug: 'claude-3-haiku', reasonKey: 'Claude' },
  { name: 'Gemini 1.5 Flash', monthlyCost: 2, slug: 'gemini-1-5-flash', reasonKey: 'Gemini' },
  { name: 'DeepSeek Coder', monthlyCost: 0, slug: 'deepseek-coder', reasonKey: 'DeepSeek' },
];

export default function SavingsCalculator() {
  const t = useTranslations('SavingsCalculator');

  // State
  const [currentSpend, setCurrentSpend] = useState<number>(20);
  const [selectedToolId, setSelectedToolId] = useState<string>('');
  const [productOptions, setProductOptions] = useState<Option[]>([]);
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [targetProducts, setTargetProducts] = useState<Record<string, string>>({}); // name -> id map

  // Fetch Products for Combobox & Resolve Target IDs
  useEffect(() => {
    const fetchProducts = async () => {
      if (!supabase) return;

      const { data, error } = await supabase
        .from('products')
        .select('id, name');

      if (data && !error) {
        // Populate Combobox Options
        const options = data.map(p => ({
          value: p.id,
          label: p.name
        }));
        setProductOptions(options);

        // Resolve Target IDs
        const map: Record<string, string> = {};
        TARGET_ALTERNATIVES.forEach(target => {
            const found = data.find(p => p.name.includes(target.name) || p.name.includes(target.name.split(' ')[0]));
            if (found) {
                map[target.name] = found.id;
            }
        });
        setTargetProducts(map);
      }
    };

    fetchProducts();
  }, []);

  // Calculation Logic
  const bestAlternative = useMemo(() => {
    // Logic: Find the one that saves the most money
    // Savings = Current - Target
    return TARGET_ALTERNATIVES.reduce((prev, curr) => {
        const prevSavings = Math.max(0, currentSpend - prev.monthlyCost);
        const currSavings = Math.max(0, currentSpend - curr.monthlyCost);
        return currSavings > prevSavings ? curr : prev;
    });
  }, [currentSpend]);

  const monthlySavings = Math.max(0, currentSpend - bestAlternative.monthlyCost);
  const annualSavings = monthlySavings * 12;

  // Resolve Target Link (ID preferred, slug fallback)
  const targetId = targetProducts[bestAlternative.name];
  const targetLink = targetId ? `/reviews/${targetId}` : `/reviews/${bestAlternative.slug}`;

  // Email Submit Handler
  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setIsSubmitting(true);

    const reportData = {
        current_spend: currentSpend,
        current_tool_id: selectedToolId,
        recommended_tool: bestAlternative.name,
        annual_savings: annualSavings,
        currency: 'USD',
        generated_at: new Date().toISOString()
    };

    if (!supabase) return;

    const { error } = await supabase.from('leads').insert([{
        email,
        source: 'profit_calculator_v2',
        report_data: reportData
    }]);

    if (!error) {
        setIsSubmitted(true);
        setEmail('');
    }
    setIsSubmitting(false);
  };

  return (
    <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-2xl p-6 md:p-8 shadow-2xl relative overflow-hidden">
      {/* Background Gradients */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-[100px] -mr-20 -mt-20 pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-purple-500/10 rounded-full blur-[80px] -ml-10 -mb-10 pointer-events-none"></div>

      <div className="grid lg:grid-cols-2 gap-12 relative z-10">

        {/* LEFT COLUMN: Inputs */}
        <div className="space-y-8">
            <div>
                <h3 className="text-2xl font-bold text-white mb-2">{t('title')}</h3>
                <p className="text-slate-400 text-sm">Calculate how much you're overpaying for AI.</p>
            </div>

            {/* Input 1: Current Tool */}
            <div className="space-y-2">
                <label className="text-xs uppercase tracking-wider text-slate-500 font-bold flex items-center gap-2">
                    1. {t('currentTool')}
                </label>
                <Combobox
                    options={productOptions}
                    value={selectedToolId}
                    onChange={setSelectedToolId}
                    placeholder="Search your tool (e.g. ChatGPT)..."
                    className="w-full"
                />
            </div>

            {/* Input 2: Monthly Spend */}
            <div className="space-y-4">
                <div className="flex justify-between items-center">
                    <label className="text-xs uppercase tracking-wider text-slate-500 font-bold">
                        2. {t('monthlySpend')}
                    </label>
                    <div className="flex items-center bg-slate-950 border border-slate-700 rounded px-3 py-1 w-24">
                        <span className="text-slate-500 mr-1">$</span>
                        <input
                            type="number"
                            value={currentSpend}
                            onChange={(e) => setCurrentSpend(Number(e.target.value))}
                            className="bg-transparent text-white font-mono font-bold w-full focus:outline-none"
                        />
                    </div>
                </div>

                <Slider
                    min={0}
                    max={200}
                    step={1}
                    value={currentSpend}
                    onChange={setCurrentSpend}
                    className="w-full"
                />

                <div className="flex justify-between text-xs text-slate-600 font-mono">
                    <span>$0</span>
                    <span>$100</span>
                    <span>$200+</span>
                </div>
            </div>

            {/* Lead Gen / Email */}
            <div className="pt-4 border-t border-slate-800/50">
                 <label className="block text-xs uppercase tracking-wider text-slate-500 mb-2">Get Full Analysis</label>
                 <form onSubmit={handleEmailSubmit} className="relative">
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder={isSubmitted ? "Report Sent!" : t('enterEmail')}
                        disabled={isSubmitted || isSubmitting}
                        className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 text-sm text-white focus:border-cyan-500 outline-none transition-colors disabled:opacity-50 disabled:cursor-not-allowed pl-10"
                    />
                    <div className="absolute left-3 top-3 text-slate-500">
                        <Check className={`w-4 h-4 ${isSubmitted ? 'text-green-500' : 'text-slate-600'}`} />
                    </div>
                    {!isSubmitted && (
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="absolute right-2 top-2 bottom-2 bg-slate-800 hover:bg-slate-700 text-white px-3 rounded text-xs font-bold transition-all"
                        >
                            {isSubmitting ? '...' : 'GET'}
                        </button>
                    )}
                 </form>
            </div>
        </div>

        {/* RIGHT COLUMN: Results & Visualization */}
        <div className="bg-slate-950/50 rounded-xl p-8 border border-slate-800 flex flex-col justify-between">

            {/* Split View Visualization */}
            <div className="space-y-6 mb-8">
                <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-400">Current Cost</span>
                    <span className="font-mono text-white">${currentSpend} <span className="text-slate-600">/mo</span></span>
                </div>

                {/* Arrow */}
                <div className="flex justify-center -my-2 opacity-50">
                    <ArrowRight className="text-slate-600 rotate-90" />
                </div>

                <div className="flex justify-between items-center text-sm">
                    <span className="text-green-400 font-bold flex items-center gap-2">
                        Optimized Cost <span className="bg-green-500/10 text-green-500 text-[10px] px-1.5 py-0.5 rounded uppercase tracking-wider border border-green-500/20">Active</span>
                    </span>
                    <span className="font-mono text-green-400 font-bold">${bestAlternative.monthlyCost} <span className="text-green-900/60">/mo</span></span>
                </div>
            </div>

            <div className="text-center">
                <p className="text-slate-400 text-sm mb-2 uppercase tracking-widest">{t('perYear')} {t('save')}</p>
                <motion.div
                    key={annualSavings}
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-cyan-500 tracking-tighter mb-2"
                >
                    ${annualSavings.toLocaleString()}
                </motion.div>

                {/* Dynamic Social Proof */}
                <div className="flex items-center justify-center gap-2 text-[10px] md:text-xs text-slate-500 bg-slate-900/50 py-1.5 px-3 rounded-full inline-block mx-auto mb-6 border border-slate-800">
                    <ShieldCheck className="w-3 h-3 text-green-500/70" />
                    <span>{t('socialProof')}</span>
                </div>

                <div className="space-y-3">
                    <p className="text-xs text-slate-400">
                        {t('reasoning', { reason: t('reasons.' + bestAlternative.reasonKey) })}
                    </p>

                    <TrackedLink
                        href={targetLink}  // Dynamic Link based on Products Table ID
                        eventName={'savings_calc_result_' + bestAlternative.name}
                        className="block w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-green-900/20 transition-all hover:scale-[1.02] active:scale-[0.98] text-sm uppercase tracking-wide"
                    >
                        {t('cta')}
                    </TrackedLink>

                    <div className="text-[10px] text-slate-600 flex items-center justify-center gap-1">
                        <Info className="w-3 h-3" />
                         Based on official API pricing from our real-time market data.
                    </div>
                </div>
            </div>
        </div>

      </div>
    </div>
  );
}
