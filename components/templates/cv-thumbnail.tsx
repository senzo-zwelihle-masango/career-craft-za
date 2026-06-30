"use client"

import { createElement } from "react"
import { ResponsiveThumbnail } from "./_base/responsive-thumbnail"
import { getTemplate } from "./index"
import type { CvWithRelations } from "@/lib/data/editor/types"

export function CvThumbnail({
  resume,
  className,
}: {
  resume: CvWithRelations
  className?: string
}) {
  return (
    <ResponsiveThumbnail className={className}>
      <div className="bg-white text-black h-full" style={{ fontFamily: resume.fontFamily }}>
        {createElement(getTemplate(resume.templateId), { resume })}
      </div>
    </ResponsiveThumbnail>
  )
}
