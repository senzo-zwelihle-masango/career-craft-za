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

export const templateMeta: TemplateMeta = {
  slug: "sidebar-ink",
  name: "Sidebar Ink",
  description:
    "Two-column layout with a light-tint sidebar featuring a decorative accent top border",
  categories: ["creative"],
  columnLayout: "two-col-sidebar-left",
  supportsPhoto: true,
  sidebarSectionTypes: ["SKILLS", "LANGUAGES", "CERTIFICATIONS", "AWARDS"],
  isPro: false,
  popular: false,
  defaultConfig: {
    fontFamily: "sans-serif",
    accentColor: "#d97706",
    headingStyle: "uppercase",
    headingWeight: "bold",
    showDividers: true,
  },
}

interface SidebarInkProps {
  resume: CvWithRelations
}

export function SidebarInk({ resume }: SidebarInkProps) {
  const pd = resume.personalDetails
  const fs = resume.fontScale || 1
  const ss = resume.spacingScale || 1
  const pageFormat = resume.pageFormat || "A4"
  const maxWidth = pageFormat === "LETTER" ? "816px" : "794px"
  const accentColor = resume.accentColor || "#1f2937"
  const fontCSS = FONT_FAMILY_MAP[resume.fontFamily]?.css || resume.fontFamily || "Inter, sans-serif"

  const visibleSections = resume.sections
    .filter((s) => s.visible !== false)
    .sort((a, b) => a.order - b.order)

  const sidebarTypes = templateMeta.sidebarSectionTypes
  const sidebarSections = visibleSections.filter((s) => sidebarTypes.includes(s.type))
  const mainSections = visibleSections.filter((s) => !sidebarTypes.includes(s.type))

  const sidebarBg = "#faf5ff"
  const headingTextTransform =
    resume.headingStyle === "uppercase" ? "uppercase" : "none"

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
        display: "flex",
        minHeight: `${1056 * ss}px`,
      }}
    >
      {/* Sidebar */}
      <div
        style={{
          width: "28%",
          flexShrink: 0,
          backgroundColor: sidebarBg,
          padding: `${32 * ss}px ${20 * ss}px`,
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Decorative accent top border */}
        <div
          style={{
            width: "40px",
            height: "4px",
            backgroundColor: accentColor,
            borderRadius: "2px",
            marginBottom: `${20 * ss}px`,
          }}
        />

        {/* Sidebar header info */}
        <div style={{ marginBottom: `${20 * ss}px` }}>
          {pd?.photoUrl && resume.showPhoto && (
            <img
              src={pd.photoUrl}
              alt={pd?.fullName || ""}
              style={{
                width: `${72 * ss}px`,
                height: `${72 * ss}px`,
                borderRadius: "50%",
                objectFit: "cover",
                marginBottom: `${10 * ss}px`,
                border: `3px solid ${accentColor}30`,
              }}
            />
          )}
          {pd?.fullName && (
            <h1
              style={{
                margin: 0,
                fontSize: `${1.125 * fs}rem`,
                fontWeight: 700,
                color: "#111827",
                lineHeight: 1.3,
              }}
            >
              {pd.fullName}
            </h1>
          )}
          {pd?.jobTitle && (
            <p
              style={{
                margin: `${2 * ss}px 0 0`,
                fontSize: `${0.6875 * fs}rem`,
                color: accentColor,
                fontWeight: 600,
                textTransform: "uppercase",
                letterSpacing: "0.06em",
              }}
            >
              {pd.jobTitle}
            </p>
          )}
          <div
            style={{
              marginTop: `${10 * ss}px`,
              fontSize: `${0.625 * fs}rem`,
              color: "#6B7280",
              lineHeight: 1.6,
            }}
          >
            {pd?.email && <div>{pd.email}</div>}
            {pd?.phone && <div>{pd.phone}</div>}
            {pd?.location && <div>{pd.location}</div>}
            {getLinks(pd).length > 0 && (
              <div style={{ marginTop: `${4 * ss}px` }}>
                {getLinks(pd).map((link, i) => (
                  <div key={i}>{linkTypeLabels[link.type] || link.url}</div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Sidebar sections */}
        {sidebarSections.map((section) => (
          <div
            key={section.id}
            style={{
              marginBottom: `${14 * ss}px`,
            }}
          >
            <h2
              style={{
                margin: 0,
                fontSize: `${0.625 * fs}rem`,
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                color: accentColor,
                paddingBottom: `${3 * ss}px`,
                borderBottom: `2px solid ${accentColor}25`,
              }}
            >
              {section.title}
            </h2>

            <div style={{ marginTop: `${5 * ss}px` }}>
              {section.type === "SKILLS" && (
                <div>
                  {section.skillGroups
                    .filter((g) => g.visible !== false)
                    .sort((a, b) => a.order - b.order)
                    .map((group) => (
                      <div key={group.id} style={{ marginBottom: `${5 * ss}px` }}>
                        {group.label && (
                          <p
                            style={{
                              margin: 0,
                              fontSize: `${0.6875 * fs}rem`,
                              fontWeight: 600,
                              color: "#374151",
                            }}
                          >
                            {group.label}
                          </p>
                        )}
                        <div
                          style={{
                            display: "flex",
                            flexWrap: "wrap",
                            gap: `${3 * ss}px`,
                            marginTop: `${2 * ss}px`,
                          }}
                        >
                          {group.skills.map((skill) => (
                            <span
                              key={skill}
                              style={{
                                fontSize: `${0.625 * fs}rem`,
                                color: "#4B5563",
                                backgroundColor: "#ffffff",
                                padding: "2px 6px",
                                borderRadius: "3px",
                                border: `1px solid ${accentColor}20`,
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

              {section.type === "LANGUAGES" &&
                section.languageEntries
                  .slice()
                  .sort((a, b) => a.order - b.order)
                  .map((lang) => (
                    <div
                      key={lang.id}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: `${3 * ss}px`,
                        fontSize: `${0.6875 * fs}rem`,
                      }}
                    >
                      <span style={{ fontWeight: 500, color: "#374151" }}>
                        {lang.name}
                      </span>
                      {lang.proficiency && (
                        <span
                          style={{
                            color: accentColor,
                            fontWeight: 600,
                            fontSize: `${0.625 * fs}rem`,
                          }}
                        >
                          {lang.proficiency}
                        </span>
                      )}
                    </div>
                  ))}

              {section.type === "CERTIFICATIONS" &&
                section.certificationEntries
                  .slice()
                  .sort((a, b) => a.order - b.order)
                  .map((cert) => (
                    <div
                      key={cert.id}
                      style={{
                        marginBottom: `${5 * ss}px`,
                        pageBreakInside: "avoid",
                      }}
                    >
                      <p
                        style={{
                          margin: 0,
                          fontSize: `${0.6875 * fs}rem`,
                          fontWeight: 600,
                          color: "#374151",
                        }}
                      >
                        {cert.name}
                      </p>
                      {cert.issuer && (
                        <p
                          style={{
                            margin: 0,
                            fontSize: `${0.625 * fs}rem`,
                            color: "#6B7280",
                          }}
                        >
                          {cert.issuer}
                        </p>
                      )}
                      {cert.issueDate && (
                        <p
                          style={{
                            margin: 0,
                            fontSize: `${0.5625 * fs}rem`,
                            color: "#9CA3AF",
                          }}
                        >
                          {formatDate(cert.issueDate, resume.dateFormat || "MM/YYYY")}
                          {cert.expiryDate
                            ? ` — ${formatDate(cert.expiryDate, resume.dateFormat || "MM/YYYY")}`
                            : ""}
                        </p>
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
                        marginBottom: `${5 * ss}px`,
                        pageBreakInside: "avoid",
                      }}
                    >
                      <p
                        style={{
                          margin: 0,
                          fontSize: `${0.6875 * fs}rem`,
                          fontWeight: 600,
                          color: "#374151",
                        }}
                      >
                        {award.title}
                      </p>
                      {award.issuer && (
                        <p
                          style={{
                            margin: 0,
                            fontSize: `${0.625 * fs}rem`,
                            color: "#6B7280",
                          }}
                        >
                          {award.issuer}
                        </p>
                      )}
                      {award.date && (
                        <p
                          style={{
                            margin: 0,
                            fontSize: `${0.5625 * fs}rem`,
                            color: "#9CA3AF",
                          }}
                        >
                          {formatDate(award.date, resume.dateFormat || "MM/YYYY")}
                        </p>
                      )}
                    </div>
                  ))}

              {section.type === "CUSTOM" && section.content && (
                <div
                  className="prose prose-sm max-w-none"
                  style={{
                    margin: 0,
                    fontSize: `${0.6875 * fs}rem`,
                    color: "#4B5563",
                    whiteSpace: "pre-wrap",
                  }}
                  dangerouslySetInnerHTML={{ __html: section.content }}
                />
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Main content */}
      <div
        style={{
          flex: 1,
          padding: `${32 * ss}px ${28 * ss}px`,
        }}
      >
        {mainSections.map((section, idx) => {
          const showDivider =
            resume.showDividers !== false && idx < mainSections.length - 1

          return (
            <div key={section.id} style={{ marginBottom: `${16 * ss}px` }}>
              <h2
                style={{
                  margin: 0,
                  fontSize: `${0.75 * fs}rem`,
                  fontWeight: 700,
                  textTransform: headingTextTransform,
                  letterSpacing: "0.08em",
                  color: "#111827",
                  paddingBottom: `${4 * ss}px`,
                  borderBottom: `1px solid #E5E7EB`,
                  marginBottom: `${6 * ss}px`,
                }}
              >
                {section.title}
              </h2>

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
                        {resume.showEntryDates !== false && (
                          <span
                            style={{
                              fontSize: `${0.6875 * fs}rem`,
                              color: accentColor,
                              fontWeight: 600,
                              whiteSpace: "nowrap",
                            }}
                          >
                            {formatDate(entry.startDate, resume.dateFormat || "MM/YYYY")}
                            {" — "}
                            {entry.current
                              ? "Present"
                              : entry.endDate
                                ? formatDate(entry.endDate, resume.dateFormat || "MM/YYYY")
                                : ""}
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
                        {entry.company}
                        {resume.showEntryLocation !== false && entry.location
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
                      {resume.entryStyle !== "paragraph" &&
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
                        {resume.showEntryDates !== false && (
                          <span
                            style={{
                              fontSize: `${0.6875 * fs}rem`,
                              color: accentColor,
                              fontWeight: 600,
                              whiteSpace: "nowrap",
                            }}
                          >
                            {entry.startDate &&
                              formatDate(entry.startDate, resume.dateFormat || "MM/YYYY")}
                            {entry.endDate &&
                              ` — ${formatDate(entry.endDate, resume.dateFormat || "MM/YYYY")}`}
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
                        {resume.showEntryLocation !== false && entry.location
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
                                fontSize: `${0.625 * fs}rem`,
                                color: "#6B7280",
                                backgroundColor: "#F9FAFB",
                                padding: "1px 6px",
                                borderRadius: "3px",
                                border: `1px solid #E5E7EB`,
                              }}
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
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
                          fontWeight: 600,
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

              {showDivider && (
                <div
                  style={{
                    marginTop: `${12 * ss}px`,
                    height: "1px",
                    backgroundColor: "#F3F4F6",
                  }}
                />
              )}
            </div>
          )
        })}

        {resume.footer && (
          <p
            style={{
              margin: `${16 * ss}px 0 0`,
              fontSize: `${0.625 * fs}rem`,
              color: "#D1D5DB",
              textAlign: "center",
            }}
          >
            {resume.footer}
          </p>
        )}
      </div>
    </div>
  )
}
