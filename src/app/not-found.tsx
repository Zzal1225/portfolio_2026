import Link from 'next/link';
import { featuredProject } from '@/data/projects';
import styles from './not-found.module.css';

// 없는 주소로 들어왔을 때. 루트 레이아웃 안에서 렌더되므로 헤더는 그대로 보인다
export default function NotFound() {
  return (
    <main className={styles.main}>
      <section className={styles.card}>
        <div className={styles.code} aria-hidden>
          4<span className={styles.zero}>0</span>4
        </div>
        <h1 className={styles.title}>페이지를 찾을 수 없어요</h1>
        <p className={styles.body}>주소가 바뀌었거나 없는 페이지예요.</p>
        <div className={styles.actions}>
          <Link href='/' className={`${styles.btn} ${styles.btnDark}`}>
            ← 메인으로
          </Link>
          <Link
            href={`/projects/${featuredProject.id}`}
            className={`${styles.btn} ${styles.btnLight}`}
          >
            프로젝트 보기
          </Link>
        </div>
      </section>
    </main>
  );
}
