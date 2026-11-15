"use client";

import { useId, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Field, Input } from "@/components/ui";
import { PROCESS_STAGES } from "@/lib/content/process";
import type { PipelineItem } from "@/lib/queries/pipeline";
import type { PipelineItemInput } from "@/lib/validation/pipeline";
import { savePipelineItem, deletePipelineItem } from "@/lib/actions/pipeline";
import { DeleteButton } from "./DeleteButton";
import { useStudioPreview } from "./StudioPreview";

const toInput = (item?: PipelineItem): PipelineItemInput => ({
  id: item?.id ?? null,
  name: item?.name ?? "",
  kind: item?.kind ?? "website",
  stage: item?.stage ?? "idea",
  due_note: item?.due_note ?? "",
});

export function PipelineItemEditor({ item }: { item?: PipelineItem }) {
  const local = useStudioPreview();
  const dialog = useRef<HTMLDialogElement>(null);
  const label = useId();
  const router = useRouter();
  const [values, setValues] = useState(() => toInput(item));
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (local || busy) return;
    setBusy(true);
    setError("");
    try {
      const result = await savePipelineItem(values);
      if (!result.ok) throw Error(result.message);
      dialog.current?.close();
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not save item.");
    } finally {
      setBusy(false);
    }
  }
  return (
    <>
      <Button
        variant={item ? "ghost" : "primary"}
        className={item ? "studio-pipeline-edit" : undefined}
        aria-label={item ? `Edit ${item.name}` : undefined}
        onClick={() => {
          setValues(toInput(item));
          setError("");
          dialog.current?.showModal();
        }}
      >
        {item ? "Edit details" : "+ Add pipeline item"}
      </Button>
      <dialog ref={dialog} aria-labelledby={label} className="studio-dialog">
        <h2 id={label}>{item ? "Edit pipeline item" : "New pipeline item"}</h2>
        <p className="studio-description">
          Keep the client, project type, stage, and next step together.
        </p>
        <form onSubmit={submit}>
          <fieldset disabled={busy} className="studio-settings-fields">
            <legend className="sr-only">Pipeline item details</legend>
            <Field label="Project or client name" htmlFor={`${label}-name`}>
              <Input
                id={`${label}-name`}
                value={values.name}
                required
                maxLength={140}
                onChange={(e) => setValues({ ...values, name: e.target.value })}
              />
            </Field>
            <Field label="Project type" htmlFor={`${label}-kind`}>
              <Input
                id={`${label}-kind`}
                value={values.kind}
                required
                maxLength={80}
                list={`${label}-kinds`}
                onChange={(e) => setValues({ ...values, kind: e.target.value })}
              />
              <datalist id={`${label}-kinds`}>
                {["website", "mobile", "network", "ai", "general"].map(
                  (kind) => (
                    <option key={kind} value={kind} />
                  ),
                )}
              </datalist>
            </Field>
            <Field label="Stage" htmlFor={`${label}-stage`}>
              <select
                id={`${label}-stage`}
                className="studio-select"
                value={values.stage}
                onChange={(e) =>
                  setValues({ ...values, stage: e.target.value })
                }
              >
                {PROCESS_STAGES.map((stage) => (
                  <option key={stage.key} value={stage.key}>
                    {stage.name}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Next step or due note" htmlFor={`${label}-note`}>
              <Input
                id={`${label}-note`}
                value={values.due_note}
                maxLength={160}
                onChange={(e) =>
                  setValues({ ...values, due_note: e.target.value })
                }
              />
            </Field>
            {error ? (
              <p role="alert" className="studio-notice studio-notice-warning">
                {error}
              </p>
            ) : null}
            <div className="studio-settings-actions">
              {item ? (
                <DeleteButton
                  title={item.name}
                  action={deletePipelineItem.bind(null, item.id)}
                  description="This removes the item from the pipeline. The linked project and original quote request will remain."
                />
              ) : null}
              <Button
                variant="secondary"
                onClick={() => dialog.current?.close()}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={local || busy}>
                {busy ? "Saving…" : "Save item"}
              </Button>
            </div>
          </fieldset>
        </form>
      </dialog>
    </>
  );
}
