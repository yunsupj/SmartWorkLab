import { Github, Linkedin, Mail } from 'lucide-react';
import type { Metadata } from 'next';

interface Props {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return {
    title: locale === 'ko' ? '소개 | SmartWorkLab' : 'About | SmartWorkLab',
    description:
      locale === 'ko'
        ? 'SmartWorkLab은 엔지니어링 연구 블로그입니다. 응용 AI, 로보틱스, 인프라 분야에서 실제로 한 일을 측정 결과와 함께 기록합니다.'
        : 'SmartWorkLab is an engineering research blog: applied AI, robotics, and engineering — documented with measured results.',
    openGraph: {
      locale: locale === 'ko' ? 'ko_KR' : 'en_US',
      url: `https://www.smartworklab.store/${locale}/about`,
    },
    alternates: {
      canonical: `https://www.smartworklab.store/${locale}/about`,
      languages: {
        en: 'https://www.smartworklab.store/en/about',
        ko: 'https://www.smartworklab.store/ko/about',
      },
    },
  };
}

const STEPS = [
  {
    en: ['Learn', 'Study the concept properly before building — the math, the mechanism, the prior work.'],
    ko: ['공부', '만들기 전에 개념을 제대로 공부합니다. 수학, 동작 원리, 기존 연구까지.'],
  },
  {
    en: ['Experiment', 'Run a small, controlled experiment. Change one variable at a time.'],
    ko: ['실험', '작고 통제된 실험을 합니다. 한 번에 변수 하나만 바꿉니다.'],
  },
  {
    en: ['Build', 'Implement it. Keep the code open where possible.'],
    ko: ['구축', '직접 만듭니다. 가능하면 코드를 공개합니다.'],
  },
  {
    en: ['Evaluate', 'Measure against a stated baseline, with the test setup written down.'],
    ko: ['평가', '기준선을 정해두고 측정합니다. 실험 설정도 함께 적습니다.'],
  },
  {
    en: ['Publish', 'Write up what happened — including what failed.'],
    ko: ['발행', '일어난 일을 글로 남깁니다. 실패한 것도 포함해서.'],
  },
] as const;

