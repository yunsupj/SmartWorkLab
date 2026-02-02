'use client';

import { ArrowRight, Sparkles } from 'lucide-react';
import Link from 'next/link';

export default function AgencyCTA() {
  const mailtoLink = "mailto:smartworklab.store@gmail.com?subject=[Inquiry] AI Agent Website Project&body=Hello SmartWorkLab, I saw your ROI analysis and I'm interested in building a custom AI agent system for my business.";

  return (
    <div className="relative group">
      {/* Glow Effects */}
      <div className="absolute -inset-1 bg-gradient-to-r from-green-500 to-cyan-500 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>

      <div className="relative bg-slate-950 border border-slate-800 p-8 md:p-12 rounded-2xl overflow-hidden">
        {/* Background Elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-green-500/5 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl -ml-32 -mb-32 pointer-events-none"></div>

        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8 md:gap-12">

          <div className="text-center md:text-left space-y-4 max-w-2xl">
             <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-950/30 border border-green-500/30 text-green-400 text-xs font-mono uppercase tracking-widest mb-2">
                <Sparkles className="w-3 h-3" />
                <span>Custom Enterprise Solutions</span>
             </div>

             <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight">
                Build Your Custom <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-cyan-400">AI Agent Website</span>
             </h2>

             <p className="text-lg text-slate-400 leading-relaxed">
                Expertly crafted and managed by SmartWorkLab. Maximize your business ROI with our custom solutions tailored to your specific workflow needs.
             </p>
          </div>

          <div className="flex-shrink-0">
             <a
               href={mailtoLink}
               className="inline-flex items-center justify-center gap-3 px-8 py-4 text-base font-bold text-slate-950 bg-gradient-to-r from-green-400 to-cyan-400 rounded-full hover:shadow-[0_0_20px_rgba(74,222,128,0.4)] transition-all duration-300 transform hover:-translate-y-1"
             >
                Get a Free Quote
                <ArrowRight className="w-5 h-5" />
             </a>
             <p className="text-center mt-3 text-xs text-slate-500">
                Response within 24 hours
             </p>
          </div>

        </div>
      </div>
    </div>
  );
}
