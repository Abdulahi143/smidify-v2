import type { Metadata } from "next";
import { Suspense } from "react";
import { Footer } from "@/components/site/Footer";
import { Nav } from "@/components/site/Nav";

export const metadata: Metadata = { title: "Preview", robots: { index: false } };

/** Draft previews render the real public components, outside the admin chrome. */
export default function PreviewLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <p className="bg-cyan-100 py-[10px] text-center text-[15px] text-cyan-800" role="status">
        Preview — this is how the page will look once published. Only signed-in admins can see it.
      </p>
      <Suspense fallback={null}>
        <Nav />
      </Suspense>
      <main>
        <Suspense fallback={null}>{children}</Suspense>
      </main>
      <Footer />
    </>
  );
}
