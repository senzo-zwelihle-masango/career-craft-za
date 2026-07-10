import type { CvWithRelations } from "@/types/curriculum-vitae/types"
import { CvHeader } from "../_base/CvHeader"
import { SectionRenderer, SectionIcon } from "../_base"
import { FONT_FAMILY_MAP } from "../_base/font-map"
import type { TemplateMeta } from "@/types/templates/types"

export function StructuredProTemplate({ cv }: { cv: CvWithRelations }) {
  const fs = cv.fontScale || 1
  const ss = cv.spacingScale || 1
  const lh = cv.lineHeight ?? ss
  const es = cv.elementSpacing ?? ss
  const mh = cv.marginHorizontal ?? ss
  const mv = cv.marginVertical ?? ss
  const pageFormat = cv.pageFormat || "A4"
  const maxWidth = pageFormat === "LETTER" ? "816px" : "794px"
  const accentColor = cv.accentColor || "#1e3a5f"
  const fontCSS =
    FONT_FAMILY_MAP[cv.fontFamily]?.css || cv.fontFamily || "Inter, sans-serif"

  const visibleSections = cv.sections
    .filter((s) => s.visible !== false)
    .sort((a, b) => a.order - b.order)

  return (
    <div
      style={{
        fontFamily: fontCSS,
        fontSize: `${0.8125 * fs}rem`,
        lineHeight: 1.45 * lh,
        color: "#111827",
        maxWidth,
        margin: "0 auto",
        padding: `${28 * mv}px ${24 * mh}px`,
        background: "#fff",
        minHeight: "100%",
      }}
    >
      <div
        style={{
          background: `${accentColor}08`,
          borderRadius: 4,
          padding: `${20 * mv}px ${20 * mh}px ${16 * mv}px`,
          marginBottom: `${20 * es}px`,
          borderLeft: `4px solid ${accentColor}`,
        }}
      >
        <CvHeader
          pd={cv.personalDetails}
          cv={cv}
          nameStyle={{
            fontSize: `${1.5 * fs}rem`,
            fontWeight: 700,
            color: accentColor,
          }}
          contactStyle={{ color: "#4B5563", fontSize: `${0.7 * fs}rem` }}
          renderPhoto={false}
        />
      </div>

      {visibleSections.map((section) => (
        <div
          key={section.id}
          style={{
            display: "grid",
            gridTemplateColumns: "200px 1fr",
            gap: `${16 * es}px`,
            marginTop: `${4 * es}px`,
            padding: `${8 * es}px 0`,
            borderBottom: `1px solid ${accentColor}15`,
          }}
        >
          <div>
            <h2
              style={{
                fontSize: `${0.65 * fs}rem`,
                fontWeight: 700,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                color: accentColor,
                margin: 0,
                paddingTop: 2,
                display: "flex",
                alignItems: "center",
                gap: 6,
              }}
            >
              {cv.showSectionIcons && (
                <SectionIcon sectionType={section.type} size="1em" />
              )}
              {section.title}
            </h2>
          </div>
          <div>
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
              noHeading
            />
          </div>
        </div>
      ))}

      {cv.footer && (
        <div
          style={{
            marginTop: `${20 * es}px`,
            textAlign: "center",
            fontSize: `${0.65 * fs}rem`,
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
  slug: "structured-pro",
  name: "Structured Pro",
  description:
    "Corporate structured – two-column section layout with section labels in a narrow left column",
  categories: ["simple"],
  columnLayout: "single",
  supportsPhoto: false,
  sidebarSectionTypes: [],
  isPro: false,
  popular: true,
  defaultConfig: {
    fontFamily: "sans-serif",
    accentColor: "#1e3a5f",
    headingStyle: "uppercase",
    headingWeight: "bold",
    showDividers: false,
  },
}
