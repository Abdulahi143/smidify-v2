import type { Metadata } from "next";
import { Suspense } from "react";
import { Footer } from "@/components/site/Footer";
import { Nav } from "@/components/site/Nav";
import { getCompanyPreview } from "@/lib/actions/company";
import "@/app/(site)/company.css";
export const metadata: Metadata = {
  title: "Preview",
  robots: { index: false },
};
async function PreviewShell({ children }: { children: React.ReactNode }) {
  const { copy } = await getCompanyPreview();
  return (
    <div className="company-site">
      <p
        className="bg-cyan-100 py-[10px] text-center text-[15px] text-cyan-800"
        role="status"
      >
        Draft preview — only signed-in admins can see this. Changes are not live
        until published.
      </p>
      <Nav copy={copy} />
      <main>{children}</main>
      <Footer copy={copy} />
    </div>
  );
}
export default function PreviewLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Suspense fallback={null}>
      <PreviewShell>{children}</PreviewShell>
    </Suspense>
  );
}
