"use client";

import { ErrorPanel } from "@/components/ui";

export default function AdminError(props: { error: Error & { digest?: string }; reset: () => void }) {
  return <ErrorPanel {...props} className="py-[40px]" />;
}
