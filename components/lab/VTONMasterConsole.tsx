'use client';

import { useState, useEffect, useRef } from 'react';
import { Activity, Webhook, BoxSelect, CheckCircle2, RefreshCw, Layers } from 'lucide-react';

export default function VTONMasterConsole() {
  const [mode, setMode] = useState<'warp' | 'race' | 'layer' | 'dna'>('warp');

  return (
    <div className="w-full bg-slate-950 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl my-12 font-sans text-slate-300">
       <div className="flex border-b border-slate-800 bg-slate-900/80 overflow-x-auto hide-scrollbar sm:justify-start">
          <button onClick={() => setMode('warp')} className={`px-5 py-4 font-bold text-xs md:text-sm tracking-wide border-b-2 flex items-center gap-2 transition-colors whitespace-nowrap ${mode === 'warp' ? 'border-purple-400 text-purple-400 bg-slate-900' : 'border-transparent hover:text-white'}`}>
            <BoxSelect className="w-4 h-4"/> 1. Warp & Match
          </button>
          <button onClick={() => setMode('race')} className={`px-5 py-4 font-bold text-xs md:text-sm tracking-wide border-b-2 flex items-center gap-2 transition-colors whitespace-nowrap ${mode === 'race' ? 'border-cyan-400 text-cyan-400 bg-slate-900' : 'border-transparent hover:text-white'}`}>
            <Activity className="w-4 h-4"/> 2. GPU vs CPU Timer
          </button>
          <button onClick={() => setMode('layer')} className={`px-5 py-4 font-bold text-xs md:text-sm tracking-wide border-b-2 flex items-center gap-2 transition-colors whitespace-nowrap ${mode === 'layer' ? 'border-green-400 text-green-400 bg-slate-900' : 'border-transparent hover:text-white'}`}>
            <Layers className="w-4 h-4"/> 3. Layering Sim
          </button>
          <button onClick={() => setMode('dna')} className={`px-5 py-4 font-bold text-xs md:text-sm tracking-wide border-b-2 flex items-center gap-2 transition-colors whitespace-nowrap ${mode === 'dna' ? 'border-amber-400 text-amber-400 bg-slate-900' : 'border-transparent hover:text-white'}`}>
            <Webhook className="w-4 h-4"/> 4. Style DNA Mixer
          </button>
       </div>

       <div className="p-6 md:p-10 min-h-[460px] flex items-center justify-center relative overflow-hidden bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-slate-950 w-full">
          {mode === 'warp' && <WarpMode />}
          {mode === 'race' && <RaceMode />}
          {mode === 'layer' && <LayeringMode />}
          {mode === 'dna' && <RadarMode />}
       </div>
    </div>
  )
}

