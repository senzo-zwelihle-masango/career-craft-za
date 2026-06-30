"use client"

import { useState } from "react"
import { useEditorStore } from "@/lib/data/editor/store"
import { syncCv } from "@/lib/actions/curriculum-vitae"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"

import { PanelTip, PANEL_TIPS } from "../_shared"
import type { CvWithRelations } from "@/lib/data/editor/types"
import { HugeiconsIcon } from "@hugeicons/react"
import { RotateClockwiseIcon } from "@hugeicons/core-free-icons"

export function SharePanel() {
  const resume = useEditorStore((s) => s.cv)
  const updateResumeState = useEditorStore((s) => s.updateCv)
  const [copied, setCopied] = useState(false)

  if (!resume) return null

  const shareUrl = resume.shareId
    ? `${window.location.origin}/r/${resume.shareId}`
    : null

  async function toggleShare(shared: boolean) {
    if (!resume) return
    let shareId = resume.shareId ?? null
    if (shared && !shareId) {
      shareId = Array.from({ length: 12 }, () => "abcdefghijklmnopqrstuvwxyz0123456789"[Math.floor(Math.random() * 36)]).join("")
    }
    updateResumeState({ shared, shareId } as Partial<CvWithRelations>)
    await syncCv(resume.id, { shared, shareId })
  }

  async function resetShare() {
    if (!resume) return
    updateResumeState({ shared: false, shareId: null } as Partial<CvWithRelations>)
    await syncCv(resume.id, { shared: false, shareId: null })
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <PanelTip tip={PANEL_TIPS.Share} />
      </div>
      <div className="flex items-center justify-between">
        <div>
          <Label>Public share link</Label>
          <p className="text-xs text-muted-foreground">
            Anyone with the link can view this CV
          </p>
        </div>
        <Switch
          checked={resume.shared ?? false}
          onCheckedChange={toggleShare}
        />
      </div>
      {resume.shared && shareUrl && (
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Input value={shareUrl} readOnly className="text-xs" />
            <Button
              variant="outline"
              size="sm"
              className="shrink-0"
              onClick={() => {
                navigator.clipboard.writeText(shareUrl)
                setCopied(true)
                setTimeout(() => setCopied(false), 2000)
              }}
            >
              {copied ? "Copied!" : "Copy"}
            </Button>
          </div>
        </div>
      )}
      {(resume.shared || resume.shareId) && (
        <Button variant="ghost" size="sm" className="h-7 gap-1 text-xs text-muted-foreground" onClick={resetShare}>
          {/* <RotateCcw className="h-3 w-3" /> */}
          <HugeiconsIcon icon={RotateClockwiseIcon} />
          Reset defaults
        </Button>
      )}
    </div>
  )
}
