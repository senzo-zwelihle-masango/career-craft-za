"use client"

import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { useEditorStore } from "@/lib/data/editor/store"
import { useResumeUpdate, PanelTip, ResetDefaults, PANEL_TIPS } from "../_shared"
import type { CvWithRelations } from "@/lib/data/editor/types"

export function SpacingPanel() {
  const { resume, update } = useResumeUpdate()
  if (!resume) return null
  const val = resume.spacingScale ?? 1

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <PanelTip tip={PANEL_TIPS.Spacing} />
      </div>
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label>Line spacing</Label>
          <span className="text-xs text-muted-foreground">{Math.round(val * 100)}%</span>
        </div>
        <Slider
          defaultValue={[val]}
          value={[val]}
          onValueChange={([v]) => useEditorStore.getState().updateCv({ spacingScale: v } as Partial<CvWithRelations>)}
          onValueCommit={([v]) => update("spacingScale", v)}
          min={0.5} max={2} step={0.05}
        />
      </div>
      <ResetDefaults fields={{ spacingScale: 1 }} resume={resume} update={update} />
    </div>
  )
}
