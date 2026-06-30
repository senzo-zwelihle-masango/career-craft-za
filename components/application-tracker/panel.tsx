"use client"

import { useState } from "react"
import { format, formatDistanceToNow } from "date-fns"
import { HugeiconsIcon } from "@hugeicons/react"
import { Call02Icon, Cancel01Icon, CheckmarkCircle02Icon, Delete02Icon, Edit03Icon, Link01Icon, PlusSignIcon } from "@hugeicons/core-free-icons"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { DatePicker } from "@/components/ui/date-picker"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

import type { JobWithRelations } from "@/lib/data/editor/application-tracker"
import { STATUS_CONFIG, EMPLOYMENT_TYPE_LABELS, WORK_MODEL_LABELS, INTERVIEW_ROUND_LABELS, OFFER_STATUS_LABELS } from "@/lib/data/editor/application-tracker"
import {
  updateJobApplication, archiveJobApplication,
  createContact, updateContact, deleteContact,
  createTimelineEvent, deleteTimelineEvent,
  createInterview, updateInterview, deleteInterview,
  createOffer, updateOffer, deleteOffer,
} from "@/lib/actions/application-tracker"



{/* <HugeiconsIcon icon={Cancel01Icon} />
<HugeiconsIcon icon={Link01Icon} />
<HugeiconsIcon icon={Call02Icon} />
<HugeiconsIcon icon={PlusSignIcon} />
<HugeiconsIcon icon={Delete02Icon} />
<HugeiconsIcon icon={CheckmarkCircle02Icon} />
<HugeiconsIcon icon={Edit03Icon} /> */}

interface Props {
  job: JobWithRelations
  onClose: () => void
  onUpdate: () => void
  onDelete: () => void
}


