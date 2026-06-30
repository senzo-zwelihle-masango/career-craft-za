"use client"

import { HugeiconsIcon } from "@hugeicons/react"
import { Idea01Icon } from "@hugeicons/core-free-icons"
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import { Button } from "@/components/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { sectionTips } from "./content-tips"

interface TipsDrawerProps {
  sectionType: keyof typeof sectionTips
  side?: "bottom" | "left" | "right" | "top"
  compact?: boolean
  compactLabel?: string
}

export function TipsDrawer({ sectionType, side = "bottom", compact, compactLabel }: TipsDrawerProps) {
  const config = sectionTips[sectionType]
  if (!config) return null

  return (
    <Drawer direction={side}>
      <DrawerTrigger asChild>
        {compact ? (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" className="h-6 w-6 shrink-0 text-muted-foreground hover:text-foreground">
                <HugeiconsIcon icon={Idea01Icon} className="size-4" />
              </Button>
            </TooltipTrigger>
            {compactLabel && <TooltipContent>{compactLabel}</TooltipContent>}
          </Tooltip>
        ) : (
          <Button variant="ghost" size="sm" className="gap-1.5 text-xs">
            <HugeiconsIcon icon={Idea01Icon} className="size-4" />
            Tips
          </Button>
        )}
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>{config.title}</DrawerTitle>
        </DrawerHeader>
        <div className="space-y-3 px-4 pb-6">
          {config.tips.map((tip, i) => (
            <div key={i} className="flex gap-3 text-sm">
              <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-[11px] font-medium text-primary">
                {i + 1}
              </span>
              <span className="text-muted-foreground">{tip}</span>
            </div>
          ))}
        </div>
      </DrawerContent>
    </Drawer>
  )
}
