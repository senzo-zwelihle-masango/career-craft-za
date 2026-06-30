"use client"

import { useCallback, useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog"
import { Skeleton } from "@/components/ui/skeleton"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { toast } from "sonner"
import { getCoverLetter, updateCoverLetter } from "@/lib/actions/cover-letter"
import { getCv } from "@/lib/actions/curriculum-vitae"

import { ColorPicker, ColorPickerSelection, ColorPickerHue, ColorPickerAlpha, ColorPickerOutput, ColorPickerFormat, ColorPickerEyeDropper } from "@/components/ui/color-picker"
import { HugeiconsIcon } from "@hugeicons/react"
import { RefreshIcon } from "@hugeicons/core-free-icons"

import { Container } from "@/components/ui/container"
import { COVER_LETTER_TEMPLATES } from "@/components/templates/registry"
import { CoverLetterTemplatePreview } from "@/components/cover-letter/cover-letter-template-preview"
import { CoverLetterPreview } from "@/components/cover-letter/cover-letter-preview"

const FONT_OPTIONS = [
  { value: "serif", label: "Serif" },
  { value: "sans", label: "Sans-serif" },
  { value: "mono", label: "Monospace" },
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
  const [previewTemplateId, setPreviewTemplateId] = useState<string | null>(null)
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
      .catch(() => { setLoading(false) })
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
      toast.error("No CV linked to this cover letter. Link one in the Content page first.")
      return
    }
    setSyncing(true)
    const { data } = await getCv(cvId)
    if (data) {
      const cv = data as { templateId?: string; fontFamily?: string; accentColor?: string | null }
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
      <div className="flex h-full flex-col lg:flex-row">
        <div className="mx-auto max-w-md space-y-6 p-4 md:p-8 lg:w-[400px] lg:mx-0">
          <Card><CardContent className="space-y-4 p-6">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-10 w-full" />
          </CardContent></Card>
        </div>
      </div>
    )
  }

  return (
    <Container
      size={"2xl"}
      alignment={"none"}
      height={"none"}
      padding={"px-xs"}
      gap={"none"}
      flow={"none"}
      bleed={"none"}
      id="customize"
      className="flex flex-col overflow-y-auto lg:flex-row"
    >
      {/* Settings */}
      <div className="shrink-0 border-b lg:border-b-0 lg:border-r p-4 md:p-8 lg:w-[400px] space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Cover Letter Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Template</Label>
              <Select value={templateId} onValueChange={(v) => update("templateId", v)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {COVER_LETTER_TEMPLATES.map((t) => (
                    <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Font</Label>
              <Select value={fontFamily} onValueChange={(v) => update("fontFamily", v)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {FONT_OPTIONS.map((f) => (
                    <SelectItem key={f.value} value={f.value}>{f.label}</SelectItem>
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
                  const hex = "#" + [r, g, b].map((x) => Math.round(x).toString(16).padStart(2, "0")).join("")
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
              <div className="space-y-2 pt-2 border-t">
                <Label>Match CV style</Label>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full gap-2"
                  onClick={handleSyncWithCv}
                  disabled={syncing}
                >
                  <HugeiconsIcon icon={RefreshIcon} className={cn("size-4", syncing && "animate-spin")} />
                  {syncing ? "Syncing..." : "Copy CV template & colours"}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Template thumbnails */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Choose a template</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              {COVER_LETTER_TEMPLATES.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setPreviewTemplateId(t.id)}
                  className={cn(
                    "rounded-lg border-2 p-1.5 text-left transition-all hover:border-muted-foreground/50",
                    templateId === t.id ? "border-primary" : "border-border"
                  )}
                >
                  <div className="flex items-start justify-center overflow-hidden rounded border bg-white">
                    <CoverLetterTemplatePreview
                      templateId={t.id}
                      scale={0.11}
                      className="overflow-hidden"
                    />
                  </div>
                  <div className="mt-1.5 px-0.5">
                    <div className="text-xs font-medium">{t.name}</div>
                    <div className="mt-0.5 text-[10px] text-muted-foreground leading-tight line-clamp-2">
                      {t.description}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Template preview dialog */}
        {previewTemplateId && (
          <Dialog open={!!previewTemplateId} onOpenChange={(open) => { if (!open) setPreviewTemplateId(null) }}>
            <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {COVER_LETTER_TEMPLATES.find((t) => t.id === previewTemplateId)?.name || "Template Preview"}
                </DialogTitle>
              </DialogHeader>

              {(() => {
                const tpl = COVER_LETTER_TEMPLATES.find((t) => t.id === previewTemplateId)
                if (!tpl) return null
                return (
                  <div className="flex flex-col md:flex-row gap-6">
                    <div className="flex-shrink-0 flex items-start justify-center bg-zinc-50 dark:bg-zinc-900 rounded-lg p-4 overflow-auto min-h-[300px]">
                      <CoverLetterTemplatePreview templateId={tpl.id} scale={0.45} />
                    </div>

                    <div className="flex-1 min-w-0 space-y-4">
                      <div>
                        <h3 className="text-base font-semibold">{tpl.name}</h3>
                      </div>

                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {tpl.description}
                      </p>

                      <DialogFooter className="pt-2 gap-2">
                        <Button variant="outline" onClick={() => setPreviewTemplateId(null)}>
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

      {/* Preview */}
      <div className="flex-1 overflow-y-auto bg-muted/30 p-4 lg:p-8">
        <div className="mx-auto w-full max-w-[210mm]">
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
    </Container>
  )
}
