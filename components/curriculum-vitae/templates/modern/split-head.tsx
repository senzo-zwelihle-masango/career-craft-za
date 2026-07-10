import type { CvWithRelations } from "@/types/curriculum-vitae/types"
import { SectionRenderer } from "../_base/SectionRenderer"
import { FONT_FAMILY_MAP } from "../_base/font-map"
import { getLinks, linkTypeLabels } from "../_base/getLinks"
import type { TemplateMeta } from "@/types/templates/types"

export const templateMeta: TemplateMeta = {
  slug: "split-head",
  name: "Split Head",
  description:
    "Two-column header with name/title on left and contact/links on right",
  categories: ["modern"],
  columnLayout: "single",
  supportsPhoto: true,
  sidebarSectionTypes: [],
  isPro: false,
  popular: true,
  defaultConfig: {
    fontFamily: "sans-serif",
    accentColor: "#0f172a",
    headingStyle: "normal",
    headingWeight: "bold",
    showDividers: true,
  },
}

export function SplitHeadTemplate({ cv }: { cv: CvWithRelations }) {
  const pd = cv.personalDetails
  const fs = cv.fontScale || 1
  const ss = cv.spacingScale || 1
  const lh = cv.lineHeight ?? ss
  const es = cv.elementSpacing ?? ss
  const mh = cv.marginHorizontal ?? ss
  const mv = cv.marginVertical ?? ss
  const pageFormat = cv.pageFormat || "A4"
  const maxWidth = pageFormat === "LETTER" ? "816px" : "794px"
  const accentColor = cv.accentColor || "#0f172a"
  const fontCSS =
    FONT_FAMILY_MAP[cv.fontFamily]?.css || cv.fontFamily || "Inter, sans-serif"
  const links = getLinks(pd)
  const showPhoto = cv.showPhoto && pd?.photoUrl

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
      {/* Two-column header */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: showPhoto ? "auto 1fr 1fr" : "1fr 1fr",
          gap: `${16 * es}px`,
          padding: `${24 * mv}px ${32 * mh}px`,
          borderBottom: `2px solid ${accentColor}`,
          alignItems: "center",
        }}
      >
        {showPhoto && (
          <img
            src={pd!.photoUrl!}
            alt={pd!.fullName || ""}
            style={{
              width: 64,
              height: 80,
              objectFit: "cover",
              objectPosition: pd?.photoObjectPosition || "50% 50%",
              borderRadius: 6,
            }}
          />
        )}
        <div>
          <h1
            style={{
              fontSize: `${1.75 * fs}rem`,
              fontWeight: 700,
              margin: 0,
              color: accentColor,
              letterSpacing: "-0.02em",
            }}
          >
            {pd?.fullName || "Your Name"}
          </h1>
          {pd?.jobTitle && (
            <p
              style={{
                fontSize: `${0.875 * fs}rem`,
                margin: `${4 * es}px 0 0`,
                color: "#6B7280",
              }}
            >
              {pd.jobTitle}
            </p>
          )}
        </div>
        <div
          style={{
            textAlign: "right",
            fontSize: `${0.75 * fs}rem`,
            color: "#4B5563",
            lineHeight: 1.6,
          }}
        >
          {pd?.email && <div>{pd.email}</div>}
          {pd?.phone && <div>{pd.phone}</div>}
          {pd?.location && <div>{pd.location}</div>}
          {pd?.nationality && <div>{pd.nationality}</div>}
          {links.length > 0 && (
              <div style={{ marginTop: `${4 * es}px` }}>
              {links.map((link, i) => (
                <div key={i}>
                  {linkTypeLabels[link.type] || link.label || link.url}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div style={{ padding: `${20 * mv}px ${32 * mh}px` }}>
        {visibleSections.map((section) => (
          <div key={section.id} style={{ marginBottom: `${16 * es}px` }}>
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

        {cv.footer && (
          <p
            style={{
              textAlign: "center",
              fontSize: `${0.65 * fs}rem`,
              color: "#9CA3AF",
              marginTop: `${16 * es}px`,
            }}
          >
            {cv.footer}
          </p>
        )}
      </div>
    </div>
  )
}
