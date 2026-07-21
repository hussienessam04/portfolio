import { Link } from '@/i18n/navigation';
import { ProjectCover } from './ProjectCover';
import type { ProjectFrontmatter } from '@/lib/projects';
import styles from './ProjectCard.module.css';

export function ProjectCard({ project }: { project: ProjectFrontmatter }) {
  return (
    <Link href={`/work/${project.slug}`} className={styles.card}>
      <ProjectCover slug={project.slug} label={project.year} />
      <div className={styles.body}>
        <h3 className={styles.title}>{project.title}</h3>
        <p className={styles.blurb}>{project.blurb}</p>
        <ul className={styles.stack} aria-label="Stack">
          {project.stack.slice(0, 4).map((s) => (
            <li key={s} className={styles.stackItem}>{s}</li>
          ))}
        </ul>
      </div>
    </Link>
  );
}
