import type { CvWithRelations } from "@/lib/data/editor/types"
import { ResumeHeader } from "../_base/ResumeHeader"
import { SectionRenderer } from "../_base/SectionRenderer"
import { FONT_FAMILY_MAP } from "../_base/font-map"
import type { TemplateMeta } from "../types"

interface GraduateFirstTemplateProps {
  resume: CvWithRelations
}

export function GraduateFirstTemplate({ resume }: GraduateFirstTemplateProps) {
  const fs = resume.fontScale || 1
  const ss = resume.spacingScale || 1
  const pageFormat = resume.pageFormat || "A4"
  const maxWidth = pageFormat === "LETTER" ? "816px" : "794px"
  const accentColor = resume.accentColor || "#1f2937"
  const fontCSS = FONT_FAMILY_MAP[resume.fontFamily]?.css || resume.fontFamily || "Inter, sans-serif"

  const sorted = [...resume.sections]
    .filter((s) => s.visible !== false)
    .sort((a, b) => a.order - b.order)
  const education = sorted.filter((s) => s.type === "EDUCATION")
  const other = sorted.filter((s) => s.type !== "EDUCATION")
  const visibleSections = [...education, ...other]

  return (
    <div
      className="bg-white text-black min-h-full"
      style={{
        fontFamily: fontCSS,
        fontSize: `${0.875 * fs}rem`,
        lineHeight: `${1.5 * ss}`,
        padding: "20mm 18mm",
        maxWidth,
        margin: "0 auto",
      }}
    >
      <ResumeHeader
        pd={resume.personalDetails}
        resume={resume}
        nameStyle={{ fontSize: `${1.6 * fs}rem`, color: accentColor }}
      />

      {resume.showDividers && (
        <hr style={{ border: "none", borderTop: `2px solid ${accentColor}`, margin: `${12 * ss}px 0` }} />
      )}

      <div style={{ marginTop: `${12 * ss}px` }}>
        {visibleSections.map((section) => (
          <div key={section.id} style={{ marginBottom: `${16 * ss}px` }}>
            <SectionRenderer
              section={section}
              resume={resume}
              showDividers={resume.showDividers ?? true}
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
      </div>

      {resume.footer && (
        <div style={{ marginTop: `${16 * ss}px`, textAlign: "center", fontSize: `${0.7 * fs}rem`, color: "#9CA3AF" }}>
          {resume.footer}
        </div>
      )}
    </div>
  )
}

export const templateMeta: TemplateMeta = {
  slug: "graduate-first",
  name: "Graduate First",
  description: "Education-first layout for recent graduates",
  categories: ["first-job"],
  columnLayout: "single",
  supportsPhoto: false,
  sidebarSectionTypes: [],
  isPro: false,
  popular: false,
  defaultConfig: {
    fontFamily: "sans-serif",
    accentColor: "#0f766e",
    headingStyle: "normal",
    headingWeight: "bold",
    showDividers: true,
  },
}
