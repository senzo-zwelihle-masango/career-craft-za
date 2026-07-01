import { useMemo, createElement } from "react"
import { createCurriculumVitae } from "@/lib/data/editor/curriculum-vitae"
import { getTemplate } from "./index"
import { FONT_FAMILY_MAP } from "./_base/font-map"

export function TemplatePreview({
  templateId,
  scale = 0.5,
  className,
}: {
  templateId: string
  scale?: number
  className?: string
}) {
  const cv = useMemo(() => createCurriculumVitae(templateId), [templateId])
  const fontFamily = FONT_FAMILY_MAP[cv.fontFamily]?.css || cv.fontFamily || "Inter, sans-serif"
  return (
    <div className={className} style={{ width: `${210 * scale}mm`, height: `${297 * scale}mm`, overflow: "hidden" }}>
      <div style={{ transform: `scale(${scale})`, transformOrigin: "top left", width: "210mm", height: "297mm", overflow: "hidden" }}>
        <div className="bg-white text-black h-full" style={{ fontFamily }}>
          {createElement(getTemplate(templateId), { cv })}
        </div>
      </div>
    </div>
  )
}
