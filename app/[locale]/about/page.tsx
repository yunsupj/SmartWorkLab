import { Github, Linkedin, Twitter, Globe } from 'lucide-react';
import Image from 'next/image';

export const metadata = {
  title: 'About Us',
  description: 'Meet the founders of SmartWorkLab: Yunsup Jung and Chloe Kim.',
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#FFF8EC] text-[#3D2C29]">
      {/* Hero Section */}
      <section className="relative py-24 px-6 md:px-12 text-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-cyan-900/20 to-slate-950 z-0" />
        <div className="relative z-10 max-w-3xl mx-auto animate-fade-in-up">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight">
            Quantifying the Value of <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">Modern Work</span>
          </h1>
          <p className="text-lg md:text-xl text-[#7A6A5E] mb-8">
            SmartWorkLab helps engineering teams and businesses audit their AI stack,
            verify ROI, and cut through the hype with data-backed reports.
          </p>
        </div>
      </section>

      {/* Founders Section */}
      <section className="py-16 px-6 md:px-12 max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold mb-12 text-center">Meet the Founders</h2>

        <div className="grid md:grid-cols-2 gap-12">
            {/* Yunsup Jung */}
            <div className="bg-[#FDF3E0] border border-[#E8D9BE] p-8 rounded-3xl flex flex-col items-center hover:shadow-cyan-500/10 hover:shadow-2xl transition-all">
                <div className="w-32 h-32 bg-[#F3E6C8] rounded-full mb-6 overflow-hidden border-4 border-[#5FBF8A]/20">
                     {/* Placeholder for real image */}
                     <div className="w-full h-full bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center text-4xl font-bold text-[#7A6A5E]">
                        YJ
                     </div>
                </div>
                <h3 className="text-2xl font-bold mb-2">Yunsup Jung</h3>
                <span className="text-[#3E9B6A] font-mono text-sm mb-4">Co-founder</span>
                <p className="text-[#7A6A5E] text-center mb-6">
                    Software Engineer specializing in scalable infrastructure and AI optimization.
                    Building the core analysis engine that powers SmartWorkLab's verified metrics.
                </p>
                <div className="flex gap-4">
                    <a href="https://github.com/yunsupj" target="_blank" rel="noopener noreferrer" className="p-2 bg-[#F3E6C8] rounded-full hover:bg-slate-700 hover:text-[#3D2C29] transition-colors text-[#7A6A5E]"><Github className="w-5 h-5"/></a>
                    <a href="https://www.linkedin.com/in/yunsupjung/" target="_blank" rel="noopener noreferrer" className="p-2 bg-[#F3E6C8] rounded-full hover:bg-slate-700 hover:text-[#3D2C29] transition-colors text-[#7A6A5E]"><Linkedin className="w-5 h-5"/></a>
                </div>
            </div>

            {/* Chloe Kim */}
            <div className="bg-[#FDF3E0] border border-[#E8D9BE] p-8 rounded-3xl flex flex-col items-center hover:shadow-purple-500/10 hover:shadow-2xl transition-all">
                <div className="w-32 h-32 bg-[#F3E6C8] rounded-full mb-6 overflow-hidden border-4 border-purple-500/20">
                     {/* Placeholder for real image */}
                     <div className="w-full h-full bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center text-4xl font-bold text-[#7A6A5E]">
                        CK
                     </div>
                </div>
                <h3 className="text-2xl font-bold mb-2">Chloe Kim</h3>
                <span className="text-purple-400 font-mono text-sm mb-4">Owner & Co-founder</span>
                <p className="text-[#7A6A5E] text-center mb-6">
                    Product Strategist focused on user experience and business value.
                    Ensuring SmartWorkLab delivers actionable insights that drive real operational efficiency.
                </p>
                <div className="flex gap-4">
                     <a href="https://yuunchloe.com" target="_blank" rel="noopener noreferrer" className="p-2 bg-[#F3E6C8] rounded-full hover:bg-slate-700 hover:text-[#3D2C29] transition-colors text-[#7A6A5E]" title="yuunchloe.com"><Globe className="w-5 h-5"/></a>
                </div>
            </div>
        </div>
      </section>

      {/* Methodology Section */}
      <section className="py-16 px-6 md:px-12 max-w-4xl mx-auto border-t border-[#E8D9BE]">
        <h2 className="text-3xl font-bold mb-8 text-center text-[#3E9B6A]">Our Methodology</h2>
        <div className="bg-white/70 border border-[#E8D9BE] p-8 rounded-3xl">
          <p className="text-[#5C4A42] mb-6 leading-relaxed">
            At SmartWorkLab, we believe in data-driven decision making. That's why every single tool featured on our platform
            undergoes a rigorous evaluation process. Our reviews are not outsourced or generated by generic AI—they are meticulously
            conducted by <strong className="text-[#3D2C29]">ML Engineers</strong>, led by our co-founder Yunsup Jung.
          </p>
          <div className="grid md:grid-cols-3 gap-6 mt-8">
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 bg-cyan-950 rounded-full flex items-center justify-center text-[#3E9B6A] font-bold text-xl mb-4 border border-cyan-800">1</div>
              <h4 className="font-bold text-[#3D2C29] mb-2">Technical Audit</h4>
              <p className="text-sm text-[#7A6A5E]">We inspect the AI stack, models used, and data handling practices.</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 bg-purple-950 rounded-full flex items-center justify-center text-purple-400 font-bold text-xl mb-4 border border-purple-800">2</div>
              <h4 className="font-bold text-[#3D2C29] mb-2">ROI Verification</h4>
              <p className="text-sm text-[#7A6A5E]">Using our AI Savings Calculator logic, we quantify actual hours saved versus cost.</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 bg-blue-950 rounded-full flex items-center justify-center text-blue-400 font-bold text-xl mb-4 border border-blue-800">3</div>
              <h4 className="font-bold text-[#3D2C29] mb-2">Smart Score</h4>
              <p className="text-sm text-[#7A6A5E]">We assign unique scores for Productivity, Privacy, and Integration based on our findings.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Badge Section */}
      <section className="py-20 text-center border-t border-[#E8D9BE]">
          <p className="text-[#97897B] font-mono text-sm mb-4">VERIFIED & TRUSTED TECHNOLOGY</p>
          <div className="flex justify-center gap-8 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
            {/* Mock logos text */}
            <span className="font-bold text-xl">Next.js</span>
            <span className="font-bold text-xl">Supabase</span>
            <span className="font-bold text-xl">OpenAI</span>
            <span className="font-bold text-xl">Vercel</span>
          </div>
      </section>
    </div>
  );
}
