'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';

// ── Types ──
interface LogEntry {
  agent: 'writer' | 'critic' | 'system';
  text: string;
  timestamp: string;
}

interface RoundData {
  round: number;
  writerDraft: string;
  criticScore: number;
  criticReason: string;
  flaggedWords: string[];
  factDensity: number;
  adjectiveCount: number;
}

// ── Mock Data ──
const ROUNDS: RoundData[] = [
  {
    round: 1,
    writerDraft:
      '최고의 기술력과 화려한 디자인을 자랑하는 이 혁신적인 플랫폼은 다채로운 기능으로 획기적인 사용자 경험을 선사합니다. 뛰어난 성능과 아름다운 인터페이스가 완벽하게 조화를 이룹니다.',
    criticScore: 0.45,
    criticReason: '미사여구 남발. 구체적 수치 0건. 형용사 8개 검출. 마케팅 카탈로그 수준.',
    flaggedWords: ['최고의', '화려한', '혁신적인', '다채로운', '획기적인', '뛰어난', '아름다운', '완벽하게'],
    factDensity: 0.0,
    adjectiveCount: 8,
  },
  {
    round: 2,
    writerDraft:
      'O(1) 레이턴시를 구현한 캐시 레이어와 P99 23ms 응답 속도를 달성한 API 게이트웨이를 탑재. Figma-to-Code 자동화율 94%, 디자인 QA 소요 시간 40분→8분으로 단축.',
    criticScore: 0.92,
    criticReason: '구체적 수치 4건 포함. 형용사 0개. 기술적 정밀도 우수. 통과.',
    flaggedWords: [],
    factDensity: 0.85,
    adjectiveCount: 0,
  },
];

// ── Inline SVG Icons ──
function BrainIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9.5 2A5.5 5.5 0 0 0 4 7.5c0 1.58.7 3 1.8 4L12 21l6.2-9.5A5.49 5.49 0 0 0 20 7.5 5.5 5.5 0 0 0 14.5 2h-5z" />
    </svg>
  );
}

function ScanIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 7V5a2 2 0 0 1 2-2h2" />
      <path d="M17 3h2a2 2 0 0 1 2 2v2" />
      <path d="M21 17v2a2 2 0 0 1-2 2h-2" />
      <path d="M7 21H5a2 2 0 0 1-2-2v-2" />
      <line x1="7" y1="12" x2="17" y2="12" />
    </svg>
  );
}

function PlayIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="5 3 19 12 5 21 5 3" />
    </svg>
  );
}

function SlackIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="13" y="2" width="3" height="8" rx="1.5" />
      <rect x="2" y="13" width="8" height="3" rx="1.5" />
      <rect x="8" y="2" width="3" height="8" rx="1.5" />
      <rect x="13" y="13" width="8" height="3" rx="1.5" />
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

// ── Score Gauge Component ──
function ScoreGauge({ score, animate }: { score: number; animate: boolean }) {
  const radius = 52;
  const circumference = 2 * Math.PI * radius;
  const progress = animate ? score : 0;
  const offset = circumference - progress * circumference;
  const passes = score >= 0.85;

  return (
    <div className="relative flex items-center justify-center">
      <svg width="140" height="140" viewBox="0 0 140 140" className="transform -rotate-90">
        {/* Track */}
        <circle cx="70" cy="70" r={radius} fill="none" stroke="#1e293b" strokeWidth="10" />
        {/* Progress */}
        <circle
          cx="70"
          cy="70"
          r={radius}
          fill="none"
          strokeWidth="10"
          strokeLinecap="round"
          stroke={passes ? '#10b981' : score > 0 ? '#ef4444' : '#334155'}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transition: 'stroke-dashoffset 1.5s cubic-bezier(0.4, 0, 0.2, 1), stroke 0.5s' }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span
          className={`text-3xl font-bold font-mono transition-colors duration-500 ${
            passes ? 'text-emerald-400' : score > 0 ? 'text-red-400' : 'text-slate-600'
          }`}
        >
          {animate ? score.toFixed(2) : '—'}
        </span>
        <span className="text-[10px] text-slate-500 uppercase tracking-wider mt-1">Critic Score</span>
      </div>
    </div>
  );
}

