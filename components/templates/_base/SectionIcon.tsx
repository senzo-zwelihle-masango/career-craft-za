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
} from "@hugeicons/core-free-icons"
import type { IconSvgElement } from "@hugeicons/react"

const ICON_MAP: Record<string, IconSvgElement> = {
  SUMMARY: File02Icon,
  SKILLS: Wrench01Icon,
  EXPERIENCE: Briefcase01Icon,
  EDUCATION: GraduationCapIcon,
  PROJECTS: Folder02Icon,
  CERTIFICATIONS: Certificate01Icon,
  LANGUAGES: LanguageCircleIcon,
  AWARDS: ChampionIcon,
  REFERENCES: QuoteUpIcon,
  CUSTOM: PlusSignIcon,
}

export function SectionIcon({
  sectionType,
  size = "1em",
}: {
  sectionType: string
  size?: string | number
}) {
  const icon = ICON_MAP[sectionType]
  if (!icon) return null
  return <HugeiconsIcon icon={icon} size={size} />
}

export { ICON_MAP }
