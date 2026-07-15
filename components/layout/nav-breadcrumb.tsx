"use client"

import * as React from "react"
import { usePathname } from "next/navigation"
import Link from "next/link"
import { HugeiconsIcon } from "@hugeicons/react"
import { DashboardSquare01Icon } from "@hugeicons/core-free-icons"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import ThemeSwitcher from "../ui/theme-switcher"

export default function NavBreadcrumb() {
  const pathname = usePathname()
  const segments = pathname.split("/").filter(Boolean)

  const getHref = (index: number) => {
    return "/" + segments.slice(0, index + 1).join("/")
  }

  return (
    <header className="flex h-(--header-height) shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mx-2 data-[orientation=vertical]:h-4"
        />
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem className="hidden md:block">
              <BreadcrumbLink href="/overview">
                <HugeiconsIcon
                  icon={DashboardSquare01Icon}
                  className="size-4"
                />
              </BreadcrumbLink>
            </BreadcrumbItem>
            {segments.map((segment, index) => {
              const href = getHref(index)
              const isLast = index === segments.length - 1
              const label = decodeURIComponent(segment).replace(/-/g, " ")

              return (
                <span key={href} className="flex items-center">
                  <BreadcrumbSeparator className="mx-4 hidden md:block" />

                  <BreadcrumbItem
                    className={
                      index < segments.length - 1 ? "hidden md:block" : ""
                    }
                  >
                    {isLast ? (
                      <BreadcrumbPage>{label}</BreadcrumbPage>
                    ) : (
                      <BreadcrumbLink href={href}>{label}</BreadcrumbLink>
                    )}
                  </BreadcrumbItem>
                </span>
              )
            })}
          </BreadcrumbList>
        </Breadcrumb>
        <div className="ml-auto flex items-center gap-2">
          <ThemeSwitcher />
        </div>
      </div>
    </header>
  )
}
