'use client';

import { useTranslations } from 'next-intl';

export default function ServiceInquiry() {
  // Using a fallback if translation hook fails or namespace is missing,
  // but typically we'd set up proper i18n for this new component.
  // For now, hardcoding english with some structure as per previous Footer.tsx

  return (
    <div className="bg-gradient-to-r from-slate-900 to-slate-900/50 border border-slate-800 rounded-2xl p-8 mb-12 text-left relative overflow-hidden group my-12">
        <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/5 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none group-hover:bg-cyan-500/10 transition-colors"></div>

        <div className="relative z-10">
            <div className="inline-block px-3 py-1 mb-4 text-xs font-mono text-cyan-400 border border-cyan-500/30 rounded-full bg-cyan-950/30 backdrop-blur-sm uppercase tracking-widest">
                Enterprise Services
            </div>
            <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">
                Need a Custom AI Agent Website?
            </h3>
            <p className="text-slate-400 mb-8 max-w-2xl leading-relaxed">
                Stop losing leads to outdated infrastructure. We build high-performance, SEO-optimized AI comparison portals and agency landing pages (like this one) for forward-thinking businesses.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-4">
                <a
                    href="mailto:smartworklab.store@gmail.com?subject=Inquiry: AI Website Build Service"
                    className="inline-flex items-center justify-center px-6 py-3 text-sm font-bold text-slate-900 transition-all bg-cyan-400 rounded-lg hover:bg-cyan-300 hover:shadow-[0_0_20px_rgba(34,211,238,0.4)]"
                >
                    <span>Request a Build Quote</span>
                    <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                </a>
            </div>
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-slate-500 border-t border-slate-800 pt-4 mt-6">
                 <div>
                    <span className="text-slate-400 font-bold mr-2">Average Delivery:</span>
                    2-3 Weeks
                </div>
                <div>
                     <span className="text-slate-400 font-bold mr-2">Tech Stack:</span>
                     Next.js 15, Supabase, Tailwind
                </div>
                <div>
                     <span className="text-slate-400 font-bold mr-2">Includes:</span>
                     SEO, Analytics, Admin Dashboard
                </div>
            </div>
        </div>
    </div>
  );
}
