"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { updateCv } from "@/lib/actions/user/curriculum-vitae"
import { HugeiconsIcon } from "@hugeicons/react"
import { Loading03Icon } from "@hugeicons/core-free-icons"
import { ContentRichTextEditor } from "./content-rich-text-editor"

interface SummaryEditorProps {
  cvId: string
  sections: { id: string; type: string }[]
  summaryContent: string
  setSummaryContent: (v: string) => void
}

export function ContentSummaryEditor({
  cvId,
  sections,
  summaryContent,
  setSummaryContent,
}: SummaryEditorProps) {
  const router = useRouter()
  const [saving, setSaving] = useState(false)

  async function saveSummary() {
    setSaving(true)
    const summarySection = sections.find((s) => s.type === "SUMMARY")
    if (!summarySection) {
      setSaving(false)
      return
    }
    const { error } = await updateCv(cvId, {
      sections: {
        update: [
          {
            where: { id: summarySection.id },
            data: { content: summaryContent },
          },
        ],
      },
    })
    setSaving(false)
    if (!error) {
      toast.success("Summary saved")
      router.refresh()
    } else {
      toast.error("Failed to save summary")
    }
  }

  return (
    <div className="space-y-3">
      <ContentRichTextEditor
        value={summaryContent}
        onChange={setSummaryContent}
        placeholder="Write your professional summary..."
        minHeight={140}
      />
      <div className="flex justify-end">
        <Button onClick={saveSummary} disabled={saving}>
          {saving && (
            <HugeiconsIcon icon={Loading03Icon} className="animate-spin" />
          )}
          Save Summary
        </Button>
      </div>
    </div>
  )
}
