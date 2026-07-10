"use client"

import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { useEditorStore } from "@/lib/data/curriculum-vitae/store"
import {
  useResumeUpdate,
  PanelTip,
  ResetDefaults,
  PANEL_TIPS,
} from "../_shared"
import type { CvWithRelations } from "@/types/curriculum-vitae/types"

interface SpacingControlProps {
  label: string
  field: string
  value: number
  update: (field: string, value: unknown) => void
}

function SpacingControl({ label, field, value, update }: SpacingControlProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label>{label}</Label>
        <span className="text-xs text-muted-foreground">
          {Math.round(value * 100)}%
        </span>
      </div>
      <Slider
        defaultValue={[value]}
        value={[value]}
        onValueChange={(v) =>
          useEditorStore.getState().updateCv({
            [field]: (Array.isArray(v) ? v[0] : v) as number,
          } as Partial<CvWithRelations>)
        }
        onValueCommitted={(v) =>
          update(field, Array.isArray(v) ? v[0] : v)
        }
        min={0.5}
        max={2}
        step={0.05}
      />
    </div>
  )
}

export function SpacingPanel() {
  const { resume, update } = useResumeUpdate()
  if (!resume) return null

  const defaults = {
    lineHeight: 1,
    elementSpacing: 1,
    marginHorizontal: 1,
    marginVertical: 1,
  }

  const controls = [
    {
      label: "Line Height",
      field: "lineHeight",
      value: resume.lineHeight ?? 1,
    },
    {
      label: "Space Between Elements",
      field: "elementSpacing",
      value: resume.elementSpacing ?? 1,
    },
    {
      label: "Left & Right Margin",
      field: "marginHorizontal",
      value: resume.marginHorizontal ?? 1,
    },
    {
      label: "Top & Bottom Margin",
      field: "marginVertical",
      value: resume.marginVertical ?? 1,
    },
  ]

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <p className="text-sm font-medium">Spacing</p>
        <PanelTip tip={PANEL_TIPS.Spacing} />
      </div>
      {controls.map((c) => (
        <SpacingControl key={c.field} {...c} update={update} />
      ))}
      <ResetDefaults fields={defaults} resume={resume} update={update} />
    </div>
  )
}
