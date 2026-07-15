"use client"

import { useState } from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import { cn } from "@/lib/utils"
import { railItems } from "./_shared"
import { DocumentPanel } from "./panel/document"
import { TemplatesPanel } from "./panel/templates"
import { LayoutPanel } from "./panel/layout"
import { FontSizePanel } from "./panel/font-size"
import { SpacingPanel } from "./panel/spacing"
import { EntriesPanel } from "./panel/entries"
import { HeadingsPanel } from "./panel/heading"
import { FontPanel } from "./panel/font"
import { ColorsPanel } from "./panel/colors"
import { HeaderPanel } from "./panel/header"
import { PhotoPanel } from "./panel/photo"
import { LinksPanel } from "./panel/links"
import { FooterPanel } from "./panel/footer"
import { SectionsPanel } from "./panel/sections"
import { SharePanel } from "./panel/share"

const panelComponents: Record<string, React.FC> = {
  Document: DocumentPanel,
  Templates: TemplatesPanel,
  Layout: LayoutPanel,
  "Font Size": FontSizePanel,
  Spacing: SpacingPanel,
  Entries: EntriesPanel,
  Headings: HeadingsPanel,
  Font: FontPanel,
  Colors: ColorsPanel,
  Header: HeaderPanel,
  Photo: PhotoPanel,
  Links: LinksPanel,
  Footer: FooterPanel,
  Sections: SectionsPanel,
  Share: SharePanel,
}

const CustomizeEditor = () => {
  const [activePanel, setActivePanel] = useState("Document")
  const PanelComponent = panelComponents[activePanel]
  return (
    <div className="flex min-h-0 flex-col md:flex-row">
      <nav className="scrollbar-hidden flex w-full shrink-0 items-center gap-1 overflow-x-auto border-b bg-background px-3 py-2 md:w-[76px] md:flex-col md:gap-0.5 md:overflow-y-auto md:border-r md:border-b-0 md:px-2 md:py-3">
        {railItems.map((item) => {
          const iconData = item.icon
          return (
            <button
              key={item.label}
              onClick={() => setActivePanel(item.label)}
              className={cn(
                "flex shrink-0 flex-col items-center justify-center gap-0.5 rounded-xl text-[11px] font-medium transition-colors md:text-[10px]",
                "h-14 min-w-[60px] px-1 md:h-[56px] md:w-full",
                activePanel === item.label
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
              title={item.label}
            >
              <HugeiconsIcon
                icon={iconData}
                className="h-5 w-5 md:h-4 md:w-4"
              />
              <span className="leading-tight">{item.label}</span>
            </button>
          )
        })}
      </nav>

      <div className="flex-1 overflow-y-auto p-3 md:p-6 lg:p-8">
        <div className="max-w-xl">
          <h2 className="mb-4 text-sm font-semibold">{activePanel}</h2>
          {PanelComponent && <PanelComponent />}
        </div>
      </div>
    </div>
  )
}

export default CustomizeEditor
