import { streamText } from "ai"

import { auth } from "@/lib/auth"

import { headers } from "next/headers"
import { PLAN_CREDITS } from "@/lib/billing/plans"
import { FALLBACK_MODELS, getModel } from "@/lib/data/ai"
import prisma from "@/lib/prisma/db"

const PROMPTS: Record<string, string> = {
  improve:
    "You are an expert CV writer. Rewrite the following CV bullet point to be more impactful and achievement-oriented. Use strong action verbs and include metrics where possible. Return ONLY the rewritten bullet point, no explanations:\n\n",
  summary:
    "You are a professional CV writer. Write a compelling professional summary (3-4 sentences) based on the following information. Use active voice and highlight key achievements:\n\n",
  skills:
    "Suggest 8-10 relevant skills for the following job title. Consider both hard skills and soft skills. Return them as a comma-separated list, no numbering:\n\n",
  grammar:
    "Review the following text for grammar, spelling, and style issues. Return ONLY the corrected version with the changes applied. Do NOT include explanations or markdown formatting:\n\n",
  ats: `You are an ATS (Applicant Tracking System) CV analyzer. Compare the following CV against the job description. Return a JSON object with:
- "score": a number 0-100
- "matchedKeywords": array of keywords that match
- "missingKeywords": array of important keywords from the job description missing in the CV
- "suggestions": array of specific improvement suggestions

RESUME:
`,
}

function isRateLimit(e: unknown): boolean {
  const msg = e instanceof Error ? e.message : String(e)
  return msg.includes("429") || msg.includes("quota") || msg.includes("Too Many Requests") || msg.includes("RESOURCE_EXHAUSTED")
}

function buildModelList(requested?: string): string[] {
  const primary = requested || process.env.AI_MODEL || "gemini-2.0-flash"
  const seen = new Set<string>()
  const list: string[] = []
  for (const m of [primary, ...FALLBACK_MODELS]) {
    if (!seen.has(m)) { seen.add(m); list.push(m) }
  }
  return list
}

export async function POST(req: Request) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { tool, input, context, modelName } = await req.json()
  if (!tool || !input?.trim()) {
    return Response.json({ error: "Missing tool or input" }, { status: 400 })
  }

  const promptBase = PROMPTS[tool]
  if (!promptBase) {
    return Response.json({ error: `Unknown tool: ${tool}` }, { status: 400 })
  }

  const fullPrompt = tool === "ats"
    ? `${promptBase}${context || input}\n\nJOB DESCRIPTION:\n${input}`
    : `${promptBase}${input}`

  const models = buildModelList(modelName)
  let lastError: unknown

  for (const m of models) {
    try {
      const result = streamText({ model: getModel(m), prompt: fullPrompt })

      // Deduct credit (fire-and-forget, don't block the stream)
      if (session.user.role !== "admin") {
        prisma.user
          .findUnique({ where: { id: session.user.id }, select: { plan: true, aiCredits: true } })
          .then((user) => {
            if (!user) return
            const initial = PLAN_CREDITS[user.plan] ?? 0
            if (user.aiCredits <= 0) {
              return prisma.user.update({ where: { id: session.user.id }, data: { aiCredits: initial - 1 } })
            }
            return prisma.user.update({ where: { id: session.user.id }, data: { aiCredits: { decrement: 1 } } })
          })
          .catch(() => {})
      }

      const encoder = new TextEncoder()
      const stream = new ReadableStream({
        async start(controller) {
          try {
            for await (const chunk of result.textStream) {
              controller.enqueue(encoder.encode(chunk))
            }
            controller.close()
          } catch (e) {
            controller.error(e)
          }
        },
      })

      return new Response(stream, {
        headers: { "Content-Type": "text/plain; charset=utf-8" },
      })
    } catch (e) {
      lastError = e
      if (!isRateLimit(e) || m === models[models.length - 1]) break
    }
  }

  const msg = lastError instanceof Error ? lastError.message : String(lastError)
  console.error("[AI] stream error:", msg)
  return Response.json({ error: msg }, { status: 429 })
}
