'use client';

import { useState, useEffect, useRef } from 'react';
import { Database, Zap, Clock, RotateCcw, XCircle } from 'lucide-react';

export default function GhostSpeedDemo() {
  const [mode, setMode] = useState<'waterfall' | 'parallel'>('parallel');
  const [isRunning, setIsRunning] = useState(false);
  const [progress, setProgress] = useState<number[]>(Array(13).fill(0));
  const [completed, setCompleted] = useState<boolean[]>(Array(13).fill(false));
  const [totalTime, setTotalTime] = useState(0);
  const [hasFinished, setHasFinished] = useState(false);
  const [savedTime, setSavedTime] = useState<number | null>(null);

  const activeIntervals = useRef<NodeJS.Timeout[]>([]);

  const WATERFALL_ESTIMATE = 3800; // Estimated 3.8s for waterfall sequence

  const clearTimers = () => {
    activeIntervals.current.forEach(clearInterval);
    activeIntervals.current = [];
  };

  const resetSimulation = () => {
    clearTimers();
    setIsRunning(false);
    setHasFinished(false);
    setProgress(Array(13).fill(0));
    setCompleted(Array(13).fill(false));
    setTotalTime(0);
    setSavedTime(null);
  };

  const stopSimulation = () => {
    clearTimers();
    setIsRunning(false);
  };

  const startSimulation = () => {
    resetSimulation();
    setIsRunning(true);

    if (mode === 'parallel') {
      const ints = Array(13).fill(null).map((_, i) => {
        const speed = Math.random() * 15 + 15; // Fast execution
        let prog = 0;
        return setInterval(() => {
          prog += 10;
          if (prog >= 100) {
            prog = 100;
            setCompleted(prev => { const n = [...prev]; n[i] = true; return n; });
            setProgress(prev => { const n = [...prev]; n[i] = prog; return n; });
            clearInterval(ints[i]);
          } else {
            setProgress(prev => { const n = [...prev]; n[i] = prog; return n; });
          }
        }, speed);
      });
      activeIntervals.current = ints;
    } else {
      let currentIndex = 0;
      let prog = 0;

      const interval = setInterval(() => {
        if (currentIndex >= 13) {
          clearInterval(interval);
          return;
        }
        prog += 20;
        if (prog >= 100) {
          prog = 100;
          setCompleted(prev => { const n = [...prev]; n[currentIndex] = true; return n; });
          setProgress(prev => { const n = [...prev]; n[currentIndex] = prog; return n; });
          currentIndex++;
          prog = 0;
        } else {
          setProgress(prev => { const n = [...prev]; n[currentIndex] = prog; return n; });
        }
      }, 55); // ~275ms per query * 13 = ~3.5s sequence
      activeIntervals.current = [interval];
    }
  };

  useEffect(() => {
    if (isRunning) {
      const timer = setInterval(() => setTotalTime(prev => prev + 10), 10);
      if (completed.every(c => c)) {
        clearInterval(timer);
        setIsRunning(false);
        setHasFinished(true);
        if (mode === 'parallel') {
          setSavedTime(Math.max(0, WATERFALL_ESTIMATE - totalTime));
        }
      }
      return () => clearInterval(timer);
    }
  }, [isRunning, completed, mode, totalTime]);

  return (
    <div className="w-full bg-[#0a0f1c] p-8 pb-12 border border-slate-800 rounded-2xl shadow-2xl font-sans text-white my-10 flex flex-col justify-center">

      {/* ── Top Header Control ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 border-b border-slate-800/80 pb-6">

        {/* Architecture Toggle */}
        <div className="flex bg-slate-900 border border-slate-800 p-1 rounded-xl w-fit shadow-inner">
          <button
            onClick={() => { setMode('waterfall'); resetSimulation(); }}
            className={`px-5 py-2 text-xs font-bold rounded-lg transition-all ${mode === 'waterfall' ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' : 'text-slate-500 hover:text-slate-300 border border-transparent'}`}
          >
            Legacy Waterfall
          </button>
          <button
            onClick={() => { setMode('parallel'); resetSimulation(); }}
            className={`px-5 py-2 text-xs font-bold rounded-lg transition-all ${mode === 'parallel' ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30' : 'text-slate-500 hover:text-slate-300 border border-transparent'}`}
          >
            Ghost Speed Pipeline
          </button>
        </div>

        {/* Action Controls & Timings */}
        <div className="flex items-center gap-6">

          <div className="flex items-center gap-3">
            {!isRunning ? (
              <button
                onClick={startSimulation}
                className="px-6 py-2.5 text-sm font-bold flex items-center gap-2 rounded-full transition-all bg-white text-slate-900 hover:bg-slate-200"
              >
                <Zap className="w-4 h-4" />
                Execute Fetches
              </button>
            ) : (
              <button
                onClick={stopSimulation}
                className="px-6 py-2.5 text-sm font-bold flex items-center gap-2 rounded-full transition-all bg-rose-500/20 text-rose-400 hover:bg-rose-500/30 border border-rose-500/50 shadow-[0_0_15px_rgba(244,63,94,0.2)]"
              >
                <XCircle className="w-4 h-4" />
                Stop Simulation
              </button>
            )}
            <button
              onClick={resetSimulation}
              disabled={isRunning || (!hasFinished && totalTime === 0)}
              className="p-2.5 text-slate-400 bg-slate-900 border border-slate-800 rounded-full hover:bg-slate-800 hover:text-slate-200 disabled:opacity-50 transition-colors"
              title="Reset Simulator"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>

          <div className="flex flex-col items-end border-l border-slate-800 pl-6">
            <div className="text-[10px] text-slate-500 font-mono uppercase tracking-widest flex items-center justify-end gap-1.5 mb-1">
              <Clock className="w-3 h-3"/> Total Latency
            </div>
            <div className={`text-3xl font-black font-mono tracking-tighter w-28 text-right ${mode === 'parallel' ? 'text-cyan-400' : 'text-rose-400'}`}>
              {(totalTime).toFixed(0)} <span className="text-sm text-slate-500 font-bold">ms</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── B2B Savings ROI Callout ── */}
      <div className={`transition-all duration-700 overflow-hidden ${hasFinished && mode === 'parallel' && savedTime ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'}`}>
        <div className="bg-emerald-950/30 border border-emerald-500/30 rounded-xl p-6 flex items-center justify-center gap-3 shadow-[0_0_30px_rgba(16,185,129,0.1)]">
          <Zap className="w-6 h-6 text-emerald-400" />
          <p className="text-emerald-50 text-base font-medium">
            By avoiding the waterfall cascade, Ghost Speed <strong className="text-emerald-400 text-xl font-bold mx-1">Saves {savedTime}ms</strong> per user session.
          </p>
        </div>
      </div>
      <div className="pb-10" />

      {/* ── Fetch Progress Grid ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-14 gap-y-3 px-10">
        {progress.map((prog, idx) => (
          <div key={idx} className="flex items-center gap-4 group">
            <div className="w-12 text-right text-[10px] font-mono text-slate-600 group-hover:text-slate-400 transition-colors">
              QUERY_{String(idx + 1).padStart(2, '0')}
            </div>
            <div className="flex-1 h-3 relative bg-slate-900/50 rounded-full overflow-hidden border border-slate-800/80">
              <div
                className={`absolute top-0 left-0 h-full transition-all duration-100 ${completed[idx] ? (mode === 'parallel' ? 'bg-cyan-500 shadow-[0_0_10px_rgba(6,182,212,0.5)]' : 'bg-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.5)]') : 'bg-slate-700'}`}
                style={{ width: `${Math.max(1, typeof window !== 'undefined' ? prog : 0)}%` }}
              />
            </div>
            <div className="w-6 flex justify-end">
              {completed[idx] ? (
                <Database className={`w-3.5 h-3.5 ${mode === 'parallel' ? 'text-cyan-400' : 'text-rose-400'}`} />
              ) : (
                <div className="w-3.5 h-3.5 rounded-full border-2 border-slate-800"/>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