function WarpMode() {
  const [nodes, setNodes] = useState({ left: { x: -40, y: -40 }, right: { x: 40, y: 40 } });
  const [activeNode, setActiveNode] = useState<'left' | 'right' | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Derive math bindings
  const skewX = (nodes.right.x + nodes.left.x) / 3;
  const skewY = (nodes.right.y - nodes.left.y) / 4;
  const scale = 1 + ((nodes.right.y + nodes.left.y) / 400);

  useEffect(() => {
    const handleMove = (e: PointerEvent) => {
      if (!activeNode || !containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const relativeX = e.clientX - rect.left - rect.width / 2;
      const relativeY = e.clientY - rect.top - rect.height / 2;
      
      setNodes(prev => ({
        ...prev,
        [activeNode]: { x: Math.max(-100, Math.min(100, relativeX)), y: Math.max(-100, Math.min(100, relativeY)) }
      }));
    };
    
    const handleUp = () => setActiveNode(null);

    if (activeNode) {
      window.addEventListener('pointermove', handleMove);
      window.addEventListener('pointerup', handleUp);
    }
    return () => {
      window.removeEventListener('pointermove', handleMove);
      window.removeEventListener('pointerup', handleUp);
    };
  }, [activeNode]);

  return (
    <div className="flex flex-col md:flex-row gap-8 md:gap-14 items-center w-full max-w-4xl animate-in fade-in zoom-in-95 duration-500">
      <div className="flex-1 space-y-6 w-full text-center md:text-left">
         <div>
           <h3 className="text-xl md:text-2xl font-bold text-white mb-2 flex items-center justify-center md:justify-start gap-2"><BoxSelect className="w-6 h-6 text-purple-400" /> Real-time Homography</h3>
           <p className="text-sm text-slate-400 pb-4 border-b border-slate-800 leading-relaxed text-left">
             A mathematical bounding box simulation of our CV tracking layer ($p' = H \cdot p$). <strong>Drag the glowing shoulder and hip nodes</strong> on the silhouette to warp the output garment array in real-time.
           </p>
         </div>
         
         <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl flex flex-col gap-3">
             <div className="flex justify-between items-center text-xs font-mono font-bold text-slate-400 border-b border-slate-800 pb-2">
                 <span>Left Vector Node</span>
                 <span className="text-purple-400">[{Math.round(nodes.left.x)}, {Math.round(nodes.left.y)}]</span>
             </div>
             <div className="flex justify-between items-center text-xs font-mono font-bold text-slate-400 border-b border-slate-800 pb-2">
                 <span>Right Vector Node</span>
                 <span className="text-purple-400">[{Math.round(nodes.right.x)}, {Math.round(nodes.right.y)}]</span>
             </div>
             <div className="flex justify-between items-center text-xs font-mono font-bold text-slate-400">
                 <span>Matrix Scalar (Z)</span>
                 <span className="text-emerald-400">{(scale).toFixed(2)}x</span>
             </div>
         </div>
      </div>

      <div 
         ref={containerRef}
         className="relative w-64 h-64 md:w-80 md:h-80 shrink-0 border border-dashed border-slate-700 bg-slate-950 rounded-3xl flex items-center justify-center overflow-hidden shadow-inner touch-none"
      >
        <div className="absolute inset-0 grid grid-cols-6 grid-rows-6 opacity-20 pointer-events-none">
          {Array.from({length: 36}).map((_, i) => <div key={i} className="border border-purple-800/40" />)}
        </div>
        
        {/* Render Silhouette Target */}
        <div className="w-32 h-48 border-2 border-slate-700 rounded-xl absolute pointer-events-none flex flex-col items-center justify-center">
             <span className="text-[10px] text-slate-600 font-bold uppercase tracking-widest bg-slate-950 px-2 py-1">Customer Body</span>
        </div>
        
        {/* Render Garment Wrapper */}
        <div 
           className="w-32 h-40 bg-purple-500/20 border border-purple-400/80 backdrop-blur-sm rounded-lg flex items-center justify-center shadow-[0_0_30px_rgba(168,85,247,0.2)] will-change-transform z-10 pointer-events-none"
           style={{ transform: `translateX(${skewX}px) translateY(${skewY}px) skewX(${skewX * -0.2}deg) skewY(${skewY * 0.2}deg) scale(${scale})` }}
        >
           <span className="text-[9px] font-mono text-white bg-purple-900 px-2 rounded-full border border-purple-500">Outer Canvas</span>
        </div>

        {/* Draggable Anchor Left */}
        <div 
          className="w-6 h-6 bg-purple-400 rounded-full absolute -ml-3 -mt-3 shadow-[0_0_20px_#a855f7] cursor-grab active:cursor-grabbing active:scale-125 transition-transform z-30 ring-4 ring-purple-400/30"
          style={{ left: `calc(50% + ${nodes.left.x}px)`, top: `calc(50% + ${nodes.left.y}px)` }}
          onPointerDown={() => setActiveNode('left')}
        />

        {/* Draggable Anchor Right */}
        <div 
          className="w-6 h-6 bg-purple-400 rounded-full absolute -ml-3 -mt-3 shadow-[0_0_20px_#a855f7] cursor-grab active:cursor-grabbing active:scale-125 transition-transform z-30 ring-4 ring-purple-400/30"
          style={{ left: `calc(50% + ${nodes.right.x}px)`, top: `calc(50% + ${nodes.right.y}px)` }}
          onPointerDown={() => setActiveNode('right')}
        />
      </div>
    </div>
  )
}

function RaceMode() {
  const [running, setRunning] = useState(false);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    let t: NodeJS.Timeout;
    if (running) {
      t = setInterval(() => {
        setTick((prev) => {
          if (prev >= 60) {
            clearInterval(t);
            setRunning(false);
            return 60;
          }
          return prev + 1;
        });
      }, 50); // Speed modifier
    }
    return () => clearInterval(t);
  }, [running]);

  const pLegacy = Math.min((tick / 60) * 100, 100);
  const pSwl = Math.min((tick / 20) * 100, 100);

  return (
    <div className="w-full max-w-3xl animate-in fade-in zoom-in-95 duration-500">
      <div className="flex justify-between items-end mb-8 md:mb-12 border-b border-slate-800 pb-6 w-full">
        <div>
          <h3 className="text-xl md:text-2xl font-bold text-white mb-2 flex items-center gap-2"><Activity className="w-6 h-6 text-cyan-400" /> Legacy Sequential vs. One-Shot</h3>
          <p className="text-sm text-slate-400">Comparing Latency loops for 3 distinct multi-pass layers.</p>
        </div>
        <button onClick={() => { setRunning(true); setTick(0); }} className="px-5 py-2.5 bg-cyan-950/30 text-cyan-400 border border-cyan-800 font-bold rounded-full flex items-center gap-2 hover:bg-cyan-900/50 transition-all shrink-0">
          <RefreshCw className={`w-4 h-4 ${running ? 'animate-spin' : ''}`} /> Run Test
        </button>
      </div>

      <div className="space-y-10 w-full">
        <div>
          <div className="flex justify-between text-base mb-3"><span className="font-bold text-red-400">Sequential Processing (60s)</span><span className="font-mono text-slate-100">{Math.min(tick, 60)}s</span></div>
          <div className="h-5 w-full bg-slate-900 rounded-full border border-slate-800 overflow-hidden relative">
             <div className="absolute top-0 left-0 h-full bg-red-500/60 transition-all duration-75" style={{ width: `${pLegacy}%` }} />
          </div>
          <div className="flex justify-between mt-3 text-[10px] md:text-xs font-mono uppercase tracking-widest text-red-300 opacity-70">
            <span>Outerwear Engine</span><span>Bottom Engine</span><span>Final Composite Frame</span>
          </div>
        </div>

        <div>
           <div className="flex justify-between text-base mb-3"><span className="font-bold text-cyan-400">SmartWorkLab One-Shot (20s)</span><span className="font-mono text-cyan-300 font-bold">{Math.min(tick, 20)}s</span></div>
           <div className="h-5 w-full bg-slate-900 rounded-full border border-slate-800 overflow-hidden relative shadow-inner">
             <div className="absolute top-0 left-0 h-full bg-cyan-400 shadow-[0_0_15px_cyan] transition-all duration-75 flex items-center justify-end px-2" style={{ width: `${pSwl}%` }}>
               {tick >= 20 && <CheckCircle2 className="w-4 h-4 text-cyan-950" />}
             </div>
           </div>
           <div className="flex justify-between mt-3 text-[10px] md:text-xs font-mono uppercase tracking-widest text-cyan-400">
             <span>Warp CV Pack</span><span>Unified GenAI Compute Node</span>
           </div>
        </div>
      </div>
    </div>
  )
}

