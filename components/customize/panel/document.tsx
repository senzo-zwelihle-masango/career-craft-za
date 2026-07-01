"use client"

import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { LANGUAGE_OPTIONS, DATE_FORMAT_OPTIONS } from "@/lib/data/editor/types"
import { useResumeUpdate, PanelTip, ResetDefaults, PANEL_TIPS } from "../_shared"

export function DocumentPanel() {
  const { resume, update } = useResumeUpdate()
  if (!resume) return null
  const r = resume

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <p className="text-sm font-medium">Document</p>
        <PanelTip tip={PANEL_TIPS.Document} />
      </div>
      <div className="space-y-2">
        <div className="flex items-center gap-1.5">
          <Label>Language</Label>
        </div>
        <Select value={r.language} onValueChange={(v) => update("language", v)}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            {LANGUAGE_OPTIONS.map((o) => (
              <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <div className="flex items-center gap-1.5">
          <Label>Date format</Label>
        </div>
        <Select value={r.dateFormat} onValueChange={(v) => update("dateFormat", v)}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            {DATE_FORMAT_OPTIONS.map((o) => (
              <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <ResetDefaults fields={{ language: "en-GB", dateFormat: "MM/YYYY" }} resume={r} update={update} />
    </div>
  )
}
