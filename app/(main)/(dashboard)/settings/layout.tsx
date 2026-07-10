import React from "react"
import Link from "next/link"
import { Container } from "@/components/ui/container"
import { Heading } from "@/components/ui/heading"

const settingsNav = [
  { title: "General", href: "/settings/general" },
  { title: "Team", href: "/settings/team" },
  { title: "Billing", href: "/settings/billing" },
  { title: "Limits", href: "/settings/limits" },
]

export default async function SettingsLayout({
  children,
}: {
  children: React.ReactNode
}) {
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
    >
      <div className="mb-6">
        <Heading as="h1" size="4xl" weight="semibold" margin="none">
          Settings
        </Heading>
      </div>
      <nav className="mb-8 flex gap-1 border-b">
        {settingsNav.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="relative inline-flex h-9 items-center px-4 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground aria-[current=page]:text-foreground aria-[current=page]:after:absolute aria-[current=page]:after:inset-x-0 aria-[current=page]:after:bottom-0 aria-[current=page]:after:h-0.5 aria-[current=page]:after:bg-foreground"
          >
            {item.title}
          </Link>
        ))}
      </nav>
      {children}
    </Container>
  )
}
