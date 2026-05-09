'use client';

import React, { useState, useEffect, useCallback } from 'react';

// ── Types ──
interface FashionTag {
  key: string;
  value: string;
  delay: number;
}

// ── Mock Fashion DNA Tags ──
const FASHION_TAGS: FashionTag[] = [
  { key: 'primary_color', value: '"indigo"', delay: 0 },
  { key: 'secondary_color', value: '"white"', delay: 120 },
  { key: 'material', value: '"denim"', delay: 240 },
  { key: 'material_weight', value: '"heavy"', delay: 360 },
  { key: 'silhouette', value: '"boxy"', delay: 480 },
  { key: 'fit_type', value: '"relaxed"', delay: 600 },
  { key: 'pattern', value: '"solid"', delay: 720 },
  { key: 'formal_index', value: '2.1', delay: 840 },
  { key: 'warmth_index', value: '3.8', delay: 960 },
  { key: 'season', value: '["fall", "winter"]', delay: 1080 },
  { key: 'occasion', value: '["casual", "streetwear"]', delay: 1200 },
  { key: 'layer_compatibility', value: '0.85', delay: 1320 },
  { key: 'style_dna_vector', value: '[0.23, 0.81, ...]  // 32-dim', delay: 1440 },
];

// ── SVG Icons ──
function ScanIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 7V5a2 2 0 0 1 2-2h2" /><path d="M17 3h2a2 2 0 0 1 2 2v2" />
      <path d="M21 17v2a2 2 0 0 1-2 2h-2" /><path d="M7 21H5a2 2 0 0 1-2-2v-2" />
      <line x1="7" y1="12" x2="17" y2="12" />
    </svg>
  );
}

function EyeIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
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

function RefreshIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="23 4 23 10 17 10" />
      <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
    </svg>
  );
}

// ── Scan Line Animation ──
function ScanOverlay({ active }: { active: boolean }) {
  if (!active) return null;
  return (
    <div className="absolute inset-0 overflow-hidden rounded-xl pointer-events-none z-10">
      <div
        className="absolute left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-emerald-400 to-transparent opacity-80"
        style={{
          animation: 'scanLine 2s ease-in-out infinite',
        }}
      />
      {/* Corner brackets */}
      <div className="absolute top-2 left-2 w-6 h-6 border-t-2 border-l-2 border-emerald-400/60 rounded-tl" />
      <div className="absolute top-2 right-2 w-6 h-6 border-t-2 border-r-2 border-emerald-400/60 rounded-tr" />
      <div className="absolute bottom-2 left-2 w-6 h-6 border-b-2 border-l-2 border-emerald-400/60 rounded-bl" />
      <div className="absolute bottom-2 right-2 w-6 h-6 border-b-2 border-r-2 border-emerald-400/60 rounded-br" />
    </div>
  );
}

// ── Cost Meter ──
function CostMeter({ cost, latency, label, color }: { cost: string; latency: string; label: string; color: 'red' | 'emerald' }) {
  const colors = color === 'red'
    ? { bg: 'bg-red-950/30', border: 'border-red-800/40', text: 'text-red-400', glow: 'shadow-red-900/20' }
    : { bg: 'bg-emerald-950/30', border: 'border-emerald-800/40', text: 'text-emerald-400', glow: 'shadow-emerald-900/20' };

  return (
    <div className={`${colors.bg} ${colors.border} border rounded-xl p-4 shadow-lg ${colors.glow} transition-all duration-500`}>
      <div className="text-[10px] uppercase tracking-widest text-slate-500 font-bold mb-2">{label}</div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <div className={`text-xl font-bold font-mono ${colors.text}`}>{cost}</div>
          <div className="text-[10px] text-slate-500 mt-0.5">per search</div>
        </div>
        <div>
          <div className={`text-xl font-bold font-mono ${colors.text}`}>{latency}</div>
          <div className="text-[10px] text-slate-500 mt-0.5">latency</div>
        </div>
      </div>
    </div>
  );
}

