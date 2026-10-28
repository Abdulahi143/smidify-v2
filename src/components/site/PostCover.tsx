import Image from "next/image";
import { Halftone } from "@/components/ui";
import { mediaUrl } from "@/lib/media";

export function Cover({
  path,
  alt = "",
  ratio,
  label,
  priority,
  sizes,
}: {
  path: string | null;
  alt?: string;
  ratio: string;
  label: string;
  priority?: boolean;
  sizes: string;
}) {
  return (
    <Halftone className={`relative bg-neutral-200 ${ratio}`}>
      {path ? (
        <Image
          src={mediaUrl(path)}
          alt={alt}
          fill
          priority={priority}
          sizes={sizes}
          className="object-cover"
        />
      ) : (
        <span className="text-ink/70 absolute bottom-2.5 left-2.5 text-[13px]">
          {label}
        </span>
      )}
    </Halftone>
  );
}
