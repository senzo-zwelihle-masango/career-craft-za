"use client"

import { useEffect, useState, useMemo } from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  BubbleChatSpark01Icon,
  Building02Icon,
  BriefcaseIcon,
  PencilEdit02Icon,
  PlusSignIcon,
  Search01Icon,
} from "@hugeicons/core-free-icons"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Skeleton } from "@/components/ui/skeleton"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { cn } from "@/lib/utils"
import { toast } from "sonner"
import { getJobApplications } from "@/lib/actions/user/application-tracker"
import type { JobWithRelations } from "@/lib/data/application-tracker/data"
import { STATUS_CONFIG } from "@/lib/data/application-tracker/data"
import { AiPrepContent } from "@/components/application-tracker/panel/ai-prep-content"

interface ManualForm {
  title: string
  company: string
  description: string
  skills: string[]
}

function buildManualJob(form: ManualForm): JobWithRelations {
  return {
    id: "manual",
    title: form.title,
    company: form.company || form.title,
    description: form.description,
    skills: form.skills,
    employmentType: null,
    workModel: null,
    interviews: [],
    userId: "",
    status: "saved",
    location: null,
    salaryMin: null,
    salaryMax: null,
    currency: null,
    jobUrl: null,
    dateApplied: null,
    datePosted: null,
    contactName: null,
    contactEmail: null,
    contactPhone: null,
    notes: null,
    order: 0,
    archived: false,
    createdAt: new Date(),
    updatedAt: new Date(),
    timeline: [],
    contacts: [],
  } as unknown as JobWithRelations
}

const INITIAL_MANUAL: ManualForm = {
  title: "",
  company: "",
  description: "",
  skills: [],
}

