# SmartWorkLab Deployment Guide

This project is optimized for **Cloudflare Pages** (Edge Runtime) but compatible with Vercel.

## 1. Environment Variables
Ensure these keys are set in your deployment project (Cloudflare Pages Dashboard > Settings > Environment Variables):

| Key | Description |
| :--- | :--- |
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase Project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase Anon Key |
| `SUPABASE_SERVICE_ROLE_KEY` | (Optional) Service Role for Admin/Cron Jobs |

> **Note**: For Cloudflare Pages, keys like `service_role` might not be safe to expose unless used strictly in secured Edge Functions or via separate Workers.

## 2. Cloudflare Pages Deployment (Recommended)
This project uses `@cloudflare/next-on-pages`.

### Configuration
*   **Build Command**: `npx @cloudflare/next-on-pages`
*   **Output Directory**: `.vercel/output/static`
*   **Node.js Version**: 20+

### Edge Runtime
All dynamic routes have `export const runtime = 'edge'` injected.
The `middleware.ts` handles i18n routing on the edge.

### Git Integration
1.  Push to `main`.
2.  Cloudflare Pages will automatically detect the commit and start the build.
3.  Monitor "Deployments" tab for success.

## 3. Database Integrity
*   **Tables**: Ensure `products`, `expert_reports`, `metrics` exist.
*   **RLS**: RLS is enabled. Public can read `expert_reports` where `status = 'published'`.

## 4. Troubleshooting
*   **"Missing @swc/helpers"**: This was fixed by syncing `package-lock.json`. If it recurs, run `npm ci` locally and push the lockfile.
*   **"node:path not found"**: Ensure `PublisherAgent` is not running file-system code on the Edge. (Features like Git Commit are disabled for Edge).

## 5. Post-Launch Verification
1.  Visit `/en` and `/ko` to verify i18n.
2.  Visit `/en/reviews/[id]` to verify Supabase connectivity.
3.  Check the "Expert Analysis" section for the LaTeX ROI formula.
