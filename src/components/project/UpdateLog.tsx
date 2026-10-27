import type { ProjectUpdate, UpdateType } from '@/data/projects';
import styles from './UpdateLog.module.css';

const TYPE_LABEL: Record<UpdateType, string> = {
  perf: '성능',
  design: '디자인',
  feature: '기능',
  fix: '버그 수정',
};

interface UpdateLogProps {
  label: string; // "05 · UPDATE LOG"
  title: string;
  items: ProjectUpdate[]; // 최신순
}

/** 배포 후 업데이트 타임라인: 날짜 · 점/세로선 · 내용. 가장 최근 항목만 파란 점 */
export function UpdateLog({ label, title, items }: UpdateLogProps) {
  return (
    <section className={styles.log}>
      <div className={styles.label}>{label}</div>
      <h2 className={styles.title}>
        {title}
        <span className={styles.count}>
          {items.length}건 · 최근 {items[0].date}
        </span>
      </h2>

      <ol className={styles.list}>
        {items.map((item, i) => (
          <li key={`${item.date}-${item.title}`} className={styles.item} data-latest={i === 0 || undefined}>
            <time className={styles.date} dateTime={item.date.replaceAll('.', '-')}>
              {item.date.slice(5)}
            </time>
            <div className={styles.content}>
              <div className={styles.head}>
                <span className={styles.tag} data-type={item.type}>
                  {TYPE_LABEL[item.type]}
                </span>
                <h3 className={styles.itemTitle}>{item.title}</h3>
              </div>
              <p className={styles.body}>{item.body}</p>
              {item.metric && (
                <p className={styles.metric}>
                  {item.metric.main}
                  {item.metric.sub && <span className={styles.metricSub}>{item.metric.sub}</span>}
                </p>
              )}
              {item.pr && (
                <a href={item.pr} target='_blank' rel='noreferrer' className={styles.pr}>
                  PR 보기 ↗
                </a>
              )}
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
