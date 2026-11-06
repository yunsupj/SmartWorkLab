'use client';

import { useTranslations } from 'next-intl';
import { createBrowserClient } from '@supabase/ssr';
import { useState, useMemo } from 'react';

export default function LoginPage() {
  const t = useTranslations('Login');
  const [loading, setLoading] = useState<string | null>(null);

  // Initialize Supabase Client for the Browser (Client Component)
  // This client automatically handles cookies for PKCE flow
  const supabase = useMemo(() => createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  ), []);

  const handleLogin = async (provider: 'google' | 'discord') => {
    console.log(`[Login] 🟢 Clicked ${provider} login button`);

    if (!supabase) {
      console.error('[Login] 🔴 Supabase client could not be initialized.');
      alert('Login service unavailable.');
      return;
    }

    try {
      setLoading(provider);
      console.log(`[Login] 🟡 Starting OAuth flow for ${provider}...`);

      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: provider,
        options: {
          redirectTo: `${window.location.origin}/api/auth/callback`,
        },
      });

      if (error) {
        console.error('[Login] 🔴 OAuth Error:', error.message);
        alert(`Login failed: ${error.message}`);
      } else {
        console.log('[Login] 🟢 Redirecting to:', data.url);
      }
    } catch (err) {
      console.error('[Login] 🔴 Unexpected Error:', err);
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FFF8EC] p-4">
      <div className="max-w-md w-full bg-[#FDF3E0] border border-[#E8D9BE] rounded-xl p-8 text-center shadow-2xl relative overflow-hidden">
        {/* Decorative Background */}
         <div className="absolute top-0 right-0 w-32 h-32 bg-[#A8E6CF]/40 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>

        <h1 className="text-2xl font-bold text-[#3D2C29] mb-4">
          🔐 {t('title')}
        </h1>
        <p className="text-[#7A6A5E] mb-8">
          {t('description')}
        </p>

        <div className="space-y-4">
          <button
            onClick={() => handleLogin('google')}
            disabled={loading === 'google'}
            className="w-full bg-white text-slate-900 font-bold py-3 rounded-lg hover:bg-slate-100 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-wait"
          >
            <span className="text-xl">G</span>
            {loading === 'google' ? 'Connecting...' : t('google')}
          </button>

          <button
            onClick={() => handleLogin('discord')}
            disabled={loading === 'discord'}
            className="w-full bg-[#5865F2] text-[#3D2C29] font-bold py-3 rounded-lg hover:opacity-90 transition-opacity flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-wait"
          >
             {loading === 'discord' ? 'Connecting...' : t('discord')}
          </button>
        </div>

        <p className="mt-6 text-xs text-[#97897B]">
          {t('terms')}
        </p>
      </div>
    </div>
  );
}
