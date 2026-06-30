"use client"

import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { useResumeUpdate, PanelTip, ResetDefaults, PANEL_TIPS } from "../_shared"

export function HeadingsPanel() {
  const { resume, update } = useResumeUpdate()
  if (!resume) return null

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <PanelTip tip={PANEL_TIPS.Headings} />
      </div>
      <div className="space-y-2">
        <div className="flex items-center gap-1.5">
          <Label>Heading style</Label>
        </div>
        <ToggleGroup
          type="single"
          value={resume.headingStyle ?? "normal"}
          onValueChange={(v) => update("headingStyle", v)}
          className="justify-start"
        >
          <ToggleGroupItem value="normal">Normal</ToggleGroupItem>
          <ToggleGroupItem value="uppercase">Uppercase</ToggleGroupItem>
          <ToggleGroupItem value="smallcaps">Small Caps</ToggleGroupItem>
        </ToggleGroup>
      </div>
      <div className="space-y-2">
        <div className="flex items-center gap-1.5">
          <Label>Heading weight</Label>
        </div>
        <ToggleGroup
          type="single"
          value={resume.headingWeight ?? "bold"}
          onValueChange={(v) => update("headingWeight", v)}
          className="justify-start"
        >
          <ToggleGroupItem value="normal">Normal</ToggleGroupItem>
          <ToggleGroupItem value="bold">Bold</ToggleGroupItem>
          <ToggleGroupItem value="semibold">Semi Bold</ToggleGroupItem>
        </ToggleGroup>
      </div>
      <div className="space-y-2">
        <div className="flex items-center gap-1.5">
          <Label>Show section icons</Label>
        </div>
        <Switch
          checked={resume.showSectionIcons ?? false}
          onCheckedChange={(v) => update("showSectionIcons", v)}
        />
      </div>
      <ResetDefaults fields={{ headingStyle: "normal", headingWeight: "bold", showSectionIcons: false }} resume={resume} update={update} />
    </div>
  )
}
