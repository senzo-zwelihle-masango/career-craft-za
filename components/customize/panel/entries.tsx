"use client"

import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import {
  useResumeUpdate,
  PanelTip,
  ResetDefaults,
  PANEL_TIPS,
} from "../_shared"

export function EntriesPanel() {
  const { resume, update } = useResumeUpdate()
  if (!resume) return null

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <p className="text-sm font-medium">Entries</p>
        <PanelTip tip={PANEL_TIPS.Entries} />
      </div>
      <div className="space-y-2">
        <div className="flex items-center gap-1.5">
          <Label>Entry display style</Label>
        </div>
        <ToggleGroup
          value={[resume.entryStyle ?? "bullet"]}
          onValueChange={(v) => v[0] && update("entryStyle", v[0])}
          className="justify-start"
        >
          <ToggleGroupItem value="bullet">Bullets</ToggleGroupItem>
          <ToggleGroupItem value="paragraph">Paragraph</ToggleGroupItem>
        </ToggleGroup>
      </div>
      <div className="space-y-2">
        <div className="flex items-center gap-1.5">
          <Label>Include dates</Label>
        </div>
        <Switch
          checked={resume.showEntryDates ?? true}
          onCheckedChange={(v) => update("showEntryDates", v)}
        />
      </div>
      <div className="space-y-2">
        <div className="flex items-center gap-1.5">
          <Label>Show location</Label>
        </div>
        <Switch
          checked={resume.showEntryLocation ?? true}
          onCheckedChange={(v) => update("showEntryLocation", v)}
        />
      </div>
      <ResetDefaults
        fields={{
          entryStyle: "bullet",
          showEntryDates: true,
          showEntryLocation: true,
        }}
        resume={resume}
        update={update}
      />
    </div>
  )
}
