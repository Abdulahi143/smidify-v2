"use client";

import { useState } from "react";
import { Segmented } from "@/components/ui";

const options = [
  { value: "all", label: "All" },
  { value: "web", label: "Websites" },
  { value: "apps", label: "Apps" },
] as const;

export function SegmentedDemo() {
  const [value, setValue] = useState<(typeof options)[number]["value"]>("all");
  return (
    <Segmented
      label="Filter work"
      options={options}
      value={value}
      onChange={setValue}
    />
  );
}
