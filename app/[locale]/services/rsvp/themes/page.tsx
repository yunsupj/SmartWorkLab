'use client';

import { useState } from 'react';
import { ArrowLeft, Sparkles } from 'lucide-react';
import Link from 'next/link';

type Theme = 'pink' | 'red' | 'gold' | 'green' | 'blue';

const THEMES: Record<Theme, { name: string; bg: string; text: string; cardBg: string; border: string; stickers: string[]; font?: string }> = {
  pink: {
    name: 'Ellie Pink',
    bg: 'bg-pink-50',
    text: 'text-pink-900',
    cardBg: 'bg-white',
    border: 'border-pink-200',
    stickers: ['🌸', '🎀', '✨'],
  },
  red: {
    name: 'Hero Red',
    bg: 'bg-red-50',
    text: 'text-red-900',
    cardBg: 'bg-white',
    border: 'border-red-200',
    stickers: ['❤️', '🔥', '🎈'],
  },
  gold: {
    name: 'Royal Gold',
    bg: 'bg-[#FFFDF5]',
    text: 'text-amber-900',
    cardBg: 'bg-white',
    border: 'border-amber-200',
    stickers: ['✨', '👑', '🍾'],
  },
  green: {
    name: 'Safari Green',
    bg: 'bg-[#F2F7F2]',
    text: 'text-emerald-900',
    cardBg: 'bg-white',
    border: 'border-emerald-200',
    stickers: ['🌿', '🦒', '🦓'],
  },
  blue: {
    name: 'Space Blue',
    bg: 'bg-slate-900',
    text: 'text-blue-100',
    cardBg: 'bg-slate-800',
    border: 'border-slate-700',
    stickers: ['🪐', '🚀', '🌌'],
  },
};

export default function ThemeGalleryPage() {
  const [activeTheme, setActiveTheme] = useState<Theme>('pink');
  const theme = THEMES[activeTheme];

  return (
    <div className="bg-slate-950 min-h-screen text-white pt-24 pb-20">
      <div className="max-w-5xl mx-auto px-6">
        
        <div className="mb-10">
          <Link href="/services" className="inline-flex items-center text-sm text-slate-400 hover:text-cyan-400 transition-colors mb-6">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Services
          </Link>
          <h1 className="text-4xl font-bold font-[family-name:var(--font-geist-sans)] mb-4">RSVP Theme Gallery</h1>
          <p className="text-slate-400 max-w-2xl leading-relaxed">
            Every SmartWorkLab RSVP build includes a completely custom design system. Select a configuration below to see how our data-driven theming instantly adapts colors, typography, and interactive stickers.
          </p>
        </div>

        {/* Control Panel */}
        <div className="flex flex-wrap gap-3 mb-12">
          {(Object.keys(THEMES) as Theme[]).map((key) => (
            <button
              key={key}
              onClick={() => setActiveTheme(key)}
              className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 ${
                activeTheme === key 
                  ? 'bg-cyan-500 text-slate-950 shadow-[0_0_15px_rgba(6,182,212,0.5)]' 
                  : 'bg-slate-900 text-slate-400 border border-slate-800 hover:border-slate-600'
              }`}
            >
              {THEMES[key].name}
            </button>
          ))}
        </div>

        {/* Interactive Preview Canvas */}
        <div className={`relative w-full rounded-3xl overflow-hidden transition-colors duration-700 border border-slate-800 shadow-2xl ${theme.bg}`}>
          
          {/* Mock Mobile Viewport */}
          <div className="max-w-md mx-auto py-20 px-6 relative min-h-[600px] flex flex-col items-center justify-center">
            
            {/* Drifting Stickers */}
            <div className="absolute top-12 left-12 text-4xl animate-bounce" style={{ animationDuration: '3s' }}>{theme.stickers[0]}</div>
            <div className="absolute top-32 right-10 text-5xl animate-pulse cursor-pointer">{theme.stickers[1]}</div>
            <div className="absolute bottom-20 left-20 text-4xl animate-bounce" style={{ animationDuration: '4s' }}>{theme.stickers[2]}</div>

            {/* Preview Card */}
            <div className={`relative z-10 w-full p-8 rounded-2xl shadow-xl border ${theme.border} ${theme.cardBg} transition-all duration-500 transform hover:scale-105`}>
              <div className="text-center mb-8">
                <span className={`inline-block px-3 py-1 mb-4 text-[10px] font-mono tracking-widest uppercase rounded-full border ${theme.border} ${theme.text} opacity-80`}>
                  You're Invited
                </span>
                <h2 className={`text-4xl font-serif font-bold mb-3 ${theme.text}`}>Alex & Jordan</h2>
                <p className={`${theme.text} opacity-80 text-sm`}>June 7th, 2026 • Los Angeles, CA</p>
              </div>

              <div className="space-y-4">
                <button className={`w-full py-4 rounded-xl font-bold text-white transition-opacity hover:opacity-90 ${activeTheme === 'blue' ? 'bg-blue-600' : 'bg-slate-900'}`}>
                  RSVP Now
                </button>
                <div className={`text-center text-xs font-mono opacity-60 ${theme.text}`}>
                  <Sparkles className="inline-block w-3 h-3 mr-1" />
                  Powered by {THEMES[activeTheme].name} Engine
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
