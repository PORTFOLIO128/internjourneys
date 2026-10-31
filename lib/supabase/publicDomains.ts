import { cache } from 'react';
import { getFallbackDomainBySlug } from '@/lib/supabase/fallbackDomains';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import type { DomainRow } from '@/lib/supabase/types';

export const getPublicDomainBySlug = cache(async (slug: string): Promise<DomainRow | null> => {
  const fallback = getFallbackDomainBySlug(slug);

  try {
    const supabase = createServerSupabaseClient();
    const { data, error } = await supabase
      .from('domains')
      .select('*, domain_skills(*), tasks(id,title,task_number,short_description,difficulty,estimated_hours)')
      .eq('slug', slug)
      .eq('is_active', true)
      .eq('tasks.is_active', true)
      .order('display_order', { foreignTable: 'domain_skills', ascending: true })
      .order('display_order', { foreignTable: 'tasks', ascending: true })
      .single();

    if (error) {
      if (error.code === 'PGRST116') return fallback;
      throw error;
    }

    return data as DomainRow;
  } catch (error) {
    if (!fallback) throw error;
    console.warn(`[domains] Supabase lookup failed for ${slug}; serving the static domain record.`, error);
    return fallback;
  }
});
