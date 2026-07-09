import type { CvWithRelations } from "@/types/curriculum-vitae/types"
import { SectionRenderer } from "../_base/SectionRenderer"
import { getLinks, linkTypeLabels } from "../_base/getLinks"
import { FONT_FAMILY_MAP } from "../_base/font-map"
import type { TemplateMeta } from "@/types/templates/types"

export function PhotoCentredTemplate({ cv }: { cv: CvWithRelations }) {
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

  const sidebarTypes: string[] = ["SKILLS", "LANGUAGES", "CERTIFICATIONS"]
  const sidebarSections = visibleSections.filter((s) =>
    sidebarTypes.includes(s.type)
  )
  const mainSections = visibleSections.filter(
    (s) => !sidebarTypes.includes(s.type)
  )

  const links = getLinks(pd)
  const contactParts = [pd?.email, pd?.phone, pd?.location].filter(Boolean)

  return (
    <div
      style={{
        fontFamily: fontCSS,
        fontSize: `${0.8125 * fs}rem`,
        lineHeight: ss,
        maxWidth,
        margin: "0 auto",
        display: "flex",
        minHeight: "100%",
        color: "#111827",
        background: "linear-gradient(to right, #F3F4F6 25%, #fff 25%)",
      }}
    >
      <div
        style={{
          width: "25%",
          flexShrink: 0,
          padding: `${24 * ss}px ${16 * ss}px`,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        {pd?.photoUrl && cv.showPhoto && (
          <div style={{ marginBottom: 16 * ss }}>
            <img
              src={pd.photoUrl}
              alt=""
              style={{
                width: 140 * fs,
                height: 160 * fs,
                objectFit: "cover",
                objectPosition: pd?.photoObjectPosition || "50% 50%",
                borderRadius: 4,
              }}
            />
          </div>
        )}

        {pd?.fullName && (
          <h1
            style={{
              margin: 0,
              fontSize: `${1.1 * fs}rem`,
              fontWeight: 700,
              color: accentColor,
              textAlign: "center",
            }}
          >
            {pd.fullName}
          </h1>
        )}
        {pd?.jobTitle && (
          <p
            style={{
              margin: `${4 * ss}px 0 0`,
              fontSize: `${0.75 * fs}rem`,
              color: "#6B7280",
              textAlign: "center",
            }}
          >
            {pd.jobTitle}
          </p>
        )}

        {contactParts.length > 0 && (
          <div
            style={{
              marginTop: 12 * ss,
              fontSize: `${0.7 * fs}rem`,
              color: "#6B7280",
              textAlign: "center",
              lineHeight: 1.6,
            }}
          >
            {contactParts.map((part, i) => (
              <div key={i}>{part}</div>
            ))}
          </div>
        )}
        {links.length > 0 && (
          <div
            style={{
              marginTop: 8 * ss,
              fontSize: `${0.7 * fs}rem`,
              color: "#6B7280",
              textAlign: "center",
              lineHeight: 1.6,
            }}
          >
            {links.map((link, i) => (
              <div key={i}>
                {linkTypeLabels[link.type] || link.label || link.url}
              </div>
            ))}
          </div>
        )}

        <div style={{ width: "100%", marginTop: 16 * ss }}>
          {sidebarSections.map((section) => (
            <div key={section.id} style={{ marginBottom: 8 * ss }}>
              <SectionRenderer
                section={section}
                cv={cv}
                showDividers={false}
                entryStyle={cv.entryStyle || "bullet"}
                showEntryDates={cv.showEntryDates ?? true}
                showEntryLocation={cv.showEntryLocation ?? true}
                accentColor={accentColor}
                showSectionIcons={cv.showSectionIcons || false}
                headingStyle={cv.headingStyle || "normal"}
                headingWeight={cv.headingWeight || "bold"}
              />
            </div>
          ))}
        </div>
      </div>

      <div
        style={{
          flex: 1,
          padding: `${24 * ss}px ${20 * ss}px`,
        }}
      >
        {mainSections.map((section) => (
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
    </div>
  )
}

export const templateMeta: TemplateMeta = {
  slug: "photo-centred",
  name: "Photo Centred",
  description: "Two-column layout with photo and skills in a light sidebar",
  categories: ["photo"],
  columnLayout: "two-col-sidebar-left",
  supportsPhoto: true,
  sidebarSectionTypes: ["SKILLS", "LANGUAGES", "CERTIFICATIONS"],
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
