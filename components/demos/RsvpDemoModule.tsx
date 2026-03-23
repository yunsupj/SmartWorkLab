'use client';

import { useState } from 'react';
import { Sparkles } from 'lucide-react';

// ─── Theme Definitions ────────────────────────────────────────────────────────

export interface RsvpThemeConfig {
  id: string;
  label: string;
  gradient: string;           // CSS gradient for card bg
  accentColor: string;        // Tailwind text color class
  accentBorder: string;       // Tailwind border color class
  accentBg: string;           // Tailwind bg color class (light tint)
  stickers: string[];         // Emoji array for decorative overlay
  demoTitle: string;
  demoSubtitle: string;
  buttonBg: string;           // Tailwind gradient classes for CTA
}

export const RSVP_THEMES: RsvpThemeConfig[] = [
  {
    id: 'ellie-pink',
    label: '🎀 Ellie Pink',
    gradient: 'linear-gradient(135deg, #fdf2f8 0%, #fce7f3 50%, #fbcfe8 100%)',
    accentColor: 'text-pink-600',
    accentBorder: 'border-pink-300',
    accentBg: 'bg-pink-50',
    stickers: ['🎀', '🎈', '⭐', '💝', '🌸', '✨'],
    demoTitle: "You're Invited! 🎀",
    demoSubtitle: "Join us for a very special celebration",
    buttonBg: 'from-pink-400 to-rose-400',
  },
  {
    id: 'forest-green',
    label: '🌿 Forest Green',
    gradient: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 50%, #bbf7d0 100%)',
    accentColor: 'text-green-700',
    accentBorder: 'border-green-300',
    accentBg: 'bg-green-50',
    stickers: ['🌿', '🍄', '🌱', '🍃', '🌲', '✨'],
    demoTitle: "Garden Party! 🌿",
    demoSubtitle: "An evening in the garden awaits",
    buttonBg: 'from-green-400 to-emerald-400',
  },
  {
    id: 'ocean-blue',
    label: '🌊 Ocean Blue',
    gradient: 'linear-gradient(135deg, #eff6ff 0%, #dbeafe 50%, #bfdbfe 100%)',
    accentColor: 'text-blue-700',
    accentBorder: 'border-blue-300',
    accentBg: 'bg-blue-50',
    stickers: ['🌊', '🐚', '⚓', '🐬', '🌴', '✨'],
    demoTitle: "Beach Event! 🌊",
    demoSubtitle: "Come celebrate by the sea",
    buttonBg: 'from-blue-400 to-cyan-400',
  },
  {
    id: 'sunset-orange',
    label: '🌅 Sunset Orange',
    gradient: 'linear-gradient(135deg, #fff7ed 0%, #ffedd5 50%, #fed7aa 100%)',
    accentColor: 'text-orange-700',
    accentBorder: 'border-orange-300',
    accentBg: 'bg-orange-50',
    stickers: ['🌅', '☀️', '🌤️', '🍊', '🌻', '✨'],
    demoTitle: "Sunset Soirée! 🌅",
    demoSubtitle: "Golden hour, golden memories",
    buttonBg: 'from-orange-400 to-amber-400',
  },
  {
    id: 'midnight-purple',
    label: '🌙 Midnight Purple',
    gradient: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #4338ca 100%)',
    accentColor: 'text-purple-200',
    accentBorder: 'border-purple-500',
    accentBg: 'bg-purple-900/30',
    stickers: ['🌙', '⭐', '🌟', '🔮', '💜', '✨'],
    demoTitle: "Starlight Gala 🌙",
    demoSubtitle: "An enchanting evening under the stars",
    buttonBg: 'from-purple-400 to-violet-400',
  },
  {
    id: 'corporate-slate',
    label: '💼 Corporate',
    gradient: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 50%, #e2e8f0 100%)',
    accentColor: 'text-slate-700',
    accentBorder: 'border-slate-300',
    accentBg: 'bg-slate-100',
    stickers: ['💼', '🤝', '📋', '🏢', '🎯', '✨'],
    demoTitle: "Corporate Event",
    demoSubtitle: "Professional gatherings, flawlessly managed",
    buttonBg: 'from-slate-500 to-slate-700',
  },
  // ── Kids / Character themes ──────────────────────────────────────────────
  {
    id: 'hero-red',
    label: '🕷️ Hero Red',
    gradient: 'linear-gradient(135deg, #fef2f2 0%, #fee2e2 40%, #fecaca 70%, #fcd3d3 100%)',
    accentColor: 'text-red-700',
    accentBorder: 'border-red-400',
    accentBg: 'bg-red-50',
    stickers: ['🕷️', '🦸', '⚡', '💥', '🕸️', '🌟'],
    demoTitle: "Super Hero Party! 🕷️",
    demoSubtitle: "Your friendly neighborhood celebration",
    buttonBg: 'from-red-500 to-rose-600',
  },
  {
    id: 'royal-pink',
    label: '👸 Royal Pink',
    gradient: 'linear-gradient(135deg, #fdf4ff 0%, #fae8ff 40%, #f5d0fe 70%, #e9d5ff 100%)',
    accentColor: 'text-fuchsia-700',
    accentBorder: 'border-fuchsia-300',
    accentBg: 'bg-fuchsia-50',
    stickers: ['👸', '👑', '💎', '🌸', '🦄', '✨'],
    demoTitle: "Royal Princess Ball 👑",
    demoSubtitle: "Every guest is treated like royalty",
    buttonBg: 'from-fuchsia-400 to-pink-500',
  },
  {
    id: 'puppy-blue',
    label: '🐾 Puppy Blue',
    gradient: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 40%, #bae6fd 70%, #7dd3fc 100%)',
    accentColor: 'text-sky-700',
    accentBorder: 'border-sky-300',
    accentBg: 'bg-sky-50',
    stickers: ['🐾', '🐶', '🦴', '⭐', '🎖️', '🌈'],
    demoTitle: "Sheriff Pup Party! 🐾",
    demoSubtitle: "Paws, badges, and birthday adventures",
    buttonBg: 'from-sky-400 to-blue-500',
  },
  {
    id: 'safari-adventure',
    label: '🦁 Safari',
    gradient: 'linear-gradient(135deg, #fffbeb 0%, #fef3c7 40%, #fde68a 70%, #fcd34d 100%)',
    accentColor: 'text-amber-800',
    accentBorder: 'border-amber-400',
    accentBg: 'bg-amber-50',
    stickers: ['🦁', '🐘', '🦒', '🌿', '🌍', '✨'],
    demoTitle: "Safari Adventure! 🦁",
    demoSubtitle: "A wild and wonderful celebration",
    buttonBg: 'from-amber-400 to-orange-500',
  },
];

