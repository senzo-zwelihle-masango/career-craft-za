"use client"


import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Popover, PopoverContent, PopoverTrigger,
} from "@/components/ui/popover"
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select"
import type { FilterState } from "@/lib/data/editor/application-tracker"
  import { STATUS_CONFIG, EMPLOYMENT_TYPE_LABELS, WORK_MODEL_LABELS } from "@/lib/data/editor/application-tracker"
import { HugeiconsIcon } from "@hugeicons/react"
import { Cancel01Icon, FilterIcon, Search01Icon } from "@hugeicons/core-free-icons"


  // <HugeiconsIcon icon={Search01Icon} />
  // <HugeiconsIcon icon={Cancel01Icon} />
  // <HugeiconsIcon icon={FilterIcon} />
interface Props {
  filter: FilterState
  onChange: (f: FilterState) => void
  totalJobs: number
  filteredCount: number
}

const Filter = ({ filter, onChange, totalJobs, filteredCount }: Props) => {
  const hasActiveFilters = filter.search || filter.status.length || filter.employmentType.length ||
    filter.workModel.length || filter.archived !== null

  const activeFilterCount = [
    filter.status.length, filter.employmentType.length, filter.workModel.length,
    filter.archived !== null ? 1 : 0,
  ].reduce((a, b) => a + b, 0)

  function update(key: keyof FilterState, value: string | string[] | boolean | null) {
    onChange({ ...filter, [key]: value })
  }

  return (
   <div className="flex items-center gap-2">
      <div className="relative flex-1 max-w-md">
        {/* <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" /> */}
          <HugeiconsIcon icon={Search01Icon} className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground"/>
        <Input
          value={filter.search}
          onChange={(e) => update("search", e.target.value)}
          placeholder="Search by title, company, skills..."
          className="pl-9 pr-8 h-9 text-sm"
        />
        {filter.search && (
          <button onClick={() => update("search", "")} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
            {/* <X className="h-3.5 w-3.5" /> */}
              <HugeiconsIcon icon={Cancel01Icon} />
          </button>
        )}
      </div>

      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" size="sm" className="gap-1.5 h-9">
            {/* <Filter className="h-3.5 w-3.5" /> */}
              <HugeiconsIcon icon={FilterIcon} />
            Filters
            {activeFilterCount > 0 && (
              <Badge variant="secondary" className="ml-0.5 h-4 px-1 text-[10px]">{activeFilterCount}</Badge>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent align="end" className="w-[500px] p-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground">Status</label>
              <div className="flex flex-wrap gap-1">
                {Object.entries(STATUS_CONFIG).map(([key, cfg]) => {
                  const selected = filter.status.includes(key)
                  return (
                    <button
                      key={key}
                      onClick={() => update("status",
                        selected ? filter.status.filter((s) => s !== key) : [...filter.status, key],
                      )}
                      className={`px-2.5 py-1 rounded-md text-xs font-medium border transition-colors ${
                        selected ? "border-foreground bg-foreground/5" : "border-transparent hover:border-border"
                      }`}
                    >
                      {cfg.label}
                    </button>
                  )
                })}
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground">Employment type</label>
              <div className="flex flex-wrap gap-1">
                {Object.entries(EMPLOYMENT_TYPE_LABELS).map(([key, label]) => {
                  const selected = filter.employmentType.includes(key)
                  return (
                    <button
                      key={key}
                      onClick={() => update("employmentType",
                        selected ? filter.employmentType.filter((s) => s !== key) : [...filter.employmentType, key],
                      )}
                      className={`px-2.5 py-1 rounded-md text-xs font-medium border transition-colors ${
                        selected ? "border-foreground bg-foreground/5" : "border-transparent hover:border-border"
                      }`}
                    >
                      {label}
                    </button>
                  )
                })}
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground">Work model</label>
              <div className="flex flex-wrap gap-1">
                {Object.entries(WORK_MODEL_LABELS).map(([key, label]) => {
                  const selected = filter.workModel.includes(key)
                  return (
                    <button
                      key={key}
                      onClick={() => update("workModel",
                        selected ? filter.workModel.filter((s) => s !== key) : [...filter.workModel, key],
                      )}
                      className={`px-2.5 py-1 rounded-md text-xs font-medium border transition-colors ${
                        selected ? "border-foreground bg-foreground/5" : "border-transparent hover:border-border"
                      }`}
                    >
                      {label}
                    </button>
                  )
                })}
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground">Archive</label>
              <Select value={filter.archived === null ? "all" : filter.archived ? "archived" : "active"} onValueChange={(v) => {
                if (v === "all") update("archived", null)
                else update("archived", v === "archived")
              }}>
                <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="active">Active only</SelectItem>
                  <SelectItem value="archived">Archived only</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </PopoverContent>
      </Popover>

      {hasActiveFilters && (
        <Button variant="ghost" size="sm" className="h-9 text-xs" onClick={() => onChange({
          search: "", status: [], employmentType: [], workModel: [], archived: null,
        })}>
          {/* <X className="h-3.5 w-3.5 mr-1" />  */}
            <HugeiconsIcon icon={Cancel01Icon} />
          Clear
        </Button>
      )}

      <span className="text-xs text-muted-foreground ml-auto">
        {filteredCount} of {totalJobs}
      </span>
    </div>
  )
}

export default Filter