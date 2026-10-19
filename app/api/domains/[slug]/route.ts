import { NextResponse } from 'next/server';
import { getCached, setCached } from '@/lib/redis';
import { createServerSupabaseClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

const DOMAIN_TTL_SECONDS = 10 * 60;

export async function GET(_request: Request, { params }: { params: { slug: string } }) {
  const slug = params.slug;
  const cacheKey = `careerai:domain:${slug}`;
  const cached = await getCached(cacheKey);
  if (cached) return NextResponse.json(cached);

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
      if (error.code === 'PGRST116') return NextResponse.json({ error: 'Domain not found.' }, { status: 404 });
      throw error;
    }

    console.info(`[domains] SUPABASE FETCH domain=${slug}`);
    await setCached(cacheKey, data, DOMAIN_TTL_SECONDS);
    return NextResponse.json(data);
  } catch (error) {
    console.error(`[domains] SUPABASE FETCH FAILED domain=${slug}`, error);
    return NextResponse.json({ error: 'Could not load this domain.' }, { status: 500 });
  }
}
