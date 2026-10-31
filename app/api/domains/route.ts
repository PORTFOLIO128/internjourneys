import { NextResponse } from 'next/server';
import { getCached, setCached } from '@/lib/redis';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { getFallbackDomainRows } from '@/lib/supabase/fallbackDomains';
import type { DomainRow } from '@/lib/supabase/types';

export const dynamic = 'force-dynamic';

const CACHE_KEY = 'careerai:domains';
const DOMAINS_TTL_SECONDS = 10 * 60;

export async function GET() {
  const cached = await getCached<DomainRow[]>(CACHE_KEY);
  if (cached) {
    const domainsBySlug = new Map(cached.map((domain) => [domain.slug, domain]));
    for (const domain of getFallbackDomainRows()) {
      if (!domainsBySlug.has(domain.slug)) domainsBySlug.set(domain.slug, domain);
    }
    return NextResponse.json(Array.from(domainsBySlug.values()));
  }

  let domains: DomainRow[] = [];
  try {
    const supabase = createServerSupabaseClient();
    const { data, error } = await supabase
      .from('domains')
      .select('*, domain_skills(*), tasks(id,title,task_number,short_description,difficulty,estimated_hours)')
      .eq('is_active', true)
      .eq('tasks.is_active', true)
      .order('display_order', { ascending: true })
      .order('display_order', { foreignTable: 'domain_skills', ascending: true })
      .order('display_order', { foreignTable: 'tasks', ascending: true });

    if (error) throw error;
    console.info('[domains] SUPABASE FETCH active domains');
    domains = (data || []) as DomainRow[];
  } catch (error) {
    console.warn('[domains] SUPABASE FETCH FAILED; serving the static domain catalog.', error);
  }

  const domainsBySlug = new Map(domains.map((domain) => [domain.slug, domain]));
  for (const domain of getFallbackDomainRows()) {
    if (!domainsBySlug.has(domain.slug)) domainsBySlug.set(domain.slug, domain);
  }

  const response = Array.from(domainsBySlug.values());
  await setCached(CACHE_KEY, response, DOMAINS_TTL_SECONDS);
  return NextResponse.json(response);
}
