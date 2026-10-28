"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui";
import {
  getCompanyDraft,
  saveCompanyDraft,
  publishCompanyDraft,
} from "@/lib/actions/company";
import type { CompanyContent } from "@/lib/content/company";
import fields from "@/lib/content/company-fields.json";
type Initial = Awaited<ReturnType<typeof getCompanyDraft>>;
export function WebsiteEditor({ initial }: { initial: Initial }) {
  const [content, setContent] = useState(initial.content),
    [revision, setRevision] = useState(initial.revision),
    [publishedRevision, setPublishedRevision] = useState(
      initial.publishedRevision,
    ),
    [dirty, setDirty] = useState(false),
    [busy, setBusy] = useState(false),
    [error, setError] = useState(""),
    [notice, setNotice] = useState(""),
    [group, setGroup] = useState("Hero"),
    [tab, setTab] = useState<"text" | "milestones">("text");
  useEffect(() => {
    const warn = (event: BeforeUnloadEvent) => {
      if (dirty) {
        event.preventDefault();
        event.returnValue = "";
      }
    };
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);
  function change(next: CompanyContent) {
    setContent(next);
    setDirty(true);
    setNotice("");
    setError("");
  }
  async function act(action: "save" | "publish" | "preview") {
    setBusy(true);
    setError("");
    setNotice("");
    const preview =
      action === "preview"
        ? window.open("about:blank", "smidify-website-preview")
        : null;
    try {
      let nextRevision = revision;
      if (dirty || !revision) {
        const result = await saveCompanyDraft(content, revision);
        if (!result.ok) throw Error(result.message);
        nextRevision = result.revision;
        setRevision(nextRevision);
        setDirty(false);
      }
      if (action === "publish") {
        const result = await publishCompanyDraft(nextRevision);
        if (!result.ok) throw Error(result.message);
        setPublishedRevision(result.revision);
        setNotice("Published. Your website is updated.");
      } else if (action === "preview") {
        if (preview) preview.location.href = "/admin/preview/website";
        else setNotice("Draft saved. Open the saved preview link below.");
      } else setNotice("Draft saved. The live website has not changed.");
    } catch (e) {
      preview?.close();
      setError(e instanceof Error ? e.message : "Unable to save changes.");
    } finally {
      setBusy(false);
    }
  }
  function field(
    label: string,
    value: string,
    update: (v: string) => void,
    multiline = false,
  ) {
    return (
      <label className="block">
        <span className="mb-2 block text-sm font-semibold">{label}</span>
        {multiline ? (
          <textarea
            className="w-full rounded border border-neutral-300 bg-white p-3 text-base"
            rows={3}
            value={value}
            onChange={(e) => update(e.target.value)}
            maxLength={5000}
          />
        ) : (
          <input
            className="w-full rounded border border-neutral-300 bg-white p-3 text-base"
            value={value}
            onChange={(e) => update(e.target.value)}
            maxLength={5000}
          />
        )}
      </label>
    );
  }
  return (
    <div>
      <p className="meta">Company website</p>
      <h1 className="mt-3 text-4xl">Website text & milestones</h1>
      <p className="text-ink/70 mt-3">
        Keep the approved design. Save a draft, preview it, then publish.
      </p>
      <div className="my-6 flex flex-wrap items-center gap-4">
        <Button
          variant={tab === "text" ? "primary" : "secondary"}
          onClick={() => setTab("text")}
        >
          Website text
        </Button>
        <Button
          variant={tab === "milestones" ? "primary" : "secondary"}
          onClick={() => setTab("milestones")}
        >
          Milestones
        </Button>
        <Link href="/admin/projects" className="underline">
          Edit projects →
        </Link>
      </div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4 border-y border-neutral-300 py-5">
        <span className="text-ink/70 text-sm">
          {dirty
            ? "Unsaved changes"
            : revision > publishedRevision
              ? "Saved draft"
              : "Up to date"}
        </span>
        <div className="flex flex-wrap gap-4">
          <Button
            variant="secondary"
            disabled={busy}
            onClick={() => act("preview")}
          >
            Preview draft ↗
          </Button>
          <Button
            variant="secondary"
            disabled={busy || (!dirty && revision > 0)}
            onClick={() => act("save")}
          >
            Save draft
          </Button>
          <Button
            disabled={
              busy || (!dirty && revision > 0 && revision === publishedRevision)
            }
            onClick={() => act("publish")}
          >
            {busy ? "Working…" : "Publish changes"}
          </Button>
        </div>
      </div>
      {error && (
        <p
          role="alert"
          className="mb-6 border border-red-300 bg-red-50 p-4 text-red-800"
        >
          {error}
        </p>
      )}
      {notice && (
        <p role="status" className="mb-6 bg-cyan-100 p-4">
          {notice}
        </p>
      )}
      <fieldset disabled={busy} className="min-w-0">
        <legend className="sr-only">Website content</legend>
        {tab === "text" ? (
          <>
            <div className="mb-6 flex flex-wrap gap-3">
              {[...new Set(fields.map((f) => f.group))].map((g) => (
                <button
                  key={g}
                  type="button"
                  onClick={() => setGroup(g)}
                  className={
                    "rounded px-3 py-2 text-sm " +
                    (group === g ? "bg-cyan-100 text-cyan-800" : "bg-surface")
                  }
                >
                  {g}
                </button>
              ))}
            </div>
            <section className="rounded border border-neutral-300 bg-neutral-100 p-6">
              <h2 className="mb-6 text-2xl">{group}</h2>
              <div className="grid gap-6">
                {fields
                  .filter((f) => f.group === group)
                  .map((f) => (
                    <div key={f.key}>
                      {field(
                        f.label,
                        content.copy[f.key] ?? "",
                        (v) =>
                          change({
                            ...content,
                            copy: { ...content.copy, [f.key]: v },
                          }),
                        f.key.endsWith("Title") ||
                          f.key.includes("Body") ||
                          f.key.includes("Intro") ||
                          f.key.includes("Description"),
                      )}
                    </div>
                  ))}
              </div>
            </section>
          </>
        ) : (
          <>
            <div className="mb-6 flex items-center justify-between">
              <p>Dates can be years, months, or full dates.</p>
              <Button
                disabled={content.milestones.length >= 60}
                onClick={() =>
                  change({
                    ...content,
                    milestones: [
                      ...content.milestones,
                      {
                        id: crypto.randomUUID(),
                        title: "New milestone",
                        date: "",
                        description: "",
                      },
                    ],
                  })
                }
              >
                Add milestone
              </Button>
            </div>
            {content.milestones.length === 0 && (
              <p className="border border-dashed border-neutral-300 p-6">
                No milestones yet. Add one to start your timeline.
              </p>
            )}
            {content.milestones.map((m, i) => (
              <section
                key={m.id}
                className="mb-6 rounded border border-neutral-300 bg-neutral-100 p-6"
              >
                <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
                  <h2 className="text-2xl">
                    {m.title || "Untitled milestone"}
                  </h2>
                  <div className="flex gap-4">
                    {[-1, 1].map((d) => (
                      <button
                        key={d}
                        type="button"
                        disabled={
                          i + d < 0 || i + d >= content.milestones.length
                        }
                        aria-label={`Move milestone ${i + 1} ${d < 0 ? "up" : "down"}`}
                        onClick={() => {
                          const list = [...content.milestones];
                          const target = list[i + d],
                            current = list[i];
                          if (!target || !current) return;
                          list[i] = target;
                          list[i + d] = current;
                          change({ ...content, milestones: list });
                        }}
                        className="disabled:opacity-30"
                      >
                        {d < 0 ? "↑" : "↓"}
                      </button>
                    ))}
                    <button
                      type="button"
                      className="text-red-800 underline"
                      onClick={() => {
                        if (
                          window.confirm(
                            "Remove this milestone from the draft?",
                          )
                        )
                          change({
                            ...content,
                            milestones: content.milestones.filter(
                              (_, n) => n !== i,
                            ),
                          });
                      }}
                    >
                      Remove
                    </button>
                  </div>
                </div>
                <div className="grid gap-5">
                  {field("Title", m.title, (v) =>
                    change({
                      ...content,
                      milestones: content.milestones.map((item, n) =>
                        n === i ? { ...item, title: v } : item,
                      ),
                    }),
                  )}
                  {field("Date or year", m.date, (v) =>
                    change({
                      ...content,
                      milestones: content.milestones.map((item, n) =>
                        n === i ? { ...item, date: v } : item,
                      ),
                    }),
                  )}
                  {field(
                    "Description",
                    m.description,
                    (v) =>
                      change({
                        ...content,
                        milestones: content.milestones.map((item, n) =>
                          n === i ? { ...item, description: v } : item,
                        ),
                      }),
                    true,
                  )}
                </div>
              </section>
            ))}
          </>
        )}
      </fieldset>
      <div className="mt-6 flex flex-wrap justify-between gap-4 text-sm">
        <Link
          href="/admin/preview/website"
          target="_blank"
          className="underline"
        >
          Open saved preview ↗
        </Link>
        <button
          type="button"
          disabled={busy}
          className="underline"
          onClick={async () => {
            if (
              dirty &&
              !window.confirm(
                "Discard unsaved changes and reload the saved draft?",
              )
            )
              return;
            setBusy(true);
            try {
              const data = await getCompanyDraft();
              setContent(data.content);
              setRevision(data.revision);
              setPublishedRevision(data.publishedRevision);
              setDirty(false);
              setNotice("Saved draft loaded.");
            } catch (e) {
              setError(e instanceof Error ? e.message : "Could not reload.");
            } finally {
              setBusy(false);
            }
          }}
        >
          Reload saved draft
        </button>
      </div>
    </div>
  );
}
