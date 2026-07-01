"use client"

import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { useResumeUpdate, PanelTip, ResetDefaults, PANEL_TIPS } from "../_shared"

export function LayoutPanel() {
  const { resume, update } = useResumeUpdate()
  if (!resume) return null

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <p className="text-sm font-medium">Layout</p>
        <PanelTip tip={PANEL_TIPS.Layout} />
      </div>
      <div className="space-y-2">
        <div className="flex items-center gap-1.5">
          <Label>Page format</Label>
        </div>
        <ToggleGroup
          type="single"
          value={resume.pageFormat}
          onValueChange={(v) => update("pageFormat", v)}
          className="justify-start"
        >
          <ToggleGroupItem value="A4">A4</ToggleGroupItem>
          <ToggleGroupItem value="LETTER">US Letter</ToggleGroupItem>
        </ToggleGroup>
      </div>
      <div className="space-y-2">
        <div className="flex items-center gap-1.5">
          <Label>Content width</Label>
        </div>
        <ToggleGroup
          type="single"
          value={resume.contentWidth ?? "standard"}
          onValueChange={(v) => update("contentWidth", v)}
          className="justify-start"
        >
          <ToggleGroupItem value="narrow">Narrow</ToggleGroupItem>
          <ToggleGroupItem value="standard">Standard</ToggleGroupItem>
          <ToggleGroupItem value="wide">Wide</ToggleGroupItem>
        </ToggleGroup>
      </div>
      <div className="space-y-2">
        <div className="flex items-center gap-1.5">
          <Label>Show section dividers</Label>
        </div>
        <Switch
          checked={resume.showDividers ?? true}
          onCheckedChange={(v) => update("showDividers", v)}
        />
      </div>
      <ResetDefaults fields={{ pageFormat: "A4", contentWidth: "standard", showDividers: true }} resume={resume} update={update} />
    </div>
  )
}
