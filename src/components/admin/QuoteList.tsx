import { buttonStyles, Button } from "@/components/ui";
import { relativeTime } from "@/lib/format";
import { moveQuoteToIdea } from "@/lib/actions";
import type { QuoteRequest } from "@/lib/queries/quotes";

export function QuoteList({ quotes }: { quotes: QuoteRequest[] }) {
  return (
    <section aria-labelledby="quotes-h">
      <h2 id="quotes-h" className="text-[36px] leading-[44px]">
        Quote requests
      </h2>
      {quotes.length === 0 ? (
        <p className="text-ink/70 mt-[20px]">No new requests.</p>
      ) : (
        <ul className="mt-[20px] flex flex-col gap-[30px]">
          {quotes.map((q) => {
            const title = q.company || q.name || q.email;
            return (
              <li key={q.id}>
                <div className="flex items-baseline justify-between gap-[10px]">
                  <span className="meta text-cyan-700">{q.kind}</span>
                  <span className="meta">{relativeTime(q.created_at)}</span>
                </div>
                <h3 className="mt-[5px] text-[19px] leading-[26px]">{title}</h3>
                {q.phone ? (
                  <p className="mt-[5px] text-[15px]">
                    <a href={`tel:${q.phone}`}>{q.phone}</a>
                  </p>
                ) : null}
                {q.message ? (
                  <p className="text-ink/75 mt-[5px] text-[17px] leading-7">{q.message}</p>
                ) : null}
                <div className="mt-[15px] flex items-center gap-[20px]">
                  <a
                    href={`mailto:${q.email}?subject=${encodeURIComponent("Your Smidify quote request")}`}
                    className={buttonStyles("secondary", "no-underline hover:text-cyan-800")}
                  >
                    Reply
                  </a>
                  <form action={moveQuoteToIdea.bind(null, q.id)}>
                    <Button type="submit" variant="ghost">
                      Move to Idea
                    </Button>
                  </form>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
