// 메인 벤토 카드 콘텐츠 (About · 전환 서사 · 경력 · 스택)

export const about = {
  avatar: '/images/avatar.png',
  headline: ['안녕하세요,', '프론트엔드 개발자 박찬령입니다.'],
  intro:
    '사용자가 "자연스럽다"고 느끼는 화면을 만드는 데 관심이 많아요. 최근에는 기록용 PWA인 nanaki를 1인으로 기획·설계하고 Claude Code와 함께 구현해 배포까지 마치며, 설계와 품질을 끝까지 책임지는 경험을 쌓았어요.',
};

export const origin = {
  image: '/images/projects/portpolio_capture_2023ver.JPG',
  title: '마크업에서 시작해, 인터랙션까지',
  // 배열 한 칸 = 화면의 한 줄(문단). 길면 화면 폭에 맞춰 자동 줄바꿈된다.
  body: [
    '웹 퍼블리셔 학원 과정에서 처음 코드를 만났어요.',
    'Photoshop, Figma 등의 디자인 툴보다 "머릿속 화면이 코드 몇 줄로 움직이는" 쪽이 훨씬 재밌었어요.',
    '그래서 학원 커리큘럼에 없었던 JavaScript를 따로 공부하고 프론트엔드 개발자 공고에 지원했습니다.',
    '그때 만든 첫 포트폴리오가 이 사이트예요.',
    '시맨틱 마크업과 반응형을 고민하던 그때의 기본기는 지금도 컴포넌트를 설계할 때 출발점이에요.',
  ],
  label: 'PUBLISHER → FRONTEND',
};

export const career = {
  label: 'CAREER',
  value: ['2년', '9개월'],
  company: '파워텔레콤',
  role: '프론트엔드 개발',
  period: '2023.09 – 2026.07',
  // note: 항목 뒤에 흐리게 붙는 보충 설명
  highlights: [
    { text: 'B2B 문자 발송 서비스의 웹 프론트 전담' },
    { text: '발송·수신자 관리·결과 조회 화면과 관리자 어드민 담당' },
    {
      text: '그 외 웹툰·협회·강의 플랫폼 등 신규 서비스 4건의 기획·디자인·퍼블리싱·프론트를 혼자 담당',
      note: '사업 사정으로 미출시',
    },
  ] as { text: string; note?: string }[],
};

export const stack = {
  work: ['HTML/CSS', 'JavaScript', 'Git', 'jQuery', 'PHP', 'Tailwind'],
  project: ['React.js', 'Next.js', 'Zustand', 'TypeScript', 'Playwright'],
};
