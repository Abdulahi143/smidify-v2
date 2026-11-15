import { z } from "zod";

export const studioSettingsSchema = z.object({
  contactEmail: z.email("Enter a valid contact email.").max(254),
  metaTitle: z.string().trim().min(1, "Add a website title.").max(160),
  metaDescription: z.string().trim().max(500),
  footerTagline: z.string().trim().max(500),
});
export const passwordSchema = z
  .object({
    password: z.string().min(12, "Use at least 12 characters.").max(200),
    confirmation: z.string().max(200),
  })
  .refine((value) => value.password === value.confirmation, {
    path: ["confirmation"],
    message: "The passwords do not match.",
  });

export const mediaFolderSchema = z
  .string()
  .max(250)
  .refine(
    (value) =>
      value === "" ||
      value.split("/").every((part) => /^[a-zA-Z0-9_-]+$/.test(part)),
    "Choose a valid media folder.",
  );
export const mediaObjectSchema = z
  .string()
  .min(1)
  .max(400)
  .refine(
    (value) =>
      value
        .split("/")
        .every(
          (part) =>
            /^[a-zA-Z0-9_.-]+$/.test(part) && part !== "." && part !== "..",
        ),
    "Choose a valid media file.",
  );
export type StudioSettingsInput = z.infer<typeof studioSettingsSchema>;
