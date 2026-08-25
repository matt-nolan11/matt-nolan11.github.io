# Site Analytics

The site reports pageviews to [Cloudflare Web Analytics](https://developers.cloudflare.com/web-analytics/).
It is cookieless and does not fingerprint visitors, so no consent banner is
required: a visit is identified by a hash of IP + User-Agent that Cloudflare
cannot reverse and that rotates at midnight UTC.

## Setup

Analytics are wired up but **inert until a token is set**. With the token empty
the beacon is never emitted, so the site makes no third-party request at all.

1. Go to [dash.cloudflare.com](https://dash.cloudflare.com) → **Analytics & Logs**
   → **Web Analytics** → **Add a site**.
2. Enter `matt-nolan11.github.io` as the hostname. Cloudflare shows a snippet
   containing `"token": "..."` — copy just that token value.
3. Paste it into `src/config/analytics.ts`:

   ```ts
   export const cloudflareAnalyticsToken = 'your-token-here';
   ```

4. Commit and push. The deploy workflow rebuilds and data starts appearing in
   the dashboard within a few minutes.

The token is committed rather than kept in a GitHub secret because it is public
by construction — the beacon embeds it in the page source of every site that
uses it. It only names which dashboard a pageview belongs to; it grants no read
access, so a stolen copy can do nothing but send fake pageviews.

## How it works

- `src/config/analytics.ts` — the token, and the single switch that enables or
  disables analytics site-wide.
- `src/components/Analytics.astro` — emits the beacon `<script>`. Gated on
  `import.meta.env.PROD`, so `astro dev` never reports itself and hot reloads
  do not pollute real traffic numbers.
- `src/layouts/Layout.astro` — renders `<Analytics />` in `<head>`. Every page
  goes through this layout, so coverage is automatic.

The `is:inline` directive on the beacon script is load-bearing. Without it
Astro takes ownership of the tag and strips attributes it does not recognise,
including `data-cf-beacon` — the only thing telling the beacon which site it is
reporting for.

## What you get

Pageviews, unique visitors, referrers, top pages, countries, device and browser
breakdowns, and Core Web Vitals. Data is retained for six months on the free
plan.

## Note on ad blockers

Some blocklists include `cloudflareinsights.com`, so expect the dashboard to
undercount a technical audience somewhat. That is true of every hosted
analytics provider; Cloudflare is blocked considerably less often than Google
Analytics.
