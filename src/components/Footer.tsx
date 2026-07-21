import { getTranslations } from 'next-intl/server';
import styles from './Footer.module.css';

export async function Footer() {
  const t = await getTranslations('footer');
  const year = new Date().getFullYear();
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <p className={styles.line}>{t('copyright', { year })}</p>
        <p className={styles.line}>{t('builtWith')}</p>
      </div>
    </footer>
  );
}
