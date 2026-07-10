"use client"

import { useEffect, useState, useRef, useCallback } from "react"
import { usePathname, useRouter } from "next/navigation"
import { toast } from "sonner"
import type { CvWithRelations } from "@/types/curriculum-vitae/types"
import { useDownloadActions } from "@/hooks/use-download-actions"
import { useAutoSave } from "@/hooks/use-auto-save"
import EditorNavigationBar from "./editor-navigationbar"
import { EditorPreviewPanel } from "./editor-preview-panel"
import { updateCv } from "@/lib/actions/user/curriculum-vitae"
import { useEditorStore } from "@/lib/data/curriculum-vitae/store"

const SIDEBAR_WIDTH_KEY = "editor-sidebar-width"
const DEFAULT_SIDEBAR_WIDTH = 45

const EditorShell = ({
  cv,
  children,
}: {
  cv: CvWithRelations
  children: React.ReactNode
}) => {
  const pathname = usePathname()
  const router = useRouter()
  const activeTab = pathname.split("/").pop() ?? "content"
  const [renameTitle, setRenameTitle] = useState(cv.title)
  const [showPreview, setShowPreview] = useState(true)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [mobilePreviewOpen, setMobilePreviewOpen] = useState(false)
  const [isDesktop, setIsDesktop] = useState(true)

  useEffect(() => {
    function check() {
      setIsDesktop(window.innerWidth >= 1024)
    }
    check()
    window.addEventListener("resize", check)
    return () => window.removeEventListener("resize", check)
  }, [])

  const [sidebarWidth, setSidebarWidth] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem(SIDEBAR_WIDTH_KEY)
      return saved ? Number(saved) : DEFAULT_SIDEBAR_WIDTH
    }
    return DEFAULT_SIDEBAR_WIDTH
  })
  const isDragging = useRef(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const setCv = useEditorStore((s) => s.setCv)
  const undo = useEditorStore((s) => s.undo)
  const redo = useEditorStore((s) => s.redo)
  const history = useEditorStore((s) => s.history)
  const redoStack = useEditorStore((s) => s.redoStack)
  const initializedRef = useRef(false)

  const { downloadPdf, downloadJson, downloadDocx } = useDownloadActions(
    renameTitle,
    cv.id
  )

  useAutoSave(cv.id)

  useEffect(() => {
    if (!initializedRef.current) {
      setCv(cv)
      initializedRef.current = true
    }
  }, [cv, setCv])

  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "z" && !e.shiftKey) {
        e.preventDefault()
        undo()
      }
      if (
        (e.metaKey || e.ctrlKey) &&
        (e.key === "y" || (e.key === "z" && e.shiftKey))
      ) {
        e.preventDefault()
        redo()
      }
    }
    window.addEventListener("keydown", handleKey)
    return () => window.removeEventListener("keydown", handleKey)
  }, [undo, redo])

  const handleMouseDown = useCallback(() => {
    isDragging.current = true
    document.body.style.cursor = "col-resize"
    document.body.style.userSelect = "none"
  }, [])

  useEffect(() => {
    function handleMouseMove(e: MouseEvent) {
      if (!isDragging.current || !containerRef.current) return
      const rect = containerRef.current.getBoundingClientRect()
      const pct = ((e.clientX - rect.left) / rect.width) * 100
      setSidebarWidth(Math.max(30, Math.min(60, pct)))
    }
    function handleMouseUp() {
      if (isDragging.current) {
        isDragging.current = false
        document.body.style.cursor = ""
        document.body.style.userSelect = ""
        setSidebarWidth((prev) => {
          localStorage.setItem(SIDEBAR_WIDTH_KEY, String(prev))
          return prev
        })
      }
    }
    window.addEventListener("mousemove", handleMouseMove)
    window.addEventListener("mouseup", handleMouseUp)
    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
      window.removeEventListener("mouseup", handleMouseUp)
    }
  }, [])

  async function renameCv() {
    if (!renameTitle.trim()) return
    const { error } = await updateCv(cv.id, { title: renameTitle })
    if (error) {
      toast.error("Failed to rename")
      return
    }
    router.refresh()
    toast.success("Renamed")
  }
  return (
    <div className="flex h-svh flex-col">
      {/* navigationbar */}
      <EditorNavigationBar
        cvId={cv.id}
        cvTitle={cv.title}
        activeTab={activeTab}
        showPreview={showPreview}
        canUndo={history.length > 0}
        canRedo={redoStack.length > 0}
        renameTitle={renameTitle}
        onRenameTitle={setRenameTitle}
        onRename={renameCv}
        onUndo={undo}
        onRedo={redo}
        onTogglePreview={() => setShowPreview((v) => !v)}
        onDownloadPdf={downloadPdf}
        onDownloadDocx={downloadDocx}
        onDownloadJson={downloadJson}
        onMobileMenuToggle={() => setMobileMenuOpen((v) => !v)}
        onMobilePreviewOpen={() => setMobilePreviewOpen(true)}
        mobileMenuOpen={mobileMenuOpen}
      />
      {/* mobile menu -  */}
      {/* divider */}

      <div ref={containerRef} className="flex flex-1 overflow-hidden pt-20">
        <div
          className="flex min-w-0 flex-col"
          style={
            isDesktop && showPreview && activeTab !== "overview"
              ? { width: `${sidebarWidth}%` }
              : { width: "100%" }
          }
        >
          <main
            className="scrollbar-hidden flex-1 overflow-y-auto py-4"
            data-lenis-prevent
          >
            <div key={activeTab} className="max-w-full">
              {children}
            </div>
          </main>
        </div>

        {/*  */}
        {isDesktop && showPreview && activeTab !== "overview" && (
          <div
            className="relative w-1.5 shrink-0 cursor-col-resize transition-colors hover:bg-primary/20 active:bg-primary/30"
            onMouseDown={handleMouseDown}
          >
            <div className="absolute inset-y-0 left-1/2 w-4 -translate-x-1/2" />
          </div>
        )}

        {/* cv preview */}
        {isDesktop && showPreview && activeTab !== "overview" && (
          <aside
            className="flex min-w-0 flex-col border-l"
            style={{ width: `calc(${100 - sidebarWidth}%)` }}
          >
            <EditorPreviewPanel />
          </aside>
        )}
      </div>
    </div>
  )
}

export default EditorShell
