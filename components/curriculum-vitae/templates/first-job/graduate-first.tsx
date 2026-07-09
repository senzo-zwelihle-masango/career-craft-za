import type { CvWithRelations } from "@/types/curriculum-vitae/types"
import { CvHeader } from "../_base/CvHeader"
import { SectionRenderer } from "../_base/SectionRenderer"
import { FONT_FAMILY_MAP } from "../_base/font-map"
import type { TemplateMeta } from "@/types/templates/types"

interface GraduateFirstTemplateProps {
  cv: CvWithRelations
}

export function GraduateFirstTemplate({ cv }: GraduateFirstTemplateProps) {
  const fs = cv.fontScale || 1
  const ss = cv.spacingScale || 1
  const pageFormat = cv.pageFormat || "A4"
  const maxWidth = pageFormat === "LETTER" ? "816px" : "794px"
  const accentColor = cv.accentColor || "#1f2937"
  const fontCSS =
    FONT_FAMILY_MAP[cv.fontFamily]?.css || cv.fontFamily || "Inter, sans-serif"

  const sorted = [...cv.sections]
    .filter((s) => s.visible !== false)
    .sort((a, b) => a.order - b.order)
  const education = sorted.filter((s) => s.type === "EDUCATION")
  const other = sorted.filter((s) => s.type !== "EDUCATION")
  const visibleSections = [...education, ...other]

  return (
    <div
      className="min-h-full bg-white text-black"
      style={{
        fontFamily: fontCSS,
        fontSize: `${0.875 * fs}rem`,
        lineHeight: `${1.5 * ss}`,
        padding: "20mm 18mm",
        maxWidth,
        margin: "0 auto",
      }}
    >
      <CvHeader
        pd={cv.personalDetails}
        cv={cv}
        nameStyle={{ fontSize: `${1.6 * fs}rem`, color: accentColor }}
      />

      {cv.showDividers && (
        <hr
          style={{
            border: "none",
            borderTop: `2px solid ${accentColor}`,
            margin: `${12 * ss}px 0`,
          }}
        />
      )}

      <div style={{ marginTop: `${12 * ss}px` }}>
        {visibleSections.map((section) => (
          <div key={section.id} style={{ marginBottom: `${16 * ss}px` }}>
            <SectionRenderer
              section={section}
              cv={cv}
              showDividers={cv.showDividers ?? true}
              entryStyle={cv.entryStyle || "bullet"}
              showEntryDates={cv.showEntryDates ?? true}
              showEntryLocation={cv.showEntryLocation ?? true}
              accentColor={accentColor}
              showSectionIcons={cv.showSectionIcons ?? false}
              headingStyle={cv.headingStyle || "normal"}
              headingWeight={cv.headingWeight || "bold"}
            />
          </div>
        ))}
      </div>

      {cv.footer && (
        <div
          style={{
            marginTop: `${16 * ss}px`,
            textAlign: "center",
            fontSize: `${0.7 * fs}rem`,
            color: "#9CA3AF",
          }}
        >
          {cv.footer}
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
