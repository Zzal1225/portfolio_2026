# 박찬령 포트폴리오 2026

프론트엔드 개발자 박찬령의 포트폴리오 사이트입니다.
벤토 그리드 메인 화면과 대표 프로젝트 [NANAKI](https://github.com/Zzal1225/nanaki)의 케이스 스터디 페이지로 구성되어 있어요.

**🔗 https://portfolio2026-tau-plum.vercel.app**

## 주요 기능

- **3D 카드 인트로**: three.js로 메인 화면의 카드들을 입체 블록으로 만들어 띄우고, 클릭하면 실제 그리드 위치로 조립됩니다. 카드 위치와 색은 화면의 `[data-bento]` 요소를 측정해 가져오므로 레이아웃이 바뀌어도 인트로가 그대로 따라갑니다. 모바일과 `prefers-reduced-motion` 환경에서는 자동 재생하지 않아요.
- **벤토 그리드 메인**: 소개 · 경력 · 이력서 · 스택 · 대표 프로젝트 · 퍼블리셔 시절 서사를 카드로 배치했습니다.
- **반응형 3단계**: Mobile ~599px(1열) · Tablet 600–1023px(2열) · Laptop 1024px~(4열). 모바일에서는 대표 프로젝트를 두 번째로 올리고, 스크린샷은 가로 스와이프로 보여줍니다.
- **프로젝트 케이스 스터디**: 개요 → 문제 정의와 의사결정 → 기능과 구동 화면 → 구현과 검증 → UPDATE LOG → 회고 순서. 섹션 번호는 데이터 순서대로 자동으로 붙습니다.
- **디자인 시스템 뷰어**: 슬라이드 탭 전환, 클릭해서 확대, 확대 상태에서 ←/→ 키와 버튼으로 넘기기.
- **영상**: 메인에서는 무음 자동 반복, 상세에서는 컨트롤이 달린 영상. 동작 줄이기 설정이면 poster 이미지만 보여줍니다.
- **메타데이터**: 링크 미리보기(Open Graph) 이미지, 벤토 색 파비콘, 사이트 톤에 맞춘 404 페이지.

## 기술 스택

- Next.js 16 (App Router · Cache Components · Partial Prerendering) · React 19 · TypeScript
- CSS Modules + `src/app/globals.css`의 디자인 토큰(CSS 변수)
- three.js 0.160 (3D 인트로, 클라이언트에서만 동적 로드)
- Pretendard (CDN)
- Vercel 배포

## 실행

```bash
npm install
npm run dev     # http://localhost:3000
npm run build
npm run lint
```

## 구조

```
src/
  app/
    layout.tsx                 공통 헤더 · 인트로 · 메타데이터
    page.tsx                   / (벤토 그리드 + 인트로 오버레이)
    projects/[id]/page.tsx     /projects/1 (프로젝트 상세, 정적 생성)
    not-found.tsx              404 페이지
    globals.css                디자인 토큰
    icon.png · apple-icon.png · opengraph-image.png · twitter-image.png
  components/
    layout/Header              sticky 헤더
    home/BentoGrid             메인 카드 6종
    intro/                     인트로 상태(IntroProvider) · 오버레이 · three.js 씬
    project/                   상세 템플릿 · 영상 · 디자인 시스템 뷰어 · UPDATE LOG
    common/ImageSlot           next/image 래퍼 (이미지가 없으면 안내 문구)
  config/site.ts               이름 · 배포 주소 · 기능 플래그 · 외부 링크
  data/profile.ts              메인 카드 콘텐츠 (소개 · 서사 · 경력 · 스택)
  data/projects.ts             프로젝트 콘텐츠 (메인 카드 + 상세 페이지)
public/images/                 프로필 · 프로젝트 영상과 스크린샷 · 디자인 시스템 · 이력서 PDF
```

## 콘텐츠 수정

화면에 보이는 글과 이미지 경로는 컴포넌트가 아니라 **데이터 파일**에서 관리합니다.

| 바꾸고 싶은 것 | 파일 |
|---|---|
| 소개 · 경력 · 스택 · 퍼블리셔 시절 카드 | `src/data/profile.ts` |
| 프로젝트 카드 · 상세 페이지 전체 | `src/data/projects.ts` |
| 이메일 · 이력서 · GitHub 링크, 인트로 on/off | `src/config/site.ts` |

배열로 된 글(`body`, `cardSummary` 등)은 **한 칸이 화면의 한 줄(문단)** 이 됩니다.
도메인을 바꾸면 `site.ts`의 `url`도 함께 바꿔야 링크 미리보기 이미지 주소가 맞게 생성돼요.
