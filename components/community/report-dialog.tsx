"use client"

import { useState } from "react"
import { toast } from "sonner"
import { HugeiconsIcon } from "@hugeicons/react"
import { Loading03Icon } from "@hugeicons/core-free-icons"
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Field, FieldLabel, FieldError } from "@/components/ui/field"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { reportContent } from "@/lib/actions/community/community-reports"
import { REPORT_REASONS } from "@/schemas/community/report"

interface ReportDialogProps {
  postId?: string
  commentId?: string
  children: React.ReactElement
}

export function ReportDialog({ postId, commentId, children }: ReportDialogProps) {
  const [open, setOpen] = useState(false)
  const [reason, setReason] = useState<string | null>(null)
  const [description, setDescription] = useState("")
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit() {
    if (!reason) {
      toast.error("Please select a reason")
      return
    }
    setSubmitting(true)
    const { error } = await reportContent({ reason, description: description || undefined, postId, commentId })
    setSubmitting(false)

    if (error) {
      toast.error(error)
      return
    }

    toast.success("Report submitted")
    setOpen(false)
    setReason(null)
    setDescription("")
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={children} />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Report content</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Field>
            <FieldLabel htmlFor="reason">Reason</FieldLabel>
            <Select value={reason ?? ""} onValueChange={(v) => setReason(v)}>
              <SelectTrigger id="reason">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {REPORT_REASONS.map((r) => (
                  <SelectItem key={r} value={r}>
                    {r.charAt(0).toUpperCase() + r.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
          <Field>
            <FieldLabel htmlFor="desc">Additional details (optional)</FieldLabel>
            <Textarea
              id="desc"
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Provide any context..."
            />
          </Field>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={submitting}>
            {submitting && <HugeiconsIcon icon={Loading03Icon} className="size-4 animate-spin" />}
            Submit report
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
