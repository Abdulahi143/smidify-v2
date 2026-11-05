import { Nav } from "@/components/site/Nav";
import { Footer } from "@/components/site/Footer";

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { copy } = await getCompanyContent();
  return (
    <div className="public-site">
      <a href="#main-content" className="skip-link">
        Skip to content
      </a>
      <Nav />
      <main id="main-content" tabIndex={-1}>
        {children}
      </main>
      <Footer />
    </div>
  );
}
