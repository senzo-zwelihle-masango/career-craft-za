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
  slug: "exec-formal",
  name: "Executive Formal",
  description: "Traditional formal executive layout",
  categories: ["compact"],
  columnLayout: "single",
  supportsPhoto: false,
  sidebarSectionTypes: [],
  isPro: false,
  popular: false,
  defaultConfig: {
    fontFamily: "serif",
    accentColor: "#1e3a5f",
    headingStyle: "uppercase",
    headingWeight: "bold",
    showDividers: true,
  },
}

export function ExecFormalTemplate({ cv }: { cv: CvWithRelations }) {
  const pd = cv.personalDetails
  const fs = cv.fontScale || 1
  const ss = cv.spacingScale || 1
  const pageFormat = cv.pageFormat || "A4"
  const maxWidth = pageFormat === "LETTER" ? "816px" : "794px"
  const accentColor = cv.accentColor || "#1e3a5f"
  const fontCSS =
    FONT_FAMILY_MAP[cv.fontFamily]?.css || cv.fontFamily || "Inter, sans-serif"

  const visibleSections = cv.sections
    .filter((s) => s.visible !== false)
    .sort((a, b) => a.order - b.order)

  const links = getLinks(pd)
  const headingStyle = cv.headingStyle || "uppercase"
  const headingWeight = cv.headingWeight || "bold"
  const showDividers = cv.showDividers !== false
  const entryStyle = cv.entryStyle || "bullet"
  const showDates = cv.showEntryDates !== false
  const showLocation = cv.showEntryLocation !== false
  const dateFormat = cv.dateFormat || "MM/YYYY"

  const renderSection = (section: CvWithRelations["sections"][0]) => {
    if (section.type === "SUMMARY" && section.content) {
      return (
        <div key={section.id}>
          <SectionHeading
            title={section.title}
            headingStyle={headingStyle}
            headingWeight={headingWeight}
            showSectionIcons={cv.showSectionIcons}
            accentColor={accentColor}
          />
          <div
            className="prose prose-sm max-w-none text-[11px] leading-relaxed text-gray-800"
            style={{ marginTop: 4 * ss, marginBottom: 2 * ss }}
            dangerouslySetInnerHTML={{ __html: section.content }}
          />
        </div>
      )
    }

    return (
      <div key={section.id}>
        <SectionHeading
          title={section.title}
          headingStyle={headingStyle}
          headingWeight={headingWeight}
          showSectionIcons={cv.showSectionIcons}
          accentColor={accentColor}
        />

        {section.type === "EXPERIENCE" &&
          section.experienceEntries.length > 0 && (
            <div style={{ marginTop: 4 * ss }}>
              {section.experienceEntries
                .slice()
                .sort((a, b) => a.order - b.order)
                .map((entry) => (
                  <div
                    key={entry.id}
                    className="break-inside-avoid"
                    style={{ marginBottom: 8 * ss }}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-[11px] font-semibold">
                          {entry.role}
                        </p>
                        <p className="text-[10px] text-gray-700 italic">
                          {entry.company}
                          {showLocation && entry.location
                            ? ` – ${entry.location}`
                            : ""}
                        </p>
                      </div>
                      {showDates && (
                        <p className="shrink-0 text-[10px] text-gray-500">
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
                    </div>
                    {entry.description && (
                      <div
                        className="prose prose-sm mt-1 max-w-none text-[10px] leading-relaxed text-gray-700"
                        dangerouslySetInnerHTML={{ __html: entry.description }}
                      />
                    )}
                    {entryStyle !== "paragraph" && entry.bullets.length > 0 && (
                      <ul className="mt-0.5 list-disc pl-4 text-[10px] leading-relaxed text-gray-700">
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
            <div style={{ marginTop: 4 * ss }}>
              {section.educationEntries
                .slice()
                .sort((a, b) => a.order - b.order)
                .map((entry) => (
                  <div
                    key={entry.id}
                    className="break-inside-avoid"
                    style={{ marginBottom: 6 * ss }}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-[11px] font-semibold">
                          {entry.institution}
                        </p>
                        <p className="text-[10px] text-gray-700 italic">
                          {entry.degree}
                          {showLocation && entry.location
                            ? ` – ${entry.location}`
                            : ""}
                        </p>
                      </div>
                      {showDates && (
                        <p className="shrink-0 text-[10px] text-gray-500">
                          {entry.startDate
                            ? formatDate(entry.startDate, dateFormat)
                            : ""}
                          {entry.endDate
                            ? ` – ${formatDate(entry.endDate, dateFormat)}`
                            : ""}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
            </div>
          )}

        {section.type === "PROJECTS" && section.projectEntries.length > 0 && (
          <div style={{ marginTop: 4 * ss }}>
            {section.projectEntries
              .slice()
              .sort((a, b) => a.order - b.order)
              .map((entry) => (
                <div
                  key={entry.id}
                  className="break-inside-avoid"
                  style={{ marginBottom: 6 * ss }}
                >
                  <p className="text-[11px] font-semibold">
                    {entry.name}
                    {entry.link && (
                      <span className="text-[10px] font-normal text-gray-500">
                        {" "}
                        – {entry.link}
                      </span>
                    )}
                  </p>
                  {entry.description && (
                    <div
                      className="prose prose-sm max-w-none text-[10px] leading-relaxed text-gray-700"
                      dangerouslySetInnerHTML={{ __html: entry.description }}
                    />
                  )}
                  {entry.technologies.length > 0 && (
                    <p className="mt-0.5 text-[9px] text-gray-500">
                      {entry.technologies.join(", ")}
                    </p>
                  )}
                </div>
              ))}
          </div>
        )}

        {section.type === "SKILLS" && (
          <div style={{ marginTop: 4 * ss }}>
            {section.skillGroups
              .filter((g) => g.visible !== false)
              .slice()
              .sort((a, b) => a.order - b.order)
              .map((group) => (
                <p
                  key={group.id}
                  className="text-[10px] text-gray-800"
                  style={{ marginBottom: 2 * ss }}
                >
                  {group.label && (
                    <span className="font-semibold">{group.label}: </span>
                  )}
                  <span>{group.skills.join(", ")}</span>
                </p>
              ))}
          </div>
        )}

        {section.type === "CERTIFICATIONS" &&
          section.certificationEntries.length > 0 && (
            <div style={{ marginTop: 4 * ss }}>
              {section.certificationEntries
                .slice()
                .sort((a, b) => a.order - b.order)
                .map((entry) => (
                  <div
                    key={entry.id}
                    className="break-inside-avoid"
                    style={{ marginBottom: 4 * ss }}
                  >
                    <p className="text-[11px] font-semibold">{entry.name}</p>
                    {entry.issuer && (
                      <p className="text-[10px] text-gray-600">
                        {entry.issuer}
                      </p>
                    )}
                    {entry.issueDate && (
                      <p className="text-[10px] text-gray-500">
                        {formatDate(entry.issueDate, dateFormat)}
                        {entry.expiryDate
                          ? ` – ${formatDate(entry.expiryDate, dateFormat)}`
                          : ""}
                      </p>
                    )}
                    {entry.credentialUrl ? (
                      <p className="mt-0.5 text-[10px]">
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
                      <p className="mt-0.5 text-[10px] text-gray-500">
                        {entry.credentialId}
                      </p>
                    ) : null}
                  </div>
                ))}
            </div>
          )}

        {section.type === "LANGUAGES" && section.languageEntries.length > 0 && (
          <div style={{ marginTop: 4 * ss }}>
            <div className="flex flex-wrap gap-x-4">
              {section.languageEntries
                .slice()
                .sort((a, b) => a.order - b.order)
                .map((entry) => (
                  <div key={entry.id} className="text-[10px]">
                    <span className="font-medium">{entry.name}</span>
                    {entry.proficiency && (
                      <span className="text-gray-500">
                        {" "}
                        – {entry.proficiency}
                      </span>
                    )}
                  </div>
                ))}
            </div>
          </div>
        )}

        {section.type === "AWARDS" && section.awardEntries.length > 0 && (
          <div style={{ marginTop: 4 * ss }}>
            {section.awardEntries
              .slice()
              .sort((a, b) => a.order - b.order)
              .map((entry) => (
                <div
                  key={entry.id}
                  className="break-inside-avoid"
                  style={{ marginBottom: 4 * ss }}
                >
                  <p className="text-[11px] font-semibold">{entry.title}</p>
                  {entry.issuer && (
                    <p className="text-[10px] text-gray-600">{entry.issuer}</p>
                  )}
                  {entry.date && (
                    <p className="text-[10px] text-gray-500">
                      {formatDate(entry.date, dateFormat)}
                    </p>
                  )}
                  {entry.description && (
                    <div
                      className="prose prose-sm mt-0.5 max-w-none text-[10px] text-gray-700"
                      dangerouslySetInnerHTML={{ __html: entry.description }}
                    />
                  )}
                </div>
              ))}
          </div>
        )}

        {section.type === "REFERENCES" &&
          section.referenceEntries.length > 0 && (
            <div style={{ marginTop: 4 * ss }}>
              {section.referenceEntries
                .slice()
                .sort((a, b) => a.order - b.order)
                .map((entry) => (
                  <div
                    key={entry.id}
                    className="break-inside-avoid"
                    style={{ marginBottom: 6 * ss }}
                  >
                    <p className="text-[11px] font-semibold">{entry.name}</p>
                    {(entry.jobTitle || entry.company) && (
                      <p className="text-[10px] text-gray-600">
                        {[entry.jobTitle, entry.company]
                          .filter(Boolean)
                          .join(", ")}
                      </p>
                    )}
                    {(entry.email || entry.phone) && (
                      <p className="text-[10px] text-gray-500">
                        {[entry.email, entry.phone].filter(Boolean).join(" · ")}
                      </p>
                    )}
                  </div>
                ))}
            </div>
          )}

        {section.type === "CUSTOM" && section.content && (
          <div
            className="prose prose-sm max-w-none text-[10px] leading-relaxed whitespace-pre-wrap text-gray-700"
            style={{ marginTop: 4 * ss }}
            dangerouslySetInnerHTML={{ __html: section.content }}
          />
        )}
      </div>
    )
  }

  return (
    <div
      style={{
        fontFamily: fontCSS,
        fontSize: `${fs}rem`,
        lineHeight: `${1.3 * ss}`,
        maxWidth,
        margin: "0 auto",
        padding: "12px 16px",
        color: "#111827",
        backgroundColor: "#fff",
        minHeight: "100%",
      }}
    >
      {/* Header */}
      <div
        style={{
          borderBottom: showDividers ? `3px double ${accentColor}` : "none",
          paddingBottom: 10 * ss,
          marginBottom: 12 * ss,
        }}
      >
        <h1
          style={{
            margin: 0,
            fontSize: `${1.5 * fs}rem`,
            fontWeight: 700,
            color: accentColor,
            letterSpacing: "0.02em",
          }}
        >
          {pd?.fullName || "Your Name"}
        </h1>
        {pd?.jobTitle && (
          <p
            style={{
              margin: "2px 0 0",
              fontSize: `${0.8125 * fs}rem`,
              fontStyle: "italic",
              color: "#374151",
            }}
          >
            {pd.jobTitle}
          </p>
        )}
        <div
          style={{
            marginTop: 6 * ss,
            fontSize: `${0.6875 * fs}rem`,
            color: "#6B7280",
            display: "flex",
            flexWrap: "wrap",
            gap: "4px 12px",
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
      </div>

      {/* Sections */}
      <div style={{ display: "flex", flexDirection: "column", gap: 10 * ss }}>
        {visibleSections.map((section) => (
          <div key={section.id}>
            {renderSection(section)}
            {showDividers && section.type !== "SUMMARY" && (
              <hr
                style={{
                  border: "none",
                  borderTop: `1px solid ${accentColor}40`,
                  margin: `${8 * ss}px 0 0`,
                }}
              />
            )}
          </div>
        ))}
      </div>

      {/* Footer */}
      {cv.footer && (
        <div
          style={{
            marginTop: 12 * ss,
            textAlign: "center",
            fontSize: `${0.625 * fs}rem`,
            color: "#9CA3AF",
          }}
        >
          {cv.footer}
        </div>
      )}
    </div>
  )
}
