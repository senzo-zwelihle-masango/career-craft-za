"use server"

import { auth } from "@/lib/auth"
import prisma from "@/lib/prisma/db"
import { headers } from "next/headers"
import { revalidatePath } from "next/cache"
import { createPostSchema } from "@/schemas/community/post"

async function getUserId() {
  const session = await auth.api.getSession({ headers: await headers() })
  return session?.user?.id ?? null
}

export async function createPost(data: { title: string; body: string }) {
  const userId = await getUserId()
  if (!userId) return { error: "You must be signed in to create a post" }

  const parsed = createPostSchema.safeParse(data)
  if (!parsed.success) return { error: parsed.error.issues[0].message }

  const post = await prisma.communityPost.create({
    data: { title: parsed.data.title, body: parsed.data.body, userId },
  })

  revalidatePath("/community")
  return { data: JSON.parse(JSON.stringify(post)) }
}

export async function updatePost(postId: string, data: { title: string; body: string }) {
  const userId = await getUserId()
  if (!userId) return { error: "You must be signed in to update a post" }

  const post = await prisma.communityPost.findUnique({
    where: { id: postId },
    select: { userId: true },
  })

  if (!post) return { error: "Post not found" }
  if (post.userId !== userId) return { error: "You can only edit your own posts" }

  const parsed = createPostSchema.safeParse(data)
  if (!parsed.success) return { error: parsed.error.issues[0].message }

  const updated = await prisma.communityPost.update({
    where: { id: postId },
    data: { title: parsed.data.title, body: parsed.data.body },
  })

  revalidatePath("/community")
  revalidatePath(`/community/${postId}`)
  return { data: JSON.parse(JSON.stringify(updated)) }
}

export async function getPosts(sort: "newest" | "top" = "newest") {
  const userId = await getUserId()

  const posts = await prisma.communityPost.findMany({
    orderBy: sort === "top" ? { votes: { _count: "desc" } } : { createdAt: "desc" },
    select: {
      id: true,
      title: true,
      body: true,
      createdAt: true,
      updatedAt: true,
      userId: true,
      user: { select: { id: true, name: true, image: true } },
      _count: { select: { comments: true, votes: true } },
      ...(userId ? { votes: { where: { userId } } } : {}),
    },
  })

  return { data: JSON.parse(JSON.stringify(posts)) }
}

export async function getPost(postId: string) {
  const userId = await getUserId()

  const post = await prisma.communityPost.findUnique({
    where: { id: postId },
    select: {
      id: true,
      title: true,
      body: true,
      createdAt: true,
      updatedAt: true,
      userId: true,
      user: { select: { id: true, name: true, image: true } },
      _count: { select: { comments: true, votes: true } },
      ...(userId ? { votes: { where: { userId } } } : {}),
    },
  })

  if (!post) return { error: "Post not found" }
  return { data: JSON.parse(JSON.stringify(post)) }
}

export async function deletePost(postId: string) {
  const userId = await getUserId()
  if (!userId) return { error: "Unauthorized" }

  const post = await prisma.communityPost.findUnique({
    where: { id: postId },
    select: { userId: true },
  })

  if (!post) return { error: "Post not found" }
  if (post.userId !== userId) return { error: "You can only delete your own posts" }

  await prisma.communityPost.delete({ where: { id: postId } })

  revalidatePath("/community")
  return { data: true }
}
