import { getLinks, linkTypeLabels } from "./getLinks"
import type {
  PersonalDetails,
  CurriculumVitae,
} from "@/lib/generated/prisma/client"

function formatDateForHeader(dateStr: string, format: string): string {
  if (!dateStr) return ""
  const p = dateStr.split("/")
  if (p.length !== 2) return dateStr
  const m = parseInt(p[0], 10)
  const y = p[1]
  if (isNaN(m)) return dateStr
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ]
  const short = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ]
  switch (format) {
    case "MMM YYYY":
      return `${short[m - 1] || m} ${y}`
    case "MMMM YYYY":
      return `${months[m - 1] || m} ${y}`
    case "YYYY-MM":
      return `${y}-${String(m).padStart(2, "0")}`
    default:
      return `${String(m).padStart(2, "0")}/${y}`
  }
}

interface CvHeaderProps {
  pd: PersonalDetails | null
  cv: { showPhoto?: boolean; dateFormat?: string; headerLayout?: string }
  className?: string
  nameStyle?: React.CSSProperties
  contactStyle?: React.CSSProperties
  showNationality?: boolean
  renderPhoto?: boolean
  photoSize?: number
}

export function CvHeader({
  pd,
  cv,
  className = "",
  nameStyle,
  contactStyle,
  showNationality = true,
  renderPhoto = false,
  photoSize = 80,
}: CvHeaderProps) {
  const links = getLinks(pd)
  const layout = cv.headerLayout || "stacked"

  const contactParts: string[] = []
  if (pd?.email) contactParts.push(pd.email)
  if (pd?.phone) contactParts.push(pd.phone)
  if (pd?.location) contactParts.push(pd.location)
  if (showNationality && pd?.nationality) contactParts.push(pd.nationality)

  const photoUrl =
    renderPhoto && cv.showPhoto && pd?.photoUrl ? pd.photoUrl : null

  const photoMarkup = photoUrl ? (
    <img
      src={photoUrl}
      alt=""
      className="rounded object-cover"
      style={{ width: photoSize, height: photoSize * 1.25, objectPosition: pd?.photoObjectPosition || "50% 50%" }}
    />
  ) : null

  if (layout === "inline") {
    return (
      <div className={className}>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          {photoMarkup && <div style={{ flexShrink: 0 }}>{photoMarkup}</div>}
          <div style={{ flex: 1 }}>
            {pd?.fullName && (
              <h1 style={{ margin: 0, ...nameStyle }}>{pd.fullName}</h1>
            )}
            {pd?.jobTitle && (
              <p
                style={{
                  margin: "2px 0 0",
                  fontSize: "0.875rem",
                  ...contactStyle,
                }}
              >
                {pd.jobTitle}
              </p>
            )}
          </div>
          {contactParts.length > 0 && (
            <div
              style={{
                textAlign: "right",
                fontSize: "0.75rem",
                lineHeight: 1.5,
                ...contactStyle,
              }}
            >
              {contactParts.map((part, i) => (
                <div key={i}>{part}</div>
              ))}
              {links.map((link, i) => (
                <div key={`link-${i}`}>
                  {linkTypeLabels[link.type] || link.label || link.url}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    )
  }

  if (layout === "compact") {
    return (
      <div className={className}>
        <div
          style={{
            display: "flex",
            alignItems: "baseline",
            gap: 8,
            flexWrap: "wrap",
          }}
        >
          {photoMarkup && <div style={{ flexShrink: 0 }}>{photoMarkup}</div>}
          {pd?.fullName && (
            <h1 style={{ margin: 0, ...nameStyle }}>{pd.fullName}</h1>
          )}
          {pd?.jobTitle && (
            <span
              style={{
                fontSize: "0.875rem",
                color: "#6B7280",
                ...contactStyle,
              }}
            >
              {pd.jobTitle}
            </span>
          )}
          <span style={{ flex: 1 }} />
          <span
            style={{ fontSize: "0.75rem", color: "#6B7280", ...contactStyle }}
          >
            {contactParts.join(" · ")}
          </span>
        </div>
      </div>
    )
  }

  // stacked (default)
  return (
    <div className={className}>
      {photoMarkup && <div style={{ marginBottom: 8 }}>{photoMarkup}</div>}
      {pd?.fullName && (
        <h1 style={{ margin: 0, ...nameStyle }}>{pd.fullName}</h1>
      )}
      {pd?.jobTitle && (
        <p
          style={{
            margin: "4px 0 0",
            fontSize: "0.875rem",
            color: "#6B7280",
            ...contactStyle,
          }}
        >
          {pd.jobTitle}
        </p>
      )}
      {contactParts.length > 0 && (
        <p
          style={{
            margin: "6px 0 0",
            fontSize: "0.75rem",
            color: "#6B7280",
            lineHeight: 1.5,
            ...contactStyle,
          }}
        >
          {contactParts.join(" · ")}
        </p>
      )}
      {links.length > 0 && (
        <p
          style={{
            margin: "4px 0 0",
            fontSize: "0.75rem",
            color: "#6B7280",
            lineHeight: 1.5,
            ...contactStyle,
          }}
        >
          {links.map((link, i) => (
            <span key={i}>
              {i > 0 && " · "}
              {linkTypeLabels[link.type] || link.label || link.url}
            </span>
          ))}
        </p>
      )}
    </div>
  )
}
