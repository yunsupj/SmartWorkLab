import createMiddleware from 'next-intl/middleware';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { routing } from './i18n/routing';

const intlMiddleware = createMiddleware(routing);

export default function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  // German locale removed (EN/KO only). Send old /de/* URLs to /en/*.
  if (pathname === '/de' || pathname.startsWith('/de/')) {
    const url = request.nextUrl.clone();
    url.pathname = '/en' + pathname.slice(3);
    return NextResponse.redirect(url, 301);
  }
  return intlMiddleware(request);
}

export const config = {
  // Match all pathnames except for:
  // - /api (API routes)
  // - /_next (Next.js internals)
  // - /_static (inside /public)
  // - /_vercel (Vercel internals)
  // - static files (e.g. /favicon.ico, /sitemap.xml, /robots.txt)
  matcher: [
    '/((?!api/|_next/|_vercel/|.*\\..*).*)',
    // However, match all pathnames within /users, optionally with a locale prefix
    // '/([\\w-]+)?/users/(.+)'
  ]
};
