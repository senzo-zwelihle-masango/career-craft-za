import { SectionIcon } from "./SectionIcon"

interface SectionHeadingProps {
  title: string
  headingStyle?: string
  headingWeight?: string
  showSectionIcons?: boolean
  accentColor?: string
  iconName?: string
  className?: string
}

export function SectionHeading({
  title,
  headingStyle = "normal",
  headingWeight = "bold",
  showSectionIcons = false,
  accentColor,
  iconName,
  className = "",
}: SectionHeadingProps) {
  const textTransform = headingStyle === "uppercase" ? "uppercase" : "none"
  const fontWeight = headingWeight === "bold" ? 700 : headingWeight === "medium" ? 500 : 400

  return (
    <h2
      className={className}
      style={{
        textTransform,
        fontWeight,
        letterSpacing: textTransform === "uppercase" ? "0.05em" : "normal",
        margin: 0,
        color: accentColor,
      }}
    >
      {showSectionIcons && iconName ? (
        <span style={{ marginRight: 6, display: "inline-flex", verticalAlign: "middle" }}>
          <SectionIcon sectionType={iconName} size="1em" />
        </span>
      ) : null}
      {title}
    </h2>
  )
}
