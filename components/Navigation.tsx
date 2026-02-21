'use client';

import {usePathname, useRouter} from '@/i18n/routing';
import {useLocale, useTranslations} from 'next-intl';
import {useTransition, useEffect, useState} from 'react';
import { Link } from '@/i18n/routing';
import { createBrowserClient } from '@supabase/ssr';
import { User } from '@supabase/supabase-js';
import { LogOut, LayoutDashboard, User as UserIcon, Menu, X, ChevronDown } from 'lucide-react';

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
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const [isLangOpen, setIsLangOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Supabase Client
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      setLoading(false);
    };
    getUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, [supabase]);

  function handleLocaleSelect(code: string) {
    setIsLangOpen(false);
    startTransition(() => {
      router.replace(pathname, {locale: code});
    });
  }

  const handleSignOut = async () => {
      await supabase.auth.signOut();
      setUser(null);
      router.push('/login');
  };

  return (
    <>
      <nav className="flex items-center justify-between px-2 py-3 sm:p-4 border-b border-slate-800 bg-slate-950/50 backdrop-blur-md sticky top-0 z-40 w-full box-border">
        <div className="flex items-center gap-1.5 sm:gap-6 shrink">
          <Link href="/" className="text-base sm:text-xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent flex items-center gap-1 sm:gap-2 shrink-0 max-w-[140px] sm:max-w-none">
            <span className="hidden min-[380px]:inline">SmartWorkLab</span>
            <span className="inline min-[380px]:hidden">SWL</span>
            {user && (
               <span className="relative flex h-1.5 sm:h-2 w-1.5 sm:w-2" title="Online">
                 <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                 <span className="relative inline-flex rounded-full h-1.5 sm:h-2 w-1.5 sm:w-2 bg-green-500"></span>
               </span>
            )}
          </Link>
          <div className="hidden lg:flex gap-4 text-sm font-medium text-slate-400">
            <Link href="/" className="hover:text-cyan-400 transition-colors">{t('tools')}</Link>
            <Link href="/reviews" className="hover:text-cyan-400 transition-colors">{t('reviews')}</Link>
            <Link href="/metrics" className="hover:text-cyan-400 transition-colors">{t('metrics')}</Link>
            <Link href="/about" className="hover:text-cyan-400 transition-colors">About</Link>
          </div>
        </div>

        <div className="flex items-center gap-1.5 sm:gap-4 shrink-0">
          {/* Custom Locale Switcher */}
          <div className="relative">
            <button
              onClick={() => setIsLangOpen(!isLangOpen)}
              disabled={isPending}
              className="bg-slate-900 border border-slate-700 text-slate-300 text-[10px] sm:text-xs rounded px-1.5 sm:px-2 py-1.5 flex items-center gap-1 hover:bg-slate-800 transition-colors disabled:opacity-50"
            >
              <span>{LOCALES.find(l => l.code === locale)?.label || '🇺🇸 EN'}</span>
              <ChevronDown className="w-3 h-3 text-slate-500" />
            </button>

            {isLangOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setIsLangOpen(false)}></div>
                <div className="absolute top-full right-0 mt-2 bg-slate-900 border border-slate-700 rounded-lg shadow-xl flex flex-col z-50 min-w-[100px] overflow-hidden">
                  {LOCALES.map(l => (
                    <button
                      key={l.code}
                      onClick={() => handleLocaleSelect(l.code)}
                      className={`text-left px-4 py-3 text-xs sm:text-sm hover:bg-slate-800 transition-colors whitespace-nowrap ${locale === l.code ? 'text-cyan-400 font-bold bg-slate-800/50' : 'text-slate-300'}`}
                    >
                      {l.label}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          {!loading && (
              user ? (
                  <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
                      <Link
                          href="/metrics"
                          className="text-[10px] sm:text-xs font-bold bg-slate-800 hover:bg-slate-700 text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-full transition-all border border-slate-700 flex items-center gap-1 sm:gap-2 shrink-0 shadow-sm"
                      >
                          <LayoutDashboard className="w-3 h-3 shrink-0" />
                           <span className="hidden sm:inline">Dashboard</span>
                           <span className="inline sm:hidden">DB</span>
                      </Link>
                      <button
                          onClick={handleSignOut}
                          className="text-slate-400 hover:text-white transition-colors"
                          title="Sign Out"
                      >
                          <LogOut className="w-4 h-4" />
                      </button>
                  </div>
              ) : (
                  <Link href="/login" className="text-[10px] sm:text-xs font-bold bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-full transition-all shadow-[0_0_15px_rgba(8,145,178,0.4)] animate-pulse hover:animate-none flex items-center shrink-0">
                      <span className="hidden min-[400px]:inline">{t('getRoiReport')}</span>
                      <span className="inline min-[400px]:hidden">Get ROI</span>
                  </Link>
              )
          )}

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
          <Link href="/" onClick={() => setIsMobileMenuOpen(false)} className="px-4 py-3 text-base font-medium text-slate-300 hover:text-cyan-400 hover:bg-slate-800/50 rounded-lg transition-all flex items-center justify-between group">
            <span>{t('tools')}</span>
            <span className="text-slate-600 group-hover:text-cyan-500 transition-colors font-mono">&rarr;</span>
          </Link>
          <Link href="/reviews" onClick={() => setIsMobileMenuOpen(false)} className="px-4 py-3 text-base font-medium text-slate-300 hover:text-cyan-400 hover:bg-slate-800/50 rounded-lg transition-all flex items-center justify-between group">
            <span>{t('reviews')}</span>
            <span className="text-slate-600 group-hover:text-cyan-500 transition-colors font-mono">&rarr;</span>
          </Link>
          <Link href="/metrics" onClick={() => setIsMobileMenuOpen(false)} className="px-4 py-3 text-base font-medium text-slate-300 hover:text-cyan-400 hover:bg-slate-800/50 rounded-lg transition-all flex items-center justify-between group">
            <span>{t('metrics')}</span>
            <span className="text-slate-600 group-hover:text-cyan-500 transition-colors font-mono">&rarr;</span>
          </Link>
          <Link href="/about" onClick={() => setIsMobileMenuOpen(false)} className="px-4 py-3 text-base font-medium text-slate-300 hover:text-cyan-400 hover:bg-slate-800/50 rounded-lg transition-all flex items-center justify-between group">
            <span>About</span>
            <span className="text-slate-600 group-hover:text-cyan-500 transition-colors font-mono">&rarr;</span>
          </Link>

          <div className="my-4 border-t border-slate-800/50 mx-2"></div>

          <div className="px-4 py-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Account
          </div>

          {user ? (
            <button
               onClick={() => { handleSignOut(); setIsMobileMenuOpen(false); }}
               className="col-span-1 mx-2 mt-1 px-4 py-3 text-left text-base font-medium text-red-400 hover:bg-red-950/30 rounded-lg transition-all flex items-center gap-3"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </button>
          ) : (
            <Link
               href="/login"
               onClick={() => setIsMobileMenuOpen(false)}
               className="mx-4 mt-2 py-3 text-center text-sm font-bold bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-lg shadow-lg hover:shadow-cyan-900/50 transition-all flex justify-center items-center"
            >
               {t('getRoiReport')}
            </Link>
          )}
        </div>
      </div>
    </>
  );
}
