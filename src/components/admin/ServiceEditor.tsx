"use client";

import { useStudioPreview } from "./StudioPreview";

import { useState, useTransition } from "react";
import { Button, Field, Input, Textarea } from "@/components/ui";
import { saveService } from "@/lib/actions";
import type { AdminService } from "@/lib/queries/admin-content";
import { useRouter } from "next/navigation";
import { DeleteButton } from "./DeleteButton";
import { deleteService } from "@/lib/actions/content";

/** One service, edited inline. The list of items is one per line. */
export function ServiceEditor({
  service,
  isNew = false,
  onSaved,
}: {
  service: AdminService;
  isNew?: boolean;
  onSaved?: () => void;
}) {
  const local = useStudioPreview();
  const [title, setTitle] = useState(service.title);
  const [body, setBody] = useState(service.body);
  const [items, setItems] = useState(service.items.join("\n"));
  const [num, setNum] = useState(service.num);
  const [sort, setSort] = useState(service.sort);
  const [savedId, setSavedId] = useState<string | null>(
    isNew ? null : service.id,
  );
  const router = useRouter();
  const [pending, start] = useTransition();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<string>();

  const submit = () =>
    start(async () => {
      if (local) {
        setStatus("Local preview does not save changes.");
        return;
      }
      setStatus(undefined);
      try {
        const res = await saveService({
          id: savedId,
          num,
          sort,
          title,
          body,
          items: items
            .split("\n")
            .map((s) => s.trim())
            .filter(Boolean),
        });
        if (res.ok) {
          setErrors({});
          setStatus("Saved");
          setSavedId(res.id);
          onSaved?.();
          router.refresh();
        } else {
          setErrors(res.fieldErrors);
          setStatus(res.message ?? "Fix the highlighted fields.");
        }
      } catch {
        setStatus("Could not save. Check your connection and try again.");
      }
    });

  const id = `service-${service.id}`;
  return (
    <form
      aria-label={`Service ${service.num}`}
      onSubmit={(e) => {
        e.preventDefault();
        submit();
      }}
      className="studio-service-editor"
    >
      <div className="studio-service-heading">
        <span className="studio-service-number">{service.num}</span>
        <h2>{service.title}</h2>
      </div>
      <fieldset disabled={pending} className="flex min-w-0 flex-col gap-[20px]">
        <legend className="sr-only">Edit {service.title}</legend>
        <div className="studio-form-pair">
          <Field
            label="Display number"
            htmlFor={`${id}-number`}
            error={errors.num}
          >
            <Input
              id={`${id}-number`}
              value={num}
              maxLength={8}
              onChange={(e) => setNum(e.target.value)}
            />
          </Field>
          <Field label="Order" htmlFor={`${id}-sort`} error={errors.sort}>
            <Input
              id={`${id}-sort`}
              type="number"
              min={0}
              max={1000}
              value={sort}
              onChange={(e) => setSort(Number(e.target.value))}
            />
          </Field>
        </div>
        <Field label="Title" htmlFor={`${id}-title`} error={errors.title}>
          <Input
            id={`${id}-title`}
            value={title}
            maxLength={80}
            onChange={(e) => setTitle(e.target.value)}
          />
        </Field>
        <Field label="Description" htmlFor={`${id}-body`} error={errors.body}>
          <Textarea
            id={`${id}-body`}
            rows={3}
            value={body}
            maxLength={600}
            onChange={(e) => setBody(e.target.value)}
          />
        </Field>
        <Field
          label="Includes (one per line)"
          htmlFor={`${id}-items`}
          error={errors.items}
        >
          <Textarea
            id={`${id}-items`}
            rows={4}
            value={items}
            onChange={(e) => setItems(e.target.value)}
          />
        </Field>
        <div className="flex items-center gap-[20px]">
          <Button type="submit" disabled={pending || local}>
            {pending ? "Saving…" : "Save"}
          </Button>
          <p role="status" className="text-ink/70 text-[15px]">
            {status}
          </p>
          {savedId ? (
            <DeleteButton
              title={service.title}
              action={deleteService.bind(null, savedId)}
              description="This service will be removed from the public services page. This cannot be undone."
            />
          ) : null}
        </div>
      </fieldset>
    </form>
  );
}