export default async function AboutPage({ params }: Props) {
  const { locale } = await params;
  const ko = locale === 'ko';

  return (
    <div className="min-h-screen bg-[#F7F7F4] text-[#1C2321]">
      <div className="max-w-3xl mx-auto px-6 pt-16 md:pt-20 pb-24">
        <header className="border-b border-[#E4E7E2] pb-10 mb-10">
          <h1 className="text-3xl md:text-4xl font-bold mb-4 tracking-tight">{ko ? '소개' : 'About'}</h1>
          <p className="text-lg text-[#66716C] leading-relaxed">
            {ko
              ? 'SmartWorkLab은 엔지니어링 연구 블로그입니다. 응용 AI, 로보틱스, 인프라 분야에서 실제로 한 일을 기록합니다. 실험, 구현, 실패, 배운 점 — 주장 말고 측정 결과로 남깁니다.'
              : 'SmartWorkLab is an engineering research blog. It documents real work in applied AI, robotics, and infrastructure — experiments, implementations, failures, and lessons learned — with measured results, not claims.'}
          </p>
        </header>

        <section className="mb-12">
          <h2 className="text-xl font-bold mb-4 tracking-tight">{ko ? '글은 이렇게 만듭니다' : 'How articles are made'}</h2>
          <p className="text-base text-[#66716C] leading-relaxed mb-4">
            {ko
              ? '이 사이트의 모든 프로젝트는 같은 순서를 따릅니다.'
              : 'Every project on this site follows the same loop:'}
          </p>
          <ol className="list-none space-y-3">
            {STEPS.map(({ en: [stepEn, descEn], ko: [stepKo, descKo] }) => {
              return (
                <li key={stepEn} className="flex gap-4 rounded-xl border border-[#E4E7E2] bg-[#FFFFFF] p-4">
                  <span className="font-mono font-bold text-[#4C6B59] whitespace-nowrap w-24 shrink-0">
                    {ko ? stepKo : stepEn}
                  </span>
                  <span className="text-[#66716C] leading-relaxed">{ko ? descKo : descEn}</span>
                </li>
              );
            })}
          </ol>
        </section>

        <section className="mb-12">
          <h2 className="text-xl font-bold mb-4 tracking-tight">
            {ko ? '주요 프로젝트: 모찌 새싹' : 'Featured project: Mochi Sprout'}
          </h2>
          <p className="text-base text-[#66716C] leading-relaxed mb-4">
            {ko
              ? '모찌 새싹은 오픈소스 Physical AI 프로젝트입니다. 행동이 자라는 작은 반려 로봇을 MuJoCo 시뮬레이션부터 하드웨어까지 공개적으로 만듭니다. Day 1은 두 중력에서의 진자를 비교했고, Day 2는 PID 스텝 응답을 비교해 PID가 3.630초 만에 안정되는 것을 확인했습니다. 아직 걷기, 하드웨어, 강화학습은 없습니다.'
              : 'Mochi Sprout is an open-source Physical AI project: a small companion robot that grows — in behavior, not just in code — built in public from a MuJoCo simulation to hardware. Day 1 compared a pendulum under two gravities; Day 2 compared PID step responses and found PID settled in 3.630 s. No walking, no hardware, no reinforcement learning yet.'}
          </p>
          <a
            href="https://github.com/yunsupj/mochi-sprout"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-bold text-[#4C6B59] hover:underline underline-offset-4"
          >
            github.com/yunsupj/mochi-sprout →
          </a>
        </section>

        <section className="mb-12">
          <h2 className="text-xl font-bold mb-4 tracking-tight">{ko ? '저자 소개' : 'About the author'}</h2>
          <div className="rounded-xl border border-[#E4E7E2] bg-[#FFFFFF] p-6 flex flex-col sm:flex-row gap-6">
            <div className="w-20 h-20 shrink-0 bg-[#EFF0EB] rounded-full flex items-center justify-center text-2xl font-bold text-[#4C6B59]">
              YJ
            </div>
            <div>
              <h3 className="text-lg font-bold">Yunsup Jung</h3>
              <p className="text-sm text-[#66716C] leading-relaxed mt-1 mb-4">
                {ko
                  ? '시니어 ML 엔지니어 (Hulu, HBO Max, Nike, Meta, CloudBees). 지금은 오픈소스 Physical AI를 만들며 실제로 일어난 일을 기록하고 있습니다.'
                  : 'Senior ML engineer (Hulu, HBO Max, Nike, Meta, CloudBees). Now building open-source Physical AI and writing about what actually happens along the way.'}
              </p>
              <div className="flex gap-3">
                <a
                  href="https://github.com/yunsupj"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 bg-[#F7F7F4] border border-[#E4E7E2] rounded-full hover:border-[#4C6B59] text-[#66716C] hover:text-[#4C6B59] transition-colors"
                  aria-label="GitHub"
                >
                  <Github className="w-5 h-5" />
                </a>
                <a
                  href="https://www.linkedin.com/in/yunsupjung/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 bg-[#F7F7F4] border border-[#E4E7E2] rounded-full hover:border-[#4C6B59] text-[#66716C] hover:text-[#4C6B59] transition-colors"
                  aria-label="LinkedIn"
                >
                  <Linkedin className="w-5 h-5" />
                </a>
                <a
                  href="mailto:info@yuunchloe.com"
                  className="p-2 bg-[#F7F7F4] border border-[#E4E7E2] rounded-full hover:border-[#4C6B59] text-[#66716C] hover:text-[#4C6B59] transition-colors"
                  aria-label="Email"
                >
                  <Mail className="w-5 h-5" />
                </a>
              </div>
            </div>
          </div>
          <p className="text-sm text-[#8A938E] mt-4">
            {ko
              ? 'SmartWorkLab은 Yunsup Jung과 Chloe Kim이 운영합니다.'
              : 'SmartWorkLab is run by Yunsup Jung and Chloe Kim.'}
          </p>
        </section>
      </div>
    </div>
  );
}
