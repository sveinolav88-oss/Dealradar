import type { MetadataRoute } from 'next';
import { getAllPartnerDeals } from '../src/lib/all-partner-deals';

export const dynamic = 'force-dynamic';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = 'https://dealradar.no';
  const staticPages: MetadataRoute.Sitemap = [
    { url: base, changeFrequency: 'weekly', priority: 1 },
    { url: `${base}/deals`, changeFrequency: 'daily', priority: 0.9 },
    { url: `${base}/personvern`, changeFrequency: 'yearly', priority: 0.2 },
    { url: `${base}/affiliate`, changeFrequency: 'yearly', priority: 0.2 },
  ];

  try {
    const result = await getAllPartnerDeals();
    const liveDeals = result.deals.map((deal) => {
      const slug = deal.name.toLowerCase().normalize('NFKD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 90);
      return {
        url: `${base}/deals/${slug}?id=${encodeURIComponent(deal.id)}`,
        lastModified: new Date(),
        changeFrequency: 'daily' as const,
        priority: deal.score.score >= 90 ? 0.9 : 0.7,
      };
    });
    return [...staticPages, ...liveDeals];
  } catch {
    return staticPages;
  }
}
