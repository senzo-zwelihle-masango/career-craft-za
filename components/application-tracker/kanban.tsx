"use client"

import { useMemo } from "react"
import { formatDistanceToNow } from "date-fns"
import {
  DndContext,
  closestCorners,
  PointerSensor,
  useSensor,
  useSensors,
  useDroppable,
  type DragEndEvent,
} from "@dnd-kit/core"
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { cn } from "@/lib/utils"
import type { JobWithRelations } from "@/lib/data/application-tracker/data"
import { STATUS_CONFIG } from "@/lib/data/application-tracker/data"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  Building02Icon,
  Calendar01Icon,
  MapsLocation01Icon,
  GripVertical,
  Link01Icon,
} from "@hugeicons/core-free-icons"

interface Props {
  jobs: JobWithRelations[]
  onStatusChange: (id: string, status: string) => void
  onRowClick: (job: JobWithRelations) => void
}

const COLUMNS = [
  { id: "WISHLIST", label: "Wishlist" },
  { id: "APPLIED", label: "Applied" },
  { id: "INTERVIEWING", label: "Interviewing" },
  { id: "OFFER", label: "Offer" },
  { id: "REJECTED", label: "Rejected" },
]

function SortableCard({
  job,
  onClick,
}: {
  job: JobWithRelations
  onClick: () => void
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: job.id,
    data: { type: "card", status: job.status },
  })

  const cfg = STATUS_CONFIG[job.status as keyof typeof STATUS_CONFIG]

  return (
    <div
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.4 : 1,
      }}
      onClick={onClick}
      className="group cursor-pointer rounded-lg border bg-card p-3 transition-shadow hover:shadow-sm"
    >
      <div className="flex items-start gap-2">
        <button
          className="mt-0.5 cursor-grab touch-none text-muted-foreground/30 hover:text-muted-foreground"
          {...attributes}
          {...listeners}
        >
          <HugeiconsIcon icon={GripVertical} className="size-4" />
        </button>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <span className={cn("h-2 w-2 shrink-0 rounded-full", cfg?.dot)} />
            <h4 className="truncate text-sm leading-tight font-medium">
              {job.title}
            </h4>
          </div>
          <div className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
            <HugeiconsIcon icon={Building02Icon} className="size-4 shrink-0" />
            <span className="truncate">{job.company}</span>
          </div>
          {job.location && (
            <div className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground">
              <HugeiconsIcon
                icon={MapsLocation01Icon}
                className="size-4 shrink-0"
              />
              <span className="truncate">{job.location}</span>
            </div>
          )}
          <div className="mt-1.5 flex items-center gap-1.5 text-[10px] text-muted-foreground/70">
            <HugeiconsIcon icon={Calendar01Icon} className="size-4" />
            {job.appliedAt
              ? formatDistanceToNow(new Date(job.appliedAt), {
                  addSuffix: true,
                })
              : formatDistanceToNow(new Date(job.createdAt), {
                  addSuffix: true,
                })}
            {job.skills.length > 0 && (
              <>
                <span className="text-muted-foreground/30">·</span>
                <span>
                  {job.skills.slice(0, 2).join(", ")}
                  {job.skills.length > 2 ? "..." : ""}
                </span>
              </>
            )}
          </div>
          {job.jobUrl && (
            <a
              href={job.jobUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="mt-1 inline-flex items-center gap-0.5 text-[10px] hover:underline"
            >
              <HugeiconsIcon icon={Link01Icon} className="size-4" />
              View posting
            </a>
          )}
        </div>
      </div>
    </div>
  )
}

function Column({
  id,
  label,
  items,
  onRowClick,
}: {
  id: string
  label: string
  items: JobWithRelations[]
  onRowClick: (job: JobWithRelations) => void
}) {
  const { setNodeRef, isOver } = useDroppable({
    id,
    data: { type: "column", status: id },
  })
  const cfg = STATUS_CONFIG[id as keyof typeof STATUS_CONFIG]

  return (
    <div className="flex max-w-[300px] min-w-[260px] flex-1 flex-col">
      <div className="mb-2 flex items-center justify-between px-1">
        <div className="flex items-center gap-1.5">
          <span className={cn("h-2 w-2 rounded-full", cfg?.dot)} />
          <h3 className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
            {label}
          </h3>
        </div>
        <span className="rounded-md bg-muted px-1.5 py-0.5 text-[11px] font-medium text-muted-foreground">
          {items.length}
        </span>
      </div>

      <div
        ref={setNodeRef}
        className={cn(
          "min-h-[120px] flex-1 space-y-2 rounded-lg border p-2 transition-colors",
          isOver
            ? "border-primary/40 bg-primary/5"
            : "border-dashed border-border/50"
        )}
      >
        <SortableContext
          items={items.map((j) => j.id)}
          strategy={verticalListSortingStrategy}
        >
          {items.length === 0 ? (
            <div className="flex h-full min-h-[80px] items-center justify-center rounded-md border border-dashed border-border/30">
              <p className="text-[11px] text-muted-foreground/40">Drop here</p>
            </div>
          ) : (
            items.map((job) => (
              <SortableCard
                key={job.id}
                job={job}
                onClick={() => onRowClick(job)}
              />
            ))
          )}
        </SortableContext>
      </div>
    </div>
  )
}

const Kanban = ({ jobs, onStatusChange, onRowClick }: Props) => {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  )

  const grouped = useMemo(() => {
    const g: Record<string, JobWithRelations[]> = {}
    for (const c of COLUMNS) g[c.id] = []
    for (const j of jobs) {
      if (g[j.status]) g[j.status].push(j)
    }
    return g
  }, [jobs])

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event
    if (!over) return
    const job = jobs.find((j) => j.id === active.id)
    if (!job) return

    // Determine target column from over target
    let targetCol: string | null = null
    const overData = over.data.current
    if (overData?.type === "column") {
      targetCol = overData.status
    } else if (overData?.type === "card") {
      targetCol = overData.status
    } else if (COLUMNS.some((c) => c.id === over.id)) {
      targetCol = over.id as string
    }

    if (targetCol && targetCol !== job.status) {
      onStatusChange(job.id, targetCol)
    }
  }
  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragEnd={handleDragEnd}
    >
      <div className="flex h-full gap-3 overflow-x-auto pb-4">
        {COLUMNS.map((col) => (
          <Column
            key={col.id}
            id={col.id}
            label={col.label}
            items={grouped[col.id] || []}
            onRowClick={onRowClick}
          />
        ))}
      </div>
    </DndContext>
  )
}

export default Kanban
