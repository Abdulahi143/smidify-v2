import { connection } from "next/server";
import Link from "next/link";
import { ArrowRight } from "@phosphor-icons/react/dist/ssr/ArrowRight";
import { Tray } from "@phosphor-icons/react/dist/ssr/Tray";
import { QuoteActions } from "./QuoteActions";
import { relativeTime } from "@/lib/format";
import type { QuoteRequest } from "@/lib/queries/quotes";

export async function QuoteList({ quotes }: { quotes: QuoteRequest[] }) {
  await connection();
  return (
    <section
      aria-labelledby="quotes-h"
      className="studio-panel studio-quotes-panel"
    >
      <div className="studio-panel-heading">
        <div>
          <h2 id="quotes-h">Quote requests</h2>
          <p>Your next project could start here.</p>
        </div>
        <Tray size={20} aria-hidden="true" />
      </div>
      {quotes.length === 0 ? (
        <div className="studio-empty">
          <span className="studio-empty-icon">
            <Tray size={25} aria-hidden="true" />
          </span>
          <h3>You&apos;re all caught up</h3>
          <p>New requests from your website will appear here.</p>
        </div>
      ) : (
        <ul className="studio-quote-list">
          {quotes.map((q) => {
            const title = q.company || q.name || q.email;
            return (
              <li key={q.id}>
                <div className="studio-quote-meta">
                  <span>{q.kind || "New enquiry"}</span>
                  <time dateTime={q.created_at ?? undefined}>
                    {relativeTime(q.created_at)}
                  </time>
                </div>
                <h3>{title}</h3>
                {q.phone ? (
                  <a href={`tel:${q.phone}`} className="studio-quote-phone">
                    {q.phone}
                  </a>
                ) : null}
                {q.message ? (
                  <p className="studio-quote-message">{q.message}</p>
                ) : null}
                <QuoteActions id={q.id} email={q.email} />
              </li>
            );
          })}
        </ul>
      )}
      <div className="studio-panel-footer">
        <Link href="/admin/quotes" className="studio-text-link">
          View all requests
          <ArrowRight size={14} aria-hidden="true" />
        </Link>
      </div>
    </section>
  );
}
