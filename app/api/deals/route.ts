import { NextResponse } from 'next/server';
import { demoDeals, getDemoScore } from '../../../lib/demo-deals';

export async function GET() {
  const deals = demoDeals.map((deal) => ({
    ...deal,
    score: getDemoScore(deal),
    demo: true,
    publishable: false,
    reason: 'Venter på godkjent affiliate-program og ekte partnerfeed'
  }));

  return NextResponse.json({
    source: 'demo',
    generatedAt: new Date().toISOString(),
    deals
  }, { headers: { 'Cache-Control': 's-maxage=300, stale-while-revalidate=600' } });
}
