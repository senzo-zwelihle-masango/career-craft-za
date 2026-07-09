import type { CvWithRelations } from "@/types/curriculum-vitae/types"
import { CvHeader } from "../_base/CvHeader"
import { SectionRenderer } from "../_base/SectionRenderer"
import { FONT_FAMILY_MAP } from "../_base/font-map"
import type { TemplateMeta } from "@/types/templates/types"

interface StudentSidebarTemplateProps {
  cv: CvWithRelations
}

export function StudentSidebarTemplate({ cv }: StudentSidebarTemplateProps) {
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

  const sidebarTypes = ["SKILLS", "LANGUAGES", "EDUCATION"]
  const sidebarSections = sorted.filter((s) => sidebarTypes.includes(s.type))
  const mainSections = sorted.filter((s) => !sidebarTypes.includes(s.type))

  return (
    <div
      className="flex min-h-full text-black"
      style={{
        fontFamily: fontCSS,
        fontSize: `${0.8125 * fs}rem`,
        lineHeight: `${1.5 * ss}`,
        maxWidth,
        margin: "0 auto",
        backgroundImage: "linear-gradient(to right, transparent 72%, #F3F4F6 72%)",
        backgroundColor: "#fff",
      }}
    >
      {/* Main content */}
      <div className="flex-1" style={{ padding: `${16 * ss}px ${18 * ss}px` }}>
        <CvHeader
          pd={cv.personalDetails}
          cv={cv}
          nameStyle={{ fontSize: `${1.5 * fs}rem`, color: accentColor }}
        />

        {cv.showDividers && (
          <hr
            style={{
              border: "none",
              borderTop: `2px solid ${accentColor}`,
              margin: `${10 * ss}px 0`,
            }}
          />
        )}

        <div style={{ marginTop: `${10 * ss}px` }}>
          {mainSections.map((section) => (
            <div key={section.id} style={{ marginBottom: `${14 * ss}px` }}>
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
              marginTop: `${14 * ss}px`,
              textAlign: "center",
              fontSize: `${0.7 * fs}rem`,
              color: "#9CA3AF",
            }}
          >
            {cv.footer}
          </div>
        )}
      </div>

      {/* Sidebar */}
      <div
        className="w-[28%] shrink-0"
        style={{
          padding: `${16 * ss}px ${14 * ss}px`,
        }}
      >
        {cv.personalDetails && (
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
            <hr
              style={{
                border: "none",
                borderTop: "1px solid #D1D5DB",
                margin: `${4 * ss}px 0`,
              }}
            />
            <div
              style={{
                fontSize: `${0.75 * fs}rem`,
                color: "#374151",
                lineHeight: `${1.6 * ss}`,
              }}
            >
              {cv.personalDetails.email && (
                <p style={{ margin: `${2 * ss}px 0` }}>
                  {cv.personalDetails.email}
                </p>
              )}
              {cv.personalDetails.phone && (
                <p style={{ margin: `${2 * ss}px 0` }}>
                  {cv.personalDetails.phone}
                </p>
              )}
              {cv.personalDetails.location && (
                <p style={{ margin: `${2 * ss}px 0` }}>
                  {cv.personalDetails.location}
                </p>
              )}
            </div>
          </div>
        )}

        {sidebarSections.map((section) => (
          <div key={section.id} style={{ marginBottom: `${12 * ss}px` }}>
            <SectionRenderer
              section={section}
              cv={cv}
              showDividers={false}
              entryStyle={cv.entryStyle || "bullet"}
              showEntryDates={cv.showEntryDates ?? true}
              showEntryLocation={cv.showEntryLocation ?? true}
              accentColor={accentColor}
              showSectionIcons={cv.showSectionIcons ?? false}
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
  description:
    "Two-column layout with education & skills in sidebar for students",
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
