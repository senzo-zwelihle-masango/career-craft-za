"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { cn } from "@/lib/utils"
import { Label } from "@/components/ui/label"
import {
  ColorPicker,
  ColorPickerSelection,
  ColorPickerHue,
  ColorPickerAlpha,
  ColorPickerOutput,
  ColorPickerFormat,
  ColorPickerEyeDropper,
} from "@/components/ui/color-picker"
import {
  useResumeUpdate,
  PanelTip,
  ResetDefaults,
  PANEL_TIPS,
  swatches,
} from "../_shared"

export function ColorsPanel() {
  const { resume, update } = useResumeUpdate()
  const [pickerKey, setPickerKey] = useState(0)
  const accentColor = resume?.accentColor || "#1f2937"

  // Bump key when accentColor changes externally (swatch/reset), not via picker onChange
  const lastHexRef = useRef(accentColor)
  useEffect(() => {
    if (lastHexRef.current !== accentColor) {
      lastHexRef.current = accentColor
      setPickerKey((k) => k + 1)
    }
  }, [accentColor])

  const handlePickerChange = useCallback(
    (value: number[]) => {
      const [r, g, b] = value
      const hex =
        "#" +
        [r, g, b]
          .map((x: number) => Math.round(x).toString(16).padStart(2, "0"))
          .join("")
      lastHexRef.current = hex
      update("accentColor", hex)
    },
    [update]
  )

  if (!resume) return null

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <p className="text-sm font-medium">Colors</p>
        <PanelTip tip={PANEL_TIPS.Colors} />
      </div>
      <div className="space-y-2">
        <div className="flex items-center gap-1.5">
          <Label>Accent color</Label>
        </div>
        <div className="flex flex-wrap gap-2">
          {swatches.map((c) => (
            <button
              key={c}
              onClick={() => update("accentColor", c)}
              className={cn(
                "h-8 w-8 rounded-full border-2 transition-transform hover:scale-110",
                accentColor === c ? "border-foreground" : "border-transparent"
              )}
              style={{ backgroundColor: c }}
            />
          ))}
        </div>
      </div>
      <div className="space-y-2">
        <div className="flex items-center gap-1.5">
          <Label>Custom color</Label>
        </div>
        <ColorPicker
          key={pickerKey}
          defaultValue={accentColor}
          onChange={handlePickerChange}
          className="h-auto w-full"
        >
          <ColorPickerSelection className="h-36 rounded-lg" />
          <ColorPickerHue />
          <ColorPickerAlpha />
          <div className="flex items-center gap-2">
            <ColorPickerEyeDropper />
            <ColorPickerOutput />
            <ColorPickerFormat />
          </div>
        </ColorPicker>
      </div>
      <ResetDefaults
        fields={{ accentColor: "#1f2937" }}
        resume={resume}
        update={update}
      />
    </div>
  )
}
