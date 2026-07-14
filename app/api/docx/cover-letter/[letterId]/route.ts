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

    const font = FONT_MAP[letter.fontFamily] || FONT_MAP.serif
    const accentColor = letter.accentColor || "#1f2937"

    const [createElement, { getCoverLetterTemplate }, { renderToString }] = await Promise.all([
      import("react").then((m) => m.createElement),
      import("@/components/cover-letter/templates/registry"),
      import("react-dom/server"),
    ])
    const Template = getCoverLetterTemplate(letter.templateId)
    const rawHtml = renderToString(
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

    const wordHtml = `<!DOCTYPE html>
<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word" xmlns="http://www.w3.org/TR/REC-html40">
<head>
  <meta charset="utf-8">
  <title>${letter.title}</title>
  <!--[if gte mso 9]>
  <xml>
    <w:WordDocument>
      <w:View>Print</w:View>
      <w:Zoom>100</w:Zoom>
    </w:WordDocument>
  </xml>
  <![endif]-->
  <style>
    body { margin: 0; padding: 0; font-family: ${font}; }
  </style>
</head>
<body>
  ${rawHtml}
</body>
</html>`

    return new NextResponse(wordHtml, {
      headers: {
        "Content-Type": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "Content-Disposition": `attachment; filename="${letter.title}.docx"`,
      },
    })
  } catch {
    return NextResponse.json(
      { error: "Failed to generate DOCX" },
      { status: 500 }
    )
  }
}
