import type { Project } from "@/lib/queries/projects";
import type { Post } from "@/lib/queries/posts";

/** Design previews only. Never substitutes for errors from a configured backend. */
export const sampleMode =
  !process.env.NEXT_PUBLIC_SUPABASE_URL ||
  !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const date = "2026-11-01T09:00:00Z";
const projects: {
  slug: string;
  title: string;
  summary: string;
  kinds: Project["kinds"];
  image: string;
}[] = [
  {
    slug: "sample-north-studio",
    title: "North Studio — a place to begin",
    summary:
      "A website concept for an independent architecture studio. Clear work, thoughtful details and room to explore.",
    kinds: ["website"],
    image: "website",
  },
  {
    slug: "sample-field-notes",
    title: "Field Notes — everyday, simplified",
    summary:
      "A mobile app concept that brings tasks, notes and updates into one calm workspace.",
    kinds: ["mobile"],
    image: "app",
  },
  {
    slug: "sample-connected-workspace",
    title: "A more connected workspace",
    summary:
      "A network design concept for a growing team, from reliable Wi-Fi to a simpler way to manage access.",
    kinds: ["network"],
    image: "network",
  },
  {
    slug: "sample-clearer-day",
    title: "A clearer day, with AI",
    summary:
      "An assistant concept that helps a small business find answers in its own documents.",
    kinds: ["ai", "website"],
    image: "ai",
  },
];
export const sampleProjects: Project[] = projects.map((p, i) => ({
  id: `sample-project-${i}`,
  slug: p.slug,
  title: p.title,
  summary: p.summary,
  kinds: p.kinds,
  client: "Independent concept",
  timeline: "Concept development",
  year: 2026,
  cover_path: `/samples/${p.image}.svg`,
  cover_alt: `Illustrative ${p.image} design concept, not completed client work`,
  gallery_paths: [
    `/samples/${p.image}.svg`,
    `/samples/${p.image === "website" ? "app" : "website"}.svg`,
  ],
  gallery_alts: ["Interface exploration", "Visual direction"],
  problem:
    "This concept explores a familiar challenge: useful information scattered across too many places, with no clear next step for the people using it.",
  solution:
    "The concept starts with a simpler structure. We bring the most useful actions forward, make the language clear and create a consistent experience across screen sizes.",
  result:
    "The design brings the key tasks into a calmer, more consistent interface. This concept explores how clear structure and thoughtful details can make everyday work easier.",
  quote: null,
  quote_author: null,
  featured: i < 3,
  status: "published",
  published_at: date,
  created_at: date,
  updated_at: date,
}));
const articles = [
  {
    slug: "sample-start-with-the-task",
    title: "A better website starts with a better question.",
    category: "Design",
    image: "website",
    excerpt:
      "Before choosing colours or layouts, ask what someone needs to get done.",
    heading: "Start with the task",
    body: "A visitor usually arrives with a purpose: understand a service, compare options or make contact. A useful website makes that purpose easy to follow.\n\nWrite down the three things people should be able to do. Use those tasks to shape navigation, page content and calls to action.",
    second: "Make the next step obvious",
  },
  {
    slug: "sample-small-tools",
    title: "Small tools. A little less friction.",
    category: "Apps",
    image: "app",
    excerpt:
      "The best internal tool can be the one that removes one repeated frustration.",
    heading: "Watch the everyday work",
    body: "A repeated task is a useful place to begin. Where do people copy the same information, search for an update or wait for an answer?\n\nA small prototype can make that workflow visible. Try it with the people doing the work before building a bigger system.",
    second: "Build a small first version",
  },
  {
    slug: "sample-reliable-networks",
    title: "The quiet value of a reliable network.",
    category: "Networks",
    image: "network",
    excerpt: "Good infrastructure gives a team more time to focus on its work.",
    heading: "Begin with the space",
    body: "An office network serves people, devices and the way they move through a space. Document those needs before choosing equipment.\n\nConsider busy meeting rooms, guest access and places where connections tend to disappear. Clear documentation helps support the system later.",
    second: "Plan for the next person",
  },
  {
    slug: "sample-ai-with-purpose",
    title: "Give AI a useful job.",
    category: "AI",
    image: "ai",
    excerpt:
      "Start with a clear task and a way to tell whether the result helps.",
    heading: "Choose a bounded task",
    body: "A focused assistant is easier to evaluate than a tool asked to do everything. Start with one repeated question or one document workflow.\n\nDecide who reviews uncertain answers and what a good result looks like. The interface should make that review straightforward.",
    second: "Leave room for judgement",
  },
];
export const samplePosts: Post[] = articles.map((p, i) => ({
  id: `sample-post-${i}`,
  slug: p.slug,
  title: p.title,
  excerpt: p.excerpt,
  category: p.category,
  cover_path: `/samples/${p.image}.svg`,
  cover_alt: "Journal illustration",
  body_md: `## ${p.heading}\n\n${p.body}\n\n## ${p.second}\n\nKeep the first version focused. Make it easy to use, gather feedback and improve the parts that matter. A clear next step is often more useful than another feature.\n\n> Thoughtful technology starts with understanding the people using it.\n\n### A practical starting point\n\n- Identify one task worth improving.\n- Sketch the simplest useful version.\n- Review it on a phone and a larger screen.\n- Try it with someone who will use it.`,
  featured: i === 0,
  status: "published",
  published_at: `2026-10-${String(28 - i * 4).padStart(2, "0")}T09:00:00Z`,
  created_at: date,
  updated_at: date,
}));
