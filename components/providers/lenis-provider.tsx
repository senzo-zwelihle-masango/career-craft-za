"use client"

import { ReactLenis } from "lenis/react"
import type { LenisRef } from "lenis/react"
import { cancelFrame, frame } from "motion/react"
import { useEffect, useRef } from "react"

export function LenisProvider({ children }: { children: React.ReactNode }) {
  const lenisRef = useRef<LenisRef>(null)

  useEffect(() => {
    function update(data: { timestamp: number }) {
      lenisRef.current?.lenis?.raf(data.timestamp)
    }
    frame.update(update, true)
    return () => cancelFrame(update)
  }, [])

  return (
    <ReactLenis
      root
      ref={lenisRef}
      options={{
        autoRaf: false,

        // Desktop feel
        lerp: 0.075,
        smoothWheel: true,
        wheelMultiplier: 0.9,

        // Mobile feel
        syncTouch: true,
        syncTouchLerp: 0.07,
        touchInertiaExponent: 1.7,
        touchMultiplier: 1,

        // Navigation
        anchors: {
          offset: 80,
        },
        stopInertiaOnNavigate: true,

        // General
        orientation: "vertical",
        gestureOrientation: "vertical",
        overscroll: true,
        autoResize: true,
      }}
    >
      {children}
    </ReactLenis>
  )
}
