"use server"

import { auth } from "@/lib/auth"
import prisma from "@/lib/prisma/db"
import { headers } from "next/headers"
import { revalidatePath } from "next/cache"
import { generateWithFallback } from "@/lib/data/ai"
import { checkCredits, deductCredit } from "@/lib/actions/ai/credits"

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

  const { MAX_COVER_LETTERS } = await import("@/lib/data/user/plans")
  const limit = MAX_COVER_LETTERS[user?.plan ?? "FREE"] ?? Infinity

  if (user?.role !== "admin" && existingCount >= limit) {
    return {
      error: `Cover letter limit reached. Your plan allows ${limit === Infinity ? "unlimited" : limit} cover letter${limit === 1 ? "" : "s"}. Upgrade to create more.`,
    }
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

export async function updateCoverLetter(
  id: string,
  data: Record<string, unknown>
) {
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

export async function generateCoverLetter(
  cvId: string,
  companyName: string,
  recipientName: string,
  sender?: {
    fullName?: string
    professionalTitle?: string
    email?: string
    phone?: string
    location?: string
    date?: string
  }
) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) return { error: "Unauthorized" }

  const creditCheck = await checkCredits(session.user.id)
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
  const summary =
    resume.sections.find((s) => s.type === "SUMMARY")?.content || ""
  const skills = resume.sections
    .flatMap((s) => s.skillGroups.flatMap((g) => g.skills))
    .join(", ")
  const experience = resume.sections
    .flatMap((s) => s.experienceEntries)
    .map(
      (e) =>
        `- ${e.role} at ${e.company} (${e.startDate}-${e.endDate || "Present"}): ${e.bullets?.join("; ")}`
    )
    .join("\n")

  if (!process.env.AI_API_KEY) {
    return {
      data: `${sender?.date || new Date().toLocaleDateString("en-ZA", { year: "numeric", month: "long", day: "numeric" })}

${recipientName || "Hiring Manager"}
${companyName}

Dear ${recipientName || "Hiring Manager"},

I am writing to express my sincere interest in the position at ${companyName}. With my background in ${skills || "various professional fields"}, I am confident that my skills and experience make me a strong candidate.

${summary || "Throughout my career, I have developed a track record of delivering results and driving success."}

${experience ? `My professional experience includes:\n${experience}` : ""}

I would welcome the opportunity to discuss how my qualifications align with the needs of ${companyName}. Thank you for your time and consideration.

Best regards,
${sender?.fullName || pd?.fullName || session.user.name || ""}
${sender?.professionalTitle || ""}
${sender?.email || ""}
${sender?.phone || ""}
${sender?.location || ""}`,
    }
  }

  try {
    const text = await generateWithFallback(
      `Write a professional cover letter for ${recipientName || "Hiring Manager"} at ${companyName}.

Use these actual sender details — do NOT use placeholders like [Your Name]:
- Full name: ${sender?.fullName || pd?.fullName || "Applicant"}
${sender?.professionalTitle ? `- Job title: ${sender.professionalTitle}` : ""}
${sender?.email ? `- Email: ${sender.email}` : ""}
${sender?.phone ? `- Phone: ${sender.phone}` : ""}
${sender?.location ? `- Location: ${sender.location}` : ""}
${sender?.date ? `- Date: ${sender.date}` : ""}

CV context:
- Summary: ${summary || "N/A"}
- Skills: ${skills || "N/A"}
- Experience:
${experience || "N/A"}

Include the date at the top. Use the sender's actual full name for the signature. Do NOT include bracketed placeholders. The cover letter should be professional, concise, and highlight relevant experience.`
    )

    await deductCredit(session.user.id)
    return { data: text }
  } catch (e) {
    const message = e instanceof Error ? e.message : "Unknown error"
    console.error("[AI] generateCoverLetter error:", message)
    return {
      error:
        message.includes("429") || message.includes("quota")
          ? "AI rate limit reached. Please wait a moment and try again."
          : `AI request failed: ${message}`,
    }
  }
}