function LayeringMode() {
  const [tucked, setTucked] = useState(false);

  return (
    <div className="flex flex-col md:flex-row gap-10 items-center w-full max-w-3xl animate-in fade-in zoom-in-95 duration-500">
      <div className="flex-1 space-y-6 w-full text-center md:text-left">
        <div>
           <h3 className="text-xl md:text-2xl font-bold text-white mb-2 flex items-center justify-center md:justify-start gap-2"><Layers className="w-6 h-6 text-green-400" /> Z-Index Alpha Layer Swaping</h3>
           <p className="text-sm text-slate-400 pb-6 border-b border-slate-800 leading-relaxed text-justify">
             "Tucking in" a shirt requires the AI to comprehend depth. Toggling this style executes an instant depth array matrix swap on CPU natively, entirely eliminating GenAI overhead.
           </p>
         </div>

         <div className="bg-slate-900/80 p-6 rounded-2xl border border-slate-800">
             <div className="flex items-center justify-between">
                <div className="text-left">
                   <h4 className="font-bold text-white uppercase tracking-wider text-sm mb-1">Layer Ordering</h4>
                   <p className="text-xs text-slate-500">Depth Matrix Z-Index</p>
                </div>
                <button 
                  onClick={() => setTucked(!tucked)} 
                  className={`px-6 py-3 rounded-full font-bold text-xs uppercase tracking-widest transition-all ${tucked ? 'bg-green-500 text-slate-950 shadow-[0_0_20px_rgba(34,197,94,0.4)]' : 'bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-600'}`}
                >
                  {tucked ? 'Shirt Tucked In' : 'Shirt Untucked'}
                </button>
             </div>
         </div>
      </div>

      <div className="relative w-48 h-64 md:w-64 md:h-80 shrink-0 mx-auto">
         <div className={`absolute top-0 left-0 right-0 h-40 md:h-48 bg-cyan-500/80 backdrop-blur-md rounded-2xl border-2 border-cyan-300 flex flex-col items-center justify-center shadow-2xl transition-all duration-700 ease-in-out ${tucked ? 'z-10 translate-y-8 scale-95 opacity-80' : 'z-30'}`}>
            <span className="font-mono text-cyan-950 font-bold tracking-widest">TOP WEAR</span>
            <span className="text-[10px] text-cyan-900 font-bold mt-2 border border-cyan-800/50 px-2 py-0.5 rounded-full">Z-Index: {tucked ? '10' : '30'}</span>
         </div>
         
         <div className={`absolute bottom-0 left-4 right-4 h-36 md:h-44 bg-purple-600/90 backdrop-blur-md rounded-2xl border-2 border-purple-300 flex flex-col items-center justify-center shadow-2xl transition-all duration-700 ease-in-out ${tucked ? 'z-20 scale-100' : 'z-10 scale-95 opacity-80'}`}>
            <span className="font-mono text-purple-100 font-bold tracking-widest">BOTTOM WEAR</span>
            <span className="text-[10px] text-purple-200 font-bold mt-2 border border-purple-400/50 px-2 py-0.5 rounded-full bg-purple-900/50">Z-Index: {tucked ? '20' : '10'}</span>
         </div>
      </div>
    </div>
  )
}

