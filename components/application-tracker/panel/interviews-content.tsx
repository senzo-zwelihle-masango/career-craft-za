"use client"

import { useState } from "react"
import { format } from "date-fns"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  CheckmarkCircle02Icon,
  Delete02Icon,
  PlusSignIcon,
} from "@hugeicons/core-free-icons"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { cn } from "@/lib/utils"
import type { JobWithRelations } from "@/lib/data/application-tracker/data"
import { INTERVIEW_ROUND_LABELS } from "@/lib/data/application-tracker/data"
import {
  createInterview,
  updateInterview,
  deleteInterview,
} from "@/lib/actions/user/application-tracker"

export function InterviewsContent({
  job,
  onUpdate,
}: {
  job: JobWithRelations
  onUpdate: () => void
}) {
  const [adding, setAdding] = useState(false)
  const [form, setForm] = useState({
    round: "phone",
    title: "",
    scheduledAt: "",
    durationMinutes: "",
    location: "",
    meetingLink: "",
    notes: "",
  })

  async function handleAdd() {
    if (!form.scheduledAt) {
      toast.error("Date/time is required")
      return
    }
    const { error } = await createInterview(job.id, {
      round: form.round,
      title: form.title,
      scheduledAt: form.scheduledAt,
      durationMinutes: form.durationMinutes
        ? parseInt(form.durationMinutes)
        : null,
      location: form.location,
      meetingLink: form.meetingLink,
      notes: form.notes,
    })
    if (error) {
      toast.error(error)
      return
    }
    setAdding(false)
    setForm({
      round: "phone",
      title: "",
      scheduledAt: "",
      durationMinutes: "",
      location: "",
      meetingLink: "",
      notes: "",
    })
    onUpdate()
    toast.success("Interview added")
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
          Interviews
        </h3>
        <Button
          variant="outline"
          size="sm"
          className="h-7 gap-1 text-xs"
          onClick={() => setAdding(!adding)}
        >
          <HugeiconsIcon icon={PlusSignIcon} /> Add
        </Button>
      </div>

      {adding && (
        <div className="space-y-3 rounded-lg border bg-muted/20 p-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label className="text-xs">Round</Label>
              <Select
                value={form.round}
                onValueChange={(v) =>
                  v != null && setForm({ ...form, round: v })
                }
              >
                <SelectTrigger className="h-8 text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(INTERVIEW_ROUND_LABELS).map(([k, l]) => (
                    <SelectItem key={k} value={k}>
                      {l}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Duration (min)</Label>
              <Input
                type="number"
                value={form.durationMinutes}
                onChange={(e) =>
                  setForm({ ...form, durationMinutes: e.target.value })
                }
                className="h-8 text-sm"
              />
            </div>
          </div>
          <Input
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            placeholder="Title (optional)"
            className="h-8 text-sm"
          />
          <div className="space-y-1">
            <Label className="text-xs">Date & Time</Label>
            <Input
              type="datetime-local"
              value={form.scheduledAt}
              onChange={(e) =>
                setForm({ ...form, scheduledAt: e.target.value })
              }
              className="h-8 text-sm"
            />
          </div>
          <Input
            value={form.location}
            onChange={(e) => setForm({ ...form, location: e.target.value })}
            placeholder="Location or meeting link"
            className="h-8 text-sm"
          />
          <Textarea
            value={form.notes}
            onChange={(e) => setForm({ ...form, notes: e.target.value })}
            placeholder="Notes"
            rows={2}
            className="text-sm"
          />
          <div className="flex gap-2">
            <Button size="sm" className="h-8 text-sm" onClick={handleAdd}>
              Add
            </Button>
            <Button
              size="sm"
              variant="ghost"
              className="h-8 text-sm"
              onClick={() => setAdding(false)}
            >
              Cancel
            </Button>
          </div>
        </div>
      )}

      {job.interviews.length === 0 ? (
        <p className="py-12 text-center text-sm text-muted-foreground">
          No interviews scheduled
        </p>
      ) : (
        <div className="divide-y divide-border/40">
          {job.interviews.map((iv) => (
            <div key={iv.id} className="group py-3 first:pt-0 last:pb-0">
              <div className="flex items-start justify-between">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span
                      className={cn(
                        "h-2 w-2 shrink-0 rounded-full",
                        iv.completed ? "bg-emerald-500" : "bg-amber-400"
                      )}
                    />
                    <span className="text-sm font-medium">
                      {INTERVIEW_ROUND_LABELS[iv.round] || iv.round}
                    </span>
                    {iv.title && (
                      <span className="text-sm text-muted-foreground">
                        · {iv.title}
                      </span>
                    )}
                  </div>
                  <p className="mt-0.5 text-sm text-muted-foreground">
                    {format(new Date(iv.scheduledAt), "MMM d, yyyy h:mm a")}
                    {iv.durationMinutes && ` · ${iv.durationMinutes} min`}
                  </p>
                  {iv.feedback && (
                    <div className="mt-2 rounded-md bg-muted/30 px-3 py-2 text-sm text-muted-foreground">
                      <span className="text-[11px] font-medium text-muted-foreground/60 uppercase">
                        Feedback
                      </span>
                      <p className="mt-0.5">{iv.feedback}</p>
                    </div>
                  )}
                  {iv.notes && (
                    <p className="mt-1 text-sm text-muted-foreground">
                      {iv.notes}
                    </p>
                  )}
                </div>
                <div className="ml-2 flex shrink-0 gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6"
                    onClick={async () => {
                      await updateInterview(iv.id, { completed: !iv.completed })
                      onUpdate()
                    }}
                  >
                    <HugeiconsIcon icon={CheckmarkCircle02Icon} />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 text-destructive"
                    onClick={async () => {
                      await deleteInterview(iv.id)
                      onUpdate()
                    }}
                  >
                    <HugeiconsIcon icon={Delete02Icon} />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
