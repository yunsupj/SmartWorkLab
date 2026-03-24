import { Sparkles, MapPin, PartyPopper, ArrowRight, BookOpen } from 'lucide-react';
import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Featured Projects | SmartWorkLab',
  description: 'Explore our latest AI implementations, from real-time computer vision to geospatial ad-networks and interactive event platforms.',
};

const SECONDARY_PROJECTS = [
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
  purple: { bg: 'bg-purple-950/20', text: 'text-purple-400', border: 'border-purple-500/30', glow: 'shadow-purple-900/20' },
  cyan: { bg: 'bg-cyan-950/20', text: 'text-cyan-400', border: 'border-cyan-500/30', glow: 'shadow-cyan-900/20' },
};

export default function ProjectsPage({ params }: { params: { locale?: string } }) {
  const locale = params?.locale ?? 'en';

  return (
    <div className="bg-slate-950 text-slate-400 min-h-screen">

      {/* ── Hero ── */}
      <header className="relative pt-32 pb-16 text-center overflow-hidden">
        <div className="absolute inset-0 z-0 pointer-events-none">
          <div className="absolute top-0 right-1/4 w-96 h-96 bg-cyan-600/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl" />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 mb-6 text-xs font-mono text-cyan-400 border border-cyan-500/30 rounded-full bg-cyan-950/30 uppercase tracking-widest">
            <Sparkles className="w-3 h-3" /> Featured Work
          </div>

          <h1 className="text-5xl md:text-7xl font-bold mb-6 font-[family-name:var(--font-geist-sans)] text-slate-100 tracking-tight">
            Proof of <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-emerald-400">Work.</span>
          </h1>
          <p className="text-xl leading-relaxed max-w-2xl mx-auto">
            A selection of production-grade systems we've shipped. Real problems, engineered solutions.
          </p>
        </div>
      </header>

      {/* ── Pickle AI Bento Box Flagship ── */}
      <section className="max-w-6xl mx-auto px-6 pb-20">
        <div className="relative bg-slate-900 border border-slate-800 rounded-3xl p-8 md:p-12 overflow-hidden shadow-2xl">

          {/* Subtle Accent Glow */}
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-cyan-500/5 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none" />

          {/* Header & Badges */}
          <div className="relative z-10 mb-10">
            <h2 className="text-3xl md:text-4xl font-bold font-[family-name:var(--font-geist-sans)] text-slate-100 mb-3 tracking-tight">
              🥒 Pickle AI: Hyper-Scale AI Shopping Agent & VTON Engine
            </h2>
            <p className="text-lg md:text-xl text-slate-300 font-medium mb-6">
              "Snap. Fit. Jar. — The social identity engine built for 100M DAU."
            </p>

            <div className="flex flex-wrap gap-3">
              {[
                '100M DAU Scalable',
                'Sub-100ms Latency',
                'pgvector HNSW'
              ].map(badge => (
                <span key={badge} className="px-3 py-1 text-xs font-mono font-bold text-cyan-300 border border-cyan-500/50 rounded-md bg-cyan-950/30 shadow-[0_0_10px_rgba(34,211,238,0.1)]">
                  [{badge}]
                </span>
              ))}
            </div>
          </div>

          {/* Problem vs Solution Grid (gap-8, py-12) */}
          <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-8 py-12 border-y border-slate-800/60 mb-10">

            {/* The Problem (Left) */}
            <div className="bg-rose-950/10 border border-rose-500/30 rounded-2xl p-8 flex flex-col justify-center shadow-[inset_0_0_20px_rgba(244,63,94,0.02)]">
              <div className="flex items-center gap-2 mb-6">
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-rose-500/20 text-rose-400 text-xs font-bold border border-rose-500/30">✕</span>
                <h3 className="text-sm font-mono font-bold uppercase tracking-widest text-rose-400">The Problem</h3>
              </div>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <span className="text-rose-500 mt-1">•</span>
                  <span className="text-slate-300 leading-relaxed"><strong className="text-slate-200">Latency = Death:</strong> Users drop off if VTON inference takes ~10s.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-rose-500 mt-1">•</span>
                  <span className="text-slate-300 leading-relaxed"><strong className="text-slate-200">Fragmented OOTD context:</strong> Difficulty stitching scattered wardrobe state across devices.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-rose-500 mt-1">•</span>
                  <span className="text-slate-300 leading-relaxed"><strong className="text-slate-200">Database row-level locking:</strong> Massive bottlenecks during viral traffic storms rendering standard architectures useless.</span>
                </li>
              </ul>
            </div>

            {/* The Solution (Right) */}
            <div className="bg-cyan-950/10 border border-cyan-500/30 rounded-2xl p-8 flex flex-col justify-center shadow-[inset_0_0_20px_rgba(34,211,238,0.02)] relative overflow-hidden">
              <div className="absolute bottom-0 right-0 w-48 h-48 bg-cyan-500/10 blur-3xl rounded-full pointer-events-none" />
              <div className="flex items-center gap-2 mb-6 relative z-10">
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-cyan-500/20 text-cyan-400 text-xs font-bold border border-cyan-500/30">✓</span>
                <h3 className="text-sm font-mono font-bold uppercase tracking-widest text-cyan-400">The Solution</h3>
              </div>
              <ul className="space-y-4 relative z-10">
                <li className="flex items-start gap-3">
                  <span className="text-cyan-400 mt-1">✓</span>
                  <span className="text-slate-300 leading-relaxed"><strong className="text-cyan-100">Ghost Speed:</strong> 13-parallel DB fetches via React Router v7 bypassing waterfalls.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-cyan-400 mt-1">✓</span>
                  <span className="text-slate-300 leading-relaxed"><strong className="text-cyan-100">VTON Chain Orchestration:</strong> Multi-stage Deno Edge Function pipelines with circuit breakers.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-cyan-400 mt-1">✓</span>
                  <span className="text-slate-300 leading-relaxed"><strong className="text-cyan-100">Style DNA:</strong> Hybrid time-decay + vector similarity search in PostgreSQL executing in 50ms.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-cyan-400 mt-1">✓</span>
                  <span className="text-slate-300 leading-relaxed"><strong className="text-cyan-100">Wearable Ecosystem:</strong> iOS Capacitor bridge to Apple Watch creating persistent authentication.</span>
                </li>
              </ul>
            </div>

          </div>

          {/* Tech Stack Footer */}
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex flex-wrap gap-2">
              {[
                'React Router v7', 'PostgreSQL 16', 'Upstash Redis',
                'Deno Edge Functions', 'Fashn.ai', 'Capacitor 6', 'SwiftUI'
              ].map(tech => (
                <span key={tech} className="px-3 py-1.5 text-xs font-mono text-slate-300 bg-slate-800 border border-slate-700/50 rounded-full">
                  {tech}
                </span>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 flex-shrink-0">
              <Link
                href={`/${locale}/services`}
                className="inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-bold text-slate-900 bg-cyan-400 hover:bg-cyan-300 rounded-full transition-colors shadow-[0_0_15px_rgba(34,211,238,0.4)] hover:shadow-[0_0_20px_rgba(34,211,238,0.6)]"
              >
                Request an Enterprise Build <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href={`/${locale}/lab`}
                className="inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-bold text-slate-300 border border-slate-600 rounded-full hover:border-slate-400 hover:text-white transition-colors"
              >
                Read Architecture Deep-Dive <BookOpen className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Secondary Projects ── */}
      <section className="max-w-5xl mx-auto px-6 pb-24 space-y-12">
        <h3 className="text-2xl font-bold font-[family-name:var(--font-geist-sans)] border-b border-slate-800 pb-4 mb-8 text-slate-100">
          More Engineering Case Studies
        </h3>

        {SECONDARY_PROJECTS.map((proj) => {
          const c = COLOR_MAP[proj.color];
          const Icon = proj.icon;
          return (
            <div key={proj.id} className={`relative bg-slate-900/50 border border-slate-800 rounded-3xl overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:${c.glow} group`}>

              <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-32 opacity-30 blur-[80px] pointer-events-none ${c.bg}`} />

              <div className="relative z-10 p-8 md:p-12">
                <div className="flex flex-col md:flex-row md:items-start gap-8">

                  {/* Left Column: Title & Stack */}
                  <div className="md:w-1/3 flex-shrink-0">
                    <div className={`w-12 h-12 rounded-xl border ${c.border} ${c.bg} flex items-center justify-center mb-6`}>
                      <Icon className={`w-6 h-6 ${c.text}`} />
                    </div>
                    <h2 className="text-2xl font-bold font-[family-name:var(--font-geist-sans)] mb-2 text-slate-100">{proj.title}</h2>
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
                    <div className="bg-slate-950/40 rounded-2xl p-6 border border-slate-800/60">
                      <div className="flex items-center gap-2 mb-3">
                        <span className="flex items-center justify-center w-6 h-6 rounded-full bg-red-500/20 text-red-400 text-xs font-bold border border-red-500/30">✕</span>
                        <h4 className="text-sm font-mono font-bold uppercase tracking-widest text-slate-400">The Problem</h4>
                      </div>
                      <p className="text-slate-300 leading-relaxed text-sm md:text-base">
                        {proj.problem}
                      </p>
                    </div>

                    <div className={`bg-gradient-to-br from-slate-900 to-slate-950 rounded-2xl p-6 border ${c.border} relative overflow-hidden`}>
                      <div className={`absolute top-0 right-0 w-32 h-32 -mr-16 -mt-16 rounded-full blur-3xl opacity-20 pointer-events-none ${c.bg}`} />
                      <div className="flex items-center gap-2 mb-3 relative z-10">
                        <span className={`flex items-center justify-center w-6 h-6 rounded-full ${c.bg} ${c.text} text-xs font-bold border ${c.border}`}>✓</span>
                        <h4 className={`text-sm font-mono font-bold uppercase tracking-widest ${c.text}`}>The Solution</h4>
                      </div>
                      <p className="text-slate-200 leading-relaxed font-medium text-sm md:text-base relative z-10">
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
