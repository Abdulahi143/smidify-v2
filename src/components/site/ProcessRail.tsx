import clsx from "clsx";
import { PROCESS_STAGES } from "@/lib/content/process";

export function ProcessRail() {
  return (
    <nav aria-label="Process stages">
      <div className="rule-masthead" />
      <ol className="-mx-5 flex snap-x snap-mandatory overflow-x-auto px-5 pt-5 pb-[15px] md:mx-0 md:grid md:grid-cols-7 md:overflow-visible md:px-0">
        {PROCESS_STAGES.map((s, i) => (
          <li key={s.key} className="min-w-[120px] shrink-0 snap-start md:min-w-0">
            <div
              className={clsx(
                "text-[28px] leading-[34px] font-semibold",
                i === 0 ? "text-cyan-700" : "text-ink",
              )}
            >
              {s.num}
            </div>
            <div className="mt-2.5 text-[15px]">{s.name}</div>
            <div className="text-ink/70 mt-[5px] text-[13px]">{s.duration}</div>
          </li>
        ))}
      </ol>
      <div className="border-ink border-t" />
      <div className="text-ink/70 flex justify-between gap-5 pt-[15px] text-[14px]">
        <span>↑ Start here: a quote request or a call</span>
        <span>Care feeds the next idea ↺</span>
      </div>
    </nav>
  );
}
