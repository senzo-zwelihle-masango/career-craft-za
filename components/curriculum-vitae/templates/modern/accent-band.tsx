import type { CvWithRelations } from "@/types/curriculum-vitae/types"
import { SectionRenderer } from "../_base/SectionRenderer"
import { FONT_FAMILY_MAP } from "../_base/font-map"
import { getLinks, linkTypeLabels } from "../_base/getLinks"
import type { TemplateMeta } from "@/types/templates/types"

export const templateMeta: TemplateMeta = {
  slug: "accent-band",
  name: "Accent Band",
  description:
    "Full-width colored band at top with name and title over accent color",
  categories: ["modern"],
  columnLayout: "single",
  supportsPhoto: false,
  sidebarSectionTypes: [],
  isPro: false,
  popular: false,
  defaultConfig: {
    fontFamily: "sans-serif",
    accentColor: "#2563eb",
    headingStyle: "uppercase",
    headingWeight: "bold",
    showDividers: true,
  },
}

export function AccentBandTemplate({ cv }: { cv: CvWithRelations }) {
  const pd = cv.personalDetails
  const fs = cv.fontScale || 1
  const ss = cv.spacingScale || 1
  const pageFormat = cv.pageFormat || "A4"
  const maxWidth = pageFormat === "LETTER" ? "816px" : "794px"
  const accentColor = cv.accentColor || "#2563eb"
  const fontCSS =
    FONT_FAMILY_MAP[cv.fontFamily]?.css || cv.fontFamily || "Inter, sans-serif"
  const links = getLinks(pd)

  const visibleSections = cv.sections
    .filter((s) => s.visible !== false)
    .sort((a, b) => a.order - b.order)

  return (
    <div
      style={{
        fontFamily: fontCSS,
        color: "#000",
        backgroundColor: "#fff",
        minHeight: "100%",
        maxWidth,
        margin: "0 auto",
        fontSize: `${0.875 * fs}rem`,
        lineHeight: 1.5,
      }}
    >
      {/* Accent band */}
      <div
        style={{
          backgroundColor: accentColor,
          padding: `${24 * ss}px ${32 * ss}px`,
          textAlign: "center",
        }}
      >
        <h1
          style={{
            fontSize: `${1.75 * fs}rem`,
            fontWeight: 700,
            margin: 0,
            color: "#fff",
            letterSpacing: "-0.02em",
          }}
        >
          {pd?.fullName || "Your Name"}
        </h1>
        {pd?.jobTitle && (
          <p
            style={{
              fontSize: `${1 * fs}rem`,
              margin: `${4 * ss}px 0 0`,
              color: "rgba(255,255,255,0.85)",
              fontWeight: 400,
            }}
          >
            {pd.jobTitle}
          </p>
        )}
      </div>

      {/* Contact bar */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          flexWrap: "wrap",
          gap: `${12 * ss}px`,
          padding: `${10 * ss}px ${32 * ss}px`,
          fontSize: `${0.75 * fs}rem`,
          color: "#6B7280",
          borderBottom: "1px solid #E5E7EB",
        }}
      >
        {pd?.email && <span>{pd.email}</span>}
        {pd?.phone && <span>{pd.phone}</span>}
        {pd?.location && <span>{pd.location}</span>}
        {pd?.nationality && <span>{pd.nationality}</span>}
        {links.map((link, i) => (
          <span key={i}>
            {" "}
            {linkTypeLabels[link.type] || link.label || link.url}
          </span>
        ))}
      </div>

      {/* Content */}
      <div style={{ padding: `${20 * ss}px ${32 * ss}px` }}>
        {visibleSections.map((section) => (
          <div key={section.id} style={{ marginBottom: `${16 * ss}px` }}>
            <SectionRenderer
              section={section}
              cv={cv}
              showDividers={cv.showDividers ?? true}
              entryStyle={cv.entryStyle || "bullet"}
              showEntryDates={cv.showEntryDates ?? true}
              showEntryLocation={cv.showEntryLocation ?? true}
              accentColor={accentColor}
              showSectionIcons={cv.showSectionIcons ?? false}
              headingStyle={cv.headingStyle || "uppercase"}
              headingWeight={cv.headingWeight || "bold"}
            />
          </div>
        ))}

        {cv.footer && (
          <p
            style={{
              textAlign: "center",
              fontSize: `${0.65 * fs}rem`,
              color: "#9CA3AF",
              marginTop: `${16 * ss}px`,
            }}
          >
            {cv.footer}
          </p>
        )}
      </div>
    </div>
  )
}
