"use client"

import { createElement } from "react"
import { useEditorStore } from "@/lib/data/editor/store"
import { getTemplate } from "./index"
import { FONT_FAMILY_MAP } from "./_base/font-map"
import type { CvWithRelations } from "@/lib/data/editor/types"

export function CvPreview({ resume: propResume }: { resume?: CvWithRelations } = {}) {
  const storeResume = useEditorStore((s) => s.cv)
  const resume = propResume ?? storeResume
  if (!resume) return null

  const fontFamily = FONT_FAMILY_MAP[resume.fontFamily]?.css || resume.fontFamily || "Inter, sans-serif"
  const fs = resume.fontScale || 1

  return (
    <div className="bg-white text-black h-full resume-scale-root" style={{ fontFamily }}>
      <style>{`
        .cv-scale-root .text-\\[10px\\] { font-size: ${(0.625 * fs).toFixed(4)}rem !important; }
        .cv-scale-root .text-\\[11px\\] { font-size: ${(0.6875 * fs).toFixed(4)}rem !important; }
        .cv-scale-root .text-\\[9px\\] { font-size: ${(0.5625 * fs).toFixed(4)}rem !important; }
        .cv-scale-root .text-\\[8px\\] { font-size: ${(0.5 * fs).toFixed(4)}rem !important; }
        .cv-scale-root .text-xs { font-size: ${(0.75 * fs).toFixed(4)}rem !important; }
        .cv-scale-root .text-sm { font-size: ${(0.875 * fs).toFixed(4)}rem !important; }
        .cv-scale-root .text-base { font-size: ${(1 * fs).toFixed(4)}rem !important; }
        .cv-scale-root .text-lg { font-size: ${(1.125 * fs).toFixed(4)}rem !important; }
        .cv-scale-root .text-xl { font-size: ${(1.25 * fs).toFixed(4)}rem !important; }
        .cv-scale-root .text-2xl { font-size: ${(1.5 * fs).toFixed(4)}rem !important; }
        .cv-scale-root .text-3xl { font-size: ${(1.875 * fs).toFixed(4)}rem !important; }
        .resume-scale-root ul { list-style-type: disc; padding-left: 1.5em; }
        .resume-scale-root ol { list-style-type: decimal; padding-left: 1.5em; }
        .resume-scale-root li { display: list-item; }
      `}</style>
      {createElement(getTemplate(resume.templateId), { resume })}
    </div>
  )
}
