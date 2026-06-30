import type { CvWithRelations } from "@/lib/data/editor/types"
import { ResumeHeader } from "../_base/ResumeHeader"
import { SectionRenderer, SectionIcon } from "../_base"
import { FONT_FAMILY_MAP } from "../_base/font-map"
import type { TemplateMeta } from "../types"

export function CleanLineTemplate({ resume }: { resume: CvWithRelations }) {
  const fs = resume.fontScale || 1
  const ss = resume.spacingScale || 1
  const pageFormat = resume.pageFormat || "A4"
  const maxWidth = pageFormat === "LETTER" ? "816px" : "794px"
  const accentColor = resume.accentColor || "#1f2937"
  const fontCSS = FONT_FAMILY_MAP[resume.fontFamily]?.css || resume.fontFamily || "Inter, sans-serif"

  const visibleSections = resume.sections
    .filter(s => s.visible !== false)
    .sort((a, b) => a.order - b.order)

  return (
    <div
      style={{
        fontFamily: fontCSS,
        fontSize: `${0.8125 * fs}rem`,
        lineHeight: 1.6 * ss,
        color: "#111827",
        maxWidth,
        margin: "0 auto",
        padding: `${36 * ss}px ${32 * ss}px`,
        background: "#fff",
        minHeight: "100%",
      }}
    >
      <ResumeHeader
        pd={resume.personalDetails}
        resume={resume}
        nameStyle={{
          fontSize: `${1.6 * fs}rem`,
          fontWeight: 300,
          color: "#111827",
          letterSpacing: "0.03em",
        }}
        contactStyle={{ color: "#9CA3AF", fontSize: `${0.7 * fs}rem` }}
        renderPhoto={false}
      />

      <div style={{ height: 1, background: "#E5E7EB", margin: `${16 * ss}px 0` }} />

      {visibleSections.map((section, idx) => (
        <div key={section.id}>
          {idx > 0 && (
            <div style={{ height: 1, background: "#E5E7EB", margin: `${4 * ss}px 0 ${16 * ss}px` }} />
          )}
          <h2
            style={{
              fontSize: `${0.65 * fs}rem`,
              fontWeight: 500,
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              color: "#9CA3AF",
              margin: 0,
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
          <SectionRenderer
            section={section}
            resume={resume}
            showDividers={false}
            entryStyle={resume.entryStyle || "bullet"}
            showEntryDates={resume.showEntryDates ?? true}
            showEntryLocation={resume.showEntryLocation ?? true}
            accentColor={accentColor}
            showSectionIcons={resume.showSectionIcons ?? false}
            headingStyle={resume.headingStyle || "uppercase"}
            headingWeight={resume.headingWeight || "bold"}
            noHeading
          />
        </div>
      ))}

      {resume.footer && (
        <div
          style={{
            marginTop: `${20 * ss}px`,
            paddingTop: `${12 * ss}px`,
            borderTop: "1px solid #E5E7EB",
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
  slug: "clean-line",
  name: "Clean Line",
  description: "Apple-inspired Swiss minimalism — thin rules, light gray headings, maximum whitespace",
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
