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
  cv: CvWithRelations
}

export function SidebarInk({ cv }: SidebarInkProps) {
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

  const sidebarTypes = templateMeta.sidebarSectionTypes
  const sidebarSections = visibleSections.filter((s) =>
    sidebarTypes.includes(s.type)
  )
  const mainSections = visibleSections.filter(
    (s) => !sidebarTypes.includes(s.type)
  )

  const sidebarBg = `${accentColor}14`
  const headingTextTransform =
    cv.headingStyle === "uppercase" ? "uppercase" : "none"

  return (
    <div
      style={{
        fontFamily: fontCSS,
        fontSize: `${fs}rem`,
        lineHeight: `${1.4 * lh}`,
        color: "#1f2937",
        background: `linear-gradient(to right, ${sidebarBg} 28%, #fff 28%)`,
        maxWidth,
        margin: "0 auto",
        display: "flex",
        height: "100%",
        minHeight: `${1056 * mv}px`,
      }}
    >
      {/* Sidebar */}
      <div
        style={{
          width: "28%",
          flexShrink: 0,
          padding: `${32 * mv}px ${20 * mh}px`,
          display: "flex",
          flexDirection: "column",
          height: "100%",
        }}
      >
        {/* Decorative accent top border */}
        <div
          style={{
            width: "40px",
            height: "4px",
            backgroundColor: accentColor,
            borderRadius: "2px",
            marginBottom: `${20 * es}px`,
          }}
        />

        {/* Sidebar header info */}
        <div style={{ marginBottom: `${20 * es}px` }}>
          {pd?.photoUrl && cv.showPhoto && (
            <img
              src={pd.photoUrl}
              alt={pd?.fullName || ""}
              style={{
                width: `${72 * mv}px`,
                height: `${72 * mv}px`,
                borderRadius: "50%",
                objectFit: "cover",
                objectPosition: pd?.photoObjectPosition || "50% 50%",
                marginBottom: `${10 * es}px`,
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
                margin: `${2 * es}px 0 0`,
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
              marginTop: `${10 * es}px`,
              fontSize: `${0.625 * fs}rem`,
              color: "#6B7280",
              lineHeight: 1.6,
            }}
          >
            {pd?.email && <div>{pd.email}</div>}
            {pd?.phone && <div>{pd.phone}</div>}
            {pd?.location && <div>{pd.location}</div>}
            {getLinks(pd).length > 0 && (
              <div style={{ marginTop: `${4 * es}px` }}>
                {getLinks(pd).map((link, i) => (
                  <div key={i}>
                    {linkTypeLabels[link.type] || link.label || link.url}
                  </div>
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
              marginBottom: `${14 * es}px`,
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
                paddingBottom: `${3 * es}px`,
                borderBottom: `2px solid ${accentColor}25`,
              }}
            >
              {section.title}
            </h2>

            <div style={{ marginTop: `${5 * es}px` }}>
              {section.type === "SKILLS" && (
                <div>
                  {section.skillGroups
                    .filter((g) => g.visible !== false)
                    .sort((a, b) => a.order - b.order)
                    .map((group) => (
                      <div
                        key={group.id}
                        style={{ marginBottom: `${5 * es}px` }}
                      >
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
                            gap: `${3 * es}px`,
                            marginTop: `${2 * es}px`,
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
                        marginBottom: `${3 * es}px`,
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
                        marginBottom: `${5 * es}px`,
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
                          {formatDate(
                            cert.issueDate,
                            cv.dateFormat || "MM/YYYY"
                          )}
                          {cert.expiryDate
                            ? ` – ${formatDate(cert.expiryDate, cv.dateFormat || "MM/YYYY")}`
                            : ""}
                        </p>
                      )}
                      {cert.credentialUrl ? (
                        <p
                          style={{
                            margin: `${1 * es}px 0 0`,
                            fontSize: `${0.5625 * fs}rem`,
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
                            fontSize: `${0.5625 * fs}rem`,
                            color: "#9CA3AF",
                          }}
                        >
                          {cert.credentialId}
                        </p>
                      ) : null}
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
                        marginBottom: `${5 * es}px`,
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
                          {formatDate(award.date, cv.dateFormat || "MM/YYYY")}
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
          padding: `${32 * mv}px ${28 * mh}px`,
        }}
      >
        {mainSections.map((section, idx) => {
          const showDivider =
            cv.showDividers !== false && idx < mainSections.length - 1

          return (
            <div key={section.id} style={{ marginBottom: `${16 * es}px` }}>
              <h2
                style={{
                  margin: 0,
                  fontSize: `${0.75 * fs}rem`,
                  fontWeight: 700,
                  textTransform: headingTextTransform,
                  letterSpacing: "0.08em",
                  color: "#111827",
                  paddingBottom: `${4 * es}px`,
                  borderBottom: `1px solid #E5E7EB`,
                  marginBottom: `${6 * es}px`,
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
                              color: accentColor,
                              fontWeight: 600,
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
                              color: accentColor,
                              fontWeight: 600,
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
                            marginLeft: `${4 * mh}px`,
                          }}
                        >
                          {entry.link}
                        </span>
                      )}
                      {entry.description && (
                        <div
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
                        <div
                          style={{
                            display: "flex",
                            flexWrap: "wrap",
                            gap: `${3 * es}px`,
                            marginTop: `${3 * es}px`,
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
                        marginBottom: `${4 * es}px`,
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
              margin: `${16 * es}px 0 0`,
              fontSize: `${0.625 * fs}rem`,
              color: "#D1D5DB",
              textAlign: "center",
            }}
          >
            {cv.footer}
          </p>
        )}
      </div>
    </div>
  )
}
