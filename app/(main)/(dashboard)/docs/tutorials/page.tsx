import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  File01Icon,
  File02Icon,
  BriefcaseIcon,
  BrainIcon,
  Palette,
  GridViewIcon,
} from "@hugeicons/core-free-icons"

const tutorials = [
  {
    title: "CV Builder",
    icon: File01Icon,
    items: [
      "Choose a template from the gallery – each one has a unique layout for different industries",
      "Fill in your personal details, work experience, education, skills, and projects",
      "Reorder sections by dragging them, or add custom sections for extra content",
      "Customise the accent colour and font from the Style panel on the right",
      "Switch templates anytime – your content is preserved across layouts",
    ],
  },
  {
    title: "Cover Letters",
    icon: File02Icon,
    items: [
      "Create a cover letter and link it to an existing CV to inherit its styling",
      "Use the split-panel editor to write content on the left and preview on the right",
      "Choose from cover letter templates in the Customize tab",
      "Adjust fonts and accent colours independently from your CV if needed",
    ],
  },
  {
    title: "Application Tracker",
    icon: BriefcaseIcon,
    items: [
      "Add a job by clicking Add Job and filling in the details – status defaults to Wishlist",
      "Switch between Table and Kanban views using the toggle above the list",
      "Click any row or card to open the detail panel with overview, contacts, interviews, timeline, and notes tabs",
      "Log interviews with dates, round names, and interviewer details",
      "Use filters to narrow down by status, employment type, work model, or date range",
    ],
  },
  {
    title: "AI Tools",
    icon: BrainIcon,
    items: [
      "Open any CV and click AI Tools in the top bar to launch the AI panel",
      "Select a tool: Improve Bullet, Generate Summary, Suggest Skills, Grammar Check, or ATS Score",
      "Each request costs 1 AI credit – check your remaining credits in Settings &gt; Limits",
    ],
  },
]

const tips = [
  {
    title: "Keyboard Shortcuts",
    icon: GridViewIcon,
    items: [
      "Use the sidebar to navigate between sections quickly",
      "Drag to reorder sections and items in the CV builder",
    ],
  },
  {
    title: "Design Tips",
    icon: Palette,
    items: [
      "Pick 1-2 accent colours and use them consistently across your CV and cover letter",
      "Preview your document at different zoom levels before exporting",
      "CV and cover letter templates are designed to match – using the same CV across both creates a cohesive application package",
    ],
  },
]

export default function TutorialsPage() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Feature Guides</CardTitle>
          <CardDescription>
            Step-by-step instructions for each feature
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          {tutorials.map((tutorial) => (
            <div key={tutorial.title}>
              <div className="mb-3 flex items-center gap-2">
                <HugeiconsIcon
                  icon={tutorial.icon}
                  className="size-4 text-primary"
                />
                <span className="text-sm font-medium">{tutorial.title}</span>
              </div>
              <ul className="space-y-2">
                {tutorial.items.map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-2 text-sm text-muted-foreground"
                  >
                    <span className="mt-1.5 block size-1 shrink-0 rounded-full bg-muted-foreground/40" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Tips & Tricks</CardTitle>
          <CardDescription>Get the most out of Career Craft</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {tips.map((tip) => (
            <div key={tip.title}>
              <div className="mb-3 flex items-center gap-2">
                <HugeiconsIcon
                  icon={tip.icon}
                  className="size-4 text-primary"
                />
                <span className="text-sm font-medium">{tip.title}</span>
              </div>
              <ul className="space-y-2">
                {tip.items.map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-2 text-sm text-muted-foreground"
                  >
                    <span className="mt-1.5 block size-1 shrink-0 rounded-full bg-muted-foreground/40" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
