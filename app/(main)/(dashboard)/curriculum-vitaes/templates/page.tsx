"use client"

import React from "react"
import {
  Card,
  CardContent,
  CardHeader,
  CardDescription,
  CardTitle,
  CardFooter,
} from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Container } from "@/components/ui/container"
import { Heading } from "@/components/ui/heading"
import { Button } from "@/components/ui/button"
import { TEMPLATES } from "@/components/curriculum-vitae/templates"
import { TemplateRenderer } from "@/components/curriculum-vitae/templates/template-renderer"
import { HugeiconsIcon } from "@hugeicons/react"
import { Cancel01Icon } from "@hugeicons/core-free-icons"
const Templates = () => {
  const [showAll, setShowAll] = React.useState(true)
  const displayed = showAll ? TEMPLATES : TEMPLATES.slice(0, 6)

  // preview dialog
  const [previewId, setPreviewId] = React.useState<string | null>(null)
  return (
    <Container
      size={"2xl"}
      alignment={"none"}
      height={"screen"}
      padding={"px-sm"}
      gap={"none"}
      flow={"none"}
      bleed={"none"}
      centered={false}
      className="my-4 space-y-4"
      id="templates"
    >
      <div className="relative z-10 max-w-2xl">
        <Heading
          as="h1"
          font={"none"}
          size={"4xl"}
          weight={"medium"}
          tracking={"normal"}
          leading={"normal"}
          transform={"normal"}
          italic={false}
          margin={"sm"}
        >
          Templates
        </Heading>
      </div>

      {/* grid */}
      <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-3">
        {displayed.map((t) => (
          <Card key={t.id} className="max-w-md pt-0">
            <CardContent className="overflow-hidden px-0">
              <TemplateRenderer
                templateId={t.id}
                scale={0.57}
                className="rounded-t-xl"
              />
            </CardContent>
            <CardHeader>
              <CardTitle>{t.name}</CardTitle>
              <CardDescription>{t.description}</CardDescription>
            </CardHeader>
            <CardFooter className="gap-3 max-sm:flex-col max-sm:items-stretch">
              <Button onClick={() => setPreviewId(t.id)}>Preview</Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {TEMPLATES.length > 6 && (
        <div className="mt-10 text-center">
          <Button variant="default" onClick={() => setShowAll(!showAll)}>
            {showAll ? "Show Less" : "View All Templates"}
          </Button>
        </div>
      )}

      {/* preview */}
      {previewId && (
        <Dialog
          open={!!previewId}
          onOpenChange={(open) => {
            if (!open) setPreviewId(null)
          }}
        >
          <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-4xl">
            <DialogHeader>
              <DialogTitle>
                {TEMPLATES.find((t) => t.id === previewId)?.name ||
                  "Template Preview"}
              </DialogTitle>
            </DialogHeader>

            {(() => {
              const tpl = TEMPLATES.find((t) => t.id === previewId)
              if (!tpl) return null
              return (
                <div className="flex flex-col gap-6 md:flex-row">
                  <div className="flex min-h-[300px] flex-shrink-0 items-start justify-center overflow-auto rounded-lg">
                    <TemplateRenderer templateId={tpl.id} scale={0.45} />
                  </div>

                  <div className="min-w-0 flex-1 space-y-4">
                    <div>
                      <h3 className="text-base font-semibold">{tpl.name}</h3>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {tpl.categories?.join(", ")}
                      </p>
                    </div>

                    <p className="text-sm leading-relaxed text-muted-foreground">
                      {tpl.description}
                    </p>

                    <DialogFooter className="gap-2 pt-2">
                      <Button
                        variant="outline"
                        onClick={() => setPreviewId(null)}
                      >
                        <HugeiconsIcon icon={Cancel01Icon} />
                        Close
                      </Button>
                    </DialogFooter>
                  </div>
                </div>
              )
            })()}
          </DialogContent>
        </Dialog>
      )}
    </Container>
  )
}

export default Templates
