import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import { ArrowRight, Sparkles, Database, Cpu, ExternalLink, Check, Clock, Users, Zap } from 'lucide-react';
import { getTranslations } from 'next-intl/server';
import QuoteButton from '@/components/QuoteButton';
import RsvpDemoModule from '@/components/demos/RsvpDemoModule';
import type { Metadata } from 'next';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'AI Development Services | SmartWorkLab',
  description: 'Custom AI development from RSVP microsites to enterprise RAG systems and production ML pipelines. Entry ($299 launch), Growth ($1,500+), and Enterprise tiers — built by ML engineers.',
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
    description: 'Custom-designed event microsites with RSVP forms, photo guestbooks, countdown timers, and automated reminder emails. Get a custom domain like yourname-rsvp.com for maximum charm.',
    price_usd: 299, price_label: '$299', is_recurring: false, billing_cycle: 'limited launch · scales to $499',
    features: [
      'Custom design & branding',
      'RSVP form + Supabase backend',
      'Photo guestbook with Polaroid layout',
      'Automated email reminders (Resend)',
      'Google Calendar integration',
      'Mobile-first responsive',
      'Custom domain (yourname-rsvp.com)',
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
    description: 'Production-grade RAG systems built on your private data. SOC 2-ready architecture with encrypted vector storage and role-based access control.',
    price_usd: null, price_label: 'From $1,500', is_recurring: false, billing_cycle: 'one-time',
    features: [
      'Document ingestion (PDF, Notion, Confluence)',
      'Vector embeddings (pgvector / Pinecone)',
      'Streaming chat UI with citation display',
      'Admin dashboard for doc management',
      'Multi-tenant auth (Supabase)',
      'Custom LLM routing (GPT-4o / Claude)',
      '🔐 End-to-end encryption at rest & in transit',
      '🔐 Role-based access control (RBAC)',
      '🔐 GDPR-compliant data handling',
      '🔐 Private VPC deployment available',
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
      'VTON / Diffusion model inference pipelines',
      'Agentic workflow orchestration (LangGraph / CrewAI)',
      'Spatial data processing (H3, PostGIS)',
      'GPU inference deployment (Modal / Replicate)',
      'Full CI/CD + monitoring stack',
      'Multi-item VTON with single inference pass',
      'Model quantization & latency optimization',
      'Custom training data pipelines',
      'A/B experiment framework',
      'Real-time inference API with SLA guarantees',
    ],
    deliverables: ['Production ML system', 'Model artifacts & weights', 'Inference API', 'Technical documentation', '90-day SLA support'],
    timeline_days: 60, case_study_slug: 'vton-multi-item-synthesis', demo_url: null,
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
  const t = await getTranslations('Services');

  // NOTE: Always use STATIC_SERVICES as source of truth.
  // We override explicit fields per-language with next-intl mapping.
  const services: AgencyService[] = STATIC_SERVICES.map(svc => {
    if (svc.slug === 'rsvp-event-sites') return { ...svc, tier_label: t('tier_entry'), name: t('svc1_name'), tagline: t('svc1_tagline'), features: t('svc1_features').split('|') };
    if (svc.slug === 'rag-chatbots') return { ...svc, tier_label: t('tier_growth'), name: t('svc2_name'), tagline: t('svc2_tagline'), features: t('svc2_features').split('|') };
    if (svc.slug === 'enterprise-ai-agents') return { ...svc, tier_label: t('tier_enterprise'), name: t('svc3_name'), tagline: t('svc3_tagline'), features: t('svc3_features').split('|') };
    return svc;
  });
  // if (supabase) {
  //   const { data } = await supabase
  //     .from('agency_services')
  //     .select('*')
  //     .eq('status', 'available')
  //     .order('display_order', { ascending: true });
  //   if (data && data.length > 0) services = data;
  // }

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
            {t('hero_badge')}
          </div>

          <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight leading-tight">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-200 to-slate-400">
              {t('hero_title1')}
            </span>
            <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-green-400">
              {t('hero_title2')}
            </span>
          </h1>

          <p className="text-xl text-slate-400 leading-relaxed max-w-2xl mx-auto mb-10">
            {t('hero_subtitle')}
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          {services.map((svc, idx) => {
            const a = ACCENT[svc.accent_color ?? 'cyan'] ?? ACCENT.cyan;
            const Icon = ICON_MAP[svc.icon_name ?? 'Sparkles'] ?? Sparkles;
            const stack = TECH_STACKS[svc.slug] ?? [];
            const isEnterprise = idx === 2;

            return (
              <div
                key={svc.id}
                className={`group relative flex flex-col h-full transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl ${a.glow} mt-4`}
              >
                {/* Background and clipped glow layer */}
                <div className={`absolute inset-0 bg-slate-900/60 backdrop-blur-sm border ${a.border} rounded-2xl overflow-hidden pointer-events-none z-0`}>
                  <div className={`absolute top-0 right-0 w-48 h-48 ${a.bg} rounded-full blur-3xl -mr-16 -mt-16`} />
                </div>

                {/* Absolute Floating Badge on Enterprise */}
                {isEnterprise && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1.5 text-[10px] font-bold font-mono uppercase tracking-widest bg-slate-950 border border-green-500/50 rounded-full text-green-400 z-20 shadow-[0_0_20px_rgba(34,197,94,0.15)] whitespace-nowrap">
                    ⭐ Most Advanced
                  </div>
                )}

                <div className="relative z-10 p-8 flex flex-col flex-1 h-full">
                  {/* Expert-Led Implementation Badge */}
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 mb-6 text-[9px] font-mono font-bold uppercase tracking-widest border border-slate-700/50 rounded-full text-slate-400 bg-slate-800/30 w-fit">
                    Expert-Led Implementation
                  </div>

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
                  <h2 className="text-xl font-bold text-white mb-1 leading-snug font-[family-name:var(--font-geist-sans)]">{svc.name}</h2>
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

                  {/* Features — scrollable on Enterprise to keep grid balanced */}
                  <div className="flex-grow">
                    {svc.features && (
                      <ul className={`space-y-2.5 mb-6 ${
                        svc.slug === 'enterprise-ai-agents'
                          ? 'max-h-56 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent'
                          : ''
                      }`}>
                        {svc.features.map((f, i) => (
                          <li key={i} className="flex items-start gap-2.5 text-sm text-slate-300 leading-relaxed">
                            {f.startsWith('🔐') ? (
                              <span className="flex-shrink-0 mt-0.5 text-base leading-none">{f.slice(0, 2)}</span>
                            ) : (
                              <Check className={`w-4 h-4 flex-shrink-0 mt-0.5 ${a.text}`} />
                            )}
                            {f.startsWith('🔐') ? f.slice(2).trim() : f}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>

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
                    {/* VTON case study link on Enterprise */}
                    {svc.case_study_slug && (
                      <a
                        href={`/${(svc as any).locale ?? 'en'}/lab/${svc.case_study_slug}`}
                        className={`inline-flex items-center justify-center gap-2 px-5 py-2 rounded-full text-xs font-mono border ${a.border} ${a.text} hover:${a.bg} transition-all`}
                      >
                        📖 Technical Case Study: VTON Multi-Item Synthesis
                      </a>
                    )}

                    {/* Live Sample link (replaces Theme Gallery) */}
                    {svc.demo_url && (
                      <a
                        href={svc.demo_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold text-white bg-gradient-to-r ${a.btnFrom} ${a.btnTo} transition-all duration-300 hover:shadow-lg ${a.btnShadow} hover:-translate-y-0.5`}
                      >
                        <ExternalLink className="w-4 h-4" />
                        View Live Sample
                      </a>
                    )}

                    {/* Quote CTA Client State Component Wrapper */}
                    <QuoteButton serviceName={svc.name} label={t('get_quote')} />
                  </div>
                </div>


              </div>
            );
          })}
        </div>
      </section>


      {/* ── Comparison Table ── */}
      <section className="max-w-4xl mx-auto px-6 pb-2.5">
        <div className="text-center mb-10">
          <h2 className="text-2xl font-bold text-white mb-2">Why Not Just DIY?</h2>
          <p className="text-slate-400 text-sm">The real cost of generic tools adds up quickly.</p>
        </div>

        <div className="rounded-2xl border border-slate-800 overflow-hidden">
          {/* Table header */}
          <div className="grid grid-cols-3 bg-slate-900 border-b border-slate-800">
            <div className="px-6 py-4 text-xs font-mono text-slate-500 uppercase tracking-widest">Feature</div>
            <div className="px-6 py-4 text-xs font-mono text-red-400/80 uppercase tracking-widest border-l border-slate-800">
              DIY / Generic Tools
            </div>
            <div className="px-6 py-4 text-xs font-mono text-cyan-400 uppercase tracking-widest border-l border-slate-800">
              SmartWorkLab Build
            </div>
          </div>

          {/* Rows */}
          {[
            {
              feature: 'Initial Setup',
              diy: 'Hours of config & debugging',
              swl: 'Handled end-to-end by us',
            },
            {
              feature: 'Ongoing Maintenance',
              diy: 'You own every bug & update',
              swl: 'No maintenance burden — SLA included',
            },
            {
              feature: 'Performance',
              diy: 'Generic templates, slow cold starts',
              swl: 'Optimized for Core Web Vitals & edge delivery',
            },
            {
              feature: 'Custom Domain',
              diy: 'Extra cost, manual DNS setup',
              swl: 'Included — yourname-rsvp.com ready to go',
            },
            {
              feature: 'Design Quality',
              diy: 'Drag-and-drop limitations',
              swl: 'Pixel-perfect, brand-matched UI',
            },
            {
              feature: 'Security',
              diy: 'Shared SaaS infrastructure',
              swl: 'Private Supabase + RBAC + encryption at rest',
            },
            {
              feature: 'Support',
              diy: 'Community forums / ticket queue',
              swl: '30–90 day direct engineer support',
            },
          ].map(({ feature, diy, swl }, i) => (
            <div
              key={feature}
              className={`grid grid-cols-3 border-b border-slate-800/60 last:border-0 ${
                i % 2 === 0 ? 'bg-slate-950/30' : ''
              }`}
            >
              <div className="px-6 py-4 text-sm font-semibold text-slate-300">{feature}</div>
              <div className="px-6 py-4 text-sm text-red-400/70 border-l border-slate-800/60 flex items-start gap-2">
                <span className="text-red-500 mt-0.5 flex-shrink-0">✕</span>
                {diy}
              </div>
              <div className="px-6 py-4 text-sm text-cyan-300/90 border-l border-slate-800/60 flex items-start gap-2">
                <span className="text-cyan-400 mt-0.5 flex-shrink-0">✓</span>
                {swl}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Process Timeline ── */}
      <section className="max-w-4xl mx-auto px-6 pt-8 pb-0">
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
    </div>
  );
}
