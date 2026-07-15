"use client"

import { useMemo, useState, useCallback, useEffect } from "react"
import { formatDistanceToNow } from "date-fns"
import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  useReactTable,
  createColumnHelper,
  type SortingState,
  type VisibilityState,
  type Row,
} from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { cn } from "@/lib/utils"
import type { JobWithRelations } from "@/lib/data/application-tracker/data"
import {
  STATUS_CONFIG,
  EMPLOYMENT_TYPE_LABELS,
  WORK_MODEL_LABELS,
} from "@/lib/data/application-tracker/data"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  ArchiveIcon,
  ArrowDown01Icon,
  ArrowLeft01Icon,
  ArrowRight01Icon,
  ArrowUp01Icon,
  Building02Icon,
  Calendar01Icon,
  CheckmarkCircle02Icon,
  Delete02Icon,
  MapsLocation01Icon,
  MoreHorizontalIcon,
  ViewIcon,
  ViewOffSlashIcon,
} from "@hugeicons/core-free-icons"

interface Props {
  data: JobWithRelations[]
  selected: Set<string>
  onSelectChange: (ids: Set<string>) => void
  onRowClick: (job: JobWithRelations) => void
  onStatusChange: (id: string, status: string) => void
  onArchive: (id: string) => void
  onDelete: (id: string) => void
  selectedJobId?: string | null
}

const helper = createColumnHelper<JobWithRelations>()

const SORT_BTN =
  "flex items-center gap-1 text-xs font-medium text-muted-foreground hover:text-foreground whitespace-nowrap"

