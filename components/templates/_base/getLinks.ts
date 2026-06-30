export interface LinkItem {
  type: string
  url: string
  label?: string
}

export const linkTypeLabels: Record<string, string> = {
  linkedin: "LinkedIn",
  github: "GitHub",
  website: "Website",
  portfolio: "Portfolio",
  figma: "Figma",
  custom: "Link",
}

export function getLinks(pd: { links?: unknown } | null): LinkItem[] {
  if (!pd?.links) return []
  if (Array.isArray(pd.links)) return pd.links
  try {
    const parsed = typeof pd.links === "string" ? JSON.parse(pd.links) : pd.links
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}
