import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { MDXRemote } from 'next-mdx-remote/rsc';
import remarkGfm from 'remark-gfm';
import { Link } from '@/i18n/navigation';
import { getAllSlugs, getProject } from '@/lib/projects';
import { routing } from '@/i18n/routing';
import { useMDXComponents } from '@/mdx-components';

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
    <article className="container section" style={{ maxInlineSize: 900 }}>
      <Link href="/#work" className="meta" style={{ display: 'inline-block', marginBlockEnd: 24 }}>
        ← {t('backToWork')}
      </Link>
      <p className="eyebrow" style={{ color: 'var(--muted)' }}>
        {frontmatter.year} · {frontmatter.role}
      </p>
      <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 'var(--fs-h2)', lineHeight: 1, letterSpacing: '-0.025em', marginBlock: '12px 16px' }}>
        {frontmatter.title}
      </h1>
      <p style={{ fontSize: 'var(--fs-lead)', color: 'var(--muted)', maxInlineSize: '60ch', marginBlockEnd: 32 }}>
        {frontmatter.blurb}
      </p>

      <div className="meta" style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBlockEnd: 32 }}>
        {frontmatter.stack.map((s) => (
          <span key={s} style={{ border: '1px solid var(--border)', borderRadius: 999, padding: '4px 10px', fontSize: 11 }}>
            {s}
          </span>
        ))}
      </div>

      <div className="b-card reveal" style={{ padding: 32, marginBlockEnd: 32 }}>
        <p className="meta" style={{ marginBlockEnd: 8 }}>{t('problem')}</p>
        <p style={{ marginBlockEnd: 20 }}>{frontmatter.problem}</p>
        <p className="meta" style={{ marginBlockEnd: 8 }}>{t('solution')}</p>
        <p style={{ marginBlockEnd: 20 }}>{frontmatter.solution}</p>
        <p className="meta" style={{ marginBlockEnd: 8 }}>{t('outcome')}</p>
        <p>{frontmatter.outcome}</p>
      </div>

      <div className="case-prose">
        <MDXRemote source={body} components={components} options={{ mdxOptions: { remarkPlugins: [remarkGfm] } }} />
      </div>

      <div style={{ display: 'flex', gap: 16, marginBlockStart: 32 }}>
        {frontmatter.live && (
          <a className="btn btn-ghost magnetic" href={frontmatter.live} rel="noreferrer">{t('live')} →</a>
        )}
        {frontmatter.repo && (
          <a className="btn btn-ghost magnetic" href={frontmatter.repo} rel="noreferrer">{t('repo')} →</a>
        )}
      </div>

      <style>{`
        .case-prose p { font-size: 17px; line-height: 1.7; margin-block: 0 1em; }
        .case-prose h2 { font-family: var(--font-serif); font-size: var(--fs-h3); margin-block: 1.5em 0.5em; }
        .case-prose a { border-bottom: 1px solid var(--accent); padding-bottom: 1px; }
      `}</style>
    </article>
  );
}
