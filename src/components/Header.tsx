import { getMessages, setRequestLocale } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { LanguageToggle } from './LanguageToggle';

export async function Header({ locale }: { locale: string }) {
  setRequestLocale(locale);
  const m = (await getMessages()) as Record<string, unknown>;
  const nav = m.nav as { about: string; work: string; services: string; contact: string; themeToggle: string; menu: string };
  const menu = m.mobileMenu as { items: string[]; email: string };
  const isRtl = locale === 'ar';

  return (
    <>
      <header className="topnav" id="topnav">
        <div className="topnav-inner">
          <Link href="/" className="logo" data-cursor="home">
            <span className="mark">H</span>
            <span>{isRtl ? 'حسين عصام' : 'Hussien Essam'}</span>
          </Link>
          <nav aria-label="primary">
            <a href="#about" className="reveal" data-cursor="view" data-d="1">{nav.about}</a>
            <a href="#work" className="reveal" data-cursor="view" data-d="2">{nav.work}</a>
            <a href="#process" className="reveal" data-cursor="view" data-d="3">{nav.services}</a>
            <a href="#contact" className="reveal" data-cursor="view" data-d="4">{nav.contact}</a>
          </nav>
          <div className="topnav-right">
            <LanguageToggle />
            <button className="theme-toggle" id="themeBtn" type="button" aria-label={nav.themeToggle} data-cursor="set">
              <svg className="i-sun" viewBox="0 0 24 24" width="16" height="16" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" /></svg>
              <svg className="i-moon" viewBox="0 0 24 24" width="16" height="16" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" /></svg>
            </button>
            <button className="mm-btn" id="mmBtn" type="button" aria-label={nav.menu} aria-expanded="false"><span /></button>
          </div>
        </div>
      </header>
      <div className="mm" id="mm" aria-hidden="true">
        <div className="mm-inner">
          <a href="#about" style={{ ['--i' as string]: 0 }}>{menu.items[0]}</a>
          <a href="#work" style={{ ['--i' as string]: 1 }}>{menu.items[1]}</a>
          <a href="#process" style={{ ['--i' as string]: 2 }}>{menu.items[2]}</a>
          <a href="#contact" style={{ ['--i' as string]: 3 }}>{menu.items[3]}</a>
          <div className="mm-meta">
            <a href={`mailto:${menu.email}`}>{menu.email}</a>
          </div>
        </div>
      </div>
    </>
  );
}
