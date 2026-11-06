'use client';

import {usePathname, useRouter} from '@/i18n/routing';
import {useLocale, useTranslations} from 'next-intl';
import {useTransition, useState} from 'react';
import { Link } from '@/i18n/routing';
import { Menu, X, ChevronDown } from 'lucide-react';

const LOCALES = [
  { code: 'en', label: 'EN' },
  { code: 'ko', label: 'KO' },
];

export default function Navigation() {
  const t = useTranslations('Navigation');
  const locale = useLocale();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const pathname = usePathname();

  const [isLangOpen, setIsLangOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  function handleLocaleSelect(code: string) {
    setIsLangOpen(false);

    // 1. Capture closest anchor or percentage for i18n scroll restoration
    if (typeof window !== 'undefined') {
      const scrollY = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercentage = docHeight > 0 ? scrollY / docHeight : 0;
      
      // Attempt to find closest heading
      const headings = Array.from(document.querySelectorAll('h2[id], h3[id]'));
      let closestAnchor = '';
      let minDistance = Infinity;
      
      headings.forEach(h => {
        const rect = h.getBoundingClientRect();
        const distance = Math.abs(rect.top);
        if (distance < minDistance && rect.top < window.innerHeight / 2) {
          minDistance = distance;
          closestAnchor = h.id;
        }
      });

      // Save to sessionStorage
      if (closestAnchor) sessionStorage.setItem('i18n-scroll-anchor', closestAnchor);
      sessionStorage.setItem('i18n-scroll-percent', scrollPercentage.toString());
    }

    startTransition(() => {
      // Use scroll: false to disable Next.js default jump-to-top behavior
      router.replace(pathname, { locale: code, scroll: false } as any);
    });
  }

  return (
    <>
      <nav className="flex items-center justify-between px-4 py-3 sm:py-4 border-b border-[#E4E7E2] bg-[#F7F7F4]/90 backdrop-blur-md sticky top-0 z-40 w-full box-border">
        
        {/* Logo (Left, responsive layout push element) */}
        <div className="flex lg:flex-1 items-center shrink-0">
          <Link href="/" className="text-lg sm:text-xl font-bold text-[#1C2321] flex items-center gap-2">
            <span className="inline-block w-2.5 h-2.5 rounded-[3px] bg-[#4C6B59]" aria-hidden="true" />
            <span className="hidden min-[380px]:inline">SmartWorkLab</span>
            <span className="inline min-[380px]:hidden">SWL</span>
          </Link>
        </div>

        {/* Navigation Links (Center Layout) */}
        <div className="hidden lg:flex justify-center gap-8 text-sm font-medium text-[#66716C] shrink-0">
          <Link href="/" className="hover:text-[#4C6B59] transition-colors">{t('home')}</Link>
          <Link href="/lab" className="hover:text-[#4C6B59] transition-colors">{t('articles')}</Link>
          <Link href="/lab/series" className="hover:text-[#4C6B59] transition-colors">{t('series')}</Link>
          <Link href="/about" className="hover:text-[#4C6B59] transition-colors">{t('about')}</Link>
        </div>

        {/* Actions (Right, symmetric width response) */}
        <div className="flex items-center justify-end gap-3 lg:flex-1">
          {/* Custom Locale Switcher */}
          <div className="relative">
            <button
              onClick={() => setIsLangOpen(!isLangOpen)}
              disabled={isPending}
              className="bg-[#FFFFFF] border border-[#D5DAD3] text-[#66716C] text-xs rounded-md px-3 py-1.5 flex items-center gap-2 hover:bg-[#EFF0EB] transition-colors disabled:opacity-50"
            >
              <span>{LOCALES.find(l => l.code === locale)?.label || 'EN'}</span>
              <ChevronDown className="w-3 h-3 text-[#8A938E]" />
            </button>

            {isLangOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setIsLangOpen(false)}></div>
                <div className="absolute top-full right-0 mt-2 bg-[#FFFFFF] border border-[#D5DAD3] rounded-lg shadow-xl flex flex-col z-50 min-w-[120px] overflow-hidden">
                  {LOCALES.map(l => (
                    <button
                      key={l.code}
                      onClick={() => handleLocaleSelect(l.code)}
                      className={`text-left px-4 py-3 text-sm hover:bg-[#EFF0EB] transition-colors whitespace-nowrap ${locale === l.code ? 'text-[#4C6B59] font-bold bg-[#EFF0EB]' : 'text-[#66716C]'}`}
                    >
                      {l.label}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className="flex lg:hidden text-[#66716C] hover:text-[#1C2321] p-1 ml-1"
            title="Menu"
          >
            <Menu className="w-5 h-5 shrink-0" />
          </button>
        </div>
      </nav>

      {/* Mobile Menu Backdrop */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 z-[100] bg-[#F7F7F4]/80 backdrop-blur-sm animate-in fade-in duration-300 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Mobile Menu Drawer */}
      <div
        className={`fixed top-0 right-0 bottom-0 z-[101] w-64 max-w-[80vw] bg-[#FFFFFF] border-l border-[#E4E7E2] shadow-2xl transform transition-transform duration-300 ease-in-out lg:hidden flex flex-col ${
          isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between p-4 border-b border-[#E4E7E2]">
          <span className="text-lg font-bold text-[#1C2321]">
            {t('menu')}
          </span>
          <button
            onClick={() => setIsMobileMenuOpen(false)}
            className="text-[#66716C] hover:text-[#1C2321] p-2 rounded-full hover:bg-[#EFF0EB] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto py-4 px-3 flex flex-col gap-1">
          <Link href="/" onClick={() => setIsMobileMenuOpen(false)} className="px-4 py-3 text-base font-medium text-[#66716C] hover:text-[#4C6B59] hover:bg-[#EFF0EB] rounded-lg transition-all flex items-center justify-between group">
            <span>{t('home')}</span>
            <span className="text-[#66716C] group-hover:text-[#4C6B59] transition-colors font-mono">&rarr;</span>
          </Link>
          <Link href="/lab" onClick={() => setIsMobileMenuOpen(false)} className="px-4 py-3 text-base font-medium text-[#66716C] hover:text-[#4C6B59] hover:bg-[#EFF0EB] rounded-lg transition-all flex items-center justify-between group">
            <span>{t('articles')}</span>
            <span className="text-[#66716C] group-hover:text-[#4C6B59] transition-colors font-mono">&rarr;</span>
          </Link>
          <Link href="/lab/series" onClick={() => setIsMobileMenuOpen(false)} className="px-4 py-3 text-base font-medium text-[#66716C] hover:text-[#4C6B59] hover:bg-[#EFF0EB] rounded-lg transition-all flex items-center justify-between group">
            <span>{t('series')}</span>
            <span className="text-[#66716C] group-hover:text-[#4C6B59] transition-colors font-mono">&rarr;</span>
          </Link>
          <Link href="/about" onClick={() => setIsMobileMenuOpen(false)} className="px-4 py-3 text-base font-medium text-[#66716C] hover:text-[#4C6B59] hover:bg-[#EFF0EB] rounded-lg transition-all flex items-center justify-between group">
            <span>{t('about')}</span>
            <span className="text-[#66716C] group-hover:text-[#4C6B59] transition-colors font-mono">&rarr;</span>
          </Link>
        </div>
      </div>
    </>
  );
}
