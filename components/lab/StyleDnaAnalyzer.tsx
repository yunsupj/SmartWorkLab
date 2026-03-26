'use client';
import { useState } from 'react';

export default function StyleDnaAnalyzer() {
  const [status, setStatus] = useState<'idle' | 'scanning' | 'complete'>('idle');
  const [scanProgress, setScanProgress] = useState(0);

  const handleUpload = () => {
    setStatus('scanning');
    setScanProgress(0);
    const interval = setInterval(() => {
      setScanProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => setStatus('complete'), 400);
          return 100;
        }
        return prev + 3;
      });
    }, 30);
  };

  return (
    <div className="w-full bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 shadow-2xl my-12 font-sans relative overflow-hidden">
      <div className="flex flex-col items-center justify-center min-h-[300px] z-10 relative">

        {status === 'idle' && (
          <div className="text-center animate-in fade-in duration-300">
            <h3 className="text-2xl font-bold text-white mb-4">Find Your Style DNA 🧬</h3>
            <p className="text-slate-400 text-sm mb-6 max-w-xs mx-auto">Upload a photo and let our AI analyze your vibe to find your perfect fit!</p>
            <button onClick={handleUpload} className="px-8 py-3 bg-green-500 text-slate-950 font-bold rounded-full hover:bg-green-400 transition-colors shadow-[0_0_15px_rgba(34,197,94,0.4)]">
              Upload & Scan
            </button>
          </div>
        )}

        {status === 'scanning' && (
          <div className="w-full max-w-sm text-center animate-in fade-in duration-300">
            <p className="text-green-400 font-mono text-sm mb-2">Extracting Body Matrix... {scanProgress}%</p>
            <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
              <div className="h-full bg-green-500 transition-all duration-75" style={{ width: `${scanProgress}%` }} />
            </div>
          </div>
        )}

        {status === 'complete' && (
          <div className="text-center animate-in slide-in-from-bottom-8 duration-500 w-full max-w-sm">
            <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-2">Analysis Complete</p>
            <h4 className="text-3xl font-black text-white mb-6">Your DNA is<br/><span className="text-green-400">High-Street</span></h4>

            <div className="bg-slate-800 rounded-xl p-5 mb-6 border border-slate-700">
              <p className="text-xs text-slate-300 mb-3">Curated for your DNA. Explore the new collection.</p>
              <a href="https://yuunique.com" target="_blank" rel="noreferrer" className="block w-full py-3 bg-green-500 text-slate-950 font-bold rounded-lg hover:bg-green-400 transition-colors">
                Shop yuunique ↗
              </a>
            </div>

            <button onClick={() => setStatus('idle')} className="text-xs text-slate-500 hover:text-white underline">Scan Again</button>
          </div>
        )}
      </div>
    </div>
  );
}
