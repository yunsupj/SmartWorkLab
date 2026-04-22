'use client';

import React, { useState, useEffect, useCallback } from 'react';

interface SearchResult {
  id: number;
  title: string;
  excerpt: string;
  score: number;
  extracted_keywords: string[];
  relevant: boolean;
  hallucination_type?: string;
}

const MOCK_RESULTS: SearchResult[] = [
  {
    id: 1,
    title: "24h Pharmacy near Torrance Blvd",
    excerpt: "Does anyone know a pharmacy open past midnight near Torrance? I need to pick up a prescription urgently.",
    score: 0.91,
    extracted_keywords: ["pharmacy", "24-hour", "Torrance"],
    relevant: true,
  },
  {
    id: 2,
    title: "Best late-night pharmacy spots in South Bay",
    excerpt: "Moved to the area recently. Where do you all go for late-night pharmacy runs?",
    score: 0.87,
    extracted_keywords: ["pharmacy", "late-night", "South Bay"],
    relevant: true,
  },
  {
    id: 3,
    title: "Late-night bicycle repair — anyone open?",
    excerpt: "My bike chain broke at 11pm. Is there a late-night repair shop still open around here?",
    score: 0.84,
    extracted_keywords: ["bicycle", "repair", "late-night"],
    relevant: false,
    hallucination_type: "Vector Space Hallucination",
  },
  {
    id: 4,
    title: "Pharmacy recommendation for pet meds in Torrance",
    excerpt: "Need a pharmacy that carries pet medications. Any recommendations in the Torrance area?",
    score: 0.83,
    extracted_keywords: ["pharmacy", "pet", "Torrance"],
    relevant: true,
  },
  {
    id: 5,
    title: "Late-night auto parts store near Del Amo",
    excerpt: "Anyone know an auto parts place open late? Need brake pads urgently for a morning trip.",
    score: 0.82,
    extracted_keywords: ["auto-parts", "late-night", "Del Amo"],
    relevant: false,
    hallucination_type: "Vector Space Hallucination",
  },
  {
    id: 6,
    title: "Online drug deals — WARNING scam alert",
    excerpt: "PSA: got a sketchy DM about buying cheap drugs online. Reported to admin. Stay safe everyone.",
    score: 0.79,
    extracted_keywords: ["scam", "online", "warning"],
    relevant: false,
    hallucination_type: "Irrelevant Content",
  },
  {
    id: 7,
    title: "Night shift workers meetup — Torrance",
    excerpt: "Fellow night owls! Let's organize a weekend brunch meetup for all us late-shift folks.",
    score: 0.76,
    extracted_keywords: ["meetup", "night-shift", "Torrance"],
    relevant: false,
    hallucination_type: "Semantic Drift",
  },
  {
    id: 8,
    title: "Pharmacy school prep study group",
    excerpt: "Starting a study group for pharmacy school entrance exams. DM if you're interested!",
    score: 0.73,
    extracted_keywords: ["pharmacy-school", "study", "education"],
    relevant: false,
    hallucination_type: "Semantic Drift",
  },
];

const INTENT_KEYWORDS = ["Pharmacy", "Late-night"];

function hasIntentMatch(result: SearchResult): boolean {
  const kws = result.extracted_keywords.map(k => k.toLowerCase());
  const title = result.title.toLowerCase();
  return INTENT_KEYWORDS.some(
    ik => kws.some(k => k.includes(ik.toLowerCase())) || title.includes(ik.toLowerCase())
  );
}

// ── Inline SVG Icons ──
function SearchIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  );
}

function ShieldIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function XIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

function FlameIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M8.5 14.5A2.5 2.5 0 0011 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 11-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 002.5 2.5z" />
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

function DatabaseIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <ellipse cx="12" cy="5" rx="9" ry="3" />
      <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" />
      <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
    </svg>
  );
}

