import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import prisma from "@/lib/prisma/db"
import { NextResponse } from "next/server"
import { createElement } from "react"
import { getTemplate } from "@/components/templates"
import type { CvWithRelations } from "@/lib/data/editor/types"

export async function GET(
  _request: Request,
  ctx: { params: Promise<{ cvId: string }> },
) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { cvId } = await ctx.params

  const cv = await prisma.curriculumVitae.findFirst({
    where: { id: cvId, userId: session.user.id },
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

  if (!cv) {
    return NextResponse.json({ error: "Not found" }, { status: 404 })
  }

  const { renderToString } = await import("react-dom/server")
  const Template = getTemplate(cv.templateId)
  const html = renderToString(
    createElement(Template, {
      resume: cv as unknown as CvWithRelations,
    }),
  )

  const title = cv.title.replace(/\s+/g, "_")

  const printAuto = _request.url?.includes("print=1") ?? false

  const fullHtml = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>${cv.title}</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <style>
    @page { margin: 0; size: ${cv.pageFormat === "LETTER" ? "letter" : "A4"}; }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { margin: 0; padding: 0; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
    img { max-width: 100%; height: auto; }
  </style>
  ${printAuto ? `<script>
    document.addEventListener('DOMContentLoaded', function() {
      setTimeout(function() { window.print(); }, 2000);
    });
  </script>` : ""}
</head>
<body>${html}</body>
</html>`

  return new NextResponse(fullHtml, {
    headers: { "Content-Type": "text/html" },
  })
}
