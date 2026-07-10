"use client"

import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  useResumeUpdate,
  PanelTip,
  ResetDefaults,
  PANEL_TIPS,
} from "../_shared"

export function FontPanel() {
  const { resume, update } = useResumeUpdate()
  if (!resume) return null

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <p className="text-sm font-medium">Font</p>
        <PanelTip tip={PANEL_TIPS.Font} />
      </div>
      <div className="space-y-2">
        <div className="flex items-center gap-1.5">
          <Label>Font family</Label>
        </div>
        <Select
          value={resume.fontFamily}
          onValueChange={(v) => update("fontFamily", v)}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="serif">Serif (Georgia, Times)</SelectItem>
            <SelectItem value="sans-serif">
              Sans-Serif (Arial, Helvetica)
            </SelectItem>
            <SelectItem value="monospace">
              Monospace (Courier, Consolas)
            </SelectItem>
            <SelectItem value="Inter">Inter</SelectItem>
            <SelectItem value="Georgia">Georgia</SelectItem>
            <SelectItem value="Times New Roman">Times New Roman</SelectItem>
            <SelectItem value="Calibri">Calibri</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <ResetDefaults
        fields={{ fontFamily: "sans-serif" }}
        resume={resume}
        update={update}
      />
    </div>
  )
}
