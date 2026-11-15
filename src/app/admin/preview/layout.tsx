import type { Metadata } from "next";
import { Suspense } from "react";
import { Footer } from "@/components/site/Footer";
import { Nav } from "@/components/site/Nav";
import { getCompanyPreview } from "@/lib/actions/company";
import { isLocalStudioPreview } from "@/lib/studio-preview";
export const metadata: Metadata = {
  title: "Preview",
  robots: { index: false },
};
async function PreviewShell({ children }: { children: React.ReactNode }) {
  const { copy } = await getCompanyPreview();
  const local = await isLocalStudioPreview();
  return (
    <div className="public-site" style={{ position: "relative" }}>
      <p
        className="relative z-50 bg-cyan-100 py-[10px] text-center text-[15px] text-cyan-800"
        role="status"
      >
        {local
          ? "Local preview — sample content. Changes are not saved or published."
          : "Draft preview — only signed-in admins can see this. Changes are not live until published."}
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
