import { ClassicCoverLetter } from "./cover-letter/classic-cover-letter"
import { CompactCoverLetter } from "./cover-letter/compact-cover-letter"
import { EditorialCoverLetter } from "./cover-letter/editorial-cover-letter"
import { ExecutiveCoverLetter } from "./cover-letter/executive-cover-letter"
import { MinimalCoverLetter } from "./cover-letter/minimal-cover-letter"
import { ModernCoverLetter } from "./cover-letter/modern-cover-letter"
import type { CoverLetterTemplateData } from "./types"




export type CoverLetterTemplateComponent = (props: {
  data: CoverLetterTemplateData
}) => React.ReactElement

export const COVER_LETTER_TEMPLATE_REGISTRY: Record<string, CoverLetterTemplateComponent> = {
  classic: ClassicCoverLetter,
  modern: ModernCoverLetter,
  minimal: MinimalCoverLetter,
  executive: ExecutiveCoverLetter,
  editorial: EditorialCoverLetter,
  compact: CompactCoverLetter,
}

export function getCoverLetterTemplate(id: string): CoverLetterTemplateComponent {
  return COVER_LETTER_TEMPLATE_REGISTRY[id] || ClassicCoverLetter
}

export const COVER_LETTER_TEMPLATES = [
  { id: "classic", name: "Classic", description: "Traditional letter format with serif typography and ruled separators" },
  { id: "modern", name: "Modern", description: "Clean sans-serif layout with accent header bar" },
  { id: "minimal", name: "Minimal", description: "Light, airy design with subtle separators and generous whitespace" },
  { id: "executive", name: "Executive", description: "Formal layout with decorative borders for senior positions" },
  { id: "editorial", name: "Editorial", description: "Magazine-inspired centered layout with ornamental dividers" },
  { id: "compact", name: "Compact", description: "Space-efficient layout with dense header and minimal spacing" },
]
