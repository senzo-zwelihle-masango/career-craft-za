import type { CvWithRelations } from "@/types/curriculum-vitae/types"
import { CvHeader } from "../_base/CvHeader"
import { SectionRenderer, SectionIcon } from "../_base"
import { FONT_FAMILY_MAP } from "../_base/font-map"
import type { TemplateMeta } from "@/types/templates/types"

function OrnamentalDivider({ accentColor }: { accentColor: string }) {
  return (
    <div
      style={{
        textAlign: "center",
        fontSize: `${0.625}rem`,
        color: `${accentColor}60`,
        letterSpacing: 8,
        margin: "14px 0 10px",
      }}
    >
      ✦ ⁂ ✦
    </div>
  )
}

export function EditorialRuleTemplate({ cv }: { cv: CvWithRelations }) {
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
    FONT_FAMILY_MAP[cv.fontFamily]?.css || cv.fontFamily || "Georgia, serif"

  const visibleSections = cv.sections
    .filter((s) => s.visible !== false)
    .sort((a, b) => a.order - b.order)

  return (
    <div
      style={{
        fontFamily: fontCSS,
        fontSize: `${0.875 * fs}rem`,
        lineHeight: 1.6 * lh,
        color: "#111827",
        maxWidth,
        margin: "0 auto",
        padding: `${38 * mv}px ${30 * mh}px`,
        background: "#fffaf5",
        minHeight: "100%",
      }}
    >
      <div style={{ textAlign: "center" }}>
        <CvHeader
          pd={cv.personalDetails}
          cv={cv}
          nameStyle={{
            fontSize: `${1.75 * fs}rem`,
            fontWeight: 400,
            color: accentColor,
            letterSpacing: "0.08em",
          }}
          contactStyle={{
            color: "#6B7280",
            fontSize: `${0.7 * fs}rem`,
            fontStyle: "italic",
          }}
          renderPhoto={false}
        />
      </div>

      <div
        style={{
          textAlign: "center",
          color: `${accentColor}40`,
          fontSize: `${0.5 * fs}rem`,
          letterSpacing: 12,
          margin: `${10 * es}px 0 ${6 * es}px`,
        }}
      >
        ❧
      </div>

      <div
        style={{
          height: 1,
          background: `linear-gradient(to right, transparent, ${accentColor}40, transparent)`,
          marginBottom: `${14 * es}px`,
        }}
      />

      {visibleSections.map((section, idx) => (
        <div key={section.id}>
          {idx > 0 && <OrnamentalDivider accentColor={accentColor} />}

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              marginBottom: 6,
            }}
          >
            <div
              style={{
                flex: 1,
                height: 1,
                background: `linear-gradient(to right, ${accentColor}60, ${accentColor}20)`,
              }}
            />
            <h2
              style={{
                fontSize: `${0.7 * fs}rem`,
                fontWeight: 500,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: accentColor,
                margin: 0,
                textAlign: "center",
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
              }}
            >
              {cv.showSectionIcons && (
                <SectionIcon sectionType={section.type} size="1em" />
              )}
              {section.title}
            </h2>
            <div
              style={{
                flex: 1,
                height: 1,
                background: `linear-gradient(to right, ${accentColor}20, transparent)`,
              }}
            />
          </div>

          <div style={{ textAlign: "justify" }}>
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
            marginTop: `${24 * es}px`,
            textAlign: "center",
            fontSize: `${0.65 * fs}rem`,
            color: "#9CA3AF",
            fontStyle: "italic",
          }}
        >
          <div
            style={{
              width: 32,
              height: 1,
              background: `${accentColor}30`,
              margin: "0 auto 8px",
            }}
          />
          {cv.footer}
        </div>
      )}
    </div>
  )
}

export const templateMeta: TemplateMeta = {
  slug: "editorial-rule",
  name: "Editorial Rule",
  description:
    "Magazine editorial layout – decorative ruled headings, ornamental dividers, justified text",
  categories: ["simple"],
  columnLayout: "single",
  supportsPhoto: false,
  sidebarSectionTypes: [],
  isPro: false,
  popular: true,
  defaultConfig: {
    fontFamily: "serif",
    accentColor: "#78716c",
    headingStyle: "uppercase",
    headingWeight: "bold",
    showDividers: false,
  },
}
