import { z } from "zod";

const optionalText = (max: number) =>
  z
    .string()
    .trim()
    .max(max)
    .transform((v) => (v === "" ? undefined : v))
    .optional();

export const quoteRequestSchema = z.object({
  email: z.email("Enter a valid email address.").max(254),
  name: optionalText(120),
  phone: z
    .string()
    .trim()
    .max(30)
    .regex(/^[+\d\s().-]*$/, "Use digits, spaces and + ( ) - only.")
    .transform((v) => (v === "" ? undefined : v))
    .optional(),
  kind: optionalText(40),
  message: optionalText(1000),
});
