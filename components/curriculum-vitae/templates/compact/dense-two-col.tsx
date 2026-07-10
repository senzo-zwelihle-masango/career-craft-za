import type { CvWithRelations } from "@/types/curriculum-vitae/types"
import {
  getLinks,
  linkTypeLabels,
} from "@/components/curriculum-vitae/templates/_base/getLinks"
import { FONT_FAMILY_MAP } from "@/components/curriculum-vitae/templates/_base/font-map"
import { SectionHeading } from "@/components/curriculum-vitae/templates/_base/SectionHeading"
import { formatDate } from "@/lib/utils"
import type { TemplateMeta } from "@/types/templates/types"

export const templateMeta: TemplateMeta = {
  slug: "dense-two-col",
  name: "Dense Two-Column",
  description:
    "Equal 50/50 split. Left: summary, experience, education. Right: skills, projects, certifications, languages.",
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

export function DenseTwoColTemplate({ cv }: { cv: CvWithRelations }) {
  const pd = cv.personalDetails
  const fs = cv.fontScale || 1
  const ss = cv.spacingScale || 1
  const lh = cv.lineHeight ?? ss
  const es = cv.elementSpacing ?? ss
  const mh = cv.marginHorizontal ?? ss
  const mv = cv.marginVertical ?? ss
  const pageFormat = cv.pageFormat || "A4"
  const maxWidth = pageFormat === "LETTER" ? "816px" : "794px"
  const accentColor = cv.accentColor || "#374151"
  const fontCSS =
    FONT_FAMILY_MAP[cv.fontFamily]?.css || cv.fontFamily || "Inter, sans-serif"

  const visibleSections = cv.sections
    .filter((s) => s.visible !== false)
    .sort((a, b) => a.order - b.order)

  const sidebarTypes = templateMeta.sidebarSectionTypes
  const sidebarSections = visibleSections.filter((s) =>
    sidebarTypes.includes(s.type)
  )
  const mainSections = visibleSections.filter(
    (s) => !sidebarTypes.includes(s.type)
  )

  const links = getLinks(pd)
  const headingStyle = cv.headingStyle || "uppercase"
  const headingWeight = cv.headingWeight || "bold"
  const entryStyle = cv.entryStyle || "bullet"
  const showDates = cv.showEntryDates !== false
  const showLocation = cv.showEntryLocation !== false
  const dateFormat = cv.dateFormat || "MM/YYYY"

  const renderMainSection = (section: CvWithRelations["sections"][0]) => {
    if (section.type === "SUMMARY" && section.content) {
      return (
        <div key={section.id} style={{ marginBottom: 8 * es }}>
          <SectionHeading
            title={section.title}
            headingStyle={headingStyle}
            headingWeight={headingWeight}
            showSectionIcons={cv.showSectionIcons}
            accentColor={accentColor}
          />
          <div
            className="prose prose-sm max-w-none text-[10px] leading-relaxed text-gray-700"
            style={{ marginTop: 2 * es }}
            dangerouslySetInnerHTML={{ __html: section.content }}
          />
        </div>
      )
    }

    return (
      <div key={section.id} style={{ marginBottom: 8 * es }}>
        <SectionHeading
          title={section.title}
          headingStyle={headingStyle}
          headingWeight={headingWeight}
          showSectionIcons={cv.showSectionIcons}
          accentColor={accentColor}
        />

        {section.type === "EXPERIENCE" &&
          section.experienceEntries.length > 0 && (
            <div style={{ marginTop: 2 * es }}>
              {section.experienceEntries
                .slice()
                .sort((a, b) => a.order - b.order)
                .map((entry) => (
                  <div
                    key={entry.id}
                    className="break-inside-avoid"
                    style={{ marginBottom: 6 * es }}
                  >
                    <p className="text-[10px] leading-tight font-semibold">
                      {entry.role}
                    </p>
                    <p className="text-[9px] text-gray-600">
                      {entry.company}
                      {showLocation && entry.location
                        ? ` · ${entry.location}`
                        : ""}
                    </p>
                    {showDates && (
                      <p
                        className="text-[8px] text-gray-400"
                        style={{ marginTop: 1 }}
                      >
                        {entry.startDate &&
                          formatDate(entry.startDate, dateFormat)}
                        {" – "}
                        {entry.current
                          ? "Present"
                          : entry.endDate
                            ? formatDate(entry.endDate, dateFormat)
                            : ""}
                      </p>
                    )}
                    {entry.bullets &&
                      entry.bullets.length > 0 &&
                      entryStyle !== "paragraph" && (
                        <ul className="mt-0.5 list-disc pl-3 text-[9px] leading-tight text-gray-700">
                          {entry.bullets.map((b: string, i: number) => (
                            <li key={i} style={{ marginBottom: 1 }}>
                              <span dangerouslySetInnerHTML={{ __html: b }} />
                            </li>
                          ))}
                        </ul>
                      )}
                  </div>
                ))}
            </div>
          )}

        {section.type === "EDUCATION" &&
          section.educationEntries.length > 0 && (
            <div style={{ marginTop: 2 * es }}>
              {section.educationEntries
                .slice()
                .sort((a, b) => a.order - b.order)
                .map((entry) => (
                  <div
                    key={entry.id}
                    className="break-inside-avoid"
                    style={{ marginBottom: 4 * es }}
                  >
                    <p className="text-[10px] leading-tight font-semibold">
                      {entry.institution}
                    </p>
                    <p className="text-[9px] text-gray-600">
                      {entry.degree}
                      {showLocation && entry.location
                        ? ` · ${entry.location}`
                        : ""}
                    </p>
                    {showDates && (
                      <p className="text-[8px] text-gray-400">
                        {entry.startDate
                          ? formatDate(entry.startDate, dateFormat)
                          : ""}
                        {entry.endDate
                          ? ` – ${formatDate(entry.endDate, dateFormat)}`
                          : ""}
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
    <div key={section.id} style={{ marginBottom: 8 * es }}>
      <SectionHeading
        title={section.title}
        headingStyle={headingStyle}
        headingWeight={headingWeight}
        showSectionIcons={cv.showSectionIcons}
        accentColor={accentColor}
      />

      {section.type === "SKILLS" && (
        <div style={{ marginTop: 2 * es }}>
          {section.skillGroups
            .filter((g) => g.visible !== false)
            .slice()
            .sort((a, b) => a.order - b.order)
            .map((group) => (
              <p
                key={group.id}
                className="text-[9px] leading-relaxed text-gray-700"
                style={{ marginBottom: 2 * es }}
              >
                {group.label && (
                  <span className="font-semibold">{group.label}: </span>
                )}
                <span>{group.skills.join(", ")}</span>
              </p>
            ))}
        </div>
      )}

      {section.type === "PROJECTS" && section.projectEntries.length > 0 && (
        <div style={{ marginTop: 2 * es }}>
          {section.projectEntries
            .slice()
            .sort((a, b) => a.order - b.order)
            .map((entry) => (
              <div
                key={entry.id}
                className="break-inside-avoid"
                style={{ marginBottom: 4 * es }}
              >
                <p className="text-[10px] leading-tight font-semibold">
                  {entry.name}
                </p>
                {entry.description && (
                  <div
                    className="prose prose-sm max-w-none text-[9px] leading-tight text-gray-700"
                    dangerouslySetInnerHTML={{ __html: entry.description }}
                  />
                )}
                {entry.technologies.length > 0 && (
                  <p className="text-[8px] text-gray-500">
                    {entry.technologies.join(", ")}
                  </p>
                )}
              </div>
            ))}
        </div>
      )}

      {section.type === "CERTIFICATIONS" &&
        section.certificationEntries.length > 0 && (
          <div style={{ marginTop: 2 * es }}>
            {section.certificationEntries
              .slice()
              .sort((a, b) => a.order - b.order)
              .map((entry) => (
                <div
                  key={entry.id}
                  className="break-inside-avoid"
                  style={{ marginBottom: 3 * es }}
                >
                  <p className="text-[10px] leading-tight font-semibold">
                    {entry.name}
                  </p>
                  {entry.issuer && (
                    <p className="text-[9px] text-gray-600">{entry.issuer}</p>
                  )}
                  {entry.issueDate && (
                    <p className="text-[8px] text-gray-500">
                      {formatDate(entry.issueDate, dateFormat)}
                    </p>
                  )}
                  {entry.credentialUrl ? (
                    <p className="mt-px text-[8px]">
                      <span
                        onClick={(e) => {
                          e.stopPropagation()
                          window.open(entry.credentialUrl!, "_blank")
                        }}
                        className="cursor-pointer text-inherit underline"
                        role="link"
                        tabIndex={0}
                      >
                        {entry.credentialId || "View credential"}
                      </span>
                    </p>
                  ) : entry.credentialId ? (
                    <p className="mt-px text-[8px] text-gray-500">
                      {entry.credentialId}
                    </p>
                  ) : null}
                </div>
              ))}
          </div>
        )}

      {section.type === "LANGUAGES" && section.languageEntries.length > 0 && (
        <div style={{ marginTop: 2 * es }}>
          {section.languageEntries
            .slice()
            .sort((a, b) => a.order - b.order)
            .map((entry) => (
              <p
                key={entry.id}
                className="text-[9px] text-gray-700"
                style={{ marginBottom: 1 * es }}
              >
                {entry.name}
                {entry.proficiency ? ` – ${entry.proficiency}` : ""}
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
        lineHeight: `${1.25 * lh}`,
        maxWidth,
        margin: "0 auto",
        padding: "10px 12px",
        color: "#111827",
        backgroundColor: "#fff",
        minHeight: "100%",
      }}
    >
      {/* Header */}
      <div
        style={{
          marginBottom: 8 * es,
          paddingBottom: 6 * es,
          borderBottom: "1px solid #E5E7EB",
        }}
      >
        <h1
          style={{
            margin: 0,
            fontSize: `${1.25 * fs}rem`,
            fontWeight: 700,
            color: accentColor,
          }}
        >
          {pd?.fullName || "Your Name"}
        </h1>
        {pd?.jobTitle && (
          <p
            style={{
              margin: "1px 0 0",
              fontSize: `${0.75 * fs}rem`,
              color: "#6B7280",
            }}
          >
            {pd.jobTitle}
          </p>
        )}
        <div
          style={{
            marginTop: 4 * es,
            fontSize: `${0.625 * fs}rem`,
            color: "#9CA3AF",
            display: "flex",
            flexWrap: "wrap",
            gap: "2px 8px",
          }}
        >
          {pd?.email && <span>{pd.email}</span>}
          {pd?.phone && <span>{pd.phone}</span>}
          {pd?.location && <span>{pd.location}</span>}
          {links.map((link, i) => (
            <span key={i}>
              {" "}
              {linkTypeLabels[link.type] || link.label || link.url}
            </span>
          ))}
        </div>
      </div>

      {/* Two-column layout */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          columnGap: 16 * es,
          alignItems: "start",
        }}
      >
        {/* Left column: main sections */}
        <div>{mainSections.map(renderMainSection)}</div>

        {/* Right column: sidebar sections */}
        <div>{sidebarSections.map(renderSidebarSection)}</div>
      </div>

      {/* Footer */}
      {cv.footer && (
        <div
          style={{
            marginTop: 8 * es,
            textAlign: "center",
            fontSize: `${0.5625 * fs}rem`,
            color: "#9CA3AF",
          }}
        >
          {cv.footer}
        </div>
      )}
    </div>
  )
}
