import { Footer } from "./Footer";
import { Nav } from "./Nav";
import { getCompanyContent } from "@/lib/queries/company";

export async function NavWithContent() {
  const { copy } = await getCompanyContent();
  return <Nav copy={copy} />;
}

export async function FooterWithContent() {
  const { copy } = await getCompanyContent();
  return <Footer copy={copy} />;
}