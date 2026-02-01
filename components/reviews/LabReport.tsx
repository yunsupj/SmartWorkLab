'use client';

import { ShieldCheck, TrendingUp, CheckCircle, AlertCircle } from 'lucide-react';

interface VerificationSummary {
  toolName: string;
  confidenceScore: number;
  verificationStatus: string;
  marketAnalysis: string;
  accuracyRating: number;
  lastAudited: string;
}

export default function LabReport({ summary }: { summary: VerificationSummary }) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 mb-8 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/5 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>

      <div className="flex items-center gap-3 mb-6 relative z-10">
        <div className="bg-cyan-950/50 p-2 rounded-lg border border-cyan-900/50">
           <ShieldCheck className="w-6 h-6 text-cyan-400" />
        </div>
        <div>
           <h3 className="text-lg font-bold text-white">SmartWorkLab Verification</h3>
           <p className="text-xs text-slate-400">Agent-Backed Analysis • Scout & Analyst Agents</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
        <div className="bg-slate-950/50 rounded-lg p-4 border border-slate-800/50 border-l-4 border-l-green-500">
           <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Confidence Score</p>
           <div className="flex items-end gap-2">
              <span className="text-3xl font-bold text-white">{summary.confidenceScore}%</span>
              <span className="text-green-400 text-xs font-bold mb-1">High</span>
           </div>
        </div>

        <div className="bg-slate-950/50 rounded-lg p-4 border border-slate-800/50 border-l-4 border-l-cyan-500">
           <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Accuracy Rating</p>
           <div className="flex items-end gap-2">
              <span className="text-3xl font-bold text-white">{summary.accuracyRating}%</span>
              <CheckCircle className="w-4 h-4 text-cyan-500 mb-1" />
           </div>
        </div>

        <div className="bg-slate-950/50 rounded-lg p-4 border border-slate-800/50 border-l-4 border-l-purple-500">
           <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Market Position</p>
           <p className="text-sm text-slate-300 leading-snug mt-1 line-clamp-2">
             {summary.marketAnalysis}
           </p>
        </div>
      </div>

      <div className="mt-4 flex justify-end">
         <p className="text-[10px] text-slate-600">Last Audited: {summary.lastAudited}</p>
      </div>
    </div>
  );
}
