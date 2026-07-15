"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  File02Icon,
  Wrench01Icon,
  Briefcase01Icon,
  GraduationCapIcon,
  Folder02Icon,
  Certificate01Icon,
  LanguageCircleIcon,
  ChampionIcon,
  QuoteUpIcon,
  PlusSignIcon,
  Loading03Icon,
  Plus,
} from "@hugeicons/core-free-icons"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { toast } from "sonner"
import { updateCv } from "@/lib/actions/user/curriculum-vitae"
import { ContentSortableEntryList } from "./content-sortable-entry-list"
import { ContentDatePicker } from "./content-date-picker"
import { ContentRichTextEditor } from "./content-rich-text-editor"

export interface FieldDef {
  key: string
  label: string
  type: "text" | "date" | "richtext" | "switch" | "select"
  options?: { value: string; label: string }[]
}

export const EDUCATION_TYPES = [
  { value: "degree", label: "Degree" },
  { value: "diploma", label: "Diploma" },
  { value: "certificate", label: "Certificate" },
  { value: "associate", label: "Associate Degree" },
  { value: "masters", label: "Master's" },
  { value: "doctorate", label: "Doctorate" },
  { value: "bootcamp", label: "Bootcamp" },
  { value: "other", label: "Other" },
]

interface SectionEntriesEditorProps {
  cvId: string
  sectionId: string
  entries: Record<string, unknown>[]
  typeKey:
    | "experienceEntries"
    | "educationEntries"
    | "projectEntries"
    | "certificationEntries"
    | "languageEntries"
    | "awardEntries"
    | "referenceEntries"
    | "customEntries"
  fieldDefs: FieldDef[]
  newEntryLabel: string
  addButtonLabel: string
  requiredField?: string
  requiredFieldLabel?: string
  extraFields?: Record<string, unknown>
  renderEntry: (entry: Record<string, unknown>) => React.ReactNode
}

