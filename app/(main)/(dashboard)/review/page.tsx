import React from "react"
import { ReviewForm } from "@/components/forms/user/review-form"
import { Container } from "@/components/ui/container"
import { PageHeading } from "@/components/ui/page-heading"

export default function ReviewPage() {
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
      <PageHeading title="Review" />
      <ReviewForm />
    </Container>
  )
}
