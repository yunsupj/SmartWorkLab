'use client';

import { useTranslations } from 'next-intl';

export default function Footer() {
  const t = useTranslations('Footer');

  return (
    <footer className="border-t border-slate-800 bg-slate-950 py-12 text-slate-400 text-sm mt-24">
      <div className="max-w-4xl mx-auto px-6 text-center space-y-4">
        <p className="font-semibold text-slate-300">SmartWorkLab AI</p>

        {/* Service Utility Section (New) */}
        <div className="bg-gradient-to-r from-slate-900 to-slate-900/50 border border-slate-800 rounded-2xl p-8 mb-12 text-left relative overflow-hidden group">
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

                <div className="flex flex-col sm:flex-row gap-4">
                    <a
                        href="mailto:smartworklab.store@gmail.com?subject=Inquiry: AI Website Build Service"
                        className="inline-flex items-center justify-center px-6 py-3 text-sm font-bold text-slate-900 transition-all bg-cyan-400 rounded-lg hover:bg-cyan-300 hover:shadow-[0_0_20px_rgba(34,211,238,0.4)]"
                    >
                        <span>Request a Build Quote</span>
                        <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                    </a>
                    <div className="flex items-center gap-4 px-4 py-2 text-xs text-slate-500 border-l border-slate-800 ml-2">
                        <div className="text-left">
                            <span className="block text-slate-400 font-bold">Average Delivery</span>
                            2-3 Weeks
                        </div>
                        <div className="text-left">
                            <span className="block text-slate-400 font-bold">Tech Stack</span>
                            Next.js 15, Supabase, Tailwind
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8 text-left max-w-2xl mx-auto mb-8">
            <div className="space-y-4">
                <h4 className="font-bold text-slate-300">Company</h4>
                <div className="flex flex-col gap-2">
                    <a href="/about" className="hover:text-cyan-400 transition-colors">About Us</a>
                    <a href="/sitemap.xml" className="hover:text-cyan-400 transition-colors">Sitemap</a>
                    <a href="mailto:support@smartworklab.com" className="hover:text-cyan-400 transition-colors">Contact Support</a>
                </div>
            </div>

             {/* Affiliate Disclosure */}
            <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-800">
                 <p className="text-xs text-slate-500 mb-2">
                    🇺🇸 {t('disclosure_en')}
                 </p>
                 <p className="text-xs text-slate-500">
                    🇰🇷 {t('disclosure_ko')}
                 </p>
            </div>
        </div>

        <div className="flex justify-center gap-6 text-xs text-slate-500 mt-4 border-t border-slate-900 pt-8">
             <a href="/privacy" className="hover:text-cyan-400 transition-colors">Privacy Policy</a>
             <a href="/terms" className="hover:text-cyan-400 transition-colors">Terms of Service</a>
        </div>

        <p className="text-xs text-slate-600">
          &copy; {new Date().getFullYear()} SmartWorkLab. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
