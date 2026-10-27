'use client';

import { useEffect, useRef } from 'react';
import { siteConfig } from '@/config/site';
import { useIntro } from './IntroProvider';
import type { IntroSceneHandle } from './introScene';
import styles from './IntroOverlay.module.css';

// 3D 인트로 오버레이. 스펙: design README "3D 인트로" / 원본 로직: Portfolio.dc.html initIntro()
export function IntroOverlay() {
  const { phase, forced, enter, finish } = useIntro();
  const canvasHost = useRef<HTMLDivElement>(null);
  const scene = useRef<IntroSceneHandle | null>(null);
  // three.js 로딩 전에 클릭된 경우, 씬 생성 직후 조립을 시작하기 위한 플래그
  const assembleRequested = useRef(false);
  const active = phase !== 'off';

  // 오버레이가 켜질 때 씬 생성, off 될 때 dispose
  useEffect(() => {
    if (!active || !canvasHost.current) return;
    let cancelled = false;
    // three.js는 클라이언트에서만 동적 로드
    import('./introScene')
      .then(({ createIntroScene }) => {
        if (cancelled || !canvasHost.current) return;
        scene.current = createIntroScene(canvasHost.current, {
          onAssembled: () => window.setTimeout(finish, 120),
        });
        if (assembleRequested.current) scene.current.assemble();
      })
      .catch(finish); // WebGL 실패 → 인트로 없이 메인
    return () => {
      cancelled = true;
      scene.current?.dispose();
      scene.current = null;
    };
  }, [active, finish]);

  useEffect(() => {
    assembleRequested.current = phase === 'assembling';
    if (phase === 'assembling') scene.current?.assemble();
  }, [phase]);

  if (!active) return null;

  return (
    <div
      className={styles.overlay}
      data-forced={forced || undefined}
      data-leaving={phase === 'leaving' || undefined}
      data-assembling={phase !== 'idle' || undefined}
      onClick={enter}
    >
      <div ref={canvasHost} className={styles.canvas} />

      <div className={styles.center}>
        <div className={styles.eyebrow}>FRONTEND DEVELOPER PORTFOLIO</div>
        <div className={styles.headline}>WELCOME</div>
      </div>

      <div className={styles.chrome}>
        <div className={styles.top}>
          <span className={styles.logo}>
            {siteConfig.name}
            <span className={styles.logoAccent}>{siteConfig.logoSuffix}</span>
          </span>
          <button
            type='button'
            className={styles.skip}
            onClick={(e) => {
              e.stopPropagation();
              finish();
            }}
          >
            건너뛰기
          </button>
        </div>
        <div className={styles.bottom}>
          <span className={styles.cta}>CLICK</span>
        </div>
      </div>
    </div>
  );
}
