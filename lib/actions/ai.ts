"use server"

import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { generateWithFallback } from "@/lib/data/ai/index"
import { PLAN_CREDITS } from "@/lib/billing/plans"
import prisma from "../prisma/db"

async function checkCredits(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { plan: true, aiCredits: true, role: true },
  })
  if (!user) return { error: "User not found", ok: false }
  if (user.role === "admin") return { ok: true, plan: user.plan, aiCredits: user.aiCredits, role: user.role }

  const initial = PLAN_CREDITS[user.plan] ?? 0
  if (user.aiCredits <= 0 && initial <= 0) {
    return { error: "Out of AI credits. Upgrade your plan to get more.", ok: false }
  }
  return { ok: true, plan: user.plan, aiCredits: user.aiCredits, role: user.role }
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

export async function getAiSuggestion(tool: string, input: string, context?: string) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) return { error: "Unauthorized" }

  const creditCheck = await checkCredits(session.user.id)
  if (creditCheck.error) return { error: creditCheck.error }

  if (!process.env.AI_API_KEY) {
    return {
      data: {
        result: 'AI is not configured. Set `AI_API_KEY` in `.env` to enable. Get a free key at https://aistudio.google.com/app/apikey (Google Gemini — generous free tier).\n\n• Led cross-functional team to deliver product ahead of schedule\n• Implemented automated testing, reducing bugs by 40%\n• Designed scalable architecture serving 1M+ users',
        remaining: creditCheck.aiCredits,
      },
    }
  }

  const prompts: Record<string, string> = {
    improve: `You are an expert CV writer. Rewrite the following CV bullet point to be more impactful and achievement-oriented. Use strong action verbs and include metrics where possible. Return ONLY the rewritten bullet point, no explanations:\n\n${input}`,
    summary: `You are a professional CV writer. Write a compelling professional summary (3-4 sentences) based on the following information. Use active voice and highlight key achievements:\n\n${input}`,
    skills: `Suggest 8-10 relevant skills for the following job title. Consider both hard skills and soft skills. Return them as a comma-separated list, no numbering:\n\n${input}`,
    grammar: `Review the following text for grammar, spelling, and style issues. Return ONLY the corrected version with the changes applied. Do NOT include explanations or markdown formatting:\n\n${input}`,
    ats: `You are an ATS (Applicant Tracking System) CV analyzer. Compare the following CV against the job description. Return a JSON object with:
- "score": a number 0-100
- "matchedKeywords": array of keywords that match
- "missingKeywords": array of important keywords from the job description missing in the CV
- "suggestions": array of specific improvement suggestions

RESUME:
${context || input}

JOB DESCRIPTION:
${input}`,
  }

  try {
    const text = await generateWithFallback(prompts[tool] || prompts.improve)

    await deductCredit(session.user.id)
    const remaining =
      creditCheck.role === "admin"
        ? undefined
        : (creditCheck.aiCredits ?? PLAN_CREDITS[creditCheck.plan ?? "FREE"] ?? 0) - 1
    return { data: { result: text || "No response generated.", remaining } }
  } catch (e) {
    const message = e instanceof Error ? e.message : "Unknown error"
    console.error("[AI] getAiSuggestion error:", message)
    return { error: message.includes("429") || message.includes("quota") ? "AI rate limit reached. Please wait a moment and try again." : `AI request failed: ${message}` }
  }
}
