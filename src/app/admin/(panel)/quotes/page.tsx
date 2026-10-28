import type { Metadata } from "next";
import { Button, buttonStyles, Tag } from "@/components/ui";
import { setQuoteHandled } from "@/lib/actions";
import { relativeTime } from "@/lib/format";
import { getAllQuoteRequests } from "@/lib/queries/admin-content";

export const metadata: Metadata = { title: "Quote requests" };

export default async function QuotesPage() {
  const quotes = await getAllQuoteRequests();
  return (
    <div className="flex flex-col gap-[30px]">
      <h1 className="text-[44px] leading-[52px]">Quote requests</h1>
      {quotes.length === 0 ? <p className="text-ink/70">No requests yet.</p> : null}
      <ul className="flex flex-col gap-[40px]">
        {quotes.map((q) => (
          <li key={q.id} className={q.handled ? "opacity-70" : undefined}>
            <div className="flex flex-wrap items-baseline gap-[15px]">
              {q.kind ? <span className="meta text-cyan-700">{q.kind}</span> : null}
              <span className="meta">{relativeTime(q.created_at)}</span>
              {q.handled ? <Tag tone="neutral">Handled</Tag> : null}
            </div>
            <h2 className="mt-[5px] text-[24px] leading-[32px]">{q.company || q.name || q.email}</h2>
            <p className="text-[15px]">
              {q.email}
              {q.phone ? <> · <a href={`tel:${q.phone}`}>{q.phone}</a></> : null}
            </p>
            {q.message ? <p className="text-ink/75 mt-[10px] max-w-[68ch] text-[17px] leading-7">{q.message}</p> : null}
            <div className="mt-[15px] flex items-center gap-[20px]">
              <a
                href={`mailto:${q.email}?subject=${encodeURIComponent("Your Smidify quote request")}`}
                className={buttonStyles("secondary", "no-underline hover:text-cyan-800")}
              >
                Reply
              </a>
              <form action={setQuoteHandled.bind(null, q.id, !q.handled)}>
                <Button type="submit" variant="ghost">
                  {q.handled ? "Mark unhandled" : "Mark handled"}
                </Button>
              </form>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
