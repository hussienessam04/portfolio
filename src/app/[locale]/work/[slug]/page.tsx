import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { MDXRemote } from 'next-mdx-remote/rsc';
import remarkGfm from 'remark-gfm';
import { Link } from '@/i18n/navigation';
import { getAllSlugs, getProject } from '@/lib/projects';
import { ProjectCover } from '@/components/ProjectCover';
import { routing } from '@/i18n/routing';
import { useMDXComponents } from '@/mdx-components';
import styles from './page.module.css';

export async function generateStaticParams() {
  const slugs = await getAllSlugs();
  return slugs.flatMap((slug) => routing.locales.map((locale) => ({ locale, slug })));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!(routing.locales as readonly string[]).includes(locale)) return {};
  try {
    const { frontmatter } = await getProject(slug, locale as 'en' | 'ar');
    return { title: `${frontmatter.title} — ${frontmatter.year}`, description: frontmatter.blurb };
  } catch {
    return {};
  }
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  if (!(routing.locales as readonly string[]).includes(locale)) notFound();
  setRequestLocale(locale);

  const [{ frontmatter, body }, t] = await Promise.all([
    getProject(slug, locale as 'en' | 'ar'),
    getTranslations('work'),
  ]);
  const components = useMDXComponents({});

  return (
    <article className={styles.article}>
      <Link href="/#work" className={styles.back}>{t('backToWork')} ←</Link>

      <header className={styles.head}>
        <p className={styles.eyebrow}>{frontmatter.year} · {frontmatter.role}</p>
        <h1 className={styles.title}>{frontmatter.title}</h1>
        <p className={styles.blurb}>{frontmatter.blurb}</p>
      </header>

      <ProjectCover slug={frontmatter.slug} label={frontmatter.year} />

      <div className={styles.metaGrid}>
        <div>
          <span className={styles.metaLabel}>{t('stack')}</span>
          <ul className={styles.metaList}>
            {frontmatter.stack.map((s) => (
              <li key={s} className={styles.metaChip}>{s}</li>
            ))}
          </ul>
        </div>
        {frontmatter.live && (
          <a className={styles.metaLink} href={frontmatter.live} rel="noreferrer">
            {t('live')} ↗
          </a>
        )}
        {frontmatter.repo && (
          <a className={styles.metaLink} href={frontmatter.repo} rel="noreferrer">
            {t('repo')} ↗
          </a>
        )}
      </div>

      <section className={styles.body}>
        <div className={styles.prose}>
          <MDXRemote source={body} components={components} options={{ mdxOptions: { remarkPlugins: [remarkGfm] } }} />
        </div>

        <aside className={styles.aside}>
          <div>
            <span className={styles.metaLabel}>{t('problem')}</span>
            <p>{frontmatter.problem}</p>
          </div>
          <div>
            <span className={styles.metaLabel}>{t('solution')}</span>
            <p>{frontmatter.solution}</p>
          </div>
          <div>
            <span className={styles.metaLabel}>{t('outcome')}</span>
            <p>{frontmatter.outcome}</p>
          </div>
        </aside>
      </section>
    </article>
  );
}
