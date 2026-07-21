'use client';

import { useLocale } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { usePathname } from 'next/navigation';
import { routing } from '@/i18n/routing';
import styles from './LanguageToggle.module.css';

export function LanguageToggle() {
  const locale = useLocale();
  const fullPath = usePathname() || '/';
  // ponytail: next-intl Link with `locale` re-prefixes the path. Strip the
  // current locale prefix first so we don't double it.
  const path = fullPath.replace(new RegExp(`^/(${routing.locales.join('|')})`), '') || '/';
  const other = routing.locales.find((l) => l !== locale) ?? 'en';
  const label = other === 'ar' ? 'العربية' : 'English';

  return (
    <Link
      href={path}
      locale={other}
      className={styles.toggle}
      aria-label={`Switch language to ${label}`}
    >
      <span className={styles.dot} aria-hidden />
      {label}
    </Link>
  );
}