export default function InterviewPrepPage() {
  const [jobs, setJobs] = useState<JobWithRelations[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [jobKey, setJobKey] = useState(0)
  const [searchQuery, setSearchQuery] = useState("")
  const [dialogOpen, setDialogOpen] = useState(false)
  const [manualForm, setManualForm] = useState<ManualForm>(INITIAL_MANUAL)
  const [manualSkillsInput, setManualSkillsInput] = useState("")

  useEffect(() => {
    getJobApplications().then((res) => {
      if (res.data) {
        const j = res.data as unknown as JobWithRelations[]
        setJobs(j)
        if (j.length > 0) {
          setSelectedId(j[0].id)
        }
      }
    }).finally(() => setLoading(false))
  }, [])

  const filteredJobs = useMemo(() => {
    if (!searchQuery.trim()) return jobs
    const q = searchQuery.toLowerCase()
    return jobs.filter(
      (j) =>
        j.title.toLowerCase().includes(q) ||
        j.company.toLowerCase().includes(q)
    )
  }, [jobs, searchQuery])

  const selectedJob = useMemo(() => {
    if (!selectedId) return null
    if (selectedId === "manual") return null
    return jobs.find((j) => j.id === selectedId) ?? null
  }, [jobs, selectedId])

  const handleManualSubmit = () => {
    if (!manualForm.title.trim()) {
      toast.error("Job title is required")
      return
    }
    if (!manualForm.description.trim()) {
      toast.error("Job description is required")
      return
    }
    setSelectedId("manual")
    setJobKey((k) => k + 1)
    setDialogOpen(false)
  }

  const handleSelectJob = (id: string) => {
    setSelectedId(id)
    setJobKey((k) => k + 1)
  }

  if (loading) {
    return (
      <div className="flex h-full flex-col">
        <div className="flex items-center gap-3 border-b px-6 py-4">
          <Skeleton className="h-8 w-8 rounded-lg" />
          <div className="space-y-1">
            <Skeleton className="h-5 w-48" />
            <Skeleton className="h-3.5 w-32" />
          </div>
        </div>
        <div className="grid flex-1 grid-cols-[300px_1fr]">
          <div className="border-r p-4 space-y-3">
            <Skeleton className="h-8 w-full" />
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-14 w-full" />
            ))}
          </div>
          <div className="p-6">
            <Skeleton className="h-32 w-full" />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-full flex-col">
      {/* ── Header ── */}
      <div className="flex items-center justify-between border-b px-6 py-3">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
            <HugeiconsIcon
              icon={BubbleChatSpark01Icon}
              className="h-4 w-4 text-primary"
            />
          </div>
          <div>
            <h1 className="text-sm font-semibold">AI Interview Prep</h1>
            <p className="text-xs text-muted-foreground">
              Practice questions tailored to each job
            </p>
          </div>
        </div>
      </div>

      <div className="grid flex-1 grid-cols-[300px_1fr] overflow-hidden">
        {/* ── Sidebar ── */}
        <div className="flex flex-col border-r bg-muted/20">
          <div className="border-b p-3 space-y-2">
            <div className="relative">
              <HugeiconsIcon
                icon={Search01Icon}
                className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground/50 pointer-events-none"
              />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search jobs..."
                className="h-8 pl-8 text-xs"
              />
            </div>
            <Button
              variant="outline"
              size="sm"
              className="h-7 w-full gap-1.5 text-xs"
              onClick={() => {
                setManualForm(INITIAL_MANUAL)
                setManualSkillsInput("")
                setDialogOpen(true)
              }}
            >
              <HugeiconsIcon icon={PlusSignIcon} className="size-3.5" />
              Manual Entry
            </Button>
          </div>

          <ScrollArea className="flex-1">
            {filteredJobs.length === 0 ? (
              <div className="flex flex-col items-center justify-center gap-2 px-4 py-12">
                <HugeiconsIcon
                  icon={BriefcaseIcon}
                  className="h-8 w-8 text-muted-foreground/20"
                />
                <p className="text-xs text-muted-foreground">
                  {searchQuery ? "No jobs match your search" : "No jobs tracked"}
                </p>
                {!searchQuery && (
                  <p className="text-[11px] text-muted-foreground/60 text-center">
                    Track jobs in the Application Tracker first, or add a manual
                    entry above
                  </p>
                )}
              </div>
            ) : (
              <div className="divide-y">
                {filteredJobs.map((job) => {
                  const cfg = STATUS_CONFIG[job.status as keyof typeof STATUS_CONFIG]
                  const isSelected = job.id === selectedId
                  const upcomingInterviews = job.interviews.filter(
                    (i) => !i.completed
                  )

                  return (
                    <button
                      key={job.id}
                      type="button"
                      className={cn(
                        "flex w-full items-start gap-3 px-4 py-3 text-left transition-colors hover:bg-muted/50",
                        isSelected && "bg-muted"
                      )}
                      onClick={() => handleSelectJob(job.id)}
                    >
                      <span
                        className={cn(
                          "mt-1.5 h-2 w-2 shrink-0 rounded-full",
                          cfg?.dot
                        )}
                      />
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium leading-snug">
                          {job.title}
                        </p>
                        <p className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground">
                          <HugeiconsIcon
                            icon={Building02Icon}
                            className="size-3 shrink-0"
                          />
                          <span className="truncate">{job.company}</span>
                        </p>
                        <div className="mt-1.5 flex items-center gap-2">
                          <span
                            className={cn(
                              "inline-block rounded-full px-2 py-0.5 text-[10px] font-medium",
                              cfg?.bg,
                              cfg?.color
                            )}
                          >
                            {job.status}
                          </span>
                          {upcomingInterviews.length > 0 && (
                            <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-medium text-amber-700 dark:bg-amber-900/30 dark:text-amber-300">
                              {upcomingInterviews.length} upcoming
                            </span>
                          )}
                        </div>
                      </div>
                    </button>
                  )
                })}
              </div>
            )}
          </ScrollArea>
        </div>

        {/* ── Main Content ── */}
        <div className="flex flex-col overflow-hidden">
          {selectedId && selectedJob ? (
            <ScrollArea className="flex-1">
              <div className="mx-auto max-w-2xl p-6">
                <AiPrepContent
                  key={jobKey}
                  job={selectedJob}
                  onUpdate={() => {}}
                />
              </div>
            </ScrollArea>
          ) : selectedId === "manual" ? (
            <ManualPrepView
              form={manualForm}
              onFormChange={setManualForm}
              onGenerate={() => {}}
              jobKey={jobKey}
            />
          ) : (
            <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-muted">
                <HugeiconsIcon
                  icon={BubbleChatSpark01Icon}
                  className="h-7 w-7 text-muted-foreground/30"
                />
              </div>
              <div className="text-center max-w-sm">
                <p className="text-sm font-medium text-foreground">
                  Select a job to prep for
                </p>
                <p className="mt-1 text-xs text-muted-foreground/60">
                  Choose a job from the sidebar to generate interview questions
                  and practice, or add a manual entry with a job description
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── Manual Entry Dialog ── */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Manual Job Entry</DialogTitle>
            <DialogDescription>
              Paste a job description to generate interview prep without
              tracking the application
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs font-medium">Job Title *</Label>
                <Input
                  value={manualForm.title}
                  onChange={(e) =>
                    setManualForm({ ...manualForm, title: e.target.value })
                  }
                  placeholder="e.g. Senior Software Engineer"
                  className="h-9 text-sm"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-medium">Company</Label>
                <Input
                  value={manualForm.company}
                  onChange={(e) =>
                    setManualForm({ ...manualForm, company: e.target.value })
                  }
                  placeholder="e.g. Acme Corp"
                  className="h-9 text-sm"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-medium">Job Description *</Label>
              <Textarea
                value={manualForm.description}
                onChange={(e) =>
                  setManualForm({ ...manualForm, description: e.target.value })
                }
                placeholder="Paste the full job description here..."
                rows={6}
                className="text-sm resize-none"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-medium">
                Skills{" "}
                <span className="text-muted-foreground/60 font-normal">
                  (comma-separated)
                </span>
              </Label>
              <Input
                value={manualSkillsInput}
                onChange={(e) => {
                  setManualSkillsInput(e.target.value)
                  setManualForm({
                    ...manualForm,
                    skills: e.target.value
                      .split(",")
                      .map((s) => s.trim())
                      .filter(Boolean),
                  })
                }}
                placeholder="React, TypeScript, Node.js"
                className="h-9 text-sm"
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button size="sm" onClick={handleManualSubmit}>
              <HugeiconsIcon
                icon={BubbleChatSpark01Icon}
                className="mr-1.5 size-3.5"
              />
              Generate Prep
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

function ManualPrepView({
  form,
  onFormChange,
  onGenerate: _onGenerate,
  jobKey,
}: {
  form: ManualForm
  onFormChange: (f: ManualForm) => void
  onGenerate: () => void
  jobKey: number
}) {
  const manualJob = useMemo(() => buildManualJob(form), [form])

  return (
    <ScrollArea className="flex-1">
      <div className="mx-auto max-w-2xl p-6">
        <AiPrepContent
          key={jobKey}
          job={manualJob}
          onUpdate={() => {}}
        />
      </div>
    </ScrollArea>
  )
}
