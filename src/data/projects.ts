// 프로젝트 콘텐츠 (메인 카드 + 상세 페이지).
// 메인 화면과 헤더 "Project"는 첫 번째 프로젝트(featuredProject)를 노출한다.

/** 메인 카드 · 상세 상단에서 공유하는 16:9 영상. 값이 null이면 플레이스홀더 */
export interface ProjectVideo {
  preview: string | null; // 10~20초 무음 하이라이트 (mp4). 메인에서 자동 반복 재생
  full: string | null; // 소리 포함 전체 영상. "전체 영상 보기" · 상세 페이지
  poster: string | null; // 첫 프레임 이미지. 로딩 전 · 모션 줄이기 설정 시 노출
}

/** 소개글 안의 목록 블록 (예: 핵심 기능). name은 굵게, desc는 그 뒤에 이어진다 */
export interface SummaryList {
  label: string;
  items: { name: string; desc: string }[];
}

/** UPDATE LOG 항목 종류 → 칩 색: perf 파랑 · design 검정 · feature 노랑 · fix 코랄 */
export type UpdateType = 'perf' | 'design' | 'feature' | 'fix';

export interface ProjectUpdate {
  date: string; // 'YYYY.MM.DD' (화면에는 MM.DD로 표시)
  type: UpdateType;
  title: string;
  body: string;
  metric?: { main: string; sub?: string }; // 고정폭 글씨 수치 줄 (선택)
  pr?: string; // PR 주소 (선택)
}

export interface Project {
  id: string; // 라우트 /projects/[id]
  year: string;
  title: string; // 상세 H1
  cardTitle: string; // 메인 카드 제목
  // 메인 카드 소개글. 배열 한 칸 = 한 줄(문단) 또는 목록 블록, 빈 배열이면 숨김
  cardSummary: (string | SummaryList)[];
  cardStack: string; // 메인 카드 스택 라인
  lead: string;
  links: { label: string; href: string }[]; // 상단 버튼. 첫 번째만 검정 버튼
  meta: { label: string; value: string }[]; // 기간 / 역할 / 스택 / 결과(마지막은 옐로)
  video: ProjectVideo;
  // 상세 섹션 순서: 01 개요(lead·meta) → 02 문제·의사결정(problem·process.steps)
  // → 03 기능·화면(video·features·shots) → 04 구현·검증(quality·designSystem)
  // → 05 UPDATE LOG(updates) → 06 회고(retro). 번호는 자동으로 붙는다
  features: { name: string; desc: string }[];
  problem: { title: string; body: string };
  process: {
    title: string;
    // rows: 왼쪽 라벨 | 오른쪽 내용 한 줄씩. strong: 강조 줄(예: 결과)
    // note: 카드 하단 회색 작은 글씨 (선택)
    steps: {
      title: string;
      rows: { label: string; text: string; strong?: boolean }[];
      note?: string;
    }[];
    shots: { src: string | null; caption: string }[];
  };
  // 선택 섹션: 없으면 해당 섹션을 숨긴다
  quality?: {
    stats: { label: string; value: string; note?: string }[];
    pipeline: string[]; // CI 흐름 단계 (화살표로 연결)
  };
  designSystem?: {
    body: string;
    slides: { src: string; label: string }[]; // 16:9 슬라이드. 번호 탭으로 전환
    fullPages: { src: string; label: string }[]; // 세로로 긴 전체 캡처. 새 탭으로 열기
  };
  updates?: { title: string; items: ProjectUpdate[] }; // 최신순으로 작성
  retro: {
    title: string;
    body: string[]; // 배열 한 칸 = 한 문단
    aside?: { label: string; body: string }; // 회고 아래 따로 묶이는 메모 박스 (선택)
  };
}

