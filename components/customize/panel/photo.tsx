"use client"

import { useState, useCallback } from "react"
import Cropper, { type Area } from "react-easy-crop"
import { useEditorStore } from "@/lib/data/editor/store"
import { UploadButton } from "@/utils/upload/uploadthing"
import { updateCv } from "@/lib/actions/curriculum-vitae"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { toast } from "sonner"

import { PanelTip, PANEL_TIPS } from "../_shared"
import type { CvWithRelations } from "@/lib/data/editor/types"
import { HugeiconsIcon } from "@hugeicons/react"
import { Camera01Icon, RotateClockwiseIcon, ImageCropIcon } from "@hugeicons/core-free-icons"

const POSITIONS = [
  { value: "0% 0%", label: "TL" },
  { value: "50% 0%", label: "TC" },
  { value: "100% 0%", label: "TR" },
  { value: "0% 50%", label: "CL" },
  { value: "50% 50%", label: "C" },
  { value: "100% 50%", label: "CR" },
  { value: "0% 100%", label: "BL" },
  { value: "50% 100%", label: "BC" },
  { value: "100% 100%", label: "BR" },
]

export function PhotoPanel() {
  const resume = useEditorStore((s) => s.cv)
  const updateResumeState = useEditorStore((s) => s.updateCv)
  const [cropDialogOpen, setCropDialogOpen] = useState(false)
  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [croppedAreaPct, setCroppedAreaPct] = useState<Area | null>(null)

  const photoUrl = resume?.personalDetails?.photoUrl
  const hasPhoto = !!photoUrl || (resume?.showPhoto ?? false)
  const photoObjectPosition = resume?.personalDetails?.photoObjectPosition || "50% 50%"

  async function persistPhotoUrl(url: string | null) {
    if (!resume?.personalDetails?.id) return
    const { error } = await updateCv(resume.id, {
      personalDetails: { update: { photoUrl: url } },
    })
    if (error) toast.error("Failed to save photo")
  }

  async function savePhotoPosition(position: string) {
    if (!resume?.personalDetails?.id) return
    await updateCv(resume.id, {
      personalDetails: { update: { photoObjectPosition: position } },
    })
    updateResumeState({
      personalDetails: { ...resume?.personalDetails, photoObjectPosition: position },
    } as Partial<CvWithRelations>)
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

  function openCropDialog() {
    setCrop({ x: 0, y: 0 })
    setZoom(1)
    setCroppedAreaPct(null)
    setCropDialogOpen(true)
  }

  const onCropComplete = useCallback((_: Area, croppedAreaPct: Area) => {
    setCroppedAreaPct(croppedAreaPct)
  }, [])

  async function applyCrop() {
    if (!croppedAreaPct || !resume?.personalDetails?.id || !photoUrl) return
    const centerX = croppedAreaPct.x + croppedAreaPct.width / 2
    const centerY = croppedAreaPct.y + croppedAreaPct.height / 2
    const position = `${centerX}% ${centerY}%`
    await savePhotoPosition(position)
    setCropDialogOpen(false)
    toast.success("Photo position updated")
  }

  if (!resume) return null

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <p className="text-sm font-medium">Photo</p>
        <PanelTip tip={PANEL_TIPS.Photo} />
      </div>

      {/* Photo preview & upload */}
      <div className="flex flex-col items-center gap-3">
        {photoUrl ? (
          <div className="relative">
            <img
              src={photoUrl}
              alt="Profile"
              className="h-24 w-24 rounded-full border-2"
              style={{ objectFit: "cover", objectPosition: photoObjectPosition }}
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

      {/* Position selector */}
      {photoUrl && (
        <div className="space-y-2">
          <Label className="text-xs">Position</Label>
          <div className="grid grid-cols-3 gap-1">
            {POSITIONS.map((pos) => (
              <button
                key={pos.value}
                onClick={() => savePhotoPosition(pos.value)}
                className={`rounded border px-2 py-1.5 text-xs font-medium transition-colors ${
                  photoObjectPosition === pos.value
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border text-muted-foreground hover:bg-accent"
                }`}
              >
                {pos.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Crop button */}
      {photoUrl && (
        <Button variant="outline" size="sm" className="w-full gap-1.5" onClick={openCropDialog}>
          <HugeiconsIcon icon={ImageCropIcon} />
          Crop Photo
        </Button>
      )}

      {/* Show photo toggle */}
      <div className="flex items-center justify-between gap-2">
        <Label>Show photo on CV</Label>
        <Switch
          checked={resume?.showPhoto ?? false}
          onCheckedChange={(v) => updateResumeState({ showPhoto: v } as Partial<CvWithRelations>)}
        />
      </div>

      {/* Reset */}
      {hasPhoto && (
        <Button variant="ghost" size="sm" className="h-7 gap-1 text-xs text-muted-foreground" onClick={resetPhoto}>
          <HugeiconsIcon icon={RotateClockwiseIcon} />
          Reset defaults
        </Button>
      )}

      {/* Crop dialog */}
      <Dialog open={cropDialogOpen} onOpenChange={setCropDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Crop Photo</DialogTitle>
          </DialogHeader>
          <div className="relative h-80 w-full overflow-hidden rounded-md bg-black/5">
            <Cropper
              image={photoUrl || ""}
              crop={crop}
              zoom={zoom}
              aspect={4 / 5}
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onCropComplete={onCropComplete}
            />
          </div>
          <div className="flex items-center gap-3 px-1">
            <span className="text-xs text-muted-foreground">Zoom</span>
            <Slider
              value={[zoom]}
              min={1}
              max={3}
              step={0.05}
              onValueChange={([v]) => setZoom(v)}
              className="flex-1"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCropDialogOpen(false)}>Cancel</Button>
            <Button onClick={applyCrop}>Apply</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}