import React from "react"
import { Container } from "@/components/ui/container"
import { Heading } from "@/components/ui/heading"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardDescription,
  CardTitle,
  CardFooter,
} from "@/components/ui/card"
import { COVER_LETTER_TEMPLATES } from "@/components/cover-letter/templates/registry"
import { CoverLetterTemplatePreview } from "@/components/cover-letter/templates/cover-letter-template-preview"

export default function CoverLetterTemplatesPage() {
  return (
    <Container
      size={"2xl"}
      alignment={"none"}
      height={"full"}
      padding={"px-sm"}
      gap={"none"}
      flow={"none"}
      bleed={"none"}
      centered={false}
      className=""
      id="cover-letter-templates"
    >
      <Heading
        as="h1"
        font={"none"}
        size={"4xl"}
        weight={"medium"}
        tracking={"normal"}
        leading={"normal"}
        transform={"normal"}
        italic={false}
        margin={"none"}
      >
        Templates
      </Heading>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {COVER_LETTER_TEMPLATES.map((t) => (
          <Card key={t.id} className="max-w-md pt-0">
            <CardContent className="px-0">
              <div className="relative aspect-[210/297] overflow-hidden rounded-t-xl">
                <div className="absolute inset-0 flex items-start justify-center">
                  <CoverLetterTemplatePreview
                    templateId={t.id}
                    scale={0.5}
                    className="rounded-sm shadow-[0_0_0_1px_hsl(var(--border))]"
                  />
                </div>
              </div>
            </CardContent>
            <CardHeader>
              <CardTitle>{t.name}</CardTitle>
              <CardDescription>{t.description}</CardDescription>
            </CardHeader>
            <CardFooter className="gap-3 max-sm:flex-col max-sm:items-stretch">
              <Button>Preview Template</Button>
              <Button variant={"outline"}>Use Template</Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </Container>
  )
}
