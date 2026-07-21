import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { LanguageToggle } from './LanguageToggle';
import styles from './Header.module.css';

export async function Header() {
  const t = await getTranslations('nav');
  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <Link href="/" className={styles.brand} aria-label="Home">
          <span className={styles.mark}>H</span>
          <span className={styles.name}>Hussien</span>
        </Link>
        <nav className={styles.nav}>
          <Link href="/#work" className={styles.navLink}>{t('work')}</Link>
          <Link href="/#about" className={styles.navLink}>{t('about')}</Link>
          <Link href="/#contact" className={styles.navLink}>{t('contact')}</Link>
        </nav>
        <LanguageToggle />
      </div>
    </header>
  );
}
