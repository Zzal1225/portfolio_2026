"use client";

import { useEffect, useRef } from "react";
import type { ProjectVideo as ProjectVideoData } from "@/data/projects";
import styles from "./ProjectVideo.module.css";

interface ProjectVideoProps {
  video: ProjectVideoData;
  title: string;
  /** detail: 전체 영상이 있으면 컨트롤 달린 전체본을 보여준다 */
  variant?: "card" | "detail";
  className?: string;
}

/** 16:9 프로젝트 영상. 부모가 radius를 정한다. 스펙: design README "미리보기 영상" */
export function ProjectVideo({ video, title, variant = "card", className }: ProjectVideoProps) {
  const ref = useRef<HTMLVideoElement>(null);
  const showFull = variant === "detail" && video.full;

  // autoplay 속성 대신 직접 재생: 모션 줄이기 설정이면 poster만 보여준다.
  // 브라우저는 소리 있는 자동재생을 막으므로 무음으로 시작한다 (상세에선 컨트롤로 소리 켜기 가능)
  useEffect(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    ref.current?.play().catch(() => {});
  }, [showFull]);

  return (
    <div className={`${styles.frame} ${className ?? ""}`}>
      {showFull ? (
        <video
          ref={ref}
          className={styles.video}
          src={video.full!}
          poster={video.poster ?? undefined}
          controls
          muted
          loop
          playsInline
          preload="metadata"
          aria-label={`${title} 전체 영상`}
        />
      ) : video.preview ? (
        <video
          ref={ref}
          className={styles.video}
          src={video.preview}
          poster={video.poster ?? undefined}
          muted
          loop
          playsInline
          preload="metadata"
          aria-label={`${title} 미리보기 영상`}
        />
      ) : (
        <div className={styles.placeholder}>
          <span className={styles.play} aria-hidden>
            ▶
          </span>
          <span className={styles.placeholderText}>프로젝트 미리보기 영상 · 16:9 · 무음 자동 반복</span>
        </div>
      )}

      {!showFull &&
        (video.full ? (
          <a href={video.full} target="_blank" rel="noreferrer" className={styles.fullPill}>
            ▶ 전체 영상 보기
          </a>
        ) : (
          <span className={styles.fullPill}>▶ 전체 영상 보기</span>
        ))}
    </div>
  );
}
