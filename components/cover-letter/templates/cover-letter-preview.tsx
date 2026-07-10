"use client"

import { createElement } from "react"
import { cn } from "@/lib/utils"
import { getCoverLetterTemplate } from "../templates/registry"

interface CoverLetterPreviewProps {
  fullName?: string
  professionalTitle?: string
  email?: string
  phone?: string
  location?: string
  date?: string
  recipientName?: string
  companyName?: string
  body?: string
  fontFamily?: string
  templateId?: string
  accentColor?: string | null
  className?: string
}

const FONT_MAP: Record<string, string> = {
  serif: "Georgia, 'Times New Roman', serif",
  sans: "'Inter', 'Segoe UI', sans-serif",
  mono: "'Courier New', 'Consolas', monospace",
}

export function CoverLetterPreview({
  fullName,
  professionalTitle,
  email,
  phone,
  location,
  date,
  recipientName,
  companyName,
  body,
  fontFamily = "serif",
  templateId = "classic",
  accentColor,
  className,
}: CoverLetterPreviewProps) {
  const font = FONT_MAP[fontFamily] || FONT_MAP.serif

  return (
    <div
      className={cn(
        "mx-auto min-h-[297mm] w-full max-w-[210mm] bg-white shadow-sm",
        className
      )}
    >
      <div style={{ fontFamily: font, minHeight: "100%" }} className="h-full">
        {createElement(getCoverLetterTemplate(templateId), {
          data: {
            fullName,
            professionalTitle,
            email,
            phone,
            location,
            date,
            recipientName,
            companyName,
            body,
            fontFamily,
            accentColor,
          },
        })}
      </div>
    </div>
  )
}
