'use client';

import Image from 'next/image';
import { useRef, useState } from 'react';
import styles from './DesignSystemGallery.module.css';

interface DesignSystemGalleryProps {
  slides: { src: string; label: string }[];
  fullPages: { src: string; label: string }[];
}

/** 디자인 시스템 슬라이드 뷰어: 번호 탭으로 전환, 이미지를 누르면 화면 가득 확대 */
export function DesignSystemGallery({ slides, fullPages }: DesignSystemGalleryProps) {
  const [index, setIndex] = useState(0);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const current = slides[index];
  const go = (step: number) => setIndex((i) => (i + step + slides.length) % slides.length);

  return (
    <div className={styles.gallery}>
      <div className={styles.viewer}>
        <button
          type='button'
          className={styles.stage}
          onClick={() => dialogRef.current?.showModal()}
          aria-label={`${current.label} 크게 보기`}
        >
          <Image
            src={current.src}
            alt={current.label}
            fill
            sizes='(max-width: 880px) 100vw, 832px'
            className={styles.img}
          />
          <span className={styles.zoomHint}>클릭해서 크게 보기</span>
        </button>
        <button type='button' className={`${styles.arrow} ${styles.prev}`} onClick={() => go(-1)} aria-label='이전'>
          ‹
        </button>
        <button type='button' className={`${styles.arrow} ${styles.next}`} onClick={() => go(1)} aria-label='다음'>
          ›
        </button>
      </div>

      <div className={styles.tabs} role='tablist' aria-label='디자인 시스템 항목'>
        {slides.map((slide, i) => (
          <button
            key={slide.src}
            type='button'
            role='tab'
            aria-selected={i === index}
            className={styles.tab}
            onClick={() => setIndex(i)}
          >
            <span className={styles.tabNo}>{String(i + 1).padStart(2, '0')}</span>
            {slide.label}
          </button>
        ))}
      </div>

      {fullPages.length > 0 && (
        <div className={styles.fullPages}>
          <span className={styles.fullPagesLabel}>전체 페이지 캡처</span>
          {fullPages.map((page) => (
            <a key={page.src} href={page.src} target='_blank' rel='noreferrer' className={styles.fullPageLink}>
              {page.label} ↗
            </a>
          ))}
        </div>
      )}

      {/* 확대 보기: 좌우 버튼·←/→ 키로 넘기고, 바깥 배경·닫기 버튼·Esc로 닫힘 */}
      <dialog
        ref={dialogRef}
        className={styles.dialog}
        aria-label={`디자인 시스템 크게 보기: ${current.label}`}
        onClick={(e) => {
          if (e.target === e.currentTarget) dialogRef.current?.close();
        }}
        onKeyDown={(e) => {
          if (e.key === 'ArrowLeft') go(-1);
          if (e.key === 'ArrowRight') go(1);
        }}
      >
        <div className={styles.dialogBar}>
          <span className={styles.dialogCounter}>
            {index + 1} / {slides.length} · {current.label}
          </span>
          <button type='button' className={styles.dialogClose} onClick={() => dialogRef.current?.close()}>
            닫기 ✕
          </button>
        </div>
        <div className={styles.dialogStage}>
          <Image
            src={current.src}
            alt={current.label}
            width={3840}
            height={2160}
            sizes='100vw'
            className={styles.dialogImg}
          />
          <button type='button' className={`${styles.arrow} ${styles.prev}`} onClick={() => go(-1)} aria-label='이전'>
            ‹
          </button>
          <button type='button' className={`${styles.arrow} ${styles.next}`} onClick={() => go(1)} aria-label='다음'>
            ›
          </button>
        </div>
      </dialog>
    </div>
  );
}
