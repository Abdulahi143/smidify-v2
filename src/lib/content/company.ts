import { z } from "zod";
import defaults from "./company-defaults.json";
export const companyKeys = Object.keys(defaults.copy);
export const companySchema = z
  .object({
    copy: z
      .record(z.string(), z.string().max(5000))
      .superRefine((copy, ctx) => {
        if (
          Object.keys(copy).length !== companyKeys.length ||
          companyKeys.some((key) => !(key in copy))
        )
          ctx.addIssue({
            code: "custom",
            message: "Website fields do not match.",
          });
        if (!z.email().safeParse(copy.contactEmail).success)
          ctx.addIssue({
            code: "custom",
            message: "Enter a valid contact email.",
          });
        if (!copy.heroTitle?.trim() || !copy.metaTitle?.trim())
          ctx.addIssue({
            code: "custom",
            message: "Headline and page title are required.",
          });
      }),
    milestones: z
      .array(
        z.object({
          id: z.string().min(1).max(80),
          title: z.string().trim().min(1).max(160),
          date: z.string().max(160),
          description: z.string().max(5000),
        }),
      )
      .max(60),
  })
  .strict()
  .superRefine((v, ctx) => {
    if (new Set(v.milestones.map((m) => m.id)).size !== v.milestones.length)
      ctx.addIssue({
        code: "custom",
        message: "Milestone IDs must be unique.",
      });
  });
export type CompanyContent = z.infer<typeof companySchema>;
export const defaultCompanyContent: CompanyContent = defaults;
