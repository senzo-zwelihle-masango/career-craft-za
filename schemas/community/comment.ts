import { z } from "zod"

export const createCommentSchema = z.object({
  body: z.string().min(1, "Comment cannot be empty").max(2000),
  parentId: z.string().optional(),
})

export type CreateCommentSchemaType = z.infer<typeof createCommentSchema>
