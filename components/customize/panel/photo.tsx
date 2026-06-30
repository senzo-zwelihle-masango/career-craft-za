"use client"

import { useState } from "react"
import { useEditorStore } from "@/lib/data/editor/store"
import { UploadButton } from "@/utils/upload/uploadthing"
import { updateCv } from "@/lib/actions/curriculum-vitae"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"

import { PanelTip, PANEL_TIPS } from "../_shared"
import type { CvWithRelations } from "@/lib/data/editor/types"
import { HugeiconsIcon } from "@hugeicons/react"
import { Camera01Icon, RotateClockwiseIcon } from "@hugeicons/core-free-icons"

export function PhotoPanel() {
  const resume = useEditorStore((s) => s.cv)
  const updateResumeState = useEditorStore((s) => s.updateCv)

  async function persistPhotoUrl(url: string | null) {
    if (!resume?.personalDetails?.id) return
    const { error } = await updateCv(resume.id, {
      personalDetails: { update: { photoUrl: url } },
    })
    if (error) toast.error("Failed to save photo")
  }

  async function removePhoto() {
    updateResumeState({
      personalDetails: { ...resume?.personalDetails, photoUrl: null },
    } as Partial<CvWithRelations>)
    await persistPhotoUrl(null)
  }

  async function resetPhoto() {
    if (resume?.personalDetails?.photoUrl) {
      await removePhoto()
    }
    updateResumeState({ showPhoto: false } as Partial<CvWithRelations>)
    await updateCv(resume!.id, { showPhoto: false })
  }

  const photoUrl = resume?.personalDetails?.photoUrl
  const hasPhoto = !!photoUrl || (resume?.showPhoto ?? false)

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <PanelTip tip={PANEL_TIPS.Photo} />
      </div>
      <div className="flex flex-col items-center gap-3">
        {photoUrl ? (
          <div className="relative">
            <img
              src={photoUrl}
              alt="Profile"
              className="h-24 w-24 rounded-full object-cover border-2"
            />
            <button
              onClick={removePhoto}
              className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-destructive text-[10px] text-destructive-foreground"
            >
              ×
            </button>
          </div>
        ) : (
          <div className="flex h-24 w-24 items-center justify-center rounded-full bg-muted">
            {/* <Camera className="h-8 w-8 text-muted-foreground/50" /> */}
            <HugeiconsIcon icon={Camera01Icon} />
          </div>
        )}
        <UploadButton
          endpoint="imageUploader"
          onClientUploadComplete={(res) => {
            const url = res?.[0]?.url ?? res?.[0]?.ufsUrl
            if (url) {
              updateResumeState({
                personalDetails: { ...resume?.personalDetails, photoUrl: url },
              } as Partial<CvWithRelations>)
              persistPhotoUrl(url)
              toast.success("Photo uploaded")
            }
          }}
          onUploadError={(error) => {
            toast.error(error.message || "Failed to upload photo")
          }}
        />
        <p className="text-xs text-muted-foreground">Max 4MB. JPEG, PNG, WebP.</p>
      </div>
      <div className="flex items-center justify-between gap-2">
        <Label>Show photo on CV</Label>
        <Switch
          checked={resume?.showPhoto ?? false}
          onCheckedChange={(v) => updateResumeState({ showPhoto: v } as Partial<CvWithRelations>)}
        />
      </div>
      {hasPhoto && (
        <Button variant="ghost" size="sm" className="h-7 gap-1 text-xs text-muted-foreground" onClick={resetPhoto}>
          {/* <RotateCcw className="h-3 w-3" /> */}
          <HugeiconsIcon icon={RotateClockwiseIcon} />
          Reset defaults
        </Button>
      )}
    </div>
  )
}
