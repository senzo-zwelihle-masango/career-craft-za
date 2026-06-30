import type { CvWithRelations } from "@/lib/data/editor/types"
import { SectionRenderer } from "../_base/SectionRenderer"
import { getLinks, linkTypeLabels } from "../_base/getLinks"
import { FONT_FAMILY_MAP } from "../_base/font-map"
import type { TemplateMeta } from "../types"

export function PhotoHeaderFloatTemplate({ resume }: { resume: CvWithRelations }) {
  const pd = resume.personalDetails
  const fs = resume.fontScale || 1
  const ss = resume.spacingScale || 1
  const pageFormat = resume.pageFormat || "A4"
  const maxWidth = pageFormat === "LETTER" ? "816px" : "794px"
  const accentColor = resume.accentColor || "#1f2937"
  const fontCSS = FONT_FAMILY_MAP[resume.fontFamily]?.css || resume.fontFamily || "Inter, sans-serif"

  const visibleSections = resume.sections
    .filter(s => s.visible !== false)
    .sort((a, b) => a.order - b.order)

  const links = getLinks(pd)
  const contactParts = [pd?.email, pd?.phone, pd?.location].filter(Boolean)

  return (
    <div
      style={{
        fontFamily: fontCSS,
        fontSize: `${0.875 * fs}rem`,
        lineHeight: ss,
        maxWidth,
        margin: "0 auto",
        padding: `${32 * ss}px ${24 * ss}px`,
        color: "#111827",
        background: "#fff",
        minHeight: "100%",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          gap: 24 * ss,
          marginBottom: 24 * ss,
        }}
      >
        <div style={{ flex: 1 }}>
          {pd?.fullName && (
            <h1
              style={{
                margin: 0,
                fontSize: `${1.5 * fs}rem`,
                fontWeight: 700,
                color: accentColor,
              }}
            >
              {pd.fullName}
            </h1>
          )}
          {pd?.jobTitle && (
            <p
              style={{
                margin: `${4 * ss}px 0 0`,
                fontSize: `${0.875 * fs}rem`,
                color: "#6B7280",
              }}
            >
              {pd.jobTitle}
            </p>
          )}
          {contactParts.length > 0 && (
            <p
              style={{
                margin: `${8 * ss}px 0 0`,
                fontSize: `${0.75 * fs}rem`,
                color: "#6B7280",
                lineHeight: 1.5,
              }}
            >
              {contactParts.join(" · ")}
            </p>
          )}
          {links.length > 0 && (
            <p
              style={{
                margin: `${4 * ss}px 0 0`,
                fontSize: `${0.75 * fs}rem`,
                color: "#6B7280",
                lineHeight: 1.5,
              }}
            >
              {links.map((link, i) => (
                <span key={i}>
                  {i > 0 && " · "}
                  {linkTypeLabels[link.type] || link.type}: {link.url}
                </span>
              ))}
            </p>
          )}
        </div>
        {pd?.photoUrl && resume.showPhoto && (
          <div style={{ flexShrink: 0 }}>
            <img
              src={pd.photoUrl}
              alt=""
              style={{
                width: 96 * fs,
                height: 96 * fs,
                borderRadius: "50%",
                objectFit: "cover",
                border: `3px solid ${accentColor}`,
              }}
            />
          </div>
        )}
      </div>

      <div style={{ display: "flex", flexDirection: "column" }}>
        {visibleSections.map((section) => (
          <SectionRenderer
            key={section.id}
            section={section}
            resume={resume}
            showDividers={resume.showDividers ?? true}
            entryStyle={resume.entryStyle || "bullet"}
            showEntryDates={resume.showEntryDates ?? true}
            showEntryLocation={resume.showEntryLocation ?? true}
            accentColor={accentColor}
            showSectionIcons={resume.showSectionIcons || false}
            headingStyle={resume.headingStyle || "normal"}
            headingWeight={resume.headingWeight || "bold"}
          />
        ))}
      </div>

      {resume.footer && (
        <div
          style={{
            marginTop: 16 * ss,
            textAlign: "center",
            fontSize: `${0.75 * fs}rem`,
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
  slug: "photo-header-float",
  name: "Photo Header Float",
  description: "Photo floats alongside header name and title",
  categories: ["photo"],
  columnLayout: "single",
  supportsPhoto: true,
  sidebarSectionTypes: [],
  isPro: false,
  popular: false,
  defaultConfig: {
    fontFamily: "sans-serif",
    accentColor: "#1f2937",
    headingStyle: "normal",
    headingWeight: "bold",
    showDividers: true,
  },
}
