import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/workspace/', '/admin/', '/dashboard/'],
    },
    sitemap: 'https://www.millahairstudio.com/sitemap.xml',
  };
}
