"use client"

import { useEffect, useState, useCallback, useMemo } from "react"
import { Container } from "@/components/ui/container"
import { PageHeading } from "@/components/ui/page-heading"
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
import { Dialog, DialogContent } from "@/components/ui/dialog"
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
  const [deleteConfirm, setDeleteConfirm] = useState<JobWithRelations | null>(
    null
  )

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
      size={"full"}
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
            <PageHeading
              title="Application Tracker"
              subtitle="Manage your job search with table and kanban views."
            />
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
      <div className="flex min-h-0 min-w-0 flex-1 overflow-x-hidden">
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
              <div className="flex h-full gap-4 flex-col md:flex-row">
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
          <div className="flex min-h-0 min-w-0 flex-1">
            {/* Main content area */}
            <div className="min-w-0 flex-1 overflow-auto pb-4 md:pb-6">
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

            {/* Details dialog */}
            {showDetails && selectedJob && view === "table" && (
              <Dialog open={showDetails} onOpenChange={(o) => { if (!o) setShowDetails(false) }}>
                <DialogContent
                  className="flex max-h-[85vh] flex-col gap-0 overflow-hidden p-0 sm:max-w-3xl"
                  showCloseButton={false}
                >
                  <Panel
                    job={selectedJob}
                    onClose={() => setShowDetails(false)}
                    onUpdate={fetchJobs}
                    onDelete={() => handleDelete(selectedJob.id)}
                  />
                </DialogContent>
              </Dialog>
            )}
          </div>
        )}
      </div>
    </Container>
  )
}

export default JobTrackerPage
