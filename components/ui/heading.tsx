import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const headingVariants = cva("", {
  variants: {
    as: {
      h1: "",
      h2: "",
      h3: "",
      h4: "",
      h5: "",
      h6: "",
      p: "",
      span: "",
    },
    font: {
      none: "",
      mono: "font-mono",
    },
    size: {
      xs: "text-xs md:text-sm",
      sm: "text-sm md:text-base",
      base: "text-base md:text-lg",
      lg: "text-lg md:text-xl",
      xl: "text-xl md:text-2xl",
      "2xl": "text-2xl md:text-3xl",
      "3xl": "text-3xl md:text-4xl",
      "4xl": "text-4xl md:text-5xl",
      "5xl": "text-5xl md:text-6xl",
      "6xl": "text-6xl md:text-7xl",
      "7xl": "text-[clamp(3rem,8vw,6rem)]",
      "8xl": "text-[clamp(4rem,10vw,8rem)]",
      "9xl": "text-[clamp(5rem,12vw,10rem)]",
      "10xl": "text-[clamp(6rem,14vw,12rem)]",
      "11xl": "text-[clamp(7rem,16vw,14rem)]",
      "12xl": "text-[clamp(8rem,18vw,16rem)]",
    },
    weight: {
      thin: "font-thin",
      extralight: "font-extralight",
      light: "font-light",
      normal: "font-normal",
      medium: "font-medium",
      semibold: "font-semibold",
      bold: "font-bold",
      extrabold: "font-extrabold",
      black: "font-black",
    },
    tracking: {
      tighter: "tracking-tighter",
      tight: "tracking-tight",
      normal: "tracking-normal",
      wide: "tracking-wide",
      wider: "tracking-wider",
      widest: "tracking-widest",
    },
    leading: {
      none: "leading-none",
      tight: "leading-tight",
      snug: "leading-snug",
      normal: "leading-normal",
      relaxed: "leading-relaxed",
      loose: "leading-loose",
    },
    transform: {
      uppercase: "uppercase",
      lowercase: "lowercase",
      capitalize: "capitalize",
      normal: "normal-case",
    },
    italic: {
      true: "italic",
      false: "not-italic",
    },
    margin: { none: "", sm: "mb-3", md: "mb-10", lg: "mb-20" },
  },
  defaultVariants: {
    weight: "normal",
    leading: "tight",
    tracking: "normal",
  },
})

//  Types

type HeadingElement = "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "p" | "span"

export interface HeadingProps
  extends
    Omit<React.HTMLAttributes<HTMLHeadingElement>, "as">,
    VariantProps<typeof headingVariants> {
  as?: HeadingElement
}

//  Component

const Heading = React.forwardRef<HTMLHeadingElement, HeadingProps>(
  (
    {
      as: Tag = "h2",
      className,
      children,
      font,
      size,
      weight,
      tracking,
      leading,
      transform,
      italic,
      margin,
      ...props
    },
    ref
  ) => {
    return (
      <Tag
        ref={ref}
        className={cn(
          headingVariants({
            font,
            size,
            weight,
            tracking,
            leading,
            transform,
            italic,
            margin,
          }),
          className
        )}
        {...props}
      >
        {children}
      </Tag>
    )
  }
)

Heading.displayName = "Heading"

export { Heading, headingVariants }
