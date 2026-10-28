import type { Metadata } from "next";
import { LoginForm } from "@/components/admin";
import { Wordmark } from "@/components/site/Wordmark";

export const metadata: Metadata = {
  title: "Sign in — Smidify admin",
  robots: { index: false },
};

export default function LoginPage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-[1280px] flex-col justify-center gap-[40px] px-5 py-[84px] md:px-[72px]">
      <Wordmark size="lg" as="div" />
      <div className="flex max-w-[400px] flex-col gap-[30px]">
        <h1 className="text-[28px] leading-8 md:text-[36px] md:leading-[44px]">Admin sign in</h1>
        <LoginForm />
      </div>
    </main>
  );
}
