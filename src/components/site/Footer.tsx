import Image from "next/image";
import Link from "next/link";
import { defaultCompanyContent } from "@/lib/content/company";
import { Lines } from "./CopyLines";

const links = [
  { href: "/work", key: "navProjects" },
  { href: "/services", key: "navExpertise" },
  { href: "/process", key: "navAbout" },
  { href: "/blog", key: "navVision" },
];

export async function Footer({
  copy = defaultCompanyContent.copy,
}: {
  copy?: Record<string, string>;
}) {
  "use cache";
  return (
    <footer id="footer" className="site-footer">
      <div className="home-container footer-content">
        <div className="footer-main">
          <div className="footer-brand">
            <Link href="/" aria-label="Smidify home" className="brand-lockup">
              <Image
                src="/brand/smidify-keystone.svg"
                alt=""
                width={38}
                height={38}
                className="brand-keystone"
              />
              <Image
                src="/brand/smidify-wordmark.svg"
                alt="Smidify"
                width={145}
                height={39}
                className="site-brand-logo"
              />
              <sup className="brand-trademark" aria-label="trademark">
                ™
              </sup>
            </Link>
            <p>
              <Lines value={copy.footerTagline} />
            </p>
          </div>
          <nav aria-label="Footer">
            <p className="footer-label">Explore</p>
            <ul>
              {links.map(({ href, key }) => (
                <li key={href}>
                  <Link href={href}>
                    {copy[key]}
                    <span aria-hidden="true">↗</span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <div className="footer-contact">
            <p className="footer-label">Start a conversation</p>
            <a href={`mailto:${copy.contactEmail}`}>
              {copy.contactEmail} <span aria-hidden="true">↗</span>
            </a>
            <Link href="/#quote" className="footer-quote">
              Tell us about your project
            </Link>
          </div>
        </div>
        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} Smidify. All rights reserved.</p>
          <p>{copy.footerTop}</p>
        </div>
      </div>
    </footer>
  );
}
