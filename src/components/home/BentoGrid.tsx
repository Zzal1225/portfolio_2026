import Image from 'next/image';
import Link from 'next/link';
import { siteConfig } from '@/config/site';
import { about, career, origin, stack } from '@/data/profile';
import { featuredProject, type Project } from '@/data/projects';
import { ImageSlot } from '@/components/common/ImageSlot';
import { ProjectVideo } from '@/components/project/ProjectVideo';
import styles from './BentoGrid.module.css';

// 메인 벤토 그리드. 반응형 스펙: Mobile ~599 1열 · Tablet 600–1023 2열 · Laptop 1024~ 4열
// 각 카드 루트의 data-bento는 3D 인트로가 위치·배경색을 측정하는 기준이므로 필수.
// DOM 순서 = 태블릿·노트북 배치 순서이자 인트로 흩어짐 각도 순서. 모바일만 CSS order로 재배치.
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
          sizes='120px'
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
      <div className={styles.careerLabel}>{career.label}</div>
      <div className={styles.careerValue}>{career.value.join(' ')}</div>
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
    </section>
  );
}

function ResumeCard() {
  return (
    <a
      href={siteConfig.links.resume}
      target='_blank'
      rel='noreferrer'
      data-bento
      className={`${styles.card} ${styles.white} ${styles.lift} ${styles.resume}`}
    >
      <div className={styles.resumeLabel}>RESUME</div>
      <div className={styles.resumeTitle}>이력서 PDF ↗</div>
    </a>
  );
}

function StackCard() {
  return (
    <section data-bento className={`${styles.card} ${styles.stack}`}>
      <div className={styles.stackLabel}>STACK</div>
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
    </section>
  );
}

// 상세 페이지는 "프로젝트 상세" 버튼(또는 헤더 Project)으로만 이동한다.
// 노트북: 영상 | 정보 좌우 / 그 이하: 위아래
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
      <div className={styles.projectInfo}>
        <div className={styles.projectLabel}>PROJECT · {project.year}</div>
        <h2 className={styles.projectTitle}>{project.cardTitle}</h2>
        {project.cardSummary.map((line) =>
          typeof line === 'string' ? (
            <p key={line} className={styles.projectText}>
              {line}
            </p>
          ) : (
            <div key={line.label} className={styles.featureBlock}>
              <div className={styles.featureLabel}>{line.label}</div>
              <ul className={styles.featureRows}>
                {line.items.map((item) => (
                  <li key={item.name}>
                    <b>{item.name}</b> — {item.desc}
                  </li>
                ))}
              </ul>
            </div>
          ),
        )}
        <div className={styles.projectFooter}>
          <span className={styles.projectStack}>{project.cardStack}</span>
          <Link href={`/projects/${project.id}`} className={styles.projectCta}>
            프로젝트 상세 →
          </Link>
        </div>
      </div>
    </article>
  );
}

function OriginCard() {
  return (
    <section data-bento className={`${styles.card} ${styles.origin}`}>
      <div className={styles.originBody}>
        <div className={styles.originLabel}>{origin.label}</div>
        <h2 className={styles.originTitle}>{origin.title}</h2>
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
      <div className={styles.originShot}>
        <ImageSlot
          src={origin.image}
          alt='퍼블리셔 시절 첫 포트폴리오 사이트 화면'
          placeholder='신입 시절 포트폴리오 캡쳐'
          sizes='(max-width: 599px) 100vw, (max-width: 1023px) 260px, 380px'
          objectPosition='center top'
        />
      </div>
    </section>
  );
}
