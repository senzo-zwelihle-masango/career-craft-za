import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { NextResponse } from "next/server"
import prisma from "@/lib/prisma/db"

const FONT_MAP: Record<string, string> = {
  serif: "Georgia, 'Times New Roman', serif",
  sans: "'Inter', 'Segoe UI', sans-serif",
  mono: "'Courier New', 'Consolas', monospace",
}

export async function GET(
  _request: Request,
  ctx: { params: Promise<{ letterId: string }> }
) {
  try {
    console.time("cl-pdf-gen")

    const session = await auth.api.getSession({ headers: await headers() })
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { letterId } = await ctx.params

    const letter = await prisma.coverLetter.findFirst({
      where: { id: letterId, userId: session.user.id },
    })

    if (!letter) {
      return NextResponse.json({ error: "Not found" }, { status: 404 })
    }

    const { chromium } = await import("playwright-core")
    const browser = await Promise.race([
      chromium.launch({
        headless: true,
        args: ["--disable-gpu", "--no-startup-window"],
      }),
      new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error("browser launch timed out")), 10000)
      ),
    ])

    const font = FONT_MAP[letter.fontFamily] || FONT_MAP.serif
    const accentColor = letter.accentColor || "#1f2937"

    const [createElement, { getCoverLetterTemplate }, { renderToString }] = await Promise.all([
      import("react").then((m) => m.createElement),
      import("@/components/cover-letter/templates/registry"),
      import("react-dom/server"),
    ])
    const Template = getCoverLetterTemplate(letter.templateId)
    const componentHtml = renderToString(
      createElement(Template, {
        data: {
          fullName: letter.fullName || "",
          professionalTitle: letter.professionalTitle || "",
          email: letter.email || "",
          phone: letter.phone || "",
          location: letter.location || "",
          date: letter.date || "",
          recipientName: letter.recipientName || "",
          companyName: letter.companyName || "",
          body: letter.body || "",
          fontFamily: letter.fontFamily || "serif",
          accentColor,
        },
      })
    )

    const fullHtml = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>${letter.title}</title>
  <script src="https://cdn.tailwindcss.com">
  </script>
  <style>
    @page { margin: 0; size: A4; }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { margin: 0; padding: 0; width: 210mm; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
    img { max-width: 100%; height: auto; }
  </style>
</head>
<body>
  <div style="font-family:${font};-webkit-print-color-adjust:exact;print-color-adjust:exact">
    ${componentHtml}
  </div>
</body>
</html>`

    const page = await browser.newPage()
    await page.goto(`data:text/html,${encodeURIComponent(fullHtml)}`, {
      waitUntil: "load",
      timeout: 15000,
    })
    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true,
      margin: { top: "0", right: "0", bottom: "0", left: "0" },
    })
    await browser.close()

    console.timeEnd("cl-pdf-gen")

    return new NextResponse(new Uint8Array(pdfBuffer), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${letter.title.replace(/\s+/g, "_")}.pdf"`,
      },
    })
  } catch (e) {
    console.error("Cover letter PDF generation error:", e)
    return NextResponse.json(
      { error: "Cover letter PDF generation failed" },
      { status: 500 }
    )
  }
}