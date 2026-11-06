import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Projects | SmartWorkLab',
  description:
    'Projects built at SmartWorkLab: open-source Physical AI research, this engineering journal, and prototypes — with honest status labels.',
  alternates: {
    canonical: 'https://smartworklab.store/en/projects',
    languages: {
      en: 'https://smartworklab.store/en/projects',
      ko: 'https://smartworklab.store/ko/projects',
    },
  },
};

type Status = 'In development' | 'Prototype' | 'Research' | 'Deployed' | 'Archived';

interface Project {
  id: string;
  name: string;
  status: Status;
  statusKo: string;
  taglineEn: string;
  taglineKo: string;
  descEn: string;
  descKo: string;
  stack: string[];
  link?: { label: string; href: string };
  noteEn?: string;
  noteKo?: string;
}

const PROJECTS: Project[] = [
  {
    id: 'mochi-sprout',
    name: 'Mochi Sprout',
    status: 'In development',
    statusKo: '개발 중',
    taglineEn: 'Open-source Physical AI robot, built in public',
    taglineKo: '공개적으로 만드는 오픈소스 피지컬 AI 로봇',
    descEn:
      'A small companion robot that grows in behavior, built from a MuJoCo simulation to hardware. Phase 0 is underway: Day 1 compared a pendulum under two gravities (max angle difference 0.909 rad). Day 2 compared P, PI, PD, and PID step responses — PID settled 3.630 s after a +30° step with final-window MAE 0.313°, while P and PI oscillated and never settled. Still simulation only: no walking, no hardware, no reinforcement learning yet.',
    descKo:
      '행동이 성장하는 작은 반려 로봇을 MuJoCo 시뮬레이션부터 하드웨어까지 공개적으로 만듭니다. Phase 0 진행 중: Day 1은 두 중력에서의 진자를 비교했고(최대 각도 차이 0.909 rad), Day 2는 P·PI·PD·PID 스텝 응답을 비교했습니다. PID는 +30° 스텝 후 3.630초 만에 안정됐고 최종 구간 MAE는 0.313°였으며, P와 PI는 진동하며 안정되지 않았습니다. 아직 시뮬레이션만 있습니다. 걷기, 하드웨어, 강화학습은 없습니다.',
    stack: ['MuJoCo', 'Python', 'PyTorch (planned)', 'ONNX (planned)'],
    link: { label: 'github.com/yunsupj/mochi-sprout', href: 'https://github.com/yunsupj/mochi-sprout' },
  },
  {
    id: 'smartworklab',
    name: 'SmartWorkLab',
    status: 'In development',
    statusKo: '개발 중',
    taglineEn: 'This site — a bilingual engineering research blog',
    taglineKo: '이 사이트 — 이중언어 엔지니어링 연구 블로그',
    descEn:
      'The site you are reading. Being rebuilt from an agency site into a minimal engineering journal: articles, series, and project documentation in English and Korean, with measured results only.',
    descKo:
      '지금 보고 있는 사이트입니다. 에이전시 사이트에서 미니멀한 엔지니어링 저널로 다시 만들고 있습니다. 영어·한국어 아티클, 시리즈, 프로젝트 기록을 측정된 결과와 함께 담습니다.',
    stack: ['Next.js', 'Supabase', 'Vercel', 'next-intl'],
    link: { label: 'github.com/yunsupj/SmartWorkLab', href: 'https://github.com/yunsupj/SmartWorkLab' },
  },
  {
    id: 'flyalpha',
    name: 'FlyAlpha',
    status: 'Prototype',
    statusKo: '프로토타입',
    taglineEn: 'AI-assisted swing-trading bot with a deterministic risk engine',
    taglineKo: '결정적 리스크 엔진을 갖춘 AI 보조 스윙 트레이딩 봇',
    descEn:
      'A quantitative trading system: a model proposes candidates, AI signals and risk filters assist, and a deterministic risk engine decides orders and position size. AI never places orders directly. A small live canary has been running since October 2026. No performance claims are made here.',
    descKo:
      '퀀트 트레이딩 시스템입니다. 모델이 후보를 만들고 AI 신호와 리스크 필터가 보조하며, 결정적 리스크 엔진이 주문과 포지션 크기를 정합니다. AI가 직접 주문하지는 않습니다. 소액 실거래 카나리가 2026년 10월부터 운영 중입니다. 성과에 대한 주장은 하지 않습니다.',
    stack: ['Python', 'Robinhood API', 'Point-in-time data'],
  },
  {
    id: 'pickle-ai',
    name: 'Pickle AI',
    status: 'Prototype',
    statusKo: '프로토타입',
    taglineEn: 'AI shopping agent with virtual try-on',
    taglineKo: '가상 피팅이 가능한 AI 쇼핑 에이전트',
    descEn:
      'A shopping agent prototype: snap a photo, try clothes on virtually, and search by style. Built with a multi-stage virtual try-on pipeline, hybrid vector + time-decay style search, and an iOS app with an Apple Watch companion. Earlier versions of this page quoted 100M DAU and sub-100ms latency — those were design targets, not measured results, and have been removed.',
    descKo:
      '쇼핑 에이전트 프로토타입입니다. 사진을 찍으면 가상으로 옷을 입어보고 스타일로 검색합니다. 다단계 가상 피팅 파이프라인, 하이브리드 벡터·시간 감쇠 스타일 검색, Apple Watch 연동 iOS 앱으로 구성했습니다. 이전 페이지의 100M DAU와 100ms 미만 지연은 측정 결과가 아니라 설계 목표였기 때문에 삭제했습니다.',
    stack: ['React Router v7', 'PostgreSQL', 'Upstash Redis', 'Deno Edge Functions', 'Fashn.ai', 'Capacitor'],
    noteEn: 'Performance figures previously shown here were design targets, not measured results.',
    noteKo: '이전에 표시됐던 성능 수치는 측정 결과가 아니라 설계 목표였습니다.',
  },
  {
    id: 'mapz',
    name: 'Mapz',
    status: 'Prototype',
    statusKo: '프로토타입',
    taglineEn: 'Geospatial rewards prototype',
    taglineKo: '지리공간 리워드 프로토타입',
    descEn:
      'A prototype that rewards users for visiting physical coordinates, using Uber H3 spatial sharding and a Redis write buffer to handle concurrent check-ins. Throughput figures from earlier descriptions were design goals, not measured results.',
    descKo:
      '실제 좌표를 방문한 사용자에게 보상하는 프로토타입입니다. Uber H3 공간 샤딩과 Redis 쓰기 버퍼로 동시 체크인을 처리합니다. 이전 설명의 처리량 수치는 설계 목표였고, 측정 결과가 아닙니다.',
    stack: ['Next.js', 'PostGIS', 'H3', 'Solana Web3.js'],
  },
  {
    id: 'rsvp-engine',
    name: 'RSVP Engine',
    status: 'Prototype',
    statusKo: '프로토타입',
    taglineEn: 'Code-driven event microsites with RSVP',
    taglineKo: '코드로 만드는 RSVP 이벤트 마이크로사이트',
    descEn:
      'A custom RSVP pipeline: event microsites with RSVP forms, photo guestbooks, and automated email reminders, built with Next.js, Supabase, and Resend. No scale or delivery claims are made here.',
    descKo:
      '맞춤형 RSVP 파이프라인입니다. RSVP 폼, 사진 게스트북, 자동 이메일 알림이 있는 이벤트 마이크로사이트를 Next.js, Supabase, Resend로 만듭니다. 규모나 납기에 대한 주장은 하지 않습니다.',
    stack: ['Next.js', 'Supabase', 'Resend', 'Tailwind'],
  },
];

