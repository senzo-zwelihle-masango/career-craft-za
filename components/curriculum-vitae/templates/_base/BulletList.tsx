interface BulletListProps {
  bullets: string[]
}

export function BulletList({ bullets }: BulletListProps) {
  if (!bullets || bullets.length === 0) return null
  return (
    <ul
      style={{
        margin: "4px 0 0",
        paddingLeft: 18,
        fontSize: "0.875em",
        lineHeight: 1.4,
      }}
    >
      {bullets.map((bullet, i) => (
        <li key={i}>
          <span dangerouslySetInnerHTML={{ __html: bullet }} />
        </li>
      ))}
    </ul>
  )
}
