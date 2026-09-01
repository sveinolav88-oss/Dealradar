import Link from 'next/link';
import { demoDeals, getDemoScore } from '../../lib/demo-deals';

const money = new Intl.NumberFormat('nb-NO', { style: 'currency', currency: 'NOK', maximumFractionDigits: 0 });

export default function DealsPage() {
  return (
    <main className="deals-page">
      <header className="deals-header">
        <Link href="/" className="deals-brand"><span className="brandmark">◉</span>DealRadar</Link>
        <div className="deals-nav"><Link href="/">Forsiden</Link><Link href="/deals">Alle deals</Link><Link href="/#categories">Kategorier</Link></div>
      </header>
      <section className="deals-hero">
        <div><span className="eyebrow light">DEALRADAR · DEMO</span><h1>Deals som tåler et nærmere blikk.</h1><p>Dette er en forhåndsvisning av deal-motoren. Produktene under er kun eksempler mens vi venter på godkjente partnerfeeds.</p></div>
        <div className="method-card"><span>SCORING</span><strong>Pris + historikk + konkurranse</strong><small>Affiliate-lenker aktiveres først når partnerprogrammene er godkjent.</small></div>
      </section>
      <section className="deal-list-wrap">
        <div className="deal-list-head"><div><span className="section-kicker">EKSEMPELDEALS</span><h2>Hva vi vil vise når vi går live</h2></div><span className="demo-badge">Ingen ekte kjøpslenker ennå</span></div>
        <div className="deal-grid">
          {demoDeals.map((deal) => {
            const score = getDemoScore(deal);
            const discount = Math.round((1 - deal.price / deal.referencePrice) * 100);
            return <Link className="deal-card" href={`/deals/${deal.slug}`} key={deal.slug}>
              <div className={`deal-art art-${deal.image}`}><span>{deal.category}</span><b>{deal.image === 'headphones' ? '◒' : deal.image === 'earbuds' ? '◌' : deal.image === 'lego' ? '◇' : '◷'}</b></div>
              <div className="deal-body"><div className="deal-meta"><span>{deal.brand}</span><strong>{score.score}/100</strong></div><h3>{deal.name}</h3><div className="deal-price"><b>{money.format(deal.price)}</b><del>{money.format(deal.referencePrice)}</del><mark>−{discount}%</mark></div><div className="deal-reasons">{score.reasons.slice(0, 2).map((reason) => <span key={reason}>✓ {reason}</span>)}</div><div className="deal-footer"><span>{deal.store}</span><span>Se vurderingen →</span></div></div>
            </Link>;
          })}
        </div>
      </section>
      <section className="data-note"><div className="data-note-icon">✦</div><div><h2>Vi publiserer ikke en deal bare fordi den er billigere enn før.</h2><p>Når ekte partnerdata er koblet på, lagrer vi prisobservasjoner over tid. Det gjør at DealRadar kan skille et dokumentert prisfall fra en høy førpris.</p></div></section>
    </main>
  );
}
