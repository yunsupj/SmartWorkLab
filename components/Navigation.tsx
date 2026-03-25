'use client';

import {usePathname, useRouter} from '@/i18n/routing';
import {useLocale, useTranslations} from 'next-intl';
import {useTransition, useState} from 'react';
import { Link } from '@/i18n/routing';
import { Menu, X, ChevronDown } from 'lucide-react';

const LOCALES = [
  { code: 'en', label: '🇺🇸 EN' },
  { code: 'ko', label: '🇰🇷 KO' },
  { code: 'de', label: '🇩🇪 DE' },
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
      <nav className="flex items-center justify-between px-4 py-3 sm:py-4 border-b border-slate-800 bg-slate-950/80 backdrop-blur-md sticky top-0 z-40 w-full box-border">
        
        {/* Logo (Left, responsive layout push element) */}
        <div className="flex lg:flex-1 items-center shrink-0">
          <Link href="/" className="text-lg sm:text-xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent flex items-center">
            <span className="hidden min-[380px]:inline">SmartWorkLab</span>
            <span className="inline min-[380px]:hidden">SWL</span>
          </Link>
        </div>

        {/* Navigation Links (Center Layout) */}
        <div className="hidden lg:flex justify-center gap-8 text-sm font-medium text-slate-400 shrink-0">
          <Link href="/lab" className="hover:text-cyan-400 transition-colors">Lab</Link>
          <Link href="/services" className="hover:text-cyan-400 transition-colors">Services</Link>
          <Link href="/projects" className="hover:text-cyan-400 transition-colors">Projects</Link>
          <Link href="/about" className="hover:text-cyan-400 transition-colors">Contact</Link>
        </div>

        {/* Actions (Right, symmetric width response) */}
        <div className="flex items-center justify-end gap-3 lg:flex-1">
          {/* Custom Locale Switcher */}
          <div className="relative">
            <button
              onClick={() => setIsLangOpen(!isLangOpen)}
              disabled={isPending}
              className="bg-slate-900 border border-slate-700 text-slate-300 text-xs rounded-md px-3 py-1.5 flex items-center gap-2 hover:bg-slate-800 transition-colors disabled:opacity-50"
            >
              <span>{LOCALES.find(l => l.code === locale)?.label || '🇺🇸 EN'}</span>
              <ChevronDown className="w-3 h-3 text-slate-500" />
            </button>

            {isLangOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setIsLangOpen(false)}></div>
                <div className="absolute top-full right-0 mt-2 bg-slate-900 border border-slate-700 rounded-lg shadow-xl flex flex-col z-50 min-w-[120px] overflow-hidden">
                  {LOCALES.map(l => (
                    <button
                      key={l.code}
                      onClick={() => handleLocaleSelect(l.code)}
                      className={`text-left px-4 py-3 text-sm hover:bg-slate-800 transition-colors whitespace-nowrap ${locale === l.code ? 'text-cyan-400 font-bold bg-slate-800/50' : 'text-slate-300'}`}
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
            className="flex lg:hidden text-slate-400 hover:text-white p-1 ml-1"
            title="Menu"
          >
            <Menu className="w-5 h-5 shrink-0" />
          </button>
        </div>
      </nav>

      {/* Mobile Menu Backdrop */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 z-[100] bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-300 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Mobile Menu Drawer */}
      <div
        className={`fixed top-0 right-0 bottom-0 z-[101] w-64 max-w-[80vw] bg-slate-900 border-l border-slate-800 shadow-2xl transform transition-transform duration-300 ease-in-out lg:hidden flex flex-col ${
          isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between p-4 border-b border-slate-800">
          <span className="text-lg font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
            Menu
          </span>
          <button
            onClick={() => setIsMobileMenuOpen(false)}
            className="text-slate-400 hover:text-white p-2 rounded-full hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto py-4 px-3 flex flex-col gap-1">
          <Link href="/lab" onClick={() => setIsMobileMenuOpen(false)} className="px-4 py-3 text-base font-medium text-slate-300 hover:text-cyan-400 hover:bg-slate-800/50 rounded-lg transition-all flex items-center justify-between group">
            <span>Lab</span>
            <span className="text-slate-600 group-hover:text-cyan-500 transition-colors font-mono">&rarr;</span>
          </Link>
          <Link href="/services" onClick={() => setIsMobileMenuOpen(false)} className="px-4 py-3 text-base font-medium text-slate-300 hover:text-cyan-400 hover:bg-slate-800/50 rounded-lg transition-all flex items-center justify-between group">
            <span>Services</span>
            <span className="text-slate-600 group-hover:text-cyan-500 transition-colors font-mono">&rarr;</span>
          </Link>
          <Link href="/projects" onClick={() => setIsMobileMenuOpen(false)} className="px-4 py-3 text-base font-medium text-slate-300 hover:text-cyan-400 hover:bg-slate-800/50 rounded-lg transition-all flex items-center justify-between group">
            <span>Projects</span>
            <span className="text-slate-600 group-hover:text-cyan-500 transition-colors font-mono">&rarr;</span>
          </Link>
          <Link href="/about" onClick={() => setIsMobileMenuOpen(false)} className="px-4 py-3 text-base font-medium text-slate-300 hover:text-cyan-400 hover:bg-slate-800/50 rounded-lg transition-all flex items-center justify-between group">
            <span>Contact</span>
            <span className="text-slate-600 group-hover:text-cyan-500 transition-colors font-mono">&rarr;</span>
          </Link>
        </div>
      </div>
    </>
  );
}
