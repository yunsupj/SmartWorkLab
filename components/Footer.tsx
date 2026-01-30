'use client';

import { useTranslations } from 'next-intl';

export default function Footer() {
  const t = useTranslations('Footer');

  return (
    <footer className="border-t border-slate-800 bg-slate-950 py-12 text-slate-400 text-sm mt-24">
      <div className="max-w-4xl mx-auto px-6 text-center space-y-4">
        <p className="font-semibold text-slate-300">SmartWorkLab AI</p>

        {/* Affiliate Disclosure */}
        <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-800 max-w-2xl mx-auto">
             <p className="text-xs text-slate-500 mb-2">
                🇺🇸 {t('disclosure_en')}
             </p>
             <p className="text-xs text-slate-500">
                🇰🇷 {t('disclosure_ko')}
             </p>
        </div>

        <p className="text-xs text-slate-600">
          &copy; {new Date().getFullYear()} SmartWorkLab. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
