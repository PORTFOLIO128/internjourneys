import type { MetadataRoute } from 'next';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { sitemapUrls, SITE_URL } from '@/lib/siteMetadata';

export const dynamic = 'force-dynamic';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  let domainSlugs: string[] = [];

  try {
    const supabase = createServerSupabaseClient();
    const { data: domains, error } = await supabase
      .from('domains')
      .select('slug')
      .eq('is_active', true)
      .order('display_order', { ascending: true });

    if (!error && domains) {
      domainSlugs = domains.map(({ slug }) => slug);
    } else if (error) {
      console.warn('[sitemap] Supabase domain query returned error, using static routes fallback.', error.message);
    }
  } catch (err) {
    console.warn('[sitemap] Could not connect to Supabase, continuing with static sitemap.', err);
  }

  const urls = sitemapUrls(domainSlugs);
  const now = new Date();

  return urls.map((url) => {
    const isHome = url === SITE_URL || url === `${SITE_URL}/`;
    const isInternships = url.endsWith('/internships');
    const isDomain = url.includes('/domains/');

    return {
      url,
      lastModified: now,
      changeFrequency: isHome ? 'daily' : isInternships ? 'daily' : isDomain ? 'weekly' : 'monthly',
      priority: isHome ? 1.0 : isInternships ? 0.9 : isDomain ? 0.8 : 0.6,
    };
  });
}

