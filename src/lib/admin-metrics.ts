export type AdminDeal = { score: number; publishable: boolean; affiliateUrl?: string | null; inStock?: boolean; status?: 'active' | 'watch' | 'expired' | 'review' }

export function summarizeDeals(deals: AdminDeal[]) {
  return {
    total: deals.length,
    publishable: deals.filter(d => d.publishable && d.affiliateUrl).length,
    exceptional: deals.filter(d => d.score >= 90).length,
    great: deals.filter(d => d.score >= 80 && d.score < 90).length,
    needsReview: deals.filter(d => d.status === 'review').length,
    outOfStock: deals.filter(d => d.inStock === false).length,
  }
}
