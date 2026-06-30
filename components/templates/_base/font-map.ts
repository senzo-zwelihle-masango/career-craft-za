export const FONT_FAMILY_MAP: Record<
  string,
  { css: string; googleFontsUrl: string }
> = {
  serif: {
    css: '"Merriweather", Georgia, "Times New Roman", serif',
    googleFontsUrl: "https://fonts.googleapis.com/css2?family=Merriweather:wght@400;700&display=swap",
  },
  "sans-serif": {
    css: '"Inter", "Helvetica Neue", Arial, sans-serif',
    googleFontsUrl: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap",
  },
  monospace: {
    css: '"JetBrains Mono", "Consolas", "Courier New", monospace',
    googleFontsUrl: "https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;700&display=swap",
  },
  humanist: {
    css: '"Nunito Sans", system-ui, sans-serif',
    googleFontsUrl: "https://fonts.googleapis.com/css2?family=Nunito+Sans:wght@400;600;700&display=swap",
  },
  modern: {
    css: '"Plus Jakarta Sans", system-ui, sans-serif',
    googleFontsUrl: "https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap",
  },
  slab: {
    css: '"Libre Baskerville", "Georgia", serif',
    googleFontsUrl: "https://fonts.googleapis.com/css2?family=Libre+Baskerville:wght@400;700&display=swap",
  },
}
