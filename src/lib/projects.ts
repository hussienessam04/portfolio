import 'server-only';
import fs from 'node:fs/promises';
import path from 'node:path';
import matter from 'gray-matter';
import type { AppLocale } from '@/i18n/routing';

export type ProjectFrontmatter = {
  slug: string;
  title: string;
  blurb: string;
  year: string;
  role: string;
  stack: string[];
  problem: string;
  solution: string;
  outcome: string;
  live?: string;
  repo?: string;
  featured: boolean;
  order: number;
};

export type Project = {
  frontmatter: ProjectFrontmatter;
  body: string;
};

const CONTENT_DIR = path.join(process.cwd(), 'src', 'content', 'projects');

function fileFor(slug: string, locale: AppLocale) {
  return path.join(CONTENT_DIR, `${slug}.${locale}.mdx`);
}

function parse(raw: string, slug: string, locale: AppLocale): Project {
  const { data, content } = matter(raw);
  const fm = data as ProjectFrontmatter;
  if (typeof fm.slug !== 'string' || fm.slug !== slug) {
    throw new Error(`frontmatter.slug mismatch for ${slug}.${locale}.mdx`);
  }
  const required: (keyof ProjectFrontmatter)[] = [
    'title', 'blurb', 'year', 'role', 'stack',
    'problem', 'solution', 'outcome', 'featured', 'order',
  ];
  for (const key of required) {
    if (fm[key] === undefined) {
      throw new Error(`missing frontmatter.${key} in ${slug}.${locale}.mdx`);
    }
  }
  return {
    frontmatter: fm,
    body: content,
  };
}

export async function getAllSlugs(): Promise<string[]> {
  const entries = await fs.readdir(CONTENT_DIR);
  const seen = new Set<string>();
  for (const e of entries) {
    const m = e.match(/^(.+)\.([a-z]{2})\.mdx$/);
    if (m) seen.add(m[1]);
  }
  return [...seen];
}

export async function getAllProjects(locale: AppLocale): Promise<ProjectFrontmatter[]> {
  const slugs = await getAllSlugs();
  const out: ProjectFrontmatter[] = [];
  for (const slug of slugs) {
    try {
      const raw = await fs.readFile(fileFor(slug, locale), 'utf8');
      out.push(parse(raw, slug, locale).frontmatter);
    } catch {
      // ponytail: missing locale file falls back to the other locale so the
      // site never renders an empty section while a translation is in flight.
      const fallback = locale === 'en' ? 'ar' : 'en';
      const raw = await fs.readFile(fileFor(slug, fallback), 'utf8');
      out.push(parse(raw, slug, fallback).frontmatter);
    }
  }
  return out.sort((a, b) => a.order - b.order);
}

export async function getProject(slug: string, locale: AppLocale): Promise<Project> {
  try {
    const raw = await fs.readFile(fileFor(slug, locale), 'utf8');
    return parse(raw, slug, locale);
  } catch {
    const fallback = locale === 'en' ? 'ar' : 'en';
    const raw = await fs.readFile(fileFor(slug, fallback), 'utf8');
    return parse(raw, slug, fallback);
  }
}
