"use client"

import { useEffect, useState, useCallback, useMemo } from "react"
import { Container } from "@/components/ui/container"
import { Heading } from "@/components/ui/heading"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  Building02Icon,
  GridViewIcon,
  LeftToRightListDashIcon,
  PlusSignIcon,
} from "@hugeicons/core-free-icons"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Skeleton } from "@/components/ui/skeleton"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { toast } from "sonner"
import {
  getJobApplications,
  createJobApplication,
  updateJobApplication,
  deleteJobApplication,
  archiveJobApplication,
} from "@/lib/actions/user/application-tracker"
import { getCvs } from "@/lib/actions/user/curriculum-vitae"
import { getCoverLetters } from "@/lib/actions/user/cover-letter"
import type {
  JobWithRelations,
  FilterState,
} from "@/lib/data/application-tracker/data"
import { defaultFilter } from "@/lib/data/application-tracker/data"
import Filter from "@/components/application-tracker/filter"
import AddJob from "@/components/application-tracker/add-job"
import Kanban from "@/components/application-tracker/kanban"
import { JobDataTable } from "@/components/application-tracker/data-table"
import Panel from "@/components/application-tracker/panel"

const JobTrackerPage = () => {
  const [view, setView] = useState<"table" | "kanban">("table")
  const [jobs, setJobs] = useState<JobWithRelations[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<FilterState>(defaultFilter)
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [selectedJob, setSelectedJob] = useState<JobWithRelations | null>(null)
  const [showDetails, setShowDetails] = useState(false)
  const [resumes, setCvs] = useState<{ id: string; title: string }[]>([])
  const [coverLetters, setCoverLetters] = useState<
    { id: string; title: string }[]
  >([])
  const [addSheetOpen, setAddSheetOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(
    typeof window !== "undefined"
      ? window.matchMedia("(max-width: 1023px)").matches
      : false
  )
  const [panelWidth, setPanelWidth] = useState(420)

  const [deleteConfirm, setDeleteConfirm] = useState<JobWithRelations | null>(
    null
  )

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 1023px)")
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches)
    mq.addEventListener("change", handler)
    return () => mq.removeEventListener("change", handler)
  }, [])

  useEffect(() => {
    Promise.all([getJobApplications(), getCvs(), getCoverLetters()])
      .then(([jr, r, cl]) => {
        if (jr.data) setJobs(jr.data as unknown as JobWithRelations[])
        if (r.data) setCvs(r.data as { id: string; title: string }[])
        if (cl.data) setCoverLetters(cl.data as { id: string; title: string }[])
      })
      .finally(() => setLoading(false))
  }, [])

  const fetchJobs = useCallback(async () => {
    setLoading(true)
    const [jr, r, cl] = await Promise.all([
      getJobApplications(),
      getCvs(),
      getCoverLetters(),
    ])
    if (jr.data) setJobs(jr.data as unknown as JobWithRelations[])
    if (r.data) setCvs(r.data as { id: string; title: string }[])
    if (cl.data) setCoverLetters(cl.data as { id: string; title: string }[])
    setLoading(false)
  }, [])

  // Filtering
  const filteredJobs = useMemo(() => {
    return jobs.filter((j) => {
      if (filter.search) {
        const q = filter.search.toLowerCase()
        if (
          !j.title.toLowerCase().includes(q) &&
          !j.company.toLowerCase().includes(q) &&
          !(j.location || "").toLowerCase().includes(q) &&
          !j.skills.some((s) => s.toLowerCase().includes(q))
        )
          return false
      }
      if (filter.status.length > 0 && !filter.status.includes(j.status))
        return false
      if (
        filter.employmentType.length > 0 &&
        (!j.employmentType || !filter.employmentType.includes(j.employmentType))
      )
        return false
      if (
        filter.workModel.length > 0 &&
        (!j.workModel || !filter.workModel.includes(j.workModel))
      )
        return false
      if (filter.archived === true && !j.archived) return false
      if (filter.archived === false && j.archived) return false
      return true
    })
  }, [jobs, filter])

  const hasActiveFilters =
    filter.search ||
    filter.status.length ||
    filter.employmentType.length ||
    filter.workModel.length ||
    filter.archived !== null

  // Row click
  function handleRowClick(job: JobWithRelations) {
    setSelectedJob(job)
    setShowDetails(true)
  }

  // CRUD
  async function handleCreate(data: Record<string, unknown>) {
    setAddSheetOpen(false)
    const { data: job, error } = await createJobApplication(
      data as Parameters<typeof createJobApplication>[0]
    )
    if (error) {
      toast.error(error)
      return
    }
    setJobs((prev) => [...prev, job as unknown as JobWithRelations])
    toast.success("Application added")
  }

  async function handleStatusChange(id: string, status: string) {
    const { error } = await updateJobApplication(id, { status })
    if (error) {
      toast.error(error)
      return
    }
    setJobs((prev) =>
      prev.map((j) =>
        j.id === id ? { ...j, status: status as typeof j.status } : j
      )
    )
    if (selectedJob?.id === id) {
      setSelectedJob((prev) =>
        prev ? { ...prev, status: status as typeof prev.status } : null
      )
    }
  }

  async function handleArchive(id: string) {
    const { data, error } = await archiveJobApplication(id)
    if (error) {
      toast.error(error)
      return
    }
    const updated = data as { archived: boolean; archivedAt: Date | null }
    setJobs((prev) =>
      prev.map((j) =>
        j.id === id
          ? { ...j, archived: updated.archived, archivedAt: updated.archivedAt }
          : j
      )
    )
    toast.success(updated.archived ? "Archived" : "Restored")
  }

  async function handleDelete(id: string) {
    setDeleteConfirm(null)
    const { error } = await deleteJobApplication(id)
    if (error) {
      toast.error(error)
      return
    }
    setJobs((prev) => prev.filter((j) => j.id !== id))
    if (selectedJob?.id === id) setShowDetails(false)
    toast.success("Deleted")
  }

  return (
    <Container
      size={"2xl"}
      alignment={"none"}
      height={"full"}
      padding={"px-xs"}
      gap={"none"}
      flow={"none"}
      bleed={"none"}
      className="my-2 space-y-2"
      id="application-tracker"
    >
      {/* filter jobs */}
      <div className="shrink-0 space-y-3 pt-4 pb-3 md:pt-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <Heading
              as="h1"
              font="none"
              size="3xl"
              weight="normal"
              tracking="normal"
              leading="none"
              transform="normal"
              italic={false}
              margin={"md"}
            >
              Application Tracker
            </Heading>
            <p className="text-xs text-muted-foreground md:text-sm">
              Manage your job search with table and kanban views.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <ToggleGroup
              value={[view]}
              onValueChange={(v) => {
                const next = v[v.length - 1]
                if (next === "table" || next === "kanban") setView(next)
              }}
            >
              <ToggleGroupItem
                value="table"
                className="h-8 gap-1 px-2.5 text-xs data-[state=on]:bg-muted"
              >
                {/* <List className="h-3.5 w-3.5" />  */}
                <HugeiconsIcon icon={LeftToRightListDashIcon} />
                Table
              </ToggleGroupItem>
              <ToggleGroupItem
                value="kanban"
                className="h-8 gap-1 px-2.5 text-xs data-[state=on]:bg-muted"
              >
                {/* <LayoutGrid className="h-3.5 w-3.5" />  */}
                <HugeiconsIcon icon={GridViewIcon} />
                Kanban
              </ToggleGroupItem>
            </ToggleGroup>
            <Sheet open={addSheetOpen} onOpenChange={setAddSheetOpen}>
              <SheetTrigger render={<Button className="h-9 gap-2 text-sm" />}>
                <HugeiconsIcon icon={PlusSignIcon} />
                Add Job
              </SheetTrigger>
              <SheetContent side="right" className="overflow-y-auto">
                <SheetHeader>
                  <SheetTitle>Add Application</SheetTitle>
                </SheetHeader>
                <div className="mt-6 p-2">
                  <AddJob
                    onSubmit={handleCreate}
                    resumes={resumes}
                    coverLetters={coverLetters}
                    onClose={() => setAddSheetOpen(false)}
                  />
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>

        {/* Filters */}
        <Filter
          filter={filter}
          onChange={setFilter}
          totalJobs={jobs.length}
          filteredCount={filteredJobs.length}
        />
      </div>

      {/* main */}
      {/* Main content */}
      <div className="flex min-h-0 flex-1">
        {loading ? (
          <div className="flex-1 pb-4 md:pb-6">
            {view === "table" ? (
              <div className="overflow-hidden rounded-xl border">
                <div className="space-y-3 p-4">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <Skeleton key={i} className="h-12 w-full" />
                  ))}
                </div>
              </div>
            ) : (
              <div className="flex h-full gap-4">
                {[
                  "WISHLIST",
                  "APPLIED",
                  "INTERVIEWING",
                  "OFFER",
                  "REJECTED",
                ].map((col) => (
                  <div key={col} className="flex-1 rounded-xl bg-muted/30 p-3">
                    <Skeleton className="mb-3 h-5 w-20" />
                    <div className="space-y-3">
                      <Skeleton className="h-28 w-full" />
                      <Skeleton className="h-28 w-full" />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : filteredJobs.length === 0 && !hasActiveFilters ? (
          <div className="flex flex-1 flex-col items-center justify-center px-4 pb-16 text-center">
            {/* <Building2 className="h-12 w-12 text-muted-foreground/30" /> */}
            <HugeiconsIcon icon={Building02Icon} />
            <h3 className="mt-4 font-medium">No applications yet</h3>
            <p className="mt-1 max-w-sm text-sm text-muted-foreground">
              Start tracking your job search. Add your first application to get
              started.
            </p>
            <Button
              onClick={() => setAddSheetOpen(true)}
              className="mt-6 gap-2"
            >
              <HugeiconsIcon icon={PlusSignIcon} />
              Add your first job
            </Button>
          </div>
        ) : (
          <div className="flex min-h-0 flex-1">
            {/* Main content area */}
            <div
              className={`flex-1 overflow-auto pb-4 md:pb-6 ${showDetails ? "hidden lg:block" : ""}`}
            >
              {view === "table" ? (
                <JobDataTable
                  data={filteredJobs}
                  selected={selected}
                  onSelectChange={setSelected}
                  onRowClick={handleRowClick}
                  onStatusChange={handleStatusChange}
                  onArchive={handleArchive}
                  onDelete={(id) => {
                    const job = jobs.find((j) => j.id === id)
                    if (job) setDeleteConfirm(job)
                  }}
                  selectedJobId={selectedJob?.id}
                />
              ) : (
                <div className="h-full">
                  <Kanban
                    jobs={filteredJobs}
                    onStatusChange={handleStatusChange}
                    onRowClick={handleRowClick}
                  />
                </div>
              )}
            </div>

            {/* Details panel */}
            {showDetails && selectedJob && view === "table" && (
              <div
                className="relative hidden shrink-0 flex-col lg:flex"
                style={{ width: panelWidth, minWidth: 340, maxWidth: 420 }}
              >
                <div
                  onMouseDown={(e) => {
                    e.preventDefault()
                    const handle = (ev: MouseEvent) => {
                      const newWidth = window.innerWidth - ev.clientX
                      setPanelWidth(Math.min(420, Math.max(340, newWidth)))
                    }
                    const up = () => {
                      document.removeEventListener("mousemove", handle)
                      document.removeEventListener("mouseup", up)
                    }
                    document.addEventListener("mousemove", handle)
                    document.addEventListener("mouseup", up)
                  }}
                  className="absolute top-0 bottom-0 left-0 z-10 w-1 cursor-col-resize transition-colors hover:bg-primary/20 active:bg-primary/30"
                />
                <Panel
                  job={selectedJob}
                  onClose={() => setShowDetails(false)}
                  onUpdate={fetchJobs}
                  onDelete={() => handleDelete(selectedJob.id)}
                />
              </div>
            )}

            {/* Mobile details overlay */}
            {isMobile && showDetails && selectedJob && view === "table" && (
              <div
                className="fixed inset-0 z-50 flex items-end justify-center bg-black/10 p-0 sm:items-center sm:p-4"
                onClick={() => setShowDetails(false)}
              >
                <div
                  className="relative max-h-[85vh] w-full overflow-hidden rounded-t-xl bg-popover shadow-lg ring-1 ring-foreground/10 sm:max-w-lg sm:rounded-xl"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Panel
                    job={selectedJob}
                    onClose={() => setShowDetails(false)}
                    onUpdate={fetchJobs}
                    onDelete={() => handleDelete(selectedJob.id)}
                  />
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </Container>
  )
}

export default JobTrackerPage
