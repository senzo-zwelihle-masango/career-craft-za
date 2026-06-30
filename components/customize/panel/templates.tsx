"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog"
import { TEMPLATES } from "@/components/templates"
import { TemplatePreview } from "@/components/templates/template-preview"
import { useResumeUpdate, PanelTip, ResetDefaults, PANEL_TIPS } from "../_shared"

export function TemplatesPanel() {
  const { resume, update } = useResumeUpdate()
  const [previewId, setPreviewId] = useState<string | null>(null)
  if (!resume) return null

  const previewTemplate = previewId ? TEMPLATES.find((t) => t.id === previewId) : null

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <p className="text-sm font-medium">Choose a template</p>
        <PanelTip tip={PANEL_TIPS.Templates} />
      </div>
      <div className="grid gap-3">
        {TEMPLATES.map((t) => (
          <button
            key={t.id}
            onClick={() => setPreviewId(t.id)}
            className={cn(
              "w-full rounded-lg border-2 p-3 text-left transition-all hover:border-foreground/50",
              resume.templateId === t.id
                ? "border-foreground ring-1 ring-foreground"
                : "border-border",
            )}
          >
            <div className="flex items-start gap-3">
              <div
                className={cn(
                  "flex h-24 w-[88px] shrink-0 items-start justify-center overflow-hidden rounded border bg-white",
                  resume.templateId === t.id ? "border-foreground" : "border-border",
                )}
              >
                <div className="relative">
                  <TemplatePreview templateId={t.id} scale={0.11} className="overflow-hidden" />
                </div>
              </div>
              <div>
                <p className="text-sm font-medium">{t.name}</p>
                <p className="text-xs text-muted-foreground">{t.description}</p>
              </div>
            </div>
          </button>
        ))}
      </div>
      <ResetDefaults fields={{ templateId: "classic" }} resume={resume} update={update} />

      <Dialog open={!!previewId} onOpenChange={(open) => { if (!open) setPreviewId(null) }}>
        <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{previewTemplate?.name || "Template Preview"}</DialogTitle>
          </DialogHeader>

          {previewTemplate && (
            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex-shrink-0 flex items-start justify-center bg-zinc-50 dark:bg-zinc-900 rounded-lg p-4 overflow-auto min-h-[300px]">
                <TemplatePreview templateId={previewTemplate.id} scale={0.45} />
              </div>

              <div className="flex-1 min-w-0 space-y-4">
                <div>
                  <h3 className="text-base font-semibold">{previewTemplate.name}</h3>
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {previewTemplate.categories.map((cat) => (
                      <span
                        key={cat}
                        className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary"
                      >
                        {cat}
                      </span>
                    ))}
                    {previewTemplate.supportsPhoto && (
                      <span className="inline-flex items-center rounded-full bg-amber-50 dark:bg-amber-950 px-2.5 py-0.5 text-xs font-medium text-amber-700 dark:text-amber-300">
                        Photo
                      </span>
                    )}
                  </div>
                </div>

                <p className="text-sm text-muted-foreground leading-relaxed">
                  {previewTemplate.description}
                </p>

                <div className="rounded-lg border bg-zinc-50/50 dark:bg-zinc-900/50 p-3 space-y-2 text-xs text-muted-foreground">
                  <div className="flex items-center justify-between">
                    <span>Layout</span>
                    <span className="font-medium text-foreground capitalize">{previewTemplate.columnLayout.replace(/-/g, " ")}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Default font</span>
                    <span className="font-medium text-foreground">{previewTemplate.defaultConfig.fontFamily}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Default heading style</span>
                    <span className="font-medium text-foreground capitalize">{previewTemplate.defaultConfig.headingStyle}</span>
                  </div>
                </div>

                <DialogFooter className="pt-2">
                  <Button variant="outline" onClick={() => setPreviewId(null)}>
                    Cancel
                  </Button>
                  <Button
                    onClick={() => {
                      update("templateId", previewTemplate.id)
                      setPreviewId(null)
                    }}
                  >
                    Use Template
                  </Button>
                </DialogFooter>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
