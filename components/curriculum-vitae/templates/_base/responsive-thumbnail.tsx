"use client"

import { useRef, useState, useEffect } from "react"

const A4_WIDTH_PX = 793.7

export function ResponsiveThumbnail({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  const [scale, setScale] = useState(0.4)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new ResizeObserver((entries) => {
      const width = entries[0].contentRect.width
      setScale(Math.min(width / A4_WIDTH_PX, 0.5))
    })
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <div ref={ref} className={className} style={{ overflow: "hidden" }}>
      <div
        style={{
          transform: `scale(${scale})`,
          transformOrigin: "top left",
          width: "210mm",
          height: "297mm",
          overflow: "hidden",
        }}
      >
        {children}
      </div>
    </div>
  )
}