// ── Highlighted Draft Text ──
function HighlightedDraft({ text, flaggedWords }: { text: string; flaggedWords: string[] }) {
  if (flaggedWords.length === 0) {
    return <span>{text}</span>;
  }
  const pattern = new RegExp(`(${flaggedWords.map(w => w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')})`, 'g');
  const parts = text.split(pattern);

  return (
    <span>
      {parts.map((part, i) =>
        flaggedWords.includes(part) ? (
          <span
            key={i}
            className="bg-red-900/40 text-red-300 px-1 py-0.5 rounded border border-red-700/40 line-through decoration-red-500/80 decoration-2"
          >
            {part}
          </span>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </span>
  );
}

// ── Main Component ──
export default function AgenticLoopSim() {
  const [phase, setPhase] = useState<'idle' | 'round1-writing' | 'round1-critiquing' | 'round2-writing' | 'round2-critiquing' | 'passed' | 'slack'>('idle');
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [currentRound, setCurrentRound] = useState(0);
  const [displayScore, setDisplayScore] = useState(0);
  const [scoreAnimated, setScoreAnimated] = useState(false);
  const [slackApproved, setSlackApproved] = useState(false);
  const logEndRef = useRef<HTMLDivElement>(null);

  const addLog = useCallback((agent: LogEntry['agent'], text: string) => {
    const ts = new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });
    setLogs(prev => [...prev, { agent, text, timestamp: ts }]);
  }, []);

  useEffect(() => {
    if (logs.length > 0) {
      logEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }, [logs]);

  const runSimulation = useCallback(() => {
    if (phase !== 'idle') return;
    setLogs([]);
    setCurrentRound(0);
    setDisplayScore(0);
    setScoreAnimated(false);
    setSlackApproved(false);

    // ── Round 1: Writer ──
    setPhase('round1-writing');
    addLog('system', '🔄 Agentic Loop 시작 — Round 1');
    setTimeout(() => {
      addLog('writer', '📝 초안 생성 중...');
    }, 400);

    setTimeout(() => {
      setCurrentRound(1);
      addLog('writer', `✏️ "${ROUNDS[0].writerDraft}"`);
    }, 1500);

    // ── Round 1: Critic ──
    setTimeout(() => {
      setPhase('round1-critiquing');
      addLog('critic', '🔍 초안 분석 중...');
    }, 2800);

    setTimeout(() => {
      addLog('critic', `⚠️ 형용사 ${ROUNDS[0].adjectiveCount}개 검출`);
    }, 3600);

    setTimeout(() => {
      setDisplayScore(ROUNDS[0].criticScore);
      setScoreAnimated(true);
      addLog('critic', `❌ Score: ${ROUNDS[0].criticScore} — "${ROUNDS[0].criticReason}"`);
      addLog('system', `🔁 Score < 0.85 → Writer에게 REVISE 지시`);
    }, 4400);

    // ── Round 2: Writer ──
    setTimeout(() => {
      setPhase('round2-writing');
      setScoreAnimated(false);
      setDisplayScore(0);
      addLog('system', '🔄 Round 2 — Critic 피드백 기반 재작성');
      addLog('writer', '📝 형용사 제거, 팩트 기반 재구성 중...');
    }, 6000);

    setTimeout(() => {
      setCurrentRound(2);
      addLog('writer', `✏️ "${ROUNDS[1].writerDraft}"`);
    }, 7500);

    // ── Round 2: Critic ──
    setTimeout(() => {
      setPhase('round2-critiquing');
      addLog('critic', '🔍 재작성본 분석 중...');
    }, 9000);

    setTimeout(() => {
      addLog('critic', `✅ 형용사 0개. 구체적 수치 4건.`);
    }, 9800);

    setTimeout(() => {
      setDisplayScore(ROUNDS[1].criticScore);
      setScoreAnimated(true);
      addLog('critic', `✅ Score: ${ROUNDS[1].criticScore} — "${ROUNDS[1].criticReason}"`);
    }, 10600);

    setTimeout(() => {
      setPhase('passed');
      addLog('system', '🎯 Score ≥ 0.85 → HITL 승인 요청 준비');
    }, 11800);

    setTimeout(() => {
      setPhase('slack');
      addLog('system', '📨 Slack 채널로 승인 요청 전송 완료');
    }, 13000);
  }, [phase, addLog]);

  const handleSlackApprove = useCallback(() => {
    setSlackApproved(true);
    addLog('system', '✅ 인간 리뷰어 승인 → Supabase INSERT + CDN 퍼지 실행');
  }, [addLog]);

  const handleReset = useCallback(() => {
    setPhase('idle');
    setLogs([]);
    setCurrentRound(0);
    setDisplayScore(0);
    setScoreAnimated(false);
    setSlackApproved(false);
  }, []);

  const activeRound = currentRound > 0 ? ROUNDS[currentRound - 1] : null;

  return (
    <div className="w-full max-w-4xl mx-auto my-8 bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-2xl font-mono text-sm">
      {/* ── Header ── */}
      <div className="flex border-b border-slate-800 bg-slate-950 px-4 py-3 items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-violet-400"><BrainIcon /></span>
          <span className="font-semibold text-slate-200 tracking-wide">Writer-Critic Loop Sim</span>
        </div>
        <div className="flex items-center gap-3">
          {currentRound > 0 && (
            <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold transition-all duration-500 ${
              phase === 'slack' || phase === 'passed'
                ? 'bg-emerald-950/50 border border-emerald-800/50 text-emerald-400'
                : 'bg-amber-950/50 border border-amber-800/50 text-amber-400'
            }`}>
              Round {currentRound}/2
            </div>
          )}
          <div className="text-xs text-slate-500 bg-slate-900 px-2 py-1 rounded">v1.0.0</div>
        </div>
      </div>

      {/* ── Main Content: Two Panels ── */}
      <div className="flex flex-col md:flex-row h-[550px]">
        {/* Left: Agent Chat Log */}
        <div className="w-full md:w-3/5 border-r border-slate-800 flex flex-col">
          <div className="px-4 py-2 border-b border-slate-800/60 bg-slate-900/50">
            <span className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Agent Interaction Log</span>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-2 relative">
            {logs.length === 0 && (
              <div className="flex items-center justify-center h-full text-slate-600 text-xs">
                &quot;Start Agentic Loop&quot; 버튼을 눌러 시뮬레이션을 시작하세요
              </div>
            )}
            {logs.map((log, i) => (
              <div
                key={i}
                className={`flex gap-3 p-2.5 rounded-lg border transition-all duration-300 animate-[fadeIn_0.3s_ease-in] ${
                  log.agent === 'writer'
                    ? 'bg-violet-950/20 border-violet-800/30'
                    : log.agent === 'critic'
                      ? 'bg-cyan-950/20 border-cyan-800/30'
                      : 'bg-slate-800/30 border-slate-700/30'
                }`}
              >
                <div className={`shrink-0 w-6 h-6 rounded flex items-center justify-center text-[10px] font-bold ${
                  log.agent === 'writer'
                    ? 'bg-violet-900/60 text-violet-300'
                    : log.agent === 'critic'
                      ? 'bg-cyan-900/60 text-cyan-300'
                      : 'bg-slate-700/60 text-slate-400'
                }`}>
                  {log.agent === 'writer' ? 'W' : log.agent === 'critic' ? 'C' : 'S'}
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-xs leading-relaxed break-words ${
                    log.agent === 'writer'
                      ? 'text-violet-300/90'
                      : log.agent === 'critic'
                        ? 'text-cyan-300/90'
                        : 'text-slate-400'
                  }`}>
                    {log.text}
                  </p>
                </div>
                <span className="text-[9px] text-slate-600 shrink-0 mt-0.5">{log.timestamp}</span>
              </div>
            ))}
            <div ref={logEndRef} />
          </div>
        </div>

        {/* Right: Score Meter & Status */}
        <div className="w-full md:w-2/5 bg-slate-950 p-6 flex flex-col items-center justify-start gap-6 overflow-y-auto">
          {/* Score Gauge */}
          <ScoreGauge score={displayScore} animate={scoreAnimated} />

          {/* Threshold Line */}
          <div className="w-full flex items-center gap-2">
            <div className="flex-1 h-px bg-slate-800" />
            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">
              Threshold: 0.85
            </span>
            <div className="flex-1 h-px bg-slate-800" />
          </div>

          {/* Stats Grid */}
          {activeRound && (
            <div className="w-full grid grid-cols-2 gap-3">
              <div className="bg-slate-900 rounded-lg border border-slate-800 p-3 text-center">
                <div className={`text-lg font-bold font-mono transition-colors duration-500 ${
                  activeRound.adjectiveCount === 0 ? 'text-emerald-400' : 'text-red-400'
                }`}>
                  {activeRound.adjectiveCount}
                </div>
                <div className="text-[10px] text-slate-500 uppercase tracking-wider mt-0.5">Adjectives</div>
              </div>
              <div className="bg-slate-900 rounded-lg border border-slate-800 p-3 text-center">
                <div className={`text-lg font-bold font-mono transition-colors duration-500 ${
                  activeRound.factDensity >= 0.7 ? 'text-emerald-400' : 'text-amber-400'
                }`}>
                  {(activeRound.factDensity * 100).toFixed(0)}%
                </div>
                <div className="text-[10px] text-slate-500 uppercase tracking-wider mt-0.5">Fact Density</div>
              </div>
            </div>
          )}

          {/* Draft Preview Card */}
          {activeRound && (
            <div className="w-full bg-slate-900 rounded-lg border border-slate-800 p-4">
              <div className="flex items-center gap-1.5 mb-2">
                <span className={`text-[10px] font-bold uppercase tracking-wider ${
                  activeRound.flaggedWords.length > 0 ? 'text-red-400' : 'text-emerald-400'
                }`}>
                  {activeRound.flaggedWords.length > 0 ? '⚠ Flagged Draft' : '✅ Approved Draft'}
                </span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                <HighlightedDraft
                  text={activeRound.writerDraft}
                  flaggedWords={activeRound.flaggedWords}
                />
              </p>
            </div>
          )}

          {/* Slack Approve Button */}
          {phase === 'slack' && !slackApproved && (
            <button
              onClick={handleSlackApprove}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-bold text-sm bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-lg shadow-emerald-900/30 transition-all duration-300 cursor-pointer animate-pulse"
            >
              <SlackIcon />
              Send to Slack → Approve
            </button>
          )}

          {slackApproved && (
            <div className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg border border-emerald-700/30 bg-emerald-950/30 text-emerald-400 text-sm font-bold">
              ✅ Published → Supabase Synced
            </div>
          )}
        </div>
      </div>

      {/* ── Control Bar ── */}
      <div className="border-t border-slate-800 bg-slate-950 px-6 py-4 flex items-center gap-4">
        {phase === 'idle' ? (
          <button
            onClick={runSimulation}
            className="flex-1 flex items-center justify-center gap-3 px-6 py-3.5 rounded-lg font-bold text-sm bg-gradient-to-r from-violet-600 to-cyan-600 hover:from-violet-500 hover:to-cyan-500 text-white shadow-lg shadow-violet-900/30 hover:shadow-violet-800/40 cursor-pointer transition-all duration-300"
          >
            <PlayIcon />
            Start Agentic Loop
          </button>
        ) : (
          <button
            onClick={handleReset}
            className="flex-1 flex items-center justify-center gap-2 px-6 py-3.5 rounded-lg font-bold text-sm bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-all duration-300 cursor-pointer"
          >
            <RefreshIcon />
            Reset Simulation
          </button>
        )}

        {/* Pipeline Status */}
        <div className="hidden md:flex items-center gap-4 text-[10px] text-slate-500">
          <div className="flex items-center gap-1.5">
            <div className={`w-2 h-2 rounded-full transition-colors duration-300 ${
              phase.includes('writing') ? 'bg-violet-400 animate-pulse' : currentRound > 0 ? 'bg-violet-800' : 'bg-slate-700'
            }`} />
            <span>Writer</span>
          </div>
          <span className="text-slate-700">→</span>
          <div className="flex items-center gap-1.5">
            <div className={`w-2 h-2 rounded-full transition-colors duration-300 ${
              phase.includes('critiquing') ? 'bg-cyan-400 animate-pulse' : currentRound > 0 ? 'bg-cyan-800' : 'bg-slate-700'
            }`} />
            <span>Critic</span>
          </div>
          <span className="text-slate-700">→</span>
          <div className="flex items-center gap-1.5">
            <div className={`w-2 h-2 rounded-full transition-colors duration-300 ${
              phase === 'slack' || slackApproved ? 'bg-emerald-400' : 'bg-slate-700'
            } ${phase === 'slack' && !slackApproved ? 'animate-pulse' : ''}`} />
            <span>HITL</span>
          </div>
        </div>
      </div>

      {/* ── CSS Keyframes ── */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(6px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
