import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.AUTH_URL || 'https://www.youragencytoday.com';

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/client/', '/dashboard', '/solicitudes', '/itinerarios', '/api/'],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
