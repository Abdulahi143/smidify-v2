import type { Metadata } from "next";
import Link from "next/link";
import { CtaBlock, PlateText } from "@/components/site";
import { getServices } from "@/lib/queries/services";

export function generateMetadata(): Metadata {
  return {
    title: "Services — Smidify",
    description:
      "Websites, mobile apps, network solutions and AI integration from one team.",
  };
}

const wrap = "mx-auto max-w-[1280px] px-5 md:px-[72px]";

const steps = [
  { when: "Week 1", name: "Listen", body: "A call and a short visit to understand how you work today." },
  { when: "Week 2", name: "Quote", body: "A fixed scope, a plain price and a timeline you can plan around." },
  { when: "Weeks 3+", name: "Build", body: "Working previews every week, so there are no surprises at launch." },
  { when: "After launch", name: "Look after", body: "Updates, monitoring and a named person to call." },
];

export default async function ServicesPage() {
  const services = await getServices();

  return (
    <div className={wrap}>
      <header className="pt-16 md:pt-28">
        <p className="meta">What we do</p>
        <h1 className="mt-5 max-w-[16ch] text-[40px] leading-[46px] tracking-[-0.02em] md:text-[72px] md:leading-[78px]">
          Four disciplines, one team that answers the phone.
        </h1>
      </header>

      <div className="flex flex-col gap-[84px] pt-[60px] md:pt-[84px]">
        {services.map((s) => (
          <section
            key={s.id}
            aria-labelledby={`svc-${s.num}`}
            className="grid gap-5 md:grid-cols-[120px_5fr_6fr] md:gap-12"
          >
            <PlateText className="text-[64px] leading-[1] font-bold">
              {s.num}
            </PlateText>
            <div>
              <h2 id={`svc-${s.num}`} className="text-[28px] leading-9 md:text-[34px] md:leading-10">
                {s.title}
              </h2>
              <p className="text-ink/78 mt-[15px] text-[17px] leading-7">{s.body}</p>
            </div>
            <div>
              <p className="meta text-[12px]">Includes</p>
              <ul className="mt-2.5 flex flex-col gap-2.5 text-[17px]">
                {s.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          </section>
        ))}
      </div>

      <section className="pt-[84px] md:pt-[112px]" aria-labelledby="runs-title">
        <h2 id="runs-title" className="text-[28px] md:text-[36px]">
          How a project runs
        </h2>
        <ol className="mt-[30px] grid gap-[30px] md:grid-cols-4">
          {steps.map((st) => (
            <li key={st.name}>
              <p className="meta text-cyan-700 text-[12px]">{st.when}</p>
              <h3 className="mt-[5px] text-[22px]">{st.name}</h3>
              <p className="text-ink/78 mt-[5px] text-[15px] leading-6">{st.body}</p>
            </li>
          ))}
        </ol>
        <Link href="/process" className="mt-[30px] inline-block underline">
          See the full process →
        </Link>
      </section>

      <CtaBlock
        title="Not sure which you need?"
        body="Describe the problem instead. We'll suggest the smallest thing that solves it."
      />
    </div>
  );
}
