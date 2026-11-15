"use client";

import { useState } from "react";
import { Button } from "@/components/ui";
import { ServiceEditor } from "./ServiceEditor";
import type { AdminService } from "@/lib/queries/admin-content";

export function NewService({ nextSort }: { nextSort: number }) {
  const [draft, setDraft] = useState<AdminService | null>(null);
  return (
    <div>
      <Button
        variant="secondary"
        onClick={() =>
          setDraft(
            draft
              ? null
              : {
                  id: crypto.randomUUID(),
                  title: "",
                  body: "",
                  items: [],
                  num: String(nextSort + 1).padStart(2, "0"),
                  sort: nextSort,
                },
          )
        }
      >
        {draft ? "Cancel new service" : "+ Add service"}
      </Button>
      {draft ? (
        <div className="studio-new-service">
          <ServiceEditor service={draft} isNew onSaved={() => setDraft(null)} />
        </div>
      ) : null}
    </div>
  );
}
