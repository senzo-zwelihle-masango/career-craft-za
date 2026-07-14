"use client"

import { usePathname, useRouter } from "next/navigation"
import { Container } from "@/components/ui/container"
import { PageHeading } from "@/components/ui/page-heading"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"

const docsTabs = [
  { value: "introduction", label: "Introduction", href: "/docs" },
  { value: "get-started", label: "Get Started", href: "/docs/getting-started" },
  { value: "tutorials", label: "Tutorials", href: "/docs/tutorials" },
  { value: "changelog", label: "Changelog", href: "/docs/changelog" },
]

export default function DocsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const router = useRouter()

  const currentTab = docsTabs.find((t) => pathname === t.href)?.value ?? "introduction"

  return (
    <Container
      size="2xl"
      alignment="none"
      height="full"
      padding="px-sm"
      gap="none"
      flow="none"
      bleed="none"
      centered={false}
      className="overflow-x-hidden"
    >
      <PageHeading title="Documentation" />

      <Tabs
        value={currentTab}
        onValueChange={(value) => {
          const tab = docsTabs.find((t) => t.value === value)
          if (tab) router.push(tab.href)
        }}
      >
        <TabsList className="overflow-x-auto max-md:justify-start">
          {docsTabs.map((tab) => (
            <TabsTrigger key={tab.value} value={tab.value}>
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>
        <TabsContent value={currentTab} className="pt-6">
          {children}
        </TabsContent>
      </Tabs>
    </Container>
  )
}
