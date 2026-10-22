"use client";

import { useState, useTransition } from "react";
import { Button, Field, Input, Textarea } from "@/components/ui";
import { saveService } from "@/lib/actions";
import type { AdminService } from "@/lib/queries/admin-content";

/** One service, edited inline. The list of items is one per line. */
export function ServiceEditor({ service }: { service: AdminService }) {
  const [title, setTitle] = useState(service.title);
  const [body, setBody] = useState(service.body);
  const [items, setItems] = useState(service.items.join("\n"));
  const [pending, start] = useTransition();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<string>();

  const submit = () =>
    start(async () => {
      setStatus(undefined);
      const res = await saveService({
        id: service.id,
        title,
        body,
        items: items.split("\n").map((s) => s.trim()).filter(Boolean),
      });
      if (res.ok) {
        setErrors({});
        setStatus("Saved");
      } else {
        setErrors(res.fieldErrors);
        setStatus(res.message ?? "Fix the highlighted fields.");
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
      className="grid gap-[20px] md:grid-cols-[60px_1fr]"
    >
      <span className="meta pt-[5px]">{service.num}</span>
      <div className="flex flex-col gap-[20px]">
        <Field label="Title" htmlFor={`${id}-title`} error={errors.title}>
          <Input id={`${id}-title`} value={title} maxLength={80} onChange={(e) => setTitle(e.target.value)} />
        </Field>
        <Field label="Description" htmlFor={`${id}-body`} error={errors.body}>
          <Textarea id={`${id}-body`} rows={3} value={body} maxLength={600} onChange={(e) => setBody(e.target.value)} />
        </Field>
        <Field label="Includes (one per line)" htmlFor={`${id}-items`} error={errors.items}>
          <Textarea id={`${id}-items`} rows={4} value={items} onChange={(e) => setItems(e.target.value)} />
        </Field>
        <div className="flex items-center gap-[20px]">
          <Button type="submit" disabled={pending}>
            {pending ? "Saving…" : "Save"}
          </Button>
          <p role="status" className="text-ink/70 text-[15px]">
            {status}
          </p>
        </div>
      </div>
    </form>
  );
}
