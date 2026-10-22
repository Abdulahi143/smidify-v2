import type { Service } from "@/lib/queries/services";

export function ServiceIndex({ services }: { services: Service[] }) {
  return (
    <section aria-labelledby="service-index-title">
      <div className="rule-masthead" />
      <h2 id="service-index-title" className="sr-only">
        Services
      </h2>
      <div className="meta flex flex-col justify-between gap-1 py-[15px] text-[12px] md:flex-row">
        <span>What we do</span>
        <span>For small &amp; medium businesses</span>
        <span>One team, start to finish</span>
      </div>
      <div className="border-ink border-t" />
      <ol className="grid gap-x-[60px] py-5 md:grid-cols-2">
        {services.map((s) => (
          <li key={s.id} className="flex items-baseline gap-2.5 py-[9px] text-[17px]">
            <span>{s.title}</span>
            <span
              aria-hidden
              className="border-ink/45 min-w-5 flex-1 translate-y-[-4px] border-b border-dotted"
            />
            <span className="font-semibold">{s.num}</span>
          </li>
        ))}
      </ol>
      <div className="border-ink border-t" />
    </section>
  );
}
