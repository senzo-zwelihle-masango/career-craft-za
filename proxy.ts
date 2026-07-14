import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

import { auth } from "@/lib/auth"
import prisma from "@/lib/prisma/db"

const publicRoutes = [
  "/_next",
  "/api/auth",
  "/sign-in",
  "/sign-up",
  "/forgot-password",
  "/reset-password",
  "/unauthorized",
]

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (publicRoutes.some((route) => pathname.startsWith(route)) || pathname === "/") {
    return NextResponse.next()
  }

  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    })

    if (session?.user) {
      const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        select: { banned: true },
      })

      if (user?.banned) {
        return NextResponse.redirect(new URL("/unauthorized?reason=banned", request.url))
      }
    }
  } catch {
    // Let layout-level auth handle redirects
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
}
