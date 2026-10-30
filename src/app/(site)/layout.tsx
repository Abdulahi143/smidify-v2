import { Footer } from "@/components/site/Footer";
import { Nav } from "@/components/site/Nav";
import { getCompanyContent } from "@/lib/queries/company";
import "./company.css";
export default async function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { copy } = await getCompanyContent();
  return (
    <div className="company-site">
      <Nav copy={copy} />
      <main>{children}</main>
      <Footer copy={copy} />
    </div>
  );
}
