"use client"

import { syncCv } from "@/lib/actions/user/curriculum-vitae"
import { useEditorStore } from "@/lib/data/curriculum-vitae/store"
import { useEffect, useRef } from "react"

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
