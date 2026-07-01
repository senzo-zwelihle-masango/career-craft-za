"use client"

import { useState } from "react"
import { formatDistanceToNow } from "date-fns"
import { HugeiconsIcon } from "@hugeicons/react"
import { Delete02Icon, PlusSignIcon } from "@hugeicons/core-free-icons"
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
import type { JobWithRelations } from "@/lib/data/editor/application-tracker"
import {
  createTimelineEvent,
  deleteTimelineEvent,
} from "@/lib/actions/application-tracker"

export function TimelineContent({
  job,
  onUpdate,
}: {
  job: JobWithRelations
  onUpdate: () => void
}) {
  const [adding, setAdding] = useState(false)
  const [type, setType] = useState("note")
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")

  const timeline = [...job.timelineEvents].sort(
    (a, b) => new Date(b.eventDate).getTime() - new Date(a.eventDate).getTime()
  )

  async function handleAdd() {
    if (!title.trim()) {
      toast.error("Title is required")
      return
    }
    const { error } = await createTimelineEvent(job.id, {
      type,
      title: title.trim(),
      description,
    })
    if (error) {
      toast.error(error)
      return
    }
    setTitle("")
    setDescription("")
    setAdding(false)
    onUpdate()
    toast.success("Event added")
  }

  const dotColors: Record<string, string> = {
    applied: "bg-blue-500",
    interview: "bg-amber-500",
    offer: "bg-emerald-500",
    "status-change": "bg-violet-500",
    "follow-up": "bg-amber-400",
    note: "bg-slate-400",
    created: "bg-slate-400",
    rejection: "bg-red-400",
  }

  const typeLabels: Record<string, string> = {
    applied: "Applied",
    interview: "Interview",
    offer: "Offer",
    "status-change": "Status Change",
    "follow-up": "Follow-up",
    note: "Note",
    created: "Created",
    rejection: "Rejection",
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
          Activity
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
              <Label className="text-xs">Type</Label>
              <Select value={type} onValueChange={setType}>
                <SelectTrigger className="h-8 text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="note">Note</SelectItem>
                  <SelectItem value="follow-up">Follow-up</SelectItem>
                  <SelectItem value="applied">Applied</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Title</Label>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="What happened?"
                className="h-8 text-sm"
              />
            </div>
          </div>
          <Textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Details (optional)"
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

      {timeline.length === 0 ? (
        <p className="py-12 text-center text-sm text-muted-foreground">
          No activity yet
        </p>
      ) : (
        <div className="relative">
          {timeline.map((event, i) => {
            const dotColor = dotColors[event.type] || "bg-slate-400"
            return (
              <div
                key={event.id}
                className="relative flex gap-4 pb-6 last:pb-0"
              >
                {/* Connecting line */}
                {i < timeline.length - 1 && (
                  <div className="absolute top-5 bottom-0 left-[11px] w-px bg-border/60" />
                )}
                {/* Dot */}
                <div
                  className={cn(
                    "relative mt-1 h-[10px] w-[10px] shrink-0 rounded-full ring-2 ring-background",
                    dotColor
                  )}
                />
                {/* Content */}
                <div className="-mt-0.5 min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">{event.title}</span>
                    <span className="text-[11px] text-muted-foreground/60">
                      {formatDistanceToNow(new Date(event.eventDate), {
                        addSuffix: true,
                      })}
                    </span>
                  </div>
                  <span className="text-[11px] tracking-wider text-muted-foreground/40 uppercase">
                    {typeLabels[event.type] || event.type}
                  </span>
                  {event.description && (
                    <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                      {event.description}
                    </p>
                  )}
                </div>
                <button
                  onClick={async () => {
                    await deleteTimelineEvent(event.id)
                    onUpdate()
                  }}
                  className="self-start p-0.5 text-muted-foreground/40 opacity-0 transition-colors group-hover:opacity-100 hover:text-destructive"
                >
                  <HugeiconsIcon icon={Delete02Icon} />
                </button>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
