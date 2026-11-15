"use client";

import { useStudioPreview } from "./StudioPreview";

import { useState, useTransition } from "react";
import { ArrowRight } from "@phosphor-icons/react/dist/ssr/ArrowRight";
import { ArrowUpRight } from "@phosphor-icons/react/dist/ssr/ArrowUpRight";
import { moveQuoteToIdea, setQuoteHandled } from "@/lib/actions";
import { Button } from "@/components/ui";

export function QuoteActions({
  id,
  email,
  handled = false,
  showHandled = false,
}: {
  id: string;
  email: string;
  handled?: boolean;
  showHandled?: boolean;
}) {
  const local = useStudioPreview();
  const [pending, start] = useTransition();
  const [error, setError] = useState("");
  function act(action: "move" | "handle") {
    if (local) return;
    setError("");
    start(async () => {
      try {
        if (action === "move") await moveQuoteToIdea(id);
        else await setQuoteHandled(id, !handled);
      } catch {
        setError("Could not update this request. Please try again.");
      }
    });
  }
  return (
    <div>
      <div className="studio-quote-actions">
        <a
          href={
            local
              ? undefined
              : `mailto:${email}?subject=${encodeURIComponent("Your Smidify quote request")}`
          }
          aria-disabled={local || undefined}
          className="studio-text-link"
        >
          Reply
          <ArrowUpRight size={14} aria-hidden="true" />
        </a>
        {!handled ? (
          <Button
            variant="ghost"
            disabled={pending || local}
            onClick={() => act("move")}
          >
            {pending ? "Saving…" : "Move to Idea"}
            <ArrowRight size={14} aria-hidden="true" />
          </Button>
        ) : null}
        {showHandled ? (
          <Button
            variant="ghost"
            disabled={pending || local}
            onClick={() => act("handle")}
          >
            {handled ? "Mark unhandled" : "Mark handled"}
          </Button>
        ) : null}
      </div>
      {error ? (
        <p role="alert" className="studio-notice studio-notice-warning">
          {error}
        </p>
      ) : null}
    </div>
  );
}
