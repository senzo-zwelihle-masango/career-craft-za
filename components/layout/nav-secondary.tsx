import * as React from "react"
import { ComponentProps } from "react"
import { HugeiconsIcon } from "@hugeicons/react"

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

type HugeIcon = ComponentProps<typeof HugeiconsIcon>["icon"]

export function NavSecondary({
  items,
  ...props
}: {
  items: {
    title: string
    url: string
    icon: HugeIcon
  }[]
} & React.ComponentPropsWithoutRef<typeof SidebarGroup>) {
  return (
    <SidebarGroup {...props}>
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton size="sm" render={<a href={item.url} />}>
                <HugeiconsIcon icon={item.icon} />
                <span>{item.title}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}
