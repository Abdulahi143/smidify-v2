import type { Metadata } from "next";
import Link from "next/link";
import { CtaBlock } from "@/components/site";
import { getServices } from "@/lib/queries/services";

export function generateMetadata(): Metadata {
  return {
    title: "Services — Smidify",
    description:
      "Websites, mobile apps, network solutions and AI integration from one team.",
  };
}

const wrap = "inner-page services-page home-container";

const steps = [
  {
    when: "Week 1",
    name: "Listen",
    body: "A call and a short visit to understand how you work today.",
  },
  {
    when: "Week 2",
    name: "Quote",
    body: "A fixed scope, a plain price and a timeline you can plan around.",
  },
  {
    when: "Weeks 3+",
    name: "Build",
    body: "Working updates every week, so there are no surprises at launch.",
  },
  {
    when: "After launch",
    name: "Look after",
    body: "Updates, monitoring and a named person to call.",
  },
];

export default async function ServicesPage() {
  const services =
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
      ? await getServices()
      : [
          {
            id: "web",
            num: "01",
            title: "Websites",
            body: "Fast, accessible marketing sites and web platforms you can edit yourself — built to load quickly and rank honestly.",
            items: [
              "Design & content structure",
              "CMS setup and training",
              "E-commerce and booking",
              "Hosting and care plans",
            ],
          },
          {
            id: "apps",
            num: "02",
            title: "Mobile apps",
            body: "iOS and Android apps for customers or your own staff, from first prototype to app-store release and updates after.",
            items: [
              "Native & cross-platform",
              "Prototypes in weeks",
              "Store submission",
              "Analytics and crash reporting",
            ],
          },
          {
            id: "networks",
            num: "03",
            title: "Network solutions",
            body: "Office and multi-site networks, Wi-Fi and security that stay up — designed, installed and monitored.",
            items: [
              "Network design & install",
              "Secure Wi-Fi and VPN",
              "Monitoring and support",
              "Cloud and backup",
            ],
          },
          {
            id: "ai",
            num: "04",
            title: "AI integration",
            body: "Assistants, automation and smart search added to the tools you already use — only where they earn their keep.",
            items: [
              "Customer support assistants",
              "Document and data automation",
              "Smart search",
              "Private, secure deployment",
            ],
          },
        ];

  return (
    <div className={wrap}>
      <header className="pt-16 md:pt-28">
        <p className="meta">What we do</p>
        <h1 className="mt-5 max-w-[16ch] text-[40px] leading-[46px] tracking-[-0.02em] md:text-[72px] md:leading-[78px]">
          Built around
          <br />
          your business.
        </h1>
        <p className="page-introduction">
          Four disciplines. One team. From your first website to the
          infrastructure behind it, we make technology work together.
        </p>
      </header>

      <div className="flex flex-col gap-[84px] pt-[60px] md:pt-[84px]">
        {services.map((s) => (
          <section
            key={s.id}
            aria-labelledby={`svc-${s.num}`}
            className="grid gap-5 md:grid-cols-[120px_5fr_6fr] md:gap-12"
          >
            <span className="section-number">{s.num}</span>
            <div>
              <h2
                id={`svc-${s.num}`}
                className="text-[28px] leading-9 md:text-[34px] md:leading-10"
              >
                {s.title}
              </h2>
              <p className="text-ink/78 mt-[15px] text-[17px] leading-7">
                {s.body}
              </p>
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
              <p className="meta text-[12px] text-cyan-700">{st.when}</p>
              <h3 className="mt-[5px] text-[22px]">{st.name}</h3>
              <p className="text-ink/78 mt-[5px] text-[15px] leading-6">
                {st.body}
              </p>
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
