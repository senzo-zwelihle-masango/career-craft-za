"use client"

import { useCallback, useEffect, useRef } from "react"
import { useEditorStore } from "@/lib/data/editor/store"
import { updateCv } from "@/lib/actions/curriculum-vitae"
import type { CvWithRelations } from "@/lib/data/editor/types"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  File02Icon,
  DashboardSquare02Icon,
  SlidersVerticalIcon,
  InputCursorTextIcon,
  ArrowUpDownIcon,
  Layers01Icon,
  HeadingIcon,
  TextIcon,
  SwatchIcon,
  PanelLeftIcon,
  PanelTop,
  Camera01Icon,
  Link02Icon,
  PanelBottom,
  Share01Icon,
  InformationCircleIcon,
  RotateClockwiseIcon,
  CodeIcon,
  PaintBucketIcon,
} from "@hugeicons/core-free-icons"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"

export const railItems = [
  { label: "Document", icon: File02Icon },
  { label: "Templates", icon: DashboardSquare02Icon },
  { label: "Layout", icon: SlidersVerticalIcon },
  { label: "Font Size", icon: InputCursorTextIcon },
  { label: "Spacing", icon: ArrowUpDownIcon },
  { label: "Entries", icon: Layers01Icon },
  { label: "Headings", icon: HeadingIcon },
  { label: "Font", icon: TextIcon },
  { label: "Colors", icon: SwatchIcon },
  { label: "Header", icon: PanelTop },
  { label: "Photo", icon: Camera01Icon },
  { label: "Links", icon: Link02Icon },
  { label: "Footer", icon: PanelBottom },
  { label: "Sections", icon: Layers01Icon },
  { label: "Share", icon: Share01Icon },
]

export const PANEL_TIPS: Record<string, string> = {
  Document:
    "Choose your CV language and preferred date format. UK English uses day-month order.",
  Templates:
    "Each template offers a unique layout. Preview thumbnail shows how your content will be arranged.",
  Layout:
    "A4 is standard in most countries. US Letter is used in the US and Canada. Content width controls how much of the page your content fills.",
  "Font Size":
    "Adjust overall text size. Smaller sizes (80\u201390%) fit more content. Larger sizes improve readability.",
  Spacing:
    "Tighter spacing (80\u201390%) fits more content. Looser spacing (110\u2013120%) improves readability and airiness.",
  Entries:
    "Bullets are recommended for experience \u2014 they're scannable. Paragraphs work better for summaries.",
  Headings:
    "Uppercase headings create a formal look. Small caps are more traditional. Icons add visual interest.",
  Font: "Serif fonts (Georgia) feel traditional and formal. Sans-serif (Inter) is modern and clean. Monospace is niche for technical roles.",
  Colors:
    "Choose a professional accent color. Dark navy and deep blue are safest for corporate roles.",
  Header:
    "Stacked is classic centering. Inline puts name and title side by side. Compact is minimal for fitting more content.",
  Photo:
    "Use a professional headshot. Keep it under 4MB. Photos are optional and not recommended for all industries.",
  Links:
    "Add links to your professional profiles. LinkedIn is the most important for most industries.",
  Footer:
    "Optional footer text appears at the bottom of your CV. Keep it brief.",
  Sections:
    "Drag sections to reorder. Hide sections you don't want to show. The order flows top to bottom.",
  Share:
    "Generate a public link to share your CV. Anyone with the link can view it.",
}

export const swatches = [
  "#1f2937",
  "#1e40af",
  "#166534",
  "#9a3412",
  "#831843",
  "#3730a3",
  "#0f766e",
  "#581c87",
  "#dc2626",
  "#ca8a04",
]

export const linkTypeOptions = [
  { value: "linkedin", label: "LinkedIn", icon: Link02Icon },
  { value: "github", label: "GitHub", icon: CodeIcon },
  { value: "figma", label: "Figma", icon: PaintBucketIcon },
  { value: "custom", label: "Custom", icon: Link02Icon },
]

export function useResumeUpdate() {
  const resume = useEditorStore((s) => s.cv)
  const updateResumeStateStore = useEditorStore((s) => s.updateCv)
  const cvIdRef = useRef(resume?.id)

  useEffect(() => {
    cvIdRef.current = resume?.id
  }, [resume?.id])

  const update = useCallback(
    async (field: string, value: unknown) => {
      if (!cvIdRef.current) return
      updateResumeStateStore({ [field]: value } as Partial<CvWithRelations>)
      const { error } = await updateCv(cvIdRef.current, { [field]: value })
      if (error) toast.error("Failed to update")
    },
    [updateResumeStateStore]
  )

  return { resume, update }
}

export function PanelTip({ tip }: { tip: string }) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <span className="inline-flex cursor-help">
          <HugeiconsIcon
            icon={InformationCircleIcon}
            className="h-3.5 w-3.5 text-muted-foreground/60 hover:text-muted-foreground"
          />
        </span>
      </TooltipTrigger>
      <TooltipContent
        side="top"
        className="max-w-[260px] text-xs leading-relaxed"
      >
        {tip}
      </TooltipContent>
    </Tooltip>
  )
}

export function ResetDefaults({
  fields,
  resume,
  update,
}: {
  fields: Record<string, unknown>
  resume: CvWithRelations | null
  update: (field: string, value: unknown) => void
}) {
  const isDefault = Object.entries(fields).every(([k, v]) => {
    const cur = resume ? (resume as Record<string, unknown>)[k] : undefined
    const def = v
    if (cur === def) return true
    if (cur === undefined && def === null) return true
    if (cur === null && def === undefined) return true
    return false
  })
  if (isDefault) return null
  return (
    <Button
      variant="ghost"
      size="sm"
      className="h-7 gap-1 text-xs text-muted-foreground"
      onClick={() => Object.entries(fields).forEach(([k, v]) => update(k, v))}
    >
      <HugeiconsIcon icon={RotateClockwiseIcon} />
      Reset defaults
    </Button>
  )
}
