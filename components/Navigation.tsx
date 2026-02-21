'use client';

import {usePathname, useRouter} from '@/i18n/routing';
import {useLocale, useTranslations} from 'next-intl';
import {ChangeEvent, useTransition, useEffect, useState} from 'react';
import { Link } from '@/i18n/routing';
import { createBrowserClient } from '@supabase/ssr';
import { User } from '@supabase/supabase-js';
import { LogOut, LayoutDashboard, User as UserIcon } from 'lucide-react';

export default function Navigation() {
  const t = useTranslations('Navigation');
  const locale = useLocale();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const pathname = usePathname();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

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

  function onSelectChange(event: ChangeEvent<HTMLSelectElement>) {
    const nextLocale = event.target.value;
    startTransition(() => {
      router.replace(pathname, {locale: nextLocale});
    });
  }

  const handleSignOut = async () => {
      await supabase.auth.signOut();
      // AuthProvider will handle the redirect, but we can optimistically update UI
      setUser(null);
      router.push('/login');
  };

  return (
    <nav className="flex items-center justify-between px-2 py-4 sm:p-4 border-b border-slate-800 bg-slate-950/50 backdrop-blur-md sticky top-0 z-40 w-full box-border">
      <div className="flex items-center gap-3 sm:gap-6 shrink">
        <Link href="/" className="text-xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent flex items-center gap-2 shrink-0">
          SmartWorkLab
          {user && (
             <span className="relative flex h-2 w-2" title="Online">
               <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
               <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
             </span>
          )}
        </Link>
        <div className="flex gap-4 text-sm font-medium text-slate-400">
          <Link href="/" className="hover:text-cyan-400 transition-colors">{t('tools')}</Link>
          <Link href="/reviews" className="hover:text-cyan-400 transition-colors">{t('reviews')}</Link>
          <Link href="/metrics" className="hover:text-cyan-400 transition-colors">{t('metrics')}</Link>
          <Link href="/about" className="hover:text-cyan-400 transition-colors">About</Link>
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-4 shrink">
        {/* Locale Switcher */}
        <select
          defaultValue={locale}
          disabled={isPending}
          onChange={onSelectChange}
          className="bg-slate-900 border border-slate-700 text-slate-300 text-xs rounded px-1 sm:px-2 py-1 focus:outline-none focus:ring-1 focus:ring-cyan-500 shrink-0"
        >
          <option value="en">🇺🇸 EN</option>
          <option value="ko">🇰🇷 KO</option>
          <option value="de">🇩🇪 DE</option>
        </select>

        {!loading && (
            user ? (
                <div className="flex items-center gap-2 sm:gap-3 shrink">
                    <Link
                        href="/metrics"
                        className="text-xs font-bold bg-slate-800 hover:bg-slate-700 text-white px-3 sm:px-4 py-2 rounded-full transition-all border border-slate-700 flex items-center gap-2 shrink"
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
                <Link href="/login" className="text-xs font-bold bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white px-4 py-2 rounded-full transition-all shadow-[0_0_15px_rgba(8,145,178,0.4)] animate-pulse hover:animate-none flex items-center">
                    {t('getRoiReport')}
                </Link>
            )
        )}
      </div>
    </nav>
  );
}
