"use client"

import { Label } from "@/components/ui/label"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { useResumeUpdate, PanelTip, ResetDefaults, PANEL_TIPS } from "../_shared"

export function HeaderPanel() {
  const { resume, update } = useResumeUpdate()
  if (!resume) return null

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <p className="text-sm font-medium">Header</p>
        <PanelTip tip={PANEL_TIPS.Header} />
      </div>
      <div className="space-y-2">
        <div className="flex items-center gap-1.5">
          <Label>Header layout</Label>
        </div>
        <ToggleGroup
          type="single"
          value={resume.headerLayout ?? "stacked"}
          onValueChange={(v) => update("headerLayout", v)}
          className="justify-start"
        >
          <ToggleGroupItem value="stacked">Stacked</ToggleGroupItem>
          <ToggleGroupItem value="inline">Inline</ToggleGroupItem>
          <ToggleGroupItem value="compact">Compact</ToggleGroupItem>
        </ToggleGroup>
      </div>
      <ResetDefaults fields={{ headerLayout: "stacked" }} resume={resume} update={update} />
    </div>
  )
}
