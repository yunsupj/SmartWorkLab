/**
 * Featured Series — the separately curated series block on the homepage.
 *
 * This is editorial content, not database content. It is the ONE place to
 * update when a new Day ships. Day 4 update checklist (this file only):
 *
 *  1. Bump `title` (e.g. "Mochi Sprout — Phase 0 · Day 4").
 *  2. Append a Day 4 sentence to `description.en` and `description.ko`.
 *  3. Add a Day 4 entry to `days` (slug + EN/KO labels).
 *
 * Nothing else in the codebase needs to change for the series block.
 * (The "View series" link label stays in the i18n messages as `view_series`.)
 */

export interface FeaturedSeriesDayLink {
  slug: string;
  labelEn: string;
  labelKo: string;
}

export interface FeaturedSeriesConfig {
  title: string;
  description: {
    en: string;
    ko: string;
  };
  days: FeaturedSeriesDayLink[];
  githubUrl: string;
  githubLabel: string;
}

export const FEATURED_SERIES: FeaturedSeriesConfig = {
  title: 'Mochi Sprout — Phase 0 · Day 3',
  description: {
    en: 'Day 1: pendulum under two gravities, max angle difference 0.909 rad. Day 2: P, PI, PD, and PID step responses — PID settled 3.630 s after a +30° step with final-window MAE 0.313°, while P and PI oscillated and never settled. Day 3: robustness of the same gains to inertia, sensor noise, and delay — 2× inertia barely moved the final error (0.320°), 0.4° noise drove command-change RMS from 0.099 to 1.715 N·m, and only the combined case overshot (1.477°). Still simulation only: no walking, no hardware, no reinforcement learning. Day 4 is not started yet.',
    ko: 'Day 1: 두 중력에서의 진자 비교, 최대 각도 차이 0.909 rad 측정. Day 2: P·PI·PD·PID 스텝 응답 비교 — PID는 +30° 스텝 후 3.630초 만에 안정됐고 최종 구간 MAE 0.313°, P와 PI는 진동하며 안정되지 않았습니다. Day 3: 같은 게인으로 관성·센서 노이즈·지연에 대한 강건성 실험 — 관성 2배에도 마지막 2초간 평균 절대 오차(MAE)는 0.320°로 거의 안 변했고, 0.4° 노이즈는 제어 명령 변화 RMS를 0.099에서 1.715 N·m로 밀어 올렸고, 복합 케이스에서만 오버슈트 1.477°가 나왔다. 아직 실제 하드웨어에서는 검증하지 않았습니다. 걷기, 하드웨어, 강화학습은 없습니다. Day 4는 아직 시작하지 않았습니다.',
  },
  days: [
    {
      slug: 'mochi-sprout-day01-first-mujoco-simulation',
      labelEn: 'Day 1: First physics simulation',
      labelKo: '1편: 첫 물리 시뮬레이션',
    },
    {
      slug: 'mochi-sprout-day02-feedback-control',
      labelEn: 'Day 2: PID controller comparison',
      labelKo: '2편: PID 제어기 비교',
    },
    {
      slug: 'mochi-sprout-day03-pid-robustness',
      labelEn: 'Day 3: PID robustness',
      labelKo: '3편: PID 강건성 실험',
    },
  ],
  githubUrl: 'https://github.com/yunsupj/mochi-sprout',
  githubLabel: 'github.com/yunsupj/mochi-sprout',
};
