import type { CvWithRelations } from "@/lib/data/editor/types"
import { ResumeHeader } from "../_base/ResumeHeader"
import { SectionRenderer, SectionIcon } from "../_base"
import { FONT_FAMILY_MAP } from "../_base/font-map"
import type { TemplateMeta } from "../types"

function CentredDot({ accentColor }: { accentColor: string }) {
  return (
    <div
      style={{
        textAlign: "center",
        fontSize: `${0.5}rem`,
        color: `${accentColor}50`,
        letterSpacing: 6,
        margin: "6px 0 10px",
      }}
    >
      • • •
    </div>
  )
}

export function CentredSerifTemplate({ resume }: { resume: CvWithRelations }) {
  const fs = resume.fontScale || 1
  const ss = resume.spacingScale || 1
  const pageFormat = resume.pageFormat || "A4"
  const maxWidth = pageFormat === "LETTER" ? "816px" : "794px"
  const accentColor = resume.accentColor || "#8B5CF6"
  const fontCSS = FONT_FAMILY_MAP[resume.fontFamily]?.css || resume.fontFamily || "Georgia, serif"

  const visibleSections = resume.sections
    .filter(s => s.visible !== false)
    .sort((a, b) => a.order - b.order)

  return (
    <div
      style={{
        fontFamily: fontCSS,
        fontSize: `${0.875 * fs}rem`,
        lineHeight: 1.55 * ss,
        color: "#111827",
        maxWidth,
        margin: "0 auto",
        padding: `${40 * ss}px ${32 * ss}px`,
        background: "#fff",
        minHeight: "100%",
      }}
    >
      {/* Double-line border at top */}
      <div
        style={{
          borderTop: `2px solid ${accentColor}30`,
          borderBottom: `2px solid ${accentColor}30`,
          padding: `${14 * ss}px 0`,
          marginBottom: `${10 * ss}px`,
          textAlign: "center",
        }}
      >
        <ResumeHeader
          pd={resume.personalDetails}
          resume={resume}
          nameStyle={{
            fontSize: `${2 * fs}rem`,
            fontWeight: 700,
            color: accentColor,
            letterSpacing: "0.04em",
          }}
          contactStyle={{
            color: "#6B7280",
            fontSize: `${0.75 * fs}rem`,
          }}
        renderPhoto={false}
        />
      </div>

      {visibleSections.map((section, idx) => (
        <div key={section.id}>
          {idx > 0 && <CentredDot accentColor={accentColor} />}

          <div style={{ textAlign: "center", marginBottom: 8 }}>
            <h2
              style={{
                fontSize: `${0.7 * fs}rem`,
                fontWeight: 600,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: accentColor,
                margin: 0,
                fontVariantCaps: "small-caps",
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
              }}
            >
              {resume.showSectionIcons && (
                <SectionIcon sectionType={section.type} size="1em" />
              )}
              {section.title}
            </h2>
            <div
              style={{
                width: 24,
                height: 1,
                background: accentColor,
                opacity: 0.3,
                margin: "6px auto 0",
              }}
            />
          </div>

          <div style={{ textAlign: "justify" }}>
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
            marginTop: `${24 * ss}px`,
            textAlign: "center",
            fontSize: `${0.65 * fs}rem`,
            color: "#9CA3AF",
            fontStyle: "italic",
          }}
        >
          <div
            style={{
              width: 48,
              height: 1,
              background: `${accentColor}30`,
              margin: "0 auto 8px",
            }}
          />
          {resume.footer}
        </div>
      )}
    </div>
  )
}

export const templateMeta: TemplateMeta = {
  slug: "centred-serif",
  name: "Centred Serif",
  description: "Traditional elegant — centered layout, double-line border, small-caps headings, classic serif",
  categories: ["simple"],
  columnLayout: "single",
  supportsPhoto: false,
  sidebarSectionTypes: [],
  isPro: false,
  popular: true,
  defaultConfig: {
    fontFamily: "serif",
    accentColor: "#8B5CF6",
    headingStyle: "uppercase",
    headingWeight: "bold",
    showDividers: false,
  },
}
