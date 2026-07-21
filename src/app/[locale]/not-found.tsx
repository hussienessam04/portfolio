import { Link } from '@/i18n/navigation';

export default function NotFound() {
  return (
    <main style={{ maxInlineSize: 720, marginInline: 'auto', padding: '120px 24px', textAlign: 'center' }}>
      <p style={{ fontFamily: 'var(--font-mono)', fontSize: 12, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--muted)' }}>
        404
      </p>
      <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 56, lineHeight: 1, letterSpacing: '-0.02em', margin: '12px 0 16px' }}>
        Not here.
      </h1>
      <p style={{ color: 'var(--muted)', margin: '0 0 24px' }}>
        The page you were after moved or never existed.
      </p>
      <Link href="/" style={{ display: 'inline-block', padding: '12px 20px', borderRadius: 999, background: 'var(--accent)', color: 'var(--accent-on)' }}>
        Go home
      </Link>
    </main>
  );
}
