"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter, usePathname } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"
import { toast } from "sonner"
import { getCoverLetter } from "@/lib/actions/cover-letter"
import { CodeSquareIcon, PaintBucketIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

const tabs = [
  { href: "content", label: "Content", icon: PaintBucketIcon },
  { href: "customize", label: "Customize", icon: CodeSquareIcon },
]

export default function CoverLetterLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const params = useParams()
  const pathname = usePathname()
  const router = useRouter()
  const letterId = params.id as string
  const [loading, setLoading] = useState(true)
  const [title, setTitle] = useState("Untitled Cover Letter")

  const currentTab = pathname.split("/").pop() || "content"

  useEffect(() => {
    getCoverLetter(letterId)
      .then((res) => {
        if (res.data) {
          setTitle(res.data.title || "Untitled Cover Letter")
        }
        setLoading(false)
      })
      .catch(() => {
        toast.error("Failed to load cover letter")
        setLoading(false)
      })
  }, [letterId])

  if (loading) {
    return (
      <div className="flex h-svh flex-col">
        <div className="flex h-14 items-center border-b px-6">
          <Skeleton className="h-5 w-40" />
        </div>
        <div className="flex-1 p-6">
          <Skeleton className="h-full w-full" />
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-svh flex-col">
      <div className="flex h-14 items-center gap-2 border-b px-2 md:px-6">
        <Link
          href="/cover-letters"
          className="flex shrink-0 items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
          title="Back to Cover Letters"
        >
          <svg
            className="h-4 w-4 md:hidden"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M19 12H5m7-7-7 7 7 7" />
          </svg>
          <span className="hidden md:inline">Cover Letters</span>
        </Link>
        <span className="hidden shrink-0 text-muted-foreground md:inline">
          /
        </span>
        <span className="truncate text-sm font-medium">{title}</span>
        <div className="ml-auto flex shrink-0 items-center gap-2">
          <Link href={`/cover-letter/${letterId}/content`}>
            <Button>Download</Button>
          </Link>
        </div>
      </div>

      <Tabs
        value={currentTab}
        defaultValue="preview"
        onValueChange={(val) => router.push(`/cover-letter/${letterId}/${val}`)}
      >
        <TabsList>
          {tabs.map((tab) => (
            <TabsTrigger key={tab.href} value={tab.href}>
              {tab.icon && <HugeiconsIcon icon={tab.icon} />}
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      <div className="flex-1 overflow-hidden">{children}</div>
    </div>
  )
}
