import React from "react"
import { headers } from "next/headers"
import { redirect } from "next/navigation"
import { auth } from "@/lib/auth"
import { AppSidebar } from "@/components/layout/app-sidebar"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import NavBreadcrumb from "@/components/layout/nav-breadcrumb"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // check user session
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  // if theres a session redirect to  root page
  if (!session) {
    return redirect("/sign-in")
  }

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar />
      <SidebarInset>
        <NavBreadcrumb />
        <main>{children}</main>
      </SidebarInset>
    </SidebarProvider>
  )
}
