import { NextResponse } from 'next/server';
import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';

export async function GET(request: Request) {
  console.log(`[Auth Callback] 🔍 Full URL: ${request.url}`);
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const next = searchParams.get('next') ?? '/';

  // Get locale from cookies (default to 'en') or derive from 'next' param if possible
  const cookieStore = await cookies();
  const locale = cookieStore.get('NEXT_LOCALE')?.value || 'en';

  if (code) {
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value;
          },
          set(name: string, value: string, options: CookieOptions) {
            cookieStore.set({ name, value, ...options });
          },
          remove(name: string, options: CookieOptions) {
            cookieStore.delete({ name, ...options });
          },
        },
      }
    );

    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      console.log(`[Auth Callback] 🟢 Success. Redirecting to ${origin}${next}`);
      return NextResponse.redirect(`${origin}${next}`);
    } else {
        console.error(`[Auth Callback] 🔴 Error exchanging code: ${error.message}`);
    }
  } else {
      console.error(`[Auth Callback] 🔴 No code found in URL`);
  }

  // Fallback Redirect: Go to login page with error param
  console.log(`[Auth Callback] 🟡 Redirecting to login with error...`);
  return NextResponse.redirect(`${origin}/${locale}/login?error=auth-code-error`);
}
