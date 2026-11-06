'use client';

import { useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { Copy, Check } from 'lucide-react';
import { Link } from '@/i18n/routing';

/**
 * Footer — minimal editorial footer.
 * Identity line, Explore links, legal links, contact email, disclosure.
 * No agency inquiry form, no promotional sections.
 */
export default function Footer() {
  const t = useTranslations('Footer');
  const tn = useTranslations('Navigation');
  const locale = useLocale();
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (typeof navigator !== 'undefined') {
      navigator.clipboard.writeText('info@yuunchloe.com');
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <footer className="border-t border-[#E4E7E2] bg-[#F7F7F4] py-12 text-[#66716C] text-sm mt-0">
      <div className="max-w-4xl mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-8">
          <div className="max-w-sm">
            <p className="font-bold text-[#1C2321] text-base">SmartWorkLab</p>
            <p className="mt-2 leading-relaxed">{t('tagline')}</p>
            <div className="flex items-center gap-2 mt-4">
              <a href="mailto:info@yuunchloe.com" className="hover:text-[#4C6B59] transition-colors">info@yuunchloe.com</a>
              <button
                onClick={handleCopy}
                className="p-1.5 text-[#8A938E] hover:text-[#1C2321] bg-[#FFFFFF] border border-[#E4E7E2] rounded-md transition-colors"
                title={t('copy_email')}
              >
                {copied ? <Check className="w-3 h-3 text-[#4C6B59]" /> : <Copy className="w-3 h-3" />}
              </button>
            </div>
          </div>

          <nav className="flex gap-12" aria-label="Footer">
            <div className="flex flex-col gap-2">
              <h4 className="font-bold text-[#1C2321]">{t('explore')}</h4>
              <Link href="/lab" className="hover:text-[#4C6B59] transition-colors">{tn('articles')}</Link>
              <Link href="/projects" className="hover:text-[#4C6B59] transition-colors">{tn('projects')}</Link>
              <Link href="/services" className="hover:text-[#4C6B59] transition-colors">{tn('services')}</Link>
              <Link href="/about" className="hover:text-[#4C6B59] transition-colors">{tn('about')}</Link>
            </div>
            <div className="flex flex-col gap-2">
              <h4 className="font-bold text-[#1C2321]">{t('legal')}</h4>
              <Link href="/privacy" className="hover:text-[#4C6B59] transition-colors">{t('privacy')}</Link>
              <Link href="/terms" className="hover:text-[#4C6B59] transition-colors">{t('terms')}</Link>
              <a href="/sitemap.xml" className="hover:text-[#4C6B59] transition-colors">{t('sitemap')}</a>
            </div>
          </nav>
        </div>

        <p className="text-xs text-[#8A938E] leading-relaxed mt-10 border-t border-[#E4E7E2] pt-6">
          {locale === 'ko' ? t('disclosure_ko') : t('disclosure_en')}
        </p>
        <p className="text-xs text-[#8A938E] mt-4">
          &copy; {new Date().getFullYear()} SmartWorkLab. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
