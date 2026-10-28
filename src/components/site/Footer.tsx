import Link from "next/link";
import { Wordmark } from "./Wordmark";
import { defaultCompanyContent } from "@/lib/content/company";
export async function Footer({
  copy = defaultCompanyContent.copy,
}: {
  copy?: Record<string, string>;
}) {
  "use cache";
  return (
    <footer>
      <Link className="logo" href="/" aria-label="Smidify home">
        <Wordmark size="sm" />
      </Link>
      <span className="preview-label">{copy.footerTagline}</span>
      <span>© {new Date().getFullYear()} Smidify</span>
      <Link href="/work">Projects</Link>
      <Link href="/services">Services</Link>
      <Link href="/process">Process</Link>
      <Link href="/blog">Blog</Link>
      <Link href="/admin">Admin</Link>
      <a href="#">{copy.footerTop}</a>
    </footer>
  );
}
