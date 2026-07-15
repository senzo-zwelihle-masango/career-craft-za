"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { useEditorStore } from "@/lib/data/curriculum-vitae/store"
import { getAiSuggestion, getUserCredits } from "@/lib/actions/ai"
import { toast } from "sonner"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  SparklesIcon,
  MagicWand01Icon,
  BulbIcon,
  TextCheckIcon,
  Search01Icon,
  Copy01Icon,
  File02Icon,
  CheckmarkCircle01Icon,
  CoinsIcon,
  ArrowRight01Icon,
  SquareIcon,
} from "@hugeicons/core-free-icons"

import {
  Message,
  MessageContent,
  MessageActions,
  MessageAction,
  MessageResponse,
} from "@/components/ai-elements/message"
import { Suggestions, Suggestion } from "@/components/ai-elements/suggestion"
import { AtsScoreCard } from "@/components/ai-elements/ats-score-card"
import {
  Conversation,
  ConversationContent,
  ConversationScrollButton,
  ConversationEmptyState,
} from "@/components/ai-elements/conversation"
import {
  Reasoning,
  ReasoningTrigger,
  ReasoningContent,
} from "@/components/ai-elements/reasoning"

import {
  ModelSelector,
  ModelSelectorTrigger,
  ModelSelectorContent,
  ModelSelectorInput,
  ModelSelectorList,
  ModelSelectorItem,
  ModelSelectorGroup,
  ModelSelectorLogo,
  ModelSelectorName,
} from "@/components/ai-elements/model-selector"
import {
  InputGroup,
  InputGroupTextarea,
  InputGroupAddon,
  InputGroupButton,
} from "@/components/ui/input-group"
import type { ChatStatus } from "ai"

interface HistoryEntry {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: number
  reasoning?: string
}

const MODELS = [
  { value: "gemini-2.0-flash", label: "Gemini 2.0 Flash", provider: "google" },
  { value: "gemini-2.5-flash", label: "Gemini 2.5 Flash", provider: "google" },
]

const tools = [
  {
    id: "improve",
    label: "Improve Bullet",
    description:
      "Rewrite a bullet point to be more impactful and achievement-oriented",
    icon: MagicWand01Icon,
    inputPlaceholder:
      "Paste one or more bullet points from your CV (one per line)...",
    supportsBatch: true,
  },
  {
    id: "summary",
    label: "Generate Summary",
    description: "Draft a professional summary from your experience details",
    icon: SparklesIcon,
    inputPlaceholder:
      "Describe your role, years of experience, key skills, and career highlights...",
    supportsBatch: false,
  },
  {
    id: "skills",
    label: "Suggest Skills",
    description: "Get relevant skill suggestions for a job title",
    icon: BulbIcon,
    inputPlaceholder: "e.g. Frontend Engineer, Product Manager...",
    supportsBatch: false,
  },
  {
    id: "grammar",
    label: "Grammar Check",
    description: "Review text for grammar, spelling, and style issues",
    icon: TextCheckIcon,
    inputPlaceholder: "Paste text to check...",
    supportsBatch: false,
  },
  {
    id: "ats",
    label: "ATS Score",
    description:
      "Check your CV against a job description for ATS compatibility",
    icon: Search01Icon,
    inputPlaceholder: "Paste the full job description...",
    supportsBatch: false,
  },
]

