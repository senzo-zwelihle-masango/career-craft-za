import React from "react"
import { Container } from "@/components/ui/container"
import { PageHeading } from "@/components/ui/page-heading"

export default function SupportPage() {
  return (
    <Container
      size={"sm"}
      alignment={"none"}
      height={"full"}
      padding={"px-sm"}
      gap={"none"}
      flow={"none"}
      bleed={"none"}
      centered={false}
    >
      <PageHeading title="Support" />
      <p className="text-muted-foreground">
        Need help? Contact our support team at{" "}
        <a
          href="mailto:support@careercraftza.com"
          className="text-primary hover:underline"
        >
          support@careercraftza.com
        </a>
      </p>
    </Container>
  )
}