export function JobDataTable({
  data,
  selected,
  onSelectChange,
  onRowClick,
  onStatusChange,
  onArchive,
  onDelete,
  selectedJobId,
}: Props) {
  const [isMobile, setIsMobile] = useState(false)
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)")
    setIsMobile(mq.matches)
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches)
    mq.addEventListener("change", handler)
    return () => mq.removeEventListener("change", handler)
  }, [])

  const [sorting, setSorting] = useState<SortingState>([
    { id: "appliedAt", desc: true },
  ])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({
    location: true,
    type: true,
    skills: true,
    source: true,
    company: true,
  })
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 25 })

  const columns = useMemo(
    () => [
      helper.display({
        id: "select",
        header: ({ table }) => (
          <Checkbox
            checked={table
              .getRowModel()
              .rows.every((r) => selected.has(r.original.id))}
            onCheckedChange={(v) => {
              if (v) onSelectChange(new Set(data.map((j) => j.id)))
              else onSelectChange(new Set())
            }}
          />
        ),
        cell: ({ row }) => (
          <Checkbox
            checked={selected.has(row.original.id)}
            onCheckedChange={() => {
              const next = new Set(selected)
              if (next.has(row.original.id)) next.delete(row.original.id)
              else next.add(row.original.id)
              onSelectChange(next)
            }}
            onClick={(e) => e.stopPropagation()}
          />
        ),
        size: 36,
        enableSorting: false,
      }),
      helper.accessor("title", {
        header: ({ column }) => (
          <button onClick={() => column.toggleSorting()} className={SORT_BTN}>
            Title
            {column.getIsSorted() === "asc" ? (
              <HugeiconsIcon icon={ArrowUp01Icon} />
            ) : column.getIsSorted() === "desc" ? (
              <HugeiconsIcon icon={ArrowDown01Icon} />
            ) : (
              <HugeiconsIcon icon={ArrowDown01Icon} />
            )}
          </button>
        ),
        cell: ({ row }) => (
          <div className="min-w-0">
            <p className="truncate text-sm font-medium">{row.original.title}</p>
            <p className="truncate text-xs text-muted-foreground">
              {row.original.company}
            </p>
          </div>
        ),
        enableSorting: true,
      }),
      helper.accessor("company", {
        header: ({ column }) => (
          <button onClick={() => column.toggleSorting()} className={SORT_BTN}>
            Company
            {column.getIsSorted() === "asc" ? (
              <HugeiconsIcon icon={ArrowUp01Icon} />
            ) : column.getIsSorted() === "desc" ? (
              <HugeiconsIcon icon={ArrowDown01Icon} />
            ) : (
              <HugeiconsIcon icon={ArrowDown01Icon} />
            )}
          </button>
        ),
        cell: ({ getValue }) => (
          <div className="truncate text-sm">{getValue()}</div>
        ),
        enableSorting: true,
      }),
      helper.accessor("location", {
        header: ({ column }) => (
          <button onClick={() => column.toggleSorting()} className={SORT_BTN}>
            Location
            {column.getIsSorted() === "asc" ? (
              <HugeiconsIcon icon={ArrowUp01Icon} />
            ) : column.getIsSorted() === "desc" ? (
              <HugeiconsIcon icon={ArrowDown01Icon} />
            ) : (
              <HugeiconsIcon icon={ArrowDown01Icon} />
            )}
          </button>
        ),
        cell: ({ getValue }) => (
          <div className="truncate text-sm text-muted-foreground">
            {getValue() || "–"}
          </div>
        ),
        enableSorting: true,
      }),
      helper.display({
        id: "type",
        header: "Type",
        cell: ({ row }) => {
          const parts: string[] = []
          if (row.original.employmentType)
            parts.push(
              EMPLOYMENT_TYPE_LABELS[row.original.employmentType] ||
                row.original.employmentType
            )
          if (row.original.workModel)
            parts.push(
              WORK_MODEL_LABELS[row.original.workModel] ||
                row.original.workModel
            )
          return (
            <div className="truncate text-sm text-muted-foreground">
              {parts.join(", ") || "–"}
            </div>
          )
        },
        enableSorting: false,
      }),
      helper.accessor("skills", {
        id: "skills",
        header: "Skills",
        cell: ({ getValue }) => {
          const skills = getValue()
          if (!skills.length)
            return <span className="text-sm text-muted-foreground">–</span>
          return (
            <div className="flex flex-wrap gap-1">
              {skills.slice(0, 2).map((s: string) => (
                <span
                  key={s}
                  className="inline-block rounded bg-muted px-1.5 py-0.5 text-[11px] text-muted-foreground"
                >
                  {s}
                </span>
              ))}
              {skills.length > 2 && (
                <span className="text-[11px] text-muted-foreground">
                  +{skills.length - 2}
                </span>
              )}
            </div>
          )
        },
        enableSorting: false,
      }),
      helper.accessor("source", {
        id: "source",
        header: "Source",
        cell: ({ getValue }) => (
          <div className="truncate text-sm text-muted-foreground">
            {getValue() || "–"}
          </div>
        ),
        enableSorting: false,
      }),
      helper.accessor("status", {
        header: ({ column }) => (
          <button onClick={() => column.toggleSorting()} className={SORT_BTN}>
            Status
            {column.getIsSorted() === "asc" ? (
              <HugeiconsIcon icon={ArrowUp01Icon} />
            ) : column.getIsSorted() === "desc" ? (
              <HugeiconsIcon icon={ArrowDown01Icon} />
            ) : (
              <HugeiconsIcon icon={ArrowDown01Icon} />
            )}
          </button>
        ),
        cell: ({ row }) => {
          const cfg =
            STATUS_CONFIG[row.original.status as keyof typeof STATUS_CONFIG]
          return (
            <span className="inline-flex items-center gap-1.5 truncate text-sm">
              <span className={cn("h-2 w-2 rounded-full", cfg?.dot)} />
              {cfg?.label}
            </span>
          )
        },
        enableSorting: true,
      }),
      helper.accessor((row) => row.appliedAt || row.createdAt, {
        id: "appliedAt",
        header: ({ column }) => (
          <button onClick={() => column.toggleSorting()} className={SORT_BTN}>
            Applied
            {column.getIsSorted() === "asc" ? (
              <HugeiconsIcon icon={ArrowUp01Icon} />
            ) : column.getIsSorted() === "desc" ? (
              <HugeiconsIcon icon={ArrowDown01Icon} />
            ) : (
              <HugeiconsIcon icon={ArrowDown01Icon} />
            )}
          </button>
        ),
        cell: ({ row }) => {
          const date = row.original.appliedAt || row.original.createdAt
          return (
            <span className="truncate text-sm text-muted-foreground">
              {formatDistanceToNow(new Date(date), { addSuffix: true })}
            </span>
          )
        },
        enableSorting: true,
      }),
      helper.display({
        id: "actions",
        size: 44,
        enableSorting: false,
        cell: ({ row }) => (
          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <Button variant="ghost" size="icon" className="h-7 w-7" />
              }
              onClick={(e) => e.stopPropagation()}
            >
              <HugeiconsIcon icon={MoreHorizontalIcon} />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-44">
              {Object.entries(STATUS_CONFIG).map(([key, cfg]) => (
                <DropdownMenuItem
                  key={key}
                  onClick={(e) => {
                    e.stopPropagation()
                    onStatusChange(row.original.id, key)
                  }}
                >
                  <span className={cn("mr-2 h-2 w-2 rounded-full", cfg.dot)} />
                  {cfg.label}
                </DropdownMenuItem>
              ))}
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={(e) => {
                  e.stopPropagation()
                  onArchive(row.original.id)
                }}
              >
                {row.original.archived ? (
                  <>
                    {" "}
                    <HugeiconsIcon icon={CheckmarkCircle02Icon} /> Restore
                  </>
                ) : (
                  <>
                    {" "}
                    <HugeiconsIcon icon={ArchiveIcon} /> Archive
                  </>
                )}
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={(e) => {
                  e.stopPropagation()
                  onDelete(row.original.id)
                }}
                className="text-destructive"
              >
                <HugeiconsIcon icon={Delete02Icon} />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ),
      }),
    ],
    [data, selected, onSelectChange, onStatusChange, onArchive, onDelete]
  )

  const table = useReactTable({
    data,
    columns,
    state: { sorting, columnVisibility, pagination },
    onSortingChange: setSorting,
    onColumnVisibilityChange: setColumnVisibility,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getRowId: (row) => row.id,
  })

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent, row: Row<JobWithRelations>) => {
      if (e.key === "Enter") {
        onRowClick(row.original)
      }
    },
    [onRowClick]
  )

  if (isMobile) {
    return (
      <div className="flex h-full flex-col gap-2 pb-4">
        {data.length === 0 ? (
          <p className="py-16 text-center text-sm text-muted-foreground">
            No applications found
          </p>
        ) : (
          data.map((job) => {
            const cfg = STATUS_CONFIG[job.status as keyof typeof STATUS_CONFIG]
            const date = job.appliedAt || job.createdAt
            return (
              <button
                key={job.id}
                onClick={() => onRowClick(job)}
                className="flex w-full items-start gap-3 rounded-xl border bg-card p-4 text-left transition-colors hover:bg-muted/30"
              >
                <Checkbox
                  checked={selected.has(job.id)}
                  onCheckedChange={() => {
                    const next = new Set(selected)
                    if (next.has(job.id)) next.delete(job.id)
                    else next.add(job.id)
                    onSelectChange(next)
                  }}
                  onClick={(e) => e.stopPropagation()}
                  className="mt-0.5"
                />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="truncate text-sm font-medium">{job.title}</p>
                    <span
                      className={cn(
                        "inline-flex shrink-0 items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium",
                        cfg?.dot?.replace("bg-", "bg-").replace("from", ""),
                        "bg-muted text-muted-foreground"
                      )}
                    >
                      <span
                        className={cn("h-1.5 w-1.5 rounded-full", cfg?.dot)}
                      />
                      {cfg?.label}
                    </span>
                  </div>
                  <p className="mt-0.5 truncate text-sm text-muted-foreground">
                    {job.company}
                  </p>
                  <div className="mt-1.5 flex flex-wrap items-center gap-2 text-[11px] text-muted-foreground/70">
                    {job.location && (
                      <>
                        <HugeiconsIcon
                          icon={MapsLocation01Icon}
                          className="size-3"
                        />
                        <span>{job.location}</span>
                      </>
                    )}
                    <HugeiconsIcon icon={Calendar01Icon} className="size-3" />
                    <span>
                      {formatDistanceToNow(new Date(date), {
                        addSuffix: true,
                      })}
                    </span>
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger
                    render={
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 shrink-0"
                      />
                    }
                    onClick={(e) => e.stopPropagation()}
                  >
                    <HugeiconsIcon
                      icon={MoreHorizontalIcon}
                      className="size-4"
                    />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-44">
                    {Object.entries(STATUS_CONFIG).map(([key, scfg]) => (
                      <DropdownMenuItem
                        key={key}
                        onClick={(e) => {
                          e.stopPropagation()
                          onStatusChange(job.id, key)
                        }}
                      >
                        <span
                          className={cn("mr-2 h-2 w-2 rounded-full", scfg.dot)}
                        />
                        {scfg.label}
                      </DropdownMenuItem>
                    ))}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={(e) => {
                        e.stopPropagation()
                        onArchive(job.id)
                      }}
                    >
                      {job.archived ? (
                        <>
                          <HugeiconsIcon icon={CheckmarkCircle02Icon} /> Restore
                        </>
                      ) : (
                        <>
                          <HugeiconsIcon icon={ArchiveIcon} /> Archive
                        </>
                      )}
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={(e) => {
                        e.stopPropagation()
                        onDelete(job.id)
                      }}
                      className="text-destructive"
                    >
                      <HugeiconsIcon icon={Delete02Icon} />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </button>
            )
          })
        )}
      </div>
    )
  }

  return (
    <div className="flex h-full flex-col">
      <div className="flex-1 overflow-auto rounded-xl border">
        <table className="w-full table-fixed">
          <thead className="sticky top-0 z-10 bg-muted/30">
            {table.getHeaderGroups().map((hg) => (
              <tr key={hg.id}>
                {hg.headers.map((header) => (
                  <th
                    key={header.id}
                    className="px-3 py-2.5 text-left text-xs font-medium text-muted-foreground"
                    style={{ width: header.getSize() }}
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="py-16 text-center text-sm text-muted-foreground"
                >
                  No applications found
                </td>
              </tr>
            ) : (
              table.getRowModel().rows.map((row) => (
                <tr
                  key={row.id}
                  tabIndex={0}
                  onKeyDown={(e) => handleKeyDown(e, row)}
                  onClick={() => onRowClick(row.original)}
                  className={cn(
                    "cursor-pointer border-b border-border/40 transition-colors outline-none",
                    "hover:bg-muted/30 focus-visible:bg-muted/50 focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:ring-inset",
                    selectedJobId === row.original.id && "bg-primary/5"
                  )}
                >
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="px-3 py-2.5">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {data.length > 0 && (
        <div className="mt-2 flex items-center justify-between px-1">
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">
              {table.getState().pagination.pageIndex *
                table.getState().pagination.pageSize +
                1}
              –
              {Math.min(
                (table.getState().pagination.pageIndex + 1) *
                  table.getState().pagination.pageSize,
                data.length
              )}{" "}
              of {data.length}
            </span>
            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 gap-1 text-xs"
                  />
                }
              >
                <HugeiconsIcon icon={ViewOffSlashIcon} />
                Columns
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-36">
                {table
                  .getAllColumns()
                  .filter((c) => c.id !== "select" && c.id !== "actions")
                  .map((column) => (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      checked={column.getIsVisible()}
                      onCheckedChange={(v) => column.toggleVisibility(v)}
                    >
                      {column.id === "type"
                        ? "Type"
                        : column.id === "appliedAt"
                          ? "Applied"
                          : column.id.charAt(0).toUpperCase() +
                            column.id.slice(1)}
                    </DropdownMenuCheckboxItem>
                  ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <div className="flex items-center gap-2">
            <Select
              value={table.getState().pagination.pageSize.toString()}
              onValueChange={(v) => table.setPageSize(Number(v))}
            >
              <SelectTrigger className="h-7 w-16 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {[10, 25, 50, 100].map((s) => (
                  <SelectItem key={s} value={s.toString()}>
                    {s}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7"
                disabled={!table.getCanPreviousPage()}
                onClick={() => table.previousPage()}
              >
                <HugeiconsIcon icon={ArrowLeft01Icon} />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7"
                disabled={!table.getCanNextPage()}
                onClick={() => table.nextPage()}
              >
                <HugeiconsIcon icon={ArrowRight01Icon} />
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
