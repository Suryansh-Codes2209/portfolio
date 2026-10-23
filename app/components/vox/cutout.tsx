import Image from "next/image";
import { cn } from "@/app/lib/utils";

/**
 * A photo cut out like a sticker: thick paper outline (a stacked drop-shadow
 * that follows the alpha edge), a slight tilt, and a lift on hover.
 */
export function Cutout({
  src,
  alt,
  width,
  height,
  className,
  imgClassName,
  rotate = -3,
  priority,
  sizes,
}: {
  src: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
  imgClassName?: string;
  rotate?: number;
  priority?: boolean;
  sizes?: string;
}) {
  return (
    <div
      style={{ ["--r" as string]: `${rotate}deg` }}
      className={cn(
        "relative [transform:rotate(var(--r))] transition-transform duration-300 hover:[transform:rotate(0deg)_translateY(-4px)]",
        className,
      )}
    >
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        priority={priority}
        sizes={sizes}
        className={cn(
          "h-auto w-full [filter:drop-shadow(0_0_0_var(--sticker))_drop-shadow(3px_0_0_var(--sticker))_drop-shadow(-3px_0_0_var(--sticker))_drop-shadow(0_3px_0_var(--sticker))_drop-shadow(0_-3px_0_var(--sticker))_drop-shadow(0_14px_18px_rgba(0,0,0,0.28))]",
          imgClassName,
        )}
      />
    </div>
  );
}
