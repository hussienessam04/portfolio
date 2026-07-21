# Hussien Essam — Portfolio

Bilingual (EN + AR, RTL) frontend-developer portfolio built with Next.js.

## Stack

- **Next.js 15** (App Router) + **TypeScript** + **React 19**
- **`@next/mdx` + `gray-matter`** — project content as per-locale `.mdx` files
- **`next-intl`** — locale-prefix-always routing (`/en/*`, `/ar/*`)
- **GSAP** as a single client island on the home page
- **CSS Modules** with design tokens (`src/styles/tokens.css`) — palette, fonts, type scale, dark/light via `[data-theme]`
- **Vercel** — zero-config deploy

## Local dev

```bash
npm install
npm run dev
```

Open `http://localhost:3000` — it redirects to `/en` (default locale).

## Project structure

```
src/
  app/
    [locale]/
      layout.tsx            lang + dir, fonts, providers
      page.tsx              bento home
      work/[slug]/page.tsx  case study (RSC, generateStaticParams)
      not-found.tsx
    sitemap.ts              both locales × all projects + hreflang alternates
    robots.ts
    layout.tsx              passthrough (html lives in [locale]/layout.tsx)
  components/               Header, Footer, LanguageToggle, ProjectCard,
                            ProjectCover (CSS-gradient), HeroMotion (GSAP, client)
  content/projects/         <slug>.{en,ar}.mdx — 5 projects × 2 locales = 10 files
  lib/projects.ts           readdir + gray-matter; one locale falls back to the other
  i18n/                     routing, request, navigation
  styles/                   tokens.css (locked), globals.css
messages/{en,ar}.json       every UI string lives here
```

## Add a project (the routine update)

1. Create two files:
   - `src/content/projects/<slug>.en.mdx`
   - `src/content/projects/<slug>.ar.mdx`
2. Each file needs frontmatter matching `src/lib/projects.ts`:
   ```yaml
   ---
   slug: my-project
   title: My Project
   blurb: One-sentence teaser.
   year: "2026"
   role: Solo build
   stack: ["Next.js", "TypeScript"]
   problem: "Problem statement."
   solution: "Solution statement."
   outcome: "Outcome statement."
   live: https://example.com           # optional
   repo: https://github.com/foo/bar    # optional
   featured: true
   order: 6
   ---
   ```
3. Save. The home page, `/[locale]/work/[slug]`, and `sitemap.xml` pick it up automatically. **Zero code edits.**

If only one locale exists, the other is fallback-rendered — the build never fails because of a missing translation.

## Bilingual notes (the bits that must hold)

- `<html lang dir>` set in `src/app/[locale]/layout.tsx`. AR root flips `dir="rtl"`.
- **Logical CSS properties only** — no `left/right`. Let the same CSS mirror both directions.
- Inter (EN) + Tajawal (AR) + Fraunces (serif) + JetBrains Mono (mono) all preloaded via `next/font/google` to avoid CLS.
- Western numerals (0–9) in both locales. Eastern Arabic numerals are not enabled.
- Slugs are identical across locales; only copy differs (`/en/work/streamed` vs `/ar/work/streamed`).
- Every UI string lives in `messages/{en,ar}.json`. No hardcoded English.

## Switching the URL prefix

This repo uses `localePrefix: 'always'` (so `/en` and `/ar`). To switch to "EN at root, AR at `/ar/*`", edit `src/i18n/routing.ts`.

## License

MIT — see `LICENSE`.

---

# حسين عصام — بورتفوليو

بورتفوليو ثنائي اللغة (إنجليزي + عربي، RTL) لمطوّر واجهات، مبنيّ بـ Next.js.

## التشغيل المحلي

```bash
npm install
npm run dev
```

ثم افتح `http://localhost:3000` — سيُعاد التوجيه إلى `/en`.

## إضافة مشروع (التحديث المعتاد)

1. أنشئ ملفَّين:
   - `src/content/projects/<slug>.ar.mdx`
   - `src/content/projects/<slug>.en.mdx`
2. كل ملف يحتاج frontmatter متطابقاً (القالب في ملف `page.tsx`).
3. احفظ — تظهر الصفحة على `/{locale}/work/<slug>` فوراً، ويُحدَّث `sitemap.xml` تلقائياً.

## حزم مهمة حول ثنائية اللغة

- وسم `<html lang dir>` يُحدَّد في `src/app/[locale]/layout.tsx`؛ النسخة العربية تستخدم `dir="rtl"`.
- **خصائص CSS منطقية فقط** — لا `left/right`، اجعل نفس CSS يعمل في الاتجاهَين.
- الأرقام غربية (0–9) في اللغتَين؛ لا أرقام عربية شرقية.
- الـ slug نفسه في اللغتَين؛ يختلف النصّ فقط.
- كل سلسلة UI في `messages/{en,ar}.json`؛ لا نصّ إنجليزي مكتوب يدوياً في المكونات.

## الترخيص

MIT.
