"use client"

import { useCallback } from "react"
import { toast } from "sonner"

export function useDownloadCoverLetter(
  letterId: string,
  title: string,
  letterData: Record<string, unknown> | null
) {
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
      const timeoutId = setTimeout(() => controller.abort(), 15000)
      const res = await fetch(`/api/pdf/cover-letter/${letterId}`, {
        signal: controller.signal,
      })
      clearTimeout(timeoutId)
      if (!res.ok) throw new Error("Failed")
      const contentType = res.headers.get("content-type") ?? ""
      if (!contentType.includes("application/pdf"))
        throw new Error("PDF generation failed")
      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      const a = window.document.createElement("a")
      a.href = url
      a.download = `${safeTitle}.pdf`
      a.click()
      URL.revokeObjectURL(url)
      popup.close()
      toast.dismiss()
      toast.success("Cover letter downloaded")
    } catch {
      toast.dismiss()
      toast.loading("Opening print dialog...")
      popup.location.href = `/api/pdf/cover-letter/${letterId}/html?print=1`
      toast.dismiss()
    }
  }, [letterId, safeTitle])

  const downloadDocx = useCallback(async () => {
    toast.loading("Generating DOCX...")
    try {
      const res = await fetch(`/api/pdf/cover-letter/${letterId}/html`)
      if (!res.ok) throw new Error("Failed")
      const raw = await res.text()
      const bodyMatch = raw.match(/<body[^>]*>([\s\S]*)<\/body>/i)
      const content = bodyMatch ? bodyMatch[1] : raw
      const wordHtml = `<!DOCTYPE html>
<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word" xmlns="http://www.w3.org/TR/REC-html40">
<head><meta charset="utf-8"><title>${safeTitle}</title><style>body{margin:0;padding:0;font-family:Calibri,sans-serif}table{border-collapse:collapse}</style></head>
<body>${content}</body></html>`
      const blob = new Blob([wordHtml], { type: "application/msword" })
      const url = URL.createObjectURL(blob)
      const a = window.document.createElement("a")
      a.href = url
      a.download = `${safeTitle}.doc`
      a.click()
      URL.revokeObjectURL(url)
      toast.dismiss()
      toast.success("DOCX exported")
    } catch {
      toast.dismiss()
      toast.error("Failed to generate DOCX")
    }
  }, [letterId, safeTitle])

  const downloadJson = useCallback(async () => {
    if (!letterData) {
      toast.error("No cover letter data available")
      return
    }
    const json = JSON.stringify(letterData, null, 2)
    const blob = new Blob([json], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = window.document.createElement("a")
    a.href = url
    a.download = `${safeTitle}.json`
    a.click()
    URL.revokeObjectURL(url)
    toast.success("JSON exported")
  }, [safeTitle, letterData])

  return { downloadPdf, downloadDocx, downloadJson }
}
