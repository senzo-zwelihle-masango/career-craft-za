import { z } from "zod"

export const REPORT_REASONS = [
  "spam",
  "harassment",
  "misinformation",
  "inappropriate",
  "other",
] as const

export const reportSchema = z.object({
  reason: z.enum(REPORT_REASONS),
  description: z.string().max(500).optional(),
})

export type ReportSchemaType = z.infer<typeof reportSchema>
