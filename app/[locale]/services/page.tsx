import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import { ArrowRight, Sparkles, Database, Cpu, ExternalLink, Check, Clock, Users, Zap } from 'lucide-react';
import ServiceInquiry from '@/components/ServiceInquiry';
import RsvpDemoModule from '@/components/demos/RsvpDemoModule';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'AI Development Services | SmartWorkLab',
  description: 'Custom AI development from RSVP microsites to enterprise RAG systems and production ML pipelines. Entry ($499), Growth ($1,500+), and Enterprise tiers — built by ML engineers.',
  alternates: { canonical: 'https://smartworklab.store/en/services' },
};

interface AgencyService {
  id: string;
  slug: string;
  tier: string;
  tier_label: string;
  name: string;
  tagline: string | null;
  description: string | null;
  price_usd: number | null;
  price_label: string | null;
  is_recurring: boolean;
  billing_cycle: string | null;
  features: string[] | null;
  deliverables: string[] | null;
  timeline_days: number | null;
  case_study_slug: string | null;
  demo_url: string | null;
  status: string;
  display_order: number;
  icon_name: string | null;
  accent_color: string | null;
}

// Static fallback data (renders before DB is seeded)
const STATIC_SERVICES: AgencyService[] = [
  {
    id: '1', slug: 'rsvp-event-sites', tier: 'tier_1', tier_label: 'Entry',
    name: 'RSVP & Event Microsites',
    tagline: 'Beautiful event sites, built in days.',
    description: 'Custom-designed event microsites with RSVP forms, photo guestbooks, countdown timers, and automated reminder emails. Perfect for birthday parties, weddings, and brand activations.',
    price_usd: 499, price_label: 'Starting at $499', is_recurring: false, billing_cycle: 'one-time',
    features: [
      'Custom design & branding',
      'RSVP form + Supabase backend',
      'Photo guestbook with Polaroid layout',
      'Automated email reminders (Resend)',
      'Google Calendar integration',
      'Mobile-first responsive',
    ],
    deliverables: ['Deployed Next.js site on Vercel', 'Custom domain setup', 'Source code handoff', '30-day support'],
    timeline_days: 7, case_study_slug: null,
    demo_url: 'https://ellie-bday-rouge.vercel.app',
    status: 'available', display_order: 1, icon_name: 'Sparkles', accent_color: 'cyan',
  },
  {
    id: '2', slug: 'rag-chatbots', tier: 'tier_2', tier_label: 'Growth',
    name: 'RAG Chatbots & Knowledge Bases',
    tagline: 'Your documents, instantly queryable.',
    description: 'Production-grade Retrieval-Augmented Generation (RAG) systems built on your private data. Supports PDFs, Notion exports, and Confluence wikis with a branded chat UI.',
    price_usd: null, price_label: 'From $1,500', is_recurring: false, billing_cycle: 'one-time',
    features: [
      'Document ingestion (PDF, Notion, Confluence)',
      'Vector embeddings (pgvector / Pinecone)',
      'Streaming chat UI with citation display',
      'Admin dashboard for doc management',
      'Multi-tenant auth (Supabase)',
      'Custom LLM routing (GPT-4o / Claude)',
    ],
    deliverables: ['Deployed RAG application', 'Admin CMS', 'Embedding pipeline', 'Monitoring dashboard', '60-day support'],
    timeline_days: 21, case_study_slug: null, demo_url: null,
    status: 'available', display_order: 2, icon_name: 'Database', accent_color: 'purple',
  },
  {
    id: '3', slug: 'enterprise-ai-agents', tier: 'tier_3', tier_label: 'Enterprise',
    name: 'Enterprise AI Agents & Custom ML',
    tagline: 'Custom models. Real production deployments.',
    description: 'End-to-end AI agent systems and custom ML implementations — VTON inference pipelines, multi-step agentic workflows, spatial data processing, and fine-tuned model deployment.',
    price_usd: null, price_label: 'Custom Quote', is_recurring: false, billing_cycle: 'one-time',
    features: [
      'Custom ML model development & fine-tuning',
      'VTON / Diffusion model pipelines',
      'Agentic workflow orchestration (LangGraph / CrewAI)',
      'Spatial data processing (H3, PostGIS)',
      'GPU inference deployment (Modal / Replicate)',
      'Full CI/CD + monitoring stack',
    ],
    deliverables: ['Production ML system', 'Model artifacts & weights', 'Inference API', 'Technical documentation', '90-day SLA support'],
    timeline_days: 60, case_study_slug: null, demo_url: null,
    status: 'available', display_order: 3, icon_name: 'Cpu', accent_color: 'green',
  },
];

