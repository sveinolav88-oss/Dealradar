import { calculateDealScore } from './deal-score';

export type DemoDeal = {
  slug: string;
  name: string;
  brand: string;
  category: string;
  store: string;
  price: number;
  referencePrice: number;
  lowestPrice30d: number;
  lowestPrice90d: number;
  competitorLowestPrice: number;
  stock: 'in_stock' | 'out_of_stock' | 'unknown';
  description: string;
  image: string;
};

export const demoDeals: DemoDeal[] = [
  { slug: 'sony-wh-1000xm5', name: 'WH-1000XM5 trådløse hodetelefoner', brand: 'Sony', category: 'Elektronikk', store: 'Eksempelbutikk', price: 1990, referencePrice: 2990, lowestPrice30d: 2390, lowestPrice90d: 2290, competitorLowestPrice: 2190, stock: 'in_stock', image: 'headphones', description: 'Eksempel på hvordan DealRadar kan vurdere et produkt når vi har ekte prisdata og prishistorikk.' },
  { slug: 'apple-airpods-pro-2', name: 'AirPods Pro (2. gen.)', brand: 'Apple', category: 'Elektronikk', store: 'Eksempelbutikk', price: 1890, referencePrice: 2690, lowestPrice30d: 1990, lowestPrice90d: 1890, competitorLowestPrice: 1949, stock: 'in_stock', image: 'earbuds', description: 'Et eksempel med mindre prisfall, men fortsatt interessant mot normalpris og konkurrenter.' },
  { slug: 'lego-speed-champions', name: 'Speed Champions sportsbil', brand: 'LEGO', category: 'Hjem', store: 'Eksempelbutikk', price: 179, referencePrice: 249, lowestPrice30d: 199, lowestPrice90d: 179, competitorLowestPrice: 189, stock: 'in_stock', image: 'lego', description: 'Eksempel på en mindre deal. Scoren er basert på datapunktene vi har tilgjengelig.' },
  { slug: 'garmin-forerunner', name: 'Forerunner GPS-sportsklokke', brand: 'Garmin', category: 'Sport', store: 'Eksempelbutikk', price: 2499, referencePrice: 3499, lowestPrice30d: 2799, lowestPrice90d: 2699, competitorLowestPrice: 2599, stock: 'in_stock', image: 'watch', description: 'Eksempel på en større vare der både historikk og konkurrentpris påvirker vurderingen.' }
];

export function getDemoDeal(slug: string) { return demoDeals.find((deal) => deal.slug === slug); }

export function getDemoScore(deal: DemoDeal) {
  return calculateDealScore({ currentPrice: deal.price, referencePrice: deal.referencePrice, lowestPrice30d: deal.lowestPrice30d, lowestPrice90d: deal.lowestPrice90d, competitorLowestPrice: deal.competitorLowestPrice, inStock: deal.stock === 'in_stock' });
}
