"use client";

import { useEffect } from "react";
import { Button } from "./Button";

export function ErrorPanel({
  error,
  reset,
  className,
}: {
  error: Error & { digest?: string };
  reset: () => void;
  className?: string;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div role="alert" className={className}>
      <h1 className="text-[36px] leading-[44px]">Something went wrong</h1>
      <p className="text-ink/75 mt-[15px] max-w-[44ch] text-[19px] leading-[30px]">
        This page didn’t load. Try again, and if it keeps happening let us know.
      </p>
      <Button className="mt-[30px]" onClick={reset}>
        Try again
      </Button>
    </div>
  );
}
