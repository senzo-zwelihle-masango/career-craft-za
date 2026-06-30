import type { CvWithRelations } from "@/lib/data/editor/types"
import { ResumeHeader } from "../_base/ResumeHeader"
import { SectionRenderer } from "../_base/SectionRenderer"
import { FONT_FAMILY_MAP } from "../_base/font-map"
import type { TemplateMeta } from "../types"

interface CleanStartTemplateProps {
  resume: CvWithRelations
}

export function CleanStartTemplate({ resume }: CleanStartTemplateProps) {
  const fs = resume.fontScale || 1
  const ss = resume.spacingScale || 1
  const pageFormat = resume.pageFormat || "A4"
  const maxWidth = pageFormat === "LETTER" ? "816px" : "794px"
  const accentColor = resume.accentColor || "#1f2937"
  const fontCSS = FONT_FAMILY_MAP[resume.fontFamily]?.css || resume.fontFamily || "Inter, sans-serif"

  const sections = [...resume.sections]
    .filter((s) => s.visible !== false)
    .sort((a, b) => a.order - b.order)

  return (
    <div
      className="bg-white text-black min-h-full"
      style={{
        fontFamily: fontCSS,
        fontSize: `${0.9375 * fs}rem`,
        lineHeight: `${1.6 * ss}`,
        padding: "25mm 20mm",
        maxWidth,
        margin: "0 auto",
      }}
    >
      <ResumeHeader
        pd={resume.personalDetails}
        resume={resume}
        nameStyle={{ fontSize: `${2 * fs}rem`, color: accentColor, fontWeight: 300 }}
      />

      <div style={{ height: `${20 * ss}px` }} />

      {sections.map((section, idx) => (
        <div key={section.id}>
          {idx > 0 && (
            <hr
              style={{
                border: "none",
                borderTop: "1px solid #E5E7EB",
                margin: `${20 * ss}px 0 ${16 * ss}px`,
                opacity: 0.6,
              }}
            />
          )}
          <SectionRenderer
            section={section}
            resume={resume}
            showDividers={false}
            entryStyle={resume.entryStyle || "bullet"}
            showEntryDates={resume.showEntryDates ?? true}
            showEntryLocation={resume.showEntryLocation ?? true}
            accentColor={accentColor}
            showSectionIcons={resume.showSectionIcons ?? false}
            headingStyle={resume.headingStyle || "normal"}
            headingWeight={resume.headingWeight || "bold"}
          />
        </div>
      ))}

      {resume.footer && (
        <div
          style={{
            marginTop: `${24 * ss}px`,
            textAlign: "center",
            fontSize: `${0.75 * fs}rem`,
            color: "#9CA3AF",
          }}
        >
          {resume.footer}
        </div>
      )}
    </div>
  )
}

export const templateMeta: TemplateMeta = {
  slug: "clean-start",
  name: "Clean Start",
  description: "Minimal well-spaced design with larger fonts, ideal for early-career candidates",
  categories: ["first-job"],
  columnLayout: "single",
  supportsPhoto: false,
  sidebarSectionTypes: [],
  isPro: false,
  popular: false,
  defaultConfig: {
    fontFamily: "sans-serif",
    accentColor: "#6d28d9",
    headingStyle: "normal",
    headingWeight: "bold",
    showDividers: false,
  },
}
