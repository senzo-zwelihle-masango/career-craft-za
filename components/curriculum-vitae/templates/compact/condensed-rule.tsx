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
  slug: "condensed-rule",
  name: "Condensed Rule",
  description:
    "Single column, minimal layout with thin horizontal rules between sections and entries",
  categories: ["compact"],
  columnLayout: "single",
  supportsPhoto: false,
  sidebarSectionTypes: [],
  isPro: false,
  popular: false,
  defaultConfig: {
    fontFamily: "sans-serif",
    accentColor: "#111827",
    headingStyle: "normal",
    headingWeight: "bold",
    showDividers: true,
  },
}

export function CondensedRuleTemplate({ cv }: { cv: CvWithRelations }) {
  const pd = cv.personalDetails
  const fs = cv.fontScale || 1
  const ss = cv.spacingScale || 1
  const pageFormat = cv.pageFormat || "A4"
  const maxWidth = pageFormat === "LETTER" ? "816px" : "794px"
  const accentColor = cv.accentColor || "#111827"
  const fontCSS =
    FONT_FAMILY_MAP[cv.fontFamily]?.css || cv.fontFamily || "Inter, sans-serif"

  const visibleSections = cv.sections
    .filter((s) => s.visible !== false)
    .sort((a, b) => a.order - b.order)

  const links = getLinks(pd)
  const headingStyle = cv.headingStyle || "normal"
  const headingWeight = cv.headingWeight || "bold"
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
          <hr
            style={{
              border: "none",
              borderTop: "1px solid #D1D5DB",
              margin: `${4 * ss}px 0 ${4 * ss}px`,
            }}
          />
          <div
            className="prose prose-sm max-w-none text-[10px] leading-relaxed text-gray-700"
            style={{ margin: `${4 * ss}px 0 ${8 * ss}px` }}
            dangerouslySetInnerHTML={{ __html: section.content }}
          />
          <hr
            style={{
              border: "none",
              borderTop: "1px solid #D1D5DB",
              margin: `${4 * ss}px 0 ${4 * ss}px`,
            }}
          />
        </div>
      )
    }

    return (
      <div key={section.id} style={{ marginBottom: 0 }}>
        <SectionHeading
          title={section.title}
          headingStyle={headingStyle}
          headingWeight={headingWeight}
          showSectionIcons={cv.showSectionIcons}
          accentColor={accentColor}
        />
        <hr
          style={{
            border: "none",
            borderTop: "1px solid #D1D5DB",
            margin: `${4 * ss}px 0 ${4 * ss}px`,
          }}
        />

        {section.type === "EXPERIENCE" &&
          section.experienceEntries.length > 0 && (
            <div>
              {section.experienceEntries
                .slice()
                .sort((a, b) => a.order - b.order)
                .map((entry, idx) => (
                  <div key={entry.id} className="break-inside-avoid">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-[10px] leading-tight font-semibold">
                          {entry.role}
                        </p>
                        <p className="text-[9px] text-gray-600">
                          {entry.company}
                          {showLocation && entry.location
                            ? ` · ${entry.location}`
                            : ""}
                        </p>
                      </div>
                      {showDates && (
                        <p className="shrink-0 text-[8px] text-gray-400">
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
                        className="prose prose-sm mt-0.5 max-w-none text-[9px] leading-relaxed text-gray-700"
                        dangerouslySetInnerHTML={{ __html: entry.description }}
                      />
                    )}
                    {entryStyle !== "paragraph" && entry.bullets.length > 0 && (
                      <ul className="mt-0.5 list-disc pl-3 text-[9px] leading-tight text-gray-700">
                        {entry.bullets.map((b: string, i: number) => (
                          <li key={i} style={{ marginBottom: 1 }}>
                            <span dangerouslySetInnerHTML={{ __html: b }} />
                          </li>
                        ))}
                      </ul>
                    )}
                    {idx < section.experienceEntries.length - 1 && (
                      <hr
                        style={{
                          border: "none",
                          borderTop: "1px solid #D1D5DB",
                          margin: `${4 * ss}px 0 ${4 * ss}px`,
                        }}
                      />
                    )}
                  </div>
                ))}
            </div>
          )}

        {section.type === "EDUCATION" &&
          section.educationEntries.length > 0 && (
            <div>
              {section.educationEntries
                .slice()
                .sort((a, b) => a.order - b.order)
                .map((entry, idx) => (
                  <div key={entry.id} className="break-inside-avoid">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-[10px] leading-tight font-semibold">
                          {entry.institution}
                        </p>
                        <p className="text-[9px] text-gray-600">
                          {entry.degree}
                          {showLocation && entry.location
                            ? ` · ${entry.location}`
                            : ""}
                        </p>
                      </div>
                      {showDates && (
                        <p className="shrink-0 text-[8px] text-gray-400">
                          {entry.startDate
                            ? formatDate(entry.startDate, dateFormat)
                            : ""}
                          {entry.endDate
                            ? ` – ${formatDate(entry.endDate, dateFormat)}`
                            : ""}
                        </p>
                      )}
                    </div>
                    {idx < section.educationEntries.length - 1 && (
                      <hr
                        style={{
                          border: "none",
                          borderTop: "1px solid #D1D5DB",
                          margin: `${4 * ss}px 0 ${4 * ss}px`,
                        }}
                      />
                    )}
                  </div>
                ))}
            </div>
          )}

        {section.type === "PROJECTS" && section.projectEntries.length > 0 && (
          <div>
            {section.projectEntries
              .slice()
              .sort((a, b) => a.order - b.order)
              .map((entry, idx) => (
                <div key={entry.id} className="break-inside-avoid">
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
                  {idx < section.projectEntries.length - 1 && (
                    <hr
                      style={{
                        border: "none",
                        borderTop: "1px solid #D1D5DB",
                        margin: `${4 * ss}px 0 ${4 * ss}px`,
                      }}
                    />
                  )}
                </div>
              ))}
          </div>
        )}

        {section.type === "SKILLS" && (
          <div>
            {section.skillGroups
              .filter((g) => g.visible !== false)
              .slice()
              .sort((a, b) => a.order - b.order)
              .map((group, idx) => (
                <p
                  key={group.id}
                  className="text-[9px] leading-relaxed text-gray-700"
                  style={{ marginBottom: 1 * ss }}
                >
                  {group.label && (
                    <span className="font-semibold">{group.label}: </span>
                  )}
                  <span>{group.skills.join(", ")}</span>
                  {idx <
                    section.skillGroups.filter((g) => g.visible !== false)
                      .length -
                      1 && <span className="text-gray-300"> | </span>}
                </p>
              ))}
          </div>
        )}

        {section.type === "CERTIFICATIONS" &&
          section.certificationEntries.length > 0 && (
            <div>
              {section.certificationEntries
                .slice()
                .sort((a, b) => a.order - b.order)
                .map((entry, idx) => (
                  <div key={entry.id} className="break-inside-avoid">
                    <p className="text-[10px] leading-tight font-semibold">
                      {entry.name}
                    </p>
                    <p className="text-[9px] text-gray-600">
                      {entry.issuer}
                      {entry.issueDate
                        ? ` · ${formatDate(entry.issueDate, dateFormat)}`
                        : ""}
                    </p>
                    {entry.credentialUrl ? (
                      <p className="mt-px text-[9px]">
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
                      <p className="mt-px text-[9px] text-gray-500">
                        {entry.credentialId}
                      </p>
                    ) : null}
                    {idx < section.certificationEntries.length - 1 && (
                      <hr
                        style={{
                          border: "none",
                          borderTop: "1px solid #D1D5DB",
                          margin: `${4 * ss}px 0 ${4 * ss}px`,
                        }}
                      />
                    )}
                  </div>
                ))}
            </div>
          )}

        {section.type === "LANGUAGES" && section.languageEntries.length > 0 && (
          <div className="flex flex-wrap gap-x-3">
            {section.languageEntries
              .slice()
              .sort((a, b) => a.order - b.order)
              .map((entry) => (
                <span key={entry.id} className="text-[9px] text-gray-700">
                  {entry.name}
                  {entry.proficiency ? (
                    <span className="text-gray-400">
                      {" "}
                      ({entry.proficiency})
                    </span>
                  ) : (
                    ""
                  )}
                </span>
              ))}
          </div>
        )}

        {section.type === "AWARDS" && section.awardEntries.length > 0 && (
          <div>
            {section.awardEntries
              .slice()
              .sort((a, b) => a.order - b.order)
              .map((entry) => (
                <div key={entry.id} className="break-inside-avoid">
                  <p className="text-[10px] leading-tight font-semibold">
                    {entry.title}
                  </p>
                  <p className="text-[9px] text-gray-600">
                    {entry.issuer}
                    {entry.date
                      ? ` · ${formatDate(entry.date, dateFormat)}`
                      : ""}
                  </p>
                  {entry.description && (
                    <div
                      className="prose prose-sm mt-0.5 max-w-none text-[9px] text-gray-700"
                      dangerouslySetInnerHTML={{ __html: entry.description }}
                    />
                  )}
                </div>
              ))}
          </div>
        )}

        {section.type === "REFERENCES" &&
          section.referenceEntries.length > 0 && (
            <div>
              {section.referenceEntries
                .slice()
                .sort((a, b) => a.order - b.order)
                .map((entry, idx) => (
                  <div key={entry.id} className="break-inside-avoid">
                    <p className="text-[10px] leading-tight font-semibold">
                      {entry.name}
                    </p>
                    <p className="text-[9px] text-gray-600">
                      {[entry.jobTitle, entry.company]
                        .filter(Boolean)
                        .join(" · ")}
                    </p>
                    <p className="text-[8px] text-gray-400">
                      {[entry.email, entry.phone].filter(Boolean).join(" · ")}
                    </p>
                    {idx < section.referenceEntries.length - 1 && (
                      <hr
                        style={{
                          border: "none",
                          borderTop: "1px solid #D1D5DB",
                          margin: `${4 * ss}px 0 ${4 * ss}px`,
                        }}
                      />
                    )}
                  </div>
                ))}
            </div>
          )}

        {section.type === "CUSTOM" && section.content && (
          <div
            className="prose prose-sm max-w-none text-[9px] leading-relaxed whitespace-pre-wrap text-gray-700"
            style={{ margin: `${4 * ss}px 0` }}
            dangerouslySetInnerHTML={{ __html: section.content }}
          />
        )}

        {section.type !== "SUMMARY" && section.type !== "CUSTOM" && (
          <hr
            style={{
              border: "none",
              borderTop: "1px solid #D1D5DB",
              margin: `${4 * ss}px 0 ${4 * ss}px`,
            }}
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
        lineHeight: `${1.2 * ss}`,
        maxWidth,
        margin: "0 auto",
        padding: "8px 12px",
        color: "#111827",
        backgroundColor: "#fff",
        minHeight: "100%",
      }}
    >
      {/* Header */}
      <div style={{ marginBottom: 6 * ss }}>
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
              fontSize: `${0.6875 * fs}rem`,
              color: "#6B7280",
            }}
          >
            {pd.jobTitle}
          </p>
        )}
        <div
          style={{
            marginTop: 3 * ss,
            fontSize: `${0.5625 * fs}rem`,
            color: "#9CA3AF",
            display: "flex",
            flexWrap: "wrap",
            gap: "2px 6px",
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

      <hr
        style={{
          border: "none",
          borderTop: "1px solid #D1D5DB",
          margin: `${4 * ss}px 0 ${4 * ss}px`,
        }}
      />

      {/* Sections */}
      <div>{visibleSections.map(renderSection)}</div>

      {/* Footer */}
      {cv.footer && (
        <div
          style={{
            marginTop: 8 * ss,
            textAlign: "center",
            fontSize: `${0.5 * fs}rem`,
            color: "#9CA3AF",
          }}
        >
          {cv.footer}
        </div>
      )}
    </div>
  )
}
