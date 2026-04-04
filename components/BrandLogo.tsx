import Image from "next/image";

type BrandLogoProps = {
  className?: string;
  /** Renders at this height (px); width follows image aspect ratio */
  height?: number;
  priority?: boolean;
};

/** Site logo from `public/logo.png`. */
export default function BrandLogo({
  className = "",
  height = 40,
  priority = false,
}: BrandLogoProps) {
  return (
    <span
      className={`inline-flex items-center shrink-0 ${className}`}
      style={{ height, lineHeight: 0 }}
    >
      <Image
        src="/logo.png"
        alt="Urban Jobs"
        width={400}
        height={160}
        priority={priority}
        className="max-h-full w-auto object-contain object-left"
        style={{ height: "100%", width: "auto", maxWidth: "min(240px, 70vw)" }}
        sizes="(max-width: 640px) 180px, 220px"
      />
    </span>
  );
}
