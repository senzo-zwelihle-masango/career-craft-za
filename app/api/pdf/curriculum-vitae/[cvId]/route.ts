import { auth } from "@/lib/auth"
import { headers } from "next/headers"

import { NextResponse } from "next/server"
import { createElement } from "react"
import { getTemplate } from "@/components/templates"
import type { CvWithRelations } from "@/lib/data/editor/types"
import prisma from "@/lib/prisma/db"

export async function GET(
  _request: Request,
  ctx: { params: Promise<{ cvId: string }> },
) {
  try {
    console.time("pdf-gen")

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

    await prisma.curriculumVitae.update({
      where: { id: cvId },
      data: { downloadCount: { increment: 1 } },
    })

    const { chromium } = await import("playwright-core")
    const launchPromise = chromium.launch({
      headless: true,
      args: ["--disable-gpu", "--no-startup-window"],
    })
    const browser = await Promise.race([
      launchPromise,
      new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error("browser launch timed out")), 10000),
      ),
    ])

    const { renderToString } = await import("react-dom/server")
    const Template = getTemplate(cv.templateId)
    const componentHtml = renderToString(
      createElement(Template, {
        cv: cv as unknown as CvWithRelations,
      }),
    )

    const fullHtml = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    @page { margin: 0; size: ${cv.pageFormat === "LETTER" ? "letter" : "A4"}; }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { margin: 0; padding: 0; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
  </style>
</head>
<body>${componentHtml}</body>
</html>`

    const page = await browser.newPage()
    await page.goto(`data:text/html,${encodeURIComponent(fullHtml)}`, {
      waitUntil: "load",
      timeout: 15000,
    })
    const pdfBuffer = await page.pdf({
      format: cv.pageFormat === "LETTER" ? "Letter" : "A4",
      printBackground: true,
      margin: { top: "0", right: "0", bottom: "0", left: "0" },
    })
    await browser.close()

    console.timeEnd("pdf-gen")

    return new NextResponse(new Uint8Array(pdfBuffer), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${cv.title.replace(/\s+/g, "_")}.pdf"`,
      },
    })
  } catch (e) {
    console.error("PDF generation error:", e)
    return NextResponse.json({ error: "PDF generation failed" }, { status: 500 })
  }
}
