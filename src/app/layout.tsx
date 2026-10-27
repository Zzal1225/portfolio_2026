import type { Metadata } from "next";
import { siteConfig } from "@/config/site";
import { IntroProvider } from "@/components/intro/IntroProvider";
import { Header } from "@/components/layout/Header";
import "./globals.css";

export const metadata: Metadata = {
  title: siteConfig.title,
  description: siteConfig.description,
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
