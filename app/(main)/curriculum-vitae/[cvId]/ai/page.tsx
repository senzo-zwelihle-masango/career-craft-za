import React from "react"
import { Container } from "@/components/ui/container"
import { Heading } from "@/components/ui/heading"
export default function AIPage() {
  return (
    <Container
      size={"2xl"}
      alignment={"none"}
      height={"none"}
      padding={"px-xs"}
      gap={"none"}
      flow={"none"}
      bleed={"none"}
      className="my-2 space-y-2"
      id="ai"
    >
      <Heading
        as="h1"
        font="none"
        size="4xl"
        weight="normal"
        tracking="normal"
        leading="none"
        transform="normal"
        italic={false}
        margin={"md"}
      >
        AI Tools
      </Heading>

      <p>coming soon</p>
    </Container>
  )
}
