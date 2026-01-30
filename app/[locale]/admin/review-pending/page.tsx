'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';

// Mock data for initial implementation
const MOCK_REVIEW = {
  id: '1',
  toolName: 'SuperAI Writer',
  cons: ['Expensive for hobbyists', 'Limited export options', 'Occasional easier hallucinations'],
  criticalFlaws: ['Data privacy concerns in free tier'],
  drafts: {
    en: {
      title: 'SuperAI Writer Review: Powerful but Pricey',
      body: 'SuperAI Writer offers great features...',
      summary: 'A strong contender in the AI writing space.'
    },
    ko: {
      title: 'SuperAI Writer 리뷰: 강력하지만 비싼 가격',
      body: 'SuperAI Writer는 훌륭한 기능을 제공합니다...',
      summary: 'AI 작문 분야의 강력한 경쟁자입니다.'
    }
  }
};

export const runtime = 'edge';

export default function AdminReviewPage() {
  const [activeTab, setActiveTab] = useState<'en' | 'ko'>('en');
  const [isDeploying, setIsDeploying] = useState(false);

  const handleDeploy = async () => {
    setIsDeploying(true);
    // Simulate API call to trigger Vercel build
    await new Promise(resolve => setTimeout(resolve, 2000));
    alert('Deployment triggered!');
    setIsDeploying(false);
  };

  return (
    <div className="max-w-md mx-auto p-4 pb-24 font-mono text-sm">
      <header className="mb-6 flex justify-between items-center">
        <h1 className="text-xl font-bold text-cyan-400">Review Pending</h1>
        <div className="bg-yellow-500/20 text-yellow-500 px-2 py-1 rounded text-xs border border-yellow-500/50">
          Pending
        </div>
      </header>

      {/* Cons & Flaws Section */}
      <section className="bg-slate-800/50 rounded-lg p-4 mb-6 border border-slate-700">
        <h2 className="text-slate-400 mb-2 uppercase text-xs tracking-wider">Identified Issues</h2>
        <div className="space-y-3">
          <div>
            <span className="text-red-400 block mb-1">Critical Flaws:</span>
            <ul className="list-disc pl-4 text-red-200">
              {MOCK_REVIEW.criticalFlaws.map((flaw, i) => (
                <li key={i}>{flaw}</li>
              ))}
            </ul>
          </div>
          <div>
            <span className="text-amber-400 block mb-1">Cons:</span>
            <ul className="list-disc pl-4 text-slate-300">
              {MOCK_REVIEW.cons.map((con, i) => (
                <li key={i}>{con}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Translations Tabs */}
      <section className="mb-20">
        <div className="flex border-b border-slate-700 mb-4">
          <button
            onClick={() => setActiveTab('en')}
            className={`flex-1 pb-2 text-center transition-colors ${
              activeTab === 'en'
                ? 'text-cyan-400 border-b-2 border-cyan-400'
                : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            🇺🇸 English
          </button>
          <button
            onClick={() => setActiveTab('ko')}
            className={`flex-1 pb-2 text-center transition-colors ${
              activeTab === 'ko'
                ? 'text-cyan-400 border-b-2 border-cyan-400'
                : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            🇰🇷 Korean
          </button>
        </div>

        <div className="bg-slate-900 rounded border border-slate-800 p-4 min-h-[300px]">
          <h3 className="font-bold text-lg mb-2 text-white">
            {MOCK_REVIEW.drafts[activeTab].title}
          </h3>
          <p className="text-slate-400 leading-relaxed">
            {MOCK_REVIEW.drafts[activeTab].body}
          </p>
          <div className="mt-4 p-3 bg-slate-800 rounded border-l-2 border-cyan-500">
            <p className="text-slate-300 italic">
              "{MOCK_REVIEW.drafts[activeTab].summary}"
            </p>
          </div>
        </div>
      </section>

      {/* Fixed Bottom Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-slate-950/80 backdrop-blur-lg border-t border-slate-800">
        <div className="max-w-md mx-auto">
          <button
            onClick={handleDeploy}
            disabled={isDeploying}
            className="w-full bg-green-600 hover:bg-green-500 text-white font-bold py-3 rounded-lg shadow-lg flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isDeploying ? (
              <>
                <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full" />
                Deploying...
              </>
            ) : (
              <>
                <span>🚀</span> Approve & Deploy
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
