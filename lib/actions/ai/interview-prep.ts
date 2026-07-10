"use server"

import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import prisma from "@/lib/prisma/db"
import type { InterviewPrep } from "@/lib/generated/prisma/client"

export type PrepRecord = InterviewPrep

interface PrepQuestion {
  question: string
  type: "behavioral" | "technical" | "situational" | "general"
  keyPoints: string[]
  sampleAnswer: string
}

interface PrepResult {
  questions: PrepQuestion[]
  tips: string[]
  topicsToReview: string[]
}

export async function savePrepResult(params: {
  jobId?: string
  jobTitle: string
  company?: string
  questions: PrepQuestion[]
  tips: string[]
  topicsToReview: string[]
  customNotes?: string
}) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) return { error: "Unauthorized" }

  const prep = await prisma.interviewPrep.create({
    data: {
      userId: session.user.id,
      jobId: params.jobId || null,
      jobTitle: params.jobTitle,
      company: params.company || null,
      questions: JSON.parse(JSON.stringify(params.questions)),
      tips: params.tips,
      topicsToReview: params.topicsToReview,
      customNotes: params.customNotes || null,
    },
  })

  return { data: prep }
}

export async function getPrepResults(jobId?: string) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) return { error: "Unauthorized" }

  const where: Record<string, unknown> = { userId: session.user.id }
  if (jobId) where.jobId = jobId

  const results = await prisma.interviewPrep.findMany({
    where: where as { userId: string; jobId?: string },
    orderBy: { createdAt: "desc" },
  })

  return { data: results }
}

export async function deletePrepResult(id: string) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) return { error: "Unauthorized" }

  await prisma.interviewPrep.deleteMany({
    where: { id, userId: session.user.id },
  })

  return { data: { deleted: true } }
}
