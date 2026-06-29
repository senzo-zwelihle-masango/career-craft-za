import React from "react"
import { Container } from "@/components/ui/container"
import { Heading } from "@/components/ui/heading"

export default function OverviewPage() {
  return (
    <Container
      size={"2xl"}
      alignment={"none"}
      height={"full"}
      padding={"px-sm"}
      gap={"none"}
      flow={"none"}
      bleed={"none"}
      className="my-2 space-y-2"
      id="overview"
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
        Overview
      </Heading>
      {/* stats */}
      <div className="flex flex-1 flex-col gap-4 pt-0">
        <div className="grid auto-rows-min gap-4 md:grid-cols-4">
          <div className="aspect-video rounded-xl bg-muted/50" />
          <div className="aspect-video rounded-xl bg-muted/50" />
          <div className="aspect-video rounded-xl bg-muted/50" />
          <div className="aspect-video rounded-xl bg-muted/50" />
        </div>
        <div className="aspect-video rounded-xl bg-muted/50" />
      </div>
    </Container>
  )
}
