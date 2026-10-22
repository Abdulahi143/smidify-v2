import type { Database } from "@/lib/types/database";

export type PipelineStage = Database["public"]["Enums"]["pipeline_stage"];

export type ProcessStage = {
  key: PipelineStage;
  num: string;
  name: string;
  duration: string;
  body: string;
  deliverables: readonly string[];
};

export const PROCESS_STAGES: readonly ProcessStage[] = [
  {
    key: "idea",
    num: "01",
    name: "Idea",
    duration: "Day 1",
    body: "You tell us the problem in plain words. We ask how things work today and what “better” looks like.",
    deliverables: ["A free first call", "Notes back the same week"],
  },
  {
    key: "discovery",
    num: "02",
    name: "Discovery",
    duration: "Week 1",
    body: "We look at your users, data and systems, and agree the smallest version worth building.",
    deliverables: ["Scope document", "Fixed quote and timeline"],
  },
  {
    key: "design",
    num: "03",
    name: "Design",
    duration: "Weeks 2–3",
    body: "Screens, flows or network plans you can click through and comment on before anything is built.",
    deliverables: ["Clickable prototype", "Network diagram where relevant"],
  },
  {
    key: "build",
    num: "04",
    name: "Build",
    duration: "Weeks 3–10",
    body: "Development in weekly slices. Every Friday you see working software, not a status report.",
    deliverables: ["Weekly preview link", "Shared progress board"],
  },
  {
    key: "test",
    num: "05",
    name: "Test",
    duration: "1–2 weeks",
    body: "Automated tests, real-device checks, security review and a round with your own staff.",
    deliverables: ["Test report", "Fixes before launch"],
  },
  {
    key: "launch",
    num: "06",
    name: "Launch",
    duration: "1 day",
    body: "We release to production, watch it closely, and train your team to use and update it.",
    deliverables: ["Go-live checklist", "Training session"],
  },
  {
    key: "care",
    num: "07",
    name: "Care",
    duration: "Ongoing",
    body: "Monitoring, updates and improvements. What we learn here becomes the next idea.",
    deliverables: ["Monthly report", "A named person to call"],
  },
] as const;
