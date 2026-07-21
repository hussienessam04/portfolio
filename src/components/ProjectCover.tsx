import styles from './ProjectCover.module.css';

function hash(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
  return Math.abs(h);
}

const PALETTE = [
  ['#5b8cf2', '#a06bff'],
  ['#f25b8c', '#ff8c5b'],
  ['#5bf2a0', '#5b8cf2'],
  ['#f2c45b', '#f25b8c'],
  ['#8c5bf2', '#5bf2c4'],
  ['#5bccf2', '#5b8cf2'],
];

export function ProjectCover({ slug, label }: { slug: string; label: string }) {
  const [a, b] = PALETTE[hash(slug) % PALETTE.length];
  return (
    <div
      className={styles.cover}
      style={{ background: `linear-gradient(135deg, ${a} 0%, ${b} 100%)` }}
      aria-hidden
    >
      <span className={styles.tag}>{label}</span>
    </div>
  );
}
