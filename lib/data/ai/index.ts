import { env } from "@/env/server"
import { createGoogleGenerativeAI } from "@ai-sdk/google"
import { generateText } from "ai"

const apiKey = env.AI_API_KEY || env.GOOGLE_GENERATIVE_AI_API_KEY

const google = createGoogleGenerativeAI({
  apiKey: apiKey || "",
})

export const FALLBACK_MODELS = [
  "gemini-2.0-flash",
  "gemini-2.5-flash",
]

export function getModel(modelName?: string) {
  return google(modelName || process.env.AI_MODEL || "gemini-2.0-flash")
}

export async function generateWithFallback(
  prompt: string,
  options?: { modelName?: string; system?: string },
) {
  if (!apiKey) {
    throw new Error(
      "AI is not configured. Set `AI_API_KEY` in `.env` to enable. " +
        "Get a free key at https://aistudio.google.com/app/apikey",
    )
  }

  const models = [
    options?.modelName || process.env.AI_MODEL || "gemini-2.0-flash",
    ...FALLBACK_MODELS.filter((m) => m !== (options?.modelName || process.env.AI_MODEL)),
  ]
  const seen = new Set<string>()
  const uniqueModels = models.filter((m) => {
    if (seen.has(m)) return false
    seen.add(m)
    return true
  })

  for (const modelName of uniqueModels) {
    try {
      const { text } = await generateText({
        model: getModel(modelName),
        prompt,
        ...(options?.system ? { system: options.system } : {}),
      })
      return text
    } catch (e) {
      const message = e instanceof Error ? e.message : "Unknown error"
      const isRateLimit =
        message.includes("429") ||
        message.includes("quota") ||
        message.includes("Too Many Requests")
      if (!isRateLimit || modelName === uniqueModels[uniqueModels.length - 1]) {
        throw e
      }
    }
  }
  throw new Error("AI request failed after trying all available models.")
}
