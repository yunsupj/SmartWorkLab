'use client';

import { useEffect } from 'react';
import { usePathname } from '@/i18n/routing';

export default function ScrollRestorer() {
  const pathname = usePathname();

  useEffect(() => {
    // This runs on mount and whenever pathname (which triggers locale updates) changes
    const runRestoration = () => {
      if (typeof window === 'undefined') return;

      const anchor = sessionStorage.getItem('i18n-scroll-anchor');
      const percentStr = sessionStorage.getItem('i18n-scroll-percent');
      
      if (!anchor && !percentStr) return;

      // Delay slightly to let the newly fetched DOM items (like dynamic dictionaries) paint
      setTimeout(() => {
        let restored = false;

        // 1. Try restoring to exact Markdown Anchor
        if (anchor) {
          const el = document.getElementById(anchor);
          if (el) {
            const yOffset = -100; // offset for sticky Navigation header
            const y = el.getBoundingClientRect().top + window.scrollY + yOffset;
            window.scrollTo({ top: y, behavior: 'smooth' });
            restored = true;
          }
        }

        // 2. Fallback to interpolated percentage height
        if (!restored && percentStr) {
          const percent = parseFloat(percentStr);
          const docHeight = document.documentElement.scrollHeight - window.innerHeight;
          window.scrollTo({ top: docHeight * percent, behavior: 'smooth' });
        }

        // Clean up
        sessionStorage.removeItem('i18n-scroll-anchor');
        sessionStorage.removeItem('i18n-scroll-percent');
      }, 150);
    };

    runRestoration();
  }, [pathname]);

  return null;
}
