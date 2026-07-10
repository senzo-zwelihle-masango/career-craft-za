import { auth } from "@/lib/auth"
import prisma from "@/lib/prisma/db"
import { headers } from "next/headers"
import { redirect, notFound } from "next/navigation"
import EditorShell from "@/components/editor/editor-shell"

const cvInclude = {
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
} as const

export default async function CvLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ cvId: string }>
}) {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session) {
    redirect("/sign-in")
  }

  const { cvId } = await params

  const cv = await prisma.curriculumVitae.findUnique({
    where: { id: cvId },
    include: cvInclude,
  })

  if (!cv || cv.userId !== session.user.id) {
    notFound()
  }

  return (
    <EditorShell cv={JSON.parse(JSON.stringify(cv))}>
      <section className="scrollbar-hidden antialiased selection:bg-primary">
        {children}
      </section>
    </EditorShell>
  )
}
