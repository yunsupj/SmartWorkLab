'use client';

import { useTranslations } from 'next-intl';

export default function Footer() {
  const t = useTranslations('Footer');

  return (
    <footer className="border-t border-slate-800 bg-slate-950 py-12 text-slate-400 text-sm mt-24">
      <div className="max-w-4xl mx-auto px-6 text-center space-y-4">
        <p className="font-semibold text-slate-300">SmartWorkLab AI</p>

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
