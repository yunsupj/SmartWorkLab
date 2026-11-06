'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Copy, Check } from 'lucide-react';
import ServiceInquiry from '@/components/ServiceInquiry';



export default function Footer() {
  const t = useTranslations('Footer');
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (typeof navigator !== 'undefined') {
      navigator.clipboard.writeText('info@yuunchloe.com');
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <footer className="border-t border-[#E8D9BE] bg-[#FFF8EC] py-12 text-[#7A6A5E] text-sm mt-0">
      <div className="max-w-4xl mx-auto px-6 text-center space-y-4">
        <p className="font-semibold text-[#5C4A42]">SmartWorkLab AI</p>

        {/* Service Utility Section */}
        <div className="pb-2.5">
          <ServiceInquiry />
        </div>

        <div className="grid md:grid-cols-3 gap-8 text-left max-w-4xl mx-auto mb-8">
            <div className="space-y-4">
                <h4 className="font-bold text-[#5C4A42]">Company</h4>
                <div className="flex flex-col gap-2">
                    <a href="/about" className="hover:text-[#3E9B6A] transition-colors">About Us</a>
                    <a href="/sitemap.xml" className="hover:text-[#3E9B6A] transition-colors">Sitemap</a>
                    <div className="flex items-center gap-2 mt-1">
                       <a href="mailto:info@yuunchloe.com" className="hover:text-[#3E9B6A] transition-colors">info@yuunchloe.com</a>
                       <button
                         onClick={handleCopy}
                         className="p-1.5 text-[#97897B] hover:text-[#3D2C29] bg-[#FDF3E0] border border-[#E8D9BE] rounded-md transition-colors"
                         title="Copy to clipboard"
                       >
                         {copied ? <Check className="w-3 h-3 text-green-400" /> : <Copy className="w-3 h-3" />}
                       </button>
                    </div>
                </div>
            </div>

            <div className="space-y-4">
                <h4 className="font-bold text-[#5C4A42]">Strategic Partners</h4>
                <div className="flex flex-col gap-2">
                    <a href="https://yuunchloe.com" target="_blank" rel="noopener noreferrer" className="hover:text-[#3E9B6A] transition-colors flex items-center gap-2">YuunChloe <span className="text-xs border border-[#DFC9A3] px-1.5 py-0.5 rounded-sm">Design & Strategy</span></a>
                </div>
            </div>

             {/* Affiliate Disclosure */}
            <div className="bg-[#FDF3E0] p-5 rounded-xl border border-[#E8D9BE] shadow-inner">
                 <p className="text-xs text-[#97897B] mb-2 leading-relaxed">
                    🇺🇸 {t('disclosure_en')}
                 </p>
                 <p className="text-xs text-[#97897B] leading-relaxed">
                    🇰🇷 {t('disclosure_ko')}
                 </p>
            </div>
        </div>

        <div className="flex justify-center gap-6 text-xs text-[#97897B] mt-4 border-t border-[#E8D9BE] pt-8">
             <a href="/privacy" className="hover:text-[#3E9B6A] transition-colors">Privacy Policy</a>
             <a href="/terms" className="hover:text-[#3E9B6A] transition-colors">Terms of Service</a>
        </div>

        <p className="text-xs text-[#7A6A5E]">
          &copy; {new Date().getFullYear()} SmartWorkLab. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
