"use server"

import { auth } from "@/lib/auth"
import prisma from "@/lib/prisma/db"
import { headers } from "next/headers"
import { revalidatePath } from "next/cache"

async function getUserId() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) return null
  return session.user.id
}

export async function submitFeedback(data: {
  type: "BUG_REPORT" | "FEATURE_REQUEST" | "GENERAL"
  title: string
  body: string
  rating?: number
}) {
  const userId = await getUserId()
  if (!userId) return { error: "Unauthorized" }

  const feedback = await prisma.feedback.create({
    data: {
      userId,
      type: data.type,
      title: data.title,
      body: data.body,
      rating: data.rating ?? null,
    },
  })

  revalidatePath("/feedback")
  return { data: JSON.parse(JSON.stringify(feedback)) }
}

export async function getFeedback() {
  const userId = await getUserId()
  if (!userId) return { error: "Unauthorized" }

  const feedback = await prisma.feedback.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  })

  return { data: JSON.parse(JSON.stringify(feedback)) }
}

export async function submitReview(data: {
  rating: number
  title: string
  body: string
}) {
  const userId = await getUserId()
  if (!userId) return { error: "Unauthorized" }

  const existing = await prisma.review.findFirst({ where: { userId } })
  if (existing) {
    return { error: "You have already submitted a review. Thank you!" }
  }

  const review = await prisma.review.create({
    data: {
      userId,
      rating: data.rating,
      title: data.title,
      body: data.body,
    },
  })

  revalidatePath("/feedback")
  return { data: JSON.parse(JSON.stringify(review)) }
}

export async function getMyReview() {
  const userId = await getUserId()
  if (!userId) return { error: "Unauthorized" }

  const review = await prisma.review.findFirst({ where: { userId } })
  if (!review) return { data: null }
  return { data: JSON.parse(JSON.stringify(review)) }
}
