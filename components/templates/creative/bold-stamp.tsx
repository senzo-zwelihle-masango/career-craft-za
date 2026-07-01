import type { CvWithRelations } from "@/lib/data/editor/types"
import type { TemplateMeta } from "../types"
import { formatDate } from "@/lib/data/editor/utils"
import { FONT_FAMILY_MAP } from "../_base/font-map"

function getLinks(pd: { links?: unknown } | null): { type: string; url: string; label?: string }[] {
  if (!pd?.links) return []
  if (Array.isArray(pd.links)) return pd.links
  try {
    const parsed = typeof pd.links === "string" ? JSON.parse(pd.links) : pd.links
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
  custom: "Link",
}

interface BoldStampProps {
  cv: CvWithRelations
}

export function BoldStamp({ cv }: BoldStampProps) {
  const pd = cv.personalDetails
  const fs = cv.fontScale || 1
  const ss = cv.spacingScale || 1
  const pageFormat = cv.pageFormat || "A4"
  const maxWidth = pageFormat === "LETTER" ? "816px" : "794px"
  const accentColor = cv.accentColor || "#1f2937"
  const fontCSS = FONT_FAMILY_MAP[cv.fontFamily]?.css || cv.fontFamily || "Inter, sans-serif"

  const visibleSections = cv.sections
    .filter((s) => s.visible !== false)
    .sort((a, b) => a.order - b.order)

  const initial = pd?.fullName?.charAt(0)?.toUpperCase() || "Y"

  const headingTextTransform =
    cv.headingStyle === "uppercase" ? "uppercase" : "none"

  return (
    <div
      style={{
        fontFamily: fontCSS,
        fontSize: `${fs}rem`,
        lineHeight: `${1.4 * ss}`,
        color: "#1f2937",
        background: "#fff",
        maxWidth,
        margin: "0 auto",
        padding: `${36 * ss}px ${40 * ss}px`,
      }}
    >
      {/* Header with stamp */}
      <div
        style={{
          position: "relative",
          marginBottom: `${28 * ss}px`,
          paddingBottom: `${16 * ss}px`,
          borderBottom: `4px solid ${accentColor}`,
        }}
      >
        {/* Decorative initial stamp */}
        <div
          style={{
            position: "absolute",
            right: 0,
            top: "-8px",
            fontSize: `${6 * fs}rem`,
            fontWeight: 900,
            lineHeight: 1,
            color: accentColor,
            opacity: 0.07,
            userSelect: "none",
            pointerEvents: "none",
          }}
        >
          {initial}
        </div>

        <div style={{ position: "relative", zIndex: 1 }}>
          {pd?.fullName && (
            <h1
              style={{
                margin: 0,
                fontSize: `${2 * fs}rem`,
                fontWeight: 900,
                letterSpacing: "-0.03em",
                color: "#111827",
              }}
            >
              {pd.fullName}
            </h1>
          )}
          {pd?.jobTitle && (
            <div style={{ display: "flex", alignItems: "center", gap: `${8 * ss}px`, marginTop: `${4 * ss}px` }}>
              <div
                style={{
                  width: "24px",
                  height: "3px",
                  backgroundColor: accentColor,
                  borderRadius: "2px",
                  flexShrink: 0,
                }}
              />
              <p
                style={{
                  margin: 0,
                  fontSize: `${0.8125 * fs}rem`,
                  fontWeight: 600,
                  color: accentColor,
                  letterSpacing: "0.06em",
                  textTransform: "uppercase",
                }}
              >
                {pd.jobTitle}
              </p>
            </div>
          )}
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: `0 ${16 * ss}px`,
              marginTop: `${10 * ss}px`,
              fontSize: `${0.6875 * fs}rem`,
              color: "#6B7280",
            }}
          >
            {pd?.email && <span>{pd.email}</span>}
            {pd?.phone && <span>{pd.phone}</span>}
            {pd?.location && <span>{pd.location}</span>}
            {getLinks(pd).map((link, i) => (
              <span key={i}>{linkTypeLabels[link.type] || link.label || link.url}</span>
            ))}
          </div>
        </div>
      </div>

      {/* Sections */}
      {visibleSections.map((section, idx) => {
        const showDivider =
          cv.showDividers !== false && idx < visibleSections.length - 1

        return (
          <div key={section.id} style={{ marginBottom: `${16 * ss}px` }}>
            {/* Bold heading with stamp accent */}
            <div
              style={{
                display: "inline-block",
                marginBottom: `${6 * ss}px`,
              }}
            >
              <h2
                style={{
                  margin: 0,
                  fontSize: `${0.8125 * fs}rem`,
                  fontWeight: 800,
                  textTransform: headingTextTransform,
                  letterSpacing: "0.08em",
                  color: "#111827",
                }}
              >
                {section.title}
              </h2>
              <div
                style={{
                  marginTop: `${2 * ss}px`,
                  width: "32px",
                  height: "3px",
                  backgroundColor: accentColor,
                  borderRadius: "2px",
                }}
              />
            </div>

            {/* Content */}
            <div>
              {section.type === "SUMMARY" && section.content && (
                <div
                  className="prose prose-sm max-w-none"
                  style={{
                    margin: 0,
                    fontSize: `${0.8125 * fs}rem`,
                    lineHeight: 1.6,
                    color: "#4B5563",
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
                        marginBottom: `${10 * ss}px`,
                        pageBreakInside: "avoid",
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
                            fontWeight: 700,
                            fontSize: `${0.875 * fs}rem`,
                            color: "#111827",
                          }}
                        >
                          {entry.role}
                        </span>
                        {cv.showEntryDates !== false && (
                          <span
                            style={{
                              fontSize: `${0.6875 * fs}rem`,
                              fontWeight: 600,
                              color: accentColor,
                              whiteSpace: "nowrap",
                            }}
                          >
                            {formatDate(entry.startDate, cv.dateFormat || "MM/YYYY")}
                            {" — "}
                            {entry.current
                              ? "Present"
                              : entry.endDate
                                ? formatDate(entry.endDate, cv.dateFormat || "MM/YYYY")
                                : ""}
                          </span>
                        )}
                      </div>
                      <p
                        style={{
                          margin: `${1 * ss}px 0 0`,
                          fontSize: `${0.75 * fs}rem`,
                          fontWeight: 600,
                          color: accentColor,
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
                            marginTop: `${3 * ss}px`,
                            fontSize: `${0.8125 * fs}rem`,
                            lineHeight: 1.5,
                            color: "#4B5563",
                          }}
                          dangerouslySetInnerHTML={{ __html: entry.description }}
                        />
                      )}
                      {cv.entryStyle !== "paragraph" &&
                        entry.bullets.length > 0 && (
                          <ul
                            style={{
                              margin: `${3 * ss}px 0 0`,
                              paddingLeft: `${16 * ss}px`,
                              fontSize: `${0.8125 * fs}rem`,
                              color: "#4B5563",
                              lineHeight: 1.5,
                            }}
                          >
                            {entry.bullets
                              .filter(Boolean)
                              .map((b, i) => (
                                <li key={i}><span dangerouslySetInnerHTML={{ __html: b }} /></li>
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
                        marginBottom: `${6 * ss}px`,
                        pageBreakInside: "avoid",
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
                            fontWeight: 700,
                            fontSize: `${0.875 * fs}rem`,
                            color: "#111827",
                          }}
                        >
                          {entry.institution}
                        </span>
                        {cv.showEntryDates !== false && (
                          <span
                            style={{
                              fontSize: `${0.6875 * fs}rem`,
                              fontWeight: 600,
                              color: accentColor,
                              whiteSpace: "nowrap",
                            }}
                          >
                            {entry.startDate &&
                              formatDate(entry.startDate, cv.dateFormat || "MM/YYYY")}
                            {entry.endDate &&
                              ` — ${formatDate(entry.endDate, cv.dateFormat || "MM/YYYY")}`}
                          </span>
                        )}
                      </div>
                      <p
                        style={{
                          margin: `${1 * ss}px 0 0`,
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
                        marginBottom: `${6 * ss}px`,
                        pageBreakInside: "avoid",
                      }}
                    >
                      <span
                        style={{
                          fontWeight: 700,
                          fontSize: `${0.875 * fs}rem`,
                          color: "#111827",
                        }}
                      >
                        {entry.name}
                      </span>
                      {entry.link && (
                        <span
                          style={{
                            fontSize: `${0.6875 * fs}rem`,
                            color: accentColor,
                            marginLeft: `${4 * ss}px`,
                          }}
                        >
                          {entry.link}
                        </span>
                      )}
                      {entry.description && (
                        <div
                          className="prose prose-sm max-w-none"
                          style={{
                            margin: `${2 * ss}px 0 0`,
                            fontSize: `${0.8125 * fs}rem`,
                            color: "#4B5563",
                          }}
                          dangerouslySetInnerHTML={{ __html: entry.description }}
                        />
                      )}
                      {entry.technologies.length > 0 && (
                        <div
                          style={{
                            display: "flex",
                            flexWrap: "wrap",
                            gap: `${3 * ss}px`,
                            marginTop: `${3 * ss}px`,
                          }}
                        >
                          {entry.technologies.map((tech) => (
                            <span
                              key={tech}
                              style={{
                                fontSize: `${0.6875 * fs}rem`,
                                fontWeight: 600,
                                color: accentColor,
                                backgroundColor: `${accentColor}12`,
                                padding: "1px 6px",
                                borderRadius: "3px",
                              }}
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}

              {section.type === "SKILLS" && (
                <div style={{ marginTop: `${2 * ss}px` }}>
                  {section.skillGroups
                    .filter((g) => g.visible !== false)
                    .sort((a, b) => a.order - b.order)
                    .map((group) => (
                      <div
                        key={group.id}
                        style={{
                          display: "flex",
                          flexWrap: "wrap",
                          gap: `${4 * ss}px`,
                          marginBottom: `${4 * ss}px`,
                        }}
                      >
                        {group.label && (
                          <span
                            style={{
                              fontWeight: 700,
                              fontSize: `${0.75 * fs}rem`,
                              color: "#111827",
                              minWidth: `${80 * ss}px`,
                            }}
                          >
                            {group.label}
                          </span>
                        )}
                        <div style={{ display: "flex", flexWrap: "wrap", gap: `${3 * ss}px` }}>
                          {group.skills.map((skill) => (
                            <span
                              key={skill}
                              style={{
                                fontSize: `${0.75 * fs}rem`,
                                fontWeight: 600,
                                color: accentColor,
                                backgroundColor: `${accentColor}10`,
                                padding: "2px 8px",
                                borderRadius: "4px",
                              }}
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
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
                        marginBottom: `${4 * ss}px`,
                        pageBreakInside: "avoid",
                      }}
                    >
                      <p
                        style={{
                          margin: 0,
                          fontSize: `${0.8125 * fs}rem`,
                          fontWeight: 700,
                          color: "#111827",
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
                        <p style={{ margin: `${1 * ss}px 0 0`, fontSize: `${0.6875 * fs}rem` }}>
                          <span onClick={(e) => { e.stopPropagation(); window.open(cert.credentialUrl, "_blank") }} style={{ color: "inherit", textDecoration: "underline", cursor: "pointer" }} role="link" tabIndex={0}>
                            {cert.credentialId || "View credential"}
                          </span>
                        </p>
                      ) : cert.credentialId ? (
                        <p style={{ margin: `${1 * ss}px 0 0`, fontSize: `${0.6875 * fs}rem`, color: "#6B7280" }}>
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
                        gap: `${8 * ss}px`,
                        marginBottom: `${2 * ss}px`,
                        fontSize: `${0.8125 * fs}rem`,
                      }}
                    >
                      <span style={{ fontWeight: 600, color: "#111827" }}>
                        {lang.name}
                      </span>
                      {lang.proficiency && (
                        <span style={{ color: accentColor, fontWeight: 600 }}>
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
                        marginBottom: `${4 * ss}px`,
                        pageBreakInside: "avoid",
                      }}
                    >
                      <p
                        style={{
                          margin: 0,
                          fontSize: `${0.8125 * fs}rem`,
                          fontWeight: 700,
                          color: "#111827",
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
                            margin: `${2 * ss}px 0 0`,
                            fontSize: `${0.8125 * fs}rem`,
                            color: "#4B5563",
                          }}
                          dangerouslySetInnerHTML={{ __html: award.description }}
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
                        marginBottom: `${4 * ss}px`,
                        pageBreakInside: "avoid",
                      }}
                    >
                      <p
                        style={{
                          margin: 0,
                          fontSize: `${0.8125 * fs}rem`,
                          fontWeight: 700,
                          color: "#111827",
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
                          {[ref.jobTitle, ref.company].filter(Boolean).join(" · ")}
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
                  marginTop: `${12 * ss}px`,
                  height: "2px",
                  backgroundColor: `${accentColor}15`,
                }}
              />
            )}
          </div>
        )
      })}

      {cv.footer && (
        <p
          style={{
            margin: `${16 * ss}px 0 0`,
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
  slug: "bold-stamp",
  name: "Bold Stamp",
  description:
    "Bold design with a large decorative initial stamp behind the name and accent-colored elements throughout",
  categories: ["creative"],
  columnLayout: "single",
  supportsPhoto: false,
  sidebarSectionTypes: [],
  isPro: false,
  popular: false,
  defaultConfig: {
    fontFamily: "sans-serif",
    accentColor: "#7c3aed",
    headingStyle: "uppercase",
    headingWeight: "bold",
    showDividers: true,
  },
}
