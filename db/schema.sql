-- DealRadar persistence model. Intended for PostgreSQL/Supabase.
create extension if not exists pgcrypto;

create table if not exists stores (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  network text not null check (network in ('adtraction','partner-ads','tradetracker')),
  program_id text,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists products (
  id uuid primary key default gen_random_uuid(),
  external_id text,
  ean text,
  brand text,
  name text not null,
  category text,
  image_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index if not exists products_ean_unique on products(ean) where ean is not null;

create table if not exists offers (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references products(id) on delete cascade,
  store_id uuid not null references stores(id) on delete cascade,
  price numeric(12,2) not null check (price > 0),
  previous_price numeric(12,2),
  stock text not null default 'unknown' check (stock in ('in_stock','out_of_stock','unknown')),
  product_url text not null,
  affiliate_url text not null,
  last_seen_at timestamptz not null default now(),
  unique(product_id, store_id)
);

create table if not exists price_observations (
  id bigserial primary key,
  product_id uuid not null references products(id) on delete cascade,
  store_id uuid not null references stores(id) on delete cascade,
  price numeric(12,2) not null check (price > 0),
  observed_at timestamptz not null default now()
);

create index if not exists price_observations_lookup on price_observations(product_id, store_id, observed_at desc);

create table if not exists deal_scores (
  offer_id uuid primary key references offers(id) on delete cascade,
  score integer not null check (score between 0 and 100),
  label text not null,
  reasons jsonb not null default '[]'::jsonb,
  calculated_at timestamptz not null default now()
);
