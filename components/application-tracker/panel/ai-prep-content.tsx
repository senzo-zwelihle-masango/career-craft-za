"use client"

import { useState, useRef, useEffect } from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  ArtificialIntelligence01Icon,
  Loading03Icon,
  Copy01Icon,
  BrainIcon,
  Clock01Icon,
  Delete03Icon,
  HistoryIcon,
} from "@hugeicons/core-free-icons"
import { toast } from "sonner"
import type { JobWithRelations } from "@/lib/data/application-tracker/data"
import { INTERVIEW_ROUND_LABELS } from "@/lib/data/application-tracker/data"
import { getAiSuggestion } from "@/lib/actions/ai/ai"
import {
  savePrepResult,
  getPrepResults,
  deletePrepResult,
} from "@/lib/actions/ai/interview-prep"
import type { PrepRecord } from "@/lib/actions/ai/interview-prep"
import {
  Reasoning,
  ReasoningTrigger,
  ReasoningContent,
} from "@/components/ai-elements/reasoning"
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"

interface PrepQuestion {
  question: string
  type: "behavioral" | "technical" | "situational" | "general"
  keyPoints: string[]
  sampleAnswer: string
}

function buildContext(job: JobWithRelations): string {
  const parts = [
    `Job Title: ${job.title}`,
    `Company: ${job.company}`,
    `Description: ${job.description || "N/A"}`,
    `Skills: ${(job.skills || []).join(", ")}`,
    `Employment Type: ${job.employmentType || "N/A"}`,
    `Work Model: ${job.workModel || "N/A"}`,
  ]
  if (job.interviews.length > 0) {
    parts.push("")
    parts.push("SCHEDULED INTERVIEWS:")
    job.interviews.forEach((iv) => {
      parts.push(
        `- Round: ${INTERVIEW_ROUND_LABELS[iv.round] || iv.round}${iv.title ? ` (${iv.title})` : ""} | Type: ${iv.type} | Duration: ${iv.durationMinutes || "?"} min | ${iv.completed ? "Completed" : "Upcoming"}`
      )
    })
  }
  return parts.join("\n")
}

const TYPE_COLORS: Record<string, string> = {
  behavioral:
    "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
  technical:
    "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300",
  situational:
    "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300",
  general:
    "bg-slate-100 text-slate-700 dark:bg-slate-800/50 dark:text-slate-300",
}

async function copyText(text: string) {
  try {
    await navigator.clipboard.writeText(text)
    toast.success("Copied to clipboard")
  } catch {
    toast.error("Failed to copy")
  }
}

