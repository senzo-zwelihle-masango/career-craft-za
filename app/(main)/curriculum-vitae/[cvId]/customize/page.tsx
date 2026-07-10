"use client"

import { useEffect, useState } from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import { Loading03Icon } from "@hugeicons/core-free-icons"
import CustomizeEditor from "@/components/customize/customize-editor"
import { useEditorStore } from "@/lib/data/curriculum-vitae/store"
import { getCv } from "@/lib/actions/user/curriculum-vitae"

export default function CustomizePage({
  params,
}: {
  params: Promise<{ cvId: string }>
}) {
  const [cvId, setResumeId] = useState<string | null>(null)
  const setCv = useEditorStore((s) => s.setCv)
  const resume = useEditorStore((s) => s.cv)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    params.then((p) => setResumeId(p.cvId))
  }, [params])

  useEffect(() => {
    if (!cvId) return
    getCv(cvId).then((res) => {
      if (res.data) {
        setCv(res.data)
      }
      setLoading(false)
    })
  }, [cvId, setCv])

  if (loading || !resume) {
    return (
      <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
        <HugeiconsIcon icon={Loading03Icon} className="animate-spin" />
      </div>
    )
  }

  return <CustomizeEditor />
}
