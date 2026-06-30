"use server"

import { auth } from "@/lib/auth"
import prisma from "../prisma/db"
import { headers } from "next/headers"
import { revalidatePath } from "next/cache"

import { PLAN_CREDITS } from "@/lib/billing/plans"
import { generateWithFallback } from "../data/ai"

export async function getCoverLetters() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) return { error: "Unauthorized" }

  const letters = await prisma.coverLetter.findMany({
    where: { userId: session.user.id },
    orderBy: { updatedAt: "desc" },
  })
  return { data: JSON.parse(JSON.stringify(letters)) }
}

export async function createCoverLetter() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) return { error: "Unauthorized" }

  const [existingCount, user] = await Promise.all([
    prisma.coverLetter.count({ where: { userId: session.user.id } }),
    prisma.user.findUnique({
      where: { id: session.user.id },
      select: { plan: true, role: true },
    }),
  ])

  const { MAX_COVER_LETTERS } = await import("@/lib/billing/plans")
  const limit = MAX_COVER_LETTERS[user?.plan ?? "FREE"] ?? Infinity

  if (user?.role !== "admin" && existingCount >= limit) {
    return { error: `Cover letter limit reached. Your plan allows ${limit === Infinity ? "unlimited" : limit} cover letter${limit === 1 ? "" : "s"}. Upgrade to create more.` }
  }

  const letter = await prisma.coverLetter.create({
    data: { userId: session.user.id },
  })

  revalidatePath("/cover-letters")
  return { data: letter }
}

export async function getCoverLetter(id: string) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) return { error: "Unauthorized" }

  const letter = await prisma.coverLetter.findFirst({
    where: { id, userId: session.user.id },
  })
  if (!letter) return { error: "Not found" }
  return { data: letter }
}

export async function updateCoverLetter(id: string, data: Record<string, unknown>) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) return { error: "Unauthorized" }

  const letter = await prisma.coverLetter.findFirst({
    where: { id, userId: session.user.id },
  })
  if (!letter) return { error: "Not found" }

  const updated = await prisma.coverLetter.update({
    where: { id },
    data: data as never,
  })
  return { data: updated }
}

export async function deleteCoverLetter(id: string) {
  try {
    const session = await auth.api.getSession({ headers: await headers() })
    if (!session?.user) return { error: "Unauthorized" }

    const letter = await prisma.coverLetter.findFirst({
      where: { id, userId: session.user.id },
    })
    if (!letter) return { error: "Not found" }

    await prisma.coverLetter.delete({ where: { id } })
    return { success: true }
  } catch {
    return { error: "Failed to delete cover letter" }
  }
}

async function checkCredit(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { plan: true, aiCredits: true, role: true },
  })
  if (!user) return { error: "User not found", ok: false }
  if (user.role === "admin") return { ok: true, plan: user.plan, aiCredits: user.aiCredits }

  const initial = PLAN_CREDITS[user.plan] ?? 0
  if (user.aiCredits <= 0 && initial <= 0) {
    return { error: "Out of AI credits. Upgrade your plan to get more.", ok: false }
  }
  return { ok: true, plan: user.plan, aiCredits: user.aiCredits }
}

async function deductCredit(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { plan: true, aiCredits: true, role: true },
  })
  if (!user || user.role === "admin") return

  const initial = PLAN_CREDITS[user.plan] ?? 0
  if (user.aiCredits <= 0) {
    await prisma.user.update({
      where: { id: userId },
      data: { aiCredits: initial - 1 },
    })
  } else {
    await prisma.user.update({
      where: { id: userId },
      data: { aiCredits: { decrement: 1 } },
    })
  }
}

export async function generateCoverLetter(cvId: string, companyName: string, recipientName: string) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) return { error: "Unauthorized" }

  const creditCheck = await checkCredit(session.user.id)
  if (creditCheck.error) return { error: creditCheck.error }

  const resume = await prisma.curriculumVitae.findFirst({
    where: { id: cvId, userId: session.user.id },
    include: {
      personalDetails: true,
      sections: {
        include: {
          experienceEntries: true,
          educationEntries: true,
          projectEntries: true,
          skillGroups: true,
          certificationEntries: true,
          languageEntries: true,
          awardEntries: true,
          referenceEntries: true,
          customEntries: true,
        },
      },
    },
  })
  if (!resume) return { error: "CV not found" }

  const pd = resume.personalDetails
  const summary = resume.sections.find((s) => s.type === "SUMMARY")?.content || ""
  const skills = resume.sections.flatMap((s) => s.skillGroups.flatMap((g) => g.skills)).join(", ")
  const experience = resume.sections
    .flatMap((s) => s.experienceEntries)
    .map((e) => `- ${e.role} at ${e.company} (${e.startDate}-${e.endDate || "Present"}): ${e.bullets?.join("; ")}`)
    .join("\n")

  if (!process.env.AI_API_KEY) {
    return {
      data: `Dear ${recipientName || "Hiring Manager"},

I am writing to express my sincere interest in the position at ${companyName}. With my background in ${skills || "various professional fields"}, I am confident that my skills and experience make me a strong candidate.

${summary || "Throughout my career, I have developed a track record of delivering results and driving success."}

${experience ? `My professional experience includes:\n${experience}` : ""}

I would welcome the opportunity to discuss how my qualifications align with the needs of ${companyName}. Thank you for your time and consideration.

Best regards,
${pd?.fullName || session.user.name || ""}`,
    }
  }

  try {
    const text = await generateWithFallback(
      `Write a professional cover letter for ${recipientName || "Hiring Manager"} at ${companyName}. 

CV context:
- Name: ${pd?.fullName || "Applicant"}
- Summary: ${summary || "N/A"}
- Skills: ${skills || "N/A"}
- Experience:
${experience || "N/A"}

The cover letter should be professional, concise, and highlight relevant experience. Use the applicant's name as signature.`,
    )

    await deductCredit(session.user.id)
    return { data: text }
  } catch (e) {
    const message = e instanceof Error ? e.message : "Unknown error"
    console.error("[AI] generateCoverLetter error:", message)
    return { error: message.includes("429") || message.includes("quota") ? "AI rate limit reached. Please wait a moment and try again." : `AI request failed: ${message}` }
  }
}