const ACCENT: Record<string, {
  border: string; text: string; bg: string; badge: string;
  glow: string; btnFrom: string; btnTo: string; btnShadow: string;
}> = {
  cyan:   { border:'border-cyan-500/30',   text:'text-cyan-400',   bg:'bg-cyan-950/20',   badge:'bg-cyan-950/50 border-cyan-800/40',   glow:'group-hover:shadow-cyan-900/30',   btnFrom:'from-cyan-400',   btnTo:'to-sky-400',    btnShadow:'hover:shadow-cyan-900/50' },
  purple: { border:'border-purple-500/30', text:'text-purple-400', bg:'bg-purple-950/20', badge:'bg-purple-950/50 border-purple-800/40', glow:'group-hover:shadow-purple-900/30', btnFrom:'from-purple-400', btnTo:'to-violet-400', btnShadow:'hover:shadow-purple-900/50' },
  green:  { border:'border-green-500/30',  text:'text-green-400',  bg:'bg-green-950/20',  badge:'bg-green-950/50 border-green-800/40',  glow:'group-hover:shadow-green-900/30',  btnFrom:'from-green-400',  btnTo:'to-emerald-400', btnShadow:'hover:shadow-green-900/50' },
};

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = { Sparkles, Database, Cpu };

const TECH_STACKS: Record<string, string[]> = {
  'rsvp-event-sites':       ['Next.js 15', 'Supabase', 'Resend', 'Vercel'],
  'rag-chatbots':           ['LangChain', 'pgvector', 'GPT-4o', 'Supabase'],
  'enterprise-ai-agents':   ['PyTorch', 'LangGraph', 'Modal', 'CrewAI'],
};

