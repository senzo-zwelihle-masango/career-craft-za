import { AppSidebar } from "@/components/layout/app-sidebar"
import NavBreadcrumb from "@/components/layout/nav-breadcrumb"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"

export default function CommunityLayout({
  children,
}: {
  children: React.ReactNode
}) {
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
