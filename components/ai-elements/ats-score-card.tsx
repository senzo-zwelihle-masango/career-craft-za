"use client"

import { HugeiconsIcon } from "@hugeicons/react"
import {
  CheckmarkCircle01Icon,
  AlertCircleIcon,
  ArrowRight01Icon,
} from "@hugeicons/core-free-icons"
import { cn } from "@/lib/utils"

interface AtsResult {
  score: number
  matchedKeywords: string[]
  missingKeywords: string[]
  suggestions: string[]
}

export function AtsScoreCard({
  result,
  fallback,
}: {
  result: string
  fallback?: React.ReactNode
}) {
  let parsed: AtsResult | null = null
  try {
    const raw = result.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim()
    const obj = JSON.parse(raw)
    if (typeof obj.score === "number") {
      parsed = {
        score: obj.score,
        matchedKeywords: Array.isArray(obj.matchedKeywords)
          ? obj.matchedKeywords
          : [],
        missingKeywords: Array.isArray(obj.missingKeywords)
          ? obj.missingKeywords
          : [],
        suggestions: Array.isArray(obj.suggestions) ? obj.suggestions : [],
      }
    }
  } catch {}

  if (!parsed) return <>{fallback}</>

  const color =
    parsed.score >= 80
      ? "text-green-600"
      : parsed.score >= 50
        ? "text-amber-600"
        : "text-red-600"
  const barColor =
    parsed.score >= 80
      ? "bg-green-500"
      : parsed.score >= 50
        ? "bg-amber-500"
        : "bg-red-500"

  return (
    <div className="space-y-5">
      {/* Score */}
      <div className="space-y-2">
        <div className="flex items-baseline justify-between">
          <span className="text-sm font-medium">ATS Score</span>
          <span className={cn("text-2xl font-bold", color)}>
            {parsed.score}/100
          </span>
        </div>
        <div className="h-2.5 overflow-hidden rounded-full bg-muted">
          <div
            className={cn("h-full rounded-full transition-all", barColor)}
            style={{ width: `${parsed.score}%` }}
          />
        </div>
      </div>

      {/* Matched keywords */}
      {parsed.matchedKeywords.length > 0 && (
        <div className="space-y-1.5">
          <p className="flex items-center gap-1.5 text-xs font-medium text-green-600">
            <HugeiconsIcon icon={CheckmarkCircle01Icon} className="h-3.5 w-3.5" />
            Matched Keywords
          </p>
          <div className="flex flex-wrap gap-1.5">
            {parsed.matchedKeywords.map((kw) => (
              <span
                key={kw}
                className="rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-700 dark:bg-green-900/30 dark:text-green-400"
              >
                {kw}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Missing keywords */}
      {parsed.missingKeywords.length > 0 && (
        <div className="space-y-1.5">
          <p className="flex items-center gap-1.5 text-xs font-medium text-red-600">
            <HugeiconsIcon icon={AlertCircleIcon} className="h-3.5 w-3.5" />
            Missing Keywords
          </p>
          <div className="flex flex-wrap gap-1.5">
            {parsed.missingKeywords.map((kw) => (
              <span
                key={kw}
                className="rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-700 dark:bg-red-900/30 dark:text-red-400"
              >
                {kw}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Suggestions */}
      {parsed.suggestions.length > 0 && (
        <div className="space-y-1.5">
          <p className="text-xs font-medium text-muted-foreground">
            Suggestions
          </p>
          <ul className="space-y-1">
            {parsed.suggestions.map((s, i) => (
              <li
                key={i}
                className="flex items-start gap-2 text-xs text-muted-foreground"
              >
                <HugeiconsIcon
                  icon={ArrowRight01Icon}
                  className="mt-0.5 h-3 w-3 shrink-0"
                />
                <span>{s}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
