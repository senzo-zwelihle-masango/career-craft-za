"use client"

import { useCallback, useEffect, useState, useRef } from "react"
import { useParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { cn } from "@/lib/utils"
import { toast } from "sonner"
import {
  getCoverLetter,
  updateCoverLetter,
} from "@/lib/actions/user/cover-letter"
import { getCv } from "@/lib/actions/user/curriculum-vitae"

import {
  ColorPicker,
  ColorPickerSelection,
  ColorPickerHue,
  ColorPickerAlpha,
  ColorPickerOutput,
  ColorPickerFormat,
  ColorPickerEyeDropper,
} from "@/components/ui/color-picker"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  RefreshIcon,
  PaintBucketIcon,
  DashboardSquare02Icon,
  Loading03Icon,
  Maximize02Icon,
} from "@hugeicons/core-free-icons"

import { COVER_LETTER_TEMPLATES } from "@/components/cover-letter/templates/registry"
import { CoverLetterTemplatePreview } from "@/components/cover-letter/templates/cover-letter-template-preview"
import { CoverLetterPreview } from "@/components/cover-letter/templates/cover-letter-preview"

const PAGE_WIDTH = 794

const FONT_OPTIONS = [
  { value: "serif", label: "Serif" },
  { value: "sans", label: "Sans-serif" },
  { value: "mono", label: "Monospace" },
]

const railItems = [
  { label: "Style", icon: PaintBucketIcon },
  { label: "Templates", icon: DashboardSquare02Icon },
]

