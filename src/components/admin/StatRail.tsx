import Link from "next/link";
import { ArrowUpRight } from "@phosphor-icons/react/dist/ssr/ArrowUpRight";
import { Article } from "@phosphor-icons/react/dist/ssr/Article";
import { FileText } from "@phosphor-icons/react/dist/ssr/FileText";
import { FolderSimple } from "@phosphor-icons/react/dist/ssr/FolderSimple";
import { Tray } from "@phosphor-icons/react/dist/ssr/Tray";

const icons = [FolderSimple, Article, FileText, Tray];

export function StatRail({
  stats,
}: {
  stats: readonly {
    label: string;
    value: number;
    href: string;
    note: string;
  }[];
}) {
  return (
    <section aria-label="Studio totals" className="studio-stats">
      {stats.map(({ label, value, href, note }, i) => {
        const Icon = icons[i % icons.length] ?? FolderSimple;
        return (
          <Link href={href} key={label} className="studio-stat">
            <div className="studio-stat-top">
              <span className={`studio-stat-icon studio-tone-${i}`}>
                <Icon size={20} aria-hidden="true" />
              </span>
              <ArrowUpRight size={16} aria-hidden="true" />
            </div>
            <dl>
              <dt>{label}</dt>
              <dd>{value.toLocaleString("en-GB")}</dd>
            </dl>
            <p>{note}</p>
          </Link>
        );
      })}
    </section>
  );
}
