'use client';

import { Link } from '@/i18n/routing';

const PROMOS = [
  { text: "⚡ FLASH DEAL: Cursor AI Pro 20% OFF - Limited Time Only", link: "/reviews/cursor-ai?coupon=FLASH20" },
  { text: "📉 PRICE DROP: Gemini 1.5 Pro API cost reduced by 50%", link: "/reviews/gemini-pro" },
  { text: "🔥 NEW: Claude 3.5 Sonnet vs GPT-4o Deep Battle", link: "/compare/claude-3-5-sonnet-vs-gpt-4o" },
];

export default function PromoTicker() {
  return (
    <div className="bg-cyan-900/30 border-b border-cyan-500/20 text-cyan-300 overflow-hidden relative h-10 flex items-center">
      <div className="absolute whitespace-nowrap animate-marquee flex gap-8">
        {[...PROMOS, ...PROMOS, ...PROMOS].map((promo, idx) => (
          <Link
            key={idx}
            href={promo.link}
            className="text-xs font-mono font-bold tracking-wider hover:text-white transition-colors flex items-center gap-2"
          >
            <span>{promo.text}</span>
            <span className="opacity-50">|</span>
          </Link>
        ))}
      </div>

      {/* Tailwind config needs 'animate-marquee' which we assume exists or will add.
          If not, we can use inline styles or standard standard css.
          For now, adding a simple inline style for safety if tailwind class missing.
      */}
      <style jsx global>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 30s linear infinite;
        }
        .animate-marquee:hover {
          animation-play-state: paused;
        }
      `}</style>
    </div>
  );
}
