import type { Metadata } from "next";
import { Suspense } from "react";
import { Sidebar, TopBar } from "@/components/admin";
import { requireStudioViewer } from "@/lib/auth";
import { StudioPreview } from "@/components/admin/StudioPreview";
import { getAdminCounts } from "@/lib/queries/admin";
import "../studio.css";

export const metadata: Metadata = {
  title: { default: "Studio", template: "%s — Smidify Studio" },
  robots: { index: false },
};

async function Shell({ children }: { children: React.ReactNode }) {
  const [viewer, counts] = await Promise.all([
    requireStudioViewer(),
    getAdminCounts(),
  ]);
  return (
    <StudioPreview enabled={viewer.preview}>
      <div className="studio-shell">
        <a href="#studio-main" className="studio-skip">
          Skip to content
        </a>
        <Sidebar counts={counts} email={viewer.email} />
        <div className="studio-workspace">
          <TopBar />
          {viewer.preview ? (
            <p role="status" className="studio-preview-banner">
              Local preview · Sample data · Saving, uploads, and publishing are
              disabled.
            </p>
          ) : null}
          <main id="studio-main" className="studio-main" tabIndex={-1}>
            {children}
          </main>
        </div>
      </div>
    </StudioPreview>
  );
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Suspense fallback={null}>
      <Shell>{children}</Shell>
    </Suspense>
  );
}
