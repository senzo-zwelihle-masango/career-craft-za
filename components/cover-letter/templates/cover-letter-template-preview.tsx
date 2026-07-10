"use client"

// import { createDummyCoverLetter } from "@/lib/data/editor/cover-letter"
import { useMemo, createElement } from "react"
import {
  COVER_LETTER_TEMPLATES,
  getCoverLetterTemplate,
} from "../templates/registry"
import { createDummyCoverLetter } from "@/lib/data/cover-letter/templates"

const FONT_MAP: Record<string, string> = {
  serif: "Georgia, 'Times New Roman', serif",
  sans: "Inter, 'Helvetica Neue', Arial, sans-serif",
  mono: "'Courier New', Courier, monospace",
}

export function CoverLetterTemplatePreview({
  templateId,
  scale = 0.5,
  className,
}: {
  templateId: string
  scale?: number
  className?: string
}) {
  const data = useMemo(() => createDummyCoverLetter(templateId), [templateId])

  const templateInfo = COVER_LETTER_TEMPLATES.find((t) => t.id === templateId)

  const fontFamily =
    FONT_MAP[data.fontFamily || "serif"] || "Georgia, 'Times New Roman', serif"

  return (
    <div
      className={className}
      style={{
        width: `${210 * scale}mm`,
        height: `${297 * scale}mm`,
        overflow: "hidden",
      }}
    >
      <div
        style={{
          transform: `scale(${scale})`,
          transformOrigin: "top left",
          width: "210mm",
          height: "297mm",
          overflow: "hidden",
        }}
      >
        <div className="h-full bg-white text-black" style={{ fontFamily }}>
          {createElement(getCoverLetterTemplate(templateId), {
            data: {
              ...data,
              fontFamily:
                templateInfo?.id === "classic" ||
                templateInfo?.id === "editorial"
                  ? "serif"
                  : data.fontFamily,
            },
          })}
        </div>
      </div>
    </div>
  )
}
