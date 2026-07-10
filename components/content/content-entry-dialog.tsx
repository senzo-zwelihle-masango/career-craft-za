"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog"

import { toast } from "sonner"
import { updateCv } from "@/lib/actions/user/curriculum-vitae"
import { HugeiconsIcon } from "@hugeicons/react"
import { Loading03Icon, PencilIcon } from "@hugeicons/core-free-icons"
import { ContentRichTextEditor } from "./content-rich-text-editor"
import { ContentDatePicker } from "./content-date-picker"

interface EntryType {
  id: string
  sectionId: string
  [key: string]: unknown
}

interface FieldDef {
  key: string
  label: string
  type: "text" | "textarea" | "date" | "richtext" | "switch" | "select"
  options?: { value: string; label: string }[]
}

export function ContentEntryDialog({
  cvId,
  sectionId,
  entry,
  fields,
  typeKey,
}: {
  cvId: string
  sectionId: string
  entry: EntryType
  fields: FieldDef[]
  typeKey:
    | "experienceEntries"
    | "educationEntries"
    | "projectEntries"
    | "certificationEntries"
    | "languageEntries"
    | "awardEntries"
    | "referenceEntries"
    | "customEntries"
}) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState<Record<string, unknown>>(() => {
    const obj: Record<string, unknown> = {}
    for (const f of fields) {
      obj[f.key] = entry[f.key] ?? ""
    }
    return obj
  })

  async function handleSave() {
    setSaving(true)
    const payload: Record<string, unknown> = {}
    for (const f of fields) {
      payload[f.key] = form[f.key]
    }
    const { error } = await updateCv(cvId, {
      sections: {
        update: [
          {
            where: { id: sectionId },
            data: {
              [typeKey]: {
                update: [{ where: { id: entry.id }, data: payload }],
              },
            },
          },
        ],
      },
    })
    setSaving(false)
    if (!error) {
      toast.success("Saved")
      setOpen(false)
      router.refresh()
    } else {
      toast.error("Failed to save")
    }
  }

  function setVal(key: string, val: unknown) {
    setForm((prev) => ({ ...prev, [key]: val }))
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button variant="ghost" size="icon" className="h-10 w-10 shrink-0" />
        }
      >
        <HugeiconsIcon icon={PencilIcon} />
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-lg">Edit entry</DialogTitle>
        </DialogHeader>
        <div className="max-h-[55vh] overflow-y-auto py-2">
          <div className="space-y-5 pr-1">
            {fields.map((f) => (
              <div key={f.key} className="space-y-1.5">
                <Label className="text-sm">{f.label}</Label>
                {f.type === "text" && (
                  <Input
                    className="h-11 text-base"
                    value={String(form[f.key] ?? "")}
                    onChange={(e) => setVal(f.key, e.target.value)}
                  />
                )}
                {f.type === "textarea" && (
                  <Textarea
                    className="min-h-[100px] text-base"
                    value={String(form[f.key] ?? "")}
                    onChange={(e) => setVal(f.key, e.target.value)}
                  />
                )}
                {f.type === "date" && (
                  <ContentDatePicker
                    value={String(form[f.key] ?? "")}
                    onChange={(v) => setVal(f.key, v)}
                  />
                )}
                {f.type === "richtext" && (
                  <ContentRichTextEditor
                    value={String(form[f.key] ?? "")}
                    onChange={(v) => setVal(f.key, v)}
                  />
                )}
                {f.type === "select" && f.options && (
                  <Select
                    value={String(form[f.key] ?? "")}
                    onValueChange={(v) => setVal(f.key, v)}
                  >
                    <SelectTrigger className="h-11 w-full rounded-xl border border-border bg-input/50 px-3 text-base outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30">
                      <SelectValue placeholder={`Select ${f.label.toLowerCase()}`} />
                    </SelectTrigger>
                    <SelectContent>
                      {f.options.map((o) => (
                        <SelectItem key={o.value} value={o.value}>
                          {o.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
                {f.type === "switch" && (
                  <Switch
                    checked={!!form[f.key]}
                    onCheckedChange={(v) => setVal(f.key, v)}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
        <DialogFooter className="mt-2 border-t pt-5">
          <Button onClick={handleSave} disabled={saving} size="lg">
            {saving && (
              <HugeiconsIcon icon={Loading03Icon} className="animate-spin" />
            )}
            Save changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
