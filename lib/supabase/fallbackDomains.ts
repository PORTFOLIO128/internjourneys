import { ADDITIONAL_DOMAIN_SLUGS, mockDomains } from '@/data/mockData';
import type { DomainRow } from '@/lib/supabase/types';

const fallbackIconBySlug: Record<(typeof ADDITIONAL_DOMAIN_SLUGS)[number], string> = {
  'deep-learning': 'cpu',
  'backend-developer': 'code',
  'forward-deployed-engineer': 'terminal',
  mlops: 'cloud',
};

const fallbackColorBySlug: Record<(typeof ADDITIONAL_DOMAIN_SLUGS)[number], string> = {
  'deep-learning': 'purple',
  'backend-developer': 'blue',
  'forward-deployed-engineer': 'emerald',
  mlops: 'cyan',
};

export function getFallbackDomainRows(): DomainRow[] {
  return mockDomains
    .filter((domain) => ADDITIONAL_DOMAIN_SLUGS.includes(domain.id as (typeof ADDITIONAL_DOMAIN_SLUGS)[number]))
    .map((domain, index) => {
      const slug = domain.id as (typeof ADDITIONAL_DOMAIN_SLUGS)[number];
      const id = `mock-${slug}`;

      return {
        id,
        slug,
        name: domain.title,
        short_description: domain.description,
        description: domain.description,
        level: domain.level,
        duration_weeks: Number.parseInt(domain.duration, 10),
        duration_label: domain.duration,
        icon: fallbackIconBySlug[slug],
        color: fallbackColorBySlug[slug],
        is_active: true,
        display_order: 100 + index,
        domain_skills: domain.skills.map((skill, skillIndex) => ({
          id: `${id}-skill-${skillIndex + 1}`,
          domain_id: id,
          skill_name: skill,
          display_order: skillIndex + 1,
        })),
        tasks: [],
      };
    });
}

export function getFallbackDomainBySlug(slug: string): DomainRow | null {
  return getFallbackDomainRows().find((domain) => domain.slug === slug) ?? null;
}