function buildCvContext(
  cv: NonNullable<ReturnType<typeof useEditorStore.getState>["cv"]>
): string {
  const pd = cv.personalDetails
  const lines: string[] = []
  if (pd?.fullName) lines.push(`Name: ${pd.fullName}`)
  if (pd?.jobTitle) lines.push(`Title: ${pd.jobTitle}`)
  if (pd?.email) lines.push(`Email: ${pd.email}`)
  if (pd?.phone) lines.push(`Phone: ${pd.phone}`)
  if (pd?.location) lines.push(`Location: ${pd.location}`)
  for (const section of cv.sections) {
    if (!section.visible) continue
    if (section.content) lines.push(`\n## ${section.title}\n${section.content}`)
    for (const exp of section.experienceEntries) {
      lines.push(
        `\n## ${section.title}: ${exp.role} at ${exp.company} (${exp.startDate}-${exp.endDate || "Present"})`
      )
      if (exp.location) lines.push(`Location: ${exp.location}`)
      if (exp.description) lines.push(exp.description.replace(/<[^>]*>/g, ""))
      if (exp.bullets?.length) exp.bullets.forEach((b) => lines.push(`- ${b}`))
    }
    for (const edu of section.educationEntries) {
      lines.push(
        `\n- ${edu.degree} at ${edu.institution} (${edu.startDate}-${edu.endDate})${edu.location ? ` – ${edu.location}` : ""}`
      )
    }
    for (const proj of section.projectEntries) {
      lines.push(
        `\n- ${proj.name}${proj.technologies?.length ? ` [${proj.technologies.join(", ")}]` : ""}`
      )
      if (proj.description)
        lines.push(`  ${proj.description.replace(/<[^>]*>/g, "")}`)
    }
    for (const cert of section.certificationEntries) {
      lines.push(`\n- ${cert.name}${cert.issuer ? ` – ${cert.issuer}` : ""}`)
    }
    for (const lang of section.languageEntries) {
      lines.push(
        `\n- ${lang.name}${lang.proficiency ? ` (${lang.proficiency})` : ""}`
      )
    }
    for (const skill of section.skillGroups) {
      lines.push(`\n### ${skill.label || "Skills"}: ${skill.skills.join(", ")}`)
    }
  }
  return lines.join("\n")
}

