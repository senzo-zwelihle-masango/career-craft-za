"use server"

import { auth } from "@/lib/auth"
import prisma from "@/lib/prisma/db"
import { headers } from "next/headers"
import { revalidatePath } from "next/cache"
import { createCommentSchema } from "@/schemas/community/comment"

async function getUserId() {
  const session = await auth.api.getSession({ headers: await headers() })
  return session?.user?.id ?? null
}

export async function createComment(data: {
  body: string
  postId: string
  parentId?: string
}) {
  const userId = await getUserId()
  if (!userId) return { error: "You must be signed in to comment" }

  const parsed = createCommentSchema.safeParse(data)
  if (!parsed.success) return { error: parsed.error.issues[0].message }

  const comment = await prisma.communityComment.create({
    data: {
      body: parsed.data.body,
      postId: data.postId,
      userId,
      parentId: parsed.data.parentId ?? null,
    },
  })

  revalidatePath(`/community/${data.postId}`)
  return { data: JSON.parse(JSON.stringify(comment)) }
}

export async function getComments(postId: string) {
  const userId = await getUserId()

  const comments = await prisma.communityComment.findMany({
    where: { postId, parentId: null },
    orderBy: { createdAt: "asc" },
    include: {
      user: { select: { id: true, name: true, image: true } },
      replies: {
        orderBy: { createdAt: "asc" },
        include: {
          user: { select: { id: true, name: true, image: true } },
          ...(userId ? { votes: { where: { userId } } } : {}),
          _count: { select: { votes: true } },
        },
      },
      ...(userId ? { votes: { where: { userId } } } : {}),
      _count: { select: { votes: true } },
    },
  })

  return { data: JSON.parse(JSON.stringify(comments)) }
}

export async function deleteComment(commentId: string) {
  const userId = await getUserId()
  if (!userId) return { error: "Unauthorized" }

  const comment = await prisma.communityComment.findUnique({
    where: { id: commentId },
    select: { userId: true, postId: true },
  })

  if (!comment) return { error: "Comment not found" }
  if (comment.userId !== userId)
    return { error: "You can only delete your own comments" }

  await prisma.communityComment.delete({ where: { id: commentId } })

  revalidatePath(`/community/${comment.postId}`)
  return { data: true }
}
