import React from "react"
import { FeedbackForm } from "@/components/forms/user/feedback-form"
import { Container } from "@/components/ui/container"
import { PageHeading } from "@/components/ui/page-heading"

export default function FeedbackPage() {
  return (
    <Container
      size={"sm"}
      alignment={"none"}
      height={"full"}
      padding={"px-sm"}
      gap={"none"}
      flow={"none"}
      bleed={"none"}
      centered={true}
    >
      <PageHeading title="Feedback" />
      <FeedbackForm />
    </Container>
  )
}