export default function AiToolsPage() {
  const cv = useEditorStore((s) => s.cv)
  const updateCv = useEditorStore((s) => s.updateCv)
  const [activeTool, setActiveTool] = useState<string | null>(null)
  const [input, setInput] = useState("")
  const [status, setStatus] = useState<ChatStatus>("ready")
  const [modelName, setModelName] = useState(MODELS[0].value)
  const [modelDialogOpen, setModelDialogOpen] = useState(false)
  const [credits, setCredits] = useState<{
    aiCredits: number
    maxCredits: number
    plan: string
  } | null>(null)
  const [history, setHistory] = useState<Record<string, HistoryEntry[]>>({})
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const abortRef = useRef<AbortController | null>(null)

  useEffect(() => {
    getUserCredits().then((res) => {
      if ("data" in res && res.data) setCredits(res.data)
    })
  }, [])

  const addEntry = useCallback((toolId: string, entry: HistoryEntry) => {
    setHistory((prev) => ({
      ...prev,
      [toolId]: [...(prev[toolId] || []), entry],
    }))
  }, [])

  const handleSubmit = useCallback(async () => {
    if (!activeTool || !input.trim()) {
      toast.error("Please enter some text")
      return
    }
    if (abortRef.current) abortRef.current.abort()
    const controller = new AbortController()
    abortRef.current = controller

    const userEntry: HistoryEntry = {
      id: crypto.randomUUID(),
      role: "user",
      content: input.trim(),
      timestamp: Date.now(),
    }
    addEntry(activeTool, userEntry)
    setInput("")
    setStatus("streaming")

    try {
      const context =
        activeTool === "ats" && cv ? buildCvContext(cv) : undefined
      const { data, error } = await getAiSuggestion(
        activeTool,
        userEntry.content,
        context
      )
      if (controller.signal.aborted) return
      if (data) {
        addEntry(activeTool, {
          id: crypto.randomUUID(),
          role: "assistant",
          content: data.result,
          timestamp: Date.now(),
        })
        if (data.remaining !== undefined) {
          setCredits((prev) =>
            prev ? { ...prev, aiCredits: data.remaining! } : prev
          )
        }
        setStatus("ready")
      } else {
        addEntry(activeTool, {
          id: crypto.randomUUID(),
          role: "assistant",
          content: `Error: ${error || "AI request failed"}`,
          timestamp: Date.now(),
        })
        toast.error(error || "AI request failed")
        setStatus("error")
      }
    } catch (e) {
      if ((e as Error)?.name !== "AbortError") {
        toast.error("Something went wrong. Please try again.")
        setStatus("error")
      }
    }
  }, [activeTool, input, cv, addEntry])

  const handleStop = useCallback(() => {
    abortRef.current?.abort()
    setStatus("ready")
  }, [])

  const copyResult = useCallback(async (id: string, text: string) => {
    await navigator.clipboard.writeText(text)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }, [])

  const applySummary = useCallback(
    (text: string) => {
      if (!cv) return
      const updatedSections = cv.sections.map((s) =>
        s.type === "SUMMARY" ? { ...s, content: text } : s
      )
      updateCv({ sections: updatedSections })
      toast.success("Summary applied to CV")
    },
    [cv, updateCv]
  )

  const activeToolDef = tools.find((t) => t.id === activeTool)
  const toolHistory = activeTool ? history[activeTool] || [] : []
  const isStreaming = status === "streaming" || status === "submitted"

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="flex shrink-0 flex-wrap items-start justify-between gap-3 px-4 pt-4 pb-2 md:px-6 md:pt-6">
        <div>
          <h1 className="text-lg font-semibold">AI Tools</h1>
          <p className="text-xs text-muted-foreground">
            Enhance your CV with AI assistance
          </p>
        </div>
        <div className="flex items-center gap-3">
          {credits && (
            <div className="flex items-center gap-1.5 rounded-lg border bg-muted/30 px-3 py-1.5 text-xs">
              <HugeiconsIcon
                icon={CoinsIcon}
                className="h-3.5 w-3.5 text-amber-500"
              />
              <span className="font-medium">{credits.aiCredits}</span>
              <span className="text-muted-foreground">
                / {credits.maxCredits}
              </span>
            </div>
          )}
          <ModelSelector
            open={modelDialogOpen}
            onOpenChange={setModelDialogOpen}
          >
            <ModelSelectorTrigger>
              <div className="flex h-7 cursor-pointer items-center gap-1.5 rounded-md border bg-background px-2 text-xs hover:bg-accent">
                <span className="hidden sm:inline">
                  {MODELS.find((m) => m.value === modelName)?.label}
                </span>
                <span className="sm:hidden">Model</span>
              </div>
            </ModelSelectorTrigger>
            <ModelSelectorContent>
              <ModelSelectorInput
                placeholder="Search models..."
                value={modelName}
                onValueChange={(v) => {
                  if (v) setModelName(v)
                }}
              />
              <ModelSelectorList>
                <ModelSelectorGroup>
                  {MODELS.map((m) => (
                    <ModelSelectorItem
                      key={m.value}
                      value={m.value}
                      onSelect={(v) => {
                        setModelName(v)
                        setModelDialogOpen(false)
                      }}
                    >
                      <ModelSelectorLogo provider={m.provider} />
                      <ModelSelectorName>{m.label}</ModelSelectorName>
                    </ModelSelectorItem>
                  ))}
                </ModelSelectorGroup>
              </ModelSelectorList>
            </ModelSelectorContent>
          </ModelSelector>
        </div>
      </div>

      {/* Tool switcher */}
      <div className="shrink-0 px-4 pb-2 md:px-6">
        <Suggestions>
          {tools.map((tool) => {
            const isActive = activeTool === tool.id
            return (
              <Suggestion
                key={tool.id}
                suggestion={tool.label}
                onClick={() => {
                  setActiveTool(tool.id)
                  setStatus("ready")
                }}
                className={
                  isActive
                    ? "bg-primary text-primary-foreground hover:bg-primary/90"
                    : ""
                }
              />
            )
          })}
        </Suggestions>
      </div>

      {activeToolDef ? (
        <div className="flex flex-1 flex-col overflow-hidden">
          {/* Conversation */}
          <Conversation className="px-4 md:px-6">
            <ConversationContent>
              {toolHistory.length === 0 && !isStreaming && (
                <ConversationEmptyState
                  title={activeToolDef.label}
                  description={activeToolDef.description}
                  icon={
                    <HugeiconsIcon
                      icon={activeToolDef.icon}
                      className="h-8 w-8 text-muted-foreground/30"
                    />
                  }
                />
              )}

              {toolHistory.map((entry) => (
                <Message key={entry.id} from={entry.role}>
                  <MessageContent>
                    {entry.role === "user" ? (
                      <div className="text-sm whitespace-pre-wrap">
                        {entry.content}
                      </div>
                    ) : entry.content.startsWith("Error:") ? (
                      <div className="text-sm text-destructive">
                        {entry.content}
                      </div>
                    ) : activeToolDef.id === "ats" ? (
                      <AtsScoreCard
                        result={entry.content}
                        fallback={
                          <MessageResponse>{entry.content}</MessageResponse>
                        }
                      />
                    ) : (
                      <MessageResponse>{entry.content}</MessageResponse>
                    )}

                    {entry.role === "assistant" &&
                      !entry.content.startsWith("Error:") && (
                        <MessageActions>
                          <MessageAction
                            variant="ghost"
                            size="sm"
                            tooltip={copiedId === entry.id ? "Copied" : "Copy"}
                            onClick={() => copyResult(entry.id, entry.content)}
                          >
                            <HugeiconsIcon
                              icon={
                                copiedId === entry.id
                                  ? CheckmarkCircle01Icon
                                  : Copy01Icon
                              }
                              className="h-3.5 w-3.5"
                            />
                            {copiedId === entry.id ? "Copied" : "Copy"}
                          </MessageAction>
                          {activeToolDef.id === "summary" && (
                            <MessageAction
                              variant="ghost"
                              size="sm"
                              tooltip="Apply to CV"
                              onClick={() => applySummary(entry.content)}
                            >
                              <HugeiconsIcon
                                icon={File02Icon}
                                className="h-3.5 w-3.5"
                              />
                              Apply to CV
                            </MessageAction>
                          )}
                          {(activeToolDef.id === "improve" ||
                            activeToolDef.id === "grammar") && (
                            <MessageAction
                              variant="ghost"
                              size="sm"
                              tooltip="Use as input"
                              onClick={() => {
                                setInput(entry.content)
                                toast.success("Result set as input")
                              }}
                            >
                              <HugeiconsIcon
                                icon={File02Icon}
                                className="h-3.5 w-3.5"
                              />
                              Use as Input
                            </MessageAction>
                          )}
                        </MessageActions>
                      )}
                  </MessageContent>
                </Message>
              ))}

              {isStreaming && (
                <Reasoning isStreaming={true}>
                  <ReasoningTrigger />
                  <ReasoningContent>{""}</ReasoningContent>
                </Reasoning>
              )}
            </ConversationContent>
            <ConversationScrollButton />
          </Conversation>

          {/* Input area */}
          <div className="shrink-0 border-t bg-background px-4 py-3 md:px-6">
            <div className="mx-auto max-w-3xl">
              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  handleSubmit()
                }}
              >
                <InputGroup>
                  <InputGroupTextarea
                    placeholder={activeToolDef.inputPlaceholder}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    rows={2}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault()
                        handleSubmit()
                      }
                    }}
                  />
                  <InputGroupAddon align="inline-end">
                    {activeToolDef.supportsBatch && (
                      <span className="hidden text-[10px] text-muted-foreground md:inline">
                        One per line
                      </span>
                    )}
                    {isStreaming ? (
                      <InputGroupButton
                        type="button"
                        size="icon-xs"
                        onClick={handleStop}
                        title="Stop"
                      >
                        <HugeiconsIcon icon={SquareIcon} className="size-3.5" />
                      </InputGroupButton>
                    ) : (
                      <InputGroupButton
                        type="submit"
                        size="icon-xs"
                        disabled={!input.trim()}
                        title="Send"
                      >
                        <HugeiconsIcon
                          icon={ArrowRight01Icon}
                          className="size-3.5"
                        />
                      </InputGroupButton>
                    )}
                  </InputGroupAddon>
                </InputGroup>
              </form>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-1 items-center justify-center px-4 md:px-6">
          <div className="text-center">
            <HugeiconsIcon
              icon={SparklesIcon}
              className="mx-auto h-8 w-8 text-muted-foreground/30"
            />
            <p className="mt-2 text-sm text-muted-foreground">
              Select a tool to get started
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
