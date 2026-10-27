"use client";

import { createContext, useCallback, useContext, useRef, useState, useSyncExternalStore } from "react";
import { usePathname } from "next/navigation";
import { INTRO_SESSION_KEY, siteConfig } from "@/config/site";

// 인트로 단계: idle(대기, 카드 부유) → assembling(조립) → leaving(페이드아웃) → off(언마운트)
export type IntroPhase = "off" | "idle" | "assembling" | "leaving";

interface IntroContextValue {
  phase: IntroPhase;
  /** 헤더 ↺로 직접 재생한 경우. 자동 재생 조건(모바일 등)을 무시한다 */
  forced: boolean;
  /** 오버레이 클릭 → 조립 시작 */
  enter: () => void;
  /** 조립 완료(+120ms) 또는 건너뛰기 → .45s 페이드아웃 후 600ms 뒤 off */
  finish: () => void;
  /** 헤더 "↺ 인트로" → 홈 이동 · 맨 위 스크롤 후 다시 idle */
  replay: () => void;
}

const IntroContext = createContext<IntroContextValue | null>(null);

const prefersReducedMotion = () =>
  typeof matchMedia !== "undefined" && matchMedia("(prefers-reduced-motion: reduce)").matches;

// 모바일(~599px)은 자동 재생하지 않음. 헤더 ↺로는 볼 수 있다 (IntroOverlay.module.css와 같은 기준)
const isMobile = () => typeof matchMedia !== "undefined" && matchMedia("(max-width: 599.98px)").matches;

function shouldShowIntro() {
  if (!siteConfig.features.showIntro || prefersReducedMotion() || isMobile()) return false;
  if (siteConfig.features.introOncePerSession) {
    try {
      if (sessionStorage.getItem(INTRO_SESSION_KEY)) return false;
    } catch {}
  }
  return true;
}

const noopSubscribe = () => () => {};

export function IntroProvider({ children }: { children: React.ReactNode }) {
  // SSR에서도 오버레이를 먼저 그려 메인이 번쩍 보이지 않게 한다
  const [phase, setPhase] = useState<IntroPhase>(siteConfig.features.showIntro ? "idle" : "off");
  // 첫 진입이 홈일 때만 자동 재생 (벤토 [data-bento]를 측정해야 하므로)
  const pathname = usePathname();
  const [entryPath] = useState(pathname);
  // reduced-motion · 세션 플래그는 클라이언트에서만 알 수 있음 (서버 스냅샷 = 설정값)
  const autoAllowed = useSyncExternalStore(noopSubscribe, shouldShowIntro, () => siteConfig.features.showIntro);
  // replay는 자동 재생 조건과 무관하게 강제 재생
  const [forced, setForced] = useState(false);
  const effectivePhase = forced || (autoAllowed && entryPath === "/") ? phase : "off";

  const enter = useCallback(() => setPhase((p) => (p === "idle" ? "assembling" : p)), []);

  const offTimer = useRef<number | undefined>(undefined);

  const finish = useCallback(() => {
    if (offTimer.current !== undefined) return; // 건너뛰기 + 조립 완료 중복 호출 방지
    setPhase("leaving");
    try {
      sessionStorage.setItem(INTRO_SESSION_KEY, "1");
    } catch {}
    offTimer.current = window.setTimeout(() => {
      offTimer.current = undefined;
      setPhase("off");
    }, 600);
  }, []);

  const replay = useCallback(() => {
    window.clearTimeout(offTimer.current);
    offTimer.current = undefined;
    window.scrollTo(0, 0);
    setForced(true);
    setPhase("idle");
  }, []);

  return (
    <IntroContext.Provider value={{ phase: effectivePhase, forced, enter, finish, replay }}>
      {children}
    </IntroContext.Provider>
  );
}

export function useIntro() {
  const ctx = useContext(IntroContext);
  if (!ctx) throw new Error("useIntro must be used within IntroProvider");
  return ctx;
}
