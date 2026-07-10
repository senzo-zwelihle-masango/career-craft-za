import type { CvWithRelations } from "@/types/curriculum-vitae/types"
import { CvHeader } from "../_base/CvHeader"
import { SectionRenderer, SectionIcon } from "../_base"
import { FONT_FAMILY_MAP } from "../_base/font-map"
import type { TemplateMeta } from "@/types/templates/types"

export function CleanLineTemplate({ cv }: { cv: CvWithRelations }) {
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

  const visibleSections = cv.sections
    .filter((s) => s.visible !== false)
    .sort((a, b) => a.order - b.order)

  return (
    <div
      style={{
        fontFamily: fontCSS,
        fontSize: `${0.8125 * fs}rem`,
        lineHeight: 1.6 * lh,
        color: "#111827",
        maxWidth,
        margin: "0 auto",
        padding: `${36 * mv}px ${32 * mh}px`,
        background: "#fff",
        minHeight: "100%",
      }}
    >
      <CvHeader
        pd={cv.personalDetails}
        cv={cv}
        nameStyle={{
          fontSize: `${1.6 * fs}rem`,
          fontWeight: 300,
          color: "#111827",
          letterSpacing: "0.03em",
        }}
        contactStyle={{ color: "#9CA3AF", fontSize: `${0.7 * fs}rem` }}
        renderPhoto={false}
      />

      <div
        style={{
          height: 1,
          background: `${accentColor}18`,
          margin: `${16 * es}px 0`,
        }}
      />

      {visibleSections.map((section, idx) => (
        <div key={section.id}>
          {idx > 0 && (
            <div
              style={{
                height: 1,
                background: `${accentColor}18`,
                margin: `${4 * es}px 0 ${16 * es}px`,
              }}
            />
          )}
          <h2
            style={{
              fontSize: `${0.65 * fs}rem`,
              fontWeight: 500,
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              color: accentColor,
              margin: 0,
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
          <SectionRenderer
            section={section}
            cv={cv}
            showDividers={false}
            entryStyle={cv.entryStyle || "bullet"}
            showEntryDates={cv.showEntryDates ?? true}
            showEntryLocation={cv.showEntryLocation ?? true}
            accentColor={accentColor}
            showSectionIcons={cv.showSectionIcons ?? false}
            headingStyle={cv.headingStyle || "uppercase"}
            headingWeight={cv.headingWeight || "bold"}
            noHeading
          />
        </div>
      ))}

      {cv.footer && (
        <div
          style={{
            marginTop: `${20 * es}px`,
            paddingTop: `${12 * es}px`,
            borderTop: "1px solid #E5E7EB",
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
  slug: "clean-line",
  name: "Clean Line",
  description:
    "Apple-inspired Swiss minimalism – thin rules, light gray headings, maximum whitespace",
  categories: ["simple"],
  columnLayout: "single",
  supportsPhoto: false,
  sidebarSectionTypes: [],
  isPro: false,
  popular: true,
  defaultConfig: {
    fontFamily: "sans-serif",
    accentColor: "#1f2937",
    headingStyle: "uppercase",
    headingWeight: "bold",
    showDividers: false,
  },
}
