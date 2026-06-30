"use client"

import { useEditorStore } from "@/lib/data/editor/store"
import { cn } from "@/lib/utils"
import { AlertCircleIcon, CheckmarkCircle02Icon, Loading03Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"


export function EditorAutoSaveIndicator() {
  const status = useEditorStore((s) => s.saveStatus)
  const isDirty = useEditorStore((s) => s.isDirty)

  if (status === "saving") {
    return (
      <span className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground bg-muted/50 px-2 py-1 rounded-md">
       <HugeiconsIcon icon={Loading03Icon} className="animate-spin"/>
        <span className="hidden sm:inline">Saving...</span>
      </span>
    )
  }

  if (status === "saved" && !isDirty) {
    return (
      <span className="inline-flex items-center gap-1.5 text-xs font-medium text-green-600 dark:text-green-400 bg-green-500/10 px-2 py-1 rounded-md">
       <HugeiconsIcon icon={CheckmarkCircle02Icon} />
        <span className="hidden sm:inline">Saved</span>
      </span>
    )
  }

  if (status === "error") {
    return (
      <span className="inline-flex items-center gap-1.5 text-xs font-medium text-destructive bg-destructive/10 px-2 py-1 rounded-md">
        <HugeiconsIcon icon={AlertCircleIcon} />
        <span className="hidden sm:inline">Save failed</span>
      </span>
    )
  }

  return (
    <span className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground bg-muted/30 px-2 py-1 rounded-md">
      <span className={cn("h-2 w-2 rounded-full animate-pulse", isDirty ? "bg-amber-400" : "bg-green-500")} />
      <span className="hidden sm:inline">{isDirty ? "Unsaved changes" : "All changes saved"}</span>
    </span>
  )
}
