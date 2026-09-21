import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://merlo-participa.vercel.app';
  return {
    rules: {
      userAgent: '*',
      allow: ['/', '/reclamos', '/mapa', '/propuestas', '/como-funciona', '/privacidad', '/seguimiento'],
      disallow: ['/admin', '/admin/*'],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