// ─── Component ────────────────────────────────────────────────────────────────

interface RsvpDemoModuleProps {
  /** If true, show in compact mode (inside a service card) */
  compact?: boolean;
}

export default function RsvpDemoModule({ compact = false }: RsvpDemoModuleProps) {
  const [activeTheme, setActiveTheme] = useState<RsvpThemeConfig>(RSVP_THEMES[0]);
  const [rsvpState, setRsvpState] = useState<'idle' | 'yes' | 'no'>('idle');

  const isDark = activeTheme.id === 'midnight-purple';

  return (
    <div className={`${compact ? '' : 'max-w-2xl mx-auto'}`}>
      {/* Theme swatch row */}
      <div className="flex flex-wrap gap-2 mb-5 justify-center">
        {RSVP_THEMES.map((theme) => (
          <button
            key={theme.id}
            onClick={() => { setActiveTheme(theme); setRsvpState('idle'); }}
            className={`text-xs font-medium px-3 py-1.5 rounded-full border transition-all ${
              activeTheme.id === theme.id
                ? 'border-cyan-500 bg-cyan-950/40 text-cyan-300 shadow-[0_0_8px_rgba(34,211,238,0.3)]'
                : 'border-slate-700 bg-slate-900 text-slate-400 hover:border-slate-600 hover:text-slate-300'
            }`}
          >
            {theme.label}
          </button>
        ))}
      </div>

      {/* Live Preview Card */}
      <div
        className="rounded-2xl overflow-hidden shadow-2xl border border-white/10 transition-all duration-500"
        style={{ background: activeTheme.gradient }}
      >
        {/* Floating sticker decorations */}
        <div className="relative h-12 overflow-hidden">
          {activeTheme.stickers.map((s, i) => (
            <span
              key={i}
              className="absolute text-xl select-none pointer-events-none"
              style={{
                left: `${10 + i * 16}%`,
                top: `${Math.sin(i * 1.2) * 8 + 4}px`,
                transform: `rotate(${(i % 3 - 1) * 12}deg)`,
                opacity: 0.7,
              }}
            >
              {s}
            </span>
          ))}
        </div>

        <div className="px-8 pb-8 text-center">
          {/* Invite header */}
          <div className={`font-bold text-2xl mb-1 transition-all duration-300 ${activeTheme.accentColor}`}>
            {activeTheme.demoTitle}
          </div>
          <p className={`text-sm mb-1 opacity-80 ${activeTheme.accentColor}`}>
            {activeTheme.demoSubtitle}
          </p>

          {/* Event details row */}
          <div className={`flex justify-center gap-6 text-xs font-medium mt-4 mb-6 ${activeTheme.accentColor} opacity-75`}>
            <span>📅 Saturday, June 7</span>
            <span>⏰ 6:00 PM</span>
            <span>📍 Venue, City</span>
          </div>

          {/* RSVP buttons */}
          <div className="flex gap-3 justify-center mb-4">
            <button
              onClick={() => setRsvpState('yes')}
              className={`px-6 py-2.5 rounded-full text-sm font-bold text-white bg-gradient-to-r ${activeTheme.buttonBg} shadow-md transition-all hover:scale-105 active:scale-95 ${
                rsvpState === 'yes' ? 'ring-2 ring-white/60 scale-105' : ''
              }`}
            >
              {rsvpState === 'yes' ? '🎉 See you there!' : "✅ I'll be there!"}
            </button>
            <button
              onClick={() => setRsvpState('no')}
              className={`px-6 py-2.5 rounded-full text-sm font-semibold border transition-all hover:scale-105 active:scale-95 ${activeTheme.accentBorder} ${activeTheme.accentColor} ${activeTheme.accentBg} ${
                rsvpState === 'no' ? 'opacity-60' : ''
              }`}
            >
              {rsvpState === 'no' ? '😢 Sorry...' : "❌ Can't make it"}
            </button>
          </div>

          {/* Mini photo upload hint */}
          <p className={`text-[11px] opacity-50 ${activeTheme.accentColor}`}>
            📸 Guests can upload photos to a shared guestbook
          </p>
        </div>

        {/* Bottom "powered by" strip */}
        <div className={`border-t px-4 py-2.5 flex items-center justify-center gap-1.5 text-[10px] font-mono opacity-50 ${activeTheme.accentBorder} ${activeTheme.accentColor}`}>
          <Sparkles className="w-3 h-3" />
          Built by SmartWorkLab · Tier 1 Entry Service
        </div>
      </div>

      {/* Config note (non-compact only) */}
      {!compact && (
        <p className="mt-4 text-center text-xs text-slate-600 font-mono">
          Theme: <code className="text-slate-400">{activeTheme.id}</code> · 10 variants · Fully customizable
        </p>
      )}
    </div>
  );
}
