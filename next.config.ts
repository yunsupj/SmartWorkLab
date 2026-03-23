import type { NextConfig } from "next";
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin();

const nextConfig: NextConfig = {
  // ---------------------------------------------------------------------------
  // 301 Redirects — SmartWorkLab 2.0 Pivot
  // /reviews/* scrubbed from sitemap (AdSense low-value flag reset)
  // /compare/* and /metrics/* consolidated into /services
  // ---------------------------------------------------------------------------
  async redirects() {
    return [
      // /reviews → /lab (hard scrub — no legacy archive)
      {
        source: '/:locale/reviews',
        destination: '/:locale/lab',
        permanent: true,
      },
      {
        source: '/:locale/reviews/:id',
        destination: '/:locale/lab',
        permanent: true,
      },
      // /compare → /services
      {
        source: '/:locale/compare/:pair',
        destination: '/:locale/services',
        permanent: true,
      },
      // /metrics → /services
      {
        source: '/:locale/metrics',
        destination: '/:locale/services',
        permanent: true,
      },
    ];
  },

  async headers() {
    return [
      {
        source: '/ads.txt',
        headers: [
          {
            key: 'Content-Type',
            value: 'text/plain',
          },
        ],
      },
    ];
  },
};

export default withNextIntl(nextConfig);
