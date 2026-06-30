import { BulletList } from "./BulletList"

interface EntryItemProps {
  title: string
  subtitle?: string | null
  meta?: string | null
  description?: string | null
  bullets?: string[]
  children?: React.ReactNode
  entryStyle?: string
}

export function EntryItem({
  title,
  subtitle,
  meta,
  description,
  bullets,
  children,
  entryStyle = "bullet",
}: EntryItemProps) {
  return (
    <article style={{ pageBreakInside: "avoid", marginBottom: 10 }}>
      <h3 style={{ margin: 0, fontSize: "1em", fontWeight: 700 }}>{title}</h3>
      {subtitle && (
        <p style={{ margin: "1px 0 0", fontSize: "0.875em", color: "#374151" }}>
          {subtitle}
        </p>
      )}
      {meta && (
        <p style={{ margin: "1px 0 0", fontSize: "0.75em", color: "#6B7280" }}>
          {meta}
        </p>
      )}
      {description && (
        <div
          className="prose prose-sm max-w-none"
          style={{ marginTop: 4 }}
          dangerouslySetInnerHTML={{ __html: description }}
        />
      )}
      {bullets && bullets.length > 0 && entryStyle !== "paragraph" && (
        <BulletList bullets={bullets} />
      )}
      {children}
    </article>
  )
}
