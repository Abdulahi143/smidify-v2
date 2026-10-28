"use client";

import { useSyncExternalStore } from "react";

const noop = () => () => {};

function greeting(): string {
  const h = new Date().getHours();
  if (h < 12) return "Good morning.";
  if (h < 18) return "Good afternoon.";
  return "Good evening.";
}

/** Time-aware in the viewer's timezone; the server snapshot keeps hydration stable. */
export function Greeting() {
  const text = useSyncExternalStore(noop, greeting, () => "Welcome back.");
  return (
    <h1 className="text-[40px] leading-[46px] tracking-[-0.02em] md:text-[72px] md:leading-[78px]">
      {text}
    </h1>
  );
}
