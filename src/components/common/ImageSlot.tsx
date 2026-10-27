import Image from "next/image";
import styles from "./ImageSlot.module.css";

interface ImageSlotProps {
  src: string | null;
  alt: string;
  /** src가 없을 때 보여줄 안내 문구 (프로토타입 image-slot placeholder) */
  placeholder: string;
  sizes: string;
  eager?: boolean;
  objectPosition?: string;
  className?: string;
}

/** 부모 박스를 가득 채우는 이미지. 부모가 크기·radius·overflow를 정한다. */
export function ImageSlot({ src, alt, placeholder, sizes, eager, objectPosition, className }: ImageSlotProps) {
  return (
    <div className={`${styles.slot} ${className ?? ""}`}>
      {src ? (
        <Image
          src={src}
          alt={alt}
          fill
          sizes={sizes}
          loading={eager ? "eager" : undefined}
          className={styles.img}
          style={objectPosition ? { objectPosition } : undefined}
        />
      ) : (
        <span className={styles.placeholder}>{placeholder}</span>
      )}
    </div>
  );
}
