"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"
import type { JobWithRelations } from "@/lib/data/editor/application-tracker"
import { updateJobApplication } from "@/lib/actions/application-tracker"

export function NotesContent({
  job,
  onUpdate,
}: {
  job: JobWithRelations
  onUpdate: () => void
}) {
  const [notes, setNotes] = useState(job.notes || "")
  const [saving, setSaving] = useState(false)

  async function handleSave() {
    setSaving(true)
    const { error } = await updateJobApplication(job.id, { notes })
    if (error) {
      toast.error(error)
      return
    }
    setSaving(false)
    onUpdate()
    toast.success("Notes saved")
  }

  return (
    <div className="space-y-3">
      <h3 className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
        Notes
      </h3>
      <Textarea
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        placeholder="Add notes about this application..."
        rows={8}
        className="resize-none text-sm"
      />
      <Button
        size="sm"
        className="h-8 text-sm"
        onClick={handleSave}
        disabled={saving}
      >
        {saving ? "Saving..." : "Save"}
      </Button>
    </div>
  )
}
