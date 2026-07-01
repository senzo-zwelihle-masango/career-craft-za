"use client"

import { useState } from "react"
import { useEditorStore } from "@/lib/data/editor/store"
import { updateCv } from "@/lib/actions/curriculum-vitae"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter,
} from "@/components/ui/dialog"
import { toast } from "sonner"
import { PanelTip, PANEL_TIPS, linkTypeOptions } from "../_shared"
import type { CvWithRelations } from "@/lib/data/editor/types"
import { HugeiconsIcon } from "@hugeicons/react"
import { Delete02Icon, PlusSignIcon, RotateClockwiseIcon, Link02Icon } from "@hugeicons/core-free-icons"

export function LinksPanel() {
  const resume = useEditorStore((s) => s.cv)
  const [links, setLinks] = useState<{ type: string; label?: string; url: string }[]>(() => (resume?.personalDetails?.links as { type: string; label?: string; url: string }[]) ?? [])
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingIndex, setEditingIndex] = useState<number | null>(null)
  const [formType, setFormType] = useState("linkedin")
  const [formLabel, setFormLabel] = useState("")
  const [formUrl, setFormUrl] = useState("")

  // Returns the core icon configuration data object
  function getTypeIcon(type: string) {
    return linkTypeOptions.find((o) => o.value === type)?.icon ?? Link02Icon
  }

  function getTypeLabel(link: { type: string; label?: string }) {
    if (link.type === "custom") return link.label || "Custom"
    return linkTypeOptions.find((o) => o.value === link.type)?.label ?? link.type
  }

  async function saveLinks(linksToSave: { type: string; label?: string; url: string }[]) {
    if (!resume?.personalDetails?.id) return
    const { error } = await updateCv(resume.id, {
      personalDetails: { update: { links: linksToSave } },
    })
    if (!error) {
      useEditorStore.getState().updateCv({
        personalDetails: { ...resume.personalDetails, links: linksToSave },
      } as Partial<CvWithRelations>)
    } else {
      toast.error("Failed to save links")
    }
  }

  function openAdd() {
    setEditingIndex(null)
    setFormType("linkedin")
    setFormLabel("")
    setFormUrl("")
    setDialogOpen(true)
  }

  function openEdit(index: number) {
    const link = links[index]
    setEditingIndex(index)
    setFormType(link.type)
    setFormLabel(link.label ?? "")
    setFormUrl(link.url)
    setDialogOpen(true)
  }

  function handleSaveLink() {
    if (!formUrl.trim()) {
      toast.error("URL is required")
      return
    }
    const newLink: { type: string; label?: string; url: string } = {
      type: formType,
      url: formUrl.trim(),
    }
    if (formType === "custom" && formLabel.trim()) {
      newLink.label = formLabel.trim()
    }
    if (editingIndex !== null) {
      const updated = [...links]
      updated[editingIndex] = newLink
      setLinks(updated)
      saveLinks(updated)
    } else {
      const updated = [...links, newLink]
      setLinks(updated)
      saveLinks(updated)
    }
    setDialogOpen(false)
    toast.success(editingIndex !== null ? "Link updated" : "Link added")
  }

  function handleDelete(index: number) {
    const updated = links.filter((_, i) => i !== index)
    setLinks(updated)
    saveLinks(updated)
    toast.success("Link removed")
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <p className="text-sm font-medium">Links</p>
        <PanelTip tip={PANEL_TIPS.Links} />
      </div>

      {links.length === 0 && (
        <p className="text-sm text-muted-foreground">No links added yet.</p>
      )}

      <div className="space-y-2">
        {links.map((link, i) => {
          const iconData = getTypeIcon(link.type) // Retain icon reference configuration payload
          return (
            <div key={i} className="flex items-center gap-2 rounded-lg border p-2.5">
              {/* FIXED HERE: Wrap the configuration data inside HugeiconsIcon component */}
              <HugeiconsIcon icon={iconData} className="h-4 w-4 shrink-0 text-muted-foreground" />
              
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium truncate">{getTypeLabel(link)}</p>
                <p className="text-xs text-muted-foreground truncate">{link.url}</p>
              </div>
              <Button variant="ghost" size="icon" className="h-7 w-7 shrink-0" onClick={() => openEdit(i)}>
                <HugeiconsIcon icon={RotateClockwiseIcon} />
              </Button>
              <Button variant="ghost" size="icon" className="h-7 w-7 shrink-0 text-destructive" onClick={() => handleDelete(i)}>
                <HugeiconsIcon icon={Delete02Icon} />
              </Button>
            </div>
          )
        })}
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm" className="w-full gap-1.5" onClick={openAdd}>
            <HugeiconsIcon icon={PlusSignIcon} />
            Add Link
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingIndex !== null ? "Edit Link" : "Add Link"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label>Type</Label>
              <Select value={formType} onValueChange={setFormType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {linkTypeOptions.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {formType === "custom" && (
              <div className="space-y-1.5">
                <Label>Label</Label>
                <Input value={formLabel} onChange={(e) => setFormLabel(e.target.value)} placeholder="e.g. Stack Overflow" />
              </div>
            )}
            <div className="space-y-1.5">
              <Label>URL</Label>
              <Input value={formUrl} onChange={(e) => setFormUrl(e.target.value)} placeholder="https://..." />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSaveLink}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}