export default function CoverLetterCustomizePage() {
  const params = useParams()
  const letterId = params.id as string
  const [loading, setLoading] = useState(true)
  const [templateId, setTemplateId] = useState("classic")
  const [fontFamily, setFontFamily] = useState("serif")
  const [accentColor, setAccentColor] = useState("#1f2937")
  const [cvId, setCvId] = useState<string | null>(null)
  const [syncing, setSyncing] = useState(false)
  const [previewTemplateId, setPreviewTemplateId] = useState<string | null>(
    null
  )
  const [activePanel, setActivePanel] = useState("Style")
  const [zoom, setZoom] = useState(0.75)
  const previewContainerRef = useRef<HTMLDivElement>(null)
  const fullscreenRef = useRef<HTMLDivElement>(null)
  const [preview, setPreview] = useState({
    fullName: "",
    professionalTitle: "",
    email: "",
    phone: "",
    location: "",
    date: "",
    recipientName: "",
    companyName: "",
    body: "",
  })

  const SIDEBAR_WIDTH_KEY = "cl-customize-sidebar-width"
  const DEFAULT_SIDEBAR_WIDTH = 35
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
      setSidebarWidth(Math.max(25, Math.min(55, pct)))
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
    const el = previewContainerRef.current
    if (!el) return
    const ro = new ResizeObserver((entries) => {
      const w = entries[0]?.contentRect.width
      if (w) {
        setZoom(Math.min(w / PAGE_WIDTH, 1))
      }
    })
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  const handleFullscreen = useCallback(() => {
    const el = fullscreenRef.current
    if (!el) return
    if (document.fullscreenElement) {
      document.exitFullscreen()
    } else {
      el.requestFullscreen()
    }
  }, [])

  useEffect(() => {
    getCoverLetter(letterId)
      .then((res) => {
        if (res.data) {
          const d = res.data
          setTemplateId(d.templateId || "classic")
          setFontFamily(d.fontFamily || "serif")
          const validHex = /^#[0-9a-f]{6}$/i.test(d.accentColor || "")
          setAccentColor(validHex ? d.accentColor : "#1f2937")
          setCvId(d.curriculumVitaeId || null)
          setPreview({
            fullName: d.fullName || "",
            professionalTitle: d.professionalTitle || "",
            email: d.email || "",
            phone: d.phone || "",
            location: d.location || "",
            date: d.date || "",
            recipientName: d.recipientName || "",
            companyName: d.companyName || "",
            body: d.body || "",
          })
        }
        setLoading(false)
      })
      .catch(() => {
        setLoading(false)
      })
  }, [letterId])

  async function update(field: string, value: string) {
    const { error } = await updateCoverLetter(letterId, { [field]: value })
    if (!error) {
      if (field === "templateId") setTemplateId(value)
      if (field === "fontFamily") setFontFamily(value)
      if (field === "accentColor") setAccentColor(value)
    } else {
      toast.error("Failed to save")
    }
  }

  const handleSyncWithCv = useCallback(async () => {
    if (!cvId) {
      toast.error(
        "No CV linked to this cover letter. Link one in the Content page first."
      )
      return
    }
    setSyncing(true)
    const { data } = await getCv(cvId)
    if (data) {
      const cv = data as {
        templateId?: string
        fontFamily?: string
        accentColor?: string | null
      }
      const updates: Record<string, string> = {}
      if (cv.templateId) updates.templateId = cv.templateId
      if (cv.fontFamily) updates.fontFamily = cv.fontFamily
      if (cv.accentColor) updates.accentColor = cv.accentColor

      const { error } = await updateCoverLetter(letterId, updates)
      if (!error) {
        if (updates.templateId) setTemplateId(updates.templateId)
        if (updates.fontFamily) setFontFamily(updates.fontFamily)
        if (updates.accentColor) setAccentColor(updates.accentColor)
        toast.success("Cover letter style synced with CV")
      } else {
        toast.error("Failed to sync with CV")
      }
    }
    setSyncing(false)
  }, [cvId, letterId])

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
        <HugeiconsIcon icon={Loading03Icon} className="animate-spin" />
      </div>
    )
  }

  return (
    <div
      className="flex h-full min-h-0 flex-col overflow-hidden"
      id="customize"
    >
      <div
        ref={containerRef}
        className="flex min-h-0 flex-1 flex-col overflow-hidden lg:flex-row"
      >
        {/* Left side: rail + panel */}
        <div
          className="flex min-w-0 flex-col"
          style={isDesktop ? { width: `${sidebarWidth}%` } : undefined}
        >
          <div className="flex min-h-0 flex-1">
            {/* Rail */}
            <nav className="flex w-full shrink-0 items-center justify-start gap-0.5 overflow-x-auto border-b bg-background px-1 py-1 md:w-[76px] md:flex-col md:justify-start md:overflow-y-auto md:border-r md:border-b-0 md:px-2 md:py-3">
              {railItems.map((item) => (
                <button
                  key={item.label}
                  onClick={() => setActivePanel(item.label)}
                  className={cn(
                    "flex h-11 w-11 shrink-0 flex-col items-center justify-center gap-0.5 rounded-xl text-[10px] font-medium transition-colors md:h-[56px] md:w-full",
                    activePanel === item.label
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                  title={item.label}
                >
                  <HugeiconsIcon icon={item.icon} className="h-4 w-4" />
                  <span className="leading-tight">{item.label}</span>
                </button>
              ))}
            </nav>

            {/* Panel content */}
            <div
              className="scrollbar-hidden flex-1 overflow-y-auto p-3 md:p-6 lg:p-8"
              data-lenis-prevent
            >
              {activePanel === "Style" && (
                <div className="max-w-xl space-y-6">
                  <h2 className="text-sm font-semibold">Style</h2>
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">
                        Cover Letter Settings
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label>Template</Label>
                        <Select
                          value={templateId}
                          onValueChange={(v) =>
                            v != null && update("templateId", v)
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {COVER_LETTER_TEMPLATES.map((t) => (
                              <SelectItem key={t.id} value={t.id}>
                                {t.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>Font</Label>
                        <Select
                          value={fontFamily}
                          onValueChange={(v) =>
                            v != null && update("fontFamily", v)
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {FONT_OPTIONS.map((f) => (
                              <SelectItem key={f.value} value={f.value}>
                                {f.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>Accent colour</Label>
                        <ColorPicker
                          value={accentColor}
                          onChange={(value: number[]) => {
                            const [r, g, b] = value
                            const hex =
                              "#" +
                              [r, g, b]
                                .map((x) =>
                                  Math.round(x).toString(16).padStart(2, "0")
                                )
                                .join("")
                            update("accentColor", hex)
                          }}
                          className="h-auto w-full"
                        >
                          <ColorPickerSelection className="h-36 rounded-lg" />
                          <ColorPickerHue />
                          <ColorPickerAlpha />
                          <div className="flex items-center gap-2">
                            <ColorPickerEyeDropper />
                            <ColorPickerOutput />
                            <ColorPickerFormat />
                          </div>
                        </ColorPicker>
                      </div>
                      {cvId && (
                        <div className="space-y-2 border-t pt-2">
                          <Label>Match CV style</Label>
                          <Button
                            variant="outline"
                            size="sm"
                            className="w-full gap-2"
                            onClick={handleSyncWithCv}
                            disabled={syncing}
                          >
                            <HugeiconsIcon
                              icon={RefreshIcon}
                              className={cn(
                                "size-4",
                                syncing && "animate-spin"
                              )}
                            />
                            {syncing
                              ? "Syncing..."
                              : "Copy CV template & colours"}
                          </Button>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              )}

              {activePanel === "Templates" && (
                <div className="space-y-3">
                  <h2 className="text-sm font-semibold">Templates</h2>
                  <div className="grid gap-3">
                    {COVER_LETTER_TEMPLATES.map((t) => (
                      <button
                        key={t.id}
                        onClick={() => setPreviewTemplateId(t.id)}
                        className={cn(
                          "w-full rounded-lg border-2 p-3 text-left transition-all hover:border-foreground/50",
                          templateId === t.id
                            ? "border-foreground ring-1 ring-foreground"
                            : "border-border"
                        )}
                      >
                        <div className="flex items-start gap-3">
                          <div
                            className={cn(
                              "flex h-24 w-[88px] shrink-0 items-start justify-center overflow-hidden rounded border bg-white",
                              templateId === t.id
                                ? "border-foreground"
                                : "border-border"
                            )}
                          >
                            <div className="relative">
                              <CoverLetterTemplatePreview
                                templateId={t.id}
                                scale={0.11}
                                className="overflow-hidden"
                              />
                            </div>
                          </div>
                          <div>
                            <p className="text-sm font-medium">{t.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {t.description}
                            </p>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
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
            className="flex min-w-0 flex-col bg-muted/30"
            style={{ width: `calc(${100 - sidebarWidth}%)` }}
          >
            <div
              ref={fullscreenRef}
              className="scrollbar-hidden group relative flex-1 overflow-y-auto p-4 lg:p-8"
              data-lenis-prevent
            >
              <Button
                onClick={handleFullscreen}
                size="sm"
                variant="outline"
                className="absolute top-6 right-6 z-10"
              >
                <HugeiconsIcon icon={Maximize02Icon} className="h-3.5 w-3.5" />
                Fullscreen
              </Button>
              <div ref={previewContainerRef}>
                <div className="mx-auto" style={{ width: PAGE_WIDTH * zoom }}>
                  <div
                    style={{
                      width: PAGE_WIDTH,
                      transform: `scale(${zoom})`,
                      transformOrigin: "top left",
                    }}
                  >
                    <CoverLetterPreview
                      fullName={preview.fullName}
                      professionalTitle={preview.professionalTitle}
                      email={preview.email}
                      phone={preview.phone}
                      location={preview.location}
                      date={preview.date}
                      recipientName={preview.recipientName}
                      companyName={preview.companyName}
                      body={preview.body}
                      fontFamily={fontFamily}
                      templateId={templateId}
                      accentColor={accentColor}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Template preview dialog */}
      {previewTemplateId && (
        <Dialog
          open={!!previewTemplateId}
          onOpenChange={(open) => {
            if (!open) setPreviewTemplateId(null)
          }}
        >
          <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-4xl">
            <DialogHeader>
              <DialogTitle>
                {COVER_LETTER_TEMPLATES.find((t) => t.id === previewTemplateId)
                  ?.name || "Template Preview"}
              </DialogTitle>
            </DialogHeader>

            {(() => {
              const tpl = COVER_LETTER_TEMPLATES.find(
                (t) => t.id === previewTemplateId
              )
              if (!tpl) return null
              return (
                <div className="flex flex-col gap-6 md:flex-row">
                  <div className="flex min-h-[300px] flex-shrink-0 items-start justify-center overflow-auto rounded-lg bg-zinc-50 p-4 dark:bg-zinc-900">
                    <CoverLetterTemplatePreview
                      templateId={tpl.id}
                      scale={0.45}
                    />
                  </div>

                  <div className="min-w-0 flex-1 space-y-4">
                    <div>
                      <h3 className="text-base font-semibold">{tpl.name}</h3>
                    </div>

                    <p className="text-sm leading-relaxed text-muted-foreground">
                      {tpl.description}
                    </p>

                    <DialogFooter className="gap-2 pt-2">
                      <Button
                        variant="outline"
                        onClick={() => setPreviewTemplateId(null)}
                      >
                        Cancel
                      </Button>
                      <Button
                        onClick={() => {
                          update("templateId", tpl.id)
                          setPreviewTemplateId(null)
                        }}
                      >
                        Use Template
                      </Button>
                    </DialogFooter>
                  </div>
                </div>
              )
            })()}
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
