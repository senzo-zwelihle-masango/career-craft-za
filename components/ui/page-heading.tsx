import type { ReactNode } from "react"
import { cn } from "@/lib/utils"
import { Heading } from "@/components/ui/heading"

interface PageHeadingProps {
  title: string
  subtitle?: ReactNode
  className?: string
}

export function PageHeading({ title, subtitle, className }: PageHeadingProps) {
  return (
    <div className={cn("mb-5", className)}>
      <Heading as="h1" size="4xl" weight="semibold" margin="none">
        {title}
      </Heading>
      {subtitle && (
        <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>
      )}
    </div>
  )
}
