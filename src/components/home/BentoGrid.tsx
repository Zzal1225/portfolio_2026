import Image from 'next/image';
import Link from 'next/link';
import { siteConfig } from '@/config/site';
import { about, career, origin, stack } from '@/data/profile';
import { featuredProject, type Project } from '@/data/projects';
import { ImageSlot } from '@/components/common/ImageSlot';
import { ProjectVideo } from '@/components/project/ProjectVideo';
import styles from './BentoGrid.module.css';

// 메인 벤토 그리드. 스펙: design README "메인 (벤토 그리드)"
// 각 카드 루트의 data-bento는 3D 인트로가 위치·배경색을 측정하는 기준이므로 필수.
// 카드 순서 = 화면 배치 순서이자 인트로 흩어짐 각도 순서.
export function BentoGrid() {
  return (
    <main className={styles.main}>
      <div className={styles.grid}>
        <AboutCard />
        <CareerCard />
        <ResumeCard />
        <StackCard />
        <ProjectCard project={featuredProject} />
        <OriginCard />
      </div>
    </main>
  );
}

function AboutCard() {
  return (
    <section data-bento className={`${styles.card} ${styles.about}`}>
      <div className={styles.avatar}>
        <Image
          src={about.avatar}
          alt={`${siteConfig.name} 프로필 사진`}
          fill
          sizes='140px'
          loading='eager'
          className={styles.avatarImg}
        />
      </div>
      <h1 className={styles.aboutHeadline}>
        {about.headline[0]}
        <br />
        {about.headline[1]}
      </h1>
      <p className={styles.aboutIntro}>{about.intro}</p>
    </section>
  );
}

function CareerCard() {
  return (
    <section data-bento className={`${styles.card} ${styles.career}`}>
      <div className={styles.careerSummary}>
        <div className={styles.careerLabel}>{career.label}</div>
        <div className={styles.careerValue}>
          {career.value[0]}
          <br />
          {career.value[1]}
        </div>
      </div>
      <div className={styles.careerDetail}>
        <div>
          <h2 className={styles.careerCompany}>{career.company}</h2>
          <div className={styles.careerMeta}>
            {career.role} · {career.period}
          </div>
        </div>
        <ul className={styles.careerList}>
          {career.highlights.map((h) => (
            <li key={h.text}>
              {h.text}
              {h.note && <span className={styles.careerNote}> ({h.note})</span>}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function ResumeCard() {
  return (
    <a
      href={siteConfig.links.resume}
      data-bento
      className={`${styles.card} ${styles.white} ${styles.lift} ${styles.resume}`}
    >
      <div className={styles.resumeLabel}>RESUME</div>
      <div className={styles.resumeTitle}>
        이력서
        <br />
        PDF ↓
      </div>
    </a>
  );
}

function StackCard() {
  return (
    <section data-bento className={`${styles.card} ${styles.stack}`}>
      <div className={styles.stackLabel}>STACK</div>
      <div className={styles.stackGroups}>
        <div className={styles.stackGroup}>
          <h3 className={styles.stackHeading}>실무에서 사용했어요.</h3>
          <ul className={styles.chips}>
            {stack.work.map((s) => (
              <li key={s} className={`${styles.chip} ${styles.chipLight}`}>
                {s}
              </li>
            ))}
          </ul>
        </div>
        <div className={styles.stackGroup}>
          <h3 className={`${styles.stackHeading} ${styles.stackHeadingSub}`}>
            프로젝트에서 사용해봤어요.
          </h3>
          <ul className={styles.chips}>
            {stack.project.map((s) => (
              <li key={s} className={`${styles.chip} ${styles.chipDark}`}>
                {s}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

function OriginCard() {
  return (
    <section data-bento className={`${styles.card} ${styles.origin}`}>
      <div className={styles.originBody}>
        <div className={styles.originLabel}>{origin.label}</div>
        <h2 className={styles.originTitle}>{origin.title}</h2>
        <div className={styles.originRow}>
          <div className={styles.originText}>
            {origin.body.map((line) => (
              <p key={line}>{line}</p>
            ))}
          </div>
          <a
            href={siteConfig.links.originSite}
            target='_blank'
            rel='noreferrer'
            className={styles.darkPill}
          >
            당시 사이트 ↗
          </a>
        </div>
      </div>
      <div className={styles.originShot}>
        <ImageSlot
          src={origin.image}
          alt='퍼블리셔 시절 첫 포트폴리오 사이트 화면'
          placeholder='신입 시절 포트폴리오 캡쳐'
          sizes='(max-width: 759px) 100vw, 380px'
          objectPosition='center top'
        />
      </div>
    </section>
  );
}

// 상세 페이지는 "케이스 스터디 보기" 버튼(또는 헤더 Project)으로만 이동한다.
function ProjectCard({ project }: { project: Project }) {
  return (
    <article
      data-bento
      className={`${styles.card} ${styles.white} ${styles.project}`}
    >
      <ProjectVideo
        video={project.video}
        title={project.cardTitle}
        className={styles.projectVideo}
      />
      <div className={styles.projectFoot}>
        <div className={styles.projectText}>
          <div className={styles.projectLabel}>PROJECT · {project.year}</div>
          <h2 className={styles.projectTitle}>{project.cardTitle}</h2>
          {project.cardSummary.length > 0 && (
            <div className={styles.projectSummary}>
              {project.cardSummary.map((line) =>
                typeof line === 'string' ? (
                  <p key={line}>{line}</p>
                ) : (
                  <div key={line.label} className={styles.summaryList}>
                    <div className={styles.summaryListLabel}>{line.label}</div>
                    <ul>
                      {line.items.map((item) => (
                        <li key={item.name}>
                          <b>{item.name}</b> — {item.desc}
                        </li>
                      ))}
                    </ul>
                  </div>
                ),
              )}
            </div>
          )}
          <div className={styles.projectStack}>{project.cardStack}</div>
        </div>
        <Link href={`/projects/${project.id}`} className={styles.projectCta}>
          프로젝트 상세 →
        </Link>
      </div>
    </article>
  );
}