export default async function ServicesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;

  let services: AgencyService[] = STATIC_SERVICES;
  if (supabase) {
    const { data } = await supabase
      .from('agency_services')
      .select('*')
      .eq('status', 'available')
      .order('display_order', { ascending: true });
    if (data && data.length > 0) services = data;
  }

  return (
    <div className="bg-slate-950 text-white min-h-screen">

      {/* ── Hero ── */}
      <header className="relative overflow-hidden pt-24 pb-20 text-center">
        {/* Animated grid background */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          <div className="absolute inset-0 opacity-[0.04]"
            style={{ backgroundImage: 'linear-gradient(rgba(34,211,238,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(34,211,238,0.5) 1px, transparent 1px)', backgroundSize: '60px 60px' }}
          />
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-600/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-green-600/10 rounded-full blur-3xl" />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 mb-6 text-xs font-mono text-green-400 border border-green-500/30 rounded-full bg-green-950/30 uppercase tracking-widest">
            <Sparkles className="w-3 h-3" />
            SmartWorkLab · AI Agency
          </div>

          <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight leading-tight">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-200 to-slate-400">
              We Build AI.
            </span>
            <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-green-400">
              You Scale.
            </span>
          </h1>

          <p className="text-xl text-slate-400 leading-relaxed max-w-2xl mx-auto mb-10">
            From polished event microsites to production RAG systems and custom VTON inference pipelines — built by ML engineers, shipped fast.
          </p>

          {/* Social proof strip */}
          <div className="flex flex-wrap justify-center gap-8 text-sm text-slate-500">
            {[
              { icon: <Zap className="w-4 h-4 text-yellow-400" />, label: '7-day delivery for Tier 1' },
              { icon: <Users className="w-4 h-4 text-cyan-400" />, label: 'ML-engineer–led builds' },
              { icon: <Clock className="w-4 h-4 text-green-400" />, label: 'Response within 24 hours' },
            ].map(({ icon, label }) => (
              <div key={label} className="flex items-center gap-2">
                {icon}
                <span>{label}</span>
              </div>
            ))}
          </div>
        </div>
      </header>

      {/* ── 3-Tier Service Cards ── */}
      <section className="max-w-7xl mx-auto px-6 pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {services.map((svc, idx) => {
            const a = ACCENT[svc.accent_color ?? 'cyan'] ?? ACCENT.cyan;
            const Icon = ICON_MAP[svc.icon_name ?? 'Sparkles'] ?? Sparkles;
            const stack = TECH_STACKS[svc.slug] ?? [];
            const isEnterprise = idx === 2;

            return (
              <div
                key={svc.id}
                className={`group relative flex flex-col bg-slate-900/60 backdrop-blur-sm border ${a.border} rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl ${a.glow} ${isEnterprise ? 'lg:scale-105' : ''}`}
              >
                {/* "Most Popular" banner on Enterprise */}
                {isEnterprise && (
                  <div className={`text-center py-2 text-xs font-bold font-mono uppercase tracking-widest ${a.bg} ${a.text} border-b ${a.border}`}>
                    ⭐ Most Advanced
                  </div>
                )}

                {/* Glow orb */}
                <div className={`absolute top-0 right-0 w-48 h-48 ${a.bg} rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none`} />

                <div className="relative z-10 p-8 flex flex-col flex-1">
                  {/* Icon + tier badge */}
                  <div className="flex items-start justify-between mb-5">
                    <div className={`w-11 h-11 rounded-xl ${a.badge} border flex items-center justify-center flex-shrink-0`}>
                      <Icon className={`w-5 h-5 ${a.text}`} />
                    </div>
                    <span className={`text-[10px] font-mono font-bold uppercase tracking-widest px-2.5 py-1 rounded-full border ${a.badge} ${a.text}`}>
                      {svc.tier_label}
                    </span>
                  </div>

                  {/* Name + tagline */}
                  <h2 className="text-xl font-bold text-white mb-1 leading-snug">{svc.name}</h2>
                  {svc.tagline && (
                    <p className={`text-sm font-medium mb-3 ${a.text}`}>{svc.tagline}</p>
                  )}
                  {svc.description && (
                    <p className="text-sm text-slate-400 leading-relaxed mb-5">{svc.description}</p>
                  )}

                  {/* Price */}
                  <div className="mb-5">
                    <span className={`text-3xl font-bold ${a.text}`}>{svc.price_label}</span>
                    {svc.billing_cycle && (
                      <span className="text-xs text-slate-500 ml-2 font-mono">{svc.billing_cycle}</span>
                    )}
                  </div>

                  {/* Features */}
                  {svc.features && (
                    <ul className="space-y-2.5 mb-6">
                      {svc.features.map((f, i) => (
                        <li key={i} className="flex items-start gap-2.5 text-sm text-slate-300">
                          <Check className={`w-4 h-4 flex-shrink-0 mt-0.5 ${a.text}`} />
                          {f}
                        </li>
                      ))}
                    </ul>
                  )}

                  {/* Tech stack badges */}
                  {stack.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-6">
                      {stack.map(t => (
                        <span key={t} className="text-[10px] font-mono text-slate-500 bg-slate-800 border border-slate-700 rounded px-2 py-0.5">
                          {t}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Timeline */}
                  {svc.timeline_days && (
                    <p className="text-xs text-slate-600 mb-6 font-mono">
                      <Clock className="w-3 h-3 inline mr-1" />
                      Est. delivery: {svc.timeline_days} days
                    </p>
                  )}

                  {/* CTA buttons */}
                  <div className="mt-auto flex flex-col gap-3">
                    {/* Live demo link (Tier 1 only) */}
                    {svc.demo_url && (
                      <a
                        href={svc.demo_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold text-white bg-gradient-to-r ${a.btnFrom} ${a.btnTo} transition-all duration-300 hover:shadow-lg ${a.btnShadow} hover:-translate-y-0.5`}
                      >
                        <ExternalLink className="w-4 h-4" />
                        Live Demo
                      </a>
                    )}

                    {/* Quote CTA */}
                    <a
                      href={`mailto:smartworklab.store@gmail.com?subject=[Inquiry] ${encodeURIComponent(svc.name)}`}
                      className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold border transition-all duration-300 hover:bg-slate-800"
                      style={{ borderColor: 'rgb(51,65,85)', color: 'rgb(148,163,184)' }}
                    >
                      Get a Free Quote <ArrowRight className="w-4 h-4" />
                    </a>
                  </div>
                </div>

                {/* Tier 1 only: Interactive RSVP Demo */}
                {svc.slug === 'rsvp-event-sites' && (
                  <div className="border-t border-slate-800/60 p-6 bg-slate-950/40">
                    <p className="text-xs font-mono text-slate-500 uppercase tracking-widest mb-4 text-center">
                      ✦ Interactive Preview — Try the themes
                    </p>
                    <RsvpDemoModule compact={true} />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* ── Process Timeline ── */}
      <section className="max-w-4xl mx-auto px-6 pb-24">
        <h2 className="text-2xl font-bold text-center mb-12 text-white">How It Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {/* Connector line */}
          <div className="hidden md:block absolute top-8 left-1/3 right-1/3 h-px bg-gradient-to-r from-cyan-800/0 via-cyan-600/40 to-green-800/0" />

          {[
            { step: '01', title: 'Discovery', desc: 'We align on scope, tech stack, and design direction. 30-min call or async doc.', color: 'text-cyan-400' },
            { step: '02', title: 'Build', desc: 'Engineering sprint with daily async updates. You see real progress, not promises.', color: 'text-purple-400' },
            { step: '03', title: 'Deploy', desc: 'Production deploy on Vercel + Supabase. Docs handoff. Support period begins.', color: 'text-green-400' },
          ].map(({ step, title, desc, color }) => (
            <div key={step} className="text-center flex flex-col items-center">
              <div className={`w-16 h-16 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center mb-4 font-mono font-bold text-xl ${color}`}>
                {step}
              </div>
              <h3 className="font-bold text-white mb-2">{title}</h3>
              <p className="text-sm text-slate-400 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Service Inquiry Form ── */}
      <section className="max-w-3xl mx-auto px-6 pb-32">
        <h2 className="text-2xl font-bold text-center text-white mb-3">Start a Project</h2>
        <p className="text-center text-slate-400 mb-10 text-sm">Describe your project and we'll respond within 24 hours.</p>
        <ServiceInquiry />
      </section>
    </div>
  );
}
