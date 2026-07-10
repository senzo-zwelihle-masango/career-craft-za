"use server"

import { auth } from "@/lib/auth"
import prisma from "@/lib/prisma/db"
import { headers } from "next/headers"
import { revalidatePath } from "next/cache"

async function requireAdmin() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user || session.user.role !== "admin") {
    throw new Error("Unauthorized")
  }
  return session.user
}

export async function getAllFeedback() {
  await requireAdmin()

  const feedback = await prisma.feedback.findMany({
    include: { user: { select: { name: true, email: true, image: true } } },
    orderBy: { createdAt: "desc" },
  })

  return JSON.parse(JSON.stringify(feedback))
}

export async function updateFeedbackStatus(
  id: string,
  status: "PENDING" | "REVIEWED" | "RESOLVED"
) {
  await requireAdmin()

  await prisma.feedback.update({ where: { id }, data: { status } })

  revalidatePath("/admin/feedback")
  return { success: true }
}

export async function getAllReviews() {
  await requireAdmin()

  const reviews = await prisma.review.findMany({
    include: { user: { select: { name: true, email: true, image: true } } },
    orderBy: { createdAt: "desc" },
  })

  return JSON.parse(JSON.stringify(reviews))
}
