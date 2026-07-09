import { Geist_Mono, Manrope } from "next/font/google"

import "./globals.css"
import { metadata } from "@/lib/metadata"
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
          </ThemeProvider>
        </body>
      </html>
    </LenisProvider>
  )
}
