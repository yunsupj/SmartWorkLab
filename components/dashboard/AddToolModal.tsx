'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createBrowserClient } from '@supabase/ssr';
import { analyzeToolAction } from '@/lib/actions/analyze-tool';
import { updateToolAction } from '@/lib/actions/update-tool';
import { addToolUsage } from '@/actions/add-tool-usage';
import { X, Sparkles, Plus, AlertCircle, CheckCircle, Mail, Save } from 'lucide-react';

import { useEffect } from 'react'; // Ensure import

interface AddToolModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: any; // UsageData
}

export default function AddToolModal({ isOpen, onClose, initialData }: AddToolModalProps) {
  // ... state ...

  // Reset state when modal closes
  useEffect(() => {
    if (!isOpen) {
        setAnalysisResult(null);
        setRawInput('');
        setIsAnalyzing(false);
        setActiveTab('auto');
        setVerifyingId(null);
        setVerifyingToolIdx(null);
        // Clear form
        if (!initialData) {
            setToolName('');
            setMonthlyCost('');
            setHoursSaved('');
            setCategory('General');
        }
    } else if (initialData) {
        // Pre-fill for Edit
        setActiveTab('manual');
        setToolName(initialData.tool_name);
        setMonthlyCost(initialData.monthly_cost.toString());
        setHoursSaved(initialData.hours_saved.toString());
        setCategory(initialData.task_category);
    }
  }, [isOpen, initialData]);

  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'auto' | 'manual'>('auto');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<any[] | null>(null);
  const [rawInput, setRawInput] = useState('');
  const [verifyingId, setVerifyingId] = useState<number | null>(null);
  const [verifyingToolIdx, setVerifyingToolIdx] = useState<number | null>(null);

  // Manual Form State
  const [toolName, setToolName] = useState('');
  const [monthlyCost, setMonthlyCost] = useState('');
  const [hoursSaved, setHoursSaved] = useState('');
  const [category, setCategory] = useState('General');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  // Track A: Analyze Text
  const handleAnalyze = async () => {
    setIsAnalyzing(true);
    try {
      // Call Server Action
      const result = await analyzeToolAction(rawInput);

      if (result.success && result.data) {
        setAnalysisResult(result.data);
      } else {
        console.error("Analysis Failed:", result.error);
        // Set specific error state or rely on empty result handling
        setAnalysisResult([
            { toolName: 'AI Detection Failed', monthlyCost: 0, hoursSaved: 0, taskCategory: 'Research' }
        ]);
      }
    } catch (err) {
      console.error(err);
      setAnalysisResult([
          { toolName: 'AI Detection Failed', monthlyCost: 0, hoursSaved: 0, taskCategory: 'Research' }
      ]);
    }
    setIsAnalyzing(false);
  };

  // Track A: Confirm Analysis
  const handleConfirmAnalysis = async (tool: any, idx: number) => {
    setIsSubmitting(true);
    setVerifyingToolIdx(idx); // Show "Verified" immediately
    setVerifyingId(null);     // Hide buttons logic

    const formData = new FormData();
    formData.append('toolName', tool.toolName);
    formData.append('monthlyCost', tool.monthlyCost.toString());
    formData.append('hoursSaved', tool.hoursSaved.toString());
    formData.append('taskCategory', tool.taskCategory);

    const res = await addToolUsage({}, formData);
    if (res.success) {
        // Small delay to let user see the green verification check
        setTimeout(() => {
            onClose();
            router.refresh();
        }, 1000);
    } else {
        alert(res.error || 'Failed to add tool');
        setVerifyingToolIdx(null); // Revert on failure
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

    let res;
    if (initialData) {
        res = await updateToolAction(initialData.id, formData);
    } else {
        res = await addToolUsage({}, formData);
    }

    if (res.success) {
        onClose();
        router.refresh(); // Refresh Server Components
        // Reset form
        if (!initialData) {
            setToolName('');
            setMonthlyCost('');
            setHoursSaved('');
        }
    } else {
        alert(res.error || 'Failed to save tool');
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
            <h2 className="text-2xl font-bold text-white mb-2">{initialData ? 'Edit Tool' : 'Add New Tool'}</h2>
            <p className="text-slate-400 text-sm mb-6">Track your AI investments and calculate ROI.</p>

            {/* Tabs - Hide in Edit Mode */}
            {!initialData && (
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
            )}

            {/* Content */}
            {activeTab === 'auto' ? (
                <div className="space-y-6">
                    {!analysisResult ? (
                        <div className="text-center">
                            <div className="mb-4 flex justify-center">
                                <div className="w-16 h-16 bg-gradient-to-br from-cyan-900/40 to-blue-900/40 rounded-2xl flex items-center justify-center border border-white/10 shadow-inner">
                                    <Sparkles className="w-8 h-8 text-cyan-400" />
                                </div>
                            </div>
                            <h3 className="text-lg font-bold text-white mb-2">AI Subscription Scanner</h3>
                            <p className="text-slate-400 text-sm max-w-sm mx-auto mb-6">
                                Paste your software subscription list, email snippets, or just describe what you use. Scout Agent will extract the data.
                            </p>

                            <textarea
                                value={rawInput}
                                onChange={(e) => setRawInput(e.target.value)}
                                placeholder="e.g. I pay $20/mo for ChatGPT, $10 for Copilot, and $30 for Midjourney."
                                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 text-sm text-white focus:ring-2 focus:ring-cyan-500 focus:outline-none min-h-[100px] mb-4"
                            />

                            <button
                                onClick={handleAnalyze}
                                disabled={isAnalyzing || rawInput.length < 5}
                                className="w-full bg-white text-slate-900 font-bold py-3 rounded-xl hover:bg-slate-200 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isAnalyzing ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-slate-900 border-t-transparent rounded-full animate-spin" />
                                        Scout Agent is analyzing...
                                    </>
                                ) : (
                                    'Scan with AI'
                                )}
                            </button>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <div className="flex items-center justify-between mb-2">
                                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider">
                                    Found {analysisResult.length} Subscriptions
                                </h3>
                                <button
                                    onClick={() => { setAnalysisResult(null); setRawInput(''); }}
                                    className="text-xs text-cyan-400 hover:text-cyan-300 underline"
                                >
                                    Scan Again
                                </button>
                            </div>

                            {analysisResult.map((tool, idx) => (
                                <div key={idx} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-slate-950 border border-slate-800 rounded-xl gap-4">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-1 flex-wrap">
                                            <p className="font-bold text-white text-base">{tool.toolName}</p>
                                            {tool.toolName === 'AI Detection Failed' ? (
                                                <span className="flex items-center gap-1 text-[10px] bg-red-500/10 text-red-500 px-2 py-0.5 rounded border border-red-500/20 whitespace-nowrap">
                                                    <AlertCircle className="w-3 h-3" /> Failed
                                                </span>
                                            ) : (
                                                 <span className={`flex items-center gap-1 text-[10px] px-2 py-0.5 rounded border whitespace-nowrap ${
                                                     verifyingToolIdx === idx
                                                     ? 'bg-green-500/10 text-green-500 border-green-500/20'
                                                     : 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20'
                                                 }`}>
                                                    {verifyingToolIdx === idx ? (
                                                        <><CheckCircle className="w-3 h-3" /> Verified</>
                                                    ) : (
                                                        <><AlertCircle className="w-3 h-3" /> Pending Verification</>
                                                    )}
                                                </span>
                                            )}
                                        </div>
                                        <p className="text-sm text-slate-400">
                                            <span className="text-white font-medium">${tool.monthlyCost}/mo</span>
                                            <span className="mx-2 text-slate-700">|</span>
                                            Est. <span className="text-white font-medium">{tool.hoursSaved}h</span> saved
                                        </p>
                                    </div>

                                    {tool.toolName === 'AI Detection Failed' ? (
                                         <button
                                            onClick={() => {
                                                setAnalysisResult(null);
                                                // Don't clear rawInput so they can edit it
                                            }}
                                            className="bg-slate-800 hover:bg-slate-700 text-white px-4 py-2 rounded-lg text-xs font-medium transition-colors whitespace-nowrap"
                                        >
                                            Edit & Try Again
                                        </button>
                                    ) : (
                                        <div className="flex items-center gap-2">
                                            {verifyingId === idx ? (
                                                <div className="flex items-center gap-2 animate-in fade-in slide-in-from-right-2 duration-200">
                                                    <span className="text-xs text-slate-400">Accurate?</span>
                                                    <button
                                                        onClick={() => handleConfirmAnalysis(tool, idx)}
                                                        disabled={isSubmitting}
                                                        className="bg-green-500 hover:bg-green-400 text-white p-2 rounded-lg transition-colors disabled:opacity-50"
                                                        title="Yes, add tool"
                                                    >
                                                        <CheckCircle className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => setVerifyingId(null)}
                                                        className="bg-slate-800 hover:bg-slate-700 text-slate-300 p-2 rounded-lg transition-colors"
                                                        title="Cancel"
                                                    >
                                                        <X className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            ) : (
                                                <button
                                                    onClick={() => setVerifyingId(idx)}
                                                    disabled={isSubmitting}
                                                    className="bg-cyan-500 hover:bg-cyan-400 text-white p-2 rounded-lg transition-colors disabled:opacity-50"
                                                    title="Add Tool"
                                                >
                                                    <Plus className="w-4 h-4" />
                                                </button>
                                            )}
                                        </div>
                                    )}
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
                        {isSubmitting ? (initialData ? 'Updating...' : 'Adding...') : (initialData ? 'Update Tool' : 'Add Tool to ROI Dashboard')}
                    </button>
                </form>
            )}
        </div>
      </div>
    </div>
  );
}
