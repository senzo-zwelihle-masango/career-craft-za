"use client"

import { ComponentProps, useState } from "react"
import { useRouter } from "next/navigation"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { SECTION_LABELS } from "@/types/curriculum-vitae/types"
import { addSection } from "@/lib/actions/user/curriculum-vitae"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  Award01Icon,
  Briefcase03Icon,
  ChampionIcon,
  File02Icon,
  Folder02Icon,
  LanguageCircleIcon,
  Loading03Icon,
  Mortarboard01Icon,
  PlusSignIcon,
  QuoteDownIcon,
  Wrench01Icon,
} from "@hugeicons/core-free-icons"

type HugeIcon = ComponentProps<typeof HugeiconsIcon>["icon"]

const sectionIcons: Record<string, HugeIcon> = {
  SUMMARY: File02Icon,
  SKILLS: Wrench01Icon,
  EXPERIENCE: Briefcase03Icon,
  EDUCATION: Mortarboard01Icon,
  PROJECTS: Folder02Icon,
  CERTIFICATIONS: Award01Icon,
  LANGUAGES: LanguageCircleIcon,
  AWARDS: ChampionIcon,
  REFERENCES: QuoteDownIcon,
  CUSTOM: PlusSignIcon,
}

interface AddSectionDialogProps {
  cvId: string
  existingTypes: string[]
}

export function ContentSectionDialog({
  cvId,
  existingTypes,
}: AddSectionDialogProps) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [adding, setAdding] = useState<string | null>(null)

  const allTypes = Object.keys(SECTION_LABELS)
  const available = allTypes.filter((t) => !existingTypes.includes(t))

  async function handleAddSection(type: string) {
    setAdding(type)
    const { error } = await addSection(cvId, type)
    if (!error) {
      toast.success(`${SECTION_LABELS[type]} added`)
      setOpen(false)
      router.refresh()
    } else {
      toast.error("Failed to add section")
    }
    setAdding(null)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button className="w-full gap-2" />}>
        <HugeiconsIcon icon={PlusSignIcon} className="h-4 w-4" />
        Add Section
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-lg">Add a section</DialogTitle>
        </DialogHeader>
        <div className="grid gap-3">
          {available.length === 0 && (
            <p className="text-base text-muted-foreground">
              All section types have been added.
            </p>
          )}
          {available.map((type) => {
            const sectionIcon = sectionIcons[type] ?? PlusSignIcon
            return (
              <button
                key={type}
                type="button"
                onClick={() => handleAddSection(type)}
                disabled={adding === type}
                className="flex items-center gap-4 rounded-lg border p-4 text-left transition-colors hover:bg-muted disabled:opacity-50"
              >
                {adding === type ? (
                  <HugeiconsIcon
                    icon={Loading03Icon}
                    className="h-5 w-5 animate-spin text-muted-foreground"
                  />
                ) : (
                  <HugeiconsIcon
                    icon={sectionIcon}
                    className="h-5 w-5 text-muted-foreground"
                  />
                )}
                <div>
                  <p className="text-base font-medium">
                    {SECTION_LABELS[type]}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {type === "SUMMARY" && "A brief professional summary"}
                    {type === "SKILLS" && "Grouped skills and competencies"}
                    {type === "EXPERIENCE" && "Work experience entries"}
                    {type === "EDUCATION" && "Educational background"}
                    {type === "PROJECTS" && "Notable projects"}
                    {type === "CERTIFICATIONS" && "Certifications and licenses"}
                    {type === "LANGUAGES" && "Language proficiencies"}
                    {type === "AWARDS" && "Awards and honors"}
                    {type === "REFERENCES" && "Professional references"}
                    {type === "CUSTOM" && "Custom section with free text"}
                  </p>
                </div>
              </button>
            )
          })}
        </div>
      </DialogContent>
    </Dialog>
  )
}
