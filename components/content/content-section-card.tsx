"use client"

import { ComponentProps, useState } from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  ArrowDown01Icon,
  Delete02Icon,
  Loading03Icon,
  More01Icon,
  Pen01Icon,
  ViewIcon,
  ViewOffSlashIcon,
} from "@hugeicons/core-free-icons"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { TipsDrawer } from "./content-tips-drawer"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"

type HugeIcon = ComponentProps<typeof HugeiconsIcon>["icon"]

interface SectionCardProps {
  section: { id: string; title: string; visible: boolean; type: string }
  icon: ComponentProps<typeof HugeiconsIcon>["icon"]
  entryCount: number
  defaultOpen?: boolean
  onSaveRename: (sectionId: string, newTitle: string) => Promise<void>
  onToggleVisibility: (sectionId: string, visible: boolean) => Promise<void>
  onRemove: (sectionId: string) => Promise<void>
  children: React.ReactNode
}

export function ContentSectionCard({
  section,
  icon,
  entryCount,
  defaultOpen = false,
  onSaveRename,
  onToggleVisibility,
  onRemove,
  children,
}: SectionCardProps) {
  const [open, setOpen] = useState(defaultOpen)
  const [renaming, setRenaming] = useState(false)
  const [renameValue, setRenameValue] = useState("")
  const [savingRename, setSavingRename] = useState(false)
  const [removing, setRemoving] = useState(false)

  async function handleSaveRename() {
    if (!renameValue.trim()) return
    setSavingRename(true)
    await onSaveRename(section.id, renameValue.trim())
    setSavingRename(false)
    setRenaming(false)
  }

  async function handleRemove() {
    setRemoving(true)
    await onRemove(section.id)
    setRemoving(false)
  }

  return (
    <div className="rounded-xl border-0 bg-card shadow-sm transition-shadow">
      {/* header */}
      <div
        role="button"
        tabIndex={0}
        onClick={() => setOpen(!open)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault()
            setOpen(!open)
          }
        }}
        className="flex w-full cursor-pointer items-center gap-3 px-5 py-4 text-left text-sm font-semibold transition-colors"
      >
        <HugeiconsIcon
          icon={More01Icon}
          className="size-4 shrink-0 cursor-grab text-muted-foreground/40 active:cursor-grabbing"
        />

        <HugeiconsIcon icon={icon} className="h-5 w-5 shrink-0 text-primary" />
        <span className="flex-1 truncate">{section.title}</span>
        {entryCount > 0 && (
          <span className="inline-flex h-5 min-w-[20px] shrink-0 items-center justify-center rounded-full bg-primary/10 px-1.5 text-[11px] font-medium text-primary">
            {entryCount}
          </span>
        )}
        
        {/* Actions Cluster */}
        <div
          className="flex shrink-0 items-center gap-2"
          onClick={(e) => e.stopPropagation()}
        >

          <Tooltip>
            <TooltipTrigger asChild>
              <Popover
                open={renaming}
                onOpenChange={(open) => {
                  if (!open) setRenaming(false)
                }}
              >
                <PopoverTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 shrink-0 text-muted-foreground hover:text-foreground"
                    onClick={(e) => {
                      e.stopPropagation()
                      setRenameValue(section.title)
                      setRenaming(true)
                    }}
                  >
                    <HugeiconsIcon icon={Pen01Icon} className="size-4" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent
                  className="w-72 p-3"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="space-y-2">
                    <p className="text-sm font-medium">Rename section</p>
                    <Input
                      value={renameValue}
                      onChange={(e) => setRenameValue(e.target.value)}
                      placeholder="Section title"
                      autoFocus
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault()
                          handleSaveRename()
                        }
                        if (e.key === "Escape") setRenaming(false)
                      }}
                    />
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setRenaming(false)}
                      >
                        Cancel
                      </Button>
                      <Button
                        size="sm"
                        onClick={handleSaveRename}
                        disabled={savingRename || !renameValue.trim()}
                      >
                        {savingRename ? (
                          <HugeiconsIcon
                            icon={Loading03Icon}
                            className="size-4 animate-spin"
                          />
                        ) : null}
                        Save
                      </Button>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
            </TooltipTrigger>
            <TooltipContent>Rename section</TooltipContent>
          </Tooltip>


          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={(e) => {
                  e.stopPropagation()
                  onToggleVisibility(section.id, !section.visible)
                }}
                className="h-6 w-6 shrink-0 text-muted-foreground hover:text-foreground"
              >
                {section.visible ? (
                  <HugeiconsIcon icon={ViewIcon} className="size-4" />
                ) : (
                  <HugeiconsIcon icon={ViewOffSlashIcon} className="size-4" />
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              {section.visible ? "Hide from CV" : "Show on CV"}
            </TooltipContent>
          </Tooltip>


          <div onClick={(e) => e.stopPropagation()}>
            <TipsDrawer sectionType={section.type.toLowerCase()} side="right" compact compactLabel="Tips" />
          </div>

          <Tooltip>
            <TooltipTrigger asChild>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={(e) => e.stopPropagation()}
                    className="h-6 w-6 shrink-0 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                  >
                    <HugeiconsIcon icon={Delete02Icon} className="size-4" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Remove section</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to remove &ldquo;{section.title}&rdquo;?
                      This cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <Button
                      variant="destructive"
                      onClick={handleRemove}
                      disabled={removing}
                    >
                      {removing && (
                        <HugeiconsIcon
                          icon={Loading03Icon}
                          className="mr-2 size-4 animate-spin"
                        />
                      )}
                      Remove
                    </Button>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </TooltipTrigger>
            <TooltipContent>Remove section</TooltipContent>
          </Tooltip>


          <div className="flex h-6 w-6 shrink-0 items-center justify-center">
            <HugeiconsIcon
              icon={ArrowDown01Icon}
              className={cn(
                "size-4 text-muted-foreground/60 transition-transform duration-200",
                open && "rotate-180"
              )}
            />
          </div>
        </div>
      </div>

      {/* Body — always renders, visibility toggled — NO max-height, NO overflow hidden */}
      {open && (
        <div className="space-y-4 border-t px-5 pt-3 pb-5">{children}</div>
      )}
    </div>
  )
}