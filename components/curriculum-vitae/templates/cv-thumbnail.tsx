"use client"

import { createElement } from "react"
import { ResponsiveThumbnail } from "./_base/responsive-thumbnail"
import { getTemplate } from "./index"
import type { CvWithRelations } from "@/types/curriculum-vitae/types"

export function CvThumbnail({
  cv,
  className,
}: {
  cv: CvWithRelations
  className?: string
}) {
  return (
    <ResponsiveThumbnail className={className}>
      <div
        className="h-full bg-white text-black"
        style={{ fontFamily: cv.fontFamily }}
      >
        {createElement(getTemplate(cv.templateId), { cv })}
      </div>
    </ResponsiveThumbnail>
  )
}
