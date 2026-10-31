import assert from 'node:assert/strict';
import test from 'node:test';
import { SITE_URL, STATIC_SITEMAP_PATHS, canonicalUrl, sitemapUrls } from '../lib/siteMetadata';
import { getFallbackDomainRows } from '../lib/supabase/fallbackDomains';

test('canonical URLs use the production origin', () => {
  assert.equal(canonicalUrl('/about'), `${SITE_URL}/about`);
});

test('sitemap includes public routes and unique active and fallback domain URLs', () => {
  const urls = sitemapUrls(['web-development', 'data-science', 'web-development']);

  assert.equal(urls.length, STATIC_SITEMAP_PATHS.length + 6);
  assert.equal(urls.filter((url) => url.endsWith('/domains/web-development')).length, 1);
  assert.ok(urls.includes(`${SITE_URL}/domains/data-science`));
  assert.ok(urls.includes(`${SITE_URL}/domains/deep-learning`));
  assert.ok(urls.includes(`${SITE_URL}/domains/backend-developer`));
  assert.ok(urls.includes(`${SITE_URL}/domains/forward-deployed-engineer`));
  assert.ok(urls.includes(`${SITE_URL}/domains/mlops`));
  assert.ok(urls.every((url) => !/\/(admin|dashboard|login|register|verify)(\/|$)/.test(new URL(url).pathname)));
});

test('fallback domain catalog exposes all four requested tracks and skills', () => {
  const domains = getFallbackDomainRows();

  assert.deepEqual(
    domains.map(({ slug }) => slug),
    ['deep-learning', 'backend-developer', 'forward-deployed-engineer', 'mlops']
  );
  assert.ok(domains.every((domain) => domain.is_active && (domain.domain_skills?.length ?? 0) > 0));
});
