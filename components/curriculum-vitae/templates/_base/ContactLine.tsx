interface ContactLineProps {
  children: React.ReactNode
  href?: string
  className?: string
  style?: React.CSSProperties
}

export function ContactLine({
  children,
  href,
  className,
  style,
}: ContactLineProps) {
  if (href) {
    return (
      <span className={className} style={style}>
        {children}
      </span>
    )
  }
  return (
    <span className={className} style={style}>
      {children}
    </span>
  )
}
