import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "@phosphor-icons/react/dist/ssr/ArrowLeft";
import { ArrowUpRight } from "@phosphor-icons/react/dist/ssr/ArrowUpRight";
import { LockSimple } from "@phosphor-icons/react/dist/ssr/LockSimple";
import { LoginForm } from "@/components/admin";
import { Wordmark } from "@/components/site/Wordmark";
import "../studio.css";

export const metadata: Metadata = {
  title: "Sign in — Smidify Studio",
  robots: { index: false },
};

export default function LoginPage() {
  const configured = Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  );
  return (
    <main className="studio-shell studio-login">
      <div className="studio-login-intro">
        <Link href="/" aria-label="Smidify home" className="studio-brand">
          <Wordmark size="sm" />
          <span className="studio-brand-label">Studio</span>
        </Link>
        <div>
          <p className="studio-eyebrow">Behind the scenes</p>
          <h1>
            A home for
            <br />
            what comes next.
          </h1>
          <p>
            Your website, your work, and your next conversation. Keep everything
            moving from one workspace.
          </p>
        </div>
        <Link href="/" className="studio-login-back">
          <ArrowLeft size={15} aria-hidden="true" />
          Back to Smidify
        </Link>
      </div>
      <div className="studio-login-content">
        <div className="studio-login-card">
          <span className="studio-empty-icon">
            <LockSimple size={23} aria-hidden="true" />
          </span>
          <p className="studio-eyebrow">Smidify Studio</p>
          <h2>Welcome back.</h2>
          {configured ? (
            <>
              <p className="studio-description">
                Sign in with your admin account to continue.
              </p>
              <LoginForm />
              <p className="studio-login-note">
                Need access? Ask your workspace administrator to add your
                account.
              </p>
            </>
          ) : (
            <>
              <p className="studio-description">
                Studio needs a connection before you can sign in.
              </p>
              <div className="studio-notice">
                Connect your Supabase project, apply the database migrations,
                and add an admin account. Your workspace owner can complete
                these steps using the project README.
              </div>
              <Link href="/" className="studio-text-link">
                Visit the website
                <ArrowUpRight size={15} aria-hidden="true" />
              </Link>
            </>
          )}
        </div>
      </div>
    </main>
  );
}
