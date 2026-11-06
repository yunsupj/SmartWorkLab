'use client';

import { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import ContactModal from '@/components/ContactModal';

/**
 * ServiceInquiry — B2B project inquiry form / CTA block.
 * Replaces the old affiliate-era "AI comparison portal" copy.
 */
export default function ServiceInquiry() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="relative bg-[#FDF3E0]/60 border border-[#E8D9BE] rounded-2xl p-8 overflow-hidden group">
      {/* Gradient accent */}
      <div className="absolute top-0 right-0 w-72 h-72 bg-[#A8E6CF]/30 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none group-hover:bg-[#5FBF8A]/8 transition-colors" />

      <div className="relative z-10 text-center max-w-lg mx-auto">
        <div className="inline-block px-3 py-1 mb-4 text-xs font-mono text-[#3E9B6A] border border-[#5FBF8A]/50 rounded-full bg-cyan-950/30 uppercase tracking-widest">
          Start a Project
        </div>

        <h3 className="text-2xl md:text-3xl font-bold text-[#3D2C29] mb-3">
          Ready to Ship Something Real?
        </h3>
        <p className="text-[#7A6A5E] mb-8 leading-relaxed text-sm">
          Describe your project below. We'll scope it, quote it, and get back to you within 24 hours — no fluff, no NDAs required to start.
        </p>

        {/* Quick-action buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center mb-8">
          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-bold text-slate-900 bg-gradient-to-r from-cyan-400 to-blue-400 rounded-full hover:shadow-[0_0_24px_rgba(34,211,238,0.35)] transition-all hover:-translate-y-0.5"
          >
            Email Us Directly <ArrowRight className="w-4 h-4" />
          </button>
          <a
            href="https://cal.com/yunsup-jung-rqc4g5/15min"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-bold text-[#5C4A42] border border-[#DFC9A3] rounded-full hover:border-slate-600 hover:text-[#3D2C29] hover:bg-[#F3E6C8] transition-all"
          >
            Book a 15-min Strategy Session
          </a>
        </div>

        {/* Trust strip */}
        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-[#7A6A5E] border-t border-[#E8D9BE] pt-6">
          <span className="text-[#97897B]">⚡ Response within 24 hours</span>
          <span className="text-[#97897B]">🔒 NDA available on request</span>
          <span className="text-[#97897B]">🚀 Fast delivery SLAs</span>
        </div>
      </div>

      {/* Render the Contact Overlay directly from within the Inquiry scope */}
      <ContactModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}
