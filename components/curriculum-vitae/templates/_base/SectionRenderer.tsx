import type { CvWithRelations } from "@/types/curriculum-vitae/types"
import { formatDate } from "@/lib/utils"
import { SectionHeading } from "./SectionHeading"
import { EntryItem } from "./EntryItem"
import { getLinks, linkTypeLabels } from "./getLinks"

interface SectionRendererProps {
  section: CvWithRelations["sections"][0]
  cv: CvWithRelations
  showDividers?: boolean
  entryStyle?: string
  showEntryDates?: boolean
  showEntryLocation?: boolean
  accentColor?: string
  showSectionIcons?: boolean
  headingStyle?: string
  headingWeight?: string
  noHeading?: boolean
}

export function SectionRenderer({
  section,
  cv,
  showDividers = true,
  entryStyle = "bullet",
  showEntryDates = true,
  showEntryLocation = true,
  accentColor,
  showSectionIcons = false,
  headingStyle = "normal",
  headingWeight = "bold",
  noHeading = false,
}: SectionRendererProps) {
  if (!section.visible) return null
  const dateFormat = cv.dateFormat || "MM/YYYY"

  const renderSectionHeading = () => {
    if (noHeading) return null
    return (
      <SectionHeading
        title={section.title}
        headingStyle={headingStyle}
        headingWeight={headingWeight}
        showSectionIcons={showSectionIcons}
        accentColor={accentColor}
        iconName={section.type}
      />
    )
  }

  const renderDivider = () => {
    if (!showDividers) return null
    return (
      <hr
        style={{
          border: "none",
          borderTop: "1px solid #D1D5DB",
          margin: "8px 0",
        }}
      />
    )
  }

  if (section.type === "SUMMARY") {
    if (!section.content) return null
    return (
      <div>
        {renderSectionHeading()}
        <div
          className="prose prose-sm max-w-none"
          style={{ margin: "4px 0 0" }}
          dangerouslySetInnerHTML={{ __html: section.content }}
        />
        {renderDivider()}
      </div>
    )
  }

  if (section.type === "EXPERIENCE") {
    if (section.experienceEntries.length === 0) return null
    return (
      <div>
        {renderSectionHeading()}
        <div style={{ marginTop: 4 }}>
          {section.experienceEntries
            .slice()
            .sort((a, b) => a.order - b.order)
            .map((entry) => {
              const metaParts: string[] = []
              if (showEntryDates) {
                metaParts.push(
                  formatDate(entry.startDate, dateFormat) +
                    " – " +
                    (entry.current
                      ? "Present"
                      : entry.endDate
                        ? formatDate(entry.endDate, dateFormat)
                        : "")
                )
              }
              return (
                <EntryItem
                  key={entry.id}
                  title={entry.role}
                  subtitle={
                    entry.company +
                    (entry.location && showEntryLocation
                      ? ` · ${entry.location}`
                      : "")
                  }
                  meta={
                    metaParts.length > 0 ? metaParts.join(" | ") : undefined
                  }
                  description={entry.description || undefined}
                  bullets={entry.bullets}
                  entryStyle={entryStyle}
                />
              )
            })}
        </div>
        {renderDivider()}
      </div>
    )
  }

  if (section.type === "EDUCATION") {
    if (section.educationEntries.length === 0) return null
    return (
      <div>
        {renderSectionHeading()}
        <div style={{ marginTop: 4 }}>
          {section.educationEntries
            .slice()
            .sort((a, b) => a.order - b.order)
            .map((entry) => {
              const metaParts: string[] = []
              if (showEntryDates) {
                const sd = entry.startDate
                  ? formatDate(entry.startDate, dateFormat)
                  : ""
                const ed = entry.endDate
                  ? formatDate(entry.endDate, dateFormat)
                  : ""
                if (sd || ed)
                  metaParts.push(sd && ed ? `${sd} – ${ed}` : sd || ed)
              }
              return (
                <EntryItem
                  key={entry.id}
                  title={entry.degree}
                  subtitle={
                    entry.institution +
                    (entry.location && showEntryLocation
                      ? ` · ${entry.location}`
                      : "")
                  }
                  meta={
                    metaParts.length > 0 ? metaParts.join(" | ") : undefined
                  }
                />
              )
            })}
        </div>
        {renderDivider()}
      </div>
    )
  }

  if (section.type === "PROJECTS") {
    if (section.projectEntries.length === 0) return null
    return (
      <div>
        {renderSectionHeading()}
        <div style={{ marginTop: 4 }}>
          {section.projectEntries
            .slice()
            .sort((a, b) => a.order - b.order)
            .map((entry) => {
              const metaParts: string[] = []
              if (entry.link) metaParts.push(entry.link)
              return (
                <EntryItem
                  key={entry.id}
                  title={entry.name}
                  meta={
                    metaParts.length > 0 ? metaParts.join(" | ") : undefined
                  }
                  description={entry.description || undefined}
                  entryStyle={entryStyle}
                >
                  {entry.technologies && entry.technologies.length > 0 && (
                    <p
                      style={{
                        margin: "2px 0 0",
                        fontSize: "0.75em",
                        color: "#6B7280",
                      }}
                    >
                      {entry.technologies.join(", ")}
                    </p>
                  )}
                </EntryItem>
              )
            })}
        </div>
        {renderDivider()}
      </div>
    )
  }

  if (section.type === "SKILLS") {
    const groups = section.skillGroups.filter((g) => g.visible !== false)
    if (groups.length === 0) return null
    return (
      <div>
        {renderSectionHeading()}
        <div style={{ marginTop: 4 }}>
          {groups
            .slice()
            .sort((a, b) => a.order - b.order)
            .map((group) => (
              <div key={group.id} style={{ marginBottom: 4 }}>
                <span style={{ fontWeight: 600, fontSize: "0.8125em" }}>
                  {group.label}:{" "}
                </span>
                <span style={{ fontSize: "0.8125em", color: "#374151" }}>
                  {group.skills.join(", ")}
                </span>
              </div>
            ))}
        </div>
        {renderDivider()}
      </div>
    )
  }

  if (section.type === "CERTIFICATIONS") {
    if (section.certificationEntries.length === 0) return null
    return (
      <div>
        {renderSectionHeading()}
        <div style={{ marginTop: 4 }}>
          {section.certificationEntries
            .slice()
            .sort((a, b) => a.order - b.order)
            .map((entry) => {
              const metaParts: string[] = []
              if (entry.issuer) metaParts.push(entry.issuer)
              if (entry.issueDate)
                metaParts.push(formatDate(entry.issueDate, dateFormat))
              return (
                <EntryItem
                  key={entry.id}
                  title={entry.name}
                  meta={
                    metaParts.length > 0 ? metaParts.join(" | ") : undefined
                  }
                >
                  {entry.credentialUrl ? (
                    <p style={{ margin: "2px 0 0", fontSize: "0.75em" }}>
                      <span
                        onClick={(e) => {
                          e.stopPropagation()
                          window.open(entry.credentialUrl!, "_blank")
                        }}
                        style={{
                          color: "inherit",
                          textDecoration: "underline",
                          cursor: "pointer",
                        }}
                        role="link"
                        tabIndex={0}
                      >
                        {entry.credentialId || "View credential"}
                      </span>
                    </p>
                  ) : entry.credentialId ? (
                    <p
                      style={{
                        margin: "2px 0 0",
                        fontSize: "0.75em",
                        color: "#6B7280",
                      }}
                    >
                      {entry.credentialId}
                    </p>
                  ) : null}
                  {entry.expiryDate && (
                    <p
                      style={{
                        margin: "2px 0 0",
                        fontSize: "0.75em",
                        color: "#6B7280",
                      }}
                    >
                      Expires: {formatDate(entry.expiryDate, dateFormat)}
                    </p>
                  )}
                </EntryItem>
              )
            })}
        </div>
        {renderDivider()}
      </div>
    )
  }

  if (section.type === "LANGUAGES") {
    if (section.languageEntries.length === 0) return null
    return (
      <div>
        {renderSectionHeading()}
        <div style={{ marginTop: 4 }}>
          {section.languageEntries
            .slice()
            .sort((a, b) => a.order - b.order)
            .map((entry) => (
              <p
                key={entry.id}
                style={{ margin: "2px 0", fontSize: "0.8125em" }}
              >
                {entry.name}
                {entry.proficiency ? ` – ${entry.proficiency}` : ""}
              </p>
            ))}
        </div>
        {renderDivider()}
      </div>
    )
  }

  if (section.type === "AWARDS") {
    if (section.awardEntries.length === 0) return null
    return (
      <div>
        {renderSectionHeading()}
        <div style={{ marginTop: 4 }}>
          {section.awardEntries
            .slice()
            .sort((a, b) => a.order - b.order)
            .map((entry) => {
              const metaParts: string[] = []
              if (entry.issuer) metaParts.push(entry.issuer)
              if (entry.date) metaParts.push(formatDate(entry.date, dateFormat))
              return (
                <EntryItem
                  key={entry.id}
                  title={entry.title}
                  meta={
                    metaParts.length > 0 ? metaParts.join(" | ") : undefined
                  }
                  description={entry.description || undefined}
                  entryStyle={entryStyle}
                />
              )
            })}
        </div>
        {renderDivider()}
      </div>
    )
  }

  if (section.type === "REFERENCES") {
    if (section.referenceEntries.length === 0) return null
    return (
      <div>
        {renderSectionHeading()}
        <div style={{ marginTop: 4 }}>
          {section.referenceEntries
            .slice()
            .sort((a, b) => a.order - b.order)
            .map((entry) => (
              <div key={entry.id} style={{ marginBottom: 6 }}>
                <h3 style={{ margin: 0, fontSize: "0.875em", fontWeight: 600 }}>
                  {entry.name}
                </h3>
                {(entry.jobTitle || entry.company) && (
                  <p
                    style={{
                      margin: "1px 0 0",
                      fontSize: "0.8125em",
                      color: "#374151",
                    }}
                  >
                    {[entry.jobTitle, entry.company]
                      .filter(Boolean)
                      .join(" · ")}
                  </p>
                )}
                {(entry.email || entry.phone) && (
                  <p
                    style={{
                      margin: "1px 0 0",
                      fontSize: "0.75em",
                      color: "#6B7280",
                    }}
                  >
                    {[entry.email, entry.phone].filter(Boolean).join(" · ")}
                  </p>
                )}
              </div>
            ))}
        </div>
        {renderDivider()}
      </div>
    )
  }

  if (section.type === "CUSTOM") {
    if (!section.content) return null
    return (
      <div>
        {renderSectionHeading()}
        <div
          className="prose prose-sm max-w-none"
          style={{ margin: "4px 0 0" }}
          dangerouslySetInnerHTML={{ __html: section.content }}
        />
        {renderDivider()}
      </div>
    )
  }

  return null
}
