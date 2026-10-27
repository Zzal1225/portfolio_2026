// 프로토타입 Tweaks(showIntro)와 링크 placeholder를 한곳에서 관리한다.
// href="#" 인 값은 실제 링크로 교체 필요.

export const siteConfig = {
  name: '박찬령 ',
  logoSuffix: 'PORTFOLIO', // 로고: 이름 + 블루 PORTFOLIO
  title: '박찬령 — 프론트엔드 개발자 포트폴리오',
  description: '퍼블리셔에서 프론트엔드로, 블록처럼 쌓아 올린 인터페이스.',

  features: {
    showIntro: true,
    // 인트로를 세션당 1회만 보여줄지 (미정 → 플래그로 전환)
    introOncePerSession: false,
  },

  links: {
    email: 'pakcam35@naver.com',
    resume: '#', // 이력서 PDF (public/resume.pdf 권장)
    originSite: 'https://ryeong-portfolio.netlify.app/', // 신입 시절 포트폴리오 사이트
    github: 'https://github.com/',
  },
} as const;

export const INTRO_SESSION_KEY = 'portfolio:intro-seen';
