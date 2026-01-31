'use client';

import { useState } from 'react';
import ROISummaryCards from './ROISummaryCards';
import CostComparisonChart from './CostComparisonChart';
import EfficiencyDonutChart from './EfficiencyDonutChart';
import AddToolModal from './AddToolModal';
import { User } from '@supabase/supabase-js';
import { ROIReport } from '@/lib/agents/analyst';
import { PlusCircle } from 'lucide-react';

export default function Dashboard({ user, report }: { user: User; report: ROIReport }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const userName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Builder';
  const hasData = report.totalHoursSaved > 0;

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6 md:p-12 pb-24">
      <AddToolModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />

      <header className="mb-12 flex justify-between items-end">
        <div>
            <h1 className="text-3xl md:text-5xl font-bold mb-3 tracking-tight">
            Welcome back, <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">{userName}</span>
            </h1>
            <p className="text-slate-400 text-lg">Here is your trust-verified AI Efficiency Report.</p>
        </div>

        {hasData && (
             <button
                onClick={() => setIsModalOpen(true)}
                className="hidden md:flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-white px-4 py-2 rounded-lg border border-slate-700 transition-colors"
             >
                <PlusCircle className="w-4 h-4" />
                <span>Add Tool</span>
            </button>
        )}
      </header>

      {!hasData ? (
        <div className="flex flex-col items-center justify-center py-20 border border-dashed border-slate-800 rounded-3xl bg-slate-900/30">
            <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mb-6">
                <PlusCircle className="w-8 h-8 text-cyan-400" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">Start Tracking Your ROI</h3>
            <p className="text-slate-400 max-w-md text-center mb-8">
                Connect your first AI tool to generate a verified efficiency report and see how much you are saving.
            </p>
            <button
                onClick={() => setIsModalOpen(true)}
                className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold py-3 px-8 rounded-full shadow-lg shadow-cyan-500/20 transition-all transform hover:scale-105"
            >
                Add Your First Tool
            </button>
        </div>
      ) : (
        <>
            <ROISummaryCards report={report} />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <CostComparisonChart report={report} />
                <EfficiencyDonutChart report={report} />
            </div>
        </>
      )}
    </div>
  );
}