// overview
function OverviewContent({ job, onUpdate, onDelete }: { job: JobWithRelations; onUpdate: () => void; onDelete: () => void }) {
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
  if (job.employmentType) meta.push({ label: "Type", value: EMPLOYMENT_TYPE_LABELS[job.employmentType] || job.employmentType })
  if (job.workModel) meta.push({ label: "Model", value: WORK_MODEL_LABELS[job.workModel] || job.workModel })
  if (job.jobUrl) meta.push({ label: "URL", value: "View posting", href: job.jobUrl })

  return (
    <>
      {/* Status bar */}
      <div className="flex items-center gap-3">
        <span className={cn("inline-flex items-center gap-1.5 text-sm font-medium", cfg?.color)}>
          <span className={cn("h-2 w-2 rounded-full", cfg?.dot)} />
          {cfg?.label}
        </span>
        {job.employmentType && (
          <span className="text-sm text-muted-foreground/60">·</span>
        )}
        {job.employmentType && (
          <span className="text-sm text-muted-foreground">{EMPLOYMENT_TYPE_LABELS[job.employmentType]}</span>
        )}
        {job.workModel && (
          <>
            <span className="text-sm text-muted-foreground/60">·</span>
            <span className="text-sm text-muted-foreground">{WORK_MODEL_LABELS[job.workModel]}</span>
          </>
        )}
      </div>

      {/* Metadata grid */}
      {meta.length > 0 && (
        <div className="grid grid-cols-2 gap-x-6 gap-y-2.5">
          {meta.map((r) => (
            r.href ? (
              <a key={r.label} href={r.href} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-blue-600 hover:underline col-span-2"
              >
                <span className="text-muted-foreground min-w-[72px] text-xs">{r.label}</span>
                <span>{r.value}</span>
            <HugeiconsIcon icon={Link01Icon} />
              </a>
            ) : (
              <div key={r.label} className="flex items-baseline gap-2">
                <span className="text-muted-foreground text-xs min-w-[72px]">{r.label}</span>
                <span className="text-sm truncate">{r.value}</span>
              </div>
            )
          ))}
        </div>
      )}

      {/* Follow-up alert (clean, no card) */}
      {job.followUpAt && (
        <div className={cn(
          "flex items-center gap-2 text-sm",
          new Date(job.followUpAt) < new Date() ? "text-red-600" : "text-amber-600",
        )}>
       <HugeiconsIcon icon={Call02Icon} />
          <span className="font-medium">{new Date(job.followUpAt) < new Date() ? "Overdue" : "Follow-up"}</span>
          <span className="text-muted-foreground">{formatDistanceToNow(new Date(job.followUpAt), { addSuffix: true })}</span>
        </div>
      )}

      {/* Description */}
      {job.description && (
        <div>
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Description</h3>
          <p className="text-sm leading-relaxed whitespace-pre-wrap">{job.description}</p>
        </div>
      )}

      {/* Skills */}
      {job.skills.length > 0 && (
        <div>
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2.5">Skills</h3>
          <div className="flex flex-wrap gap-1.5">
            {job.skills.map((s) => (
              <span key={s} className="inline-block rounded-md bg-muted px-2.5 py-1 text-xs">{s}</span>
            ))}
          </div>
        </div>
      )}

      {/* Interview & Offer summary (text, not cards) */}
      <div className="flex items-center gap-6 text-sm">
        <div>
          <span className="text-muted-foreground">Interviews </span>
          <span className="font-medium">{job.interviews.filter((i) => i.completed).length}/{job.interviews.length}</span>
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
            <span className="font-medium">{format(new Date(job.appliedAt), "d MMM yyyy")}</span>
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
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2.5">Offers</h3>
          <div className="space-y-2">
            {job.offers.map((o) => (
              <div key={o.id} className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm">
                  <span className="font-medium">
                    {o.salaryMin || o.salaryMax
                      ? `${o.salaryCurrency || "ZAR"} ${o.salaryMin?.toLocaleString() || ""}${o.salaryMin && o.salaryMax ? " – " : ""}${o.salaryMax?.toLocaleString() || ""}`
                      : "Offer received"}
                  </span>
                  {o.equityInfo && <span className="text-muted-foreground">· {o.equityInfo}</span>}
                  {o.bonusInfo && <span className="text-muted-foreground">· {o.bonusInfo}</span>}
                </div>
                <span className={cn(
                  "text-xs font-medium",
                  o.status === "accepted" && "text-emerald-600",
                  o.status === "declined" && "text-red-500",
                  o.status === "negotiated" && "text-amber-600",
                  (o.status === "pending" || o.status === "expired") && "text-muted-foreground",
                )}>
                  {OFFER_STATUS_LABELS[o.status]}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center gap-2 pt-1">
        <Button variant="outline" size="sm" className="h-8 text-xs gap-1.5" onClick={() => setEditing(true)}>
          <HugeiconsIcon icon={Edit03Icon} /> Edit
        </Button>
        <Button variant="outline" size="sm" className="h-8 text-xs gap-1.5 text-destructive" onClick={onDelete}>
          <HugeiconsIcon icon={Delete02Icon} /> Delete
        </Button>
      </div>

      {/* Edit overlay */}
      {editing && <EditOverlay job={job} onClose={() => setEditing(false)} onSave={onUpdate} />}
    </>
  )
}


// overlay
function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs text-muted-foreground">{label}</Label>
      {children}
    </div>
  )
}

function EditOverlay({ job, onClose, onSave }: { job: JobWithRelations; onClose: () => void; onSave: () => void }) {
  const [edit, setEdit] = useState({
    title: job.title, company: job.company, location: job.location || "",
    salaryMin: job.salaryMin ?? undefined, salaryMax: job.salaryMax ?? undefined,
    salaryCurrency: job.salaryCurrency || "ZAR", jobUrl: job.jobUrl || "",
    employmentType: job.employmentType || "", workModel: job.workModel || "",
    source: job.source || "", notes: job.notes || "",
    appliedAt: job.appliedAt ? format(new Date(job.appliedAt), "yyyy-MM-dd") : "",
    followUpAt: job.followUpAt ? format(new Date(job.followUpAt), "yyyy-MM-dd") : "",
    description: job.description || "",
  })

  async function handleSave() {
    const { error } = await updateJobApplication(job.id, edit)
    if (error) { toast.error(error); return }
    onClose(); onSave(); toast.success("Updated")
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20" onClick={onClose}>
      <div className="bg-popover rounded-xl shadow-lg w-full max-w-lg max-h-[85vh] overflow-y-auto p-6 m-4" onClick={(e) => e.stopPropagation()}>
        <h3 className="font-semibold mb-5">Edit application</h3>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <Field label="Title">
              <Input value={edit.title} onChange={(e) => setEdit({ ...edit, title: e.target.value })} className="h-9 text-sm" />
            </Field>
            <Field label="Company">
              <Input value={edit.company} onChange={(e) => setEdit({ ...edit, company: e.target.value })} className="h-9 text-sm" />
            </Field>
          </div>
          <Field label="Location">
            <Input value={edit.location} onChange={(e) => setEdit({ ...edit, location: e.target.value })} className="h-9 text-sm" />
          </Field>
          <div className="grid grid-cols-3 gap-3">
            <Field label="Min">
              <Input type="number" value={edit.salaryMin ?? ""} onChange={(e) => setEdit({ ...edit, salaryMin: e.target.value ? parseInt(e.target.value) : undefined })} className="h-9 text-sm" />
            </Field>
            <Field label="Max">
              <Input type="number" value={edit.salaryMax ?? ""} onChange={(e) => setEdit({ ...edit, salaryMax: e.target.value ? parseInt(e.target.value) : undefined })} className="h-9 text-sm" />
            </Field>
            <Field label="Currency">
              <Input value={edit.salaryCurrency} onChange={(e) => setEdit({ ...edit, salaryCurrency: e.target.value })} className="h-9 text-sm" />
            </Field>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Type">
              <Select value={edit.employmentType} onValueChange={(v) => setEdit({ ...edit, employmentType: v })}>
                <SelectTrigger className="h-9 text-sm"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="">None</SelectItem>
                  {Object.entries(EMPLOYMENT_TYPE_LABELS).map(([k, l]) => <SelectItem key={k} value={k}>{l}</SelectItem>)}
                </SelectContent>
              </Select>
            </Field>
            <Field label="Model">
              <Select value={edit.workModel} onValueChange={(v) => setEdit({ ...edit, workModel: v })}>
                <SelectTrigger className="h-9 text-sm"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="">None</SelectItem>
                  {Object.entries(WORK_MODEL_LABELS).map(([k, l]) => <SelectItem key={k} value={k}>{l}</SelectItem>)}
                </SelectContent>
              </Select>
            </Field>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Job URL">
              <Input value={edit.jobUrl} onChange={(e) => setEdit({ ...edit, jobUrl: e.target.value })} className="h-9 text-sm" />
            </Field>
            <Field label="Source">
              <Input value={edit.source} onChange={(e) => setEdit({ ...edit, source: e.target.value })} className="h-9 text-sm" />
            </Field>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Applied">
              <DatePicker value={edit.appliedAt} onChange={(v) => setEdit({ ...edit, appliedAt: v })} />
            </Field>
            <Field label="Follow-up">
              <DatePicker value={edit.followUpAt} onChange={(v) => setEdit({ ...edit, followUpAt: v })} />
            </Field>
          </div>
          <Field label="Description">
            <Textarea value={edit.description} onChange={(e) => setEdit({ ...edit, description: e.target.value })} rows={3} className="text-sm" />
          </Field>
          <Field label="Notes">
            <Textarea value={edit.notes} onChange={(e) => setEdit({ ...edit, notes: e.target.value })} rows={2} className="text-sm" />
          </Field>
          <div className="flex justify-end gap-2 pt-1">
            <Button variant="outline" size="sm" onClick={onClose}>Cancel</Button>
            <Button size="sm" onClick={handleSave}>Save</Button>
          </div>
        </div>
      </div>
    </div>
  )
}

// timeline
function TimelineContent({ job, onUpdate }: { job: JobWithRelations; onUpdate: () => void }) {
  const [adding, setAdding] = useState(false)
  const [type, setType] = useState("note")
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")

  const timeline = [...job.timelineEvents].sort((a, b) => new Date(b.eventDate).getTime() - new Date(a.eventDate).getTime())

  async function handleAdd() {
    if (!title.trim()) { toast.error("Title is required"); return }
    const { error } = await createTimelineEvent(job.id, { type, title: title.trim(), description })
    if (error) { toast.error(error); return }
    setTitle(""); setDescription(""); setAdding(false); onUpdate(); toast.success("Event added")
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
        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Activity</h3>
        <Button variant="outline" size="sm" className="h-7 gap-1 text-xs" onClick={() => setAdding(!adding)}>
          <HugeiconsIcon icon={PlusSignIcon} /> Add
        </Button>
      </div>

      {adding && (
        <div className="space-y-3 rounded-lg border p-4 bg-muted/20">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label className="text-xs">Type</Label>
              <Select value={type} onValueChange={setType}>
                <SelectTrigger className="h-8 text-sm"><SelectValue /></SelectTrigger>
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
              <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="What happened?" className="h-8 text-sm" />
            </div>
          </div>
          <Textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Details (optional)" rows={2} className="text-sm" />
          <div className="flex gap-2">
            <Button size="sm" className="h-8 text-sm" onClick={handleAdd}>Add</Button>
            <Button size="sm" variant="ghost" className="h-8 text-sm" onClick={() => setAdding(false)}>Cancel</Button>
          </div>
        </div>
      )}

      {timeline.length === 0 ? (
        <p className="text-sm text-muted-foreground text-center py-12">No activity yet</p>
      ) : (
        <div className="relative">
          {timeline.map((event, i) => {
            const dotColor = dotColors[event.type] || "bg-slate-400"
            return (
              <div key={event.id} className="relative flex gap-4 pb-6 last:pb-0">
                {/* Connecting line */}
                {i < timeline.length - 1 && (
                  <div className="absolute left-[11px] top-5 bottom-0 w-px bg-border/60" />
                )}
                {/* Dot */}
                <div className={cn("relative mt-1 h-[10px] w-[10px] rounded-full shrink-0 ring-2 ring-background", dotColor)} />
                {/* Content */}
                <div className="min-w-0 flex-1 -mt-0.5">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">{event.title}</span>
                    <span className="text-[11px] text-muted-foreground/60">
                      {formatDistanceToNow(new Date(event.eventDate), { addSuffix: true })}
                    </span>
                  </div>
                  <span className="text-[11px] text-muted-foreground/40 uppercase tracking-wider">{typeLabels[event.type] || event.type}</span>
                  {event.description && (
                    <p className="text-sm text-muted-foreground mt-1 leading-relaxed">{event.description}</p>
                  )}
                </div>
                <button
                  onClick={async () => { await deleteTimelineEvent(event.id); onUpdate() }}
                  className="self-start opacity-0 group-hover:opacity-100 hover:text-destructive text-muted-foreground/40 hover:text-destructive transition-colors p-0.5"
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

// notes
function NotesContent({ job, onUpdate }: { job: JobWithRelations; onUpdate: () => void }) {
  const [notes, setNotes] = useState(job.notes || "")
  const [saving, setSaving] = useState(false)

  async function handleSave() {
    setSaving(true)
    const { error } = await updateJobApplication(job.id, { notes })
    if (error) { toast.error(error); return }
    setSaving(false); onUpdate(); toast.success("Notes saved")
  }

  return (
    <div className="space-y-3">
      <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Notes</h3>
      <Textarea
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        placeholder="Add notes about this application..."
        rows={8}
        className="text-sm resize-none"
      />
      <Button size="sm" className="h-8 text-sm" onClick={handleSave} disabled={saving}>
        {saving ? "Saving..." : "Save"}
      </Button>
    </div>
  )
}

// contacts
function ContactsContent({ job, onUpdate }: { job: JobWithRelations; onUpdate: () => void }) {
  const [adding, setAdding] = useState(false)
  const [editing, setEditing] = useState<{ id: string; name: string; role: string | null; email: string | null; phone: string | null; linkedInUrl: string | null; notes: string | null } | null>(null)
  const [form, setForm] = useState({ name: "", role: "", email: "", phone: "", linkedInUrl: "", notes: "" })

  function reset() { setForm({ name: "", role: "", email: "", phone: "", linkedInUrl: "", notes: "" }) }

  async function handleAdd() {
    if (!form.name.trim()) { toast.error("Name is required"); return }
    const { error } = await createContact(job.id, form)
    if (error) { toast.error(error); return }
    reset(); setAdding(false); onUpdate(); toast.success("Contact added")
  }

  async function handleUpdate() {
    if (!editing || !form.name.trim()) return
    const { error } = await updateContact(editing.id, form)
    if (error) { toast.error(error); return }
    setEditing(null); reset(); onUpdate(); toast.success("Updated")
  }

  function startEdit(c: { id: string; name: string; role: string | null; email: string | null; phone: string | null; linkedInUrl: string | null; notes: string | null }) {
    setEditing(c); setForm({ name: c.name, role: c.role || "", email: c.email || "", phone: c.phone || "", linkedInUrl: c.linkedInUrl || "", notes: c.notes || "" })
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Contacts</h3>
        <Button variant="outline" size="sm" className="h-7 gap-1 text-xs" onClick={() => { reset(); setAdding(!adding); setEditing(null) }}>
          <HugeiconsIcon icon={PlusSignIcon} /> Add
        </Button>
      </div>

      {(adding || editing) && (
        <div className="space-y-3 rounded-lg border p-4 bg-muted/20">
          <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Name *" className="h-9 text-sm" />
          <div className="grid grid-cols-2 gap-3">
            <Input value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} placeholder="Role" className="h-9 text-sm" />
            <Input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="Email" className="h-9 text-sm" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="Phone" className="h-9 text-sm" />
            <Input value={form.linkedInUrl} onChange={(e) => setForm({ ...form, linkedInUrl: e.target.value })} placeholder="LinkedIn URL" className="h-9 text-sm" />
          </div>
          <Textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} placeholder="Notes" rows={2} className="text-sm" />
          <div className="flex gap-2">
            <Button size="sm" className="h-8 text-sm" onClick={editing ? handleUpdate : handleAdd}>
              {editing ? "Update" : "Add"}
            </Button>
            <Button size="sm" variant="ghost" className="h-8 text-sm" onClick={() => { setAdding(false); setEditing(null); reset() }}>Cancel</Button>
          </div>
        </div>
      )}

      {job.contacts.length === 0 ? (
        <p className="text-sm text-muted-foreground text-center py-12">No contacts yet</p>
      ) : (
        <div className="divide-y divide-border/40">
          {job.contacts.map((c) => (
            <div key={c.id} className="flex items-start justify-between py-3 first:pt-0 last:pb-0 group">
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium">{c.name}</p>
                {c.role && <p className="text-xs text-muted-foreground">{c.role}</p>}
                {(c.email || c.phone) && (
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {[c.email, c.phone].filter(Boolean).join(" · ")}
                  </p>
                )}
                {c.linkedInUrl && (
                  <a href={c.linkedInUrl} target="_blank" rel="noopener noreferrer"
                    className="inline-flex items-center gap-0.5 text-xs text-blue-600 hover:underline mt-0.5"
                  >
                    LinkedIn <HugeiconsIcon icon={Link01Icon} />
                  </a>
                )}
              </div>
              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0 ml-2">
                <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => startEdit(c)}>
                <HugeiconsIcon icon={Edit03Icon} />
                </Button>
                <Button variant="ghost" size="icon" className="h-6 w-6 text-destructive" onClick={async () => { await deleteContact(c.id); onUpdate() }}>
                  <HugeiconsIcon icon={Delete02Icon} />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}


// interviews
function InterviewsContent({ job, onUpdate }: { job: JobWithRelations; onUpdate: () => void }) {
  const [adding, setAdding] = useState(false)
  const [form, setForm] = useState({ round: "phone", title: "", scheduledAt: "", durationMinutes: "", location: "", meetingLink: "", notes: "" })

  async function handleAdd() {
    if (!form.scheduledAt) { toast.error("Date/time is required"); return }
    const { error } = await createInterview(job.id, {
      round: form.round, title: form.title, scheduledAt: form.scheduledAt,
      durationMinutes: form.durationMinutes ? parseInt(form.durationMinutes) : null,
      location: form.location, meetingLink: form.meetingLink, notes: form.notes,
    })
    if (error) { toast.error(error); return }
    setAdding(false); setForm({ round: "phone", title: "", scheduledAt: "", durationMinutes: "", location: "", meetingLink: "", notes: "" })
    onUpdate(); toast.success("Interview added")
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Interviews</h3>
        <Button variant="outline" size="sm" className="h-7 gap-1 text-xs" onClick={() => setAdding(!adding)}>
          <HugeiconsIcon icon={PlusSignIcon} /> Add
        </Button>
      </div>

      {adding && (
        <div className="space-y-3 rounded-lg border p-4 bg-muted/20">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label className="text-xs">Round</Label>
              <Select value={form.round} onValueChange={(v) => setForm({ ...form, round: v })}>
                <SelectTrigger className="h-8 text-sm"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {Object.entries(INTERVIEW_ROUND_LABELS).map(([k, l]) => <SelectItem key={k} value={k}>{l}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Duration (min)</Label>
              <Input type="number" value={form.durationMinutes} onChange={(e) => setForm({ ...form, durationMinutes: e.target.value })} className="h-8 text-sm" />
            </div>
          </div>
          <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Title (optional)" className="h-8 text-sm" />
          <div className="space-y-1">
            <Label className="text-xs">Date & Time</Label>
            <Input type="datetime-local" value={form.scheduledAt} onChange={(e) => setForm({ ...form, scheduledAt: e.target.value })} className="h-8 text-sm" />
          </div>
          <Input value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} placeholder="Location or meeting link" className="h-8 text-sm" />
          <Textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} placeholder="Notes" rows={2} className="text-sm" />
          <div className="flex gap-2">
            <Button size="sm" className="h-8 text-sm" onClick={handleAdd}>Add</Button>
            <Button size="sm" variant="ghost" className="h-8 text-sm" onClick={() => setAdding(false)}>Cancel</Button>
          </div>
        </div>
      )}

      {job.interviews.length === 0 ? (
        <p className="text-sm text-muted-foreground text-center py-12">No interviews scheduled</p>
      ) : (
        <div className="divide-y divide-border/40">
          {job.interviews.map((iv) => (
            <div key={iv.id} className="py-3 first:pt-0 last:pb-0 group">
              <div className="flex items-start justify-between">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className={cn("h-2 w-2 rounded-full shrink-0", iv.completed ? "bg-emerald-500" : "bg-amber-400")} />
                    <span className="text-sm font-medium">{INTERVIEW_ROUND_LABELS[iv.round] || iv.round}</span>
                    {iv.title && <span className="text-sm text-muted-foreground">· {iv.title}</span>}
                  </div>
                  <p className="text-sm text-muted-foreground mt-0.5">
                    {format(new Date(iv.scheduledAt), "MMM d, yyyy h:mm a")}
                    {iv.durationMinutes && ` · ${iv.durationMinutes} min`}
                  </p>
                  {iv.feedback && (
                    <div className="mt-2 text-sm text-muted-foreground bg-muted/30 rounded-md px-3 py-2">
                      <span className="text-[11px] font-medium text-muted-foreground/60 uppercase">Feedback</span>
                      <p className="mt-0.5">{iv.feedback}</p>
                    </div>
                  )}
                  {iv.notes && <p className="text-sm text-muted-foreground mt-1">{iv.notes}</p>}
                </div>
                <div className="flex gap-1 shrink-0 ml-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button variant="ghost" size="icon" className="h-6 w-6"
                    onClick={async () => { await updateInterview(iv.id, { completed: !iv.completed }); onUpdate() }}>
                    <HugeiconsIcon icon={CheckmarkCircle02Icon} />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-6 w-6 text-destructive"
                    onClick={async () => { await deleteInterview(iv.id); onUpdate() }}>
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


const Panel = ({ job, onClose, onUpdate, onDelete }: Props) => {
   const [tab, setTab] = useState("overview")

  const cfg = STATUS_CONFIG[job.status as keyof typeof STATUS_CONFIG]

  return (
       <div className="h-full flex flex-col">
      {/* ── Header ── */}
      <div className="flex items-start justify-between gap-3 px-6 pt-5 pb-3 shrink-0">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className={cn("h-2.5 w-2.5 rounded-full shrink-0", cfg?.dot)} />
            <h2 className="text-base font-semibold truncate">{job.title}</h2>
          </div>
          <p className="text-sm text-muted-foreground mt-0.5">{job.company}</p>
        </div>
        <div className="flex items-center gap-1 shrink-0">
          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={onClose}>
           <HugeiconsIcon icon={Cancel01Icon} />
          </Button>
        </div>
      </div>

      {/* ── Tabs ── */}
      <Tabs value={tab} onValueChange={setTab} className="flex-1 flex flex-col min-h-0">
        <TabsList className="shrink-0 px-5 gap-0 h-auto bg-transparent border-b border-border/50 rounded-none">
          {["overview", "timeline", "notes", "contacts", "interviews"].map((t) => (
            <TabsTrigger
              key={t}
              value={t}
              className="text-xs px-2.5 py-2 data-[state=active]:text-foreground data-[state=active]:shadow-none rounded-none border-b-2 border-transparent data-[state=active]:border-foreground bg-transparent"
            >
              {t === "overview" ? "Overview" : t.charAt(0).toUpperCase() + t.slice(1)}
            </TabsTrigger>
          ))}
        </TabsList>

        <div className="flex-1 overflow-y-auto">
          <TabsContent value="overview" className="p-6 m-0 space-y-6">
            <OverviewContent job={job} onUpdate={onUpdate} onDelete={onDelete} />
          </TabsContent>
          <TabsContent value="timeline" className="p-6 m-0">
            <TimelineContent job={job} onUpdate={onUpdate} />
          </TabsContent>
          <TabsContent value="notes" className="p-6 m-0">
            <NotesContent job={job} onUpdate={onUpdate} />
          </TabsContent>
          <TabsContent value="contacts" className="p-6 m-0">
            <ContactsContent job={job} onUpdate={onUpdate} />
          </TabsContent>
          <TabsContent value="interviews" className="p-6 m-0 space-y-5">
            <InterviewsContent job={job} onUpdate={onUpdate} />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  )
}

export default Panel