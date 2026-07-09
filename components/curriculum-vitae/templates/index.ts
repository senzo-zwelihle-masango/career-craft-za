import type { CvWithRelations } from "@/types/curriculum-vitae/types"

// Simple
import {
  CleanLineTemplate,
  templateMeta as cleanLineMeta,
} from "./simple/clean-line"
import {
  EditorialRuleTemplate,
  templateMeta as editorialRuleMeta,
} from "./simple/editorial-rule"
import {
  StructuredProTemplate,
  templateMeta as structuredProMeta,
} from "./simple/structured-pro"
import {
  CentredSerifTemplate,
  templateMeta as centredSerifMeta,
} from "./simple/centred-serif"

// Modern
import {
  SidebarSlateTemplate,
  templateMeta as sidebarSlateMeta,
} from "./modern/sidebar-slate"
import {
  AccentBandTemplate,
  templateMeta as accentBandMeta,
} from "./modern/accent-band"
import {
  SplitHeadTemplate,
  templateMeta as splitHeadMeta,
} from "./modern/split-head"
import {
  GradientCapTemplate,
  templateMeta as gradientCapMeta,
} from "./modern/gradient-cap"

// Creative
import {
  RuledEditorial as RuledEditorialTemplate,
  templateMeta as ruledEditorialMeta,
} from "./creative/ruled-editorial"
import {
  BoldStamp as BoldStampTemplate,
  templateMeta as boldStampMeta,
} from "./creative/bold-stamp"
import {
  SidebarInk as SidebarInkTemplate,
  templateMeta as sidebarInkMeta,
} from "./creative/sidebar-ink"

// Photo
import {
  PhotoHeaderFloatTemplate,
  templateMeta as photoHeaderFloatMeta,
} from "./photo/photo-header-float"
import {
  PhotoCentredTemplate,
  templateMeta as photoCentredMeta,
} from "./photo/photo-centred"

// Compact
import {
  ExecFormalTemplate,
  templateMeta as execFormalMeta,
} from "./compact/exec-formal"
import {
  DenseTwoColTemplate,
  templateMeta as denseTwoColMeta,
} from "./compact/dense-two-col"
import {
  CondensedRuleTemplate,
  templateMeta as condensedRuleMeta,
} from "./compact/condensed-rule"

// First Job
import {
  GraduateFirstTemplate,
  templateMeta as graduateFirstMeta,
} from "./first-job/graduate-first"
import {
  StudentSidebarTemplate,
  templateMeta as studentSidebarMeta,
} from "./first-job/student-sidebar"
import {
  CleanStartTemplate,
  templateMeta as cleanStartMeta,
} from "./first-job/clean-start"

export type TemplateComponent = (props: {
  cv: CvWithRelations
}) => React.ReactElement

export interface TemplateInfo {
  id: string
  name: string
  description: string
  categories: string[]
  columnLayout: string
  supportsPhoto: boolean
  isPro: boolean
  popular: boolean
  defaultConfig: Record<string, unknown>
}

type TemplateEntry = {
  component: TemplateComponent
  meta: typeof cleanLineMeta
}

const registry = new Map<string, TemplateEntry>()

function register(
  slug: string,
  component: TemplateComponent,
  meta: typeof cleanLineMeta
) {
  registry.set(slug, { component, meta })
}

// Register all templates
register("clean-line", CleanLineTemplate, cleanLineMeta)
register("editorial-rule", EditorialRuleTemplate, editorialRuleMeta)
register("structured-pro", StructuredProTemplate, structuredProMeta)
register("centred-serif", CentredSerifTemplate, centredSerifMeta)

register("sidebar-slate", SidebarSlateTemplate, sidebarSlateMeta)
register("accent-band", AccentBandTemplate, accentBandMeta)
register("split-head", SplitHeadTemplate, splitHeadMeta)
register("gradient-cap", GradientCapTemplate, gradientCapMeta)

register("ruled-editorial", RuledEditorialTemplate, ruledEditorialMeta)
register("bold-stamp", BoldStampTemplate, boldStampMeta)
register("sidebar-ink", SidebarInkTemplate, sidebarInkMeta)

register("photo-header-float", PhotoHeaderFloatTemplate, photoHeaderFloatMeta)
register("photo-centred", PhotoCentredTemplate, photoCentredMeta)

register("exec-formal", ExecFormalTemplate, execFormalMeta)
register("dense-two-col", DenseTwoColTemplate, denseTwoColMeta)
register("condensed-rule", CondensedRuleTemplate, condensedRuleMeta)

register("graduate-first", GraduateFirstTemplate, graduateFirstMeta)
register("student-sidebar", StudentSidebarTemplate, studentSidebarMeta)
register("clean-start", CleanStartTemplate, cleanStartMeta)

// Backward compatibility aliases
const ALIASES: Record<string, string> = {
  classic: "clean-line",
  "modern-sidebar": "sidebar-slate",
  minimal: "editorial-rule",
  executive: "exec-formal",
  creative: "gradient-cap",
  compact: "dense-two-col",
  "two-column": "split-head",
  divided: "ruled-editorial",
  banner: "accent-band",
  ruled: "structured-pro",
}

export function getTemplate(id: string): TemplateComponent {
  const resolved = ALIASES[id] || id
  return registry.get(resolved)?.component || CleanLineTemplate
}

export function getTemplateInfo(id: string): TemplateInfo | null {
  const resolved = ALIASES[id] || id
  const entry = registry.get(resolved)
  if (!entry) return null
  return {
    id: resolved,
    name: entry.meta.name,
    description: entry.meta.description,
    categories: entry.meta.categories,
    columnLayout: entry.meta.columnLayout,
    supportsPhoto: entry.meta.supportsPhoto,
    isPro: entry.meta.isPro,
    popular: entry.meta.popular,
    defaultConfig: entry.meta.defaultConfig,
  }
}

export function getAllTemplates(): TemplateInfo[] {
  return Array.from(registry.entries()).map(([id, entry]) => ({
    id,
    name: entry.meta.name,
    description: entry.meta.description,
    categories: entry.meta.categories,
    columnLayout: entry.meta.columnLayout,
    supportsPhoto: entry.meta.supportsPhoto,
    isPro: entry.meta.isPro,
    popular: entry.meta.popular,
    defaultConfig: entry.meta.defaultConfig,
  }))
}

// Keep TEMPLATES export for backward compatibility with customize-editor
export const TEMPLATES = getAllTemplates()
