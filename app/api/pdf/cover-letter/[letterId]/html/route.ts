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

    const [createElement, { getCoverLetterTemplate }, { renderToString }] =
      await Promise.all([
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

    const printAuto = _request.url?.includes("print=1") ?? false

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
  ${
    printAuto
      ? `<script>
    window.onload = function() { setTimeout(function() { window.print(); }, 2000); };
  </script>`
      : ""
  }
</head>
<body>
  <div style="font-family:${font};-webkit-print-color-adjust:exact;print-color-adjust:exact">
    ${rawHtml}
  </div>
</body>
</html>`

    return new NextResponse(fullHtml, {
      headers: { "Content-Type": "text/html" },
    })
  } catch {
    return NextResponse.json(
      { error: "Failed to generate cover letter HTML" },
      { status: 500 }
    )
  }
}
