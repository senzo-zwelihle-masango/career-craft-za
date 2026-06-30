"use client"

import { useEffect, useRef } from "react"
import { useEditorStore } from "@/lib/data/editor/store"
import { syncCv } from "@/lib/actions/curriculum-vitae"

export function useAutoSave(cvId: string, delay = 2000) {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const isDirty = useEditorStore((s) => s.isDirty)
  const cv = useEditorStore((s) => s.cv)
  const setSaveStatus = useEditorStore((s) => s.setSaveStatus)

  useEffect(() => {
    if (!isDirty || !cv) return

    if (timerRef.current) clearTimeout(timerRef.current)

    timerRef.current = setTimeout(async () => {
      setSaveStatus("saving")
      const payload = JSON.parse(JSON.stringify(cv))
      const { error } = await syncCv(cvId, payload)

      if (error) {
        setSaveStatus("error")
      } else {
        setSaveStatus("saved")
        useEditorStore.setState({ isDirty: false })
      }
    }, delay)

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [isDirty, cv, cvId, delay, setSaveStatus])
}
