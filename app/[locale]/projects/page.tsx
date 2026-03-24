import { Sparkles, Trophy, MapPin, PartyPopper } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Featured Projects | SmartWorkLab',
  description: 'Explore our latest AI implementations, from real-time computer vision to geospatial ad-networks and interactive event platforms.',
};

const PROJECTS = [
  {
    id: 'pickle-ai',
    title: 'Pickle AI',
    tagline: 'Real-Time Edge Computer Vision',
    icon: Trophy,
    color: 'emerald',
    problem: 'Computer vision is computationally expensive and notoriously hard to deploy at the edge for amateur sports at scale.',
    solution: 'A distributed edge-compute architecture using heavily optimized quantization. The pipeline tracks, infers, and scores live pickleball games entirely on-device, syncing results asynchronously to cloud leaderboards to guarantee zero latency.',
    stack: ['PyTorch', 'C++', 'Edge TPU', 'Supabase'],
  },
  {
    id: 'mapz',
    title: 'Mapz',
    tagline: 'High-Throughput Geospatial Ad-Network',
    icon: MapPin,
    color: 'purple',
    problem: 'Rewarding users in real-time for visiting physical coordinates causes massive geospatial database bottlenecks and transaction latency.',
    solution: "We implemented Uber's H3 spatial sharding index combined with a high-throughput Redis buffer. This isolates concurrent read/writes, enabling the system to securely process thousands of location check-ins per second on Solana without lag.",
    stack: ['Next.js', 'PostGIS', 'H3', 'Solana Web3.js'],
  },
  {
    id: 'rsvp-product',
    title: 'Bespoke RSVP Engine',
    tagline: 'Scaleable Event Infrastructure',
    icon: PartyPopper,
    color: 'cyan',
    problem: 'Generic event platforms look dated, suffer from awful UX, and charge exorbitant fees for basic "premium" features like photo galleries or domain linking.',
    solution: 'A fully custom, code-driven RSVP pipeline. Engineered with Next.js and Supabase for infinite scale, featuring a dynamic configuration engine that instantly shifts aesthetics, animations, and automated Resend email reminders.',
    stack: ['React', 'Tailwind', 'Resend', 'Supabase Auth'],
  },
];

const COLOR_MAP: Record<string, { bg: string; text: string; border: string; glow: string }> = {
  emerald: { bg: 'bg-emerald-950/20', text: 'text-emerald-400', border: 'border-emerald-500/30', glow: 'shadow-emerald-900/20' },
  purple: { bg: 'bg-purple-950/20', text: 'text-purple-400', border: 'border-purple-500/30', glow: 'shadow-purple-900/20' },
  cyan: { bg: 'bg-cyan-950/20', text: 'text-cyan-400', border: 'border-cyan-500/30', glow: 'shadow-cyan-900/20' },
};

export default function ProjectsPage() {
  return (
    <div className="bg-slate-950 text-white min-h-screen">
      
      {/* ── Hero ── */}
      <header className="relative pt-32 pb-20 text-center overflow-hidden">
        <div className="absolute inset-0 z-0 pointer-events-none">
          <div className="absolute top-0 right-1/4 w-96 h-96 bg-cyan-600/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl" />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 mb-6 text-xs font-mono text-cyan-400 border border-cyan-500/30 rounded-full bg-cyan-950/30 uppercase tracking-widest">
            <Sparkles className="w-3 h-3" /> Featured Work
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold mb-6 font-[family-name:var(--font-geist-sans)] tracking-tight">
            Proof of <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-emerald-400">Work.</span>
          </h1>
          <p className="text-xl text-slate-400 leading-relaxed max-w-2xl mx-auto">
            A selection of production-grade systems we've shipped. Real problems, engineered solutions.
          </p>
        </div>
      </header>

      {/* ── Projects List ── */}
      <section className="max-w-5xl mx-auto px-6 pb-24 space-y-12">
        {PROJECTS.map((proj) => {
          const c = COLOR_MAP[proj.color];
          const Icon = proj.icon;
          return (
            <div key={proj.id} className={`relative bg-slate-900/50 border border-slate-800 rounded-3xl overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:${c.glow} group`}>
              
              {/* Subtle accent glow */}
              <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-32 opacity-30 blur-[80px] pointer-events-none ${c.bg}`} />

              <div className="relative z-10 p-8 md:p-12">
                <div className="flex flex-col md:flex-row md:items-start gap-8">
                  
                  {/* Left Column: Title & Stack */}
                  <div className="md:w-1/3 flex-shrink-0">
                    <div className={`w-12 h-12 rounded-xl border ${c.border} ${c.bg} flex items-center justify-center mb-6`}>
                      <Icon className={`w-6 h-6 ${c.text}`} />
                    </div>
                    <h2 className="text-3xl font-bold font-[family-name:var(--font-geist-sans)] mb-2">{proj.title}</h2>
                    <p className={`text-sm font-semibold font-mono uppercase tracking-widest mb-8 ${c.text}`}>
                      {proj.tagline}
                    </p>

                    <div className="flex flex-wrap gap-2">
                      {proj.stack.map(tech => (
                        <span key={tech} className="px-3 py-1 text-xs font-mono text-slate-400 bg-slate-950/50 border border-slate-800 rounded-full">
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Right Column: Problem / Solution */}
                  <div className="md:w-2/3 space-y-8 mt-4 md:mt-0">
                    
                    {/* Problem */}
                    <div className="bg-slate-950/40 rounded-2xl p-6 border border-slate-800/60">
                      <div className="flex items-center gap-2 mb-3">
                        <span className="flex items-center justify-center w-6 h-6 rounded-full bg-red-500/20 text-red-400 text-xs font-bold border border-red-500/30">✕</span>
                        <h4 className="text-sm font-mono font-bold uppercase tracking-widest text-slate-400">The Problem</h4>
                      </div>
                      <p className="text-slate-300 leading-relaxed text-sm md:text-base">
                        {proj.problem}
                      </p>
                    </div>

                    {/* Solution */}
                    <div className={`bg-gradient-to-br from-slate-900 to-slate-950 rounded-2xl p-6 border ${c.border} relative overflow-hidden`}>
                      <div className={`absolute top-0 right-0 w-32 h-32 -mr-16 -mt-16 rounded-full blur-3xl opacity-20 pointer-events-none ${c.bg}`} />
                      <div className="flex items-center gap-2 mb-3 relative z-10">
                        <span className={`flex items-center justify-center w-6 h-6 rounded-full ${c.bg} ${c.text} text-xs font-bold border ${c.border}`}>✓</span>
                        <h4 className={`text-sm font-mono font-bold uppercase tracking-widest ${c.text}`}>The Solution</h4>
                      </div>
                      <p className="text-white leading-relaxed font-medium text-sm md:text-base relative z-10">
                        {proj.solution}
                      </p>
                    </div>

                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </section>
    </div>
  );
}
