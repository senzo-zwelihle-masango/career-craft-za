"use client"

import { createElement } from "react"
import { getCoverLetterTemplate } from "../templates/registry"
import { ResponsiveThumbnail } from "../templates/_base/responsive-thumbnail"


const FONT_MAP: Record<string, string> = {
  serif: "Georgia, 'Times New Roman', serif",
  sans: "'Inter', 'Segoe UI', sans-serif",
  mono: "'Courier New', 'Consolas', monospace",
}

interface CoverLetterThumbnailProps {
  data: {
    fullName: string
    professionalTitle: string
    email: string
    phone: string
    location: string
    date: string
    recipientName: string | null
    companyName: string | null
    body: string
    fontFamily: string
    templateId: string
    accentColor?: string | null
  }
  className?: string
}

export function CoverLetterThumbnail({
  data,
  className,
}: CoverLetterThumbnailProps) {
  const font = FONT_MAP[data.fontFamily] || FONT_MAP.serif

  const templateData = {
    ...data,
    recipientName: data.recipientName ?? undefined,
    companyName: data.companyName ?? undefined,
    accentColor: data.accentColor || null,
  }

  return (
    <ResponsiveThumbnail className={className}>
      <div className="bg-white text-black h-full" style={{ fontFamily: font }}>
        {createElement(getCoverLetterTemplate(data.templateId), { data: templateData })}
      </div>
    </ResponsiveThumbnail>
  )
}
