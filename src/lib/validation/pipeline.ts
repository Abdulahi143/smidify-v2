import { z } from "zod";
import { PROCESS_STAGES } from "@/lib/content/process";

const stages = PROCESS_STAGES.map((s) => s.key) as [string, ...string[]];

export const moveStageSchema = z.object({
  id: z.uuid(),
  stage: z.enum(stages),
  sort: z.number().int().min(0).max(1000),
});

export const quoteIdSchema = z.uuid();
