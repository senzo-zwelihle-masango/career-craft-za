"use client"

import { useRef, useEffect, useState, useCallback } from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import { Maximize02Icon } from "@hugeicons/core-free-icons"
import { useEditorStore } from "@/lib/data/curriculum-vitae/store"
import { CvPreview } from "../curriculum-vitae/templates/cv-preview"
import { Button } from "@/components/ui/button"

const PAGE_WIDTH_PX = 794
const A4_RATIO = 297 / 210
const PAGE_HEIGHT_PX = PAGE_WIDTH_PX * A4_RATIO

export function EditorPreviewPanel() {
  const cv = useEditorStore((s) => s.cv)
  const containerRef = useRef<HTMLDivElement>(null)
  const measureRef = useRef<HTMLDivElement>(null)
  const fullscreenRef = useRef<HTMLDivElement>(null)
  const [zoom, setZoom] = useState(0.75)
  const [pages, setPages] = useState(1)
  const [currentPage, setCurrentPage] = useState(0)

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

    function measure() {
      const h = el!.scrollHeight
      if (h > 0) {
        setPages(Math.max(1, Math.ceil(h / PAGE_HEIGHT_PX)))
      }
    }

    measure()

    const ro = new ResizeObserver(() => measure())
    ro.observe(el)
    return () => ro.disconnect()
  }, [cv])

  // Track which page is currently visible as the user scrolls
  useEffect(() => {
    const el = fullscreenRef.current
    if (!el || pages <= 1) return

    function updatePage() {
      const scrollTop = el!.scrollTop
      const page = Math.min(
        Math.floor(scrollTop / (pageHeight + 24)),
        pages - 1
      )
      setCurrentPage(page)
    }

    el.addEventListener("scroll", updatePage, { passive: true })
    return () => el.removeEventListener("scroll", updatePage)
  }, [pages, pageHeight])

  const handleFullscreen = useCallback(() => {
    const el = fullscreenRef.current
    if (!el) return
    if (document.fullscreenElement) {
      document.exitFullscreen()
    } else {
      el.requestFullscreen()
    }
  }, [])

  if (!cv) return null

  return (
    <div className="flex h-full flex-col">
      <div
        ref={fullscreenRef}
        className="group relative scrollbar-hidden flex-1 overflow-y-auto p-4"
        data-lenis-prevent
      >
        <Button
          onClick={handleFullscreen}
          className="absolute top-6 right-6 z-10"
        >
          <HugeiconsIcon icon={Maximize02Icon} className="h-3.5 w-3.5" />
          Fullscreen
        </Button>
        <div ref={containerRef}>
          <div className="mx-auto flex flex-col items-center gap-6">
            {Array.from({ length: pages }).map((_, i) => (
              <div
                key={i}
                className="overflow-hidden rounded-sm bg-white"
                style={{
                  width: pageWidth,
                  height: pageHeight,
                  boxShadow:
                    "0 4px 24px rgba(0,0,0,0.08), 0 1px 4px rgba(0,0,0,0.04)",
                }}
              >
                <div style={{ transform: `translateY(-${i * pageHeight}px)` }}>
                  <div
                    style={{
                      width: PAGE_WIDTH_PX,
                      height: PAGE_HEIGHT_PX,
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

          {pages > 1 && (
            <div className="sticky bottom-4 mt-4 flex items-center justify-center gap-2">
              <div className="flex items-center gap-1 rounded-full border bg-background/80 px-3 py-1.5 text-xs text-muted-foreground backdrop-blur-sm">
                <span className="font-medium text-foreground">
                  {currentPage + 1}
                </span>
                <span>/</span>
                <span>{pages}</span>
                <span className="ml-1 text-[10px]">
                  {pages > 1 ? "pages" : "page"}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      <div
        ref={measureRef}
        className="pointer-events-none absolute top-0 left-0 opacity-0"
        style={{ width: PAGE_WIDTH_PX }}
      >
        <CvPreview />
      </div>
    </div>
  )
}
