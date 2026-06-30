import type { CvWithRelations } from "@/lib/data/editor/types"
import { ResumeHeader } from "../_base/ResumeHeader"
import { SectionRenderer, SectionIcon } from "../_base"
import { FONT_FAMILY_MAP } from "../_base/font-map"
import type { TemplateMeta } from "../types"

export function StructuredProTemplate({ resume }: { resume: CvWithRelations }) {
  const fs = resume.fontScale || 1
  const ss = resume.spacingScale || 1
  const pageFormat = resume.pageFormat || "A4"
  const maxWidth = pageFormat === "LETTER" ? "816px" : "794px"
  const accentColor = resume.accentColor || "#1e3a5f"
  const fontCSS = FONT_FAMILY_MAP[resume.fontFamily]?.css || resume.fontFamily || "Inter, sans-serif"

  const visibleSections = resume.sections
    .filter(s => s.visible !== false)
    .sort((a, b) => a.order - b.order)

  return (
    <div
      style={{
        fontFamily: fontCSS,
        fontSize: `${0.8125 * fs}rem`,
        lineHeight: 1.45 * ss,
        color: "#111827",
        maxWidth,
        margin: "0 auto",
        padding: `${28 * ss}px ${24 * ss}px`,
        background: "#fff",
        minHeight: "100%",
      }}
    >
      <div
        style={{
          background: `${accentColor}08`,
          borderRadius: 4,
          padding: `${20 * ss}px ${20 * ss}px ${16 * ss}px`,
          marginBottom: `${20 * ss}px`,
          borderLeft: `4px solid ${accentColor}`,
        }}
      >
        <ResumeHeader
          pd={resume.personalDetails}
          resume={resume}
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
            gap: `${16 * ss}px`,
            marginTop: `${4 * ss}px`,
            padding: `${8 * ss}px 0`,
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
              {resume.showSectionIcons && (
                <SectionIcon sectionType={section.type} size="1em" />
              )}
              {section.title}
            </h2>
          </div>
          <div>
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
              noHeading
            />
          </div>
        </div>
      ))}

      {resume.footer && (
        <div
          style={{
            marginTop: `${20 * ss}px`,
            textAlign: "center",
            fontSize: `${0.65 * fs}rem`,
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
  slug: "structured-pro",
  name: "Structured Pro",
  description: "Corporate structured — two-column section layout with section labels in a narrow left column",
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
