import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  // Canonical host is fixed: production serves www; the apex domain 307-redirects to www.
  const BASE_URL = 'https://www.smartworklab.store';

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin/', '/private/'],
    },
    sitemap: `${BASE_URL}/sitemap.xml`,
  };
}
