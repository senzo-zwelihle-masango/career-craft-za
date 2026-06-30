import type { CvWithRelations } from "@/lib/data/editor/types"
import { ResumeHeader } from "../_base/ResumeHeader"
import { SectionRenderer } from "../_base/SectionRenderer"
import { FONT_FAMILY_MAP } from "../_base/font-map"
import type { TemplateMeta } from "../types"

interface StudentSidebarTemplateProps {
  resume: CvWithRelations
}

export function StudentSidebarTemplate({ resume }: StudentSidebarTemplateProps) {
  const fs = resume.fontScale || 1
  const ss = resume.spacingScale || 1
  const pageFormat = resume.pageFormat || "A4"
  const maxWidth = pageFormat === "LETTER" ? "816px" : "794px"
  const accentColor = resume.accentColor || "#1f2937"
  const fontCSS = FONT_FAMILY_MAP[resume.fontFamily]?.css || resume.fontFamily || "Inter, sans-serif"

  const sorted = [...resume.sections]
    .filter((s) => s.visible !== false)
    .sort((a, b) => a.order - b.order)

  const sidebarTypes = ["SKILLS", "LANGUAGES", "EDUCATION"]
  const sidebarSections = sorted.filter((s) => sidebarTypes.includes(s.type))
  const mainSections = sorted.filter((s) => !sidebarTypes.includes(s.type))

  return (
    <div
      className="flex bg-white text-black min-h-full"
      style={{
        fontFamily: fontCSS,
        fontSize: `${0.8125 * fs}rem`,
        lineHeight: `${1.5 * ss}`,
        maxWidth,
        margin: "0 auto",
      }}
    >
      {/* Main content */}
      <div className="flex-1" style={{ padding: `${16 * ss}px ${18 * ss}px` }}>
        <ResumeHeader
          pd={resume.personalDetails}
          resume={resume}
          nameStyle={{ fontSize: `${1.5 * fs}rem`, color: accentColor }}
        />

        {resume.showDividers && (
          <hr style={{ border: "none", borderTop: `2px solid ${accentColor}`, margin: `${10 * ss}px 0` }} />
        )}

        <div style={{ marginTop: `${10 * ss}px` }}>
          {mainSections.map((section) => (
            <div key={section.id} style={{ marginBottom: `${14 * ss}px` }}>
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
          <div style={{ marginTop: `${14 * ss}px`, textAlign: "center", fontSize: `${0.7 * fs}rem`, color: "#9CA3AF" }}>
            {resume.footer}
          </div>
        )}
      </div>

      {/* Sidebar */}
      <div
        className="w-[28%] shrink-0"
        style={{
          backgroundColor: "#F3F4F6",
          padding: `${16 * ss}px ${14 * ss}px`,
        }}
      >
        {resume.personalDetails && (
          <div style={{ marginBottom: `${12 * ss}px` }}>
            <h3
              style={{
                fontSize: `${0.65 * fs}rem`,
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                color: accentColor,
                margin: 0,
              }}
            >
              Contact
            </h3>
            <hr style={{ border: "none", borderTop: "1px solid #D1D5DB", margin: `${4 * ss}px 0` }} />
            <div style={{ fontSize: `${0.75 * fs}rem`, color: "#374151", lineHeight: `${1.6 * ss}` }}>
              {resume.personalDetails.email && <p style={{ margin: `${2 * ss}px 0` }}>{resume.personalDetails.email}</p>}
              {resume.personalDetails.phone && <p style={{ margin: `${2 * ss}px 0` }}>{resume.personalDetails.phone}</p>}
              {resume.personalDetails.location && <p style={{ margin: `${2 * ss}px 0` }}>{resume.personalDetails.location}</p>}
            </div>
          </div>
        )}

        {sidebarSections.map((section) => (
          <div key={section.id} style={{ marginBottom: `${12 * ss}px` }}>
            <SectionRenderer
              section={section}
              resume={resume}
              showDividers={false}
              entryStyle={resume.entryStyle || "bullet"}
              showEntryDates={resume.showEntryDates ?? true}
              showEntryLocation={resume.showEntryLocation ?? true}
              accentColor={accentColor}
              showSectionIcons={resume.showSectionIcons ?? false}
              headingStyle="uppercase"
              headingWeight="bold"
            />
          </div>
        ))}
      </div>
    </div>
  )
}

export const templateMeta: TemplateMeta = {
  slug: "student-sidebar",
  name: "Student Sidebar",
  description: "Two-column layout with education & skills in sidebar for students",
  categories: ["first-job"],
  columnLayout: "two-col-sidebar-right",
  supportsPhoto: false,
  sidebarSectionTypes: ["SKILLS", "LANGUAGES", "EDUCATION"],
  isPro: false,
  popular: false,
  defaultConfig: {
    fontFamily: "sans-serif",
    accentColor: "#2563eb",
    headingStyle: "normal",
    headingWeight: "bold",
    showDividers: true,
  },
}
