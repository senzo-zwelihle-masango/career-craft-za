import * as React from "react"

import { Slot } from "@radix-ui/react-slot"
import { VariantProps, cva } from "class-variance-authority"

import { cn } from "@/lib/utils"

const containerVariants = cva("relative", {
  variants: {
    size: {
      sm: "max-w-[var(--breakpoint-sm)]",
      md: "max-w-[var(--breakpoint-md)]",
      lg: "max-w-[var(--breakpoint-lg)]",
      xl: "max-w-[var(--breakpoint-xl)]",
      "2xl": "max-w-[var(--breakpoint-2xl)]",
      "screen-sm": "max-w-screen-sm",
      "screen-md": "max-w-screen-md",
      "screen-lg": "max-w-screen-lg",
      "screen-xl": "max-w-screen-xl",
      "screen-2xl": "max-w-screen-2xl",
      full: "w-full",
      none: "",
    },
    alignment: {
      none: "",
      "top-left": "flex items-start justify-start text-left",
      "top-center": "flex items-start justify-center text-center",
      "top-right": "flex items-start justify-end text-right",
      "center-left": "flex items-center justify-start text-left",
      center: "flex items-center justify-center text-center",
      "center-right": "flex items-center justify-end text-right",
      "bottom-left": "flex items-end justify-start text-left",
      "bottom-center": "flex items-end justify-center text-center",
      "bottom-right": "flex items-end justify-end text-right",
      "space-between": "flex items-center justify-between",
      "space-around": "flex items-center justify-around",
      stretch: "flex items-stretch justify-center",
    },
    height: {
      none: "",
      auto: "h-auto",
      full: "h-full",
      screen: "min-h-screen",
      "fit-content": "h-fit",
    },
    padding: {
      none: "",
      sm: "p-4 md:p-6 lg:p-8",
      md: "p-6 md:p-8 lg:p-10",
      lg: "p-8 md:p-10 lg:p-12",
      xl: "p-10 md:p-12 lg:p-14",
      "px-xs": "px-2 md:px-4 lg:px-4",
      "px-sm": "px-4 md:px-6 lg:px-6",
      "px-md": "px-6 md:px-8 lg:px-8",
      "px-lg": "px-8 md:px-10 lg:px-12",
      "py-sm": "py-4 md:py-6 lg:py-8",
      "py-md": "py-6 md:py-8 lg:py-10",
      "py-lg": "py-8 md:py-10 lg:py-12",
    },
    gap: {
      none: "gap-0",
      xs: "gap-1",
      sm: "gap-2",
      md: "gap-4",
      lg: "gap-6",
      xl: "gap-8",
    },
    flow: {
      none: "",
      row: "flex-row",
      col: "flex-col",
      "row-wrap": "flex-row flex-wrap",
      "col-wrap": "flex-col flex-wrap",
    },
    bleed: {
      none: "",
      sm: "-mx-2 px-2 md:-mx-4 md:px-4 lg:-mx-6 lg:px-6",
      md: "-mx-4 px-4 md:-mx-6 md:px-6 lg:-mx-8 lg:px-8",
      lg: "-mx-6 px-6 md:-mx-8 md:px-8 lg:-mx-12 lg:px-12",
    },
    centered: {
      true: "mx-auto",
      false: "",
    },
  },
  defaultVariants: {
    size: "xl",
    alignment: "top-left",
    height: "auto",
    padding: "px-md",
    gap: "none",
    flow: "col",
    centered: true,
    bleed: "none",
  },
})

export interface ContainerProps
  extends
    React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof containerVariants> {
  asChild?: boolean
}

const ContainerComponent = React.forwardRef<HTMLDivElement, ContainerProps>(
  (
    {
      className,
      children,
      size,
      alignment,
      height,
      padding,
      gap,
      flow,
      centered,
      bleed,
      asChild,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : "div"
    return (
      <Comp
        className={cn(
          containerVariants({
            size,
            alignment,
            height,
            padding,
            gap,
            flow,
            centered,
            bleed,
          }),
          className
        )}
        ref={ref}
        {...props}
      >
        {children}
      </Comp>
    )
  }
)
ContainerComponent.displayName = "Container"

export interface ContainerInnerProps
  extends
    React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof containerVariants> {
  asChild?: boolean
}

const Inner = React.forwardRef<HTMLDivElement, ContainerInnerProps>(
  (
    {
      className,
      children,
      size,
      alignment,
      height,
      padding,
      gap,
      flow,
      centered,
      bleed,
      asChild,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : "div"
    return (
      <Comp
        className={cn(
          containerVariants({
            size,
            alignment,
            height,
            padding,
            gap,
            flow,
            centered,
            bleed,
          }),
          className
        )}
        ref={ref}
        {...props}
      >
        {children}
      </Comp>
    )
  }
)
Inner.displayName = "Container.Inner"
;(ContainerComponent as any).Inner = Inner

const Container = ContainerComponent as typeof ContainerComponent & {
  Inner: typeof Inner
}

export { Container, containerVariants }
