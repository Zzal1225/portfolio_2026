import Link from 'next/link';
import type { Project } from '@/data/projects';
import { ImageSlot } from '@/components/common/ImageSlot';
import { DesignSystemGallery } from './DesignSystemGallery';
import { ProjectVideo } from './ProjectVideo';
import { UpdateLog } from './UpdateLog';
import styles from './ProjectDetail.module.css';

// 프로젝트 상세 공통 템플릿. 스펙: design README "프로젝트 상세 (케이스 스터디)"
// 섹션: 01 개요 → 02 문제·의사결정 → 03 기능·화면 → 04 구현·검증 → 05 UPDATE LOG → 06 회고
export function ProjectDetail({ project }: { project: Project }) {
  const lastMeta = project.meta.length - 1;
  const { quality, designSystem, updates } = project;

  // 선택 섹션(UPDATE LOG 등)이 빠져도 번호가 이어지도록 순서대로 매긴다
  let sectionNo = 0;
  const sectionLabel = (name: string) =>
    `${String(++sectionNo).padStart(2, '0')} · ${name}`;

  return (
    <main className={styles.main}>
      <div className={styles.intro}>
        <Link href='/' className={styles.back}>
          ← MAIN
        </Link>
        <div className={styles.label}>PROJECT · {project.year}</div>
        <h1 className={styles.title}>{project.title}</h1>
        <div className={styles.actions}>
          {project.links.map((link, i) => (
            <a
              key={link.label}
              href={link.href}
              {...(link.href.startsWith('http') && {
                target: '_blank',
                rel: 'noreferrer',
              })}
              className={`${styles.btn} ${i === 0 ? styles.btnDark : styles.btnLight}`}
            >
              {link.label}
            </a>
          ))}
        </div>
      </div>

      {/* 01 · 서비스 소개 · 기간 · 역할 · 기술 스택 */}
      <section className={`${styles.section} ${styles.sectionWide}`}>
        <div className={styles.sectionLabel}>{sectionLabel('프로젝트 개요')}</div>
        <p className={styles.lead}>{project.lead}</p>
        <dl className={styles.meta}>
          {project.meta.map((m, i) => (
            <div
              key={m.label}
              className={`${styles.metaCard} ${i === lastMeta ? styles.metaHighlight : ''}`}
            >
              <dt className={styles.metaLabel}>{m.label}</dt>
              <dd className={styles.metaValue}>{m.value}</dd>
            </div>
          ))}
        </dl>
      </section>

      {/* 02 · 무엇을 해결하려 했고, 왜 이 방식을 선택했는가 */}
      <section className={`${styles.section} ${styles.sectionWide}`}>
        <div className={styles.sectionLabel}>{sectionLabel('문제 정의와 핵심 의사결정')}</div>
        <h2 className={styles.sectionTitle}>{project.problem.title}</h2>
        <p className={styles.body}>{project.problem.body}</p>
        <h3 className={styles.subTitle}>{project.process.title}</h3>
        <ol className={styles.steps}>
          {project.process.steps.map((step, i) => (
            <li key={step.title} className={styles.step}>
              <h4 className={styles.stepHead}>
                <span className={styles.stepNo}>{String(i + 1).padStart(2, '0')}</span>
                {step.title}
              </h4>
              <dl className={styles.stepRows}>
                {step.rows.map((row) => (
                  <div
                    key={row.label}
                    className={`${styles.stepRow} ${row.strong ? styles.stepRowStrong : ''}`}
                  >
                    <dt className={styles.stepLabel}>{row.label}</dt>
                    <dd className={styles.stepText}>{row.text}</dd>
                  </div>
                ))}
              </dl>
              {step.note && <p className={styles.stepNote}>{step.note}</p>}
            </li>
          ))}
        </ol>
      </section>

      {/* 03 · 영상 · 핵심 화면 · 기능 설명 */}
      <section className={`${styles.section} ${styles.sectionWide}`}>
        <div className={styles.sectionLabel}>{sectionLabel('주요 기능과 실제 구동 화면')}</div>
        <ProjectVideo
          video={project.video}
          title={project.cardTitle}
          variant='detail'
          className={styles.video}
        />
        <ul className={styles.features}>
          {project.features.map((f) => (
            <li key={f.name} className={styles.feature}>
              <b className={styles.featureName}>{f.name}</b>
              <span className={styles.featureDesc}>{f.desc}</span>
            </li>
          ))}
        </ul>
        <div className={styles.shots}>
          {project.process.shots.map((shot, i) => (
            <figure key={shot.caption} className={styles.shotFigure}>
              <div className={styles.shot}>
                <ImageSlot
                  src={shot.src}
                  alt={shot.caption}
                  placeholder={`스크린샷 ${i + 1}`}
                  sizes='(max-width: 600px) 100vw, 280px'
                />
              </div>
              <figcaption className={styles.shotCaption}>{shot.caption}</figcaption>
            </figure>
          ))}
        </div>
      </section>

      {/* 04 · 아키텍처 · 성능 · 테스트 · 오류 처리 (+ 디자인 시스템) */}
      {(quality || designSystem) && (
        <section className={`${styles.section} ${styles.sectionWide}`}>
          <div className={styles.sectionLabel}>{sectionLabel('기술적 구현과 검증')}</div>
          {quality && (
            <>
              <dl className={styles.stats}>
                {quality.stats.map((s) => (
                  <div key={s.label} className={styles.stat}>
                    <dt className={styles.statLabel}>{s.label}</dt>
                    <dd className={styles.statValue}>{s.value}</dd>
                    {s.note && <dd className={styles.statNote}>{s.note}</dd>}
                  </div>
                ))}
              </dl>
              <ol className={styles.pipeline} aria-label='CI 흐름'>
                {quality.pipeline.map((stage, i) => (
                  <li key={stage} className={styles.pipelineStage}>
                    <span className={styles.pipelineNo}>{i + 1}</span>
                    {stage}
                  </li>
                ))}
              </ol>
            </>
          )}
          {designSystem && (
            <div id='design-system' className={`${styles.subBlock} ${styles.anchor}`}>
              <h3 className={styles.subTitle}>디자인 시스템</h3>
              <p className={styles.body}>{designSystem.body}</p>
              <DesignSystemGallery
                slides={designSystem.slides}
                fullPages={designSystem.fullPages}
              />
            </div>
          )}
        </section>
      )}

      {/* 05 · 배포 후 개선과 주요 PR */}
      {updates && updates.items.length > 0 && (
        <UpdateLog label={sectionLabel('UPDATE LOG')} title={updates.title} items={updates.items} />
      )}

      {/* 06 · 한계 · 배운 점 · 앞으로의 개선 방향 */}
      <section className={styles.section}>
        <div className={styles.sectionLabel}>{sectionLabel('회고와 다음 단계')}</div>
        <h2 className={styles.sectionTitle}>{project.retro.title}</h2>
        {project.retro.body.map((para) => (
          <p key={para} className={styles.body}>
            {para}
          </p>
        ))}
        {project.retro.aside && (
          <aside className={styles.aside}>
            <div className={styles.asideLabel}>{project.retro.aside.label}</div>
            <p className={styles.asideBody}>{project.retro.aside.body}</p>
          </aside>
        )}
      </section>

      <Link href='/' className={styles.home}>
        <span className={styles.homeArrow} aria-hidden>
          ←
        </span>
        <span className={styles.homeTitle}>메인으로 돌아가기</span>
      </Link>
    </main>
  );
}
