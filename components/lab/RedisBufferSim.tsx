'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';

// ── SVG Icons ──
function ShieldIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  );
}

function DatabaseIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <ellipse cx="12" cy="5" rx="9" ry="3" /><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" />
      <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
    </svg>
  );
}

function ZapIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    </svg>
  );
}

function CheckCircleIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  );
}

function AlertTriangleIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
      <line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  );
}

// ── Gauge Component ──
function Gauge({ value, max, label, unit, color }: { value: number; max: number; label: string; unit: string; color: 'red' | 'emerald' | 'cyan' }) {
  const pct = Math.min((value / max) * 100, 100);
  const colors = {
    red: { bar: 'bg-red-500', text: 'text-red-400', glow: 'shadow-red-500/30' },
    emerald: { bar: 'bg-emerald-500', text: 'text-emerald-400', glow: 'shadow-emerald-500/30' },
    cyan: { bar: 'bg-cyan-500', text: 'text-cyan-400', glow: 'shadow-cyan-500/30' },
  }[color];

  return (
    <div className="space-y-1.5">
      <div className="flex justify-between items-baseline">
        <span className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">{label}</span>
        <span className={`text-sm font-bold font-mono ${colors.text}`}>
          {typeof value === 'number' ? (value >= 1000 ? `${(value / 1000).toFixed(1)}k` : value.toFixed(0)) : value}{unit}
        </span>
      </div>
      <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
        <div
          className={`h-full ${colors.bar} rounded-full transition-all duration-300 ${pct > 80 ? colors.glow + ' shadow-lg' : ''}`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

// ── Packet Animation ──
function PacketStream({ active, rps, crashed }: { active: boolean; rps: number; crashed: boolean }) {
  const intensity = Math.min(rps / 5000, 1);
  const packetCount = Math.floor(3 + intensity * 12);

  if (!active) return (
    <div className="h-16 flex items-center justify-center">
      <div className="text-xs text-slate-600 font-mono">Waiting for traffic...</div>
    </div>
  );

  return (
    <div className="h-16 relative overflow-hidden rounded-lg bg-slate-900/50 border border-slate-800/50">
      {Array.from({ length: packetCount }).map((_, i) => (
        <div
          key={i}
          className={`absolute w-1.5 h-1.5 rounded-full ${crashed ? 'bg-red-400' : 'bg-cyan-400'}`}
          style={{
            left: `${(i / packetCount) * 100}%`,
            top: `${20 + Math.sin(i * 1.7) * 30}%`,
            opacity: 0.4 + Math.random() * 0.6,
            animation: `packetFlow ${0.8 + Math.random() * 0.6}s linear infinite`,
            animationDelay: `${i * 0.1}s`,
          }}
        />
      ))}
      <div className="absolute inset-0 flex items-center justify-center">
        <span className={`text-[10px] font-mono font-bold ${crashed ? 'text-red-400 animate-pulse' : 'text-cyan-400/60'}`}>
          {crashed ? '⚠ CONNECTION_REFUSED' : `${rps.toLocaleString()} req/s →`}
        </span>
      </div>
    </div>
  );
}

// ── Main Component ──
export default function RedisBufferSim() {
  const [rps, setRps] = useState(10);
  const [mode, setMode] = useState<'direct' | 'buffer'>('direct');
  const [isRunning, setIsRunning] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [survived, setSurvived] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Derived metrics
  const isDirect = mode === 'direct';
  const crashed = isDirect && rps > 500 && isRunning && elapsed > 1;
  const pgConnections = isDirect
    ? (crashed ? 100 : Math.min(rps * 0.02, 100))
    : Math.min(rps * 0.002 + 3, 15);
  const latency = isDirect
    ? (crashed ? 5000 : (rps > 300 ? 800 + rps * 0.8 : 15 + rps * 0.5))
    : 12 + Math.random() * 6;
  const redisQueueDepth = !isDirect ? Math.min(rps * 0.4, 2000) : 0;
  const pgWriteRate = !isDirect ? Math.min(rps, 200) : rps;
  const errorRate = isDirect
    ? (crashed ? 78 + Math.random() * 15 : (rps > 400 ? (rps - 400) * 0.05 : 0))
    : 0;

  const startSim = useCallback(() => {
    setIsRunning(true);
    setElapsed(0);
    setSurvived(false);
  }, []);

  const stopSim = useCallback(() => {
    setIsRunning(false);
    if (intervalRef.current) clearInterval(intervalRef.current);
  }, []);

  useEffect(() => {
    if (!isRunning) return;
    const start = Date.now();
    intervalRef.current = setInterval(() => {
      const e = (Date.now() - start) / 1000;
      setElapsed(e);
      if (e >= 5) {
        setIsRunning(false);
        if (mode === 'buffer' && rps >= 5000) {
          setSurvived(true);
        }
      }
    }, 100);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [isRunning, mode, rps]);

  const handleReset = () => {
    stopSim();
    setRps(10);
    setElapsed(0);
    setSurvived(false);
  };

  return (
    <div className="w-full max-w-4xl mx-auto my-8 bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-2xl font-mono text-sm">
      {/* Header */}
      <div className="flex border-b border-slate-800 bg-slate-950 px-4 py-3 items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-red-400"><ShieldIcon /></span>
          <span className="font-semibold text-slate-200 tracking-wide font-sans">Traffic Surge Simulator</span>
        </div>
        <div className="flex items-center gap-2">
          {isRunning && (
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-950/50 border border-amber-800/50 text-amber-400 animate-pulse">
              Simulating...
            </div>
          )}
          <div className="text-[10px] text-slate-500 bg-slate-900 px-2 py-1 rounded whitespace-nowrap">Redis + PostgreSQL</div>
        </div>
      </div>

      {/* Controls */}
      <div className="border-b border-slate-800 bg-slate-950/50 p-5 space-y-5">
        {/* Mode Toggle */}
        <div className="flex items-center gap-3">
          <span className="text-[10px] uppercase tracking-widest text-slate-500 font-bold w-20 shrink-0">Strategy</span>
          <div className="flex bg-slate-800 rounded-lg p-0.5 w-full max-w-sm">
            <button
              onClick={() => { if (!isRunning) setMode('direct'); }}
              className={`flex-1 px-4 py-2 rounded-md text-xs font-bold transition-all duration-300 cursor-pointer ${
                isDirect
                  ? 'bg-red-900/60 text-red-300 border border-red-700/50 shadow-lg shadow-red-900/20'
                  : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              Direct to Postgres
            </button>
            <button
              onClick={() => { if (!isRunning) setMode('buffer'); }}
              className={`flex-1 px-4 py-2 rounded-md text-xs font-bold transition-all duration-300 cursor-pointer ${
                !isDirect
                  ? 'bg-emerald-900/60 text-emerald-300 border border-emerald-700/50 shadow-lg shadow-emerald-900/20'
                  : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              Redis Write-Buffer
            </button>
          </div>
        </div>

        {/* RPS Slider */}
        <div className="flex items-center gap-3">
          <span className="text-[10px] uppercase tracking-widest text-slate-500 font-bold w-20 shrink-0">RPS</span>
          <div className="flex-1 flex items-center gap-4">
            <input
              type="range"
              min={10}
              max={5000}
              step={10}
              value={rps}
              onChange={(e) => setRps(Number(e.target.value))}
              disabled={isRunning}
              className="flex-1 h-2 rounded-full appearance-none cursor-pointer accent-cyan-500 bg-slate-700 disabled:opacity-50"
            />
            <span className={`text-lg font-bold font-mono w-20 text-right ${rps > 2000 ? 'text-amber-400' : rps > 500 ? 'text-cyan-400' : 'text-slate-300'}`}>
              {rps.toLocaleString()}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button
            onClick={isRunning ? stopSim : startSim}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-lg font-bold text-sm transition-all duration-300 cursor-pointer ${
              isRunning
                ? 'bg-red-950/50 hover:bg-red-900/50 border border-red-800/50 text-red-400'
                : 'bg-cyan-950/50 hover:bg-cyan-900/50 border border-cyan-800/50 text-cyan-400 hover:shadow-lg hover:shadow-cyan-900/20'
            }`}
          >
            <ZapIcon />
            {isRunning ? 'Stop' : 'Start Surge Test'}
          </button>
          <button
            onClick={handleReset}
            className="px-4 py-2.5 rounded-lg text-xs font-bold bg-slate-800 hover:bg-slate-700 text-slate-400 border border-slate-700 transition-all duration-300 cursor-pointer"
          >
            Reset
          </button>
        </div>
      </div>

      {/* Visualization */}
      <div className="p-5 space-y-4" style={{ minHeight: '340px' }}>
        {/* Packet Stream */}
        <PacketStream active={isRunning || elapsed > 0} rps={rps} crashed={crashed} />

        {/* Architecture Flow */}
        <div className={`grid gap-3 ${isDirect ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1 md:grid-cols-3'}`}>
          {/* Redis Panel (buffer mode only) */}
          {!isDirect && (
            <div className={`bg-red-950/20 border rounded-xl p-4 transition-all duration-500 ${
              isRunning ? 'border-red-500/60 shadow-lg shadow-red-900/20' : 'border-red-800/30'
            }`}>
              <div className="flex items-center gap-2 mb-3">
                <div className={`w-2.5 h-2.5 rounded-full bg-red-400 ${isRunning ? 'animate-pulse' : ''}`} />
                <span className="text-xs font-bold text-red-400 uppercase tracking-wider">Redis Buffer</span>
              </div>
              <Gauge value={redisQueueDepth} max={2500} label="Queue Depth" unit="" color="red" />
              <div className="mt-2 text-[10px] text-slate-500 font-mono">
                LPUSH → Stream append
              </div>
            </div>
          )}

          {/* Postgres Panel */}
          <div className={`border rounded-xl p-4 transition-all duration-500 ${
            crashed
              ? 'bg-red-950/30 border-red-500/60 shadow-lg shadow-red-900/30 animate-pulse'
              : isDirect && isRunning && rps > 300
                ? 'bg-amber-950/20 border-amber-800/40'
                : 'bg-blue-950/20 border-blue-800/30'
          }`}>
            <div className="flex items-center gap-2 mb-3">
              <div className={`w-2.5 h-2.5 rounded-full ${crashed ? 'bg-red-400 animate-pulse' : 'bg-blue-400'}`} />
              <span className={`text-xs font-bold uppercase tracking-wider ${crashed ? 'text-red-400' : 'text-blue-400'}`}>
                <DatabaseIcon /> PostgreSQL
              </span>
            </div>
            <div className="space-y-2.5">
              <Gauge value={pgConnections} max={100} label="Connection Pool" unit="%" color={crashed ? 'red' : pgConnections > 60 ? 'red' : 'emerald'} />
              <Gauge value={isDirect ? pgWriteRate : Math.min(pgWriteRate, 200)} max={isDirect ? 5000 : 300} label="Write Rate" unit="/s" color={crashed ? 'red' : 'cyan'} />
            </div>
            {crashed && (
              <div className="mt-3 px-3 py-2 rounded-lg bg-red-950/50 border border-red-800/40 text-xs text-red-400 font-bold animate-pulse">
                ⚠ CONNECTION_REFUSED — Pool Exhausted
              </div>
            )}
          </div>

          {/* Metrics Panel */}
          <div className="bg-slate-800/30 border border-slate-700/30 rounded-xl p-4">
            <div className="text-[10px] uppercase tracking-widest text-slate-500 font-bold mb-3">Live Metrics</div>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-xs text-slate-500">Latency (p99)</span>
                <span className={`text-sm font-bold font-mono ${latency > 1000 ? 'text-red-400' : latency > 100 ? 'text-amber-400' : 'text-emerald-400'}`}>
                  {latency > 1000 ? `${(latency / 1000).toFixed(1)}s` : `${latency.toFixed(0)}ms`}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-xs text-slate-500">Error Rate</span>
                <span className={`text-sm font-bold font-mono ${errorRate > 0 ? 'text-red-400' : 'text-emerald-400'}`}>
                  {errorRate.toFixed(1)}%
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-xs text-slate-500">Elapsed</span>
                <span className="text-sm font-bold font-mono text-slate-300">{elapsed.toFixed(1)}s</span>
              </div>
              {!isDirect && (
                <div className="flex justify-between">
                  <span className="text-xs text-slate-500">Bulk Flush</span>
                  <span className="text-sm font-bold font-mono text-emerald-400">200/batch</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Result: Crash (direct mode) */}
        {crashed && elapsed >= 3 && (
          <div className="bg-red-950/30 border border-red-800/40 rounded-xl p-5 flex items-start gap-4">
            <span className="text-red-400 mt-0.5"><AlertTriangleIcon /></span>
            <div>
              <div className="text-sm font-bold text-red-400 mb-1">System Crash at {rps.toLocaleString()} RPS</div>
              <div className="text-xs text-slate-400 leading-relaxed">
                PostgreSQL connection pool exhausted. Row-level locks caused cascading timeouts.
                All incoming writes are being rejected. <span className="text-red-400 font-bold">Switch to Redis Write-Buffer</span> to survive this traffic.
              </div>
            </div>
          </div>
        )}

        {/* Result: Survived (buffer mode at 5000 RPS) */}
        {survived && (
          <div className="bg-emerald-950/20 border border-emerald-500/40 rounded-xl p-5 flex items-start gap-4 shadow-lg shadow-emerald-900/10">
            <span className="text-emerald-400 mt-0.5"><CheckCircleIcon /></span>
            <div className="flex-1">
              <div className="text-sm font-bold text-emerald-400 mb-1">🎉 You survived a 5,000 RPS surge!</div>
              <div className="text-xs text-slate-400 leading-relaxed mb-3">
                System Status: <span className="text-emerald-400 font-bold">Stable</span>. Redis absorbed the write storm.
                PostgreSQL processed bulk inserts at a calm 200/batch. Zero connections dropped. Zero data lost.
              </div>
              <div className="flex items-center gap-3">
                <div className="text-[10px] text-slate-500 bg-slate-800 px-3 py-1.5 rounded-lg">
                  Latency: <span className="text-emerald-400 font-bold">~15ms</span> · Errors: <span className="text-emerald-400 font-bold">0%</span> · Uptime: <span className="text-emerald-400 font-bold">100%</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="border-t border-slate-800 bg-slate-950 px-6 py-3 flex items-center justify-between">
        <div className="text-[10px] text-slate-600">
          {isDirect ? '⚡ Direct Write Path' : '🛡 Redis → Worker → Postgres (Bulk)'}
        </div>
        <div className="flex items-center gap-4 text-[10px] text-slate-500">
          <div className="flex items-center gap-1.5">
            <div className={`w-2 h-2 rounded-full ${crashed ? 'bg-red-400 animate-pulse' : isRunning ? 'bg-cyan-400 animate-pulse' : survived ? 'bg-emerald-400' : 'bg-slate-700'}`} />
            <span>{crashed ? 'CRASHED' : isRunning ? 'Running' : survived ? 'Survived' : 'Ready'}</span>
          </div>
          <span className="text-slate-700">|</span>
          <span>SmartWorkLab</span>
        </div>
      </div>

      {/* CSS Keyframes */}
      <style>{`
        @keyframes packetFlow {
          0% { transform: translateX(0) scale(1); opacity: 0.8; }
          50% { transform: translateX(20px) scale(1.2); opacity: 1; }
          100% { transform: translateX(40px) scale(0.8); opacity: 0; }
        }
      `}</style>
    </div>
  );
}
