import "server-only";
import { sampleProjects, samplePosts } from "./samples";
import { defaultCompanyContent } from "./company";
import type { AdminCounts, ContentRow, ContentType } from "@/lib/queries/admin";
import type { AdminService, AdminQuote } from "@/lib/queries/admin-content";
import type { PipelineItem } from "@/lib/queries/pipeline";

const date = "2026-11-15T09:00:00Z";
const id = (n: number) =>
  `00000000-0000-4000-8000-${String(n).padStart(12, "0")}`;

export const studioProjects = sampleProjects.map((project, i) => ({
  ...project,
  id: id(i + 1),
  status:
    i < 2
      ? ("published" as const)
      : i === 2
        ? ("in_review" as const)
        : ("draft" as const),
}));
export const studioPosts = samplePosts.map((post, i) => ({
  ...post,
  id: id(i + 101),
  status: i < 2 ? ("published" as const) : ("draft" as const),
}));
export const studioServices: AdminService[] = [
  {
    id: id(201),
    num: "01",
    title: "Websites",
    body: "Clear, accessible websites designed around your customers.",
    items: ["Design and development", "Content management", "Hosting and care"],
    sort: 0,
  },
  {
    id: id(202),
    num: "02",
    title: "Mobile apps",
    body: "Thoughtful mobile tools that make everyday work easier.",
    items: ["iOS and Android", "Prototyping", "App-store launch"],
    sort: 1,
  },
  {
    id: id(203),
    num: "03",
    title: "Networks",
    body: "Reliable infrastructure for a connected team.",
    items: ["Network design", "Secure Wi-Fi", "Monitoring"],
    sort: 2,
  },
];
export const studioQuotes: AdminQuote[] = [
  {
    id: id(301),
    name: "Sample customer",
    company: "Local demo enquiry",
    email: "preview@example.invalid",
    phone: null,
    kind: "website",
    message:
      "We are exploring a new website and would like to talk about the next step. This is sample content for the Studio preview.",
    handled: false,
    created_at: date,
  },
  {
    id: id(302),
    name: "Sample team",
    company: "Example app project",
    email: "demo@example.invalid",
    phone: null,
    kind: "mobile",
    message:
      "Could you help us turn our workflow into a simple app? This is a fictional preview request.",
    handled: false,
    created_at: date,
  },
];
export const studioPipeline: PipelineItem[] = [
  {
    id: id(401),
    name: "Website concept",
    kind: "website",
    stage: "discovery",
    due_note: "Sample project",
    quote_request_id: null,
    project_id: id(1),
    sort: 0,
    created_at: date,
    updated_at: date,
  },
  {
    id: id(402),
    name: "App prototype",
    kind: "mobile",
    stage: "design",
    due_note: "Sample project",
    quote_request_id: null,
    project_id: id(2),
    sort: 0,
    created_at: date,
    updated_at: date,
  },
  {
    id: id(403),
    name: "Connected workspace",
    kind: "network",
    stage: "build",
    due_note: null,
    quote_request_id: null,
    project_id: id(3),
    sort: 0,
    created_at: date,
    updated_at: date,
  },
];
export const studioCounts: AdminCounts = {
  projects: studioProjects.length,
  publishedProjects: studioProjects.filter((p) => p.status === "published")
    .length,
  posts: studioPosts.length,
  publishedPosts: studioPosts.filter((p) => p.status === "published").length,
  drafts: [...studioProjects, ...studioPosts].filter(
    (p) => p.status !== "published",
  ).length,
  services: studioServices.length,
  quotes: studioQuotes.length,
  pipeline: studioPipeline.length,
};
export function studioContent(
  type: ContentType,
  q?: string,
  limit = 8,
): ContentRow[] {
  return [
    ...(type === "posts"
      ? []
      : studioProjects.map((p) => ({ ...p, type: "project" as const }))),
    ...(type === "projects"
      ? []
      : studioPosts.map((p) => ({ ...p, type: "post" as const }))),
  ]
    .filter((row) => !q || row.title.toLowerCase().includes(q.toLowerCase()))
    .sort((a, b) => (b.updated_at ?? "").localeCompare(a.updated_at ?? ""))
    .slice(0, limit);
}
export const studioCompanyDraft = {
  content: defaultCompanyContent,
  revision: 0,
  updatedAt: null,
  publishedRevision: 0,
  publishedAt: null,
};
