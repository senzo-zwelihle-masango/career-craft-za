import React from "react"
import Link from "next/link"
import { headers } from "next/headers"
import { redirect } from "next/navigation"
import { Container } from "@/components/ui/container"
import { Heading } from "@/components/ui/heading"
import { auth } from "@/lib/auth"
import prisma from "@/lib/prisma/db"
import CurriculumVitaeGrid from "@/components/curriculum-vitae/curriculum-vitae-grid"

const cvInclude = {
  personalDetails: true,
  sections: {
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
    orderBy: { order: "asc" },
  },
} as const

export default async function CurriculumVitaesPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session) {
    redirect("/sign-in")
  }

  const [user, cvs] = await Promise.all([
    prisma.user.findUnique({
      where: { id: session.user.id },
      select: { id: true, plan: true },
    }),
    prisma.curriculumVitae.findMany({
      where: { userId: session.user.id },
      orderBy: { updatedAt: "desc" },
      include: cvInclude,
    }),
  ])

  return (
    <Container
      size={"2xl"}
      alignment={"none"}
      height={"full"}
      padding={"px-xs"}
      gap={"none"}
      flow={"none"}
      bleed={"none"}
      className="my-2 space-y-2"
      id="curriculum-vitaes"
    >
      {/* header */}
      <Heading
        as="h1"
        font="none"
        size="3xl"
        weight="medium"
        tracking="normal"
        leading="none"
        transform="normal"
        italic={false}
        margin={"sm"}
      >
        Manage your CVs.
      </Heading>

      <div className="mb-4 md:mb-6">
        <p className="text-xs text-muted-foreground md:text-sm">
          <Link href="/pricing" className="underline underline-offset-2">
            Upgrade your plan
          </Link>
           to create more.
        </p>
      </div>

      {/* content */}
      <CurriculumVitaeGrid
        cvs={JSON.parse(JSON.stringify(cvs))}
        userId={session.user.id}
        plan={user?.plan || "FREE"}
      />
    </Container>
  )
}
