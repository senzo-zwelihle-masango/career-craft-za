import type { CvWithRelations } from "@/types/curriculum-vitae/types"
import { SectionRenderer } from "../_base/SectionRenderer"
import { getLinks, linkTypeLabels } from "../_base/getLinks"
import { FONT_FAMILY_MAP } from "../_base/font-map"
import type { TemplateMeta } from "@/types/templates/types"

export function PhotoHeaderFloatTemplate({ cv }: { cv: CvWithRelations }) {
  const pd = cv.personalDetails
  const fs = cv.fontScale || 1
  const ss = cv.spacingScale || 1
  const pageFormat = cv.pageFormat || "A4"
  const maxWidth = pageFormat === "LETTER" ? "816px" : "794px"
  const accentColor = cv.accentColor || "#1f2937"
  const fontCSS =
    FONT_FAMILY_MAP[cv.fontFamily]?.css || cv.fontFamily || "Inter, sans-serif"

  const visibleSections = cv.sections
    .filter((s) => s.visible !== false)
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
                  {linkTypeLabels[link.type] || link.label || link.url}
                </span>
              ))}
            </p>
          )}
        </div>
        {pd?.photoUrl && cv.showPhoto && (
          <div style={{ flexShrink: 0 }}>
            <img
              src={pd.photoUrl}
              alt=""
              style={{
                width: 96 * fs,
                height: 96 * fs,
                borderRadius: "50%",
                objectFit: "cover",
                objectPosition: pd?.photoObjectPosition || "50% 50%",
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
            cv={cv}
            showDividers={cv.showDividers ?? true}
            entryStyle={cv.entryStyle || "bullet"}
            showEntryDates={cv.showEntryDates ?? true}
            showEntryLocation={cv.showEntryLocation ?? true}
            accentColor={accentColor}
            showSectionIcons={cv.showSectionIcons || false}
            headingStyle={cv.headingStyle || "normal"}
            headingWeight={cv.headingWeight || "bold"}
          />
        ))}
      </div>

      {cv.footer && (
        <div
          style={{
            marginTop: 16 * ss,
            textAlign: "center",
            fontSize: `${0.75 * fs}rem`,
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