const STATUS_STYLE: Record<Status, string> = {
  'In development': 'text-[#4C6B59] bg-[#DCE8DF]/60 border-[#4C6B59]/30',
  Prototype: 'text-[#66716C] bg-[#F7F7F4] border-[#D5DAD3]',
  Research: 'text-[#4C6B59] bg-[#DCE8DF]/60 border-[#4C6B59]/30',
  Deployed: 'text-[#4C6B59] bg-[#DCE8DF]/60 border-[#4C6B59]/30',
  Archived: 'text-[#8A938E] bg-[#F7F7F4] border-[#D5DAD3]',
};

export default async function ProjectsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const ko = locale === 'ko';

  return (
    <div className="min-h-screen bg-[#F7F7F4] text-[#1C2321]">
      <div className="max-w-3xl mx-auto px-6 pt-16 md:pt-20 pb-24">
        <header className="border-b border-[#E4E7E2] pb-10 mb-12">
          <h1 className="text-3xl md:text-4xl font-bold mb-4 tracking-tight">
            {ko ? '프로젝트' : 'Projects'}
          </h1>
          <p className="text-lg text-[#66716C] leading-relaxed">
            {ko
              ? '실제로 만든 것들입니다. 상태는 솔직하게 표시합니다. 연구, 프로토타입, 개발 중, 배포됨, 보관됨.'
              : 'Things actually built. Status is labeled honestly: research, prototype, in development, deployed, archived.'}
          </p>
        </header>

        <div className="space-y-4">
          {PROJECTS.map((proj) => (
            <article key={proj.id} className="rounded-xl border border-[#E4E7E2] bg-[#FFFFFF] p-6 md:p-8">
              <div className="flex flex-wrap items-center gap-3 mb-2">
                <h2 className="text-xl font-bold tracking-tight">{proj.name}</h2>
                <span
                  className={`px-2.5 py-1 text-[10px] font-mono font-bold uppercase tracking-widest rounded-full border ${STATUS_STYLE[proj.status]}`}
                >
                  {ko ? proj.statusKo : proj.status}
                </span>
              </div>
              <p className="text-sm font-bold text-[#4C6B59] mb-3">
                {ko ? proj.taglineKo : proj.taglineEn}
              </p>
              <p className="text-base text-[#66716C] leading-relaxed mb-4">
                {ko ? proj.descKo : proj.descEn}
              </p>
              <div className="flex flex-wrap gap-2 mb-4">
                {proj.stack.map((tech) => (
                  <span
                    key={tech}
                    className="px-2.5 py-1 text-xs font-mono text-[#66716C] bg-[#F7F7F4] border border-[#E4E7E2] rounded-full"
                  >
                    {tech}
                  </span>
                ))}
              </div>
              {proj.link && (
                <a
                  href={proj.link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-bold text-[#4C6B59] hover:underline underline-offset-4"
                >
                  {proj.link.label} →
                </a>
              )}
              {(ko ? proj.noteKo : proj.noteEn) && (
                <p className="text-xs text-[#8A938E] mt-3 leading-relaxed">
                  {ko ? proj.noteKo : proj.noteEn}
                </p>
              )}
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
