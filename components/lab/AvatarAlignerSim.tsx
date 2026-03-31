'use client';
import { useState, useRef, useMemo } from 'react';

export default function AvatarAlignerSim() {
  const [pos, setPos] = useState({ x: -60, y: 100 });
  const [scale, setScale] = useState(0.4);
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const dragStart = useRef({ x: 0, y: 0 });
  const resizeStart = useRef({ scale: 1, pointerY: 0 });

  // 1. Real-time Confidence Score Logic
  const confidence = useMemo(() => {
    const posErr = Math.sqrt(pos.x ** 2 + pos.y ** 2);
    const scaleErr = Math.abs(1 - scale) * 200;
    const totalErr = posErr + scaleErr;
    return Math.max(0, Math.min(100, 100 - totalErr / 2.5));
  }, [pos, scale]);

  const isAligned = confidence > 92;

  const handlePointerDownDrag = (e: React.PointerEvent) => {
    e.stopPropagation(); setIsDragging(true);
    dragStart.current = { x: e.clientX - pos.x, y: e.clientY - pos.y };
    e.currentTarget.setPointerCapture(e.pointerId);
  };
  const handlePointerMoveDrag = (e: React.PointerEvent) => {
    if (!isDragging) return;
    setPos({ x: e.clientX - dragStart.current.x, y: e.clientY - dragStart.current.y });
  };
  const handlePointerUpDrag = (e: React.PointerEvent) => {
    setIsDragging(false); e.currentTarget.releasePointerCapture(e.pointerId);
  };
  const handlePointerDownResize = (e: React.PointerEvent) => {
    e.stopPropagation(); setIsResizing(true);
    resizeStart.current = { scale: scale, pointerY: e.clientY };
    e.currentTarget.setPointerCapture(e.pointerId);
  };
  const handlePointerMoveResize = (e: React.PointerEvent) => {
    if (!isResizing) return;
    const deltaY = resizeStart.current.pointerY - e.clientY;
    setScale(prev => Math.min(Math.max(resizeStart.current.scale + deltaY * 0.003, 0.2), 2.0));
  };
  const handlePointerUpResize = (e: React.PointerEvent) => {
    setIsResizing(false); e.currentTarget.releasePointerCapture(e.pointerId);
  };

  return (
    <div className="w-full bg-slate-950 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl font-sans text-slate-300">
      <div className={`p-3 border-b transition-colors duration-500 flex flex-col sm:flex-row justify-between items-center gap-4 max-w-6xl mx-auto w-full px-9 ${isAligned ? 'bg-green-950/40 border-green-900/50' : 'bg-slate-900/80 border-slate-800'}`}>
        <div>
          <h3 className="text-sm font-bold text-white flex items-center gap-2 uppercase tracking-tight">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={isAligned ? "#4ade80" : "#22d3ee"} strokeWidth="2.5"><path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"/></svg>
            Avatar Aligner UX (Zero-Error VTON)
          </h3>
          <p className="text-[10px] text-slate-500 mt-0.5">Drag photo to position. Use bottom-right handle to scale.</p>
        </div>

        {/* Confidence Progress Bar */}
        <div className="flex items-center gap-3 bg-black/40 px-3 py-1.5 rounded-full border border-slate-800 shrink-0">
          <span className="text-[9px] font-mono font-bold text-slate-500 uppercase">Confidence</span>
          <div className="w-24 h-1.5 bg-slate-800 rounded-full overflow-hidden">
            <div className={`h-full transition-all duration-300 ${isAligned ? 'bg-green-500 shadow-[0_0_8px_#4ade80]' : 'bg-cyan-500'}`} style={{ width: `${confidence}%` }} />
          </div>
          <span className={`text-[12px] font-mono font-bold ${isAligned ? 'text-green-400' : 'text-cyan-400'}`}>{Math.round(confidence)}%</span>
        </div>
      </div>

      <div className="relative w-full h-[500px] md:h-[600px] bg-slate-950 flex items-center justify-center overflow-hidden touch-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-slate-950 opacity-50" />

        {/* 1. The Draggable & Resizable Photo (Underneath) */}
        <div
          className={`absolute cursor-grab active:cursor-grabbing transition-transform ${isDragging || isResizing ? 'duration-0' : 'duration-100 ease-out'}`}
          style={{ transform: `translate(${pos.x}px, ${pos.y}px) scale(${scale})` }}
          onPointerDown={handlePointerDownDrag} onPointerMove={handlePointerMoveDrag} onPointerUp={handlePointerUpDrag}
        >
          <div className="w-64 h-96 bg-slate-800 rounded-xl overflow-hidden border border-slate-700 shadow-2xl relative">
             <div className="absolute inset-0 bg-cover bg-center opacity-90" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400&q=80')" }} />
          </div>

          {/* RESIZE HANDLE - Bottom Right (Pure SVG for Crash Prevention) */}
          <div
            className="absolute bottom-2 right-2 w-8 h-8 bg-cyan-950 border-2 border-cyan-400 rounded-full flex items-center justify-center cursor-se-resize shadow-[0_0_15px_rgba(34,211,238,0.4)] z-50 group hover:scale-110 active:scale-125 transition-transform"
            onPointerDown={handlePointerDownResize} onPointerMove={handlePointerMoveResize} onPointerUp={handlePointerUpResize}
          >
             <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#22d3ee" strokeWidth="2"><path d="M21 15v6h-6"/><path d="M21 21l-9-9"/></svg>
          </div>
        </div>

        {/* 2. Full Body Target Silhouette Guide (On Top, Pointer-Events None) - CONFIDENCE GLOW */}
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
           <div
             className={`w-64 h-96 border-2 border-dashed rounded-3xl transition-all duration-300 flex flex-col items-center justify-start pt-8 px-8`}
             style={{
               borderColor: isAligned ? '#4ade80' : `rgba(34, 211, 238, ${0.2 + confidence/200})`,
               backgroundColor: isAligned ? 'rgba(74, 222, 128, 0.05)' : 'transparent',
               // 점수에 따라 글로우 효과 강도 조절
               boxShadow: `inset 0 0 ${confidence/2}px rgba(34, 211, 238, ${confidence/400}), 0 0 ${isAligned ? '30px' : (confidence/4)+'px'} ${isAligned ? 'rgba(74, 222, 128, 0.4)' : 'rgba(34, 211, 238, 0.2)'}`
             }}
           >
              {/* Whole Body Guideline SVG */}
              <svg viewBox="0 0 100 200" className={`w-full h-auto transition-colors duration-300 ${isAligned ? 'text-green-400' : 'text-cyan-400'}`} style={{ opacity: 0.3 + confidence/150 }}>
                  <path fill="currentColor" opacity="0.1" d="M50 0c-10 0-18 8-18 18s8 18 18 18 18-8 18-18S60 0 50 0zM35 40h30l20 60h-10l-10-40H35L25 100H15L35 40zM35 110l-10 80h15l10-60l10 60h15l-10-80H35z"/>
                  <path fill="none" stroke="currentColor" strokeWidth="1.5" d="M50 0c-10 0-18 8-18 18s8 18 18 18 18-8 18-18S60 0 50 0zM35 40h30l20 60h-10l-10-40H35L25 100H15L35 40zM35 110l-10 80h15l10-60l10 60h15l-10-80H35z" />
              </svg>

              <div className={`mt-auto mb-10 px-3 py-1.5 rounded-full backdrop-blur-md border transition-all duration-500 ${isAligned ? 'bg-green-500 text-slate-950 border-green-400' : 'bg-slate-900/90 border-slate-700 text-slate-400'}`}>
                <span className="text-[9px] font-black tracking-widest uppercase flex items-center gap-1.5">
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
