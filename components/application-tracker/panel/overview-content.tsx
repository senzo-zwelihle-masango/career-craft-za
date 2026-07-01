"use client"

import { useState } from "react"
import { format, formatDistanceToNow } from "date-fns"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  Call02Icon,
  Delete02Icon,
  Edit03Icon,
  Link01Icon,
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
import { DatePicker } from "@/components/ui/date-picker"
import { toast } from "sonner"
import { cn } from "@/lib/utils"
import type { JobWithRelations } from "@/lib/data/editor/application-tracker"
import {
  STATUS_CONFIG,
  EMPLOYMENT_TYPE_LABELS,
  WORK_MODEL_LABELS,
  OFFER_STATUS_LABELS,
} from "@/lib/data/editor/application-tracker"
import { updateJobApplication } from "@/lib/actions/application-tracker"

function Field({
  label,
  children,
}: {
  label: string
  children: React.ReactNode
}) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs text-muted-foreground">{label}</Label>
      {children}
    </div>
  )
}

function EditOverlay({
  job,
  onClose,
  onSave,
}: {
  job: JobWithRelations
  onClose: () => void
  onSave: () => void
}) {
  const [edit, setEdit] = useState({
    title: job.title,
    company: job.company,
    location: job.location || "",
    salaryMin: job.salaryMin ?? undefined,
    salaryMax: job.salaryMax ?? undefined,
    salaryCurrency: job.salaryCurrency || "ZAR",
    jobUrl: job.jobUrl || "",
    employmentType: job.employmentType || "",
    workModel: job.workModel || "",
    source: job.source || "",
    notes: job.notes || "",
    appliedAt: job.appliedAt
      ? format(new Date(job.appliedAt), "yyyy-MM-dd")
      : "",
    followUpAt: job.followUpAt
      ? format(new Date(job.followUpAt), "yyyy-MM-dd")
      : "",
    description: job.description || "",
  })

  async function handleSave() {
    const { error } = await updateJobApplication(job.id, edit)
    if (error) {
      toast.error(error)
      return
    }
    onClose()
    onSave()
    toast.success("Updated")
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/20"
      onClick={onClose}
    >
      <div
        className="m-4 max-h-[85vh] w-full max-w-lg overflow-y-auto rounded-xl bg-popover p-6 shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="mb-5 font-semibold">Edit application</h3>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <Field label="Title">
              <Input
                value={edit.title}
                onChange={(e) => setEdit({ ...edit, title: e.target.value })}
                className="h-9 text-sm"
              />
            </Field>
            <Field label="Company">
              <Input
                value={edit.company}
                onChange={(e) => setEdit({ ...edit, company: e.target.value })}
                className="h-9 text-sm"
              />
            </Field>
          </div>
          <Field label="Location">
            <Input
              value={edit.location}
              onChange={(e) => setEdit({ ...edit, location: e.target.value })}
              className="h-9 text-sm"
            />
          </Field>
          <div className="grid grid-cols-3 gap-3">
            <Field label="Min">
              <Input
                type="number"
                value={edit.salaryMin ?? ""}
                onChange={(e) =>
                  setEdit({
                    ...edit,
                    salaryMin: e.target.value
                      ? parseInt(e.target.value)
                      : undefined,
                  })
                }
                className="h-9 text-sm"
              />
            </Field>
            <Field label="Max">
              <Input
                type="number"
                value={edit.salaryMax ?? ""}
                onChange={(e) =>
                  setEdit({
                    ...edit,
                    salaryMax: e.target.value
                      ? parseInt(e.target.value)
                      : undefined,
                  })
                }
                className="h-9 text-sm"
              />
            </Field>
            <Field label="Currency">
              <Input
                value={edit.salaryCurrency}
                onChange={(e) =>
                  setEdit({ ...edit, salaryCurrency: e.target.value })
                }
                className="h-9 text-sm"
              />
            </Field>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Type">
              <Select
                value={edit.employmentType}
                onValueChange={(v) => setEdit({ ...edit, employmentType: v })}
              >
                <SelectTrigger className="h-9 text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">None</SelectItem>
                  {Object.entries(EMPLOYMENT_TYPE_LABELS).map(([k, l]) => (
                    <SelectItem key={k} value={k}>
                      {l}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
            <Field label="Model">
              <Select
                value={edit.workModel}
                onValueChange={(v) => setEdit({ ...edit, workModel: v })}
              >
                <SelectTrigger className="h-9 text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">None</SelectItem>
                  {Object.entries(WORK_MODEL_LABELS).map(([k, l]) => (
                    <SelectItem key={k} value={k}>
                      {l}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Job URL">
              <Input
                value={edit.jobUrl}
                onChange={(e) => setEdit({ ...edit, jobUrl: e.target.value })}
                className="h-9 text-sm"
              />
            </Field>
            <Field label="Source">
              <Input
                value={edit.source}
                onChange={(e) => setEdit({ ...edit, source: e.target.value })}
                className="h-9 text-sm"
              />
            </Field>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Applied">
              <DatePicker
                value={edit.appliedAt}
                onChange={(v) => setEdit({ ...edit, appliedAt: v })}
              />
            </Field>
            <Field label="Follow-up">
              <DatePicker
                value={edit.followUpAt}
                onChange={(v) => setEdit({ ...edit, followUpAt: v })}
              />
            </Field>
          </div>
          <Field label="Description">
            <Textarea
              value={edit.description}
              onChange={(e) =>
                setEdit({ ...edit, description: e.target.value })
              }
              rows={3}
              className="text-sm"
            />
          </Field>
          <Field label="Notes">
            <Textarea
              value={edit.notes}
              onChange={(e) => setEdit({ ...edit, notes: e.target.value })}
              rows={2}
              className="text-sm"
            />
          </Field>
          <div className="flex justify-end gap-2 pt-1">
            <Button variant="outline" size="sm" onClick={onClose}>
              Cancel
            </Button>
            <Button size="sm" onClick={handleSave}>
              Save
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export function OverviewContent({
  job,
  onUpdate,
  onDelete,
}: {
  job: JobWithRelations
  onUpdate: () => void
  onDelete: () => void
}) {
  const [editing, setEditing] = useState(false)
  const cfg = STATUS_CONFIG[job.status as keyof typeof STATUS_CONFIG]

  const meta: { label: string; value: string; href?: string }[] = []
  if (job.location) meta.push({ label: "Location", value: job.location })
  if (job.salaryMin || job.salaryMax) {
    meta.push({
      label: "Salary",
      value: `${job.salaryCurrency || "ZAR"}${job.salaryMin ? ` ${job.salaryMin.toLocaleString()}` : ""}${job.salaryMin && job.salaryMax ? " – " : ""}${job.salaryMax ? `${job.salaryMax.toLocaleString()}` : ""}`,
    })
  }
  if (job.source) meta.push({ label: "Source", value: job.source })
  if (job.employmentType)
    meta.push({
      label: "Type",
      value: EMPLOYMENT_TYPE_LABELS[job.employmentType] || job.employmentType,
    })
  if (job.workModel)
    meta.push({
      label: "Model",
      value: WORK_MODEL_LABELS[job.workModel] || job.workModel,
    })
  if (job.jobUrl)
    meta.push({ label: "URL", value: "View posting", href: job.jobUrl })

  return (
    <>
      {/* Status bar */}
      <div className="flex items-center gap-3">
        <span
          className={cn(
            "inline-flex items-center gap-1.5 text-sm font-medium",
            cfg?.color
          )}
        >
          <span className={cn("h-2 w-2 rounded-full", cfg?.dot)} />
          {cfg?.label}
        </span>
        {job.employmentType && (
          <span className="text-sm text-muted-foreground/60">·</span>
        )}
        {job.employmentType && (
          <span className="text-sm text-muted-foreground">
            {EMPLOYMENT_TYPE_LABELS[job.employmentType]}
          </span>
        )}
        {job.workModel && (
          <>
            <span className="text-sm text-muted-foreground/60">·</span>
            <span className="text-sm text-muted-foreground">
              {WORK_MODEL_LABELS[job.workModel]}
            </span>
          </>
        )}
      </div>

      {/* Metadata grid */}
      {meta.length > 0 && (
        <div className="grid grid-cols-2 gap-x-6 gap-y-2.5">
          {meta.map((r) =>
            r.href ? (
              <a
                key={r.label}
                href={r.href}
                target="_blank"
                rel="noopener noreferrer"
                className="col-span-2 flex items-center gap-2 text-sm text-blue-600 hover:underline"
              >
                <span className="min-w-[72px] text-xs text-muted-foreground">
                  {r.label}
                </span>
                <span>{r.value}</span>
                <HugeiconsIcon icon={Link01Icon} />
              </a>
            ) : (
              <div key={r.label} className="flex items-baseline gap-2">
                <span className="min-w-[72px] text-xs text-muted-foreground">
                  {r.label}
                </span>
                <span className="truncate text-sm">{r.value}</span>
              </div>
            )
          )}
        </div>
      )}

      {/* Follow-up alert (clean, no card) */}
      {job.followUpAt && (
        <div
          className={cn(
            "flex items-center gap-2 text-sm",
            new Date(job.followUpAt) < new Date()
              ? "text-red-600"
              : "text-amber-600"
          )}
        >
          <HugeiconsIcon icon={Call02Icon} />
          <span className="font-medium">
            {new Date(job.followUpAt) < new Date() ? "Overdue" : "Follow-up"}
          </span>
          <span className="text-muted-foreground">
            {formatDistanceToNow(new Date(job.followUpAt), { addSuffix: true })}
          </span>
        </div>
      )}

      {/* Description */}
      {job.description && (
        <div>
          <h3 className="mb-2 text-xs font-semibold tracking-wider text-muted-foreground uppercase">
            Description
          </h3>
          <p className="text-sm leading-relaxed whitespace-pre-wrap">
            {job.description}
          </p>
        </div>
      )}

      {/* Skills */}
      {job.skills.length > 0 && (
        <div>
          <h3 className="mb-2.5 text-xs font-semibold tracking-wider text-muted-foreground uppercase">
            Skills
          </h3>
          <div className="flex flex-wrap gap-1.5">
            {job.skills.map((s) => (
              <span
                key={s}
                className="inline-block rounded-md bg-muted px-2.5 py-1 text-xs"
              >
                {s}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Interview & Offer summary (text, not cards) */}
      <div className="flex items-center gap-6 text-sm">
        <div>
          <span className="text-muted-foreground">Interviews </span>
          <span className="font-medium">
            {job.interviews.filter((i) => i.completed).length}/
            {job.interviews.length}
          </span>
        </div>
        <div>
          <span className="text-muted-foreground">Offers </span>
          <span className="font-medium">{job.offers.length}</span>
          {job.offers.some((o) => o.status === "accepted") && (
            <span className="ml-1.5 text-emerald-600">· Accepted</span>
          )}
        </div>
        {job.appliedAt && (
          <div>
            <span className="text-muted-foreground">Applied </span>
            <span className="font-medium">
              {format(new Date(job.appliedAt), "d MMM yyyy")}
            </span>
          </div>
        )}
      </div>

      {/* Linked items */}
      {(job.curriculumVitaeId || job.coverLetterId) && (
        <div className="flex items-center gap-6 text-sm">
          {job.curriculumVitaeId && (
            <div>
              <span className="text-muted-foreground">Resume </span>
              <span className="font-medium">Linked</span>
            </div>
          )}
          {job.coverLetterId && (
            <div>
              <span className="text-muted-foreground">Cover letter </span>
              <span className="font-medium">Linked</span>
            </div>
          )}
        </div>
      )}

      {/* Offers summary */}
      {job.offers.length > 0 && (
        <div>
          <h3 className="mb-2.5 text-xs font-semibold tracking-wider text-muted-foreground uppercase">
            Offers
          </h3>
          <div className="space-y-2">
            {job.offers.map((o) => (
              <div key={o.id} className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm">
                  <span className="font-medium">
                    {o.salaryMin || o.salaryMax
                      ? `${o.salaryCurrency || "ZAR"} ${o.salaryMin?.toLocaleString() || ""}${o.salaryMin && o.salaryMax ? " – " : ""}${o.salaryMax?.toLocaleString() || ""}`
                      : "Offer received"}
                  </span>
                  {o.equityInfo && (
                    <span className="text-muted-foreground">
                      · {o.equityInfo}
                    </span>
                  )}
                  {o.bonusInfo && (
                    <span className="text-muted-foreground">
                      · {o.bonusInfo}
                    </span>
                  )}
                </div>
                <span
                  className={cn(
                    "text-xs font-medium",
                    o.status === "accepted" && "text-emerald-600",
                    o.status === "declined" && "text-red-500",
                    o.status === "negotiated" && "text-amber-600",
                    (o.status === "pending" || o.status === "expired") &&
                      "text-muted-foreground"
                  )}
                >
                  {OFFER_STATUS_LABELS[o.status]}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center gap-2 pt-1">
        <Button
          variant="outline"
          size="sm"
          className="h-8 gap-1.5 text-xs"
          onClick={() => setEditing(true)}
        >
          <HugeiconsIcon icon={Edit03Icon} /> Edit
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="h-8 gap-1.5 text-xs text-destructive"
          onClick={onDelete}
        >
          <HugeiconsIcon icon={Delete02Icon} /> Delete
        </Button>
      </div>

      {/* Edit overlay */}
      {editing && (
        <EditOverlay
          job={job}
          onClose={() => setEditing(false)}
          onSave={onUpdate}
        />
      )}
    </>
  )
}
