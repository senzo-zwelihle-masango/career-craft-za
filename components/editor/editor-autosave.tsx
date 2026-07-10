"use client"

import { cn } from "@/lib/utils"
import {
  AlertCircleIcon,
  CheckmarkCircle02Icon,
  Loading03Icon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { useEditorStore } from "@/lib/data/curriculum-vitae/store"

export function EditorAutoSaveIndicator() {
  const status = useEditorStore((s) => s.saveStatus)
  const isDirty = useEditorStore((s) => s.isDirty)

  if (status === "saving") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-md bg-muted/50 px-2 py-1 text-xs font-medium text-muted-foreground">
        <HugeiconsIcon icon={Loading03Icon} className="animate-spin" />
        <span className="hidden sm:inline">Saving...</span>
      </span>
    )
  }

  if (status === "saved" && !isDirty) {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-md bg-green-500/10 px-2 py-1 text-xs font-medium text-green-600 dark:text-green-400">
        <HugeiconsIcon icon={CheckmarkCircle02Icon} />
        <span className="hidden sm:inline">Saved</span>
      </span>
    )
  }

  if (status === "error") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-md bg-destructive/10 px-2 py-1 text-xs font-medium text-destructive">
        <HugeiconsIcon icon={AlertCircleIcon} />
        <span className="hidden sm:inline">Save failed</span>
      </span>
    )
  }

  return (
    <span className="inline-flex items-center gap-1.5 rounded-md bg-muted/30 px-2 py-1 text-xs font-medium text-muted-foreground">
      <span
        className={cn(
          "h-2 w-2 animate-pulse rounded-full",
          isDirty ? "bg-amber-400" : "bg-green-500"
        )}
      />
      <span className="hidden sm:inline">
        {isDirty ? "Unsaved changes" : "All changes saved"}
      </span>
    </span>
  )
}
