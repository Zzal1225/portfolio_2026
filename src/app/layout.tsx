import type { Metadata } from "next";
import { siteConfig } from "@/config/site";
import { IntroProvider } from "@/components/intro/IntroProvider";
import { Header } from "@/components/layout/Header";
import "./globals.css";

// 링크 미리보기 이미지는 app/opengraph-image.png · twitter-image.png 파일로 자동 연결된다
export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: siteConfig.title,
  description: siteConfig.description,
  openGraph: {
    type: "website",
    locale: "ko_KR",
    url: "/",
    siteName: `${siteConfig.name} 포트폴리오`,
    title: siteConfig.title,
    description: siteConfig.description,
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.title,
    description: siteConfig.description,
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ko">
      <head>
        {/* Pretendard v1.3.9 (500/600/700/800 사용) */}
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.min.css"
        />
      </head>
      <body>
        <IntroProvider>
          <Header />
          {children}
        </IntroProvider>
      </body>
    </html>
  );
}
