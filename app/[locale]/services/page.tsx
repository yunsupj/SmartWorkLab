import type { Metadata } from 'next';

interface Props {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return {
    title:
      locale === 'ko'
        ? '엔지니어링 서비스와 기술 협업 | SmartWorkLab'
        : 'Engineering Services & Technical Collaboration | SmartWorkLab',
    description:
      locale === 'ko'
        ? '실용적인 AI 시스템, 머신러닝 인프라, 소프트웨어 엔지니어링 — 초기 프로토타입부터 프로덕션 아키텍처까지, 측정 가능한 결과와 함께.'
        : 'Practical AI systems, machine learning infrastructure, and software engineering — from early prototypes to production architecture, with measurable results.',
    openGraph: {
      locale: locale === 'ko' ? 'ko_KR' : 'en_US',
      url: `https://www.smartworklab.store/${locale}/services`,
    },
    alternates: {
      canonical: `https://www.smartworklab.store/${locale}/services`,
      languages: {
        en: 'https://www.smartworklab.store/en/services',
        ko: 'https://www.smartworklab.store/ko/services',
      },
    },
  };
}

interface Area {
  titleEn: string;
  titleKo: string;
  descEn: string;
  descKo: string;
  itemsEn: string[];
  itemsKo: string[];
}

const AREAS: Area[] = [
  {
    titleEn: 'AI Agents & Automation',
    titleKo: 'AI 에이전트와 자동화',
    descEn:
      'Agent systems that do real work — grounded in your data, observable in production, and evaluated before they are trusted.',
    descKo:
      '실제 업무를 수행하는 에이전트 시스템 — 데이터를 기반으로 하고, 프로덕션에서 관찰 가능하며, 신뢰하기 전에 평가합니다.',
    itemsEn: [
      'Agent architecture',
      'RAG and retrieval systems',
      'Tool integration',
      'Workflow orchestration',
      'Agent evaluation and reliability',
    ],
    itemsKo: [
      '에이전트 아키텍처',
      'RAG와 검색 시스템',
      '도구 통합',
      '워크플로 오케스트레이션',
      '에이전트 평가와 신뢰성',
    ],
  },
  {
    titleEn: 'ML Systems & Data Infrastructure',
    titleKo: 'ML 시스템과 데이터 인프라',
    descEn:
      'The pipelines and platforms that make machine learning repeatable — from training data to serving and monitoring.',
    descKo:
      '머신러닝을 반복 가능하게 만드는 파이프라인과 플랫폼 — 학습 데이터부터 서빙과 모니터링까지.',
    itemsEn: [
      'ML data pipelines',
      'Training and evaluation infrastructure',
      'Batch and streaming systems',
      'Inference optimization',
      'Production observability and performance',
    ],
    itemsKo: [
      'ML 데이터 파이프라인',
      '학습·평가 인프라',
      '배치와 스트리밍 시스템',
      '추론 최적화',
      '프로덕션 관찰성과 성능',
    ],
  },
  {
    titleEn: 'Technical Consulting & Prototyping',
    titleKo: '기술 컨설팅과 프로토타이핑',
    descEn:
      'Short, focused engagements that answer a concrete question — is this feasible, what will it cost to build, and what could go wrong?',
    descKo:
      '구체적인 질문에 답하는 짧고 집중적인 협업 — 실현 가능한지, 구축 비용은 얼마인지, 무엇이 잘못될 수 있는지.',
    itemsEn: [
      'Architecture reviews',
      'Proof of concept development',
      'Technical feasibility',
      'Performance analysis',
      'Evaluation and experimentation',
    ],
    itemsKo: [
      '아키텍처 리뷰',
      '개념 검증(PoC) 개발',
      '기술 타당성 검토',
      '성능 분석',
      '평가와 실험',
    ],
  },
];

export default async function ServicesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const ko = locale === 'ko';

  return (
    <div className="min-h-screen bg-[#F7F7F4] text-[#1C2321]">
      <div className="max-w-3xl mx-auto px-6 pt-16 md:pt-20 pb-24">
        <header className="border-b border-[#E4E7E2] pb-10 mb-12">
          <h1 className="text-3xl md:text-4xl font-bold mb-5 tracking-tight leading-tight">
            {ko ? '엔지니어링 서비스 및 기술 협업' : 'Engineering Services & Technical Collaboration'}
          </h1>
          <p className="text-lg text-[#66716C] leading-relaxed">
            {ko
              ? '실제 문제를 해결하는 AI 시스템, 머신러닝 인프라, 소프트웨어 엔지니어링을 다룹니다. 초기 프로토타입부터 프로덕션 아키텍처까지, 측정 가능한 결과와 유지보수 가능한 시스템을 중요하게 생각합니다.'
              : 'I work on practical AI systems, machine learning infrastructure, and software engineering challenges. From early prototypes to production architecture, my focus is on measurable results, maintainable systems, and responsible engineering.'}
          </p>
        </header>

        <div className="space-y-4 mb-12">
          {AREAS.map((area) => (
            <section key={area.titleEn} className="rounded-xl border border-[#E4E7E2] bg-[#FFFFFF] p-6 md:p-8">
              <h2 className="text-xl font-bold tracking-tight mb-2">
                {ko ? area.titleKo : area.titleEn}
              </h2>
              <p className="text-base text-[#66716C] leading-relaxed mb-5">
                {ko ? area.descKo : area.descEn}
              </p>
              <ul className="grid sm:grid-cols-2 gap-x-6 gap-y-2">
                {(ko ? area.itemsKo : area.itemsEn).map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm text-[#1C2321]">
                    <span className="text-[#4C6B59] mt-0.5" aria-hidden="true">—</span>
                    {item}
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>

        <section className="rounded-xl border border-[#E4E7E2] bg-[#FFFFFF] p-6 md:p-8 mb-12">
          <h2 className="text-xl font-bold tracking-tight mb-2">
            {ko ? '로보틱스 연구' : 'Robotics research'}
          </h2>
          <p className="text-base text-[#66716C] leading-relaxed">
            {ko
              ? '로보틱스는 관심 있는 연구 분야입니다. 모찌 새싹은 오픈소스 연구 프로젝트이며, 상용 하드웨어 개발 서비스가 아닙니다. 연구 협업이나 오픈소스 기여에 대해서는 문의해 주세요.'
              : 'Robotics is an area of research interest. Mochi Sprout is an open-source research project, not a commercial hardware development service. Research collaboration and open-source contributions are welcome — get in touch.'}
          </p>
        </section>

        <div className="text-center border-t border-[#E4E7E2] pt-10">
          <a
            href="mailto:info@yuunchloe.com"
            className="inline-block px-6 py-3 bg-[#4C6B59] text-white font-bold rounded-lg hover:bg-[#3E5A4A] transition-colors"
          >
            {ko ? '프로젝트 문의' : 'Discuss a Project'}
          </a>
          <p className="text-sm text-[#8A938E] mt-4">info@yuunchloe.com</p>
        </div>
      </div>
    </div>
  );
}
