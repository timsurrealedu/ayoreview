import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/my/', '/admin/', '/api/', '/q/', '/n/', '/r/', '/s/'],
      },
    ],
    sitemap: `${process.env.NEXT_PUBLIC_APP_URL || 'https://ayoreview.id'}/sitemap.xml`,
  };
}
