'use client';

import { Link } from '@/i18n/routing';
import { useTranslations } from 'next-intl';

const PROMOS = [
  { text: "⚡ FLASH DEAL: Cursor AI Pro 20% OFF - Limited Time Only", link: "/reviews/cursor-ai?coupon=FLASH20", source: "https://cursor.sh/pricing" },
  { text: "📉 PRICE DROP: Gemini 1.5 Pro API cost reduced by 50%", link: "/reviews/gemini-pro", source: "https://blog.google/technology/ai/" },
  { text: "🔥 NEW: Claude 3.5 Sonnet vs GPT-4o Deep Battle", link: "/compare/claude-3-5-sonnet-vs-gpt-4o", source: "https://anthropic.com/news" },
];

export default function PromoTicker() {
  const t = useTranslations('PromoTicker');

  return (
    <div className="bg-cyan-900/30 border-b border-cyan-500/20 text-cyan-300 overflow-hidden relative h-10 flex items-center z-50">
      <div className="absolute whitespace-nowrap animate-marquee flex gap-8">
        {[...PROMOS, ...PROMOS, ...PROMOS].map((promo, idx) => (
          <div key={idx} className="flex items-center gap-2">
            <Link
              href={promo.link}
              className="text-sm overflow-hidden text-ellipsis whitespace-nowrap max-w-[80vw] md:max-w-none font-mono font-bold tracking-wider hover:text-white transition-colors"
            >
              {promo.text}
            </Link>
            {promo.source && (
               <a href={promo.source} target="_blank" rel="noopener noreferrer" className="ml-2 text-[10px] text-slate-400 hover:text-cyan-400 flex items-center gap-1 border border-slate-700/50 bg-slate-900/50 rounded px-1.5 py-0.5 transition-colors" title={t('source')}>
                 <span>ℹ️</span> Details
               </a>
            )}
            <span className="opacity-50 mx-2">|</span>
          </div>
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
          animation: marquee 40s linear infinite;
        }
        .animate-marquee:hover {
          animation-play-state: paused;
        }
      `}</style>
    </div>
  );
}
