import Link from "next/link";
import { buttonStyles } from "@/components/ui";

export function CtaBlock({
  title,
  body,
}: {
  title: string;
  body: string;
}) {
  return (
    <section className="py-[84px] md:py-[112px]" aria-labelledby="cta-title">
      <h2 id="cta-title" className="text-[32px] leading-[1.15] md:text-[44px]">
        {title}
      </h2>
      <p className="text-ink/78 mt-[15px] mb-[30px] max-w-[44ch] text-[17px] leading-7">
        {body}
      </p>
      <Link
        href="/#quote"
        className={buttonStyles("primary", "text-white hover:text-white")}
      >
        Request a quote
      </Link>
    </section>
  );
}
