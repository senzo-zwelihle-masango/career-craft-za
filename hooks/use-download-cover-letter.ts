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
      const res = await fetch(`/api/docx/cover-letter/${letterId}`)
      if (!res.ok) throw new Error("Failed")
      const blob = await res.blob()
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
