import { Pool, type PoolClient } from 'pg'
import { calculateDealScore, type PricePoint } from './deal-engine'
import { isValidAffiliateUrl } from './affiliate-guard'
import type { FeedProduct } from './feed-adapter'

let pool: Pool | null = null

function getPool() {
  if (!process.env.DATABASE_URL) return null
  if (!pool) {
    pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      max: 3,
      idleTimeoutMillis: 10000,
      connectionTimeoutMillis: 5000,
      ssl: process.env.DATABASE_SSL === 'false' ? false : { rejectUnauthorized: false },
    })
  }
  return pool
}

export function databaseConfigured() {
  return Boolean(process.env.DATABASE_URL)
}

export async function persistDealSnapshot(deals: FeedProduct[], network = 'partner-ads') {
  const db = getPool()
  if (!db) return { configured: false, observed: 0, skipped: deals.length }

  const client = await db.connect()
  let observed = 0
  let skipped = 0

  try {
    await client.query('BEGIN')

    for (const deal of deals) {
      if (!deal.productUrl || !isValidAffiliateUrl(deal.affiliateUrl)) {
        skipped += 1
        continue
      }

      const externalId = `${deal.merchant}:${deal.id}`
      const store = await upsertStore(client, deal.merchant, network)
      const product = await upsertProduct(client, deal, externalId)

      const history = await client.query<{ price: string; observed_at: string }>(
        `select price, observed_at
         from price_observations
         where product_id = $1 and store_id = $2 and observed_at >= now() - interval '90 days'
         order by observed_at asc`,
        [product.id, store.id],
      )

      const points: PricePoint[] = history.rows.map((row) => ({
        price: Number(row.price),
        observedAt: row.observed_at,
      }))

      const score = calculateDealScore({
        currentPrice: deal.currentPrice,
        referencePrice: deal.referencePrice,
        history30: points.filter((point) => Date.now() - new Date(point.observedAt).getTime() <= 30 * 86400000),
        history90: points,
        inStock: deal.inStock,
      })

      const offer = await client.query<{ id: string }>(
        `insert into offers (product_id, store_id, price, previous_price, stock, product_url, affiliate_url, last_seen_at)
         values ($1, $2, $3, $4, $5, $6, $7, now())
         on conflict (product_id, store_id) do update set
           price = excluded.price,
           previous_price = excluded.previous_price,
           stock = excluded.stock,
           product_url = excluded.product_url,
           affiliate_url = excluded.affiliate_url,
           last_seen_at = now()
         returning id`,
        [product.id, store.id, deal.currentPrice, deal.referencePrice ?? null, deal.inStock === false ? 'out_of_stock' : 'in_stock', deal.productUrl, deal.affiliateUrl],
      )

      await client.query(
        `insert into price_observations (product_id, store_id, price)
         values ($1, $2, $3)`,
        [product.id, store.id, deal.currentPrice],
      )

      await client.query(
        `insert into deal_scores (offer_id, score, label, reasons, calculated_at)
         values ($1, $2, $3, $4::jsonb, now())
         on conflict (offer_id) do update set
           score = excluded.score,
           label = excluded.label,
           reasons = excluded.reasons,
           calculated_at = now()`,
        [offer.rows[0].id, score.score, score.label, JSON.stringify(score.reasons)],
      )

      observed += 1
    }

    await client.query('COMMIT')
    return { configured: true, observed, skipped }
  } catch (error) {
    await client.query('ROLLBACK')
    throw error
  } finally {
    client.release()
  }
}

async function upsertStore(client: PoolClient, name: string, network: string) {
  const result = await client.query<{ id: string }>(
    `insert into stores (name, network) values ($1, $2)
     on conflict (name, network) do update set active = true
     returning id`,
    [name, network],
  )
  return result.rows[0]
}

async function upsertProduct(client: PoolClient, deal: FeedProduct, externalId: string) {
  const result = await client.query<{ id: string }>(
    `insert into products (external_id, name, category, image_url, updated_at)
     values ($1, $2, $3, $4, now())
     on conflict (external_id) do update set
       name = excluded.name,
       category = excluded.category,
       image_url = excluded.image_url,
       updated_at = now()
     returning id`,
    [externalId, deal.name, deal.category, deal.imageUrl ?? null],
  )
  return result.rows[0]
}
