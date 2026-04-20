'use client';

import React, { useState, useMemo } from 'react';

const initialOutfits = [
  { id: 1, name: "Silk Midi Skirt", type: "skirt", category: "Daytime", color: "Beige", baseScore: 2.0 },
  { id: 2, name: "Oversized Blazer", type: "top", category: "Daytime", color: "Navy", baseScore: 2.0 },
  { id: 3, name: "Linen Wide Pants", type: "pants", category: "Daytime", color: "White", baseScore: 2.0 },
  { id: 4, name: "Velvet Slip Dress", type: "dress", category: "NightOut", color: "Black", baseScore: 2.0 },
  { id: 5, name: "Leather Mini Skirt", type: "skirt", category: "NightOut", color: "Red", baseScore: 2.0 },
];

export default function MiroFishPipelineSim() {
  const [time, setTime] = useState<number>(14);
  const [city, setCity] = useState("Torrance");
  const [vetoSkirts, setVetoSkirts] = useState(false);
  const [jitters, setJitters] = useState<Record<number, number>>({});

  const applyJitter = () => {
    const newJitters: Record<number, number> = {};
    initialOutfits.forEach(o => {
      newJitters[o.id] = Number((Math.random() * 0.000000001).toFixed(11));
    });
    setJitters(newJitters);
  };

  const processedOutfits = useMemo(() => {
    return initialOutfits.map(item => {
      const isNight = time >= 15;
      let score = item.baseScore;
      
      // Category Boost logic
      if (item.category === 'NightOut' && isNight) score += 5.0;
      if (item.category === 'Daytime' && !isNight) score += 5.0;
      
      const isVetoed = vetoSkirts && item.type === 'skirt';
      // Huge penalty for vetoed items so they sink to the bottom
      if (isVetoed) score -= 100.0;
      
      const jitterVal = jitters[item.id] || 0;
      const finalScore = score + jitterVal;

      return {
        ...item,
        score: finalScore,
        jitterVal,
        isVetoed,
        isNight
      };
    }).sort((a, b) => b.score - a.score);
  }, [time, vetoSkirts, jitters]);

  const getTimeLabel = () => {
    if (time >= 5 && time < 12) return "Morning";
    if (time >= 12 && time < 15) return "Afternoon";
    if (time >= 15 && time < 19) return "Evening";
    return "Night";
  };

  return (
    <div className="w-full max-w-4xl mx-auto my-8 bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-2xl font-mono text-sm">
      <div className="flex border-b border-slate-800 bg-slate-950 px-4 py-3 items-center justify-between">
        <div className="flex items-center gap-2">
          <svg className="w-5 h-5 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>
          <span className="font-semibold text-slate-200 tracking-wide">Last-Mile Pipeline Sim</span>
        </div>
        <div className="text-xs text-slate-500 bg-slate-900 px-2 py-1 rounded">v3.2.0-rc</div>
      </div>

      <div className="flex flex-col md:flex-row h-full">
        {/* Left Panel: Controls */}
        <div className="w-full md:w-1/3 bg-slate-900 p-6 border-r border-slate-800 flex flex-col gap-6">
          <div>
            <label className="flex items-center justify-between text-slate-400 text-xs uppercase tracking-wider mb-2">
              <span>Time Simulator</span>
              <span className="text-indigo-400 font-bold">{time}:00</span>
            </label>
            <input 
              type="range" 
              min="0" 
              max="24" 
              value={time} 
              onChange={(e) => setTime(Number(e.target.value))}
              className="w-full accent-indigo-500 bg-slate-800 h-2 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500 mt-1">
              <span>0:00</span>
              <span className={time >= 15 ? "text-indigo-400 font-bold" : ""}>15:00 (Flip)</span>
              <span>24:00</span>
            </div>
          </div>

          <div>
            <label className="block text-slate-400 text-xs uppercase tracking-wider mb-2">
              Hyper-Local City
            </label>
            <input 
              type="text" 
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-slate-300 focus:outline-none focus:border-indigo-500 transition-colors"
            />
          </div>

          <div>
            <label className="block text-slate-400 text-xs uppercase tracking-wider mb-2">
              JSONB Veto Filter
            </label>
            <button 
              onClick={() => setVetoSkirts(!vetoSkirts)}
              className={`w-full flex items-center justify-between p-3 rounded border transition-colors ${vetoSkirts ? 'bg-red-950/30 border-red-900/50 text-red-400' : 'bg-slate-950 border-slate-700 text-slate-400 hover:border-slate-500'}`}
            >
              <span>Veto Categories: [Skirts]</span>
              <div className={`w-4 h-4 rounded-full border ${vetoSkirts ? 'bg-red-500 border-red-500' : 'border-slate-600'}`}></div>
            </button>
          </div>

          <div className="mt-auto pt-6 border-t border-slate-800">
            <button 
              onClick={applyJitter}
              className="w-full bg-indigo-600 hover:bg-indigo-500 text-white p-3 rounded font-semibold transition-colors flex items-center justify-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>
              Apply 1e-9 Jitter
            </button>
            <p className="text-[10px] text-slate-500 mt-2 text-center leading-tight">Breaks sorting ties cleanly without database roundtrips.</p>
          </div>
        </div>

        {/* Right Panel: Rendered Pool */}
        <div className="w-full md:w-2/3 bg-slate-950 p-6 flex flex-col">
          <div className="mb-6 border-b border-slate-800 pb-4">
            <h3 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-cyan-400">
              A breezy minimalist look for your <span className="text-white">{getTimeLabel()}</span> in <span className="text-white">{city}</span>
            </h3>
            <p className="text-slate-500 mt-1 text-xs">Live Re-Ranking Pool (0 LLM Calls)</p>
          </div>

          <div className="flex-1 space-y-3 overflow-y-auto pr-2">
            {processedOutfits.map((item, index) => (
              <div 
                key={item.id} 
                className={`relative flex items-center justify-between p-4 rounded-lg border transition-all duration-500 ease-in-out ${item.isVetoed ? 'bg-slate-900/50 border-red-900/30 opacity-50 gray-out' : item.category === 'NightOut' && time >= 15 ? 'bg-indigo-950/20 border-indigo-500/30 shadow-[0_0_15px_rgba(99,102,241,0.1)]' : 'bg-slate-900 border-slate-800 hover:border-slate-600'}`}
                style={{
                  transform: `translateY(0px)`,
                }}
              >
                <div className="flex items-center gap-4">
                  <div className="flex flex-col items-center justify-center w-8 h-8 rounded bg-slate-950 border border-slate-800 text-slate-400 font-bold shrink-0">
                    {index + 1}
                  </div>
                  <div>
                    <h4 className={`font-semibold ${item.isVetoed ? 'text-slate-500 line-through' : 'text-slate-200'}`}>
                      {item.color} {item.name}
                    </h4>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`text-[10px] px-2 py-0.5 rounded-full ${item.category === 'NightOut' ? 'bg-purple-900/50 text-purple-300' : 'bg-amber-900/50 text-amber-300'}`}>
                        {item.category}
                      </span>
                      <span className="text-[10px] text-slate-500 capitalize">{item.type}</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col items-end">
                  {item.isVetoed && (
                    <span className="absolute top-1/2 -translate-y-1/2 right-4 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded rotate-12 z-10 shadow-lg">
                      VETO
                    </span>
                  )}
                  <div className="text-right">
                    <span className="text-xs text-slate-400">Score</span>
                    <div className="font-mono text-indigo-400 font-bold">
                      {item.score > -50 ? item.score.toFixed(1) : '-∞'}
                    </div>
                  </div>
                  {item.jitterVal > 0 && !item.isVetoed && (
                    <div className="text-[9px] text-cyan-500 bg-cyan-950/50 px-1 rounded mt-1">
                      +{item.jitterVal.toExponential(2)}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
