"use client";

import { useStudioPreview } from "./StudioPreview";

import { useId, useRef, useState, useTransition } from "react";
import { Button } from "@/components/ui";

/** Ghost "Delete" that opens a native `dialog` to confirm before running `action`. */
export function DeleteButton({
  title,
  action,
  description = "This removes the content from the website. Images remain in Media library for reuse. This cannot be undone.",
}: {
  title: string;
  action: () => Promise<void>;
  description?: string;
}) {
  const local = useStudioPreview();
  const ref = useRef<HTMLDialogElement>(null);
  const [pending, start] = useTransition();
  const [error, setError] = useState(false);
  const headingId = useId();

  return (
    <>
      <Button
        variant="ghost"
        className="text-[15px]"
        disabled={local}
        aria-label={`Delete ${title}`}
        onClick={() => ref.current?.showModal()}
      >
        Delete
      </Button>
      <dialog
        ref={ref}
        aria-labelledby={headingId}
        className="bg-paper text-ink backdrop:bg-ink/40 m-auto w-[min(92vw,460px)] rounded-lg p-[30px] shadow-lg"
      >
        <h2 id={headingId} className="text-[24px] leading-[32px]">
          Delete “{title}”?
        </h2>
        <p className="text-ink/75 mt-[10px] text-[17px] leading-7">
          {description}
        </p>
        {error ? (
          <p role="alert" className="text-magenta mt-[10px] text-[15px]">
            Couldn’t delete. Try again.
          </p>
        ) : null}
        <div className="mt-[20px] flex justify-end gap-[15px]">
          <Button
            variant="secondary"
            onClick={() => ref.current?.close()}
            autoFocus
          >
            Cancel
          </Button>
          <Button
            disabled={pending}
            onClick={() =>
              start(async () => {
                try {
                  await action();
                  setError(false);
                  ref.current?.close();
                } catch {
                  setError(true);
                }
              })
            }
          >
            {pending ? "Deleting…" : "Delete"}
          </Button>
        </div>
      </dialog>
    </>
  );
}
