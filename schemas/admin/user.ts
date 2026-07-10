import { z } from "zod"
import { Role } from "@/lib/generated/prisma/enums"

export const createUserSchema = z.object({
  name: z.string().min(1, "Name is required, please enter a valid name"),
  email: z.email("Invalid email address, please enter a valid email address"),
  role: z.enum(Role),
  image: z.string().optional(),
})

export const editUserSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.email("Invalid email address"),
  role: z.enum(Role),
  image: z.string(),
})

export type CreateUserSchemaType = z.infer<typeof createUserSchema>
export type EditUserSchemaType = z.infer<typeof editUserSchema>
