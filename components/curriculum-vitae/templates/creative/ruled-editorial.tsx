import type { CvWithRelations } from "@/types/curriculum-vitae/types"
import type { TemplateMeta } from "@/types/templates/types"
import { formatDate } from "@/lib/utils"
import { FONT_FAMILY_MAP } from "../_base/font-map"

function getLinks(
  pd: { links?: unknown } | null
): { type: string; url: string; label?: string }[] {
  if (!pd?.links) return []
  if (Array.isArray(pd.links)) return pd.links
  try {
    const parsed =
      typeof pd.links === "string" ? JSON.parse(pd.links) : pd.links
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

const linkTypeLabels: Record<string, string> = {
  linkedin: "LinkedIn",
  github: "GitHub",
  website: "Website",
  portfolio: "Portfolio",
  figma: "Figma",
}

interface RuledEditorialProps {
  cv: CvWithRelations
}

export function RuledEditorial({ cv }: RuledEditorialProps) {
  const pd = cv.personalDetails
  const fs = cv.fontScale || 1
  const ss = cv.spacingScale || 1
  const lh = cv.lineHeight ?? ss
  const es = cv.elementSpacing ?? ss
  const mh = cv.marginHorizontal ?? ss
  const mv = cv.marginVertical ?? ss
  const pageFormat = cv.pageFormat || "A4"
  const maxWidth = pageFormat === "LETTER" ? "816px" : "794px"
  const accentColor = cv.accentColor || "#1f2937"
  const fontCSS =
    FONT_FAMILY_MAP[cv.fontFamily]?.css || cv.fontFamily || "Inter, sans-serif"

  const visibleSections = cv.sections
    .filter((s) => s.visible !== false)
    .sort((a, b) => a.order - b.order)

  const headingTextTransform =
    cv.headingStyle === "uppercase" ? "uppercase" : "none"

  return (
    <div
      style={{
        fontFamily: fontCSS,
        fontSize: `${fs}rem`,
        lineHeight: `${1.4 * lh}`,
        color: "#1f2937",
        background: "#fff",
        maxWidth,
        margin: "0 auto",
        padding: `${40 * mv}px ${44 * mh}px`,
      }}
    >
      {/* Header */}
      <div style={{ marginBottom: `${24 * es}px` }}>
        {pd?.fullName && (
          <h1
            style={{
              margin: 0,
              fontSize: `${1.75 * fs}rem`,
              fontWeight: 300,
              letterSpacing: "0.02em",
              color: accentColor,
            }}
          >
            {pd.fullName}
          </h1>
        )}
        {pd?.jobTitle && (
          <p
            style={{
              margin: `${2 * es}px 0 0`,
              fontSize: `${0.8125 * fs}rem`,
              fontWeight: 500,
              color: "#6B7280",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
            }}
          >
            {pd.jobTitle}
          </p>
        )}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: `0 ${16 * es}px`,
            marginTop: `${8 * es}px`,
            fontSize: `${0.6875 * fs}rem`,
            color: "#9CA3AF",
          }}
        >
          {pd?.email && <span>{pd.email}</span>}
          {pd?.phone && <span>{pd.phone}</span>}
          {pd?.location && <span>{pd.location}</span>}
          {getLinks(pd).map((link, i) => (
            <span key={i}>
              {linkTypeLabels[link.type] || link.label || link.url}
            </span>
          ))}
        </div>
      </div>

      {/* Sections */}
      {visibleSections.map((section, idx) => {
        const showDivider =
          cv.showDividers !== false && idx < visibleSections.length - 1

        return (
          <div key={section.id} style={{ marginBottom: `${18 * es}px` }}>
            {/* Heading with vertical accent bar + ruled line */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: `${10 * es}px`,
              }}
            >
              <div
                style={{
                  width: "3px",
                  height: `${18 * mv}px`,
                  backgroundColor: accentColor,
                  borderRadius: "2px",
                  flexShrink: 0,
                }}
              />
              <h2
                style={{
                  margin: 0,
                  fontSize: `${0.75 * fs}rem`,
                  fontWeight: 700,
                  textTransform: headingTextTransform,
                  letterSpacing: "0.12em",
                  color: accentColor,
                }}
              >
                {section.title}
              </h2>
              <div
                style={{
                  flex: 1,
                  height: "1px",
                  backgroundColor: "#E5E7EB",
                  marginLeft: `${4 * mh}px`,
                }}
              />
            </div>

            {/* Content */}
            <div style={{ paddingLeft: "13px", marginTop: `${6 * es}px` }}>
              {section.type === "SUMMARY" && section.content && (
                <div
                  className="prose prose-sm max-w-none"
                  style={{
                    margin: 0,
                    fontSize: `${0.8125 * fs}rem`,
                    lineHeight: 1.6,
                    color: "#4B5563",
                    fontStyle: "italic",
                  }}
                  dangerouslySetInnerHTML={{ __html: section.content }}
                />
              )}

              {section.type === "EXPERIENCE" &&
                section.experienceEntries
                  .slice()
                  .sort((a, b) => a.order - b.order)
                  .map((entry) => (
                    <div
                      key={entry.id}
                      style={{
                        marginBottom: `${10 * es}px`,
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "baseline",
                        }}
                      >
                        <span
                          style={{
                            fontWeight: 600,
                            fontSize: `${0.875 * fs}rem`,
                          }}
                        >
                          {entry.role}
                        </span>
                        {cv.showEntryDates !== false && (
                          <span
                            style={{
                              fontSize: `${0.6875 * fs}rem`,
                              color: "#9CA3AF",
                              whiteSpace: "nowrap",
                            }}
                          >
                            {formatDate(
                              entry.startDate,
                              cv.dateFormat || "MM/YYYY"
                            )}
                            {" – "}
                            {entry.current
                              ? "Present"
                              : entry.endDate
                                ? formatDate(
                                    entry.endDate,
                                    cv.dateFormat || "MM/YYYY"
                                  )
                                : ""}
                          </span>
                        )}
                      </div>
                      <p
                        style={{
                          margin: `${1 * es}px 0 0`,
                          fontSize: `${0.75 * fs}rem`,
                          color: "#6B7280",
                        }}
                      >
                        {entry.company}
                        {cv.showEntryLocation !== false && entry.location
                          ? ` · ${entry.location}`
                          : ""}
                      </p>
                      {entry.description && (
                        <div
                          className="prose prose-sm max-w-none"
                          style={{
                            marginTop: `${3 * es}px`,
                            fontSize: `${0.8125 * fs}rem`,
                            lineHeight: 1.5,
                            color: "#4B5563",
                          }}
                          dangerouslySetInnerHTML={{
                            __html: entry.description,
                          }}
                        />
                      )}
                      {cv.entryStyle !== "paragraph" &&
                        entry.bullets.length > 0 && (
                          <ul
                            style={{
                              margin: `${3 * es}px 0 0`,
                              paddingLeft: `${16 * mh}px`,
                              fontSize: `${0.8125 * fs}rem`,
                              color: "#4B5563",
                              lineHeight: 1.5,
                            }}
                          >
                            {entry.bullets.filter(Boolean).map((b, i) => (
                              <li key={i}>
                                <span dangerouslySetInnerHTML={{ __html: b }} />
                              </li>
                            ))}
                          </ul>
                        )}
                    </div>
                  ))}

              {section.type === "EDUCATION" &&
                section.educationEntries
                  .slice()
                  .sort((a, b) => a.order - b.order)
                  .map((entry) => (
                    <div
                      key={entry.id}
                      style={{
                        marginBottom: `${6 * es}px`,
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "baseline",
                        }}
                      >
                        <span
                          style={{
                            fontWeight: 600,
                            fontSize: `${0.875 * fs}rem`,
                          }}
                        >
                          {entry.institution}
                        </span>
                        {cv.showEntryDates !== false && (
                          <span
                            style={{
                              fontSize: `${0.6875 * fs}rem`,
                              color: "#9CA3AF",
                              whiteSpace: "nowrap",
                            }}
                          >
                            {entry.startDate &&
                              formatDate(
                                entry.startDate,
                                cv.dateFormat || "MM/YYYY"
                              )}
                            {entry.endDate &&
                              ` – ${formatDate(entry.endDate, cv.dateFormat || "MM/YYYY")}`}
                          </span>
                        )}
                      </div>
                      <p
                        style={{
                          margin: `${1 * es}px 0 0`,
                          fontSize: `${0.75 * fs}rem`,
                          color: "#6B7280",
                        }}
                      >
                        {entry.degree}
                        {cv.showEntryLocation !== false && entry.location
                          ? ` · ${entry.location}`
                          : ""}
                      </p>
                    </div>
                  ))}

              {section.type === "PROJECTS" &&
                section.projectEntries
                  .slice()
                  .sort((a, b) => a.order - b.order)
                  .map((entry) => (
                    <div
                      key={entry.id}
                      style={{
                        marginBottom: `${6 * es}px`,
                      }}
                    >
                      <span
                        style={{
                          fontWeight: 600,
                          fontSize: `${0.875 * fs}rem`,
                        }}
                      >
                        {entry.name}
                      </span>
                      {entry.description && (
                        <div
                          className="prose prose-sm max-w-none"
                          style={{
                            margin: `${2 * es}px 0 0`,
                            fontSize: `${0.8125 * fs}rem`,
                            color: "#4B5563",
                          }}
                          dangerouslySetInnerHTML={{
                            __html: entry.description,
                          }}
                        />
                      )}
                      {entry.technologies.length > 0 && (
                        <p
                          style={{
                            margin: `${2 * es}px 0 0`,
                            fontSize: `${0.6875 * fs}rem`,
                            color: "#9CA3AF",
                          }}
                        >
                          {entry.technologies.join(", ")}
                        </p>
                      )}
                    </div>
                  ))}

              {section.type === "SKILLS" && (
                <div style={{ marginTop: `${2 * es}px` }}>
                  {section.skillGroups
                    .filter((g) => g.visible !== false)
                    .sort((a, b) => a.order - b.order)
                    .map((group) => (
                      <div
                        key={group.id}
                        style={{ marginBottom: `${3 * es}px` }}
                      >
                        {group.label && (
                          <span
                            style={{
                              fontWeight: 600,
                              fontSize: `${0.75 * fs}rem`,
                              color: "#374151",
                            }}
                          >
                            {group.label}:{" "}
                          </span>
                        )}
                        <span
                          style={{
                            fontSize: `${0.75 * fs}rem`,
                            color: "#6B7280",
                          }}
                        >
                          {group.skills.join(", ")}
                        </span>
                      </div>
                    ))}
                </div>
              )}

              {section.type === "CERTIFICATIONS" &&
                section.certificationEntries
                  .slice()
                  .sort((a, b) => a.order - b.order)
                  .map((cert) => (
                    <div
                      key={cert.id}
                      style={{
                        marginBottom: `${4 * es}px`,
                        pageBreakInside: "avoid",
                      }}
                    >
                      <p
                        style={{
                          margin: 0,
                          fontSize: `${0.8125 * fs}rem`,
                          fontWeight: 600,
                        }}
                      >
                        {cert.name}
                      </p>
                      {cert.issuer && (
                        <p
                          style={{
                            margin: 0,
                            fontSize: `${0.75 * fs}rem`,
                            color: "#6B7280",
                          }}
                        >
                          {cert.issuer}
                          {cert.issueDate
                            ? ` · ${formatDate(cert.issueDate, cv.dateFormat || "MM/YYYY")}`
                            : ""}
                        </p>
                      )}
                      {cert.credentialUrl ? (
                        <p
                          style={{
                            margin: `${1 * es}px 0 0`,
                            fontSize: `${0.6875 * fs}rem`,
                          }}
                        >
                          <span
                            onClick={(e) => {
                              e.stopPropagation()
                              window.open(cert.credentialUrl!, "_blank")
                            }}
                            style={{
                              color: "inherit",
                              textDecoration: "underline",
                              cursor: "pointer",
                            }}
                            role="link"
                            tabIndex={0}
                          >
                            {cert.credentialId || "View credential"}
                          </span>
                        </p>
                      ) : cert.credentialId ? (
                        <p
                          style={{
                            margin: `${1 * es}px 0 0`,
                            fontSize: `${0.6875 * fs}rem`,
                            color: "#6B7280",
                          }}
                        >
                          {cert.credentialId}
                        </p>
                      ) : null}
                    </div>
                  ))}

              {section.type === "LANGUAGES" &&
                section.languageEntries
                  .slice()
                  .sort((a, b) => a.order - b.order)
                  .map((lang) => (
                    <div
                      key={lang.id}
                      style={{
                        display: "flex",
                        gap: `${8 * es}px`,
                        marginBottom: `${2 * es}px`,
                        fontSize: `${0.8125 * fs}rem`,
                      }}
                    >
                      <span style={{ fontWeight: 500 }}>{lang.name}</span>
                      {lang.proficiency && (
                        <span style={{ color: "#9CA3AF" }}>
                          {lang.proficiency}
                        </span>
                      )}
                    </div>
                  ))}

              {section.type === "AWARDS" &&
                section.awardEntries
                  .slice()
                  .sort((a, b) => a.order - b.order)
                  .map((award) => (
                    <div
                      key={award.id}
                      style={{
                        marginBottom: `${4 * es}px`,
                        pageBreakInside: "avoid",
                      }}
                    >
                      <p
                        style={{
                          margin: 0,
                          fontSize: `${0.8125 * fs}rem`,
                          fontWeight: 600,
                        }}
                      >
                        {award.title}
                      </p>
                      {award.issuer && (
                        <p
                          style={{
                            margin: 0,
                            fontSize: `${0.75 * fs}rem`,
                            color: "#6B7280",
                          }}
                        >
                          {award.issuer}
                          {award.date
                            ? ` · ${formatDate(award.date, cv.dateFormat || "MM/YYYY")}`
                            : ""}
                        </p>
                      )}
                      {award.description && (
                        <div
                          className="prose prose-sm max-w-none"
                          style={{
                            margin: `${2 * es}px 0 0`,
                            fontSize: `${0.8125 * fs}rem`,
                            color: "#4B5563",
                          }}
                          dangerouslySetInnerHTML={{
                            __html: award.description,
                          }}
                        />
                      )}
                    </div>
                  ))}

              {section.type === "REFERENCES" &&
                section.referenceEntries
                  .slice()
                  .sort((a, b) => a.order - b.order)
                  .map((ref) => (
                    <div
                      key={ref.id}
                      style={{
                        marginBottom: `${4 * es}px`,
                      }}
                    >
                      <p
                        style={{
                          margin: 0,
                          fontSize: `${0.8125 * fs}rem`,
                          fontWeight: 600,
                        }}
                      >
                        {ref.name}
                      </p>
                      {(ref.jobTitle || ref.company) && (
                        <p
                          style={{
                            margin: 0,
                            fontSize: `${0.75 * fs}rem`,
                            color: "#6B7280",
                          }}
                        >
                          {[ref.jobTitle, ref.company]
                            .filter(Boolean)
                            .join(" · ")}
                        </p>
                      )}
                      {(ref.email || ref.phone) && (
                        <p
                          style={{
                            margin: 0,
                            fontSize: `${0.6875 * fs}rem`,
                            color: "#9CA3AF",
                          }}
                        >
                          {[ref.email, ref.phone].filter(Boolean).join(" · ")}
                        </p>
                      )}
                    </div>
                  ))}

              {section.type === "CUSTOM" && section.content && (
                <div
                  className="prose prose-sm max-w-none"
                  style={{
                    margin: 0,
                    fontSize: `${0.8125 * fs}rem`,
                    color: "#4B5563",
                    whiteSpace: "pre-wrap",
                  }}
                  dangerouslySetInnerHTML={{ __html: section.content }}
                />
              )}
            </div>

            {showDivider && (
              <div
                style={{
                  marginTop: `${12 * es}px`,
                  height: "1px",
                  backgroundColor: "#F3F4F6",
                }}
              />
            )}
          </div>
        )
      })}

      {cv.footer && (
        <p
          style={{
            margin: `${20 * es}px 0 0`,
            fontSize: `${0.625 * fs}rem`,
            color: "#D1D5DB",
            textAlign: "center",
          }}
        >
          {cv.footer}
        </p>
      )}
    </div>
  )
}

export const templateMeta: TemplateMeta = {
  slug: "ruled-editorial",
  name: "Ruled Editorial",
  description:
    "Vertical accent bar alongside each section heading with ruled dividers for an elegant editorial feel",
  categories: ["creative"],
  columnLayout: "single",
  supportsPhoto: false,
  sidebarSectionTypes: [],
  isPro: false,
  popular: false,
  defaultConfig: {
    fontFamily: "sans-serif",
    accentColor: "#0f766e",
    headingStyle: "uppercase",
    headingWeight: "bold",
    showDividers: true,
  },
}
