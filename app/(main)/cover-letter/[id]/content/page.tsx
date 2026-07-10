"use client"

import { useEffect, useState, useRef, useCallback } from "react"
import { useParams } from "next/navigation"
import {
  getCoverLetter,
  updateCoverLetter,
  generateCoverLetter,
} from "@/lib/actions/user/cover-letter"
import { getCvs } from "@/lib/actions/user/curriculum-vitae"
import { getAiSuggestion } from "@/lib/actions/ai"
import { Input } from "@/components/ui/input"
import { PhoneInput } from "@/components/ui/phone-input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { DatePicker } from "@/components/ui/date-picker"
import { toast } from "sonner"

import { HugeiconsIcon } from "@hugeicons/react"
import {
  Loading03Icon,
  SparklesIcon,
  MagicWand01Icon,
  TextCheckIcon,
  AiChat01Icon,
} from "@hugeicons/core-free-icons"
import { CoverLetterPreview } from "@/components/cover-letter/templates/cover-letter-preview"
import {
  Reasoning,
  ReasoningTrigger,
  ReasoningContent,
} from "@/components/ai-elements/reasoning"
import type { ChatStatus } from "ai"

export default function CoverLetterContentPage() {
  const params = useParams()
  const letterId = params.id as string
  const [form, setForm] = useState({
    fullName: "",
    professionalTitle: "",
    email: "",
    phone: "",
    location: "",
    date: "",
    recipientName: "",
    companyName: "",
    body: "",
    cvId: "",
  })
  const [cvs, setCvs] = useState<{ id: string; title: string }[]>([])
  const [fontFamily, setFontFamily] = useState("serif")
  const [templateId, setTemplateId] = useState("classic")
  const [accentColor, setAccentColor] = useState<string | null>(null)
  const [generating, setGenerating] = useState(false)
  const [clAiTool, setClAiTool] = useState<string | null>(null)
  const [clAiResult, setClAiResult] = useState("")
  const [clAiStatus, setClAiStatus] = useState<ChatStatus>("ready")

  const SIDEBAR_WIDTH_KEY = "cl-content-sidebar-width"
  const DEFAULT_SIDEBAR_WIDTH = 45
  const [sidebarWidth, setSidebarWidth] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem(SIDEBAR_WIDTH_KEY)
      return saved ? Number(saved) : DEFAULT_SIDEBAR_WIDTH
    }
    return DEFAULT_SIDEBAR_WIDTH
  })
  const [isDesktop, setIsDesktop] = useState(true)
  const isDragging = useRef(false)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function check() {
      setIsDesktop(window.innerWidth >= 1024)
    }
    check()
    window.addEventListener("resize", check)
    return () => window.removeEventListener("resize", check)
  }, [])

  const handleMouseDown = useCallback(() => {
    isDragging.current = true
    document.body.style.cursor = "col-resize"
    document.body.style.userSelect = "none"
  }, [])

  useEffect(() => {
    function handleMouseMove(e: MouseEvent) {
      if (!isDragging.current || !containerRef.current) return
      const rect = containerRef.current.getBoundingClientRect()
      const pct = ((e.clientX - rect.left) / rect.width) * 100
      setSidebarWidth(Math.max(30, Math.min(60, pct)))
    }
    function handleMouseUp() {
      if (isDragging.current) {
        isDragging.current = false
        document.body.style.cursor = ""
        document.body.style.userSelect = ""
        setSidebarWidth((prev) => {
          localStorage.setItem(SIDEBAR_WIDTH_KEY, String(prev))
          return prev
        })
      }
    }
    window.addEventListener("mousemove", handleMouseMove)
    window.addEventListener("mouseup", handleMouseUp)
    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
      window.removeEventListener("mouseup", handleMouseUp)
    }
  }, [])

  useEffect(() => {
    ;(async () => {
      const letterRes = await getCoverLetter(letterId)
      if (letterRes.data) {
        const data = letterRes.data
        setForm({
          fullName: data.fullName || "",
          professionalTitle: data.professionalTitle || "",
          email: data.email || "",
          phone: data.phone || "",
          location: data.location || "",
          date: data.date || "",
          recipientName: data.recipientName || "",
          companyName: data.companyName || "",
          body: data.body || "",
          cvId: data.curriculumVitaeId || "",
        })
        setFontFamily(data.fontFamily || "serif")
        setTemplateId(data.templateId || "classic")
        setAccentColor(data.accentColor || null)
      }
    })()
    getCvs().then((res) => {
      if (res.data) setCvs(res.data)
    })
  }, [letterId])

  function updateField(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }))
    saveField(field, value)
  }

  async function saveField(field: string, value: string) {
    const dbField = field === "cvId" ? "curriculumVitaeId" : field
    const { error } = await updateCoverLetter(letterId, { [dbField]: value })
    if (error) toast.error("Failed to save")
  }

  async function handleGenerate() {
    if (!form.cvId) {
      toast.error("Please link a CV first")
      return
    }
    if (!form.companyName.trim()) {
      toast.error("Please enter a company name")
      return
    }
    setGenerating(true)
    const { data, error } = await generateCoverLetter(
      form.cvId,
      form.companyName.trim(),
      form.recipientName.trim(),
      {
        fullName: form.fullName,
        professionalTitle: form.professionalTitle,
        email: form.email,
        phone: form.phone,
        location: form.location,
        date: form.date,
      }
    )
    if (data) {
      setForm((prev) => ({ ...prev, body: data }))
      await updateCoverLetter(letterId, { body: data })
      toast.success("Cover letter generated")
    } else {
      toast.error(error || "Generation failed")
    }
    setGenerating(false)
  }

  async function handleClAiTool(tool: string) {
    if (!form.body.trim()) {
      toast.error("Please write some body text first")
      return
    }
    setClAiTool(tool)
    setClAiResult("")
    setClAiStatus("streaming")
    const { data, error } = await getAiSuggestion(tool, form.body)
    if (data) {
      setClAiResult(data.result)
      setClAiStatus("ready")
    } else {
      toast.error(error || "AI request failed")
      setClAiStatus("error")
    }
  }

  function applyClAiResult() {
    if (!clAiResult) return
    setForm((prev) => ({ ...prev, body: clAiResult }))
    saveField("body", clAiResult)
    setClAiTool(null)
    setClAiResult("")
    toast.success("Applied to body")
  }
  const formContent = (
    <div className="mx-auto max-w-xl space-y-5 md:max-w-none">
      <div>
        <h3 className="mb-3 text-sm font-semibold text-muted-foreground">
          Your Details
        </h3>
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs">Full name</Label>
              <Input
                value={form.fullName}
                onChange={(e) => updateField("fullName", e.target.value)}
                placeholder="John Doe"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Professional title</Label>
              <Input
                value={form.professionalTitle}
                onChange={(e) =>
                  updateField("professionalTitle", e.target.value)
                }
                placeholder="Software Engineer"
              />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Email</Label>
            <Input
              value={form.email}
              onChange={(e) => updateField("email", e.target.value)}
              placeholder="john@example.com"
              type="email"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs">Phone</Label>
              <PhoneInput
                value={form.phone}
                onChange={(v) => updateField("phone", v || "")}
                defaultCountry="ZA"
                international
                countryCallingCodeEditable={false}
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Location</Label>
              <Input
                value={form.location}
                onChange={(e) => updateField("location", e.target.value)}
                placeholder="Cape Town, South Africa"
              />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Date</Label>
            <DatePicker
              value={form.date}
              onChange={(v) => updateField("date", v)}
              placeholder={new Date().toLocaleDateString("en-ZA", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            />
          </div>
        </div>
      </div>

      <Separator />

      <div>
        <h3 className="mb-3 text-sm font-semibold text-muted-foreground">
          Recipient
        </h3>
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs">Recipient name</Label>
              <Input
                value={form.recipientName}
                onChange={(e) => updateField("recipientName", e.target.value)}
                placeholder="Hiring Manager"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Company name</Label>
              <Input
                value={form.companyName}
                onChange={(e) => updateField("companyName", e.target.value)}
                placeholder="Acme Corp"
              />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Link to CV (optional)</Label>
            <Select
              value={form.cvId}
              onValueChange={(v) => v != null && updateField("cvId", v)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a CV" />
              </SelectTrigger>
              <SelectContent>
                {cvs.map((r) => (
                  <SelectItem key={r.id} value={r.id}>
                    {r.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <Separator />

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label className="text-xs">Body</Label>
          <div className="flex flex-wrap items-center gap-1.5">
            <Button
              variant="outline"
              size="sm"
              className="h-7 gap-1 text-xs"
              onClick={handleGenerate}
              disabled={generating}
            >
              {generating ? (
                <HugeiconsIcon icon={Loading03Icon} className="size-3 animate-spin" />
              ) : (
                <HugeiconsIcon icon={SparklesIcon} className="size-3" />
              )}
              Generate
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-7 gap-1 text-xs"
              onClick={() => handleClAiTool("cl-improve")}
              disabled={clAiStatus === "streaming"}
            >
              <HugeiconsIcon icon={MagicWand01Icon} className="size-3" />
              Improve
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-7 gap-1 text-xs"
              onClick={() => handleClAiTool("cl-grammar")}
              disabled={clAiStatus === "streaming"}
            >
              <HugeiconsIcon icon={TextCheckIcon} className="size-3" />
              Proofread
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-7 gap-1 text-xs"
              onClick={() => handleClAiTool("cl-tone")}
              disabled={clAiStatus === "streaming"}
            >
              <HugeiconsIcon icon={AiChat01Icon} className="size-3" />
              Tone
            </Button>
          </div>
        </div>
        <Textarea
          value={form.body}
          onChange={(e) => updateField("body", e.target.value)}
          placeholder="Dear Hiring Manager,..."
          className="min-h-[350px] text-sm leading-relaxed"
        />

        {clAiStatus === "streaming" && (
          <div className="rounded-lg border p-3">
            <Reasoning isStreaming={true}>
              <ReasoningTrigger />
              <ReasoningContent>{""}</ReasoningContent>
            </Reasoning>
          </div>
        )}

        {clAiResult && clAiTool && (
          <div className="rounded-lg border bg-muted/20 p-3">
            <div className="mb-2 flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
              {clAiTool === "cl-improve" && (
                <><HugeiconsIcon icon={MagicWand01Icon} className="size-3" /> Improved Text</>
              )}
              {clAiTool === "cl-grammar" && (
                <><HugeiconsIcon icon={TextCheckIcon} className="size-3" /> Proofread</>
              )}
              {clAiTool === "cl-tone" && (
                <><HugeiconsIcon icon={AiChat01Icon} className="size-3" /> Tone Analysis</>
              )}
            </div>
            <div className="whitespace-pre-wrap text-sm leading-relaxed">
              {clAiResult}
            </div>
            <div className="mt-3 flex items-center gap-2 border-t pt-2">
              <Button
                variant="default"
                size="sm"
                className="h-7 text-xs"
                onClick={applyClAiResult}
              >
                Apply to Body
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="h-7 text-xs"
                onClick={() => {
                  navigator.clipboard.writeText(clAiResult)
                  toast.success("Copied")
                }}
              >
                Copy
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="h-7 text-xs ml-auto"
                onClick={() => {
                  setClAiTool(null)
                  setClAiResult("")
                }}
              >
                Dismiss
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )

  return (
    <div className="flex h-full min-h-0 flex-col overflow-hidden" id="content">
      <div
        ref={containerRef}
        className="flex min-h-0 flex-1 flex-col overflow-hidden md:flex-row"
      >
        {/* form panel */}
        <div
          className="flex min-w-0 flex-col border-b md:border-r md:border-b-0"
          style={isDesktop ? { width: `${sidebarWidth}%` } : undefined}
        >
          <div
            className="scrollbar-hidden flex-1 overflow-y-auto p-4 md:p-6"
            data-lenis-prevent
          >
            {formContent}
          </div>
        </div>

        {/* resizable divider */}
        {isDesktop && (
          <div
            className="relative w-1.5 shrink-0 cursor-col-resize transition-colors hover:bg-primary/20 active:bg-primary/30"
            onMouseDown={handleMouseDown}
          >
            <div className="absolute inset-y-0 left-1/2 w-4 -translate-x-1/2" />
          </div>
        )}

        {/* preview panel */}
        {isDesktop && (
          <div
            className="flex min-w-0 flex-col"
            style={{ width: `calc(${100 - sidebarWidth}%)` }}
          >
            <div
              className="scrollbar-hidden flex-1 overflow-y-auto p-4 lg:p-6"
              data-lenis-prevent
            >
              <div className="mx-auto w-full max-w-[210mm]">
                <CoverLetterPreview
                  fullName={form.fullName}
                  professionalTitle={form.professionalTitle}
                  email={form.email}
                  phone={form.phone}
                  location={form.location}
                  date={form.date}
                  recipientName={form.recipientName}
                  companyName={form.companyName}
                  body={form.body}
                  fontFamily={fontFamily}
                  templateId={templateId}
                  accentColor={accentColor}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
