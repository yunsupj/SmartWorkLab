# Legal docs — owner review needed (2026-11-05)

The four legal documents below still describe the **discontinued** service:
ROI analysis, software reviews, Google/Discord OAuth sign-up, the
"Expert Lab" review system, and the "Scout Agent" / "Analyst Agent"
features. The current site is a bilingual engineering research blog
with no accounts, no login, no dashboard, and no ROI tools.

Nothing in these files was rewritten in the 2026-11-05 editorial pass:
changing legal text needs the owner's factual review, not an assistant
edit. This note lists the exact passages to decide on.

## PRIVACY_POLICY_EN.md
- L12: account registration via **OAuth (Google, Discord)** to create an
  account and provide "personalized ROI analysis".
- L16: "Tools you add to your dashboard".
- L31: purposes — "generate personalized ROI reports, 'Expert Lab'
  reviews, and efficiency insights".
- L32: "'Scout Agent'" used to analyze user behavior.

## PRIVACY_POLICY_KO.md
- L11/L16: 회원가입 (Google, Discord 연동), OAuth 가입 시 수집 항목.
- L22: "맞춤형 ROI 분석 리포트 생성, 'Expert Lab' 리뷰 기능 제공".
- L24: "'Scout Agent' 및 'Analyst Agent'를 통한 이용자 패턴 분석".

## TERMS_OF_SERVICE_EN.md
- L9: service described as "tools for AI ROI analysis, software
  reviews, and productivity insights"; core features "ROI Dashboard",
  "Expert Lab Reports", "Scout Agent" analysis.
- L13: ROI calculations / efficiency metrics as estimates.
- L18: account credentials "via Google/Discord OAuth".
- L20: reviews submitted to the "Expert Lab".
- L24–25: "Scout Agent" / "Analyst Agent" logic and "proprietary ROI
  algorithms or dashboard designs" as IP.

## TERMS_OF_SERVICE_KO.md
- L9: 'ROI 대시보드', 'Expert Lab 리포트', 'Scout Agent' 분석.
- L13: ROI 계산 결과·효율성 지표가 추정치라는 면책.
- L18: 소셜 로그인(Google/Discord) 계정 보안 의무.
- L20: 'Expert Lab' 리뷰 작성 의무.

## Fixed 2026-11-05 (not a content change)
- `TERMS_OF_SERVICE_KO.md` L42: broken `mailto:[EMAIL_ADDRESS]`
  placeholder replaced with the verified address
  `mailto:info@yuunchloe.com` (visible text was already correct).
- `LegalMarkdown` restyled from the legacy dark theme to the light
  editorial theme; "Effective Date" label is now localized and reads
  the KO "최종 수정일" date instead of falling back to English.

## Decision needed from the owner
1. Rewrite these four files to describe the current blog (no accounts,
   no ROI tools), or keep them as-is with an effective date in the past?
2. Is any data actually collected today (analytics, affiliate clicks,
   contact email)? The privacy policy must match reality.
3. Confirm the operator name/entity ("yuunchloe") and contact address
   are still correct.
