'use client';

import { useEffect, useState } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import { useRouter } from 'next/navigation';

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [isLive, setIsLive] = useState(false);

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  useEffect(() => {
    // Check initial session
    const checkSession = async () => {
        const { data: { session } } = await supabase.auth.getSession();
        if (session) setIsLive(true);
    };
    checkSession();

    // Listen for changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
          setIsLive(true);
      }

      if (event === 'SIGNED_OUT' || (event as string) === 'USER_DELETED') {
        setIsLive(false);
        // Force cleanup and redirect
        router.push('/en/login'); // Fallback to EN if locale unknown, or handle dynamically
        router.refresh();
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [router, supabase]);

  return (
      <>
        {/* Optional: Global Indicator or Context Provider */}
        {children}
      </>
  );
}
