'use client';
import { useState, useRef, useMemo } from 'react';

export default function AvatarAlignerSim() {
  // Start intentionally misaligned
  const [pos, setPos] = useState({ x: -60, y: 100 });
  const [scale, setScale] = useState(0.4); // Start smaller for full body
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const dragStart = useRef({ x: 0, y: 0 });
  const resizeStart = useRef({ scale: 1, pointerY: 0 });

  // 1. 관절 추론 점수 (Confidence Score) 계산 로직
  // 위치 오차와 스케일 오차를 종합하여 0~100점으로 변환
  const confidence = useMemo(() => {
    const posErr = Math.sqrt(pos.x ** 2 + pos.y ** 2);
    const scaleErr = Math.abs(1 - scale) * 200;
    const totalErr = posErr + scaleErr;
    return Math.max(0, Math.min(100, 100 - totalErr / 2.5));
  }, [pos, scale]);

  // Tight Whole-Body Alignment Logic
  // Checks if position (x,y) AND scale are all within a perfect range
  const isAligned = confidence > 92; // 92점 이상일 때 '일치'로 판정

  // Handler for Dragging the Image (Position)
  const handlePointerDownDrag = (e: React.PointerEvent) => {
    e.stopPropagation();
    setIsDragging(true);
    dragStart.current = { x: e.clientX - pos.x, y: e.clientY - pos.y };
    e.currentTarget.setPointerCapture(e.pointerId);
  };
  const handlePointerMoveDrag = (e: React.PointerEvent) => {
    if (!isDragging) return;
    setPos({
      x: e.clientX - dragStart.current.x,
      y: e.clientY - dragStart.current.y,
    });
  };

  const handlePointerUpDrag = (e: React.PointerEvent) => {
    setIsDragging(false);
    e.currentTarget.releasePointerCapture(e.pointerId);
  };

  // Handler for Dragging the Corner Handle (Scale)
  const handlePointerDownResize = (e: React.PointerEvent) => {
    e.stopPropagation(); // Don't trigger drag when clicking resize handle
    setIsResizing(true);
    resizeStart.current = { scale: scale, pointerY: e.clientY };
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const handlePointerMoveResize = (e: React.PointerEvent) => {
    if (!isResizing) return;
    const deltaY = resizeStart.current.pointerY - e.clientY;
    // Map vertical movement to scale change
    setScale(prev => Math.min(Math.max(resizeStart.current.scale + deltaY * 0.003, 0.2), 2.0));
  };

  const handlePointerUpResize = (e: React.PointerEvent) => {
    setIsResizing(false);
    e.currentTarget.releasePointerCapture(e.pointerId);
  };

  return (
    <div className="w-full bg-slate-950 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl my-12 font-sans text-slate-300">
      {/* Header Dashboard */}
      <div className={`p-4 border-b transition-colors duration-500 flex flex-col sm:flex-row justify-between items-center gap-4 ${isAligned ? 'bg-green-950/40 border-green-900/50' : 'bg-slate-900/80 border-slate-800'}`}>
        <div>
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={isAligned ? "#4ade80" : "#22d3ee"} strokeWidth="2"><path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"/></svg>
            Avatar Aligner UX (Zero-Error VTON)
          </h3>
          <p className="text-xs text-slate-400 mt-1">Drag photo to position. <br/>Use bottom-right handle to scale.</p>
        </div>

        <div className={`px-4 py-2 rounded-lg border flex items-center gap-3 transition-all duration-500 ${isAligned ? 'bg-green-900/20 border-green-500/30' : 'bg-red-900/20 border-red-500/30'}`}>
           {isAligned ? (
             <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#4ade80" strokeWidth="2"><path d="M20 6L9 17l-5-5"/></svg>
           ) : (
             <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#f87171" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
           )}
           <div>
             <p className={`text-[10px] font-mono font-bold uppercase tracking-widest ${isAligned ? 'text-green-400' : 'text-red-400'}`}>
               {isAligned ? 'API Status: PERFECT OUT' : 'API Status: GARBAGE IN'}
             </p>
             <p className="text-[10px] text-slate-400 font-mono">
               {isAligned ? 'Error: 0% | GCP Cost Saved' : 'Error: 100% | VTON Will Fail'}
             </p>
           </div>
        </div>
      </div>

      {/* Interactive Sandbox (Now Wheel-Event Free) */}
      <div className="relative w-full h-[500px] md:h-[600px] bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-slate-800 to-slate-950 flex items-center justify-center overflow-hidden touch-none">

        {/* 1. The Draggable & Resizable Photo (Underneath) */}
        <div
          className={`absolute cursor-grab active:cursor-grabbing transition-transform ${isDragging || isResizing ? 'duration-0' : 'duration-100 ease-out'}`}
          style={{ transform: `translate(${pos.x}px, ${pos.y}px) scale(${scale})` }}
          onPointerDown={handlePointerDownDrag}
          onPointerMove={handlePointerMoveDrag}
          onPointerUp={handlePointerUpDrag}
          onPointerCancel={handlePointerUpDrag}
        >
          <div className="w-64 h-96 bg-slate-700 rounded-xl overflow-hidden border-2 border-slate-600 shadow-2xl relative">
             <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400&q=80')" }} />
             <div className="absolute inset-0 bg-slate-900/20 mix-blend-multiply" />
          </div>

          {/* RESIZE HANDLE - Bottom Right */}
          <div
            className="absolute bottom-2 right-2 w-8 h-8 bg-cyan-950 border-2 border-cyan-400 rounded-full flex items-center justify-center cursor-se-resize shadow-[0_0_15px_rgba(34,211,238,0.4)] z-50 group hover:scale-110 active:scale-125 transition-transform"
            onPointerDown={handlePointerDownResize}
            onPointerMove={handlePointerMoveResize}
            onPointerUp={handlePointerUpResize}
            onPointerCancel={handlePointerUpResize}
          >
             <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#22d3ee" strokeWidth="2"><path d="M21 15v6h-6"/><path d="M21 21l-9-9"/></svg>
          </div>
        </div>

        {/* 2. Full Body Target Silhouette Guide (On Top, Pointer-Events None) */}
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
           <div className={`w-64 h-96 border-2 border-dashed rounded-3xl transition-all duration-500 flex flex-col items-center justify-start pt-8 px-8 shadow-[inset_0_0_50px_rgba(0,0,0,0.5)] ${isAligned ? 'border-green-400 bg-green-500/10 shadow-[0_0_30px_rgba(74,222,128,0.2)]' : 'border-cyan-500/50 bg-cyan-900/10'}`}>
              {/* Whole Body Guideline SVG */}
              <svg viewBox="0 0 100 200" className={`w-full h-auto transition-colors duration-500 ${isAligned ? 'text-green-400' : 'text-cyan-400/50'}`}>
                  <path fill="currentColor" opacity="0.1" d="M50 0c-10 0-18 8-18 18s8 18 18 18 18-8 18-18S60 0 50 0zM35 40h30l20 60h-10l-10-40H35L25 100H15L35 40zM35 110l-10 80h15l10-60l10 60h15l-10-80H35z"/>
                  <path fill="none" stroke="currentColor" strokeWidth="1" d="M50 0c-10 0-18 8-18 18s8 18 18 18 18-8 18-18S60 0 50 0zM35 40h30l20 60h-10l-10-40H35L25 100H15L35 40zM35 110l-10 80h15l10-60l10 60h15l-10-80H35z" />
              </svg>

              <div className={`mt-auto mb-10 px-4 py-2 rounded-full backdrop-blur-md border ${isAligned ? 'bg-green-950/80 border-green-500 text-green-400' : 'bg-slate-900/80 border-cyan-800 text-cyan-400'}`}>
                <span className="text-xs font-bold tracking-widest uppercase flex items-center gap-2">
                  {isAligned ? (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 6L9 17l-5-5"/></svg>
                  ) : (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v6h-6"/><path d="M21 21l-9-9"/></svg>
                  )}
                  {isAligned ? 'Match Confirmed' : 'Drag handle to resize'}
                </span>
              </div>
           </div>
        </div>

      </div>
    </div>
  );
}
