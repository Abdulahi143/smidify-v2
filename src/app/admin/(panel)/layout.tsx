import type { Metadata } from "next";
import { Suspense } from "react";
import { Sidebar, TopBar } from "@/components/admin";
import { requireAdmin } from "@/lib/auth";
import { getAdminCounts } from "@/lib/queries/admin";

export const metadata: Metadata = {
  title: { default: "Admin", template: "%s — Smidify admin" },
  robots: { index: false },
};

async function Shell({ children }: { children: React.ReactNode }) {
  const [{ user }, counts] = await Promise.all([requireAdmin(), getAdminCounts()]);
  return (
    <div className="mx-auto grid max-w-[1440px] gap-x-[40px] px-5 py-[30px] md:grid-cols-[240px_1fr] md:px-[30px] md:py-0">
      <Sidebar counts={counts} email={user.email ?? ""} />
      <div className="min-w-0 pb-[84px]">
        <TopBar />
        {children}
      </div>
    </div>
  );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={null}>
      <Shell>{children}</Shell>
    </Suspense>
  );
}