export default function HybridRagSim() {
  const [gatekeeperActive, setGatekeeperActive] = useState(false);
  const [isFiltering, setIsFiltering] = useState(false);
  const [showIntent, setShowIntent] = useState(false);
  const [filterPhase, setFilterPhase] = useState(0); // 0=idle, 1=extracting, 2=filtering, 3=done
  const [latency, setLatency] = useState(0);
  const [isCountingRaw, setIsCountingRaw] = useState(false);
  const [rawLatencyDisplay, setRawLatencyDisplay] = useState(0);

  // Start a slow latency counter on mount to simulate raw search delay
  useEffect(() => {
    if (!gatekeeperActive && !isFiltering) {
      setIsCountingRaw(true);
    }
  }, []);

  useEffect(() => {
    if (!isCountingRaw) return;
    const interval = setInterval(() => {
      setRawLatencyDisplay(prev => {
        if (prev >= 32.0) {
          clearInterval(interval);
          return 32.0;
        }
        return Math.round((prev + 0.1) * 10) / 10;
      });
    }, 100);
    return () => clearInterval(interval);
  }, [isCountingRaw]);

  const handleEngage = useCallback(() => {
    if (gatekeeperActive || isFiltering) return;
    setIsCountingRaw(false);
    setIsFiltering(true);
    setFilterPhase(1);
    setShowIntent(true);

    // Phase 1: Intent extraction (600ms)
    setTimeout(() => {
      setFilterPhase(2);
      // Phase 2: Filtering animation (800ms)
      setTimeout(() => {
        setFilterPhase(3);
        setGatekeeperActive(true);
        setIsFiltering(false);
        setLatency(2.8);
      }, 800);
    }, 600);
  }, [gatekeeperActive, isFiltering]);

  const handleReset = useCallback(() => {
    setGatekeeperActive(false);
    setIsFiltering(false);
    setShowIntent(false);
    setFilterPhase(0);
    setLatency(0);
    setRawLatencyDisplay(0);
    setIsCountingRaw(true);
  }, []);

  const survivors = MOCK_RESULTS.filter(r => hasIntentMatch(r));
  const killed = MOCK_RESULTS.filter(r => !hasIntentMatch(r));

  return (
    <div className="w-full max-w-4xl mx-auto my-8 bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-2xl font-mono text-sm">
      {/* ── Header Bar ── */}
      <div className="flex border-b border-slate-800 bg-slate-950 px-4 py-3 items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-cyan-400"><ShieldIcon /></span>
          <span className="font-semibold text-slate-200 tracking-wide">Hybrid RAG Gatekeeper Sim</span>
        </div>
        <div className="flex items-center gap-3">
          {/* Latency display */}
          <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold transition-all duration-500 ${
            gatekeeperActive 
              ? 'bg-emerald-950/50 border border-emerald-800/50 text-emerald-400' 
              : 'bg-red-950/50 border border-red-800/50 text-red-400'
          }`}>
            <ZapIcon />
            {gatekeeperActive ? `${latency}s` : isFiltering ? '...' : `${rawLatencyDisplay.toFixed(1)}s`}
          </div>
          <div className="text-xs text-slate-500 bg-slate-900 px-2 py-1 rounded">v2.0.0</div>
        </div>
      </div>

      {/* ── Query Bar ── */}
      <div className="bg-slate-900/50 border-b border-slate-800 px-6 py-4">
        <div className="flex items-center gap-3 bg-slate-950 border border-slate-700 rounded-lg px-4 py-3">
          <span className="text-slate-500"><SearchIcon /></span>
          <span className="text-slate-300 flex-1">&quot;Late-night pharmacy in Torrance&quot;</span>
          <span className="text-xs text-slate-600 flex items-center gap-1"><DatabaseIcon /> pgvector</span>
        </div>
      </div>

      {/* ── Intent Extract Flash ── */}
      {showIntent && (
        <div className={`mx-6 mt-4 flex items-center gap-3 px-4 py-3 rounded-lg border transition-all duration-500 ${
          filterPhase >= 1 
            ? 'bg-cyan-950/30 border-cyan-800/40 opacity-100 translate-y-0' 
            : 'opacity-0 -translate-y-2'
        }`}>
          <span className="text-cyan-400 text-xs font-bold uppercase tracking-wider">Intent Extracted</span>
          <div className="flex gap-2">
            {INTENT_KEYWORDS.map(kw => (
              <span key={kw} className="bg-cyan-900/50 text-cyan-300 px-2 py-0.5 rounded text-xs font-semibold border border-cyan-700/30">
                {kw}
              </span>
            ))}
          </div>
          <span className="ml-auto text-xs text-cyan-600">gpt-4o-mini · 180ms</span>
        </div>
      )}

      {/* ── Results Grid ── */}
      <div className="p-6 space-y-2.5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider">
            {gatekeeperActive ? `Filtered Results (${survivors.length}/${MOCK_RESULTS.length} survived)` : `Raw Vector Results (${MOCK_RESULTS.length} candidates)`}
          </h3>
          {gatekeeperActive && (
            <span className="flex items-center gap-1.5 text-xs text-red-400">
              <FlameIcon /> {killed.length} hallucinations killed
            </span>
          )}
        </div>

        {MOCK_RESULTS.map((result) => {
          const passes = hasIntentMatch(result);
          const isKilled = gatekeeperActive && !passes;
          const isBeingFiltered = isFiltering && filterPhase >= 2 && !passes;

          return (
            <div
              key={result.id}
              className={`relative flex items-start gap-4 p-4 rounded-lg border transition-all duration-700 ease-in-out ${
                isKilled || isBeingFiltered
                  ? 'bg-red-950/10 border-red-900/20 opacity-30 scale-[0.98]'
                  : gatekeeperActive && passes
                    ? 'bg-emerald-950/20 border-emerald-800/30 shadow-[0_0_20px_rgba(16,185,129,0.08)]'
                    : !result.relevant
                      ? 'bg-slate-900/80 border-slate-800/60'
                      : 'bg-slate-900 border-slate-800 hover:border-slate-700'
              }`}
              style={{
                transition: 'all 0.7s cubic-bezier(0.4, 0, 0.2, 1)',
              }}
            >
              {/* Rank Number */}
              <div className={`flex flex-col items-center justify-center w-8 h-8 rounded shrink-0 text-xs font-bold transition-colors duration-500 ${
                isKilled || isBeingFiltered
                  ? 'bg-red-950/50 border border-red-900/40 text-red-600'
                  : gatekeeperActive && passes
                    ? 'bg-emerald-950/50 border border-emerald-800/40 text-emerald-400'
                    : 'bg-slate-950 border border-slate-800 text-slate-500'
              }`}>
                {result.id}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className={`font-semibold text-sm transition-all duration-500 ${
                    isKilled || isBeingFiltered
                      ? 'text-slate-600 line-through decoration-red-500/60 decoration-2'
                      : gatekeeperActive && passes
                        ? 'text-emerald-300'
                        : 'text-slate-200'
                  }`}>
                    {result.title}
                  </h4>
                </div>

                <p className={`text-xs leading-relaxed mb-2 transition-colors duration-500 ${
                  isKilled || isBeingFiltered ? 'text-slate-700' : 'text-slate-500'
                }`}>
                  {result.excerpt}
                </p>

                {/* Tags row */}
                <div className="flex flex-wrap items-center gap-1.5">
                  {result.extracted_keywords.map(kw => {
                    const isMatchedKw = INTENT_KEYWORDS.some(ik => 
                      kw.toLowerCase().includes(ik.toLowerCase())
                    );
                    return (
                      <span key={kw} className={`text-[10px] px-1.5 py-0.5 rounded transition-all duration-500 ${
                        gatekeeperActive && isMatchedKw
                          ? 'bg-emerald-900/50 text-emerald-300 border border-emerald-700/30'
                          : gatekeeperActive && !passes
                            ? 'bg-slate-900/30 text-slate-700 border border-slate-800/30'
                            : 'bg-slate-800/50 text-slate-500 border border-slate-700/30'
                      }`}>
                        {kw}
                      </span>
                    );
                  })}
                </div>
              </div>

              {/* Right: Score & Status */}
              <div className="flex flex-col items-end gap-1 shrink-0">
                <div className={`text-xs transition-colors duration-500 ${
                  isKilled || isBeingFiltered ? 'text-slate-700' : 'text-slate-500'
                }`}>
                  cos: {result.score.toFixed(2)}
                </div>

                {/* Status badge */}
                {(gatekeeperActive || isBeingFiltered) && (
                  <div className={`flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full transition-all duration-500 ${
                    passes
                      ? 'bg-emerald-900/40 text-emerald-400 border border-emerald-700/30'
                      : 'bg-red-900/40 text-red-400 border border-red-700/30'
                  }`}>
                    {passes ? <CheckIcon /> : <XIcon />}
                    {passes ? 'PASS' : 'DROP'}
                  </div>
                )}

                {/* Hallucination label */}
                {!gatekeeperActive && !isFiltering && result.hallucination_type && (
                  <span className="text-[9px] text-amber-500/70 bg-amber-950/30 px-1.5 py-0.5 rounded border border-amber-800/20">
                    ⚠ {result.hallucination_type}
                  </span>
                )}
              </div>

              {/* Kill strike-through overlay */}
              {(isKilled || isBeingFiltered) && (
                <div 
                  className="absolute inset-0 pointer-events-none rounded-lg"
                  style={{
                    background: 'linear-gradient(90deg, transparent 0%, rgba(239,68,68,0.03) 50%, transparent 100%)',
                  }}
                />
              )}
            </div>
          );
        })}
      </div>

      {/* ── Survivors → Main AI Panel ── */}
      {gatekeeperActive && (
        <div className="mx-6 mb-4 p-4 rounded-lg border border-emerald-800/30 bg-emerald-950/10 transition-all duration-700">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-emerald-400"><CheckIcon /></span>
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
              Filtered Payload → Main AI Chef
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            {survivors.map(r => (
              <span key={r.id} className="bg-emerald-900/30 text-emerald-300 border border-emerald-700/30 px-3 py-1.5 rounded text-xs font-medium">
                #{r.id} {r.title.slice(0, 35)}…
              </span>
            ))}
          </div>
          <p className="text-[10px] text-emerald-600 mt-2">
            Only {survivors.length} verified chunks sent to gpt-4o-mini for final response generation. Zero hallucination payload.
          </p>
        </div>
      )}

      {/* ── Control Bar ── */}
      <div className="border-t border-slate-800 bg-slate-950 px-6 py-4 flex items-center justify-between gap-4">
        {!gatekeeperActive ? (
          <button
            onClick={handleEngage}
            disabled={isFiltering}
            className={`flex-1 flex items-center justify-center gap-3 px-6 py-3.5 rounded-lg font-bold text-sm transition-all duration-300 ${
              isFiltering
                ? 'bg-cyan-900/30 text-cyan-500 border border-cyan-800/40 cursor-wait'
                : 'bg-gradient-to-r from-cyan-600 to-emerald-600 hover:from-cyan-500 hover:to-emerald-500 text-white shadow-lg shadow-cyan-900/30 hover:shadow-cyan-800/40 cursor-pointer'
            }`}
          >
            <ShieldIcon />
            {isFiltering ? 'Filtering...' : 'Engage Python Gatekeeper (0.01s)'}
          </button>
        ) : (
          <button
            onClick={handleReset}
            className="flex-1 flex items-center justify-center gap-2 px-6 py-3.5 rounded-lg font-bold text-sm bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-all duration-300 cursor-pointer"
          >
            Reset to Raw Vector Search
          </button>
        )}

        {/* Stats */}
        <div className="hidden md:flex items-center gap-6 text-xs text-slate-500">
          <div className="text-center">
            <div className={`font-bold text-lg transition-colors duration-500 ${gatekeeperActive ? 'text-emerald-400' : 'text-red-400'}`}>
              {gatekeeperActive ? '0%' : '~37%'}
            </div>
            <div>Hallucination</div>
          </div>
          <div className="text-center">
            <div className={`font-bold text-lg transition-colors duration-500 ${gatekeeperActive ? 'text-emerald-400' : 'text-red-400'}`}>
              {gatekeeperActive ? '2.8s' : `${rawLatencyDisplay.toFixed(1)}s`}
            </div>
            <div>Latency</div>
          </div>
          <div className="text-center">
            <div className={`font-bold text-lg transition-colors duration-500 ${gatekeeperActive ? 'text-emerald-400' : 'text-slate-400'}`}>
              {gatekeeperActive ? `${survivors.length}` : `${MOCK_RESULTS.length}`}
            </div>
            <div>→ Main AI</div>
          </div>
        </div>
      </div>
    </div>
  );
}
