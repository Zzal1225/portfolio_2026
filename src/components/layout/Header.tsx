'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { siteConfig } from '@/config/site';
import { featuredProject } from '@/data/projects';
import { useIntro } from '@/components/intro/IntroProvider';
import styles from './Header.module.css';

export function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const { replay } = useIntro();

  const onReplay = () => {
    if (pathname !== '/') router.push('/');
    replay();
  };

  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <Link href='/' className={styles.logo}>
          {siteConfig.name}
          <span className={styles.accent}>{siteConfig.logoSuffix}</span>
        </Link>
        <nav className={styles.nav}>
          <button
            type='button'
            onClick={onReplay}
            title='인트로 다시 보기'
            className={`${styles.pill} ${styles.muted}`}
          >
            ↺ Intro
          </button>
          <Link
            href={`/projects/${featuredProject.id}`}
            className={styles.pill}
          >
            Project
          </Link>
          <a
            href={siteConfig.links.github}
            target='_blank'
            rel='noreferrer'
            className={styles.pill}
          >
            GitHub ↗
          </a>
          <a
            href={siteConfig.links.email}
            className={`${styles.pill} ${styles.contact}`}
          >
            연락하기
          </a>
        </nav>
      </div>
    </header>
  );
}
