'use client';
import { useState, useRef } from 'react';

const styleDatabases = [
  {
    name: 'Street Hipster',
    desc: 'Oversized silhouettes meets urban utility.',
    tags: ['#Oversized', '#Techwear', '#Sneakerhead'],
    images: [
      'https://images.unsplash.com/photo-1550614000-4b95d4662231?w=150&q=80',
      'https://images.unsplash.com/photo-1523398002811-999aa8d9512e?w=150&q=80',
      'https://images.unsplash.com/photo-1514316454349-750a7fd3da3a?w=150&q=80'
    ]
  },
  {
    name: 'Minimalist Chic',
    desc: 'Clean lines, monochrome tones, and tailored fit.',
    tags: ['#Monochrome', '#Tailored', '#Clean'],
    images: [
      'https://images.unsplash.com/photo-1434389678369-182523632426?w=150&q=80',
      'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=150&q=80',
      'https://images.unsplash.com/photo-1507680434267-be372eb8b1de?w=150&q=80'
    ]
  },
  {
    name: 'Gorpcore Utility',
    desc: 'Outdoor aesthetics blended with everyday function.',
    tags: ['#Outdoor', '#Functional', '#Layering'],
    images: [
      'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=150&q=80',
      'https://images.unsplash.com/photo-1521223830114-41ed449e29a3?w=150&q=80',
      'https://images.unsplash.com/photo-1542272604-787c3835535d?w=150&q=80'
    ]
  }
];

export default function StyleDnaAnalyzer() {
  const [status, setStatus] = useState<'idle' | 'scanning' | 'complete'>('idle');
  const [scanProgress, setScanProgress] = useState(0);
  const [resultDna, setResultDna] = useState(styleDatabases[0]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleTriggerUpload = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const randomIndex = Math.floor(Math.random() * styleDatabases.length);
      setResultDna(styleDatabases[randomIndex]);
      
      setStatus('scanning');
      setScanProgress(0);
      
      const interval = setInterval(() => {
        setScanProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            setTimeout(() => setStatus('complete'), 500);
            return 100;
          }
          return prev + 4;
        });
      }, 40);
    }
  };

  return (
    <div className="w-full bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 shadow-2xl my-12 font-sans relative overflow-hidden">
      <input 
        type="file" 
        accept="image/*" 
        className="hidden" 
        ref={fileInputRef} 
        onChange={handleFileChange} 
      />

      <div className="flex flex-col items-center justify-center min-h-[380px] z-10 relative">
        {status === 'idle' && (
          <div className="text-center animate-in fade-in duration-300">
            <h3 className="text-2xl font-bold text-white mb-4">Find Your Style DNA 🧬</h3>
            <p className="text-slate-400 text-sm mb-8 max-w-sm mx-auto leading-relaxed">
              Select a photo and let our CV engine analyze your aesthetic matrix to find your perfect fit.
            </p>
            <button 
              onClick={handleTriggerUpload} 
              className="px-8 py-3.5 bg-cyan-500 text-slate-950 font-black tracking-widest uppercase text-sm rounded-full hover:bg-cyan-400 transition-colors shadow-[0_0_20px_rgba(6,182,212,0.4)]"
            >
              Select Photo & Analyze
            </button>
          </div>
        )}

        {status === 'scanning' && (
          <div className="w-full max-w-sm text-center animate-in fade-in duration-300">
            <div className="w-20 h-20 mx-auto border-4 border-slate-800 border-t-cyan-400 rounded-full animate-spin mb-6" />
            <p className="text-cyan-400 font-mono text-sm mb-3 uppercase tracking-widest">
              Extracting Body Matrix... {scanProgress}%
            </p>
            <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden shadow-inner">
              <div className="h-full bg-cyan-500 transition-all duration-75 shadow-[0_0_10px_#06b6d4]" style={{ width: `${scanProgress}%` }} />
            </div>
            <div className="flex justify-between mt-4 text-[10px] font-mono text-slate-500 uppercase tracking-widest px-2">
              <span className={scanProgress > 30 ? "text-cyan-400" : ""}>Pose</span>
              <span className={scanProgress > 60 ? "text-cyan-400" : ""}>Semantic</span>
              <span className={scanProgress > 90 ? "text-cyan-400" : ""}>Match</span>
            </div>
          </div>
        )}

        {status === 'complete' && (
          <div className="text-center animate-in slide-in-from-bottom-8 duration-500 w-full max-w-md">
            <p className="text-slate-400 text-[10px] font-bold uppercase tracking-[0.2em] mb-2">Analysis Complete</p>
            <h4 className="text-3xl font-black text-white mb-2">
              DNA: <span className="text-cyan-400">{resultDna.name}</span>
            </h4>
            <div className="flex justify-center gap-2 mb-6">
               {resultDna.tags.map(tag => (
                 <span key={tag} className="text-[9px] font-mono text-cyan-300 bg-cyan-950/50 px-2 py-1 rounded border border-cyan-900">{tag}</span>
               ))}
            </div>
            
            <div className="grid grid-cols-3 gap-3 mb-8">
              {resultDna.images.map((img, i) => (
                <div key={i} className="aspect-[3/4] bg-slate-800 rounded-lg overflow-hidden border border-slate-700 relative group">
                  <div className="absolute inset-0 bg-cover bg-center opacity-80 group-hover:opacity-100 transition-opacity" style={{ backgroundImage: `url(${img})` }} />
                </div>
              ))}
            </div>
            
            <div className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-2xl p-5 border border-slate-700 flex items-center text-left gap-5 mb-6 shadow-inner">
              <div className="w-16 h-16 bg-white p-1 rounded-lg shrink-0 flex items-center justify-center">
                 <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full text-slate-950">
                    <path d="M3 3h8v8H3zm2 2v4h4V5zm8-2h8v8h-8zm2 2v4h4V5zM3 13h8v8H3zm2 2v4h4v-4zm13-2h2v2h-2zm-2 2h2v2h-2zm-2 2h2v2h-2zm2 2h2v2h-2zm2-2h2v2h-2zm2-4h2v2h-2z"/>
                 </svg>
              </div>
              <div>
                <p className="text-xs text-slate-400 font-medium mb-1 uppercase tracking-wider">Want 100+ daily OOTDs?</p>
                <p className="text-sm font-bold text-white mb-1">Meet <span className="text-green-400">Pickle AI</span> 🥒</p>
                <p className="text-[10px] text-slate-500">Scan to join the waitlist for your personal AI shopping agent.</p>
              </div>
            </div>
            
            <button onClick={() => setStatus('idle')} className="text-xs text-slate-500 hover:text-white underline uppercase tracking-widest font-mono">Rescan Photo</button>
          </div>
        )}
      </div>
    </div>
  );
}