// ── Main Component ──
export default function VlmScannerSim() {
  const [mode, setMode] = useState<'idle' | 'vlm-loading' | 'vlm-done' | 'metadata-scanning' | 'metadata-done'>('idle');
  const [visibleTags, setVisibleTags] = useState<number>(0);
  const [vlmProgress, setVlmProgress] = useState(0);
  const [elapsedMs, setElapsedMs] = useState(0);

  // VLM loading simulation
  useEffect(() => {
    if (mode !== 'vlm-loading') return;
    setVlmProgress(0);
    setElapsedMs(0);
    const startTime = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      setElapsedMs(elapsed);
      // Sluggish progress to simulate real VLM inference
      const progress = Math.min(elapsed / 6000 * 100, 100);
      setVlmProgress(progress);
      if (elapsed >= 6000) {
        clearInterval(interval);
        setMode('vlm-done');
      }
    }, 50);
    return () => clearInterval(interval);
  }, [mode]);

  // Metadata tag reveal animation
  useEffect(() => {
    if (mode !== 'metadata-scanning') return;
    setVisibleTags(0);
    setElapsedMs(0);
    const startTime = Date.now();
    const elapsedInterval = setInterval(() => {
      setElapsedMs(Date.now() - startTime);
    }, 50);
    const timers = FASHION_TAGS.map((tag, i) =>
      setTimeout(() => {
        setVisibleTags(prev => prev + 1);
        if (i === FASHION_TAGS.length - 1) {
          setTimeout(() => setMode('metadata-done'), 300);
        }
      }, tag.delay + 400)
    );
    return () => {
      timers.forEach(clearTimeout);
      clearInterval(elapsedInterval);
    };
  }, [mode]);

  const handleVlm = useCallback(() => {
    if (mode !== 'idle') return;
    setMode('vlm-loading');
  }, [mode]);

  const handleMetadata = useCallback(() => {
    if (mode !== 'idle') return;
    setMode('metadata-scanning');
  }, [mode]);

  const handleReset = useCallback(() => {
    setMode('idle');
    setVisibleTags(0);
    setVlmProgress(0);
    setElapsedMs(0);
  }, []);

  const isRunning = mode === 'vlm-loading' || mode === 'metadata-scanning';
  const isDone = mode === 'vlm-done' || mode === 'metadata-done';

  return (
    <div className="w-full max-w-4xl mx-auto my-8 bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-2xl font-mono text-sm">
      {/* ── Header ── */}
      <div className="flex border-b border-slate-800 bg-slate-950 px-4 py-3 items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-amber-400"><ScanIcon /></span>
          <span className="font-semibold text-slate-200 tracking-wide font-sans">Vision-at-the-Gate Simulator</span>
        </div>
        <div className="flex items-center gap-2 min-w-0">
          {isRunning && (
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-950/50 border border-amber-800/50 text-amber-400 animate-pulse">
              Processing...
            </div>
          )}
          <div className="text-[10px] text-slate-500 bg-slate-900 px-2 py-1 rounded whitespace-nowrap shrink-0">claude-sonnet-4-5-20250929</div>
        </div>
      </div>

      {/* ── Main Content ── */}
      <div className="flex flex-col md:flex-row" style={{ minHeight: '480px' }}>
        {/* Left: Mock Image + Scan */}
        <div className="w-full md:w-2/5 border-r border-slate-800 p-5 flex flex-col items-center justify-center gap-4">
          <div className="relative w-full aspect-square max-w-[240px] bg-slate-800/50 rounded-xl border border-slate-700/50 overflow-hidden flex items-center justify-center">
            <ScanOverlay active={mode === 'metadata-scanning'} />
            {/* Mock outfit visual */}
            <div className="text-center p-4 z-0 flex flex-col items-center">
              <div className="w-24 h-24 mb-4 rounded-lg overflow-hidden border border-slate-700 shadow-lg">
                <img
                  src="https://images.unsplash.com/photo-1495105787522-5334e3ffa0ef?q=80&w=400&auto=format&fit=crop"
                  alt="Camel Trench Coat"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="text-xs text-slate-500 font-sans">Camel Trench Coat</div>
              <div className="text-[10px] text-slate-600 mt-1">1024 × 1024 · 2.4MB</div>
            </div>
            {/* VLM loading bar overlay */}
            {mode === 'vlm-loading' && (
              <div className="absolute inset-0 bg-slate-900/80 flex flex-col items-center justify-center gap-3 z-10">
                <EyeIcon />
                <div className="text-xs text-red-400">VLM Inference Running...</div>
                <div className="w-3/4 h-1.5 bg-slate-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-red-500 rounded-full transition-all duration-100"
                    style={{ width: `${vlmProgress}%` }}
                  />
                </div>
                <div className="text-[10px] text-slate-500 font-mono">
                  {(elapsedMs / 1000).toFixed(1)}s elapsed
                </div>
              </div>
            )}
          </div>

          {/* Elapsed timer for metadata mode */}
          {mode === 'metadata-scanning' && (
            <div className="text-xs text-emerald-400 font-mono">
              ⏱ {(elapsedMs / 1000).toFixed(1)}s — Extracting {visibleTags}/{FASHION_TAGS.length} tags
            </div>
          )}

          {/* Base64 encoding indicator */}
          {(mode === 'metadata-scanning' || mode === 'metadata-done') && (
            <div className="w-full bg-slate-800/50 rounded-lg border border-slate-700/30 p-3">
              <div className="text-[10px] text-slate-500 uppercase tracking-wider mb-1 font-bold">Encoding</div>
              <div className="text-xs text-emerald-400/80 break-all leading-relaxed">
                data:image/jpeg;base64,/9j/4AAQS<span className="text-slate-600">...</span>
              </div>
            </div>
          )}
        </div>

        {/* Right: Results Panel */}
        <div className="w-full md:w-3/5 bg-slate-950 p-5 flex flex-col gap-4 overflow-y-auto">
          {/* Idle state */}
          {mode === 'idle' && (
            <div className="flex-1 flex flex-col items-center justify-center gap-6 text-center">
              <div className="text-slate-600 text-xs font-sans max-w-[280px] leading-relaxed">
                Compare real-time VLM inference against one-time metadata extraction. Click a strategy below to begin.
              </div>
              <div className="flex flex-col gap-3 w-full max-w-[300px]">
                <button
                  onClick={handleVlm}
                  className="flex items-center justify-center gap-2 px-5 py-3 rounded-lg font-bold text-sm bg-red-950/40 hover:bg-red-900/40 border border-red-800/40 text-red-400 transition-all duration-300 cursor-pointer hover:shadow-lg hover:shadow-red-900/20"
                >
                  <EyeIcon />
                  Simulate Real-time VLM
                </button>
                <button
                  onClick={handleMetadata}
                  className="flex items-center justify-center gap-2 px-5 py-3 rounded-lg font-bold text-sm bg-emerald-950/40 hover:bg-emerald-900/40 border border-emerald-800/40 text-emerald-400 transition-all duration-300 cursor-pointer hover:shadow-lg hover:shadow-emerald-900/20"
                >
                  <ZapIcon />
                  Simulate Metadata Extraction
                </button>
              </div>
            </div>
          )}

          {/* VLM Loading / Done */}
          {(mode === 'vlm-loading' || mode === 'vlm-done') && (
            <div className="flex flex-col gap-4">
              <CostMeter
                cost="$0.030"
                latency={mode === 'vlm-done' ? '6.0s' : `${(elapsedMs / 1000).toFixed(1)}s`}
                label="Real-time VLM Inference"
                color="red"
              />
              {mode === 'vlm-done' && (
                <>
                  <div className="bg-red-950/20 border border-red-800/30 rounded-lg p-4">
                    <div className="text-[10px] text-red-400 uppercase tracking-wider font-bold mb-2">⚠ Problem Analysis</div>
                    <ul className="text-xs text-slate-400 space-y-1.5 font-sans leading-relaxed">
                      <li>• Cost per 10k searches: <span className="text-red-400 font-bold font-mono">$300.00</span></li>
                      <li>• Latency unacceptable for consumer UX (&gt;3s = abandonment)</li>
                      <li>• Each search re-analyzes the same image</li>
                      <li>• No caching possible — VLM output is non-deterministic</li>
                      <li>• Cost scales linearly with user growth: <span className="text-red-400 font-mono">O(n)</span></li>
                    </ul>
                  </div>
                  <div className="bg-slate-800/30 border border-slate-700/30 rounded-lg p-3 text-center">
                    <div className="text-xs text-slate-500 font-sans">Same image analyzed <span className="text-red-400 font-bold">every single search</span></div>
                  </div>
                </>
              )}
            </div>
          )}

          {/* Metadata Scanning / Done */}
          {(mode === 'metadata-scanning' || mode === 'metadata-done') && (
            <div className="flex flex-col gap-4">
              <CostMeter
                cost="$0.0001"
                latency="45ms"
                label="Structured Metadata Query"
                color="emerald"
              />
              {/* JSON Output */}
              <div className="bg-slate-900 border border-slate-800 rounded-lg overflow-hidden">
                <div className="px-3 py-2 border-b border-slate-800/60 bg-slate-900/80 flex items-center justify-between">
                  <span className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">Fashion DNA — JSON Output</span>
                  <span className="text-[10px] text-emerald-400/60">{visibleTags}/{FASHION_TAGS.length} tags</span>
                </div>
                <div className="p-3 max-h-[260px] overflow-y-auto">
                  <pre className="text-xs leading-relaxed">
                    <span className="text-slate-500">{'{'}</span>
                    {FASHION_TAGS.slice(0, visibleTags).map((tag, i) => (
                      <div
                        key={tag.key}
                        className="animate-[fadeIn_0.3s_ease-in]"
                        style={{ animationDelay: `${i * 50}ms` }}
                      >
                        {'  '}
                        <span className="text-cyan-400">&quot;{tag.key}&quot;</span>
                        <span className="text-slate-500">: </span>
                        <span className={tag.value.startsWith('"') || tag.value.startsWith('[') ? 'text-amber-400' : 'text-emerald-400'}>
                          {tag.value}
                        </span>
                        {i < FASHION_TAGS.length - 1 && <span className="text-slate-600">,</span>}
                      </div>
                    ))}
                    {visibleTags < FASHION_TAGS.length && (
                      <div className="text-slate-600">  ...</div>
                    )}
                    <span className="text-slate-500">{'}'}</span>
                  </pre>
                </div>
              </div>
              {mode === 'metadata-done' && (
                <div className="bg-emerald-950/20 border border-emerald-800/30 rounded-lg p-4">
                  <div className="text-[10px] text-emerald-400 uppercase tracking-wider font-bold mb-2">✅ Architecture Advantage</div>
                  <ul className="text-xs text-slate-400 space-y-1.5 font-sans leading-relaxed">
                    <li>• Cost per 10k searches: <span className="text-emerald-400 font-bold font-mono">$1.00</span></li>
                    <li>• VLM called <span className="text-emerald-400 font-bold">once</span> at ingestion → metadata persisted forever</li>
                    <li>• All agent reasoning uses text-only LLM: <span className="text-emerald-400 font-mono">O(1)</span> per item</li>
                    <li>• pgvector cosine similarity for sub-50ms search</li>
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* ── Footer ── */}
      <div className="border-t border-slate-800 bg-slate-950 px-6 py-3 flex items-center justify-between">
        {isDone ? (
          <button
            onClick={handleReset}
            className="flex items-center gap-2 px-5 py-2.5 rounded-lg font-bold text-sm bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-all duration-300 cursor-pointer"
          >
            <RefreshIcon />
            Reset
          </button>
        ) : (
          <div />
        )}
        <div className="flex items-center gap-4 text-[10px] text-slate-500">
          <div className="flex items-center gap-1.5">
            <div className={`w-2 h-2 rounded-full ${mode.includes('vlm') ? 'bg-red-400' : mode.includes('metadata') ? 'bg-emerald-400' : 'bg-slate-700'} ${isRunning ? 'animate-pulse' : ''}`} />
            <span>{mode === 'idle' ? 'Ready' : isRunning ? 'Processing' : 'Complete'}</span>
          </div>
          <span className="text-slate-700">|</span>
          <span>Pickle AI × SmartWorkLab</span>
        </div>
      </div>

      {/* ── CSS Keyframes ── */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(4px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes scanLine {
          0% { top: 0%; opacity: 0; }
          10% { opacity: 0.8; }
          90% { opacity: 0.8; }
          100% { top: 100%; opacity: 0; }
        }
      `}</style>
    </div>
  );
}
