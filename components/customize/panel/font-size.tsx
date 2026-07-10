"use client"

import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"

import {
  useResumeUpdate,
  PanelTip,
  ResetDefaults,
  PANEL_TIPS,
} from "../_shared"
import type { CvWithRelations } from "@/types/curriculum-vitae/types"
import { useEditorStore } from "@/lib/data/curriculum-vitae/store"

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
          <span className="text-xs text-muted-foreground">
            {Math.round(val * 100)}%
          </span>
        </div>
        <Slider
          defaultValue={[val]}
          value={[val]}
          onValueChange={(v) =>
            useEditorStore.getState().updateCv({
              fontScale: (Array.isArray(v) ? v[0] : v) as number,
            } as Partial<CvWithRelations>)
          }
          onValueCommitted={(v) =>
            update("fontScale", Array.isArray(v) ? v[0] : v)
          }
          min={0.5}
          max={2}
          step={0.05}
        />
      </div>
      <ResetDefaults
        fields={{ fontScale: 1 }}
        resume={resume}
        update={update}
      />
    </div>
  )
}
