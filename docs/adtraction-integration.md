# Adtraction integration plan

Adtraction product feeds are XML and can include product title, price, image URL and stock status. Feed URLs become available after the channel and advertiser relationship is approved. Adtraction recommends API v3 for programmatic access.

## Runtime flow

1. Fetch approved product feeds on a schedule.
2. Parse XML into the normalized Product/Offer model.
3. Require a valid affiliate URL before an offer can be published.
4. Store the current offer and append a price observation.
5. Calculate the Deal Score using the stored history.
6. Publish only offers meeting the minimum score and business rules.

## Credentials

Never commit an Adtraction token or feed URL containing credentials to GitHub. Store secrets as Vercel environment variables.

Suggested environment variables:

- `ADTRACTION_API_TOKEN`
- `DATABASE_URL`
- `CRON_SECRET`

## Tracking

Use EPI/sub-ID values so we can measure which DealRadar deal generated a transaction. A future implementation should encode product/store/deal identifiers into EPI where permitted by the advertiser.
