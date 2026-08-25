/**
 * Cloudflare Web Analytics beacon token.
 *
 * Deliberately committed rather than kept in a build secret: the beacon embeds
 * this token in the page source of every site that uses it, so it is public by
 * construction. It only names which dashboard a pageview belongs to — it grants
 * no read access to that dashboard, and nothing can be done with a stolen copy
 * beyond sending fake pageviews.
 *
 * Get one at dash.cloudflare.com → Analytics & Logs → Web Analytics → Add a
 * site. Leave it empty to disable analytics entirely; the beacon is then never
 * emitted, so no third-party request is made at all.
 *
 * The `: string` annotation is deliberate. Without it TypeScript infers the
 * literal type of whatever token is currently pasted in, and the emptiness
 * check in Analytics.astro becomes a provably-always-true comparison that
 * `astro check` rejects (ts2367). Widening keeps '' a legal value of the type,
 * which is what the disable switch depends on.
 */
export const cloudflareAnalyticsToken: string = '293486fcf215464b8704c62837308d58';