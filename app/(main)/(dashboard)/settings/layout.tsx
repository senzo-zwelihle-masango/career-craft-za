"use client"

import { usePathname, useRouter } from "next/navigation"
import { Container } from "@/components/ui/container"
import { PageHeading } from "@/components/ui/page-heading"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  Settings01Icon,
  UserGroupIcon,
  CreditCardIcon,
  Chart01Icon,
} from "@hugeicons/core-free-icons"

const settingsTabs = [
  { value: "general", label: "General", icon: Settings01Icon, href: "/settings/general" },
  { value: "team", label: "Team", icon: UserGroupIcon, href: "/settings/team" },
  { value: "billing", label: "Billing", icon: CreditCardIcon, href: "/settings/billing" },
  { value: "limits", label: "Limits", icon: Chart01Icon, href: "/settings/limits" },
]

export default function SettingsLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()

  const currentTab = settingsTabs.find((t) => pathname.startsWith(t.href))?.value ?? "general"

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
      <PageHeading title="Settings" />

      <Tabs
        value={currentTab}
        onValueChange={(value) => {
          const tab = settingsTabs.find((t) => t.value === value)
          if (tab) router.push(tab.href)
        }}
      >
        <TabsList className="overflow-x-auto max-md:justify-start">
          {settingsTabs.map((tab) => (
            <TabsTrigger key={tab.value} value={tab.value}>
              <HugeiconsIcon icon={tab.icon} />
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
