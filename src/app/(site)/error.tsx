"use client";

import { ErrorPanel } from "@/components/ui";

export default function SiteError(props: { error: Error & { digest?: string }; reset: () => void }) {
  return <ErrorPanel {...props} className="mx-auto max-w-[1280px] px-5 py-[84px] md:px-[72px]" />;
}
