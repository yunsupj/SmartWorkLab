/**
 * Featured Series — the separately curated series block on the homepage.
 *
 * This is editorial content, not database content. It is the ONE place to
 * update when a new Day ships:
 *
 *  1. Bump `title`.
 *  2. Update `description.en` and `description.ko`.
 *  3. Add the new day to `days` (slug + EN/KO labels).
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
  title: 'Mochi Sprout — Phase 0 · Day 4',
  description: {
    en: 'Day 1: pendulum under two gravities, max angle difference 0.909 rad. Day 2: P, PI, PD, and PID step responses — PID settled 3.630 s after a +30° step with final-window MAE 0.313°, while P and PI oscillated and never settled. Day 3: robustness of the same gains to inertia, sensor noise, and delay — 2× inertia barely moved the final error (0.320°), 0.4° noise drove command-change RMS from 0.099 to 1.715 N·m, and only the combined case overshot (1.477°). Day 4: under noise alone, EMA 0.2 reduced command-change RMS to 0.245 N·m; with variable sensor delay, four of five simulated trajectories crossed ±360° and the fifth did not settle. These are single-pendulum simulation results, with no walking, hardware validation, or reinforcement learning.',
    ko: 'Day 1에서는 중력이 다른 두 조건에서 진자를 비교해 최대 각도 차이 0.909 rad를 측정했다. Day 2에서는 P·PI·PD·PID의 스텝 응답을 비교했다. PID는 +30° 스텝 후 3.630초 만에 안정됐고 마지막 2초간 평균 절대 오차(MAE)는 0.313°였다. P와 PI는 진동하며 안정되지 않았다. Day 3에서는 같은 게인으로 관성·센서 노이즈·지연을 시험했다. 관성을 2배로 늘려도 마지막 2초간 MAE는 0.320°였고, 0.4° 노이즈에서는 제어 명령 변화 RMS가 0.099에서 1.715 N·m로 커졌다. Day 3의 복합 조건에서만 1.477°의 오버슈트가 나타났다. Day 4에서는 노이즈만 있을 때 EMA 0.2가 명령 변화 RMS를 0.245 N·m로 낮췄지만, 가변 지연까지 더하자 다섯 번의 시뮬레이션 중 네 번은 실제 관절 각도가 ±360°를 넘었고 나머지 한 번도 안정되지 않았다. 모두 단일 진자의 시뮬레이션 결과이며, 보행·실제 하드웨어·강화학습 정책은 검증하지 않았다.',
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
    {
      slug: 'mochi-sprout-day04-filtering-jitter',
      labelEn: 'Day 4: Sensor filtering and variable delay',
      labelKo: '4편: 센서 필터와 가변 지연',
    },
  ],
  githubUrl: 'https://github.com/yunsupj/mochi-sprout',
  githubLabel: 'github.com/yunsupj/mochi-sprout',
};
