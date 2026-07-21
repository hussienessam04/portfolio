import type { MetadataRoute } from 'next';
import { getAllSlugs } from '@/lib/projects';
import { routing } from '@/i18n/routing';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = (process.env.NEXT_PUBLIC_SITE_URL ?? 'https://hussien.example.com').replace(/\/$/, '');
  const slugs = await getAllSlugs();
  const now = new Date();

  const entries: MetadataRoute.Sitemap = [];

  for (const locale of routing.locales) {
    entries.push({
      url: `${base}/${locale}`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 1,
      alternates: { languages: Object.fromEntries(routing.locales.map((l) => [l, `${base}/${l}`])) },
    });

    for (const slug of slugs) {
      entries.push({
        url: `${base}/${locale}/work/${slug}`,
        lastModified: now,
        changeFrequency: 'monthly',
        priority: 0.7,
        alternates: {
          languages: Object.fromEntries(routing.locales.map((l) => [l, `${base}/${l}/work/${slug}`])),
        },
      });
    }
  }

  return entries;
}
