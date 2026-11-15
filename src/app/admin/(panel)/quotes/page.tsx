import type { Metadata } from "next";
import { connection } from "next/server";
import { Tray } from "@phosphor-icons/react/dist/ssr/Tray";
import { QuoteActions } from "@/components/admin/QuoteActions";
import { relativeTime } from "@/lib/format";
import { getAllQuoteRequests } from "@/lib/queries/admin-content";

export const metadata: Metadata = { title: "Quote requests" };

// Studio pages wait for the request and viewer identity before rendering.
export const instant = false;

export default async function QuotesPage() {
  await connection();
  const quotes = await getAllQuoteRequests();
  return (
    <div className="studio-content-page">
      <header className="studio-page-header">
        <div>
          <p className="studio-eyebrow">Your inbox</p>
          <h1>Quote requests</h1>
          <p className="studio-description">
            Start a conversation, move an idea forward, or mark a request
            handled.
          </p>
        </div>
      </header>
      {quotes.length === 0 ? (
        <div className="studio-panel studio-empty">
          <span className="studio-empty-icon">
            <Tray size={26} aria-hidden="true" />
          </span>
          <h2>You&apos;re all caught up</h2>
          <p>New requests from your website will appear here.</p>
        </div>
      ) : null}
      <ul className="studio-quote-page-list">
        {quotes.map((q) => (
          <li
            key={q.id}
            className="studio-panel studio-quote-detail"
            data-handled={q.handled}
          >
            <div className="studio-quote-meta">
              <span>{q.kind || "Enquiry"}</span>
              <time dateTime={q.created_at ?? undefined}>
                {relativeTime(q.created_at)}
              </time>
              <span
                className={`studio-status ${q.handled ? "" : "studio-status-published"}`}
              >
                {q.handled ? "Handled" : "New"}
              </span>
            </div>
            <h2>{q.company || q.name || q.email}</h2>
            <p>
              <a href={`mailto:${q.email}`}>{q.email}</a>
              {q.phone ? (
                <>
                  {" "}
                  · <a href={`tel:${q.phone}`}>{q.phone}</a>
                </>
              ) : null}
            </p>
            {q.message ? <p>{q.message}</p> : null}
            <QuoteActions
              id={q.id}
              email={q.email}
              handled={q.handled}
              showHandled
            />
          </li>
        ))}
      </ul>
    </div>
  );
}
