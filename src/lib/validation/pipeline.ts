import { z } from "zod";
import { PROCESS_STAGES } from "@/lib/content/process";

const stages = PROCESS_STAGES.map((s) => s.key) as [string, ...string[]];

export const moveStageSchema = z.object({
  id: z.uuid(),
  stage: z.enum(stages),
  sort: z.number().int().min(0).max(1000),
});

export const quoteIdSchema = z.uuid();

export const pipelineItemSchema = z.object({
  id: z.uuid().nullable(),
  name: z.string().trim().min(1, "Add a project or client name.").max(140),
  kind: z.string().trim().min(1, "Add a project type.").max(80),
  stage: z.enum(stages),
  due_note: z.string().trim().max(160),
});
export type PipelineItemInput = z.infer<typeof pipelineItemSchema>;
