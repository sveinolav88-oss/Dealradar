import { NextResponse } from 'next/server';
import { demoDeals, getDemoScore } from '../../../lib/demo-deals';
import { getSolarCampDeals, solarCampConfig } from '../../../src/lib/partners/solarcamp';

export const revalidate = 3600;

export async function GET() {
  try {
    const solarCampDeals = await getSolarCampDeals();
    const publishable = solarCampDeals.filter((deal) => deal.publishable);

    return NextResponse.json({
      source: 'partner-ads',
      merchant: solarCampConfig.merchant,
      programId: solarCampConfig.programId,
      commissionPercent: solarCampConfig.commissionPercent,
      generatedAt: new Date().toISOString(),
      products: solarCampDeals.length,
      publishable: publishable.length,
      deals: publishable.slice(0, 100),
    }, { headers: { 'Cache-Control': 's-maxage=3600, stale-while-revalidate=7200' } });
  } catch (error) {
    const deals = demoDeals.map((deal) => ({
      ...deal,
      score: getDemoScore(deal),
      demo: true,
      publishable: false,
      reason: 'SolarCamp-produktfeeden kunne ikke hentes akkurat nå'
    }));

    return NextResponse.json({
      source: 'demo-fallback',
      generatedAt: new Date().toISOString(),
      error: error instanceof Error ? error.message : 'Unknown feed error',
      deals
    }, { status: 200, headers: { 'Cache-Control': 's-maxage=300, stale-while-revalidate=600' } });
  }
}
