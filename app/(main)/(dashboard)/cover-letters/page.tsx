"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
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
import { Skeleton } from "@/components/ui/skeleton"
import { formatDistanceToNow } from "date-fns"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  Delete02Icon,
  File02Icon,
  MoreHorizontalIcon,
  PencilIcon,
  PlusSignIcon,
} from "@hugeicons/core-free-icons"

import { toast } from "sonner"
import {
  getCoverLetters,
  createCoverLetter,
  deleteCoverLetter,
} from "@/lib/actions/cover-letter"
import { CoverLetterThumbnail } from "@/components/cover-letter/cover-letter-thumbnail"

interface CoverLetter {
  id: string
  title: string
  body: string
  recipientName: string | null
  companyName: string | null
  fullName: string
  professionalTitle: string
  email: string
  phone: string
  location: string
  date: string
  fontFamily: string
  templateId: string
  accentColor?: string | null
  updatedAt: string
}
export default function CoverLettersPage() {
  const router = useRouter()
  const [letters, setLetters] = useState<CoverLetter[]>([])
  const [loading, setLoading] = useState(true)
  const [creating, setCreating] = useState(false)
  const [deleting, setDeleting] = useState<string | null>(null)

  useEffect(() => {
    getCoverLetters().then((res) => {
      if (res.data) setLetters(res.data as unknown as CoverLetter[])
      setLoading(false)
    })
  }, [])

  async function handleCreate() {
    setCreating(true)
    const { data, error } = await createCoverLetter()
    if (data) {
      router.push(`/cover-letter/${data.id}/content`)
    } else {
      toast.error(error || "Failed to create cover letter")
      setCreating(false)
    }
  }

  async function handleDelete(id: string) {
    setDeleting(id)
    const { error } = await deleteCoverLetter(id)
    setDeleting(null)
    if (!error) {
      setLetters((prev) => prev.filter((l) => l.id !== id))
      toast.success("Cover letter deleted")
    } else {
      toast.error(error)
    }
  }
  return (
    <div className="p-4 md:p-8">
      <div className="mb-6 flex flex-col gap-4 md:mb-8 md:flex-row md:items-start md:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
            Cover Letters
          </h1>
          <p className="mt-1 text-sm text-muted-foreground md:text-base">
            Write cover letters paired with your CVs.
          </p>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="aspect-[210/297] rounded-lg bg-muted/30 p-4"
            >
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="mt-3 h-3 w-1/2" />
            </div>
          ))}
        </div>
      ) : letters.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-border py-24 text-center">
          <HugeiconsIcon icon={File02Icon} />
          <h3 className="mt-4 font-medium">No cover letters yet</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Create your first cover letter to get started.
          </p>
          <Button
            className="mt-6 gap-2"
            onClick={handleCreate}
            disabled={creating}
          >
            <HugeiconsIcon icon={PlusSignIcon} />
            New Cover Letter
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6 lg:grid-cols-3 xl:grid-cols-4">
          {letters.map((letter) => (
            <div key={letter.id} className="group">
              <Link
                href={`/cover-letter/${letter.id}/content`}
                className="block"
              >
                <div className="flex aspect-[210/297] items-start justify-center overflow-hidden rounded-lg bg-muted/30 pt-4">
                  <CoverLetterThumbnail
                    data={{
                      fullName: letter.fullName,
                      professionalTitle: letter.professionalTitle,
                      email: letter.email,
                      phone: letter.phone,
                      location: letter.location,
                      date: letter.date,
                      recipientName: letter.recipientName,
                      companyName: letter.companyName,
                      body: letter.body,
                      fontFamily: letter.fontFamily,
                      templateId: letter.templateId,
                      accentColor: letter.accentColor,
                    }}
                    className="rounded-sm shadow-[0_0_0_1px_hsl(var(--border))]"
                  />
                </div>
              </Link>
              <div className="mt-1.5 flex items-start justify-between gap-2">
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{letter.title}</p>
                  {letter.fullName && (
                    <p className="truncate text-[11px] text-muted-foreground">
                      {letter.fullName}
                    </p>
                  )}
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon-xs"
                      className="shrink-0 opacity-0 transition-opacity group-hover:opacity-100"
                    >
                      <HugeiconsIcon icon={MoreHorizontalIcon} />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-36">
                    <DropdownMenuItem
                      className="gap-2"
                      onClick={() =>
                        router.push(`/cover-letter/${letter.id}/content`)
                      }
                    >
                      <HugeiconsIcon icon={PencilIcon} />
                      Open
                    </DropdownMenuItem>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <DropdownMenuItem
                          className="gap-2 text-destructive focus:text-destructive"
                          onSelect={(e) => e.preventDefault()}
                        >
                          <HugeiconsIcon icon={Delete02Icon} />
                          Delete
                        </DropdownMenuItem>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>
                            Delete cover letter
                          </AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete &quot;{letter.title}&quot;?
                            This cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            className="text-destructive-foreground bg-destructive"
                            disabled={deleting === letter.id}
                            onClick={(e) => {
                              e.preventDefault()
                              handleDelete(letter.id)
                            }}
                          >
                            {deleting === letter.id ? "Deleting..." : "Delete"}
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
