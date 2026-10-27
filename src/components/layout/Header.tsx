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
          {/* 모바일: ↺ 아이콘만 남기고 Project·GitHub은 숨김 (카드·상세 페이지로 충분) */}
          <button
            type='button'
            onClick={onReplay}
            title='인트로 다시 보기'
            aria-label='인트로 다시 보기'
            className={`${styles.pill} ${styles.muted} ${styles.replay}`}
          >
            ↺<span className={styles.replayText}>Intro</span>
          </button>
          <Link
            href={`/projects/${featuredProject.id}`}
            className={`${styles.pill} ${styles.hideMobile}`}
          >
            Project
          </Link>
          <a
            href={siteConfig.links.github}
            target='_blank'
            rel='noreferrer'
            className={`${styles.pill} ${styles.hideMobile}`}
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
