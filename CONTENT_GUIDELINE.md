# SmartWorkLab Content Guidelines

How articles on this site are written, checked, and published. The standard is simple: **measured results only, in the author's own voice, in both languages.**

## 1. Measured results only

- Every number in an article traces to a committed experiment record (a JSON/CSV in the source repo, a repo commit, or a cited measurement). No invented benchmarks, no placeholder results.
- Drafts are written from user-supplied logs, photos, and metrics only. Untested steps are marked TODO, never described as done.
- Robot results are never invented. Simulation results are labeled simulation; hardware results require hardware.

## 2. Bilingual, meaning-first

- Every article ships in English and Korean with identical numbers, equivalent conclusions, and equally complete technical details.
- Korean is written, not translated. Interpret the English meaning into natural Korean — never translate literally. (Standing rule since 2026-11-05, after "hard tail" became the awkward literal "어려운 꼬리".)
- Natural Korean, e.g.: "마지막 2초간 평균 절대 오차(MAE)", "측정값이 늦게 도착하는 상황", "중력 때문에 목표 각도와 차이가 남았다". Avoid: "최종 구간 MAE", "강건성의 성능적 인사이트", "토크 출력의 효율성 극대화", "혁신적인 로봇 제어 패러다임".
- Technical terms (PID, MuJoCo, sensor noise, Python) may stay in English where natural.
- Korean bold text: never write `**...(...)**` followed directly by a Korean particle (는/은) — CommonMark cannot close it and the markers render literally. Close the bold before the English gloss: `**일반화 좌표**(generalized coordinate)는`.

## 3. Voice

- First-person engineering narrative where grounded. Natural, thoughtful, technically precise.
- Honest about mistakes and unexpected results. Say what was expected, what was tested, what actually happened, and why it matters.
- No repetitive introductions, no inflated success claims, no generic motivational filler, no invented personal anecdotes, no exaggerated adjectives, no marketing tone.

## 4. Structure

A typical article: problem and baseline → experiment design (config, controls, what is fixed) → measured results (tables with means and observed ranges; label single-seed vs multi-seed) → interpretation (including what the numbers do *not* prove) → architecture/code (short, real snippets from the repo) → reproduction (exact commands) → limitations and future experiments → lessons.

- Distinguish a five-seed average from a single-seed measurement, every time.
- State metric definitions (e.g. final-window MAE covers the last 2 s; settling means staying within ±2°).
- A limitations section is mandatory: what was not tested, what would change the conclusion.

## 5. Figures and code

- Figures are regenerated as SVG from the verified data (same series, titles, and definitions as the source plots). Original PNGs stay in the source repo as evidence.
- Every figure has a caption that says what it shows and which seed/scenario it is.
- Code snippets are short and copied from the actual repo. No fabricated code behavior.
- Code blocks use the custom high-contrast Prism theme (`lib/codeTheme.ts`, WCAG AA). Inline code is styled explicitly in the renderer — never `prose-code:*` utilities on the container (they leak into fenced blocks).
- Article covers: local SVG by default; use a raster PNG (pinned to its source commit) for `og:image` where SVG previews are unreliable.

## 6. SEO

- Distinct localized titles and descriptions per locale. Natural wording, no keyword stuffing.
- Canonical URL per locale, reciprocal `en`/`ko` hreflang, no German alternate.
- Publication date is the actual publish date, not the experiment date. Never claim an article is indexed merely because it is published.

## 7. Publishing

1. Draft EN → write KO → edit both → validate evidence (numbers against the committed summary).
2. PR (MDX + figures + any site integration), typecheck + build, merge.
3. Targeted sync of the new/changed MDX files only (`scripts/sync-targeted.ts`). **Never `npm run sync:lab`.** The sync preserves `published_at` and upserts by `(locale, slug)` — no duplicates.
4. Verify live: both article URLs, series page, prev/next navigation, figures, code blocks, canonical/hreflang, sitemap.
5. Publish both languages together. Never publish one language alone.

## 8. What not to do

- Do not describe future work as done, or a simulation result as hardware performance.
- Do not imply real-world robot safety has been demonstrated.
- Do not post to Instagram or send anything on the author's behalf without explicit approval.
- Do not claim a publish is done without checking the live page first.
