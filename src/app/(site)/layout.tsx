import { FooterWithContent, NavWithContent } from "@/components/site/SiteContent";

import { Footer } from "@/components/site/Footer";
import { Nav } from "@/components/site/Nav";
import { Suspense } from "react";

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="public-site">
      <a href="#main-content" className="skip-link">
        Skip to content
      </a>
      <Suspense fallback={<Nav />}>
        <NavWithContent />
      </Suspense>
      <main id="main-content" tabIndex={-1}>
        {children}
      </main>
      <Suspense fallback={<Footer />}>
        <FooterWithContent />
      </Suspense>
    </div>
  );
}