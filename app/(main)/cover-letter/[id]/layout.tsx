"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { Skeleton } from "@/components/ui/skeleton"
import { toast } from "sonner"
import { getCoverLetter } from "@/lib/actions/user/cover-letter"
import { useDownloadCoverLetter } from "@/hooks/use-download-cover-letter"
import CoverLetterNavigationBar from "@/components/cover-letter/cover-letter-navigationbar"

export default function CoverLetterLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const params = useParams()
  const letterId = params.id as string
  const [loading, setLoading] = useState(true)
  const [title, setTitle] = useState("Untitled Cover Letter")
  const [letterData, setLetterData] = useState<Record<string, unknown> | null>(
    null
  )

  useEffect(() => {
    getCoverLetter(letterId)
      .then((res) => {
        if (res.data) {
          setTitle(res.data.title || "Untitled Cover Letter")
          setLetterData(res.data as Record<string, unknown>)
        }
        setLoading(false)
      })
      .catch(() => {
        toast.error("Failed to load cover letter")
        setLoading(false)
      })
  }, [letterId])

  const { downloadPdf, downloadDocx, downloadJson } = useDownloadCoverLetter(
    letterId,
    title,
    letterData
  )

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
      <CoverLetterNavigationBar
        letterId={letterId}
        title={title}
        onDownloadPdf={downloadPdf}
        onDownloadDocx={downloadDocx}
        onDownloadJson={downloadJson}
      />
      <div className="flex-1 overflow-hidden pt-20">{children}</div>
    </div>
  )
}
