import type { Project } from "@/lib/queries/projects";

export type ProjectKind = Project["kinds"][number];

export const KIND_LABEL: Record<ProjectKind, string> = {
  website: "Website",
  mobile: "Mobile app",
  network: "Network",
  ai: "AI integration",
};

export const KIND_FILTERS: readonly { value: "" | ProjectKind; label: string }[] = [
  { value: "", label: "All" },
  { value: "website", label: "Websites" },
  { value: "mobile", label: "Mobile" },
  { value: "network", label: "Network" },
  { value: "ai", label: "AI" },
];

export function isKind(v: string | undefined): v is ProjectKind {
  return v === "website" || v === "mobile" || v === "network" || v === "ai";
}
