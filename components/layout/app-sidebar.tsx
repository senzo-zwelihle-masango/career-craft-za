"use client"

import * as React from "react"
import { ComponentProps, useMemo } from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  BookOpen01Icon,
  BubbleChatIcon,
  DashboardSquare01Icon,
  FolderKanbanIcon,
  Layers01Icon,
  LifebuoyIcon,
  PencilEdit02Icon,
  Settings01Icon,
  ShieldUserIcon,
  StarIcon,
  UserGroupIcon,
} from "@hugeicons/core-free-icons"

import { TeamSwitcher } from "./team-switcher"
import { NavMain } from "./nav-main"

import { NavUser } from "./nav-user"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"
import Logo from "../svg/icons/logo"
import { NavSecondary } from "./nav-secondary"
import { useAuthUser } from "./auth-provider"

type HugeIcon = ComponentProps<typeof HugeiconsIcon>["icon"]

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const sessionUser = useAuthUser()
  const isAdmin = sessionUser?.role === "admin"

  const user = useMemo(
    () => ({
      name: sessionUser?.name ?? "user",
      email: sessionUser?.email ?? "u@example.com",
      avatar: sessionUser?.image ?? "/images/user/placeholder.svg",
    }),
    [sessionUser]
  )

  const teams = useMemo(
    () => [
      {
        name: "Career Craft ZA",
        logo: { type: "component", component: Logo } as const,
        plan: "Enterprise ",
      },
    ],
    []
  )

  const navMain = useMemo(() => {
    const items = [
      {
        title: "Dashboard",
        url: "/overview",
        icon: DashboardSquare01Icon,
        isActive: true,
        items: [{ title: "Overview", url: "/overview" }],
      },
      {
        title: "Curriculum Vitae",
        url: "/curriculum-vitaes",
        icon: Layers01Icon,
        items: [
          { title: "CV Builder", url: "/curriculum-vitaes" },
          { title: "Templates", url: "/curriculum-vitaes/templates" },
        ],
      },
      {
        title: "Cover Letter",
        url: "/cover-letters",
        icon: PencilEdit02Icon,
        items: [
          { title: "Cover Letter Builder", url: "/cover-letters" },
          { title: "Templates", url: "/cover-letters/templates" },
        ],
      },
      {
        title: "Application Tracker",
        url: "/application-tracker",
        icon: FolderKanbanIcon,
        items: [
          { title: "Board", url: "/application-tracker" },
          { title: "Kanban", url: "/application-tracker" },
          { title: "Interview Prep", url: "/application-tracker/interview-prep" },
        ],
      },
      {
        title: "Documentation",
        url: "/docs",
        icon: BookOpen01Icon,
        items: [
          { title: "Introduction", url: "/docs" },
          { title: "Get Started", url: "/docs/getting-started" },
          { title: "Tutorials", url: "/docs/tutorials" },
          { title: "Changelog", url: "/docs/changelog" },
        ],
      },
      {
        title: "Settings",
        url: "/settings/general",
        icon: Settings01Icon,
        items: [
          { title: "General", url: "/settings/general" },
          { title: "Team", url: "/settings/team" },
          { title: "Billing", url: "/settings/billing" },
          { title: "Limits", url: "/settings/limits" },
        ],
      },
    ]

    if (isAdmin) {
      items.push({
        title: "Admin",
        url: "/admin",
        icon: ShieldUserIcon,
        items: [
          { title: "Users", url: "/admin/users" },
          { title: "Feedback", url: "/admin/feedback" },
          { title: "Reviews", url: "/admin/reviews" },
          { title: "Community Reports", url: "/admin/community-reports" },
        ],
      })
    }

    return items
  }, [isAdmin])

  const navSecondary = useMemo(
    () => [
      { title: "Community", url: "/community", icon: UserGroupIcon },
      { title: "Support", url: "/support", icon: LifebuoyIcon },
      { title: "Feedback", url: "/feedback", icon: BubbleChatIcon },
      { title: "Review", url: "/review", icon: StarIcon },
    ],
    []
  )

  return (
    <Sidebar variant="sidebar" collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navMain} />
        <NavSecondary items={navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
