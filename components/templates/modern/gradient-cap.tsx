import type { CvWithRelations } from "@/lib/data/editor/types"
import { SectionRenderer } from "../_base/SectionRenderer"
import { FONT_FAMILY_MAP } from "../_base/font-map"
import { getLinks, linkTypeLabels } from "../_base/getLinks"
import type { TemplateMeta } from "../types"

export const templateMeta: TemplateMeta = {
  slug: "gradient-cap",
  name: "Gradient Cap",
  description: "Gradient header area with centered name and left border accent on sections",
  categories: ["modern"],
  columnLayout: "single",
  supportsPhoto: true,
  sidebarSectionTypes: [],
  isPro: false,
  popular: false,
  defaultConfig: {
    fontFamily: "sans-serif",
    accentColor: "#4f46e5",
    headingStyle: "normal",
    headingWeight: "bold",
    showDividers: false,
  },
}

export function GradientCapTemplate({ resume }: { resume: CvWithRelations }) {
  const pd = resume.personalDetails
  const fs = resume.fontScale || 1
  const ss = resume.spacingScale || 1
  const pageFormat = resume.pageFormat || "A4"
  const maxWidth = pageFormat === "LETTER" ? "816px" : "794px"
  const accentColor = resume.accentColor || "#4f46e5"
  const fontCSS = FONT_FAMILY_MAP[resume.fontFamily]?.css || resume.fontFamily || "Inter, sans-serif"
  const links = getLinks(pd)
  const showPhoto = resume.showPhoto && pd?.photoUrl

  const visibleSections = resume.sections
    .filter(s => s.visible !== false)
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
      {/* Gradient header */}
      <div
        style={{
          background: `linear-gradient(180deg, ${accentColor} 0%, #1e293b 100%)`,
          padding: `${36 * ss}px ${32 * ss}px ${24 * ss}px`,
          textAlign: "center",
        }}
      >
        {showPhoto && (
          <img
            src={pd!.photoUrl!}
            alt={pd!.fullName || ""}
            style={{
              width: 88,
              height: 88,
              objectFit: "cover",
              borderRadius: "50%",
              margin: `0 auto ${10 * ss}px`,
              display: "block",
              border: "3px solid rgba(255,255,255,0.25)",
            }}
          />
        )}
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
              fontSize: `${0.9375 * fs}rem`,
              margin: `${6 * ss}px 0 0`,
              color: "rgba(255,255,255,0.7)",
              fontWeight: 400,
            }}
          >
            {pd.jobTitle}
          </p>
        )}
      </div>

      {/* Contact row */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          flexWrap: "wrap",
          gap: `${12 * ss}px`,
          padding: `${10 * ss}px ${24 * ss}px`,
          fontSize: `${0.7 * fs}rem`,
          color: "#475569",
          borderBottom: "1px solid #E2E8F0",
        }}
      >
        {pd?.location && <ContactChip label={pd.location} />}
        {pd?.email && <ContactChip label={pd.email} />}
        {pd?.phone && <ContactChip label={pd.phone} />}
        {pd?.nationality && <ContactChip label={pd.nationality} />}
        {links.map((link, i) => (
          <ContactChip key={i} label={`${linkTypeLabels[link.type] || link.type}: ${link.url}`} />
        ))}
      </div>

      {/* Content */}
      <div style={{ padding: `${20 * ss}px ${32 * ss}px` }}>
        {visibleSections.map(section => (
          <div
            key={section.id}
            style={{
              marginBottom: `${16 * ss}px`,
              borderLeft: `3px solid ${accentColor}`,
              paddingLeft: `${14 * ss}px`,
              pageBreakInside: "avoid",
            }}
          >
            <SectionRenderer
              section={section}
              resume={resume}
              showDividers={resume.showDividers ?? false}
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

        {resume.footer && (
          <p
            style={{
              textAlign: "center",
              fontSize: `${0.65 * fs}rem`,
              color: "#94A3B8",
              marginTop: `${16 * ss}px`,
              borderLeft: "none",
              paddingLeft: 0,
            }}
          >
            {resume.footer}
          </p>
        )}
      </div>
    </div>
  )
}

function ContactChip({ label }: { label: string }) {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 4,
      }}
    >
      <span style={{ color: "#CBD5E1" }}>|</span>
      {label}
    </span>
  )
}
