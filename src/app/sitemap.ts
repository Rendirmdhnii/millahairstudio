import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: 'https://www.millahairstudio.com', lastModified: new Date(), changeFrequency: 'weekly', priority: 1 },
    { url: 'https://www.millahairstudio.com/tentang', lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: 'https://www.millahairstudio.com/layanan', lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: 'https://www.millahairstudio.com/galeri', lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: 'https://www.millahairstudio.com/booking', lastModified: new Date(), changeFrequency: 'yearly', priority: 0.9 },
  ];
}
