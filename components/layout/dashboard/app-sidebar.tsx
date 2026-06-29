"use client"

import * as React from "react"
import { ComponentProps } from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  AudioWave02Icon,
  BookOpen01Icon,
  BotIcon,
  CommandIcon,
  ComputerTerminal01Icon,
  GalleryVerticalEndIcon,
  BubbleChatIcon,
  LifebuoyIcon,
  Settings01Icon,
  DashboardSquare01Icon,
  Layers01Icon,
  PencilEdit02Icon,
  FolderKanbanIcon,
} from "@hugeicons/core-free-icons"

import { NavMain } from "@/components/layout/dashboard/nav-main"
import { NavUser } from "@/components/layout/dashboard/nav-user"
import { TeamSwitcher } from "@/components/layout/dashboard/team-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"
import { NavSecondary } from "./nav-secondary"
import Logo from "@/components/svg/icons/logo"

type HugeIcon = ComponentProps<typeof HugeiconsIcon>["icon"]

// data.

const data: {
  user: {
    name: "user"
    email: "user@example.com"
    avatar: "/images/layout/user-placeholder.png"
  }

  teams: {
    name: string
    logo: React.ElementType
    plan: string
  }[]

  navMain: {
    title: string
    url: string
    icon: HugeIcon
    isActive?: boolean
    items?: { title: string; url: string }[]
  }[]

  navSecondary: { title: string; url: string; icon: HugeIcon }[]
} = {
  user: {
    name: "user",
    email: "user@example.com",
    avatar: "/images/layout/user-placeholder.png",
  },
  teams: [
    {
      name: "Career Craft",
      logo: Logo,
      plan: "Enterprise",
    },
  ],
  navMain: [
    {
      title: "Dashboard",
      url: "/overview",
      icon: DashboardSquare01Icon,
      isActive: true,
      items: [
        {
          title: "Overview",
          url: "#",
        },
      ],
    },
    {
      title: "Curriculum Vitae",
      url: "/curriculum-vitaes",
      icon: Layers01Icon,
      items: [
        { title: "All CV's", url: "/curriculum-vitaes" },
        { title: "Templates", url: "/curriculum-vitaes/templates" },
      ],
    },
    {
      title: "Cover Letters",
      url: "/cover-letters",
      icon: PencilEdit02Icon,
      items: [
        { title: "All Cover Letters", url: "/cover-letters" },
        { title: "Templates", url: "/cover-letters/templates" },
      ],
    },
    {
      title: "Application Tracker",
      url: "/application-tracker",
      icon: FolderKanbanIcon,
      items: [
        { title: "Board", url: "/application-tracker" },
        { title: "Kanban ", url: "/application-tracker" },
      ],
    },
    {
      title: "Settings",
      url: "#",
      icon: Settings01Icon,
      items: [
        {
          title: "General",
          url: "#",
        },
        {
          title: "Account",
          url: "#",
        },
        {
          title: "Profile",
          url: "#",
        },
      ],
    },
  ],
  navSecondary: [
    { title: "Support", url: "#", icon: LifebuoyIcon },
    { title: "Feedback", url: "#", icon: BubbleChatIcon },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
