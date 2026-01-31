'use client';

import { useState } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import { Scout } from '@/lib/agents/scout';
import { addToolUsage } from '@/actions/add-tool-usage';
import { X, Sparkles, Plus, AlertCircle, CheckCircle, Mail } from 'lucide-react';

interface AddToolModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AddToolModal({ isOpen, onClose }: AddToolModalProps) {
  const [activeTab, setActiveTab] = useState<'auto' | 'manual'>('auto');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<any[] | null>(null);

  // Manual Form State
  const [toolName, setToolName] = useState('');
  const [monthlyCost, setMonthlyCost] = useState('');
  const [hoursSaved, setHoursSaved] = useState('');
  const [category, setCategory] = useState('General');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  // Track A: Analyze Email
  const handleAnalyze = async () => {
    setIsAnalyzing(true);
    try {
      // Call Mock Agent
      const results = await Scout.analyzeEmailSubscriptions();
      setAnalysisResult(results);
    } catch (err) {
      console.error(err);
    }
    setIsAnalyzing(false);
  };

  // Track A: Confirm Analysis
  const handleConfirmAnalysis = async (tool: any) => {
    setIsSubmitting(true);
    const formData = new FormData();
    formData.append('toolName', tool.toolName);
    formData.append('monthlyCost', tool.monthlyCost.toString());
    formData.append('hoursSaved', tool.hoursSaved.toString());
    formData.append('taskCategory', tool.taskCategory);

    const res = await addToolUsage({}, formData);
    if (res.success) {
        onClose();
    } else {
        alert(res.error || 'Failed to add tool');
    }
    setIsSubmitting(false);
  };

  // Track B: Manual Submit
  const handleManualSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData();
    formData.append('toolName', toolName);
    formData.append('monthlyCost', monthlyCost);
    formData.append('hoursSaved', hoursSaved);
    formData.append('taskCategory', category);

    const res = await addToolUsage({}, formData);
    if (res.success) {
        onClose();
        // Reset form
        setToolName('');
        setMonthlyCost('');
        setHoursSaved('');
    } else {
        alert(res.error || 'Failed to add tool');
    }

    setIsSubmitting(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg shadow-2xl relative overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
            onClick={onClose}
            className="absolute top-4 right-4 text-slate-500 hover:text-white transition-colors"
        >
            <X className="w-5 h-5" />
        </button>

        <div className="p-6">
            <h2 className="text-2xl font-bold text-white mb-2">Add New Tool</h2>
            <p className="text-slate-400 text-sm mb-6">Track your AI investments and calculate ROI.</p>

            {/* Tabs */}
            <div className="grid grid-cols-2 gap-2 bg-slate-950 p-1 rounded-lg mb-6 border border-slate-800">
                <button
                    onClick={() => setActiveTab('auto')}
                    className={`flex items-center justify-center gap-2 py-2 px-4 rounded-md text-sm font-medium transition-all ${
                        activeTab === 'auto'
                        ? 'bg-gradient-to-r from-cyan-600 to-cyan-500 text-white shadow-lg'
                        : 'text-slate-400 hover:text-white hover:bg-slate-800'
                    }`}
                >
                    <Sparkles className="w-4 h-4" />
                    Auto-Detect (AI)
                </button>
                <button
                    onClick={() => setActiveTab('manual')}
                    className={`flex items-center justify-center gap-2 py-2 px-4 rounded-md text-sm font-medium transition-all ${
                        activeTab === 'manual'
                        ? 'bg-slate-700 text-white shadow'
                        : 'text-slate-400 hover:text-white hover:bg-slate-800'
                    }`}
                >
                    <Plus className="w-4 h-4" />
                    Manual Entry
                </button>
            </div>

            {/* Content */}
            {activeTab === 'auto' ? (
                <div className="space-y-6">
                    {!analysisResult ? (
                        <div className="text-center py-8">
                            <div className="mb-4 flex justify-center">
                                <div className="w-16 h-16 bg-cyan-900/20 rounded-full flex items-center justify-center border border-cyan-500/20">
                                    <Mail className="w-8 h-8 text-cyan-400" />
                                </div>
                            </div>
                            <h3 className="text-lg font-bold text-white mb-2">Connect Email to Analyze</h3>
                            <p className="text-slate-400 text-sm max-w-xs mx-auto mb-6">
                                Scout Agent will securely scan your email receipts to find AI tool subscriptions automatically.
                            </p>
                            <button
                                onClick={handleAnalyze}
                                disabled={isAnalyzing}
                                className="w-full bg-white text-slate-900 font-bold py-3 rounded-xl hover:bg-slate-100 transition-colors flex items-center justify-center gap-2 disabled:opacity-70"
                            >
                                {isAnalyzing ? 'Scout Agent is Searching...' : 'Connect Gmail & Scan'}
                            </button>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider">Found {analysisResult.length} Subscriptions</h3>
                            {analysisResult.map((tool, idx) => (
                                <div key={idx} className="flex items-center justify-between p-4 bg-slate-950 border border-slate-800 rounded-xl">
                                    <div>
                                        <p className="font-bold text-white">{tool.toolName}</p>
                                        <p className="text-xs text-slate-500">${tool.monthlyCost}/mo • Est. {tool.hoursSaved}h saved</p>
                                    </div>
                                    <button
                                        onClick={() => handleConfirmAnalysis(tool)}
                                        disabled={isSubmitting}
                                        className="bg-cyan-500 hover:bg-cyan-400 text-white p-2 rounded-lg transition-colors disabled:opacity-50"
                                    >
                                        <Plus className="w-4 h-4" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            ) : (
                <form onSubmit={handleManualSubmit} className="space-y-4">
                    <div>
                        <label className="block text-slate-400 text-xs uppercase font-bold mb-1.5">Tool Name</label>
                        <input
                            type="text"
                            value={toolName}
                            onChange={(e) => setToolName(e.target.value)}
                            placeholder="e.g. ChatGPT Plus"
                            className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-white focus:ring-2 focus:ring-cyan-500 focus:outline-none"
                            required
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-slate-400 text-xs uppercase font-bold mb-1.5">Monthly Cost ($)</label>
                            <input
                                type="number"
                                value={monthlyCost}
                                onChange={(e) => setMonthlyCost(e.target.value)}
                                placeholder="20"
                                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-white focus:ring-2 focus:ring-cyan-500 focus:outline-none"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-slate-400 text-xs uppercase font-bold mb-1.5">Hours Saved / Mo</label>
                            <input
                                type="number"
                                value={hoursSaved}
                                onChange={(e) => setHoursSaved(e.target.value)}
                                placeholder="10"
                                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-white focus:ring-2 focus:ring-cyan-500 focus:outline-none"
                                required
                            />
                        </div>
                    </div>
                    <div>
                         <label className="block text-slate-400 text-xs uppercase font-bold mb-1.5">Category</label>
                         <select
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-white focus:ring-2 focus:ring-cyan-500 focus:outline-none"
                        >
                            <option value="General">General</option>
                            <option value="Coding">Coding</option>
                            <option value="Copywriting">Copywriting</option>
                            <option value="Design">Design</option>
                            <option value="Research">Research</option>
                        </select>
                    </div>

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-cyan-900/20 mt-4 disabled:opacity-70 flex justify-center items-center gap-2"
                    >
                        {isSubmitting ? 'Adding...' : 'Add Tool to ROI Dashboard'}
                    </button>
                </form>
            )}
        </div>
      </div>
    </div>
  );
}