export function ContentSectionEntriesEditor({
  cvId,
  sectionId,
  entries,
  typeKey,
  fieldDefs,
  newEntryLabel,
  addButtonLabel,
  requiredField,
  requiredFieldLabel,
  extraFields,
  renderEntry,
}: SectionEntriesEditorProps) {
  const router = useRouter()
  const [newEntry, setNewEntry] = useState<Record<string, unknown>>({})
  const [saving, setSaving] = useState(false)

  async function handleAdd() {
    if (requiredField && !(newEntry[requiredField] as string)?.trim()) {
      toast.error(`${requiredFieldLabel ?? requiredField} is required`)
      return
    }
    setSaving(true)
    const order = entries?.length ?? 0
    const createData: Record<string, unknown> = { order, ...extraFields }
    for (const def of fieldDefs) {
      const val = newEntry[def.key]
      if (val) createData[def.key] = val
    }
    if (newEntry.current) createData.endDate = null
    const { error } = await updateCv(cvId, {
      sections: {
        update: [
          {
            where: { id: sectionId },
            data: { [typeKey]: { create: [createData] } },
          },
        ],
      },
    })
    setSaving(false)
    if (!error) {
      setNewEntry({})
      router.refresh()
      toast.success(`${addButtonLabel} added`)
    } else {
      toast.error(`Failed to add ${addButtonLabel.toLowerCase()}`)
    }
  }

  const formFields = fieldDefs.filter((d) => d.type !== "switch")
  const switchField = fieldDefs.find((d) => d.type === "switch")

  function renderFormFields() {
    const result: React.ReactNode[] = []
    for (let i = 0; i < formFields.length; i++) {
      const def = formFields[i]
      const next = formFields[i + 1]
      if (def.type === "date" && next?.type === "date") {
        result.push(
          <div
            key={def.key + "-" + next.key}
            className="grid grid-cols-1 gap-4 sm:grid-cols-2"
          >
            <div className="space-y-1.5">
              <Label className="text-sm">{def.label}</Label>
              <ContentDatePicker
                value={String(newEntry[def.key] ?? "")}
                onChange={(v) => setNewEntry({ ...newEntry, [def.key]: v })}
                placeholder={def.label}
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-sm">{next.label}</Label>
              <ContentDatePicker
                value={String(newEntry[next.key] ?? "")}
                onChange={(v) => setNewEntry({ ...newEntry, [next.key]: v })}
                placeholder={next.label}
              />
            </div>
          </div>
        )
        i++
      } else if (def.type === "date") {
        result.push(
          <div key={def.key} className="space-y-1.5">
            <Label className="text-sm">{def.label}</Label>
            <ContentDatePicker
              value={String(newEntry[def.key] ?? "")}
              onChange={(v) => setNewEntry({ ...newEntry, [def.key]: v })}
              placeholder={def.label}
            />
          </div>
        )
      } else if (def.type === "richtext") {
        result.push(
          <div key={def.key} className="space-y-1.5">
            <Label className="text-sm">{def.label}</Label>
            <ContentRichTextEditor
              value={String(newEntry[def.key] ?? "")}
              onChange={(v) => setNewEntry({ ...newEntry, [def.key]: v })}
              placeholder={"Describe " + def.label.toLowerCase() + "..."}
              minHeight={80}
            />
          </div>
        )
      } else if (def.type === "select" && def.options) {
        result.push(
          <div key={def.key} className="space-y-1.5">
            <Label className="text-sm">
              {def.label}
              {requiredField === def.key && (
                <span className="ml-1 text-destructive">*</span>
              )}
            </Label>
            <Select
              value={String(newEntry[def.key] ?? "")}
              onValueChange={(v) => setNewEntry({ ...newEntry, [def.key]: v })}
            >
              <SelectTrigger className="h-11 w-full rounded-xl border border-border bg-input/50 px-3 text-base outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30">
                <SelectValue
                  placeholder={`Select ${def.label.toLowerCase()}`}
                />
              </SelectTrigger>
              <SelectContent>
                {def.options.map((o) => (
                  <SelectItem key={o.value} value={o.value}>
                    {o.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )
      } else {
        result.push(
          <div key={def.key} className="space-y-1.5">
            <Label className="text-sm">
              {def.label}
              {requiredField === def.key && (
                <span className="ml-1 text-destructive">*</span>
              )}
            </Label>
            <Input
              className="h-11 text-base"
              placeholder={"e.g. " + def.label}
              value={String(newEntry[def.key] ?? "")}
              onChange={(e) =>
                setNewEntry({ ...newEntry, [def.key]: e.target.value })
              }
            />
          </div>
        )
      }
    }
    return result
  }

  return (
    <div className="space-y-4">
      <ContentSortableEntryList
        cvId={cvId}
        sectionId={sectionId}
        entries={entries as { id: string; [key: string]: unknown }[]}
        typeKey={typeKey}
      >
        {(entry: Record<string, unknown>) => (
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0 flex-1">{renderEntry(entry)}</div>
          </div>
        )}
      </ContentSortableEntryList>

      <div className="space-y-4 rounded-xl border-0 bg-zinc-50/50 p-5 shadow-sm dark:bg-zinc-800/30">
        <p className="text-sm font-semibold text-muted-foreground">
          {newEntryLabel}
        </p>
        {renderFormFields()}
        {switchField && (
          <label className="flex items-center gap-3 text-base">
            <Switch
              checked={!!newEntry.current}
              onCheckedChange={(v) => setNewEntry({ ...newEntry, current: v })}
            />
            {switchField.label}
          </label>
        )}
        <Button onClick={handleAdd} disabled={saving}>
          {saving ? (
            <HugeiconsIcon icon={Loading03Icon} className="animate-spin" />
          ) : (
            <HugeiconsIcon icon={Plus} />
          )}
          Add {addButtonLabel}
        </Button>
      </div>
    </div>
  )
}
