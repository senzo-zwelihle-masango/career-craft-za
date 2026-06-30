"use client"

import { useRef, useEffect, useState } from "react"
import { useEditorStore } from "@/lib/data/editor/store"
import { CvPreview } from "@/components/templates/cv-preview"


const PAGE_WIDTH_PX = 794
const A4_RATIO = 297 / 210

export function EditorPreviewPanel() {
  const resume = useEditorStore((s) => s.cv)
  const containerRef = useRef<HTMLDivElement>(null)
  const measureRef = useRef<HTMLDivElement>(null)
  const [zoom, setZoom] = useState(0.75)
  const [pages, setPages] = useState(1)

  const pageWidth = PAGE_WIDTH_PX * zoom
  const pageHeight = pageWidth * A4_RATIO

  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const ro = new ResizeObserver((entries) => {
      const width = entries[0]?.contentRect.width
      if (width) {
        const z = Math.min(width / PAGE_WIDTH_PX, 1)
        setZoom(Number(z.toFixed(3)))
      }
    })
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  useEffect(() => {
    const el = measureRef.current
    if (!el) return
    const ro = new ResizeObserver((entries) => {
      const h = entries[0]?.contentRect.height
      if (h && h > 0) {
        setPages(Math.max(1, Math.ceil(h / (PAGE_WIDTH_PX * A4_RATIO))))
      }
    })
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  if (!resume) return null

  return (
    <div className="flex h-full flex-col">
      <div ref={containerRef} className="flex-1 overflow-y-auto scrollbar-hidden p-4" data-lenis-prevent>
        <div className="mx-auto flex flex-col items-center gap-6">
          {Array.from({ length: pages }).map((_, i) => (
            <div
              key={i}
              className="overflow-hidden rounded-sm bg-white"
              style={{
                width: pageWidth,
                height: pageHeight,
                boxShadow: "0 4px 24px rgba(0,0,0,0.08), 0 1px 4px rgba(0,0,0,0.04)",
              }}
            >
              <div style={{ transform: `translateY(-${i * pageHeight}px)` }}>
                <div
                  style={{
                    width: PAGE_WIDTH_PX,
                    transform: `scale(${zoom})`,
                    transformOrigin: "top left",
                  }}
                >
                  <CvPreview />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div
        ref={measureRef}
        className="pointer-events-none absolute left-0 top-0 opacity-0"
        style={{ width: PAGE_WIDTH_PX }}
      >
        <CvPreview />
      </div>
    </div>
  )
}
