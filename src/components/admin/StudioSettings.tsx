"use client";

import Link from "next/link";
import { useState } from "react";
import { Button, Field, Input, Textarea } from "@/components/ui";
import { useStudioPreview } from "./StudioPreview";
import {
  saveStudioSettings,
  updateAccountPassword,
} from "@/lib/actions/settings";
import {
  publishCompanyDraft,
  type getCompanyDraft,
} from "@/lib/actions/company";
import type { StudioSettingsInput } from "@/lib/validation/studio";

export function StudioSettings({
  initial,
  email,
  websiteUrl,
  configured,
}: {
  initial: Awaited<ReturnType<typeof getCompanyDraft>>;
  email: string;
  websiteUrl: string;
  configured: boolean;
}) {
  const local = useStudioPreview();
  const [section, setSection] = useState<"general" | "account" | "connection">(
    "general",
  );
  const [values, setValues] = useState<StudioSettingsInput>({
    contactEmail: initial.content.copy.contactEmail ?? "",
    metaTitle: initial.content.copy.metaTitle ?? "",
    metaDescription: initial.content.copy.metaDescription ?? "",
    footerTagline: initial.content.copy.footerTagline ?? "",
  });
  const [snapshot, setSnapshot] = useState(JSON.stringify(values));
  const [revision, setRevision] = useState(initial.revision);
  const [published, setPublished] = useState(initial.publishedRevision);
  const [password, setPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");
  const dirty = JSON.stringify(values) !== snapshot;

  async function save(publish: boolean) {
    if (local || busy) return;
    setBusy(true);
    setError("");
    setNotice("");
    try {
      let next = revision;
      if (dirty || !next) {
        const result = await saveStudioSettings(values, revision);
        if (!result.ok) throw Error(result.message);
        next = result.revision;
        setRevision(next);
        setSnapshot(JSON.stringify(values));
      }
      if (publish) {
        const result = await publishCompanyDraft(next);
        if (!result.ok) throw Error(result.message);
        setPublished(result.revision);
        setNotice("Website settings published.");
      } else setNotice("Settings saved to the website draft.");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not save settings.");
    } finally {
      setBusy(false);
    }
  }
  async function changePassword(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (local || busy) return;
    setBusy(true);
    setError("");
    setNotice("");
    try {
      const result = await updateAccountPassword({ password, confirmation });
      if (!result.ok) throw Error(result.message);
      setPassword("");
      setConfirmation("");
      setNotice(result.message);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not update password.");
    } finally {
      setBusy(false);
    }
  }
  return (
    <div className="studio-content-page">
      <header className="studio-page-header">
        <div>
          <p className="studio-eyebrow">Your workspace</p>
          <h1>Settings</h1>
          <p className="studio-description">
            Website details, account access, and your workspace connection.
          </p>
        </div>
      </header>
      <div
        className="studio-settings-tabs"
        role="group"
        aria-label="Settings section"
      >
        {(
          [
            ["general", "Website"],
            ["account", "Account"],
            ["connection", "Connection"],
          ] as const
        ).map(([key, label]) => (
          <button
            key={key}
            type="button"
            aria-pressed={section === key}
            onClick={() => {
              setSection(key);
              setNotice("");
              setError("");
            }}
          >
            {label}
          </button>
        ))}
      </div>
      {notice ? (
        <p role="status" className="studio-notice">
          {notice}
        </p>
      ) : null}
      {error ? (
        <p role="alert" className="studio-notice studio-notice-warning">
          {error}
        </p>
      ) : null}
      {section === "general" ? (
        <section
          className="studio-panel studio-settings-panel"
          aria-labelledby="settings-site-title"
        >
          <h2 id="settings-site-title">Website details</h2>
          <p>
            These settings share the website draft. Publishing also publishes
            other saved website edits.
          </p>
          <form
            onSubmit={(event) => {
              event.preventDefault();
              void save(false);
            }}
          >
            <fieldset disabled={busy} className="studio-settings-fields">
              <legend className="sr-only">Website details</legend>
              <Field label="Contact email" htmlFor="settings-email">
                <Input
                  id="settings-email"
                  type="email"
                  value={values.contactEmail}
                  required
                  maxLength={254}
                  onChange={(e) =>
                    setValues({ ...values, contactEmail: e.target.value })
                  }
                />
              </Field>
              <Field label="Website title" htmlFor="settings-title">
                <Input
                  id="settings-title"
                  value={values.metaTitle}
                  required
                  maxLength={160}
                  onChange={(e) =>
                    setValues({ ...values, metaTitle: e.target.value })
                  }
                />
              </Field>
              <Field label="Search description" htmlFor="settings-description">
                <Textarea
                  id="settings-description"
                  rows={3}
                  maxLength={500}
                  value={values.metaDescription}
                  onChange={(e) =>
                    setValues({ ...values, metaDescription: e.target.value })
                  }
                />
              </Field>
              <Field label="Footer tagline" htmlFor="settings-tagline">
                <Textarea
                  id="settings-tagline"
                  rows={2}
                  maxLength={500}
                  value={values.footerTagline}
                  onChange={(e) =>
                    setValues({ ...values, footerTagline: e.target.value })
                  }
                />
              </Field>
              <div className="studio-settings-actions">
                <span className="studio-save-status">
                  {dirty
                    ? "Unsaved changes"
                    : revision > published
                      ? "Saved website draft"
                      : "Up to date"}
                </span>
                <Button
                  type="submit"
                  variant="secondary"
                  disabled={local || busy || (!dirty && revision > 0)}
                >
                  Save draft
                </Button>
                <Button
                  disabled={
                    local ||
                    busy ||
                    (!dirty && revision > 0 && revision === published)
                  }
                  onClick={() => void save(true)}
                >
                  Publish settings
                </Button>
              </div>
            </fieldset>
          </form>
          <Link href="/admin/website" className="studio-text-link">
            Open the full website editor →
          </Link>
        </section>
      ) : null}
      {section === "account" ? (
        <section
          className="studio-panel studio-settings-panel"
          aria-labelledby="settings-account-title"
        >
          <h2 id="settings-account-title">Your account</h2>
          <p>
            Signed in as <strong>{email}</strong>. New admin access is managed
            by your workspace owner.
          </p>
          <form onSubmit={changePassword}>
            <fieldset disabled={busy} className="studio-settings-fields">
              <legend className="sr-only">Change password</legend>
              <Field label="New password" htmlFor="settings-password">
                <Input
                  id="settings-password"
                  type="password"
                  autoComplete="new-password"
                  minLength={12}
                  maxLength={200}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </Field>
              <Field
                label="Confirm new password"
                htmlFor="settings-confirmation"
              >
                <Input
                  id="settings-confirmation"
                  type="password"
                  autoComplete="new-password"
                  maxLength={200}
                  required
                  value={confirmation}
                  onChange={(e) => setConfirmation(e.target.value)}
                />
              </Field>
              <p className="studio-description">Use at least 12 characters.</p>
              <Button type="submit" disabled={local || busy}>
                Update password
              </Button>
            </fieldset>
          </form>
        </section>
      ) : null}
      {section === "connection" ? (
        <section
          className="studio-panel studio-settings-panel"
          aria-labelledby="settings-connection-title"
        >
          <h2 id="settings-connection-title">Workspace connection</h2>
          <dl className="studio-settings-facts">
            <div>
              <dt>Mode</dt>
              <dd>{local ? "Local design preview" : "Authenticated Studio"}</dd>
            </div>
            <div>
              <dt>Content connection</dt>
              <dd>{configured ? "Configured" : "Not configured"}</dd>
            </div>
            <div>
              <dt>Website address</dt>
              <dd>{websiteUrl}</dd>
            </div>
            <div>
              <dt>Website draft revision</dt>
              <dd>{revision}</dd>
            </div>
            <div>
              <dt>Published revision</dt>
              <dd>{published}</dd>
            </div>
          </dl>
          <p>
            {local
              ? "This preview uses fictional records. Saving, uploads, password changes, and publishing are disabled."
              : "Credentials and admin membership are managed outside Studio. Contact the workspace owner if access or connection details need changing."}
          </p>
        </section>
      ) : null}
    </div>
  );
}
