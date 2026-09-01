import { summarizeDeals } from '@/src/lib/admin-metrics'
import { getDemoScore, demoDeals } from '@/lib/demo-deals'

export const metadata = {
  title: 'Control Center | DealRadar',
  robots: { index: false, follow: false },
}

export default function AdminPage() {
  const adminDeals = demoDeals.map((deal) => {
    const score = getDemoScore(deal)
    return {
      score: score.score,
      publishable: score.score >= 65 && deal.stock === 'in_stock',
      affiliateUrl: null,
      inStock: deal.stock === 'in_stock',
      status: score.score >= 65 ? 'active' as const : 'review' as const,
    }
  })

  const metrics = summarizeDeals(adminDeals)

  const cards = [
    ['Produkter', metrics.total],
    ['Kan publiseres', metrics.publishable],
    ['Exceptional', metrics.exceptional],
    ['Great', metrics.great],
    ['Til vurdering', metrics.needsReview],
    ['Utsolgt', metrics.outOfStock],
  ]

  return (
    <main style={{ minHeight: '100vh', background: '#07100e', color: '#eef8f4', padding: '48px 24px', fontFamily: 'Inter, system-ui, sans-serif' }}>
      <div style={{ maxWidth: 1180, margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: 24, alignItems: 'flex-end', marginBottom: 36 }}>
          <div>
            <div style={{ color: '#7df5c5', fontSize: 13, fontWeight: 800, letterSpacing: '.14em', textTransform: 'uppercase' }}>DealRadar</div>
            <h1 style={{ fontSize: 'clamp(34px, 5vw, 58px)', lineHeight: .98, margin: '10px 0 12px', letterSpacing: '-.04em' }}>Control Center</h1>
            <p style={{ margin: 0, color: '#91a7a0', maxWidth: 650 }}>Her skal vi etter hvert se feed-status, Deal Score, trafikk, utgående klikk og affiliate-status på ett sted.</p>
          </div>
          <div style={{ border: '1px solid #24443a', background: '#0b1714', borderRadius: 14, padding: '12px 16px', color: '#9fb4ad', fontSize: 13 }}>Feed: <strong style={{ color: '#f0faf6' }}>klar for Partner-ads</strong></div>
        </div>

        <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(160px,1fr))', gap: 12, marginBottom: 28 }}>
          {cards.map(([label, value]) => (
            <div key={label} style={{ border: '1px solid #1d3630', background: 'linear-gradient(145deg,#0d1b17,#09130f)', borderRadius: 18, padding: 20 }}>
              <div style={{ color: '#809891', fontSize: 12, textTransform: 'uppercase', letterSpacing: '.08em' }}>{label}</div>
              <div style={{ fontSize: 34, fontWeight: 800, marginTop: 8 }}>{value}</div>
            </div>
          ))}
        </section>

        <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))', gap: 16 }}>
          <Panel title="Affiliate readiness" items={[
            ['Partner-ads', 'Klar som feed-adapter'],
            ['Adtraction', 'Bygg trafikk først'],
            ['Tracking', 'Neste steg'],
            ['Automatisk import', 'Klar når feed-URL er lagt inn'],
          ]} />
          <Panel title="Publiseringsregler" items={[
            ['Minimum score', '65 / 100'],
            ['Lagerstatus', 'Må være på lager'],
            ['Affiliate URL', 'Må være gyldig HTTPS'],
            ['Prisdata', 'Oppdateres regelmessig'],
          ]} />
          <Panel title="Neste milepæl" items={[
            ['1', 'Velg Partner-ads-programmer med gode feeds'],
            ['2', 'Importer ekte produkter'],
            ['3', 'Bygg historikk før vi roper “deal”'],
            ['4', 'Koble på automatisk publisering'],
          ]} />
        </section>

        <div style={{ marginTop: 28, padding: 18, borderRadius: 16, border: '1px solid #2b493f', background: '#0a1512', color: '#91a7a0', fontSize: 13, lineHeight: 1.6 }}>
          <strong style={{ color: '#dff8ef' }}>Viktig:</strong> Dette kontrollsenteret bruker foreløpig demo-data. Ingen ekte butikkpriser eller affiliate-lenker blir presentert som ekte før en godkjent feed er koblet til.
        </div>
      </div>
    </main>
  )
}

function Panel({ title, items }: { title: string; items: [string, string][] }) {
  return (
    <section style={{ border: '1px solid #1d3630', background: '#0b1714', borderRadius: 20, padding: 22 }}>
      <h2 style={{ margin: '0 0 18px', fontSize: 19 }}>{title}</h2>
      <div style={{ display: 'grid', gap: 12 }}>
        {items.map(([label, value]) => (
          <div key={label} style={{ display: 'flex', justifyContent: 'space-between', gap: 18, paddingBottom: 12, borderBottom: '1px solid #142a24' }}>
            <span style={{ color: '#718981', fontSize: 13 }}>{label}</span>
            <span style={{ color: '#d9eee7', fontSize: 13, textAlign: 'right' }}>{value}</span>
          </div>
        ))}
      </div>
    </section>
  )
}
