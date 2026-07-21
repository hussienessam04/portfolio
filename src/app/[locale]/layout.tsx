import type { Metadata } from 'next';
import { Inter, Tajawal, Fraunces, JetBrains_Mono } from 'next/font/google';
import { notFound } from 'next/navigation';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, getTranslations, setRequestLocale } from 'next-intl/server';
import { routing, type AppLocale } from '@/i18n/routing';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Preloader } from '@/components/Preloader';
import { Fx } from '@/components/Fx';
import { ScrollToTop } from '@/components/ScrollToTop';
import '@/styles/globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' });
const tajawal = Tajawal({ subsets: ['arabic'], variable: '--font-tajawal', display: 'swap', weight: ['400', '500', '700', '800'] });
const fraunces = Fraunces({ subsets: ['latin'], variable: '--font-fraunces', display: 'swap', axes: ['opsz'] });
const mono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-mono', display: 'swap' });

const themeScript = `(() => {
  try {
    var t = localStorage.getItem('hp.theme');
    if (!t) t = 'dark';
    document.documentElement.setAttribute('data-theme', t);
  } catch (e) {}
})();`;

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  if (!(routing.locales as readonly string[]).includes(locale)) return {};
  const t = await getTranslations({ locale, namespace: 'meta' });
  return {
    title: t('title'),
    description: t('description'),
    openGraph: { title: t('title'), description: t('description'), locale: locale === 'ar' ? 'ar_EG' : 'en_US', type: 'website' },
  };
}

const rtlLocales: AppLocale[] = ['ar'];

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!(routing.locales as readonly string[]).includes(locale)) notFound();
  setRequestLocale(locale);

  const messages = await getMessages();
  const dir = rtlLocales.includes(locale as AppLocale) ? 'rtl' : 'ltr';

  return (
    <html lang={locale} dir={dir} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className={`${inter.variable} ${tajawal.variable} ${fraunces.variable} ${mono.variable}`}>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <Preloader />
          <Fx />
          <a href="#main" className="skip">{locale === 'ar' ? 'تخطّي إلى المحتوى' : 'Skip to content'}</a>
          <Header locale={locale} />
          <main id="main">{children}</main>
          <Footer />
          <ScrollToTop />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
