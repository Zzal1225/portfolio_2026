# 김개발 포트폴리오

디자인 원본: [`../design/design_handoff_portfolio`](../design/design_handoff_portfolio) (`Portfolio.dc.html`을 브라우저로 열면 동작 확인 가능, 스펙은 같은 폴더 `README.md`)

## 스택
- Next.js 16 (App Router, Cache Components) · React 19 · TypeScript
- CSS Modules + `src/app/globals.css` 디자인 토큰(CSS 변수)
- three@0.160 (3D 인트로)
- Pretendard v1.3.9 CDN

```bash
npm run dev    # http://localhost:3000
npm run build
npm run lint
```

## 구조
```
src/
  app/
    layout.tsx               공통 헤더 + IntroProvider + Pretendard
    page.tsx                 /  (벤토 + 인트로 오버레이)
    projects/[id]/page.tsx   /projects/1, /projects/2 (정적 생성)
    globals.css              디자인 토큰
  components/
    layout/Header            sticky 헤더 (완료)
    home/BentoGrid           벤토 그리드 (완료)
    intro/IntroProvider      인트로 상태 off | idle | assembling | leaving (완료)
    intro/IntroOverlay       오버레이 + 텍스트 레이어 + 씬 마운트/해제 (완료)
    intro/introScene.ts      three.js 씬 (완료)
    project/ProjectDetail    상세 템플릿 (완료)
  config/site.ts             기능 플래그(showIntro, showGithub, introOncePerSession), 링크
  data/profile.ts            About · 전환 서사 · 경력 · 스택 콘텐츠
  data/projects.ts           프로젝트 01/02 콘텐츠
  lib/github.ts              잔디 데이터 (의사난수 → GraphQL API 교체 예정)
public/images/               avatar.png, portpolio_capture_2023ver.JPG, projects/*
```

## 구현 TODO
- [x] BentoGrid 카드 8종
- [x] ProjectDetail 전체 섹션
- [x] introScene: initIntro() 이식 (환경맵·조명·그림자 벽, idle/hover, 조립, resize/retarget)
- [x] IntroOverlay 텍스트 레이어
- [x] 이미지 `next/image` (ImageSlot: src 없으면 플레이스홀더)

## 교체 필요 에셋 / 링크
- `public/images/projects/`: `p1-cover`, `p2-cover`, `main-shot-1/2`, `p2-shot-1/2` → 파일 추가 후 `data/projects.ts`의 `null`을 경로로 교체
- `src/config/site.ts`: 이메일, 이력서 PDF, 당시 사이트, GitHub 프로필
- `src/data/projects.ts`: 라이브 데모 · 레포 링크