function RadarMode() {
  const [f, setF] = useState(85);
  const [s, setS] = useState(20);
  const [m, setM] = useState(70);
  const size = 260;
  const center = size / 2;

  const pf = { x: center, y: center - (f / 100) * (size/2) };
  const ps = { x: center + (s / 100) * (size/2) * 0.866, y: center + (s / 100) * (size/2) * 0.5 };
  const pm = { x: center - (m / 100) * (size/2) * 0.866, y: center + (m / 100) * (size/2) * 0.5 };

  return (
    <div className="flex flex-col md:flex-row gap-8 md:gap-16 items-center w-full max-w-4xl animate-in fade-in zoom-in-95 duration-500">
       <div className="flex-1 space-y-6 w-full">
         <div>
           <h3 className="text-xl md:text-2xl font-bold text-white mb-2 flex items-center gap-2"><Webhook className="w-6 h-6 text-amber-500" /> Latent Vector Style Mixer</h3>
           <p className="text-sm text-slate-400 pb-6 border-b border-slate-800 leading-relaxed text-left">
             Map user's semantic aesthetic preferences onto generative AI weight arrays driving output parameters.
           </p>
         </div>

         <div className="space-y-4">
           <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-800">
             <label className="text-xs font-bold text-amber-500 flex justify-between uppercase tracking-widest mb-3"><span>Formal Structure Vector</span><span className="font-mono bg-amber-950/50 px-2 rounded">{f} / 100</span></label>
             <input type="range" min="0" max="100" value={f} onChange={e => setF(Number(e.target.value))} className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none accent-amber-500" />
           </div>
           <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-800">
             <label className="text-xs font-bold text-rose-500 flex justify-between uppercase tracking-widest mb-3"><span>Casual / Streetwear Matrix</span><span className="font-mono bg-rose-950/50 px-2 rounded">{s} / 100</span></label>
             <input type="range" min="0" max="100" value={s} onChange={e => setS(Number(e.target.value))} className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none accent-rose-500" />
           </div>
           <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-800">
             <label className="text-xs font-bold text-blue-500 flex justify-between uppercase tracking-widest mb-3"><span>Minimalism Coefficient</span><span className="font-mono bg-blue-950/50 px-2 rounded">{m} / 100</span></label>
             <input type="range" min="0" max="100" value={m} onChange={e => setM(Number(e.target.value))} className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none accent-blue-500" />
           </div>
         </div>
       </div>

       <div className="w-72 h-72 relative bg-slate-950 rounded-full border border-slate-800 flex items-center justify-center shrink-0 shadow-[0_0_30px_rgba(0,0,0,0.5)] mt-4 md:mt-0">
          <div className="absolute inset-0 bg-radial-gradient from-slate-900 to-transparent opacity-50 rounded-full pointer-events-none" />
          
          <svg width={size} height={size} className="absolute inset-0 mx-auto rotate-180 drop-shadow-xl">
            <polygon points={`${center},0 ${size},${size*0.75} 0,${size*0.75}`} fill="transparent" stroke="#334155" strokeWidth="1" strokeDasharray="4 4" />
            <polygon points={`${center},${center - (50/100)*(size/2)} ${center + (50/100)*(size/2)*0.866},${center + (50/100)*(size/2)*0.5} ${center - (50/100)*(size/2)*0.866},${center + (50/100)*(size/2)*0.5}`} fill="transparent" stroke="#1e293b" strokeWidth="1" />
            
            <polygon 
              points={`${pf.x},${size - pf.y} ${pm.x},${size - pm.y} ${ps.x},${size - ps.y}`} 
              fill="rgba(245, 158, 11, 0.3)" 
              stroke="#f59e0b" 
              strokeWidth="2.5" 
              className="transition-all duration-75 ease-out drop-shadow-[0_0_20px_rgba(245,158,11,0.6)]"
            />
          </svg>
          
          <span className="absolute -top-3 bg-slate-900 px-3 py-1 border border-amber-500/30 rounded-full text-[10px] text-amber-500 font-bold uppercase tracking-widest shadow-[0_0_10px_rgba(245,158,11,0.2)]">Formal Vector</span>
          <span className="absolute -bottom-1 -right-4 bg-slate-900 px-3 py-1 border border-rose-500/30 rounded-full text-[10px] text-rose-500 font-bold uppercase tracking-widest shadow-[0_0_10px_rgba(244,63,94,0.2)]">Casual Array</span>
          <span className="absolute -bottom-1 -left-4 bg-slate-900 px-3 py-1 border border-blue-500/30 rounded-full text-[10px] text-blue-500 font-bold uppercase tracking-widest shadow-[0_0_10px_rgba(59,130,246,0.2)]">Minimal</span>
       </div>
    </div>
  )
}
