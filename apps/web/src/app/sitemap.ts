import type { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.AUTH_URL || 'https://www.youragencytoday.com';
  const routes = ['', '/login', '/register', '/chat', '/terminos', '/privacidad', '/contacto'];

  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
  }));
}
