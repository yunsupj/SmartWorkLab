import createMiddleware from 'next-intl/middleware';
import {routing} from './i18n/routing';

export default createMiddleware(routing);

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
