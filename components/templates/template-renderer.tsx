"use client"

import { useMemo, memo } from "react"
import { createCurriculumVitae } from "@/lib/data/editor/curriculum-vitae"
import { getTemplate } from "@/components/templates"
import { FONT_FAMILY_MAP } from "@/components/templates/_base/font-map"
import type { CvWithRelations } from "@/lib/data/editor/types"

const A4_W = 210
const A4_H = 297

interface TemplateRendererProps {
  templateId: string
  /** Scale relative to A4 — e.g. 0.5 = half-letter size in mm. Default 0.5. */
  scale?: number
  /** pixel width. Overrides scale. Height auto-calculates from A4 ratio if not provided. */
  width?: number
  /** pixel height. Only used with width. */
  height?: number
  /** Optional real resume data; falls back to dummy */
  resume?: CvWithRelations
  className?: string
  style?: React.CSSProperties
}

export const TemplateRenderer = memo(function TemplateRenderer({
  templateId,
  scale = 0.5,
  width,
  height,
  resume: customResume,
  className,
  style,
}: TemplateRendererProps) {
  const cachedResume = useMemo(
    () => customResume ?? createCurriculumVitae(templateId),
    [templateId, customResume],
  )
  const Template = getTemplate(templateId)

  const fontFamily =
    FONT_FAMILY_MAP[cachedResume.fontFamily]?.css ||
    cachedResume.fontFamily ||
    "Inter, sans-serif"

  // — Scale mode: container in mm —
  if (width === undefined) {
    const cw = A4_W * scale
    const ch = A4_H * scale
    return (
      <div
        className={className}
        style={{ width: `${cw}mm`, height: `${ch}mm`, overflow: "hidden", ...style }}
      >
        <div
          style={{
            transform: `scale(${scale})`,
            transformOrigin: "top left",
            width: `${A4_W}mm`,
            height: `${A4_H}mm`,
            overflow: "hidden",
          }}
        >
          <div className="bg-white text-black h-full" style={{ fontFamily }}>
            <Template resume={cachedResume} />
          </div>
        </div>
      </div>
    )
  }

  // — Pixel mode: container in px —
  const innerS = width / A4_W
  const ph = height ?? A4_H * innerS
  return (
    <div
      className={className}
      style={{ width, height: ph, overflow: "hidden", ...style }}
    >
      <div
        style={{
          transform: `scale(${innerS})`,
          transformOrigin: "top left",
          width: `${A4_W}mm`,
          height: `${A4_H}mm`,
          overflow: "hidden",
        }}
      >
        <div className="bg-white text-black h-full" style={{ fontFamily }}>
          <Template resume={cachedResume} />
        </div>
      </div>
    </div>
  )
})
