'use client';

import { Link, usePathname } from '@/i18n/navigation';
import { useLocale } from 'next-intl';
import { routing } from '@/i18n/routing';

export function LanguageToggle() {
  const locale = useLocale();
  const fullPath = usePathname() || '/';
  // ponytail: next-intl Link with `locale` re-prefixes the path. Strip the
  // current locale prefix first so we don't double it.
  const path = fullPath.replace(new RegExp(`^/(${routing.locales.join('|')})`), '') || '/';
  const other = routing.locales.find((l) => l !== locale) ?? 'en';
  const label = other === 'ar' ? 'ع' : 'EN';
  const fullLabel = other === 'ar' ? 'العربية' : 'English';

  return (
    <Link
      href={path}
      locale={other}
      className="lang-toggle"
      aria-label={`Switch language to ${fullLabel}`}
      data-cursor="set"
    >
      <span className="lang-toggle-label">{label}</span>
    </Link>
  );
}
