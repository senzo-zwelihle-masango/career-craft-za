"use client"

import { useCallback } from "react"
import { toast } from "sonner"
import { useEditorStore } from "@/lib/data/editor/store"

export function useDownloadActions(title: string, cvId: string) {
  const safeTitle = title.replace(/\s+/g, "_")

  const downloadPdf = useCallback(async () => {
    const popup = window.open("", "_blank")
    if (!popup) {
      toast.error("Please allow popups to download PDF")
      return
    }
    toast.loading("Generating PDF...")
    try {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 8000)
      const res = await fetch(`/api/pdf/curriculum-vitae/${cvId}`, {
        signal: controller.signal,
      })
      clearTimeout(timeoutId)
      if (!res.ok) throw new Error("Failed")
      const contentType = res.headers.get("content-type") ?? ""
      if (!contentType.includes("application/pdf")) throw new Error("PDF generation failed")
      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      const a = window.document.createElement("a")
      a.href = url
      a.download = `${safeTitle}.pdf`
      a.click()
      URL.revokeObjectURL(url)
      popup.close()
      toast.dismiss()
      toast.success("CV successfully downloaded")
    } catch {
      toast.dismiss()
      toast.loading("Opening print dialog...")
      popup.location.href = `/api/pdf/curriculum-vitae/${cvId}/html?print=1`
      toast.dismiss()
    }
  }, [cvId, safeTitle])

  const downloadJson = useCallback(async () => {
    const state = useEditorStore.getState()
    const json = JSON.stringify(state.cv, null, 2)
    const blob = new Blob([json], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = window.document.createElement("a")
    a.href = url
    a.download = `${safeTitle}.json`
    a.click()
    URL.revokeObjectURL(url)
    toast.success("JSON exported")
  }, [safeTitle])

  const downloadDocx = useCallback(async () => {
    toast.loading("Generating DOCX...")
    try {
      const { Document, Packer, Paragraph, TextRun, HeadingLevel } = await import("docx")
      const state = useEditorStore.getState()
      const r = state.cv
      if (!r) { toast.dismiss(); return }

      const children: any[] = []
      const pd = r.personalDetails

      if (pd?.fullName) {
        children.push(new Paragraph({ text: pd.fullName, heading: HeadingLevel.TITLE }))
      }
      if (pd?.jobTitle) {
        children.push(new Paragraph({ text: pd.jobTitle, spacing: { after: 200 } }))
      }
      if (pd?.email || pd?.phone) {
        children.push(new Paragraph({ text: [pd.email, pd.phone].filter(Boolean).join(" | "), spacing: { after: 200 } }))
      }

      for (const section of [...r.sections].sort((a, b) => a.order - b.order)) {
        if (!section.visible) continue
        children.push(new Paragraph({ text: section.title.toUpperCase(), heading: HeadingLevel.HEADING_1 }))

        if (section.content) {
          children.push(new Paragraph({ text: section.content, spacing: { after: 200 } }))
        }

        for (const exp of section.experienceEntries) {
          const bullets = exp.bullets?.map((b: string) => new Paragraph({ text: `\u2022 ${b}`, spacing: { after: 60 } })) || []
          children.push(new Paragraph({ text: `${exp.role} at ${exp.company}`, heading: HeadingLevel.HEADING_2 }))
          children.push(new Paragraph({ text: `${exp.startDate} - ${exp.endDate || "Present"}`, spacing: { after: 100 } }))
          children.push(...bullets)
        }

        for (const edu of section.educationEntries) {
          children.push(new Paragraph({ text: `${edu.degree} \u2014 ${edu.institution}`, spacing: { after: 100 } }))
          children.push(new Paragraph({ text: `${edu.startDate} - ${edu.endDate}`, spacing: { after: 200 } }))
        }

        for (const proj of section.projectEntries) {
          children.push(new Paragraph({ text: proj.name, heading: HeadingLevel.HEADING_2 }))
          if (proj.technologies?.length) {
            children.push(new Paragraph({ text: proj.technologies.join(", "), spacing: { after: 60 } }))
          }
        }

        for (const skill of section.skillGroups) {
          children.push(new Paragraph({ text: `${skill.label}: ${skill.skills.join(", ")}`, spacing: { after: 100 } }))
        }
      }

      const doc = new Document({ sections: [{ children }] })
      const blob = await Packer.toBlob(doc)
      const url = URL.createObjectURL(blob)
      const a = window.document.createElement("a")
      a.href = url
      a.download = `${safeTitle}.docx`
      a.click()
      URL.revokeObjectURL(url)
      toast.dismiss()
      toast.success("DOCX exported")
    } catch {
      toast.dismiss()
      toast.error("Failed to generate DOCX")
    }
  }, [safeTitle])

  return { downloadPdf, downloadJson, downloadDocx }
}
