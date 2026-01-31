'use client';

import { useState } from 'react';
import ROISummaryCards from './ROISummaryCards';
import CostComparisonChart from './CostComparisonChart';
import EfficiencyDonutChart from './EfficiencyDonutChart';
import AddToolModal from './AddToolModal';
import { User } from '@supabase/supabase-js';
import { ROIReport } from '@/lib/agents/analyst';
import { PlusCircle } from 'lucide-react';

import { Trash2, Pencil } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { deleteToolEntry } from '@/lib/actions/delete-tool';
import { UsageData } from '@/lib/agents/analyst';
import { motion, AnimatePresence } from 'framer-motion';

export default function Dashboard({ user, report, usageData }: { user: User; report: ROIReport; usageData: UsageData[] }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTool, setEditingTool] = useState<UsageData | undefined>(undefined);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const router = useRouter();
  const userName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Builder';
  const hasData = report.totalHoursSaved > 0;

  const handleEdit = (tool: UsageData) => {
      setEditingTool(tool);
      setIsModalOpen(true);
  };

  const handleCloseModal = () => {
      setIsModalOpen(false);
      setEditingTool(undefined);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to remove this tool?')) return;

    setIsDeleting(id);
    const res = await deleteToolEntry(id);
    if (res.success) {
        router.refresh();
    } else {
        alert('Failed to delete tool');
    }
    setIsDeleting(null);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6 md:p-12 pb-24">
      <AddToolModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        initialData={editingTool}
      />

      <header className="mb-12 flex justify-between items-end">
        <div>
            <h1 className="text-3xl md:text-5xl font-bold mb-3 tracking-tight flex items-center gap-3">
            Welcome back, <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">{userName}</span>
            <span className="relative flex h-3 w-3 mt-1" title="Live Session Active">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
            </span>
            </h1>
            <p className="text-slate-400 text-lg">Here is your verified AI Efficiency Report.</p>
        </div>

        {hasData && (
             <button
                onClick={() => { setEditingTool(undefined); setIsModalOpen(true); }}
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
                 onClick={() => { setEditingTool(undefined); setIsModalOpen(true); }}
                className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold py-3 px-8 rounded-full shadow-lg shadow-cyan-500/20 transition-all transform hover:scale-105"
            >
                Add Your First Tool
            </button>
        </div>
      ) : (
        <>
            <ROISummaryCards report={report} />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                <CostComparisonChart report={report} />
                <EfficiencyDonutChart report={report} />
            </div>

            {/* Managed Tools List */}
            <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold text-white">Active Subscriptions</h3>
                    <span className="text-sm text-slate-500">{usageData.length} Tools</span>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="text-slate-400 text-sm border-b border-slate-800">
                                <th className="pb-3 font-medium pl-2">Tool</th>
                                <th className="pb-3 font-medium">Category</th>
                                <th className="pb-3 font-medium">Monthly Cost</th>
                                <th className="pb-3 font-medium">Hours Saved</th>
                                <th className="pb-3 font-medium text-right pr-2">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800/50">
                            <AnimatePresence mode='popLayout'>
                                {usageData.map((tool) => (
                                    <motion.tr
                                        key={tool.id}
                                        layout
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, x: -20, backgroundColor: 'rgba(239, 68, 68, 0.1)' }}
                                        className="group hover:bg-slate-800/30 transition-colors"
                                    >
                                        <td className="py-4 pl-2 font-medium text-white">{tool.tool_name}</td>
                                        <td className="py-4 text-slate-400 text-sm">{tool.task_category}</td>
                                        <td className="py-4 text-slate-300">${tool.monthly_cost}</td>
                                        <td className="py-4 text-slate-300">{tool.hours_saved}h</td>
                                        <td className="py-4 text-right pr-2">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={() => handleEdit(tool)}
                                                    className="text-slate-500 hover:text-cyan-400 transition-colors p-2 rounded-lg hover:bg-cyan-500/10"
                                                    title="Edit Tool"
                                                >
                                                    <Pencil className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(tool.id)}
                                                    disabled={isDeleting === tool.id}
                                                    className="text-slate-500 hover:text-red-400 transition-colors p-2 rounded-lg hover:bg-red-500/10 disabled:opacity-50"
                                                    title="Remove Tool"
                                                >
                                                    {isDeleting === tool.id ? (
                                                        <div className="w-4 h-4 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
                                                    ) : (
                                                        <Trash2 className="w-4 h-4" />
                                                    )}
                                                </button>
                                            </div>
                                        </td>
                                    </motion.tr>
                                ))}
                            </AnimatePresence>
                        </tbody>
                    </table>
                </div>
            </div>
        </>
      )}
    </div>
  );
}
