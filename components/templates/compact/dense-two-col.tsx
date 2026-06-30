import type { CvWithRelations } from "@/lib/data/editor/types"
import { getLinks, linkTypeLabels } from "@/components/templates/_base/getLinks"
import { FONT_FAMILY_MAP } from "@/components/templates/_base/font-map"
import { SectionHeading } from "@/components/templates/_base/SectionHeading"
import { formatDate } from "@/lib/data/editor/utils"
import type { TemplateMeta } from "@/components/templates/types"

export const templateMeta: TemplateMeta = {
  slug: "dense-two-col",
  name: "Dense Two-Column",
  description: "Equal 50/50 split. Left: summary, experience, education. Right: skills, projects, certifications, languages.",
  categories: ["compact"],
  columnLayout: "two-col-equal",
  supportsPhoto: false,
  sidebarSectionTypes: ["SKILLS", "PROJECTS", "CERTIFICATIONS", "LANGUAGES"],
  isPro: false,
  popular: false,
  defaultConfig: {
    fontFamily: "sans-serif",
    accentColor: "#374151",
    headingStyle: "uppercase",
    headingWeight: "bold",
    showDividers: false,
  },
}

export function DenseTwoColTemplate({ resume }: { resume: CvWithRelations }) {
  const pd = resume.personalDetails
  const fs = resume.fontScale || 1
  const ss = resume.spacingScale || 1
  const pageFormat = resume.pageFormat || "A4"
  const maxWidth = pageFormat === "LETTER" ? "816px" : "794px"
  const accentColor = resume.accentColor || "#374151"
  const fontCSS = FONT_FAMILY_MAP[resume.fontFamily]?.css || resume.fontFamily || "Inter, sans-serif"

  const visibleSections = resume.sections
    .filter(s => s.visible !== false)
    .sort((a, b) => a.order - b.order)

  const sidebarTypes = templateMeta.sidebarSectionTypes
  const sidebarSections = visibleSections.filter(s => sidebarTypes.includes(s.type))
  const mainSections = visibleSections.filter(s => !sidebarTypes.includes(s.type))

  const links = getLinks(pd)
  const headingStyle = resume.headingStyle || "uppercase"
  const headingWeight = resume.headingWeight || "bold"
  const entryStyle = resume.entryStyle || "bullet"
  const showDates = resume.showEntryDates !== false
  const showLocation = resume.showEntryLocation !== false
  const dateFormat = resume.dateFormat || "MM/YYYY"

  const renderMainSection = (section: CvWithRelations["sections"][0]) => {
    if (section.type === "SUMMARY" && section.content) {
      return (
        <div key={section.id} style={{ marginBottom: 8 * ss }}>
          <SectionHeading
            title={section.title}
            headingStyle={headingStyle}
            headingWeight={headingWeight}
            showSectionIcons={resume.showSectionIcons}
            accentColor={accentColor}
          />
          <div className="prose prose-sm max-w-none text-[10px] leading-relaxed text-gray-700" style={{ marginTop: 2 * ss }} dangerouslySetInnerHTML={{ __html: section.content }} />
        </div>
      )
    }

    return (
      <div key={section.id} style={{ marginBottom: 8 * ss }}>
        <SectionHeading
          title={section.title}
          headingStyle={headingStyle}
          headingWeight={headingWeight}
          showSectionIcons={resume.showSectionIcons}
          accentColor={accentColor}
        />

        {section.type === "EXPERIENCE" && section.experienceEntries.length > 0 && (
          <div style={{ marginTop: 2 * ss }}>
            {section.experienceEntries
              .slice()
              .sort((a, b) => a.order - b.order)
              .map((entry) => (
                <div key={entry.id} className="break-inside-avoid" style={{ marginBottom: 6 * ss }}>
                  <p className="text-[10px] font-semibold leading-tight">{entry.role}</p>
                  <p className="text-[9px] text-gray-600">
                    {entry.company}
                    {showLocation && entry.location ? ` · ${entry.location}` : ""}
                  </p>
                  {showDates && (
                    <p className="text-[8px] text-gray-400" style={{ marginTop: 1 }}>
                      {entry.startDate && formatDate(entry.startDate, dateFormat)}
                      {" — "}
                      {entry.current ? "Present" : entry.endDate ? formatDate(entry.endDate, dateFormat) : ""}
                    </p>
                  )}
                  {entry.bullets && entry.bullets.length > 0 && entryStyle !== "paragraph" && (
                    <ul className="mt-0.5 list-disc pl-3 text-[9px] text-gray-700 leading-tight">
                      {entry.bullets.map((b: string, i: number) => <li key={i} style={{ marginBottom: 1 }}><span dangerouslySetInnerHTML={{ __html: b }} /></li>)}
                    </ul>
                  )}
                </div>
              ))}
          </div>
        )}

        {section.type === "EDUCATION" && section.educationEntries.length > 0 && (
          <div style={{ marginTop: 2 * ss }}>
            {section.educationEntries
              .slice()
              .sort((a, b) => a.order - b.order)
              .map((entry) => (
                <div key={entry.id} className="break-inside-avoid" style={{ marginBottom: 4 * ss }}>
                  <p className="text-[10px] font-semibold leading-tight">{entry.institution}</p>
                  <p className="text-[9px] text-gray-600">
                    {entry.degree}
                    {showLocation && entry.location ? ` · ${entry.location}` : ""}
                  </p>
                  {showDates && (
                    <p className="text-[8px] text-gray-400">
                      {entry.startDate ? formatDate(entry.startDate, dateFormat) : ""}
                      {entry.endDate ? ` — ${formatDate(entry.endDate, dateFormat)}` : ""}
                    </p>
                  )}
                </div>
              ))}
          </div>
        )}
      </div>
    )
  }

  const renderSidebarSection = (section: CvWithRelations["sections"][0]) => (
    <div key={section.id} style={{ marginBottom: 8 * ss }}>
      <SectionHeading
        title={section.title}
        headingStyle={headingStyle}
        headingWeight={headingWeight}
        showSectionIcons={resume.showSectionIcons}
        accentColor={accentColor}
      />

      {section.type === "SKILLS" && (
        <div style={{ marginTop: 2 * ss }}>
          {section.skillGroups
            .filter(g => g.visible !== false)
            .slice()
            .sort((a, b) => a.order - b.order)
            .map((group) => (
              <p key={group.id} className="text-[9px] leading-relaxed text-gray-700" style={{ marginBottom: 2 * ss }}>
                {group.label && <span className="font-semibold">{group.label}: </span>}
                <span>{group.skills.join(", ")}</span>
              </p>
            ))}
        </div>
      )}

      {section.type === "PROJECTS" && section.projectEntries.length > 0 && (
        <div style={{ marginTop: 2 * ss }}>
          {section.projectEntries
            .slice()
            .sort((a, b) => a.order - b.order)
            .map((entry) => (
              <div key={entry.id} className="break-inside-avoid" style={{ marginBottom: 4 * ss }}>
                <p className="text-[10px] font-semibold leading-tight">{entry.name}</p>
                  {entry.description && (
                    <div className="prose prose-sm max-w-none text-[9px] text-gray-700 leading-tight" dangerouslySetInnerHTML={{ __html: entry.description }} />
                  )}
                {entry.technologies.length > 0 && (
                  <p className="text-[8px] text-gray-500">{entry.technologies.join(", ")}</p>
                )}
              </div>
            ))}
        </div>
      )}

      {section.type === "CERTIFICATIONS" && section.certificationEntries.length > 0 && (
        <div style={{ marginTop: 2 * ss }}>
          {section.certificationEntries
            .slice()
            .sort((a, b) => a.order - b.order)
            .map((entry) => (
              <div key={entry.id} className="break-inside-avoid" style={{ marginBottom: 3 * ss }}>
                <p className="text-[10px] font-semibold leading-tight">{entry.name}</p>
                {entry.issuer && <p className="text-[9px] text-gray-600">{entry.issuer}</p>}
                {entry.issueDate && (
                  <p className="text-[8px] text-gray-500">{formatDate(entry.issueDate, dateFormat)}</p>
                )}
              </div>
            ))}
        </div>
      )}

      {section.type === "LANGUAGES" && section.languageEntries.length > 0 && (
        <div style={{ marginTop: 2 * ss }}>
          {section.languageEntries
            .slice()
            .sort((a, b) => a.order - b.order)
            .map((entry) => (
              <p key={entry.id} className="text-[9px] text-gray-700" style={{ marginBottom: 1 * ss }}>
                {entry.name}
                {entry.proficiency ? ` — ${entry.proficiency}` : ""}
              </p>
            ))}
        </div>
      )}
    </div>
  )

  return (
    <div
      style={{
        fontFamily: fontCSS,
        fontSize: `${fs}rem`,
        lineHeight: `${1.25 * ss}`,
        maxWidth,
        margin: "0 auto",
        padding: "10px 12px",
        color: "#111827",
        backgroundColor: "#fff",
        minHeight: "100%",
      }}
    >
      {/* Header */}
      <div style={{ marginBottom: 8 * ss, paddingBottom: 6 * ss, borderBottom: "1px solid #E5E7EB" }}>
        <h1 style={{ margin: 0, fontSize: `${1.25 * fs}rem`, fontWeight: 700, color: accentColor }}>
          {pd?.fullName || "Your Name"}
        </h1>
        {pd?.jobTitle && (
          <p style={{ margin: "1px 0 0", fontSize: `${0.75 * fs}rem`, color: "#6B7280" }}>
            {pd.jobTitle}
          </p>
        )}
        <div style={{ marginTop: 4 * ss, fontSize: `${0.625 * fs}rem`, color: "#9CA3AF", display: "flex", flexWrap: "wrap", gap: "2px 8px" }}>
          {pd?.email && <span>{pd.email}</span>}
          {pd?.phone && <span>{pd.phone}</span>}
          {pd?.location && <span>{pd.location}</span>}
          {links.map((link, i) => (
            <span key={i}>{linkTypeLabels[link.type] || link.type}: {link.url}</span>
          ))}
        </div>
      </div>

      {/* Two-column layout */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", columnGap: 16 * ss, alignItems: "start" }}>
        {/* Left column: main sections */}
        <div>
          {mainSections.map(renderMainSection)}
        </div>

        {/* Right column: sidebar sections */}
        <div>
          {sidebarSections.map(renderSidebarSection)}
        </div>
      </div>

      {/* Footer */}
      {resume.footer && (
        <div style={{ marginTop: 8 * ss, textAlign: "center", fontSize: `${0.5625 * fs}rem`, color: "#9CA3AF" }}>
          {resume.footer}
        </div>
      )}
    </div>
  )
}
