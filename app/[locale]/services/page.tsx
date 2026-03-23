import { supabase } from '@/lib/supabase';
import { ArrowRight, Sparkles, Database, Cpu, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import ServiceInquiry from '@/components/ServiceInquiry';

interface AgencyService {
  id: string;
  slug: string;
  tier: string;
  tier_label: string;
  name: string;
  tagline: string | null;
  description: string | null;
  price_label: string | null;
  features: string[] | null;
  deliverables: string[] | null;
  timeline_days: number | null;
  demo_url: string | null;
  status: string;
  icon_name: string | null;
  accent_color: string | null;
}

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  Sparkles, Database, Cpu,
};

const ACCENT_COLORS: Record<string, { border: string; text: string; bg: string; badge: string }> = {
  cyan:   { border: 'border-cyan-500/30',   text: 'text-cyan-400',   bg: 'bg-cyan-950/30',   badge: 'bg-cyan-950/50 border-cyan-800/50' },
  purple: { border: 'border-purple-500/30', text: 'text-purple-400', bg: 'bg-purple-950/30', badge: 'bg-purple-950/50 border-purple-800/50' },
  green:  { border: 'border-green-500/30',  text: 'text-green-400',  bg: 'bg-green-950/30',  badge: 'bg-green-950/50 border-green-800/50' },
};

export const metadata = {
  title: 'AI Development Services | SmartWorkLab',
  description: 'Custom AI development from RSVP microsites to enterprise RAG systems and production ML pipelines. Built by SmartWorkLab engineers.',
  alternates: { canonical: 'https://smartworklab.store/en/services' },
};

export default async function ServicesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;

  let services: AgencyService[] = [];

  if (supabase) {
    const { data } = await supabase
      .from('agency_services')
      .select('*')
      .eq('status', 'available')
      .order('display_order', { ascending: true });

    if (data) services = data;
  }

  return (
    <div className="bg-slate-950 text-white min-h-screen">

      {/* Hero */}
      <header className="pt-24 pb-20 text-center max-w-5xl mx-auto px-6">
        <div className="inline-block px-4 py-1.5 mb-6 text-xs font-mono text-green-400 border border-green-500/30 rounded-full bg-green-950/30 uppercase tracking-widest">
          SmartWorkLab · AI Agency
        </div>
        <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-200 to-slate-400">
          We Build AI.<br className="hidden md:block" /> You Scale.
        </h1>
        <p className="text-xl text-slate-400 leading-relaxed max-w-2xl mx-auto">
          From polished event microsites to production RAG systems and custom VTON inference pipelines — built by ML engineers, shipped fast.
        </p>
      </header>

      {/* Tier Cards */}
      <section className="max-w-7xl mx-auto px-6 pb-24">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
          {services.length === 0 ? (
            // Fallback skeleton for before DB is seeded
            [
              { tier_label: 'Entry', name: 'RSVP & Event Microsites', icon_name: 'Sparkles', accent_color: 'cyan', price_label: 'Starting at $499', tagline: 'Beautiful event sites, built in days.' },
              { tier_label: 'Growth', name: 'RAG Chatbots & Knowledge Bases', icon_name: 'Database', accent_color: 'purple', price_label: 'From $1,500', tagline: 'Your documents, instantly queryable.' },
              { tier_label: 'Enterprise', name: 'Enterprise AI Agents & Custom ML', icon_name: 'Cpu', accent_color: 'green', price_label: 'Custom Quote', tagline: 'Custom models. Real production deployments.' },
            ].map((svc, i) => (
              <ServiceCard key={i} service={svc as any} />
            ))
          ) : (
            services.map((svc) => <ServiceCard key={svc.id} service={svc} />)
          )}
        </div>
      </section>

      {/* Inquiry form */}
      <section className="max-w-3xl mx-auto px-6 pb-32">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-3">Ready to Start?</h2>
          <p className="text-slate-400">Describe your project and we'll respond within 24 hours.</p>
        </div>
        <ServiceInquiry />
      </section>

    </div>
  );
}

function ServiceCard({ service }: { service: AgencyService }) {
  const colors = ACCENT_COLORS[service.accent_color ?? 'cyan'] ?? ACCENT_COLORS.cyan;
  const Icon = ICON_MAP[service.icon_name ?? 'Sparkles'] ?? Sparkles;

  return (
    <div className={`relative group bg-slate-900/50 backdrop-blur-md border ${colors.border} rounded-2xl p-8 flex flex-col gap-6 hover:-translate-y-1 transition-all`}>
      {/* Glow */}
      <div className={`absolute top-0 right-0 w-48 h-48 ${colors.bg} rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none`} />

      <div className="relative z-10">
        {/* Tier badge */}
        <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border ${colors.badge} ${colors.text} text-xs font-mono uppercase tracking-widest mb-4`}>
          <Icon className="w-3 h-3" />
          {service.tier_label}
        </div>

        <h2 className="text-2xl font-bold text-white mb-2 leading-snug">{service.name}</h2>
        {service.tagline && <p className="text-slate-400 text-sm mb-4">{service.tagline}</p>}

        {/* Price */}
        <div className={`text-3xl font-bold ${colors.text} mb-6`}>
          {service.price_label}
        </div>

        {/* Features */}
        {service.features && (
          <ul className="space-y-2 mb-6">
            {service.features.map((f, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-slate-300">
                <span className={`mt-1 w-1.5 h-1.5 rounded-full flex-shrink-0 ${colors.text.replace('text-', 'bg-')}`} />
                {f}
              </li>
            ))}
          </ul>
        )}

        {/* Timeline */}
        {service.timeline_days && (
          <p className="text-xs text-slate-500 mb-6">
            ⏱ Estimated delivery: {service.timeline_days} days
          </p>
        )}
      </div>

      {/* CTA */}
      <div className="mt-auto relative z-10 flex flex-col gap-3">
        {service.demo_url && (
          <a
            href={service.demo_url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-xs text-slate-400 hover:text-white transition-colors"
          >
            <ExternalLink className="w-3 h-3" /> View live demo
          </a>
        )}
        <a
          href={`mailto:smartworklab.store@gmail.com?subject=[Inquiry] ${service.name}`}
          className={`inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full font-bold text-sm text-slate-950 bg-gradient-to-r transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 ${
            service.accent_color === 'purple'
              ? 'from-purple-400 to-pink-400 hover:shadow-purple-900/40'
              : service.accent_color === 'green'
              ? 'from-green-400 to-emerald-400 hover:shadow-green-900/40'
              : 'from-cyan-400 to-blue-400 hover:shadow-cyan-900/40'
          }`}
        >
          Get a Free Quote <ArrowRight className="w-4 h-4" />
        </a>
      </div>
    </div>
  );
}