// 메인 카드 "핵심 기능"과 상세 "03 · 주요 기능"이 같은 목록을 쓴다
const nanakiFeatures = [
  {
    name: '오프라인 우선 동기화',
    desc: '기기에 먼저 저장하고 대기열로 서버와 맞춤, 1만 건 기준 0.93초',
  },
  {
    name: '나키 AI 검색',
    desc: '"지난달보다 식비 많이 썼어?"를 조건으로 바꿔 기기에서 계산, 기록은 AI에 보내지 않음',
  },
  {
    name: '눈바디 사진',
    desc: '실루엣 가이드 촬영과 비교 슬라이더, 비공개 저장소와 만료 링크',
  },
];

export const projects: Project[] = [
  {
    id: '1',
    year: '2026',
    title: 'NANAKI — 나는 나를 키운다.',
    cardTitle: 'NANAKI — 나는 나를 키운다.',
    cardSummary: [
      '가계부·운동·루틴·체형까지, 흩어진 자기관리 기록을 캘린더 하나에 모으는 PWA예요.',
      { label: '핵심 기능', items: nanakiFeatures },
      '1인으로 기획·설계하고 Claude Code와 함께 구현했어요.',
    ],
    cardStack: 'Next.js · TypeScript · Supabase · PWA · Playwright',
    lead: '돈, 몸, 습관. 흩어진 자기관리 기록을 캘린더 하나에 모으는 PWA예요. 1인으로 기획·설계하고 Claude Code와 함께 구현했고, 오프라인에서도 쓸 수 있으며 AI에게 내 기록을 말로 물어볼 수 있게 만들었습니다.',
    // http로 시작하면 새 탭, '#…'이면 같은 페이지 안의 섹션으로 이동
    links: [
      { label: '바로 체험하기 ↗', href: 'https://nanaki-two.vercel.app/' },
      { label: 'GitHub ↗', href: 'https://github.com/Zzal1225/nanaki' },
      { label: '디자인 시스템 ↓', href: '#design-system' },
    ],
    meta: [
      { label: '기간', value: '2026.10.19 – 2026.10.26' },
      { label: '역할', value: '1인으로 기획·설계하고 Claude Code와 함께 구현' },
      {
        label: '스택',
        value: 'Next.js · TypeScript · Supabase · PWA · Playwright',
      },
      {
        label: '핵심 수치',
        value: '1만 건 다시 방문 3.3초 → 0.93초 · 접근성 95+',
      },
    ],
    video: {
      preview: '/images/projects/nanaki-preview.mp4',
      full: '/images/projects/nanaki-preview.mp4', // 미리보기와 같은 파일 (전체 영상)
      poster: '/images/projects/nanaki-preview-poster.png',
    },
    features: nanakiFeatures,
    problem: {
      title: '기록이 앱마다 흩어져 있다',
      body: '가계부, 운동, 루틴, 체형을 각각 다른 앱에 적다 보니 "지난달보다 식비를 많이 썼나?" 같은 질문 하나에도 앱을 여러 개 열어야 했어요. 그래서 5가지 기록을 하나의 공통 데이터 모델로 묶고, 캘린더 하나와 자연어 질문으로 돌아볼 수 있게 만드는 걸 목표로 잡았습니다.',
    },
    process: {
      title: '고민했던 세 가지',
      steps: [
        {
          title: '오프라인 우선 동기화, 1만 건에서 느려진 진짜 원인',
          rows: [
            {
              label: '문제',
              text: '기록 1만 건이면 다시 방문한 모든 화면이 3.3초 걸렸어요.',
            },
            {
              label: '원인',
              text: '늦게 끝나는 저장을 놓치지 않으려고 늘 커서 60초 앞부터 다시 받는 "겹쳐 받기" 때문이었어요. 한꺼번에 넣은 1만 건이 모두 그 60초 안에 있어서, 화면을 열 때마다 1만 건(3.5MB)을 다시 받고 있었죠.',
            },
            {
              label: '해결',
              text: '60초가 지난 뒤 겹쳐 받기를 한 번 마치면 커서를 "확정"하고, 그 뒤로는 커서 바로 뒤부터 받게 바꿨어요.',
            },
            {
              label: '결과',
              text: '놓치지 않는 보장은 그대로, 다시 방문 3.3초 → 0.93초. 300건일 때와 같은 수준이에요.',
              strong: true,
            },
          ],
          note: '측정 조건: CI 테스트용 Supabase · 모바일 412×823 크롬(CPU 4배·느린 망 스로틀링) · 5회 중앙값',
        },
        {
          title: 'AI 나키: 기록은 보내지 않고, 계산은 기기에서',
          rows: [
            {
              label: '보냄',
              text: '질문 문장과 필드 정의(이름·종류·선택지, 내가 만든 분류·태그 이름)만 AI(Gemini)에 보내 검색 조건을 받아요.',
            },
            {
              label: '안 보냄',
              text: '기록 내용(금액·메모·날짜)은 보내지 않아요.',
            },
            {
              label: '검증',
              text: '받은 조건은 Zod로 검증해 허용된 타입·칸만 남기고, 기기에 동기화된 내 기록 사본에서 찾아요.',
            },
            {
              label: '결과',
              text: '합계와 비교도 기기에서 계산하고, 진행 중인 달은 지난달의 같은 일수와 견줍니다.',
              strong: true,
            },
          ],
        },
        {
          title: '아이폰에서만 나는 버그를 자동 테스트로 잡기',
          rows: [
            {
              label: '문제',
              text: '실기기 테스트에서 버그 17건이 나왔고, 그중 11건은 홈 화면 앱·실제 키보드·카메라·파일 선택·인쇄처럼 기기에서만 확인할 수 있는 종류였어요.',
            },
            {
              label: '해결',
              text: '아이폰 크기·터치 E2E에 단골 함정 검사(입력칸 16px·가로 넘침·터치 44px)를 넣었고, 그 뒤로 이 종류는 기기에서 한 건도 나오지 않았어요. WebKit E2E는 최근 50번 실행이 모두 통과한 근거로, 실패하면 병합을 막도록 바꿨습니다.',
            },
            {
              label: '발견',
              text: '이 과정에서 낡은 기준 이미지 24장이 계속 통과하고 있던 것도 찾았어요. 허용치를 0으로 재 보니 같은 화면끼리 차이가 0픽셀이어서, 24장을 새로 찍고 허용치를 전체의 0.2%(수천 픽셀)에서 10픽셀로 줄였습니다.',
            },
            {
              label: '결과',
              text: '자동 테스트가 기기 확인 전에 잡은 실제 버그는 4건이에요.',
              strong: true,
            },
          ],
        },
      ],
      // 2400×2160(10:9) 목업 이미지
      shots: [
        {
          src: '/images/projects/screenshot-1-home-light-dark.png',
          caption: '홈 캘린더 (라이트·다크 나란히)',
        },
        {
          src: '/images/projects/screenshot-2-naki-compare.png',
          caption: '나키 질문 → 조건 칩 → 비교 답',
        },
        {
          src: '/images/projects/screenshot-3-offline-pending.png',
          caption: '오프라인 배너와 미전송 구름 아이콘',
        },
      ],
    },
    quality: {
      stats: [
        {
          label: '단위 테스트',
          value: '845개',
          note: '동기화·스키마·AI 응답 거르기·날짜 계산 등 핵심 로직 위주',
        },
        {
          label: '통합 테스트',
          value: '70개',
          note: '진짜 DB(로컬 Supabase)에서 다른 사용자 데이터 접근 차단(RLS) 확인',
        },
        { label: 'E2E', value: '크로미움 + WebKit' },
        { label: '화면 비교', value: '36장' },
        { label: '성능 측정', value: 'Lighthouse CI' },
      ],

      pipeline: [
        'PR',
        '서식·린트·타입 검사',
        '단위 테스트·빌드',
        'RLS 통합 테스트(로컬 Supabase)',
        'E2E·화면 비교(크로미움·WebKit)',
        'Lighthouse',
        '(main 병합 시) Vercel 배포',
      ],
    },
    designSystem: {
      body: '색(라이트·다크), 글자 크기, 간격, 모서리를 토큰 JSON 하나로 관리하고 CSS 변수로 연결했어요.',
      slides: [
        {
          src: '/images/design-system/nanaki-design-system-01-color.png',
          label: '색상',
        },
        {
          src: '/images/design-system/nanaki-design-system-02-type-space-radius.png',
          label: '글자·간격·모서리',
        },
        {
          src: '/images/design-system/nanaki-design-system-03-components.png',
          label: '컴포넌트',
        },
        {
          src: '/images/design-system/nanaki-design-system-04-brand.png',
          label: '브랜드',
        },
        {
          src: '/images/design-system/nanaki-design-system-05-responsive.png',
          label: '반응형',
        },
      ],
      fullPages: [
        {
          src: '/images/design-system/design-system-page-full-light.png',
          label: '라이트',
        },
        {
          src: '/images/design-system/design-system-page-full-dark.png',
          label: '다크',
        },
      ],
    },
    updates: {
      title: '배포 이후',
      items: [
        {
          date: '2026.10.27',
          type: 'perf',
          title: '배포 Lighthouse 성능 90+',
          body: '원인부터 재 보니 JS 크기보다 LCP 요소가 문제였어요. 투명도 0에서 시작하는 로고 애니메이션이 LCP 후보에서 빠지고 있었고, 기록 탭 카드는 데이터가 온 뒤에야 처음 그려졌어요. 둘을 바로잡고 로그인 버튼 코드와 Sentry를 첫 화면 뒤로 미뤘어요.',
          metric: {
            main: '성능 87·74·74 → 99·95·92',
            sub: '로그인 LCP 3.77s → 1.98s (모바일, 3회 중앙값)',
          },
          pr: 'https://github.com/Zzal1225/nanaki/pull/141',
        },

        {
          date: '2026.10.27',
          type: 'design',
          title: '로그인 화면 글자 대비 올리기',
          body: '초록 바탕 위 슬로건·안내 문구의 대비가 4.30:1이라 4.65:1로 올리고, 토큰 대비를 단위 테스트로 지키게 했어요.',
          metric: { main: '대비 4.30:1 → 4.65:1' },
        },
        {
          date: '2026.10.26',
          type: 'feature',
          title: '나키: 두 기간 비교와 이어 묻기',
          body: '"지난달보다 많이 썼어?"를 기기에서 두 기간으로 계산하고, 앞 질문을 이어 물을 수 있게 했어요. 대화는 이 기기에만 저장돼요.',
        },
        {
          date: '2026.10.26',
          type: 'fix',
          title: '아이폰 백업 불러오기·PDF 보고서',
          body: '불러오기에서 백업 파일이 보이지 않던 문제와 보고서 PDF 위아래가 잘리던 문제를 고쳤어요.',
        },
      ],
    },
    retro: {
      title: '다시 만든다면',
      body: [
        '처음엔 입력이 빠르고 편한 쪽을 최우선으로 두고 화면을 설계했어요. 매일 직접 써 보니 편리함만큼 화면을 열고 싶게 만드는 시각적 완성도도 기록을 이어가게 하는 이유라는 걸 알게 됐습니다. 다시 만든다면 사용성 기준을 정한 뒤 디자인을 다듬는 시간을 따로 잡겠습니다.',
        '가장 오래 막힌 건 아이폰 실기기 테스트였어요. 크롬에선 문제없던 화면이 아이폰에서만 깨졌고, 하나를 고치면 다른 곳이 틀어지는 일이 반복됐습니다. 수정할 때마다 너무 잦은 배포를 하다보니 Vercel 무료 배포 한도에 걸려, 로컬 서버를 터널로 열어 아이폰에서 바로 확인하는 방식으로 바꿨어요. 이 경험이 WebKit E2E를 CI에 넣은 계기가 됐습니다.',
      ],
      aside: {
        label: 'AI와의 협업',
        body: '이 프로젝트는 Claude Code와 함께 만들었습니다. 기획·디자인·기술 선택과 모든 결정, 결과 검토와 실기기 검증은 제가 했고, 구현은 Claude Code가 맡았어요.',
      },
    },
  },
];

export const featuredProject = projects[0];

export const getProject = (id: string) => projects.find((p) => p.id === id);
