import { BentoGrid } from "@/components/home/BentoGrid";
import { IntroOverlay } from "@/components/intro/IntroOverlay";

export default function Home() {
  return (
    <>
      <BentoGrid />
      {/* 인트로는 BentoGrid의 [data-bento] 요소를 측정하므로 같은 페이지에 마운트 */}
      <IntroOverlay />
    </>
  );
}
