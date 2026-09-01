export type DealInput = {
  currentPrice: number;
  referencePrice?: number | null;
  lowestPrice30d?: number | null;
  lowestPrice90d?: number | null;
  competitorLowestPrice?: number | null;
  inStock?: boolean;
  affiliateUrl?: string | null;
};

export type DealScore = {
  score: number;
  label: 'Fantastisk deal' | 'God deal' | 'Interessant' | 'Ikke en deal';
  reasons: string[];
};

const clamp = (value: number, min = 0, max = 100) => Math.min(max, Math.max(min, value));

/**
 * Evidence-first scoring. We deliberately do not score an offer as a published
 * deal unless it has a valid affiliate URL and a positive price.
 */
export function calculateDealScore(input: DealInput): DealScore {
  if (!input.affiliateUrl || input.currentPrice <= 0) {
    return { score: 0, label: 'Ikke en deal', reasons: ['Mangler aktiv affiliate-lenke'] };
  }

  let score = 20;
  const reasons: string[] = [];
  const current = input.currentPrice;

  const addDiscount = (reference: number | null | undefined, points: number, name: string) => {
    if (!reference || reference <= current) return;
    const discount = (reference - current) / reference;
    const contribution = clamp(discount * points * 2, 0, points);
    score += contribution;
    if (discount >= 0.1) reasons.push(`${Math.round(discount * 100)} % under ${name}`);
  };

  addDiscount(input.referencePrice, 20, 'referansepris');
  addDiscount(input.lowestPrice30d, 20, '30-dagers sammenligningspris');
  addDiscount(input.lowestPrice90d, 20, '90-dagers sammenligningspris');

  if (input.competitorLowestPrice && current < input.competitorLowestPrice) {
    const advantage = (input.competitorLowestPrice - current) / input.competitorLowestPrice;
    score += clamp(advantage * 200, 0, 15);
    reasons.push('Lavere pris enn andre sammenlignede tilbud');
  }

  if (input.inStock) score += 5;
  score = Math.round(clamp(score));

  const label = score >= 80 ? 'Fantastisk deal' : score >= 65 ? 'God deal' : score >= 50 ? 'Interessant' : 'Ikke en deal';
  return { score, label, reasons: reasons.slice(0, 4) };
}

export function shouldPublishDeal(input: DealInput): boolean {
  const result = calculateDealScore(input);
  return Boolean(input.affiliateUrl) && result.score >= 65 && Boolean(input.inStock ?? true);
}
