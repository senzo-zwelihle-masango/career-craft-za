import type { CvWithRelations } from "@/types/curriculum-vitae/types"
import { CvHeader } from "../_base/CvHeader"
import { SectionRenderer } from "../_base/SectionRenderer"
import { FONT_FAMILY_MAP } from "../_base/font-map"
import type { TemplateMeta } from "@/types/templates/types"

interface CleanStartTemplateProps {
  cv: CvWithRelations
}

export function CleanStartTemplate({ cv }: CleanStartTemplateProps) {
  const fs = cv.fontScale || 1
  const ss = cv.spacingScale || 1
  const lh = cv.lineHeight ?? ss
  const es = cv.elementSpacing ?? ss
  const mh = cv.marginHorizontal ?? ss
  const mv = cv.marginVertical ?? ss
  const pageFormat = cv.pageFormat || "A4"
  const maxWidth = pageFormat === "LETTER" ? "816px" : "794px"
  const accentColor = cv.accentColor || "#1f2937"
  const fontCSS =
    FONT_FAMILY_MAP[cv.fontFamily]?.css || cv.fontFamily || "Inter, sans-serif"

  const sections = [...cv.sections]
    .filter((s) => s.visible !== false)
    .sort((a, b) => a.order - b.order)

  return (
    <div
      className="min-h-full bg-white text-black"
      style={{
        fontFamily: fontCSS,
        fontSize: `${0.9375 * fs}rem`,
        lineHeight: `${1.6 * lh}`,
        padding: "25mm 20mm",
        maxWidth,
        margin: "0 auto",
      }}
    >
      <CvHeader
        pd={cv.personalDetails}
        cv={cv}
        nameStyle={{
          fontSize: `${2 * fs}rem`,
          color: accentColor,
          fontWeight: 300,
        }}
      />

            <div style={{ height: `${20 * es}px` }} />

      {sections.map((section, idx) => (
        <div key={section.id}>
          {idx > 0 && (
            <hr
              style={{
                border: "none",
                borderTop: "1px solid #E5E7EB",
                margin: `${20 * es}px 0 ${16 * es}px`,
                opacity: 0.6,
              }}
            />
          )}
          <SectionRenderer
            section={section}
            cv={cv}
            showDividers={false}
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

      {cv.footer && (
        <div
          style={{
            marginTop: `${24 * es}px`,
            textAlign: "center",
            fontSize: `${0.75 * fs}rem`,
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
  slug: "clean-start",
  name: "Clean Start",
  description:
    "Minimal well-spaced design with larger fonts, ideal for early-career candidates",
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
