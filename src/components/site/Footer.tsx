import Image from "next/image";
import Link from "next/link";

const links = [
  { href: "/work", label: "Work" },
  { href: "/services", label: "Services" },
  { href: "/process", label: "Process" },
  { href: "/blog", label: "Blog" },
];

export async function Footer() {
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
              Websites, apps, networks.
              <br />
              Easy to work with.
            </p>
          </div>
          <nav aria-label="Footer">
            <p className="footer-label">Explore</p>
            <ul>
              {links.map(({ href, label }) => (
                <li key={href}>
                  <Link href={href}>
                    {label}
                    <span aria-hidden="true">↗</span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <div className="footer-contact">
            <p className="footer-label">Start a conversation</p>
            <a href="mailto:hello@smidify.com">
              hello@smidify.com <span aria-hidden="true">↗</span>
            </a>
            <Link href="/#quote" className="footer-quote">
              Tell us about your project
            </Link>
          </div>
        </div>
        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} Smidify. All rights reserved.</p>
          <p>Designed. Built. Connected.</p>
        </div>
      </div>
    </footer>
  );
}
