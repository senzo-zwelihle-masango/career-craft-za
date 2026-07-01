import type { CvWithRelations } from "@/lib/data/editor/types"
import { SectionRenderer } from "../_base/SectionRenderer"
import { FONT_FAMILY_MAP } from "../_base/font-map"
import { getLinks, linkTypeLabels } from "../_base/getLinks"
import type { TemplateMeta } from "../types"
import { formatDate } from "@/lib/data/editor/utils"

export const templateMeta: TemplateMeta = {
  slug: "sidebar-slate",
  name: "Sidebar Slate",
  description: "Two-column with dark sidebar — skills, languages, certifications on the left",
  categories: ["modern"],
  columnLayout: "two-col-sidebar-left",
  supportsPhoto: true,
  sidebarSectionTypes: ["SKILLS", "LANGUAGES", "CERTIFICATIONS", "AWARDS"],
  isPro: false,
  popular: true,
  defaultConfig: {
    fontFamily: "sans-serif",
    accentColor: "#1e2937",
    headingStyle: "uppercase",
    headingWeight: "bold",
    showDividers: false,
  },
}

export function SidebarSlateTemplate({ cv }: { cv: CvWithRelations }) {
  const pd = cv.personalDetails
  const fs = cv.fontScale || 1
  const ss = cv.spacingScale || 1
  const pageFormat = cv.pageFormat || "A4"
  const maxWidth = pageFormat === "LETTER" ? "816px" : "794px"
  const accentColor = cv.accentColor || "#1f2937"
  const fontCSS = FONT_FAMILY_MAP[cv.fontFamily]?.css || cv.fontFamily || "Inter, sans-serif"
  const links = getLinks(pd)

  const visibleSections = cv.sections
    .filter(s => s.visible !== false)
    .sort((a, b) => a.order - b.order)

  const sidebarTypes = templateMeta.sidebarSectionTypes
  const sidebarSections = visibleSections.filter(s => sidebarTypes.includes(s.type))
  const mainSections = visibleSections.filter(s => !sidebarTypes.includes(s.type))
  const showPhoto = cv.showPhoto && pd?.photoUrl

  return (
    <div
      style={{
        fontFamily: fontCSS,
        color: "#000",
        backgroundColor: "#fff",
        height: "100%",
        maxWidth,
        margin: "0 auto",
        fontSize: `${0.8125 * fs}rem`,
        lineHeight: 1.5,
      }}
    >
      <div
        style={{
          display: "flex",
          height: "100%",
        }}
      >
        {/* Sidebar */}
        <div
          style={{
            width: "30%",
            backgroundColor: accentColor,
            color: "#fff",
            padding: `${24 * ss}px`,
            display: "flex",
            flexDirection: "column",
            gap: `${20 * ss}px`,
          }}
        >
          <div style={{ marginBottom: `${12 * ss}px` }}>
            {showPhoto && (
              <img
                src={pd!.photoUrl!}
                alt={pd!.fullName || ""}
                style={{ width: 72, height: 90, objectFit: "cover", objectPosition: pd?.photoObjectPosition || "50% 50%", borderRadius: 6, marginBottom: `${6 * ss}px` }}
              />
            )}
            <h1
              style={{
                fontSize: `${1.25 * fs}rem`,
                fontWeight: 700,
                margin: 0,
                color: "#fff",
              }}
            >
              {pd?.fullName || "Your Name"}
            </h1>
            {pd?.jobTitle && (
              <p style={{ fontSize: `${0.8125 * fs}rem`, margin: `${2 * ss}px 0 0`, opacity: 0.8 }}>
                {pd.jobTitle}
              </p>
            )}
          </div>

          <div style={{ fontSize: `${0.75 * fs}rem`, opacity: 0.85, lineHeight: 1.6 }}>
            {pd?.email && <p style={{ margin: 0 }}>{pd.email}</p>}
            {pd?.phone && <p style={{ margin: `${2 * ss}px 0 0` }}>{pd.phone}</p>}
            {pd?.location && <p style={{ margin: `${2 * ss}px 0 0` }}>{pd.location}</p>}
            {pd?.nationality && <p style={{ margin: `${2 * ss}px 0 0` }}>{pd.nationality}</p>}
            {links.length > 0 && (
              <div style={{ marginTop: `${8 * ss}px` }}>
                {links.map((link, i) => (
                  <p key={i} style={{ margin: `${2 * ss}px 0 0`, wordBreak: "break-all" }}>
                    {linkTypeLabels[link.type] || link.label || link.url}
                  </p>
                ))}
              </div>
            )}
          </div>

          {sidebarSections.map(section => (
            <SidebarSection
              key={section.id}
              section={section}
              fs={fs}
              ss={ss}
              dateFormat={cv.dateFormat}
            />
          ))}
        </div>

        {/* Main content */}
        <div style={{ flex: 1, padding: `${24 * ss}px` }}>
          {mainSections.map(section => (
            <div key={section.id} style={{ marginBottom: `${16 * ss}px` }}>
              <SectionRenderer
                section={section}
                cv={cv}
                showDividers={cv.showDividers ?? false}
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
    </div>
  )
}

function SidebarSection({
  section,
  fs,
  ss,
  dateFormat,
}: {
  section: CvWithRelations["sections"][0]
  fs: number
  ss: number
  dateFormat?: string | null
}) {
  const heading = (
    <h2
      style={{
        fontSize: `${0.7 * fs}rem`,
        fontWeight: 700,
        textTransform: "uppercase",
        letterSpacing: "0.08em",
        opacity: 0.9,
        margin: 0,
      }}
    >
      {section.title}
    </h2>
  )

  const divider = (
    <div style={{ marginTop: `${6 * ss}px`, borderTop: "1px solid rgba(255,255,255,0.2)" }} />
  )

  if (section.type === "SKILLS") {
    const groups = section.skillGroups
      .filter(g => g.visible !== false)
      .sort((a, b) => a.order - b.order)
    if (groups.length === 0) return null
    return (
      <div>
        {heading}
        {divider}
        <div style={{ marginTop: `${8 * ss}px`, fontSize: `${0.75 * fs}rem`, opacity: 0.85 }}>
          {groups.map(group => (
            <div key={group.id} style={{ marginBottom: `${6 * ss}px` }}>
              {group.label && <p style={{ fontWeight: 600, margin: 0 }}>{group.label}</p>}
              <p style={{ margin: `${2 * ss}px 0 0`, lineHeight: 1.4 }}>
                {group.skills.join(", ")}
              </p>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (section.type === "LANGUAGES") {
    if (section.languageEntries.length === 0) return null
    return (
      <div>
        {heading}
        {divider}
        <div style={{ marginTop: `${8 * ss}px`, fontSize: `${0.75 * fs}rem`, opacity: 0.85 }}>
          {section.languageEntries
            .slice()
            .sort((a, b) => a.order - b.order)
            .map(entry => (
              <div
                key={entry.id}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: `${4 * ss}px`,
                }}
              >
                <span>{entry.name}</span>
                {entry.proficiency && (
                  <span style={{ opacity: 0.7 }}>{entry.proficiency}</span>
                )}
              </div>
            ))}
        </div>
      </div>
    )
  }

  if (section.type === "CERTIFICATIONS") {
    if (section.certificationEntries.length === 0) return null
    return (
      <div>
        {heading}
        {divider}
        <div style={{ marginTop: `${8 * ss}px`, fontSize: `${0.75 * fs}rem`, opacity: 0.85 }}>
          {section.certificationEntries
            .slice()
            .sort((a, b) => a.order - b.order)
            .map(entry => (
              <div key={entry.id} style={{ marginBottom: `${6 * ss}px` }}>
                <p style={{ fontWeight: 600, margin: 0 }}>{entry.name}</p>
                {entry.issuer && (
                  <p style={{ margin: `${2 * ss}px 0 0`, opacity: 0.8 }}>{entry.issuer}</p>
                )}
                {entry.issueDate && (
                  <p style={{ margin: `${2 * ss}px 0 0`, opacity: 0.7, fontSize: `${0.7 * fs}rem` }}>
                    {formatDate(entry.issueDate, dateFormat || "MM/YYYY")}
                  </p>
                )}
                {entry.credentialUrl ? (
                  <p style={{ margin: `${1 * ss}px 0 0`, fontSize: `${0.65 * fs}rem` }}>
                    <span onClick={(e) => { e.stopPropagation(); window.open(entry.credentialUrl, "_blank") }} style={{ color: "inherit", textDecoration: "underline", cursor: "pointer" }} role="link" tabIndex={0}>
                      {entry.credentialId || "View credential"}
                    </span>
                  </p>
                ) : entry.credentialId ? (
                  <p style={{ margin: `${1 * ss}px 0 0`, fontSize: `${0.65 * fs}rem`, opacity: 0.6 }}>
                    {entry.credentialId}
                  </p>
                ) : null}
              </div>
            ))}
        </div>
      </div>
    )
  }

  if (section.type === "AWARDS") {
    if (section.awardEntries.length === 0) return null
    return (
      <div>
        {heading}
        {divider}
        <div style={{ marginTop: `${8 * ss}px`, fontSize: `${0.75 * fs}rem`, opacity: 0.85 }}>
          {section.awardEntries
            .slice()
            .sort((a, b) => a.order - b.order)
            .map(entry => (
              <div key={entry.id} style={{ marginBottom: `${6 * ss}px` }}>
                <p style={{ fontWeight: 600, margin: 0 }}>{entry.title}</p>
                {entry.issuer && (
                  <p style={{ margin: `${2 * ss}px 0 0`, opacity: 0.8 }}>{entry.issuer}</p>
                )}
                {entry.date && (
                  <p style={{ margin: `${2 * ss}px 0 0`, opacity: 0.7, fontSize: `${0.7 * fs}rem` }}>
                    {entry.date}
                  </p>
                )}
              </div>
            ))}
        </div>
      </div>
    )
  }

  if (section.type === "CUSTOM" && section.content) {
    return (
      <div>
        {heading}
        {divider}
        <div
          className="prose prose-sm max-w-none"
          style={{
            marginTop: `${8 * ss}px`,
            fontSize: `${0.75 * fs}rem`,
            opacity: 0.85,
            lineHeight: 1.4,
            whiteSpace: "pre-wrap",
          }}
          dangerouslySetInnerHTML={{ __html: section.content }}
        />
      </div>
    )
  }

  return null
}
