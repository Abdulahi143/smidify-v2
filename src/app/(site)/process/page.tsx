import type { Metadata } from "next";
import { CtaBlock, PlateText, ProcessRail } from "@/components/site";
import { PROCESS_STAGES } from "@/lib/content/process";

export function generateMetadata(): Metadata {
  return {
    title: "Process — Smidify",
    description:
      "Seven stages, the same for a website, an app or a network: idea to care.",
  };
}

const wrap = "mx-auto max-w-[1280px] px-5 md:px-[72px]";

export default function ProcessPage() {
  return (
    <div className={wrap}>
      <header className="pt-16 pb-[60px] md:pt-28 md:pb-[84px]">
        <p className="meta">How we work</p>
        <h1 className="mt-5 text-[40px] leading-[46px] tracking-[-0.02em] md:text-[72px] md:leading-[78px]">
          From idea to production.
          <br />
          Then round again.
        </h1>
        <p className="text-ink/78 mt-[30px] max-w-[48ch] text-[19px] leading-[30px]">
          Seven stages, the same for a website, an app or a network. You always
          know which one we&apos;re in and what happens next.
        </p>
      </header>

      <ProcessRail />

      <div className="flex flex-col gap-[84px] pt-[84px]">
        {PROCESS_STAGES.map((s) => (
          <section
            key={s.key}
            id={s.key}
            aria-labelledby={`stage-${s.key}`}
            className="grid gap-5 md:grid-cols-[120px_5fr_6fr] md:gap-12"
          >
            <PlateText className="text-[64px] leading-[1] font-bold">
              {s.num}
            </PlateText>
            <div>
              <p className="meta text-cyan-700 text-[12px]">{s.duration}</p>
              <h2 id={`stage-${s.key}`} className="mt-[5px] text-[28px] leading-9 md:text-[34px] md:leading-10">
                {s.name}
              </h2>
              <p className="text-ink/78 mt-[15px] text-[17px] leading-7">{s.body}</p>
            </div>
            <div>
              <p className="meta text-[12px]">You get</p>
              <ul className="mt-2.5 flex flex-col gap-2.5 text-[17px]">
                {s.deliverables.map((d) => (
                  <li key={d}>{d}</li>
                ))}
              </ul>
            </div>
          </section>
        ))}
      </div>

      <CtaBlock
        title="Stage one is a conversation."
        body="Tell us the idea, however rough. We'll reply within one working day."
      />
    </div>
  );
}
