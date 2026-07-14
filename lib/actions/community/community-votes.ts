"use server"

import { auth } from "@/lib/auth"
import prisma from "@/lib/prisma/db"
import { headers } from "next/headers"
import { revalidatePath } from "next/cache"

async function getUserId() {
  const session = await auth.api.getSession({ headers: await headers() })
  return session?.user?.id ?? null
}

export async function vote(input: {
  postId?: string
  commentId?: string
  value: number
}) {
  const userId = await getUserId()
  if (!userId) return { error: "You must be signed in to vote" }
  if (input.value !== 1 && input.value !== -1) return { error: "Invalid vote value" }
  if (!input.postId && !input.commentId) return { error: "Missing target" }

  const existing = await prisma.communityVote.findFirst({
    where: {
      userId,
      postId: input.postId ?? null,
      commentId: input.commentId ?? null,
    },
  })

  if (existing) {
    if (existing.value === input.value) {
      await prisma.communityVote.delete({ where: { id: existing.id } })
    } else {
      await prisma.communityVote.update({
        where: { id: existing.id },
        data: { value: input.value },
      })
    }
  } else {
    await prisma.communityVote.create({
      data: {
        value: input.value,
        userId,
        postId: input.postId ?? null,
        commentId: input.commentId ?? null,
      },
    })
  }

  if (input.postId) revalidatePath(`/community/${input.postId}`)
  revalidatePath("/community")
  return { data: true }
}
