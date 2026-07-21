import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { getAllProjects } from '@/lib/projects';
import { ProjectCard } from '@/components/ProjectCard';
import { HeroMotionDynamic } from '@/components/HeroMotionDynamic';
import homeStyles from './page.module.css';

const STAT_KEYS = ['years', 'shipped', 'clients', 'languages'] as const;
const STAT_VALUES = ['6+', '14', '11', '3'] as const;

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const [t, projects] = await Promise.all([
    getTranslations(),
    getAllProjects(locale as 'en' | 'ar'),
  ]);
  const featured = projects.filter((p) => p.featured).slice(0, 3);

  return (
    <div className={homeStyles.page}>
      {/* Hero */}
      <section className={homeStyles.hero} aria-labelledby="hero-heading">
        <HeroMotionDynamic>
          <p data-hero-eyebrow className={homeStyles.eyebrow}>{t('hero.eyebrow')}</p>
          <h1 id="hero-heading" className={homeStyles.headline}>
            <span data-hero-line>{t('hero.headline')}</span>
          </h1>
          <p data-hero-lede className={homeStyles.lede}>{t('hero.lede')}</p>
          <div className={homeStyles.ctaRow}>
            <Link data-hero-cta href="/#work" className={homeStyles.ctaPrimary}>{t('hero.ctaWork')}</Link>
            <Link data-hero-cta href="/#contact" className={homeStyles.ctaSecondary}>{t('hero.ctaContact')}</Link>
          </div>
        </HeroMotionDynamic>
      </section>

      {/* Bento */}
      <section className={homeStyles.bento} aria-label="Highlights">
        <article className={`${homeStyles.cell} ${homeStyles.cellAbout}`} id="about">
          <span className={homeStyles.cellEyebrow}>{t('about.title')}</span>
          <p className={homeStyles.aboutBody}>{t('about.body')}</p>
        </article>

        <article className={`${homeStyles.cell} ${homeStyles.cellStats}`}>
          <span className={homeStyles.cellEyebrow}>{t('stats.years')} · {t('stats.shipped')} · {t('stats.clients')}</span>
          <ul className={homeStyles.statsList}>
            {STAT_KEYS.map((key, i) => (
              <li key={key} className={homeStyles.stat}>
                <span className={homeStyles.statValue}>{STAT_VALUES[i]}</span>
                <span className={homeStyles.statLabel}>{t(`stats.${key}`)}</span>
              </li>
            ))}
          </ul>
        </article>

        <article className={`${homeStyles.cell} ${homeStyles.cellFeatured}`}>
          <span className={homeStyles.cellEyebrow}>{t('work.title')}</span>
          <ul className={homeStyles.featuredList}>
            {featured.map((p) => (
              <li key={p.slug}>
                <Link href={`/work/${p.slug}`} className={homeStyles.featuredLink}>
                  <span className={homeStyles.featuredTitle}>{p.title}</span>
                  <span className={homeStyles.featuredBlurb}>{p.blurb}</span>
                </Link>
              </li>
            ))}
          </ul>
        </article>

        <article className={`${homeStyles.cell} ${homeStyles.cellStatus}`} id="contact">
          <span className={homeStyles.cellEyebrow}>{t('contact.title')}</span>
          <p className={homeStyles.contactBody}>{t('contact.lede')}</p>
          <ul className={homeStyles.contactLinks}>
            <li><a href="mailto:hello@hussien.example.com">hello@hussien.example.com</a></li>
            <li><a href="https://github.com/hussiensussein" rel="noreferrer">{t('contact.githubLabel')}</a></li>
            <li><a href="https://www.linkedin.com/in/hussiensussein/" rel="noreferrer">{t('contact.linkedinLabel')}</a></li>
          </ul>
        </article>
      </section>

      {/* Selected Work */}
      <section id="work" className={homeStyles.work} aria-labelledby="work-heading">
        <header className={homeStyles.workHead}>
          <h2 id="work-heading" className={homeStyles.workTitle}>{t('work.title')}</h2>
          <p className={homeStyles.workSubtitle}>{t('work.subtitle')}</p>
        </header>
        <div className={homeStyles.workGrid}>
          {projects.map((p) => (
            <ProjectCard key={p.slug} project={p} />
          ))}
        </div>
      </section>
    </div>
  );
}
