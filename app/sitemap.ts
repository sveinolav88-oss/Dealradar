import type { MetadataRoute } from 'next';
import { demoDeals } from '../lib/demo-deals';

export default function sitemap(): MetadataRoute.Sitemap {
  const base = 'https://dealradar.no';
  return [
    { url: base, changeFrequency: 'weekly', priority: 1 },
    { url: `${base}/deals`, changeFrequency: 'daily', priority: 0.9 },
    { url: `${base}/personvern`, changeFrequency: 'yearly', priority: 0.2 },
    { url: `${base}/affiliate`, changeFrequency: 'yearly', priority: 0.2 },
    ...demoDeals.map((deal) => ({ url: `${base}/deals/${deal.slug}`, changeFrequency: 'daily' as const, priority: 0.7 }))
  ];
}