function formatDate(ts: Date) {
  return new Date(ts).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

function parseQuestions(data: unknown): PrepQuestion[] {
  if (!data || !Array.isArray(data)) return []
  return data as PrepQuestion[]
}

function parseStringArray(data: unknown): string[] {
  if (!data || !Array.isArray(data)) return []
  return data.filter((s): s is string => typeof s === "string")
}

export function AiPrepContent({
  job,
  onUpdate: _onUpdate,
}: {
  job: JobWithRelations
  onUpdate?: () => void
}) {
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [dbRecords, setDbRecords] = useState<PrepRecord[]>([])
  const [selectedRecordId, setSelectedRecordId] = useState<string | null>(null)
  const [customNotes, setCustomNotes] = useState("")
  const [errorRaw, setErrorRaw] = useState<string | null>(null)
  const loadingRef = useRef(false)

  const jobId = job.id !== "manual" ? job.id : undefined

  useEffect(() => {
    getPrepResults(jobId).then((res) => {
      if (res.data) {
        setDbRecords(res.data)
        if (res.data.length > 0) {
          setSelectedRecordId(res.data[0].id)
        }
      }
    })
  }, [job.id])

  const selectedRecord =
    dbRecords.find((r) => r.id === selectedRecordId) ?? null

  const currentQuestions = selectedRecord
    ? parseQuestions(selectedRecord.questions)
    : []
  const currentTips = selectedRecord
    ? parseStringArray(selectedRecord.tips)
    : []
  const currentTopics = selectedRecord
    ? parseStringArray(selectedRecord.topicsToReview)
    : []

  async function handleGenerate() {
    if (loadingRef.current) return
    loadingRef.current = true
    setLoading(true)
    setErrorRaw(null)

    const context = buildContext(job)
    const input = customNotes.trim()
      ? `Additional notes from the candidate:\n${customNotes}`
      : ""

    const res = await getAiSuggestion("interview-prep", input, context)
    loadingRef.current = false
    setLoading(false)

    if (res.error) {
      toast.error(res.error)
      return
    }

    const text = res.data?.result
    if (!text) {
      toast.error("No response from AI")
      return
    }

    const cleaned = text.replace(/```(?:json)?\s*\n?/g, "").trim()

    let parsed: {
      questions: PrepQuestion[]
      tips: string[]
      topicsToReview: string[]
    }
    try {
      const p = JSON.parse(cleaned)
      if (!p.questions || !Array.isArray(p.questions)) {
        setErrorRaw(cleaned)
        toast.error("Unexpected response format")
        return
      }
      parsed = p
    } catch {
      setErrorRaw(cleaned)
      toast.error("Failed to parse AI response")
      return
    }

    setSaving(true)
    const saveRes = await savePrepResult({
      jobId,
      jobTitle: job.title,
      company: job.company,
      questions: parsed.questions,
      tips: parsed.tips || [],
      topicsToReview: parsed.topicsToReview || [],
      customNotes: customNotes.trim() || undefined,
    })
    setSaving(false)

    if (saveRes.data) {
      setDbRecords((prev) => [saveRes.data!, ...prev])
      setSelectedRecordId(saveRes.data!.id)
      setCustomNotes("")
      toast.success("Interview prep saved")
    } else {
      toast.error("Failed to save prep")
    }
  }

  async function handleDelete(id: string) {
    const res = await deletePrepResult(id)
    if (res.data) {
      setDbRecords((prev) => prev.filter((r) => r.id !== id))
      if (selectedRecordId === id) {
        setSelectedRecordId(null)
      }
      toast.success("Prep session deleted")
    }
  }

  function copyFullResult() {
    if (!selectedRecord) return
    const text = currentQuestions
      .map(
        (q, i) =>
          `${i + 1}. [${q.type}] ${q.question}\n   Key Points: ${q.keyPoints.join(", ")}\n   Sample Answer: ${q.sampleAnswer}`
      )
      .join("\n\n")
    copyText(text)
  }

  async function copyQuestion(q: PrepQuestion, _index: number) {
    const text = `[${q.type}] ${q.question}\n\nKey Points:\n${q.keyPoints.map((kp) => `  - ${kp}`).join("\n")}\n\nSample Answer:\n${q.sampleAnswer}`
    await copyText(text)
  }

  const hasResults = selectedRecord !== null
  const showEmptyState = !loading && !hasResults && !errorRaw
  const isGenerating = loading || saving

  return (
    <div className="space-y-5">
      {/* ── Context header ── */}
      <div className="rounded-lg border bg-card p-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base leading-tight font-semibold">
              {job.title}
            </h3>
            <p className="mt-0.5 text-sm text-muted-foreground">
              {job.company}
              {job.interviews.length > 0 && (
                <span className="ml-2 text-xs text-muted-foreground/60">
                  &middot; {job.interviews.filter((i) => !i.completed).length}{" "}
                  upcoming interview(s)
                </span>
              )}
            </p>
          </div>
          <Button variant="outline" size="sm" onClick={handleGenerate}>
            <HugeiconsIcon
              icon={isGenerating ? Loading03Icon : ArtificialIntelligence01Icon}
              className={isGenerating ? "size-3.5 animate-spin" : "size-3.5"}
            />
            {isGenerating ? "Generating..." : "Generate"}
          </Button>
        </div>
      </div>

      {/* ── Notes + history header ── */}
      <div className="space-y-3">
        <Textarea
          value={customNotes}
          onChange={(e) => setCustomNotes(e.target.value)}
          placeholder="Optional: add specific topics, concerns, or areas to focus on..."
          rows={2}
          className="resize-none"
        />

        {dbRecords.length > 0 && (
          <div className="flex flex-wrap items-center gap-2">
            <HugeiconsIcon
              icon={HistoryIcon}
              className="size-3 text-muted-foreground/50"
            />
            <span className="text-[11px] text-muted-foreground/60">
              {dbRecords.length} session{dbRecords.length > 1 ? "s" : ""}
            </span>
            <div className="flex flex-wrap gap-1">
              {dbRecords.map((rec) => (
                <Button
                  key={rec.id}
                  variant={rec.id === selectedRecordId ? "secondary" : "ghost"}
                  size="xs"
                  onClick={() => setSelectedRecordId(rec.id)}
                >
                  <HugeiconsIcon icon={Clock01Icon} className="size-2.5" />
                  {formatDate(rec.createdAt)}
                </Button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ── Loading state ── */}
      <Reasoning isStreaming={isGenerating}>
        <ReasoningTrigger />
        <ReasoningContent>{""}</ReasoningContent>
      </Reasoning>

      {/* ── Error state ── */}
      {errorRaw && !isGenerating && (
        <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-3">
          <p className="mb-2 text-xs font-medium text-destructive">
            Failed to parse AI response. Raw output:
          </p>
          <pre className="max-h-48 overflow-auto text-xs break-all whitespace-pre-wrap text-muted-foreground">
            {errorRaw}
          </pre>
        </div>
      )}

      {/* ── Results ── */}
      {hasResults && (
        <div className="space-y-5">
          {/* Questions */}
          {currentQuestions.length > 0 && (
            <div>
              <div className="mb-2 flex items-center justify-between">
                <h4 className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                  Practice Questions ({currentQuestions.length})
                </h4>
                <Button variant="ghost" size="xs" onClick={copyFullResult}>
                  <HugeiconsIcon icon={Copy01Icon} className="size-3" />
                  Copy all
                </Button>
              </div>

              <Accordion>
                {currentQuestions.map((q, i) => (
                  <AccordionItem key={i}>
                    <AccordionTrigger>
                      <div className="flex items-start gap-2">
                        <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-muted text-[10px] font-medium">
                          {i + 1}
                        </span>
                        <div className="min-w-0 text-left">
                          <span className="text-sm leading-snug font-medium">
                            {q.question}
                          </span>
                          <div className="mt-0.5 flex flex-wrap gap-1.5">
                            <span
                              className={
                                "inline-block rounded px-1.5 py-0.5 text-[10px] font-medium " +
                                (TYPE_COLORS[q.type] || TYPE_COLORS.general)
                              }
                            >
                              {q.type}
                            </span>
                          </div>
                        </div>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-3 pb-2">
                        {q.keyPoints.length > 0 && (
                          <div>
                            <p className="mb-1 text-[11px] font-medium text-muted-foreground uppercase">
                              Key Points to Cover
                            </p>
                            <ul className="list-disc space-y-0.5 pl-4 text-sm text-muted-foreground">
                              {q.keyPoints.map((kp, j) => (
                                <li key={j}>{kp}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                        {q.sampleAnswer && (
                          <div>
                            <p className="mb-1 text-[11px] font-medium text-muted-foreground uppercase">
                              Sample Answer Structure
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {q.sampleAnswer}
                            </p>
                          </div>
                        )}
                        <div className="flex justify-end">
                          <Button
                            variant="ghost"
                            size="xs"
                            onClick={() => copyQuestion(q, i)}
                          >
                            <HugeiconsIcon
                              icon={Copy01Icon}
                              className="size-3"
                            />
                            Copy
                          </Button>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          )}

          {/* Actions bar */}
          <div className="flex items-center justify-between border-t pt-3">
            {selectedRecord && (
              <Button
                variant="ghost"
                size="xs"
                onClick={() => handleDelete(selectedRecord.id)}
                className="text-muted-foreground hover:text-destructive"
              >
                <HugeiconsIcon icon={Delete03Icon} className="size-3" />
                Delete session
              </Button>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={handleGenerate}
              disabled={isGenerating}
              className="ml-auto"
            >
              <HugeiconsIcon
                icon={isGenerating ? Loading03Icon : BrainIcon}
                className={isGenerating ? "size-3.5 animate-spin" : "size-3.5"}
              />
              {isGenerating ? "Generating..." : "Generate More Questions"}
            </Button>
          </div>
        </div>
      )}

      {/* ── Empty state ── */}
      {showEmptyState && (
        <div className="py-16 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-muted">
            <HugeiconsIcon
              icon={ArtificialIntelligence01Icon}
              className="h-6 w-6 text-muted-foreground/50"
            />
          </div>
          <p className="mt-3 text-sm font-medium text-foreground">
            No interview prep yet
          </p>
          <p className="mx-auto mt-1 max-w-sm text-xs text-muted-foreground/60">
            Generate practice questions, tips, and topics to review based on the
            job description, skills, and upcoming interviews
          </p>
        </div>
      )}
    </div>
  )
}
