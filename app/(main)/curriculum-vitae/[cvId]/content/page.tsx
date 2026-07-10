import React from "react"
import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { redirect, notFound } from "next/navigation"
import { Container } from "@/components/ui/container"
import prisma from "@/lib/prisma/db"
import ContentEditor from "@/components/content/content-editor"

export default async function ContentPage({
  params,
}: {
  params: Promise<{ cvId: string }>
}) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) redirect("/login")

  const { cvId } = await params

  const resume = await prisma.curriculumVitae.findUnique({
    where: { id: cvId },
    include: {
      personalDetails: true,
      sections: {
        orderBy: { order: "asc" },
        include: {
          experienceEntries: { orderBy: { order: "asc" } },
          educationEntries: { orderBy: { order: "asc" } },
          projectEntries: { orderBy: { order: "asc" } },
          skillGroups: { orderBy: { order: "asc" } },
          certificationEntries: { orderBy: { order: "asc" } },
          languageEntries: { orderBy: { order: "asc" } },
          awardEntries: { orderBy: { order: "asc" } },
          referenceEntries: { orderBy: { order: "asc" } },
          customEntries: { orderBy: { order: "asc" } },
        },
      },
    },
  })

  if (!resume || resume.userId !== session.user.id) notFound()
  return (
    <Container
      size={"2xl"}
      alignment={"none"}
      height={"none"}
      padding={"px-xs"}
      gap={"none"}
      flow={"none"}
      bleed={"none"}
      id="content"
    >
      <ContentEditor cv={JSON.parse(JSON.stringify(resume))} />
    </Container>
  )
}
