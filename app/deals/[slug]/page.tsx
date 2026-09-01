import Link from 'next/link';
import { notFound } from 'next/navigation';
import { demoDeals, getDemoDeal, getDemoScore } from '../../../lib/demo-deals';

const money = new Intl.NumberFormat('nb-NO', { style: 'currency', currency: 'NOK', maximumFractionDigits: 0 });

export function generateStaticParams() { return demoDeals.map((deal) => ({ slug: deal.slug })); }

export default async function DealDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const deal = getDemoDeal(slug);
  if (!deal) notFound();
  const score = getDemoScore(deal!);
  const discount = Math.round((1 - deal!.price / deal!.referencePrice) * 100);

  return <main className="detail-page">
    <header className="deals-header"><Link href="/" className="deals-brand"><span className="brandmark">◉</span>DealRadar</Link><Link href="/deals" className="back-link">← Alle deals</Link></header>
    <div className="detail-wrap">
      <div className={`detail-art art-${deal!.image}`}><span>{deal!.category}</span><b>{deal!.image === 'headphones' ? '◒' : deal!.image === 'earbuds' ? '◌' : deal!.image === 'lego' ? '◇' : '◷'}</b></div>
      <article className="detail-content">
        <span className="demo-badge">EKSEMPEL · IKKE KJØPSLENKE</span><p className="detail-brand">{deal!.brand}</p><h1>{deal!.name}</h1><p className="detail-description">{deal!.description}</p>
        <div className="score-panel"><div><span>DEALRADAR SCORE</span><strong>{score.score}<em>/100</em></strong><b>{score.label}</b></div><div className="score-bars"><label><span>Pris mot referanse</span><i><u style={{width: `${Math.min(100, discount * 2)}%`}} /></i></label><label><span>30 dagers historikk</span><i><u style={{width: `${Math.min(100, Math.round((1 - deal!.price / deal!.lowestPrice30d) * 1000))}%`}} /></i></label><label><span>Konkurrentpris</span><i><u style={{width: `${Math.min(100, Math.round((1 - deal!.price / deal!.competitorLowestPrice) * 1000))}%`}} /></i></label></div></div>
        <div className="price-summary"><div><small>Nå</small><strong>{money.format(deal!.price)}</strong></div><div><small>Referanse</small><del>{money.format(deal!.referencePrice)}</del></div><div><small>Laveste 90 dager</small><b>{money.format(deal!.lowestPrice90d)}</b></div><mark>−{discount}%</mark></div>
        <div className="history-box"><div><span>PRISHISTORIKK</span><b>Eksempel på datapunkter</b></div><div className="history-line"><i/><i/><i/><i/><i/><i/><i/></div><div className="history-labels"><span>90 dager</span><span>30 dager</span><span>Nå</span></div></div>
        <div className="why-good"><h2>Hvorfor får den {score.score}/100?</h2>{score.reasons.map((reason) => <p key={reason}>✓ {reason}</p>)}</div>
        <div className="affiliate-note"><strong>Affiliate kommer senere</strong><span>Dette er en demo. Når Adtraction-programmer er godkjent, erstattes demoen med ekte butikk-, pris- og trackingdata.</span></div>
      </article>
    </div>
  </main>;
}
