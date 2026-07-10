import { z } from "zod"

export const banUserSchema = z.object({
  banReason: z
    .string()
    .min(5, "Ban reason must be at least 5 characters long."),
  banExpires: z.date().optional(),
})

export type BanUserSchemaType = z.infer<typeof banUserSchema>
