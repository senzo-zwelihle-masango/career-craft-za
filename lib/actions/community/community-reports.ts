"use server"

import { auth } from "@/lib/auth"
import prisma from "@/lib/prisma/db"
import { headers } from "next/headers"
import { revalidatePath } from "next/cache"
import { reportSchema } from "@/schemas/community/report"

async function getUserId() {
  const session = await auth.api.getSession({ headers: await headers() })
  return session?.user?.id ?? null
}

export async function reportContent(input: {
  reason: string
  description?: string
  postId?: string
  commentId?: string
}) {
  const userId = await getUserId()
  if (!userId) return { error: "You must be signed in to report" }
  if (!input.postId && !input.commentId) return { error: "Missing target" }

  const parsed = reportSchema.safeParse(input)
  if (!parsed.success) return { error: parsed.error.issues[0].message }

  await prisma.communityReport.create({
    data: {
      reason: parsed.data.reason,
      description: parsed.data.description ?? null,
      postId: input.postId ?? null,
      commentId: input.commentId ?? null,
      userId,
    },
  })

  revalidatePath("/community")
  return { data: true }
}
