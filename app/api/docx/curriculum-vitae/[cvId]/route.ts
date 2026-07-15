import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import prisma from "@/lib/prisma/db"
import { NextResponse } from "next/server"
import { createElement } from "react"
import { getTemplate } from "@/components/curriculum-vitae/templates"
import type { CvWithRelations } from "@/types/curriculum-vitae/types"

export async function GET(
  _request: Request,
  ctx: { params: Promise<{ cvId: string }> }
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
  const rawHtml = renderToString(
    createElement(Template, {
      cv: cv as unknown as CvWithRelations,
    })
  )

  const { FONT_FAMILY_MAP } =
    await import("@/components/curriculum-vitae/templates/_base/font-map")
  const fontFamily =
    FONT_FAMILY_MAP[cv.fontFamily]?.css || cv.fontFamily || "Inter, sans-serif"

  const fs = cv.fontScale || 1
  const fontCss = [
    `.text-\\[10px\\] { font-size: ${(0.625 * fs).toFixed(4)}rem; }`,
    `.text-\\[11px\\] { font-size: ${(0.6875 * fs).toFixed(4)}rem; }`,
    `.text-\\[9px\\] { font-size: ${(0.5625 * fs).toFixed(4)}rem; }`,
    `.text-\\[8px\\] { font-size: ${(0.5 * fs).toFixed(4)}rem; }`,
    `.text-xs { font-size: ${(0.75 * fs).toFixed(4)}rem; }`,
    `.text-sm { font-size: ${(0.875 * fs).toFixed(4)}rem; }`,
    `.text-base { font-size: ${(1 * fs).toFixed(4)}rem; }`,
    `.text-lg { font-size: ${(1.125 * fs).toFixed(4)}rem; }`,
    `.text-xl { font-size: ${(1.25 * fs).toFixed(4)}rem; }`,
    `.text-2xl { font-size: ${(1.5 * fs).toFixed(4)}rem; }`,
    `.text-3xl { font-size: ${(1.875 * fs).toFixed(4)}rem; }`,
    `.cv-print ul { list-style-type: disc; padding-left: 1.5em; }`,
    `.cv-print ol { list-style-type: decimal; padding-left: 1.5em; }`,
    `.cv-print li { display: list-item; }`,
  ].join("\n    ")

  const wordHtml = `<!DOCTYPE html>
<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word" xmlns="http://www.w3.org/TR/REC-html40">
<head>
  <meta charset="utf-8">
  <title>${cv.title}</title>
  <!--[if gte mso 9]>
  <xml>
    <w:WordDocument>
      <w:View>Print</w:View>
      <w:Zoom>100</w:Zoom>
    </w:WordDocument>
  </xml>
  <![endif]-->
  <style>
    body { margin: 0; padding: 0; font-family: ${fontFamily}; }
    ${fontCss}
  </style>
</head>
<body>
  ${rawHtml}
</body>
</html>`

  return new NextResponse(wordHtml, {
    headers: {
      "Content-Type":
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "Content-Disposition": `attachment; filename="${cv.title}.docx"`,
    },
  })
}
