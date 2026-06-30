"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { toast } from "sonner"
import { formatDistanceToNow } from "date-fns"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  PlusSignIcon,
  MoreHorizontalIcon,
  PencilEdit02Icon,
  Copy01Icon,
  Delete02Icon,
} from "@hugeicons/core-free-icons"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import {
  createCv,
  duplicateCv,
  deleteCv,
  updateCv,
} from "@/lib/actions/curriculum-vitae"
import { CvThumbnail } from "@/components/templates/cv-thumbnail"
import type { CvWithRelations } from "@/lib/data/editor/types"

const CurriculumVitaeGrid = ({
  cvs,
  userId,
  plan,
  showCreateOnly,
}: {
  cvs: CvWithRelations[]
  userId: string
  plan: string
  showCreateOnly?: boolean
}) => {
  const router = useRouter()
  const [renameId, setRenameId] = useState<string | null>(null)
  const [renameTitle, setRenameTitle] = useState("")

  const isFreePlan = plan === "FREE"
  const canCreate = !isFreePlan || cvs.length < 1

  async function handleCreate() {
    if (!canCreate) {
      toast.error("Upgrade your plan to create more CVs")
      return
    }

    const { data, error } = await createCv()
    if (error) {
      toast.error(error)
      return
    }
    router.push(`/curriculum-vitae/${data!.id}/content`)
  }

  async function handleDuplicate(id: string) {
    const { error } = await duplicateCv(id)
    if (error) {
      toast.error("Failed to duplicate CV")
      return
    }
    router.refresh()
    toast.success("CV duplicated")
  }

  async function handleDelete(id: string) {
    const { error } = await deleteCv(id)
    if (error) {
      toast.error("Failed to delete CV")
      return
    }
    router.refresh()
    toast.success("CV deleted")
  }

  async function handleRename(id: string) {
    if (!renameTitle.trim()) return
    const { error } = await updateCv(id, { title: renameTitle })
    if (error) {
      toast.error("Failed to rename CV")
      return
    }
    setRenameId(null)
    router.refresh()
    toast.success("CV renamed")
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-4 lg:grid-cols-3 xl:grid-cols-4">
      <button
        onClick={handleCreate}
        disabled={!canCreate}
        className="flex aspect-210/297 items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/25 transition-colors hover:border-muted-foreground/50 disabled:cursor-not-allowed disabled:opacity-50"
      >
        <div className="flex flex-col items-center gap-2 text-muted-foreground">
          <HugeiconsIcon icon={PlusSignIcon} />
          <span className="text-sm font-medium">New CV</span>
        </div>
      </button>
      {showCreateOnly
        ? null
        : cvs.map((cv) => (
            <div key={cv.id} className="group">
              <Link href={`/curriculum-vitae/${cv.id}/content`}>
                <div className="relative aspect-210/297 overflow-hidden rounded-lg bg-muted/30">
                  <div className="absolute inset-0 flex items-start justify-center">
                    <CvThumbnail
                      resume={cv}
                      className="rounded-sm shadow-[0_0_0_1px_hsl(var(--border))]"
                    />
                  </div>
                </div>
              </Link>
              <div className="mt-1.5 flex items-center justify-between gap-2">
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{cv.title}</p>
                  <p className="text-xs text-muted-foreground">
                    edited{" "}
                    {formatDistanceToNow(new Date(cv.updatedAt), {
                      addSuffix: true,
                    })}{" "}
                    &bull; {cv.pageFormat}
                  </p>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 shrink-0 opacity-0 transition-opacity group-hover:opacity-100"
                    >
                      <HugeiconsIcon icon={MoreHorizontalIcon} />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      onClick={(e) => {
                        e.stopPropagation()
                        setRenameId(cv.id)
                        setRenameTitle(cv.title)
                      }}
                    >
                      <HugeiconsIcon icon={PencilEdit02Icon} />
                      Rename
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleDuplicate(cv.id)}>
                      <HugeiconsIcon icon={Copy01Icon} />
                      Duplicate
                    </DropdownMenuItem>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <DropdownMenuItem
                          onSelect={(e) => e.preventDefault()}
                          className="text-destructive"
                        >
                          <HugeiconsIcon icon={Delete02Icon} />
                          Delete
                        </DropdownMenuItem>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete CV?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone. This will permanently
                            delete &quot;{cv.title}&quot;.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDelete(cv.id)}
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <Dialog
                open={renameId === cv.id}
                onOpenChange={(open) => {
                  if (!open) setRenameId(null)
                }}
              >
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Rename CV</DialogTitle>
                  </DialogHeader>
                  <form
                    onSubmit={(e) => {
                      e.preventDefault()
                      handleRename(cv.id)
                    }}
                    className="space-y-4"
                  >
                    <Input
                      value={renameTitle}
                      onChange={(e) => setRenameTitle(e.target.value)}
                      placeholder="CV name"
                      autoFocus
                    />
                    <Button type="submit">Save</Button>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          ))}
    </div>
  )
}

export default CurriculumVitaeGrid
