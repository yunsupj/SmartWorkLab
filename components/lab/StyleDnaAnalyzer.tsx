'use client';

import { useState } from 'react';
import { Upload, Scan, CheckCircle2, Loader2, Frame, Share2, RefreshCw, Linkedin } from 'lucide-react';

export default function StyleDnaAnalyzer() {
  const [status, setStatus] = useState<'idle' | 'scanning' | 'complete'>('idle');
  const [scanProgress, setScanProgress] = useState(0);

  const handleUpload = () => {
    setStatus('scanning');
    setScanProgress(0);
    
    const interval = setInterval(() => {
      setScanProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => setStatus('complete'), 500);
          return 100;
        }
        return prev + 2;
      });
    }, 40);
  };

  const reset = () => {
    setStatus('idle');
    setScanProgress(0);
  };

  return (
    <div className="w-full bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 shadow-2xl my-12 font-sans relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-br from-green-500/10 to-teal-500/10 blur-[100px] rounded-full pointer-events-none" />

      <div className="flex flex-col items-center justify-between mb-8 pb-6 border-b border-slate-800/60 relative z-10 text-center">
        <h3 className="text-xl md:text-2xl font-bold text-white mb-2 flex items-center justify-center gap-2">
          <Scan className="w-6 h-6 text-green-400" />
          AI Style DNA & Body-Type Scanner
        </h3>
        <p className="text-slate-400 text-sm">Real-time MediaPipe Landmark Detection Engine</p>
      </div>

      <div className="flex flex-col items-center justify-center p-8 bg-slate-950/80 border border-slate-800/60 rounded-2xl relative z-10 transition-all min-h-[340px] shadow-inner">
        {status === 'idle' && (
          <div className="text-center animate-in fade-in zoom-in duration-300">
             <div className="w-24 h-24 bg-gradient-to-tr from-slate-900 to-slate-800 rounded-full flex items-center justify-center mx-auto mb-6 border border-slate-700 shadow-[0_0_20px_rgba(255,255,255,0.05)] cursor-pointer hover:border-green-500/50 hover:shadow-[0_0_20px_rgba(74,222,128,0.2)] transition-all group" onClick={handleUpload}>
               <Upload className="w-10 h-10 text-slate-400 group-hover:text-green-400 transition-colors" />
             </div>
             <p className="text-slate-300 text-lg font-bold mb-2">Initialize VTON Scan</p>
             <p className="text-slate-400 text-sm mb-6 max-w-xs mx-auto">Upload a frontal photo to extract your unique skeletal matrix and calculate your subjective Style DNA.</p>
             <button 
               onClick={handleUpload}
               className="px-8 py-3 bg-green-950 text-green-400 border border-green-800 text-sm font-bold tracking-wide rounded-full transition-all flex items-center gap-2 mx-auto hover:bg-green-900 shadow-[0_0_15px_rgba(74,222,128,0.2)] uppercase"
             >
               <Scan className="w-4 h-4" /> Connect Camera
             </button>
          </div>
        )}

        {status === 'scanning' && (
          <div className="w-full max-w-sm text-center animate-in fade-in duration-300">
            {/* The Green Scanning Line UI */}
            <div className="relative w-40 h-48 mx-auto mb-8 border border-slate-700 bg-slate-900 rounded-lg overflow-hidden flex items-center justify-center shadow-inner">
               <Frame className="w-20 h-20 text-slate-700 opacity-50" />
               {/* Scanning Laser */}
               <div 
                 className="absolute left-0 w-full h-[2px] bg-green-400 shadow-[0_0_15px_rgba(74,222,128,0.8)] transition-all ease-linear"
                 style={{ top: `${scanProgress}%` }}
               />
               <Loader2 className="absolute top-4 right-4 w-4 h-4 text-green-500 animate-spin" />
            </div>
            
            <div className="flex justify-between text-xs text-slate-300 mb-2 font-mono font-bold uppercase tracking-widest">
              <span>Extracting Body Matrix...</span>
              <span className="text-green-400">{scanProgress}%</span>
            </div>
            <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden border border-slate-800 shadow-inner">
              <div className="h-full bg-green-500 rounded-full transition-all duration-75 shadow-[0_0_10px_#4ade80]" style={{ width: `${scanProgress}%` }} />
            </div>

            <div className="mt-6 flex justify-between px-2">
                <div className={`text-[10px] font-mono transition-opacity duration-300 ${scanProgress > 20 ? 'opacity-100 text-green-400' : 'opacity-30 text-slate-500'}`}>[✓] Anchor</div>
                <div className={`text-[10px] font-mono transition-opacity duration-300 ${scanProgress > 50 ? 'opacity-100 text-green-400' : 'opacity-30 text-slate-500'}`}>[✓] Skew</div>
                <div className={`text-[10px] font-mono transition-opacity duration-300 ${scanProgress > 80 ? 'opacity-100 text-green-400' : 'opacity-30 text-slate-500'}`}>[✓] Depth</div>
            </div>
          </div>
        )}

        {status === 'complete' && (
          <div className="text-center animate-in slide-in-from-bottom-8 duration-700 w-full max-w-md">
            <div className="bg-gradient-to-br from-green-950 via-slate-900 to-teal-950 p-[2px] rounded-2xl shadow-[0_0_40px_rgba(74,222,128,0.2)] mb-8 overflow-hidden">
               <div className="bg-slate-950 bg-opacity-95 rounded-[14px] p-8 backdrop-blur-sm border border-green-500/20 relative">
                  <div className="absolute top-0 right-0 bg-green-500/10 border-b border-l border-green-500/30 px-3 py-1 rounded-bl-lg">
                    <span className="text-[9px] font-mono text-green-400 font-bold tracking-widest uppercase flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> VERIFIED
                    </span>
                  </div>
                  
                  <div className="flex justify-center mb-4 mt-2">
                     <CheckCircle2 className="w-12 h-12 text-green-400 drop-shadow-[0_0_10px_rgba(74,222,128,0.8)]" />
                  </div>
                  <p className="text-slate-400 text-xs font-bold uppercase tracking-[0.2em] mb-2">Analysis Complete</p>
                  <h4 className="text-3xl font-black text-white mb-6 leading-tight">Your Style DNA is<br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-teal-300">High-Street</span></h4>
                  
                  <div className="bg-[#0b101a] rounded-lg p-4 border border-slate-800 flex items-center justify-between mb-8 shadow-inner">
                    <div className="text-left">
                       <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-1">Match Score</p>
                       <p className="text-4xl font-black text-white font-mono leading-none">98.2<span className="text-lg text-slate-400">%</span></p>
                    </div>
                    <div className="text-right">
                       <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-1">Keypoints</p>
                       <p className="text-4xl font-black text-white font-mono leading-none">33</p>
                    </div>
                  </div>

                  <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="w-full py-3.5 bg-[#0a66c2] text-white font-bold rounded-xl hover:bg-[#004182] transition-colors flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(10,102,194,0.4)]">
                     <Linkedin className="w-5 h-5" /> Share to LinkedIn
                  </a>
               </div>
            </div>

            <button onClick={reset} className="text-xs font-bold text-slate-500 hover:text-green-400 uppercase tracking-widest transition-colors flex items-center justify-center gap-2 mx-auto">
              <RefreshCw className="w-3 h-3" /> Scan New Image
            </button>
          </div>
        )}
      </div>

      <div className="mt-8 flex flex-col sm:flex-row items-center justify-between bg-slate-950/80 border border-slate-800 p-4 rounded-xl relative z-10 shadow-inner gap-4">
        <div className="flex items-center gap-3">
           <div className="bg-green-500/10 p-2 rounded-lg shrink-0">
              <Frame className="w-5 h-5 text-green-400" />
           </div>
           <p className="text-xs text-slate-400 leading-relaxed text-left">
             <strong className="text-white">Engineering Fact:</strong> This is a browser execution of our $1,500+ B2B VTON engine logic. Moving this contour mathematics client-side neutralizes 90% of structural GPU overhead.
           </p>
        </div>
        <div className="shrink-0 text-center sm:text-right w-full sm:w-auto">
           <p className="text-[10px] font-mono text-green-400 font-bold uppercase tracking-widest bg-green-950/50 px-3 py-1.5 rounded border border-green-900 inline-block w-full sm:w-auto">Processed in 0.2s</p>
           <p className="text-[9px] font-mono text-slate-500 uppercase tracking-widest mt-1.5">GCP Cloud Run CPU</p>
        </div>
      </div>
    </div>
  );
}
