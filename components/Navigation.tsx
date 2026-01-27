'use client';

import {usePathname, useRouter} from '@/i18n/routing';
import {useLocale, useTranslations} from 'next-intl';
import {ChangeEvent, useTransition} from 'react';

export default function Navigation() {
  const t = useTranslations('Navigation');
  const locale = useLocale();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const pathname = usePathname();

  function onSelectChange(event: ChangeEvent<HTMLSelectElement>) {
    const nextLocale = event.target.value;
    startTransition(() => {
      router.replace(pathname, {locale: nextLocale});
    });
  }

  return (
    <nav className="flex items-center justify-between p-4 border-b border-slate-800 bg-slate-950/50 backdrop-blur-md sticky top-0 z-50">
      <div className="flex items-center gap-6">
        <div className="text-xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
          SmartWorkLab
        </div>
        <div className="flex gap-4 text-sm font-medium text-slate-400">
          <a href="#" className="hover:text-cyan-400 transition-colors">{t('tools')}</a>
          <a href="#" className="hover:text-cyan-400 transition-colors">{t('reviews')}</a>
          <a href="#" className="hover:text-cyan-400 transition-colors">{t('metrics')}</a>
        </div>
      </div>

      <div className="flex items-center gap-4">
        {/* Locale Switcher */}
        <select
          defaultValue={locale}
          disabled={isPending}
          onChange={onSelectChange}
          className="bg-slate-900 border border-slate-700 text-slate-300 text-xs rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-cyan-500"
        >
          <option value="en">🇺🇸 EN</option>
          <option value="ko">🇰🇷 KO</option>
          <option value="de">🇩🇪 DE</option>
        </select>

        <button className="text-xs font-semibold bg-cyan-600 hover:bg-cyan-500 text-white px-3 py-1.5 rounded transition-all shadow-[0_0_10px_rgba(8,145,178,0.3)]">
          {t('login')}
        </button>
      </div>
    </nav>
  );
}
