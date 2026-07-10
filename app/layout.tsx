import { Geist_Mono, Manrope } from "next/font/google"

import "./globals.css"
import { metadata } from "@/lib/metadata"

import { NextSSRPlugin } from "@uploadthing/react/next-ssr-plugin"
import { extractRouterConfig } from "uploadthing/server"
import { ourFileRouter } from "@/app/api/uploadthing/core"


import { ThemeProvider } from "@/components/providers/theme-provider"
import { LenisProvider } from "@/components/providers/lenis-provider"
import { TooltipProvider } from "@/components/ui/tooltip"
import { Toaster } from "@/components/ui/sonner"
import { cn } from "@/lib/utils"

export { metadata }

const manrope = Manrope({ subsets: ["latin"], variable: "--font-sans" })

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <LenisProvider>
      <html
        lang="en"
        suppressHydrationWarning
        className={cn(
          "antialiased selection:bg-primary",
          fontMono.variable,
          "font-sans",
          manrope.variable
        )}
      >
        <body>
          <ThemeProvider>
            <TooltipProvider>{children}</TooltipProvider>
            <Toaster />
              <NextSSRPlugin routerConfig={extractRouterConfig(ourFileRouter)} />
          </ThemeProvider>
        </body>
      </html>
    </LenisProvider>
  )
}
