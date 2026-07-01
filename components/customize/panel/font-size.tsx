"use client"

import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { useEditorStore } from "@/lib/data/editor/store"
import { useResumeUpdate, PanelTip, ResetDefaults, PANEL_TIPS } from "../_shared"
import type { CvWithRelations } from "@/lib/data/editor/types"

export function FontSizePanel() {
  const { resume, update } = useResumeUpdate()
  if (!resume) return null
  const val = resume.fontScale ?? 1

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <p className="text-sm font-medium">Font Size</p>
        <PanelTip tip={PANEL_TIPS["Font Size"]} />
      </div>
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label>Font scale</Label>
          <span className="text-xs text-muted-foreground">{Math.round(val * 100)}%</span>
        </div>
        <Slider
          defaultValue={[val]}
          value={[val]}
          onValueChange={([v]) => useEditorStore.getState().updateCv({ fontScale: v } as Partial<CvWithRelations>)}
          onValueCommit={([v]) => update("fontScale", v)}
          min={0.5} max={2} step={0.05}
        />
      </div>
      <ResetDefaults fields={{ fontScale: 1 }} resume={resume} update={update} />
    </div>
  )
}
