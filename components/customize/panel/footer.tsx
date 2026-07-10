"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  useResumeUpdate,
  PanelTip,
  ResetDefaults,
  PANEL_TIPS,
} from "../_shared"

export function FooterPanel() {
  const { resume, update } = useResumeUpdate()
  if (!resume) return null

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <p className="text-sm font-medium">Footer</p>
        <PanelTip tip={PANEL_TIPS.Footer} />
      </div>
      <div className="space-y-2">
        <div className="flex items-center gap-1.5">
          <Label>Footer text</Label>
        </div>
        <Input
          className="h-10 text-sm"
          value={resume.footer ?? ""}
          onChange={(e) => update("footer", e.target.value)}
          placeholder="e.g. References available upon request"
        />
      </div>
      <ResetDefaults fields={{ footer: "" }} resume={resume} update={update} />
    </div>
  )
}
